// TODO: Replace raw html strings

import ArtistPlayer from "./artistPlayer.js";
import SuggestionRenderer from "./suggestions/suggestionRenderer.js";
import SuggestionNavigator from "./suggestions/suggestionNavigator.js";
import TrackMatcher from "./suggestions/trackMatcher.js";

class GameManager {
    handleIncorrectGuess(firstGuessElement) {
        if (this.livesLeft <= 1) {
            this.showRestartButton("lose");
        } else {
            this.livesLeft -= 1;
        }

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

        // Show the restart button
        this.showRestartButton("win");
        const restartButtonText = document.getElementById("restart-btn-text");
        restartButtonText.innerText = "Next";
    }

    // TODO: Convert to enum
    /** Show the restart button, with different text and a different icon depending on if the user won or lost the game.
     * @param {string} outcome - A string with the outcome. Can either be "win" or "lose".
     */
    showRestartButton(outcome) {
        // Show the restart button
        document.getElementById("restart-btn").style.display = "flex";

        const restartButtonText = document.getElementById("restart-btn-text");
        const restartButtonIcon = document.getElementById("restart-btn-icon");
        const winIcon = `<svg 
                        id="restart-btn-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor" class="bi bi-forward" viewBox="0 0 16 16">
                        <path
                            d="M9.502 5.513a.144.144 0 0 0-.202.134V6.65a.5.5 0 0 1-.5.5H2.5v2.9h6.3a.5.5 0 0 1 .5.5v1.003c0 .108.11.176.202.134l3.984-2.933.042-.028a.147.147 0 0 0 0-.252l-.042-.028zM8.3 5.647a1.144 1.144 0 0 1 1.767-.96l3.994 2.94a1.147 1.147 0 0 1 0 1.946l-3.994 2.94a1.144 1.144 0 0 1-1.767-.96v-.503H2a.5.5 0 0 1-.5-.5v-3.9a.5.5 0 0 1 .5-.5h6.3z"/>
                        </svg>`;
        const lossIcon = `<svg
                        id="restart-btn-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        class="bi bi-arrow-repeat"
                        viewBox="0 0 16 16">
                        <path
                            d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41m-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9" />
                        <path
                            fill-rule="evenodd"
                            d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5 5 0 0 0 8 3M3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9z" />
                        </svg>`;

        if (outcome === "win") {
            restartButtonIcon.outerHTML = winIcon; // Set the icon to an arrow icon, signifying that they have to move on
            restartButtonText.innerText = "Next";
        } else if (outcome === "lose") {
            restartButtonIcon.outerHTML = lossIcon; // Set the icon to a restart icon, signifying that they have to try again
            restartButtonText.innerText = "Try again";
        }
    }

    hideRestartButton() {
        document.getElementById("restart-btn").style.display = "none";
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
        return (
            !this.isGuessLeft() &&
            this.livesLeft !== 0 &&
            guess.toLowerCase() === trackName.toLowerCase()
        );
    }

    /** Check if there is a correct-guess element.
     * This tells us that the user cannot guess again */
    isGuessLeft() {
        return document.querySelector(".correct-guess") !== null;
    }

    /** Start the game by initializing the ArtistPlayer, SuggestionNavigator, TrackMatcher, and SuggestionRenderer objects.
     * Rotate the restart icon as well to indicate to the user that the game is loading. */
    async startGame(totalLives) {
        const restartButtonIcon = document.getElementById("restart-btn-icon");
        const livesCounter = document.getElementById("success-message");
        const livesIcon = `<div class="guess">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    class="bi bi-x-lg"
                                    viewBox="0 0 16 16">
                                    <path
                                        d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                                </svg>
                            </div>`;

        // Rotate icon while waiting for game to start
        restartButtonIcon.classList.add("rotate");

        this.player = new ArtistPlayer();
        await this.player.setTrack();

        this.suggestionNavigator = new SuggestionNavigator();
        this.trackMatcher = new TrackMatcher(this.player.tracklist);
        this.songSuggestions = new SuggestionRenderer(this.player.artist);

        // Clear livesCounter
        livesCounter.innerHTML = "";
        for (let i = 0; i < totalLives; i++) {
            livesCounter.innerHTML += livesIcon;
        }
        this.livesLeft = totalLives;

        // Stop rotating the icon
        restartButtonIcon.classList.remove("rotate");

        this.hideRestartButton();
    }
}

export default GameManager;
