
function AIRoomClass()
{
	//AI智能房间布置类
	this.mFloor;		// 当前房间
	this.mAIFile;
	this.m_iCurWall;	// 墙体顺序
	this.mFloorLength; //地面周长

	// 清空当前房间
	this.OnHideFurniture_Room = function(tFloor)
	{
		//  判断模型是否在当前房间内, 有则删除
		for(var i = 0; i<mHouseClass.mFurnitureClass.mFurnitureArray.length; i++ )
		{
			var vPos = mHouseClass.mFurnitureClass.mFurnitureArray[i].m_RenderData2D.position;
			var vPos1 = new THREE.Vector3( vPos.x , vPos.y, 10 );
	    	var vNormal = new THREE.Vector3(0,0,-1);
	    	var raycaster1 = new THREE.Raycaster(vPos1,vNormal);
	   	 	var Intersections = raycaster1.intersectObject( tFloor.mFloorMesh );
	   	 	if( Intersections.length>0 )
				mHouseClass.mFurnitureClass.mFurnitureArray[i].OnShow(false);		
		}
	};
	
	this.OnClearRoom = function(tFloor)
	{
		//  判断模型是否在当前房间内, 有则删除
		for(var i = 0; i<mHouseClass.mFurnitureClass.mFurnitureArray.length; i++ )
		{
			var vPos = mHouseClass.mFurnitureClass.mFurnitureArray[i].m_RenderData2D.position;
			var vPos1 = new THREE.Vector3( vPos.x , vPos.y, 10 );
	    	var vNormal = new THREE.Vector3(0,0,-1);
	    	var raycaster1 = new THREE.Raycaster(vPos1,vNormal);
	   	 	var Intersections = raycaster1.intersectObject( tFloor.mFloorMesh );
	   	 	if( Intersections.length>0 )
				mHouseClass.mFurnitureClass.Delete(mHouseClass.mFurnitureClass.mFurnitureArray[i]);		
		}
	};
	
	this.OnClearObj = function(tFloor,strFile)
	{
		// 删除房间内指定的模型
		for(var i = 0; i<mHouseClass.mFurnitureClass.mFurnitureArray.length; i++ )
		{
			var vPos = mHouseClass.mFurnitureClass.mFurnitureArray[i].m_RenderData2D.position;
			var vPos1 = new THREE.Vector3( vPos.x , vPos.y, 10 );
	    	var vNormal = new THREE.Vector3(0,0,-1);
	    	var raycaster1 = new THREE.Raycaster(vPos1,vNormal);
	   	 	var Intersections = raycaster1.intersectObject( tFloor.mFloorMesh );
	   	 	if( Intersections.length>0 && mHouseClass.mFurnitureClass.mFurnitureArray[i].m_strFile == strFile)
	   	 	{
				mHouseClass.mFurnitureClass.Delete(mHouseClass.mFurnitureClass.mFurnitureArray[i]);	
				i--;
	   	 	}
		}		
	};
	
	// 只显示房间地面，不显示房间家具
	this.OnMouseMove2D  = function()
	{
		// 显示当前房间地面
		var tFloor = mHouseClass.mFloorClass.OnPick2D_Quick(g_mouseX,g_mouseY);
		if( tFloor!= null )
		{				
			this.mFloor = tFloor;
			mHouseClass.mFurnitureClass.OnShowFurnitureAll(true);
			this.OnHideFurniture_Room(tFloor);			
		}
		else
		{
			mHouseClass.mFurnitureClass.OnShowFurnitureAll(true);			
		}
	};
	
	// 按风格布置当前房间
	this.OnCreateRoom = function(strXML)
	{
		m_cPenType   = 7;
		this.mAIFile = strXML;
		$('#container' ).css("cursor","crosshair");
	};
	
	this.OnMouseDown = function()
	{
		m_cPenType = 0;
		$('#container' ).css("cursor","default");
		
		if( this.mFloor == null )
		 return;
		 
		this.OnClearRoom(this.mFloor);	// 清除房间内的模型
		var data =$.ajax({url:this.mAIFile,async:false,});
		var xmlDoc = $.parseXML( data.responseText );
		if(xmlDoc == null)
		{
			alert("AI房间数据不存在，请联系技术支持!");
			return;
		}	
		var  $xml = $( xmlDoc );
		this.m_iCurWall = 0;
		$xml.find("Object").each(function(j){mHouseClass.mAIRoomClass.OnLoadObj($(this));});
		this.mFloor = null;
	};
	
	this.ZhiNengZhuangPeiQiang_ShanChu = function()
	{
		if( IsContain(container, renderer2.domElement ) != true )
		{
			alert("请在3D下操作.");
			return;
		}
		// 智能装配墙
		m_cPenType   = 19;
		$('#container' ).css("cursor","crosshair");			
	};
	
	this.ZhiNengZhuangPeiQiang_WaDong = function()
	{
		if( IsContain(container, renderer2.domElement ) != true )
		{
			alert("请在3D下操作.");
			return;
		}
		// 智能装配墙
		m_cPenType   = 22;
		$('#container' ).css("cursor","crosshair");			
	};	
	
	this.ZhiNengZhuangPeiQiang_KaiShi = function()
	{
		
		if( IsContain(container, renderer2.domElement ) != true )
		{
			alert("请在3D下操作.");
			return;
		}			
		// 智能装配墙
		
		if(app.kz.SelectArea.int =="空间排布")
			m_cPenType  = 18;
		else 
			m_cPenType  = 20;
		$('#container' ).css("cursor","crosshair");		
	};
	
	this.ZhiNengZhuangPeiQiang_DianJi_WaDong = function()
	{
		m_cPenType = 0;
		$('#container' ).css("cursor","default");
		
		this.mFloor = mHouseClass.mFloorClass.OnPick3D(g_mouseX,g_mouseY);
		if( this.mFloor == null )
			return;	
			
		// 得到门窗
		var winArray = this.mFloor.GetWinArray();
		if( winArray.length > 0 )
		{
			for( var i = 0; i< winArray.length; i++)
			{
				// 判断门窗洞区域是否与当前物体有相交,有则挖洞
				for(var j=0; j<mHouseClass.mFurnitureClass.mFurnitureArray.length; j++)
				{	
					var boxWin = new THREE.Box3();
						boxWin.setFromObject( winArray[i].m_Object);
					var boxObj = new THREE.Box3();
						boxObj.setFromObject( mHouseClass.mFurnitureClass.mFurnitureArray[j].m_Object3D);
						
					if( true == boxWin.intersectsBox(boxObj))
						mMathClass.MoXingWaDong(mHouseClass.mFurnitureClass.mFurnitureArray[j], winArray[i]);
				}			
			}
		}

		var doorArray = this.mFloor.GetDoorArray();
		if( doorArray.length > 0 )
		{			
			for( var i = 0; i< doorArray.length; i++)
			{
				// 判断门窗洞区域是否与当前物体有相交,有则挖洞
				for(var j=0; j<mHouseClass.mFurnitureClass.mFurnitureArray.length; j++)
				{	
					var boxDoor = new THREE.Box3();
						boxDoor.setFromObject( doorArray[i].m_Object );
					var boxObj = new THREE.Box3();
						boxObj.setFromObject( mHouseClass.mFurnitureClass.mFurnitureArray[j].m_Object3D);
						
					if( true == boxDoor.intersectsBox(boxObj))
						mMathClass.MoXingWaDong(mHouseClass.mFurnitureClass.mFurnitureArray[j], doorArray[i]);
				}			
			}	
		}
	};
	
	this.ZhiNengZhuangPeiQiang_DianJi_ShanChu = function()
	{
		m_cPenType = 0;
		$('#container' ).css("cursor","default");
		
		this.mFloor = mHouseClass.mFloorClass.OnPick3D(g_mouseX,g_mouseY);
		if( this.mFloor == null )
			return;	

		this.OnClearObj(this.mFloor,this.m_strFile1);	// 清除房间内的模型		
		this.OnClearObj(this.mFloor,this.m_strFile2);
	}
	
	this.GetFloor_Old = function(tWall)
	{
		var box = new THREE.Box3();
			box.setFromObject( tWall.mWallMesh )
			box.max.y = -box.max.z;
			box.min.y = -box.min.z;	
			box.max.z = 0;
			box.min.z = 0;
		var ab = new Array();
		
		for(var i = 0; i<mHouseClass.mFloorClass.mFloorArray.length; i++)
		{
			for(var k = 0; k<mHouseClass.mFloorClass.mFloorArray[i].mLabelArray_Out.length; k++)
			{
				if( box.min.distanceTo(mHouseClass.mFloorClass.mFloorArray[i].mLabelArray_Out[k].m_vEnd_Floor)<0.1 &&
					box.max.distanceTo(mHouseClass.mFloorClass.mFloorArray[i].mLabelArray_Out[k].m_vStart_Floor)<0.1 )
				{
					ab.push(i);
					ab.push(k);
					return ab;
				}
				
				if( box.min.distanceTo(mHouseClass.mFloorClass.mFloorArray[i].mLabelArray_Out[k].m_vStart_Floor)<0.1 &&
					box.max.distanceTo(mHouseClass.mFloorClass.mFloorArray[i].mLabelArray_Out[k].m_vEnd_Floor)<0.1 )
				{
					ab.push(i);
					ab.push(k);
					return ab;
				}
			}
		}
		return ab;
	};
	
	
	this.GetFloor = function(tWall)
	{
		// 判断两点是否在线段上
		var ab = new Array();
		for(var i = 0; i<mHouseClass.mFloorClass.mFloorArray.length; i++)
		{
			for(var k = 0; k<mHouseClass.mFloorClass.mFloorArray[i].mLabelArray_Out.length; k++)
			{
				var vec1 = mHouseClass.mFloorClass.mFloorArray[i].mLabelArray_Out[k].m_vStart_Floor;
				var vec2 = mHouseClass.mFloorClass.mFloorArray[i].mLabelArray_Out[k].m_vEnd_Floor;
				var ab1   = mMathClass.ClosestPointOnLine1(vec1.x, vec1.y, vec2.x, vec2.y, tWall.m_vStart.x,tWall.m_vStart.y, 1);
				var ab2   = mMathClass.ClosestPointOnLine1(vec1.x, vec1.y, vec2.x, vec2.y, tWall.m_vEnd.x,tWall.m_vEnd.y, 1);
				if( ab1[0] != 0 && ab2[0] != 0)
				{
					ab.push(i);
					ab.push(k);
					return ab;
				}			
			}
		}
		return ab;
	};	
	
	
	this.m_strFile1 = 'cF6A92EDB2EC727030BF79515B389419F/c885D74ED7844D1CE88AF96F2577CD6EC/cF89A5747A109B468D56253D5BF749DF8/PPqb01/PPqb01.3ds';
	this.m_strFile2 = 'cF6A92EDB2EC727030BF79515B389419F/c885D74ED7844D1CE88AF96F2577CD6EC/cF89A5747A109B468D56253D5BF749DF8/PPcsa01/PPcsa01.3ds';				
	this.OnChangeTexture =function(index)
	{
		$("#mImage1").removeClass("active");
		$("#mImage2").removeClass("active");
		$("#mImage3").removeClass("active");
		if(index == 0)
		{
			this.m_strFile1 = 'cF6A92EDB2EC727030BF79515B389419F/c885D74ED7844D1CE88AF96F2577CD6EC/cF89A5747A109B468D56253D5BF749DF8/PPqb01/PPqb01.3ds';
			this.m_strFile2 = 'cF6A92EDB2EC727030BF79515B389419F/c885D74ED7844D1CE88AF96F2577CD6EC/cF89A5747A109B468D56253D5BF749DF8/PPcsa01/PPcsa01.3ds';				
			$("#mImage1").addClass("active");			
		}

		if(index == 2)
		{
			this.m_strFile1 = 'cF6A92EDB2EC727030BF79515B389419F/c885D74ED7844D1CE88AF96F2577CD6EC/cF89A5747A109B468D56253D5BF749DF8/MWqb01/MWqb01.3ds';
			this.m_strFile2 = 'cF6A92EDB2EC727030BF79515B389419F/c885D74ED7844D1CE88AF96F2577CD6EC/cF89A5747A109B468D56253D5BF749DF8/MWqb02/MWqb02.3ds';								
			$("#mImage3").addClass("active");
		}
		if( index == 1)
		{
			this.m_strFile1 = 'cF6A92EDB2EC727030BF79515B389419F/c885D74ED7844D1CE88AF96F2577CD6EC/cF89A5747A109B468D56253D5BF749DF8/LSqb01/LSqb01.3ds';
			this.m_strFile2 = 'cF6A92EDB2EC727030BF79515B389419F/c885D74ED7844D1CE88AF96F2577CD6EC/cF89A5747A109B468D56253D5BF749DF8/LSqb02/LSqb02.3ds';				
			$("#mImage2").addClass("active");
		}
	};
	
	this.ZhiNengZhuangPeiQiang_DianJi_Wall = function()
	{
		m_cPenType = 0;
		this.mFloorLength = 0;

		$('#container' ).css("cursor","default");
		
		var tWall = mHouseClass.mWallClass3D_In.OnPick3D(g_mouseX,g_mouseY);	// 拾取墙体			
		if( tWall == null )
			return;	
			
		var ab = this.GetFloor(tWall);
		if( ab.length == 0)
			return;
	
		if( app.kz.cenggao-2400<= 0 )
		{
			alert("小于2400,暂不支持!");
			return;
		}
			
		this.mFloor = mHouseClass.mFloorClass.mFloorArray[ab[0]];
		var k = ab[1];	// 地板上第几面墙
		
		var strName ='墙板';
		var fLength = 600;
		var fWidth 	= 30;
		
		var fHeight = app.kz.sizeH.int;
		var strImage= 'cF6A92EDB2EC727030BF79515B389419F/c885D74ED7844D1CE88AF96F2577CD6EC/cF89A5747A109B468D56253D5BF749DF8/PPqb01/PPqb01.jpg';
/*		this.OnClearObj(this.mFloor,'cF6A92EDB2EC727030BF79515B389419F/c885D74ED7844D1CE88AF96F2577CD6EC/cF89A5747A109B468D56253D5BF749DF8/PPqb01/PPqb01.3ds');	// 清除房间内的模型
		this.OnClearObj(this.mFloor,'cF6A92EDB2EC727030BF79515B389419F/c885D74ED7844D1CE88AF96F2577CD6EC/cF89A5747A109B468D56253D5BF749DF8/PPcsa01/PPcsa01.3ds');	// 清除房间内的模型
		this.OnClearObj(this.mFloor,'cF6A92EDB2EC727030BF79515B389419F/c885D74ED7844D1CE88AF96F2577CD6EC/cF89A5747A109B468D56253D5BF749DF8/MWqb01/MWqb01.3ds');	// 清除房间内的模型
		this.OnClearObj(this.mFloor,'cF6A92EDB2EC727030BF79515B389419F/c885D74ED7844D1CE88AF96F2577CD6EC/cF89A5747A109B468D56253D5BF749DF8/MWqb02/MWqb02.3ds');	// 清除房间内的模型		
		this.OnClearObj(this.mFloor,'cF6A92EDB2EC727030BF79515B389419F/c885D74ED7844D1CE88AF96F2577CD6EC/cF89A5747A109B468D56253D5BF749DF8/LSqb01/LSqb01.3ds');	// 清除房间内的模型
		this.OnClearObj(this.mFloor,'cF6A92EDB2EC727030BF79515B389419F/c885D74ED7844D1CE88AF96F2577CD6EC/cF89A5747A109B468D56253D5BF749DF8/LSqb02/LSqb02.3ds');	// 清除房间内的模型
		*/	

		if( fHeight == 2400 )	// 两层
		{
			// 第一层
			//=================================================================================================
				var fLWall  = this.mFloor.GetLengthFromWall(k);
			    this.mFloorLength = fLWall;

				var iCount  = parseInt((fLWall+30)/60);
				for(var i = 1; i<iCount; i++ )	
				{	
					var ftmp = -fLWall/2+60*i-30;
					if( i == 1)
						ftmp = -fLWall/2+30*i;
					var vPos 	= this.mFloor.GetPosFromWall(k,1,ftmp);
					var fRotate	= this.mFloor.GetAngleFromWall(k,vPos);	// 墙旋转角度
					var tFurniture = new Furniture();
					var ab = new Array();	
						ab.push(strName);
						ab.push(strImage);
						ab.push(this.m_strFile1);
						ab.push(fLength);
						ab.push(fWidth);
						ab.push(fHeight);
					mHouseClass.mFurnitureClass.mFurnitureArray.push( tFurniture );
					tFurniture.m_fRotate = fRotate;	//度
					tFurniture.m_vPos.x = vPos.x;	// 3D 位置
					tFurniture.m_vPos.z =-vPos.y;
					tFurniture.m_vPos.y = vPos.z;
					tFurniture.OnCreate3D(ab);		
					tFurniture.OnCreate2D();
					
/*					tFurniture.m_vPos.x = vPos.x;	// 2D 位置
					tFurniture.m_vPos.y = vPos.y;
					tFurniture.m_vPos.z = vPos.z;*/
				}
				
				var tmp = fLWall-(60*iCount-60);
				if(tmp>0)
				{
					var vPos 	= this.mFloor.GetPosFromWall(k,1,fLWall/2-tmp/2);
					var fRotate	= this.mFloor.GetAngleFromWall(k,vPos);	// 墙旋转角度
					var tFurniture = new Furniture();
					var ab = new Array();	
						ab.push(strName);
						ab.push(strImage);
						ab.push(this.m_strFile1);
						ab.push(tmp*10);
						ab.push(fWidth);
						ab.push(fHeight);
					mHouseClass.mFurnitureClass.mFurnitureArray.push( tFurniture );

					tFurniture.m_fRotate = fRotate;	//度
					tFurniture.m_vPos.x = vPos.x;
					tFurniture.m_vPos.z =-vPos.y;
					tFurniture.m_vPos.y = vPos.z;
					tFurniture.OnCreate3D(ab);		
					tFurniture.OnCreate2D();	
				}
				
				// 第二层
				//===========================================================================================
				var fHeight1 = app.kz.cenggao-2400;

				for(var i = 1; i<iCount; i++ )	
				{	
					var ftmp = -fLWall/2+60*i-30;
					if( i == 1)
						ftmp = -fLWall/2+30*i;
					var vPos 	= this.mFloor.GetPosFromWall(k,1,ftmp);
					var fRotate	= this.mFloor.GetAngleFromWall(k,vPos);	// 墙旋转角度
					var tFurniture = new Furniture();
					var ab = new Array();	
						ab.push(strName);
						ab.push(strImage);
						ab.push(this.m_strFile2);
						ab.push(fLength);
						ab.push(fWidth);
						ab.push(fHeight1);
					mHouseClass.mFurnitureClass.mFurnitureArray.push( tFurniture );
					tFurniture.m_fRotate = fRotate;	//度
					tFurniture.m_vPos.x = vPos.x;
					tFurniture.m_vPos.z =-vPos.y;
					tFurniture.m_vPos.y = 240;
					tFurniture.m_fHight = 2400;
					tFurniture.OnCreate3D(ab);		
					tFurniture.OnCreate2D();
				}
				
				var tmp = fLWall-(60*iCount-60);
				if(tmp>0)
				{
					var vPos 	= this.mFloor.GetPosFromWall(k,1,fLWall/2-tmp/2);
					var fRotate	= this.mFloor.GetAngleFromWall(k,vPos);	// 墙旋转角度
					var tFurniture = new Furniture();
					var ab = new Array();	
						ab.push(strName);
						ab.push(strImage);
						ab.push(this.m_strFile2);
						ab.push(tmp*10);
						ab.push(fWidth);
						ab.push(fHeight1);
					mHouseClass.mFurnitureClass.mFurnitureArray.push( tFurniture );

					tFurniture.m_fRotate = fRotate;	//度
					tFurniture.m_vPos.x = vPos.x;
					tFurniture.m_vPos.z =-vPos.y;
					tFurniture.m_vPos.y = 240;
					tFurniture.m_fHight = 2400;
					tFurniture.OnCreate3D(ab);		
					tFurniture.OnCreate2D();
				}
		}
		else
		{

				var fLWall  = this.mFloor.GetLengthFromWall(k);
			    this.mFloorLength = fLWall;

				var iCount  = parseInt((fLWall+30)/60);

				for(var i = 1; i<iCount; i++ )	
				{	
					var ftmp = -fLWall/2+60*i-30;
					if( i == 1)
						ftmp = -fLWall/2+30*i;
					var vPos 	= this.mFloor.GetPosFromWall(k,1,ftmp);
					var fRotate	= this.mFloor.GetAngleFromWall(k,vPos);	// 墙旋转角度
					var tFurniture = new Furniture();
					var ab = new Array();	
						ab.push(strName);
						ab.push(strImage);
						ab.push(this.m_strFile1);
						ab.push(fLength);
						ab.push(fWidth);
						ab.push(fHeight);
					mHouseClass.mFurnitureClass.mFurnitureArray.push( tFurniture );
					tFurniture.m_fRotate = fRotate;	//度
					tFurniture.m_vPos.x = vPos.x;
					tFurniture.m_vPos.z =-vPos.y;
					tFurniture.m_vPos.y = vPos.z;
					tFurniture.OnCreate3D(ab);		
					tFurniture.OnCreate2D();
				}
				
				var tmp = fLWall-(60*iCount-60);
				if(tmp>0)
				{
					var vPos 	= this.mFloor.GetPosFromWall(k,1,fLWall/2-tmp/2);
					var fRotate	= this.mFloor.GetAngleFromWall(k,vPos);	// 墙旋转角度
					var tFurniture = new Furniture();
					var ab = new Array();	
						ab.push(strName);
						ab.push(strImage);
						ab.push(this.m_strFile1);
						ab.push(tmp*10);
						ab.push(fWidth);
						ab.push(fHeight);
					mHouseClass.mFurnitureClass.mFurnitureArray.push( tFurniture );
					tFurniture.m_fRotate = fRotate;	//度
					tFurniture.m_vPos.x = vPos.x;
					tFurniture.m_vPos.z =-vPos.y;
					tFurniture.m_vPos.y = vPos.z;
					tFurniture.OnCreate3D(ab);		
					tFurniture.OnCreate2D();			
				}
		}
		this.mFloor = null;	
	};
	
	this.ZhiNengZhuangPeiQiang_DianJi = function()
	{
		// 创建装配墙体
		m_cPenType = 0;
		this.mFloorLength = 0;

		$('#container' ).css("cursor","default");
		
		this.mFloor = mHouseClass.mFloorClass.OnPick3D(g_mouseX,g_mouseY);
		if( this.mFloor == null )
			return;				
		

		this.m_iCurWall = 0;
		
		var strName ='墙板';
		var fLength = 600;
		var fWidth 	= 30;
		
		var fHeight = app.kz.sizeH.int;
		var strImage= 'cF6A92EDB2EC727030BF79515B389419F/c885D74ED7844D1CE88AF96F2577CD6EC/cF89A5747A109B468D56253D5BF749DF8/PPqb01/PPqb01.jpg';
		
		this.OnClearObj(this.mFloor,'cF6A92EDB2EC727030BF79515B389419F/c885D74ED7844D1CE88AF96F2577CD6EC/cF89A5747A109B468D56253D5BF749DF8/PPqb01/PPqb01.3ds');	// 清除房间内的模型
		this.OnClearObj(this.mFloor,'cF6A92EDB2EC727030BF79515B389419F/c885D74ED7844D1CE88AF96F2577CD6EC/cF89A5747A109B468D56253D5BF749DF8/PPcsa01/PPcsa01.3ds');	// 清除房间内的模型
		this.OnClearObj(this.mFloor,'cF6A92EDB2EC727030BF79515B389419F/c885D74ED7844D1CE88AF96F2577CD6EC/cF89A5747A109B468D56253D5BF749DF8/MWqb01/MWqb01.3ds');	// 清除房间内的模型
		this.OnClearObj(this.mFloor,'cF6A92EDB2EC727030BF79515B389419F/c885D74ED7844D1CE88AF96F2577CD6EC/cF89A5747A109B468D56253D5BF749DF8/MWqb02/MWqb02.3ds');	// 清除房间内的模型		
		this.OnClearObj(this.mFloor,'cF6A92EDB2EC727030BF79515B389419F/c885D74ED7844D1CE88AF96F2577CD6EC/cF89A5747A109B468D56253D5BF749DF8/LSqb01/LSqb01.3ds');	// 清除房间内的模型
		this.OnClearObj(this.mFloor,'cF6A92EDB2EC727030BF79515B389419F/c885D74ED7844D1CE88AF96F2577CD6EC/cF89A5747A109B468D56253D5BF749DF8/LSqb02/LSqb02.3ds');	// 清除房间内的模型
				
		
		var iCountWall = this.mFloor.GetCountWall();
		if( fHeight == 2400 )	// 两层
		{
			// 第一层
			//=================================================================================================
			for(var k = 0; k<iCountWall; k++)
			{
				var fLWall  = this.mFloor.GetLengthFromWall(k);
				this.mFloorLength += fLWall;

				var iCount  = parseInt((fLWall+30)/60);
				for(var i = 1; i<iCount; i++ )	
				{	
					var ftmp = -fLWall/2+60*i-30;
					if( i == 1)
						ftmp = -fLWall/2+30*i;
					var vPos 	= this.mFloor.GetPosFromWall(k,1,ftmp);
					var fRotate	= this.mFloor.GetAngleFromWall(k,vPos);	// 墙旋转角度
					var tFurniture = new Furniture();
					var ab = new Array();	
						ab.push(strName);
						ab.push(strImage);
						ab.push(this.m_strFile1);
						ab.push(fLength);
						ab.push(fWidth);
						ab.push(fHeight);
					mHouseClass.mFurnitureClass.mFurnitureArray.push( tFurniture );
					tFurniture.m_fRotate = fRotate;	//度
					tFurniture.m_vPos.x = vPos.x;
					tFurniture.m_vPos.z =-vPos.y;
					tFurniture.m_vPos.y = vPos.z;
					tFurniture.OnCreate3D(ab);		
					tFurniture.OnCreate2D();
				}
				
				var tmp = fLWall-(60*iCount-60);
				if(tmp>0)
				{
					var vPos 	= this.mFloor.GetPosFromWall(k,1,fLWall/2-tmp/2);
					var fRotate	= this.mFloor.GetAngleFromWall(k,vPos);	// 墙旋转角度
					var tFurniture = new Furniture();
					var ab = new Array();	
						ab.push(strName);
						ab.push(strImage);
						ab.push(this.m_strFile1);
						ab.push(tmp*10);
						ab.push(fWidth);
						ab.push(fHeight);
					mHouseClass.mFurnitureClass.mFurnitureArray.push( tFurniture );
					tFurniture.m_fRotate = fRotate;	//度
					tFurniture.m_vPos.x = vPos.x;
					tFurniture.m_vPos.z =-vPos.y;
					tFurniture.m_vPos.y = vPos.z;
					tFurniture.OnCreate3D(ab);		
					tFurniture.OnCreate2D();			
				}
				
				// 第二层
				//===========================================================================================
				var fHeight1 = mHouseClass.m_fHeight*10-2400;
				for(var i = 1; i<iCount; i++ )	
				{	
					var ftmp = -fLWall/2+60*i-30;
					if( i == 1)
						ftmp = -fLWall/2+30*i;
					var vPos 	= this.mFloor.GetPosFromWall(k,1,ftmp);
					var fRotate	= this.mFloor.GetAngleFromWall(k,vPos);	// 墙旋转角度
					var tFurniture = new Furniture();
					var ab = new Array();	
						ab.push(strName);
						ab.push(strImage);
						ab.push(this.m_strFile2);
						ab.push(fLength);
						ab.push(fWidth);
						ab.push(fHeight1);
					mHouseClass.mFurnitureClass.mFurnitureArray.push( tFurniture );
					tFurniture.m_fRotate = fRotate;	//度
					tFurniture.m_vPos.x = vPos.x;
					tFurniture.m_vPos.z =-vPos.y;
					tFurniture.m_vPos.y = 240;
					tFurniture.m_fHight = 2400;
					tFurniture.OnCreate3D(ab);		
					tFurniture.OnCreate2D();
				}
				
				var tmp = fLWall-(60*iCount-60);
				if(tmp>0)
				{
					var vPos 	= this.mFloor.GetPosFromWall(k,1,fLWall/2-tmp/2);
					var fRotate	= this.mFloor.GetAngleFromWall(k,vPos);	// 墙旋转角度
					var tFurniture = new Furniture();
					var ab = new Array();	
						ab.push(strName);
						ab.push(strImage);
						ab.push(this.m_strFile2);
						ab.push(tmp*10);
						ab.push(fWidth);
						ab.push(fHeight1);
					mHouseClass.mFurnitureClass.mFurnitureArray.push( tFurniture );
					tFurniture.m_fRotate = fRotate;	//度
					tFurniture.m_vPos.x = vPos.x;
					tFurniture.m_vPos.z =-vPos.y;
					tFurniture.m_vPos.y = 240;
					tFurniture.m_fHight = 2400;
					tFurniture.OnCreate3D(ab);		
					tFurniture.OnCreate2D();			
				}
			}
		}
		else
		{
			for(var k = 0; k<iCountWall; k++)
			{
				var fLWall  = this.mFloor.GetLengthFromWall(k);
				this.mFloorLength = fLWall;

				var iCount  = parseInt((fLWall+30)/60);
				for(var i = 1; i<iCount; i++ )	
				{	
					var ftmp = -fLWall/2+60*i-30;
					if( i == 1)
						ftmp = -fLWall/2+30*i;
					var vPos 	= this.mFloor.GetPosFromWall(k,1,ftmp);
					var fRotate	= this.mFloor.GetAngleFromWall(k,vPos);	// 墙旋转角度
					var tFurniture = new Furniture();
					var ab = new Array();	
						ab.push(strName);
						ab.push(strImage);
						ab.push(this.m_strFile1);
						ab.push(fLength);
						ab.push(fWidth);
						ab.push(fHeight);
					mHouseClass.mFurnitureClass.mFurnitureArray.push( tFurniture );
					tFurniture.m_fRotate = fRotate;	//度
					tFurniture.m_vPos.x = vPos.x;
					tFurniture.m_vPos.z =-vPos.y;
					tFurniture.m_vPos.y = vPos.z;
					tFurniture.OnCreate3D(ab);		
					tFurniture.OnCreate2D();
				}
				
				var tmp = fLWall-(60*iCount-60);
				if(tmp>0)
				{
					var vPos 	= this.mFloor.GetPosFromWall(k,1,fLWall/2-tmp/2);
					var fRotate	= this.mFloor.GetAngleFromWall(k,vPos);	// 墙旋转角度
					var tFurniture = new Furniture();
					var ab = new Array();	
						ab.push(strName);
						ab.push(strImage);
						ab.push(this.m_strFile1);
						ab.push(tmp*10);
						ab.push(fWidth);
						ab.push(fHeight);
					mHouseClass.mFurnitureClass.mFurnitureArray.push( tFurniture );
					tFurniture.m_fRotate = fRotate;	//度
					tFurniture.m_vPos.x = vPos.x;
					tFurniture.m_vPos.z =-vPos.y;
					tFurniture.m_vPos.y = vPos.z;
					tFurniture.OnCreate3D(ab);		
					tFurniture.OnCreate2D();			
				}
			}
		}
		this.mFloor = null;	
	};
	
	
	this.OnLoadObj = function(data)
	{	// 智能布置物品
		var strName = $(data).attr('Name');
		var fLength = parseFloat($(data).attr('Length'));
		var fWidth 	= parseFloat($(data).attr('Width'));
		var fHeight = parseFloat($(data).attr('Height'));
		
		var fRotate = parseFloat($(data).attr('Rotate'));
		var fPosZ 	= parseFloat($(data).attr('PosZ'))/10;		// 如果<0 则置顶
		
		var fDisWall= parseFloat($(data).attr('DisWall'))/10;
		var fCenter = parseFloat($(data).attr('DisCenter'));
		var iWall   = parseInt($(data).attr('Wall'));
		var fOffset = parseFloat($(data).attr('Offset'))/10;
		
		var strCeiling = $(data).attr('Ceiling');		// 是否置顶
		var strWindow  = $(data).attr('Window');		// 是否可以有窗户
		var strImage = String($(data).attr('Image'));
		var strFile3D= String($(data).attr('File3D'));
		
		var k   = strFile3D.lastIndexOf(".");
		var str = strFile3D.slice(k+1);
		if( str.toLocaleLowerCase() == "a3d")
		{
			strImage = 'c2B279B19DF3A446C1E576EDFC0CA68C4/c863C2F2AACC50FFD9FDFC1A1A51BA46E/c95EEBC8C6A743ECB05CB3984C352D698/OSfgd206/OSfgd206.jpg';
			strFile3D= 'c2B279B19DF3A446C1E576EDFC0CA68C4/c863C2F2AACC50FFD9FDFC1A1A51BA46E/c95EEBC8C6A743ECB05CB3984C352D698/OSfgd206/OSfgd206.3ds';				
		}
	
		var fRotateWall= 0;
		var vPos 	   = new THREE.Vector3();
		var iMainWall  = 1;
		switch(iWall)
		{
			case 0: // 主墙体
			case 1: // 顺时针第二堵墙
			case -1:// 逆时针第二堵墙
			{
				if(iWall == 0)
					this.m_iCurWall= iMainWall;
				if(iWall == 1)
					this.m_iCurWall= iMainWall+1;
				if(iWall ==-1)
					this.m_iCurWall= iMainWall-1;
					
				fDisWall 	   = fDisWall + fWidth/20; // 离墙距离+模型宽度
				
				// 靠右边
				if( fOffset== -999999 )
				{
				 	var fl = this.mFloor.mLabelArray_Out[this.m_iCurWall].m_vEnd_Floor.distanceTo(this.mFloor.mLabelArray_Out[this.m_iCurWall].m_vStart_Floor); 				
				 	fOffset = -(fl-fLength/10)/2;
				}
				// 靠左边
				if( fOffset== 999999 )
				{
				 	var fl = this.mFloor.mLabelArray_Out[this.m_iCurWall].m_vEnd_Floor.distanceTo(this.mFloor.mLabelArray_Out[this.m_iCurWall].m_vStart_Floor); 				
				 	fOffset = (fl-fLength/10)/2;
				}
				
				var vPosTmp    = this.mFloor.GetPosFromWall(this.m_iCurWall,fDisWall,fOffset);
				
				// 是否置顶
				if( fPosZ >= 0 )	
				{
					vPosTmp.z= fPosZ;
				}
				else
				{
					vPosTmp.z = mHouseClass.m_fHeight-fHeight/10;
				}
				
				vPos.x = vPosTmp.x;
				vPos.y = vPosTmp.z;
				vPos.z =-vPosTmp.y;	
				
				var vPosCenter = this.mFloor.GetPosFromWall(this.m_iCurWall,10,0);
				fRotateWall	   = this.mFloor.GetAngleFromWall(this.m_iCurWall,vPosCenter);	// 墙旋转角度
				var bUse = this.OnSetObj(this.m_iCurWall,fDisWall,vPos,fLength,fOffset,strWindow);
				
				// 当前家具可以加载到房间
				if( bUse == true ){
					var tFurniture = new Furniture();
					var ab = new Array();	
						ab.push(strName);
						ab.push(strImage);
						ab.push(strFile3D);
						ab.push(fLength);
						ab.push(fWidth);
						ab.push(fHeight);
					mHouseClass.mFurnitureClass.mFurnitureArray.push( tFurniture );
					tFurniture.m_fRotate = fRotateWall+fRotate;	//度
					tFurniture.m_vPos = vPos;
					tFurniture.OnCreate3D(ab);		
					tFurniture.OnCreate2D();	
				}
			}
			break;
						
			case 997:// 所有窗户上配窗帘
			{
				for(var j=0;  j<this.mFloor.mLabelArray_Out.length; j++)
				{
					for( var k =0; k< mHouseClass.mWindowClass.mWindowArray.length; k++ )
					{
						var ab   = mMathClass.ClosestPointOnLine1(this.mFloor.mLabelArray_Out[j].m_vStart_Floor.x,
									this.mFloor.mLabelArray_Out[j].m_vStart_Floor.y,
									this.mFloor.mLabelArray_Out[j].m_vEnd_Floor.x,
									this.mFloor.mLabelArray_Out[j].m_vEnd_Floor.y,
									mHouseClass.mWindowClass.mWindowArray[k].m_vPos.x,
									mHouseClass.mWindowClass.mWindowArray[k].m_vPos.y, 25);
						if( ab[0] != 0 )	// 有窗户
						{
							var strWindowMode  = $(data).attr('WindowLength');	
							if(strWindowMode =='WindowLength')							//窗帘宽度和窗户宽一样
								fLength = mHouseClass.mWindowClass.mWindowArray[k].m_fLength*10;
							if(strWindowMode =='WallLength')							//窗帘宽度和墙宽一样
								fLength = this.mFloor.GetLengthFromWall(j);
						
							fDisWall 	   = fDisWall + fWidth/20; // 离墙距离+模型宽度
							
							var vPosTmp    = this.mFloor.GetPosFromWall(j,fDisWall,fOffset);
							vPosTmp.z= fPosZ;
							vPos.x = vPosTmp.x;
							vPos.y = vPosTmp.z;
							vPos.z =-vPosTmp.y;	
							
							fRotateWall	   = this.mFloor.GetAngleFromWall(j,vPos);	// 墙旋转角度
							bUse = this.OnSetObj(j,fDisWall,vPos,fLength,fOffset,strWindow);
							
							if( bUse == true ){
								var tFurniture = new Furniture();
								var ab = new Array();	
									ab.push(strName);
									ab.push(strImage);
									ab.push(strFile3D);
									ab.push(fLength);
									ab.push(fWidth);
									ab.push(fHeight);
								mHouseClass.mFurnitureClass.mFurnitureArray.push( tFurniture );
								tFurniture.m_fRotate = fRotateWall+fRotate;	//度
								tFurniture.m_vPos = vPos;
								tFurniture.OnCreate3D(ab);
								tFurniture.OnCreate2D();	
							}	
							
							if(strWindowMode =='WallLength')//窗帘宽度和墙宽一样, 一堵墙一副窗帘
							   break;
						}
					}
				}
			}
			break;
			
			case 999: // 主墙对面那堵墙
			{
				this.m_iCurWall= iMainWall;
				fDisWall 	   = fDisWall + fWidth/20; // 离墙距离+模型宽度
				// 对面墙体				
				var iOppositeWall= this.mFloor.GetOppositeWallFromWall(this.m_iCurWall,20,0);
				
				var vPosTmp    = this.mFloor.GetPosFromWall(iOppositeWall,fDisWall,fOffset);				
				vPosTmp.z= fPosZ;
				vPos.x = vPosTmp.x;
				vPos.y = vPosTmp.z;
				vPos.z =-vPosTmp.y;	
				fRotateWall	= this.mFloor.GetAngleFromWall(iOppositeWall,vPos);	// 墙旋转角度+180
				var bUse 	= this.OnSetObj(iOppositeWall,fDisWall,vPos,fLength,fOffset,strWindow);
				
				// 当前家具可以加载到房间
				if( bUse == true )
				{
					var tFurniture = new Furniture();
					var ab = new Array();	
						ab.push(strName);
						ab.push(strImage);
						ab.push(strFile3D);
						ab.push(fLength);
						ab.push(fWidth);
						ab.push(fHeight);
					mHouseClass.mFurnitureClass.mFurnitureArray.push( tFurniture );
					tFurniture.m_fRotate = fRotateWall+fRotate;	//度
					tFurniture.m_vPos = vPos;
					tFurniture.OnCreate3D(ab);		
					tFurniture.OnCreate2D();	
				}				
			}
			break;			
		}
	};
	
	
	this.OnSetObj = function(iCurWall,fDisWall,vPos,fLength,fOffset,strWindow)
	{
		var vPosCenter = this.mFloor.GetPosFromWall(iCurWall,fDisWall,0);
		
		var fWallLength= this.mFloor.GetLengthFromWall(iCurWall);		// 墙的长度
			
		// 当前家具可以放在有窗户的墙体下，且	
		if( ( strWindow.toLocaleLowerCase() == 'false' ) )
		{
			if( true == this.mFloor.GetWinAndDoorFromWall(iCurWall) )	// 有洞则不显示
				return false;
		}
		
		if(fWallLength/2 >= (fLength/20+Math.abs(fOffset)) ) 	//墙体长度大于 家具长度+偏移量 在vPos初创建
			return true;
		
		return false;
	};
}