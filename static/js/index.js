import ArtistPlayer from "./modules/artistPlayer.js";
import SuggestionRenderer from "./modules/suggestions/suggestionRenderer.js";
import SuggestionNavigator from "./modules/suggestions/suggestionNavigator.js";
import TrackMatcher from "./modules/suggestions/trackMatcher.js";

const submitButton = document.getElementById("submit-guess");
const guessInput = document.getElementById("input");

window.onload = async function () {
    const player = new ArtistPlayer();
    await player.setTrack();

    const suggestionNavigator = new SuggestionNavigator();
    const trackMatcher = new TrackMatcher(player.tracklist);
    const songSuggestions = new SuggestionRenderer(player.artist);

    submitButton.addEventListener("click", () => {
        verifyGuess(player);
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
            verifyGuess(player);
        }
    });
};

function verifyGuess(player) {
    const guess = guessInput.value.toLowerCase();
    const trackName = player.track.title;
    const success = document.getElementById("success-message");

    if (guess === trackName.toLowerCase()) {
        const trackCaption = document.getElementById("track-name");
        const trackImage = document.getElementById("artist-image");

        trackCaption.textContent = trackName;
        trackImage.src = track.album.cover;
        success.textContent = "Correct!";
        success.className = "correct";
    } else {
        success.textContent = "Incorrect...";
        success.className = "incorrect";
    }
}
