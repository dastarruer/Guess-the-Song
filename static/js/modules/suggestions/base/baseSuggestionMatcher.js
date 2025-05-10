class BaseSuggestionMatcher {
    constructor({ suggestionList, suggestionContainerID }) {
        this.suggestionList = suggestionList;
        this.suggestionContainerID = suggestionContainerID;

        this.relevantSuggestions = null;
    }

    /** Get the list of suggestions most relevant to a given guess.
     * Uses the Levenshtein distance algorithm to find the distance between two strings. */
    getRelevantSuggestions(input) {
        if (input === undefined) {
            return;
        }
        //TODO: input is undefined for some reason fix it
        input = input.toLowerCase();

        // Filters the suggestion list to include suggestions where the title starts with the same 3 first letters as the guess, disregarding case
        const filtered = this.suggestionList.filter((suggestion) =>
            this.getSuggestionName(suggestion)
                .toLowerCase()
                .startsWith(input.slice(0, 3))
        );

        // Rearrange the list from closest to farthest away from the guess
        return filtered
            .sort((a, b) => {
                // Calculate Levenshtein distance for both suggestions' names, and whittle it down to the first three suggestions
                const distanceA = this.levenshteinDistance(
                    input,
                    this.getSuggestionName(a).toLowerCase()
                );
                const distanceB = this.levenshteinDistance(
                    input,
                    this.getSuggestionName(b).toLowerCase()
                );

                // Compare distances
                return distanceA - distanceB;
            })
            .slice(0, 3); // Take the first 3 characters of the string
    }

    /** Get the number of the relevant suggestions.
     * If this.relevantSuggestions is null, return 0.
     * Otherwse, return the length of this.relevantSuggestions.
     */
    numRelevantSuggestions() {
        // TODO: For some reason, genre suggestions are ALWAYS NULL SO KEYBOARD NAVIGATION DOESNT WORK AHSFDJKL; JASD;FLAKS but this code holds together guess suggestions so PLEASE DONT CHANGE
        if (this.relevantSuggestions === null) {
            return 0;
        } else {
            return this.relevantSuggestions.length;
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

    getSuggestionName(suggestion) {
        throw new Error(
            "getSuggestionName() method must be implemented by subclass."
        );
    }
}
export default BaseSuggestionMatcher;
