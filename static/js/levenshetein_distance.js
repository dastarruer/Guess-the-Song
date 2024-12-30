function levenshteinDistance(a, b) {
    let lenA = a.length;
    let lenB = b.length;

    let headA = a[0];
    let headB = b[0];

    let tailA = a.slice(1);
    let tailB = b.slice(1);

    if (lenA === 0) {
        return lenB;
    } else if (lenB === 0) {
        return lenA;
    }

    if (headA === headB) {
        return levenshteinDistance(tailA, tailB)
    }
}
console.log(levenshteinDistance("h", "hello"));
