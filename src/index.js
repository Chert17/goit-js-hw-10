import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
  inputEl: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.inputEl.addEventListener(
  'input',
  debounce(onSearchCountry, DEBOUNCE_DELAY)
);

function onSearchCountry(e) {
  const inputValue = e.target.value.trim();
  if (!inputValue) {
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
    return;
  }
  fetchCountries(inputValue)
    .then(countries => {
      console.log(countries);

      if (countries.length > 10) {
        refs.countryList.innerHTML = '';
        refs.countryInfo.innerHTML = '';
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.',
          {
            timeout: 1000,
            showOnlyTheLastOne: true,
          }
        );
        return;
      }

      if (countries.length >= 2) {
        refs.countryList.innerHTML = renderCountryList(countries);
        refs.countryInfo.innerHTML = '';
        return;
      }

      refs.countryInfo.innerHTML = renderCountryInfo(countries);
      refs.countryList.innerHTML = '';
    })
    .catch(() =>
      Notiflix.Notify.failure('Oops, there is no country with that name', {
        timeout: 1000,
        showOnlyTheLastOne: true,
      })
    );
}

function renderCountryList(countries) {
  return countries
    .map(
      ({ name, flags }) =>
        `<li class="country-list__item">
  <img src="${flags.svg}" alt="${name.official}" width="30" height="30">
  <p class="countru-list__name">${name.official}</p>
</li>`
    )
    .join('');
}

function renderCountryInfo(countries) {
  return countries
    .map(
      ({ name, flags, capital, population, languages }) =>
        `<h2 class="title-info">
  <img
    src="${flags.svg}"
    alt="${name.official}"
    width="30"
    height="30"
  />${name.official}
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
}
