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

    // Add event listeners to each suggestion, so that clicking and hovering will do something
    addEventListeners(suggestions, suggestionNavigator) {
        for (const suggestion of suggestions) {
            suggestion.addEventListener("mousedown", () => {
                suggestionNavigator.autofillInputBox();
            });

            suggestion.addEventListener("mouseenter", () => {
                console.log("hello")
                suggestion.classList.add("highlight");
            });

            suggestion.addEventListener("mouseleave", () => {
                suggestion.classList.remove("highlight");
            });
        }
    }

    showSuggestions() {
        throw new Error(
            "showSuggestions() method must be implemented by subclass."
        );
    }

    hideSuggestions() {
        this.suggestionsElement.classList.add("hidden");
    }

    getSuggestionHTML() {
        throw new Error(
            "getSuggestionHTML() method must be implemented by subclass."
        );
    }
}

export default BaseSuggestionRenderer;
