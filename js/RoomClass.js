/**
 * @api RoomClass
 * @apiGroup RoomClass
 * @apiDescription 房间操作类
 * @apiParam (成员变量) mRoomArray 房间数组
 * @apiParam (成员变量) m_pCurFurniture 当前模型
 * @apiParam (成员变量) m_pMoveObjArray 成组的模型组
 * @apiParam (成员变量) m_pMoveFurniture 当前操作的模型组
 *
 *                             
 */
function RoomClass()
{
	this.mRoomArray = new Array(); 			// 所有房间
	this.OnClear = function()
	{
	};
	
	/**
	 * @api OnShowAllRoom()
	 * @apiGroup RoomClass 
	 * @apiName  0
	 * @apiDescription 显示所有房间
	 * @apiParam (参数) bShow  true显示，false 不显示
	 */		
	this.OnShowAllRoom = function(bShow)
	{
		for( var i = 0; i<mHouseClass.mFloorClass.mFloorArray.length; i++ )	
		{
			if(mHouseClass.mFloorClass.mFloorArray[i].mFloorMesh3D)
			   mHouseClass.mFloorClass.mFloorArray[i].mFloorMesh3D.visible = true;
			   
			if(mHouseClass.mFloorClass.mFloorArray[i].mFloorMesh)
			   mHouseClass.mFloorClass.mFloorArray[i].mFloorMesh.visible = true;
			  
			scene.remove(mHouseClass.mFloorClass.mFloorArray[i].m_tmpWall);
		}
		
		// 2D 墙体顶面
		//for(var j = 0; j<mHouseClass.mWallClass.mRenderWallTop.length; j++)
		//	mHouseClass.mWallClass3D_In.mWallArray[j].mWallMesh.visible = true;
		
		for(var j = 0; j<mHouseClass.mWallClass3D_In.mWallArray.length; j++)
		{
			if(mHouseClass.mWallClass3D_In.mWallArray[j].mWallMesh)
				mHouseClass.mWallClass3D_In.mWallArray[j].mWallMesh.visible = true;
		}	
		for( var j = 0; j<mHouseClass.mWallClass3D_Out.mWallArray.length; j++)
		{
			if(mHouseClass.mWallClass3D_Out.mWallArray[j].mWallMesh)
				mHouseClass.mWallClass3D_Out.mWallArray[j].mWallMesh.visible = true;
		}
		
		mHouseClass.mWallClass.OnShowRenderLine(true);		// 墙体内外黑线
		
		if(mHouseClass.mRenderWallTop)
		   mHouseClass.mRenderWallTop.visible = true;			
		// 隐藏墙厚顶
		for(var j = 0; j<mHouseClass.mRenderCeilingTop.length; j++)
			mHouseClass.mRenderCeilingTop[j].visible = true;
			
		// 隐藏房间顶面
		for(var j = 0; j<mHouseClass.mRenderCeiling.length; j++)
			mHouseClass.mRenderCeiling[j].visible = true;	
			
		for(var j = 0; j<mHouseClass.mDoorClass.mDoorArray.length; j++)
		{
			mHouseClass.mDoorClass.mDoorArray[j].m_Object.visible = true;
			mHouseClass.mDoorClass.mDoorArray[j].m_RenderWin2D.visible=true;
			mHouseClass.mDoorClass.mDoorArray[j].m_RenderData2D.visible=true;			
		}	
		for(var j = 0; j<mHouseClass.mWindowClass.mWindowArray.length; j++)
		{
			mHouseClass.mWindowClass.mWindowArray[j].m_Object.visible = true;
			mHouseClass.mWindowClass.mWindowArray[j].m_RenderWin2D.visible=true;
			mHouseClass.mWindowClass.mWindowArray[j].m_RenderData2D.visible=true;				
		}	
		
		for(var j = 0; j<mHouseClass.mPillarClass.mFlueArray.length; j++)
				mHouseClass.mPillarClass.mFlueArray[j].OnShow(true);					
		
		for(var j = 0; j<mHouseClass.mFlueClass.mFlueArray.length; j++)
				mHouseClass.mFlueClass.mFlueArray[j].OnShow(true);
				
		mHouseClass.mTextClass.OnShowRoomName(true);
		mHouseClass.mFurnitureClass.OnShowFurnitureAll(true);
		
		mHouseClass.ClearCeilingTop_Room();
		mHouseClass.mWallClass3D_Out_Room.OnClear();
	};
	
	// 
	/**
	 * @api OnShowRoom()
	 * @apiGroup RoomClass 
	 * @apiName  0
	 * @apiDescription 显示地面对应的房间,2D/3D
	 * @apiParam (参数) tFloor  选中的地面
	 */		
	this.OnShowRoom = function(tFloor)
	{
		// 只显示当前房间地面
		for( var i = 0; i<mHouseClass.mFloorClass.mFloorArray.length; i++ )
		{
			if(tFloor == mHouseClass.mFloorClass.mFloorArray[i] )
				continue;
			
			if(mHouseClass.mFloorClass.mFloorArray[i].mFloorMesh3D)
			   mHouseClass.mFloorClass.mFloorArray[i].mFloorMesh3D.visible = false;
			   
			if(mHouseClass.mFloorClass.mFloorArray[i].mFloorMesh)
			   mHouseClass.mFloorClass.mFloorArray[i].mFloorMesh.visible = false;
		}
			
		// 2D 墙体顶面
		for(var j = 0; j<mHouseClass.mWallClass.mRenderWallTop.length; j++)
			mHouseClass.mWallClass3D_In.mWallArray[j].mWallMesh.visible = false;
			
		mHouseClass.mWallClass.OnShow(false);		// 墙体内外黑线隐藏
		mHouseClass.mRenderWallTop.visible = false;
		
		// 2D3D隐藏门		
		this.OnHideDoor(tFloor);
		// 隐藏文字
		this.OnHideText(tFloor);		
		// 2D3D隐藏窗户
		this.OnHideWindow(tFloor);
		// 隐藏家具
		this.OnHideFurniture(tFloor);
		// 隐藏柱子
		this.OnHidePillar(tFloor);
		// 隐藏烟道
		this.OnHideFlue(tFloor);
		
		// 3D 状态
		if( IsContain(container, renderer.domElement ) != true )
		{
			// 隐藏所有外墙
			for(var j = 0; j<mHouseClass.mWallClass3D_Out.mWallArray.length; j++)
				mHouseClass.mWallClass3D_Out.mWallArray[j].mWallMesh.visible = false;
			
			// 隐藏墙厚顶
			for(var j = 0; j<mHouseClass.mRenderCeilingTop.length; j++)
				mHouseClass.mRenderCeilingTop[j].visible = false;		
			
			// 隐藏房间顶面
			for(var j = 0; j<mHouseClass.mCeilingClass.mCeilingArray.length; j++)
			{
				var cMesh = tFloor.mFloorMesh3D;
					cMesh.geometry.computeBoundingBox();
				var tMesh = mHouseClass.mCeilingClass.mCeilingArray[j].mCeilingMesh3D;
					tMesh.geometry.computeBoundingBox();
				//包围盒相同	
				if( Math.abs(cMesh.geometry.boundingBox.min.x -tMesh.geometry.boundingBox.min.x)<0.001 &&
					Math.abs(cMesh.geometry.boundingBox.max.x -tMesh.geometry.boundingBox.max.x)<0.001 &&
					Math.abs(cMesh.geometry.boundingBox.min.y -tMesh.geometry.boundingBox.min.y)<0.001 &&
					Math.abs(cMesh.geometry.boundingBox.max.y -tMesh.geometry.boundingBox.max.y)<0.001)
				{
					continue;
				}
				
				mHouseClass.mCeilingClass.mCeilingArray[j].mCeilingMesh3D.visible = false;
			}

			// 得到相应内墙轮廓
			this.OnUpdateWall_3D(tFloor);
			
			var tLineArray = this.OnUpdateWall_3D_Out(tFloor, -20);
			
			// 隐藏门窗
		    //=======================================================================================
		    mHouseClass.mWallClass3D_Out_Room.OnClear();
		    mHouseClass.mWallClass3D_Out_Room.m_fHeight = mHouseClass.m_fHeight;
		    mHouseClass.mWallClass3D_Out_Room.OnCreate_Room(tLineArray);
		    mHouseClass.mWallClass3D_Out_Room.CreateHole(mHouseClass.mWindowClass.mWindowArray,mHouseClass.mDoorClass.mDoorArray);
			
			mHouseClass.ClearCeilingTop_Room();
			mHouseClass.BuildCeilingTop_Room(tFloor,tLineArray);
				
		}
		else
		{
		//	var tLineArray = this.OnUpdateWall_3D_Out(tFloor, -20);
			tFloor.OnUpdateTmpWall();
		}
	};
	
			
	this.OnHidePillar=function(tFloor)
	{// 隐藏柱子
		for(var i = 0; i<mHouseClass.mPillarClass.mFlueArray.length; i++ )
		{
			var vPos = mHouseClass.mPillarClass.mFlueArray[i].m_RenderData2D.position;
			var vPos1 = new THREE.Vector3( vPos.x , vPos.y, 10 );
	    	var vNormal = new THREE.Vector3(0,0,-1);
	    	var raycaster1 = new THREE.Raycaster(vPos1,vNormal);
	   	 	var Intersections = raycaster1.intersectObject( tFloor.mFloorMesh );
	   	 	if( Intersections.length<=0 )
				mHouseClass.mPillarClass.mFlueArray[i].OnShow(false);			
		}		
	};
		
	this.OnHideFlue=function(tFloor)
	{// 隐藏烟道
		for(var i = 0; i<mHouseClass.mFlueClass.mFlueArray.length; i++ )
		{
			var vPos = mHouseClass.mFlueClass.mFlueArray[i].m_RenderData2D.position;
			var vPos1 = new THREE.Vector3( vPos.x , vPos.y, 10 );
	    	var vNormal = new THREE.Vector3(0,0,-1);
	    	var raycaster1 = new THREE.Raycaster(vPos1,vNormal);
	   	 	var Intersections = raycaster1.intersectObject( tFloor.mFloorMesh );
	   	 	if( Intersections.length<=0 )
				mHouseClass.mFlueClass.mFlueArray[i].OnShow(false);			
		}		
	};
	
	this.OnHideFurniture=function(tFloor)
	{
		// 用2D平面做判断模型是否在当前房间内, 有则删除
		for(var i = 0; i<mHouseClass.mFurnitureClass.mFurnitureArray.length; i++ )
		{
			var vPos = mHouseClass.mFurnitureClass.mFurnitureArray[i].m_RenderData2D.position;
			var vPos1 = new THREE.Vector3( vPos.x , vPos.y, 10 );
	    	var vNormal = new THREE.Vector3(0,0,-1);
	    	var raycaster1 = new THREE.Raycaster(vPos1,vNormal);
	   	 	var Intersections = raycaster1.intersectObject( tFloor.mFloorMesh );
	   	 	if( Intersections.length<=0 )
				mHouseClass.mFurnitureClass.mFurnitureArray[i].OnShow(false);		
		}
	};
	
	this.OnHideWindow = function(tFloor)
	{
		for(var j = 0; j<mHouseClass.mWindowClass.mWindowArray.length; j++)
		{
			var tWindow = mHouseClass.mWindowClass.mWindowArray[j];
				tWindow.m_Object.visible = false;
				tWindow.m_RenderWin2D.visible=false;
				tWindow.m_RenderData2D.visible=false;
			for(k = 0; k < tFloor.mPath.length-1; k++)
			{
				var ab = mMathClass.ClosestPointOnLine1(tFloor.mPath[k+0].X,tFloor.mPath[k+0].Y,
											   			tFloor.mPath[k+1].X,tFloor.mPath[k+1].Y,
											  			tWindow.m_vPos.x, tWindow.m_vPos.y,22);
				if( ab[0] != 0 )
				{
					tWindow.m_Object.visible 	   = true;
					tWindow.m_RenderData2D.visible = true;
					tWindow.m_RenderWin2D.visible  = true;					
					break;
				}
			}
			
			var ab = mMathClass.ClosestPointOnLine1(tFloor.mPath[0].X,tFloor.mPath[0].Y,
										   			tFloor.mPath[tFloor.mPath.length-1].X,tFloor.mPath[tFloor.mPath.length-1].Y,
										  			tWindow.m_vPos.x, tWindow.m_vPos.y,22);
			if( ab[0] != 0 )
			{
				tWindow.m_Object.visible 	   = true;
				tWindow.m_RenderData2D.visible = true;
				tWindow.m_RenderWin2D.visible  = true;				
			}
		}		
	};
	
	this.OnHideText = function(tFloor)
	{
		for(var j = 0; j<mHouseClass.mTextClass.mTextArray.length; j++)
		{
			var vPos  		  = mHouseClass.mTextClass.mTextArray[j].m_vPos;
			var vPos1 		  = new THREE.Vector3( vPos.x , vPos.y, 10 );
	    	var vNormal 	  = new THREE.Vector3(0,0,-1);
	    	var raycaster1 	  = new THREE.Raycaster(vPos1,vNormal);
	   	 	var Intersections = raycaster1.intersectObject( tFloor.mFloorMesh );
	   	 	if( Intersections.length<=0 )
				mHouseClass.mTextClass.mTextArray[j].OnShow(false);	
		}		
	};
	
	
	this.OnHideDoor = function(tFloor)
	{
		for(var j = 0; j<mHouseClass.mDoorClass.mDoorArray.length; j++)
		{
			var tDoor = mHouseClass.mDoorClass.mDoorArray[j];
				tDoor.m_Object.visible = false;
				tDoor.m_RenderData2D.visible = false;
				tDoor.m_RenderWin2D.visible  = false;					
			for(k = 0; k < tFloor.mPath.length-1; k++)
			{
				var ab = mMathClass.ClosestPointOnLine1(tFloor.mPath[k+0].X,tFloor.mPath[k+0].Y,
											   			tFloor.mPath[k+1].X,tFloor.mPath[k+1].Y,
											  			tDoor.m_vPos.x, tDoor.m_vPos.y,22);
				if( ab[0] != 0 )
				{
					tDoor.m_Object.visible 		 = true;
					tDoor.m_RenderData2D.visible = true;
					tDoor.m_RenderWin2D.visible  = true;						
					break;
				}
			}
			
			var ab = mMathClass.ClosestPointOnLine1(tFloor.mPath[0].X,tFloor.mPath[0].Y,
										   			tFloor.mPath[tFloor.mPath.length-1].X,tFloor.mPath[tFloor.mPath.length-1].Y,
										  			tDoor.m_vPos.x, tDoor.m_vPos.y,22);
			if( ab[0] != 0 )
			{
				tDoor.m_Object.visible 		 = true;
				tDoor.m_RenderData2D.visible = true;
				tDoor.m_RenderWin2D.visible  = true;					
			}
		}		
	};
	
	// 得到相应内墙轮廓
	this.OnUpdateWall_3D = function(tFloor)
	{
		for(var j = 0; j<mHouseClass.mWallClass3D_In.mWallArray.length; j++)
		{
			var tWall = mHouseClass.mWallClass3D_In.mWallArray[j].mWallMesh;
			tWall.visible = false;
			
			for(k = 0; k < tFloor.mPath.length-1; k++)
			{
				if(( Math.abs(tWall.geometry.boundingBox.min.x -tFloor.mPath[k+0].X)<0.001 &&
					 Math.abs(tWall.geometry.boundingBox.min.y -tFloor.mPath[k+0].Y)<0.001 &&	
				     Math.abs(tWall.geometry.boundingBox.max.x -tFloor.mPath[k+1].X)<0.001 &&
					 Math.abs(tWall.geometry.boundingBox.max.y -tFloor.mPath[k+1].Y)<0.001)||
				   ( Math.abs(tWall.geometry.boundingBox.max.x -tFloor.mPath[k+0].X)<0.001 &&
					 Math.abs(tWall.geometry.boundingBox.max.y -tFloor.mPath[k+0].Y)<0.001 &&	
				     Math.abs(tWall.geometry.boundingBox.min.x -tFloor.mPath[k+1].X)<0.001 &&
					 Math.abs(tWall.geometry.boundingBox.min.y -tFloor.mPath[k+1].Y)<0.001))
					 tWall.visible = true;		 
			}
			
			if(( Math.abs(tWall.geometry.boundingBox.min.x -tFloor.mPath[0].X)<0.001 &&
				 Math.abs(tWall.geometry.boundingBox.min.y -tFloor.mPath[0].Y)<0.001 &&	
			     Math.abs(tWall.geometry.boundingBox.max.x -tFloor.mPath[k].X)<0.001 &&
				 Math.abs(tWall.geometry.boundingBox.max.y -tFloor.mPath[k].Y)<0.001)||
			   ( Math.abs(tWall.geometry.boundingBox.max.x -tFloor.mPath[0].X)<0.001 &&
				 Math.abs(tWall.geometry.boundingBox.max.y -tFloor.mPath[0].Y)<0.001 &&	
			     Math.abs(tWall.geometry.boundingBox.min.x -tFloor.mPath[k].X)<0.001 &&
				 Math.abs(tWall.geometry.boundingBox.min.y -tFloor.mPath[k].Y)<0.001))
				 tWall.visible = true;			
			
		}
	};
	
	// 生成相应外墙轮廓
	this.OnUpdateWall_3D_Out = function(tFloor, fValue)
	{
		// 生成外轮廓
		//=========================================================================================================
		var vVec2;
		//var fValue = -30;
		var tLineArray = new Array;
	    var SegArray1 = this.GetStartAndEndPosFromWall(tFloor.mPath[0],tFloor.mPath[1],tFloor.mFloorMesh, fValue);
	    var SegArray2 = this.GetStartAndEndPosFromWall(tFloor.mPath[tFloor.mPath.length-1],tFloor.mPath[0],tFloor.mFloorMesh,fValue);
	
	    var PosArray = mMathClass.Get2Line(SegArray1[0],SegArray1[1],SegArray2[0],SegArray2[1]);
	    if( PosArray[0] == true )
	    {
	        vVec2 = new THREE.Vector3(PosArray[1],PosArray[2],0);
	        tLineArray.push(vVec2);
	    }
	    
	    for(var i = 1; i<tFloor.mPath.length-1; i++)
	    {
	        SegArray1 = this.GetStartAndEndPosFromWall(tFloor.mPath[i-1],tFloor.mPath[i], tFloor.mFloorMesh, fValue);
	        SegArray2 = this.GetStartAndEndPosFromWall(tFloor.mPath[i],tFloor.mPath[i+1], tFloor.mFloorMesh, fValue);
	        PosArray  = mMathClass.Get2Line(SegArray1[0],SegArray1[1],SegArray2[0],SegArray2[1]);
	        if( PosArray[0] == true )
	        {
	            var vVec1 = new THREE.Vector3(PosArray[1],PosArray[2],0);
	            tLineArray.push(vVec1);	
	       }
	    }

        SegArray1 = this.GetStartAndEndPosFromWall(tFloor.mPath[tFloor.mPath.length-1],tFloor.mPath[0], tFloor.mFloorMesh, fValue);
        SegArray2 = this.GetStartAndEndPosFromWall(tFloor.mPath[tFloor.mPath.length-2],tFloor.mPath[tFloor.mPath.length-1], tFloor.mFloorMesh, fValue);
        PosArray  = mMathClass.Get2Line(SegArray1[0],SegArray1[1],SegArray2[0],SegArray2[1]);
        if( PosArray[0] == true )
        {
            var vVec1 = new THREE.Vector3(PosArray[1],PosArray[2],0);
            tLineArray.push(vVec1);	
        }
        
        tLineArray.push(vVec2);
	    
	    
/*	    for(k = 0; k < tLineArray.length-1; k++)
		{
		var geom = new THREE.Geometry();
      	geom.vertices.push(new THREE.Vector3(tLineArray[k+0].x ,tLineArray[k+0].y, 2));
      	geom.vertices.push(new THREE.Vector3(tLineArray[k+1].x ,tLineArray[k+1].y, 2));	
		var mLine = new THREE.LineSegments( geom, new THREE.LineBasicMaterial( { color: '#ff00ff' } ) );
		mLine.rotation.x = -Math.PI/2;
		scene3D.add(mLine); 
		}*/
		
		return tLineArray;
	};
	
	this.OnUpdateWall_3D_In = function(tFloor, fValue)
	{
		// 生成外轮廓
		//=========================================================================================================
		var vVec2;
		//var fValue = -30;
		var tLineArray = new Array;
	    var SegArray1 = this.GetStartAndEndPosFromWall1(tFloor.mPath[0],tFloor.mPath[1],tFloor.mFloorMesh, fValue);
	    var SegArray2 = this.GetStartAndEndPosFromWall1(tFloor.mPath[tFloor.mPath.length-1],tFloor.mPath[0],tFloor.mFloorMesh,fValue);
	
	    var PosArray = mMathClass.Get2Line(SegArray1[0],SegArray1[1],SegArray2[0],SegArray2[1]);
	    if( PosArray[0] == true )
	    {
	        vVec2 = new THREE.Vector3(PosArray[1],PosArray[2],0);
	        tLineArray.push(vVec2);
	    }
	    
	    for(var i = 1; i<tFloor.mPath.length-1; i++)
	    {
	        SegArray1 = this.GetStartAndEndPosFromWall1(tFloor.mPath[i-1],tFloor.mPath[i], tFloor.mFloorMesh, fValue);
	        SegArray2 = this.GetStartAndEndPosFromWall1(tFloor.mPath[i],tFloor.mPath[i+1], tFloor.mFloorMesh, fValue);
	        PosArray  = mMathClass.Get2Line(SegArray1[0],SegArray1[1],SegArray2[0],SegArray2[1]);
	        if( PosArray[0] == true )
	        {
	            var vVec1 = new THREE.Vector3(PosArray[1],PosArray[2],0);
	            tLineArray.push(vVec1);	
	       }
	    }

        SegArray1 = this.GetStartAndEndPosFromWall1(tFloor.mPath[tFloor.mPath.length-1],tFloor.mPath[0], tFloor.mFloorMesh, fValue);
        SegArray2 = this.GetStartAndEndPosFromWall1(tFloor.mPath[tFloor.mPath.length-2],tFloor.mPath[tFloor.mPath.length-1], tFloor.mFloorMesh, fValue);
        PosArray  = mMathClass.Get2Line(SegArray1[0],SegArray1[1],SegArray2[0],SegArray2[1]);
        if( PosArray[0] == true )
        {
            var vVec1 = new THREE.Vector3(PosArray[1],PosArray[2],0);
            tLineArray.push(vVec1);	
        }
        
        tLineArray.push(vVec2);
	    
	    
/*	    for(k = 0; k < tLineArray.length-1; k++)
		{
		var geom = new THREE.Geometry();
      	geom.vertices.push(new THREE.Vector3(tLineArray[k+0].x ,tLineArray[k+0].y, 2));
      	geom.vertices.push(new THREE.Vector3(tLineArray[k+1].x ,tLineArray[k+1].y, 2));	
		var mLine = new THREE.LineSegments( geom, new THREE.LineBasicMaterial( { color: '#ff00ff' } ) );
		mLine.rotation.x = -Math.PI/2;
		scene3D.add(mLine); 
		}*/
		
		return tLineArray;
	};
	
	/***
	 * 中心点，法向量方向上一个距离
	 *
	 */
	this.GetStartAndEndPosFromWall= function ( vStart, vEnd, tMesh, fDisWall)
	{
	    var vecMax  = new THREE.Vector3(vEnd.X,vEnd.Y,0);
	    var vecMin  = new THREE.Vector3(vStart.X,vStart.Y,0);
	    var vPos    = new THREE.Vector3;
	    vPos.x = ( vecMax.x + vecMin.x )/2;
	    vPos.y = ( vecMax.y + vecMin.y )/2;
	    vPos.z = ( vecMax.z + vecMin.z )/2;
	
	    //--------------------------------------------------------------------
	    var fRotate = 0;
	    var edge1   = new THREE.Vector3;
	    edge1.x = vEnd.X - vStart.X;
	    edge1.y = vEnd.Y - vStart.Y;
	
	    if( Math.abs(edge1.x) < 0.001 )
	        edge1.x = 0.0;
	    if( Math.abs(edge1.y) < 0.001 )
	        edge1.y = 0.0;
	
	    var fRotate;
	    if( edge1.x == 0.0 && edge1.y == 0.0)
	        fRotate = 0.0;
	    else
	        fRotate = Math.atan(edge1.y/edge1.x);
		
	    var tmpMatrix1 = new THREE.Matrix4().makeTranslation(-vPos.x, -vPos.y, 0);
	    var tmpMatrix2 = new THREE.Matrix4().makeRotationZ(Math.PI/2+fRotate);		// 当前角度
	    var tmpMatrix3 = new THREE.Matrix4().makeTranslation(vPos.x,  vPos.y, 0);
	    tmpMatrix2.multiply(tmpMatrix1);
	    tmpMatrix3.multiply(tmpMatrix2);
	
	    var vPos1 = new THREE.Vector3( vPos.x + fDisWall, vPos.y, 10 );
	    var vPos2 = vPos1.applyMatrix4(tmpMatrix3);
	    var vNormal = new THREE.Vector3(0,0,-1);
	    var raycaster1 = new THREE.Raycaster(vPos2,vNormal);
	    raycaster1.linePrecision = 3;
	 	
		tMesh.geometry.computeFaceNormals();
		tMesh.geometry.computeVertexNormals();
		tMesh.geometry.uvsNeedUpdate = true;	
		tMesh.geometry.normalsNeedUpdate = true;
		tMesh.geometry.computeBoundingSphere();
		tMesh.updateMatrixWorld();
	    var Intersections = raycaster1.intersectObject( tMesh );
	
	    var vPosStart,vPosEnd;
	
	    if( Intersections.length>0 )
	    {
	        fDisWall =-fDisWall;
		}

	    var tmpMatrix1 = new THREE.Matrix4().makeTranslation(-vStart.X, -vStart.Y, 0);
	    var tmpMatrix2 = new THREE.Matrix4().makeRotationZ(Math.PI/2+fRotate);		// 当前角度
	    var tmpMatrix3 = new THREE.Matrix4().makeTranslation( vStart.X,  vStart.Y, 0);
	    tmpMatrix2.multiply(tmpMatrix1);
	    tmpMatrix3.multiply(tmpMatrix2);
	
	    vPos1 = new THREE.Vector3( vStart.X + fDisWall, vStart.Y, 0 );
	    vPosStart = vPos1.applyMatrix4(tmpMatrix3);
	
	    var tmpMatrix4 = new THREE.Matrix4().makeTranslation(-vEnd.X, -vEnd.Y, 0);
	    var tmpMatrix5 = new THREE.Matrix4().makeRotationZ(Math.PI/2+fRotate);
	    var tmpMatrix6 = new THREE.Matrix4().makeTranslation( vEnd.X,  vEnd.Y, 0);
	    tmpMatrix5.multiply(tmpMatrix4);
	    tmpMatrix6.multiply(tmpMatrix5);
	
	    vPos1  = new THREE.Vector3( vEnd.X + fDisWall,vEnd.Y, 0 );
	    vPosEnd = vPos1.applyMatrix4(tmpMatrix6);
	
	    var OutArray = new Array;
	    OutArray.push(vPosStart);
	    OutArray.push(vPosEnd);
	    
/*		var geom = new THREE.Geometry();
      	geom.vertices.push(new THREE.Vector3(vPosStart.x ,vPosStart.y, 2));
      	geom.vertices.push(new THREE.Vector3(vPosEnd.x ,vPosEnd.y, 2));	
		var mLine = new THREE.LineSegments( geom, new THREE.LineBasicMaterial( { color: '#ff00ff' } ) );
		mLine.rotation.x = -Math.PI/2;
		scene3D.add(mLine);*/
	    return OutArray;
	};
	
	this.GetStartAndEndPosFromWall1= function ( vStart, vEnd, tMesh, fDisWall)
	{
	    var vecMax  = new THREE.Vector3(vEnd.X,vEnd.Y,0);
	    var vecMin  = new THREE.Vector3(vStart.X,vStart.Y,0);
	    var vPos    = new THREE.Vector3;
	    vPos.x = ( vecMax.x + vecMin.x )/2;
	    vPos.y = ( vecMax.y + vecMin.y )/2;
	    vPos.z = ( vecMax.z + vecMin.z )/2;
	
	    //--------------------------------------------------------------------
	    var fRotate = 0;
	    var edge1   = new THREE.Vector3;
	    edge1.x = vEnd.X - vStart.X;
	    edge1.y = vEnd.Y - vStart.Y;
	
	    if( Math.abs(edge1.x) < 0.001 )
	        edge1.x = 0.0;
	    if( Math.abs(edge1.y) < 0.001 )
	        edge1.y = 0.0;
	
	    var fRotate;
	    if( edge1.x == 0.0 && edge1.y == 0.0)
	        fRotate = 0.0;
	    else
	        fRotate = Math.atan(edge1.y/edge1.x);
		
	    var tmpMatrix1 = new THREE.Matrix4().makeTranslation(-vPos.x, -vPos.y, 0);
	    var tmpMatrix2 = new THREE.Matrix4().makeRotationZ(Math.PI/2+fRotate);		// 当前角度
	    var tmpMatrix3 = new THREE.Matrix4().makeTranslation(vPos.x,  vPos.y, 0);
	    tmpMatrix2.multiply(tmpMatrix1);
	    tmpMatrix3.multiply(tmpMatrix2);
	
	    var vPos1 = new THREE.Vector3( vPos.x + fDisWall, vPos.y, 10 );
	    var vPos2 = vPos1.applyMatrix4(tmpMatrix3);
	    var vNormal = new THREE.Vector3(0,0,-1);
	    var raycaster1 = new THREE.Raycaster(vPos2,vNormal);
	    raycaster1.linePrecision = 3;
	 	
		tMesh.geometry.computeFaceNormals();
		tMesh.geometry.computeVertexNormals();
		tMesh.geometry.uvsNeedUpdate = true;	
		tMesh.geometry.normalsNeedUpdate = true;
		tMesh.geometry.computeBoundingSphere();
		tMesh.updateMatrixWorld();
	    var Intersections = raycaster1.intersectObject( tMesh );
	
	    var vPosStart,vPosEnd;
	
	    if( Intersections.length<=0 )
	    {
	        fDisWall =-fDisWall;
		}

	    var tmpMatrix1 = new THREE.Matrix4().makeTranslation(-vStart.X, -vStart.Y, 0);
	    var tmpMatrix2 = new THREE.Matrix4().makeRotationZ(Math.PI/2+fRotate);		// 当前角度
	    var tmpMatrix3 = new THREE.Matrix4().makeTranslation( vStart.X,  vStart.Y, 0);
	    tmpMatrix2.multiply(tmpMatrix1);
	    tmpMatrix3.multiply(tmpMatrix2);
	
	    vPos1 = new THREE.Vector3( vStart.X + fDisWall, vStart.Y, 0 );
	    vPosStart = vPos1.applyMatrix4(tmpMatrix3);
	
	    var tmpMatrix4 = new THREE.Matrix4().makeTranslation(-vEnd.X, -vEnd.Y, 0);
	    var tmpMatrix5 = new THREE.Matrix4().makeRotationZ(Math.PI/2+fRotate);
	    var tmpMatrix6 = new THREE.Matrix4().makeTranslation( vEnd.X,  vEnd.Y, 0);
	    tmpMatrix5.multiply(tmpMatrix4);
	    tmpMatrix6.multiply(tmpMatrix5);
	
	    vPos1  = new THREE.Vector3( vEnd.X + fDisWall,vEnd.Y, 0 );
	    vPosEnd = vPos1.applyMatrix4(tmpMatrix6);
	
	    var OutArray = new Array;
	    OutArray.push(vPosStart);
	    OutArray.push(vPosEnd);
	    
/*		var geom = new THREE.Geometry();
      	geom.vertices.push(new THREE.Vector3(vPosStart.x ,vPosStart.y, 2));
      	geom.vertices.push(new THREE.Vector3(vPosEnd.x ,vPosEnd.y, 2));	
		var mLine = new THREE.LineSegments( geom, new THREE.LineBasicMaterial( { color: '#ff00ff' } ) );
		mLine.rotation.x = -Math.PI/2;
		scene3D.add(mLine);*/
	    return OutArray;
	};
}