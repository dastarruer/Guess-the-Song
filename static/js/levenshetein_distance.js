function levenshteinDistance(a, b) {
    lenA = a.length;
    lenB = b.length;

    if (lenA === 0) {
        return lenB;
    } else if (lenB === 0) {
        return lenA;
    }
}
console.log(levenshteinDistance("", "hello"));
