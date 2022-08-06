import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const textInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

textInput.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch() {
  const countryName = textInput.value.trim();

  if (countryName === '') {
    countryInfo.innerHTML = '';
    countryList.innerHTML = '';
    return;
  }

  fetchCountries(countryName).then(data => inputCheck(data));
}

function inputCheck(data) {
  countryInfo.innerHTML = '';
  countryList.innerHTML = '';

  if (data?.length === 1) {
    return insertCountryInfo(data[0]);
  } else if (data?.length >= 2 && data.length <= 10) {
    return renderCountries(data);
  } else if (data?.length > 10) {
    return Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else Notiflix.Notify.failure('Oops, there is no country with that name');
}

function insertCountryInfo({
  name: { official },
  capital,
  population,
  flags: { svg },
  languages,
}) {
  const choosenCountry = `<h2 class="country-title"><img width="40" alt="flag" src="${svg} "/>${official}</h2>
        <p class="country-text">Capital: ${capital}</p>
        <p class="country-text">Population: ${population}</p>
        <p class="country-text">Languages: ${Object.values(languages).join(
          ','
        )}</p>
  `;
  countryInfo.insertAdjacentHTML('beforeend', choosenCountry);
}

function renderCountries(data) {
  const itemList = data
    .map(({ name: { official }, flags: { svg } }) => {
      return `<li class="list-item"><img width="40" alt="flag" src="${svg} "/>${official}</li>`;
    })
    .join('');
  countryList.insertAdjacentHTML('beforeend', itemList);
}
