
function print(head) {
  let a = head
  while (a) {
    console.log(a)
    a = a.next
  }
}
function obj(data) {
  return {
    next: null,
    data
  }
}
let head = null;
let now = null;
for (let i = 1; i < 6; i++) {
  let one = obj(i);
  if (!head) {
    head = one;
    now = one;
  } else {
    now.next = one;
    now = one;
  }
}



let newNext = null;
let newHead = head;

newNext = head.next.next;//3
newHead = head.next;//2
newHead.next = head;// 2->1
head.next = null;
while (newNext) {
  let a = newNext; // =>3
  newNext = newNext.next; // => 4
  a.next = newHead; // 
  newHead = a;
  //console.log("----", newHead)
}
print(newHead);
