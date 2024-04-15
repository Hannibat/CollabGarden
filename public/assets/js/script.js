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
