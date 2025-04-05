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
            const firstGuessElement = document.querySelector(".guess");
            const trackName = player.track.title;

            if (verifyGuess(guessInput.value.toLowerCase(), trackName)) {
                handleCorrectGuess(firstGuessElement, trackName);
            } else {
                handleIncorrectGuess(firstGuessElement);
            }
        }
    });
};

function handleIncorrectGuess(firstGuessElement) {
    firstGuessElement.className = "incorrect-guess";
}

/**Handles logic if user guesses correctly.
 * Will firstly show a checkmark to indicate that the user has correctly guessed.
 * Then, the function will reveal the track name and album to the user.
 */
function handleCorrectGuess(firstGuessElement, trackName) {
    const checkIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
                    <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"/>
                </svg>`;

    // Show a green check to indicate that the user made a correct guess
    firstGuessElement.className = "correct-guess";
    firstGuessElement.innerHTML = checkIcon;

    revealTrack(trackName);
}

/** Show the user the track name and album cover of the song. */
function revealTrack(trackName) {
    const trackNameElement = document.getElementById("track-name");
    const artistImageElement = document.getElementById("artist-image");

    trackNameElement.textContent = trackName;
    artistImageElement.src = track.album.cover;
}

/** If the given guess is equal to the track name (disregarding case),
 * and there is not currently a correct guess, or the user has run out of guesses */
function verifyGuess(guess, trackName) {
    const correctGuessExists = isGuessLeft();

    if (guess === trackName.toLowerCase() && !correctGuessExists) {
        return true;
    } else if (guess !== trackName.toLowerCase() && !correctGuessExists) {
        return false;
    }
}

/** Check if there is a correct-guess element.
 * This tells us that the user cannot guess again */
function isGuessLeft() {
    return document.querySelector(".correct-guess") !== null;
}
