class Node {
  constructor(element, parent) {
    this.element = element;
    this.parent = parent;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor() {
    this.root = null;
  }
  add(element) {
    if (this.root === null) {
      this.root = new Node(element);
    }
    let currentNode = this.root;
    if () {

    }
  }
}

let tree = new Tree();
[10, 8, 19, 6, 15, 22, 20].forEach(item => {
  tree.add(item);
})
