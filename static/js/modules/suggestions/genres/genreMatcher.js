import BaseSuggestionMatcher from "../base/baseSuggestionMatcher.js";

class GenreMatcher extends BaseSuggestionMatcher {
    constructor(genres) {
        super({ suggestionList: genres });
    }

    getSuggestionName(genre) {
        return genre.name;
    }
}

export default GenreMatcher;
