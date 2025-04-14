class TrackMatcher {
    constructor(tracklist) {
        this.tracklist = tracklist;

        this.relevantTracks = null;
    }

    /** Get the list of tracks most relevant to a given guess. 
     * Uses the Levenshtein distance algorithm to find the distance between two strings. */
    getRelevantTracks(guess) {
        guess = guess.toLowerCase();

        // Filters the tracklist to include tracks where the title starts with the same 3 first letters as the guess, disregarding case
        const filtered = this.tracklist.filter((track) =>
            track.title.toLowerCase().startsWith(guess.slice(0, 3))
        );

        // Rearrange the list from closest to farthest away from the guess
        return filtered
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
    }

    /** Get the number of the relevant tracks.
     * If this.relevantTracks is null, return 0.
     * Otherwse, return the length of this.relevantTracks.
     */
    numRelevantTracks() {
        if (this.relevantTracks === null) {
            return 0;
        } else {
            return this.relevantTracks.length;
        }
    }

    /** Calculate the levenshtein distance between two given strings */
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
export default TrackMatcher;
