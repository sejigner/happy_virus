import gameMap from "../src/world-map.svg";
("use strict");

export function addMap() {
  const img = document.createElement("img");
  (img.alt = "game map"),
    (img.src = gameMap),
    (img.style.width = "100%"),
    (img.style.height = "100%"),
    (img.style.objectFit = "cover");

  const mapContainer = document.getElementById("map-img");
  mapContainer.appendChild(img);
}

export function divideMap() {
  const mapGrid = document.getElementById("map-grid");

  // for (let i = 0; i < 32; i++) {
  //   const horizontal = ((i % 8) + 1);
  //   const vertical = (Math.floor(i / 8) + 1);
  //   const element = document.createElement("div")
  //   element.className = "grid-item";
  //   element.id = vertical + ',' + horizontal
  //   element.innerHTML = element.id
  //   // element.style./
  //   console.log(element.id);
  //   mapGrid.appendChild(element);
  // }

  for (let i = 0; i < 72; i++) {
    const horizontal = (i % 12) + 1;
    const vertical = Math.floor(i / 12) + 1;
    const element = document.createElement("div");
    element.className = "grid-item";
    element.id = vertical + "," + horizontal;
    element.innerHTML = element.id;
    // element.style./
    console.log(element.id);
    mapGrid.appendChild(element);
  }
}

// export default addMap; divideMap;
