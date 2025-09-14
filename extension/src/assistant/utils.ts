export interface StringDifference {
    text: string,
    index: number
}

export function stringDifference(long: string, short: string)
{
    let result = <StringDifference[]>[];

    if (short.length > long.length) {
        return stringDifference(short, long);
    }

    if (short.toLowerCase() == long.toLowerCase()) {
        return {ratio: 1.0, difference: result};
    }

    if (!long.length) {
        return {ratio: 1.0, difference: result};
    }

    if (!short.length) {
        result.push(<StringDifference>{
            text: long,
            index: 0
        });
        return {ratio: 1.0, difference: result};
    }

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

    return {
        ratio: shortIndex / Math.max(1, short.length),
        difference: result
    };
}

export function stringDifferenceWithTh(mainStr: string, insertStr: string, ratioThreshold: number = 0.5) {
    if (!mainStr || !insertStr || mainStr.toLowerCase() == insertStr.toLowerCase()) {
        return {
            ratio: 1.0,
            difference: <StringDifference[]>[]
        };
    }

    const minLen = Math.min(mainStr.length, insertStr.length);
    for (let i = 0; i < minLen; i++) {
        let diff = stringDifference(insertStr, mainStr.substring(i));

        const ratio = (diff.ratio + (1.0 - i / Math.max(minLen, 1))) / 2;
        if (ratio >= ratioThreshold) {
            for (let j = 0; j < diff.difference.length; j++) {
                diff.difference[j].index += i;
            }
            return {
                ratio: ratio,
                difference: diff.difference
            };
        }
    }

    return {
        ratio: 0.0,
        difference: <StringDifference[]>[]
    };
}

export function insertDifference(mainStr: string, difference: StringDifference[]) {
    for (let i = difference.length-1; i >= 0; i--) {
        mainStr =
            mainStr.substring(0, difference[i].index) +
            difference[i].text +
            mainStr.substring(difference[i].index);
    }
    return mainStr;
}