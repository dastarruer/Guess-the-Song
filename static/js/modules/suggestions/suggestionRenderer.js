class SuggestionRenderer {
    /**
     * Initializes a new instance of the SuggestionProvider class. This class will provide suggestions to the user based on what they type into text boxes.
     * @param {Object} artist - The artist object containing artist details.
     * @param {Array} tracklist - The list of tracks associated with the artist.
     */

    constructor(artist, tracklist) {
        this.artist = artist;
    }

    /**
     * Displays song suggestions based on the user's input.
     * Filters the tracklist to find tracks whose titles start with the first
     * three characters of the user's guess, then sorts them by their
     * Levenshtein distance to the guess. The top three closest matches are
     * displayed in the suggestions container. Each suggestion includes the
     * track's cover image, title, and artist's name.
     */
    showSuggestions(relevantTracks) {
        this.appendSuggestionsToHTML(relevantTracks);
    }

    appendSuggestionsToHTML(relevantTracks) {
        // The container that all suggestions are shown in
        const suggestions = document.getElementById("suggestions-container");

        // Clear the list so that the previous suggestions are not shown
        suggestions.innerHTML = "";

        // Show the suggestions
        suggestions.style.display = "block";

        for (const track of relevantTracks) {
            // Create a list element to show the track
            const suggestion = document.createElement("li");
            suggestion.classList.add("suggestion-container");

            // The HTML of the suggestion
            suggestion.innerHTML = `
                    <img class="suggestion-cover" src=${track.album.cover}>
                    <div class="suggestion-caption-container">
                        <p class="suggestion-title martian-mono">${track.title}</p>
                        <p class="suggestion-artist semibold">${this.artist.name}</p>
                    </div>
                `;
            suggestions.appendChild(suggestion);
        }
    }
}
export default SuggestionRenderer;
