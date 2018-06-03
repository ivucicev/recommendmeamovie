import { Component } from '@angular/core';
import { ModalController, } from 'ionic-angular';
import { Response } from '@angular/http';
import { OnInit } from '@angular/core';
import { MovieService } from "../../app/Utility/movie.service";
import { StorageService } from "../../app/Utility/cache.service";
import { Platform, NavParams, ViewController, AlertController, ToastController } from 'ionic-angular';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Movie } from "../../app/Models/movie";
import { DomSanitizer } from '@angular/platform-browser';

@Component({
	selector: 'page-discover',
	templateUrl: 'Discover.html',
	providers: [MovieService, StorageService]
})
export class Discover implements OnInit {

	private readonly YOUTUBE_URL: string = "https://www.youtube.com/embed/";

	public showImageLoader: boolean = false;

	private movies: Movie[] = [];
	private genres: Array<{ id: number, name: string }> = []
	private posterPath: string = "";

	private item: number = 1;

	constructor(
		private _toastCtrl: ToastController,
		private _movieService: MovieService,
		private _storage: StorageService,
		private _modal: ModalController,
		private _alertService: AlertController) {
	}

	public nextMovie = () => {
		if (this.item >= 19) {
			this.item = 1;
			this.getMovies();
			return;
		}
		this.item++;
	}

	public addToWatchlist = (movie: Movie) => {
		let watchlist = this._storage.get("watchlist") || [];
		watchlist.push(movie);
		this._storage.set("watchlist", watchlist);
		let toast = this._toastCtrl.create({
			message: 'Movie added to watchlist',
			duration: 1500,
			position: 'top'
		});
		toast.present();
		this.nextMovie();
	}

	public setPosterPath = () => {
		this.posterPath = this._movieService.getMoviePosterPath();
	}

	public ngOnInit(): void {
		this.getGenres();
		this.setPosterPath();
	}

	public readMore(movie: Movie) {
		this._movieService.getMovieDetails(movie.id, this.handleMovieDetails);
	}

	private handleMovieDetails(res: Response) {
		// console.log(res);
	}

	private getMovies(refresher?): void {
		this._movieService.getMovies(this.handleMovies, refresher);
	}

	private getGenres(): void {
		this._movieService.getGenres(this.handleGenres);
	}

	private getTrailers(id: number): void {
		this._movieService.getTrailers(id, this.handleTrailers);
	}

	private handleTrailers = (res: Response): void => {
		let trailersRes: any = res.json();
		if (!trailersRes || !trailersRes.results || trailersRes.results.length == 0) {
			const alert = this._alertService.create({
				title: 'Sorry!',
				subTitle: 'No trailers found!',
				buttons: ['OK']
			});
			alert.present();
		}
		let trailer = trailersRes.results.find(t => t.type === 'Trailer');
		if (trailer) {
			const modal = this._modal.create(ModalContentPage, {url: `${this.YOUTUBE_URL}${trailer.key}`});
			modal.present();
		}
	}

	private handleGenres = (res: Response): void => {
		let genresRes: any = res.json();
		this.genres = genresRes.genres;
		this._storage.set("genres", this.genres);
		this.getMovies();
	}

	private handleMovies = (res: Response): void => {
		let moviesRes: any = res.json();
		this.movies = [];
		this._storage.set("currentFilterMaxResults", moviesRes.total_pages > 1000 ? 1000 : moviesRes.total_pages);
		moviesRes.results.forEach(m => {
			let genres = [];
			m.genre_ids.forEach(gid => {
				let current = this.genres.find(g => g.id === gid);
				if (current)
					genres.push(current.name);
			});
			m.genres = genres;
			this.movies.push(new Movie(m))
		});
	}

}

@Component({
	template: `
  <ion-header>
	<ion-toolbar>
	  <ion-buttons start>
		<button ion-button (click)="dismiss()">
		  <span ion-text color="primary" showWhen="ios">Cancel</span>
		  <ion-icon name="md-close" showWhen="android, windows"></ion-icon>
		</button>
	  </ion-buttons>
	</ion-toolbar>
  </ion-header>
  <ion-content>
	<iframe width="100%" height="100%" [src]="getSafeUrl(ytUrl)" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
  </ion-content>
  `
})
export class ModalContentPage {

	public ytUrl: any;

	constructor(
		public platform: Platform,
		public params: NavParams,
		public viewCtrl: ViewController,
		public domSan: DomSanitizer
	) {
		this.ytUrl = this.params.get('url')
	}

	getSafeUrl(url) {
		return this.domSan.bypassSecurityTrustResourceUrl(url)
	}

	dismiss() {
		this.viewCtrl.dismiss();
	}
}

