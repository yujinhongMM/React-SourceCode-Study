export function push(heap, node) {
    const index = heap.length;
    heap.push(node);
    siftUp(heap, node, index);
}
export function peek(heap) {
    const first = heap[0];
    return first === undefined ? null : first;
}
export function pop(heap) {
    const first = heap[0];
    if (first !== undefined) {
        const last = heap.pop();
    if (last !== first) {
        heap[0] = last;
        siftDown(heap, last, 0);
    }
        return first;
    } else {
        return null;
    }
}

function siftUp(heap, node, i) {
    let index = i;
    while (true) {
        const parentIndex = index - 1 >>> 1;
        const parent = heap[parentIndex];
        if (parent !== undefined && compare(parent, node) > 0) {
            heap[parentIndex] = node;
            heap[index] = parent;
            index = parentIndex;
        } else {
            return;
        }
    }
}

function siftDown(heap, node, i) {
    let index = i;
    const length = heap.length;
    while (index < length) {
        const leftIndex = (index + 1) * 2 - 1;
        const left = heap[leftIndex];
        const rightIndex = leftIndex + 1;
        const right = heap[rightIndex]; 
        if (left !== undefined && compare(left, node) < 0) {
            if (right !== undefined && compare(right, left) < 0) {
                heap[index] = right;
                heap[rightIndex] = node;
                index = rightIndex;
            } else {
                heap[index] = left;
                heap[leftIndex] = node;
                index = leftIndex;
            }
        } else if (right !== undefined && compare(right, node) < 0) {
            heap[index] = right;
            heap[rightIndex] = node;
            index = rightIndex;
        } else {
            return;
        }
    }
}

function compare(a, b) {
    const diff = a.sortIndex - b.sortIndex;
    return diff !== 0 ? diff : a.id - b.id;
}