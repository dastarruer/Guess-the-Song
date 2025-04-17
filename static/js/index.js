import GameManager from "./modules/gameManager.js";

const submitButton = document.getElementById("submit-btn");
const guessInput = document.getElementById("input");
const playPauseBtn = document.getElementById("play-track");
const lives = 3;

window.onload = async function () {
    let genres = await getGenres();
    console.log(genres);

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

    // Show suggestions based on what the user types into the input box
    guessInput.addEventListener("input", () => {
        if (gameManager.livesLeft <= 1) {
            return;
        }

        const guess = getGuess();

        if (guess === "") {
            gameManager.suggestionManager.suggestionRenderer.hideSuggestions();
            return;
        }

        // Unfocus the suggestions by resetting the index to its default
        gameManager.suggestionManager.suggestionNavigator.currentSuggestionIndex =
            -1;

        gameManager.suggestionManager.updateRelevantSuggestions(guess);

        // If there are no relevant tracks, don't show suggestions
        if (
            gameManager.suggestionManager.suggestionMatcher.numRelevantSuggestions() ===
            0
        ) {
            gameManager.suggestionManager.suggestionRenderer.hideSuggestions();
            return;
        }

        // Show suggestions to the user
        gameManager.suggestionManager.showSuggestions(
            gameManager.player
        );
    });

    guessInput.addEventListener("keydown", () => {
        // Handle guess when enter is pressed on input box
        if (event.key === "Enter") {
            gameManager.handleGuess(getGuess());
        }
        // Unfocus input box when escape is pressed
        else if (event.key === "Escape") {
            guessInput.blur();
        }
    });

    guessInput.addEventListener("focus", () => {
        // Show suggestions to the user
        gameManager.suggestionManager.showSuggestions(gameManager.player);
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

function getGuess() {
    return guessInput.value.trim();
}
