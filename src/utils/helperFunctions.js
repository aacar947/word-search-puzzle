export function randomInt(number) {
    let min = 0, max = number;
    if (arguments.length >= 2) {
        min = arguments[0];
        max = arguments[1];
    }
    return Math.floor(Math.random() * (max - min) + min);
}

export function clamp(number, min, max) {
    return (Math.max(Math.min(number, max), min))
}