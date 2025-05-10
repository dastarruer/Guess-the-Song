import BaseSuggestionMatcher from "../base/baseSuggestionMatcher.js";

class TrackMatcher extends BaseSuggestionMatcher {
    constructor(tracklist, suggestionContainerID) {
        super({ suggestionList: tracklist, suggestionContainerID: suggestionContainerID });
    }

    /** Get the title of track */
    getSuggestionName(track) {
        return track.title;
    }
}
export default TrackMatcher;
