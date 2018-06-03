import { Injectable } from "@angular/core";
import { LoadingController } from "ionic-angular";
import { Http, Response } from '@angular/http';
import { StorageService } from "./cache.service";
import { SearchQuery } from "../Models/searchQuery";
import { Movie } from "../Models/movie";

@Injectable()
export class MovieService {

	private readonly API_KEY: string = "2f4d74f2bff8e9639c9b1ac627cecca7";
	private readonly API_URL: string = "https://api.themoviedb.org/3/";
	private readonly POSTER_PATH_HIGH_QUALITY: string = "https://image.tmdb.org/t/p/w500/";
	private readonly POSTER_PATH_MEDIUM_QUALITY: string = "https://image.tmdb.org/t/p/w300/";
	private readonly POSTER_PATH_LOW_QUALITY: string = "https://image.tmdb.org/t/p/w200/";

	private loader = null;
	private _storage: StorageService = new StorageService();

	constructor(private _http: Http, private _loadingCtrl: LoadingController) {
		this.loader = this._loadingCtrl.create({
			content: 'Loading...'
		});
	}

	public getMoviePosterPath = () => this.POSTER_PATH_MEDIUM_QUALITY;
	public getMoviePosterPath_low = () => this.POSTER_PATH_LOW_QUALITY;

	private buildSearchUri = (page: number): string => {
		let uri = "";
		const settings: SearchQuery = this._storage.get("settings");
		for (let prop in settings) {
			if (settings.hasOwnProperty(prop)) {
				uri += `&${prop}=${settings[prop]}`;
			}
		
		}
		let randomYear = Math.floor(Math.random()*(2018-2000) + 2000); 
		if (settings != null) {
			randomYear = Math.floor(Math.random()*(settings["release_date.lte"] - settings["release_date.gte"]) + settings["release_date.gte"]); 
		}
		uri += `&sort_by=${this.generateSort()}`;
		uri += `&page=${page}`;
		// uri += `&year=${randomYear}`;
		return uri;
	}

	private generateSort = () => {
		let sort = ["popularity.asc", "popularity.desc", "release_date.asc", "release_date.desc", "revenue.asc", "revenue.desc", "primary_release_date.asc", "primary_release_date.desc", "original_title.asc", "original_title.desc", "vote_average.asc", "vote_average.desc", "vote_count.asc", "vote_count.desc"];
		let rand = Math.floor((Math.random()*sort.length + 1) -1);
		return sort[rand];
	}

	public getMovies(cb, refresher?): Promise<any> {
		let max = this._storage.get("currentFilterMaxResults");
		let page = 1
		if (max) {
			page = Math.floor(Math.random()*(max - 1) + 1)
		}
		let searchParams = this.buildSearchUri(page);
		return this._http.get(`${this.API_URL}discover/movie?api_key=${this.API_KEY}&language=en-US${searchParams}`)
			.toPromise()	
			.then(cb, refresher ? refresher.complete() : undefined)		
			.catch(this.handleError);
	}

	public getGenres(cb): Promise<any> {
		return this._http.get(`${this.API_URL}genre/movie/list?api_key=${this.API_KEY}&language=en-US`)
			.toPromise()
			.then(cb)		
			.catch(this.handleError)
	}

	public getTrailers(id: number, cb): Promise<any> {
		return this._http.get(`${this.API_URL}movie/${id}/videos?api_key=${this.API_KEY}&language=en-US`)
			.toPromise()
			.then(cb)		
			.catch(this.handleError);
	}

	public getMovieDetails(id, cb) {
		return this._http.get(`${this.API_URL}movie/${id}?api_key=${this.API_KEY}&language=en-US`)
			.toPromise()
			.then(cb)		
			.catch(this.handleError);
	}

	private handleError(error: Response | any) {
	}

}