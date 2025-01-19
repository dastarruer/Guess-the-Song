class ArtistPlayer {
    constructor() {
        this.trackPlayer = document.getElementById("track");
        this.artistNameElement = document.getElementById("artist-name");
        this.artistImageElement = document.getElementById("artist-image");
        this.trackNameElement = document.getElementById("track-name");
    }

    async fetchArtist() {
        const data = await fetch("http://localhost:8080/artist");
        this.artist = await data.json();
    }

    async fetchTracklist() {
        const data = await fetch("http://localhost:8080/artist/top");
        const json = await data.json();

        this.tracklist = json.data;
    }

    async fetchRandomArtistTrack() {
        this.track =
            this.tracklist[Math.floor(Math.random() * this.tracklist.length)];
    }

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
