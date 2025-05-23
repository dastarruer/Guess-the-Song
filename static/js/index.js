import GameManager from "./modules/gameManager.js";

const lives = 3;
const submitGenreButton = document.getElementById("submit-genre");
const banner = document.getElementById("banner");
let chosenGenre = null;

window.onload = async function () {
    const gameManager = new GameManager();
    let genres = await getGenres();

    genres.forEach((genre) => {
        addDropdown(genre);
    });

    submitGenreButton.addEventListener("click", async () => {
        if (chosenGenre === null) {
            return;
        }

        gameManager.showGameElements(lives, chosenGenre);
        await gameManager.startGame(lives, chosenGenre);
    });

    banner.addEventListener("click", () => {
        gameManager.showSearchElements();
    });
};

async function getGenres() {
    let data = await fetch("http://localhost:8080/genres");
    let genres = await data.json();
    return genres.data;
}

function addDropdown(genre) {
    const dropdownMenu = document
        .getElementById("genre-dropdown")
        .querySelector(".dropdown-menu");

    const li = document.createElement("li");
    const btn = document.createElement("a");

    btn.className = "dropdown-item";
    btn.textContent = genre;
    btn.type = "button";
    btn.innerHTML =
        btn.innerHTML = `<img src="${genre.picture_big}" alt="${genre.name}" style="margin-right: 8px;" class="suggestion-cover"> <p>${genre.name}</p>`;

    btn.addEventListener("click", () => {
        document
            .getElementById("genre-dropdown")
            .querySelector("#dropdownMenuLink").innerHTML = genre.name;
        chosenGenre = genre;
    });

    li.appendChild(btn);
    dropdownMenu.appendChild(li);
}
