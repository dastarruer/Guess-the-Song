class BaseSuggestionNavigator {
    constructor({ suggestionContainerID, inputBoxID }) {
        this.currentSuggestionIndex = -1;
        this.defaultSuggestionIndex = -1;
        this.firstSuggestionIndex = 0;

        // Will be modified depending on the number of suggestions to navigate
        this.lastSuggestionIndex = null;

        this.suggestionContainerID = suggestionContainerID;
        this.inputBoxID = inputBoxID;
    }

    /** Gets all the suggestions elements */
    getSuggestionElements() {
        const suggestionContainer = document.getElementById(
            this.suggestionContainerID
        );

        return suggestionContainer.querySelectorAll(".suggestion-container");
        // let suggestionItems = document.querySelectorAll(
        //     `#${this.suggestionContainerID} .suggestion-container`
        // );
        // return suggestionItems;
    }

    /** Navigate suggestions based on the key pressed.
     * If the user presses the down key, highlights the suggestion below the current one.
     * If the user presses the up key, highlights the suggestion above the current one.
     */
    navigateSuggestions(event, numSuggestions) {
        let suggestionItems = this.getSuggestionElements();
        console.log(suggestionItems);
        // If there are no suggestions to navigate, terminate early
        // TODO: for genre suggestions, numSuggestions is always 0 fix pls
        if (numSuggestions === 0) {
            return;
        }

        this.lastSuggestionIndex = numSuggestions - 1;

        // If no suggestion is highlighted, highlight the first one and terminate the function
        if (!this.hasHighlightedSuggestion()) {
            this.currentSuggestionIndex = this.firstSuggestionIndex;
            this.highlightSuggestion(suggestionItems);
            return;
        }

        if (event.key === "ArrowUp") {
            // Check if the currentSuggestionIndex is within the bounds of the suggestion list
            if (this.isOutOfBounds()) {
                // Remove the highlight of the current suggestion
                this.clearHighlight(suggestionItems);
            }

            this.moveUp();

            // Highlight the current suggestion
            this.highlightSuggestion(suggestionItems);
        } else if (event.key === "ArrowDown") {
            if (this.isOutOfBounds()) {
                this.clearHighlight(suggestionItems);
            }

            this.moveDown();

            this.highlightSuggestion(suggestionItems);
        }

        if (event.key === "Enter") {
            this.autofillInputBox();
        }
    }

    moveDown() {
        // This makes sure that this.currentSuggestionIndex never goes over lastSuggestionIndex
        this.currentSuggestionIndex = Math.min(
            this.lastSuggestionIndex,
            this.currentSuggestionIndex + 1
        );
    }

    moveUp() {
        // This makes sure that this.currentSuggestionIndex never goes under firstSuggestionIndex
        this.currentSuggestionIndex = Math.max(
            this.firstSuggestionIndex,
            this.currentSuggestionIndex - 1
        );
    }

    autofillInputBox() {
        let highlightedSuggestionTitle = document.querySelector(
            ".highlight .suggestion-title"
        ).innerHTML;

        if (highlightedSuggestionTitle !== null) {
            // For whatever reason, R&B will autofill to R&amp;B, so we replace it
            if (highlightedSuggestionTitle === "R&amp;B") {
                highlightedSuggestionTitle = "R&B";
            }

            // Set the input box's value to the name of the highlighted suggestion
            document.getElementById(this.inputBoxID).value =
                highlightedSuggestionTitle;
        }
    }

    clearHighlight(suggestionItems) {
        suggestionItems[this.currentSuggestionIndex].classList.remove(
            "highlight"
        );
    }

    highlightSuggestion(suggestionItems) {
        suggestionItems[this.currentSuggestionIndex].classList.add("highlight");
        this.autofillInputBox();
    }

    /** Return if there is a highlighted suggestion or not */
    hasHighlightedSuggestion() {
        return !(this.currentSuggestionIndex < this.defaultSuggestionIndex);
    }

    /** Check if currentSuggestionIndex is out of bounds of the list of suggestions */
    isOutOfBounds() {
        return !(
            this.currentSuggestionIndex < this.firstSuggestionIndex ||
            this.currentSuggestionIndex > this.lastSuggestionIndex
        );
    }
}

export default BaseSuggestionNavigator;
