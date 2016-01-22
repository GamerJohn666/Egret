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

class Main extends egret.DisplayObjectContainer {

    /**
     * 加载进度界面
     * Process interface loading
     */
    private loadingView:LoadingUI;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event:egret.Event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);

        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    }

    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    private onConfigComplete(event:RES.ResourceEvent):void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.loadGroup("preload");
    }

    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    private onResourceLoadComplete(event:RES.ResourceEvent):void {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            this.createGameScene();
        }
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onResourceLoadError(event:RES.ResourceEvent):void {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    }

    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    private onResourceProgress(event:RES.ResourceEvent):void {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }

    private textfield:egret.TextField;

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene():void {
        
        var draggedObject: egret.Shape;
        var bg: egret.Shape = new egret.Shape();
        bg.graphics.beginFill(0x336699);
        bg.graphics.drawRect(0,0,this.stage.stageWidth,this.stage.stageHeight);
        bg.graphics.endFill();
        this.addChild(bg);
       
        /*
        var urlreq: egret.URLRequest = new egret.URLRequest("http://httpbin.org/user-agent");
        
        var urlloader: egret.URLLoader = new egret.URLLoader;
        urlloader.addEventListener(egret.Event.COMPLETE,function(evt: egret.Event):void{
           console.log(evt.target.data);
        },this);
        urlloader.load(urlreq);*/
        var sp: egret.Sprite = new egret.Sprite();
        sp.x = 30;
        sp.y = 30;
        this.addChild(sp);
        
        var circle: egret.Shape = new egret.Shape;
        circle.graphics.beginFill(0xff0000);
        circle.graphics.drawCircle(25,25,25);
        circle.graphics.endFill();
        sp.addChild(circle);
        
        
        var square: egret.Shape = new egret.Shape();
        square.graphics.beginFill(0x0000ff);
        square.graphics.drawRect(0,0,100,100);
        square.graphics.endFill();
        this.addChild(square);
        
        
        
       /*   01
        circle.addEventListener(egret.TouchEvent.TOUCH_TAP,ontouch,this);
        function ontouch(): void {
           var targetPoint: egret.Point = sp.globalToLocal(0,0);
           alert(targetPoint.x + " " + targetPoint.y);
            circle.x = targetPoint.x;
            circle.y = targetPoint.y;
            //circle.x = 0;
           //circle.y = 0;

        }
        */
        
        // 02 移动
        var setx: number=0;
        var sety: number=0;
        //增加圆形的触摸监听
        circle.touchEnabled = true;
        circle.addEventListener(egret.TouchEvent.TOUCH_BEGIN,startMove,this);
        circle.addEventListener(egret.TouchEvent.TOUCH_END,stopMove,this);
        //增加正方形的触摸监听
        square.addEventListener(egret.TouchEvent.TOUCH_BEGIN,startMove,this);
        square.addEventListener(egret.TouchEvent.TOUCH_END,stopMove,this);
        
        
        function startMove(evt:egret.TouchEvent):void{
            //按到的对象
            draggedObject = evt.currentTarget;
            
             //计算手指和圆形的距离
            setx = evt.stageX - circle.x;
            sety = evt.stageY - circle.y;
            //把触摸的对象放在显示列表的顶层
            this.addChild(draggedObject);
            
            //手指在屏幕上移动，会触发 onMove 方法
            circle.addEventListener(egret.TouchEvent.TOUCH_MOVE,onMove,this);
           
            
        }
        
        function stopMove(evt: egret.TouchEvent): void {
            //手指离开屏幕，移除手指移动的监听
            this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE,onMove,this);
        }
        function onMove(evt: egret.TouchEvent): void{
            //通过计算手指在屏幕上的位置，计算当前对象的坐标，达到跟随手指移动的效果
            draggedObject.x = evt.stageX - setx;
            draggedObject.y = evt.stageY - sety;
        }
    }
    
    
    
    
    

}


