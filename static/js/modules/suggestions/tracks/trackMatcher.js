import BaseSuggestionMatcher from "../base/baseSuggestionMatcher.js";

class TrackMatcher extends BaseSuggestionMatcher {
    constructor(tracklist) {
        super({ suggestionList: tracklist });
    }

    /** Get the title of track */
    getSuggestionName(track) {
        return track.title;
    }
}
export default TrackMatcher;
