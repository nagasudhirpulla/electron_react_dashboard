export const induceDelayAsync = (delayMs: number) => {
    return new Promise(function (resolve, reject) {
        setTimeout(() => {
            resolve();
        }, delayMs);
    });
};

const ensureTwoDigits = (num: number): string => {
    if (num >= 0 && num <= 9) {
        return "0" + num;
    }
    return "" + num;
};

export const convertDateToWbesUrlStr = (d: Date): string => {
    return `${ensureTwoDigits(d.getDate())}-${ensureTwoDigits(d.getMonth() + 1)}-${(d.getFullYear())}`;
}