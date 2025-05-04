import GenreMatcher from "./genreMatcher.js";
import GenreSuggestionNavigator from "./genreSuggestionNavigator.js";
import GenreSuggestionRenderer from "./genreSuggestionRenderer.js";

import BaseSuggestionManager from "../base/baseSuggestionManager.js";

class GenreSuggestionManager extends BaseSuggestionManager {
    constructor(genres) {
        const suggestionContainerID = "genre-suggestions";

        super({
            suggestionMatcher: new GenreMatcher(genres),
            suggestionNavigator: new GenreSuggestionNavigator(suggestionContainerID),
            suggestionRenderer: new GenreSuggestionRenderer(suggestionContainerID),
        });
    }

    showSuggestions() {
        this.suggestionRenderer.showSuggestions(
            this.suggestionMatcher.relevantSuggestions,
            this.suggestionNavigator
        );
    }
}

export default GenreSuggestionManager;
