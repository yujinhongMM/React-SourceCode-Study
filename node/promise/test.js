class Node {
  constructor(element) {
    this.element = element;
    this.parent = null;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor() {
    this.root = null;
  }
  add(element) {
    if (!this.root) {
      return this.root = new Node(element);
    }
    let currnetNode = this.root;
    let parentNode;
    let compare;
    while (currnetNode) {
      compare = currnetNode.element > element;
      parentNode = currnetNode;
      if (compare) {
        currnetNode = currnetNode.left;
      } else {
        currnetNode = currnetNode.right;
      }
    }
    let node = new Node(element);
    if (compare) {
      parentNode.left = node;
    } else {
      parentNode.right = node;
    }
  }
}

let tree = new Tree();
[10, 8, 19, 6, 15, 22, 20].forEach(item => {
  tree.add(item);
});
console.dir(tree, { depth: 1000 });