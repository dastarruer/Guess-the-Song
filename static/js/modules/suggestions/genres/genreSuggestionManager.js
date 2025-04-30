import GenreMatcher from "./genreMatcher";
import GenreSuggestionNavigator from "./genreSuggestionNavigator";
import GenreSuggestionRenderer from "./genreSuggestionRenderer";

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
