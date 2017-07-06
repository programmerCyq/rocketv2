/**
* name 
*/
function Util() {

};

var _proto = Util.prototype;

_proto.isSameQuadrant = function (cood, objA, objB) {
    var coodX = cood.x;//传入的X
    var coodY = cood.y; //传入的Y
    var xoA = objA.x //第一个对象的X、Y
        , yoA = objA.y
        , xoB = objB.x  //第二个对象的X、Y
        , yoB = objB.y;

    if (xoA - coodX > 0 && xoB - coodX > 0) {//c对象的x如果比AB对象的X都小    
        if ((yoA - coodY > 0 && yoB - coodY > 0) || (yoA - coodY < 0 && yoB - coodY < 0)) {
            return true;
        }
        return false;
    } else if (xoA - coodX < 0 && xoB - coodX < 0) {
        if ((yoA - coodY > 0 && yoB - coodY > 0) || (yoA - coodY < 0 && yoB - coodY < 0)) {
            return true;
        }
        return false;
    } else {
        return false;
    }
};

_proto.hitTestRectArc = function (rectObj, arcObj, rectVec, arcR) {
    var rw = rectObj.width
        , rh = rectObj.height
        , ar = arcObj.width * 0.5
        , rx = rectObj.x
        , ry = rectObj.y
        , ax = arcObj.x
        , ay = arcObj.y;
    if (rectVec) {
        // alert(0)
        rx += (rw - rectVec[0]) * 0.5;
        ry += (rh - rectVec[1]) * 0.5;
        rw = rectVec[0];
        rh = rectVec[1];
    }
    if (arcR) {
        ax += (ar - arcR);
        ay += (ar - arcR);
        ar = arcR;
    }

    var rcx = rx + rw * 0.5, rcy = ry + rh * 0.5;
    var rltx = rx
        , rlty = ry
        , rlbx = rx
        , rlby = ry + rh
        , rrtx = rx + rw
        , rrty = ry
        , rrbx = rx + rw
        , rrby = ry + rh;

    if (
        this.isSameQuadrant(
            { x: ax, y: ay },
            { x: rltx, y: rlty },
            { x: rrbx, y: rrby }
        )
    ) {
        var dX1 = Math.abs(ax - rltx), dY1 = Math.abs(ay - rlty);
        var dX2 = Math.abs(ax - rlbx), dY2 = Math.abs(ay - rlby);
        var dX3 = Math.abs(ax - rrtx), dY3 = Math.abs(ay - rrty);
        var dX4 = Math.abs(ax - rrbx), dY4 = Math.abs(ay - rrby);

        if (
            (((dX1 * dX1) + (dY1 * dY1)) <= (ar * ar))
            || (((dX2 * dX2) + (dY2 * dY2)) <= (ar * ar))
            || (((dX3 * dX3) + (dY3 * dY3)) <= (ar * ar))
            || (((dX4 * dX4) + (dY4 * dY4)) <= (ar * ar))
        ) {
            return true;
        }
        return false;
    } else {
        var result = false;
        var squareX = ax
            , squareY = ay
            , squareW = ar * 2
            , squareH = squareW;
        if (
            (Math.abs(squareX - rcx) <= (squareW + rw) * 0.5)
            && (Math.abs(squareY - rcy) <= (squareH + rh) * 0.5)
        ) {
            result = true;
        }
        return result;
    }
};

_proto.showBtn = function (Btn) {
    Game_ready.layer.game_start.visible = false;
    Game_ready.layer.roomerReady.visible = false;
    Game_ready.layer.waitReady.visible = false;
    Game_ready.layer.qxzb.visible = false;
    Game_ready.layer.invite.visible = false;
    Game_ready.layer.addFriend.visible = false;
    Btn.visible = true;
}
_proto.ScoreSplie = function (score) {
    //房主的分数
    var HundredsNum = Math.floor(score / 100);
    var DecadeNum = Math.floor((score - (HundredsNum * 100)) / 10);
    var UnitNum = score - (HundredsNum * 100 + DecadeNum * 10);
    return [HundredsNum, DecadeNum, UnitNum]
}