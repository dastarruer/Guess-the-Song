const apiButton = document.getElementById("api");
const trackPlayer = document.getElementById("track");

apiButton.addEventListener("click", async () => {
    const data = await fetch("http://localhost:8080/track");
    const json = await data.json();

    trackPlayer.src = json.preview;
    trackPlayer.load()
});
