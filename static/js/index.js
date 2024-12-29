const apiButton = document.getElementById("api");

apiButton.addEventListener("click", async () => {
    const track = await getRandomArtistTrack();
    setTrack(track.preview)
});

async function getRandomArtistTrack() {
    const data = await fetch("http://localhost:8080/artist/top");
    const json = await data.json();

    let tracks = json.data
    let track = tracks[Math.floor(Math.random() * tracks.length)]
    return track;
}

function setTrack(previewUrl) {
    const trackPlayer = document.getElementById("track");
    trackPlayer.src = previewUrl;
    trackPlayer.load();
}

