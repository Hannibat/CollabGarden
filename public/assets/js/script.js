const getResults = async (url) => {
  const response = await fetch(url);
  const datas = await response.json();
  console.log(datas);
  //   return datas;
};

const init = async () => {
  await getResults(
    "https://opendata.agencebio.org/api/gouv/operateurs/?activite=Production&produit=graines"
  );
};

document.addEventListener("DOMContentLoaded", init);
var map = L.map("map").setView([51.505, -0.09], 13);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);
