import SuggestionProvider from "./modules/suggestions.js";
import ArtistPlayer from "./modules/artistPlayer.js";

const submitButton = document.getElementById("submit-guess");
const guessInput = document.getElementById("input");

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
        songSuggestions.currentSuggestionIndex = -1;

        songSuggestions.showSuggestions();
    });

    document.addEventListener("keydown", () => {
        songSuggestions.navigateSuggestions(event)
    });
};
