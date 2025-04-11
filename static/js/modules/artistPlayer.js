class ArtistPlayer {
    constructor() {
        this.trackPlayer = document.getElementById("track");
        this.artistNameElement = document.getElementById("artist-name");
        this.artistImageElement = document.getElementById("artist-image");
        this.trackNameElement = document.getElementById("track-name");
    }

    // Fetch the artist's data from the /artist API endpoint
    async fetchArtist() {
        const data = await fetch("http://localhost:8080/artist");
        this.artist = await data.json();
    }

    // Fetch the artist's top songs' data from the /artist/top API endpoint
    async fetchTracklist() {
        const data = await fetch("http://localhost:8080/artist/top");
        const json = await data.json();

        this.tracklist = json.data;
    }

    // Fetch a random track from the tracklist fetched in this.fetchTracklist()
    fetchRandomArtistTrack() {
        this.track =
            this.tracklist[Math.floor(Math.random() * this.tracklist.length)];
    }

    /**
     * Asynchronously sets the current track and artist information.
     * Fetches artist data, tracklist, and a random track, then updates the audio source and
     * artist elements in the DOM. The track name is obscured as "???" until guessed correctly.
     */
    async setTrack() {
        await this.fetchArtist();
        await this.fetchTracklist();
        await this.fetchRandomArtistTrack();

        // Set the audio
        this.trackPlayer.src = this.track.preview;
        this.trackPlayer.load();

        // Set the artist info
        this.artistImageElement.src = this.artist.picture;
        this.artistNameElement.textContent = this.artist.name;

        this.trackNameElement.innerText = "???";
    }

    /** Play/pause the current song */
    playPauseTrack() {
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
        if (this.trackPlayer.paused) {
            playPauseBtnElement.innerHTML = pauseIcon;
            this.trackPlayer.play();
        } else {
            playPauseBtnElement.innerHTML = playIcon;
            this.trackPlayer.pause();
        }
    }
}

export default ArtistPlayer;
