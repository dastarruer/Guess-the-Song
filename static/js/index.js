// TODO: Play a random song off of the billboard hot 100
const apiButton = document.getElementById("api");
const playButton = document.getElementById("play-track");
const audioPlayer = document.getElementById("track-player");
var isPlaying = false;

// A temporary button to send API requests when clicked
apiButton.addEventListener("click", async () => {
    const track = await getRandomBillboardHot100Song();
    console.log(track);
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
    let code = new URL(window.location.href).searchParams.get("code");
    let route = new URL("http://localhost:8080/auth");
    route.searchParams.append("code", code);

    const response = await fetch(route);
    const tracks = await response.json();

    let track = tracks[Math.floor(Math.random() * tracks.length)];

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
