export const induceDelayAsync = function (delayMs: number) {
    return new Promise(function (resolve, reject) {
        setTimeout(() => {
            resolve();
        }, delayMs);
    });
};