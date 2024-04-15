const getResults = async (url) => {
  const response = await fetch(url);
  const datas = await response.json();
  addMapMarkers(datas);
};

const init = async () => {
  await getResults(
    "https://opendata.agencebio.org/api/gouv/operateurs/?activite=production&produit=graines"
  );
};

const findUserGeo = () => {
  const status = document.querySelector("#status");

  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    status.textContent = "";
    mapLocalisation(latitude, longitude);
  }

  function error() {
    status.textContent = "Unable to retrieve your location";
  }

  if (!navigator.geolocation) {
    status.textContent = "Geolocation is not supported by your browser";
  } else {
    status.textContent = "Locating…";
    navigator.geolocation.getCurrentPosition(success, error);
  }
};

// Map
const mapLocalisation = (latitude, longitude) => {
  let map = L.map("map").setView([latitude, longitude], 13);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
};

const addMapMarkers = (datas) => {
  console.log(datas);
  //   producers.forEach((item) => {
  //     console.log(item.adresseOperateur);
  //   });
};

document.addEventListener("DOMContentLoaded", init);
document.addEventListener("DOMContentLoaded", findUserGeo);
