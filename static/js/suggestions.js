class SuggestionProvider {
    showSuggestions(guessInput, artist, tracklist) {
        const guess = guessInput.value.toLowerCase();
        let relevantTracks = tracklist.filter((track) =>
            track.title.toLowerCase().startsWith(guess.slice(0, 3))
        );
        relevantTracks = tracklist
            .sort((a, b) => {
                // Calculate Levenshtein distance for both tracks' names
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
        const suggestions = document.getElementById("suggestions-container");

        // Clear the list so that the previous suggestions are not shown
        suggestions.innerHTML = "";
        suggestions.style.display = "block";
        for (const track of relevantTracks) {
            console.log("adding suggestion")
            const suggestion = document.createElement("li");
            suggestion.innerHTML = `
                    <li tabindex="0" class="suggestion-container">
                        <img class="suggestion-cover" src=${track.album.cover}>
                        <div class="suggestion-caption-container">
                            <p class="suggestion-title">${track.title}</p>
                            <p class="suggestion-artist">${artist.name}</p>
                        </div>
                    </li>
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
