export class SearchQuery {
	public "release_date.gte": number = 1930;
	public "release_date.lte": number = new Date().getFullYear();
	public "vote_average.gte": number = 1;
	public include_adult: boolean = false;
	public with_genres: number[] = [];
	constructor(setting?: SearchQuery) {
		if (setting) {
			this["release_date.gte"] = setting["release_date.gte"];
			this["release_date.lte"] = setting["release_date.lte"];
			this["vote_average.gte"] = setting["vote_average.gte"];
			this.include_adult = setting.include_adult;
			this.with_genres = setting.with_genres;
		}
	}
}