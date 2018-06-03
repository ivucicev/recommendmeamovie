export class Movie {
	public id: number = null;
	public poster_path: string = "";
	public backdrop_path: string = "";
	public title: string = "";
	public overview: string = "";
	public genre_ids: number[] = [];
	public vote_average: number = 5;
	public genres: string[] = [];
	public release_date: any = "";
	constructor(movie?: Movie) {
		if (movie) {
			this.id = movie.id;
			this.poster_path = movie.poster_path;
			this.backdrop_path = movie.backdrop_path;
			this.title = movie.title;
			this.overview = movie.overview;
			this.genre_ids = movie.genre_ids;
			this.vote_average = movie.vote_average;
			this.genres = movie.genres;
			this.release_date = new Date(movie.release_date).getFullYear();
		}
	}
}