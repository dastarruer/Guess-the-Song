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
}

export default ArtistPlayer;
