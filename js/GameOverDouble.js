/*
* name;
*/
function GameOverDouble() {
    this.reset();
}
var _proto = GameOverDouble.prototype;
_proto.reset = function (type) {
    Laya.SoundManager.playMusic('music/gameover.mp3',1);
    overDoubleLayer = new Laya.Sprite();
    backLayer.addChild(overDoubleLayer);
    this.layer = new GameOverDoubleUI();
    overDoubleLayer.addChild(this.layer);
    this.layer.goBack.on(Laya.Event.MOUSE_DOWN, this, this.GoBack);
    this.showMyself();
    this.showOther();
    this.showScore();
}

_proto.showMyself = function () {
    this.self = room.room.users[user.Identity];
    var Avatar_view = new Laya.Image(this.self.Avatar);
    Avatar_view.width = 100;
    Avatar_view.height = 100;
    Avatar_view.x = 18;
    Avatar_view.y = 18;
    this.layer.Self_avatar.addChild(Avatar_view);
};
_proto.showOther = function () {
    this.other = user.Identity == "roomer" ? room.room.users.roomsOwner : room.room.users.roomer;
    var Avatar_view = new Laya.Image(this.other.Avatar);
    Avatar_view.width = 100;
    Avatar_view.height = 100;
    Avatar_view.x = 18;
    Avatar_view.y = 18;
    this.layer.Other_avatar.addChild(Avatar_view);
};
_proto.showScore = function () {
    //房主的分数
    var self = user.Identity;
    var other = user.Identity == "roomer" ? "roomsOwner" : "roomer";
    var selfScoreArr = util.ScoreSplie(room.room.users[self].score);
    var OtherScoreArr = util.ScoreSplie(room.room.users[other].score);
    this.layer.self_score._childs[0].index = selfScoreArr[0];
    this.layer.self_score._childs[1].index = selfScoreArr[1];
    this.layer.self_score._childs[2].index = selfScoreArr[2];
    this.layer.other_score._childs[0].index = OtherScoreArr[0];
    this.layer.other_score._childs[1].index = OtherScoreArr[1];
    this.layer.other_score._childs[2].index = OtherScoreArr[2];
}
//返回主页
_proto.GoBack = function () {
    if(ws){
        ws.emit("goback");
    }else{
        overDoubleLayer.removeSelf();
        Game_start.reset();
    }
}
