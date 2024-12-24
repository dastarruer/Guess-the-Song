// TODO: Play a random song off of the billboard hot 100
const apiButton = document.getElementById("api");
const playButton = document.getElementById("play-track");
const audioPlayer = document.getElementById("track-player");
var isPlaying = false;

window.onSpotifyWebPlaybackSDKReady = () => {
    const token =
        "BQBpiF_Lg_o_bjd267VozYzO8gi9ddGhsFex6tD5P7WPVYEfy2JcUd0ykYlKZOufQFDZ3luhqBRQrzq1misB80lB-d6XlYtrqFKuXQ_m6UDSr2L5MFCiJg94ucld-BaT8OXCKOr3nP3c9A_KRSEnk393IMsAhLRfJ1_yDS0kBKAEGrmDDjhnLgA9v8jJrcY6xkt2ZwwKejE7pgi36Yz4NvKA8nldM_uIM1yr";
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
};

apiButton.addEventListener("click", async () => {
    const data = await getRandomBillboardHot100Song();
    console.log(data);
});

async function getRandomBillboardHot100Song() {
    const response = await fetch("http://localhost:8080/auth");
    const data = await response.json();
    const track =
        data.tracks.items[Math.floor(Math.random() * data.tracks.items.length)]
            .track;
    return track;
}
