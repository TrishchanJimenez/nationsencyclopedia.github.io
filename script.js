const main = document.getElementById('main');
const infopage = document.getElementById('country-information');

const results = document.getElementById('results');
const filterSelect = document.getElementById('filter-region');
const searchBar = document.getElementById('search-input');

const backButton = document.getElementById('back');

const flagSecond = document.getElementById('information-flag');
const countryName = document.getElementById('country-name');
const nativeName = document.getElementById('native-name');
const population = document.getElementById('country-population');
const region = document.getElementById('country-region');
const subregion = document.getElementById('sub-region');
const capital = document.getElementById('country-capital');
const topDomain = document.getElementById('top-domain');
const currency = document.getElementById('currencies');
const language = document.getElementById('languages');
const borderCountries = document.getElementById('border-countries');

const backTop = document.getElementById('back-to-top');

const countryCodes = {};

const fetchData = async() => {
    try {
        const res = await fetch("./data.json");
        const data = await res.json();
        showCountryCards(data)
    } catch (err) {
        console.log(err.message);
    }   
}

fetchData();

const showCountryCards = (data) => {
    results.innerHTML = data.map((country) => updateCountryCards(country)).join('');
    const countries = [...document.getElementsByClassName('country-card')];
    filterSelect.addEventListener('change', () => {
        countries.forEach((country) => country.classList.remove('hidden'));
        if (filterSelect.value !== "all") {
            countries.filter((country) => country.children[3].innerText.toLowerCase().replace('region: ', '') !== filterSelect.value).forEach((element) => element.classList.add('hidden'));;
        }
    });
    searchBar.addEventListener('keyup', (e) => {
        countries.forEach((country) => country.classList.remove('hidden'));
        if(searchBar.value !== '' || searchBar.value !== null) {
            countries.filter((country) => !(country.children[1].innerText.toLowerCase().includes(searchBar.value.toLowerCase()))).forEach((element) => element.classList.add('hidden'));;
        }
    })
    data.forEach((country) => {
        countryCodes[country.alpha3Code] = country.name;
    })
    results.addEventListener('click', (e) => {
        console.log(e.target);
        if(e.target.classList.contains('country-card')) {
            showCountryInformation(e.target.id, data);
        } else if (e.target.parentNode.classList.contains('country-card')) {
            showCountryInformation(e.target.parentNode.id, data);
        }
    })
}

const updateCountryCards = (country) => {
    const {
        name,
        flag,
        population,
        region,
        capital
    } = country;
    return `
        <div class="country-card" id="${name}">
            <img src="${flag}" alt="" class="flag" loading="lazy">
            <p class="country-name">${name}</p>
            <p class="population"><b>Population:</b> ${population.toLocaleString("en-us")}</p>
            <p class="region"><b>Region:</b> ${region}</p>
            <p class="capital"><b>Capital:</b> ${capital}</p>
        </div>
        `;
}

const showCountryInformation = (id, data) => {
    sessionStorage.setItem("scrollPosition", window.scrollY);
    window.scrollTo(0, 0);
    const clickedCountry = data.filter((country) => country.name === id)[0];
    main.style.display = 'none';
    infopage.style.display = 'block';
    flagSecond.src = clickedCountry.flag;
    countryName.innerText = clickedCountry.name;
    nativeName.innerText = clickedCountry.nativeName;
    population.innerText = clickedCountry.population.toLocaleString("en-us");
    region.innerText = clickedCountry.region;
    subregion.innerText = clickedCountry.subregion;
    capital.innerText = clickedCountry.capital;
    topDomain.innerText = clickedCountry.topLevelDomain;
    currency.innerText = clickedCountry.currencies.map((currency) => currency.code).join(', ');;
    language.innerText = clickedCountry.languages.map((language) => language.name).join(', ');
    borderCountries.innerHTML = clickedCountry.borders.map((border) => {
        return `<span class="border-country">${countryCodes[border]}</span>`
    }).join('');

    document.getElementById('back').addEventListener('click', () => {
        main.style.display = 'block';
        infopage.style.display = 'none';
        window.scrollTo(0, sessionStorage.getItem("scrollPosition"));
    });
}