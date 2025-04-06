import ArtistPlayer from "./modules/artistPlayer.js";
import SuggestionRenderer from "./modules/suggestions/suggestionRenderer.js";
import SuggestionNavigator from "./modules/suggestions/suggestionNavigator.js";
import TrackMatcher from "./modules/suggestions/trackMatcher.js";
import GameManager from "./modules/gameManager.js";

const submitButton = document.getElementById("submit-btn");
const guessInput = document.getElementById("input");

window.onload = async function () {
    const player = new ArtistPlayer();
    await player.setTrack();

    const suggestionNavigator = new SuggestionNavigator();
    const trackMatcher = new TrackMatcher(player.tracklist);
    const songSuggestions = new SuggestionRenderer(player.artist);

    const gameManager = new GameManager(3);

    // Add ability to submit guess
    submitButton.addEventListener("click", () => {
        const firstGuessElement = document.querySelector(".guess");
        const trackName = player.track.title;
        const trackCoverUrl = player.track.album.cover;

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
        let len = trackMatcher.numRelevantTracks();
        suggestionNavigator.navigateSuggestions(event, len);
    });

    // Show suggestions based on what the user types into the input box
    guessInput.addEventListener("input", () => {
        // Unfocus the suggestions by resetting the index to its default
        suggestionNavigator.currentSuggestionIndex = -1;

        trackMatcher.relevantTracks = trackMatcher.getRelevantTracks(
            guessInput.value
        );

        // Show suggestions to the user
        songSuggestions.showSuggestions(trackMatcher.relevantTracks);
    });

    // Check if the user presses enter while focused on the input box, and verify guess
    guessInput.addEventListener("keydown", () => {
        if (event.key === "Enter") {
            const firstGuessElement = document.querySelector(".guess");
            const trackName = player.track.title;
            const trackCoverUrl = player.track.album.cover;

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
        gameManager.restartGame();
    });
};
