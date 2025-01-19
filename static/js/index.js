import SuggestionProvider from "./suggestions.js";
import ArtistPlayer from "./artist_player.js";

const submitButton = document.getElementById("submit-guess");
const guessInput = document.getElementById("input");

window.onload = async function () {
    const player = new ArtistPlayer();
    const songSuggestions = new SuggestionProvider();

    await player.setTrack();

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
        songSuggestions.showSuggestions(guessInput, player.artist, player.tracklist);
    });
};

function setTrack(artist, previewUrl) {
    const trackPlayer = document.getElementById("track");
    const artistName = document.getElementById("artist-name");
    const artistImage = document.getElementById("artist-image");
    const trackName = document.getElementById("track-name");

    // Set the audio
    trackPlayer.src = previewUrl;
    trackPlayer.load();

    // Set the artist info
    artistImage.src = artist.picture;
    artistName.textContent = artist.name;

    trackName.innerText = "???";
}
