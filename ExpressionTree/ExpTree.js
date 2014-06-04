/**操作符-优先级表*/
var OPN_TABLE = 
{
	'+' : 0,
	'-' : 0,
	'*' : 1,
	'/' : 1,
	'^' : 2,
};

/**函数查询表*/
var FUNC_TABLE = 
{
	'sin' : 1,
	'cos' : 1,
	'tan' : 1,
	'cot' : 1,
	'arcsin' : 1,
	'arccos' : 1,
	'arctan' : 1,
	'ln' : 1,
	'log' : 1,
};

/**检查是否为数字*/
var isNumber = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

/**二叉表达树*/
function ExpTree(key) {
	//根节点
	this.root = null;
	//未知量的表达形式，默认为x
	this.key = key || 'x';
	//中序遍历的字符串
	this.infix = '';
	//后续遍历的字符串
	this.postfix = '';
}

/**二叉表达树节点*/
function ExpTreeNode(key, left, right) {
	//节点值
	this.key = key;
	//左子树，默认为空
	this.left = left || null;
	//右子树，默认为空
	this.right = right || null;
}

/**预处理表达式字串*/
ExpTree.prototype.preHandleExp = function(exp) {
	if(!exp) return '';
	//补全小数点的前缀0
	exp = exp.replace(/([^0-9]|^)(\.\d+)/g, '$10$2');
	//处理省略乘号的情况
	var reg2 = new RegExp('([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)(['+this.key+' e pi])', 'g');
	exp = exp.replace( reg2,  '$1*$2');
	//处理单目运算符 '+' '-'
	var c1 = '+', c2;
	var addRp = false;
	for (var i = 0; i < exp.length; ++i) {
		c2 = exp[i];
		if(c2 in OPN_TABLE && addRp) {
			addRp = false;
			exp = exp.slice(0,i) + ')' + exp.slice(i);
			++ i;
		}
		if((c1 in OPN_TABLE || c1 == '(' || c1 == ',') && c2 in OPN_TABLE) {
			if(c2 == '+') {
				//清除多余的+
				exp = exp.slice(0,i) + exp.slice(i+1);
				-- i;
			}
			else if(c2 == '-') {
				//在前面添加'(0'
				exp = exp.slice(0,i) + '(0' + exp.slice(i);
				i += 2;
				//置为需要添加')'模式
				addRp = true;
			}
		}
		c1 = c2;
	};
	if(addRp) {
		exp += ')';
	}
	return exp;
};

/**中缀表达式转后缀表达式 调度场算法*/
ExpTree.prototype.inFixToPostFix = function(exp) {
	var postFix = [];
	var stack = [];
	//调度场算法
	exp = this.preHandleExp(exp);
	console.log(exp);
	var c, o1, o2, sign;
	var func = '';
	for (var i = 0; i < exp.length; ++i) {
		c = exp[i];
		//数字
		if(c >= '0' && c <= '9') {
			sign = false;
			while(i < exp.length && (exp[i] == '.' || (exp[i] >= '0' && exp[i] <= '9'))) {
				++ i;
				c += exp[i];
				sign = true;
			}
			if(sign) {
				-- i;
			}
			//try catch here
			try {
				postFix.push(parseFloat(c));
			}catch(error) {
				return '';
			}
		}
		//特殊字符 e x
		else if(c == 'e' || c == 'x') {
			postFix.push(c);	
		}
		//函数分隔符
		else if(c == ',') {
			while(stack.length && stack[stack.length-1] != '(') {
				postFix.push(stack.pop());
			}
		}
		//运算符
		else if(c in OPN_TABLE) {
			o1 = c;
			if(stack.length) {
				o2 = stack[stack.length-1];
				while(o2 in OPN_TABLE && OPN_TABLE[o2] - OPN_TABLE[o1] >= 0) {
					postFix.push(stack.pop());
					if(!stack.length) {
						break;
					}
					o2 = stack[stack.length-1];
				}
			}
			stack.push(o1);
		}
		//左括号
		else if(c == '(') {
			stack.push(c);
		}
		//右括号
		else if(c == ')') {
			while(stack.length && stack[stack.length-1] != '(') {
				postFix.push(stack.pop());
			}
			if(!stack.length) {
				return '';
			}
			if(stack.length && stack[stack.length-1] == '('){
				stack.pop();
				if(stack.length && stack[stack.length-1] in FUNC_TABLE) {
					postFix.push(stack.pop());
				}
			}
		}
		//函数符
		else {
			func += c;
			if(func in FUNC_TABLE) {
				stack.push(func);
				func = '';
			}
		}

	};
	if(stack.length) {
		if(stack[stack.length-1] == '(' || stack[stack.length-1] == ')' ) {
			return '';
		}
		else {
			while(stack.length) {
				postFix.push(stack.pop());
			}
		}
	}
	if(func) {
		return '';
	}

	return postFix;
};

/**构建二叉表达树*/
ExpTree.prototype.build = function(infixExp) {
	var exp = infixExp.toLowerCase();
	exp = exp.replace( /\s/g, "" );
	var postFix = this.inFixToPostFix(exp);
	if(postFix == '') {
		return false;
	}
	console.log('postFix:',postFix);
	var stack = [];
	var c, n;
	for (var i = 0; i < postFix.length; i++) {
		c = postFix[i];
		if(isNumber(c) || c == 'e' || c == 'pi' || c == 'x') {
			stack.push(new ExpTreeNode(c));
		}
		else {
			if(c == '(' || c == ')') {
				return false;
			}
			n = new ExpTreeNode(c);
			n.right = stack.pop();
			if(c in OPN_TABLE || c == 'log') {
				n.left = stack.pop();
				if(!n.left) {
					return false;
				}
			}
			stack.push(n);
		}
	};
	this.root = stack[0];
	if(!this.root.left && !this.root.right) {
		return false;
	}
	return stack.length <= 1;
};

ExpTree.prototype._toInFix = function(node) {
	if(node) {
		this._toInFix(node.left);
		this.infix += node.key;
		this._toInFix(node.right);
	}
};

ExpTree.prototype.toInFix = function(node) {
	this.infix = '';
	this._toInFix(this.root);
	return this.infix;
};

ExpTree.prototype._toPostFix = function(node) {
	if(node) {
		this._toPostFix(node.left);
		this._toPostFix(node.right);
		this.postfix += node.key;
	}
};

ExpTree.prototype.toPostFix = function(node) {
	this.postfix = '';
	this._toPostFix(this.root);
	return this.postfix;
};

/**执行原子计算*/
ExpTree.prototype.op = function(opr, left, right) {
	switch(opr) {
		case '+':
			return left + right;
		case '-':
			return left - right;
		case '*':
			if(left == 0 || right == 0) {
				return 0;
			}
			return left * right;
		case '/':
			return left / right;
		case '^':
			return Math.pow(left, right);
		case 'sin':
			return Math.sin(right);
		case 'cos':
			return Math.cos(right);
		case 'tan':
			return Math.tan(right);
		case 'cot':
			return 1 / Math.tan(right);
		case 'arcsin':
			return Math.asin(right);
		case 'arccos':
			return Math.acos(right);
		case 'arctan':
			return Math.atan(right);
		case 'ln':
			return Math.log(right);
		case 'log':
			return Math.log(right) / Math.log(left);
		default:
			//error!
			console.log(opr, 'error!');
			return 0;
	}
};

/**是否含未知量*/
ExpTreeNode.prototype._containParam = function(node) {
	if(node){
		if(node.key == this.key) {
			return true;
		}
		else {
			return this._containParam(node.left) || this._containParam(node.right);
		}
	}
	return false;
};

/**递归计算表达式的值*/
ExpTree.prototype.cal = function(node, x) {
	if(!node) {
		return;
	}
	if(node.left || node.right) {
		return this.op( node.key, this.cal(node.left, x), this.cal(node.right, x) );
	}
	switch(node.key) {
		case 'x':
			return x;
		case 'e':
			return Math.E;
		case 'pi':
			return Math.PI;
		default:
			return node.key;
	}
};

/**求导函数树*/
ExpTree.prototype.dao = function(node) {
	if(!node) {
		return;
	}
	var t;
	switch(node.key) {
		case '+':
		case '-':
			//(l+r)' = l' + r'
			//(l-r)' = l' - r'
			t = new ExpTreeNode(node.key, this.dao(node.left), this.dao(node.right));
			break;
		case '*':
			//(l*r)' = l'*r + l*r'
			t = new ExpTreeNode('+');
			t.left = new ExpTreeNode('*', this.dao(node.left), node.right);
			t.right = new ExpTreeNode('*', node.left, this.dao(node.right));
			break;
		case '/':
			//(l/r)' = (l'*r - l*r') / (r*r)
			t = new ExpTreeNode('/');
			t.left = new ExpTreeNode('-');
			t.left.left = new ExpTreeNode('*', this.dao(node.left), node.right);
			t.left.right = new ExpTreeNode('*', node.left, this.dao(node.right));
			t.right = new ExpTreeNode('*', node.right, node.right);
			break;
		case '^':
			t = new ExpTreeNode('*');
			if(node.right._containParam(node.right)) {
				//(l^r)' = (l^r) * (ln(l)*r)'
				t.left = node;
				t.right = this.dao(new ExpTreeNode('*', new ExpTreeNode('ln', null, node.left), node.right));
			}
			else {
				//(l^c)' = (l'*c) * l^(c-1)
				t.left = new ExpTreeNode('*', this.dao(node.left), node.right);
				t.right = new ExpTreeNode('^', node.left, new ExpTreeNode('-', node.right, new ExpTreeNode(1)));
			}
			break;
		case 'sin':
			//sin(r)' = cos(r)*r'
			t = new ExpTreeNode('*');
			t.left = new ExpTreeNode('cos', null, node.right);
			t.right = this.dao(node.right);
			break;
		case 'cos':
			//cos(r)' = 0-sin(r)*r'
			t = new ExpTreeNode('-', new ExpTreeNode(0));
			t.right = new ExpTreeNode('*', new ExpTreeNode('sin', null, node.right), this.dao(node.right));
			break;
		case 'tan':
			//tan(r)' = r' / (cos(r) * cos(r))
			t = new ExpTreeNode('/', this.dao(node.right));
			t.right = new ExpTreeNode('*', new ExpTreeNode('cos', null, node.right), new ExpTreeNode('cos', null, node.right));
			break;
		case 'cot':
			//cot(r)' = 0-r'/(sin(r)*sin(r))
			t = new ExpTreeNode('-', new ExpTreeNode(0));
			t.right = new ExpTreeNode('/', this.dao(node.right));
			t.right.right = new ExpTreeNode('*', new ExpTreeNode('sin', null, node.right), new ExpTreeNode('sin', null, node.right));
			break;
		case 'arcsin':
			//arcsin(r)' = r' / (1-r*r)^0.5
			t = new ExpTreeNode('/', this.dao(node.right))
			t.right = new ExpTreeNode('^', null, new ExpTreeNode(0.5));
			t.right.left = new ExpTreeNode('-', new ExpTreeNode(1), new ExpTreeNode('*', node.right, node.right));
			break;
		case 'arccos':
			t = new ExpTreeNode('/', this.dao(node.right))
			t.right = new ExpTreeNode('^', null, new ExpTreeNode(0.5));
			t.right.left = new ExpTreeNode('-', new ExpTreeNode(1), new ExpTreeNode('*', node.right, node.right));
			t = new ExpTreeNode('-', new ExpTreeNode(0), t);
			//arccos(r)' = 0 - (r' / (1-r*r)^0.5)
			break;
		case 'arctan':
			t = new ExpTreeNode('/', this.dao(node.right))
			t.right = new ExpTreeNode('+', new ExpTreeNode(1), new ExpTreeNode('*', node.right, node.right));
			//arcsin(r)' = r' / (1+r*r)
			break;
		case 'ln':
			//ln(r)' = r'/r
			t = new ExpTreeNode('/', this.dao(node.right), node.right);
			break;
		case 'log':
			//log(l,r) = r'/(r*ln(l))
			t = new ExpTreeNode('/', this.dao(node.right));
			t.right = new ExpTreeNode('*', node.right, new ExpTreeNode('ln', null, node.left));
			break;
		case 'x':
			//x' = 1
			t = new ExpTreeNode(1);
			break;
		default:
			//常量的导数为0
			t = new ExpTreeNode(0);
			break;
	}
	return t;
};

function cal(exp) {
    console.log(exp);
    var t = new ExpTree();
    t.build(exp);
    console.log('infix:', t.toInFix());
    var dtn = t.dao(t.root);
    var dt = new ExpTree();
    dt.root = dtn;
    console.log('postfix:', dt.toPostFix());
    var x0 = 1,
        x1 = 2,
        i = 0;
    while (Math.abs(x0 - x1) > 10E-9) {
        x0 = x1;
        x1 = x0 - (t.cal(t.root, x0) / dt.cal(dt.root, x0));
        ++i;
        if (i > 10E6) {
            break;
        }
    }
    if (Math.abs(x1 - Math.round(x1)) < 10E-8) {
        x1 = Math.round(x1);
    }
    if (isNaN(x1)) {
       console.log('无解或牛顿法对此不收敛。');
    }
    else {
    	console.log('x = ',x1);
    }
    return x1;
}

cal('5x^4-9x^2+9');
