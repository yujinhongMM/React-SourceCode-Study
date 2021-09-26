var twoSum = function (numbers, target) {
    const len = numbers.length;
    let arr = new Map();
    for (let i = 0; i < len; i++) {
        console.log('[ i ]', i)
        arr.set(target - numbers[i], i)
    }
    console.log('%c [ arr ]', 'font-size:13px; background:pink; color:#bf2c9f;', arr)
    for (let i = 0; i < len; i++) {
        if (arr.has(numbers[i])) {
            if (arr.get(numbers[i]) == i) {
                continue;
            }
            if (i < arr.get(numbers[i])) {
                return [i, arr.get(numbers[i])]
            }
            return [arr.get(numbers[i]), i]
        }
    }
};

console.log(twoSum([3, 2, 4], 6))