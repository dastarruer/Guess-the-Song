const submitButton = document.getElementById("submit-guess");
const guessInput = document.getElementById("input");

window.onload = async function () {
    const tracklist = await getArtistTracklist();
    const track = getRandomArtistTrack(tracklist);
    const artist = await getArtist();
    setTrack(artist, track.preview);

    submitButton.addEventListener("click", () => {
        const input = document.getElementById("input");
        const guess = input.value.toLowerCase();
        const trackName = track.title;

        if (guess === trackName.toLowerCase()) {
            const trackCaption = document.getElementById("track-name");
            const trackImage = document.getElementById("artist-image");

            trackCaption.textContent = trackName;
            trackImage.src = track.album.cover;
        } else {
            console.log("incorrect");
        }
    });

    guessInput.addEventListener(
        "input",
        debounce(() => {
            const guess = guessInput.value.toLowerCase();
            let relevantTracks = tracklist.filter((track) =>
                track.title.toLowerCase().startsWith(guess.slice(0, 3))
            );
            relevantTracks = tracklist
                .sort((a, b) => {
                    // Calculate Levenshtein distance for both tracks' names
                    const distanceA = levenshteinDistance(
                        guess,
                        a.title.toLowerCase()
                    );
                    const distanceB = levenshteinDistance(
                        guess,
                        b.title.toLowerCase()
                    );

                    // Compare distances
                    return distanceA - distanceB;
                })
                .slice(0, 3);
            console.log(relevantTracks);
        }),
        300
    );
};

function debounce(func, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), delay);
    };
}

function levenshteinDistance(a, b) {
    const lenA = a.length,
        lenB = b.length;
    const dp = Array.from({ length: lenA + 1 }, () => Array(lenB + 1).fill(0));

    for (let i = 0; i <= lenA; i++) dp[i][0] = i;
    for (let j = 0; j <= lenB; j++) dp[0][j] = j;

    for (let i = 1; i <= lenA; i++) {
        for (let j = 1; j <= lenB; j++) {
            if (a[i - 1] === b[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = Math.min(
                    dp[i - 1][j] + 1, // Deletion
                    dp[i][j - 1] + 1, // Insertion
                    dp[i - 1][j - 1] + 1 // Substitution
                );
            }
        }
    }
    return dp[lenA][lenB];
}

function getRandomArtistTrack(tracklist) {
    let track = tracklist[Math.floor(Math.random() * tracklist.length)];
    return track;
}

async function getArtistTracklist() {
    const data = await fetch("http://localhost:8080/artist/top");
    const json = await data.json();

    let tracks = json.data;
    return tracks;
}

async function getArtist() {
    const data = await fetch("http://localhost:8080/artist");
    const artist = await data.json();
    return artist;
}

function setTrack(artist, previewUrl) {
    const trackPlayer = document.getElementById("track");
    const artistName = document.getElementById("artist-name");
    const artistImage = document.getElementById("artist-image");
    const trackName = document.getElementById("track-name");

    // Set the audio
    trackPlayer.src = previewUrl;
    trackPlayer.load();

    // Set the artist info
    artistImage.src = artist.picture;
    artistName.textContent = artist.name;

    trackName.innerText = "???";
}
