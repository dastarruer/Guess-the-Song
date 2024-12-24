// TODO: Play a random song off of the billboard hot 100
const apiButton = document.getElementById("api");
const playButton = document.getElementById("play-track");
const audioPlayer = document.getElementById("track-player");
var isPlaying = false;

window.onSpotifyWebPlaybackSDKReady = () => {
    const token = getAuthToken();
    const player = new Spotify.Player({
        name: "Web Playback SDK Quick Start Player",
        getOAuthToken: (cb) => {
            cb(token);
        },
        volume: 0.5,
    });

    // Ready
    player.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
    });

    // Not Ready
    player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
    });

    player.addListener("initialization_error", ({ message }) => {
        console.error(message);
    });

    player.addListener("authentication_error", ({ message }) => {
        console.error(message);
    });

    player.addListener("account_error", ({ message }) => {
        console.error(message);
    });

    player.connect();

    playButton.addEventListener("click", () => {
        let pauseClass = "bi bi-pause-circle-fill";
        let playClass = "bi bi-play-circle-fill";

        // Toggle icon from paused to play and vice-versa when clicked
        playButton.className =
            playButton.className === pauseClass ? playClass : pauseClass;

        player.togglePlay();
    });

    apiButton.addEventListener("click", async () => {
        const track = await getRandomBillboardHot100Song();
    });
};

// Send an API call to retreive an access token and get playlist data
async function getRandomBillboardHot100Song() {
    const response = await fetch("http://localhost:8080/auth");
    const tracks = await response.json();
    const track =
        tracks.items[Math.floor(Math.random() * tracks.items.length)];
    return track;
}

async function getAuthToken() {
    const response = await fetch("http://localhost:8080/token");
    let token = await response.json();
    token = token.access_token;
    return token
}
