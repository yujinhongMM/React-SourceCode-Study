function ListNode(x) {
    this.val = x;
    this.next = null;
}
function mergeTwoLists(l1, l2) {
    console.log('%c [  l2 ]', 'font-size:13px; background:pink; color:#bf2c9f;', l2)
    console.log('%c [ l1 ]', 'font-size:13px; background:pink; color:#bf2c9f;', l1)
    if (l1 == null && l2 == null) {
        return null
    }
    if (l1 == null) {
        return l2;
    }
    if (l2 == null) {
        return l1;
    }
    let q = null;
    if (l1.val < l2.val) {
        q = new ListNode(l1.val);
        l1 = l1.next
    } else {
        q = new ListNode(l2.val);
        l2 = l2.next
    }
    let head = q;
    while (1) {
        console.log('%c [ q ]', 'font-size:13px; background:pink; color:#bf2c9f;', q)
        if (l1 === null) {
            q.next = l2;
            break;
        }
        if (l2 === null) {
            console.log('%c [ l2 ]', 'font-size:13px; background:pink; color:#bf2c9f;', l2)
            q.next = l1;
            break;
        }
        if (l1.val < l2.val) {
            q.next = l1;
            q = l1;
            l1 = l1.next
        } else {
            q.next = new ListNode(l2.val);
            l2 = l2.next
        }
        console.log('%c [ q111next ]', 'font-size:13px; background:pink; color:#bf2c9f;', q.next)
        q = q.next;

        return head;
    }
    module.exports = {
        mergeTwoLists: mergeTwoLists
    };
    let l1 = new ListNode(5)
    console.log('%c [ l1 ]', 'font-size:13px; background:pink; color:#bf2c9f;', l1.val)
    let l2 = new ListNode(1)
    l2.next = new ListNode(2)

    l2.next.next = new ListNode(4)
    console.log(mergeTwoLists(l1, l2))