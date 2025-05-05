import GenreMatcher from "./genreMatcher.js";
import GenreSuggestionNavigator from "./genreSuggestionNavigator.js";
import GenreSuggestionRenderer from "./genreSuggestionRenderer.js";

import BaseSuggestionManager from "../base/baseSuggestionManager.js";

class GenreSuggestionManager extends BaseSuggestionManager {
    constructor(genres) {
        const suggestionContainerID = "genre-suggestions";

        super({
            suggestionMatcher: new GenreMatcher(genres),
            suggestionNavigator: new GenreSuggestionNavigator(
                suggestionContainerID
            ),
            suggestionRenderer: new GenreSuggestionRenderer(
                suggestionContainerID
            ),
        });

        this.addEventListeners();
    }

    showSuggestions() {
        this.suggestionRenderer.showSuggestions(
            this.suggestionMatcher.relevantSuggestions,
            this.suggestionNavigator
        );
    }

    addEventListeners() {
        const input = document.getElementById("search-input");

        // Show suggestions based on what the user types into the input box
        input.addEventListener("input", () => {
            console.log("hello")
            // Show suggestions to the user
            this.showSuggestions();
        });

        input.addEventListener("keydown", () => {
            // Handle guess when enter is pressed on input box
            if (event.key === "Enter") {
                return;
            }
            // Unfocus input box when escape is pressed
            else if (event.key === "Escape") {
                input.blur();
            }
        });

        input.addEventListener("focus", () => {
            // Show suggestions to the user
            this.showSuggestions();
        });
    }
}

export default GenreSuggestionManager;
