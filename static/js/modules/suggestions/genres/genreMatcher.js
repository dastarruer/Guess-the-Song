import BaseSuggestionMatcher from "../base/baseSuggestionMatcher.js";

class GenreMatcher extends BaseSuggestionMatcher {
    constructor(genres, suggestionContainerID) {
        super({
            suggestionList: genres,
            suggestionContainerID: suggestionContainerID,
        });
    }

    // Why am I overwriting this? because the default and normal implementation doesn't work. kill me
    numRelevantSuggestions() {
        return document
            .getElementById(this.suggestionContainerID)
            .querySelectorAll(".suggestion-container").length;
    }

    getSuggestionName(genre) {
        return genre.name;
    }
}

export default GenreMatcher;
