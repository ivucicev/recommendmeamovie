import { Component } from '@angular/core';
import { NavController, } from 'ionic-angular';
import { Observable } from "rxjs/Observable";
import { Http, Response } from '@angular/http';
import { OnInit } from '@angular/core';
import { MovieService } from "../../app/Utility/movie.service";
import { StorageService } from "../../app/Utility/cache.service";
import { Platform, NavParams, ViewController, AlertController, ToastController, PopoverController } from 'ionic-angular';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Movie } from "../../app/Models/movie";
import { SearchQuery } from "../../app/Models/searchQuery";

@Component({
	selector: 'page-discover',
	templateUrl: 'Discover.html',
	providers: [MovieService, StorageService]
})
export class Discover implements OnInit {

	private readonly YOUTUBE_URL: string = "http://youtube.com/watch?v=";

	public showImageLoader: boolean = false;

	private movie: Movie = new Movie();
	private movies: Movie[] = [];
	private genres: Array<{ id: number, name: string }> = []
	private loader = null;
	private posterPath: string = "";

	private item: number = 1;

	constructor(
		private _toastCtrl: ToastController, 
		private _movieService: MovieService, 
		private _storage: StorageService) {
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
		let trailer = trailersRes.results.find(t => t.type === 'Trailer');
		if (trailer)
			window.open(`${this.YOUTUBE_URL}${trailer.key}`);
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