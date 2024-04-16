let map;
let layerGroup;
let currentPositionLayer;
let currentPosition;
const spinner = document.querySelector(".spinner-border");
const mapContainer = document.querySelector("#map");
let redIcon = L.icon({
  iconUrl: "./public/assets/img/marker.png",
  iconSize: [38, 48],
  shadowSize: [50, 64],
  iconAnchor: [22, 49],
  shadowAnchor: [4, 62],
  popupAnchor: [-3, -76],
});

// API - Producteurs
const getResults = async (latitude, longitude, keyName) => {
  const response = await fetch(
    `https://opendata.agencebio.org/api/gouv/operateurs/?q=graines&activite=Production&lat=${latitude}&lng=${longitude}&nb=100`
  );
  const datas = await response.json();

  let localData = {
    lat: latitude.toFixed(2),
    long: longitude.toFixed(2),
    datas: datas,
  };
  localStorage.setItem(keyName, JSON.stringify(localData));
  getGeoMarkers(datas);
};

//Détermination de la géolocalisation de l'utilisateur et chargement de la carte
const findUserGeo = () => {
  const status = document.querySelector("#status");

  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    status.textContent = "";

    map = L.map("map").setView([latitude, longitude], 13);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    currentPositionLayer = L.layerGroup().addTo(map);
    currentPosition = L.marker([latitude, longitude], {
      icon: redIcon,
    }).addTo(currentPositionLayer);
    spinner.classList.add("loading-position");
    mapContainer.classList.add("opacity-50");
    verifyLocalStorage(latitude, longitude, "userGeo");
  }

  function error() {
    status.textContent = "Impossible de récupérer votre position";
  }

  if (!navigator.geolocation) {
    status.textContent =
      "La géolocalisation n'est pas supportée par votre navigateur";
  } else {
    status.textContent = "Localisation…";
    navigator.geolocation.getCurrentPosition(success, error);
  }
};

// Ajouter des marqueurs sur la carte
const getGeoMarkers = (datas) => {
  layerGroup = L.layerGroup().addTo(map);
  let producers = datas.items;
  producers.forEach((producer) => {
    let lat = producer.adressesOperateurs[0].lat;
    let long = producer.adressesOperateurs[0].long;
    let adress = producer.adressesOperateurs[0].lieu;
    let city = producer.adressesOperateurs[0].ville;
    let postalCode = producer.adressesOperateurs[0].codePostal;
    let marker = L.marker([lat, long]).addTo(layerGroup);
    mapContainer.classList.remove("opacity-50");
    spinner.classList.remove("loading-position");
    if (producer.siteWebs.length != 0) {
      marker.bindPopup(
        `<b>${producer.denominationcourante}</b><br>${adress}<br>${city} ${postalCode}<br>Site:<a href="${producer.siteWebs[0].url}">Lien</a>`
      );
    } else {
      marker.bindPopup(
        `<b>${producer.denominationcourante}</b><br>${adress}<br>${city} ${postalCode}`
      );
    }
  });
  map.on("click", onMapClick);
};

// Vérification du stockage local et sauvegarde des données
const verifyLocalStorage = (latitude, longitude, keyName) => {
  if (localStorage.getItem(keyName) !== null) {
    let userDataFromStorage = JSON.parse(localStorage.getItem(keyName));
    console.log(latitude, longitude);
    if (
      userDataFromStorage.lat != latitude.toFixed(2) ||
      userDataFromStorage.long != longitude.toFixed(2)
    ) {
      getResults(latitude, longitude, keyName);
    } else {
      getGeoMarkers(userDataFromStorage.datas);
    }
  } else {
    spinner.classList.add("loading-position");
    mapContainer.classList.add("opacity-50");
    getResults(latitude, longitude, keyName);
  }
};

function onMapClick(e) {
  let lat = e.latlng.lat;
  let long = e.latlng.lng;
  console.log(lat, long);
  currentPositionLayer.clearLayers();
  layerGroup.clearLayers();
  addChosenPosition(lat, long);
}

const addChosenPosition = (latitude, longitude) => {
  currentPositionLayer = L.layerGroup().addTo(map);
  currentPosition = L.marker([latitude, longitude], {
    icon: redIcon,
  }).addTo(currentPositionLayer);
  localStorage.removeItem("userChosenGeo");
  verifyLocalStorage(latitude, longitude, "userChosenGeo");
};

document.addEventListener("DOMContentLoaded", findUserGeo);