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

/**
* Linked List implementation in JavaScript
*/	
function LinkedList () {
	this.head = null;
	//use tail for efficiency
	this.tail = null;
};

function ListNode ( data ) {
	this.data = data;
	this.next = null;
};	

LinkedList.prototype.addFirst = function( element ) {
	var h = new ListNode( element );
	h.next = this.head
	if( this.head == null ) {
		this.tail = h;
	}
	this.head = h;
};	

LinkedList.prototype.append = function( element ) {
	if( this.head == null ) {
		this.addFirst( element );
		this.tail = this.head;
	}
	else {
		this.insertAfterNode( element, this.tail );
	}
};	

LinkedList.prototype.insertAfterNode = function( element, node ) {
	if( node == null ) return;
	var n = new ListNode( element );
	n.next = node.next;
	node.next = n;
	if( node == this.tail ) {
		this.tail = n;
	}
};	

LinkedList.prototype.insertBeforeNode = function( element, node ) {
	if( node == null ) return;
	if( node === this.head ) {
		this.addFirst( element );
		return;
	}
	var prev = null;
	var cur = this.head;
	while( cur != null && cur !== node ) {
		prev = cur;
		cur = cur.next;
	}
	if( cur != null ) {
		var n = new ListNode( element );
		prev.next = n;
		n.next = cur;
	}
};	

LinkedList.prototype.insertAfter = function( element, data ) {
	this.insertAfterNode( element, this.find(data) );
};	

LinkedList.prototype.insertBefore = function( element, data ) {
	if( this.head == null ) return;
	if( this.head.data === data ) {
		this.addFirst( element );
		return;
	}
	var p = this.findPrevious( data );
	var prev = p[0];
	var cur = p[1];
	if( cur != null ) {
		var n = new ListNode( element );
		prev.next = n;
		n.next = cur;
	}
};	

LinkedList.prototype.delete = function( element ) {
	if( this.head.data == element ) {
		this.head = this.head.next;
		return;
	}
	var p = this.findPrevious( element );
	var prev = p[0];
	var cur = p[1];
	if( prev != null && cur != null ) {
		prev.next = cur.next;
	}
};	

LinkedList.prototype.find = function( element ) {
	var p = this.head;
	while( p != null && p.data != element ) {
		p = p.next;
	}
	return p;
};	

LinkedList.prototype.findPrevious = function( element ) {
	var prev = null;
	var cur = this.head;
	while( cur != null && cur.data != element ) {
		prev = cur;
		cur = cur.next;
	}
	return [prev, cur];
};	

LinkedList.prototype.reverse = function() {
	var p = this.head;
	if( p == null ) return null;
	this.tail = p;
	var tmp, q = p.next;
	while( q != null ) {
		tmp = q.next;
		q.next = p;
		p = q;
		q = tmp;
	}
	this.head.next = null;
	this.head = p;
	return this;
};	

LinkedList.prototype.toString = function() {
	var p = this.head;
	var str = "";
	while( p != null ) {
		str += JSON.stringify(p.data) + (p.next == null ? "" : "->");
		p = p.next;
	}
	return str;
};