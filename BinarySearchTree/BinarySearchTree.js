/*
 * Copyright (c) 2014 Tim Wu (吴智炜)
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */	

/**二叉查找树*/
function BinarySearchTree() {
	this.root = null;
}	

/**二叉查找树节点*/
function BstNode(key, value, parent) {
	this.key = key;
	this.valueList = [value];
	this.parent = parent || null;
	this.left = null;
	this.right = null;
}

BinarySearchTree.prototype._add = function(node, key, value) {
	if(this.root == null) {
		this.root = new BstNode(key, value);
		return ;
	}
	if(key < node.key) {
		node.left == null ? 
			node.left = new BstNode(key, value, node) :
			this._add(node.left, key, value);
	}
	else if(key > node.key) {
		node.right == null ? 
			node.right = new BstNode(key, value, node) : 
			this._add(node.right, key, value);
	}
	else {
		node.valueList.push(value);
	}
};

BinarySearchTree.prototype._remove = function(key, value, root) {
	if(!root) return null;	
	if(key < root.key) {
		this._remove(key, value, root.left);
	}
	else if(key > root.key) {
		this._remove(key, value, root.right);
	}
	else if(value && root.valueList.length > 1) {
		root.valueList.splice(root.valueList.indexOf(value), 1);
	}
	else if(root.left && root.right) {
		var rightMin = this._findMin(root.right);
		root.key = rightMin.key;
		root.valueList = rightMin.valueList;
		this._remove(root.key, null, root.right);
	}
	else {
		var next = root.left ? root.left : root.right
		if(root == this.root) {
			this.root = next;
			this.root.parent = null;
			return;
		}
		if(root.key >= root.parent.key) {
			root.parent.right = next;
		}
		else if(root.key < root.parent.key) {
			root.parent.left = next;
		}
		if(next) {
			next.parent = root.parent;
		}
	}
	return root;
};

BinarySearchTree.prototype._findMin = function(root) {
	while(root && root.left) {
		root = root.left;
	}
	return root;
};

BinarySearchTree.prototype._findMax = function(root) {
	while(root && root.right) {
		root = root.right;
	}
	return root;
};

BinarySearchTree.prototype._find = function(node, key) {
	if(node == null || node.key == key) {
		return node;
	}
	if(node.key > key) {
		return this._find(node.left, key);
	}
	return this._find(node.right, key);
};

BinarySearchTree.prototype._inOrderTravel = function(root, func) {
	if(root) {
		this._inOrderTravel(root.left, func);
		func(root);
		this._inOrderTravel(root.right, func);
	}
};

BinarySearchTree.prototype._findInRange = function(root, list, min, max) {
	if(root) {
		this._findInRange(root.left, list, min, max);
		if(root.key > max) {
			return;
		}
		if(root.key >= min && root.key <= max) {
			list.push(root.key);
		}
		this._findInRange(root.right, list, min, max);
	}
};

BinarySearchTree.prototype.add = function(key, value) {
	return this._add(this.root, key, value);
};

BinarySearchTree.prototype.remove = function(key, value) {
	return this._remove(key, value, this.root);
};	

BinarySearchTree.prototype.findMin = function() {
	return this._findMin(this.root);
};	

BinarySearchTree.prototype.findMax = function() {
	return this._findMax(this.root);
};	

BinarySearchTree.prototype.find = function(key) {
	return this._find(this.root, key);
};	

BinarySearchTree.prototype.inOrderTravel = function(func) {
	return this._inOrderTravel(this.root, func);
};	

BinarySearchTree.prototype.findInRange = function(min, max) {
	var list = [];
	this._findInRange(this.root, list, min, max);
	return list;
};

BinarySearchTree.prototype.findNR = function(key) {
	var node = this.root;
	while(node) {
		if(node.key == key) {
			return node;
		}
		if(node.key > key) {
			node = node.left;
		}
		else if(node.key < key) {
			node = node.right;
		}
	}
	return node;
};

BinarySearchTree.prototype.addNR = function(key, value) {
	if(this.root == null) {
		this.root = new BstNode(key, value);
		return ;
	}
	var node = this.root;
	while(key != node.key) {
		if(key < node.key) {
			if(node.left) {
				node = node.left;
			}
			else {
				node.left = new BstNode(key, value, node);
				return;
			}
		}
		else if(key > node.key) {
			if(node.right) {
				node = node.right;
			}
			else {
				node.right = new BstNode(key, value, node);
				return;
			}
		}
	}
	if(key == node.key) {
		node.valueList.push(value);
	}
};

BinarySearchTree.prototype.findInRangeNR = function(min, max) {
	var list = [];
	var node = this.root;
	var stack = [];
	var handle = function(n) {
		if(!n || n.key > max) {
			return false;
		}
		if(n.key >= min && n.key <= max) {
			list.push(n.key);
		}
		return true;
	};	
	while(node) {
		if(node.left) {
			stack.push(node);
			node = node.left;
		}
		else {
			handle(node);
			while(! node.right) {
				node = stack.pop();
				if(!node) {
					return list;
				}
				handle(node);
			}
			node = node.right;
		}
	}
	return list;
};

BinarySearchTree.prototype.inOrderTravelNR = function(func) {
	var node = this.root;
	var stack = [];
	while(node) {
		if(node.left) {
			stack.push(node);
			node = node.left;
		}
		else {
			func(node);
			while(! node.right) {
				node = stack.pop();
				if(! node) {
					return ;
				}
				func(node);
			}
			node = node.right;
		}
	}
};

// $('#test').click( function () {

    var bst = new BinarySearchTree();
    var dic = {};
    // var num = parseInt($("#nodes").val(), 10);
    var num = 10000;
    var key;
    var start = 'bob';
    var end = 'tim';
    for(var i = 0; i < num; ++i) {
        key = Math.random().toString(36).substr(2,3);
        bst.add(key,i);
        dic[key] = i;
    }
    var s1 = new Date().getTime();
    var l1 = bst.findInRangeNR(start, end);
    var e1 = new Date().getTime();
    var l2 = [];
    var s2 = new Date().getTime();
    for (var k in dic) {
        if(k <= end && k >= start) {
            l2.push(k);
        }
    }
    var e2 = new Date().getTime();
    var res = '字典：找到' + l2.length + '个，耗时：'+ (e2-s2) +'ms&lt;br&gt;';
    res += '二叉查找树：找到' + l1.length + '个，耗时：'+ (e1-s1) +'ms';
    console.log(res);
    console.log(l1.length, l2.length);
    console.log(e1-s1, e2-s2);
// });
