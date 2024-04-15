//Récuperatuion de data
const getResults = async (latitude, longitude) => {
  const response = await fetch(
    `https://opendata.agencebio.org/api/gouv/operateurs/?q=graines&activite=Production&lat=${latitude}&lng=${longitude}&nb=100`
  );
  const datas = await response.json();
  getGeo(datas, latitude, longitude);
};

const findUserGeo = () => {
  const status = document.querySelector("#status");

  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    status.textContent = "";
    getResults(latitude, longitude);
    // mapLocalisation(latitude, longitude);
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

const getGeo = (datas, latitude, longitude) => {
  let map = L.map("map").setView([latitude, longitude], 13);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  let producers = datas.items;
  console.log(producers);
  producers.forEach((producer) => {
    let lat = producer.adressesOperateurs[0].lat;
    let long = producer.adressesOperateurs[0].long;
    let adress = producer.adressesOperateurs[0].lieu;
    let city = producer.adressesOperateurs[0].ville;
    let postalCode = producer.adressesOperateurs[0].codePostal;
    let marker = L.marker([lat, long]).addTo(map);
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
};

document.addEventListener("DOMContentLoaded", findUserGeo);
