var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        _super.call(this);
        //将每次调用Tick的时间保存下来
        this.now = 0;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    var d = __define,c=Main;p=c.prototype;
    p.onAddToStage = function (event) {
        //初始化Resource资源加载库
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    };
    /**配置文件加载完成,开始预加载preload资源组。*/
    p.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.loadGroup("preload");
    };
    /** preload资源组加载完成*/
    p.onResourceLoadComplete = function (event) {
        if (event.groupName == "preload") {
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            this.createGameScene();
        }
    };
    /**
    * 创建游戏场景
    * Create a game scene
    */
    p.createGameScene = function () {
        /**测试用位图*/
        this.background = new egret.Bitmap(RES.getRes("bg_jpg"));
        this.addChild(this.background);
        this.boss = new egret.Bitmap(RES.getRes("boss_png"));
        this.addChild(this.boss);
        //动画1
        //this.addEventListener(egret.Event.ENTER_FRAME,this. onEnterFrame,this);
        //动画1 this.speed = 1;
        this.speed = 0.05;
        this.diraction = 1;
        //注册tick 动画2
        //egret.startTick(this.onTicker,this);
    };
    //动画1
    p.onEnterFrame = function (evt) {
        var x = this.boss.x;
        var y = this.boss.y;
        if (y < this.stage.stageHeight - this.boss.height) {
            this.boss.y += this.speed;
        }
        if (x < this.stage.stageWidth - this.boss.width && x > 0) {
            this.boss.x += this.speed * this.diraction;
        }
        else if (x <= 0) {
            this.boss.x += this.speed;
            this.diraction = 1;
        }
        else {
            this.boss.x -= this.speed;
            this.diraction = -1;
        }
    };
    //动画2
    p.onTicker = function (time) {
        if (!this.now) {
            this.now = time;
        }
        var then = time;
        //计算时间间隔
        var pass = then - this.now;
        var x = this.boss.x;
        var y = this.boss.y;
        if (y < this.stage.stageHeight - this.boss.height) {
            this.boss.y += this.speed * pass;
        }
        if (x < this.stage.stageWidth - this.boss.width && x > 0) {
            this.boss.x += this.speed * this.diraction * pass;
        }
        else if (x <= 0) {
            this.boss.x += this.speed * pass;
            this.diraction = 1;
        }
        else {
            this.boss.x -= this.speed * pass;
            this.diraction = -1;
        }
        //刷新时间
        this.now = then;
        return false;
    };
    return Main;
})(egret.DisplayObjectContainer);
egret.registerClass(Main,"Main");
