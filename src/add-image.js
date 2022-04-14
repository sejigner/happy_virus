import gameMap from "../src/riverSunShore.jpg";
("use strict");

function addImage() {
  const img = document.createElement("img");
    (img.alt = "game map"), (img.src = gameMap), (img.style.width='100%'), (img.style.height = '100%'), (img.style.objectFit = "cover");

  const map = document.getElementById("game-map");
  map.appendChild(img);
}

export default addImage;
