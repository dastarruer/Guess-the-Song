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
            const suggestions = document.getElementById(
                "suggestions-container"
            );

            // Clear the list so that the previous suggestions are not shown
            suggestions.innerHTML = "";
            suggestions.style.display = "block";
            for (const track of relevantTracks) {
                const suggestion = document.createElement("li");
                suggestion.innerHTML = `
                    <div class="suggestion-container">
                        <img class="suggestion-cover" src=${track.album.cover}>
                        <div class="suggestion-caption-container">
                            <p class="suggestion-title">${track.title}</p>
                            <p class="suggestion-artist">${artist.name}</p>
                        </div>
                    </div>
                `;
                suggestions.appendChild(suggestion);
            }
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

    const d = Array.from({ length: lenA + 1 }, () => Array(lenB + 1).fill(0));

    for (let i = 0; i <= lenA; i++) d[i][0] = i;
    for (let j = 0; j <= lenB; j++) d[0][j] = j;

    for (let i = 1; i <= lenA; i++) {
        for (let j = 1; j <= lenB; j++) {
            if (a[i - 1] === b[j - 1]) {
                d[i][j] = d[i - 1][j - 1];
            } else {
                d[i][j] = Math.min(
                    d[i - 1][j] + 1, // Deletion
                    d[i][j - 1] + 1, // Insertion
                    d[i - 1][j - 1] + 1 // Substitution
                );
            }
        }
    }
    return d[lenA][lenB];
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
