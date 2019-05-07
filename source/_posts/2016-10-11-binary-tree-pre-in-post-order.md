---
title: 根据前序、中序构造二叉树，并输出后序
categories: 数据结构
tags:
- 数据结构
- 二叉树
- 遍历
---

用js写的根据前序、中序构造二叉树，并输出后序的一段代码，不知道有没有问题。

先上树：

```
        A
      /   \
     B     C
    / \   / \
   D   E F   G
  /
 H
```

```javascript
var preOrder = 'ABDHECFG';
var inOrder = 'HDBEAFCG';
var postOrder = '';

var tree = {};

create(preOrder, preOrder.length, inOrder, inOrder.length);
console.log(tree);

getPostOrder(preOrder[0]);
console.log(postOrder);

function create(preStr, preLen, inStr, inLen){
  var root = preStr[0];
  tree[root] = {};
  tree[root].l = tree[root].r = null;

  if(preLen == 1)
    return root;

  var rootInPos = inStr.indexOf(root);
  var lStr = inStr.substr(0, rootInPos);
  var rStr = inStr.substr(rootInPos + 1);
  if(lStr.length > 0){
    tree[root].l = create(preStr.substr(1), preStr.substr(1).length, lStr, lStr.length);
  }
  if(rStr.length > 0){
    tree[root].r = create(preStr.substr(rootInPos + 1), preStr.substr(rootInPos + 1).length, rStr, rStr.length);
  }

  return root;
}

function getPreOrder(root){
  if(root){
    preOrder += root;
    getPreOrder(tree[root].l);
    getPreOrder(tree[root].r);
  }
}

function getInOrder(root){
  if(root){
    getInOrder(tree[root].l);
    inOrder += root;
    getInOrder(tree[root].r);
  }
}

function getPostOrder(root){
  if(root){
    getPostOrder(tree[root].l);
    getPostOrder(tree[root].r);
    postOrder += root;
  }
}
```

输出结果：

```bash
{ A: { r: 'C', l: 'B' },
  B: { r: 'E', l: 'D' },
  D: { r: null, l: 'H' },
  H: { r: null, l: null },
  E: { r: null, l: null },
  C: { r: 'G', l: 'F' },
  F: { r: null, l: null },
  G: { r: null, l: null } }
HDEBFGCA

```
