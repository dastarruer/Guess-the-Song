import BaseSuggestionManager from "../baseSuggestionManager.js";

class TrackSuggestionManager extends BaseSuggestionManager {
    constructor(suggestionMatcher, suggestionNavigator, suggestionRenderer) {
        super({
            suggestionMatcher: suggestionMatcher,
            suggestionNavigator: suggestionNavigator,
            suggestionRenderer: suggestionRenderer,
        });
    }
}

export default TrackSuggestionManager;