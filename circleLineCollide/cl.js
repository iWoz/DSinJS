//判断点c是否在线段ab的左侧
function isLeft(a, b, c) {
    return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x) < 0;
}

//根据时间间隔更新p1
function updateObjPosByTime(v, delta) {
    v.vx = v.vx * delta
    v.vy = v.vy * delta

    v.p1 = {x: v.p0.x + v.vx, y: v.p0.y + v.vy}
    v.len = Math.sqrt(v.vx*v.vx + v.vy*v.vy)

    v.delta = delta
}

//更新向量
function updateVector(v, isCorner) {
	if(isCorner) {
        v.vx = v.p1.x-v.p0.x;
        v.vy = v.p1.y-v.p0.y;
    }else if(v.p0) {
        v.p1.x = v.p0.x+v.vx;
        v.p1.y = v.p0.y+v.vy;
    }
    v.len = Math.sqrt(v.vx*v.vx + v.vy*v.vy);
    v.dx = v.vx / v.len;
    v.dy = v.vy / v.len;
    v.rx = -v.dy;
    v.ry = v.dx;
    v.lx = v.dy;
    v.ly = -v.dx;
    return v;
}

//检查墙壁，修正p1
function checkWalls(obj, walls) {
	for (var i = walls.length - 1; i >= 0; i--) {
		var w = walls[i];
		var iv = getIntersectVector(obj, w);
		iv = updateVector(iv, false);
		var pen = obj.r - iv.len;
		if(pen > 0) {
			console.log("collide", obj.p1.x, obj.p1.y, iv.len, i)
			//回移
			obj.p1.x += iv.dx*pen;
			obj.p1.y += iv.dy*pen;
			var bv = getBounceVector(obj, w);
			obj.vx = bv.vx;
			obj.vy = bv.vy;
		}
	}
}

//获取回弹向量
function getBounceVector(obj, w) {
	var projw = getProjectVector(obj, w.dx, w.dy);
	var projn;
	var left = isLeft(w.p0, w.p1, obj.p0);
	if(left) {
		projn = getProjectVector(obj, w.rx, w.ry);
	}else {
		projn = getProjectVector(obj, w.lx, w.ly);
	}
	projn.vx *= -1;
	projn.vy *= -1;
	return {
		vx: w.wf*projw.vx + w.bf*projn.vx,
		vy: w.wf*projw.vy + w.bf*projn.vy,
	};
}

//获取圆与线段的碰撞修正向量
function getIntersectVector(obj, w) {
	var v1 = {vx:obj.p1.x-w.p0.x, vy:obj.p1.y-w.p0.y};
	if(v1.vx*w.vx + v1.vy*w.vy < 0) {
		return v1;
	}
	var v2 = {vx:obj.p1.x-w.p1.x, vy:obj.p1.y-w.p1.y};
	if(v2.vx*w.vx + v2.vy*w.vy > 0) {
		return v2;
	}
	if(isLeft(w.p0, w.p1, obj.p0)){
		return getProjectVector(v1, w.lx, w.ly);
	}
	return getProjectVector(v1, w.rx, w.ry);
}

//获取向量u在向量dx,dy上的投影向量
function getProjectVector(u, dx, dy) {
	var dp = u.vx*dx + u.vy*dy;
	return {vx:dp*dx, vy:dp*dy};
}