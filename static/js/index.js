import SuggestionProvider from "./modules/suggestions.js";
import ArtistPlayer from "./modules/artistPlayer.js";

const submitButton = document.getElementById("submit-guess");
const guessInput = document.getElementById("input");
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
        // Set the currently focused suggestion to its default
        currentSuggestionIndex = -1;
        songSuggestions.showSuggestions();
    });

    document.addEventListener("keydown", () => {
        let suggestionItems = songSuggestions.getSongSuggestionItems();
        let firstSuggestionIndex = 0;
        let lastSuggestionIndex = 2;
        let defaultSuggestionIndex = -1;
        console.log(currentSuggestionIndex);
        // Update the selected suggestion index
        if (event.key === "ArrowUp") {
            if (currentSuggestionIndex !== -1) {
                // Remove the highlight of the current suggestion
                suggestionItems[currentSuggestionIndex].classList.remove(
                    "highlight"
                );
            }

            // Update the suggestion index
            currentSuggestionIndex += 1;

            suggestionItems[currentSuggestionIndex].classList.add("highlight");
        } else if (event.key === "ArrowDown") {
            currentSuggestionIndex = Math.min(
                lastSuggestionIndex,
                currentSuggestionIndex + 1
            );
        } else if (currentSuggestionIndex < defaultSuggestionIndex) {
            currentSuggestionIndex = firstSuggestionIndex;
        }
    });
};
