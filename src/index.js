'use strict';

import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('form#search-form');
const gallery = document.querySelector('div.gallery');
const moreBtn = document.querySelector('button.load-more');

let page = 1;
const limitPerPage = 40;
let searchValue = '';

const params = new URLSearchParams({
  key: '32245226-f27b1af2cde9216d3910bfcd8',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  per_page: limitPerPage,
});

const clearGallery = () => {
  gallery.innerHTML = '';
};

const buildGallery = arr => {
  arr.forEach(el => {
    const markup = `<div class="photo-card">
      <a href="${el.largeImageURL}">
      <img src="${el.webformatURL}" alt="${el.tags}" loading="lazy" />
      </a>
      <div class="info">
      <p class="info-item">
      <b>Likes</b> ${el.likes} 
      </p>
      <p class="info-item">
      <b>Views</b> ${el.views}
      </p>
      <p class="info-item">
      <b>Comments</b> ${el.comments}
      </p>
      <p class="info-item">
      <b>Downloads</b> ${el.downloads}
      </p>
      </div>
      </div>`;
    gallery.innerHTML += markup;
    lightbox.refresh();
  });
};

const disableBtn = () => {
  moreBtn.classList.add('hidden');
};
const enableBtn = () => {
  moreBtn.classList.remove('hidden');
};

const fetchImg = async search => {
  const response = await axios.get(
    `https://pixabay.com/api/?${params}&q=${search}&page=${page}`
  );
  return response.data;
};

const searchImg = event => {
  page = 1;
  event.preventDefault();
  searchValue = event.target[0].value;
  clearGallery();
  fetchImg(searchValue)
    .then(arr => {
      if (arr.hits.length === 0) {
        disableBtn();
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        Notify.success(`Hooray! We found ${arr.totalHits} images.`);
        buildGallery(arr.hits);
        page++;
        enableBtn();
        console.log(page);
      }
    })

    .catch(error => Notify.failure(error.response.data));
};

const loadMore = () => {
  fetchImg(searchValue)
    .then(arr => {
      buildGallery(arr.hits);
      if ((page - 1) * limitPerPage > arr.totalHits) {
        Notify.info(
          `We're sorry, but you've reached the end of search results.`
        );
        disableBtn();
      }
      page++;
    })
    .catch(error => Notify.failure(error.response.data));
};

window.addEventListener('load', disableBtn);
searchForm.addEventListener('submit', searchImg);
moreBtn.addEventListener('click', loadMore);

let lightbox = new SimpleLightbox('.photo-card a', {
  captionsData: 'alt',
  captionDelay: 250,
  showCounter: false,
});
