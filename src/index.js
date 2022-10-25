import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'notiflix/dist/notiflix-3.2.5.min.css';
import { getCountryListMarkUp } from './markup/list-markup';
import { getCountryMarkUp } from './markup/country-markup';

const inputRef = document.querySelector('#search-box');
const DEBOUNCE_DELAY = 300;
const countryListRef = document.querySelector('.country-list');
const countryInfoRef = document.querySelector('.country-info');

inputRef.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

async function onInputChange(e) {
  const value = e.target.value.toLowerCase().trim();

  if (value === '') return;

  let data = null;
  try {
    data = await fetchCountry(value);
  } catch (e) {
    Notify.failure(e.message);
    data = [];
    return;
  }

  if (data.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
    return;
  }
  if (data.length === 1) {
    Notify.success('1');
    updateContent(countryInfoRef, getCountryMarkUp(data[0]));
    return;
  }

  Notify.success('Other');
  updateContent(countryListRef, getCountryListMarkUp(data));
}

function updateContent(el, markup) {
  removeChildren(countryListRef);
  removeChildren(countryInfoRef);
  el.insertAdjacentHTML('beforeend', markup);
}

function fetchCountry(value) {
  const URL = 'https://restcountries.com/v3.1/name';
  return fetch(
    `${URL}/${value}?fields=capital,name,population,flags,languages`
  ).then(res => {
    if (!res.ok) {
      throw new Error('Oops, there is no country with that name');
      return;
    }
    return res.json();
  });
}
function removeChildren(el) {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
}
