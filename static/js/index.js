import GameManager from "./modules/gameManager.js";

const submitButton = document.getElementById("submit-btn");
const playPauseBtn = document.getElementById("play-track");
const lives = 3;

window.onload = async function () {
    let genres = await getGenres();

    genres.forEach((genre) => {
        addDropdown(genre);
    });

    // const gameManager = new GameManager();
    // await gameManager.startGame(lives);

    // playPauseBtn.addEventListener("click", () => {
    //     gameManager.player.playPauseTrack();
    // });

    // // Handle guess when submit button is clicked
    // submitButton.addEventListener("click", () => {
    //     gameManager.handleGuess(getGuess());
    // });

    // // Restart game when restart button is clicked
    // document.getElementById("restart-btn").addEventListener("click", () => {
    //     gameManager.startGame(lives);
    // });
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
    });

    li.appendChild(btn);
    dropdownMenu.appendChild(li);
}
