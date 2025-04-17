import BaseSuggestionMatcher from "../baseSuggestionMatcher";

class GenreMatcher extends BaseSuggestionMatcher {
    constructor(genres) {
        super({ suggestionList: genres });
    }

    getSuggestionName(genre) {
        return genre.name;
    }
}

export default GenreMatcher;
