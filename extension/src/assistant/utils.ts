export interface StringDifference {
    text: string,
    index: number
}

export function mergeStrings(str1: string, str2: string, minOverlap: number = 0): string {
    const max_possible = Math.min(str1.length, str2.length);
    for (let overlap = max_possible; overlap > minOverlap; overlap-- ) {
        if( str1.endsWith(str2.substring(0, overlap)) ) {
            return str1 + str2.substring(overlap, str2.length);
        }
    }

    if (minOverlap > 0) {
        return '';
    }

    return str1 + str2;
}

export function stringDifference(str1: string, str2: string)
{
    let short = str1;
    let long = str2;
    if (str1.length > str2.length) {
        long = str1;
        short = str2;
    }

    let result = <StringDifference[]>[];
    let substring = '';
    let shortIndex = 0;
    for (let i = 0; i < long.length; i++) {
        const longChar = long[i];
        const shortChar = shortIndex < short.length ? short[shortIndex] : '';

        if (longChar != shortChar) {
            substring += longChar;
            continue;
        }

        shortIndex += 1;
        if (substring) {
            result.push(<StringDifference>{
                text: substring,
                index: i - substring.length,
            });

            substring = '';
        }

    }

    if (substring) {
        result.push(<StringDifference>{
            text: substring,
            index: long.length - substring.length,
        });
    }

    return result;
}
