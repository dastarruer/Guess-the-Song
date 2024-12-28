const apiButton = document.getElementById("api");
const trackPlayer = document.getElementById("track");

apiButton.addEventListener("click", async () => {
    const json = await getArtist();
    console.log(json);
});

// TODO: fix error (json bad parse)
async function getArtist() {
    const data = await fetch("http://localhost:8080/artist");
    const json = await data.json();
    return json;
}

async function setTrack() {
    const data = await fetch("http://localhost:8080/track");
    const json = await data.json();

    trackPlayer.src = json.preview;
    trackPlayer.load();
}
