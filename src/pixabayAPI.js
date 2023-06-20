const API_KEY = "37577511-72bc543c0c5ffeeb68534ea38";
export default class PixabayAPIService {
  constructor() {
    this.page = 1;
    this.searchValue = "";
  }

  async getImg() {
    const url = `https://pixabay.com/api/?key=${API_KEY}&q=${this.searchValue}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`;

    const res = await axios.get(url);
    this.incrementPage();
    return res.data;

  }

  setSearchValue(query) {
    this.searchValue = query;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}