
		var renderer, renderer2, scene, scene3D, camera, stats, raycaster,labelRenderer;
		var m_Coordniate, mHelpClass, mMathClass, mResource, mHemiLight, mCameraClass,mLightClass;
		var mFloorCameraClass,mPluginsClass,mWebAPI;
		var mAnimation,mHelpLineClass;

		var onLoad;
		var objects     = [];
		var mouseScreen = new THREE.Vector2();
		var mouse       = new THREE.Vector2(), INTERSECTED;
		var g_mouseX    = 0;
		var g_mouseY    = 0;
		var m_mouseOldX = 0;
		var m_mouseOldY = 0;
		var m_cPenType  = 0;
		var g_bPickObj  = false;
		var m_bCtrl 	= false;	// Ctrl 键是否按下

		var bMouseUp2D 	= false;	// 是否在2D下使用MouseUp

		var composer, effectFXAA, outlinePass;	// 轮廓
		var selectedObjects = [];
		init();
		animate();

		/**
		 * @api init(bShow)
		 * @apiDescription 初始化Web3D
		 * @apiGroup 全局函数                           
		 */			
		function init() {			
			scene = new THREE.Scene();									// 2D平面
			scene.background   = new THREE.Color( 0xf1f3f8 );
			
			scene3D 		   = new THREE.Scene();	// 3D
			scene3D.background = new THREE.Color( 0xe8e8e8 );
					
			var geometry = new THREE.SphereGeometry( 5 );
			var material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
			sphereInter  = new THREE.Mesh( geometry, material );
			sphereInter.visible = false;
			scene.add( sphereInter );
			
			root = new THREE.Object3D();
			
			raycaster = new THREE.Raycaster();
			raycaster.linePrecision = 3;
			
			renderer = new THREE.WebGLRenderer({ antialias: true,preserveDrawingBuffer:true });
			renderer.setPixelRatio( window.devicePixelRatio );
			renderer.setSize( window.innerWidth, window.innerHeight );			// 2D
			renderer.clearDepth(); // important!

			renderer2 = new THREE.WebGLRenderer( { antialias: true,preserveDrawingBuffer:true } );			// 3D
			renderer2.setPixelRatio( window.devicePixelRatio );
			renderer2.setSize( window.innerWidth, window.innerHeight );
					
			labelRenderer = new THREE.CSS2DRenderer();
			labelRenderer.setSize( window.innerWidth, window.innerHeight );
			labelRenderer.domElement.style.position = 'absolute';
			labelRenderer.domElement.style.top = 0;
					
			mPluginsClass = new PluginsClass();				// 插件相关
			
			mFloorCameraClass = new FloorCameraClass();		// 地面选择操作
			mFloorCameraClass.OnInit();
			
			mResource  = new Resource();
			mResource.OnInit();
						
			mCameraClass  = new CameraClass();
			mCameraClass.OnInit();
			
			m_Coordniate = new Coordniate();
			m_Coordniate.OnInit();	

			mHouseClass = new HouseClass();
			mHouseClass.OnInit();	
			
			mHelpClass = new HelpClass();
			mHelpClass.OnInit();
			
			mHelpLineClass = new HelpLineClass();
			mHelpLineClass.OnInit();
						
			mMathClass  = new MathClass();
			mLightClass = new LightClass();
			mLightClass.OnInit();
			
			// 初始化轮廓
			//===============================================================================================
			composer = new THREE.EffectComposer( renderer2 );

			var renderPass = new THREE.RenderPass( scene3D, mCameraClass.m_Camera3D );
			composer.addPass( renderPass );
			outlinePass = new THREE.OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), scene3D, mCameraClass.m_Camera3D );
			composer.addPass( outlinePass );

			effectFXAA = new THREE.ShaderPass( THREE.FXAAShader );
			effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
			effectFXAA.renderToScreen = true;
			composer.addPass( effectFXAA );
			
			outlinePass.edgeStrength = 5.0;
			outlinePass.edgeGlow = 0.0;
			outlinePass.edgeThickness = 1.0;
			outlinePass.pulsePeriod = 0;
			outlinePass.rotate = false;
			outlinePass.usePatternTexture = false;
			outlinePass.visibleEdgeColor.set( 0xff0000 );
			outlinePass.hiddenEdgeColor.set( 0xff0000 );
			//===============================================================================================
			
			m_ParamObjDlg  = new Dlg_FurnitureAttribute();	// 家具参数窗口
			m_ParamDoorDlg = new Dlg_DoorAttribute();   	// 门参数窗口
			m_ParamWinDlg  = new Dlg_WindowAttribute(); 	// 窗户参数窗口
			mParamSystemDlg= new Dlg_SystemAttribute();  	// 系统参数
			m_ParamWallDlg = new Dlg_WallAttribute();		// 墙体参数窗口
			m_ParamTextDlg = new Dlg_TextAttribute();		// 文字参数窗口
			m_ParamLabelDlg= new Dlg_LabelAttribute();		// 轮廓标注
			m_ParamGroundDlg=new Dlg_GroundAttribute();
			m_ParamFloorDlg =new Dlg_FloorAttribute();		// 地面参数窗口     
			m_ParamImageToPlanDlg= new Dlg_ImageToPlanAttribute();
			mAnimation = new Animation();
	
		//	m_ParamTexDlg  = new Dlg_ParamTex();
			container.appendChild( renderer.domElement );
				
		//	initStats();
			window.addEventListener('resize', onWindowResize,false );
			container.addEventListener('mousewheel',mousewheel, false );
			container.addEventListener('DOMMouseScroll', mousewheel);
			container.addEventListener('mousedown', mouseDown,  false );
			container.addEventListener('mousemove', mouseMove,  false );
			container.addEventListener('mouseup', 	mouseUp,    false );
					    
			document.oncontextmenu = function (event) {
        	event.preventDefault();
    		};
    		
    		OnpenupdateLogs();
    		
    		m_ParamImageToPlanDlg.Show();
    		$('#container1').hide();
    		
		//	ShowLoadingDlg(true);
		

		}
			
		function UpdateLoading()
		{
			$('#mLoadingText').text('正在加载数据...('+mHouseClass.mFurnitureClass.m_iLoadingNow+'/'+mHouseClass.mFurnitureClass.m_iLoading+')');
		};
		
		/**
		 * @api ShowLoadingDlg(bShow)
		 * @apiDescription 显示加载进度窗口
		 * @apiGroup 全局函数                           
		 */				
		function ShowLoadingDlg(bShow)
		{
			if(bShow == true)
			{
	    	    $('#mGifBak1').show();
	            $('#LoadingTime').show();				
			}
			else
			{
	    	    $('#mGifBak1').hide();
	            $('#LoadingTime').hide();					
			}
		};
		
		/**
		 * @api initStats()
		 * @apiDescription 调试信息窗口
		 * @apiGroup 全局函数                           
		 */		
      	function initStats() 
	    {
	        stats = new Stats();
	        stats.setMode(0); // 0: fps, 1: ms
	        stats.domElement.style.position = 'absolute';
	        stats.domElement.style.left ='9px';
	        stats.domElement.style.top  ='12px';
	        mStats.appendChild( stats.dom );
	    };
	    
	    
		/**
		 * @api mousewheel(e)
		 * @apiDescription 平面下鼠标中轴滚动, 放到缩小
		 * @apiGroup 全局函数                           
		 */	    
		function mousewheel(e) {
			m_Coordniate.mousewheel(e);
		};
		
		/**
		 * @api mouseDown(e)
		 * @apiDescription 鼠标按下消息
		 * @apiGroup 全局函数
		 * @apiParam (参数) e 鼠标信息
		 */			
		function mouseDown(e)
		{		
			HideDlg();	// 隐藏所有对话框
		
			if( e.button == 0 ) // 鼠标右键
			{
				if( IsContain(container, renderer.domElement ) == true )	// 平面操作方式	
				{
					GetMouseXY2D();
					m_mouseOldX = g_mouseX;
					m_mouseOldY = g_mouseY;
					g_bPickObj  = false;
					raycaster.setFromCamera( mouse, mCameraClass.m_Camera );
					if( e.button == 0 )		
					{
						switch( m_cPenType )
						{
							case 0:		// 拾取操作
							{
								if( true == mHouseClass.mWindowClass.OnPick2D_CtrlPos(g_mouseX,g_mouseY) )	//拾取左右拉伸点	
									return;
								if( true == mHouseClass.mDoorClass.OnPick2D_CtrlPos(g_mouseX,g_mouseY) )	//拾取左右拉伸点	
									return;
								if( true == mHouseClass.mWindowClass.OnMouseDown_Window(g_mouseX,g_mouseY))
							  		return;
							  	if( true == mHouseClass.mDoorClass.OnMouseDown_Door(g_mouseX,g_mouseY))
							  		return;
							  		
							    if( true == mHouseClass.mFlueClass.OnMouseDown_Flue(g_mouseX,g_mouseY))		//拾取烟道
							  	{
							  		mHouseClass.mPillarClass.OnHideCtrl();
							  		mHouseClass.mFurnitureClass.OnHideCtrl();
							  		return;
							  	}
							  		
							  	if( true == mHouseClass.mPillarClass.OnMouseDown_Flue(g_mouseX,g_mouseY))	//拾取柱子
							  	{
							  		mHouseClass.mFlueClass.OnHideCtrl();
							  		mHouseClass.mFurnitureClass.OnHideCtrl();							  		
							  		return;
							  	}
							  	if( true == mHouseClass.mLiangClass.OnMouseDown_Flue(g_mouseX,g_mouseY))	//拾取梁
							  	{
							  		mHouseClass.mPillarClass.OnHideCtrl();
							  		mHouseClass.mFlueClass.OnHideCtrl();
							  		mHouseClass.mFurnitureClass.OnHideCtrl();							  		
							  		return;
							  	}						  	
	
							  	if( true == mHouseClass.mCeLiangClass.OnPick2D(g_mouseX,g_mouseY,e))		// 拾取测量线
							  		return;
	
					  			g_bPickObj = mHouseClass.mFurnitureClass.OnPick2D(g_mouseX,g_mouseY);		// 拾取模型
								if( g_bPickObj == true )
								{	
									mHouseClass.mPillarClass.OnHideCtrl();
								  	mHouseClass.mFlueClass.OnHideCtrl();	
			 						mHouseClass.mFurnitureClass.m_pMoveFurniture.OnChangeColor2D(0xffff00);
							 		m_ParamObjDlg.Show(mHouseClass.mFurnitureClass.m_pMoveFurniture);
							 		m_ParamObjDlg.ShowBar(mHouseClass.mFurnitureClass.m_pMoveFurniture);
									return;
								}
								
								if( true == mHouseClass.mWallClass.OnMoveWallPos_Down(g_mouseX,g_mouseY,e))	// 拾取要移动的墙体端点
							  		return;						  	
							  	if( true == mHouseClass.mWallClass.OnMoveWall_Down(g_mouseX,g_mouseY,e))	// 拾取要移动的墙体
							  		return;	
								if( true == mHouseClass.mTextClass.OnMouseDown(g_mouseX,g_mouseY))
							  		return;	
							  	if( true == mHouseClass.mDecalClass.OnMouseDown(g_mouseX,g_mouseY))
							  		return;
							  	OnMouseRightUp();	
							}
							break;
							case 1:		// 墙中线绘制
								mHouseClass.mWallClass.DrawWall(g_mouseX,g_mouseY,0);
								return;
							case 17:	// 内墙线绘制
								mHouseClass.mWallClass.DrawWall(g_mouseX,g_mouseY,1);
								return;
					  		case 2:		// 绘制门
								mHouseClass.mDoorClass.DrawDoor();
								return;						
					  		case 3:		// 绘制窗户
								mHouseClass.mWindowClass.DrawWindow();
								return;
							case 4:		// 绘制墙线
								return;
							case 5:
								m_cPenType = 0;
								return;
							case 6:
							{
								var tFloor = mHouseClass.mFloorClass.OnPick2D(g_mouseX,g_mouseY);		// 拾取墙体
								if( tFloor != null )
								{
									tFloor.OnChangeFloorTex(g_dataTex);
									g_dataTex = null;
									m_cPenType= 0;
								}
							}
							return;
							case 8:	// 创建地面
								mHouseClass.mGroundClass.DrawGround(g_mouseX,g_mouseY);
							return;
							case 9:	// 创建顶面 贴花材质
								mHouseClass.mCeilingClass.DrawDecal(g_mouseX,g_mouseY);
							return;
							case 10:// 创建集成吊顶
								mHouseClass.mCeilingClass.OnChangeTex(g_mouseX,g_mouseY,g_dataTex);
							return;
	
							case 11: //绘制动画路径
								mAnimation.onMouseDown(g_mouseX,g_mouseY,e);
								break;
							case 12:
								mHelpLineClass.OnMouseDown(g_mouseX,g_mouseY);
								break;
							case 13: // 烟道
								mHouseClass.mFlueClass.OnMouseDown(g_mouseX,g_mouseY);
								break;
							case 14: // 柱子
								mHouseClass.mPillarClass.OnMouseDown(g_mouseX,g_mouseY);
								break;	
							case 15: // SVG
								break;
							case 16: // 测量
								mHouseClass.mCeLiangClass.OnMouseDown(g_mouseX,g_mouseY);
								return;
							case 21: // 梁
								mHouseClass.mLiangClass.OnMouseDown(g_mouseX,g_mouseY);
								break;	 
							case 23: // 创建文字
								mHouseClass.mTextClass.DrawText();
								return;
						}
						//  当前使用到23
					}

					// 移动画布
					$('#container' ).css("cursor","pointer");
					m_Coordniate.bMoveCoord = true;
					m_Coordniate.m_iMouseX_Old = e.clientX;
					m_Coordniate.m_iMouseY_Old = e.clientY;						

				}
				else		// 3D操作方式
				{
					GetMouseXY3D();
					m_mouseOldX = g_mouseX;
					m_mouseOldY = g_mouseY;			
					switch( m_cPenType )
					{
						case 0:	// 做拾取操作
						{
							if(mHouseClass.mFurnitureClass.OnPick3D_Raise(g_mouseX,g_mouseY) == true )
								return;	
								
							if( false == mHouseClass.mFurnitureClass.OnPick3D_Kuai())
							{
								if( mHouseClass.mFurnitureClass.OnPick3D_Rotate(g_mouseX,g_mouseY) == true )
									return;	
							}
							
							if( g_bPickObj == true )	// 如果有物体被选中，判断是否移动
							{
								g_bPickObj = mHouseClass.mFurnitureClass.OnPick3D();	//按住物体外不移动
								if(g_bPickObj == false)
								{
									
									mCameraClass.m_Control3D.enabled 	  = false;	// 不移动相机
									m_mouseOldX = g_mouseX;
									m_mouseOldY = g_mouseY;	
								}
								else
									mCameraClass.m_Control3D.enabled 	  = false;	// 不移动相机
							}					
						}
						break;
						case 6:
						{
							var tWall = mHouseClass.mWallClass3D_In.OnPick3D(g_mouseX,g_mouseY);	// 拾取墙体			
							if( tWall != null )
							{
								tWall.OnUpdateTex(g_dataTex);
							}
							else
							{
								var tFloor = mHouseClass.mFloorClass.OnPick3D(g_mouseX,g_mouseY);		// 拾取 地面
								if( tFloor != null )
									tFloor.OnChangeFloorTex(g_dataTex);
							}
							g_dataTex = null;
							m_cPenType = 0;
							return;
						}
						break;
					}
				}
			}
			
			if( IsContain(container, renderer.domElement ) == true )
			{
				if( e.buttons == 2||e.buttons == 3||e.buttons == 4 )	// 2 右键 4 中键 中键或右键移动2D平面
				{
					m_Coordniate.bMoveCoord = true;
					m_Coordniate.m_iMouseX_Old = e.clientX;
					m_Coordniate.m_iMouseY_Old = e.clientY;
				}
			}		
			if( e.button == 2 ) // 鼠标右键
				OnMouseRightUp();				
		}
		
		function mouseMove(e)
		{ 
		//	event.preventDefault();
			mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
			mouse.y = - ( (e.clientY-42) / window.innerHeight ) * 2 + 1;
			mouseScreen.x = e.clientX;
			mouseScreen.y = e.clientY;
			if( IsContain(container, renderer.domElement ) == true )	// 2D 状态
			{				
				switch( m_cPenType )
				{
					case 1:			// 移动正在创建的墙体
					{
						mHouseClass.mWallClass.OnMouseMove(g_mouseX,g_mouseY);
						mHouseClass.mFloorClass.OnShowLabelAll(false);
						return;
					}
					case 17:
					{
						mHouseClass.mWallClass.OnMouseMove(g_mouseX,g_mouseY);
						mHouseClass.mFloorClass.OnShowLabelAll(false);
						return;
					}
					case 2:			// 移动正在创建的门
						mHouseClass.mDoorClass.OnMouseMove(g_mouseX,g_mouseY);			
						return;
					case 23:		// 创建文字
						mHouseClass.mTextClass.OnMouseMove1(g_mouseX,g_mouseY);	
						return;
					case 3:			// 移动正常创建的窗
						mHouseClass.mWindowClass.OnMouseMove(g_mouseX,g_mouseY);
						return;	
					case 4:
						return;
					case 5:
						mHouseClass.mFurnitureClass.OnMouseMove2D(g_mouseX,g_mouseY);
						return;
					case 7:	// 显示AI房间
						mHouseClass.mAIRoomClass.OnMouseMove2D(g_mouseX,g_mouseY);
						return;
					case 8:	// 创建地面
						mHouseClass.mGroundClass.OnMouseMove(g_mouseX,g_mouseY);
						return;
					case 16: // 测量
						mHouseClass.mCeLiangClass.OnMouseMove(g_mouseX,g_mouseY);
						break;	
					case 0:	// 拾取移动
					{
						if( g_bPickObj == true )	// 单独物体拾取
						{
							if( e.buttons == 0 )	
								mHouseClass.mFurnitureClass.OnShowHelp(g_mouseX,g_mouseY);	// 家具高亮
							mHouseClass.mFurnitureClass.OnMouseMove(g_mouseX,g_mouseY,e);
							return;
						}
						if(true == mHouseClass.mWindowClass.ScaleWindow(g_mouseX,g_mouseY,e))	// 拉伸窗户
							return;
						if(true == mHouseClass.mDoorClass.ScaleDoor(g_mouseX,g_mouseY,e))		// 拉伸门
							return;
						if(true == mHouseClass.mObjCtrl.OnMouseMove2D(g_mouseX,g_mouseY,e))
							return;
						if(true == mHouseClass.mWindowClass.OnMouseMove_Window(g_mouseX,g_mouseY,e))
							return;
						if(true == mHouseClass.mDoorClass.OnMouseMove_Door(g_mouseX,g_mouseY,e))
							return;
						if(true == mHouseClass.mFlueClass.OnMouseMove_Flue(g_mouseX,g_mouseY,e))
							return;
						if(true == mHouseClass.mPillarClass.OnMouseMove_Flue(g_mouseX,g_mouseY,e))
							return;	
						if(true == mHouseClass.mLiangClass.OnMouseMove_Flue(g_mouseX,g_mouseY,e))
							return;							
							
						if(true == mHouseClass.mTextClass.OnMouseMove(g_mouseX,g_mouseY,e))		// 地面文字
							return;
						if(true == mHouseClass.mDecalClass.OnMouseMove(g_mouseX,g_mouseY,e))	// 贴花材质
							return;
										
						if(mHouseClass.mWindowClass.m_pCurWindow == null &&mHouseClass.mDoorClass.m_pCurDoor == null && mHouseClass.mTextClass.m_pCurText == null)
						{
							if(e.buttons == 1 &&( mHouseClass.mWallClass.mMovePosArray_Start.length>0 || mHouseClass.mWallClass.mMovePosArray_End.length>0 ))
							{
								mHouseClass.mWallClass.OnMoveWallPos(g_mouseX,g_mouseY,e);
								return;
							}
							
							// 移动墙体
							if(e.buttons == 1 && mHouseClass.mWallClass.m_pMoveWall != null)
							{
								mHouseClass.mWallClass.OnMoveWall(g_mouseX,g_mouseY,e);
								return;
							}

							if( null != mHouseClass.mWindowClass.OnShowHelp(g_mouseX,g_mouseY)) // 显示窗高亮
								return;
							if( null != mHouseClass.mDoorClass.OnShowHelp(g_mouseX,g_mouseY))	// 显示门高亮
								return;	
							if( null != mHouseClass.mFlueClass.OnShowHelp(g_mouseX,g_mouseY))	// 烟道高亮
								return;	
							if( null != mHouseClass.mPillarClass.OnShowHelp(g_mouseX,g_mouseY))	// 柱子高亮
								return;	
							if( null != mHouseClass.mLiangClass.OnShowHelp(g_mouseX,g_mouseY))	// 梁高亮
								return;														
							if( null != mHouseClass.mWallClass.OnShowHelp(g_mouseX,g_mouseY))	// 显示墙体高亮
								return;
							if( null != mHouseClass.mFurnitureClass.OnShowHelp(g_mouseX,g_mouseY))	// 家具高亮
								return;
						}
						
						if(e.buttons == 1)
						   m_Coordniate.mouseMove(e);
					}
					break;
					case 11: //绘制动画路径
						mAnimation.onMouseMove(g_mouseX,g_mouseY,e);
						break;
					case 12:
						mHelpLineClass.OnMouseMove(g_mouseX,g_mouseY);
						break;
					case 13:	// 烟道
						mHouseClass.mFlueClass.OnMouseMove(g_mouseX,g_mouseY);
						break;
					case 14:	// 柱子
						mHouseClass.mPillarClass.OnMouseMove(g_mouseX,g_mouseY);
						break;
					case 15:	// SVG
						break;
					case 21:	// 梁
						mHouseClass.mLiangClass.OnMouseMove(g_mouseX,g_mouseY);
						break;
				}
				// if(  e.button == 1 )	// 中键或右键移动
				//	m_Coordniate.mouseMove(e);
			}
			else
			{
				GetMouseXY3D();
				switch( m_cPenType )
				{
				case 0:
					{
						mHouseClass.mFurnitureClass.KongZhiXiTong_GaoLiang();
						if(mHouseClass.mFurnitureClass.g_bObjRaise == true)
						{
							mHouseClass.mFurnitureClass.OnMouseRaise(g_mouseX,g_mouseY,e.buttons)
							m_mouseOldX = g_mouseX;
							m_mouseOldY = g_mouseY;									
							return;							
						}
						if(mHouseClass.mFurnitureClass.g_bObjRotate == true)
						{
							mHouseClass.mFurnitureClass.OnMouseRotate(g_mouseX,g_mouseY,e.buttons)
							m_mouseOldX = g_mouseX;
							m_mouseOldY = g_mouseY;									
							return;
						}
						
						// 移动立体字
						if(true == mHouseClass.mObjCtrl.OnMove3D( g_mouseX-m_mouseOldX,g_mouseY-m_mouseOldY,e.buttons))
						{
							m_mouseOldX = g_mouseX;
							m_mouseOldY = g_mouseY;								
							return;							
						}
							
						if( g_bPickObj == true && e.buttons == 1 )	
						{
							mHouseClass.mFurnitureClass.OnMove3D( mHouseClass.mFurnitureClass.m_pMoveFurniture,g_mouseX-m_mouseOldX,g_mouseY-m_mouseOldY,e.buttons);
							m_mouseOldX = g_mouseX;
							m_mouseOldY = g_mouseY;				
							return;
						}
					}
					break;
				case 5:
					{
						mHouseClass.mFurnitureClass.OnMouseMove3D(g_mouseX,g_mouseY,e);
						m_mouseOldX = g_mouseX;
						m_mouseOldY = g_mouseY;	
						return;
					}
					break;
				}
			}
		//	m_Coordniate.mouseMove(e);
		}	
		
		function mouseUp(e)
		{
		//	event.preventDefault();
			if(m_Coordniate.bMoveCoord == true)
				$('#container' ).css("cursor","default");
			m_Coordniate.bMoveCoord = false;
			if( IsContain(container, renderer.domElement ) == true )		// 2D
			{
				switch(m_cPenType)
				{
				case 7:
					mHouseClass.mAIRoomClass.OnMouseDown();		// 单独显示的房间
					return;			
				}
			}
			else
			{
				switch(m_cPenType)
				{				
				case 18:
					return;	
				case 19:
					mHouseClass.mAIRoomClass.ZhiNengZhuangPeiQiang_DianJi_ShanChu();
					return;	//删除指定房间装配式墙板
				case 20:															// 单空间排布
					return;
				case 22:															
					return;	
				case 23:
					return;	
				case 5:		// 创建模型
					m_cPenType = 0;
					return;
				}
			}
					
			if( m_cPenType == 0 && e.button == 0 )	
			{
				if( IsContain(container, renderer.domElement ) == true )	// 是否是2D
				{					
					// 有平面图上拉长门窗
					if(mHouseClass.mWindowClass.m_HelpPos1_Pick	== true || mHouseClass.mWindowClass.m_HelpPos2_Pick	== true )
					{
						mHouseClass.mWindowClass.m_HelpPos1_Pick	= false;
						mHouseClass.mWindowClass.m_HelpPos2_Pick	= false;
					 	return;
					}
					
					if(mHouseClass.mDoorClass.m_HelpPos1_Pick	== true || mHouseClass.mDoorClass.m_HelpPos2_Pick	== true )
					{
						mHouseClass.mDoorClass.m_HelpPos1_Pick	= false;
						mHouseClass.mDoorClass.m_HelpPos2_Pick	= false;
					 	return;
					}					
					
					
					if( mHouseClass.mFurnitureClass.m_pMoveObjArray.length>0)
						return;
						
					if(bMouseUp2D == true)
					{
						bMouseUp2D = false;
						return;
					}
					mHouseClass.mWallClass.OnMoveWall_Up();
					mHouseClass.mWallClass.OnMoveWallPos_Up();
					mHouseClass.mWallClass.OnShowHelp();
					var ret = null;
					ret = mHouseClass.mWindowClass.OnPick2D(g_mouseX,g_mouseY);		// 拾取窗户
					if(ret != null){
						m_ParamWinDlg.Show(ret);
						mHouseClass.mWindowClass.m_pCurWindow = ret;
						return;
					}
					
					ret = mHouseClass.mDoorClass.OnPick2D(g_mouseX,g_mouseY);		// 拾取门
					if(ret != null){
						m_ParamDoorDlg.Show(ret);	
						mHouseClass.mDoorClass.m_pCurDoor = ret;
						return;
					}	
							
					if( g_bPickObj == false && mHouseClass.mLiangClass.m_pCurFlue == null)
					{	
						ret = mHouseClass.mGroundClass.OnPick2D(g_mouseX,g_mouseY);		// 拾取地面线框
						if(ret != null)
							return;
	
						ret = mHouseClass.mWallClass.OnPick2D(g_mouseX,g_mouseY);		// 拾取墙体
						if( ret != null )
						{
							m_ParamWallDlg.Show(ret);
							if( app.header.showLable.check_DelWall == true)
								m_ParamWallDlg.Delete();						
							return;
						}						
						// 拾取地面
						ret = mHouseClass.mFloorClass.OnPick2D(g_mouseX,g_mouseY);
						if( ret!= null)
						{
							m_ParamGroundDlg.OnShow(ret);
							return;
						}	
					}
				}
				else	//  为平板拖拽做考虑
				{
					if(Math.abs(m_mouseOldX-g_mouseX)>10 || Math.abs(m_mouseOldY-g_mouseY)>10)
					{
						mHouseClass.mFurnitureClass.OnUpdateAix(999999,999999,1,1,1);
						HideDlg();
						mCameraClass.m_Control3D.enabled 	  = true;	// 操作相机
					}
					else
					{
						mCameraClass.m_Control3D.enabled 	  = true;	// 使相机旋转
						g_bPickObj = mHouseClass.mFurnitureClass.OnPick3D();
						if( g_bPickObj == true )
						{								
							m_ParamObjDlg.Show(mHouseClass.mFurnitureClass.m_pCurFurniture);
				 			m_ParamObjDlg.ShowBar(mHouseClass.mFurnitureClass.m_pCurFurniture);
							mCameraClass.m_Control3D.enabled  = false;	// 不使用相机
						}
						else
						{
							var tFloor = mHouseClass.mFloorClass.OnPick3D(g_mouseX,g_mouseY);
							if( tFloor)
							{
								m_ParamGroundDlg.OnShow(tFloor);
							}
							else
							{
								HideDlg();
								mCameraClass.m_Control3D.enabled  = true;
							}	
						}
					}
				}
			}
		}
		// 窗口大小
		function onWindowResize() 
		{
			mCameraClass.m_Camera.aspect = window.innerWidth / window.innerHeight;
			mCameraClass.m_Camera.updateProjectionMatrix();
			
			renderer.setSize( window.innerWidth, window.innerHeight );
			renderer2.setSize( window.innerWidth, window.innerHeight );
			composer.setSize(window.innerWidth, window.innerHeight );
			effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
		}

		function animate() 
		{
			requestAnimationFrame( animate );
			render();
			TWEEN.update();
			// stats.update();
		}


		function render() 
		{	
			if( IsContain(container, renderer.domElement ) == true )	// 2D 状态			
				GetMouseXY2D();	
			
			renderer.render(  scene,   mCameraClass.m_Camera );	
			renderer2.render( scene3D, mCameraClass.m_Camera3D );
			mFloorCameraClass.render();
			labelRenderer.render( scene3D, mCameraClass.m_Camera3D );
			composer.render();
		}	
		
		
		function OnCreateWall()
		{
			// 快速绘制墙体
			if( IsContain(container, renderer2.domElement ) != false )
			{
				alert("请在平面状态下操作.");
				return;
			}
				
			m_cPenType = 1;	// 墙中线创建墙体
			$("#mEditBar").show();
			$(".wallSelect").show();	// 创建墙体设置界面
		//	$("#container").css("cursor","url('img/peper.png'),pointer");
			$('#container' ).css("cursor","crosshair");
			$("#mouse-top").show();
			$("#mouse-bottom").show();
			$("#mouse-left").show();
			$("#mouse-right").show();
			
			mParamSystemDlg.OnHideView();
		};
		
		function OnCreateWall1()
		{
			// 快速绘制墙体
			if( IsContain(container, renderer2.domElement ) != false )
			{
				alert("请在平面状态下操作.");
				return;
			}
				
			m_cPenType = 17;	// 墙边线创建墙体
			$("#mEditBar").show();
			$(".wallSelect").show();	// 创建墙体设置界面
		//	$("#container").css("cursor","url('img/peper.png'),pointer");
			$('#container' ).css("cursor","crosshair");
			$("#mouse-top").show();
			$("#mouse-bottom").show();
			$("#mouse-left").show();
			$("#mouse-right").show();
			
			mParamSystemDlg.OnHideView();
		};		
		
		function OnCreateCeLiang()
		{
			// 创建测量
			if( IsContain(container, renderer2.domElement ) != false )
			{
				alert("请在平面状态下操作.");
				return;
			}
				
			m_cPenType = 16;	// 开始创建墙体
		//	$("#container").css("cursor","url('img/peper.png'),pointer");
			$('#container' ).css("cursor","crosshair");			
		};
		
		function OnCloseOpenDlg()
		{
			$('.createDesign_create').hide();
			$("#mBak").hide();			
		};
		
		function OnCreateWall_Dlg()
		{
			OnCreateWall();
			OnCloseOpenDlg();
		};	
		
		function OnLoadHouse_Dlg()
		{
			OnCloseOpenDlg();
			openCreate(0);
		};

		/**
		 * @api OnCreateRoom(iIndex)
		 * @apiDescription 按房间模板创建房间
		 * @apiGroup 全局函数  
		 * @apiParam (参数) iIndex 使用哪个模板 0-4
		 */
		function OnCreateRoom(iIndex)
		{
			// 创建不同形状房间
			if( IsContain(container, renderer2.domElement ) != false )
			{
				alert("请在平面状态下操作.");
				return;
			}	
			
			if(mHouseClass.mWallClass.mWallArray.length == 0)
			{
				OnCreateRoom1(iIndex);
				return;
			}
			app.$confirm('是否清空当前设计?', '提示', 
						 {confirmButtonText: '确定',
						  cancelButtonText: '取消',
						  type: 'warning'
	       				 }).then(() => {
	       				 		OnCreateRoom1(iIndex);
	       				 }).catch(() => {
	       				 	return;
	       				 });
		};
		
		function OnCreateRoom1(iIndex)
		{
		 	OnClear();
			var fValue = 0;
			switch(iIndex)
			{
				case 1:
				{
					fValue = 300;
					mHouseClass.mWallClass.OnAddWall(-fValue, fValue, fValue, fValue);
					mHouseClass.mWallClass.OnAddWall( fValue, fValue, fValue,-fValue);
					mHouseClass.mWallClass.OnAddWall( fValue,-fValue,-fValue,-fValue);
					mHouseClass.mWallClass.OnAddWall(-fValue,-fValue,-fValue, fValue);					
				}
				break;
				case 2:
				{
					fValue = 300;
					mHouseClass.mWallClass.OnAddWall(-fValue, fValue,      0, fValue);
					mHouseClass.mWallClass.OnAddWall(      0, fValue,      0,    100);
					mHouseClass.mWallClass.OnAddWall(      0,    100, fValue,	 100);
					mHouseClass.mWallClass.OnAddWall( fValue,    100, fValue,-fValue);
					mHouseClass.mWallClass.OnAddWall( fValue,-fValue,-fValue,-fValue);
					mHouseClass.mWallClass.OnAddWall(-fValue,-fValue,-fValue, fValue);
				}
				break;
				case 3:
				{
					fValue = 260;
					mHouseClass.mWallClass.OnAddWall(-fValue+130, fValue, fValue-130, fValue);
					mHouseClass.mWallClass.OnAddWall( fValue-130, fValue, fValue-130,      0);				
					mHouseClass.mWallClass.OnAddWall( fValue-130,      0, fValue,     	   0);					
					mHouseClass.mWallClass.OnAddWall( fValue,          0, fValue,	 -fValue);
					mHouseClass.mWallClass.OnAddWall( fValue,    -fValue,-fValue,    -fValue);
					mHouseClass.mWallClass.OnAddWall(-fValue,	 -fValue,-fValue,		   0);
					mHouseClass.mWallClass.OnAddWall(-fValue,          0,-fValue+130,      0);
					mHouseClass.mWallClass.OnAddWall(-fValue+130,	   0,-fValue+130, fValue);				
				}
				break;
				case 4:
				{
					fValue = 300;
					mHouseClass.mWallClass.OnAddWall( fValue, fValue,      0, fValue);
					mHouseClass.mWallClass.OnAddWall(      0, fValue,      0,    100);
					mHouseClass.mWallClass.OnAddWall(      0,    100,-fValue,	 100);
					mHouseClass.mWallClass.OnAddWall(-fValue,    100,-fValue,-fValue);
					mHouseClass.mWallClass.OnAddWall(-fValue,-fValue, fValue,-fValue);
					mHouseClass.mWallClass.OnAddWall( fValue,-fValue, fValue, fValue);					
				}
				break;
			}

			for( var i = 0; i< mHouseClass.mWallClass.mWallArray.length; i++ ){
				mHouseClass.mWallClass.mWallArray[i].OnShow(false);
			}
			mHouseClass.mWallClass.OnUpdateAllWall();	// 生成所有墙体
			mHouseClass.mFloorClass.OnUpdateLabel();			
		};
		
		
		function OnCreateName()
		{
			//创建名字
			mHouseClass.mTextClass.OnCreate(0,0);
		};		
		/**
		 * @api OnMouseRightUp()
		 * @apiDescription 鼠标右键 清空当前状态
		 * @apiGroup 全局函数                           
		 */		
		function OnMouseRightUp()
		{			
			mHouseClass.mWallClass.OnMouseRightUp2D();		
			mHouseClass.mWindowClass.OnMouseRightUp2D();
			mHouseClass.mDoorClass.OnMouseRightUp2D();
			mHouseClass.mFloorClass.OnMouseRightUp2D();
			mHouseClass.mTextClass.OnMouseRightUp2D();
			mHouseClass.mDecalClass.OnMouseRightUp2D();
			mHouseClass.mFurnitureClass.OnMouseRightUp2D();
			mHouseClass.mFlueClass.OnMouseRightUp2D();
			mHouseClass.mPillarClass.OnMouseRightUp2D();
			mHouseClass.mLiangClass.OnMouseRightUp2D();
			mHouseClass.mCeLiangClass.OnMouseRightUp2D();	// 测量
			mHouseClass.mGroundClass.OnMouseRightUp2D();
			mHelpLineClass.OnMouseRightUp2D();   
			mAnimation.OnMouseRightUp2D();
			
			if(m_cPenType == 1 || m_cPenType == 17)		// 如果是结束绘制
			{
				mHouseClass.mFloorClass.OnShowLabelAll(true);
				mParamSystemDlg.OnShowView();
			}
				
			m_cPenType = 0;								
			mHelpClass.OnClear();
			HideDlg();
			$('.attributeInterface').hide();
			$('#mWallLineBar').hide();
			$("#mEditBar").hide();
			$('#container' ).css("cursor","default");
			$(".wallSelect").hide();					// 创建墙体设置界面

			app.header.showLable.check_DelWall = false;
			
			$("#mouse-top").hide();
			$("#mouse-bottom").hide();
			$("#mouse-left").hide();
			$("#mouse-right").hide();
		}
		
		/**
		 * @api OnClear()
		 * @apiDescription 清除所有绘制
		 * @apiGroup 全局函数                           
		 */				
		function OnClear()
		{
			OnShow2D();
			
			OnMouseRightUp();
			mHouseClass.OnClear();
			mCameraClass.OnClear();
			mFloorCameraClass.OnClear();
			mPluginsClass.OnClear();
			mHelpClass.OnClear();
			mHelpLineClass.OnClear();
			$("#mArea").text(0.00);
			g_bPickObj   = false;
			
			//app.GlobalSettings.num_2.int = 2800;  暂不恢复
		}	
		

		/**
		 * @api OnClearObj()
		 * @apiDescription 只清除家具
		 * @apiGroup 全局函数                         
		 */		
		function OnClearObj()
		{
			mHouseClass.mFurnitureClass.OnClear();
		}
		
		/**
		 * @api HideDlg()
		 * @apiDescription 隐藏对话框
		 * @apiGroup 全局函数                         
		 */			
		function HideDlg()
		{
			m_ParamObjDlg.HideBar();
			m_ParamObjDlg.HideParamDlg();
			m_ParamDoorDlg.HideBar();
			m_ParamWinDlg.HideBar();
			m_ParamWallDlg.HideBar();
			m_ParamTextDlg.HideBar();
			m_ParamLabelDlg.HideBar();
		}
		
		function GetMouseXY2D()
		{
			raycaster.setFromCamera( mouse, mCameraClass.m_Camera );
			var Intersections = raycaster.intersectObjects(  m_Coordniate.objects );
			if( Intersections.length>0)
			{						
				g_mouseX = 	Intersections[0].point.x;
				g_mouseY =  Intersections[0].point.y;		
			}				
		}
		
		function GetMouseXY3D()
		{
			raycaster.setFromCamera( mouse, mCameraClass.m_Camera3D );
			var Intersections = raycaster.intersectObject(  m_Coordniate.m_cBigBox3D );
			for( var i = 0; i< Intersections.length ; i++)
			{						
				if ( INTERSECTED != Intersections[ i ].object ) {
						g_mouseX = 	Intersections[i].point.x;
						g_mouseY =  Intersections[i].point.z;
				}	
			}				
		}	
		
		// 创建矢量图
		function OnShowSVG()
		{
			OnShow2D();
			mHouseClass.mFloorClass.OnShowAll(false);			
		}
 
		/**
		 * @api OnShow3D()
		 * @apiDescription 创建3D
		 * @apiGroup 全局函数
		 * 
		 */		
		function OnShow3D()
		{  	
			mCameraClass.m_Control3D.enabled  = true;
			
			OnHideTab(m_UIType);
			this.OnMouseRightUp();
			mHouseClass.mObjCtrl.OnClear();				// 取消选中
			mHouseClass.mFurnitureClass.HideObjCtrl();
			$('#container1').hide();
			$('#mHelpRoam').hide();
			mHouseClass.Build3D();
			mParamSystemDlg.OnShowRoomName();
			
			$('.sliderSize-block').hide();
			
			
		//	if( mFloorCameraClass.m_bShowAllRoom == false )		// 不是显示所有房间, 则不进行当前操作
				mFloorCameraClass.OnShowAllRoom();
			
			if( IsContain(container, renderer.domElement ) == true )
			{
			  	container.removeChild( renderer.domElement);
			  	container.appendChild( labelRenderer.domElement );
				container.appendChild( renderer2.domElement );
			}
			
			mLightClass.OnUpdateLight_3D();
			mViewerMode = 1;
		}

		/**
		 * @api OnShow2D()
		 * @apiDescription 创建 2D
		 * @apiGroup 全局函数
		 * 
		 */		
		function OnShow2D()
		{
			mCameraClass.m_Control3D.enabled  = false;
			mCameraClass.m_Control3D.dispose_mouseup();
			OnHideTab(m_UIType);
			this.OnMouseRightUp();
			$('#container1').hide();
			$('#mHelpRoam').hide();
			$('.sliderSize-block').show();
			// if( mFloorCameraClass.m_bShowAllRoom == false )		// 不是显示所有房间, 则不进行当前操作
				mFloorCameraClass.OnShowAllRoom();
			
			if( IsContain(container, renderer2.domElement ) == true )
			{
			  	container.removeChild( renderer2.domElement);
			  	container.removeChild( labelRenderer.domElement );
				container.appendChild( renderer.domElement );
			}
			
			mHouseClass.mFloorClass.OnShowAll(true);
			mHouseClass.mCeilingClass.OnShowAll(false);
			mHouseClass.mFurnitureClass.OnShowFurnitureAll(true);
			mHouseClass.mObjCtrl.OnClear();				// 取消选中
			mHouseClass.mFurnitureClass.HideObjCtrl();
			mViewerMode = 0;
		}
		
		// 显示顶面
		function OnShowTopSurface()
		{	
			OnShow2D();
			OnHideAllTab();
			$('#99').show();	// 我的
			$('#100').show();	// 品牌
			$('#101').show();	// 材质
			$('#111').show();
			$('#103').show();	// 照明 
			$('#112').show();	// 顶面设计
			$("#mLightingDlg").show();
			OnShowCeilingTab();
			
			mHouseClass.mFloorClass.OnShowAll(false);
			mHouseClass.mCeilingClass.OnShowAll(true);
			mHouseClass.mFurnitureClass.OnShowFurnitureAll(false);
		}		
		
		function OnShowCeilingTab()
		{
			$("#m2DTab").removeClass("button-line");
			$("#mRoomTab").removeClass("button-line");
			$("#mModelingTab").addClass("button-line");
		
			$(".main-body>div").hide();
			$(".modelBase").show();
		}	

		function OnHideAllTab()
		{
			$('#98').hide();	// 会展
			$('#99').hide();	// 我的
			$('#100').hide();	// 品牌
			$('#101').hide();	// 材质
			$('#102').hide();	// 厨卫
			$('#103').hide();	// 照明
			$('#104').hide();	// 家具
			$('#105').hide();	// 家电
			$('#106').hide();	// 装饰
			$('#107').hide();	// 工装
			$('#110').hide();	// 实验室
			$('#111').hide();	// 集成吊顶
			$('#112').hide();	// 顶面设计	
			$('#113').hide();	// 组合
		}
				
		// 显示频道
		function OnHideTab(iIndex)
		{
			OnHideAllTab();
			switch(iIndex)
			{
				case 0:	// 全版版
				{
					$('#98').show();	// 会展
					$('#99').show();	// 我的
					$('#100').show();	// 品牌
					$('#101').show();	// 材质
					$('#102').show();	// 厨卫
					$('#103').show();	// 照明
					$('#104').show();	// 家具
					$('#105').show();	// 家电
					$('#106').show();	// 装饰
					$('#107').show();	// 工装
					$('#110').show();	// 实验室
				//	$('#111').show();	// 集成吊顶
					$('#112').show();	// 顶面设计	
					$('#113').show();	// 组合
				}
				break;
				case 1:	// 标准版
				{
					$('#99').show();	// 我的
					$('#100').show();	// 品牌
					$('#101').show();	// 材质
					$('#102').show();	// 厨卫
					$('#103').show();	// 照明
					$('#104').show();	// 家具
					$('#105').show();	// 家电
					$('#106').show();	// 装饰
					$('#107').show();	// 工装					
				}
				break;
				case 2:	// 温州版
				{
					$('#99').show();	// 我的
					$('#100').show();	// 品牌
					$('#101').show();	// 材质
					$('#102').show();	// 厨卫
					$('#103').show();	// 照明
					$('#104').show();	// 家具
					$('#105').show();	// 家电
					$('#106').show();	// 装饰
					$('#107').show();	// 工装					
				}
				break;
				case 3:	// 会展版
				{
					$('#98').show();	// 会展
					$('#99').show();	// 我的
					$('#100').show();	// 品牌
					$('#101').show();	// 材质
					$('#103').show();	// 照明
					$('#104').show();	// 家具					
				}
				break;
				case 4:	// 苏州版
				{
					$('#99').show();	// 我的
					$('#101').show();	// 材质
					$('#300').show();
					$('#301').show();
					$('#302').show();
					$('#303').show();
					//$('#304').show();
				}
					break;
				case 5:	// 泛美
				{
					$('#99').show();	// 我的
					$('#101').show();	// 材质
					$('#110').show();

				}
					break;
			}

		}
		
		// tNode 是否包含了 tChild
		function IsContain( tNode, tChild)
		{
			var childs = tNode.childNodes; 
			for(var i = 0; i < childs.length; i++) { 
			   if( childs[i] == tChild )
			   {
			  	 return true;
			  }
			}
			return false;
		}
				
		function OpenCharts()
		{
			$("#mBak").show();
			$(".createDesign").show();
			$(".createDesign").addClass("fadeInDown");
			setTimeout(function(){
				$(".createDesign").removeClass("fadeInDown");
			},200);			
			// 系统功能图
			var selectTime = new Date().getTime();//获取时间戳
			
			$('#createDesign-mian').attr("src","http://www.ihouse3d.com/charts/client.html?strValue_1="+4+"&"+selectTime);
		}
		
		function openCreate(int)
		{
			if(int==-1){		
				$("#mBak").show();
				$(".createDesign_create").show();
				$(".createDesign_create").addClass("fadeInDown");
				setTimeout(function(){
					$(".createDesign_create").removeClass("fadeInDown");
				},200);
				if(created_myplan==0){
					myPlan();
				}else{
					GetInfoFromShare();
				}

			}else{
				$("#mBak").show();
				$(".createDesign").show();
				$(".createDesign").addClass("fadeInDown");
				setTimeout(function(){
					$(".createDesign").removeClass("fadeInDown");
				},200);
			
				var selectTime = new Date().getTime();//获取时间戳
				if (int==0) {
					$('#createDesign-mian').attr("src","exhibition/index.html?strValue_1="+0+"&"+selectTime);
				}else if(int==1){

					let SceneFilePath = mPluginsClass.mCurrentOpenSceneFile;
					if(SceneFilePath=="")
					{
						SceneFilePath = m_strWebService + `users/${mUserFolder}/${mUserAccount}/savefile/demo/data.xml`;
					}

					//打开的场景
					if (-1 != SceneFilePath.indexOf(m_strWebService) && -1 != SceneFilePath.indexOf("data_scene.xml")) {
						SceneFilePath = SceneFilePath.split("?")[0];
						SceneFilePath = SceneFilePath.replace("data_scene.xml", "data.xml");
					}
					else {
						//初次保存时的场景
						SceneFilePath = SceneFilePath.replace(/\\\\/g, "/");
						//SceneFilePath = m_strWebService + SceneFilePath + "/data.xml"
						//SceneFilePath = m_strWebService + SceneFilePath;
                   }
					$('#createDesign-mian').attr("src","rendering-img/rendering-display.html?type=1&&houseid="+SceneFilePath);
				}
				else if(int==4){
					$('#createDesign-mian').attr("src","exhibition/index.html?strValue_1="+4+"&"+selectTime);
				}
			}
		}
		    	
	GotoTaoBao = function()
	{
		window.open('https://quanyou.tmall.com/');
	}
		
	
	GotoWeb =function()
	{
		window.open('http://www.ihouse3d.com','_blank');
	};
		
	DownloadChrome = function()
	{
		window.open('http://www.google.cn/intl/zh-CN/chrome/','_blank');
	};
	
	// 显示楼层内容
	OnShowFloor = function()
	{
		var iFloor = parseInt(app.header.selectValue);
				
		// 显示当前层的物体
		mHouseClass.mFurnitureClass.OnShowFurniture_Floor(iFloor);
		
		// 平台显示
		for( var i = 0; i<mHouseClass.mGroundClass.mGroundArray.length; i++ )
		{
			if(iFloor == mHouseClass.mGroundClass.mGroundArray[i].m_iFloor || iFloor == -10)
				OnShowAllOnFloor(mHouseClass.mGroundClass.mGroundArray[i],true);
			else	// 隐藏其它楼层的数据
				OnShowAllOnFloor(mHouseClass.mGroundClass.mGroundArray[i],false);  
		}
	};
		
	function OnShowAllOnFloor(tGroundUnit, bShow)
	{
		if( tGroundUnit.m_pCurFloor )
		{
			if(tGroundUnit.m_pCurFloor.mFloorMesh3D)
			   tGroundUnit.m_pCurFloor.mFloorMesh3D.visible = bShow;
			   
			if(tGroundUnit.m_pCurFloor.mFloorMesh)
			   tGroundUnit.m_pCurFloor.mFloorMesh.visible = bShow;
			  
			if(tGroundUnit.m_pCurCeiling.mCeilingMesh3D)
			   tGroundUnit.m_pCurCeiling.mCeilingMesh3D.visible = bShow;
			   
			if(tGroundUnit.m_pCurCeiling.mCeilingMesh)
			   tGroundUnit.m_pCurCeiling.mCeilingMesh.visible = bShow;	
			   
			
		} 
		for(var j = 0; j<tGroundUnit.mLineArray.length; j++)	// 地台厚度及相关线条
		{
			if(tGroundUnit.mLineArray[j].mWallData3D_In);
			   tGroundUnit.mLineArray[j].mWallData3D_In.mWallMesh.visible = bShow;
			
			tGroundUnit.mLineArray[j].mLine.visible = bShow;
			
			if(tGroundUnit.mLineArray[j].m_pFurniture)
			   tGroundUnit.mLineArray[j].m_pFurniture.OnShow(bShow);
		}		
	}
	
	var m_moveTimerID;
	var m_moveMode = 0;
	function YiDongHuaBu_KaiShi( iMode )
	{
		// 移动画布
		if( IsContain(container, renderer.domElement ) == true  && m_cPenType == 1)	// 平面操作方式	
		{
			m_moveMode = iMode;
			m_moveTimerID = window.setInterval(YiDongHuaBu_ShiJian,30);
		}
	}
	
	function YiDongHuaBu_ShiJian()
	{
		switch(m_moveMode)
		{
			case 1:	// 向上
				mCameraClass.m_Camera.position.y += 10;
			break;
			case 2:	// 向下
				mCameraClass.m_Camera.position.y -= 10;
			break;
			case 3:
				mCameraClass.m_Camera.position.x += 10;
			break;	
			case 4:
				mCameraClass.m_Camera.position.x -= 10;
			break;
		}		
	}
	
	function YiDongHuaBu_JieShu()
	{
		window.clearInterval(m_moveTimerID);
	}
	
	/**
	 * @api OnpenProjectEditor(strTitle)
	 * @apiDescription 场景另存为
	 * @apiGroup 全局函数 
	 * @apiParam (参数) strTitle 显示的标题
	 */		
	function OnpenProjectEditor(strTitle){
		//清空以前数据
		app.programEditor.name = "";
		app.programEditor.designUnit = "";
		app.programEditor.designer = "";
		app.programEditor.schemeAddr = "";
		app.programEditor.style = "";
		app.programEditor.schemeDescription = "";
	
		if (strTitle=='保存') {
			app.programEditor.typeName = 1;
			if (mPluginsClass.mCurrentOpenSceneFile!='') {
				mPluginsClass.OnSaveScheme();
				return;
			}
	
		}else if(strTitle=='另存为'){
			app.programEditor.typeName = 0;
		}
	
		$('.design-dialog-title').html(strTitle)
	
		$("#mBak").show();
		$(".programEditor").show();
		$(".programEditor").addClass("fadeInDown");
		setTimeout(function(){
			$(".programEditor").removeClass("fadeInDown");
		},150);
	
		SetThumbnail('#program-editor-image');
	};
	
	
	function SetThumbnail(className)
	{
		//设置场景缩略图
		// 生成平面图
		m_Coordniate.OnShow(false);    // 隐藏网格
	
		var fOldZ = mCameraClass.m_Camera.position.z;
		mCameraClass.m_Camera.position.z = 1000;
		//render();
	
		var objData =CaptureScreen(); //renderer.domElement.toDataURL("image/jpeg");
	
		var image = new Image();
		image.width = 220*window.innerWidth/window.innerHeight;
		image.height = 220;
		image.src = objData;
	
		let that = this;
		//使用setTimeout主要防止缩放图片没完成前，调用ajax接口
		setTimeout(function ()
		{
			//缩放图片大小为243*243
			//ScaleImage(image,243,243);
	
			setTimeout(function ()
			{
				var canvas = document.createElement("canvas");
				canvas.width = 290;
				canvas.height = 220;
				var ctx = canvas.getContext("2d");
				var i = -(image.width -290)/2;
				ctx.drawImage(image, i, 0, image.width, image.height);
				objData = canvas.toDataURL("image/jpeg");
				
				
				//取得转换后图片base64数据
				//objData = GetBase64Image(image);
	
				//转换成标准base64格式，不然后台c#解析失败
				objData.replace(/%([0-9A-F]{2})/g, function (match, p1)
				{
					return String.fromCharCode('0x' + p1);
				});
	
				$(className).attr('src',objData);
	
				mCameraClass.m_Camera.position.z = fOldZ;
				mParamSystemDlg.OnShowCoord();
	
			}, 100);
		}, 100);
	};
	
	
	function CaptureScreen()
	{
		//屏幕截图
		render();
	
		let captureImage = null;
	
		if(0 == mViewerMode)
		{
			captureImage = renderer.domElement.toDataURL("image/jpeg");
		}
		else
		{
			captureImage = renderer2.domElement.toDataURL("image/jpeg");
		}
	//	renderer.setSize( window.innerWidth, window.innerHeight );
	//	renderer2.setSize( window.innerWidth, window.innerHeight );
	//	renderer.setPixelRatio( window.devicePixelRatio );
		return captureImage;
	};
	
	//保存户型
	function OnSaveHouseType(){
	
		//清空以前数据
		app.programEditor.name = "";
		app.programEditor.housetype = "";
		app.programEditor.designer = "";
		app.programEditor.area = "";
		app.programEditor.province = "";
		app.programEditor.city = "";
		app.programEditor.address = "";
		app.programEditor.description = "";
	
		$("#mBak").show();
		$(".programSaveHouseType").show();
		$(".programSaveHouseType").addClass("fadeInDown");
		setTimeout(function(){
			$(".programSaveHouseType").removeClass("fadeInDown");
		},150);
	
		SetThumbnail('#program-housetype-image');
	};	
	
