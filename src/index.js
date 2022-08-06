import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch() {
  const countryName = input.value.trim();

  if (countryName === 'null') {
    countryInfo.innerHTML = '';
    countryList.innerHTML = '';
    return;
  }

  fetchCountries(countryName).then(country => inputCheck(country));
}

function inputCheck(country) {
  countryInfo.innerHTML = '';
  countryList.innerHTML = '';

  if (country?.length > 10) {
    return Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (country?.length >= 2 && country?.length <= 10) {
    return renderCountries(country);
  } else if (country?.length === 1) {
    return insertCountryInfo(country[0]);
  } else Notiflix.Notify.failure('Oops, there is no country with that name');
}

function insertCountryInfo({
  name: { official },
  capital,
  population,
  flags: { svg },
  languages,
}) {
  const choosenCountry = `<h1 class="country-title"><img width="40" height="30" alt="flag" src="${svg}"> ${official}</h1>
        <p class="country-text"><b>Capital: </b> ${capital}</p>
        <p class="country-text"><b>Population: </b> ${population}</p>
        <p class="country-text"><b>Languages: </b> ${Object.values(
          languages
        ).join(',')}</p>
  `;
  countryInfo.insertAdjacentHTML('beforeend', choosenCountry);

  const countryTitle = document.querySelector('.country-title');
  countryTitle.style.display = 'flex';
  countryTitle.style.alignItems = 'center';
  countryTitle.firstChild.style.marginRight = '10px';
}

function renderCountries(country) {
  const itemList = country
    .map(({ name: { official }, flags: { svg } }) => {
      return `<li class="country-item"><img width="40" height="30" alt="flag" src="${svg}"> ${official}</li>`;
    })
    .join('');
  countryList.insertAdjacentHTML('beforeend', itemList);

  const list = document.querySelectorAll('.country-item');

  countryList.style.listStyle = 'none';
  countryList.style.padding = '0';

  list.forEach(el => {
    el.style.fontSize = '20px';
  });
  list.forEach(el => {
    el.style.display = 'flex';
  });
  list.forEach(el => {
    el.style.alignItems = 'center';
  });
  list.forEach(el => {
    el.style.marginTop = '10px';
  });
  list.forEach(el => {
    el.firstChild.style.marginRight = '10px';
  });
}
