import GameManager from "./modules/gameManager.js";

const submitButton = document.getElementById("submit-btn");
const guessInput = document.getElementById("input");
const lives = 3;

window.onload = async function () {
    const gameManager = new GameManager();
    await gameManager.startGame(lives);

    // Handle guess when submit button is clicked
    submitButton.addEventListener("click", () => {
        handleGuess(gameManager);
    });

    // Navigate suggestions with arrow keys
    document.addEventListener("keydown", (event) => {
        let len = gameManager.trackMatcher.numRelevantTracks();
        gameManager.suggestionNavigator.navigateSuggestions(event, len);
    });

    // Show suggestions based on what the user types into the input box
    guessInput.addEventListener("input", () => {
        if (gameManager.livesLeft <= 1) {
            return;
        }

        const guess = getGuess();

        if (guess === "") {
            gameManager.suggestionRenderer.hideSuggestions();
            return;
        }

        // Unfocus the suggestions by resetting the index to its default
        gameManager.suggestionNavigator.currentSuggestionIndex = -1;

        gameManager.trackMatcher.relevantTracks =
            gameManager.trackMatcher.getRelevantTracks(guess);

        // Show suggestions to the user
        gameManager.suggestionRenderer.showSuggestions(
            gameManager.trackMatcher.relevantTracks
        );
    });

    // Handle guess when enter is pressed on input box
    guessInput.addEventListener("keydown", () => {
        if (event.key === "Enter") {
            handleGuess(gameManager);
        }
    });

    guessInput.addEventListener("blur", () => {
        gameManager.suggestionRenderer.hideSuggestions();
    });

    guessInput.addEventListener("focus", () => {
        gameManager.suggestionRenderer.showSuggestions(
            gameManager.trackMatcher.relevantTracks
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
    const trackName = gameManager.player.track.title;
    const trackCoverUrl = gameManager.player.track.album.cover;
    const guess = getGuess();

    if (guess === "") {
        return;
    }

    // If the guess is valid
    if (gameManager.verifyGuess(guess, trackName)) {
        gameManager.handleCorrectGuess(
            firstGuessElement,
            trackName,
            trackCoverUrl
        );
    } else {
        gameManager.handleIncorrectGuess(firstGuessElement);
    }
}

function getGuess() {
    return guessInput.value.trim();
}
