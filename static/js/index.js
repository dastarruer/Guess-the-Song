import SuggestionProvider from "./modules/suggestionProvider.js";
import ArtistPlayer from "./modules/artistPlayer.js";
import TrackMatcher from "./modules/trackMatcher.js";
import SuggestionNavigator from "./modules/suggestionNavigator.js";

const submitButton = document.getElementById("submit-guess");
const guessInput = document.getElementById("input");

window.onload = async function () {
    const player = new ArtistPlayer();
    await player.setTrack();

    const suggestionNavigator = new SuggestionNavigator();
    const trackMatcher = new TrackMatcher(player.tracklist);
    const songSuggestions = new SuggestionProvider(
        player.artist,
    );

    submitButton.addEventListener("click", () => {
        verifyGuess(player);
    });

    document.addEventListener("keydown", () => {
        let len;
        if (songSuggestions.relevantTracks === null) {
            len = 0;
        } else {
            len = trackMatcher.relevantTracks.length;
        }
        suggestionNavigator.navigateSuggestions(event, len);
    });

    guessInput.addEventListener("input", () => {
        // Unfocus the suggestions by resetting the index to its default
        suggestionNavigator.currentSuggestionIndex = -1;

        trackMatcher.getRelevantTracks(guessInput.value.toLowerCase());

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

    if (guess === trackName.toLowerCase()) {
        const trackCaption = document.getElementById("track-name");
        const trackImage = document.getElementById("artist-image");

        trackCaption.textContent = trackName;
        trackImage.src = track.album.cover;
    } else {
        console.log("incorrect");
    }
}
