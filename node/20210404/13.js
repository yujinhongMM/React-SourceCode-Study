/*
 * function TreeNode(x) {
 *   this.val = x;
 *   this.left = null;
 *   this.right = null;
 * }
 */

/**
 * 
 * @param root TreeNode类 the root of binary tree
 * @return int整型二维数组
 */
function threeOrders(root) {
    // write code here
    let arr1 = [];
    let arr2 = [];
    let arr3 = [];
    // 根左右
    const fun1 = (root) => {
        if (!root) {
            return;
        }
        arr1.push(root.val);
        fun1(root.left)
        fun1(root.right)
    }
    // 左根右
    const fun2 = (root) => {
        if (!root) {
            return;
        }
        fun2(root.left)
        arr2.push(root.val);
        fun2(root.right)
    }
    // 左右根
    const fun3 = (root) => {
        if (!root) {
            return;
        }
        fun3(root.left)
        fun3(root.right)
        arr3.push(root.val);
    }
    fun1(root);
    fun2(root);
    fun3(root);
    return ([arr1, arr2, arr3])
}
module.exports = {
    threeOrders: threeOrders
};