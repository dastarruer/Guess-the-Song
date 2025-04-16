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
}

export default BaseSuggestionManager;
