//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        _super.call(this);
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    var d = __define,c=Main;p=c.prototype;
    p.onAddToStage = function (event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    };
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    p.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.loadGroup("heros");
    };
    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    p.onResourceLoadComplete = function (event) {
        if (event.groupName == "heros") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            this.createGameScene();
        }
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    p.onResourceLoadError = function (event) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    };
    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    p.onResourceProgress = function (event) {
        if (event.groupName == "heros") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    };
    /**
     * 创建游戏场景
     * Create a game scene
     */
    p.createGameScene = function () {
        var bg = new egret.Shape;
        bg.graphics.beginFill(0x336699);
        bg.graphics.drawRect(0, 0, this.stage.stageWidth, this.stage.stageHeight);
        bg.graphics.endFill();
        this.addChild(bg);
        //获取图片样式
        console.log("createGameScene", RES.getRes("hero-01"));
        //显示图片
        var hero01 = new egret.Bitmap(RES.getRes("hero-01"));
        hero01.x = -30;
        hero01.y = 10;
        this.addChild(hero01);
        //03# 设置锚点
        hero01.anchorOffsetX = hero01.width / 2;
        hero01.anchorOffsetY = hero01.height;
        hero01.x = hero01.x + hero01.width / 2;
        hero01.y = hero01.y + hero01.height;
        /*
        var hero02: egret.Bitmap = new egret.Bitmap(RES.getRes("hero-02"));
        hero02.x = 70;
        hero02.y = 10;
        this.addChild(hero02);
        var hero03: egret.Bitmap = new egret.Bitmap(RES.getRes("hero-03"));
        hero03.x = 170;
        hero03.y = 10;
        this.addChild(hero03);
        var hero04: egret.Bitmap = new egret.Bitmap(RES.getRes("hero-04"));
        hero04.x = 270;
        hero04.y = 10;
        this.addChild(hero04);
        
        //02# 查看深度
        console.log("display indexes:",this.getChildIndex(bg),this.getChildIndex(hero01),
            this.getChildIndex(hero02),this.getChildIndex(hero03),this.getChildIndex(hero04));
         //交换深度1  先后顺序
        this.setChildIndex(hero01,this.getChildIndex(hero02));
        //交换深度2
        this.swapChildren(hero03,hero04);
        this.setChildIndex(hero02,20);
        */
        //查看深度
        // console.log("display indexes:",this.getChildIndex(bg),this.getChildIndex(hero01),
        //   this.getChildIndex(hero02),this.getChildIndex(hero03),this.getChildIndex(hero04));
        /*  --输出文字
        var tx: egret.TextField = new egret.TextField;
        tx.text = "ths is a egret peoject whith typescript";
        tx.x = 20;
        tx.y = 10;
        tx.size = 32;
        tx.width = this.stage.stageWidth - 40;
        this.addChild(tx);
        
        tx.touchEnabled = true;
        tx.addEventListener(egret.TouchEvent.TOUCH_TAP,this.changecolor,this);
      */
    };
    return Main;
})(egret.DisplayObjectContainer);
egret.registerClass(Main,"Main");
