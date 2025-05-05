import GameManager from "./modules/gameManager.js";
import GenreSuggestionManager from "./modules/suggestions/genres/genreSuggestionManager.js";

const submitButton = document.getElementById("submit-btn");
const playPauseBtn = document.getElementById("play-track");
const lives = 3;

window.onload = async function () {
    let genres = await getGenres();
    console.log(genres);

    const genreSuggestionManager = new GenreSuggestionManager(genres)

    const gameManager = new GameManager();
    await gameManager.startGame(lives);

    playPauseBtn.addEventListener("click", () => {
        gameManager.player.playPauseTrack();
    });

    // Handle guess when submit button is clicked
    submitButton.addEventListener("click", () => {
        gameManager.handleGuess(getGuess());
    });

    // Navigate suggestions with arrow keys
    document.addEventListener("keydown", (event) => {
        gameManager.suggestionManager.navigateSuggestions(event);
    });

    // Restart game when restart button is clicked
    document.getElementById("restart-btn").addEventListener("click", () => {
        gameManager.startGame(lives);
    });
};

async function getGenres() {
    let data = await fetch("http://localhost:8080/genres");
    let genres = await data.json();
    return genres.data;
}


