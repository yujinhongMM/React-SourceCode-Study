class Node {
  constructor(element, next) {
    this.element = element;
    this.next = next;
  }
}
class LinkedLit {
  constructor() {
    this.head = null;
    this.size = 0;
  }
  _node(index) {
    let current = this.head;
    for (let i = 0; i < index; i++) {
      current = current.next;
    }
    return current;
  }
  add(index, element) {
    if (arguments.length === 1) {
      element = index;
      index = this.size;
    }
    if (this.size == 0) {
      this.head = new Node(element, this.head);
    } else {
      let prevNode = this._node(index - 1); // 上一个节点
      prevNode.next = new Node(element, prevNode.next);
    }
    this.size++;
  }
  remove(index) {
    let removeNode = this.head;
    if (index >= this.size) {
      throw new Error.message("越界");
    }
    if (index === 0) {
      this.head = this.head.next;
    } else {
      let prevNode = this._node(index - 1);
      removeNode = prevNode;
      prevNode.next = prevNode.next.next;
    }
    this.size--;
    return removeNode;
  }
  console() {
    let current = this.head;
    for (let i = 0; i < this.size; i++) {
      console.log(`element: ${current.element},next: ${current.next}`)
      current = current.next;
    }
  }
  // 递归排序
  reverseRecursion() {
    function r(head) {
      if (head == null || head.next == null) {
        return head;
      }
      let newHead = r(head.next);
      head.next.next = head;
      head.next = null;
      return newHead;
    }
    this.head = r(this.head);
  }
  // 借助指针移动实现
  reverse() {
    let newHead = null;
    let head = this.head;
    while (head) {
      let temp = head.next;
      head.next = newHead;
      newHead = head;
      head = temp;
    }
    this.head = newHead;
  }
}

let ll = new LinkedLit();

ll.add(1);
ll.add(2);
ll.add(3);
ll.add(4);
console.log("====链表====");
ll.console();

ll.add(2, 100);
console.log("====插入====");
ll.console();

ll.remove(2);
console.log("====移除====");
ll.console();

ll.reverse();
console.log("====借助指针移动实现反转====");
ll.console();

ll.reverseRecursion();
console.log("====递归反转====");
ll.console()

// console.console(ll, { depth: 100 })