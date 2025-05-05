class BaseSuggestionManager {
    constructor({
        suggestionMatcher,
        suggestionNavigator,
        suggestionRenderer,
    }) {
        this.suggestionMatcher = suggestionMatcher;
        this.suggestionNavigator = suggestionNavigator;
        this.suggestionRenderer = suggestionRenderer;
    }

    /** Get the number of relevant suggestions and pass it to the navigateSuggestions() function */
    navigateSuggestions(event) {
        let numSuggestions = this.suggestionMatcher.numRelevantSuggestions();
        this.suggestionNavigator.navigateSuggestions(event, numSuggestions);
    }

    /** Refresh the relevant suggestions in suggestionMatcher */
    updateRelevantSuggestions(input) {
        this.suggestionMatcher.relevantSuggestions =
            this.suggestionMatcher.getRelevantSuggestions(input);
    }

    showSuggestions() {
        throw new Error(
            "showSuggestions() method should be implemented by subclass."
        );
    }

    addEventListeners() {
        throw new Error(
            "addEventListeners() method should be implemented by subclass."
        );

        // BOILERPLATE:
        //  const guessInput = document.getElementById(id);

        //  // Show suggestions based on what the user types into the input box
        //  guessInput.addEventListener("input", () => {
        //      // Show suggestions to the user
        //      this.showSuggestions();
        //  });

        //  guessInput.addEventListener("keydown", () => {
        //      // Handle guess when enter is pressed on input box
        //      if (event.key === "Enter") {
        //          return
        //      }
        //      // Unfocus input box when escape is pressed
        //      else if (event.key === "Escape") {
        //          guessInput.blur();
        //      }
        //  });

        //  guessInput.addEventListener("focus", () => {
        //      // Show suggestions to the user
        //      this.showSuggestions();
        //  });
    }
}

export default BaseSuggestionManager;
