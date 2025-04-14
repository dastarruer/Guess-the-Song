class TrackSuggestionRenderer {
    /**
     * Initializes a new instance of the SuggestionProvider class. This class will provide suggestions to the user based on what they type into text boxes.
     * @param {Object} artist - The artist object containing artist details.
     * @param {Array} tracklist - The list of tracks associated with the artist.
     */

    constructor(artist, tracklist) {
        this.artist = artist;

        // The container that all suggestions are shown in
        this.suggestionsElement = document.getElementById(
            "suggestions-container"
        );
    }

    /**
     * Displays song suggestions based on the user's input.
     * Filters the tracklist to find tracks whose titles start with the first
     * three characters of the user's guess, then sorts them by their
     * Levenshtein distance to the guess. The top three closest matches are
     * displayed in the suggestions container. Each suggestion includes the
     * track's cover image, title, and artist's name.
     */
    showSuggestions(relevantTracks, suggestionNavigator) {
        if (relevantTracks === null) {
            return;
        }

        // Clear the list so that the previous suggestions are not shown
        this.suggestionsElement.innerHTML = "";

        // Show the suggestions
        this.suggestionsElement.style.display = "block";

        for (const track of relevantTracks) {
            // Create a list element to show the track
            const suggestion = document.createElement("li");
            suggestion.classList.add("suggestion-container");
            const trackCoverUrl = this.getTrackCover(track);

            // The HTML of the suggestion
            suggestion.innerHTML = `
                    <img class="suggestion-cover" src=${trackCoverUrl}>
                    <div class="suggestion-caption-container">
                        <p class="suggestion-title martian-mono">${track.title}</p>
                        <p class="suggestion-artist semibold">${this.artist.name}</p>
                    </div>
                `;
            this.suggestionsElement.appendChild(suggestion);
        }

        const suggestions = document.querySelectorAll(
            "#suggestions-container .suggestion-container"
        );

        for (const suggestion of suggestions) {
            suggestion.addEventListener("click", () => {
                suggestionNavigator.autofillInputBox();
            });

            suggestion.addEventListener("mouseenter", () => {
                suggestion.classList.add("highlight");
            });

            suggestion.addEventListener("mouseleave", () => {
                suggestion.classList.remove("highlight");
            });
        }
    }

    hideSuggestions() {
        this.suggestionsElement.style.display = "none";
    }

    getTrackCover(track) {
        let trackCoverUrl;

        if (track.album.cover_big) {
            trackCoverUrl = track.album.cover_big;
        } else if (track.album.cover_medium) {
            trackCoverUrl = track.album.cover_medium;
        } else {
            trackCoverUrl = track.album.cover_small;
        }
        return trackCoverUrl;
    }
}
export default TrackSuggestionRenderer;
