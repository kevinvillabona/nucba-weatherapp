
const form = document.getElementById('form');
const input = document.querySelector('.search-input');
const cardContainer = document.querySelector('.card-container');
const msg = document.querySelector('.msg');

// Guardamos el array de las ciudades
let cities = JSON.parse(localStorage.getItem('cities')) || [];

// Funcion para guardar en el localstorage
const saveLocalStorage = citiesList => {
  localStorage.setItem('cities', JSON.stringify(citiesList));
};

const convertirTemp = x => {
  let temp = Math.round(x - 273.15);
  return temp;
};

// Funcion para renderizar HTML
const renderCity = city => {
  const img_name = city.weather[0].icon;
  return `
    <div class="card-clima animate ${img_name.slice(2)}-bg">
            <i class="fa-solid fa-x close" data-id="${city.id}"></i>
            <h2 class="info-title">${city.name}, ${city.sys.country}</h2>
            <div class="clima-info">
              
              <p class="info-subtitle">${city.weather[0].description}</p>
              <div class="info-temp">
                <span class="temp">${convertirTemp(city.main.temp)}°
                </span>
                <span class="st">ST ${convertirTemp(
                  city.main.feels_like
                )}°</span>
              </div>
            </div>
            <div class="clima-img">
              <img src="./assets/img/${img_name}.png" alt="" />
            </div>
            <div class="clima-temp">
              <div class="clima-max-min">
                <span class="clima-max"
                  ><i class="fa-solid fa-arrow-up-long"></i>Max: ${convertirTemp(
                    city.main.temp_max
                  )}</span
                >
                <span class="clima-min"
                  ><i class="fa-solid fa-arrow-down-long"></i>Min: ${convertirTemp(
                    city.main.temp_min
                  )}</span
                >
              </div>
              <span class="clima-humedad">${city.main.humidity}% Humedad</span>
            </div>
          </div>`;
};

// Map para renderizar
const renderCitiesList = citiesList => {
  cardContainer.innerHTML = citiesList.map(city => renderCity(city)).join('');
};

// Buscar
const searchCity = async e => {
  e.preventDefault();
  const searchedCity = input.value.trim();
  if (searchedCity === '') {
    alert('Por favor ingrese una ciudad válida');
    return;
  }
  const fetchedCity = await requestCity(searchedCity);
  if (!fetchedCity.id) {
    alert('La ciudad ingresada no existe');
    form.reset();
    return;
  } else if (cities.some(city => city.id === fetchedCity.id)) {
    alert('Ya estamos mostrando el clima de esa ciudad');
    form.reset();
    return;
  }
  cities = [fetchedCity, ...cities];
  renderCitiesList(cities);
  saveLocalStorage(cities);
  hideMsg(cities);
  form.reset();
};

// Funcion para ocultar el "Ingrese una ciudad" 
const hideMsg = citiesList => {
  if (citiesList.length !== 0) {
    msg.classList.add('hidden');
    return;
  }
  msg.classList.remove('hidden');
};

// Funcion para eliminar una card
const removeCity = e => {
  if (!e.target.classList.contains('close')) return;
  const filterId = Number(e.target.dataset.id);

  if (window.confirm('¿Eliminar la ciudad seleccionada ?')) {
    cities = cities.filter(city => city.id !== filterId);
    renderCitiesList(cities);
    saveLocalStorage(cities);
    hideMsg(cities);
  }
};

// Funcion General 
const init = () => {
  renderCitiesList(cities);
  hideMsg(cities);
  form.addEventListener('submit', searchCity);
  cardContainer.addEventListener('click', removeCity);
};

init();
