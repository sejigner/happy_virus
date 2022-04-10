import gameMap from "../src/riverSunShore.jpg";
'use strict'

function addImage() {
    const img = document.createElement("img");
    (img.alt = "game map"), (img.src = gameMap);

    const body = document.querySelector('body');
    body.appendChild(img);
}

export default addImage;
