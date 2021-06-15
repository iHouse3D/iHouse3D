/**
 * @api FurnitureClass
 * @apiGroup FurnitureClass
 * @apiDescription 模型操作类
 * @apiParam (成员变量) mFurnitureArray 模型数组
 * @apiParam (成员变量) m_pCurFurniture 当前模型
 * @apiParam (成员变量) m_pMoveObjArray 成组的模型组
 * @apiParam (成员变量) m_pMoveFurniture 当前操作的模型组
 *
 *                             
 */
function FurnitureClass()
{
		this.mFurnitureArray = new Array();	
		this.m_pCurFurniture = null;

		this.mHelpBox;				  // 拖拽用Box
		this.m_AixBox1;				  // 轴对齐
		this.m_AixBox2;	
		this.m_moveXOld;
		this.m_moveYOld;
		this.m_moveZOld;	
		
		this.m_pMoveObjArray  = new Array();	// 多选
		this.m_pMoveFurniture = null;
		this.mCurMouseX = 0;
		this.mCurMouseY = 0;
		
		// 3D 操作方式
		//=================================================================================
		this.mRingGeometry  	= null;	  // 旋转操作
		this.mRingGeometry_Pick = null;	  // 旋转拾取
		this.mArrowGeometry 	= null;	  // 箭头
		this.mCylinderGeometry	= null;   // 向上柱子
		this.mPickGeometry		= null;	  // 拾取区域
		this.g_bObjRotate 		= false;  // 旋转
		this.g_bObjRaise  		= false;  // 升高		
		
		// 2D操控帮助界面(不用保存)
		//====================================================================
		this.m_HelpBox;
		this.m_HelpBox1;
		this.m_HelpBox2;
		this.m_HelpBox3;
		this.m_HelpBox4;
		this.m_HelpBox5;
		this.m_HelpBox6;
		this.m_HelpBox7;
		this.m_HelpBox8;
		this.m_LineLeft_Label;
		this.m_LineRight_Label;
		this.m_LineTop_Label;
		this.m_LineBottom_Label;
		this.m_LineLeft_Box;
		this.m_LineTop_Box;
		this.m_LineRight_Box;
		this.m_LineBottom_Box;
		
		this.m_LineLeft_Box1;
		this.m_LineTop_Box1;
		this.m_LineRight_Box1;
		this.m_LineBottom_Box1;
		
		this.m_LineLeft;
		this.m_LineRight;
		this.m_LineTop;
		this.m_LineBottom;
		this.m_iSelected = 0;
		this.g_GaiLiQiangJuLi;
		this.m_strLeft_Value;
		this.m_strRight_Value;
		this.m_strTop_Value;
		this.m_strBottom_Value;
		this.m_fLeftOld;
		this.m_fRightOld;
		this.m_fTopOld;
		this.m_fBottomOld;
		
		// 需要加载的模型数量
		//====================================================================	
		this.m_iLoadingNow = 0;
		this.m_iLoading    = 0;	
		
		this.OnInit = function()
		{			
			var geometry  = new THREE.BoxBufferGeometry( 1, 1, 1);
 			this.m_AixBox1= new THREE.Mesh(geometry, new THREE.MeshBasicMaterial( { color: 0x64ff64, opacity: 0.3, transparent: true } ) ); 	
			scene3D.add( this.m_AixBox1 );
			
			var geometry1  = new THREE.BoxBufferGeometry( 1, 1, 1);
 			this.m_AixBox2= new THREE.Mesh(geometry1, new THREE.MeshBasicMaterial( { color: 0x64ff64, opacity: 0.3, transparent: true } ) ); 	
			scene3D.add( this.m_AixBox2 );
			
			// 在2D图片未加载时，先显示的加载盒子
			var geometry2  = new THREE.BoxBufferGeometry( 1, 1, 1);
 			this.mHelpBox= new THREE.Mesh(geometry2, new THREE.MeshBasicMaterial( { color: 0x00ff00, opacity: 0.45, transparent: true } ) ); 	
			scene3D.add( this.mHelpBox );
			
			// 2D操作区域
			var result_poly = new THREE.Geometry();					
			result_poly.vertices.push(new THREE.Vector3(-0.5, -0.5, 1), new THREE.Vector3(-0.5, 0.5, 1));				
			result_poly.vertices.push(new THREE.Vector3( 0.5,  0.5, 1), new THREE.Vector3( 0.5,-0.5, 1));	
						
			this.m_HelpBox = new THREE.LineSegments( result_poly, new THREE.LineBasicMaterial( { color: 0x00A2E8, linewidth:15, opacity: 1 } ) );
			scene.add(this.m_HelpBox);
			
			var geometry1 = new THREE.Geometry();
			geometry1.vertices.push( new THREE.Vector3( 0,0, 1 ), new THREE.Vector3( 0,0, 1 ));
			var geometry2 = new THREE.Geometry();
			geometry2.vertices.push( new THREE.Vector3( 0,0, 1 ), new THREE.Vector3( 0,0, 1 ));
			var geometry3 = new THREE.Geometry();
			geometry3.vertices.push( new THREE.Vector3( 0,0, 1 ), new THREE.Vector3( 0,0, 1 ));
			var geometry4 = new THREE.Geometry();
			geometry4.vertices.push( new THREE.Vector3( 0,0, 1 ), new THREE.Vector3( 0,0, 1 ));	
			this.m_LineLeft 	= new THREE.LineSegments( geometry1, new THREE.LineBasicMaterial( { color: 0xAAAAAA, opacity: 1, linewidth:0.5 } ) );
			this.m_LineRight	= new THREE.LineSegments( geometry2, new THREE.LineBasicMaterial( { color: 0xAAAAAA, opacity: 1, linewidth:0.5 } ) );
			this.m_LineTop  	= new THREE.LineSegments( geometry3, new THREE.LineBasicMaterial( { color: 0xAAAAAA, opacity: 1, linewidth:0.5 } ) );
			this.m_LineBottom 	= new THREE.LineSegments( geometry4, new THREE.LineBasicMaterial( { color: 0xAAAAAA, opacity: 1, linewidth:0.5 } ) );
					
			scene.add(this.m_LineLeft);
			scene.add(this.m_LineRight);
			scene.add(this.m_LineTop);
			scene.add(this.m_LineBottom);			
			this.OnHideCtrl();	// 隐藏操控		
		};
		
		this.OnHideCtrl = function()
		{
			// 不显示2D操作框
			this.m_HelpBox.position.x  = -99999;			
			this.m_HelpBox.position.y  = -99999;	
			
			this.m_LineLeft.visible   = false;
			this.m_LineRight.visible  = false;
			this.m_LineTop.visible 	  = false;
			this.m_LineBottom.visible = false;
		};		
						
		this.OnShowHelpBox  = function(bShow)
		{
			this.mHelpBox.visible = bShow;
		};
		
		/**
		 * @api Clone()
		 * @apiGroup FurnitureClass 
		 * @apiName  0
		 * @apiDescription 复制一个物体
		 */		
		this.Clone = function(tObj,iDirection)
		{
			if( tObj )					
				tObj = tObj.Clone(iDirection);				
			return tObj;
		}
					
		this.OnMouseMove2D  = function(mouseX,mouseZ)
		{
			if(this.m_pCurFurniture)
			{				
				this.m_pCurFurniture.m_vPos.x =  mouseX;
				this.m_pCurFurniture.m_vPos.y =  mouseZ;
				this.m_pCurFurniture.UpdateFlue();				
			}			
		};
		// 3D创建时移动
		this.OnMouseMove3D = function(mouseX,mouseZ)
		{
			if(this.m_pCurFurniture)
			{
				if( this.m_pCurFurniture.m_bLoaded == false )
					return;
				this.m_pCurFurniture.m_vPos.x =  mouseX-this.mCurMouseX;
				this.m_pCurFurniture.m_vPos.y = -mouseZ-this.mCurMouseY;
				this.m_pCurFurniture.UpdateFlue();
			}	
		};
				
		this.OnUpdateAix = function(x1, y1,fl,fw,fh)
		{	
			this.m_AixBox1.scale.set(fl,fh/10,2);
			this.m_AixBox2.scale.set(2,fh/10,fl);
			this.m_AixBox1.position.set(x1,fh/20,y1);
			this.m_AixBox2.position.set(x1,fh/20,y1);
		};
		// 吸附功能		
		this.render3D = function(tFurniture,mouseX, mouseY)
		{
			if(event == undefined)
				return;
				
			if(event.buttons != 1)
				return;
							  		
			m_ParamObjDlg.HideBar();

			mHouseClass.mFurnitureClass.OnUpdateAix(999999,999999,1,1,1);
			var tCurBox = new THREE.Box3();
				tCurBox.setFromObject( tFurniture.mBoxHelper );			
			var fl = Math.abs(tCurBox.max.x-tCurBox.min.x);
			var fw = Math.abs(tCurBox.max.z-tCurBox.min.z);
			var fh = 100;
						
			if( tFurniture.mBoxHelper.position.y< 0 )
				tFurniture.mBoxHelper.position.y= 0;
				
			// 是否沿墙移动
			if( app.header.showLable.check_ObjectAdsorption == true )
			{
				var vPos = this.UpdateMashOnWall(tFurniture,mouseX, mouseY);	// 吸附墙体
				if( vPos )
				{
					tFurniture.m_Object3D.position.x =  vPos.x;
					tFurniture.m_Object3D.position.z = -vPos.y;

					if( tFurniture.mData[8] == '斜坡')
					{
						tFurniture.m_fRotate			 =  vPos.z+90+180;
						tFurniture.m_Object3D.position.y =  tFurniture.mBoxHelper.position.y;
					}

					tFurniture.m_fRotate			 =  vPos.z+90;
					
					tFurniture.m_Object3D.rotation.z = tFurniture.m_fRotate*Math.PI/180;
					tFurniture.mBoxHelper.rotation.z = tFurniture.m_fRotate*Math.PI/180;
					tFurniture.m_RenderData2D.position.x =  vPos.x;
					tFurniture.m_RenderData2D.position.y =  vPos.y;	
					tFurniture.m_RenderData2D.rotation.z =  tFurniture.m_fRotate*Math.PI/180;
					return;

				}
			}
						
			// 家具与家具的吸附
			//====================================================================================================
			var tCurBox1 = new THREE.Box3();
				tCurBox1.setFromObject( tFurniture.m_Object3D );
				
			var bEnable = false; // 判断是否吸附
			for( var i = 0; i<mHouseClass.mFurnitureClass.mFurnitureArray.length; i++ )	// 循环所有模型
			{
				if( tFurniture.mBoxHelper == mHouseClass.mFurnitureClass.mFurnitureArray[i].mBoxHelper )	// 相同物体
					continue;
				
				if(mHouseClass.mFurnitureClass.mFurnitureArray[i].mBoxHelper == null)		//  有没加载成功的模型
					continue;
					
				// 不同高度，不吸附
				if( Math.abs(tFurniture.mBoxHelper.position.y - mHouseClass.mFurnitureClass.mFurnitureArray[i].mBoxHelper.position.y)>2 )
					continue;
					
				var d = tFurniture.mBoxHelper.position.distanceTo( mHouseClass.mFurnitureClass.mFurnitureArray[i].mBoxHelper.position );
				if( d <= 500 )	// 物体间距小于 500
				{			
					var tBox = new THREE.Box3();
						tBox.setFromObject( mHouseClass.mFurnitureClass.mFurnitureArray[i].mBoxHelper );	
					var tBox1 = new THREE.Box3();
						tBox1.setFromObject( mHouseClass.mFurnitureClass.mFurnitureArray[i].m_Object3D );		
															
					var fValue = 20;	//吸附距离小于
					
					var vec = new THREE.Vector3(tCurBox.max.x,0,tCurBox.max.z);
					var obj = new THREE.Vector3(tBox.max.x,0,tBox.max.z);
					if( vec.distanceTo(obj) < fValue )
					{	
						bEnable = true;
						tFurniture.m_Object3D.position.x += tBox1.max.x - tCurBox1.max.x;
						tFurniture.m_Object3D.position.z += tBox1.max.z - tCurBox1.max.z;
						mHouseClass.mFurnitureClass.OnUpdateAix(tBox.max.x,tBox.max.z,fl,fw,fh);
						tFurniture.m_RenderData2D.position.x =  tFurniture.m_Object3D.position.x;
						tFurniture.m_RenderData2D.position.y = -tFurniture.m_Object3D.position.z;						
						return;
					}
					
					vec = new THREE.Vector3(tCurBox.max.x,0,tCurBox.max.z);
					obj = new THREE.Vector3(tBox.max.x,0,tBox.min.z);
					if( vec.distanceTo(obj) < fValue )
					{	
						bEnable = true;
						tFurniture.m_Object3D.position.x += tBox1.max.x - tCurBox1.max.x;
						tFurniture.m_Object3D.position.z += tBox1.min.z - tCurBox1.max.z;
						mHouseClass.mFurnitureClass.OnUpdateAix(tBox.max.x,tBox.min.z,fl,fw,fh);
						tFurniture.m_RenderData2D.position.x =  tFurniture.m_Object3D.position.x;
						tFurniture.m_RenderData2D.position.y = -tFurniture.m_Object3D.position.z;						
						return;
					}
					
					vec = new THREE.Vector3(tCurBox.max.x,0,tCurBox.max.z);
					obj = new THREE.Vector3(tBox.max.x,0,tBox.min.z);
					if( vec.distanceTo(obj) < fValue )
					{	
						bEnable = true;
						tFurniture.m_Object3D.position.x += tBox1.max.x - tCurBox1.max.x;
						tFurniture.m_Object3D.position.z += tBox1.min.z - tCurBox1.max.z;
						mHouseClass.mFurnitureClass.OnUpdateAix(tBox.max.x,tBox.min.z,fl,fw,fh);
						tFurniture.m_RenderData2D.position.x =  tFurniture.m_Object3D.position.x;
						tFurniture.m_RenderData2D.position.y = -tFurniture.m_Object3D.position.z;						
						return;
					}	
					// 移动物右，比较物左边
					vec = new THREE.Vector3(tCurBox.max.x,0,tCurBox.max.z);
					obj = new THREE.Vector3(tBox.min.x,0,tBox.max.z);
					if( vec.distanceTo(obj) < fValue )
					{	
						bEnable = true;
						tFurniture.m_Object3D.position.x += tBox1.min.x - tCurBox1.max.x;
						tFurniture.m_Object3D.position.z += tBox1.max.z - tCurBox1.max.z;
						mHouseClass.mFurnitureClass.OnUpdateAix(tBox.min.x,tBox.max.z,fl,fw,fh);
						tFurniture.m_RenderData2D.position.x =  tFurniture.m_Object3D.position.x;
						tFurniture.m_RenderData2D.position.y = -tFurniture.m_Object3D.position.z;						
						return;
					}	
					
					vec = new THREE.Vector3(tCurBox.min.x,0,tCurBox.max.z);
					obj = new THREE.Vector3(tBox.max.x,0,tBox.max.z);
					if( vec.distanceTo(obj) < fValue )
					{	
						bEnable = true;
						tFurniture.m_Object3D.position.x += tBox1.max.x - tCurBox1.min.x;
						tFurniture.m_Object3D.position.z += tBox1.max.z - tCurBox1.max.z;
						mHouseClass.mFurnitureClass.OnUpdateAix(tBox.max.x,tBox.max.z,fl,fw,fh);
						tFurniture.m_RenderData2D.position.x =  tFurniture.m_Object3D.position.x;
						tFurniture.m_RenderData2D.position.y = -tFurniture.m_Object3D.position.z;
						return;
					}
					
					vec = new THREE.Vector3(tCurBox.max.x,0,tCurBox.min.z);
					obj = new THREE.Vector3(tBox.max.x,0,tBox.max.z);
					if( vec.distanceTo(obj) < fValue )
					{	
						bEnable = true;
						tFurniture.m_Object3D.position.x += tBox1.max.x - tCurBox1.max.x;
						tFurniture.m_Object3D.position.z += tBox1.max.z - tCurBox1.min.z;
						mHouseClass.mFurnitureClass.OnUpdateAix(tBox.max.x,tBox.max.z,fl,fw,fh);
						tFurniture.m_RenderData2D.position.x =  tFurniture.m_Object3D.position.x;
						tFurniture.m_RenderData2D.position.y = -tFurniture.m_Object3D.position.z;
						return;
					}					
				}
			}
			tFurniture.m_Object3D.position.x = tFurniture.mBoxHelper.position.x;
			tFurniture.m_Object3D.position.y = tFurniture.mBoxHelper.position.y;
			tFurniture.m_Object3D.position.z = tFurniture.mBoxHelper.position.z;
			
			tFurniture.m_Object3D.rotation.z 	 =  tFurniture.m_fRotate*Math.PI/180;
			tFurniture.mBoxHelper.rotation.z 	 =  tFurniture.m_fRotate*Math.PI/180;
			
			tFurniture.m_RenderData2D.position.x =  tFurniture.m_Object3D.position.x;
			tFurniture.m_RenderData2D.position.y = -tFurniture.m_Object3D.position.z;
			tFurniture.m_RenderData2D.rotation.z =  tFurniture.m_fRotate*Math.PI/180;
			
			// 如果与平台相碰，则移动到平台上 (代码有问题)
			//====================================================================================================
	/*		var ret = mHouseClass.mFloorClass.CheckCollision(tFurniture);
			if( ret)
			{
				if(mFloorMesh3D.geometry.boundingBox && (tFurniture.m_Object3D.position.y - ret.mFloorMesh3D.geometry.boundingBox.max.z <=0.1) )
				{
					tFurniture.m_Object3D.position.y = ret.mFloorMesh3D.geometry.boundingBox.max.z;
					tFurniture.mBoxHelper.position.y = ret.mFloorMesh3D.geometry.boundingBox.max.z;
				}
			}*/
			render();		
		};
		
		//  得到物体所在地面
		this.GetFloor=function(tFurniture)
		{	
			for( var k = 0; k<mHouseClass.mFloorClass.mFloorArray.length; k++)
			{
				var vPos 		= tFurniture.m_RenderData2D.position;
				var vPos1 		= new THREE.Vector3( vPos.x , vPos.y, 10 );
		    	var vNormal 	= new THREE.Vector3(0,0,-1);
		    	var raycaster1 	= new THREE.Raycaster(vPos1,vNormal);
		   	 	var Intersections = raycaster1.intersectObject( mHouseClass.mFloorClass.mFloorArray[k].mFloorMesh );
		   	 	if( Intersections.length>0 )
					return 	mHouseClass.mFloorClass.mFloorArray[k];	
			}
			return null;
		};
		
		this.GetFloor1=function(vPos)
		{	
			for( var k = 0; k<mHouseClass.mFloorClass.mFloorArray.length; k++)
			{
				var vPos1 		= new THREE.Vector3( vPos.x , vPos.y, 10 );
		    	var vNormal 	= new THREE.Vector3(0,0,-1);
		    	var raycaster1 	= new THREE.Raycaster(vPos1,vNormal);
		   	 	var Intersections = raycaster1.intersectObject( mHouseClass.mFloorClass.mFloorArray[k].mFloorMesh );
		   	 	if( Intersections.length>0 )
					return 	mHouseClass.mFloorClass.mFloorArray[k];	
			}
			return null;
		};		
		
		/**
		 * @api UpdateMashOnWall
		 * @apiDescription  判断当前物体是否靠墙
		 * @apiGroup FurnitureClass
		 * @apiParam (参数) tFurniture 当前物体
		 * 
		 */	 
	/*	var m_vCheckPos = null;
		this.UpdateMashOnWall = function(tFurniture,posX, posY)
		{
			var fValue = 30 ;	//吸附值  tFurniture.m_fWidth/10
			if( tFurniture.mData[8] == '斜坡')
				fValue = 60;
				
			var tFloor = this.GetFloor(tFurniture);	// 得到所在地面
			if( tFloor == null )
				return;

			var tCurBox = new THREE.Box3();
			tCurBox.setFromObject( tFurniture.mBoxHelper );	
			
			var pos1 = new THREE.Vector3((tCurBox.max.x+tCurBox.min.x)/2,0,tCurBox.min.z );//四条边的中心点
			var pos2 = new THREE.Vector3((tCurBox.max.x+tCurBox.min.x)/2,0,tCurBox.max.z );
			var pos3 = new THREE.Vector3( tCurBox.max.x,0,(tCurBox.max.z+tCurBox.min.z)/2 );
			var pos4 = new THREE.Vector3( tCurBox.min.x,0,(tCurBox.max.z+tCurBox.min.z)/2 );
			
			//  得到用来碰撞检测的边线
			var tLineArray = mHouseClass.mRoomClass.OnUpdateWall_3D_In(tFloor, 5);	//tFurniture.m_fWidth/20
			for( var j=0; j<tLineArray.length-1;j++)
			{
				
				//四条边的中心点到墙体的距离				
				//fValue = pos1.distanceTo(tFurniture.mBoxHelper.position);
				var ab = mMathClass.ClosestPointOnLine1(tLineArray[j+0].x,tLineArray[j+0].y,
									tLineArray[j+1].x,tLineArray[j+1].y,
									pos1.x,
								   -pos1.z, fValue);
				if(ab[0] != 0)
				{		
					var direction =pos1.sub(tFurniture.mBoxHelper.position);	// 在移动的方向上
						direction.normalize();
					pos1.add( direction.multiplyScalar(fValue/2) );				//点在一个方向上移动一段距离
					var k1 = pos1.x;
					var k2 = pos1.z;
					ab[1] += k1;
					ab[2] += k2;

					// 是否跨越两个房间
					var posA = new THREE.Vector3( pos3.x+k1,pos3.z+k2 );
					var posB = new THREE.Vector3( pos4.x+k1,pos4.z+k2 );
					var posC = new THREE.Vector3( pos2.x+k1,pos2.z+k2 );
					var tFloorA = this.GetFloor1(posA);
					var tFloorB = this.GetFloor1(posB);
					var tFloorC = this.GetFloor1(posC);
					if( tFloorA == tFloorB &&tFloorB  == tFloorC && tFloorC == tFloor )		
						return new THREE.Vector3( ab[1],ab[2],0 );	
				}

				//fValue = pos2.distanceTo(tFurniture.mBoxHelper.position);
				ab   = mMathClass.ClosestPointOnLine1(tLineArray[j+0].x,tLineArray[j+0].y,
										tLineArray[j+1].x,tLineArray[j+1].y,
										pos2.x,-pos2.z, fValue);
				if(ab[0] != 0)
				{
					var direction =pos2.sub(tFurniture.mBoxHelper.position);	// 在移动的方向上
						direction.normalize();
					pos2.add( direction.multiplyScalar(fValue/2) );
					var k1 = pos2.x;
					var k2 = pos2.z;
					ab[1] += k1;
					ab[2] += k2;
					// 是否跨越两个房间
					var posA = new THREE.Vector3( pos3.x+k1,pos3.z+k2 );
					var posB = new THREE.Vector3( pos4.x+k1,pos4.z+k2 );
					var posC = new THREE.Vector3( pos1.x+k1,pos1.z+k2 );
					var tFloorA = this.GetFloor1(posA);
					var tFloorB = this.GetFloor1(posB);
					var tFloorC = this.GetFloor1(posC);
					if( tFloorA == tFloorB &&tFloorB  == tFloorC && tFloorC == tFloor )						
					return new THREE.Vector3( ab[1],ab[2],0 );
				}	
				
				//fValue = pos3.distanceTo(tFurniture.mBoxHelper.position);
				ab   = mMathClass.ClosestPointOnLine1(tLineArray[j+0].x,tLineArray[j+0].y,
										tLineArray[j+1].x,tLineArray[j+1].y,
										pos3.x,
									   -pos3.z, fValue);
				if(ab[0] != 0)
				{
					var direction =pos3.sub(tFurniture.mBoxHelper.position);	// 在移动的方向上
						direction.normalize();
					pos3.add( direction.multiplyScalar(fValue/2) );
					var k1 = -pos3.x;
					var k2 = pos3.z;					
					ab[1] += k1;
					ab[2] += k2;
					// 是否跨越两个房间
					var posA = new THREE.Vector3( pos1.x+k1,pos1.z+k2 );
					var posB = new THREE.Vector3( pos2.x+k1,pos2.z+k2 );
					var posC = new THREE.Vector3( pos4.x+k1,pos4.z+k2 );
					var tFloorA = this.GetFloor1(posA);
					var tFloorB = this.GetFloor1(posB);
					var tFloorC = this.GetFloor1(posC);
					if( tFloorA == tFloorB &&tFloorB  == tFloorC && tFloorC == tFloor )					
						return new THREE.Vector3( ab[1],ab[2],0 );
				}	
				
				//fValue = pos4.distanceTo(tFurniture.mBoxHelper.position);
				ab   = mMathClass.ClosestPointOnLine1(tLineArray[j+0].x,tLineArray[j+0].y,
										tLineArray[j+1].x,tLineArray[j+1].y,
										pos4.x,
									   -pos4.z, fValue);				   
				if(ab[0] != 0)
				{
					var posOld = new THREE.Vector3( pos4.x,0, pos4.z);
					var posNew = new THREE.Vector3( ab[1], 0, -ab[2]  );
						fValue = posOld.distanceTo(posNew);
					var direction =posNew.sub(posOld);	// 在移动的方向上
						direction.normalize();	
					
					//var direction =pos4.sub(tFurniture.mBoxHelper.position);	// 在移动的方向上
					//	direction.normalize();
					//pos4.add( direction.multiplyScalar(fValue) );
					direction.multiplyScalar(fValue);
					var k1 =  direction.x;
					var k2 =  direction.z;						
					//ab[1] += k1;
					//ab[2] += k2;
					var posA = new THREE.Vector3( pos1.x+k1,pos1.z+k2 );
					var posB = new THREE.Vector3( pos2.x+k1,pos2.z+k2 );
					var posC = new THREE.Vector3( pos3.x+k1,pos3.z+k2 );
					var tFloorA = this.GetFloor1(posA);
					var tFloorB = this.GetFloor1(posB);
					var tFloorC = this.GetFloor1(posC);
					if( tFloorA == tFloorB &&tFloorB  == tFloorC && tFloorC == tFloor )	*						
						return new THREE.Vector3( ab[1],ab[2],0 );
				}
			}
			return null;
		};
		
		this.GetCollisionPoint = function(tFloor,tFurniture)
		{
			var fValue = 30;
			var tCurBox = new THREE.Box3();
				tCurBox.setFromObject( tFurniture.mBoxHelper );	
			
			var pos1 = new THREE.Vector3((tCurBox.max.x+tCurBox.min.x)/2,0,tCurBox.min.z );//四条边的中心点
			var pos2 = new THREE.Vector3((tCurBox.max.x+tCurBox.min.x)/2,0,tCurBox.max.z );
			var pos3 = new THREE.Vector3( tCurBox.max.x,0,(tCurBox.max.z+tCurBox.min.z)/2 );
			var pos4 = new THREE.Vector3( tCurBox.min.x,0,(tCurBox.max.z+tCurBox.min.z)/2 );
			
			var tLineArray = mHouseClass.mRoomClass.OnUpdateWall_3D_In(tFloor, 30);
			for( var j=0; j<tLineArray.length-1;j++)
			{
				var ab = mMathClass.ClosestPointOnLine1(tLineArray[j+0].x,tLineArray[j+0].y,
									tLineArray[j+1].x,tLineArray[j+1].y,
									pos1.x,
								   -pos1.z, fValue);
				if(ab[0] != 0)
					return pos1;
					
				ab = mMathClass.ClosestPointOnLine1(tLineArray[j+0].x,tLineArray[j+0].y,
									tLineArray[j+1].x,tLineArray[j+1].y,
									pos2.x,
								   -pos2.z, fValue);
				if(ab[0] != 0)
					return pos2;
					
				ab = mMathClass.ClosestPointOnLine1(tLineArray[j+0].x,tLineArray[j+0].y,
									tLineArray[j+1].x,tLineArray[j+1].y,
									pos3.x,
								   -pos3.z, fValue);
				if(ab[0] != 0)
					return pos3;
					
				ab = mMathClass.ClosestPointOnLine1(tLineArray[j+0].x,tLineArray[j+0].y,
									tLineArray[j+1].x,tLineArray[j+1].y,
									pos4.x,
								   -pos4.z, fValue);
				if(ab[0] != 0)
					return pos4;					
					
			}
			return null;
		}*/
		
		this.UpdateMashOnWall = function(tFurniture,posX, posY)
		{
			var fValue = 30;	//吸附值 tFurniture.m_fWidth/10
			if( tFurniture.mData[8] == '斜坡')
				fValue = 60;
				
			var tFloor = this.GetFloor(tFurniture);	// 得到所在地面
			if( tFloor == null )
				return;
			
			//var pos = this.GetCollisionPoint(tFloor,tFurniture);
			//if( pos == null)
			//	return;

			//var fValue1 = pos.distanceTo(tFurniture.mBoxHelper.position);
			//fValue = 20;
			//  得到用来碰撞检测的边线
			var tLineArray = mHouseClass.mRoomClass.OnUpdateWall_3D_In(tFloor, tFurniture.m_fWidth/20); 
			for( var j=0; j<tLineArray.length-1;j++)
			{
				var ab   = mMathClass.ClosestPointOnLine1(tLineArray[j+0].x,tLineArray[j+0].y,
									tLineArray[j+1].x,tLineArray[j+1].y,
									tFurniture.mBoxHelper.position.x,
								   -tFurniture.mBoxHelper.position.z, fValue);
		   
				// 当前得到点，和移动前后两个点，在同一直线上, 防止墙角问题
				if(ab[0] != 0)
				{
						var vPos = new THREE.Vector3( ab[1],ab[2],0 );						
						var fRotateWall = 0;
											
						var edge1   = new THREE.Vector3;
							edge1.x = tLineArray[j+1].x - tLineArray[j+0].x;
							edge1.y = tLineArray[j+1].y - tLineArray[j+0].y;
							edge1.z = tLineArray[j+1].z - tLineArray[j+0].z;
						
						if( Math.abs(edge1.x) < 0.001 )				
							edge1.x = 0.0;
						if( Math.abs(edge1.y) < 0.001 )
							edge1.y = 0.0;
						
						if( edge1.x == 0.0 && edge1.y == 0.0)
							fRotateWall = 0.0;
						else
							fRotateWall = Math.atan(edge1.y/edge1.x);
							
							fRotateWall = fRotateWall*180/Math.PI-90;
			
							if(edge1.x<0)
							  fRotateWall+=180;
				  		
				  		return new THREE.Vector3( ab[1],ab[2], fRotateWall ); 
				}	
			}
			return null;
		};		
		
		this.GetBoundBoxFromMesh = function(tMesh)
		{
			var tBox = new THREE.Box3();
			tBox.min.x = tBox.min.y =  99999;
			tBox.max.x = tBox.max.y = -99999;
			tBox.max.z = tBox.min.z = 0;
			for(i=0;i<tMesh.children.length;i++)
			{
				tMesh.children[i].geometry.computeBoundingBox();
				
				if( tBox.max.x < tMesh.children[i].geometry.boundingBox.max.x )  tBox.max.x = tMesh.children[i].geometry.boundingBox.max.x;
				if( tBox.max.y < tMesh.children[i].geometry.boundingBox.max.y )  tBox.max.y = tMesh.children[i].geometry.boundingBox.max.y;
						
				if( tBox.min.x > tMesh.children[i].geometry.boundingBox.min.x )  tBox.min.x = tMesh.children[i].geometry.boundingBox.min.x;
				if( tBox.min.y > tMesh.children[i].geometry.boundingBox.min.y )  tBox.min.y = tMesh.children[i].geometry.boundingBox.min.y;		
			}
			return tBox;
		};
		

		this.CreateObj= function(ab)
		{
			var tFurniture = new Furniture();			
			this.mFurnitureArray.push( tFurniture );
			tFurniture.OnCreate3D(ab);			
			tFurniture.OnCreate2D();	// 创建 2D顶视图
			
			// 创建一个方盒子
			//================================================================
			m_cPenType = 5;	
			mHouseClass.mFurnitureClass.m_pCurFurniture  = tFurniture;
			
			this.mHelpBox.visible = true;
			this.mHelpBox.scale.set(tFurniture.mData[3]/10,tFurniture.mData[5]/10,tFurniture.mData[4]/10);
			this.mHelpBox.position.set(0,tFurniture.mData[5]/20,0);			
		};
			
		// 宣传板
		this.CreateBoard = function()
		{
			var ab = new Array();	
				ab.push("广告板");
				ab.push("c5E406ABE8914222DDD4BC6A5948ADD3C/c5E406ABE8914222DDD4BC6A5948ADD3C/c5E406ABE8914222DDD4BC6A5948ADD3C/BOwugu06/BOwugu06.jpg");
				ab.push("c5E406ABE8914222DDD4BC6A5948ADD3C/c5E406ABE8914222DDD4BC6A5948ADD3C/c5E406ABE8914222DDD4BC6A5948ADD3C/BOwugu06/BOwugu06.3ds");
				ab.push(3000);
				ab.push(50);
				ab.push(2600);
			this.CreateObj(ab);
		};

		this.CreateSharp = function(sharp)
		{
			var ab = new Array();
			if("rectangle" == sharp)
			{
				ab.push("正方形");
				ab.push("c7FD0518E09022244380676182C5305E7/cBD1EE7348E86F34ADDAA87B41EEE480E/cF8547BCEA29CEDE49CA3A44B5F341604/HIdia001/HIdia001.jpg");
				ab.push("c7FD0518E09022244380676182C5305E7/cBD1EE7348E86F34ADDAA87B41EEE480E/cF8547BCEA29CEDE49CA3A44B5F341604/HIdia001/HIdia001.3ds");
				ab.push(2000);
				ab.push(1000);
				ab.push(30);
			}
			else if("rectangleV" == sharp)
			{
				ab.push("正方形");
				ab.push("c7FD0518E09022244380676182C5305E7/cBD1EE7348E86F34ADDAA87B41EEE480E/c84F77018E4CD211E0DAAA39F89C3B98C/HUIan001/HUIan001.jpg");
				ab.push("c7FD0518E09022244380676182C5305E7/cBD1EE7348E86F34ADDAA87B41EEE480E/c84F77018E4CD211E0DAAA39F89C3B98C/HUIan001/HUIan001.3ds");
				ab.push(2000);
				ab.push(30);
				ab.push(1000);
			}
            else if("ellipse" == sharp)
			{
				ab.push("椭圆形");
				ab.push("c7FD0518E09022244380676182C5305E7/cBD1EE7348E86F34ADDAA87B41EEE480E/cF8547BCEA29CEDE49CA3A44B5F341604/HIdia002/HIdia002.jpg");
				ab.push("c7FD0518E09022244380676182C5305E7/cBD1EE7348E86F34ADDAA87B41EEE480E/cF8547BCEA29CEDE49CA3A44B5F341604/HIdia002/HIdia002.3ds");
				ab.push(2000);
				ab.push(1000);
				ab.push(30);
			}
			else if("ellipseV" == sharp)
			{
				ab.push("椭圆形");
				ab.push("c7FD0518E09022244380676182C5305E7/cBD1EE7348E86F34ADDAA87B41EEE480E/c84F77018E4CD211E0DAAA39F89C3B98C/HUIan002/HUIan002.jpg");
				ab.push("c7FD0518E09022244380676182C5305E7/cBD1EE7348E86F34ADDAA87B41EEE480E/c84F77018E4CD211E0DAAA39F89C3B98C/HUIan002/HUIan002.3ds");
				ab.push(2000);
				ab.push(30);
				ab.push(1000);
			}
			else if("triangle" == sharp)
			{
				ab.push("三角形");
				ab.push("c7FD0518E09022244380676182C5305E7/cBD1EE7348E86F34ADDAA87B41EEE480E/cF8547BCEA29CEDE49CA3A44B5F341604/HIdia003/HIdia003.jpg");
				ab.push("c7FD0518E09022244380676182C5305E7/cBD1EE7348E86F34ADDAA87B41EEE480E/cF8547BCEA29CEDE49CA3A44B5F341604/HIdia003/HIdia003.3ds");
				ab.push(1905);
				ab.push(1650);
				ab.push(30);
			}
			else if("triangleV" == sharp)
			{
				ab.push("三角形");
				ab.push("c7FD0518E09022244380676182C5305E7/cBD1EE7348E86F34ADDAA87B41EEE480E/c84F77018E4CD211E0DAAA39F89C3B98C/HUIan003/HUIan003.jpg");
				ab.push("c7FD0518E09022244380676182C5305E7/cBD1EE7348E86F34ADDAA87B41EEE480E/c84F77018E4CD211E0DAAA39F89C3B98C/HUIan003/HUIan003.3ds");
				ab.push(1905);
				ab.push(30);
				ab.push(1650);
			}
			else if("circle" == sharp)
			{
				ab.push("圆形");
				ab.push("c7FD0518E09022244380676182C5305E7/cBD1EE7348E86F34ADDAA87B41EEE480E/cF8547BCEA29CEDE49CA3A44B5F341604/HIdia004/HIdia004.jpg");
				ab.push("c7FD0518E09022244380676182C5305E7/cBD1EE7348E86F34ADDAA87B41EEE480E/cF8547BCEA29CEDE49CA3A44B5F341604/HIdia004/HIdia004.3ds");
				ab.push(2000);
				ab.push(2000);
				ab.push(30);
			}
			else if("circleV" == sharp)
			{
				ab.push("圆形");
				ab.push("c7FD0518E09022244380676182C5305E7/cBD1EE7348E86F34ADDAA87B41EEE480E/c84F77018E4CD211E0DAAA39F89C3B98C/HUIan004/HUIan004.jpg");
				ab.push("c7FD0518E09022244380676182C5305E7/cBD1EE7348E86F34ADDAA87B41EEE480E/c84F77018E4CD211E0DAAA39F89C3B98C/HUIan004/HUIan004.3ds");
				ab.push(2000);
				ab.push(30);
				ab.push(2000);
			}
			else if("semicircle" == sharp)
			{
				ab.push("半圆形");
				ab.push("c7FD0518E09022244380676182C5305E7/cBD1EE7348E86F34ADDAA87B41EEE480E/cF8547BCEA29CEDE49CA3A44B5F341604/HIdia005/HIdia005.jpg");
				ab.push("c7FD0518E09022244380676182C5305E7/cBD1EE7348E86F34ADDAA87B41EEE480E/cF8547BCEA29CEDE49CA3A44B5F341604/HIdia005/HIdia005.3ds");
				ab.push(2000);
				ab.push(1430);
				ab.push(30);
			}
			else if("semicircleV" == sharp)
			{
				ab.push("半圆形");
				ab.push("c7FD0518E09022244380676182C5305E7/cBD1EE7348E86F34ADDAA87B41EEE480E/c84F77018E4CD211E0DAAA39F89C3B98C/HUIan005/HUIan005.jpg");
				ab.push("c7FD0518E09022244380676182C5305E7/cBD1EE7348E86F34ADDAA87B41EEE480E/c84F77018E4CD211E0DAAA39F89C3B98C/HUIan005/HUIan005.3ds");
				ab.push(2000);
				ab.push(30);
				ab.push(1430);
			}
			else if("trapezoid" == sharp)
			{
				ab.push("梯形");
				ab.push("c7FD0518E09022244380676182C5305E7/cBD1EE7348E86F34ADDAA87B41EEE480E/cF8547BCEA29CEDE49CA3A44B5F341604/HIdia006/HIdia006.jpg");
				ab.push("c7FD0518E09022244380676182C5305E7/cBD1EE7348E86F34ADDAA87B41EEE480E/cF8547BCEA29CEDE49CA3A44B5F341604/HIdia006/HIdia006.3ds");
				ab.push(2000);
				ab.push(1000);
				ab.push(30);
			}
			else if("trapezoidV" == sharp)
			{
				ab.push("梯形");
				ab.push("c7FD0518E09022244380676182C5305E7/cBD1EE7348E86F34ADDAA87B41EEE480E/c84F77018E4CD211E0DAAA39F89C3B98C/HUIan006/HUIan006.jpg");
				ab.push("c7FD0518E09022244380676182C5305E7/cBD1EE7348E86F34ADDAA87B41EEE480E/c84F77018E4CD211E0DAAA39F89C3B98C/HUIan006/HUIan006.3ds");
				ab.push(2000);
				ab.push(30);
				ab.push(1000);
			}
			else if("star" == sharp)
			{
				ab.push("星形");
				ab.push("c7FD0518E09022244380676182C5305E7/cBD1EE7348E86F34ADDAA87B41EEE480E/cF8547BCEA29CEDE49CA3A44B5F341604/HIdia007/HIdia007.jpg");
				ab.push("c7FD0518E09022244380676182C5305E7/cBD1EE7348E86F34ADDAA87B41EEE480E/cF8547BCEA29CEDE49CA3A44B5F341604/HIdia007/HIdia007.3ds");
				ab.push(1900);
				ab.push(1800);
				ab.push(30);
			}
			else if("starV" == sharp)
			{
				ab.push("星形");
				ab.push("c7FD0518E09022244380676182C5305E7/cBD1EE7348E86F34ADDAA87B41EEE480E/c84F77018E4CD211E0DAAA39F89C3B98C/HUIan007/HUIan007.jpg");
				ab.push("c7FD0518E09022244380676182C5305E7/cBD1EE7348E86F34ADDAA87B41EEE480E/c84F77018E4CD211E0DAAA39F89C3B98C/HUIan007/HUIan007.3ds");
				ab.push(1900);
				ab.push(30);
				ab.push(1800);
			}

			this.CreateObj(ab);
		};
				
		this.Build = function()
		{
			for( var i=0; i< this.mFurnitureArray.length; i++ )
			{
				this.mFurnitureArray[i].OnUpdate3D();
			}
		};
				
		this.OnClear = function()
		{	
			for( var i=0; i< this.mFurnitureArray.length; i++ )
			{
				this.mFurnitureArray[i].OnDelete();
			}
			this.mFurnitureArray.length = 0;
			this.m_pMoveObjArray.length = 0;
			this.HideObjCtrl();
			this.g_GaiLiQiangJuLi  = null;
			this.OnHideCtrl();
		};
				
		this.Delete = function(tFurniture)
		{			
			var index = this.mFurnitureArray.indexOf(tFurniture);
			if (index > -1) {
    			this.mFurnitureArray.splice(index, 1);
			}	
			tFurniture.OnDelete();
			this.m_pMoveFurniture = null;
			this.HideObjCtrl();
			this.OnHideCtrl();
		};
						
		// 2D下拾取
		this.OnPick2D = function(mouseX,mouseY)
		{
			
			// 点击输入数字区域,保持显示
			this.g_GaiLiQiangJuLi = this.OnShowHelp(mouseX,mouseY);
			if( (this.g_GaiLiQiangJuLi == this.m_LineLeft_Box ||
				this.g_GaiLiQiangJuLi == this.m_LineRight_Box ||
				this.g_GaiLiQiangJuLi == this.m_LineTop_Box ||
				this.g_GaiLiQiangJuLi == this.m_LineBottom_Box) && this.g_GaiLiQiangJuLi)
			{
				return true;
			}	
		
			this.mCurMouseX = 0;
			this.mCurMouseY = 0;
			this.m_pMoveFurniture = null;			 
			raycaster.setFromCamera( mouse, mCameraClass.m_Camera );
			
			let tDis  = 99999;
			for(var k= 0; k<this.mFurnitureArray.length; k++)
			{
				var Intersections = raycaster.intersectObject( this.mFurnitureArray[k].m_RenderData2D, true );
				if (Intersections.length > 0) 
				{	
					if( tDis > Intersections[0].distance)
					{
						tDis = Intersections[0].distance;
						this.m_pMoveFurniture = this.mFurnitureArray[k];
						this.m_pCurFurniture = this.mFurnitureArray[k];
						
						// 2D操作窗
						this.mCurMouseX = mouseX;
						this.mCurMouseY = mouseY;
						this.m_fLeftOld = 0;
						this.m_fRightOld= 0;
						this.m_fTopOld	= 0;
						this.m_fBottomOld=0;

						this.m_pMoveFurniture.m_vPos.x = this.m_pMoveFurniture.m_Object3D.position.x;
						this.m_pMoveFurniture.m_vPos.z = this.m_pMoveFurniture.m_Object3D.position.y;
						this.m_pMoveFurniture.m_vPos.y =-this.m_pMoveFurniture.m_Object3D.position.z;
						this.OnShowCtrl(this.m_pMoveFurniture);	//  操作框	
						
					}							
				}
			}
	 			 			 
			if( this.m_pMoveFurniture)	// 锁定无法移动
			{	
				if(this.m_pMoveFurniture.m_uuid == 'pingjietiao')
					return false;
				this.mCurMouseX = g_mouseX;
				this.mCurMouseY = g_mouseY;		
				return true;
			}
			//OnMouseRightUp();
		 	mHouseClass.mFurnitureClass.OnUpdateAix(999999,999999,1,1,1);
		 	m_ParamObjDlg.HideBar();
			return false;
		};
				
		this.OnMouseMove = function(mouseX,mouseY,e)
		{
			// 2D下移动物体
			if(e.buttons == 1 && this.m_pMoveFurniture != null)
			{		
				if( this.m_pMoveFurniture .m_Locking == true)	// 锁定无法移动
				return;
				
				//2D移动时的模型
				m_ParamObjDlg.ShowBar(this.m_pMoveFurniture);
				bMouseUp2D = true;
				// 水平操作
				var iNum = this.m_pMoveFurniture.m_fRotate*180/Math.PI%180;
				if(iNum == 0 )
				{
					switch( this.m_iSelected )
					{
						case 0:	// 整体移动
						{		
							this.m_pMoveFurniture.m_vPos.x += mouseX-this.mCurMouseX;
							this.m_pMoveFurniture.m_vPos.y += mouseY-this.mCurMouseY;	
							this.m_pMoveFurniture.UpdateFlue();
						}
						break;
						case 1:	// 左下
						{
							this.m_pMoveFurniture.m_fLength-= (mouseX-this.mCurMouseX)*10;
							this.m_pMoveFurniture.m_fWidth -= (mouseY-this.mCurMouseY)*10;
							this.m_pMoveFurniture.m_vPos.x += (mouseX-this.mCurMouseX)/2;
							this.m_pMoveFurniture.m_vPos.y += (mouseY-this.mCurMouseY)/2;
							this.m_pMoveFurniture.UpdateFlue();
						}
						break;	
						case 2:	// 左上
						{
							this.m_pMoveFurniture.m_fLength-= (mouseX-this.mCurMouseX)*10;
							this.m_pMoveFurniture.m_fWidth += (mouseY-this.mCurMouseY)*10;
							this.m_pMoveFurniture.m_vPos.x += (mouseX-this.mCurMouseX)/2;
							this.m_pMoveFurniture.m_vPos.y += (mouseY-this.mCurMouseY)/2;
							this.m_pMoveFurniture.UpdateFlue();
						}
						break;
						case 3: // 右上
						{
							this.m_pMoveFurniture.m_fLength+= (mouseX-this.mCurMouseX)*10;
							this.m_pMoveFurniture.m_fWidth += (mouseY-this.mCurMouseY)*10;
							this.m_pMoveFurniture.m_vPos.x += (mouseX-this.mCurMouseX)/2;
							this.m_pMoveFurniture.m_vPos.y += (mouseY-this.mCurMouseY)/2;
							this.m_pMoveFurniture.UpdateFlue();					
						}
						break;
						case 4:
						{
							this.m_pMoveFurniture.m_fLength+= (mouseX-this.mCurMouseX)*10;
							this.m_pMoveFurniture.m_fWidth -= (mouseY-this.mCurMouseY)*10;
							this.m_pMoveFurniture.m_vPos.x += (mouseX-this.mCurMouseX)/2;
							this.m_pMoveFurniture.m_vPos.y += (mouseY-this.mCurMouseY)/2;
							this.m_pMoveFurniture.UpdateFlue();					
						}
						break;
						case 5:	// 左中
						{
							this.m_pMoveFurniture.m_fLength-= (mouseX-this.mCurMouseX)*10;
							this.m_pMoveFurniture.m_vPos.x += (mouseX-this.mCurMouseX)/2;
							this.m_pMoveFurniture.UpdateFlue();
						}
						break;
						case 6:	// 下中
						{
							this.m_pMoveFurniture.m_fWidth-= (mouseY-this.mCurMouseY)*10;
							this.m_pMoveFurniture.m_vPos.y+= (mouseY-this.mCurMouseY)/2;
							this.m_pMoveFurniture.UpdateFlue();
						}
						break;	
						case 7:	// 上中
						{
							this.m_pMoveFurniture.m_fWidth+= (mouseY-this.mCurMouseY)*10;
							this.m_pMoveFurniture.m_vPos.y+= (mouseY-this.mCurMouseY)/2;
							this.m_pMoveFurniture.UpdateFlue();
						}
						break;				
						case 8:	// 右中
						{
							this.m_pMoveFurniture.m_fLength+= (mouseX-this.mCurMouseX)*10;
							this.m_pMoveFurniture.m_vPos.x += (mouseX-this.mCurMouseX)/2;
							this.m_pMoveFurniture.UpdateFlue();
						}
						break;				
					}
				}
				else	// 垂直
				{
					switch( this.m_iSelected )
					{
						case 0:	// 整体移动
						{					
							this.m_pMoveFurniture.m_vPos.x += mouseX-this.mCurMouseX;
							this.m_pMoveFurniture.m_vPos.y += mouseY-this.mCurMouseY;	
							this.m_pMoveFurniture.UpdateFlue();
						}
						break;
						case 1:	// 左下
						{
							this.m_pMoveFurniture.m_fWidth -= (mouseX-this.mCurMouseX)*10;
							this.m_pMoveFurniture.m_fLength-= (mouseY-this.mCurMouseY)*10;
							this.m_pMoveFurniture.m_vPos.x += (mouseX-this.mCurMouseX)/2;
							this.m_pMoveFurniture.m_vPos.y += (mouseY-this.mCurMouseY)/2;
							this.m_pMoveFurniture.UpdateFlue();
						}
						break;	
						case 2:	// 左上
						{
							this.m_pMoveFurniture.m_fWidth -= (mouseX-this.mCurMouseX)*10;
							this.m_pMoveFurniture.m_fLength+= (mouseY-this.mCurMouseY)*10;
							this.m_pMoveFurniture.m_vPos.x += (mouseX-this.mCurMouseX)/2;
							this.m_pMoveFurniture.m_vPos.y += (mouseY-this.mCurMouseY)/2;
							this.m_pMoveFurniture.UpdateFlue();
						}
						break;
						case 3: // 右上
						{
							this.m_pMoveFurniture.m_fWidth += (mouseX-this.mCurMouseX)*10;
							this.m_pMoveFurniture.m_fLength+= (mouseY-this.mCurMouseY)*10;
							this.m_pMoveFurniture.m_vPos.x += (mouseX-this.mCurMouseX)/2;
							this.m_pMoveFurniture.m_vPos.y += (mouseY-this.mCurMouseY)/2;
							this.m_pMoveFurniture.UpdateFlue();					
						}
						break;
						case 4:
						{
							this.m_pMoveFurniture.m_fWidth += (mouseX-this.mCurMouseX)*10;
							this.m_pMoveFurniture.m_fLength-= (mouseY-this.mCurMouseY)*10;
							this.m_pMoveFurniture.m_vPos.x += (mouseX-this.mCurMouseX)/2;
							this.m_pMoveFurniture.m_vPos.y += (mouseY-this.mCurMouseY)/2;
							this.m_pMoveFurniture.UpdateFlue();					
						}
						break;
						case 5:	// 左中
						{
							this.m_pMoveFurniture.m_fWidth -= (mouseX-this.mCurMouseX)*10;
							this.m_pMoveFurniture.m_vPos.x += (mouseX-this.mCurMouseX)/2;
							this.m_pMoveFurniture.UpdateFlue();
						}
						break;
						case 6:	// 下中
						{
							this.m_pMoveFurniture.m_fLength-=(mouseY-this.mCurMouseY)*10;
							this.m_pMoveFurniture.m_vPos.y+= (mouseY-this.mCurMouseY)/2;
							this.m_pMoveFurniture.UpdateFlue();
						}
						break;	
						case 7:	// 上中
						{
							this.m_pMoveFurniture.m_fLength+=(mouseY-this.mCurMouseY)*10;
							this.m_pMoveFurniture.m_vPos.y+= (mouseY-this.mCurMouseY)/2;
							this.m_pMoveFurniture.UpdateFlue();
						}
						break;				
						case 8:	// 右中
						{
							this.m_pMoveFurniture.m_fWidth+= (mouseX-this.mCurMouseX)*10;
							this.m_pMoveFurniture.m_vPos.x+= (mouseX-this.mCurMouseX)/2;
							this.m_pMoveFurniture.UpdateFlue();
						}
						break;				
					}				
				}
			 	this.OnShowCtrl(this.m_pMoveFurniture);
				this.mCurMouseX = mouseX;
				this.mCurMouseY = mouseY;	
				return true;
			}
			return false;
		};
		
		/**
		 * @api OnShowHelp(mouseX,mouseY)
		 * @apiGroup FurnitureClass
		 * @apiDescription 显示帮助
		 * @apiParam (参数) mouseX  鼠标X值
		 * @apiParam (参数) mouseY  鼠标Y值                           
		 */		
		this.OnShowHelp = function(mouseX, mouseY)
		{
			// 鼠标移动上去显示高亮
			$('#container' ).css("cursor","default");

			if(this.m_LineLeft_Box != undefined && this.m_LineLeft_Box != null)
			   this.m_LineLeft_Box.material.color.set(0x0088F8);
			if(this.m_LineRight_Box!= undefined && this.m_LineRight_Box != null)
			   this.m_LineRight_Box.material.color.set(0x0088F8);
			if(this.m_LineTop_Box  != undefined && this.m_LineTop_Box != null)   
			   this.m_LineTop_Box.material.color.set(0x0088F8);
			if(this.m_LineBottom_Box!= undefined&& this.m_LineBottom_Box != null)
			   this.m_LineBottom_Box.material.color.set(0x0088F8);
			
			for(var j=0; j<this.mFurnitureArray.length; j++)
				this.mFurnitureArray[j].OnChangeColor2D(0xffffff);	//恢复颜色
			
			// 整体移动
			for( j=0; j<this.mFurnitureArray.length; j++)
			{
				var Intersections = raycaster.intersectObject(  this.mFurnitureArray[j].m_RenderData2D );
				if(Intersections.length>0)
				{		
					$('#container' ).css("cursor","move");							
					this.OnShowCtrl_Cursor(this.mFurnitureArray[j],mouseX, mouseY);
					return this.mFurnitureArray[j];
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
			if(this.m_LineTop_Box  != undefined && this.m_LineTop_Box != null) 
			{
				Intersections = raycaster.intersectObject(  this.m_LineTop_Box1 );
				if(Intersections.length>0)
				{		
					$('#container' ).css("cursor","text");					  
					this.m_LineTop_Box.material.color.set(0xffff88);
					return this.m_LineTop_Box;
				}
			}
			
			if(this.m_LineBottom_Box!= undefined&& this.m_LineBottom_Box != null)
			{
				Intersections = raycaster.intersectObject(  this.m_LineBottom_Box1 );
				if(Intersections.length>0)
				{		
					$('#container' ).css("cursor","text");				
					this.m_LineBottom_Box.material.color.set(0xffff88); 
					return this.m_LineBottom_Box;
				}
			}
			return null;
		};
			
		this.OnShowCtrl_Cursor = function(tFlue,mouseX, mouseY)
		{
			// 显示
			this.m_iSelected = 0;
			if(this.m_HelpBox1== undefined)
				return;
							
			var Intersections = raycaster.intersectObject( this.m_HelpBox1 );
			if(Intersections.length>0)
			{		
				var tPos = new THREE.Vector3(this.m_HelpBox1.position.x,this.m_HelpBox1.position.y,1);
				this.OnUpdateCtrl(tFlue,tPos);
				return;
			}
			
			Intersections = raycaster.intersectObject( this.m_HelpBox2 );
			if(Intersections.length>0)
			{		
				var tPos = new THREE.Vector3(this.m_HelpBox2.position.x,this.m_HelpBox2.position.y,1);
				this.OnUpdateCtrl(tFlue,tPos);
				return;
			}	
			
			Intersections = raycaster.intersectObject( this.m_HelpBox3 );
			if(Intersections.length>0)
			{		
				var tPos = new THREE.Vector3(this.m_HelpBox3.position.x,this.m_HelpBox3.position.y,1);
				this.OnUpdateCtrl(tFlue,tPos);
				return;
			}
			
			Intersections = raycaster.intersectObject( this.m_HelpBox4 );
			if(Intersections.length>0)
			{		
				var tPos = new THREE.Vector3(this.m_HelpBox4.position.x,this.m_HelpBox4.position.y,1);
				this.OnUpdateCtrl(tFlue,tPos);
				return;
			}
			
			Intersections = raycaster.intersectObject( this.m_HelpBox5 );	// 左中
			if(Intersections.length>0)
			{		
				var tPos = new THREE.Vector3(this.m_HelpBox5.position.x,this.m_HelpBox5.position.y,1);
				this.OnUpdateCtrl(tFlue,tPos);
				return;
			}
			
			Intersections = raycaster.intersectObject( this.m_HelpBox6 );	// 下中
			if(Intersections.length>0)
			{		
				var tPos = new THREE.Vector3(this.m_HelpBox6.position.x,this.m_HelpBox6.position.y,1);
				this.OnUpdateCtrl(tFlue,tPos);
				return;
			}
			
			Intersections = raycaster.intersectObject( this.m_HelpBox7 );	// 上中
			if(Intersections.length>0)
			{		
				var tPos = new THREE.Vector3(this.m_HelpBox7.position.x,this.m_HelpBox7.position.y,1);
				this.OnUpdateCtrl(tFlue,tPos);
				return;
			}
			
			Intersections = raycaster.intersectObject( this.m_HelpBox8 );	// 右中
			if(Intersections.length>0)
			{		
				var tPos = new THREE.Vector3(this.m_HelpBox8.position.x,this.m_HelpBox8.position.y,1);
				this.OnUpdateCtrl(tFlue,tPos);
				return;
			}
		};
		
		this.OnUpdateCtrl = function(tFlue,tPos)
		{
			var box = new THREE.Box3();
				box.setFromObject( tFlue.m_RenderData2D );
							
			var tmpMatrix1= new THREE.Matrix4().makeRotationZ(tFlue.m_fRotate*Math.PI/180);
			var tmpMatrix2= new THREE.Matrix4().makeTranslation(tFlue.m_RenderData2D.position.x,tFlue.m_RenderData2D.position.y,1);
				tmpMatrix2.multiply(tmpMatrix1);
			tPos = tPos.applyMatrix4(tmpMatrix2);
							
			if(Math.abs(tPos.x -box.min.x)<0.1&&Math.abs(tPos.y-box.min.y)<0.1 )
			{
				$('#container' ).css("cursor","ne-resize");
				this.m_iSelected = 1;
				return;
			}
			
			if(Math.abs(tPos.x -box.min.x)<0.1&&Math.abs(tPos.y -box.max.y)<0.1 )
			{
				$('#container' ).css("cursor","se-resize");
				this.m_iSelected = 2;
				return;
			}		
			
			if(Math.abs(tPos.x -box.max.x)<0.1&&Math.abs(tPos.y -box.max.y)<0.1 )
			{
				$('#container' ).css("cursor","ne-resize");
				this.m_iSelected = 3;
				return;
			}	
			
			if(Math.abs(tPos.x -box.max.x)<0.1&&Math.abs(tPos.y -box.min.y)<0.1 )
			{
				$('#container' ).css("cursor","se-resize");
				this.m_iSelected = 4;
				return;
			}	
			
			if(Math.abs(tPos.x -box.min.x)<0.1&&Math.abs(tPos.y -(box.max.y+box.min.y)/2)<0.1 )
			{
				$('#container' ).css("cursor","w-resize");
				this.m_iSelected = 5;
				return;
			}
			
			if(Math.abs(tPos.x -(box.max.x+box.min.x)/2)<0.1&&Math.abs(tPos.y -box.min.y)<0.1 )
			{
				$('#container' ).css("cursor","s-resize");
				this.m_iSelected = 6;
				return;
			}	
			
			if(Math.abs(tPos.x -(box.max.x+box.min.x)/2)<0.1&&Math.abs(tPos.y -box.max.y)<0.1 )
			{
				$('#container' ).css("cursor","s-resize");
				this.m_iSelected = 7;
				return;
			}
			
			if(Math.abs(tPos.x -box.max.x)<0.1&&Math.abs(tPos.y -(box.max.y+box.min.y)/2)<0.1 )
			{
				$('#container' ).css("cursor","w-resize");
				this.m_iSelected = 8;
				return;
			}	
		};		
		this.OnShowCtrl = function(tFlue)
		{
			// 平面下,显示2D操作系统
			this.m_HelpBox.remove(this.m_HelpBox1);
			this.m_HelpBox.remove(this.m_HelpBox2);
			this.m_HelpBox.remove(this.m_HelpBox3);
			this.m_HelpBox.remove(this.m_HelpBox4);
			this.m_HelpBox.remove(this.m_HelpBox5);
			this.m_HelpBox.remove(this.m_HelpBox6);
			this.m_HelpBox.remove(this.m_HelpBox7);
			this.m_HelpBox.remove(this.m_HelpBox8);
			
			this.m_HelpBox.geometry.vertices.length = 0;
			this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(-tFlue.m_fLength/20, -tFlue.m_fWidth/20, 1.3), new THREE.Vector3(-tFlue.m_fLength/20, tFlue.m_fWidth/20, 1.3));	
			this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(-tFlue.m_fLength/20,  tFlue.m_fWidth/20, 1.3), new THREE.Vector3( tFlue.m_fLength/20, tFlue.m_fWidth/20, 1.3));
			this.m_HelpBox.geometry.vertices.push(new THREE.Vector3( tFlue.m_fLength/20,  tFlue.m_fWidth/20, 1.3), new THREE.Vector3( tFlue.m_fLength/20,-tFlue.m_fWidth/20, 1.3));	
			this.m_HelpBox.geometry.vertices.push(new THREE.Vector3( tFlue.m_fLength/20, -tFlue.m_fWidth/20, 1.3), new THREE.Vector3(-tFlue.m_fLength/20,-tFlue.m_fWidth/20, 1.3));
		
			var k = 4;
			// 方块1 (左下)
			this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(-tFlue.m_fLength/20-k, -tFlue.m_fWidth/20-k, 1.5), new THREE.Vector3(-tFlue.m_fLength/20-k, -tFlue.m_fWidth/20+k, 1.5));
			this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(-tFlue.m_fLength/20-k, -tFlue.m_fWidth/20+k, 1.5), new THREE.Vector3(-tFlue.m_fLength/20+k, -tFlue.m_fWidth/20+k, 1.5));
			this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(-tFlue.m_fLength/20+k, -tFlue.m_fWidth/20+k, 1.5), new THREE.Vector3(-tFlue.m_fLength/20+k, -tFlue.m_fWidth/20-k, 1.5));	
			this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(-tFlue.m_fLength/20+k, -tFlue.m_fWidth/20-k, 1.5), new THREE.Vector3(-tFlue.m_fLength/20-k, -tFlue.m_fWidth/20-k, 1.5));	
	
			var geometry1 	= new THREE.PlaneGeometry( k*2, k*2);
			this.m_HelpBox1	= new THREE.Mesh(geometry1, new THREE.MeshBasicMaterial( { color: 0xFFFFFF } ) ); 
			this.m_HelpBox1.position.x  = -tFlue.m_fLength/20;			
			this.m_HelpBox1.position.y  = -tFlue.m_fWidth/20;
			this.m_HelpBox1.position.z  = 1.4;
			
			// 方块2 (左上)
			this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(-tFlue.m_fLength/20-k, tFlue.m_fWidth/20-k, 1.5), new THREE.Vector3(-tFlue.m_fLength/20-k, tFlue.m_fWidth/20+k, 1.5));
			this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(-tFlue.m_fLength/20-k, tFlue.m_fWidth/20+k, 1.5), new THREE.Vector3(-tFlue.m_fLength/20+k, tFlue.m_fWidth/20+k, 1.5));
			this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(-tFlue.m_fLength/20+k, tFlue.m_fWidth/20+k, 1.5), new THREE.Vector3(-tFlue.m_fLength/20+k, tFlue.m_fWidth/20-k, 1.5));	
			this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(-tFlue.m_fLength/20+k, tFlue.m_fWidth/20-k, 1.5), new THREE.Vector3(-tFlue.m_fLength/20-k, tFlue.m_fWidth/20-k, 1.5));	
			
			var geometry2 	= new THREE.PlaneGeometry( k*2, k*2);
			this.m_HelpBox2	= new THREE.Mesh(geometry2, new THREE.MeshBasicMaterial( { color: 0xFFFFFF } ) ); 
			this.m_HelpBox2.position.x  = -tFlue.m_fLength/20;			
			this.m_HelpBox2.position.y  =  tFlue.m_fWidth/20;
			this.m_HelpBox2.position.z  = 1.4;
			
			// 方块3 (右上)
			this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(tFlue.m_fLength/20-k, tFlue.m_fWidth/20-k, 1.5), new THREE.Vector3(tFlue.m_fLength/20-k, tFlue.m_fWidth/20+k, 1.5));
			this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(tFlue.m_fLength/20-k, tFlue.m_fWidth/20+k, 1.5), new THREE.Vector3(tFlue.m_fLength/20+k, tFlue.m_fWidth/20+k, 1.5));
			this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(tFlue.m_fLength/20+k, tFlue.m_fWidth/20+k, 1.5), new THREE.Vector3(tFlue.m_fLength/20+k, tFlue.m_fWidth/20-k, 1.5));	
			this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(tFlue.m_fLength/20+k, tFlue.m_fWidth/20-k, 1.5), new THREE.Vector3(tFlue.m_fLength/20-k, tFlue.m_fWidth/20-k, 1.5));	
			var geometry3 	= new THREE.PlaneGeometry( k*2, k*2);
			this.m_HelpBox3	= new THREE.Mesh(geometry3, new THREE.MeshBasicMaterial( { color: 0xFFFFFF } ) ); 
			this.m_HelpBox3.position.x  =  tFlue.m_fLength/20;			
			this.m_HelpBox3.position.y  =  tFlue.m_fWidth/20;
			this.m_HelpBox3.position.z  = 1.4;
			
			// 方块4 (右下)
			this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(tFlue.m_fLength/20-k, -tFlue.m_fWidth/20-k, 1.5), new THREE.Vector3(tFlue.m_fLength/20-k, -tFlue.m_fWidth/20+k, 1.5));
			this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(tFlue.m_fLength/20-k, -tFlue.m_fWidth/20+k, 1.5), new THREE.Vector3(tFlue.m_fLength/20+k, -tFlue.m_fWidth/20+k, 1.5));
			this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(tFlue.m_fLength/20+k, -tFlue.m_fWidth/20+k, 1.5), new THREE.Vector3(tFlue.m_fLength/20+k, -tFlue.m_fWidth/20-k, 1.5));	
			this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(tFlue.m_fLength/20+k, -tFlue.m_fWidth/20-k, 1.5), new THREE.Vector3(tFlue.m_fLength/20-k, -tFlue.m_fWidth/20-k, 1.5));	
			var geometry4 	= new THREE.PlaneGeometry( k*2, k*2);
			this.m_HelpBox4	= new THREE.Mesh(geometry4, new THREE.MeshBasicMaterial( { color: 0xFFFFFF } ) ); 
			this.m_HelpBox4.position.x  =  tFlue.m_fLength/20;			
			this.m_HelpBox4.position.y  = -tFlue.m_fWidth/20;
			this.m_HelpBox4.position.z  = 1.4;
			
			
			// 方块5 (左中)
			this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(-tFlue.m_fLength/20-k, 0-k, 1.5), new THREE.Vector3(-tFlue.m_fLength/20-k, 0+k, 1.5));
			this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(-tFlue.m_fLength/20-k, 0+k, 1.5), new THREE.Vector3(-tFlue.m_fLength/20+k, 0+k, 1.5));
			this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(-tFlue.m_fLength/20+k, 0+k, 1.5), new THREE.Vector3(-tFlue.m_fLength/20+k, 0-k, 1.5));	
			this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(-tFlue.m_fLength/20+k, 0-k, 1.5), new THREE.Vector3(-tFlue.m_fLength/20-k, 0-k, 1.5));	
			var geometry5 	= new THREE.PlaneGeometry( k*2, k*2);
			this.m_HelpBox5	= new THREE.Mesh(geometry5, new THREE.MeshBasicMaterial( { color: 0xFFFFFF } ) ); 
			this.m_HelpBox5.position.x  = -tFlue.m_fLength/20;			
			this.m_HelpBox5.position.y  = 0;
			this.m_HelpBox5.position.z  = 1.4;		
			
			// 方块6 (下中)
			this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(0-k, -tFlue.m_fWidth/20-k, 1.5), new THREE.Vector3(0-k, -tFlue.m_fWidth/20+k, 1.5));
			this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(0-k, -tFlue.m_fWidth/20+k, 1.5), new THREE.Vector3(0+k, -tFlue.m_fWidth/20+k, 1.5));
			this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(0+k, -tFlue.m_fWidth/20+k, 1.5), new THREE.Vector3(0+k, -tFlue.m_fWidth/20-k, 1.5));	
			this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(0+k, -tFlue.m_fWidth/20-k, 1.5), new THREE.Vector3(0-k, -tFlue.m_fWidth/20-k, 1.5));	
			var geometry6 	= new THREE.PlaneGeometry( k*2, k*2);
			this.m_HelpBox6	= new THREE.Mesh(geometry6, new THREE.MeshBasicMaterial( { color: 0xFFFFFF } ) ); 
			this.m_HelpBox6.position.x  = 0;			
			this.m_HelpBox6.position.y  = -tFlue.m_fWidth/20;
			this.m_HelpBox6.position.z  = 1.4;		
			
			// 方块7 (上中)
			this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(0-k, tFlue.m_fWidth/20-k, 1.5), new THREE.Vector3(0-k, tFlue.m_fWidth/20+k, 1.5));
			this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(0-k, tFlue.m_fWidth/20+k, 1.5), new THREE.Vector3(0+k, tFlue.m_fWidth/20+k, 1.5));
			this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(0+k, tFlue.m_fWidth/20+k, 1.5), new THREE.Vector3(0+k, tFlue.m_fWidth/20-k, 1.5));	
			this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(0+k, tFlue.m_fWidth/20-k, 1.5), new THREE.Vector3(0-k, tFlue.m_fWidth/20-k, 1.5));	
			var geometry7 	= new THREE.PlaneGeometry( k*2, k*2);
			this.m_HelpBox7	= new THREE.Mesh(geometry6, new THREE.MeshBasicMaterial( { color: 0xFFFFFF } ) ); 
			this.m_HelpBox7.position.x  = 0;			
			this.m_HelpBox7.position.y  = tFlue.m_fWidth/20;
			this.m_HelpBox7.position.z  = 1.4;	
			
			// 方块8 (右中)
			this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(tFlue.m_fLength/20-k, 0-k, 1.5), new THREE.Vector3(tFlue.m_fLength/20-k, 0+k, 1.5));
			this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(tFlue.m_fLength/20-k, 0+k, 1.5), new THREE.Vector3(tFlue.m_fLength/20+k, 0+k, 1.5));
			this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(tFlue.m_fLength/20+k, 0+k, 1.5), new THREE.Vector3(tFlue.m_fLength/20+k, 0-k, 1.5));	
			this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(tFlue.m_fLength/20+k, 0-k, 1.5), new THREE.Vector3(tFlue.m_fLength/20-k, 0-k, 1.5));	
			var geometry8 	= new THREE.PlaneGeometry( k*2, k*2);
			this.m_HelpBox8	= new THREE.Mesh(geometry6, new THREE.MeshBasicMaterial( { color: 0xFFFFFF } ) ); 
			this.m_HelpBox8.position.x  = tFlue.m_fLength/20;			
			this.m_HelpBox8.position.y  = 0;
			this.m_HelpBox8.position.z  = 1.4;			
			
			this.m_HelpBox.geometry.verticesNeedUpdate = true;
			
			this.m_HelpBox.add(this.m_HelpBox1);
			this.m_HelpBox.add(this.m_HelpBox2);
			this.m_HelpBox.add(this.m_HelpBox3);
			this.m_HelpBox.add(this.m_HelpBox4);
			this.m_HelpBox.add(this.m_HelpBox5);
			this.m_HelpBox.add(this.m_HelpBox6);
			this.m_HelpBox.add(this.m_HelpBox7);
			this.m_HelpBox.add(this.m_HelpBox8);
			

			var tmpMatrix2= new THREE.Matrix4().makeRotationZ(tFlue.m_fRotate*Math.PI/180);
			var tmpMatrix3= new THREE.Matrix4().makeTranslation(tFlue.m_Object3D.position.x,-tFlue.m_Object3D.position.z,1.5);
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
			
			// 显示离墙距离
			this.UpdateLabel(tFlue);	//更新到四边的距离 
			
		};
		
		/**
		 * @api UpdateLabel
		 * @apiGroup FurnitureClass
		 * @apiDescription 更新模型到四边的距离
		 * @apiParam (参数) tFlue  当前模型
		 *                             
		 */
		this.UpdateLabel = function(tFlue)
		{
			
			//得到当前所在地面
			var vPos1 = new THREE.Vector3( tFlue.m_RenderData2D.position.x, tFlue.m_RenderData2D.position.y, 10 );
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
			
			this.m_LineLeft.visible   = false;
			this.m_LineRight.visible  = false;
			this.m_LineTop.visible 	  = false;
			this.m_LineBottom.visible = false;			
			
			if( tFloor == null )// 无过没有地面，则不显示尺寸
				return;
			
			var box = new THREE.Box3();
				box.setFromObject( tFlue.m_RenderData2D );
				
			var posStart1 = new THREE.Vector3(box.min.x,   (box.max.y+box.min.y)/2, 0);
			var posEnd1   = new THREE.Vector3(box.min.x-1, (box.max.y+box.min.y)/2, 0);
			var posStart2 = new THREE.Vector3(box.max.x,   (box.max.y+box.min.y)/2, 0);
			var posEnd2   = new THREE.Vector3(box.max.x+1, (box.max.y+box.min.y)/2, 0);	
			var posStart3 = new THREE.Vector3((box.max.x+box.min.x)/2, box.max.y, 	0);
			var posEnd3   = new THREE.Vector3((box.max.x+box.min.x)/2, box.max.y+1, 0);			
			var posStart4 = new THREE.Vector3((box.max.x+box.min.x)/2, box.min.y, 	0);
			var posEnd4   = new THREE.Vector3((box.max.x+box.min.x)/2, box.min.y-1, 0);			
			var fLeft  = this.GetLiQiangJuLi(posStart1, posEnd1, tFloor);
			var fRight = this.GetLiQiangJuLi(posStart2, posEnd2, tFloor);
			var fTop   = this.GetLiQiangJuLi(posStart3, posEnd3, tFloor);
			var fBottom= this.GetLiQiangJuLi(posStart4, posEnd4, tFloor);
			
			this.m_fLeftOld  = fLeft;
			this.m_fRightOld = fRight;
			this.m_fTopOld	 = fTop;
			this.m_fBottomOld= fBottom;
	
			if( fLeft !=9999999)
				this.m_LineLeft.visible   = true;
			if( fRight !=9999999)	
				this.m_LineRight.visible  = true;
			if( fTop !=9999999)
				this.m_LineTop.visible 	  = true;
			if( fBottom !=9999999)
				this.m_LineBottom.visible = true;
					
			this.m_LineLeft.geometry.vertices.length 	= 0;
			this.m_LineRight.geometry.vertices.length 	= 0;
			this.m_LineTop.geometry.vertices.length 	= 0;
			this.m_LineBottom.geometry.vertices.length 	= 0;
								
			this.m_LineLeft.geometry.vertices.push(new THREE.Vector3(box.min.x, (box.max.y+box.min.y)/2, 1), 
												   new THREE.Vector3(box.min.x-fLeft, (box.max.y+box.min.y)/2, 1));
			this.m_LineLeft.geometry.verticesNeedUpdate = true;
			
			this.m_LineRight.geometry.vertices.push(new THREE.Vector3(box.max.x, (box.max.y+box.min.y)/2, 1), 
													new THREE.Vector3(box.max.x+fRight, (box.max.y+box.min.y)/2, 1));
			this.m_LineRight.geometry.verticesNeedUpdate = true;
			
			this.m_LineTop.geometry.vertices.push(new THREE.Vector3((box.max.x+box.min.x)/2, box.max.y, 1), 
												  new THREE.Vector3((box.max.x+box.min.x)/2, box.max.y+fTop, 1));
			this.m_LineTop.geometry.verticesNeedUpdate 	= true;
			
			this.m_LineBottom.geometry.vertices.push(new THREE.Vector3((box.max.x+box.min.x)/2, box.min.y, 1), 
													 new THREE.Vector3((box.max.x+box.min.x)/2, box.min.y-fBottom, 0, 1));
			this.m_LineBottom.geometry.verticesNeedUpdate = true;		
				
			this.ShowText(tFlue,fLeft,	0);
			this.ShowText(tFlue,fRight,	1);
			this.ShowText(tFlue,fTop,	2);
			this.ShowText(tFlue,fBottom,3);
		};	
		
		this.ShowText = function(tFlue,fValue,iType)
		{
			var box = new THREE.Box3();
				box.setFromObject( tFlue.m_RenderData2D );
					
			switch(iType)	// 显示离墙距离
			{
				case 0:
				{
					this.m_LineLeft.remove(this.m_LineLeft_Label);
					
					this.m_strLeft_Value = parseInt(fValue).toString();		// 距离值
	
					// 左边数字
					var shapes = mHouseClass.mFont.generateShapes( parseInt(fValue).toString(), 8 );
					var geometryText = new THREE.ShapeBufferGeometry( shapes );
						geometryText.computeBoundingBox();
					var tWidth = geometryText.boundingBox.max.x - geometryText.boundingBox.min.x;
					var tHeight= geometryText.boundingBox.max.y - geometryText.boundingBox.min.y;		
					geometryText.translate( - 0.5 * tWidth, -0.5*tHeight, 1.2 );
					this.m_LineLeft_Label = new THREE.Mesh( geometryText, mResource.mFontTex );	// 数字mesh
					
					var geometry  = new THREE.BoxBufferGeometry( tWidth+10, tHeight+10, 0);
					geometry.translate( 0, 0, 0.5 );
					// 数字的灰色背景
				  	this.m_LineLeft_Box1= new THREE.Mesh(geometry, new THREE.MeshBasicMaterial( { color: 0xeeeeee, opacity: 1.0, transparent: true } ) ); 
					var tPoly = new THREE.Geometry();					
					tPoly.vertices.push(new THREE.Vector3(-(tWidth+10)/2, -(tHeight+10)/2, 1), new THREE.Vector3(-(tWidth+10)/2, (tHeight+10)/2, 1));				
					tPoly.vertices.push(new THREE.Vector3( (tWidth+10)/2,  (tHeight+10)/2, 1), new THREE.Vector3( (tWidth+10)/2,-(tHeight+10)/2, 1));						
					tPoly.vertices.push(new THREE.Vector3(-(tWidth+10)/2, -(tHeight+10)/2, 1));
					// 数字框线
					this.m_LineLeft_Box = new THREE.Line( tPoly, new THREE.LineBasicMaterial( { color: 0x0088F8, linewidth:1, opacity: 1 } ) );
					
					this.m_LineLeft_Label.add(this.m_LineLeft_Box1);
					this.m_LineLeft_Label.add(this.m_LineLeft_Box);
					this.m_LineLeft_Label.position.x  = box.min.x-fValue/2;			
					this.m_LineLeft_Label.position.y  = (box.max.y+box.min.y)/2;				
					this.m_LineLeft.add(this.m_LineLeft_Label);
				}
				break;
				case 1:
				{
					this.m_LineRight.remove(this.m_LineRight_Label);
					
					this.m_strRight_Value = parseInt(fValue).toString();	// 距离值
					
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
					this.m_LineRight_Label.position.x  = box.max.x+fValue/2;			
					this.m_LineRight_Label.position.y  = (box.max.y+box.min.y)/2;	
					//===========================================================================================================================		
					this.m_LineRight.add(this.m_LineRight_Label);
				}
				break;
				case 2:
				{
					this.m_LineTop.remove(this.m_LineTop_Label);
					this.m_strTop_Value = parseInt(fValue).toString();
							
					// 顶部数字
					//===========================================================================================================================
					var shapes2 = mHouseClass.mFont.generateShapes( parseInt(fValue).toString(), 8 );
					var geometryText2 = new THREE.ShapeBufferGeometry( shapes2 );
						geometryText2.computeBoundingBox();
					tWidth = geometryText2.boundingBox.max.x - geometryText2.boundingBox.min.x;
					tHeight= geometryText2.boundingBox.max.y - geometryText2.boundingBox.min.y;		
					geometryText2.translate( - 0.5 * tWidth, -0.5*tHeight, 1.2 );
					this.m_LineTop_Label = new THREE.Mesh( geometryText2, mResource.mFontTex );
					
					var geometry2  = new THREE.BoxBufferGeometry( tWidth+10, tHeight+10, 0);
					geometry2.translate( 0, 0, 0.5 );
				  	this.m_LineTop_Box1= new THREE.Mesh(geometry2, new THREE.MeshBasicMaterial( { color: 0xeeeeee, opacity: 1.0, transparent: true } ) ); 
					this.m_LineTop_Label.add(this.m_LineTop_Box1);
					
					var tPoly2 = new THREE.Geometry();					
					tPoly2.vertices.push(new THREE.Vector3(-(tWidth+10)/2, -(tHeight+10)/2, 1), new THREE.Vector3(-(tWidth+10)/2, (tHeight+10)/2, 1));				
					tPoly2.vertices.push(new THREE.Vector3( (tWidth+10)/2,  (tHeight+10)/2, 1), new THREE.Vector3( (tWidth+10)/2,-(tHeight+10)/2, 1));						
					tPoly2.vertices.push(new THREE.Vector3(-(tWidth+10)/2, -(tHeight+10)/2, 1));
					this.m_LineTop_Box = new THREE.Line( tPoly2, new THREE.LineBasicMaterial( { color: 0x0088F8, linewidth:1, opacity: 1 } ) );
					this.m_LineTop_Label.add(this.m_LineTop_Box);
			
					this.m_LineTop_Label.position.x  = (box.max.x+box.min.x)/2;
					this.m_LineTop_Label.position.y  = box.max.y+fValue/2;	
					//===========================================================================================================================				
					this.m_LineTop.add(this.m_LineTop_Label);
				}
				break;
				case 3:
				{
					this.m_LineBottom.remove(this.m_LineBottom_Label);
					this.m_strBottom_Value = parseInt(fValue).toString();		
					// 底部数字
					//===========================================================================================================================
					var shapes3 = mHouseClass.mFont.generateShapes( parseInt(fValue).toString(), 8 );
					var geometryText3 = new THREE.ShapeBufferGeometry( shapes3 );
						geometryText3.computeBoundingBox();
					tWidth = geometryText3.boundingBox.max.x - geometryText3.boundingBox.min.x;
					tHeight= geometryText3.boundingBox.max.y - geometryText3.boundingBox.min.y;		
					geometryText3.translate( - 0.5 * tWidth, -0.5*tHeight, 1.2 );		
					this.m_LineBottom_Label = new THREE.Mesh( geometryText3, mResource.mFontTex );
					
					var geometry3  = new THREE.BoxBufferGeometry( tWidth+10, tHeight+10, 0);
					geometry3.translate( 0, 0, 0.5 );
				  	this.m_LineBottom_Box1 = new THREE.Mesh(geometry3, new THREE.MeshBasicMaterial( { color: 0xeeeeee, opacity: 1.0, transparent: true } ) ); 
					this.m_LineBottom_Label.add(this.m_LineBottom_Box1);
					var tPoly3 = new THREE.Geometry();					
					tPoly3.vertices.push(new THREE.Vector3(-(tWidth+10)/2, -(tHeight+10)/2, 1), new THREE.Vector3(-(tWidth+10)/2, (tHeight+10)/2, 1));				
					tPoly3.vertices.push(new THREE.Vector3( (tWidth+10)/2,  (tHeight+10)/2, 1), new THREE.Vector3( (tWidth+10)/2,-(tHeight+10)/2, 1));						
					tPoly3.vertices.push(new THREE.Vector3(-(tWidth+10)/2, -(tHeight+10)/2, 1));
					this.m_LineBottom_Box = new THREE.Line( tPoly3, new THREE.LineBasicMaterial( { color: 0x0088F8, linewidth:1, opacity: 1 } ) );
					this.m_LineBottom_Label.add(this.m_LineBottom_Box);		
					this.m_LineBottom_Label.position.x  = (box.max.x+box.min.x)/2;			
					this.m_LineBottom_Label.position.y  = box.min.y-fValue/2;	
					//===========================================================================================================================				
					this.m_LineBottom.add(this.m_LineBottom_Label);
				}
				break;
			}		
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
				var fx = this.m_LineTop_Label.position.x;
				var fy = this.m_LineTop_Label.position.y;				
				this.m_LineTop.remove(this.m_LineTop_Label);
				this.m_strTop_Value = parseInt(fValue).toString();
						
				// 顶部数字
				//===========================================================================================================================
				var shapes2 = mHouseClass.mFont.generateShapes( parseInt(fValue).toString(), 8 );
				var geometryText2 = new THREE.ShapeBufferGeometry( shapes2 );
					geometryText2.computeBoundingBox();
				tWidth = geometryText2.boundingBox.max.x - geometryText2.boundingBox.min.x;
				tHeight= geometryText2.boundingBox.max.y - geometryText2.boundingBox.min.y;		
				geometryText2.translate( - 0.5 * tWidth, -0.5*tHeight, 1.2 );
				this.m_LineTop_Label = new THREE.Mesh( geometryText2, mResource.mFontTex );
				
				var geometry2  = new THREE.BoxBufferGeometry( tWidth+10, tHeight+10, 0);
				geometry2.translate( 0, 0, 0.5 );
			  	this.m_LineTop_Box1= new THREE.Mesh(geometry2, new THREE.MeshBasicMaterial( { color: 0xeeeeee, opacity: 1.0, transparent: true } ) ); 
				this.m_LineTop_Label.add(this.m_LineTop_Box1);
				
				var tPoly2 = new THREE.Geometry();					
				tPoly2.vertices.push(new THREE.Vector3(-(tWidth+10)/2, -(tHeight+10)/2, 1), new THREE.Vector3(-(tWidth+10)/2, (tHeight+10)/2, 1));				
				tPoly2.vertices.push(new THREE.Vector3( (tWidth+10)/2,  (tHeight+10)/2, 1), new THREE.Vector3( (tWidth+10)/2,-(tHeight+10)/2, 1));						
				tPoly2.vertices.push(new THREE.Vector3(-(tWidth+10)/2, -(tHeight+10)/2, 1));
				this.m_LineTop_Box = new THREE.Line( tPoly2, new THREE.LineBasicMaterial( { color: 0x0088F8, linewidth:1, opacity: 1 } ) );
				this.m_LineTop_Label.add(this.m_LineTop_Box);
		
				this.m_LineTop_Label.position.x  = fx;
				this.m_LineTop_Label.position.y  = fy;	
				//===========================================================================================================================				
				this.m_LineTop.add(this.m_LineTop_Label);
			}
			break;
			case 3:
			{
				var fx = this.m_LineBottom_Label.position.x;
				var fy = this.m_LineBottom_Label.position.y;				
				this.m_LineBottom.remove(this.m_LineBottom_Label);
				this.m_strBottom_Value = parseInt(fValue).toString();		
				// 底部数字
				//===========================================================================================================================
				var shapes3 = mHouseClass.mFont.generateShapes( parseInt(fValue).toString(), 8 );
				var geometryText3 = new THREE.ShapeBufferGeometry( shapes3 );
					geometryText3.computeBoundingBox();
				tWidth = geometryText3.boundingBox.max.x - geometryText3.boundingBox.min.x;
				tHeight= geometryText3.boundingBox.max.y - geometryText3.boundingBox.min.y;		
				geometryText3.translate( - 0.5 * tWidth, -0.5*tHeight, 1.2 );		
				this.m_LineBottom_Label = new THREE.Mesh( geometryText3, mResource.mFontTex );
				
				var geometry3  = new THREE.BoxBufferGeometry( tWidth+10, tHeight+10, 0);
				geometry3.translate( 0, 0, 0.5 );
			  	this.m_LineBottom_Box1 = new THREE.Mesh(geometry3, new THREE.MeshBasicMaterial( { color: 0xeeeeee, opacity: 1.0, transparent: true } ) ); 
				this.m_LineBottom_Label.add(this.m_LineBottom_Box1);
				var tPoly3 = new THREE.Geometry();					
				tPoly3.vertices.push(new THREE.Vector3(-(tWidth+10)/2, -(tHeight+10)/2, 1), new THREE.Vector3(-(tWidth+10)/2, (tHeight+10)/2, 1));				
				tPoly3.vertices.push(new THREE.Vector3( (tWidth+10)/2,  (tHeight+10)/2, 1), new THREE.Vector3( (tWidth+10)/2,-(tHeight+10)/2, 1));						
				tPoly3.vertices.push(new THREE.Vector3(-(tWidth+10)/2, -(tHeight+10)/2, 1));
				this.m_LineBottom_Box = new THREE.Line( tPoly3, new THREE.LineBasicMaterial( { color: 0x0088F8, linewidth:1, opacity: 1 } ) );
				this.m_LineBottom_Label.add(this.m_LineBottom_Box);		
				this.m_LineBottom_Label.position.x  = fx;			
				this.m_LineBottom_Label.position.y  = fy;	
				//===========================================================================================================================				
				this.m_LineBottom.add(this.m_LineBottom_Label);
			}
			break;
		}		
	};			
		
		this.GetLiQiangJuLi = function(posStart1, posEnd1, tFloor)
		{
			var vVec;	
			tDis   =9999999;
		    for(var i = 0; i<tFloor.mLabelArray.length; i++)
		    {
		        PosArray  = mMathClass.Get2Line(posStart1,posEnd1,tFloor.mLabelArray[i].m_vStart_Floor,tFloor.mLabelArray[i].m_vEnd_Floor);
		        if( PosArray[0] == true )
		        {
		        	var vVec1 = new THREE.Vector3(PosArray[1],PosArray[2],0);
		        	
		        	var f1 = vVec1.distanceTo(posStart1);
		        	var f2 = vVec1.distanceTo(posEnd1);
	
		        	if(f1 > f2)
		        	{
						if( tDis > f1)
						{
							var maxX=(tFloor.mLabelArray[i].m_vStart_Floor.x>tFloor.mLabelArray[i].m_vEnd_Floor.x)?tFloor.mLabelArray[i].m_vStart_Floor.x:tFloor.mLabelArray[i].m_vEnd_Floor.x;
		        			var minX=(tFloor.mLabelArray[i].m_vStart_Floor.x<tFloor.mLabelArray[i].m_vEnd_Floor.x)?tFloor.mLabelArray[i].m_vStart_Floor.x:tFloor.mLabelArray[i].m_vEnd_Floor.x;
		        			var maxY=(tFloor.mLabelArray[i].m_vStart_Floor.y>tFloor.mLabelArray[i].m_vEnd_Floor.y)?tFloor.mLabelArray[i].m_vStart_Floor.y:tFloor.mLabelArray[i].m_vEnd_Floor.y;
		        			var minY=(tFloor.mLabelArray[i].m_vStart_Floor.y<tFloor.mLabelArray[i].m_vEnd_Floor.y)?tFloor.mLabelArray[i].m_vStart_Floor.y:tFloor.mLabelArray[i].m_vEnd_Floor.y;
		      				// 线段内	
		      				if( vVec1.x <= maxX && vVec1.x >= minX && vVec1.y <= maxY && vVec1.y >= minY )
		      				{
								tDis  = f1;
								vVec  = vVec1;
							}
						}	        		
		        	}
		       }
		    }	
		    
		    return tDis;
		};		
	
		this.OnMouseRightUp2D = function()
		{
			for( var i=0; i< this.mFurnitureArray.length; i++ )
				this.mFurnitureArray[i].OnChangeColor2D(0xffffff);	//恢复颜色
				
			this.OnHideCtrl();
			
			g_bPickObj = false;
			//mCameraClass.m_Control3D.enabled 	  = false;	// 不移动相机			
			this.m_pMoveFurniture = null;
			this.HideObjCtrl();
		};
		

		
		// 隐藏控制模块
		this.HideObjCtrl =function()
		{
			scene3D.remove(this.mRingGeometry);
			scene3D.remove(this.mRingGeometry_Pick);
			scene3D.remove(this.mArrowGeometry);
			scene3D.remove(this.mCylinderGeometry);	
			scene3D.remove(this.mPickGeometry);
			this.mRingGeometry 		= null;
			this.mRingGeometry_Pick = null;
			this.mArrowGeometry		= null;
			this.mCylinderGeometry	= null;
			this.mPickGeometry		= null;
			if(this.m_pMoveFurniture)
			   this.m_pMoveFurniture.OnShowGroup(0);
			this.m_pMoveFurniture = null;
			   
			this.g_bObjRotate = false;	// 旋转
			this.g_bObjRaise  = false;  // 升高   
		};
		
		// 显示操作界面
		this.ShowObjCtrl =function()
		{
			if(this.m_pMoveFurniture==null)
				return;
				
			scene3D.remove(this.mRingGeometry);
			scene3D.remove(this.mRingGeometry_Pick);
			scene3D.remove(this.mArrowGeometry);
			scene3D.remove(this.mCylinderGeometry);
			scene3D.remove(this.mPickGeometry);
			var fL = parseInt(this.m_pMoveFurniture.m_fLength);
			if(parseInt(this.m_pMoveFurniture.m_fLength)<parseInt(this.m_pMoveFurniture.m_fWidth))
				fL = parseInt(this.m_pMoveFurniture.m_fWidth);
			// 旋转圈显示	
			var tGeometry = new THREE.RingGeometry( fL/20+20, fL/20+35, 64 );
			var tMaterial = new THREE.MeshBasicMaterial( { color: 0x00A8ff, opacity: 0.4, transparent: true,  side: THREE.DoubleSide } );
			this.mRingGeometry = new THREE.Mesh( tGeometry, tMaterial );			
			this.mRingGeometry.position.x = this.m_pMoveFurniture.mBoxHelper.position.x;
			this.mRingGeometry.position.y = this.m_pMoveFurniture.mBoxHelper.position.y+10;
			this.mRingGeometry.position.z = this.m_pMoveFurniture.mBoxHelper.position.z;
			this.mRingGeometry.rotation.x = -Math.PI/2;
			scene3D.add(this.mRingGeometry);
			
			var tGeometry2 = new THREE.RingGeometry( fL/20+25-10, fL/20+35+10, 64 );
			var tMaterial2 = new THREE.MeshBasicMaterial( { color: 0x0000ff, opacity: 0.0, transparent: true,  side: THREE.DoubleSide } );
			this.mRingGeometry_Pick = new THREE.Mesh( tGeometry2, tMaterial2 );			
			this.mRingGeometry_Pick.position.x = this.m_pMoveFurniture.mBoxHelper.position.x;
			this.mRingGeometry_Pick.position.y = this.m_pMoveFurniture.mBoxHelper.position.y+10;
			this.mRingGeometry_Pick.position.z = this.m_pMoveFurniture.mBoxHelper.position.z;
			this.mRingGeometry_Pick.rotation.x = -Math.PI/2;
			scene3D.add(this.mRingGeometry_Pick);			
			
			var geometry3 = new THREE.ConeGeometry( 8, 25  );
			var tMaterial1= new THREE.MeshBasicMaterial( { color: 0x00ff00, opacity: 1, transparent: true,depthTest:false } )
			this.mArrowGeometry = new THREE.Mesh(geometry3, tMaterial1 ); 	
			this.mArrowGeometry.position.x = this.m_pMoveFurniture.mBoxHelper.position.x;
			this.mArrowGeometry.position.y = this.m_pMoveFurniture.mBoxHelper.position.y+110;
			this.mArrowGeometry.position.z = this.m_pMoveFurniture.mBoxHelper.position.z;
		//	this.mArrowGeometry.rotation.x = -Math.PI/2;
			scene3D.add( this.mArrowGeometry );
			
			var geometry4 = new THREE.CylinderGeometry( 2, 2, 80, 32 );
			this.mCylinderGeometry = new THREE.Mesh(geometry4, tMaterial1 );
			this.mCylinderGeometry.position.x = this.m_pMoveFurniture.mBoxHelper.position.x;
			this.mCylinderGeometry.position.y = this.m_pMoveFurniture.mBoxHelper.position.y+70;
			this.mCylinderGeometry.position.z = this.m_pMoveFurniture.mBoxHelper.position.z;		
			scene3D.add( this.mCylinderGeometry );
			
			var geometry5 = new THREE.CylinderGeometry( 8, 8, 80, 32 );
			this.mPickGeometry = new THREE.Mesh(geometry5, new THREE.MeshBasicMaterial( { color: 0x00ffff, opacity: 0.0, transparent: true,depthTest:false } ));
			this.mPickGeometry.position.x = this.m_pMoveFurniture.mBoxHelper.position.x;
			this.mPickGeometry.position.y = this.m_pMoveFurniture.mBoxHelper.position.y+70;
			this.mPickGeometry.position.z = this.m_pMoveFurniture.mBoxHelper.position.z;		
			scene3D.add( this.mPickGeometry );		
			
			this.m_pMoveFurniture.OnShowGroup(1);
		};

		this.OnPick3D_Rotate = function(mouseX,mouseY)
		{
			if(this.mRingGeometry_Pick == null)
				return;
				
			this.mCurMouseX = 0;
			this.mCurMouseY = 0;
			this.g_bObjRotate= false;
			raycaster.setFromCamera( mouse, mCameraClass.m_Camera3D );
		
			var Intersections = raycaster.intersectObject( this.mRingGeometry_Pick, true );
			for ( var i = 0; i < Intersections.length; i++ ) 
			{
				if (Intersections.length > 0) 
				{
					this.mCurMouseX = mouseX;
					this.mCurMouseY = mouseY;
					this.g_bObjRotate = true;

					return true;
				}
			}				
			return false;
		};
		
		this.m_mouseOldY;
		this.m_fHightOld;
		this.OnPick3D_Raise = function(mouseX,mouseY)
		{
			if(this.mPickGeometry == null)
				return;
				
			this.mCurMouseX = 0;
			this.mCurMouseY = 0;
			this.g_bObjRaise= false;
			raycaster.setFromCamera( mouse, mCameraClass.m_Camera3D );
		
			var Intersections = raycaster.intersectObject( this.mPickGeometry, true );
			for ( var i = 0; i < Intersections.length; i++ ) 
			{
				if (Intersections.length > 0) 
				{
					this.mCurMouseX = mouseX;
					this.mCurMouseY = mouseY;
					this.m_mouseOldY= mouse.y;
					this.m_fHightOld = mHouseClass.mFurnitureClass.m_pMoveFurniture.m_fHight;
					this.g_bObjRaise = true;
					return true;
				}
			}				
			return false;
		};
		
		
		this.KongZhiXiTong_GaoLiang = function()
		{
			if(this.mPickGeometry == null)
				return;
				
			raycaster.setFromCamera( mouse, mCameraClass.m_Camera3D );
		
			this.mArrowGeometry.material.color.set(0x00ff00);
			this.mCylinderGeometry.material.color.set(0x00ff00);
			this.mRingGeometry.material.color.set(0x00A8ff);
			
			var Intersections = raycaster.intersectObject( this.mPickGeometry, true );
			if (Intersections.length > 0) 				
			{
				this.mArrowGeometry.material.color.set(0xffff00);
				this.mCylinderGeometry.material.color.set(0xffff00);
			}
			else
			{
				Intersections = raycaster.intersectObject( this.mRingGeometry_Pick, true );
				if (Intersections.length > 0) 				
					this.mRingGeometry.material.color.set(0xffff00);				
			}
			
		};
		
		this.OnMouseRaise = function(mouseX,mouseY,buttonDown)
		{
			if(this.m_pMoveFurniture == null)
				return;

			if( this.m_pMoveFurniture.m_Locking == true)	// 锁定无法移动
				return;

			if(buttonDown != 1)
				return;

			this.mArrowGeometry.material.color.set(0xffff00);
			this.mCylinderGeometry.material.color.set(0xffff00);
				
			if( this.m_fHightOld + (mouse.y-this.m_mouseOldY)*5000 <= 0)
				mHouseClass.mFurnitureClass.m_pMoveFurniture.m_fHight = 0;
			else
				mHouseClass.mFurnitureClass.m_pMoveFurniture.m_fHight = this.m_fHightOld + (mouse.y-this.m_mouseOldY)*5000;
			
			mHouseClass.mFurnitureClass.m_pMoveFurniture.OnUpdate3D();
			
			if(this.mRingGeometry)
			   this.mRingGeometry.position.y = this.m_pMoveFurniture.mBoxHelper.position.y+10;
			
			if(this.mRingGeometry_Pick)
			   this.mRingGeometry_Pick.position.y = this.m_pMoveFurniture.mBoxHelper.position.y+10;
			   
			if(this.mArrowGeometry)
			   this.mArrowGeometry.position.y = this.m_pMoveFurniture.mBoxHelper.position.y+110;		
			
			if(this.mCylinderGeometry)
			   this.mCylinderGeometry.position.y = this.m_pMoveFurniture.mBoxHelper.position.y+70;
			
			if(this.mPickGeometry)
			   this.mPickGeometry.position.y = this.m_pMoveFurniture.mBoxHelper.position.y+70;

			this.mCurMouseY = mouseY;
		//	this.m_mouseOldY= mouse.y;
		};
		
		// 3D下成组移动
		this.OnMove3D_Group = function(tFurniture,mouseX,mouseY,buttonDown)
		{
			if( buttonDown != 1 || tFurniture == null)
				return;	
				
			if( tFurniture.m_Locking == true)	// 锁定无法移动
				return;	
				
			//2D移动时的模型
			if( tFurniture.m_Object3D )
			{
				tFurniture.m_Object3D.position.x +=  mouseX;
				tFurniture.m_Object3D.position.z +=  mouseY;
				tFurniture.mBoxHelper.position.x +=  mouseX;
				tFurniture.mBoxHelper.position.z +=  mouseY;
				
			}
			tFurniture.m_RenderData2D.position.x += mouseX;
			tFurniture.m_RenderData2D.position.y += mouseY;	
			tFurniture.m_vPos.x = tFurniture.m_RenderData2D.position.x;
			tFurniture.m_vPos.z =-tFurniture.m_RenderData2D.position.y;			
		};
		
		this.OnMove3D = function(tFurniture,mouseX,mouseY,buttonDown)
		{
			// 3D下，按下鼠标移动物体
			if( buttonDown != 1 || tFurniture == null)
				return;	
				
			if( tFurniture.m_Locking == true)	// 锁定无法移动
			{
				mCameraClass.m_Control3D.enabled 	  = true;	// 变为选择视角
				return;
			}
					

			var x1 = tFurniture.m_Object3D.position.x;
			var y1 = tFurniture.m_Object3D.position.z;
			//2D移动时的模型
			if( tFurniture.m_Object3D )
			{
				tFurniture.m_Object3D.position.x +=  mouseX;
				tFurniture.m_Object3D.position.z +=  mouseY;
				tFurniture.mBoxHelper.position.x +=  mouseX;
				tFurniture.mBoxHelper.position.z +=  mouseY;
				
			}
			tFurniture.m_RenderData2D.position.x += mouseX;
			tFurniture.m_RenderData2D.position.y += mouseY;	
			tFurniture.m_vPos.x = tFurniture.m_RenderData2D.position.x;
			tFurniture.m_vPos.y = tFurniture.m_RenderData2D.position.y;
/*			tFurniture.m_vPos.x =  mouseX;
			tFurniture.m_vPos.y = -mouseY;
			tFurniture.UpdateFlue();*/				
			this.render3D(tFurniture, x1, y1);
			
			if(this.mRingGeometry)
			{
				this.mRingGeometry.position.x = tFurniture.mBoxHelper.position.x;
				this.mRingGeometry.position.z = tFurniture.mBoxHelper.position.z;
			}
			
			if(this.mRingGeometry_Pick)
			{
				this.mRingGeometry_Pick.position.x = tFurniture.mBoxHelper.position.x;
				this.mRingGeometry_Pick.position.z = tFurniture.mBoxHelper.position.z;
			}			
			
			if(this.mArrowGeometry)
			{
				this.mArrowGeometry.position.x = tFurniture.mBoxHelper.position.x;
				this.mArrowGeometry.position.z = tFurniture.mBoxHelper.position.z;				
			}
			
			if(this.mCylinderGeometry)
			{
				this.mCylinderGeometry.position.x = tFurniture.mBoxHelper.position.x;
				this.mCylinderGeometry.position.z = tFurniture.mBoxHelper.position.z;
				
				this.mPickGeometry.position.x = tFurniture.mBoxHelper.position.x;
				this.mPickGeometry.position.z = tFurniture.mBoxHelper.position.z;
			}
		};
		
		this.OnMouseRotate = function(mouseX,mouseY,buttonDown)
		{		
			if(mHouseClass.mFurnitureClass.m_pMoveFurniture == null|| buttonDown !=1)
				return;
				
			if( mHouseClass.mFurnitureClass.m_pMoveFurniture.m_Locking == true)	// 锁定无法移动
				return;	
				
			this.mRingGeometry.material.color.set(0xffff00);
			var angle  = 5;
			if(mouseX-this.mCurMouseX>0)
				mHouseClass.mFurnitureClass.m_pMoveFurniture.m_fRotate +=angle;
			else
				mHouseClass.mFurnitureClass.m_pMoveFurniture.m_fRotate -=angle;
				
			mHouseClass.mFurnitureClass.m_pMoveFurniture.m_fRotate = mHouseClass.mFurnitureClass.m_pMoveFurniture.m_fRotate%360;	
			mHouseClass.mFurnitureClass.m_pMoveFurniture.OnUpdate3D();

			this.mCurMouseX = mouseX;
			
	/*		var v1 = new THREE.Vector3(mouseX,mouseY,0);
			var v2 = new THREE.Vector3(1,0,0);
			var degree = v1.angleTo(v2);
			//v1 = v1.cross(v2);
			
		//	degree = Math.floor(itmp) *angle;
		//	if(degree > angle /2.0 )
		//	   degree-=angle;					

		//	if(v1.z>0)
	//		if(mouseX-this.mCurMouseX>0)
		//		mHouseClass.mFurnitureClass.m_pMoveFurniture.m_fRotate +=degree;
		//	else
			mHouseClass.mFurnitureClass.m_pMoveFurniture.m_fRotate -=degree;
			mHouseClass.mFurnitureClass.m_pMoveFurniture.OnUpdate3D();	*/		
		};
				
		// 3D下拾取		
		this.OnPick3D = function()
		{	
			this.mCurMouseX = 0;
			this.mCurMouseY = 0;			
			this.m_pMoveFurniture = null;
			let tDis  = 99999;			
			raycaster.setFromCamera( mouse, mCameraClass.m_Camera3D );
			this.HideObjCtrl();
			for( var i = 0; i<this.mFurnitureArray.length; i++)
			{
				this.mFurnitureArray[i].OnShowGroup(0);
				var Intersections = raycaster.intersectObject( this.mFurnitureArray[i].m_Object3D, true );
				if (Intersections.length > 0) 
				{
					if( tDis > Intersections[0].distance)	// 距离最近
					{
						tDis = Intersections[0].distance;
						this.m_pMoveFurniture = this.mFurnitureArray[i];
						this.m_pCurFurniture = this.mFurnitureArray[i];
					}												
				}						
			}
			if( this.m_pMoveFurniture )	// 锁定无法移动
			{
				if(this.m_pMoveFurniture.m_uuid == 'pingjietiao')
					return false;	
				this.m_pMoveFurniture.mBoxHelper.position.x = this.m_pMoveFurniture.m_Object3D.position.x;
				this.m_pMoveFurniture.mBoxHelper.position.z = this.m_pMoveFurniture.m_Object3D.position.z;	//2020-11-27			
				this.ShowObjCtrl();
				mHelpClass.ClearOutline();
				this.m_moveXOld = this.m_pMoveFurniture.mBoxHelper.position.x;
				this.m_moveYOld = this.m_pMoveFurniture.mBoxHelper.position.y;
				this.m_moveZOld = this.m_pMoveFurniture.mBoxHelper.position.z;					 	
				this.mCurMouseX = g_mouseX;
				this.mCurMouseY = g_mouseY;				     
			    return true;
			}
			else
			{
			 	 mHouseClass.mFurnitureClass.OnUpdateAix(999999,999999,1,1,1);
			 	 m_ParamObjDlg.HideBar();
				 return false;				
			}
		};
		
		this.OnPick3D_Kuai = function()
		{			
			raycaster.setFromCamera( mouse, mCameraClass.m_Camera3D );
			for( var i = 0; i<this.mFurnitureArray.length; i++)
			{
				var Intersections = raycaster.intersectObject( this.mFurnitureArray[i].m_Object3D, true );
				if (Intersections.length > 0) 
					return true;						
			}
			return false;		
		};		
				
		// 按楼层显示
		this.OnShowFurniture_Floor = function(iFloor)
		{
			for( var i = 0; i<this.mFurnitureArray.length; i++ )
			{
				var bEnable = true;
				for( var j = 0; j<m_ParamObjDlg.ModeHideArray.length; j++ )
				{
					if (m_ParamObjDlg.ModeHideArray[j]==this.mFurnitureArray[i]) 
					{
						bEnable = false;
						break;
					}	
				}
				
				if(bEnable == true)
				{
					if(this.mFurnitureArray[i].m_iFloor == iFloor || iFloor == -10 || this.mFurnitureArray[i].m_iFloor == -10 )
						this.mFurnitureArray[i].OnShow(true);
					else
						this.mFurnitureArray[i].OnShow(false);
				}
			}
		};
		
		// 是否显示物体
		this.OnShowFurniture = function(tFurniture,bShow)
		{
			var bEnable = true;
			for( var j = 0; j<m_ParamObjDlg.ModeHideArray.length; j++ )
			{
				if (m_ParamObjDlg.ModeHideArray[j]==tFurniture) 
				{
					bEnable = false;
					break;
				}	
			}
			
			if(bEnable == true)
			   tFurniture.OnShow(bShow);
		};		
		
		//是否显示所有家具(排除强制隐藏的)
		this.OnShowFurnitureAll = function(bShow)
		{
			for (var i = 0; i < this.mFurnitureArray.length; i++) 
			{
				var bEnable = true;
				for( var j = 0; j<m_ParamObjDlg.ModeHideArray.length; j++ )
				{
					if (m_ParamObjDlg.ModeHideArray[j]==this.mFurnitureArray[i]) 
					{
						bEnable = false;
						break;
					}	
				}
				
				if(bEnable == true)
					this.mFurnitureArray[i].OnShow(bShow);
			}
		};
		
		/**
		 * @api OnKeyDown(iKey)
		 * @apiGroup FurnitureClass
		 * @apiDescription 键盘操作
		 * @apiParam (参数) iKey  键盘值
		 *                             
		 */		
		this.OnKeyDown = function(iKey)
		{
			if(this.m_pCurFurniture== null)
				return false;
				
			switch(iKey)
			{
				case 32:	// 空格键
				{
					this.m_pCurFurniture.m_fRotate+=90;
					this.m_pCurFurniture.m_fRotate = this.m_pCurFurniture.m_fRotate%360;
					this.m_pCurFurniture.OnUpdate3D();
					this.OnShowCtrl(this.m_pCurFurniture);
				}
				return true;
			}
			
			if((this.m_HelpBox.position.x  != -99999 || 
				this.m_HelpBox.position.y  != -99999 ) && 
				this.g_GaiLiQiangJuLi  != null && this.m_pCurFurniture != null)	// 调整svg离墙距离
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
						   this.UpdateText(this.m_pCurFurniture,parseInt(strText),0);
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
						   this.UpdateText(this.m_pCurFurniture,parseInt(strText),1);
						   this.g_GaiLiQiangJuLi =  this.m_LineRight_Box;
						}	
						return true;
					}
					if( this.g_GaiLiQiangJuLi ==  this.m_LineTop_Box)
					{
						var strText = this.m_strTop_Value;
						if(strText.length<5)
						{
						   strText +=String.fromCharCode(a);			
						   this.UpdateText(this.m_pCurFurniture,parseInt(strText),2);
						   this.g_GaiLiQiangJuLi =  this.m_LineTop_Box;
						}
						return true;
					}
					if( this.g_GaiLiQiangJuLi ==  this.m_LineBottom_Box)
					{
						var strText = this.m_strBottom_Value;
						if(strText.length<5)
						{
						   strText +=String.fromCharCode(a);			
						   this.UpdateText(this.m_pCurFurniture,parseInt(strText),3);
						   this.g_GaiLiQiangJuLi =  this.m_LineBottom_Box;
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
						this.UpdateText(this.m_pCurFurniture,parseInt(strText),0);
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
						this.UpdateText(this.m_pCurFurniture,parseInt(strText),1);
						this.g_GaiLiQiangJuLi =  this.m_LineRight_Box;	
						return true;
					}
					if( this.g_GaiLiQiangJuLi ==  this.m_LineTop_Box)
					{
						var strText = this.m_strTop_Value;
							if(strText.length == 1)
							   strText = 0;
							else
							   strText = strText.slice(0,strText.length-1);
						this.UpdateText(this.m_pCurFurniture,parseInt(strText),2);
						this.g_GaiLiQiangJuLi =  this.m_LineTop_Box;
						return true;
					}
					if( this.g_GaiLiQiangJuLi ==  this.m_LineBottom_Box)
					{
						var strText = this.m_strBottom_Value;
							if(strText.length == 1)
							   strText = 0;
							else
							   strText = strText.slice(0,strText.length-1);		
						this.UpdateText(this.m_pCurFurniture,parseInt(strText),3);
						this.g_GaiLiQiangJuLi =  this.m_LineBottom_Box;
						return true;
					}			
				}
				
				if( a == 13 )	// 回车移动
				{			
					if( this.g_GaiLiQiangJuLi ==  this.m_LineLeft_Box)
					{
						this.m_pCurFurniture.m_vPos.x -= this.m_fLeftOld-parseInt(this.m_strLeft_Value);	
						this.m_pCurFurniture.UpdateFlue();
						this.OnShowCtrl(this.m_pCurFurniture);
						this.g_GaiLiQiangJuLi =  this.m_LineLeft_Box;
						return true;
					}
					if( this.g_GaiLiQiangJuLi ==  this.m_LineRight_Box)
					{
						this.m_pCurFurniture.m_vPos.x +=this.m_fRightOld -parseInt(this.m_strRight_Value);
						this.m_pCurFurniture.UpdateFlue();
						this.OnShowCtrl(this.m_pCurFurniture);
						this.g_GaiLiQiangJuLi =  this.m_LineRight_Box;	
						return true;
					}
					if( this.g_GaiLiQiangJuLi ==  this.m_LineTop_Box)
					{
						this.m_pCurFurniture.m_vPos.y +=this.m_fTopOld-parseInt(this.m_strTop_Value);
						this.m_pCurFurniture.UpdateFlue();
						this.OnShowCtrl(this.m_pCurFurniture);
						this.g_GaiLiQiangJuLi =  this.m_LineTop_Box;
						return true;
					}
					if( this.g_GaiLiQiangJuLi ==  this.m_LineBottom_Box)
					{
						this.m_pCurFurniture.m_vPos.y -=this.m_fBottomOld-parseInt(this.m_strBottom_Value);
						this.m_pCurFurniture.UpdateFlue();
						this.OnShowCtrl(this.m_pCurFurniture);
						this.g_GaiLiQiangJuLi =  this.m_LineBottom_Box;
						return true;
					}			
				}
			}			
			
			return false;
		};
		
		// 开个锁住所有物体
		this.OnLockAll = function()
		{
			for (var i = 0; i < this.mFurnitureArray.length; i++) 
			{
				this.mFurnitureArray[i].m_Locking = app.header.showLable.check_LockAll;
			}
		};
				
		// 读取户型库数据
		this.OnLoadFurniture_XML = function(data)
		{	
			var strFile = $(data).attr('source');
			var k   = strFile.lastIndexOf(".");
			var str = strFile.slice(k+1);
			if( str == "a3d")
				return;
				
			var strJpg = strFile.slice(0,k+1)+"jpg";
			
			var tFurniture = new Furniture();	

			var vPos = new THREE.Vector3(0,0,0);
			vPos.x = parseFloat($(data).attr('PosX'));
			vPos.y = parseFloat($(data).attr('PosZ'));
			vPos.z =-parseFloat($(data).attr('PosY'));
			
			var fLength = parseFloat($(data).attr('Length'))*10;
			var fWidth 	= parseFloat($(data).attr('Width'))*10;
			var fHeight = parseFloat($(data).attr('Height'))*10;
			
			var fRotate = parseFloat($(data).attr('Rotate'));	
			
			var fModelType = parseFloat($(data).attr('ModeType'));

			if(1 == fModelType)
			{
				tFurniture.m_fModeType = fModelType;
				tFurniture.m_fLightR = parseFloat($(data).attr('LightR'));
				tFurniture.m_fLightG = parseFloat($(data).attr('LightG'));
				tFurniture.m_fLightB = parseFloat($(data).attr('LightB'));
				tFurniture.m_fIntensity = parseFloat($(data).attr('Intensity'));
				tFurniture.m_fHotspot = parseFloat($(data).attr('Hotspot'));
				tFurniture.m_fFallsize = parseFloat($(data).attr('Fallsize'));
				tFurniture.m_projector_map = parseFloat($(data).attr('ProjectorMap'));

				var fRotateX = parseFloat($(data).attr('RotateX'));
				var fRotateY = parseFloat($(data).attr('RotateY'));

				tFurniture.m_fRotateX = Math.ceil(fRotateX*180/Math.PI);
				tFurniture.m_fRotateY = Math.ceil(fRotateY*180/Math.PI);
			}
			var strName = $(data).attr('Name');
			var ab = new Array();	
			ab.push(strName);
			ab.push(strJpg);
			ab.push(strFile);
			ab.push(fLength);
			ab.push(fWidth);
			ab.push(fHeight);
			ab.push(fModelType);
			
			tFurniture.m_fRotate = fRotate*180/Math.PI;
			tFurniture.m_fHight  = vPos.y*10;
			this.mFurnitureArray.push( tFurniture );
			tFurniture.m_vPos = vPos;
			tFurniture.OnCreate3D(ab);		
			tFurniture.OnCreate2D();	// 创建 2D顶视图
			tFurniture.m_uuid = $(data).attr('UUID');

			if($(data).length > 0)
			{
				tFurniture.m_infoXML = $(data)[0].outerHTML;
			}
			tFurniture.GetDataFormDB();
			return tFurniture;
		};
		
		// 保存模型
		this.OnSave_XML = function()
		{
			let strXML= null;
			for(var i=0; i< this.mFurnitureArray.length; i++)
			{		
				if( strXML == null )
					strXML = this.mFurnitureArray[i].OnSave();
				else
					strXML+= this.mFurnitureArray[i].OnSave();
			}			
			return strXML;
		};

	//创建图例框
	this.OnCreateLegendBox = function()
	{

/*		for( j=0; j<mPlaneClass.mPlaneArray.length; j++)
		{
			// 得到根平面
			if( planWidth == mPlaneClass.mPlaneArray[j].GetWidth() &&
				planHeight== mPlaneClass.mPlaneArray[j].GetHeight())
			{
				mPlaneClass.m_pRootPlane = mPlaneClass.mPlaneArray[j];
			}
		}*/





/*		var ab = new Array();
		ab.push("图例框");
		ab.push("./svg/draw.svg");
		ab.push("./svg/draw.svg");


		ab.push(2500);
		ab.push(1770);
		this.mCurFurniture = new Furniture();
		this.mFurnitureArray.push( this.mCurFurniture );

		var vCenter   = new THREE.Vector3(0,0,0);
		var OBBox_Max = new THREE.Vector3(-99999,-99999,0);
		var OBBox_Min = new THREE.Vector3( 99999, 99999,0);
		for(j = 0; j < mPlaneClass.m_pRootPlane.mPathsOld.length; j++)
		{
			if( OBBox_Max.x < mPlaneClass.m_pRootPlane.mPathsOld[j].X ) OBBox_Max.x  = mPlaneClass.m_pRootPlane.mPathsOld[j].X;
			if( OBBox_Max.y < mPlaneClass.m_pRootPlane.mPathsOld[j].Y ) OBBox_Max.y  = mPlaneClass.m_pRootPlane.mPathsOld[j].Y;
			if( OBBox_Min.x > mPlaneClass.m_pRootPlane.mPathsOld[j].X ) OBBox_Min.x  = mPlaneClass.m_pRootPlane.mPathsOld[j].X;
			if( OBBox_Min.y > mPlaneClass.m_pRootPlane.mPathsOld[j].Y ) OBBox_Min.y  = mPlaneClass.m_pRootPlane.mPathsOld[j].Y;
		}
		// 中心点
		vCenter.x= (OBBox_Min.x + OBBox_Max.x)/2;
		vCenter.y= (OBBox_Min.y + OBBox_Max.y)/2;

		mPlaneCenterX =  vCenter.x;
		mPlaneCenterY =  vCenter.y;

		var tLength;
		if(planWidth>planHeight)
			tLength = planWidth;
		else
			tLength = planHeight;

		var fScale = 1250/tLength;*/

		//this.mCurFurniture.OnCreateSVG(ab,vCenter.x - 2500/2*fScale,vCenter.y + 1770/2*fScale,0,Math.PI,0,0);
		var ab = new Array();
		this.m_pCurFurniture = new Furniture();
		this.mFurnitureArray.push( this.m_pCurFurniture );

		this.m_pCurFurniture.OnCreateSVG(ab,0,0,0,Math.PI,0,0);
	};
					
}