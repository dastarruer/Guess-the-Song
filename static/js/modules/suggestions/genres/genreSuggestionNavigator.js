import BaseSuggestionNavigator from "../base/baseSuggestionNavigator.js";

class GenreSuggestionNavigator extends BaseSuggestionNavigator {
    constructor(suggestionContainerID, inputBoxID) {
        super({ suggestionContainerID, inputBoxID });
    }
}

export default GenreSuggestionNavigator;