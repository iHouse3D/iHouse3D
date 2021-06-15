/**
 * @api WallClass
 * @apiGroup WallClass
 * @apiName  0
 * @apiDescription 墙体操作类
 * @apiParam (成员变量) mWallArray 墙体数组
 * @apiParam (成员变量) m_pCurWall 当前墙体
 * @apiParam (成员变量) mRenderLine 墙体2D渲染时显示的线条
 * @apiParam (成员变量) mRenderWallTop 墙体顶厚
 */

function WallClass()
{
	  this.mWallArray = new Array(); // 墙体数组
	  this.m_pCurWall = null; 
		this.mMouseX = 0;
		this.mMouseY = 0;
		this.mGeometry;
		this.mWall;	
		this.solution_paths;
		this.iMaxAreaFloor = 0;
		this.mRenderLine   = new Array();	// 墙体2D渲染时显示的线条
		this.mRenderWallTop= new Array(); // 墙体顶厚

		this.mHelpWall = null;		// 帮助墙体	
		/**
		 * @api OnInit
		 * @apiDescription 初始化函数
		 * @apiGroup WallClass
		 *                         
		 */		
		this.OnInit= function (){}
		
		/**
		 * @api OnClear
		 * @apiDescription 清除所有墙体
		 * @apiGroup WallClass
		 *                           
		 */		
		this.OnClear = function()
		{			
			// 清楚所有墙体
			this.OnMouseRightUp2D();
			for( var i = 0; i< this.mWallArray.length; i++ ){
					this.mWallArray[i].OnClear();
			}
			
			for(k =0; k< this.mRenderLine.length; k++ )
			{
				scene.remove(this.mRenderLine[k]);
			}	
			this.mWallArray.length = 0;
			this.mRenderLine.length= 0;
			this.solution_paths = null;
		};
		
		/**
		 * @api OnClearLastWall
		 * @apiDescription 清空2D线框
		 * @apiGroup WallClass
		 *                           
		 */		
		this.OnClearLastWall= function()
		{
			// 清空线框
			for( var i =0 ;i< this.mWallArray.length; i++ )
			{
				this.mWallArray[i].OnUpdate();
				this.mWallArray[i].m_LastLineArray[0].x = this.mWallArray[i].m_WallLineArray[0].x;
				this.mWallArray[i].m_LastLineArray[0].y = this.mWallArray[i].m_WallLineArray[0].y;
				this.mWallArray[i].m_LastLineArray[1].x = this.mWallArray[i].m_WallLineArray[1].x;
				this.mWallArray[i].m_LastLineArray[1].y = this.mWallArray[i].m_WallLineArray[1].y;
				this.mWallArray[i].m_LastLineArray[2].x = this.mWallArray[i].m_WallLineArray[2].x;
				this.mWallArray[i].m_LastLineArray[2].y = this.mWallArray[i].m_WallLineArray[2].y;
				this.mWallArray[i].m_LastLineArray[3].x = this.mWallArray[i].m_WallLineArray[3].x;
				this.mWallArray[i].m_LastLineArray[3].y = this.mWallArray[i].m_WallLineArray[3].y;				
			}			
		};

		/**
		 * @api OnDelete
		 * @apiDescription 删除指定的墙体
		 * @apiGroup WallClass
		 * @apiParam (参数) tWall 指定墙体
		 * 
		 */	
		this.OnDelete = function(tWall)
		{			
			tWall.OnClear();
			var iIndex = this.mWallArray.indexOf(tWall);
			if( iIndex == -1 )
				return;
			this.mWallArray.splice(iIndex,1);
			scene.remove(this.mHelpWall);		// 帮助墙体
		};
		
		/**
		 * @api DrawWall
		 * @apiDescription 鼠标连续绘制墙体
		 * @apiGroup WallClass
		 * @apiParam (参数) mouseX 鼠标X坐标
		 * @apiParam (参数) mouseY 鼠标Y坐标
		 * @apiParam (参数) iType  0 墙中线方式绘制，1内墙线方式绘制，2外墙线方式绘制
		 * 
		 */		
		this.DrawWall = function(mouseX,mouseY,iType)
		{			
			if( this.m_pCurWall == null ){
				this.OnBuildNewWall(mouseX,mouseY,iType);
			}
			else
			{	
				var ab = this.CheckPosOnLine(this.m_pCurWall.m_vEnd.x,this.m_pCurWall.m_vEnd.y);			
				if( ab[0] ==1 || ab[0] == 2 )	// 顶点
				{
					this.m_pCurWall.m_vEnd.x = ab[1];
					this.m_pCurWall.m_vEnd.y = ab[2];	
				}
				else if( ab[0] == 3) 	// 点在线上
				{
					this.m_pCurWall.m_vEnd.x = ab[1];
					this.m_pCurWall.m_vEnd.y = ab[2];		
					
					// 旋转5度
					if( app.attributeInterface.wall.zhengjiao == false )
						mMathClass.RotateVecFromAxis( this.m_pCurWall.m_vEnd, this.m_pCurWall.m_vStart, 5);
					else
						mMathClass.RotateVecFromAxis( this.m_pCurWall.m_vEnd, this.m_pCurWall.m_vStart, 90);
					this.m_pCurWall.m_vEnd.x =  mMathClass.mRetVec.x;  
					this.m_pCurWall.m_vEnd.y =  mMathClass.mRetVec.y;						
				}
	
				var d = this.m_pCurWall.m_vStart.distanceTo(this.m_pCurWall.m_vEnd);	// 两个点距离太近 ，不创建墙体
				if( d < 2 )	
					return;
				
				this.mWallArray.push(this.m_pCurWall);	// 增加这段墙
					
				// 判断**终点**是否需要打断原有墙体	
				if( ab[0] == 3)
				{
					var tWall  = this.mWallArray[ab[4]];
					var tWall1 = new WallData();
					var tWall2 = new WallData();
					tWall1.OnInit(tWall.m_vStart.x,tWall.m_vStart.y,tWall.m_iType);
					tWall1.m_vEnd.x = this.m_pCurWall.m_vEnd.x;
					tWall1.m_vEnd.y = this.m_pCurWall.m_vEnd.y;
					tWall1.m_fWidth = tWall.m_fWidth;
					tWall2.OnInit(tWall.m_vEnd.x,tWall.m_vEnd.y,tWall.m_iType);
					tWall2.m_vStart.x = this.m_pCurWall.m_vEnd.x;
					tWall2.m_vStart.y = this.m_pCurWall.m_vEnd.y;		
					tWall2.m_fWidth   = tWall.m_fWidth;
					this.mWallArray.push(tWall1);	// 增加打断的两面墙
					this.mWallArray.push(tWall2);
					tWall1.OnRender();
					tWall2.OnRender();
					this.OnDelete(tWall); 				// 删除原来的墙体
				}
				
				// 判断**起点**是否打断原有墙体
				ab = this.CheckPosOnLine(this.m_pCurWall.m_vStart.x,this.m_pCurWall.m_vStart.y);
				if( ab[0] == 3)
				{
					var tWall  = this.mWallArray[ab[4]];
					var tWall1 = new WallData();
					var tWall2 = new WallData();
					tWall1.OnInit(tWall.m_vStart.x,tWall.m_vStart.y,tWall.m_iType);
					tWall1.m_vEnd.x = this.m_pCurWall.m_vStart.x;
					tWall1.m_vEnd.y = this.m_pCurWall.m_vStart.y;
					tWall1.m_fWidth = tWall.m_fWidth;
					tWall2.OnInit(tWall.m_vEnd.x,tWall.m_vEnd.y,tWall.m_iType);
					tWall2.m_vStart.x = this.m_pCurWall.m_vStart.x;
					tWall2.m_vStart.y = this.m_pCurWall.m_vStart.y;		
					tWall2.m_fWidth 	= tWall.m_fWidth;
					this.mWallArray.push(tWall1);	// 增加打断的两面墙
					this.mWallArray.push(tWall2);
					tWall1.OnRender();
					tWall2.OnRender();
					this.OnDelete(tWall); 				// 删除原来的墙体					
				}
					
				for( var i = 0; i< this.mWallArray.length; i++ )	//关闭辅助信息
					this.mWallArray[i].OnShow(false);
				
				this.OnUpdateAllWall();		// 重新绘制整个户型
			
				this.OnBuildNewWall(this.m_pCurWall.m_vEnd.x,this.m_pCurWall.m_vEnd.y,iType);		// 新墙
			}			
		};
		
		this.OnMerge = function(vPos)
		{
				// 合并墙体
				var tWallArray = new Array();
				for( var i = 0; i< this.mWallArray.length; i++ )	// 得到顶点相关墙体数
				{
					if( Math.abs(this.mWallArray[i].m_vStart.x - vPos.x )<0.001 &&
							Math.abs(this.mWallArray[i].m_vStart.y - vPos.y )<0.001 )
					{
							tWallArray.push(this.mWallArray[i]);
					}
					
					if( Math.abs(this.mWallArray[i].m_vEnd.x - vPos.x )<0.001 &&
							Math.abs(this.mWallArray[i].m_vEnd.y - vPos.y )<0.001 )
					{
							tWallArray.push(this.mWallArray[i]);
					}					
				}
				
				// 只有两 面墙体，合并
				if(tWallArray.length == 2)
				{
						var sx,sy,ex,ey;
						if( Math.abs(tWallArray[0].m_vStart.x - vPos.x )<0.001 &&
								Math.abs(tWallArray[0].m_vStart.y - vPos.y )<0.001 )
						{
								sx = tWallArray[0].m_vEnd.x;
								sy = tWallArray[0].m_vEnd.y;
						}
						
						if( Math.abs(tWallArray[0].m_vEnd.x - vPos.x )<0.001 &&
								Math.abs(tWallArray[0].m_vEnd.y - vPos.y )<0.001 )
						{
								sx = tWallArray[0].m_vStart.x;
								sy = tWallArray[0].m_vStart.y;
						}		
						
						if( Math.abs(tWallArray[1].m_vStart.x - vPos.x )<0.001 &&
								Math.abs(tWallArray[1].m_vStart.y - vPos.y )<0.001 )
						{
								ex = tWallArray[1].m_vEnd.x;
								ey = tWallArray[1].m_vEnd.y;
						}
						
						if( Math.abs(tWallArray[1].m_vEnd.x - vPos.x )<0.001 &&
								Math.abs(tWallArray[1].m_vEnd.y - vPos.y )<0.001 )
						{
								ex = tWallArray[1].m_vStart.x;
								ey = tWallArray[1].m_vStart.y;
						}							
						
					  var ab = mMathClass.ClosestPointOnLine1( sx,sy, ex, ey, vPos.x, vPos.y, 0.1 );
					  
					  if( ab[0] == 3)	// 判断是否在同一直线上
					  {
								var tWall = new WallData();

								tWall.OnInit(sx,sy,tWallArray[0].m_iType);
								tWall.m_vEnd.x = ex;
								tWall.m_vEnd.y = ey;
								tWall.m_fWidth = tWallArray[0].m_fWidth;
								this.mWallArray.push(tWall);
								tWall.OnRender();
								
								this.OnDelete(tWallArray[0]);
								this.OnDelete(tWallArray[1]);
					  }
				}
		}


		this.OnUpdateAllWall = function(){
			
				if(this.mWallArray.length<=0)	//是CAD线条方式、绘制情况
				{
					this.OnClearLastWall();	
					this.OnClearRenderLine();
					mHouseClass.OnClearWallTop();				// 墙顶厚度是个整体
					mHouseClass.mFloorClass.OnClear();	// 清空地面
					mHouseClass.mCeilingClass.OnClear();
					return;
				}
				
				this.OnClearLastWall();	
				this.OnClearRenderLine();
				
				this.OnUpdateRenderWall();		// 重新绘制整个户型
				mHouseClass.OnClearWallTop();
				mHouseClass.mFloorClass.OnUpdateFloor(this.solution_paths, this.iMaxAreaFloor);
				mFloorCameraClass.OnUpdate(this.solution_paths, this.iMaxAreaFloor);			// 更新区域选择窗口显示内容
			
				mHouseClass.BuildWallTop2D(this.solution_paths, this.iMaxAreaFloor);					// 墙厚顶
				mHouseClass.mCeilingClass.OnUpdateCeiling(this.solution_paths, this.iMaxAreaFloor);			// 
				
				this.OnUpdateWallRenderLine(this.solution_paths);	// 得到每堵墙的最终形状
				
				$("#mArea").text(mHouseClass.mFloorClass.ComputerArea());	//更新面积显示

		};
		
		/**
		 * @api OnBuildNewWall(mouseX,mouseY,iType)
		 * @apiDescription 创建新的墙体
		 * @apiGroup WallClass
		 * @apiParam (参数) mouseX 鼠标X坐标
		 * @apiParam (参数) mouseY 鼠标Y坐标
		 * @apiParam (参数) iType  0 墙中线方式绘制，1内墙线方式绘制，2外墙线方式绘制
		 * 
		 */		
		this.OnBuildNewWall = function(mouseX,mouseY,iType)
		{
				var ab = this.CheckPosOnLine(mouseX,mouseY);
				if( ab[0] ==1 || ab[0] == 2 || ab[0]== 3){
					this.mMouseX = ab[1];
					this.mMouseY = ab[2];
				}
				else{
					this.mMouseX = mouseX;
					this.mMouseY = mouseY;				
				}
				this.m_pCurWall  = new WallData();	
				this.m_pCurWall.OnInit(this.mMouseX,this.mMouseY,iType);			
		};
		
		/**
		 * @api OnMouseRightUp2D()
		 * @apiDescription 2D下鼠标右键释放
		 * @apiGroup WallClass
		 * 
		 */			
		this.OnMouseRightUp2D= function()
		{ // 鼠标右键释放
			if(this.m_pCurWall)
			{ 
				if( this.mWallArray.indexOf(this.m_pCurWall) == -1)
					this.OnDelete(this.m_pCurWall);		
				this.m_pCurWall = null;			
			}	
			this.m_pMoveWall= null;
			scene.remove(this.mHelpWall);		// 帮助墙体
		};
		
		/**
		 * @api OnMouseMove(mouseX,mouseY,buttonDown)
		 * @apiDescription 鼠标连续绘制墙体时的移动操作
		 * @apiGroup WallClass
		 * @apiParam (参数) mouseX 鼠标X坐标
		 * @apiParam (参数) mouseY 鼠标Y坐标
		 * @apiParam (参数) buttonDown  鼠标按键状态
		 * 
		 */			
		this.OnMouseMove= function(mouseX,mouseY,buttonDown)
		{
			// 创建时移动墙体
			if( this.m_pCurWall )
			{		
				this.m_pCurWall.m_vEnd.x   =  mouseX;  
				this.m_pCurWall.m_vEnd.y   =  mouseY; 
				if(this.m_pCurWall.m_vStart.distanceTo(this.m_pCurWall.m_vEnd)>this.m_pCurWall.m_fWidth/2)
				{
					if( true == this.CheckXYPos1(this.m_pCurWall))	//XY轴对齐
					{
						mHelpClass.mHelpCoss.position.x = this.mMouseX;
						mHelpClass.mHelpCoss.position.y = this.mMouseY;		
					}
					else
					{
						mHelpClass.mHelpCoss.position.x = -999999;
						mHelpClass.mHelpCoss.position.y = -999999;
						mHelpClass.OnHidePosAll();
					}
					this.CheckWallPos();
				}
				this.m_pCurWall.OnRender();			// 绘制临时墙体
				
				this.mMouseX = this.m_pCurWall.m_vEnd.x;
				this.mMouseY = this.m_pCurWall.m_vEnd.y;
			}
			else		
			{
				this.mMouseX = mouseX;
				this.mMouseY = mouseY;				
				var ab1 = this.CheckPosOnLine1(mouseX,mouseY);			
				if( ab1[0] !=0 )
				{
					this.mMouseX = ab1[1];
					this.mMouseY = ab1[2];	
					mHelpClass.mHelpCoss.position.x = this.mMouseX;
					mHelpClass.mHelpCoss.position.y = this.mMouseY;						
				}
				else
				{
					mHelpClass.mHelpCoss.position.x = -999999;
					mHelpClass.mHelpCoss.position.y = -999999;
					mHelpClass.OnHidePosAll();					
				}
			}	
		};

		/**
		 * @api CheckPosOnLine(posX,posY)
		 * @apiDescription 判断当前点是否在已有墙体上
		 * @apiGroup WallClass
		 * @apiParam (参数) posX 鼠标X坐标
		 * @apiParam (参数) posY 鼠标Y坐标
		 * @apiParam (返回) Array 返回数组,Array[0]=0 点没在墙体上，
		 * 																Array[0]=1,或2 在墙体的端点上,	 
		 * 																Array[0]=3 在墙体有交点，Array[1-3]的值为交点 x,y,z的值
		 */
		this.CheckPosOnLine= function ( posX, posY )
		{
			var ab1 =new Array();
			ab1.push(0);
			var pos = new THREE.Vector3(posX,posY,0);
			for( var i = 0; i< this.mWallArray.length; i++ )
			{						  
				if(app.attributeInterface.wall.xifu == false)		// 无吸附
					 break;
				var ab = mMathClass.ClosestPointOnLine(this.mWallArray[i], posX, posY, 0, this.mWallArray[i].m_fWidth/2);
				if( ab[0] != 0 )
				{
					ab.push(i);
					return ab;
				}
			}
			return ab1;
		};
		
		this.CheckPosOnLine1= function ( posX, posY )
		{
			var ab1 =new Array();
				ab1.push(0);
			var pos = new THREE.Vector3(posX,posY,0);
			for( var i = 0; i< this.mWallArray.length; i++ )
			{						  
				if(app.attributeInterface.wall.xifu == false)		// 无吸附
					 break;
					
				if(this.mWallArray[i].m_iType == 0 )	// 墙中线移动
				{
					var ab = mMathClass.ClosestPointOnLine(this.mWallArray[i], posX, posY, 0, this.mWallArray[i].m_fWidth/2);
					if( ab[0] != 0 )
					{
						var bVisible = this.mWallArray[i].mWall.visible;	// 使其暂时有效, 参与拾取
						this.mWallArray[i].mWall.visible = true;
						var Intersections = raycaster.intersectObject( this.mWallArray[i].mWall );
						this.mWallArray[i].mWall.visible = bVisible;
						if(Intersections.length>0)
						{
							ab.push(i);
							return ab;					
						}						
					}
				}
				else		// 墙边线移动
				{
					var ab = mMathClass.ClosestPointOnLine1(this.mWallArray[i].m_LastLineArray[0].x, this.mWallArray[i].m_LastLineArray[0].y,
																									this.mWallArray[i].m_LastLineArray[1].x, this.mWallArray[i].m_LastLineArray[1].y,
																									posX, posY, this.mWallArray[i].m_fWidth/2);
					if( ab[0] != 0 )
					{
						var bVisible = this.mWallArray[i].mWall.visible;	// 使其暂时有效, 参与拾取
						this.mWallArray[i].mWall.visible = true;
						var Intersections = raycaster.intersectObject( this.mWallArray[i].mWall );
						this.mWallArray[i].mWall.visible = bVisible;
						if(Intersections.length>0)
						{
								ab.push(i);
							return ab;					
						}						
					}
					
					ab = mMathClass.ClosestPointOnLine1(this.mWallArray[i].m_LastLineArray[2].x, this.mWallArray[i].m_LastLineArray[2].y,
																							this.mWallArray[i].m_LastLineArray[3].x, this.mWallArray[i].m_LastLineArray[3].y,
																									posX, posY, this.mWallArray[i].m_fWidth/2);
					if( ab[0] != 0 )
					{
						var bVisible = this.mWallArray[i].mWall.visible;	// 使其暂时有效, 参与拾取
						this.mWallArray[i].mWall.visible = true;						
						var Intersections = raycaster.intersectObject( this.mWallArray[i].mWall );
						this.mWallArray[i].mWall.visible = bVisible;
						if(Intersections.length>0)
						{
								ab.push(i);
							return ab;					
						}	
					}
				}
			}
			return ab1;
		};		
		
		
					
		this.CheckXYPos1 = function(pWall)
		{
			// 判断附近是否已存在墙体点
			if(app.attributeInterface.wall.xifu == false)		// 无吸附
					 return false;
			var pos = pWall.m_vEnd;
			for( i = 0; i< this.mWallArray.length; i++ )
			{
				if( pWall == this.mWallArray[i])
					continue;
				
				if(Math.abs(pos.x - this.mWallArray[i].m_vStart.x )< 15 )
				{
					if( pWall.m_vStart.distanceTo(this.mWallArray[i].m_vStart)>0.01)
					{
						pos.x = this.mWallArray[i].m_vStart.x;
						return true;
					}	
				}
				else if ( Math.abs(pos.y - this.mWallArray[i].m_vStart.y )< 15  )
				{
					if( pWall.m_vStart.distanceTo(this.mWallArray[i].m_vStart)>0.01)
					{
						pos.y = this.mWallArray[i].m_vStart.y;
						return true;
					}
				}
				else if ( Math.abs(pos.x - this.mWallArray[i].m_vEnd.x )< 15  ) 
				{
					if( pWall.m_vStart.distanceTo(this.mWallArray[i].m_vEnd)>0.01)
					{					
						pos.x = this.mWallArray[i].m_vEnd.x;	
						return true;
					}
				}
				else if (  Math.abs(pos.y - this.mWallArray[i].m_vEnd.y )< 15  ) 
				{
					if( pWall.m_vStart.distanceTo(this.mWallArray[i].m_vEnd)>0.01)
					{	
						pos.y = this.mWallArray[i].m_vEnd.y;
						return true;
					}
				}	
			}
			return false;
		};					
					
		this.CheckXYPos = function(pos)
		{
			// 判断附近是否已存在墙体点
			if(app.attributeInterface.wall.xifu == false)		// 无吸附
					 return false;
			for( i = 0; i< this.mWallArray.length; i++ )
			{
				if(Math.abs(pos.x - this.mWallArray[i].m_vStart.x )< 15 )
				{
					pos.x = this.mWallArray[i].m_vStart.x;
					return true;
				}
				else if ( Math.abs(pos.y - this.mWallArray[i].m_vStart.y )< 15  )
				{
					pos.y = this.mWallArray[i].m_vStart.y;
					return true;
				}
				else if ( Math.abs(pos.x - this.mWallArray[i].m_vEnd.x )< 15  ) 
				{
					pos.x = this.mWallArray[i].m_vEnd.x;	
					return true;
				}
				else if (  Math.abs(pos.y - this.mWallArray[i].m_vEnd.y )< 15  ) 
				{
					pos.y = this.mWallArray[i].m_vEnd.y;
					return true;
				}
				
/*				if(Math.abs(pos.x - this.mWallArray[i].m_LastLineArray[0].x )< 15 )
				{
					pos.x = this.mWallArray[i].m_vStart.x;
					return true;
				}
				else if ( Math.abs(pos.y - this.mWallArray[i].m_LastLineArray[0].y )< 15  )
				{
					pos.y = this.mWallArray[i].m_vStart.y;
					return true;
				}
				else if ( Math.abs(pos.x - this.mWallArray[i].m_LastLineArray[1].x )< 15  ) 
				{
					pos.x = this.mWallArray[i].m_vEnd.x;	
					return true;
				}
				else if (  Math.abs(pos.y - this.mWallArray[i].m_LastLineArray[1].y )< 15  ) 
				{
					pos.y = this.mWallArray[i].m_vEnd.y;
					return true;
				}	
				
				else if(Math.abs(pos.x - this.mWallArray[i].m_LastLineArray[2].x )< 15 )
				{
					pos.x = this.mWallArray[i].m_vStart.x;
					return true;
				}
				else if ( Math.abs(pos.y - this.mWallArray[i].m_LastLineArray[2].y )< 15  )
				{
					pos.y = this.mWallArray[i].m_vStart.y;
					return true;
				}
				else if ( Math.abs(pos.x - this.mWallArray[i].m_LastLineArray[3].x )< 15  ) 
				{
					pos.x = this.mWallArray[i].m_vEnd.x;	
					return true;
				}
				else if (  Math.abs(pos.y - this.mWallArray[i].m_LastLineArray[3].y )< 15  ) 
				{
					pos.y = this.mWallArray[i].m_vEnd.y;
					return true;
				}*/				
			}
			return false;
		};
		
		/**
		 * @api CheckWallPos
		 * @apiDescription 删除指定的墙体
		 * @apiGroup WallClass
		 * @apiParam (参数) tWall 指定墙体
		 * 
		 */			
		this.CheckWallPos=function()
		{	
			// 旋转5度
			if( app.attributeInterface.wall.zhengjiao == false )
				mMathClass.RotateVecFromAxis( this.m_pCurWall.m_vEnd, this.m_pCurWall.m_vStart, 5);
			else
				mMathClass.RotateVecFromAxis( this.m_pCurWall.m_vEnd, this.m_pCurWall.m_vStart, 90);
			this.m_pCurWall.m_vEnd.x =  mMathClass.mRetVec.x;  
			this.m_pCurWall.m_vEnd.y =  mMathClass.mRetVec.y;	
				
			var ab = this.CheckPosOnLine1(this.m_pCurWall.m_vEnd.x,this.m_pCurWall.m_vEnd.y);			
			if( ab[0] !=0 )	// 顶点
			{
				this.m_pCurWall.m_vEnd.x = ab[1];
				this.m_pCurWall.m_vEnd.y = ab[2];	
			}
		};
		
		// 拾取墙体
		this.OnShow2D = function()
		{
		};
		
		this.OnUpdateRenderWall= function()
		{			
			var fAngle 		= 0;
			var fAngleMax	= -99999;
			var iIndex    = 0;
			for( var i = 1; i< this.mWallArray.length; i++ )
			{
				fAngleMax = -99999;
				for(var j = 0; j< this.mWallArray.length;j++ )
				{
					if( this.mWallArray[i] == this.mWallArray[j] )
						continue;
					
					if( mMathClass.Vec_Equals(this.mWallArray[i].m_vEnd, this.mWallArray[j].m_vStart,0.001 ) == true )
					{
						fAngle = mMathClass.dotProduct(this.mWallArray[j].m_vEnd, this.mWallArray[i].m_vEnd, this.mWallArray[i].m_vStart );
						if( fAngleMax< Math.abs(fAngle) )
						{
							fAngleMax = Math.abs(fAngle);
							iIndex = j;
						}
					}
					
					if( mMathClass.Vec_Equals(this.mWallArray[i].m_vEnd, this.mWallArray[j].m_vEnd,0.001 ) == true )
					{
						fAngle = mMathClass.dotProduct(this.mWallArray[j].m_vStart, this.mWallArray[i].m_vEnd, this.mWallArray[i].m_vStart );
						if( fAngleMax< Math.abs(fAngle) )
						{
							fAngleMax = Math.abs(fAngle);
							iIndex    = j;
						}
					}
				}
				if( fAngleMax != -99999 )	
						this.BuildCorner(this.mWallArray[iIndex],this.mWallArray[i]);
			}
			
			//=========================================================================================================================
			for( var i = 0; i< this.mWallArray.length; i++ )
			{
				fAngleMax = -99999;		
				for(var j = 0; j< this.mWallArray.length;j++ )
				{	
					if( this.mWallArray[i] == this.mWallArray[j] )
						continue;
					
					if( mMathClass.Vec_Equals( this.mWallArray[i].m_vStart,this.mWallArray[j].m_vStart,0.001) == true )
					{
						fAngle = mMathClass.dotProduct(this.mWallArray[j].m_vEnd, this.mWallArray[i].m_vStart, this.mWallArray[i].m_vEnd );
						if( fAngleMax< Math.abs(fAngle) )
						{
							fAngleMax = Math.abs(fAngle);
							iIndex    = j;
						}
					}
					
					if( mMathClass.Vec_Equals(this.mWallArray[i].m_vStart,this.mWallArray[j].m_vEnd,0.001) == true )
					{
						fAngle = mMathClass.dotProduct( this.mWallArray[j].m_vStart, this.mWallArray[i].m_vStart, this.mWallArray[i].m_vEnd );
						if( fAngleMax< Math.abs(fAngle) )
						{
							fAngleMax = Math.abs(fAngle);
							iIndex    = j;
						}
					}					
				}
				
				if( fAngleMax != -99999 )	
					this.BuildCorner(this.mWallArray[iIndex],this.mWallArray[i] );
			}
			
			this.OnRenderLine();	// 显示轮廓
		};
		
		// 生成墙角
		this.BuildCorner=function(tWall1, tWall )
		{
			var iIndex = 0;
			var foff = 2;
			if( mMathClass.Vec_Equals(tWall.m_WallLineArray[0],tWall1.m_WallLineArray[0],foff ) == true || 
				  mMathClass.Vec_Equals(tWall.m_WallLineArray[0],tWall1.m_WallLineArray[1],foff ) == true ||
				  mMathClass.Vec_Equals(tWall.m_WallLineArray[0],tWall1.m_WallLineArray[2],foff ) == true ||
				  mMathClass.Vec_Equals(tWall.m_WallLineArray[0],tWall1.m_WallLineArray[3],foff ) == true )
			{
				iIndex++;
			}
			
			if( mMathClass.Vec_Equals(tWall.m_WallLineArray[1],tWall1.m_WallLineArray[0],foff ) == true || 
				  mMathClass.Vec_Equals(tWall.m_WallLineArray[1],tWall1.m_WallLineArray[1],foff ) == true ||
				  mMathClass.Vec_Equals(tWall.m_WallLineArray[1],tWall1.m_WallLineArray[2],foff ) == true ||
				  mMathClass.Vec_Equals(tWall.m_WallLineArray[1],tWall1.m_WallLineArray[3],foff ) == true )
			{
				iIndex++;
			}	
			
			if( mMathClass.Vec_Equals(tWall.m_WallLineArray[2],tWall1.m_WallLineArray[0],foff ) == true || 
				  mMathClass.Vec_Equals(tWall.m_WallLineArray[2],tWall1.m_WallLineArray[1],foff ) == true ||
				  mMathClass.Vec_Equals(tWall.m_WallLineArray[2],tWall1.m_WallLineArray[2],foff ) == true ||
				  mMathClass.Vec_Equals(tWall.m_WallLineArray[2],tWall1.m_WallLineArray[3],foff ) == true )
			{
				iIndex++;
			}	
			
			if( mMathClass.Vec_Equals(tWall.m_WallLineArray[3],tWall1.m_WallLineArray[0],foff ) == true || 
				  mMathClass.Vec_Equals(tWall.m_WallLineArray[3],tWall1.m_WallLineArray[1],foff ) == true ||
				  mMathClass.Vec_Equals(tWall.m_WallLineArray[3],tWall1.m_WallLineArray[2],foff ) == true ||
				  mMathClass.Vec_Equals(tWall.m_WallLineArray[3],tWall1.m_WallLineArray[3],foff ) == true )
			{
				iIndex++;
			}				
			
			if( iIndex >=2 )
				return;
			
			var tArray1 = mMathClass.Get2Line(tWall.m_WallLineArray[0],tWall.m_WallLineArray[1],tWall1.m_WallLineArray[0],tWall1.m_WallLineArray[1]);
			var tArray2 = mMathClass.Get2Line(tWall.m_WallLineArray[0],tWall.m_WallLineArray[1],tWall1.m_WallLineArray[2],tWall1.m_WallLineArray[3]);
			
			var tArray3 = mMathClass.Get2Line(tWall.m_WallLineArray[2],tWall.m_WallLineArray[3],tWall1.m_WallLineArray[0],tWall1.m_WallLineArray[1]);
			var tArray4 = mMathClass.Get2Line(tWall.m_WallLineArray[2],tWall.m_WallLineArray[3],tWall1.m_WallLineArray[2],tWall1.m_WallLineArray[3]);
			
			if( tArray1[0] == false && tArray2[0] == false)	// ƽ��
				return;
			
			var vPos3 = new THREE.Vector3(tArray3[1],tArray3[2],tArray3[3]);
			if( mMathClass.Vec_Equals(tWall.m_WallLineArray[2],vPos3,0.001 ) == true && mMathClass.Vec_Equals(tWall.m_WallLineArray[3],vPos3,0.001 ) == true )
			{
				iIndex++;
			}
			
			var vPos4 = new THREE.Vector3(tArray4[1],tArray4[2],tArray4[3]);
			if( mMathClass.Vec_Equals(tWall.m_WallLineArray[2],vPos4,0.001 ) == true && mMathClass.Vec_Equals(tWall.m_WallLineArray[3],vPos4,0.001 ) == true )
			{
				iIndex++;
			}
			
			if( iIndex >=2 )
				return;
						
			this.GetMaxLine(tWall,tArray1,tArray2, 0);
			this.GetMaxLine(tWall,tArray3,tArray4, 2);
		};
		
	  this.GetMaxLine= function(tWall, tArray1, tArray2, iIndex  )
		{
			var vPos = new THREE.Vector3(tArray1[1],tArray1[2],0);
			var a = tWall.m_WallLineArray[0+iIndex].distanceTo(vPos);				
			var b = tWall.m_WallLineArray[1+iIndex].distanceTo(vPos);
			
			var vPos1 = new THREE.Vector3(tArray2[1],tArray2[2],0);
			var c = tWall.m_WallLineArray[0+iIndex].distanceTo(vPos1);					
			var d = tWall.m_WallLineArray[1+iIndex].distanceTo(vPos1);				

			if( a > c )
			{
				if( a> b )
				{
					if( a> d )
					{
						if( d>2 )
						{
							tWall.m_LastLineArray[1+iIndex].x = tArray1[1];
							tWall.m_LastLineArray[1+iIndex].y = tArray1[2];
						}
					}
					else
					{
						tWall.m_LastLineArray[0+iIndex].x = tArray2[1];
						tWall.m_LastLineArray[0+iIndex].y = tArray2[2];
					}
				}
				else
				{
					if( b>d )
					{
						if( d>2)
						{
							tWall.m_LastLineArray[0+iIndex].x = tArray1[1];
							tWall.m_LastLineArray[0+iIndex].y = tArray1[2];
						}
					}
					else
					{
						tWall.m_LastLineArray[0+iIndex].x = tArray2[1];
						tWall.m_LastLineArray[0+iIndex].y = tArray2[2];
					}
				}
			}
			else
			{
				if( c > b )
				{
					if( c> d )
					{
						if( d>2)
						{
							tWall.m_LastLineArray[1+iIndex].x = tArray2[1];
							tWall.m_LastLineArray[1+iIndex].y = tArray2[2];
						}
					}
					else
					{
						tWall.m_LastLineArray[0+iIndex].x = tArray2[1];
						tWall.m_LastLineArray[0+iIndex].y = tArray2[2];
					}
				}
				else
				{
					if( b> d)
					{
						if( d>2)
						{
							tWall.m_LastLineArray[0+iIndex].x = tArray1[1];
							tWall.m_LastLineArray[0+iIndex].y = tArray1[2];
						}
					}
					else
					{
						tWall.m_LastLineArray[0+iIndex].x = tArray2[1];
						tWall.m_LastLineArray[0+iIndex].y = tArray2[2];
					}
				}
			}			
		};
		
		this.OnShow = function(bShow)
		{
			for( var i = 0; i< this.mWallArray.length; i++ )
			{
				this.mWallArray[i].OnShow(bShow);
			}
			
			for(var k =0; k< this.mRenderLine.length; k++ )
			{
				this.mRenderLine[k].visible = bShow;
			}	
		};
		
		this.OnShowRenderLine = function(bShow)
		{ // 墙体内外黑线
			for(var k =0; k< this.mRenderLine.length; k++ )
			{
				this.mRenderLine[k].visible = bShow;
			}	
		};
		
		this.OnClearRenderLine = function()
		{
			//删除黑色轮廓线 
			for(k =0; k< this.mRenderLine.length; k++ )
				scene.remove(this.mRenderLine[k]);
			this.mRenderLine.length = 0;				
		};
		
		this.OnRenderLine = function()
		{
			// 墙体内外黑色轮廓线
			this.solution_paths = null;
			
			if( this.mWallArray.length == 0 )
				return;
			var scale = 1;		
			var subj_paths = [[{X:this.mWallArray[0].m_LastLineArray[0].x,Y:this.mWallArray[0].m_LastLineArray[0].y},
												 {X:this.mWallArray[0].m_LastLineArray[1].x,Y:this.mWallArray[0].m_LastLineArray[1].y},
												 {X:this.mWallArray[0].m_LastLineArray[3].x,Y:this.mWallArray[0].m_LastLineArray[3].y},
												 {X:this.mWallArray[0].m_LastLineArray[2].x,Y:this.mWallArray[0].m_LastLineArray[2].y},
												 {X:this.mWallArray[0].m_LastLineArray[0].x,Y:this.mWallArray[0].m_LastLineArray[0].y}]];

			ClipperLib.JS.ScaleUpPaths(subj_paths, scale);
			
			var cpr = new ClipperLib.Clipper();
  		cpr.AddPaths(subj_paths, ClipperLib.PolyType.ptSubject, true);
 			for( var i = 1; i< this.mWallArray.length; i++ )
			{
  			var clip_paths = [[{X:this.mWallArray[i].m_LastLineArray[0].x,Y:this.mWallArray[i].m_LastLineArray[0].y},
  												 {X:this.mWallArray[i].m_LastLineArray[1].x,Y:this.mWallArray[i].m_LastLineArray[1].y},
  												 {X:this.mWallArray[i].m_LastLineArray[3].x,Y:this.mWallArray[i].m_LastLineArray[3].y},
  												 {X:this.mWallArray[i].m_LastLineArray[2].x,Y:this.mWallArray[i].m_LastLineArray[2].y},
  												 {X:this.mWallArray[i].m_LastLineArray[0].x,Y:this.mWallArray[i].m_LastLineArray[0].y}]];			
  			ClipperLib.JS.ScaleUpPaths(clip_paths, scale);
  			cpr.AddPaths(clip_paths, ClipperLib.PolyType.ptClip, 		true);	
	    }
	 		
  		this.solution_paths = new ClipperLib.Paths();
			var succeeded  = cpr.Execute(ClipperLib.ClipType.ctUnion, this.solution_paths, ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero);
		    
	    // 生成所有的墙体线条
	    for(i = 0; i < this.solution_paths.length; i++) 
			{				
				var result_poly = new THREE.Geometry();
    		for(j = 0; j < this.solution_paths[i].length; j++)
      		result_poly.vertices.push(new THREE.Vector3(this.solution_paths[i][j].X / scale,this.solution_paths[i][j].Y / scale,0.5)); 
 
    		result_poly.vertices.push(new THREE.Vector3(this.solution_paths[i][0].X / scale,this.solution_paths[i][0].Y / scale,0.5));

    		var result_wall = new THREE.Line( result_poly, new THREE.LineBasicMaterial( { color: 0x555555, linewidth:1, opacity: 1 } ) );
  			scene.add(result_wall);
  			this.mRenderLine.push(result_wall);			
  		}
			
				this.GetMaxAreaCount();
		};
		
		// 得到最大面积系数
		this.GetMaxAreaCount = function()
		{
			this.iMaxAreaFloor = 0;	
			var fMaxArea = -999;
			for(var i = 0; i < this.solution_paths.length; i++)
			{
				var fArea = 0;
				var tArea = [];
				for(j = 0; j < this.solution_paths[i].length; j++)
					tArea.push(new poly2tri.Point(this.solution_paths[i][j].X ,this.solution_paths[i][j].Y ));
					
				var swctx     = new poly2tri.SweepContext(tArea);
						swctx.triangulate();	
				var triangles = swctx.getTriangles();
				
				for( var k = 0; k< triangles.length; k++ )	
					fArea+=mMathClass.GetAreaInTri( triangles[k].points_[0].x, triangles[k].points_[0].y,
					    									 			  	triangles[k].points_[1].x, triangles[k].points_[1].y,
					    									 			  	triangles[k].points_[2].x, triangles[k].points_[2].y);
				if( fArea > fMaxArea )
    		{
    			this.iMaxAreaFloor = i;
    			fMaxArea = fArea;
    		}			
			}
		};
		
		// 是否高亮端点
		this.OnShowHighlightPos = function(mouseX, mouseY)
		{
			  this.OnHideWallHelp();
				var ab = this.CheckPosOnLine(mouseX, mouseY);			
				if( ab[0] == 1 || ab[0] == 2 )	// 顶点
				{
				//	mHelpClass.mHelpWallPos1.position.x = ab[1];
				//	mHelpClass.mHelpWallPos1.position.y = ab[2];
					$('#container' ).css("cursor","pointer");
					return true;
				}
				$('#container' ).css("cursor","default");
				return false;
		};
		
		// 隐藏高亮
		this.OnHideWallHelp = function()
		{
				mHelpClass.mHelpWallPos1.visible = false;	
				mHelpClass.mHelpWallPos2.visible = false;
				mHelpClass.mHelpWallPos3.visible = false;
				mHelpClass.mHelpWallPos4.visible = false;
		};
		
		this.OnUpdateHelpWall = function(tWall)
		{
				tWall.mWall.visible = true;
				tWall.mHelpWallPos1.visible=true;
				tWall.mHelpWallPos2.visible=true;
				tWall.mHelpWallPos1.position.x = tWall.m_vStart.x;			
				tWall.mHelpWallPos1.position.y = tWall.m_vStart.y;
				tWall.mHelpWallPos2.position.x = tWall.m_vEnd.x;			
				tWall.mHelpWallPos2.position.y = tWall.m_vEnd.y;	
		};
		

				
		this.OnShowHelp = function(mouseX, mouseY)
		{
			// 显示墙体高亮
			if( mHouseClass.mWallClass.m_pMoveWall )	// 如果有选中墙体, 不显示高亮
				  return null;
			
			// 单房间显示时不显示辅助墙体
			if(mHouseClass.mRenderWallTop != undefined)
				if(mHouseClass.mRenderWallTop.visible == false)
		   		return null;	
			
			mHelpClass.OnHidePosAll();	

			for( var i = 0; i< this.mWallArray.length; i++ )	//关闭墙体辅助信息
						this.mWallArray[i].OnShow(false);
								
			var ab = this.CheckPosOnLine1(mouseX,mouseY);			
			if( ab[0] !=0 )
			{			
				this.OnUpdateHelpWall(this.mWallArray[ab[4]]);	//更新帮助墙
				return this.mWallArray[ab[4]];
			}
			scene.remove(this.mHelpWall);		// 帮助墙体
			return null;
		};
		
		this.OnHideWall = function()
		{
			// 隐藏所有帮助墙体
			if( mHouseClass.mWallClass.m_pMoveWall )	// 如果有选中墙体, 不显示高亮
				  return null;
			for( var i = 0; i< this.mWallArray.length; i++ )	//关闭墙体辅助信息
						this.mWallArray[i].OnShow(false);			
		}
		
		// 移动墙体顶点用
		this.mMovePosArray_Start 		= new Array();
		this.mMovePosArray_End   		= new Array();		
		this.OnMoveWallPos_Down = function(mouseX, mouseY,e)
		{
			if(e.buttons == 1 && this.mMovePosArray_Start.length == 0 && this.mMovePosArray_End.length == 0)
			{
				for( var i = 0; i< this.mWallArray.length; i++ )
				{						  	
					var ab = mMathClass.ClosestPointOnLine(this.mWallArray[i], mouseX, mouseY, 0, 10);
					if( ab[0] == 1 )
						this.mMovePosArray_Start.push(this.mWallArray[i]);
					if( ab[0] == 2 )				
						this.mMovePosArray_End.push(this.mWallArray[i]);
				}			
				if( this.mMovePosArray_Start.length>0 || 	this.mMovePosArray_End.length>0)
					return true;
			}
			return false;
		};
		
		this.OnMoveWallPos_Up = function(mouseX, mouseY,e)
		{
			this.mMovePosArray_Start.length = 0;
			this.mMovePosArray_End.length 	= 0;
		};
		
		this.OnMoveWallPos = function(mouseX, mouseY,e)
		{
			if(e.buttons == 1 )
			{
				var pos = new THREE.Vector3(mouseX,mouseY,0);
				this.CheckXYPos(pos);	//XY轴对齐
				for( var i = 0; i<this.mMovePosArray_Start.length; i++ )
				{
						this.mMovePosArray_Start[i].m_vStart.x =  pos.x; 
						this.mMovePosArray_Start[i].m_vStart.y =  pos.y; 
						this.mMovePosArray_Start[i].OnRender1();
				}
				
				for( var i = 0; i<this.mMovePosArray_End.length; i++ )
				{
						this.mMovePosArray_End[i].m_vEnd.x   =  pos.x;  
						this.mMovePosArray_End[i].m_vEnd.y   =  pos.y; 
						this.mMovePosArray_End[i].OnRender1();
				}
				
				this.OnUpdateAllWall();		// 重新绘制整个户型
			//	mHelpClass.mHelpWallPos1.position.x = pos.x;
			//	mHelpClass.mHelpWallPos1.position.y = pos.y;				
			}			
		};
		

		
		
		// 拖动墙体规则
		// 1. 三个相关函数控制轴向移动墙体
		//========================================================================================
		this.m_pMoveWall     = null;
		this.mMoveWallPosArray_Start 		= new Array();
		this.mMoveWallPosArray_End   		= new Array();
		this.mMoveWallPosArray_Start1 	= new Array();
		this.mMoveWallPosArray_End1   	= new Array();		
		this.OnMoveWall_Down = function(mouseX, mouseY,e)
		{
			if( mFloorCameraClass.m_bShowAllRoom == false )		// 不是显示所有房间, 则不进行当前操作
					return null;
					
			if(e.buttons == 1)
			{					
					for( var i = 0; i< this.mWallArray.length; i++ )	//关闭墙体辅助信息
								this.mWallArray[i].OnShow(false);
					
					var ab = this.CheckPosOnLine(mouseX,mouseY);			
					if( ab[0] !=0 )
					{			
						$('#container' ).css("cursor","move");
						this.OnUpdateHelpWall(this.mWallArray[ab[4]]);
						OnMouseRightUp();
						this.m_pMoveWall = this.mWallArray[ab[4]];
						
						this.GetWallByWall(this.m_pMoveWall);
						this.m_pMoveWall.mCurMouseX = mouseX;
						this.m_pMoveWall.mCurMouseY = mouseY;
						mHelpClass.ClearOutline();
						return true;
					}
					else
						return false;
			}			
			return false;
		};
		
		this.GetWallByWall= function ( tWall )
		{
			this.mMoveWallPosArray_Start.length  = 0;
			this.mMoveWallPosArray_End.length    = 0;
			this.mMoveWallPosArray_Start1.length = 0;
			this.mMoveWallPosArray_End1.length   = 0;			
			for( var i = 0; i< this.mWallArray.length; i++ )
			{				
				if(  tWall== this.mWallArray[i])
					continue;
					
				var ab = mMathClass.ClosestPointOnLine(this.mWallArray[i], tWall.m_vStart.x, tWall.m_vStart.y, 0, 10);
				if( ab[0] == 1 )
					this.mMoveWallPosArray_Start.push(this.mWallArray[i]);
				if( ab[0] == 2 )					
					this.mMoveWallPosArray_End.push(this.mWallArray[i]);
					
				ab = mMathClass.ClosestPointOnLine(this.mWallArray[i], tWall.m_vEnd.x, tWall.m_vEnd.y, 0, 10);
				if( ab[0] == 1 )
					this.mMoveWallPosArray_Start1.push(this.mWallArray[i]);
				if( ab[0] == 2 )					
					this.mMoveWallPosArray_End1.push(this.mWallArray[i]);	
			}
		};
		
		this.OnMoveWall_Up = function(mouseX, mouseY,e)
		{
			 if(this.m_pMoveWall != null)
			 {
			 		$('#container' ).css("cursor","default");
					this.mMoveWallPosArray_Start.length  = 0;
					this.mMoveWallPosArray_End.length    = 0;
					this.mMoveWallPosArray_Start1.length = 0;
					this.mMoveWallPosArray_End1.length   = 0;	
			 	//	this.m_pMoveWall = null;
			 		this.OnUpdateAllWall();		// 重新绘制整个户型
			 }
		};
		
		
		this.OnMoveWall = function(mouseX, mouseY,e)
		{
			// 移动墙体
			if(e.buttons == 1 && this.m_pMoveWall != null)
			{		
				var transform  = new THREE.Vector3(mouseX-this.m_pMoveWall.mCurMouseX, mouseY-this.m_pMoveWall.mCurMouseY, 0);				
				var angle  = this.m_pMoveWall.m_fRotate*180/Math.PI;	// 控制水平，还是垂直移动
				if( angle<44 && angle>-44)
					transform.x = 0.0;
				else
					transform.y = 0.0;
							
				var fStartX = this.m_pMoveWall.m_vStart.x + transform.x;
				var fStartY = this.m_pMoveWall.m_vStart.y + transform.y;
				var fEndX   = this.m_pMoveWall.m_vEnd.x   + transform.x;	
				var fEndY   = this.m_pMoveWall.m_vEnd.y   + transform.y;

				for( var i = 0; i<this.mMoveWallPosArray_Start.length; i++ )
				{
			 			var ab = mMathClass.ClosestPointOnLine2( this.mMoveWallPosArray_Start[i].m_vStart.x,
			 																							 this.mMoveWallPosArray_Start[i].m_vStart.y, 
			 																							 fStartX, fStartY,
			 																							 this.mMoveWallPosArray_Start[i].m_vEnd.x,
			 																							 this.mMoveWallPosArray_Start[i].m_vEnd.y,  0.1 );
					  if( ab[0] == 3)	// 判断是否在同一直线上
					  {
/*					  	var fValue1 = Math.sqrt((this.mMoveWallPosArray_Start[i].m_vEnd.x-this.mMoveWallPosArray_Start[i].m_vStart.x)*(this.mMoveWallPosArray_Start[i].m_vEnd.x-this.mMoveWallPosArray_Start[i].m_vStart.x)
																		 +(this.mMoveWallPosArray_Start[i].m_vEnd.y-this.mMoveWallPosArray_Start[i].m_vStart.y)*(this.mMoveWallPosArray_Start[i].m_vEnd.y-this.mMoveWallPosArray_Start[i].m_vStart.y)
					  	var fValue2 = Math.sqrt((this.mMoveWallPosArray_Start[i].m_vEnd.x-fStartX)*(this.mMoveWallPosArray_Start[i].m_vEnd.x-fStartX)
																		 +(this.mMoveWallPosArray_Start[i].m_vEnd.y-fStartY)*(this.mMoveWallPosArray_Start[i].m_vEnd.y-fStartY)
					  	if(fValue2 > fValue1 )// 判断是否加长
					  	{*/
								this.mMoveWallPosArray_Start[i].m_vStart.x =  fStartX; 
								this.mMoveWallPosArray_Start[i].m_vStart.y =  fStartY; 
//							}
					  }
				}
				
				for( var i = 0; i<this.mMoveWallPosArray_End.length; i++ )
				{
			 			var ab = mMathClass.ClosestPointOnLine2( this.mMoveWallPosArray_End[i].m_vStart.x,
																 this.mMoveWallPosArray_End[i].m_vStart.y, 
																 fStartX, fStartY,
																 this.mMoveWallPosArray_End[i].m_vEnd.x,
																 this.mMoveWallPosArray_End[i].m_vEnd.y,  0.1 );
					  if( ab[0] == 3)	// 判断是否在同一直线上
					  {		
					  	
							this.mMoveWallPosArray_End[i].m_vEnd.x   =  fStartX;  
							this.mMoveWallPosArray_End[i].m_vEnd.y   =  fStartY; 
						}
				}
				
				for( var i = 0; i<this.mMoveWallPosArray_Start1.length; i++ )
				{
			 			var ab = mMathClass.ClosestPointOnLine2( 
																 fEndX, fEndY,
																 this.mMoveWallPosArray_Start1[i].m_vEnd.x,
																 this.mMoveWallPosArray_Start1[i].m_vEnd.y,
																 this.mMoveWallPosArray_Start1[i].m_vStart.x,
																 this.mMoveWallPosArray_Start1[i].m_vStart.y, 
																 0.1 );
					  if( ab[0] == 3)	// 判断是否在同一直线上
					  {						
						this.mMoveWallPosArray_Start1[i].m_vStart.x =  fEndX; 
						this.mMoveWallPosArray_Start1[i].m_vStart.y =  fEndY;
						}
				}
				
				for( var i = 0; i<this.mMoveWallPosArray_End1.length; i++ )
				{
			 			var ab = mMathClass.ClosestPointOnLine2( fEndX, fEndY,
																 this.mMoveWallPosArray_End1[i].m_vEnd.x,
																 this.mMoveWallPosArray_End1[i].m_vEnd.y,
																 this.mMoveWallPosArray_End1[i].m_vStart.x,
																 this.mMoveWallPosArray_End1[i].m_vStart.y, 
																 0.1 );
					  if( ab[0] == 3)	// 判断是否在同一直线上
					  {							
						this.mMoveWallPosArray_End1[i].m_vEnd.x   =  fEndX;  
						this.mMoveWallPosArray_End1[i].m_vEnd.y   =  fEndY; 
						}
				}				

				mHelpClass.OnShowHelpWall(this.m_pMoveWall);
				this.m_pMoveWall.OnMoveWall(mouseX,mouseY);
				
				for( var i = 0; i< this.mWallArray.length; i++ )
					this.mWallArray[i].OnRender1();
				
				scene.remove(this.mHelpWall);		// 帮助墙体
				this.OnClearLastWall();	
				this.OnClearRenderLine();
			//	mHouseClass.mFloorClass.OnClear();
				this.OnUpdateRenderWall();		// 重新绘制整个户型
				mHouseClass.OnClearWallTop();
				mHouseClass.mFloorClass.OnUpdateFloor(this.solution_paths, this.iMaxAreaFloor);
			}				
		};
		//===================================================================================
		
		// 拾取墙体
		this.OnPick2D = function(mouseX, mouseY)
		{
			if( mFloorCameraClass.m_bShowAllRoom == false )		// 不是显示所有房间, 则不进行当前操作
					return null;
				
			//mHelpClass.mHelpWall.visible = false;
			var ab = this.CheckPosOnLine(mouseX,mouseY);			
			if( ab[0] !=0 )
			{				
				mHelpClass.OnShowHelpWall(this.mWallArray[ab[4]]);
				return this.mWallArray[ab[4]];
			}
			return null;
		};
		
			
		// 所有墙体得到实际墙体边线
		this.OnUpdateWallRenderLine = function()
		{				
			if( this.solution_paths == null)
			   return;
			for(k= 0; k< this.solution_paths.length; k++)
			{
				for(j = 0; j < this.solution_paths[k].length-1; j++)
    		{   
    			var vCenter = new THREE.Vector3();
    			vCenter.x = ( this.solution_paths[k][j].X+ this.solution_paths[k][j+1].X )/2;
					vCenter.y = ( this.solution_paths[k][j].Y+ this.solution_paths[k][j+1].Y )/2;
					vCenter.z = 0;
			
					for( var i = 0; i< this.mWallArray.length; i++ )
					{	
						// 判断到中心点的距离
						var ab = mMathClass.ClosestPointOnLine1(this.mWallArray[i].m_LastLineArray[0].x,
																									  this.mWallArray[i].m_LastLineArray[0].y,
																									  this.mWallArray[i].m_LastLineArray[1].x,
																									  this.mWallArray[i].m_LastLineArray[1].y,vCenter.x, vCenter.y,  5);
						if( ab[0] == 3 )
						{
							this.mWallArray[i].m_LastLineArray[0].x = this.solution_paths[k][j].X;
							this.mWallArray[i].m_LastLineArray[0].y = this.solution_paths[k][j].Y;
							
							this.mWallArray[i].m_LastLineArray[1].x = this.solution_paths[k][j+1].X;
							this.mWallArray[i].m_LastLineArray[1].y = this.solution_paths[k][j+1].Y;	
							continue;
						}
						
						var ab = mMathClass.ClosestPointOnLine1(this.mWallArray[i].m_LastLineArray[2].x,
																									  this.mWallArray[i].m_LastLineArray[2].y,
																									  this.mWallArray[i].m_LastLineArray[3].x,
																									  this.mWallArray[i].m_LastLineArray[3].y,vCenter.x, vCenter.y,  5);
						if( ab[0] == 3 )
						{
							this.mWallArray[i].m_LastLineArray[2].x = this.solution_paths[k][j].X;
							this.mWallArray[i].m_LastLineArray[2].y = this.solution_paths[k][j].Y;
								
							this.mWallArray[i].m_LastLineArray[3].x = this.solution_paths[k][j+1].X;
							this.mWallArray[i].m_LastLineArray[3].y = this.solution_paths[k][j+1].Y;	
							continue;
						}		
					}
    		}
    		
    		//======================================================================================
    			var vCenter = new THREE.Vector3();
    			vCenter.x = ( this.solution_paths[k][j-1].X+ this.solution_paths[k][0].X )/2;
					vCenter.y = ( this.solution_paths[k][j-1].Y+ this.solution_paths[k][0].Y )/2;
					vCenter.z = 0;
			
					for( var i = 0; i< this.mWallArray.length; i++ )
					{						  	
						var ab = mMathClass.ClosestPointOnLine1(this.mWallArray[i].m_LastLineArray[0].x,
																									  this.mWallArray[i].m_LastLineArray[0].y,
																									  this.mWallArray[i].m_LastLineArray[1].x,
																									  this.mWallArray[i].m_LastLineArray[1].y,vCenter.x, vCenter.y,  5);
						if( ab[0] == 3 )
						{
							this.mWallArray[i].m_LastLineArray[0].x = this.solution_paths[k][j-1].X;
							this.mWallArray[i].m_LastLineArray[0].y = this.solution_paths[k][j-1].Y;
							
							this.mWallArray[i].m_LastLineArray[1].x = this.solution_paths[k][0].X;
							this.mWallArray[i].m_LastLineArray[1].y = this.solution_paths[k][0].Y;	
							continue;
						}
						
						var ab = mMathClass.ClosestPointOnLine1(this.mWallArray[i].m_LastLineArray[2].x,
																									  this.mWallArray[i].m_LastLineArray[2].y,
																									  this.mWallArray[i].m_LastLineArray[3].x,
																									  this.mWallArray[i].m_LastLineArray[3].y,vCenter.x, vCenter.y,  5);
						if( ab[0] == 3 )
						{
							this.mWallArray[i].m_LastLineArray[2].x = this.solution_paths[k][j-1].X;
							this.mWallArray[i].m_LastLineArray[2].y = this.solution_paths[k][j-1].Y;
								
							this.mWallArray[i].m_LastLineArray[3].x = this.solution_paths[k][0].X;
							this.mWallArray[i].m_LastLineArray[3].y = this.solution_paths[k][0].Y;	
							continue;
						}		
					}
			}
			
			for( var i = 0; i< this.mWallArray.length; i++ )
			{				
				var tWall = this.mWallArray[i];
				var fLength1 = Math.sqrt(( tWall.m_LastLineArray[2].x-tWall.m_LastLineArray[1].x)*(tWall.m_LastLineArray[2].x-tWall.m_LastLineArray[1].x)
								 								 +(tWall.m_LastLineArray[2].y-tWall.m_LastLineArray[1].y)*(tWall.m_LastLineArray[2].y-tWall.m_LastLineArray[1].y) 
																 +0);
									
				var fLength2 = Math.sqrt(( tWall.m_LastLineArray[3].x-tWall.m_LastLineArray[1].x)*(tWall.m_LastLineArray[3].x-tWall.m_LastLineArray[1].x)
							 	 								 +(tWall.m_LastLineArray[3].y-tWall.m_LastLineArray[1].y)*(tWall.m_LastLineArray[3].y-tWall.m_LastLineArray[1].y) 
																 +0);
																 
				if(fLength1>fLength2){
					var x1 = tWall.m_LastLineArray[3].x;
					var y1 = tWall.m_LastLineArray[3].y;
					
					tWall.m_LastLineArray[3].x = tWall.m_LastLineArray[2].x;
					tWall.m_LastLineArray[3].y = tWall.m_LastLineArray[2].y;
					
					tWall.m_LastLineArray[2].x = x1;
					tWall.m_LastLineArray[2].y = y1;						
				}																 
			}
		};

		// 显示标注尺寸
		this.OnShowLabel = function(bShow)
		{
			mHouseClass.mFloorClass.OnShowLabel(bShow);	// 户型尺寸
		};
		
		// 增加墙体
		this.OnAddWall = function(x1,y1,x2,y2)
		{
			var tWall  = new WallData();
					tWall.OnInit(x1,y1,0);
					tWall.m_vEnd.x = x2;
					tWall.m_vEnd.y = y2;
					tWall.OnRender();
					this.mWallArray.push(tWall);
		};
		
		this.EditWall = function( fValue )
		{
			
			if( this.m_pCurWall )  
			{  
				if( fValue == 0 )          
					return;  
				if(	this.m_pCurWall.m_vStart.equals( this.m_pCurWall.m_vEnd ) == true)
					return;
				
				var edge1 = new THREE.Vector3;
				edge1.x = this.m_pCurWall.m_vEnd.x - this.m_pCurWall.m_vStart.x;	// 旋转弧度
				edge1.y = this.m_pCurWall.m_vEnd.y - this.m_pCurWall.m_vStart.y;
				edge1.z = this.m_pCurWall.m_vEnd.z - this.m_pCurWall.m_vStart.z;
				
				if( Math.abs(edge1.x) < 0.001 )							// 接近0时处理, 确保角度正确
					edge1.x = 0.0;
				if( Math.abs(edge1.y) < 0.001 )   
					edge1.y = 0.0;  
				
				var fRotate;
				if( edge1.x == 0.0 && edge1.y == 0.0)					// atanf(0/0)输出乱值
					fRotate = 0.0;
				else
					fRotate = Math.atan(edge1.y/edge1.x);	
				
				if( Math.abs(fRotate) < 0.001 && (this.m_pCurWall.m_vEnd.x - this.m_pCurWall.m_vStart.x)< 0)	
					fRotate = Math.PI;
				
				var degree = fRotate*180/Math.PI;				// 当前角度
				
				if( this.m_pCurWall.m_vEnd.y < this.m_pCurWall.m_vStart.y  && degree>0 )
				//	degree = degree+180;
					fRotate = fRotate+Math.PI;
				
				if( this.m_pCurWall.m_vEnd.y > this.m_pCurWall.m_vStart.y  && degree<0 )
				//	degree = degree+180;
					fRotate = fRotate+Math.PI;
				
				var fLength  =  fValue/10;    
				
				var axisZ 		= new THREE.Vector3(0,0,1);

				var tmpMatrix1 = new THREE.Matrix4().makeTranslation( -this.m_pCurWall.m_vStart.x, -this.m_pCurWall.m_vStart.y, -this.m_pCurWall.m_vStart.z );
				var tmpMatrix2 = new THREE.Matrix4().makeRotationZ(fRotate);
				var tmpMatrix3 = new THREE.Matrix4().makeTranslation(  this.m_pCurWall.m_vStart.x,  this.m_pCurWall.m_vStart.y,  this.m_pCurWall.m_vStart.z );
				tmpMatrix2.multiply(tmpMatrix1);
				tmpMatrix3.multiply(tmpMatrix2);			
				
				var vPos= new THREE.Vector3( this.m_pCurWall.m_vStart.x + fLength, this.m_pCurWall.m_vStart.y, this.m_pCurWall.m_vStart.z );
				
				this.m_pCurWall.m_vEnd = vPos.applyMatrix4(tmpMatrix3);
				this.m_pCurWall.OnRender();
				this.mWallArray.push(this.m_pCurWall);	
				
				var pNewLine  = new WallData();
				if(m_cPenType == 1)	
				   pNewLine.OnInit(this.m_pCurWall.m_vEnd.x,this.m_pCurWall.m_vEnd.y,0);
				else
				   pNewLine.OnInit(this.m_pCurWall.m_vEnd.x,this.m_pCurWall.m_vEnd.y,1);
				
				pNewLine.OnRender();
				this.m_pCurWall = pNewLine;
					
				for( var i = 0; i< this.mWallArray.length; i++ ){
					this.mWallArray[i].OnShow(false);
				}
				this.OnUpdateAllWall();		// 重新绘制整个户型
				mHelpClass.mHelpCoss.position.x = this.m_pCurWall.m_vEnd.x;
				mHelpClass.mHelpCoss.position.y = this.m_pCurWall.m_vEnd.y;	
			}
		};


		/**
		 * @api EditWallCoord(fValue,fDegree)
		 * @apiGroup WallClass
		 * @apiDescription 按键盘方向键生成墙体
		 * @apiParam (参数) fValue 长度
		 * @apiParam (参数) fDegree 旋转角度
		 */
		this.EditWallCoord =function(fValue, fDegree )
		{
			if( this.m_pCurWall )  
			{  
				if( fValue == 0 )          
					return;  
				
				var fLength  =  fValue/10;    
				
				var axisZ 		= new THREE.Vector3(0,0,1);
				
				var tmpMatrix1 = new THREE.Matrix4().makeTranslation( -this.m_pCurWall.m_vStart.x, -this.m_pCurWall.m_vStart.y, -this.m_pCurWall.m_vStart.z );
				var tmpMatrix2 = new THREE.Matrix4().makeRotationZ(fDegree*Math.PI/180);
				var tmpMatrix3 = new THREE.Matrix4().makeTranslation(  this.m_pCurWall.m_vStart.x,  this.m_pCurWall.m_vStart.y,  this.m_pCurWall.m_vStart.z );
				tmpMatrix2.multiply(tmpMatrix1);
				tmpMatrix3.multiply(tmpMatrix2);	
				
				var vPos= new THREE.Vector3( this.m_pCurWall.m_vStart.x + fLength, this.m_pCurWall.m_vStart.y, this.m_pCurWall.m_vStart.z );
				
				this.m_pCurWall.m_vEnd = vPos.applyMatrix4(tmpMatrix3);
				this.m_pCurWall.OnRender(); 
				
				mHelpClass.mHelpCoss.position.x = this.m_pCurWall.m_vEnd.x;
				mHelpClass.mHelpCoss.position.y = this.m_pCurWall.m_vEnd.y;	
				
				//世界坐标转屏幕坐标
				//============================================================================================
		        var worldVector = new THREE.Vector3(
		            this.m_pCurWall.m_vEnd.x,
		            this.m_pCurWall.m_vEnd.y,
		            this.m_pCurWall.m_vEnd.z
		            );
		        var standardVector = worldVector.project(mCameraClass.m_Camera);//世界坐标转标准设备坐标
		        var a = window.innerWidth / 2;
		        var b = window.innerHeight / 2;
		        var x = Math.round(standardVector.x * a + a);//标准设备坐标转屏幕坐标
		        var y = Math.round(-standardVector.y * b + b);//标准设备坐标转屏幕坐标
		        /**
		         * 更新立方体元素位置
		         */
				div1=document.getElementById("mEditBar");
				div1.style.left= x+10+'px';
				div1.style.top= y-23+'px';		        
			}
		};
	
	/**
	 * @api OnKeyDown(iKey)
	 * @apiDescription 墙体键盘操作函数
	 * @apiGroup WallClass
	 * @apiParam (参数) iKey 键盘按键值                         
	 */		
	this.OnKeyDown = function(iKey)
	{
		//键盘操作
		if(this.m_pCurWall== null&& this.m_pMoveWall== null)
			return false;
		
		if(m_cPenType == 1 || m_cPenType == 17)	// 创建墙体
		{
			var a=iKey;
			if( a == 46||a == 48||
				a == 49||a == 50||
				a == 51||a == 52||
				a == 53||a == 54||
				a == 55||a == 56||
				a == 57)
			{
				var strText = $("#mEditWall").val();
				if(strText.length<5)
				{
				   strText +=String.fromCharCode(a);
				   $("#mEditWall").val(strText);
				}  
			}
						
			switch( a )
			{
				case 17:	//Ctrl
					{
						if(this.m_pCurWall && m_cPenType == 17)	
		   	 			 this.m_pCurWall.OnChangeType();		// 改变墙体类型
					}
					break;
				case 8:		// 后退
					{
						var strText = $("#mEditWall").val();
							strText = strText.slice(0,strText.length-1);
						$("#mEditWall").val(strText);						
					}
					break;
				case 13:		// 回车
					{
						var strText = $("#mEditWall").val();
						if( strText<30)
							return;
						this.EditWall(strText);	// 回车生成墙体
						$("#mEditWall").val(null);
						container.focus();						
					}
					break;
				case 37: // 左
					this.EditWallCoord(1000,180);
					break;
				case 39: // 右
					this.EditWallCoord(1000,0);
					break;
				case 38: // 上
					this.EditWallCoord(1000,90);
					break;
				case 40: // 下
					this.EditWallCoord(1000,270);
					break;
			}
			
		}
	
		if(iKey == 46)
		{
			if(this.m_pCurWall)
		   	 this.OnDelete(this.m_pCurWall);
		   this.m_pCurWall = null;
		   
		  if(this.m_pMoveWall) 
		   	 this.OnDelete(this.m_pMoveWall);
		   this.m_pMoveWall = null;
		  this.OnUpdateAllWall();
		  
		}	
		return true;
	};
}