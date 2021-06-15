/**
 * @api WindowClass
 * @apiGroup WindowClass
 * @apiName  0
 * @apiDescription 窗操作类
 * @apiParam (成员变量) mWindowArray 文字内容
 */
function WindowClass()
{
	  this.mWindowArray = new Array();
		this.m_pCurWindow = null;
		this.mCurMouseX;
		this.mCurMouseY;

		// 操控帮助界面(不用保存)
		//====================================================================
		this.m_HelpBox;
		this.m_HelpPos1;
		this.m_HelpPos2;
		this.m_HelpPos1_Pick = false;	// 拉动拾取点1
		this.m_HelpPos2_Pick = false; // 拉动拾取点2
		this.m_pCurWall = null;				// 窗户所在墙体
		this.m_LineLeft_Box;				
		this.m_LineRight_Box;
		this.m_LineCenter_Box;
		this.m_LineLeft_Label;
		this.m_LineRight_Label;
		this.m_LineCenter_Label;
		this.m_LineLeft;
		this.m_LineRight;
		this.m_LineCenter;
		this.g_GaiLiQiangJuLi;
		this.m_LineLeft_Box;
		this.m_LineTop_Box;
		this.m_LineCenter_Box;
		
		this.m_LineLeft_Box1;
		this.m_LineTop_Box1;
		this.m_LineCenter_Box1;	
		
		this.m_strLeft_Value;
		this.m_strRight_Value;
		this.m_strCenter_Value;	
		this.m_fLeftOld;
		this.m_fRightOld;
		this.m_fCenterOld;
	
		//=====================================================================
		this.OnInit = function()
		{
					
			var result_poly = new THREE.Geometry();					
			result_poly.vertices.push(new THREE.Vector3(-0.5, -0.5, 1), new THREE.Vector3(-0.5, 0.5, 1));				
			result_poly.vertices.push(new THREE.Vector3( 0.5,  0.5, 1), new THREE.Vector3( 0.5,-0.5, 1));	
			result_poly.vertices.push(new THREE.Vector3(-0.5, -0.5, 1));					
			this.m_HelpBox = new THREE.Line( result_poly, new THREE.LineBasicMaterial( { color: 0x00A2E8, linewidth:15, opacity: 1 } ) );
			scene.add(this.m_HelpBox);	
			
			var sphere 				 = new THREE.CircleGeometry( 9,9 );
			var BlueMaterial   = new THREE.LineBasicMaterial({ color: 0x0000ff });			
			this.m_HelpPos1 = new THREE.Mesh( sphere, new THREE.PointsMaterial( {color: 0xffffff } ) );
			this.m_HelpPos2 = new THREE.Mesh( sphere, new THREE.PointsMaterial( {color: 0xffffff } ) );
			this.m_HelpPos1.add(new THREE.Line(sphere, BlueMaterial));
			this.m_HelpPos2.add(new THREE.Line(sphere, BlueMaterial));
			scene.add(this.m_HelpPos1);
			scene.add(this.m_HelpPos2);		
			
			// 尺寸标注
			var geometry1 = new THREE.Geometry();
					geometry1.vertices.push( new THREE.Vector3( 0,0, 1 ), new THREE.Vector3( 0,0, 1 ));
			var geometry2 = new THREE.Geometry();
					geometry2.vertices.push( new THREE.Vector3( 0,0, 1 ), new THREE.Vector3( 0,0, 1 ));
			var geometry3 = new THREE.Geometry();
					geometry3.vertices.push( new THREE.Vector3( 0,0, 1 ), new THREE.Vector3( 0,0, 1 ));
			var geometry4 = new THREE.Geometry();
					geometry4.vertices.push( new THREE.Vector3( 0,0, 1 ), new THREE.Vector3( 0,0, 1 ));	
			this.m_LineLeft 	= new THREE.LineSegments( geometry1, new THREE.LineBasicMaterial( { color: 0xAAAAAA, opacity: 1, linewidth:0.8 } ) );
			this.m_LineRight	= new THREE.LineSegments( geometry2, new THREE.LineBasicMaterial( { color: 0xAAAAAA, opacity: 1, linewidth:0.8 } ) );
			this.m_LineCenter = new THREE.LineSegments( geometry3, new THREE.LineBasicMaterial( { color: 0xAAAAAA, opacity: 1, linewidth:0.8 } ) );
					
			scene.add(this.m_LineLeft);
			scene.add(this.m_LineRight);
			scene.add(this.m_LineCenter);			
			
			this.OnHideCtrl();	// 隐藏操控
			
		};
		
		this.OnShowAll = function(bShow)
		{
			for(var j = 0; j<this.mWindowArray.length; j++)
				this.mWindowArray[j].m_Object.visible = bShow;		
		};		
		
		this.CreateWindow = function(a)
		{
			if( IsContain(container, renderer2.domElement ) != false )
			{
				alert("请到2D下操作.");
				return;
			}
			OnMouseRightUp();
			m_cPenType = 3;
			this.m_pCurWindow = new WindowData();
			this.m_pCurWindow.OnInit(a,-1);	
		};
		
		/**
		 * @api OnClear()
		 * @apiGroup WindowClass 
		 * @apiDescription 清空所有窗 
		 */			
		this.OnClear = function()
		{
			this.OnHideCtrl();
			for( var i=0; i<this.mWindowArray.length; i++ )
			{
				this.mWindowArray[i].OnClear();
			}
			this.mWindowArray.length = 0;
			this.m_pCurWindow = null;
		};
		
		this.OnUpdate3D = function()
		{
			for( var i = 0; i< this.mWindowArray.length; i++ )
				this.mWindowArray[i].OnUpdate3D();
		};
		
		this.DrawWindow  = function()
		{								
			if( true == this.OnMouseMove(g_mouseX,g_mouseY) )
			{
				this.mWindowArray.push(this.m_pCurWindow);
				this.m_pCurWindow = null;					
				m_cPenType = 0;
			}
		};
						
		// 平面上移动
		this.OnMouseMove = function(mouseX,mouseY)
		{
			if( this.m_pCurWindow == null )
				return false;	
			for( var i = 0; i< mHouseClass.mWallClass.mWallArray.length; i++ )
			{
					var aa = mHouseClass.mWallClass.mWallArray[i].DeDaoZhongXian();		
					var ab = mMathClass.ClosestPointOnLine1(aa[0].x,aa[0].y,aa[1].x,aa[1].y,mouseX,mouseY, 20);		//距离20 吸附											 
					if( ab[0] != 0 )
					{
							this.m_pCurWindow.m_fRotate = mMathClass.GetLineRotate(
																mHouseClass.mWallClass.mWallArray[i].m_vStart.x,
									 							mHouseClass.mWallClass.mWallArray[i].m_vStart.y,
									 							mHouseClass.mWallClass.mWallArray[i].m_vEnd.x,
									 							mHouseClass.mWallClass.mWallArray[i].m_vEnd.y);
									 					
							if(this.m_pCurWindow.m_fLength>mHouseClass.mWallClass.mWallArray[i].m_fLength)
							{
								//this.m_pCurWindow.m_fLength2 = this.m_pCurWindow.m_fLength;		// 备份上次
								this.m_pCurWindow.m_fLength  = mHouseClass.mWallClass.mWallArray[i].m_fLength-30;
							}
							
							this.m_pCurWindow.m_vPos.x = ab[1];
							this.m_pCurWindow.m_vPos.y = ab[2];
							if(this.m_pCurWindow.m_iStyle != 2)	//飘窗
								this.m_pCurWindow.m_fWidth = 24;
							this.m_pCurWindow.OnMouseMove(this.m_pCurWindow.m_vPos.x,this.m_pCurWindow.m_vPos.y, 0,
															this.m_pCurWindow.m_fRotate,mHouseClass.mWallClass.mWallArray[i].m_fWidth);
							return true;
					}				
			}
			/*						 
			var ab = mHouseClass.mWallClass.CheckPosOnLine1(mouseX,mouseY);
			if( ab[0] !=0 )
			{
					var i = ab[4];
					this.m_pCurWindow.m_fRotate = mMathClass.GetLineRotate(
														mHouseClass.mWallClass.mWallArray[i].m_vStart.x,
							 							mHouseClass.mWallClass.mWallArray[i].m_vStart.y,
							 							mHouseClass.mWallClass.mWallArray[i].m_vEnd.x,
							 							mHouseClass.mWallClass.mWallArray[i].m_vEnd.y);
							 					
					if(this.m_pCurWindow.m_fLength>mHouseClass.mWallClass.mWallArray[i].m_fLength)
					{
						//this.m_pCurWindow.m_fLength2 = this.m_pCurWindow.m_fLength;		// 备份上次
						this.m_pCurWindow.m_fLength  = mHouseClass.mWallClass.mWallArray[i].m_fLength-30;
					}
					
					this.m_pCurWindow.m_vPos.x = ab[1];
					this.m_pCurWindow.m_vPos.y = ab[2];
					if(this.m_pCurWindow.m_iStyle != 2)	//飘窗
						this.m_pCurWindow.m_fWidth = 24;
					this.m_pCurWindow.OnMouseMove(this.m_pCurWindow.m_vPos.x,this.m_pCurWindow.m_vPos.y, 0,
													this.m_pCurWindow.m_fRotate,mHouseClass.mWallClass.mWallArray[i].m_fWidth);
					return true;
			}				
			*/
			this.m_pCurWindow.OnMouseMove(mouseX,mouseY, 0,0,this.m_pCurWindow.m_fWidth);
			return false;
		};
		
		/**
		 * @api OnMouseRightUp2D()
		 * @apiGroup WindowClass 
		 * @apiDescription 2D下鼠标右键释放 
		 */	
		this.OnMouseRightUp2D = function()
		{
			if(this.m_pCurWindow && m_cPenType ==3)
				this.OnDelete(this.m_pCurWindow);		
			
			this.m_pCurWindow = null;
			
			for(var j=0; j<this.mWindowArray.length; j++)
				this.mWindowArray[j].m_RenderWin2D.material.color.set(mResource.mColor);	
				
			this.OnHideCtrl();
		};

		/**
		 * @api OnDelete(tWindow)
		 * @apiGroup WindowClass 
		 * @apiDescription 删除指定的窗户
		 */	
		this.OnDelete = function(tWindow)
		{			
			this.OnHideCtrl();
			tWindow.OnClear();
			var iIndex = this.mWindowArray.indexOf(tWindow);
			if( iIndex == -1 )
				return;
			this.mWindowArray.splice(iIndex,1);
		};
				

		/**
		 * @api OnShowHelp(mouseX,mouseY)
		 * @apiGroup WindowClass 
		 * @apiDescription 2D鼠标移动上去显示高亮
		 * @apiParam (参数) mouseX 鼠标X坐标
		 * @apiParam (参数) mouseY 鼠标Y坐标
		 */			
		this.OnShowHelp = function(mouseX, mouseY)
		{			
			$('#container' ).css("cursor","default");
		
			if(this.m_LineLeft_Box != undefined && this.m_LineLeft_Box != null)
			   this.m_LineLeft_Box.material.color.set(0x0088F8);
			if(this.m_LineRight_Box!= undefined && this.m_LineRight_Box != null)
			   this.m_LineRight_Box.material.color.set(0x0088F8);
			if(this.m_LineCenter_Box  != undefined && this.m_LineCenter_Box != null)   
			   this.m_LineCenter_Box.material.color.set(0x0088F8);

				
			for(var j=0; j<this.mWindowArray.length; j++)
				this.mWindowArray[j].m_RenderWin2D.material.color.set(mResource.mColor);	
				
			for( var j=0; j<this.mWindowArray.length; j++)
			{
				var Intersections = raycaster.intersectObject(  this.mWindowArray[j].m_RenderData2D );
				for( var i = 0; i< Intersections.length ; i++)
				{				
						mHouseClass.mWallClass.OnHideWall();
						scene.remove(mHouseClass.mWallClass.mHelpWall);		// 地面
						this.mWindowArray[j].OnShowHelp();
						return this.mWindowArray[j];
				}				
			}		
			
			// 选中尺寸标注
			var Intersections;
			if(this.m_LineLeft_Box != undefined && this.m_LineLeft_Box != null)
			{
				Intersections = raycaster.intersectObject(  this.m_LineLeft_Box1 );
				if(Intersections.length>0)
				{		
					$('#container' ).css("cursor","text");					
					this.m_LineLeft_Box.material.color.set(0xffff88);
					return this.m_LineLeft_Box;
				}	
			}
			if(this.m_LineRight_Box!= undefined && this.m_LineRight_Box != null)
			{
				Intersections = raycaster.intersectObject(  this.m_LineRight_Box1 );
				if(Intersections.length>0)
				{		
					$('#container' ).css("cursor","text");					
					this.m_LineRight_Box.material.color.set(0xffff88);
					return this.m_LineRight_Box;
				}
			}
			if(this.m_LineCenter_Box  != undefined && this.m_LineCenter_Box != null) 
			{
				Intersections = raycaster.intersectObject(  this.m_LineCenter_Box1 );
				if(Intersections.length>0)
				{		
					$('#container' ).css("cursor","text");					  
					this.m_LineCenter_Box.material.color.set(0xffff88);
					return this.m_LineCenter_Box;
				}
			}
			
			return null;
		};
		
		/**
		 * @api OnHideCtrl()
		 * @apiGroup WindowClass 
		 * @apiDescription 隐藏控制
		 */			
		this.OnHideCtrl = function()
		{
			this.m_HelpBox.position.x  = -99999;			
			this.m_HelpBox.position.y  = -99999;
			this.m_HelpPos1.position.x = -99999;
			this.m_HelpPos1.position.y = -99999;
			this.m_HelpPos2.position.x = -99999;
			this.m_HelpPos2.position.y = -99999;
			
			this.m_HelpPos1_Pick 		= false;
			this.m_HelpPos2_Pick 		= false;
			
			this.m_LineLeft.visible   = false;
			this.m_LineRight.visible  = false;
			this.m_LineCenter.visible = false;					
		};
		

		/**
		 * @api OnShowCtrl(tWindow)
		 * @apiGroup WindowClass 
		 * @apiDescription 在指定的窗显示操作辅助
		 * @apiParam (参数) tWindow 指定的窗
		 * 
		 */			
		this.OnShowCtrl = function(tWindow)
		{
			mHelpClass.ClearOutline();
			this.m_HelpBox.geometry.vertices.length = 0;		
			this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(-tWindow.m_fLength/2, -tWindow.m_fWidth/2, 1.5), new THREE.Vector3(-tWindow.m_fLength/2, tWindow.m_fWidth/2, 1.5));				
			this.m_HelpBox.geometry.vertices.push(new THREE.Vector3( tWindow.m_fLength/2,  tWindow.m_fWidth/2, 1.5), new THREE.Vector3( tWindow.m_fLength/2,-tWindow.m_fWidth/2, 1.5));	
			this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(-tWindow.m_fLength/2, -tWindow.m_fWidth/2, 1.5));	
			this.m_HelpBox.geometry.verticesNeedUpdate = true;
			
			var tmpMatrix2= new THREE.Matrix4().makeRotationZ(tWindow.m_fRotate);
			var tmpMatrix3= new THREE.Matrix4().makeTranslation(tWindow.m_vPos.x,tWindow.m_vPos.y,1);
			tmpMatrix3.multiply(tmpMatrix2);
			this.m_HelpBox.rotation.z = 0;
			this.m_HelpBox.position.x = 0;			
			this.m_HelpBox.position.y = 0;
			this.m_HelpBox.position.z = 0;
			this.m_HelpBox.scale.x    = 1;
			this.m_HelpBox.scale.y    = 1;
			this.m_HelpBox.scale.z    = 1;
			this.m_HelpBox.matrixWorld.identity();
			this.m_HelpBox.matrix.identity();
			this.m_HelpBox.updateMatrixWorld(true);
			this.m_HelpBox.applyMatrix(tmpMatrix3);
			
			var pos1 = new THREE.Vector3(-tWindow.m_fLength/2, 0,1.7);
			pos1.applyMatrix4(tmpMatrix3);
			var pos2 = new THREE.Vector3( tWindow.m_fLength/2, 0,1.7);
			pos2.applyMatrix4(tmpMatrix3);
			this.m_HelpPos1.position.x = pos1.x;
			this.m_HelpPos1.position.y = pos1.y;
			this.m_HelpPos1.position.z = pos1.z;
			this.m_HelpPos2.position.x = pos2.x;
			this.m_HelpPos2.position.y = pos2.y;
			this.m_HelpPos2.position.z = pos2.z;
			
			this.UpdateLabel(tWindow);	
		};
		
		this.UpdateLabel = function(tWindow)
		{
			// 显示尺寸
			this.m_LineLeft.visible   = false;
			this.m_LineRight.visible  = false;
			this.m_LineCenter.visible = false;

			var tmpMatrix1 = new THREE.Matrix4().makeRotationZ(tWindow.m_fRotate);
			var tmpMatrix2 = new THREE.Matrix4().makeTranslation(tWindow.m_vPos.x,tWindow.m_vPos.y,1);
					tmpMatrix2.multiply(tmpMatrix1);

			var pos1 = new THREE.Vector3(-tWindow.m_fLength/2, -tWindow.m_fWidth/2-30,0);
					pos1.applyMatrix4(tmpMatrix2);	
			var pos2 = new THREE.Vector3( tWindow.m_fLength/2, -tWindow.m_fWidth/2-30,0);
					pos2.applyMatrix4(tmpMatrix2);
					
			var posStart1 = new THREE.Vector3(-tWindow.m_fLength/2, -tWindow.m_fWidth/2-25,0);
					posStart1.applyMatrix4(tmpMatrix2);	
			var posEnd1 = new THREE.Vector3(-tWindow.m_fLength/2, -tWindow.m_fWidth/2-35,0);
					posEnd1.applyMatrix4(tmpMatrix2);
					
			var posStart2 = new THREE.Vector3( tWindow.m_fLength/2, -tWindow.m_fWidth/2-25,0);
					posStart2.applyMatrix4(tmpMatrix2);
			var posEnd2 = new THREE.Vector3( tWindow.m_fLength/2, -tWindow.m_fWidth/2-35,0);
					posEnd2.applyMatrix4(tmpMatrix2);					
					
			var posLeft = new THREE.Vector3(-tWindow.m_fLength/2, -tWindow.m_fWidth/2,0);
					posLeft.applyMatrix4(tmpMatrix2);	
			var posRight = new THREE.Vector3( tWindow.m_fLength/2, -tWindow.m_fWidth/2,0);
					posRight.applyMatrix4(tmpMatrix2);					
			//更新到四边的距离
			//得到当前所在地面
			var vPos1 = new THREE.Vector3( pos1.x, pos1.y, 10 );
			var vNormal = new THREE.Vector3(0,0,-1);
			var raycaster1 = new THREE.Raycaster(vPos1,vNormal);
					raycaster1.linePrecision = 3;
	
			var tFloor = null;
			var tDis   =-99999;
			for(var j=0; j<mHouseClass.mFloorClass.mFloorArray.length; j++)
			{
				var Intersections;
				if(mHouseClass.mFloorClass.mFloorArray[j].mFloorMesh.visible == true)
				   Intersections = raycaster1.intersectObject(  mHouseClass.mFloorClass.mFloorArray[j].mFloorMesh );
				else
				   Intersections = raycaster1.intersectObject(  mHouseClass.mFloorClass.mFloorArray[j].mFloorMeshSVG );
				if( Intersections.length>=1)
				{
					if( tDis < mHouseClass.mFloorClass.mFloorArray[j].mfLayer)
					{
						tDis  = mHouseClass.mFloorClass.mFloorArray[j].mfLayer;
						tFloor= mHouseClass.mFloorClass.mFloorArray[j];
					}
				}			
			}
			
			if( tFloor == null )// 不显示尺寸
					return;
			tFloor.OnShowLabel(false);	//  隐藏地面尺寸
			
			var iLeft  = this.GetLiQiangJuLi(posLeft, tFloor);	// 得到左侧端点
			if( iLeft !=-1)
			{
					var tmpMatrix1 = new THREE.Matrix4().makeTranslation(0,0,0);
					var tmpMatrix2 = new THREE.Matrix4().makeRotationZ(tFloor.mLabelArray[iLeft].m_fRotate);
					var tmpMatrix3 = new THREE.Matrix4().makeTranslation(tFloor.mLabelArray[iLeft].m_fCenterX,tFloor.mLabelArray[iLeft].m_fCenterY,0);	
					tmpMatrix2.multiply(tmpMatrix1);
					tmpMatrix3.multiply(tmpMatrix2);				
				
					this.m_LineLeft.visible   = true;
					this.m_LineLeft.geometry.vertices.length 	= 0;
			
					var pos11 = new THREE.Vector3(-tFloor.mLabelArray[iLeft].m_fLength/2, -30, 0)
							pos11.applyMatrix4(tmpMatrix3);
					this.m_LineLeft.geometry.vertices.push(pos1, pos11);
					this.m_LineLeft.geometry.verticesNeedUpdate = true;		

					var fValue = pos1.distanceTo(pos11);
					this.m_fLeftOld  = fValue;
					// 文字
					//=============================================================================================
					this.m_LineLeft.remove(this.m_LineLeft_Label);
					this.m_strLeft_Value = parseInt(fValue).toString();
		
					// 左边数字
					var shapes = mHouseClass.mFont.generateShapes( this.m_strLeft_Value, 8 );
					var geometryText = new THREE.ShapeBufferGeometry( shapes );
						geometryText.computeBoundingBox();
					var tWidth = geometryText.boundingBox.max.x - geometryText.boundingBox.min.x;
					var tHeight= geometryText.boundingBox.max.y - geometryText.boundingBox.min.y;		
					geometryText.translate( - 0.5 * tWidth, -0.5*tHeight, 1.2 );
					this.m_LineLeft_Label = new THREE.Mesh( geometryText, mResource.mFontTex );
					
					var geometry  = new THREE.BoxBufferGeometry( tWidth+10, tHeight+10, 0);
					geometry.translate( 0, 0, 0.5 );
				  	this.m_LineLeft_Box1= new THREE.Mesh(geometry, new THREE.MeshBasicMaterial( { color: 0xeeeeee, opacity: 1.0, transparent: true } ) ); 
					var tPoly = new THREE.Geometry();					
					tPoly.vertices.push(new THREE.Vector3(-(tWidth+10)/2, -(tHeight+10)/2, 1), new THREE.Vector3(-(tWidth+10)/2, (tHeight+10)/2, 1));				
					tPoly.vertices.push(new THREE.Vector3( (tWidth+10)/2,  (tHeight+10)/2, 1), new THREE.Vector3( (tWidth+10)/2,-(tHeight+10)/2, 1));						
					tPoly.vertices.push(new THREE.Vector3(-(tWidth+10)/2, -(tHeight+10)/2, 1));
					this.m_LineLeft_Box = new THREE.Line( tPoly, new THREE.LineBasicMaterial( { color: 0x0088F8, linewidth:1, opacity: 1 } ) );
					this.m_LineLeft_Label.add(this.m_LineLeft_Box1);
					this.m_LineLeft_Label.add(this.m_LineLeft_Box);
					this.m_LineLeft_Label.position.x  = ( pos1.x+ pos11.x )/2;			
					this.m_LineLeft_Label.position.y  = ( pos1.y+ pos11.y )/2;				
					this.m_LineLeft.add(this.m_LineLeft_Label);						
			}
			
			var iRight  = this.GetLiQiangJuLi(posRight, tFloor);	// 得到右侧端点
			if( iRight !=-1)
			{
				
				var tmpMatrix1 = new THREE.Matrix4().makeTranslation(0,0,0);
				var tmpMatrix2 = new THREE.Matrix4().makeRotationZ(tFloor.mLabelArray[iRight].m_fRotate);
				var tmpMatrix3 = new THREE.Matrix4().makeTranslation(tFloor.mLabelArray[iRight].m_fCenterX,tFloor.mLabelArray[iRight].m_fCenterY,0);	
				tmpMatrix2.multiply(tmpMatrix1);
				tmpMatrix3.multiply(tmpMatrix2);				
				
				this.m_LineRight.visible   = true;
				this.m_LineRight.geometry.vertices.length 	= 0;
		
				var pos22 = new THREE.Vector3(tFloor.mLabelArray[iRight].m_fLength/2, -30, 0)
						pos22.applyMatrix4(tmpMatrix3);
				this.m_LineRight.geometry.vertices.push(pos2, pos22);
				this.m_LineRight.geometry.verticesNeedUpdate = true;	
				
				this.m_LineRight.remove(this.m_LineRight_Label);
				
				var fValue = pos2.distanceTo(pos22);			
				this.m_fRightOld = fValue;
				this.m_strRight_Value = parseInt(fValue).toString();
				
				// 右边数字
				//===========================================================================================================================
				var shapes1 = mHouseClass.mFont.generateShapes( this.m_strRight_Value, 8 );
				var geometryText1 = new THREE.ShapeBufferGeometry( shapes1 );
						geometryText1.computeBoundingBox();
				tWidth = geometryText1.boundingBox.max.x - geometryText1.boundingBox.min.x;
				tHeight= geometryText1.boundingBox.max.y - geometryText1.boundingBox.min.y;		
				geometryText1.translate( - 0.5 * tWidth, -0.5*tHeight, 1.2 );
				this.m_LineRight_Label = new THREE.Mesh( geometryText1, mResource.mFontTex );
				
				var geometry1  = new THREE.BoxBufferGeometry( tWidth+10, tHeight+10, 0);
				geometry1.translate( 0, 0, 0.5 );
			  	this.m_LineRight_Box1= new THREE.Mesh(geometry1, new THREE.MeshBasicMaterial( { color: 0xeeeeee, opacity: 1.0, transparent: true } ) ); 		
				var tPoly1 = new THREE.Geometry();					
				tPoly1.vertices.push(new THREE.Vector3(-(tWidth+10)/2, -(tHeight+10)/2, 1), new THREE.Vector3(-(tWidth+10)/2, (tHeight+10)/2, 1));				
				tPoly1.vertices.push(new THREE.Vector3( (tWidth+10)/2,  (tHeight+10)/2, 1), new THREE.Vector3( (tWidth+10)/2,-(tHeight+10)/2, 1));						
				tPoly1.vertices.push(new THREE.Vector3(-(tWidth+10)/2, -(tHeight+10)/2, 1));
				this.m_LineRight_Box = new THREE.Line( tPoly1, new THREE.LineBasicMaterial( { color: 0x0088F8, linewidth:1, opacity: 1 } ) );
				this.m_LineRight_Label.add(this.m_LineRight_Box);
				this.m_LineRight_Label.add(this.m_LineRight_Box1);
				this.m_LineRight_Label.position.x  = ( pos2.x+ pos22.x )/2;			
				this.m_LineRight_Label.position.y  = ( pos2.y+ pos22.y )/2;
				//===========================================================================================================================		
				this.m_LineRight.add(this.m_LineRight_Label);				
			}		

			this.m_LineCenter.visible   = true;
			this.m_LineCenter.geometry.vertices.length 	= 0;
			
			this.m_LineCenter.geometry.vertices.push(pos1, pos2);
			this.m_LineCenter.geometry.vertices.push(posStart1, posEnd1);
			this.m_LineCenter.geometry.vertices.push(posStart2, posEnd2);
			this.m_LineCenter.geometry.verticesNeedUpdate = true;	
			
			// 右边数字
			//===========================================================================================================================
			this.m_LineCenter.remove(this.m_LineCenter_Label);
			var fValue = pos1.distanceTo(pos2);
			this.m_strCenter_Value = parseInt(fValue).toString();
			var shapes1 = mHouseClass.mFont.generateShapes( this.m_strCenter_Value, 8 );
			var geometryText1 = new THREE.ShapeBufferGeometry( shapes1 );
					geometryText1.computeBoundingBox();
			tWidth = geometryText1.boundingBox.max.x - geometryText1.boundingBox.min.x;
			tHeight= geometryText1.boundingBox.max.y - geometryText1.boundingBox.min.y;		
			geometryText1.translate( - 0.5 * tWidth, -0.5*tHeight, 1.2 );
			this.m_LineCenter_Label = new THREE.Mesh( geometryText1, mResource.mFontTex );
			
			var geometry1  = new THREE.BoxBufferGeometry( tWidth+10, tHeight+10, 0);
			geometry1.translate( 0, 0, 0.5 );
		  	this.m_LineCenter_Box1= new THREE.Mesh(geometry1, new THREE.MeshBasicMaterial( { color: 0xeeeeee, opacity: 1.0, transparent: true } ) ); 		
			var tPoly1 = new THREE.Geometry();					
			tPoly1.vertices.push(new THREE.Vector3(-(tWidth+10)/2, -(tHeight+10)/2, 1), new THREE.Vector3(-(tWidth+10)/2, (tHeight+10)/2, 1));				
			tPoly1.vertices.push(new THREE.Vector3( (tWidth+10)/2,  (tHeight+10)/2, 1), new THREE.Vector3( (tWidth+10)/2,-(tHeight+10)/2, 1));						
			tPoly1.vertices.push(new THREE.Vector3(-(tWidth+10)/2, -(tHeight+10)/2, 1));
			this.m_LineCenter_Box = new THREE.Line( tPoly1, new THREE.LineBasicMaterial( { color: 0x0088F8, linewidth:1, opacity: 1 } ) );
			this.m_LineCenter_Label.add(this.m_LineCenter_Box);
			this.m_LineCenter_Label.add(this.m_LineCenter_Box1);
			this.m_LineCenter_Label.position.x  = ( pos1.x+ pos2.x )/2;			
			this.m_LineCenter_Label.position.y  = ( pos1.y+ pos2.y )/2;
			//===========================================================================================================================		
			this.m_LineCenter.add(this.m_LineCenter_Label);			
			
		};
		
		this.UpdateText = function(tFlue,fValue,iType)
		{
			// 只更新文字，不更新位置
			var box = new THREE.Box3();
				box.setFromObject( tFlue.m_RenderData2D );
			// 显示离墙距离		
			switch(iType)
			{
				case 0:
				{
					var fx = this.m_LineLeft_Label.position.x;
					var fy = this.m_LineLeft_Label.position.y;
					this.m_LineLeft.remove(this.m_LineLeft_Label);
					
					this.m_strLeft_Value = parseInt(fValue).toString();
	
					// 左边数字
					var shapes = mHouseClass.mFont.generateShapes( parseInt(fValue).toString(), 8 );
					var geometryText = new THREE.ShapeBufferGeometry( shapes );
						geometryText.computeBoundingBox();
					var tWidth = geometryText.boundingBox.max.x - geometryText.boundingBox.min.x;
					var tHeight= geometryText.boundingBox.max.y - geometryText.boundingBox.min.y;		
					geometryText.translate( - 0.5 * tWidth, -0.5*tHeight, 1.2 );
					this.m_LineLeft_Label = new THREE.Mesh( geometryText, mResource.mFontTex );
					
					var geometry  = new THREE.BoxBufferGeometry( tWidth+10, tHeight+10, 0);
					geometry.translate( 0, 0, 0.5 );
				  	this.m_LineLeft_Box1= new THREE.Mesh(geometry, new THREE.MeshBasicMaterial( { color: 0xeeeeee, opacity: 1.0, transparent: true } ) ); 
					var tPoly = new THREE.Geometry();					
					tPoly.vertices.push(new THREE.Vector3(-(tWidth+10)/2, -(tHeight+10)/2, 1), new THREE.Vector3(-(tWidth+10)/2, (tHeight+10)/2, 1));				
					tPoly.vertices.push(new THREE.Vector3( (tWidth+10)/2,  (tHeight+10)/2, 1), new THREE.Vector3( (tWidth+10)/2,-(tHeight+10)/2, 1));						
					tPoly.vertices.push(new THREE.Vector3(-(tWidth+10)/2, -(tHeight+10)/2, 1));
					this.m_LineLeft_Box = new THREE.Line( tPoly, new THREE.LineBasicMaterial( { color: 0x0088F8, linewidth:1, opacity: 1 } ) );
					this.m_LineLeft_Label.add(this.m_LineLeft_Box1);
					this.m_LineLeft_Label.add(this.m_LineLeft_Box);
					this.m_LineLeft_Label.position.x  = fx;			
					this.m_LineLeft_Label.position.y  = fy;				
					this.m_LineLeft.add(this.m_LineLeft_Label);
				}
				break;
				case 1:
				{
					var fx = this.m_LineRight_Label.position.x;
					var fy = this.m_LineRight_Label.position.y;				
					this.m_LineRight.remove(this.m_LineRight_Label);
					
					this.m_strRight_Value = parseInt(fValue).toString();
					
					// 右边数字
					//===========================================================================================================================
					var shapes1 = mHouseClass.mFont.generateShapes( parseInt(fValue).toString(), 8 );
					var geometryText1 = new THREE.ShapeBufferGeometry( shapes1 );
						geometryText1.computeBoundingBox();
					tWidth = geometryText1.boundingBox.max.x - geometryText1.boundingBox.min.x;
					tHeight= geometryText1.boundingBox.max.y - geometryText1.boundingBox.min.y;		
					geometryText1.translate( - 0.5 * tWidth, -0.5*tHeight, 1.2 );
					this.m_LineRight_Label = new THREE.Mesh( geometryText1, mResource.mFontTex );
					
					var geometry1  = new THREE.BoxBufferGeometry( tWidth+10, tHeight+10, 0);
					geometry1.translate( 0, 0, 0.5 );
				  	this.m_LineRight_Box1= new THREE.Mesh(geometry1, new THREE.MeshBasicMaterial( { color: 0xeeeeee, opacity: 1.0, transparent: true } ) ); 		
					var tPoly1 = new THREE.Geometry();					
					tPoly1.vertices.push(new THREE.Vector3(-(tWidth+10)/2, -(tHeight+10)/2, 1), new THREE.Vector3(-(tWidth+10)/2, (tHeight+10)/2, 1));				
					tPoly1.vertices.push(new THREE.Vector3( (tWidth+10)/2,  (tHeight+10)/2, 1), new THREE.Vector3( (tWidth+10)/2,-(tHeight+10)/2, 1));						
					tPoly1.vertices.push(new THREE.Vector3(-(tWidth+10)/2, -(tHeight+10)/2, 1));
					this.m_LineRight_Box = new THREE.Line( tPoly1, new THREE.LineBasicMaterial( { color: 0x0088F8, linewidth:1, opacity: 1 } ) );
					this.m_LineRight_Label.add(this.m_LineRight_Box);
					this.m_LineRight_Label.add(this.m_LineRight_Box1);
					this.m_LineRight_Label.position.x  = fx;			
					this.m_LineRight_Label.position.y  = fy;	
					//===========================================================================================================================		
					this.m_LineRight.add(this.m_LineRight_Label);
				}
				break;
				case 2:
				{
					var fx = this.m_LineCenter_Label.position.x;
					var fy = this.m_LineCenter_Label.position.y;				
					this.m_LineCenter.remove(this.m_LineCenter_Label);
					this.m_strCenter_Value = parseInt(fValue).toString();
							
					// 顶部数字
					//===========================================================================================================================
					var shapes2 = mHouseClass.mFont.generateShapes( parseInt(fValue).toString(), 8 );
					var geometryText2 = new THREE.ShapeBufferGeometry( shapes2 );
						geometryText2.computeBoundingBox();
					tWidth = geometryText2.boundingBox.max.x - geometryText2.boundingBox.min.x;
					tHeight= geometryText2.boundingBox.max.y - geometryText2.boundingBox.min.y;		
					geometryText2.translate( - 0.5 * tWidth, -0.5*tHeight, 1.2 );
					this.m_LineCenter_Label = new THREE.Mesh( geometryText2, mResource.mFontTex );
					
					var geometry2  = new THREE.BoxBufferGeometry( tWidth+10, tHeight+10, 0);
					geometry2.translate( 0, 0, 0.5 );
				  	this.m_LineCenter_Box1= new THREE.Mesh(geometry2, new THREE.MeshBasicMaterial( { color: 0xeeeeee, opacity: 1.0, transparent: true } ) ); 
					this.m_LineCenter_Label.add(this.m_LineCenter_Box1);
					
					var tPoly2 = new THREE.Geometry();					
					tPoly2.vertices.push(new THREE.Vector3(-(tWidth+10)/2, -(tHeight+10)/2, 1), new THREE.Vector3(-(tWidth+10)/2, (tHeight+10)/2, 1));				
					tPoly2.vertices.push(new THREE.Vector3( (tWidth+10)/2,  (tHeight+10)/2, 1), new THREE.Vector3( (tWidth+10)/2,-(tHeight+10)/2, 1));						
					tPoly2.vertices.push(new THREE.Vector3(-(tWidth+10)/2, -(tHeight+10)/2, 1));
					this.m_LineCenter_Box = new THREE.Line( tPoly2, new THREE.LineBasicMaterial( { color: 0x0088F8, linewidth:1, opacity: 1 } ) );
					this.m_LineCenter_Label.add(this.m_LineCenter_Box);
			
					this.m_LineCenter_Label.position.x  = fx;
					this.m_LineCenter_Label.position.y  = fy;	
					//===========================================================================================================================				
					this.m_LineCenter.add(this.m_LineCenter_Label);
				}
				break;
			}		
		};			
						
		this.GetLiQiangJuLi = function(pos, tFloor)
		{
		    for(var i = 0; i<tFloor.mLabelArray.length; i++)
		    {
		    	var sx = tFloor.mLabelArray[i].m_vStart_Floor.x;
		    	var sy = tFloor.mLabelArray[i].m_vStart_Floor.y; 
		    	var ex = tFloor.mLabelArray[i].m_vEnd_Floor.x;
		    	var ey = tFloor.mLabelArray[i].m_vEnd_Floor.y;
		    	
		    	var ab = mMathClass.ClosestPointOnLine1(sx, sy, ex, ey, pos.x, pos.y,1);
					if( ab[0] != 0 )
							return i;
		    }	
		    return -1;
		};	

		// 拾取HelpPos
		this.OnPick2D_CtrlPos = function(mouseX,mouseY)
		{	
			
			this.m_HelpPos1.material.color.set(0xffffff);
			this.m_HelpPos2.material.color.set(0xffffff);
			this.m_HelpPos1_Pick 		= false;
			this.m_HelpPos2_Pick 		= false;
						
			raycaster.setFromCamera( mouse, mCameraClass.m_Camera );		
			var Intersections = raycaster.intersectObject( this.m_HelpPos1, true );
			if (Intersections.length > 0) 				
			{
				this.m_HelpPos1.material.color.set(0xffff00);
				this.m_HelpPos1_Pick 		= true;
				this.mCurMouseX = mouseX;
				this.mCurMouseY = mouseY;	
				// 所在墙体
				for( var i = 0; i< mHouseClass.mWallClass.mWallArray.length; i++ )
				{	
						var aa = mHouseClass.mWallClass.mWallArray[i].DeDaoZhongXian();		
						var ab = mMathClass.ClosestPointOnLine1(aa[0].x,aa[0].y,aa[1].x,aa[1].y,this.m_HelpPos1.position.x,this.m_HelpPos1.position.y, 10);											 
						if( ab[0] != 0 )
						{
								this.m_pCurWall = mHouseClass.mWallClass.mWallArray[i];
								break;
						}				
				}				
				return true;
			}		
	
			var Intersections = raycaster.intersectObject( this.m_HelpPos2, true );
			if (Intersections.length > 0) 				
			{
				this.m_HelpPos2.material.color.set(0xffff00);
				this.m_HelpPos2_Pick 		= true;
				this.mCurMouseX = mouseX;
				this.mCurMouseY = mouseY;
				
				// 所在墙体
				for( var i = 0; i< mHouseClass.mWallClass.mWallArray.length; i++ )
				{
						var aa = mHouseClass.mWallClass.mWallArray[i].DeDaoZhongXian();		
						var ab = mMathClass.ClosestPointOnLine1(aa[0].x,aa[0].y,aa[1].x,aa[1].y,this.m_HelpPos2.position.x,this.m_HelpPos2.position.y, 10);																	 
						if( ab[0] != 0 )
						{
								this.m_pCurWall = mHouseClass.mWallClass.mWallArray[i];
								break;
						}				
				}				
				return true;
			}	
						
			return false;
		};
		
		// 拉伸窗户
		this.ScaleWindow = function(mouseX,mouseY,e)
		{
			if(e.buttons == 1 && this.m_pCurWindow != null)
			{			
				var axisZ 		= new THREE.Vector3(0,0,1);
				
				if(this.m_HelpPos1_Pick === true)
				{				
					var aa = this.m_pCurWall.DeDaoZhongXian();		
					var ab = mMathClass.ClosestPointOnLine1(aa[0].x,aa[0].y,aa[1].x,aa[1].y,
																									this.m_HelpPos1.position.x +mouseX-this.mCurMouseX,
																									this.m_HelpPos1.position.y +mouseY-this.mCurMouseY, 10);
					if( ab[0] != 0 )
					{

						var fLength = Math.sqrt( (ab[1]-this.m_HelpPos2.position.x)*(ab[1]-this.m_HelpPos2.position.x)
																		+(ab[2]-this.m_HelpPos2.position.y)*(ab[2]-this.m_HelpPos2.position.y)+0);
				
						this.m_pCurWindow.m_vPos.x = (ab[1]+this.m_HelpPos2.position.x)/2;
						this.m_pCurWindow.m_vPos.y = (ab[2]+this.m_HelpPos2.position.y)/2;
						this.m_pCurWindow.m_fLength=fLength;
						this.m_pCurWindow.OnMouseMove(this.m_pCurWindow.m_vPos.x,this.m_pCurWindow.m_vPos.y, 0,
																					this.m_pCurWindow.m_fRotate,this.m_pCurWindow.m_fWidth);
						this.OnShowCtrl(this.m_pCurWindow);							
						this.mCurMouseX = mouseX;
						this.mCurMouseY = mouseY;										
						return true;
					}				
				}				
				
				if(this.m_HelpPos2_Pick === true)
				{
					var aa = this.m_pCurWall.DeDaoZhongXian();		
					var ab = mMathClass.ClosestPointOnLine1(aa[0].x,aa[0].y,aa[1].x,aa[1].y,
																									this.m_HelpPos2.position.x +mouseX-this.mCurMouseX,
																									this.m_HelpPos2.position.y +mouseY-this.mCurMouseY, 10);	
					if( ab[0] != 0 )
					{
						var fLength = Math.sqrt( (ab[1]-this.m_HelpPos1.position.x)*(ab[1]-this.m_HelpPos1.position.x)
																		+(ab[2]-this.m_HelpPos1.position.y)*(ab[2]-this.m_HelpPos1.position.y)+0);
				
						this.m_pCurWindow.m_vPos.x = (ab[1]+this.m_HelpPos1.position.x)/2;
						this.m_pCurWindow.m_vPos.y = (ab[2]+this.m_HelpPos1.position.y)/2;
						this.m_pCurWindow.m_fLength=fLength;
						this.m_pCurWindow.OnMouseMove(this.m_pCurWindow.m_vPos.x,this.m_pCurWindow.m_vPos.y, 0,
																					this.m_pCurWindow.m_fRotate,this.m_pCurWindow.m_fWidth);
						this.OnShowCtrl(this.m_pCurWindow);						
						this.mCurMouseX = mouseX;
						this.mCurMouseY = mouseY;										
						return true;
					}					
				}	
			}
			return false;
		};
		
		// 选中窗户 返回选中的窗户
		this.OnPick2D = function(mouseX,mouseY){
				
			for( j=0; j<this.mWindowArray.length; j++)
			{
				var Intersections = raycaster.intersectObject(  this.mWindowArray[j].m_RenderData2D );
				for( var i = 0; i< Intersections.length ; i++)
				{		
					m_ParamWinDlg.ShowBar();
					return this.mWindowArray[j];
				}				
			}
			return null;
		};
		
		this.OnMouseDown_Window = function(mouseX,mouseY){
			
			// 点击输入数字区域,保持显示
			this.g_GaiLiQiangJuLi = this.OnShowHelp(mouseX,mouseY);
			if( (this.g_GaiLiQiangJuLi == this.m_LineLeft_Box ||
				this.g_GaiLiQiangJuLi == this.m_LineRight_Box ||
				this.g_GaiLiQiangJuLi == this.m_LineCenter_Box) && this.g_GaiLiQiangJuLi)
			{
				return true;
			}			

			this.m_pCurWindow = null;
			this.mCurMouseX = 0;
			this.mCurMouseY = 0;				

			for( var j=0; j<this.mWindowArray.length; j++)
			{
				var Intersections = raycaster.intersectObject(  this.mWindowArray[j].m_RenderData2D );
				for( var i = 0; i< Intersections.length ; i++)
				{						
						OnMouseRightUp();
						this.m_pCurWindow = this.mWindowArray[j];
						this.mCurMouseX = mouseX;
						this.mCurMouseY = mouseY;	
						this.OnShowCtrl(this.mWindowArray[j]);
						return true;
				}				
			}
				
			return false;
		};
		
		// 拖拽移动选中的窗户
		this.OnMouseMove_Window = function(mouseX,mouseY,e){

			if(e.buttons == 1 && this.m_pCurWindow != null)
			{									
				if( false ==this.OnMouseMove(mouseX,mouseY))
					this.OnHideCtrl();
				else
					this.OnShowCtrl(this.m_pCurWindow);
				this.mCurMouseX = mouseX;
				this.mCurMouseY = mouseY;	
				return true;
			}
			return false;
		};

		//保存窗数据
	    this.OnSave_XML = function()
		{
			let nWindowNum = this.mWindowArray.length;

		  let strWindowXML = `<WinInfo num="${nWindowNum}"/>`;

		  for(let index = 0; index < nWindowNum; ++index)
			{
				let windowInfo = this.mWindowArray[index];

				strWindowXML += `<WinData PosX="${windowInfo.m_vPos.x}" PosY="${windowInfo.m_vPos.y}" PosZ="${windowInfo.m_vPos.z}"
                                 Length="${windowInfo.m_fLength}" Width="${windowInfo.m_fWidth}" Height="${windowInfo.m_fHeight}" 
                                 Rotate="${windowInfo.m_fRotate}" Mode="${windowInfo.m_iMode}" Dist="${windowInfo.m_fHight}" 
                                 source="${windowInfo.m_strFile}" ModelType="3ds" type="${windowInfo.m_iStyle}" ReplaceMaterial="0" Material=""/>`;
			}

		    return strWindowXML;
		};
		

		
		this.OnCreateWindow =  function( tWinlineArray )
		{			
			var tMainLine;
			var MaxX = -99999;
			var MaxY = -99999;
			var MinX =  99999;
			var MinY =  99999;
				
			for( var i = 0; i< tWinlineArray.length; i++ )
			{
				if( MaxX < tWinlineArray[i].m_vCenter.x ) MaxX = tWinlineArray[i].m_vCenter.x;
				if( MaxY < tWinlineArray[i].m_vCenter.y ) MaxY = tWinlineArray[i].m_vCenter.y;
				
				if( MinX > tWinlineArray[i].m_vCenter.x ) MinX = tWinlineArray[i].m_vCenter.x;
				if( MinY > tWinlineArray[i].m_vCenter.y ) MinY = tWinlineArray[i].m_vCenter.y;
			}
			
	
			var fWidth = Math.sqrt((MaxX-MinX)*(MaxX-MinX)+(MaxY-MinY)*(MaxY-MinY));
			if( fWidth > 1000 )
				return;
			
				var tWin = new WindowData();
			  this.mWindowArray.push(tWin);
				index = this.mWindowArray.length-1;
				this.mWindowArray[index].OnInit(0,index);
					
				this.mWindowArray[index].m_fLength   = tWinlineArray[0].m_fLength;
				this.mWindowArray[index].m_fWidth    = fWidth+10;
				this.mWindowArray[index].m_fHeight   = 200;			
				this.mWindowArray[index].m_fRotate   = tWinlineArray[0].m_fRotate;
				this.mWindowArray[index].m_iMode     = 0;
				this.mWindowArray[index].m_fHight    = 50;
				this.mWindowArray[index].m_vPos.x = (MaxX+MinX)/2;
				this.mWindowArray[index].m_vPos.y = (MaxY+MinY)/2;
				this.mWindowArray[index].m_vPos.z = 0;
				this.mWindowArray[index].UpdateWindow();				
			
			
			for( var i = 0; i< tWinlineArray.length; i++ )
			{
				if(( Math.abs(MaxX - tWinlineArray[i].m_vCenter.x)<0.001 &&
				 	 Math.abs( MaxY - tWinlineArray[i].m_vCenter.y )<0.001 ) || 
				   (Math.abs( MinX - tWinlineArray[i].m_vCenter.x )<0.001 &&
					Math.abs( MinY - tWinlineArray[i].m_vCenter.y )<0.001) )
				{
					continue;
				}
			}
		};

		
		this.OnLoadWindow_XML = function(data)
		{
			 // 读取户型库数据
				var tWin = new WindowData();
			  this.mWindowArray.push(tWin);
			  
				var x1 = parseFloat($(data).attr('PosX'));
				var y1 = parseFloat($(data).attr('PosY'));
				var z1 = parseFloat($(data).attr('PosZ'));			  

				var fLength = parseFloat($(data).attr('Length'));
			  var fWidth 	= parseFloat($(data).attr('Width'));
			  var fHeight = parseFloat($(data).attr('Height'));
			  
			  var fRotate = parseFloat($(data).attr('Rotate'));
			  var iMode   = parseFloat($(data).attr('Mode'));
			  var fDist	  = parseFloat($(data).attr('Dist'));
			  
			  var strModelType = $(data).attr('source');
			  var iReplaceMaterial= $(data).attr('ReplaceMaterial');
			  var iWinStyle	 = $(data).attr('type');
				if(iWinStyle == undefined)
				   iWinStyle = $(data).attr('Type');
				
				index = this.mWindowArray.length-1;

				this.mWindowArray[index].OnInit(iWinStyle,index);
					
				this.mWindowArray[index].m_fLength   = fLength;
				this.mWindowArray[index].m_fWidth    = fWidth;
				this.mWindowArray[index].m_fHeight   = fHeight;			
				this.mWindowArray[index].m_fRotate   = fRotate;
				this.mWindowArray[index].m_iMode     = iMode;
				this.mWindowArray[index].m_fHight    = fDist;
				this.mWindowArray[index].m_vPos.x = x1;
				this.mWindowArray[index].m_vPos.y = y1;
				this.mWindowArray[index].m_vPos.z = 0;
				this.mWindowArray[index].UpdateWindow();
		};
		
		this.OnLoadWindow_Scanning = function(data)
		{
			 // 读取户型库数据
			var tWin = new WindowData();
			this.mWindowArray.push(tWin);
			  
			var x1 = parseFloat($(data).attr('StartX'));
			var y1 = parseFloat($(data).attr('StartY'));
			var z1 = parseFloat($(data).attr('StartZ'));
			
			var x2 = parseFloat($(data).attr('EndX'));
			var y2 = parseFloat($(data).attr('EndY'));
			var z2 = parseFloat($(data).attr('EndZ'));			

			var fLength = parseFloat($(data).attr('Length'))/10;//Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1))/10;
			var fWidth 	= 20;
			var fHeight = parseFloat($(data).attr('Height'))/10;
			var fRotate= 0.0;
			var edge1   = new THREE.Vector3;
				edge1.x = x2 - x1;
				edge1.y = y2 - y1;
				edge1.z = z2 - z1;
			
			if( Math.abs(edge1.x) < 0.001 )				
				edge1.x = 0.0;
			if( Math.abs(edge1.y) < 0.001 )
				edge1.y = 0.0;
			
			if( edge1.x == 0.0 && edge1.y == 0.0)
				fRotate = 0.0;
			else
				fRotate = Math.atan(edge1.y/edge1.x);			  
			  
			var iMode    = 0;
			var fDist	 = z2/10;
			var iWinStyle= 0;
			
			index = this.mWindowArray.length-1;
			this.mWindowArray[index].OnInit(iWinStyle,index);
					
			this.mWindowArray[index].m_fLength   = fLength;
			this.mWindowArray[index].m_fWidth    = fWidth;
			this.mWindowArray[index].m_fHeight   = fHeight;			
			this.mWindowArray[index].m_fRotate   = fRotate;
			this.mWindowArray[index].m_iMode     = iMode;
			this.mWindowArray[index].m_fHight    = fDist;
			this.mWindowArray[index].m_vPos.x = ( x2+ x1 )/20;
			this.mWindowArray[index].m_vPos.y = ( y2+ y1 )/20;
			this.mWindowArray[index].m_vPos.z = 0;
			this.mWindowArray[index].UpdateWindow();			
		};
		
		this.OnLoadWindow_House = function(data)
		{
				// 支持户型库来的老数据
				var tWin = new WindowData();
			  this.mWindowArray.push(tWin);
			  
				var x1 = parseFloat($(data).attr('PosX'));
				var y1 = parseFloat($(data).attr('PosY'));
				var z1 = parseFloat($(data).attr('PosZ'));			  

				var fLength = parseFloat($(data).attr('Length'));
			  var fWidth 	= parseFloat($(data).attr('Width'));
			  var fHeight = parseFloat($(data).attr('Height'));
			  
			  var fRotate = parseFloat($(data).attr('Rotate'));
			  var iMode   = parseFloat($(data).attr('Mode'));
			  var fDist	  = parseFloat($(data).attr('Dist'));
			  
			  var strModelType = $(data).attr('source');
			  var iReplaceMaterial= $(data).attr('ReplaceMaterial');
			  var iWinStyle	 = $(data).attr('type');

				index = this.mWindowArray.length-1;
				if( iWinStyle == 1)		// 户型库老窗户 飘窗为1, h5版飘窗为2
					  iWinStyle = 2; 
				this.mWindowArray[index].OnInit(iWinStyle,index);
					
				this.mWindowArray[index].m_fLength   = fLength;
			//	this.mWindowArray[index].m_fWidth    = fWidth;
				this.mWindowArray[index].m_fHeight   = fHeight;			
				this.mWindowArray[index].m_fRotate   = fRotate;
				this.mWindowArray[index].m_iMode     = iMode;
				this.mWindowArray[index].m_fHight    = fDist;
				this.mWindowArray[index].m_vPos.x = x1;
				this.mWindowArray[index].m_vPos.y = y1;
				this.mWindowArray[index].m_vPos.z = 0;
				this.mWindowArray[index].UpdateWindow();
						
		};	
		
	/**
	 * @api OnKeyDown(iKey)
	 * @apiGroup WindowClass
	 * @apiDescription 键盘操作
	 * @apiParam (参数) iKey  键盘值
	 *                             
	 */		
	this.OnKeyDown = function(iKey)
	{
		// 键盘操作
		if(this.m_pCurWindow== null)
			return false;
				
		switch(iKey)
		{
			case 46:	// 删除
			{
			   if(this.m_pCurWindow)
			   	 this.OnDelete(this.m_pCurWindow);
			   this.m_pCurWindow = null;
			}
			return true;
		}
		
		if((this.m_HelpBox.position.x  != -99999 || this.m_HelpBox.position.y  != -99999 ) && 
			this.g_GaiLiQiangJuLi  != null && this.m_pCurWindow != null)	// 调整svg离墙距离
		{
			
			var a=e.keyCode;
			if( a == 46||a == 48||
				a == 49||a == 50||
				a == 51||a == 52||
				a == 53||a == 54||
				a == 55||a == 56||
				a == 57)
			{
				if( this.g_GaiLiQiangJuLi ==  this.m_LineLeft_Box)
				{
					var strText = this.m_strLeft_Value;
					if(strText.length<5)
					{
					   strText +=String.fromCharCode(a);			
					   this.UpdateText(this.m_pCurWindow,parseInt(strText),0);
					   this.g_GaiLiQiangJuLi =  this.m_LineLeft_Box;
					}
					return true;
				}
				if( this.g_GaiLiQiangJuLi ==  this.m_LineRight_Box)
				{
					var strText = this.m_strRight_Value;
					if(strText.length<5)
					{
					   strText +=String.fromCharCode(a);			
					   this.UpdateText(this.m_pCurWindow,parseInt(strText),1);
					   this.g_GaiLiQiangJuLi =  this.m_LineRight_Box;
					}	
					return true;
				}
				if( this.g_GaiLiQiangJuLi ==  this.m_LineCenter_Box)
				{
					var strText = this.m_strCenter_Value;
					if(strText.length<5)
					{
					   strText +=String.fromCharCode(a);			
					   this.UpdateText(this.m_pCurWindow,parseInt(strText),2);
					   this.g_GaiLiQiangJuLi =  this.m_LineCenter_Box;
					}
					return true;
				}
			}
			
			if( a== 8 )		// 后退
			{			
				if( this.g_GaiLiQiangJuLi ==  this.m_LineLeft_Box)
				{
					var strText = this.m_strLeft_Value;
						if(strText.length == 1)
						   strText = 0;
						else
							strText = strText.slice(0,strText.length-1);			
					this.UpdateText(this.m_pCurWindow,parseInt(strText),0);
					this.g_GaiLiQiangJuLi =  this.m_LineLeft_Box;
					return true;
				}
				if( this.g_GaiLiQiangJuLi ==  this.m_LineRight_Box)
				{
					var strText = this.m_strRight_Value;
						if(strText.length == 1)
						   strText = 0;
						else				
						   strText = strText.slice(0,strText.length-1);	
					this.UpdateText(this.m_pCurWindow,parseInt(strText),1);
					this.g_GaiLiQiangJuLi =  this.m_LineRight_Box;	
					return true;
				}
				if( this.g_GaiLiQiangJuLi ==  this.m_LineCenter_Box)
				{
					var strText = this.m_strCenter_Value;
						if(strText.length == 1)
						   strText = 0;
						else
						   strText = strText.slice(0,strText.length-1);
					this.UpdateText(this.m_pCurWindow,parseInt(strText),2);
					this.g_GaiLiQiangJuLi =  this.m_LineCenter_Box;
					return true;
				}		
			}
			
			if( a == 13 )	// 回车移动
			{			
				if( this.g_GaiLiQiangJuLi ==  this.m_LineLeft_Box)
				{
					var fValue = this.m_fLeftOld-parseInt(this.m_strLeft_Value);
					
					// 得到旋转后的位置
					var tmpMatrix1= new THREE.Matrix4().makeTranslation(-fValue,0,0);					
					var tmpMatrix2= new THREE.Matrix4().makeRotationZ(this.m_pCurWindow.m_fRotate);
					var tmpMatrix3= new THREE.Matrix4().makeTranslation(this.m_pCurWindow.m_vPos.x,this.m_pCurWindow.m_vPos.y,1);
					tmpMatrix2.multiply(tmpMatrix1);
					tmpMatrix3.multiply(tmpMatrix2);
					
					var vPos = new THREE.Vector3(0, 0, 0);
						vPos.applyMatrix4(tmpMatrix3);
					this.m_pCurWindow.m_vPos.x = vPos.x;
					this.m_pCurWindow.m_vPos.y = vPos.y;
					this.m_pCurWindow.UpdateWindow();
					this.OnShowCtrl(this.m_pCurWindow);
					this.g_GaiLiQiangJuLi =  this.m_LineLeft_Box;
					return true;
				}
				if( this.g_GaiLiQiangJuLi ==  this.m_LineRight_Box)
				{
					var fValue =this.m_fRightOld -parseInt(this.m_strRight_Value);
										
					// 得到旋转后的位置
					var tmpMatrix1= new THREE.Matrix4().makeTranslation(fValue,0,0);					
					var tmpMatrix2= new THREE.Matrix4().makeRotationZ(this.m_pCurWindow.m_fRotate);
					var tmpMatrix3= new THREE.Matrix4().makeTranslation(this.m_pCurWindow.m_vPos.x,this.m_pCurWindow.m_vPos.y,1);
					tmpMatrix2.multiply(tmpMatrix1);
					tmpMatrix3.multiply(tmpMatrix2);
					var vPos = new THREE.Vector3(0, 0, 0);
						vPos.applyMatrix4(tmpMatrix3);
					this.m_pCurWindow.m_vPos.x = vPos.x;
					this.m_pCurWindow.m_vPos.y = vPos.y;						
					this.m_pCurWindow.UpdateWindow();
					this.OnShowCtrl(this.m_pCurWindow);
					this.g_GaiLiQiangJuLi =  this.m_LineRight_Box;	
					return true;
				}
				if( this.g_GaiLiQiangJuLi ==  this.m_LineCenter_Box)
				{
					if(parseInt(this.m_strCenter_Value)<50)
					{
						alert("窗户尺寸太小，请重新输入.");
						return false;
					}
					this.m_pCurWindow.m_fLength =parseInt(this.m_strCenter_Value);
					this.m_pCurWindow.UpdateWindow();
					this.OnShowCtrl(this.m_pCurWindow);
					this.g_GaiLiQiangJuLi =  this.m_LineCenter_Box;
					return true;
				}		
			}
		}		
		
		return false;
	};		
}