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
        handleGuess(gameManager);
    });

    // Navigate suggestions with arrow keys
    document.addEventListener("keydown", (event) => {
        let len = gameManager.suggestionManager.suggestionMatcher.numRelevantSuggestions();
        gameManager.suggestionManager.suggestionNavigator.navigateSuggestions(event, len);
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
        gameManager.suggestionManager.suggestionNavigator.currentSuggestionIndex = -1;

        gameManager.suggestionManager.suggestionMatcher.relevantSuggestions =
            gameManager.suggestionManager.suggestionMatcher.getRelevantSuggestions(guess);

        // If there are no relevant tracks, don't show suggestions
        if (gameManager.suggestionManager.suggestionMatcher.numRelevantSuggestions() === 0) {
            gameManager.suggestionManager.suggestionRenderer.hideSuggestions();
            return;
        }

        // Show suggestions to the user
        gameManager.suggestionManager.suggestionRenderer.showSuggestions(
            gameManager.suggestionManager.suggestionMatcher.relevantSuggestions,
            gameManager.suggestionManager.suggestionNavigator,
            gameManager.player.artist
        );
    });

    guessInput.addEventListener("keydown", () => {
        // Handle guess when enter is pressed on input box
        if (event.key === "Enter") {
            handleGuess(gameManager);
        }
        // Unfocus input box when escape is pressed
        else if (event.key === "Escape") {
            guessInput.blur();
        }
    });

    guessInput.addEventListener("focus", () => {
        gameManager.suggestionManager.suggestionRenderer.showSuggestions(
            gameManager.suggestionManager.suggestionMatcher.relevantSuggestions,
            gameManager.suggestionManager.suggestionNavigator,
            gameManager.player.artist
        );
    });

    // Restart game when restart button is clicked
    document.getElementById("restart-btn").addEventListener("click", () => {
        gameManager.startGame(lives);
    });
};

/** Handle the guess differently depending on whether it is correct or
 * incorrect using the hnadlceCorrectGuess() and handleIncorrectGuess()
 * functions within the GameManager object. */
function handleGuess(gameManager) {
    const firstGuessElement = document.querySelector(".guess");
    const track = gameManager.player.track;
    const guess = getGuess();

    if (guess === "") {
        return;
    }

    // If the guess is valid
    if (gameManager.verifyGuess(guess, track)) {
        gameManager.handleCorrectGuess(firstGuessElement, track);
    } else {
        gameManager.handleIncorrectGuess(firstGuessElement);
    }
}

function getGuess() {
    return guessInput.value.trim();
}

async function getGenres() {
    let data = await fetch("http://localhost:8080/genres");
    let genres = await data.json();
    return genres.data;
}
