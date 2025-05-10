import BaseSuggestionNavigator from "../base/baseSuggestionNavigator.js";

class TrackSuggestionNavigator extends BaseSuggestionNavigator {
    constructor(suggestionContainerID, inputBoxID) {
        super({ suggestionContainerID, inputBoxID });
    }
}

export default TrackSuggestionNavigator;
