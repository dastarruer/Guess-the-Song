import SuggestionProvider from "./modules/suggestions.js";
import ArtistPlayer from "./modules/artistPlayer.js";

const submitButton = document.getElementById("submit-guess");
const guessInput = document.getElementById("input");
const suggestionItems = document.querySelectorAll(".suggestion-container");
let currentSuggestionIndex = -1;

window.onload = async function () {
    const player = new ArtistPlayer();
    await player.setTrack();

    const songSuggestions = new SuggestionProvider(
        player.artist,
        player.tracklist
    );

    submitButton.addEventListener("click", () => {
        const trackName = player.track.title;

        if (
            songSuggestions.relevantTracks[0].title === trackName.toLowerCase()
        ) {
            const trackCaption = document.getElementById("track-name");
            const trackImage = document.getElementById("artist-image");

            trackCaption.textContent = trackName;
            trackImage.src = track.album.cover;
        } else {
            console.log(songSuggestions.relevantTracks[0].title);
        }
    });

    guessInput.addEventListener("input", () => {
        songSuggestions.showSuggestions();
    });

    document.addEventListener("keydown", () => {
        let firstSuggestionIndex = 0;
        let lastSuggestionIndex = 2;
        let defaultSuggestionIndex = -1;

        // Function to handle suggestion navigation
        function updateSuggestionIndex(event) {
            if (event.key === "ArrowUp") {
                currentSuggestionIndex = Math.max(
                    firstSuggestionIndex,
                    currentSuggestionIndex - 1
                );
            } else if (event.key === "ArrowDown") {
                currentSuggestionIndex = Math.min(
                    lastSuggestionIndex,
                    currentSuggestionIndex + 1
                );
            } else if (currentSuggestionIndex < defaultSuggestionIndex) {
                currentSuggestionIndex = firstSuggestionIndex;
            }
        }

        document.addEventListener("keydown", updateSuggestionIndex);
    });
};
