class GameManager {
    handleIncorrectGuess(firstGuessElement) {
        firstGuessElement.className = "incorrect-guess";
    }

    /**Handles logic if user guesses correctly.
     * Will firstly show a checkmark to indicate that the user has correctly guessed.
     * Then, the function will reveal the track name and album to the user.
     */
    handleCorrectGuess(firstGuessElement, trackName, trackCoverUrl) {
        const checkIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
                        <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"/>
                    </svg>`;

        // Show a green check to indicate that the user made a correct guess
        firstGuessElement.className = "correct-guess";
        firstGuessElement.innerHTML = checkIcon;

        this.showTrackInfo(trackName, trackCoverUrl);
    }

    /** Show the user the track name and album cover of the song. */
    showTrackInfo(trackName, trackCoverUrl) {
        const trackNameElement = document.getElementById("track-name");
        const artistImageElement = document.getElementById("artist-image");

        trackNameElement.textContent = trackName;
        artistImageElement.src = trackCoverUrl;
    }

    /** If the given guess is equal to the track name (disregarding case),
     * and there is not currently a correct guess, or the user has run out of guesses */
    verifyGuess(guess, trackName) {
        const correctGuessExists = this.isGuessLeft();
        return (
            !correctGuessExists &&
            guess.toLowerCase() === trackName.toLowerCase()
        );
    }

    /** Check if there is a correct-guess element.
     * This tells us that the user cannot guess again */
    isGuessLeft() {
        return document.querySelector(".correct-guess") !== null;
    }
}

export default GameManager;
