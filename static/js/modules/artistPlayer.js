class ArtistPlayer {
    constructor() {
        this.trackPlayer = document.getElementById("track");
        this.artistNameElement = document.getElementById("artist-name");
        this.artistImageElement = document.getElementById("artist-image");
        this.trackNameElement = document.getElementById("track-name");
        this.playing = false;
    }

    // Fetch the artist's data from the /artist API endpoint
    async fetchArtistInfo(artistId) {
        const data = await fetch(`http://localhost:8080/artist?id=${artistId}`);
        this.artist = await data.json();
    }

    // Fetch the artist's top songs' data from the /artist/top API endpoint
    async fetchTracklist() {
        const data = await fetch(
            `http://localhost:8080/chart`
        );
        const json = await data.json();

        this.tracklist = json.data;
    }

    // Fetch a random track from the tracklist fetched in this.fetchTracklist()
    fetchRandomTrack() {
        this.track =
            this.tracklist[Math.floor(Math.random() * this.tracklist.length)];
    }

    async chooseArtist(genre) {
        const data = await fetch(
            `http://localhost:8080/genres/artists?id=${genre.id}`
        );
        const json = await data.json();
        const artists = json.data;

        this.artist = artists[Math.floor(Math.random() * artists.length)];
    }

    /**
     * Asynchronously sets the current track and artist information.
     * Fetches artist data, tracklist, and a random track, then updates the audio source and
     * artist elements in the DOM. The track name is obscured as "???" until guessed correctly.
     */
    async setTrack(genre) {
        // Set volume to 0 so fade function fades in audio
        this.trackPlayer.volume = 0;

        // await this.chooseArtist(genre);
        // await this.fetchArtistInfo(artistId);
        await this.fetchTracklist();
        this.fetchRandomTrack();

        // Set the audio
        this.trackPlayer.src = this.track.preview;
        this.trackPlayer.load();

        // Set the artist info
        if (this.artist.picture_big) {
            this.artistImageElement.src = this.artist.picture_big;
        } else if (this.artist.picture_medium) {
            this.artistImageElement.src = this.artist.picture_medium;
        } else {
            this.artistImageElement.src = this.artist.picture_small;
        }

        this.artistNameElement.textContent = this.artist.name;

        this.trackNameElement.innerText = "???";

        // Play the audio
        this.playPauseTrack();

        // Fade in/out while looping
        this.trackPlayer.addEventListener("timeupdate", () => {
            const oneSecondLeft = this.trackPlayer.duration - 1;

            if (
                !this.track.paused &&
                this.trackPlayer.currentTime >= oneSecondLeft
            ) {
                this.trackPlayer.currentTime = 0;
                this.playTrack();
            }
        });
    }

    /** Play/pause the current song */
    playPauseTrack() {
        if (this.trackPlayer.paused && !this.playing) {
            // Fade in and play
            this.playTrack();
        } else {
            // Fade out and pause
            this.pauseTrack();
        }
    }

    pauseTrack() {
        const fadeDurationMs = 450;
        const intervalMs = 50;
        const step = 1 / (fadeDurationMs / intervalMs);

        const playIcon = `<!-- Play circle fill: https://icons.getbootstrap.com/icons/play-circle-fill/ -->
                        <svg
                            id="play-track-icon"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            class="bi bi-play-circle-fill"
                            viewBox="0 0 16 16">
                            <path
                                d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z" />
                        </svg>`;

        const playPauseBtnElement = document.getElementById("play-track");

        const fadeOut = setInterval(() => {
            if (this.trackPlayer.volume > step) {
                this.trackPlayer.volume -= step;
            } else {
                this.trackPlayer.volume = 0;
                this.trackPlayer.pause();
                clearInterval(fadeOut);
            }
        }, intervalMs);

        playPauseBtnElement.innerHTML = playIcon;
    }

    playTrack() {
        const fadeDurationMs = 450;
        const intervalMs = 50;
        const step = 1 / (fadeDurationMs / intervalMs);

        const pauseIcon = `<!-- Pause circle fill: https://icons.getbootstrap.com/icons/play-circle-fill/ -->
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            id="play-track-icon"
                            fill="currentColor"
                            class="bi bi-pause-circle-fill"
                            viewBox="0 0 16 16">
                            <path
                                d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.25 5C5.56 5 5 5.56 5 6.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C7.5 5.56 6.94 5 6.25 5m3.5 0c-.69 0-1.25.56-1.25 1.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C11 5.56 10.44 5 9.75 5" />
                        </svg>`;

        const playPauseBtnElement = document.getElementById("play-track");

        this.trackPlayer.volume = 0;
        this.trackPlayer.play();

        const fadeIn = setInterval(() => {
            if (this.trackPlayer.volume < 1 - step) {
                this.trackPlayer.volume += step;
            } else if (!this.playing) {
                this.trackPlayer.volume = 1;
                clearInterval(fadeIn);
            }
        }, intervalMs);

        playPauseBtnElement.innerHTML = pauseIcon;
    }
}

export default ArtistPlayer;
