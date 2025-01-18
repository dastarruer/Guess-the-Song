import SuggestionProvider from "./suggestions.js";

const submitButton = document.getElementById("submit-guess");
const guessInput = document.getElementById("input");

window.onload = async function () {
    const tracklist = await getArtistTracklist();
    const track = getRandomArtistTrack(tracklist);
    const artist = await getArtist();

    const songSuggestions = new SuggestionProvider();

    setTrack(artist, track.preview);

    submitButton.addEventListener("click", () => {
        const trackName = track.title;

        if (songSuggestions.relevantTracks[0].title === trackName.toLowerCase()) {
            const trackCaption = document.getElementById("track-name");
            const trackImage = document.getElementById("artist-image");

            trackCaption.textContent = trackName;
            trackImage.src = track.album.cover;
        } else {
            console.log(songSuggestions.relevantTracks[0].title);
        }
    });

    guessInput.addEventListener("input", () => {
        songSuggestions.showSuggestions(guessInput, artist, tracklist);
    });
};

function debounce(func, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), delay);
    };
}

function getRandomArtistTrack(tracklist) {
    let track = tracklist[Math.floor(Math.random() * tracklist.length)];
    return track;
}

async function getArtistTracklist() {
    const data = await fetch("http://localhost:8080/artist/top");
    const json = await data.json();

    let tracks = json.data;
    return tracks;
}

async function getArtist() {
    const data = await fetch("http://localhost:8080/artist");
    const artist = await data.json();
    return artist;
}

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
