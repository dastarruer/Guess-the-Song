import BaseSuggestionManager from "../base/baseSuggestionManager";

class TrackSuggestionManager extends BaseSuggestionManager {
    constructor(suggestionMatcher, suggestionNavigator, suggestionRenderer) {
        super({
            suggestionMatcher: suggestionMatcher,
            suggestionNavigator: suggestionNavigator,
            suggestionRenderer: suggestionRenderer,
        });
    }

    showSuggestions(player) {
        this.suggestionRenderer.showSuggestions(
            this.suggestionMatcher.relevantSuggestions,
            this.suggestionNavigator,
            player.artist
        );
    }
}

export default TrackSuggestionManager;