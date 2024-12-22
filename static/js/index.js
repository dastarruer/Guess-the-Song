// TODO: Play a random song off of the billboard hot 100
// TODO: Make audio start and stop when play button is pressed
const apiButton = document.getElementById("api");
const playButton = document.getElementById("play-track");
const audioPlayer = document.getElementById("track-player");
var isPlaying = false;

apiButton.addEventListener("click", async () => {
    const data = await getRandomBillboardHot100Song();
    console.log(data);
});

playButton.addEventListener("click", () => {
    let pauseClass = "bi bi-pause-circle-fill";
    let playClass = "bi bi-play-circle-fill";
    if (playButton.className === pauseClass) {
        playButton.className = playClass;
        togglePlay()
    } else {
        playButton.className = pauseClass;
        togglePlay();
    }
});

async function getRandomBillboardHot100Song() {
    const response = await fetch("http://localhost:8080/auth");
    const data = await response.json();
    const track =
        data.tracks.items[Math.floor(Math.random() * data.tracks.items.length)];
    return track;
}

function togglePlay() {
    isPlaying ? audioPlayer.pause() : audioPlayer.play();
}

audioPlayer.onplaying = function () {
    isPlaying = true;
};
audioPlayer.onpause = function () {
    isPlaying = false;
};
