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
 * 栈的应用-简易表达式求值
*/
var prioty = 
{
	"+":1,
	"-":1,
	"%":2,
	"*":2,
	"/":2,
	"^":3,
	"(":0,
	")":0,
	"`":-1,
};

function doop( op, opn1, opn2 ) {
	switch( op ) {
		case "+":
			return opn1 + opn2;
		case "-":
			return opn1 - opn2;
		case "*":
			return opn1 * opn2;
		case "/":
			return opn1 / opn2;
		case "%":
			return opn1 % opn2;
		case "^":
			return Math.pow( opn1, opn2 );
		default:
			return 0;
	}
}

function opcomp( a, b ) {
	return prioty[a] - prioty[b];
}

//支持 加+ 减- 乘* 除/ 乘方^ 求余%
function calInfixExpression( exp ) {
	var cs = [];
	var ns = [];
	var exp = exp.replace( /\s/g, "" );
	exp += '`';
	var c;
	var op;
	var opn1;
	var opn2;
	for (var i = 0; i < exp.length; ++i) {
		c = exp[i];
		if( c in prioty ) {
			//op
			while( c != '(' && cs.length && opcomp( cs[cs.length-1], c ) >= 0 ) {
				op = cs.pop();
				if( op != '(' && op != ')' ){
					opn2 = ns.pop();
					opn1 = ns.pop();
					ns.push( doop( op, opn1, opn2 ) );
				}
			}
			if( c != ')' ) cs.push( c );
		}
		else {
			while( !(exp[i] in prioty) ) {
				i++;
				c += exp[i];
			}
			ns.push( parseFloat(c) );
			i--;
		}
	}
	return ns.length ? ns[0] : NaN;
}
