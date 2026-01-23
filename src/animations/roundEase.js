export const roundEase = (steps = 100) => {
    return function(t) {
        return Math.round(t * steps) / steps;
    };
};
