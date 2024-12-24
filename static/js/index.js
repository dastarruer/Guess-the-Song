// TODO: Play a random song off of the billboard hot 100
const apiButton = document.getElementById("api");
const playButton = document.getElementById("play-track");
const audioPlayer = document.getElementById("track-player");
var isPlaying = false;

// A temporary button to send API requests when clicked
apiButton.addEventListener("click", async () => {
    const data = await getRandomBillboardHot100Song();
    console.log(data);
    playTrack(data.preview_url);
});

// Toggle the play button from a play to a pause icon when clicked
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

// Send an API call to retreive an access token and get playlist data
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
