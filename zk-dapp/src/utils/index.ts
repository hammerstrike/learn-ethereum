
export const delay = async (time: number) => {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}