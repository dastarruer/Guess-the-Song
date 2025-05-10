import BaseSuggestionManager from "../base/baseSuggestionManager.js";

class TrackSuggestionManager extends BaseSuggestionManager {
    constructor(
        suggestionMatcher,
        suggestionNavigator,
        suggestionRenderer,
        gameManager
    ) {
        super({
            suggestionMatcher: suggestionMatcher,
            suggestionNavigator: suggestionNavigator,
            suggestionRenderer: suggestionRenderer,
        });

        this.addEventListeners(gameManager);
    }

    showSuggestions(player) {
        this.suggestionRenderer.showSuggestions(
            this.suggestionMatcher.relevantSuggestions,
            this.suggestionNavigator,
            player.artist
        );
    }

    // TODO: Remove the unnecessary gameManger stuff
    addEventListeners(gameManager) {
        const guessInput = document.getElementById("input");

        // Show suggestions based on what the user types into the input box
        guessInput.addEventListener("input", () => {
            if (gameManager.livesLeft <= 1) {
                return;
            }

            const guess = this.getGuess();

            if (guess === "") {
                this.suggestionRenderer.hideSuggestions();
                return;
            }

            // Unfocus the suggestions by resetting the index to its default
            this.suggestionNavigator.currentSuggestionIndex =
                -1;

            this.updateRelevantSuggestions(guess);

            // If there are no relevant tracks, don't show suggestions
            if (
                this.suggestionMatcher.numRelevantSuggestions() ===
                0
            ) {
                this.suggestionRenderer.hideSuggestions();
                return;
            }

            // Show suggestions to the user
            this.showSuggestions(gameManager.player);
        });

        guessInput.addEventListener("keydown", () => {
            // Handle guess when enter is pressed on input box
            if (event.key === "Enter") {
                gameManager.handleGuess(this.getGuess());
            }
            // Unfocus input box when escape is pressed
            else if (event.key === "Escape") {
                guessInput.blur();
            }
        });

        guessInput.addEventListener("focus", () => {
            console.log("hello")
            // Show suggestions to the user
            this.showSuggestions(gameManager.player);
        });

        // Navigate suggestions with arrow keys
        document.addEventListener("keydown", (event) => {
            this.navigateSuggestions(event);
        });
    }

    getGuess() {
        return document.getElementById("input").value.trim();
    }
}

export default TrackSuggestionManager;
