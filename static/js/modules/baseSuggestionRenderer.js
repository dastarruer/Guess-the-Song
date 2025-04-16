class BaseSuggestionRenderer {
    /**
     * Initializes a new instance of the SuggestionProvider class. This class will provide suggestions to the user based on what they type into text boxes.
     * @param {Object} artist - The artist object containing artist details.
     * @param {Array} tracklist - The list of tracks associated with the artist.
     */

    constructor({ suggestionContainerID }) {
        // The container that all suggestions are shown in
        this.suggestionsElement = document.getElementById(
            suggestionContainerID
        );
    }

    showSuggestions() {
        throw new Error(
            "showSuggestions() method must be implemented by subclass."
        );
    }

    hideSuggestions() {
        this.suggestionsElement.style.display = "none";
    }

    getSuggestionHTML(args) {
        throw new Error(
            "getSuggestionHTML() method must be implemented by subclass."
        );
    }
}

export default BaseSuggestionRenderer;
