import './css/styles.css';
import { fetchCountries } from "./fetchCountries.js";
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';


let country;

const refs = {
    serchCountry: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
};
const DEBOUNCE_DELAY = 300;

refs.serchCountry.addEventListener("input", debounce(onInputSearch, DEBOUNCE_DELAY));

function clearData() {
    refs.countryInfo.innerHTML = '';
    refs.countryList.innerHTML = '';
};

function onInputSearch(e) {
    const inputValue = e.target.value.trim();

    if (inputValue === " ") {
        clearData();
        return
    }

    fetchCountries(inputValue).then(countries => {
        if (countries.length > 10) {
            clearData();
            Notiflix.Notify.failure('Too many matches found. Please enter a more specific name.');
            return;
        } else if (countries.length === 1) {
            clearData();
            renderCountry(countries[0]);
            return;
        } renderCountries(countries);
    }).catch((error) => {
        clearData();
        return Notiflix.Notify.failure("Oops, there is no country with that name");
    });

    function renderCountry(country) {
        console.log(country);

        const countryMarkup = `
        <div class = "info">
        <img src = "${country.flags.svg}" alt = Flag of"${country.name}" class="flag"><h1>${country.name.official}</h1> 
    </div>
        <p>Capital: ${country.capital}</p>
        <p>Population: ${country.population}</p>
        <p>Languages: ${Object.values(country.languages).join(',')}</p>`;

        refs.countryInfo.innerHTML = countryMarkup;
    };

    function renderCountries(countries) {
        clearData();
        const markup = countries.map((country) => {
            return `<li>
        <img
         src = "${country.flags.svg}"
          alt = Flag of"${country.name.official}"
          />
        <span>${country.name.official}</span>
        </li>`

        }).join("");
        refs.countryList.innerHTML = markup;
    };






};
