import ArtistPlayer from "./modules/artistPlayer.js";
import SuggestionRenderer from "./modules/suggestions/suggestionRenderer.js";
import SuggestionNavigator from "./modules/suggestions/suggestionNavigator.js";
import TrackMatcher from "./modules/suggestions/trackMatcher.js";
import GameManager from "./modules/gameManager.js";

const submitButton = document.getElementById("submit-guess");
const guessInput = document.getElementById("input");

window.onload = async function () {
    const player = new ArtistPlayer();
    await player.setTrack();

    const suggestionNavigator = new SuggestionNavigator();
    const trackMatcher = new TrackMatcher(player.tracklist);
    const songSuggestions = new SuggestionRenderer(player.artist);

    const gameManager = new GameManager();

    submitButton.addEventListener("click", () => {
        gameManager.verifyGuess(guessInput.value.toLowerCase());
    });

    document.addEventListener("keydown", (event) => {
        let len = trackMatcher.numRelevantTracks();
        suggestionNavigator.navigateSuggestions(event, len);
    });

    guessInput.addEventListener("input", () => {
        // Unfocus the suggestions by resetting the index to its default
        suggestionNavigator.currentSuggestionIndex = -1;

        trackMatcher.relevantTracks = trackMatcher.getRelevantTracks(
            guessInput.value.toLowerCase()
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

            if (gameManager.verifyGuess(guessInput.value.toLowerCase(), trackName)) {
                gameManager.handleCorrectGuess(firstGuessElement, trackName, trackCoverUrl);
            } else {
                gameManager.handleIncorrectGuess(firstGuessElement);
            }
        }
    });
};

