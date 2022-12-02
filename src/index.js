import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const inputField = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

inputField.addEventListener('input', debounce(onSearchCountry, DEBOUNCE_DELAY));

function onSearchCountry(event) {
  const nameSearch = event.target.value.trim();
  if (!nameSearch) {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
    return;
  }
  fetchCountries(nameSearch)
    .then(countries => {
      if (countries.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.',
          {
            timeout: 1000,
          }
        );
        return;
      }
      if (countries.length >= 2) {
        createMarkupCountryList(countries);
        return;
      }
      createMarkupCountryInfo(countries);
      return;
    })
    .catch(() =>
      Notify.failure('Oops, there is no country with that name', {
        timeout: 1000,
      })
    );
}
function createMarkupCountryList(countries) {
  const markupList = countries
    .map(
      ({ flags, name }) => `<li class="country-list__item">
  <img src="${flags.svg}" alt="${name.official}" width="30" height="30">
  <p class="countru-list__name">${name.official}</p>
</li>`
    )
    .join('');

  countryList.innerHTML = markupList;
  countryInfo.innerHTML = '';
}

function createMarkupCountryInfo(countries) {
  const infoMarkup = countries
    .map(
      ({ flags, name, capital, population, languages }) =>
        `<h2 class="title-info">
        <img src="${flags.svg}" alt="${
          name.official
        }" width="30" height="30" />${name.official}
      </h2>
       <ul class="list-info">
          <li class="list-info__item">
            <p><strong>Capital:</strong> ${capital}</p>
         </li>
        <li>
          <p><strong>Population:</strong> ${population}</p>
        </li>
        <li>
  <p><strong>Languages:</strong> ${Object.values(languages).join(', ')}</p>
       </li>
    </ul>`
    )
    .join('');

  countryInfo.innerHTML = infoMarkup;
  countryList.innerHTML = '';
}
