/**
* name 
*/
function GameOverOne(type) {
    this.reset(type);
}
var _proto = GameOverOne.prototype;
_proto.reset = function (type) {
    M?Laya.SoundManager.playMusic('music/gameover.mp3',1):"";
    overOneLayer = new Laya.Sprite();
    backLayer.addChild(overOneLayer);
    this.layer = new GameOverOneUI();
    overOneLayer.addChild(this.layer);
    var OneScoreArr = util.ScoreSplie(Gameing.OneScore);
    this.layer.Score_oo._childs[0].index = OneScoreArr[0];
    this.layer.Score_oo._childs[1].index = OneScoreArr[1];
    this.layer.Score_oo._childs[2].index = OneScoreArr[2];
    this.layer.golds._childs[0].index = OneScoreArr[0];
    this.layer.golds._childs[1].index = OneScoreArr[1];
    this.layer.golds._childs[2].index = OneScoreArr[2];
    if (type == "die") {
        this.layer.los.visible = true;
    }
    if (type == "win") {
        this.layer.win_.visible = true;
    };
    if (Gameing.OneScore >= 10) {
        this.layer.star_1.visible = true;
    };
    if (Gameing.OneScore >= 20) {
        this.layer.star_2.visible = true;
    };
    if (Gameing.OneScore >= 30) {
        this.layer.star_3.visible = true;
    }
    this.layer.again.on(Laya.Event.MOUSE_DOWN, this, this.Again);
    this.layer.goBack.on(Laya.Event.MOUSE_DOWN, this, this.GoBack)
}

_proto.Again = function () {
    overOneLayer.removeSelf();
    Gameing.reset("onemachine");
}

_proto.GoBack = function () {
    overOneLayer.removeSelf();
    Game_start.reset();
}