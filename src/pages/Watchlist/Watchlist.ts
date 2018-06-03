import { Component, OnInit } from '@angular/core';

import { NavController, ToastController, AlertController } from 'ionic-angular';
import { MovieService } from "../../app/Utility/movie.service";
import { StorageService } from "../../app/Utility/cache.service";
import { Movie } from "../../app/Models/movie";

@Component({
	selector: 'page-watchlist',
	templateUrl: 'Watchlist.html',
	providers: [MovieService, StorageService]
})
export class Watchlist implements OnInit {

	private posterPath: string;
	private movies: Movie[] = [];

	constructor(
		private _navCtrl: NavController,
		private _toastCtrl: ToastController,
		private _movieService: MovieService,
		private _storage: StorageService,
		private _alertCtrl: AlertController) {
	}

	public ngOnInit(): void {
		this.setPosterPath();
		this.loadMovies();
	}

	private setPosterPath = () => {
		this.posterPath = this._movieService.getMoviePosterPath_low();
	}

	private loadMovies = () => {
		let movies: Movie[] = this._storage.get("watchlist");
		this.movies = movies;
	}

	private removeMovieFromWatchList(movie: Movie) {
		const index = this.movies.findIndex(m => m.id == movie.id);
		this.movies.splice(index, 1);
	}

	public watched(movie: Movie) {
		const confirm = this._alertCtrl.create({
			title: 'Watched this movie?',
			message: 'If you have watched it, movie \"' + movie.title + '\" will be removed from the list...',
			buttons: [
				{
					text: 'No, keep it',
					handler: () => {
						//do nothing
					}
				},
				{
					text: 'Yes, remove it',
					handler: () => {
						this.removeMovieFromWatchList(movie);
					}
				}
			]
		});
		confirm.present();
	}

}
