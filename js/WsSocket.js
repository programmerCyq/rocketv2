/**
* name 
*/
function WsSocket() {
    this.connection();
}
var _proto = WsSocket.prototype;

_proto.connection = function () {
    if (ws) {
        //房间创建
        ws.on("creatroom", (result) => {
            room.room = result;
            user = result.users.roomsOwner;
            Game_ready = new GameReady();
            if (Game_start.roomID != result.roomID) {
                window.location.href = window.location.origin + window.location.pathname + ("#/roomid=" + result.roomID);
                Game_start.roomID = result.roomID;
            };
            room.showOwner();
        });

        //用户加入房间监听
        ws.on("addroomer", (result) => {
            room.room = result;
            if (!user.Identity) {
                user = result.users.roomer;
            }
            if (!Game_ready) {
                Game_ready = new GameReady();
            }
            if(user.Identity == "roomsOwner"){
                Game_ready.layer.tichu.visible = true;
            }
            room.status = "readying"
            room.updataRoomOwner();
        });

        //监听房间状态
        ws.on("noroom", (result) => {
            Game_start.roomID = null;
            window.location.href = window.location.origin + window.location.pathname + "#";
            Game_start.layer.ani1.play();
            ws.disconnect();
            Game_start.layer.ani1.on(Laya.Event.COMPLETE, Game_start, Game_start.remoAni)
        });

        //监听用户退出房间
        ws.on("exit", (users) => {
            if (room.room.status != "playing") {
                room.room.users = users;
                user.Identity = "roomsOwner"
                room.updataRoomOwner();
                if(user.Identity == "roomsOwner"){
                    Game_ready.layer.tichu.visible = false;
                }
                return;
            };
            room.room.users = users;
            if(user.Identity == "roomsOwner"){
                Game_ready.layer.tichu.visible = false;
            }
        })

        //准备监听
        ws.on("ready", (msg) => {
            if (msg == "roomsuser noready" && user.Identity == "roomsOwner") {
                Game_ready.layer.waitReady.visible = true;
                Game_ready.layer.ani1.play();
                Game_ready.layer.game_start.visible = false;
                return;
            };
            if(msg == "roomsuser noready" && user.Identity == "roomer"){
                Game_ready.layer.qxzb.visible = false;
                util.showBtn(Game_ready.layer.roomerReady);
            }
            if (msg == "roomsuser ready" && user.Identity == "roomsOwner") {
                Game_ready.layer.waitReady.visible = false;
                Game_ready.layer.ani1.stop();
                Game_ready.layer.game_start.visible = true;
            }
        });

        //游戏开始监听
        ws.on("gamestart", (boxArr) => {
            Gameing.boxArr = boxArr;
            startLayer.removeSelf();
            readyLayer.removeSelf();
            Gameing.reset(user.Identity);
            room.room.status = "playing";
        });

        //飞机运动
        ws.on("runplane", (plane, ori) => {
            if (plane == "red") {
                if (ori == "left") {
                    Gameing.layer.plane_red.status = "left"
                };
                if (ori == "right") {
                    Gameing.layer.plane_red.status = "right"
                }
            };
            if (plane == "blue") {
                if (ori == "left") {
                    Gameing.layer.plane_blue.status = "left"
                };
                if (ori == "right") {
                    Gameing.layer.plane_blue.status = "right"
                }
            }
        });

        ws.on("kickout",()=>{
            if(user.Identity == "roomer"){
                ws.disconnect();
                history.replaceState(null, '', location.pathname + location.search);
                socket = null;
                ws = null;
                room = new Room();
                user.Identity = null;
                readyLayer.removeSelf();
            }
        })

        ws.on("addbox",(u)=>{
            if(u == "roomer"){
                Gameing.barrier.Rb = Gameing.boxArr[Gameing.RoomerAddBoxNum].Rb;
                Gameing.barrier.Ro = Gameing.boxArr[Gameing.RoomerAddBoxNum].Ro;
                Gameing.barrier.addRedBarrierAndBox();
                Gameing.RoomerAddBoxNum++;
            };
            if(u == "roomsOwner"){
                Gameing.barrier.Bb = Gameing.boxArr[Gameing.RoomsOwnerAddBoxNum].Bb;
                Gameing.barrier.Bo = Gameing.boxArr[Gameing.RoomsOwnerAddBoxNum].Bo;
                Gameing.barrier.addBlueBarrierAndBox();
                Gameing.RoomsOwnerAddBoxNum++;
            }
        })

        //分数监听
        ws.on("upscore", (User, score) => {
            room.room.users[User].score = score;
            Gameing.upDataScore();
        })

        //死亡监听
        ws.on("userdie", (plane) => {
            if (plane == "roomer" ) {
                Laya.SoundManager.playSound('music/baozhao.wav',1);
                Gameing.layer.plane_blue.isBang = true;
                Gameing.layer.ani5.play();
                Gameing.layer.ani5.on(Laya.Event.COMPLETE, room, room.RoomerDie);
                Gameing.layer.shade_right.visible = true;
                Gameing.layer.shade_right.zOrder = 50;
                //蓝色飞机死亡之后的操作
            };
            if (plane == "roomsOwner") {
                Laya.SoundManager.playSound('music/baozhao.wav',1);
                Gameing.layer.ani4.play();
                Gameing.layer.ani4.on(Laya.Event.COMPLETE, room, room.RoomsOwnerDie);
                Gameing.layer.plane_red.isBang = true;
                Gameing.layer.shade_left.visible = true;
                Gameing.layer.shade_left.zOrder = 50;
                //红色飞机死亡之后的操作
            }
        });

        //游戏结束监听
        ws.on("gameover", (result) => {
            room.room.users.roomer = result.roomer;
            room.room.users.roomsOwner = result.roomsOwner;
            Gameing.layer.shade_left.zOrder = 61;
            Gameing.layer.shade_right.zOrder = 61;
            Laya.Tween.to(Gameing.layer.game_o_font,{y:486},2000,Laya.Ease.bounceOut,Laya.Handler.create(this,DoubleOver),0,true)
            function DoubleOver(){
                ingLayer.removeSelf();
                Game_over_double = new GameOverDouble();
                room.room.status = "gameover";
                if(result.roomer.score == result.roomsOwner.score){
                    WhoWin("peace")
                }else if(result.roomer.score < result.roomsOwner.score){
                    WhoWin("roomsOwner")
                }else if(result.roomer.score > result.roomsOwner.score){
                    WhoWin("roomer");
                }
            }
            clearInterval(Gameing.Timer);
            Gameing.gameStar = false;
            function WhoWin(outcome){
                if (outcome == "peace") {
                    Game_over_double.layer.peace.visible = true;
                    return;
                };
                if (outcome == user.Identity) {
                    Game_over_double.layer.self_win.visible = true;
                };
                if (outcome != user.Identity) {
                    Game_over_double.layer.other_win.visible = true;
                }
            }
        });

        ws.on("goback", (result) => {
            if (!result.users.roomer) {
                if (user.Identity == "roomer") {
                    user.Identity = "roomsOwner"
                }
            }
            room.room = result;
            overDoubleLayer.removeSelf();
            Game_start.reset();
            Game_ready.reset();
            room.updataRoomOwner();
        })
    }
}