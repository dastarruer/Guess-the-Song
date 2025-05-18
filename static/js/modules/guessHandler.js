class GuessHandler {
    constructor(gameManager) {
        this.gameManager = gameManager;
    }

    handleIncorrectGuess(firstGuessElement) {
        if (gameManager.livesLeft <= 1) {
            this.gameManager.showRestartButton("lose");

            // Clear and hide suggestions
            this.gameManager.suggestionManager.suggestionMatcher.relevantSuggestions =
                [];
            this.gameManager.suggestionManager.suggestionRenderer.hideSuggestions();
        } else {
            this.gameManager.livesLeft -= 1;
        }

        firstGuessElement.className = "incorrect-guess";
    }

    /**Handles logic if user guesses correctly.
     * Will firstly show a checkmark to indicate that the user has correctly guessed.
     * Then, the function will reveal the track name and album to the user.
     */
    handleCorrectGuess(firstGuessElement, track) {
        const checkIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
                        <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"/>
                    </svg>`;

        // Show a green check to indicate that the user made a correct guess
        firstGuessElement.className = "correct-guess";
        firstGuessElement.innerHTML = checkIcon;

        this.gameManager.showTrackInfo(
            track.title,
            this.gameManager.suggestionManager.suggestionRenderer.getTrackCoverURL(
                track
            )
        );

        // Show the restart button
        this.gameManager.showRestartButton("win");

        // Clear and hide suggestions
        this.gameManager.suggestionManager.suggestionMatcher.relevantSuggestions =
            [];
        this.gameManager.suggestionManager.suggestionRenderer.hideSuggestions();
    }

    /** Handle the guess differently depending on whether it is correct or
     * incorrect using the hnadlceCorrectGuess() and handleIncorrectGuess()
     * functions within the GameManager object. */
    handleGuess(guess, gameManager) {
        const firstGuessElement = document.querySelector(".guess");
        const track = gameManager.player.track;

        if (this.canUserGuess(guess)) {
            return;
        }

        // If the guess is correct and valid
        if (this.verifyGuess(guess, track)) {
            this.handleCorrectGuess(firstGuessElement, track);
        } else {
            this.handleIncorrectGuess(firstGuessElement);
        }
    }

    canUserGuess(guess) {
        return !(
            guess === "" ||
            document.getElementsByClassName("correct-guess").length == 1
        );
    }
}
