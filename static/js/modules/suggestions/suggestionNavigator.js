class SuggestionNavigator {
    constructor() {
        this.currentSuggestionIndex = -1;
        this.defaultSuggestionIndex = -1;
        this.firstSuggestionIndex = 0;

        // Will be modified depending on the number of suggestions to navigate
        this.lastSuggestionIndex = null;
    }

    /** Gets all the suggestions elements */
    getSuggestionElements() {
        let suggestionItems = document.getElementsByClassName(
            "suggestion-container"
        );
        return suggestionItems;
    }

    /** Navigate suggestions based on the key pressed.
     * If the user presses the down key, highlights the suggestion below the current one.
     * If the user presses the up key, highlights the suggestion above the current one.
     */
    navigateSuggestions(event, numSuggestions) {
        // If there are no suggestions to navigate, terminate early
        if (numSuggestions === 0) {
            return;
        }

        let suggestionItems = this.getSuggestionElements();

        this.lastSuggestionIndex = numSuggestions - 1;

        // If no suggestion is highlighted, highlight the first one
        if (this.currentSuggestionIndex < this.defaultSuggestionIndex) {
            this.currentSuggestionIndex = this.firstSuggestionIndex;
            return;
        }

        if (event.key === "ArrowUp") {
            // Check if the currentSuggestionIndex is within the bounds of the suggestion list
            if (this.isOutOfBounds()) {
                // Remove the highlight of the current suggestion
                suggestionItems[this.currentSuggestionIndex].classList.remove(
                    "highlight"
                );
            }

            // This makes sure that this.currentSuggestionIndex never goes under firstSuggestionIndex
            this.currentSuggestionIndex = Math.max(
                this.firstSuggestionIndex,
                this.currentSuggestionIndex - 1
            );

            // Highlight the current suggestion
            suggestionItems[this.currentSuggestionIndex].classList.add(
                "highlight"
            );
        } else if (event.key === "ArrowDown") {
            if (this.isOutOfBounds()) {
                // Remove highlight on the current suggestion
                suggestionItems[this.currentSuggestionIndex].classList.remove(
                    "highlight"
                );
            }

            // This makes sure that this.currentSuggestionIndex never goes over lastSuggestionIndex
            this.currentSuggestionIndex = Math.min(
                this.lastSuggestionIndex,
                this.currentSuggestionIndex + 1
            );

            suggestionItems[this.currentSuggestionIndex].classList.add(
                "highlight"
            );
        }

        const highlightedSuggestionTitle = document.querySelector(
            ".highlight .suggestion-title"
        ).innerHTML;

        if (highlightedSuggestionTitle !== null) {
            // Set the input box's value to the name of the highlighted suggestion
            document.getElementById("input").value = highlightedSuggestionTitle;
        }
    }

    /** Check if currentSuggestionIndex is out of bounds of the list of suggestions */
    isOutOfBounds() {
        return (
            this.currentSuggestionIndex > this.firstSuggestionIndex ||
            (this.currentSuggestionIndex < this.lastSuggestionIndex &&
                this.currentSuggestionIndex >= this.firstSuggestionIndex)
        );
    }
}

export default SuggestionNavigator;
