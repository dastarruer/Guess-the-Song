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
        return levenshteinDistance(tailA, tailB);
    }

    return (
        Math.min(
            levenshteinDistance(tailA, b),
            levenshteinDistance(a, tailB),
            levenshteinDistance(tailA, tailB)
        ) + 1
    );
}

const start = performance.now();
console.log(levenshteinDistance("kitten", "sitting"))
const end = performance.now();

console.log(`Execution time: ${end - start} milliseconds`);
