// https://jsfiddle.net/PBrockmann/der72ot0/
export const getPercentileFromArray = (inpList: number[], percentile: number): number => {
    inpList = inpList.sort(function (a, b) { return a - b; });
    const index = (percentile / 100) * (inpList.length - 1);
    let result: number;
    if (Math.floor(index) == index) {
        result = inpList[index];
    } else {
        let i = Math.floor(index)
        let fraction = index - i;
        result = inpList[i] + (inpList[i + 1] - inpList[i]) * fraction;
    }
    return result;
};