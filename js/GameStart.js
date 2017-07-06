/**
* name 
*/
function GameStart() {
    this.reset();
}

var _proto = GameStart.prototype;

_proto.reset = function () {
    M?Laya.SoundManager.playMusic('music/gamestart.mp3'):"";
    startLayer = new Laya.Sprite();
    backLayer.addChild(startLayer);
    this.layer = new GameStartUI();
    startLayer.addChild(this.layer);
    this.layer.addChild(Music);
    this.layer.gameStart.on(Laya.Event.MOUSE_DOWN, this, this.GameStart);
    this.layer.fight.on(Laya.Event.MOUSE_DOWN, this, this.GameFight);
    this.roomID = null;
    this.SplitRoomID();
    if (this.roomID && !socket) {
        ws = io("ws://192.168.199.149:5230");
        ws.emit("joinroom", user, this.roomID);
        socket = new WsSocket();
    }
};

_proto.SplitRoomID = function () {
    var urlArr = window.location.hash.substring(1, window.location.hash.length);
    urlArr = urlArr.split("=");
    var index = urlArr.findIndex((val, index, e) => {
        return val == "/roomid";
    });
    if (index != -1) {
        this.roomID = urlArr[index + 1];
    };
}

_proto.GameStart = function () {
    startLayer.removeSelf();
    if(!Gameing){
        Gameing = new Game();
    }
    Gameing.reset("onemachine");
};

_proto.remoAni = function () {
    this.layer.ani1.stop();
}

_proto.GameFight = function () {
    ws = io("ws://192.168.199.149:5230");
    ws.emit("creatroom", user);
    socket = new WsSocket();
}