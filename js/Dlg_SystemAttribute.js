/**
 * @api Dlg_SystemAttribute
 * @apiGroup Dlg_SystemAttribute
 * @apiName  0
 * @apiDescription 系统设置窗口
 */
function Dlg_SystemAttribute()
{
	/**
	 * @api OnShowCoord()
	 * @apiDescription 2D是否显示背景网格
	 * @apiGroup Dlg_SystemAttribute                   
	 */	
	this.OnShowCoord = function()
	{
		if(app.header.showLable.check_coord == true)
			m_Coordniate.OnShow(true);
		else
			m_Coordniate.OnShow(false);
	};
	

	/**
	 * @api OnWireframe(bShow)
	 * @apiDescription 3D是否显示线框
	 * @apiGroup Dlg_SystemAttribute 
	 * @apiParam (参数) bShow false不显示,true显示
	 */	
	this.OnWireframe = function(bShow)
	{
		mHouseClass.mWallClass3D_Out.OnWireframe(bShow);
		mHouseClass.mWallClass3D_In.OnWireframe(bShow);
	};

	/**
	 * @api OnMaterial(bShow)
	 * @apiDescription 3D内外墙是否显示材质
	 * @apiGroup Dlg_SystemAttribute 
	 * @apiParam (参数) bShow false不显示,true显示
	 */
	this.OnMaterial = function(bShow)
	{
		mHouseClass.mWallClass3D_Out.OnMaterial(bShow);
		mHouseClass.mWallClass3D_In.OnMaterial(bShow);		
	};
	
	// 显示尺寸
	this.OnShowLabel = function()
	{
		if( mFloorCameraClass.m_bShowAllRoom == false )		// 不是显示所有房间, 则不进行当前操作
				return null;		
		if(app.header.showLable.check_label == true)
			mHouseClass.mFloorClass.OnShowLabelAll(false);	// 户型尺寸
		else
			mHouseClass.mFloorClass.OnShowLabelAll(true);	
	};
	

	/**
	 * @api OnShowFurniture()
	 * @apiDescription 是否显示所有家具
	 * @apiGroup Dlg_SystemAttribute 
	 * 
	 */	
	this.OnShowFurniture = function()
	{			
		if( mFloorCameraClass.m_bShowAllRoom == false )		// 不是显示所有房间, 则不进行当前操作
				return null;
				
		if(app.header.showLable.check_Furniture == true)
			mHouseClass.mFurnitureClass.OnShowFurnitureAll(false);
		else
			mHouseClass.mFurnitureClass.OnShowFurnitureAll(true);			
	};
	
	/**
	 * @api OnShowRoomName()
	 * @apiDescription 是否显示所有文字
	 * @apiGroup Dlg_SystemAttribute 
	 * 
	 */	
	this.OnShowRoomName = function()
	{
		if(app.header.showLable.check_RoomName == true)
			mHouseClass.mTextClass.OnShowRoomName(true);
		else
			mHouseClass.mTextClass.OnShowRoomName(false);		
	};
	
	
	/**
	 * @api OnShowRoomName()
	 * @apiDescription 是否显示透明外墙体
	 * @apiGroup Dlg_SystemAttribute 
	 * 
	 */		
	this.OnShowTransparentWall = function()
	{
		if(app.header.showLable.check_TransparentWall == true)
			mHouseClass.OnShowAlphaWall(false);
		else
			mHouseClass.OnShowAlphaWall(true);		
	};
	
	this.OnShowAlphaWAll = function()
	{
		switch(app.header.showLable.check_WallMode)
		{
			case 1:
			{
				for( var k =0; k< mHouseClass.mWallClass3D_Out.mWallArray.length; k++ )
					mHouseClass.mWallClass3D_Out.mWallArray[k].mWallMesh.material.opacity = 0.5;
				for( var j =0; j< mHouseClass.mRenderCeilingTop.length; j++ )
					mHouseClass.mRenderCeilingTop[j].visible = true;	
			}
			break;
			case 2:
			{
				for( var k =0; k< mHouseClass.mWallClass3D_Out.mWallArray.length; k++ )
					mHouseClass.mWallClass3D_Out.mWallArray[k].mWallMesh.material.opacity = 0;	
				for( var j =0; j< mHouseClass.mRenderCeilingTop.length; j++ )
					mHouseClass.mRenderCeilingTop[j].visible = false;
			}
			break;
			case 3:
			{
				for( var k =0; k< mHouseClass.mWallClass3D_Out.mWallArray.length; k++ )
					mHouseClass.mWallClass3D_Out.mWallArray[k].mWallMesh.material.opacity = 1;	
				for( var j =0; j< mHouseClass.mRenderCeilingTop.length; j++ )
					mHouseClass.mRenderCeilingTop[j].visible = true;
			}
			break;
		}
	};
	
	/**
	 * @api OnShowRoomName()
	 * @apiDescription 是否显示透明内墙体
	 * @apiGroup Dlg_SystemAttribute 
	 * 
	 */	
	this.OnShowTransparentWall_In= function()
	{
		if(app.header.showLable.check_TransparentWall1 == true)
			mHouseClass.OnShowAlphaWall_In(false);
		else
			mHouseClass.OnShowAlphaWall_In(true);			
		
	};
	
	this.OnHideView =function()
	{
		// 关闭所有窗口
		var showMain=$('.apartmentNavigation').attr("showMain");
		$('.apartmentNavigation').fadeOut(150,function(){
			$(showMain).fadeIn(150);
			moveBlock();
		});
		
		var showMain1=$('.designSketch').attr("showMain");
		$('.designSketch').fadeOut(150,function(){
			$(showMain1).fadeIn(150);
			moveBlock();
		});
		
		var showMain2=$('.main-left').attr("showMain");
		$('.main-left').fadeOut(150,function(){
			$(showMain2).fadeIn(150);
			moveBlock();
		});		
	};
	
	this.OnShowView = function()
	{
		var showMain3=$('.apartmentNavigation-min').attr("showMain");
		$('.apartmentNavigation-min').fadeOut(150,function(){
			$(showMain3).fadeIn(150);
			moveBlock();
		});
		
		var showMain4=$('.designSketch-min').attr("showMain");
		$('.designSketch-min').fadeOut(150,function(){
			$(showMain4).fadeIn(150);
			moveBlock();
		});
		
		var showMain5=$('.main-left-min').attr("showMain");
		$('.main-left-min').fadeOut(150,function(){
			$(showMain5).fadeIn(150);
			moveBlock();
		});		
	};
	
	// 窗口最大化
	this.OnViewMax = function()
	{
		// 是否要打开
		if( $(".apartmentNavigation").offset().top == 0 )
			this.OnShowView();
		else
			this.OnHideView();
	};
	
	/**
	 * @api OnShowRoomName()
	 * @apiDescription 是否显示显示帮助内容
	 * @apiGroup Dlg_SystemAttribute 
	 * 
	 */		
	this.ShowHelp = function()
	{
		//苏州
		if(m_strWebService == 'http://3d.i3dtu.com/')
		{
			window.open('http://www.i3dtu.com/video/');
		}
		else
		{
			window.open('http://www.ihouse3d.com/video.html');
		}
	};
	
	this.ShowBackend = function()
	{
		let base64PWD = encodeURIComponent(base64_encode(mPWD));
		window.open(`http://www.ihouse3d.com/information.html?username=${mUserAccount}&pwd=${base64PWD}`);
	}
}

/**
 * @api OnpenupdateLogs()
 * @apiDescription 显示更细日志
 * @apiGroup 全局函数
 * 
 */	
function OnpenupdateLogs() { //更新日志

/*
  	str+= "平面分房间时地面材质保留		()\r\n";
	str+= "生成承重墙				()\r\n";
	str+= "生成矮墙				()\r\n";
	str+= "内墙线输入尺寸	绘图完善		()\r\n";
	str+= "圆弧形矢量模块				()\r\n";
	str+= "成组矢量模块				()\r\n";
	str+= "存读取矢量图设计方案			()\r\n";
 */

	var str = "[2021-1-19]\r\n"
	str+= "物料管理增加显示真实数据                (已完成)\r\n";
	str+= "物料管理增加显示房间图片                (已完成)\r\n";
	str+= "物料管理增加数据导出                    (已完成)\r\n";
	str+= "施工计划界面调整                        (已完成)\r\n";
	str+= "施工计划真实数据连接                    (已完成)\r\n";
	str+= "施工计划安装人数计算                    (已完成)\r\n";
	str+= "顶面界面                                (已完成)\r\n";
	str+= "顶面界面功能状态                        (已完成)\r\n";
	str+= "系统整个功能串通优化，细节调整          (已完成)\r\n";
	str+= "\r\n";

	str+= "[2021-1-15]\r\n"
	str+= "加工清单界面高速                        (已完成)\r\n";
	str+= "加工清单数据完善                        (已完成)\r\n";
	str+= "加工清单增加明细清单                    (已完成)\r\n";
	str+= "加工料单、明细清单增加导出              (已完成)\r\n";
	str+= "包装管理导出界面                        (已完成)\r\n";
	str+= "包装管理导出界面数据显示                (已完成)\r\n";
	str+= "包装管理导出增加显示房间图片            (已完成)\r\n";
	str+= "加工清单一键下单调整                    (已完成)\r\n";
	str+= "算法优化增加导入订单                    (已完成)\r\n";
	str+= "\r\n";

	str+= "[2021-1-8]\r\n"
	str+= "报价清单列表增加导出功能                (已完成)\r\n";
	str+= "包装管理增加显示房间图片                (已完成)\r\n";
	str+= "包装管理增加显示多个包装数据            (已完成)\r\n";
	str+= "包装管理增加导出数据                    (已完成)\r\n";
	str+= "图纸管理界面                            (已完成)\r\n";
	str+= "图纸管理平面布置                        (已完成)\r\n";
	str+= "图纸管理立面视图                        (已完成)\r\n";
	str+= "图纸管理安装说明                        (已完成)\r\n";
	str+= "算法优化细节调整                        (已完成)\r\n";
	str+= "算法优化导出数据                        (已完成)\r\n";
	str+= "算法优化导出图片                        (已完成)\r\n";
	str+= "\r\n";

	str+= "[2020-12-31]\r\n"
	str+= "生成报价清单时，选择厂商时物料也使用选择的厂商   (已完成)\r\n";
	str+= "报价清单选择不同厂商，显示对应厂商的计算价格     (已完成)\r\n";
	str+= "报价清单根据厂商与项目地址计算出物流价格         (已完成)\r\n";
	str+= "报价清单中板材、配件数据排序                     (已完成)\r\n";
	str+= "算料优化界面                                     (已完成)\r\n";
	str+= "包装管理界面                                     (已完成)\r\n";
	str+= "包装管理标签界面                                 (已完成)\r\n";
	str+= "加工清单选择界面                                 (已完成)\r\n";
	str+= "\r\n";

	str+= "[2020-12-25]\r\n";
   	str+= "渲染窗口可以隐藏模型			(已完成)\r\n";
   	str+= "\r\n";
   	
	str+= "[2020-12-21]\r\n";
   	str+= "3D下创建一键布置无效提示		(已完成)\r\n";
   	str+= "一键布置详细窗口 ，一键应用按钮有效	(已完成)\r\n";
   	str+= "房间模板生成时，设置墙体高度		(已完成)\r\n"
   	str+= "3D下点中墙体显示参数窗口		(已完成)\r\n";
   	str+= "3D下点中地面显示参数窗口		(已完成)\r\n";
   	str+= "3D下锁定物体后移动该物体为旋转像机	(已完成)\r\n";
   	str+= "3D下从左右上下成排复制			(已完成)\r\n";
   	str+= "\r\n";
   	
	str+= "[2020-10-27]\r\n";
	str+= "修复地面区域铺贴大小不对BUG		(已完成)\r\n";
	str+= "修复模型初始化尺寸BUG			(已完成)\r\n";
	str+= "保存再打开预算正确			(已完成)\r\n";
	str+= "增加场景加载进度条			(已完成)\r\n";
	str+= "\r\n";
	
	str+= "[2020-10-20]\r\n";
	str+= "物体恢复默认大小			(已完成)\r\n";
	str+= "3D下滑动放大缩小去掉			(已完成)\r\n";
	str+= "\r\n";
	
	str+= "[2020-9-30]\r\n";
	str+= "平面下选择柱子、烟道、家具时，相应辅助系统隐藏(已完成)\r\n";
	str+= "\r\n";
	
	str+= "[2020-9-22]\r\n";
	str+= "外墙全透明				(已完成)\r\n";
	str+= "快速墙体绘制辅助修改			(已完成)\r\n";
	str+= "\r\n";
	
	str+= "[2020-9-11]\r\n";
	str+= "渲染效果图时镜头光编辑			(已完成)\r\n";
	str+= "渲染效果图时太阳光编辑			(已完成)\r\n";
	str+= "渲染效果图时面光源编辑			(已完成)\r\n";	
	str+= "渲染效果图时点光源编辑			(已完成)\r\n";
	str+= "渲染效果图时射灯光编辑			(已完成)\r\n";
	str+= "\r\n";
	
	str+= "[2020-8-28]\r\n";
	str+= "窗户左右离墙距离可编辑			(已完成)\r\n";
	str+= "门左右离墙距离可编辑			(已完成)\r\n";	
	str+= "\r\n";

	str+= "[2020-8-26]\r\n";
	str+= "烟道到四周的距离可编辑			(已完成)\r\n";
	str+= "烟道到四周的距离显示			(已完成)\r\n";	
	str+= "柱子到四周的距离可编辑			(已完成)\r\n";
	str+= "柱子到四周的距离显示			(已完成)\r\n";
	str+= "\r\n";	
	
	str+= "[2020-8-24]\r\n";
	str+= "内墙线绘制时按CTRL前切换提示		(已完成)\r\n";
	str+= "2D创建文字拖拽方式			(已完成)\r\n";	
	str+= "输入长度绘制墙体时，输入框跟随移动	(已完成)\r\n";
	str+= "图库中删除效果图			(已完成)\r\n";	
	str+= "\r\n";
	
	str+= "[2020-8-19]\r\n";
	str+= "存/读取文字				(已完成)\r\n";
	str+= "柱子视图导航可见			(已完成)\r\n";
	str+= "\r\n";	
	
	str+= "[2020-8-17]\r\n";
	str+= "保存场景后的UV出错		  	(已完成)\r\n";
	str+= "平面图上物体有时在地面下		(已完成)\r\n";
	str+= "平面移动墙体鼠标十字箭头		(已完成)\r\n";			
	str+= "\r\n";	
	
	str+= "[2020-8-13]\r\n";
	str+= "增加渲染时设置房间亮度		  	(已完成)\r\n";
	str+= "增加渲染界面打开效果图相册		(已完成)\r\n";
	str+= "\r\n";

	str+= "[2020-8-12]\r\n";
	str+= "移动平面图变手型		  	(已完成)\r\n";
	str+= "移动墙体后，再移动门BUG			(已完成)\r\n";
	str+= "\r\n";
	
	str+= "[2020-8-10]\r\n";
	str+= "烟道视图导航可见			(已完成)\r\n";
	str+= "\r\n";
	
	str+= "[2020-8-5]\r\n";
	str+= "创建墙体时打断墙体			(已完成)\r\n";
	str+= "移动墙体修改				(升级)\r\n"	
	str+= "鼠标移动到墙体上时高亮修改		(已完成)\r\n";	
	str+= "删除墙体合并墙体			(已完成)\r\n";
	str+= "修改3D墙体贴图后2D/3D切换尺寸放大	(已完成)\r\n";
	str+= "\r\n";
	
	str+= "[2020-7-31]\r\n";
	str+= "平面隐藏家具，不显示操作框		(已完成)\r\n";
	str+= "\r\n";
	
	str+= "[2020-7-26]\r\n";
	str+= "平面绘制梁				(已完成)\r\n";
	str+= "完善渲染摄像机操作			(已完成)\r\n";
	str+= "\r\n";
	str+= "[2020-7-20]\r\n";	
	str+= "CAD保存后读取显示地面			(已完成)\r\n";
	str+= "\r\n";
	
	str+= "[2020-7-16]\r\n";
	str+= "模型隐藏时不参与渲染			(已完成)\r\n";
	str+= "保存时缩略图比例正常			(已完成)\r\n";
	str+= "修改保存后打开场景高错误		(已完成)\r\n";
	str+= "2D平面操作小件物品在大件物品上		(已完成)\r\n";
	str+= "\r\n";
	
	str+= "[2020-7-13]\r\n";
	str+= "选中柱子del键删除			(已完成)\r\n";
	str+= "选中烟道del键删除			(已完成)\r\n";
	str+= "边线绘制墙体				(已完成)\r\n";
	str+= "\r\n";
	
	str+= "[2020-7-7]\r\n";
	str+= "平面图量尺功能				(已完成)\r\n";
	str+= "选中量尺del键删除			(已完成)\r\n";
	str+= "选中墙体del键删除			(已完成)\r\n";
	str+= "\r\n";
	
	str+= "[2020-7-6]\r\n";
	str+= "平面图窗尺寸显示			(已完成)\r\n";
	str+= "平面图门尺寸显示			(已完成)\r\n";
	str+= "读取场景文件的房间高度			(已完成)\r\n";
	str+= "修改一些BUG				(已完成)\r\n";
	str+= "\r\n";
	
	str+= "[2020-7-1]\r\n";
	str+= "子母门功能				(已完成)\r\n";
	str+= "读取36个矢量图标			(已完成)\r\n";	
	str+= "画墙体时，鼠标移到四周可扩展画板	(已完成)\r\n";
	str+= "\r\n";
	
	str+= "[2020-6-23]\r\n";
	str+= "家具2D操作拉伸界面			(已完成)\r\n";
	str+= "平面下家具四方向距离可编辑		(已完成)\r\n"
	str+= "\r\n";
	
	str+= "[2020-6-18]\r\n";
	str+= "平面下矢量四方向距离显示		(已完成)\r\n";
	str+= "平面下矢量四方向距离可编辑		(已完成)\r\n";
	str+= "增加6个矢量图沙发模块			(已完成)\r\n";
	str+= "增加15个餐椅				(已完成)\r\n";
	str+= "\r\n";
	
	str+= "[2020-6-13]\r\n";
	str+= "通用柜矢量图模块			(已完成)\r\n";
	str+= "坐便器矢量图模块			(已完成)\r\n";
	str+= "空格键旋转矢量图			(已完成)\r\n";
	str+= "空格键旋转家具				(已完成)\r\n";		
	str+= "\r\n";
	
	str+= "[2020-6-6]\r\n";
	str+= "烟道功能				(已完成)\r\n";
	str+= "柱子功能				(已完成)\r\n";
	str+= "\r\n";
	
	str+= "[2020-6-3]\r\n";
	str+= "绘制墙体时设置墙厚、是否正交和吸附	(已完成)\r\n";
	str+= "平面上墙体高亮鼠标移上去高亮		(已完成)\r\n";
	str+= "渲染支付模块				(已完成)\r\n"
	str+= "模型换材质用户可上传图片		(已完成)\r\n";	
	str+= "平面增加测量功能			(开发中)\r\n";
	str+= "平面选框后、整体移动、整体删除、整体旋转(已完成)\r\n";
	str+= "\r\n";
	
	str+= "[2020-5-30]\r\n";
	str+= "平面下临时成组				(已完成)\r\n"	
	str+= "墙体绘制方式完善			(已完成)\r\n";
	str+= "用鼠标拉伸门窗				(已完成)\r\n";
	str+= "门窗在短墙上自适应			(已完成)\r\n";
	str+= "墙标注尺寸完善				(已完成)\r\n";
	str+= "\r\n";	
	
	str+= "[2020-5-25]\r\n";
	str+= "墙体绘制方式完善			(已完成)\r\n";
	str+= "2D多选框、左往右涵盖选、右往左触碰选	(已完成)\r\n";
	str+= "门鼠标移上去高亮、鼠标变移动箭头	(已完成)\r\n";
	str+= "窗鼠标移上去高亮、鼠标变移动箭头	(已完成)\r\n";
	str+= "\r\n";
	
	str+= "[2020-5-11]\r\n";
	str+= "2D平面移动墙体,门窗跟随移动		(已完成)\r\n";
	str+= "2D修改墙体厚度后,门窗自适应厚度		(已完成)\r\n";
	
	
	str+= "修复调整层高后顶面升高BUG	()\r\n";
	str+= "增加两种拱形门洞			(已完成)\r\n";	
	str+= "增加文字模型生成			(已完成)\r\n";
	str+= "\r\n";
	
	str+= "[2020-4-30]\r\n";
	str+= "修复成组后升高BUG			(已完成)\r\n";
	str+= "渲染时视角视野调整完善			(已完成)\r\n";
	str+= "\r\n";
	
	
	str+= "[2020-4-16]\r\n";
	str+= "门旋转有四个方向			(已完成)\r\n";
	str+= "修复读取flash版场景墙面为黑BUG		(已完成)\r\n";
	
	str+= "\r\n";
	str+= "[2020-4-13]\r\n";
	str+= "模型等比例缩放				(已完成)\r\n";
	str+= "可锁定所有物体				(已完成)\r\n";
	str+= "可在新窗口渲染				(已完成)\r\n";	
	
	str+= "\r\n";
	str+= "[2020-4-3]\r\n";
	str+= "修改3D物体控制方式			(已完成)\r\n";
	str+= "可在新窗口显示漫游			(已完成)\r\n";
	
	str+= "\r\n";
	str+= "[2020-3-9]\r\n";
	str+= "改变浏览器窗口大小时2D、3D显示正常	(已完成)\r\n";
	str+= "\r\n";
	
	str+= "[2020-3-9]\r\n";
	str+= "户型水平镜像				(已完成)\r\n";
	str+= "户型垂直镜像				(已完成)\r\n";
	str+= "户型旋转90度				(已完成)\r\n";
	str+= "平台与物体增加楼层属性			(已完成)\r\n";
	str+= "平台底部加吊顶属性			(已完成)\r\n";
	str+= "物体自动在平台上(临时)			(已完成)\r\n";
	str+= "\r\n";
	
	str+= "[2020-2-28]\r\n";
	str+= "模型替换贴图				(已完成)\r\n";
	str+= "2D拖拽墙体时地面纹理正确		(已完成)\r\n";
	str+= "修改墙体厚度				(已完成)\r\n";
	str+= "拆分墙体				(已完成)\r\n";
	str+= "锁定不移动家具				(已完成)\r\n";
	str+= "3D下内墙透明				(已完成)\r\n";
	str+= "\r\n";
	
	str+= "[2020-2-10]\r\n";
	str+= "可更换数据中心			        (已完成)\r\n";
	str+= "\r\n";

	str+= "[2019-12-20]\r\n";
	str+= "上传全景图片生成全景			(已完成)\r\n";
	str+= "显示个人方案中所有全景			(已完成)\r\n";
	str+= "显示共享方案中所有全景			(已完成)\r\n";
	str+= "选择全景进行编辑、合成、热点设置        (已完成)\r\n";
	str+= "全景发布功能		                (已完成)\r\n";
	str+= "查看合成的全景		                (已完成)\r\n";
	str+= "\r\n";

	str+= "[2019-12-15]\r\n";
	str+= "顶面集成吊顶设计			(已完成)\r\n";
	str+= "顶面集成电器设计			(已完成)\r\n";
	str+= "顶面集成吊顶渲染			(已完成)\r\n";
	str+= "墙地面云渲染纹理坐标修正		(已完成)\r\n";
	
	str+= "\r\n";
	str+= "[2019-12-11]\r\n";
	str+= "用户是否在有效时间登陆			(已完成)\r\n";
	str+= "用户唯一在线				(已完成)\r\n";	
	str+= "增加地台功能				(已完成)\r\n";
	str+= "模型库鼠标经过显示分类开关		(已完成)\r\n";
	str+= "样板间增加分类				(已完成)\r\n";
	str+= "平面缩放+-按钮				(已完成)\r\n";
	str+= "画户型按钮旁增加挖洞			(已完成)\r\n";
	str+= "房间模板单独分类展现			(已完成)\r\n";
	str+= "点击户型模板后加提示			(已完成)\r\n";
	str+= "平面鼠标滚动缩放设置			(已完成)\r\n";
	str+= "整体设置层高(1-10)米			(已完成)\r\n";
	

	str+= "\r\n";
	str+= "[2019-12-05]\r\n";
	str+= "增加保存场景			        (已完成)\r\n";
	str+= "增加场景另存为			        (已完成)\r\n";
	str+= "增加场景保存到共享方案			(已完成)\r\n";
	str+= "增加支持片灯渲染                        (已完成)\r\n";
	str+= "修改导入cad时没有正确清除原场景问题     (已完成)\r\n";
	str+= "渲染效果图保存到对应场景目录下	        (已完成)\r\n";

	str+= "\r\n";	
	str+= "[2019-11-29]\r\n";
	str+= "清除家具			(已完成)\r\n";
	str+= "全景插件完善\r\n";
	str+= "导入的CAD户型保存读取\r\n";
	
	str+= "\r\n";
	str+= "[2019-11-26]\r\n";
	str+= "修改平面上家具层次关系			(已完成)\r\n";
	str+= "3D墙体贴图到正确位置			(已完成)\r\n";
	str+= "平面上不能正确选中家具问题		(已完成)\r\n";
	str+= "增加一种产品清单			(已完成)\r\n";
	str+= "单房间显示时，只显示本房间文字		(已完成)\r\n";
	str+= "不同账号不同功能			(已完成)\r\n";
	
	str+= "\r\n";
	str+= "[2019-11-12]\r\n";
	str+= "显示菜单增加墙体吸附开关		(已完成)\r\n";
	str+= "物体并排复制				(已完成)\r\n";
	
	str+= "\r\n";
	str+= "[2019-11-1]\r\n";
	str+= "按住CTRL键物体成组、解组		(已完成)\r\n";
	str+= "物体成组后移动、旋转			(已完成)\r\n";
	
	str+= "\r\n";
	str+= "[2019-10-24]\r\n";
	str+= "方案保存				(已完成)\r\n";
	str+= "方案另存为				(已完成)\r\n";
	str+= "两套AI智能房间				(已完成)\r\n";
	
	str+= "\r\n";
	str+= "[2019-10-16]\r\n";
	str+= "平面下AI智能房间布置			(已完成)\r\n";
	str+= "毛坯房漫游	   			(已完成)\r\n";
	str+= "点击产品购买进入淘宝	   		(已完成)\r\n";
	str+= "\r\n";
	
	str+= "[2019-9-27]\r\n";
	str+= " 缩略图操作分房间显示			(已完成)\r\n";
	str+= " 3D下家具旋转完善			(已完成)\r\n";
	str+= " 2D输入尺寸绘制墙体			(已完成)\r\n";
	str+= " 高级渲染全景渲染			(已完成)\r\n";
	str+= " 增加快速预算				(已完成)\r\n";
	
	str+= "\r\n";
	str+= "[2019-9-16]\r\n";
	str+= " 保存平面图				(已完成)\r\n";
	str+= " 3D房间文字显示				(已完成)\r\n";
	str+= " 3D地面材质铺贴				(已完成)\r\n";
	str+= " 2D下窗户替换				(已完成)\r\n";
	str+= " 2D下门替换				(已完成)\r\n";
	
	str+= "\r\n";
	str+= "[2019-9-11]\r\n";
	str+= " 不同账号显示不同品牌库			(已完成)\r\n";
	str+= " 2D地面材质铺贴				(已完成)\r\n";
	str+= " 房型库缩略图更新			(已完成)\r\n";
	str+= " CAD户型导入				(开发中)\r\n";
	str+= " 快捷方式				(更新)\r\n";
	
	str+= "\r\n";
	str+= "[2019-8-29]\r\n";
	str+= " 2D修改房间变文字			(已完成)\r\n";
	str+= " 2D增加删除墙体				(已完成)\r\n";
	str+= "\r\n";
	str+= "[2019-8-28]\r\n";
	str+= " 品牌库功能				(已完成)\r\n";
	str+= " 4个房形模板				(已完成)\r\n";
	str+= " 全景渲染				(开发中)\r\n";
	str+= " 保存、读取场景				(开发中)\r\n";
	str+= " 快捷方式				(开发中)\r\n";
	str+= " 读取户型库				(已完成)\r\n";
	str+= " 帮助连接到网站				(已完成)\r\n";
	
	str+= "\r\n";
	str+= "[2019-8-22]\r\n";
	str+= " 是否隐藏所有家具			(已完成)\r\n";
	str+= " 收藏物品功能				(已完成)\r\n";
	str+= " 玻璃门窗透明				(已完成)\r\n";
	str+= " 家具属性调整窗口			(已完成)\r\n";
	str+= " 渲染效果图的门窗			(已完成)\r\n";
	str+= " 模型不能降过0				(已完成)\r\n";
	str+= " CAD线框功能创建功能			(已完成)\r\n";
	str+= " 显示面积边3D界面最大化按钮		(已完成)\r\n";
	
	str+= "\r\n";
	str+= "[2019-8-10]\r\n";
	str+= " 渲染效果图功能框架			(已完成)\r\n";
	str+= " 渲染效果图的基本灯光			(已完成)\r\n";
	str+= " 渲染效果图的家具			(已完成)\r\n";
	str+= " 渲染效果图的门窗			(已完成)\r\n";
	str+= " 是否显示尺寸				(已完成)\r\n";
	str+= " 是否显示背景网格		 	(已完成)\r\n";
	str+= " 门洞创建			 	(已完成)\r\n";

	str+= "\r\n";
	str+= "[2019-7-24]\r\n";
	str+= " 家具克隆				(已完成)\r\n";
	str+= " CAD户型导出				(已完成)\r\n";
	str+= " 门窗3D显示				(已完成)\r\n";
	str+= " 2D下家具的显示问题			(已完成)\r\n";
	str+= " 2D下家具拖拽，删除复制			(已完成)\r\n";
	str+= " 模型创建时仿酷家乐拖拽 		(已完成)\r\n";
	str+= " 单个隐藏\显示家具			(已完成)\r\n";
	str+= " 2D门图标完善				(已完成)\r\n";
	
	str+= "\r\n";
	str+= "[2019-7-15]\r\n";	
	str+= " 更新日志		 		(已完成)\r\n";
	str+= " 全景编辑功能				(已完成)\r\n";
	str+= " 漫游体验				(已完成)\r\n";	
	
	remarks.value = str;
	$("#mBak").show();
	$(".updateLogs").show();
	$(".updateLogs").addClass("fadeInDown");
	setTimeout(function(){
		$(".updateLogs").removeClass("fadeInDown");
	},150);
}