var win_w=600;
var win_h=966;
var player,
    backLayer,loadingTip,
    ws,roomID,Game_ready,
    Game_start,Game_over_one,
    Game_over_double,user,Game_bg,
    room,Util,Gameing,plane,
    socket,startLayer,ingLayer,
    overOneLayer,overDoubleLayer,
    Url="",Music,M=true;
    (function(GameInit){
        Laya.init(win_w,win_h,Laya.WebGL);
        Laya.stage.alignH=Laya.Stage.ALIGN_CENTER;
        Laya.stage.alignV=Laya.Stage.ALIGN_TOP;
        Laya.stage.scaleMode = 'showall';
        Laya.stage.scaleMode = 'exactfit';
        Laya.stage.screenMode = "none";
        Laya.stage.bgColor = "#000000";
        backLayer = new Laya.Sprite();
        backLayer.width = win_w;
        backLayer.height = win_h;
        backLayer.pos(0,0);
        Laya.stage.addChild(backLayer);
        user = {Avatar:"comp/cyq.jpg",nickName:"jack",score:0};//获取到用户信息
        loadUI();  
    })()

 function loadUI(){
        var imgArray = [
            {url:Url+"res/atlas/comp.json",type:Laya.Loader.ATLAS},
            {url:Url+"res/atlas/bang.json",type:Laya.Loader.ATLAS},
            {url:Url+"res/atlas/fire1.json",type:Laya.Loader.ATLAS},
            {url:Url+"res/atlas/fire2.json",type:Laya.Loader.ATLAS},
            {url:Url+"res/atlas/gameReady.json",type:Laya.Loader.ATLAS},
            {url:Url+"res/atlas/gameStart.json",type:Laya.Loader.ATLAS},
            {url:Url+"res/atlas/gameoverdouble.json",type:Laya.Loader.ATLAS},
            {url:Url+"res/atlas/gameoverone.json",type:Laya.Loader.ATLAS},
            {url:Url+"comp/red_1.png",type:Laya.Loader.IMAGE},
            {url:Url+"comp/red_2.png",type:Laya.Loader.IMAGE},
            {url:Url+"comp/blue_1.png",type:Laya.Loader.IMAGE},
            {url:Url+"comp/blue_1.png",type:Laya.Loader.IMAGE},
            {url:Url+"comp/yingyue2.png",type:Laya.Loader.IMAGE},
            {url:Url+"comp/yingyue1.png",type:Laya.Loader.IMAGE},
            {url:Url+"music/baozhao.wav",type:Laya.Loader.SOUND},
            {url:Url+"music/dedao.mp3",type:Laya.Loader.SOUND},
            {url:Url+"music/gameing.mp3",type:Laya.Loader.SOUND},
            {url:Url+"music/gameover.mp3",type:Laya.Loader.SOUND},
            {url:Url+"music/gamestart.mp3",type:Laya.Loader.SOUND},
            {url:Url+"comp/BG.png",type:Laya.Loader.IMAGE},
            {url:Url+user.Avatar,type:Laya.Loader.IMAGE},//头像
        ]
        Laya.loader.load(imgArray,Laya.Handler.create(this,onLoadUI),Laya.Handler.create(this,onProgress,null,false));
        lodaTextTip = new Laya.Text();
        lodaTextTip.text = "正在加载中...";
        lodaTextTip.color = "#ffffff";
        lodaTextTip.fontSize = 30;
        lodaTextTip.pos((win_w-lodaTextTip.width)/2,win_h/2);
        backLayer.addChild(lodaTextTip);
        Music=new Laya.Image("comp/yingyue1.png");
        Music.x = 520;
        Music.y = 20;
        Music.width = 60;
        Music.height = 60;
        Music.autoSize = true;
        Music.on(Laya.Event.MOUSE_DOWN,this,changM)
        function changM(){
            M=M==true?false:true;
            if(M){
                Music.skin="comp/yingyue1.png";
                startLayer?Laya.SoundManager.playMusic('music/gamestart.mp3'):"";
                ingLayer?Laya.SoundManager.playMusic('music/gameing.mp3'):'';
                overOneLayer?Laya.SoundManager.playMusic('music/gameover.mp3',1):"";
            }else{
                Music.skin="comp/yingyue2.png";
                Laya.SoundManager.stopAll();
            }
        }
    }
    function onProgress(progress){
        lodaTextTip.text = "";
        lodaTextTip.text = "正在加载中..."+Math.floor(progress*100)+"%";
    }
    function onLoadUI(){
        util = new Util();
        room = new Room();
        Gameing = new Game()
        lodaTextTip.removeSelf();
        Game_start = new GameStart();
    }