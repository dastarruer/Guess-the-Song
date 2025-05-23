// TODO: Replace raw html strings

import ArtistPlayer from "./artistPlayer.js";
import TrackSuggestionRenderer from "./suggestions/tracks/trackSuggestionRenderer.js";
import TrackSuggestionNavigator from "./suggestions/tracks/trackSuggestionNavigator.js";
import TrackMatcher from "./suggestions/tracks/trackMatcher.js";
import TrackSuggestionManager from "./suggestions/tracks/trackSuggestionManager.js";

class GameManager {
    constructor() {
        this.suggestionManager = null;
        this.score = 0;
        this.updateScore();
    }

    handleIncorrectGuess(firstGuessElement, track) {
        if (this.livesLeft <= 1) {
            this.showRestartButton("lose");

            // Clear and hide suggestions
            this.suggestionManager.suggestionMatcher.relevantSuggestions = [];
            this.suggestionManager.suggestionRenderer.hideSuggestions();

            this.showTrackInfo(
                track.title,
                this.suggestionManager.suggestionRenderer.getTrackCoverURL(
                    track
                )
            );

            // Reset user score
            this.score = 0;
            this.updateScore();
        } else {
            this.livesLeft -= 1;
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

        this.showTrackInfo(
            track.title,
            this.suggestionManager.suggestionRenderer.getTrackCoverURL(track)
        );

        // Show the restart button
        this.showRestartButton("win");

        // Clear and hide suggestions
        this.suggestionManager.suggestionMatcher.relevantSuggestions = [];
        this.suggestionManager.suggestionRenderer.hideSuggestions();

        // Increment user's score
        this.score += 1;
        this.updateScore();
    }

    /** Handle the guess differently depending on whether it is correct or
     * incorrect using the hnadlceCorrectGuess() and handleIncorrectGuess()
     * functions within the GameManager object. */
    handleGuess(guess) {
        const firstGuessElement = document.querySelectorAll(".guess")[0];

        const track = this.player.track;

        if (!this.isGuessAllowed(guess)) {
            return;
        }

        // If the guess is correct and valid
        if (this.verifyGuess(guess, track)) {
            this.handleCorrectGuess(firstGuessElement, track);
        } else {
            this.handleIncorrectGuess(firstGuessElement, track);
        }
    }

    isGuessAllowed(guess) {
        return (
            guess.trim() !== "" &&
            document.getElementsByClassName("correct-guess").length < 1
        );
    }

    updateScore() {
        document.getElementById("score").innerHTML = `Score:<br>${this.score}`;
    }

    // TODO: Convert to enum
    /** Show the restart button, with different text and a different icon depending on if the user won or lost the game.
     * @param {string} outcome - A string with the outcome. Can either be "win" or "lose".
     */
    showRestartButton(outcome) {
        // Show the restart button
        const restartButton = document.getElementById("restart-btn");
        restartButton.classList.remove("hidden");

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
            restartButtonIcon.outerHTML = winIcon; // Set the icon to an arrow icon, signifying that the user has to move on
            restartButtonText.innerText = "Next";
        } else if (outcome === "lose") {
            restartButtonIcon.outerHTML = lossIcon; // Set the icon to a restart icon, signifying that the user has to try again
            restartButtonText.innerText = "Try again";
        }
    }

    hideRestartButton() {
        document.getElementById("restart-btn").classList.add("hidden");
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
    verifyGuess(guess, track) {
        return (
            !this.isGuessLeft() &&
            this.livesLeft !== 0 &&
            guess.toLowerCase() === track.title.toLowerCase()
        );
    }

    /** Check if there is a correct-guess element.
     * This tells us that the user cannot guess again */
    isGuessLeft() {
        return document.querySelector(".correct-guess") !== null;
    }

    clearInputBox() {
        const input = document.getElementById("input");
        input.value = "";
    }

    /** Start the game by initializing the ArtistPlayer, SuggestionNavigator, TrackMatcher, and SuggestionRenderer objects.
     * Rotate the restart icon as well to indicate to the user that the game is loading. */
    async startGame(totalLives, genre) {
        const restartButtonIcon = document.getElementById("restart-btn-icon");
        const livesCounter = document.getElementById("lives-counter");
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
        await this.player.setTrack(genre);

        const suggestionContainerID = "guess-suggestions";

        let trackMatcher = new TrackMatcher(
            this.player.tracklist,
            suggestionContainerID
        );
        let suggestionNavigator = new TrackSuggestionNavigator(
            suggestionContainerID,
            "input"
        );
        let suggestionRenderer = new TrackSuggestionRenderer(
            suggestionContainerID
        );

        // If there is not an already created instance of the suggestion manager, create it
        if (this.suggestionManager === null) {
            this.suggestionManager = new TrackSuggestionManager(
                trackMatcher,
                suggestionNavigator,
                suggestionRenderer,
                this
            );
        } else {
            // Manually assign variables because in the constructor of TrackSuggestionManager, event listeners are added every time a new instance is initialized. This is my way of circumventing that
            // TODO: fix this bro what
            this.suggestionManager.trackMatcher = trackMatcher;
            this.suggestionManager.suggestionNavigator = suggestionNavigator;
            this.suggestionManager.suggestionRenderer = suggestionRenderer;
        }

        // Clear livesCounter
        livesCounter.innerHTML = "";
        for (let i = 0; i < totalLives; i++) {
            livesCounter.innerHTML += livesIcon;
        }
        this.livesLeft = totalLives;

        // Stop rotating the icon
        restartButtonIcon.classList.remove("rotate");

        // Hide these so that the user doesn't see them in the next game
        this.suggestionManager.suggestionRenderer.hideSuggestions();
        this.clearInputBox();
        this.hideRestartButton();
    }

    showGameElements(totalLives, genre) {
        // Hide genre search container
        document.getElementById("genre-container").classList.add("hidden");

        // Show game container
        document.getElementById("game-container").classList.remove("hidden");

        // Add the necessary event listeners
        this.addEventListeners(totalLives, genre);
    }

    addEventListeners(lives, genre) {
        const playPauseBtn = document.getElementById("play-track");
        const restartButton = document.getElementById("restart-btn");
        const submitButton = document.getElementById("submit-btn");

        // Play/pause audio once play button is clicked
        playPauseBtn.addEventListener("click", () => {
            this.player.playPauseTrack();
        });

        // Handle guess when submit button is clicked
        submitButton.addEventListener("mousedown", () => {
            console.log("submit button pressed");
            this.handleGuess(this.suggestionManager.getGuess());
        });

        // Restart game when restart button is clicked
        restartButton.addEventListener("click", async () => {
            await this.startGame(lives, genre);
        });
    }
}

export default GameManager;
