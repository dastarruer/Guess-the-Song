const apiButton = document.getElementById("api");
const trackPlayer = document.getElementById("track");

apiButton.addEventListener("click", async () => {
    const track = await getRandomArtistTrack();
    setTrack(track.preview)
});

async function getRandomArtistTrack() {
    const data = await fetch("http://localhost:8080/artist");
    const json = await data.json();

    let tracks = json.data
    let track = tracks[Math.floor(Math.random() * tracks.length)]
    return track;
}

async function setTrack(previewUrl) {
    trackPlayer.src = previewUrl;
    trackPlayer.load();
}
