const apiButton = document.getElementById("api");
const trackPlayer = document.getElementById("track");

apiButton.addEventListener("click", async () => {
    const tracks = await getRandomArtistTrack();
    console.log(tracks);
});

async function getRandomArtistTrack() {
    const data = await fetch("http://localhost:8080/artist");
    const json = await data.json();

    let tracks = json.data
    return tracks;
}

async function setTrack() {
    const data = await fetch("http://localhost:8080/track");
    const json = await data.json();

    trackPlayer.src = json.preview;
    trackPlayer.load();
}
