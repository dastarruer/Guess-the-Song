const submitButton = document.getElementById("submit-guess");

window.onload = async function () {
    const track = await getRandomArtistTrack();
    const artist = await getArtist();
    setTrack(artist, track.preview);

    submitButton.addEventListener("click", () => {
        const input = document.getElementById("input");
        const guess = input.value.toLowerCase();
        const trackName = track.title;

        if (guess === trackName.toLowerCase()) {
            const trackCaption = document.getElementById("track-name");
            const trackImage = document.getElementById("artist-image");

            trackCaption.textContent = trackName;
            trackImage.src = track.album.cover;
        } else {
            console.log("incorrect");
        }
    });
};;

async function getRandomArtistTrack() {
    const data = await fetch("http://localhost:8080/artist/top");
    const json = await data.json();

    let tracks = json.data;
    let track = tracks[Math.floor(Math.random() * tracks.length)];
    return track;
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
