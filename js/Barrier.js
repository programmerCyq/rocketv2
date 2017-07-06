/**
* name 
*/
function Barrier(pattern) {
        this.reset(pattern)
}
var _proto = Barrier.prototype;

_proto.reset = function (pattern) {
        this.status = pattern;
        this.Bb,
        this.Bo,
        this.Rb,
        this.Ro;
        this.BlueBox_Arr = [];
        this.RedBox_Arr = [];
        this.addBarrierNum = 0;
        this.addBarrierNum2 = 90;
        this.BoxScore = 2;
        this.speed = 5;//开始速度
        this.i = 0;//叠加速度
        this.getSpeed = 5;
}

//添加蓝色方障碍的方法
_proto.addRedBarrierAndBox = function () {
        if (this.status == "onemachine") {
                this.Rb = Math.ceil(Math.random() * 10);
                this.Ro = Math.ceil(Math.random() * 10);
        }
        var RedBox;
        if (this.Rb < 8) {
                //红障碍
                RedBox = new Laya.Image("comp/red_2.png");
                RedBox.y = -RedBox.height;
                RedBox.is = "Barrier";
                if (this.Ro < 5) {
                        RedBox.x = 321;
                }
                if (this.Ro >= 5) {
                        RedBox.x = 465;
                }
        }
        if(this.Rb >= 8){
                //红宝箱
                RedBox = new Laya.Image("comp/red_1.png");
                RedBox.y = -RedBox.height;
                RedBox.is = "Box";
                if (this.Ro < 5) {
                        RedBox.x = 321;
                }
                if (this.Ro >= 5) {
                        RedBox.x = 465;
                }
        }
        RedBox.zOrder = 5;
        this.RedBox_Arr.push(RedBox);
        Gameing.layer.addChild(RedBox);
}

//添加红色方障碍的方法
_proto.addBlueBarrierAndBox = function () {
        if (this.status == "onemachine") {
                this.Bb = Math.ceil(Math.random() * 10);
                this.Bo = Math.ceil(Math.random() * 10);
        }
        var BlueBox;
        if (this.Bb < 8) {
                //蓝障碍
                BlueBox = new Laya.Image("comp/blue_2.png");
                BlueBox.y = -BlueBox.height;
                BlueBox.is = "Barrier";
                if (this.Bo < 6) {
                        BlueBox.x = 16;
                };
                if (this.Bo >= 5) {
                        BlueBox.x = 175;
                }
        }
        if(this.Bb >= 8) {
                //蓝宝箱
                BlueBox = new Laya.Image("comp/blue_1.png");
                BlueBox.y = -BlueBox.height;
                BlueBox.is = "Box";
                if (this.Bo < 6) {
                        BlueBox.x = 16;
                }
                if (this.Bo >= 5) {
                        BlueBox.x = 175;
                }
        }
        BlueBox.zOrder = 5;
        this.BlueBox_Arr.push(BlueBox);
        Gameing.layer.addChild(BlueBox);
}

//障碍宝箱的移动和超出消失
_proto.BoxRunAndRemove = function (arr1, arr2) {
        if (!Gameing.layer.plane_red.isBang) {
                for (var k in arr1) {
                        arr1[k].y += this.getSpeed ;
                        if (arr1[k].y >= win_h + arr1[k].height) {
                                arr1[k].removeSelf();
                                arr1.splice(k, 1);
                        }
                }
        }
        if (!Gameing.layer.plane_blue.isBang) {
                for (var m in arr2) {
                        arr2[m].y += this.getSpeed;
                        if (arr2[m].y >= win_h + arr2[m].height) {
                                arr2[m].removeSelf();
                                arr2.splice(m, 1);
                        }
                }
        }
}       

//障碍物宝箱的碰撞
_proto.BoxCrash = function (Box, Plane) {
        for (var p in Box) {
                if (util.hitTestRectArc(Box[p], Plane)) {
                        if (this.status == "onemachine") {
                                if (Plane.name == "plane_blue" && Box[p].is == "Barrier" && Plane.isCon) {
                                        M?Laya.SoundManager.playSound('music/baozhao.wav',1):'';
                                        Gameing.layer.ani5.play();
                                        Plane.isBang = true;
                                        Gameing.gameStar = false;
                                        Gameing.layer.ani5.on(Laya.Event.COMPLETE, plane, plane.RemoAni);
                                };
                                if (Plane.name == "plane_red" && Box[p].is == "Barrier" && Plane.isCon) {
                                        M?Laya.SoundManager.playSound('music/baozhao.wav',1):'';
                                        Gameing.layer.ani4.play();
                                        Plane.isBang = true;
                                        Gameing.gameStar = false;
                                        Gameing.layer.ani4.on(Laya.Event.COMPLETE, plane, plane.RemoAni);
                                }
                                if (Box[p].is == "Box" && Plane.isCon) {
                                        M?Laya.SoundManager.playSound('music/dedao.mp3',1):'';
                                        Gameing.OneScore += this.BoxScore;
                                        Gameing.upDataOneScore(Gameing.OneScore)
                                }
                                Box[p].removeSelf();
                                Box.splice(p, 1)
                                return;
                        }
                        if (Plane.name == "plane_blue" && Plane.isCon) {
                                if (Box[p].is == "Barrier") {
                                        M?Laya.SoundManager.playSound('music/baozhao.wav',1):'';
                                        Gameing.layer.ani5.play();
                                        plane.isBang = true;
                                        ws ? ws.emit("userdie", "roomer") : "";
                                };
                                if (Box[p].is == "Box" && user.Identity == "roomer") {
                                        M?Laya.SoundManager.playSound('music/dedao.mp3',1):'';
                                        ws.emit("upscore", "roomer")
                                };
                        };
                        if (Plane.name == "plane_red" && Plane.isCon) {
                                if (Box[p].is == "Barrier" && !plane.isBang) {
                                        M?Laya.SoundManager.playSound('music/baozhao.wav',1):'';
                                        Gameing.layer.ani4.play();
                                        plane.isBang = true;
                                        ws ? ws.emit("userdie", "roomsOwner") : "";
                                };

                                if (Box[p].is == "Box" && user.Identity == "roomsOwner") {
                                        M?Laya.SoundManager.playSound('music/dedao.mp3',1):'';
                                        ws.emit("upscore", "roomsOwner")
                                }
                        }
                        Box[p].removeSelf();
                        Box.splice(p, 1)
                }
        }
}