class SuggestionProvider {
    /**
     * Initializes a new instance of the SuggestionProvider class.
     * @param {Object} artist - The artist object containing artist details.
     * @param {Array} tracklist - The list of tracks associated with the artist.
     */

    constructor(artist, tracklist) {
        this.artist = artist;
        this.tracklist = tracklist;

        this.guessInput = document.getElementById("input");
        this.currentSuggestionIndex = -1;
        this.relevantTracks = null;
    }

    getSongSuggestionItems() {
        let suggestionItems = document.getElementsByClassName(
            "suggestion-container"
        );
        console.log(suggestionItems);
        return suggestionItems;
    }

    /**
     * Displays song suggestions based on the user's input.
     * Filters the tracklist to find tracks whose titles start with the first
     * three characters of the user's guess, then sorts them by their
     * Levenshtein distance to the guess. The top three closest matches are
     * displayed in the suggestions container. Each suggestion includes the
     * track's cover image, title, and artist's name.
     */

    showSuggestions() {
        // Get the guess and convert it to lowercase
        const guess = this.guessInput.value.toLowerCase();

        // Set the relevant tracks to the first 3 characters of each track's title
        this.relevantTracks = this.tracklist.filter((track) =>
            track.title.toLowerCase().startsWith(guess.slice(0, 3))
        );

        // Sort the tracks from smallest to biggest distance from the guess
        this.relevantTracks = this.relevantTracks
            .sort((a, b) => {
                // Calculate Levenshtein distance for both tracks' names, and whittle it down to the first three tracks
                const distanceA = this.levenshteinDistance(
                    guess,
                    a.title.toLowerCase()
                );
                const distanceB = this.levenshteinDistance(
                    guess,
                    b.title.toLowerCase()
                );

                // Compare distances
                return distanceA - distanceB;
            })
            .slice(0, 3); // Take the first 3 characters of the string

        // The container that all suggestions are shown in
        const suggestions = document.getElementById("suggestions-container");

        // Clear the list so that the previous suggestions are not shown
        suggestions.innerHTML = "";

        // Show the suggestions
        suggestions.style.display = "block";

        for (const track of this.relevantTracks) {
            // Create a list element to show the track
            const suggestion = document.createElement("li");
            suggestion.classList.add("suggestion-container");
            suggestion.innerHTML = `
                    <img class="suggestion-cover" src=${track.album.cover}>
                    <div class="suggestion-caption-container">
                        <p class="suggestion-title martian-mono">${track.title}</p>
                        <p class="suggestion-artist semibold">${this.artist.name}</p>
                    </div>
                `;
            suggestions.appendChild(suggestion);
        }
    }

    navigateSuggestions(event) {
        let suggestionItems = this.getSongSuggestionItems();
        let firstSuggestionIndex = 0;
        let lastSuggestionIndex = this.relevantTracks.length - 1;
        let defaultSuggestionIndex = -1;

        console.log(this.currentSuggestionIndex);
        if (this.currentSuggestionIndex < defaultSuggestionIndex) {
            this.currentSuggestionIndex = firstSuggestionIndex;
        } else if (event.key === "ArrowUp") {
            // Check if the currentSuggestionIndex is within the bounds of the suggestion list
            if (this.currentSuggestionIndex > firstSuggestionIndex) {
                // Remove the highlight of the current suggestion
                suggestionItems[this.currentSuggestionIndex].classList.remove(
                    "highlight"
                );
            }

            // This makes sure that this.currentSuggestionIndex never goes under firstSuggestionIndex
            this.currentSuggestionIndex = Math.max(
                firstSuggestionIndex,
                this.currentSuggestionIndex - 1
            );

            suggestionItems[this.currentSuggestionIndex].classList.add(
                "highlight"
            );
        } else if (event.key === "ArrowDown") {
            // Check if the currentSuggestionIndex is within the bounds of the suggestion list
            if (this.currentSuggestionIndex < lastSuggestionIndex && this.currentSuggestionIndex >= firstSuggestionIndex) {
                // Remove the highlight of the current suggestion
                suggestionItems[this.currentSuggestionIndex].classList.remove(
                    "highlight"
                );
            }

            // This makes sure that this.currentSuggestionIndex never goes over lastSuggestionIndex
            this.currentSuggestionIndex = Math.min(
                lastSuggestionIndex,
                this.currentSuggestionIndex + 1
            );

            suggestionItems[this.currentSuggestionIndex].classList.add("highlight");
        }
    }

    // Calculate the levenshtein distance between two given strings
    levenshteinDistance(a, b) {
        const lenA = a.length,
            lenB = b.length;

        const d = Array.from({ length: lenA + 1 }, () =>
            Array(lenB + 1).fill(0)
        );

        for (let i = 0; i <= lenA; i++) d[i][0] = i;
        for (let j = 0; j <= lenB; j++) d[0][j] = j;

        for (let i = 1; i <= lenA; i++) {
            for (let j = 1; j <= lenB; j++) {
                if (a[i - 1] === b[j - 1]) {
                    d[i][j] = d[i - 1][j - 1];
                } else {
                    d[i][j] = Math.min(
                        d[i - 1][j] + 1, // Deletion
                        d[i][j - 1] + 1, // Insertion
                        d[i - 1][j - 1] + 1 // Substitution
                    );
                }
            }
        }
        return d[lenA][lenB];
    }
}
export default SuggestionProvider;
