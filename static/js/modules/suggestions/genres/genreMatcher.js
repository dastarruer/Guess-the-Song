import BaseSuggestionMatcher from "../base/baseSuggestionMatcher.js";

class GenreMatcher extends BaseSuggestionMatcher {
    constructor(genres, suggestionContainerID) {
        super({
            suggestionList: genres,
            suggestionContainerID: suggestionContainerID,
        });
    }

    getSuggestionName(genre) {
        return genre.name;
    }
}

export default GenreMatcher;
