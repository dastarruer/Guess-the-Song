import BaseSuggestionRenderer from "../base/baseSuggestionRenderer";

class TrackSuggestionRenderer extends BaseSuggestionRenderer {
    constructor(suggestionContainerID) {
        super({ suggestionContainerID });
    }

    getTrackCoverURL(track) {
        let trackCoverURL;

        if (track.album.cover_big) {
            trackCoverURL = track.album.cover_big;
        } else if (track.album.cover_medium) {
            trackCoverURL = track.album.cover_medium;
        } else {
            trackCoverURL = track.album.cover_small;
        }
        return trackCoverURL;
    }

    /**
     * Displays song suggestions based on the user's input.
     * Filters the tracklist to find tracks whose titles start with the first
     * three characters of the user's guess, then sorts them by their
     * Levenshtein distance to the guess. The top three closest matches are
     * displayed in the suggestions container. Each suggestion includes the
     * track's cover image, title, and artist's name.
     */
    showSuggestions(relevantSuggestions, suggestionNavigator, artist) {
        if (relevantSuggestions === null) {
            return;
        }

        // Clear the list so that the previous suggestions are not shown
        this.suggestionsElement.innerHTML = "";

        // Show the suggestions
        this.suggestionsElement.style.display = "block";

        for (const suggestion of relevantSuggestions) {
            // Create a list element to show the track
            const suggestionElement = document.createElement("li");
            suggestionElement.classList.add("suggestion-container");

            // The HTML of the suggestion
            suggestionElement.innerHTML = this.getSuggestionHTML(
                suggestion,
                artist
            );
            this.suggestionsElement.appendChild(suggestionElement);
        }

        const suggestions = this.suggestionsElement.querySelectorAll(
            ".suggestion-container"
        );

        this.addEventListeners(suggestions, suggestionNavigator);
    }

    getSuggestionHTML(track, artist) {
        const trackCoverUrl = this.getTrackCoverURL(track);

        return `
                    <img class="suggestion-cover" src=${trackCoverUrl}>
                    <div class="suggestion-caption-container">
                        <p class="suggestion-title martian-mono">${track.title}</p>
                        <p class="suggestion-artist semibold">${artist.name}</p>
                    </div>
                `;
    }
}

export default TrackSuggestionRenderer;
