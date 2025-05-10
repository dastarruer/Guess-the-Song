import GameManager from "./modules/gameManager.js";
import GenreSuggestionManager from "./modules/suggestions/genres/genreSuggestionManager.js";

const submitButton = document.getElementById("submit-btn");
const playPauseBtn = document.getElementById("play-track");
const lives = 3;

window.onload = async function () {
    let genres = await getGenres();
    console.log(genres);

    const genreSuggestionManager = new GenreSuggestionManager(genres);
    const input = document.getElementById("search-input");

    // Show suggestions based on what the user types into the input box
    input.addEventListener("input", () => {
        // Show suggestions to the user
        genreSuggestionManager.showSuggestions(input.value);
    });

    input.addEventListener("keydown", () => {
        // Handle guess when enter is pressed on input box
        if (event.key === "Enter") {
            return;
        }
        // Unfocus input box when escape is pressed
        else if (event.key === "Escape") {
            input.blur();
        }
    });

    document.addEventListener("keydown", (event) => {
        let numSuggestions = genreSuggestionManager.suggestionMatcher.numRelevantSuggestions();
        genreSuggestionManager.suggestionNavigator.navigateSuggestions(event, numSuggestions);
    });

    input.addEventListener("focus", () => {
        // Show suggestions to the user
        console.log(input.value);
        genreSuggestionManager.showSuggestions(input.value);
    });

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
