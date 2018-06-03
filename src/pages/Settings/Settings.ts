import { Component } from '@angular/core';

import { NavController, AlertController, ToastController } from 'ionic-angular';
import { MovieService } from "../../app/Utility/movie.service";
import { StorageService } from "../../app/Utility/cache.service";
import { SearchQuery } from "../../app/Models/searchQuery";
import { Discover } from "../Discover/Discover";

@Component({
	selector: 'page-settings',
	templateUrl: 'Settings.html',
	providers: [StorageService, MovieService]
})
export class Settings {

	private settings: SearchQuery = new SearchQuery();
	private maxYear: number = new Date().getFullYear();
	private minYear: number = 1930;
	private yearRange: { upper: number, lower: number } = {lower: this.minYear, upper: this.maxYear};
	private init: boolean = false;

	constructor(
		private _toastCtrl: ToastController, 
		private _navCtrl: NavController, 
		private _checkboxModal: AlertController, 
		private _storage: StorageService, 
		private _movieService: MovieService) {
	}

	public ionViewDidEnter() {
		let settings = this._storage.get("settings");
		this.settings = new SearchQuery(settings);
		this.yearRange.lower = this.settings["release_date.gte"];
		this.yearRange.upper = this.settings["release_date.lte"];	
		this.init = true;
	}

	private trackYear = () => {
		if (this.init) {
			this.settings["release_date.gte"] = this.yearRange.lower;
			this.settings["release_date.lte"] = this.yearRange.upper;
		}
	}

	private saveSettings = () => {
		this._storage.set("currentFilterMaxResults", 0);
		this._storage.set("currentFilterPage", 0);
		this._storage.set("settings", this.settings);
		this._navCtrl.push(Discover);
		let toast = this._toastCtrl.create({
			message: 'Settings saved',
			duration: 1500,
			position: 'top'
		});
  		toast.present();
	}

	private showGenres = () => {

		let checkboxModal = this._checkboxModal.create();
		let genres = this._storage.get("genres");
		checkboxModal.setTitle('Select genres');
		genres.forEach(g => {
			checkboxModal.addInput({
				type: 'checkbox',
				label: g.name,
				value: g.id,
				checked: this.settings.with_genres.indexOf(g.id) > -1 ? true : false
			});
		});
		checkboxModal.addButton('Cancel');
		checkboxModal.addButton({
			text: 'Ok',
			handler: data => {
				this.settings.with_genres = data;
			}
		});
		checkboxModal.present();
	}

}