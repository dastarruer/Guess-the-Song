import BaseSuggestionRenderer from "../../baseSuggestionRenderer";

class GenreSuggestionRenderer extends BaseSuggestionRenderer {
    constructor(suggestionContainerID) {
        super({ suggestionContainerID });
    }

    getGenreCoverURL(genre) {
        let genreCoverURL;

        if (genre.picture_big) {
            genreCoverURL = genre.picture_big;
        } else if (genre.picture_medium) {
            genreCoverURL = genre.picture_medium;
        } else {
            genreCoverURL = genre.picture_small;
        }
        return genreCoverURL;
    }

    getSuggestionHTML(genre) {
        const genreCoverUrl = this.getGenreCoverURL(genre);

        return `
                    <img class="suggestion-cover" src=${genreCoverUrl}>
                    <div class="suggestion-caption-container">
                        <p class="suggestion-title martian-mono">${genre.name}</p>
                    </div>
                `;
    }

    showSuggestions(relevantSuggestions, suggestionNavigator) {
        if (relevantSuggestions === null) {
            return;
        }

        // Clear the list so that the previous suggestions are not shown
        this.suggestionsElement.innerHTML = "";

        // Show the suggestions
        this.suggestionsElement.style.display = "block";

        for (const suggestion of relevantSuggestions) {
            // Create a list element to show the track
            const suggestionElement = document.createElement("li");
            suggestionElement.classList.add("suggestion-container");

            // The HTML of the suggestion
            suggestionElement.innerHTML = this.getSuggestionHTML(
                suggestion
            );
            this.suggestionsElement.appendChild(suggestionElement);
        }

        const suggestions = this.suggestionsElement.querySelectorAll(
            ".suggestion-container"
        );

        this.addEventListeners(suggestions, suggestionNavigator);
    }
}

export default GenreSuggestionRenderer;
