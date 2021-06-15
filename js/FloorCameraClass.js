function FloorCameraClass()
{
		this.m_bShowAllRoom = true;			// 是否显示所有房间
		this.m_Camera;						// 地面视角高度
		this.renderer;
		this.scene;
		this.raycaster;
		this.m_Width   = 210;
		this.m_Height  = 150;
		this.mFloorArray  = new Array(); 
		this.mWallArray   = new Array();
		this.mFlueArray   = new Array();				// 烟道
		this.mPillarArray = new Array();				// 柱子
		this.m_OBBox_Max  = new THREE.Vector3();		// 包围盒
		this.m_OBBox_Min  = new THREE.Vector3();
		this.mouse        = new THREE.Vector2(), INTERSECTED;
		this.OnInit = function()
		{			
			this.m_Camera = new THREE.PerspectiveCamera( 70, this.m_Width / this.m_Height, 1, 30000 );
			this.m_Camera.position.x = 0;
			this.m_Camera.position.y = 0;
			this.m_Camera.position.z = 700;	
			
			this.scene		  	  = new THREE.Scene();
			this.scene.background = new THREE.Color( 0xf8f8f8 );
				  	
	  		this.raycaster = new THREE.Raycaster();
			this.raycaster.linePrecision = 1;
	  		
			this.renderer = new THREE.WebGLRenderer( { antialias: true } );			// 3D
			this.renderer.setPixelRatio( window.devicePixelRatio );
			this.renderer.setSize( 210, 150 );   
			
			document.getElementById('mMap').appendChild( this.renderer.domElement );
			document.getElementById('mMap').addEventListener('mousedown', this.mouseDown,  false );
			document.getElementById('mMap').addEventListener('mousemove', this.mouseMove,  false );			
		
		};
		
		// 点击
		this.mouseDown = function(e)
		{	
			if(m_SystemVersion=='WenZhou'){
				mFloorCameraClass.mouse.x = ((e.clientX - document.getElementById('mMapFrame').offsetLeft-20)/ mFloorCameraClass.m_Width ) * 2 - 1;
				mFloorCameraClass.mouse.y =-((e.clientY - document.getElementById('mMapFrame').offsetTop-40-42) / mFloorCameraClass.m_Height ) * 2 + 1;			
			}else if(m_SystemVersion==''){
				mFloorCameraClass.mouse.x = ((e.clientX - document.getElementById('mMapFrame').offsetLeft-20)/ mFloorCameraClass.m_Width ) * 2 - 1;
				mFloorCameraClass.mouse.y =-((e.clientY - document.getElementById('mMapFrame').offsetTop-40-42) / mFloorCameraClass.m_Height ) * 2 + 1;							
			}else if(m_SystemVersion=='DouXi'){
				mFloorCameraClass.mouse.x = ((e.clientX - document.getElementById('mMapFrame').offsetLeft-20)/ mFloorCameraClass.m_Width ) * 2 - 1;
				mFloorCameraClass.mouse.y =-((e.clientY - document.getElementById('mMapFrame').offsetTop-60-42) / mFloorCameraClass.m_Height ) * 2 + 1;			
			}
						
			// 拾取房间
			mFloorCameraClass.raycaster.setFromCamera( mFloorCameraClass.mouse, mFloorCameraClass.m_Camera );
			var Intersections = mFloorCameraClass.raycaster.intersectObjects(  mFloorCameraClass.mFloorArray);
			for( var i = 0; i< Intersections.length ; i++)
			{						
				if ( INTERSECTED != Intersections[ i ].object )
				{
					var mouseX = Intersections[i].point.x;
					var mouseY = Intersections[i].point.y;
					
					// 拾取墙体对应装配式模型		
		/*			var ab = mFloorCameraClass.CheckPosOnLine(mouseX,mouseY);
					if(ab != -1)	
						mFloorCameraClass.ShowZhuangPei(mFloorCameraClass.mWallArray[ab]);
					else 
					{*/
						mFloorCameraClass.SetAlpha(Intersections[ i ].object);
			//		}
				}
			}	
		};
		
		this.mouseMove = function(e)
		{
			mFloorCameraClass.OnClearHighLight();
			if(m_SystemVersion=='WenZhou'){
				mFloorCameraClass.mouse.x = ((e.clientX - document.getElementById('mMapFrame').offsetLeft-20)/ mFloorCameraClass.m_Width ) * 2 - 1;
				mFloorCameraClass.mouse.y =-((e.clientY - document.getElementById('mMapFrame').offsetTop-40-42) / mFloorCameraClass.m_Height ) * 2 + 1;			
			}else if(m_SystemVersion==''){
				mFloorCameraClass.mouse.x = ((e.clientX - document.getElementById('mMapFrame').offsetLeft-20)/ mFloorCameraClass.m_Width ) * 2 - 1;
				mFloorCameraClass.mouse.y =-((e.clientY - document.getElementById('mMapFrame').offsetTop-40-42) / mFloorCameraClass.m_Height ) * 2 + 1;							
			}else if(m_SystemVersion=='DouXi'){
				mFloorCameraClass.mouse.x = ((e.clientX - document.getElementById('mMapFrame').offsetLeft-20)/ mFloorCameraClass.m_Width ) * 2 - 1;
				mFloorCameraClass.mouse.y =-((e.clientY - document.getElementById('mMapFrame').offsetTop-60-42) / mFloorCameraClass.m_Height ) * 2 + 1;			
			}else if(m_SystemVersion=='kz'){
				mFloorCameraClass.mouse.x = ((e.clientX - document.getElementById('mMapFrame').offsetLeft-20)/ mFloorCameraClass.m_Width ) * 2 - 1;
				mFloorCameraClass.mouse.y =-((e.clientY - document.getElementById('mMapFrame').offsetTop-40-42) / mFloorCameraClass.m_Height ) * 2 + 1;							
			}
			
	/*		for(var i = 0; i< mFloorCameraClass.mWallArray.length; i++ )
			{
				if( (mFloorCameraClass.mWallArray[i].material.color.r == 1) &&
					(mFloorCameraClass.mWallArray[i].material.color.g == 1))
					mFloorCameraClass.mWallArray[i].material.color.set(0x000000);			
			}	*/		
			mFloorCameraClass.raycaster.setFromCamera( mFloorCameraClass.mouse, mFloorCameraClass.m_Camera );
			var Intersections = mFloorCameraClass.raycaster.intersectObjects(  mFloorCameraClass.mFloorArray);
			for( var i = 0; i< Intersections.length ; i++)
			{						
				if ( INTERSECTED != Intersections[ i ].object ) {
					
					var mouseX = Intersections[i].point.x;
					var mouseY = Intersections[i].point.y;
					
					// 拾取墙体对应装配式模型		
		/*			var ab = mFloorCameraClass.CheckPosOnLine(mouseX,mouseY);
					if(ab != -1 )
					{
						if( (mFloorCameraClass.mWallArray[i].material.color.r == 0) &&
							(mFloorCameraClass.mWallArray[i].material.color.g == 0) &&
						    (mFloorCameraClass.mWallArray[i].material.color.b == 0))
						mFloorCameraClass.mWallArray[ab].material.color.set(0xffff00);
					}
					else
					{*/
														
						Intersections[ i ].object.material.color.set(0x67c23a);
			//		}
				}		
			}
		};
		
		this.CheckPosOnLine= function ( posX, posY )
		{
			var pos = new THREE.Vector3(posX,posY,0);
			for( var i = 0; i< mFloorCameraClass.mWallArray.length; i++ )
			{						  
				var ab = mMathClass.ClosestPointOnLine1(mFloorCameraClass.mWallArray[i].geometry.boundingBox.min.x, 
														mFloorCameraClass.mWallArray[i].geometry.boundingBox.min.y,
														mFloorCameraClass.mWallArray[i].geometry.boundingBox.max.x, 
														mFloorCameraClass.mWallArray[i].geometry.boundingBox.max.y,
														posX, posY, 30);
				if( ab[0] != 0 )
					return i;
			}
			return -1;
		};	
		
		// 显示所有房间
		this.OnShowAllRoom = function()
		{
			for(let i = 0; i< this.mFloorArray.length; i++ )
				this.mFloorArray[i].material.opacity=1;	
			
			mHouseClass.mRoomClass.OnShowAllRoom();
			this.m_bShowAllRoom = true;
			
			// 显示尺寸标注
			if(app.header.showLable.check_label == true)
				mHouseClass.mFloorClass.OnShowLabelAll(true);
				
			for(let j=0; j<mHouseClass.mFloorClass.mFloorArray.length; j++)
			{
				mHouseClass.mFloorClass.mFloorArray[j].OnShowLabel(true);	// 不显示尺寸
			}				
		};
		
		// 只显示指定房间
		this.OnShowRoom = function(tFloor)
		{
			
			for(let j=0; j<mHouseClass.mFloorClass.mFloorArray.length; j++)
			{
				if( mHouseClass.mFloorClass.mFloorArray[j] != tFloor)
					mHouseClass.mFloorClass.mFloorArray[j].OnShowLabel(false);	// 不显示尺寸
			}
			
			mHouseClass.mRoomClass.OnShowRoom(tFloor);
			this.m_bShowAllRoom = false;
			
			// 关闭当前尺寸标注	
			mHouseClass.mFloorClass.OnShowLabelAll(false);
			OnMouseRightUp();
	
		};
		
		this.SetAlpha = function(tMesh)
		{
			mHouseClass.mRoomClass.OnShowAllRoom();
			for( i = 0; i< this.mFloorArray.length; i++ )
			{
				if( tMesh == this.mFloorArray[i])
				{
					this.mFloorArray[i].material.opacity=1;
					
					tMesh.geometry.computeBoundingBox();
					
					for( var k = 0; k<mHouseClass.mFloorClass.mFloorArray.length; k++)
					{
						var cMesh = mHouseClass.mFloorClass.mFloorArray[k].mFloorMesh;
						cMesh.geometry.computeBoundingBox();
						
						if( cMesh.geometry.boundingBox.min.equals(tMesh.geometry.boundingBox.min) &&
							cMesh.geometry.boundingBox.max.equals(tMesh.geometry.boundingBox.max))
						{
							this.OnShowRoom(mHouseClass.mFloorClass.mFloorArray[k]);
						}
					}
				}
				else
					this.mFloorArray[i].material.opacity=0.2;
			}
		};
		
		this.ShowZhuangPei = function(tMesh)
		{
			
			tMesh.material.color.set(0xff0000);
		};	
		
		// 清除高亮
		this.OnClearHighLight = function()
		{
			for( i = 0; i< this.mFloorArray.length; i++ )
				this.mFloorArray[i].material.color.set(0xd0d0d0);
		};

		this.OnClear = function()
		{
			this.m_Camera.position.x = 0;
			this.m_Camera.position.y = 0;
			this.m_Camera.position.z = 820;	
			this.m_Camera.rotation.x = 0;
			this.m_Camera.rotation.y = 0;
			this.m_Camera.rotation.z = 0;
			
			this.m_OBBox_Max.x = -999999;
			this.m_OBBox_Max.y = -999999;
			this.m_OBBox_Min.x = 999999;
			this.m_OBBox_Min.y = 999999;
				
			for(var i=0; i<this.mFloorArray.length; i++)
				this.scene.remove(this.mFloorArray[i]);		// 地面
			this.mFloorArray.length = 0;
			
			for(var i=0; i<this.mWallArray.length; i++)
				this.scene.remove(this.mWallArray[i]);		// 墙体
			this.mWallArray.length = 0;			
			
			for( var i =0 ;i<this.mFlueArray.length; i++ )	// 烟道
				this.scene.remove(this.mFlueArray[i]);
			this.mFlueArray.length = 0;

			for( var i =0 ;i<this.mPillarArray.length; i++ )	//柱子 	
				this.scene.remove(this.mPillarArray[i]);
			this.mPillarArray.length = 0;
			
			this.m_bShowAllRoom = true;
		};
		
		// 设置相机位置
		this.SetCameraPos = function(x,y,z)
		{
			this.m_Camera.position.x = x;
			this.m_Camera.position.y = y;
			this.m_Camera.position.z = z;	
			this.m_Camera.rotation.x = 0;
			this.m_Camera.rotation.y = 0;
			this.m_Camera.rotation.z = 0;
		};
		
		this.render = function()
		{
			this.renderer.render(this.scene,this.m_Camera);
		};

		// 更新缩略图
		this.OnUpdate = function(solution_paths, iMaxAreaFloor)
		{
		  
		   this.OnUpdateFloor(solution_paths, iMaxAreaFloor);
		   this.OnUpdateFlue();
		   this.OnUpdatePillar();	
		   this.OnUpdateWall();
		   
		   var x =  (this.m_OBBox_Max.x+ this.m_OBBox_Min.x)/2;
		   var y =  (this.m_OBBox_Max.y+ this.m_OBBox_Min.y)/2;
		   
		   var f1 = this.m_OBBox_Max.x - this.m_OBBox_Min.x;
		   var f2 = this.m_OBBox_Max.y - this.m_OBBox_Min.y;
		  
		   if( f1 > f2 ) 
		   	this.SetCameraPos(x,y,f1);
		   else
		    this.SetCameraPos(x,y,f2);
		}
		
		// 更新烟道
		this.OnUpdateFlue = function()
		{
			for( var i =0 ;i<this.mFlueArray.length; i++ )
				this.scene.remove(this.mFlueArray[i]);
			this.mFlueArray.length = 0;
			for( var i =0 ;i<mHouseClass.mFlueClass.mFlueArray.length; i++ )
			{
				var tLength = mHouseClass.mFlueClass.mFlueArray[i].m_fLength;
				var tWidth  = mHouseClass.mFlueClass.mFlueArray[i].m_fWidth;
				var result_poly = new THREE.Geometry();
				result_poly.vertices.push(new THREE.Vector3(-tLength/2,-tWidth/2, 1.3), new THREE.Vector3( tLength/2,-tWidth/2, 1.3));										
				result_poly.vertices.push(new THREE.Vector3( tLength/2,-tWidth/2, 1.3), new THREE.Vector3( tLength/2, tWidth/2, 1.3));
				result_poly.vertices.push(new THREE.Vector3( tLength/2, tWidth/2, 1.3), new THREE.Vector3(-tLength/2, tWidth/2, 1.3));
				result_poly.vertices.push(new THREE.Vector3(-tLength/2, tWidth/2, 1.3), new THREE.Vector3(-tLength/2,-tWidth/2, 1.3));
				
				
				result_poly.vertices.push(new THREE.Vector3(-tLength/2+3,-tWidth/2+3, 1.3), new THREE.Vector3( tLength/2-3,-tWidth/2+3, 1.3));										
				result_poly.vertices.push(new THREE.Vector3( tLength/2-3,-tWidth/2+3, 1.3), new THREE.Vector3( tLength/2-3, tWidth/2-3, 1.3));
				result_poly.vertices.push(new THREE.Vector3( tLength/2-3, tWidth/2-3, 1.3), new THREE.Vector3(-tLength/2+3, tWidth/2-3, 1.3));
				result_poly.vertices.push(new THREE.Vector3(-tLength/2+3, tWidth/2-3, 1.3), new THREE.Vector3(-tLength/2+3,-tWidth/2+3, 1.3));
	
				result_poly.vertices.push(new THREE.Vector3( tLength/2-3,-tWidth/2+3, 1.3), new THREE.Vector3( tLength/4, tWidth/3, 1.3));										
				result_poly.vertices.push(new THREE.Vector3( tLength/4, tWidth/3, 1.3), new THREE.Vector3(-tLength/2+3, tWidth/2-3, 1.3));
	
				var tFlueMesh = new THREE.LineSegments( result_poly, new THREE.LineBasicMaterial( { color: mResource.mColor, linewidth:1, opacity: 1 } ) );
				this.scene.add(tFlueMesh);
				
				var tmpMatrix2= new THREE.Matrix4().makeRotationZ(mHouseClass.mFlueClass.mFlueArray[i].m_fRotate);
				var tmpMatrix3= new THREE.Matrix4().makeTranslation(mHouseClass.mFlueClass.mFlueArray[i].m_vPos.x,mHouseClass.mFlueClass.mFlueArray[i].m_vPos.y,1);
				tmpMatrix3.multiply(tmpMatrix2);
				tFlueMesh.applyMatrix(tmpMatrix3);	
				this.mFlueArray.push(tFlueMesh);
			}			
		}
		
		this.OnUpdatePillar = function()
		{
			for( var i =0 ;i<this.mPillarArray.length; i++ )
				this.scene.remove(this.mPillarArray[i]);
			this.mPillarArray.length = 0;
			for( var i =0 ;i<mHouseClass.mPillarClass.mFlueArray.length; i++ )
			{
				var tLength = mHouseClass.mPillarClass.mFlueArray[i].m_fLength;
				var tWidth  = mHouseClass.mPillarClass.mFlueArray[i].m_fWidth;
				var result_poly = new THREE.Geometry();
				result_poly.vertices.push(new THREE.Vector3(-tLength/2,-tWidth/2, 1.3), new THREE.Vector3( tLength/2,-tWidth/2, 1.3));										
				result_poly.vertices.push(new THREE.Vector3( tLength/2,-tWidth/2, 1.3), new THREE.Vector3( tLength/2, tWidth/2, 1.3));
				result_poly.vertices.push(new THREE.Vector3( tLength/2, tWidth/2, 1.3), new THREE.Vector3(-tLength/2, tWidth/2, 1.3));
				result_poly.vertices.push(new THREE.Vector3(-tLength/2, tWidth/2, 1.3), new THREE.Vector3(-tLength/2,-tWidth/2, 1.3));
				
				result_poly.vertices.push(new THREE.Vector3(-tLength/2+3,-tWidth/2+3, 1.3), new THREE.Vector3( tLength/2-3,-tWidth/2+3, 1.3));										
				result_poly.vertices.push(new THREE.Vector3( tLength/2-3,-tWidth/2+3, 1.3), new THREE.Vector3( tLength/2-3, tWidth/2-3, 1.3));
				result_poly.vertices.push(new THREE.Vector3( tLength/2-3, tWidth/2-3, 1.3), new THREE.Vector3(-tLength/2+3, tWidth/2-3, 1.3));
				result_poly.vertices.push(new THREE.Vector3(-tLength/2+3, tWidth/2-3, 1.3), new THREE.Vector3(-tLength/2+3,-tWidth/2+3, 1.3));
	
		//		result_poly.vertices.push(new THREE.Vector3( tLength/2-3,-tWidth/2+3, 1.3), new THREE.Vector3( tLength/4, tWidth/3, 1.3));										
		//		result_poly.vertices.push(new THREE.Vector3( tLength/4, tWidth/3, 1.3), new THREE.Vector3(-tLength/2+3, tWidth/2-3, 1.3));
				var tPillarMesh = new THREE.LineSegments( result_poly, new THREE.LineBasicMaterial( { color: mResource.mColor, linewidth:1, opacity: 1 } ) );
				this.scene.add(tPillarMesh);
				
				var tmpMatrix2= new THREE.Matrix4().makeRotationZ(mHouseClass.mPillarClass.mFlueArray[i].m_fRotate);
				var tmpMatrix3= new THREE.Matrix4().makeTranslation(mHouseClass.mPillarClass.mFlueArray[i].m_vPos.x,mHouseClass.mPillarClass.mFlueArray[i].m_vPos.y,1);
				tmpMatrix3.multiply(tmpMatrix2);
				tPillarMesh.applyMatrix(tmpMatrix3);					
				this.mPillarArray.push(tPillarMesh);
			}
		}
		
		// 更新地面区域
		this.OnUpdateFloor = function(solution_paths, iMaxAreaFloor)
		{
			if( solution_paths == null)
			    return;
			    
			this.OnClear();    

			for(i = 0; i < solution_paths.length; i++) 
			{				
				if( i == iMaxAreaFloor )
					continue;
				
				var tFloor = [];
				var paths  = solution_paths[i];
	    		for(j = 0; j < paths.length; j++)
	    		{
	    			if( iMaxAreaFloor != -99 )
	    			{
	      				tFloor.push(new poly2tri.Point(paths[j].X ,paths[j].Y ));
						if( this.m_OBBox_Max.x < paths[j].X ) this.m_OBBox_Max.x  = paths[j].X;
						if( this.m_OBBox_Max.y < paths[j].Y ) this.m_OBBox_Max.y  = paths[j].Y;
						if( this.m_OBBox_Min.x > paths[j].X ) this.m_OBBox_Min.x  = paths[j].X;
						if( this.m_OBBox_Min.y > paths[j].Y ) this.m_OBBox_Min.y  = paths[j].Y; 	      				
	      			}
	      			else
	      			{
	      				tFloor.push(new poly2tri.Point(paths[j].x ,paths[j].y ));
						if( this.m_OBBox_Max.x < paths[j].x ) this.m_OBBox_Max.x  = paths[j].x;
						if( this.m_OBBox_Max.y < paths[j].y ) this.m_OBBox_Max.y  = paths[j].y;
						if( this.m_OBBox_Min.x > paths[j].x ) this.m_OBBox_Min.x  = paths[j].x;
						if( this.m_OBBox_Min.y > paths[j].y ) this.m_OBBox_Min.y  = paths[j].y;	      				
      				}
	    		} 
	    		
				var swctx = new poly2tri.SweepContext(tFloor);
					swctx.triangulate();
				var triangles = swctx.getTriangles();
				
				var geom = new THREE.Geometry();
				for( var k = 0; k< triangles.length; k++ ) 
				{
	    			geom.vertices.push(new THREE.Vector3(triangles[k].points_[0].x, triangles[k].points_[0].y, 0)); 
		        	geom.vertices.push(new THREE.Vector3(triangles[k].points_[1].x, triangles[k].points_[1].y, 0));
		        	geom.vertices.push(new THREE.Vector3(triangles[k].points_[2].x, triangles[k].points_[2].y, 0)); 
		      
		        	geom.faces.push(new THREE.Face3(3*k+0,3*k+1,3*k+2));
		        	
		        	geom.faceVertexUvs[0][k] = [ 
		        	new THREE.Vector2(0, 0),
		        	new THREE.Vector2(0, 0), 
		        	new THREE.Vector2(0, 0)];
	    			
				}
		        geom.computeFaceNormals();
		        geom.verticesNeedUpdate = true;
				geom.uvsNeedUpdate = true;
						
				var mat = new THREE.MeshBasicMaterial( { color: '#d0d0d0' } );
					mat.transparent = true;
				//	mat.blending = THREE.AdditiveBlending;
				var tMesh = new THREE.Mesh( geom, mat);	
				this.scene.add(tMesh);    	
				this.mFloorArray.push(tMesh); 		 
		   }	
		};
		
		this.OnUpdateWall = function()
		{
			for(var j=0; j<mHouseClass.mFloorClass.mFloorArray.length; j++)
			{
				var tFloor 	  = mHouseClass.mFloorClass.mFloorArray[j];
				for(var i = 0; i<tFloor.mLabelArray_Out.length; i++)
				{
					var positions = [];
					var colors 	  = [];
					positions.push(tFloor.mLabelArray_Out[i].m_vStart_Floor.x, tFloor.mLabelArray_Out[i].m_vStart_Floor.y, 0.5);
					positions.push(tFloor.mLabelArray_Out[i].m_vEnd_Floor.x,   tFloor.mLabelArray_Out[i].m_vEnd_Floor.y, 0.5);					
					colors.push(1,1,1);
					colors.push(1,1,1);
					
					var geometry1 = new THREE.LineGeometry();
					geometry1.setPositions( positions );
					geometry1.setColors( colors );
				
					var matLine = new THREE.LineMaterial( {
						depthTest:false,
						color: 0xffffff,
						linewidth: 5, // in pixels
						vertexColors: THREE.VertexColors,
						//resolution:  // to be set by renderer, eventually
						dashed: false
					} );
					
					matLine.resolution.set( 210, 150 ); 	
					var OutLine = new THREE.Line2( geometry1, matLine );
					this.scene.add(OutLine);
					mFloorCameraClass.mWallArray.push(OutLine);
				}
			}	 			
		}
}