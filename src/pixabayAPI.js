const API_KEY = "37577511-72bc543c0c5ffeeb68534ea38";
export default class PixabayAPIService {
  constructor() {
    this.page = 1;
    this.searchValue = "";
  }

  /*
  1. async - оголошує асинхронну ф-цію, а в свою чергу асинхронна ф-ція ЗАВЖДИ повертає проміс
  2. await не можна використовувати за межами асинхронної ф-ції
  3. await заморожує виконання асинхронної фукції до тих пір поки проміс не перейде у стан Fullfilled або Rejected
  4. await повертає дані з промісу, а не сам проміс
  5. async/await потрібні для того щоб зробити імітацію синхронності всередині асинхронного коду
  */

  async getImg() {
    const url = `https://pixabay.com/api/?key=${API_KEY}&q=${this.searchValue}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`;

    const res = await axios.get(url);
    this.incrementPage();
    return res.data;

    // return axios.get(url).then((res) => {
    //   this.incrementPage();
    //   return res.data;
    // });

    // axios
    // return axios.get(url).then((res) => {
    //   this.incrementPage();
    //   return res.data;
    // });

    // fetch
    // return fetch(url)
    //   .then((res) => res.json())
    //   .then((data) => {
    //     this.incrementPage();
    //     return data;
    //   });
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