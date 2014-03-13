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
* Polynomial implementation in JavaScript based on LinkedList.js
*/	
function Poly( cofs, exps ) {
	this.head = null;
	this.tail = null;
	var node;
	for (var i = 0; i < cofs.length; ++i) {
		node = new PolyData( cofs[i], exps[i] );
		this.append( node );
	};
};

Poly.prototype = new LinkedList();
Poly.prototype.constructor = Poly;	

function PolyData ( cof, exp ) {
 	this.cof = cof;
 	this.exp = exp;
};	

Poly.prototype.add = function( p ) {
	var sum = new Poly( [], [] );
	var p1 = this.head;
	var p2 = p.head;
	var node;
	while( p1 != null && p2 != null ) {
		if( p1.data.exp == p2.data.exp ) {
			node = new PolyData( p1.data.cof + p2.data.cof, p1.data.exp );
			p1 = p1.next;
			p2 = p2.next;
		}
		else if( p1.data.exp < p2.data.exp ) {
			node = new PolyData( p1.data.cof, p1.data.exp );
			p1 = p1.next;
		}
		else {
			node = new PolyData( p2.data.cof, p2.data.exp );
			p2 = p2.next;
		}
		sum.append( node );
	}
	while( p1 != null ) {
		node = new PolyData( p1.data.cof, p1.data.exp );
		p1 = p1.next;
		sum.append( node );
	}
	while( p2 != null ) {
		node = new PolyData( p2.data.cof, p2.data.exp );
		p2 = p2.next;
		sum.append( node );
	}
	return sum;
};	

Poly.prototype.mult = function( p ) {
	var mult = new Poly( [], [] );
	var tmp = new Poly( [], [] );
	var p1 = this.head;
	var p2 = p.head;
	var node;
	while( p2 != null ) {
		p1 = this.head;
		while( p1 != null ) {
			node = new PolyData( p1.data.cof * p2.data.cof, p1.data.exp + p2.data.exp );
			tmp.append( node );
			p1 = p1.next;
		}
		p2 = p2.next;
		mult = mult.add( tmp );
		var tmp = new Poly( [], [] );
	}
	return mult;
};	

Poly.prototype.toString = function( symbol ) {
	symbol = symbol || 'x';
	var p = this.head;
	var str = "";
	var cof;
	var exp;
	while( p != null ) {
		cof = p.data.cof;
		exp = p.data.exp;
		if( cof != 0 ) {
			str += (cof > 0 ? '+' : '-') + (Math.abs( cof ) == 1 ? (exp == 0 ? '1' : '') : Math.abs( cof )) + (exp == 0 ? '' : (exp == 1 ? symbol : symbol+'^'+exp));
		}
		p = p.next;
	}
	if( str.length && str[0] === '+' ) {
		return str.slice(1);
	}
	return str == "" ? "0" : str;
};