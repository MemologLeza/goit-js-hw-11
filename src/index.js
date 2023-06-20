import Notiflix from 'notiflix';
import "notiflix/dist/notiflix-3.2.6.min.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import PixabayAPIService from './pixabayAPI';
import LoadMoreBtn from './components/LoadMoreBtn';
const refs = {
    form: document.querySelector(".search-form"),
    gallery: document.querySelector(".gallery"),
    }
const ImageAPIService = new PixabayAPIService();
const loadMoreBtn = new LoadMoreBtn({
    selector: ".load-more",
    isHidden: true,
})

refs.form.addEventListener("submit", onSubmit);
loadMoreBtn.button.addEventListener("click", fetchArticles);

async function fetchArticles() {
  loadMoreBtn.disable();

  try {
    const markup = await generateArticlesMarkup();
    if (markup === undefined) throw new Error("No data");
    appendNewToList(markup);
  } catch (err) {
      onError(err);
      console.log(err);
  }
  loadMoreBtn.enable();
}

function onSubmit(event) {
  event.preventDefault();
  const inputValue = refs.form.elements.searchQuery.value.trim();

  if (inputValue === "") {
    Notiflix.Notify.failure("Empty query!");
    return;
  }
  clearList();
 ImageAPIService.setSearchValue(inputValue);
  loadMoreBtn.show();
  ImageAPIService.resetPage();

  fetchArticles()
    .catch(onError)
    .finally(() => refs.form.reset());
}

async function generateArticlesMarkup() {
  try {
    const { hits, totalHits } = await ImageAPIService.getImg();
      const nextPage = ImageAPIService.page;
    const maxPage = Math.ceil(totalHits / 40);
    if (nextPage > maxPage) {
      loadMoreBtn.hide();
    }

    if (hits.length <40) Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");

    return hits.reduce(
      (markup, currentImg) => markup + createMarkup(currentImg),
      ""
    );
  } catch (err) {
    onError(err);
  }
}

function createMarkup({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) {
  return `
<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" class="img" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b><br> ${likes}
    </p>
    <p class="info-item">
      <b>Views</b><br> ${views}
    </p>
    <p class="info-item">
      <b>Comments</b><br> ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b><br> ${downloads}
    </p>
  </div>
</div>
`;
}

function appendNewToList(markup) {
  refs.gallery.insertAdjacentHTML("beforeend", markup);
}

function clearList() {
  refs.gallery.innerHTML = "";
}

function onError(err) {
  console.error(err);
  
    if (err.message === "No data") {
        clearList();
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    };
    loadMoreBtn.hide();
}