// TODO: Play a random song off of the billboard hot 100
const apiButton = document.getElementById("api");
const playButton = document.getElementById("play-track");
const audioPlayer = document.getElementById("track-player");
var isPlaying = false;

apiButton.addEventListener("click", async () => {
    const data = await getRandomBillboardHot100Song();
    console.log(data);
    playTrack(data.preview_url);
});

playButton.addEventListener("click", () => {
    let pauseClass = "bi bi-pause-circle-fill";
    let playClass = "bi bi-play-circle-fill";
    if (playButton.className === pauseClass) {
        playButton.className = playClass;
        togglePlay();
    } else {
        playButton.className = pauseClass;
        togglePlay();
    }
});

async function getRandomBillboardHot100Song() {
    const response = await fetch("http://localhost:8080/auth");
    const data = await response.json();

    let track = data.items[Math.floor(Math.random() * data.items.length)].track;

    return track;
}

function togglePlay() {
    isPlaying ? audioPlayer.pause() : audioPlayer.play();
}

function playTrack(src) {
    audioPlayer.src = src;
    audioPlayer.load();
    audioPlayer.play();
}

audioPlayer.onplaying = function () {
    isPlaying = true;
};
audioPlayer.onpause = function () {
    isPlaying = false;
};
