import GameManager from "./modules/gameManager.js";

const submitButton = document.getElementById("submit-btn");
const guessInput = document.getElementById("input");

window.onload = async function () {
    const gameManager = new GameManager(3);
    await gameManager.startGame();

    // Add ability to submit guess
    submitButton.addEventListener("click", () => {
        const firstGuessElement = document.querySelector(".guess");
        const trackName = gameManager.player.track.title;
        const trackCoverUrl = gameManager.player.track.album.cover;

        // If the guess is valid
        if (gameManager.verifyGuess(guessInput.value, trackName)) {
            gameManager.handleCorrectGuess(
                firstGuessElement,
                trackName,
                trackCoverUrl
            );
        } else {
            // Check if firstGuessElement exists so that it doesn't interfere with other logic
            if (firstGuessElement) {
                gameManager.handleIncorrectGuess(firstGuessElement);
            }
        }
    });

    // Navigate suggestions with arrow keys
    document.addEventListener("keydown", (event) => {
        let len = gameManager.trackMatcher.numRelevantTracks();
        gameManager.suggestionNavigator.navigateSuggestions(event, len);
    });

    // Show suggestions based on what the user types into the input box
    guessInput.addEventListener("input", () => {
        // Unfocus the suggestions by resetting the index to its default
        gameManager.suggestionNavigator.currentSuggestionIndex = -1;

        gameManager.trackMatcher.relevantTracks = gameManager.trackMatcher.getRelevantTracks(
            guessInput.value
        );

        // Show suggestions to the user
        gameManager.songSuggestions.showSuggestions(gameManager.trackMatcher.relevantTracks);
    });

    // Check if the user presses enter while focused on the input box, and verify guess
    guessInput.addEventListener("keydown", () => {
        if (event.key === "Enter") {
            const firstGuessElement = document.querySelector(".guess");
            const trackName = gameManager.player.track.title;
            const trackCoverUrl = gameManager.player.track.album.cover;

            // If the guess is valid
            if (gameManager.verifyGuess(guessInput.value, trackName)) {
                gameManager.handleCorrectGuess(
                    firstGuessElement,
                    trackName,
                    trackCoverUrl
                );
            } else {
                // Check if firstGuessElement exists so that it doesn't interfere with other logic
                if (firstGuessElement) {
                    gameManager.handleIncorrectGuess(firstGuessElement);
                }
            }
        }
    });
    // TODO: Restart without reloading page
    // Restart button
    document.getElementById("restart-btn").addEventListener("click", () => {
        gameManager.startGame();
    });
};
