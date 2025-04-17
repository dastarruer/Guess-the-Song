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
        throw new Error("showSuggestions() method should be implemented by subclass.")
    } 
}

export default BaseSuggestionManager;
