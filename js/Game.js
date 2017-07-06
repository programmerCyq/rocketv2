/**
* name 
*/
function Game(pattern) {

};
var _proto = Game.prototype;

//初始化游戏页面
_proto.reset = function (pattern) {
    Laya.SoundManager.stopMusic();
    M?Laya.SoundManager.playMusic('music/gameing.mp3'):'';
    ingLayer = new Laya.Sprite();
    backLayer.addChild(ingLayer);
    this.layer = new GameUI();
    ingLayer.addChild(this.layer)
    //障碍
    this.barrier = new Barrier(pattern);
    plane = new Plane();
    this.pattern = pattern;
    if (pattern == "onemachine") {
        this.layer.one_score.visible = true;
    } else {
        this.layer.blue_score.visible = true;
        this.layer.red_score.visible = true;
        this.showAvatar();
    }
    //飞机
    this.layer.plane_blue.isBang = false;
    this.layer.plane_red.isBang = false;
    //游戏
    this.gameStar = false;
    this.gameStarNum = 0;
    this.step = 15;//飞机的移动步长
    //障碍的移动步长 
    this.acc = 0.01;
    this.i=1;
    //分数
    Laya.timer.frameLoop(1, this, this.Frame);
    //层级关系
    this.layer.timer.zOrder = 60;
    this.layer.start_ani.zOrder = 50;
    this.layer.plane_blue.zOrder = 10;
    this.layer.plane_red.zOrder = 10;
    this.layer.red_score.zOrder = 10;
    this.layer.blue_score.zOrder = 10;
    this.layer.game_o_font.zOrder = 71;
    this.Gametimer = 60;//游戏时间
    this.layer.shade_left.zOrder = 50;
    this.layer.shade_right.zOrder = 50;
    this.acc = 0;
    this.layer.timer._childs[0].index = Math.floor(this.Gametimer / 10);
    this.layer.timer._childs[1].index = this.Gametimer - Math.floor(this.Gametimer / 10)*10;
    this.layer.ani6.on(Laya.Event.COMPLETE, this, this.chaneStatu);
    this.one = true;
    this.OneScore= 0;
    this.layer.bg_1.zOrder = -1;
    this.layer.bg_2.zOrder = -1;
    Laya.loader.load("game_bg.part", Laya.Handler.create(this, this.onAssetsLoaded), null, Laya.Loader.JSON);
    this.RoomerAddBoxNum = 0;
    this.RoomsOwnerAddBoxNum = 0;
    this.win = true;
};

_proto.showAvatar = function(){
    //房主
    this.roomsOwnerView = new Laya.Image(room.room.users.roomsOwner.Avatar);
    this.roomsOwnerView.x = 10;
    this.roomsOwnerView.y = 10;
    this.roomsOwnerView.width = 65;
    this.roomsOwnerView.height = 65;
    this.roomsOwnerView.zOrder = 49;
    this.roomsOwnerView.alpha = 0.5;
    this.layer.addChild(this.roomsOwnerView);
    //房客
    this.RoomerView = new Laya.Image(room.room.users.roomer.Avatar);
    this.RoomerView.x = 525;
    this.RoomerView.y = 10;
    this.RoomerView.width = 65;
    this.RoomerView.height = 65;
    this.RoomerView.zOrder = 49;
    this.RoomerView.alpha = 0.5;
    this.layer.addChild(this.RoomerView);
}

_proto.onAssetsLoaded=function(settings){
    this.sp = new Laya.Particle2D(settings);
    this.sp.emitter.start();
    this.sp.play();
    this.layer.addChild(this.sp);
    this.sp.x = Laya.stage.width/2;
    this.sp.y = Laya.stage.height/2;
}

//根据模式进行事件绑定
_proto.BinEvent = function (conplane) {
    if (conplane == "roomsOwner") {  //房主控制红色飞机
        this.layer.plane_red.isCon = true;
        this.layer.red_left.on(Laya.Event.MOUSE_DOWN, plane, plane.RedLeftDown);
        this.layer.red_right.on(Laya.Event.MOUSE_DOWN, plane, plane.RedRightDown);
        return;
    };
    if (conplane == "roomer") {   //房客控制蓝色飞机
        this.layer.plane_blue.isCon = true;
        this.layer.blue_left.on(Laya.Event.MOUSE_DOWN, plane, plane.BlueLeftDown);
        this.layer.blue_right.on(Laya.Event.MOUSE_DOWN, plane, plane.BlueRightDown);
        return;
    };
    //单机模式
    this.layer.plane_red.isCon = true;
    this.layer.plane_blue.isCon = true;
    this.layer.red_left.on(Laya.Event.MOUSE_DOWN, plane, plane.RedLeftDown);
    this.layer.red_right.on(Laya.Event.MOUSE_DOWN, plane, plane.RedRightDown);
    this.layer.blue_left.on(Laya.Event.MOUSE_DOWN, plane, plane.BlueLeftDown);
    this.layer.blue_right.on(Laya.Event.MOUSE_DOWN, plane, plane.BlueRightDown);
}

_proto.chaneStatu = function () {
    this.gameStar = true;
}

_proto.upDataScore = function () {
    var RoomerScoreArr = util.ScoreSplie(room.room.users.roomer.score);
    var OwnerScoreArr = util.ScoreSplie(room.room.users.roomsOwner.score);
    this.layer.red_score._childs[0].index = OwnerScoreArr[0];
    this.layer.red_score._childs[1].index = OwnerScoreArr[1];
    this.layer.red_score._childs[2].index = OwnerScoreArr[2];
    this.layer.blue_score._childs[0].index = RoomerScoreArr[0];
    this.layer.blue_score._childs[1].index = RoomerScoreArr[1];
    this.layer.blue_score._childs[2].index = RoomerScoreArr[2];
}

_proto.upDataOneScore = function () {
    var OneScoreArr = util.ScoreSplie(this.OneScore);
    this.layer.one_score._childs[0].index = OneScoreArr[0];
    this.layer.one_score._childs[1].index = OneScoreArr[1];
    this.layer.one_score._childs[2].index = OneScoreArr[2];
}

//定时器
_proto.Frame = function () {
    var s = this;
    if (this.gameStar) {
        if (this.one) {
            this.Timer = setInterval(function () {
                if (s.layer.timer._childs[0].index == 0 && s.layer.timer._childs[1].index == 0) {
                    clearInterval(s.Timer);
                    if (s.pattern == "onemachine") {
                        s.gameOver("win")
                    } else {
                        s.gameStar = false;
                        if (user.Identity == "roomsOwner" || (user.Identity == "roomer" && room.room.users.roomsOwner.status == "exit")) {
                            ws.emit("gameover")
                        }
                    }
                    return;
                }
                if (s.layer.timer._childs[1].index == 0) {
                    s.layer.timer._childs[1].index = 9;
                    s.layer.timer._childs[0].index = --(s.layer.timer._childs[0].index);
                } else {
                    s.layer.timer._childs[1].index = --(s.layer.timer._childs[1].index);
                };
                s.dy_Gametimer++;
            }, 1000);
            //控制判断
            this.BinEvent(this.pattern);
            s.layer.ani1.play();
            s.layer.ani2.play();
            this.gameStar = true;
            if (this.pattern != "onemachine" && user.Identity == "roomsOwner") {
                ws.emit("gamestart");
            };
            this.one = false;
        }

        if (this.layer.plane_red.x >= 71 - this.step && this.layer.plane_red.x <= 230 + this.step) {
            plane.PlaneRedRun();
        }
        if (this.layer.plane_blue.x >= 376 - this.step && this.layer.plane_blue.x <= 526 + this.step) {
            plane.PlaneBlueRun();
        }
        //障碍
        this.barrier.addBarrierNum++;
        if (this.barrier.addBarrierNum >= this.barrier.addBarrierNum2) {
            if (!this.layer.plane_red.isBang || !this.layer.plane_blue.isBang) {
                this.acc+=0.5;
                if(this.acc<this.Gametimer/7){
                    this.barrier.addBarrierNum2 -=(this.barrier.addBarrierNum2/this.barrier.getSpeed/2);
                }
                if(this.barrier.getSpeed>=(5+this.Gametimer/7)){
                    this.barrier.getSpeed=(5+this.Gametimer/7);    
                }else{
                    this.barrier.getSpeed =5+this.acc;
                }
                if(this.pattern == "onemachine"){
                    if(!this.layer.plane_blue.isBang){
                        Gameing.barrier.addRedBarrierAndBox();
                        Gameing.RoomerAddBoxNum++;
                    }
                    if(!this.layer.plane_red.isBang){
                        Gameing.barrier.addBlueBarrierAndBox();
                        Gameing.RoomsOwnerAddBoxNum++;
                    }
                }
                if(!this.layer.plane_red.isBang && this.layer.plane_red.isCon && this.pattern!="onemachine"){
                    ws.emit('addbox',"roomsOwner");
                };
                if(!this.layer.plane_blue.isBang && this.layer.plane_blue.isCon && this.pattern!="onemachine"){
                    ws.emit('addbox',"roomer");
                }
            }
            this.barrier.addBarrierNum = 0;
        };   
        this.barrier.BoxRunAndRemove(this.barrier.BlueBox_Arr, this.barrier.RedBox_Arr);
        // 飞机碰撞
        if (!this.layer.plane_red.isBang) {
            this.barrier.BoxCrash(this.barrier.BlueBox_Arr, this.layer.plane_red);
        };
        if (!this.layer.plane_blue.isBang) {
            this.barrier.BoxCrash(this.barrier.RedBox_Arr, this.layer.plane_blue);
        };
        if(this.layer.bg_1.y>=966){
            this.layer.bg_1.y = -962;
        }
        if(this.layer.bg_2.y>=962){
            this.layer.bg_2.y = -966;
        }
        this.layer.bg_2.y+=1;
        this.layer.bg_1.y+=1;
        if(this.layer.pathway.y>=966){
            this.layer.pathway.y = -962;
        }
        if(this.layer.pathway2.y>=962){
            this.layer.pathway2.y = -964;
        }
        this.layer.pathway.y+=6 ;
        this.layer.pathway2.y+=6;
        return;
    };
}

_proto.gameOver = function (type) {
    Gameing.gameStar = false;
    Gameing.layer.shade_right.visible = true;
    Gameing.layer.shade_left.visible = true;
    Laya.Tween.to(this.layer.game_o_font,{y:486},2000,Laya.Ease.bounceOut,Laya.Handler.create(this,Gameing.Over,[type]),0,true)
}

_proto.Over=function(type){
    ingLayer.removeSelf();
    Game_over_one = new GameOverOne(type)
}