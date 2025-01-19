class SuggestionProvider {
    constructor(artist, tracklist) {
        this.artist = artist;
        this.tracklist = tracklist;

        this.guessInput = document.getElementById("input");
        this.relevantTracks = null;
    }

    // Show suggestions to the user
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
            .slice(0, 3);

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
                        <p class="suggestion-title">${track.title}</p>
                        <p class="suggestion-artist">${this.artist.name}</p>
                    </div>
                `;
            suggestions.appendChild(suggestion);
        }
    }

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
