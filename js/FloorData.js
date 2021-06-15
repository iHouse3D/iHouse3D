/**
 * @api FloorData
 * @apiGroup FloorData
 * @apiName  0
 * @apiDescription 地平面类
 * @apiParam (成员变量) m_OBBox_Max 包围盒最大值
 * @apiParam (成员变量) m_OBBox_Min 包围盒最小值
 * @apiParam (成员变量) mFloorMesh  	  平面图地面Mesh
 * @apiParam (成员变量) mFloorMeshSVG 施工图地面Mesh
 * @apiParam (成员变量) mFloorMesh3D  3D地面Mesh
 * @apiParam (成员变量) mFloorExtrude 地面边挤压厚度
 * @apiParam (成员变量) mVerticesOld  原始数据
 * @apiParam (成员变量) mLabelArray   所有边的尺寸标注
 * @apiParam (成员变量) mLabelArray_Out 外围标注
 * @apiParam (成员变量) mPath   原始轮廓
 * @apiParam (成员变量) mPathHoles   洞轮廓
 * @apiParam (成员变量) mTextureData   材质数据
 * @apiParam (成员变量) mfLayer   层级
 * @apiParam (成员变量) mfArea   地面面积
 * @apiParam (成员变量) bUpdate  是否更新，地面重建时用
 * @apiParam (成员变量) m_fHeight  高度
 * @apiParam (成员变量) m_tmpWall  单房间显示时的临时墙体, 类似墙顶厚
 */
function FloorData()
{
	// 地面(2D/3D地面在一起)
		this.m_OBBox_Max  = new THREE.Vector3();		// 包围盒
		this.m_OBBox_Min  = new THREE.Vector3();
		this.mFloorMesh; 								// 地面三角形
		this.mFloorMeshSVG;								// 颜色地块
		this.mFloorMesh3D;								// 3D地面
		this.mFloorExtrude;								// 挤压

		this.mTextData = null;
		this.mVerticesOld 	= new Array();				// 原始数据
		this.mLabelArray  	= new Array();				// 所有边的尺寸标注
		this.mLabelArray_Out= new Array();				// 外围标注
		this.mPath;										// 原始轮廓
		this.mPathHoles;								// 洞
		this.mTextureData;								// 材质数据
		this.mfLayer  = -0.1;
		this.mfArea   = 0.00;  							// 地面面积
		this.bUpdate  = false;							// 是否更新，地面重建时用
		this.m_fHeight= 0;								// 高度
		this.m_tmpWall;									// 单房间显示时的临时墙体, 类似墙顶厚
		this.OnInit= function () 
		{			
		};
		
		this.ExtrudeGeometry = function()
		{
			var offsetX = 0;
			var offsetY = 0;
			var shape = new THREE.Shape();
			shape.moveTo(this.mPath[0].X - offsetX, this.mPath[0].Y - offsetY);
    		for(var i = 0; i < this.mPath.length; i++)
      			shape.lineTo(this.mPath[i].X - offsetX, this.mPath[i].Y - offsetY);
      		
		    shape.lineTo(this.mPath[0].X - offsetX, this.mPath[0].Y - offsetY);
    
			var extrudeSettings = {amount: 1, bevelEnabled: false, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1};
		    var tGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
		    
			if(this.mFloorExtrude)
  	 		   scene3D.remove(this.mFloorExtrude);
  	 
  	 		var material = new THREE.MeshPhongMaterial({color: 0x606060, specular: 0x909090,side: THREE.DoubleSide, wireframe: false, shading: THREE.SmoothShading});
			this.mFloorExtrude = new THREE.Mesh(tGeometry, material);
			this.mFloorExtrude.rotation.x = -Math.PI/2;
			this.mFloorExtrude.scale.z = -20;
			this.mFloorExtrude.position.y = this.mfLayer-1;
			scene3D.add(this.mFloorExtrude);   
		};
		
		
		/**
		 * @api OnBuildFloor()
		 * @apiGroup FloorData 
		 * @apiName  0
		 * @apiDescription 初始化柱子
		 * @apiParam (参数) paths 轮廓数据
		 * @apiParam (参数) fLayer 层高
		 */			
		this.OnBuildFloor = function(paths, fLayer)
		{
			// 生成所有地面区域
			this.mPath 		  = paths;
			this.mPathOutline = paths;
			this.mfLayer 	  = fLayer;
			var tFloor 		  = [];
			var tFloor1       = [];
			this.mVerticesOld.length = 0;
			this.m_OBBox_Max.x = -99999;
			this.m_OBBox_Max.y = -99999;
			this.m_OBBox_Min.x =  99999;
			this.m_OBBox_Min.y =  99999;
    		for(j = 0; j < paths.length; j++)
    		{
      			tFloor.push(new poly2tri.Point(paths[j].X ,paths[j].Y ));
      			tFloor1.push(new poly2tri.Point(paths[j].X ,paths[j].Y ));
				if( this.m_OBBox_Max.x < paths[j].X ) this.m_OBBox_Max.x  = paths[j].X;
				if( this.m_OBBox_Max.y < paths[j].Y ) this.m_OBBox_Max.y  = paths[j].Y;
				if( this.m_OBBox_Min.x > paths[j].X ) this.m_OBBox_Min.x  = paths[j].X;
				if( this.m_OBBox_Min.y > paths[j].Y ) this.m_OBBox_Min.y  = paths[j].Y; 
    		} 
    		
			var swctx = new poly2tri.SweepContext(tFloor);
				swctx.triangulate();
			var triangles = swctx.getTriangles();
			
			this.mfArea= 0;
			var geom = new THREE.Geometry();
			for( var k = 0; k< triangles.length; k++ ) 
			{
    			geom.vertices.push(new THREE.Vector3(triangles[k].points_[0].x, triangles[k].points_[0].y, fLayer)); 
	        	geom.vertices.push(new THREE.Vector3(triangles[k].points_[1].x, triangles[k].points_[1].y, fLayer));
	        	geom.vertices.push(new THREE.Vector3(triangles[k].points_[2].x, triangles[k].points_[2].y, fLayer)); 
	      		geom.faces.push(new THREE.Face3(3*k+0,3*k+1,3*k+2));
			}
			
			geom.computeBoundingBox();		
			var fw = this.m_OBBox_Max.x-this.m_OBBox_Min.x;
			var fh = this.m_OBBox_Max.y-this.m_OBBox_Min.y;
			for( var k = 0; k< triangles.length; k++ ) 
			{
	      		this.mVerticesOld.push(new THREE.Vector3(triangles[k].points_[0].x, triangles[k].points_[0].y, fLayer));
	      		this.mVerticesOld.push(new THREE.Vector3(triangles[k].points_[1].x, triangles[k].points_[1].y, fLayer));
	      		this.mVerticesOld.push(new THREE.Vector3(triangles[k].points_[2].x, triangles[k].points_[2].y, fLayer));

	        	geom.faceVertexUvs[0][k] = [ 
	        	new THREE.Vector2((triangles[k].points_[0].x - geom.boundingBox.min.x)/fw, (triangles[k].points_[0].y - geom.boundingBox.min.y)/fh),
	        	new THREE.Vector2((triangles[k].points_[1].x - geom.boundingBox.min.x)/fw, (triangles[k].points_[1].y - geom.boundingBox.min.y)/fh), 
	        	new THREE.Vector2((triangles[k].points_[2].x - geom.boundingBox.min.x)/fw, (triangles[k].points_[2].y - geom.boundingBox.min.y)/fh)];
    			
    			this.mfArea+=mMathClass.GetAreaInTri( triangles[k].points_[0].x, triangles[k].points_[0].y,
    									 			  triangles[k].points_[1].x, triangles[k].points_[1].y,
    									 			  triangles[k].points_[2].x, triangles[k].points_[2].y);
			}
	        geom.computeFaceNormals();
	        geom.verticesNeedUpdate = true;
			geom.uvsNeedUpdate 		= true;
						
						
			var tFloorTex = new THREE.TextureLoader().load('img/floor.jpg' );
  			tFloorTex.wrapS = tFloorTex.wrapT = THREE.RepeatWrapping;
			tFloorTex.repeat.set( 2.5, 2.5 );
 			tFloorTex.needsUpdate = true;						
						
			var mat = new THREE.MeshBasicMaterial( { map: tFloorTex } );
				mat.map.repeat.set( fw/256,fh/256 );
			this.mFloorMesh   = new THREE.Mesh( geom,mat);			
			scene.add(this.mFloorMesh);
				
			
			this.mFloorMeshSVG   = new THREE.Mesh( geom, new THREE.MeshBasicMaterial( { color: 0xffffff } ));
			scene.add(this.mFloorMeshSVG);				
			this.mFloorMeshSVG.visible = false;
			
			this.OnUpdateLabel(tFloor1);	// 更新尺寸信息
			
			this.OnChange2DTo3D();
			this.OnShowLabel(true);			// 是否显示尺寸

			this.mTextData = mHouseClass.mTextClass.OnCreate((this.m_OBBox_Max.x+this.m_OBBox_Min.x)/2,(this.m_OBBox_Max.y+this.m_OBBox_Min.y)/2)
		};
		
		// 更新标注
		this.OnUpdateLabel = function(tFloor)
		{
			for(var i = 0; i<this.mLabelArray.length; i++)		// 内轮廓
				this.mLabelArray[i].OnClear();
			this.mLabelArray.length = 0;
			
			for(var i = 0; i<this.mLabelArray_Out.length; i++)	// 外轮廓
				this.mLabelArray_Out[i].OnClear();
			this.mLabelArray_Out.length = 0;
			
   			// 生成内尺寸
    		//===============================================================================================
    		for(i = 0; i < tFloor.length-1; i++)
    		{
				var tLabel = new LabelClass();
					tLabel.OnInit(0x666666);	//0x58A3F3
					tLabel.OnUpdateLabel_2(tFloor[i],tFloor[i+1],this);
					tLabel.m_vStart_Floor.x= tFloor[i].x;
					tLabel.m_vStart_Floor.y= tFloor[i].y;
					tLabel.m_vEnd_Floor.x  = tFloor[i+1].x;
					tLabel.m_vEnd_Floor.y  = tFloor[i+1].y;
					this.mLabelArray.push(tLabel);
    		}
    		
			var tLabel = new LabelClass();
				tLabel.OnInit(0x666666);
				tLabel.OnUpdateLabel_2(tFloor[i],tFloor[0],this);
				tLabel.m_vStart_Floor.x= tFloor[i].x;
				tLabel.m_vStart_Floor.y= tFloor[i].y;
				tLabel.m_vEnd_Floor.x  = tFloor[0].x;
				tLabel.m_vEnd_Floor.y  = tFloor[0].y;
				this.mLabelArray.push(tLabel);
	
			
    		// 生成外尺寸
    		//===============================================================================================			
    		for(i = 0; i < tFloor.length-1; i++)
    		{
				var tLabel = new LabelClass();
					tLabel.OnInit(0x363636);
					tLabel.OnUpdateLabel_3(tFloor[i],tFloor[i+1]);
					tLabel.m_vStart_Floor.x= tFloor[i].x;
					tLabel.m_vStart_Floor.y= tFloor[i].y;
					tLabel.m_vEnd_Floor.x  = tFloor[i+1].x;
					tLabel.m_vEnd_Floor.y  = tFloor[i+1].y;
					tLabel.OnShowLabel(false);
					this.mLabelArray_Out.push(tLabel);
    		}
    		
			var tLabel1 = new LabelClass();
				tLabel1.OnInit(0x363636);
				tLabel1.OnUpdateLabel_3(tFloor[i],tFloor[0]); 
				tLabel1.m_vStart_Floor.x= tFloor[i].x;
				tLabel1.m_vStart_Floor.y= tFloor[i].y;
				tLabel1.m_vEnd_Floor.x  = tFloor[0].x;
				tLabel1.m_vEnd_Floor.y  = tFloor[0].y;
				tLabel1.OnShowLabel(false);
				this.mLabelArray_Out.push(tLabel1);			
			//=================================================================================================			
		};
		
		// 更新2D地面
		this.OnUpdateTex = function(ab)
		{			
			this.mTextureData = new TextureData();			
			this.mTextureData.OnCreate(ab);
			this.mTextureData.mTexture.wrapS = this.mTextureData.mTexture.wrapT = THREE.RepeatWrapping;
			this.mTextureData.mTexture.needsUpdate = true;
			
			this.mFloorMesh.material.map = this.mTextureData.mTexture;
	    	this.mFloorMesh.material.needsUpdate = true;
		};
		
		/**
		 * @api OnUpdateHeight(fHeight)
		 * @apiGroup FloorData 
		 * @apiName  0
		 * @apiDescription 更新3D下地面高度 
		 */			
		this.OnUpdateHeight = function(fHeight)
		{
			if(this.mFloorMesh3D == null )
				return;			
			this.m_fHeight = fHeight;	
			for(var i = 0; i<this.mFloorMesh3D.geometry.vertices.length; i++ )
				this.mFloorMesh3D.geometry.vertices[i].z = fHeight;
		
			this.mFloorMesh3D.geometry.computeBoundingBox();
			this.mFloorMesh3D.geometry.computeFaceNormals();
			this.mFloorMesh3D.geometry.verticesNeedUpdate = true;
			this.mFloorMesh3D.geometry.uvsNeedUpdate = true;	
		};
		
		this.OnChangeFloorTex = function(ab)
		{
			if( g_dataTex == null )
				return;				
			this.OnUpdateTex3D(ab);		// 同时更新3D，2D地面
		};
		
		/**
		 * @api OnUpdateTex3D(ab)
		 * @apiGroup FloorData 
		 * @apiName  0
		 * @apiDescription 更新3D下地面
		 * 
		 */			
		this.OnUpdateTex3D = function(ab)
		{			
			this.mTextureData = new TextureData();			
			this.mTextureData.OnCreate(ab);
			this.mTextureData.mTexture.wrapS = this.mTextureData.mTexture.wrapT = THREE.RepeatWrapping;
			
			var fw = (this.m_OBBox_Max.x-this.m_OBBox_Min.x)/this.mTextureData.m_fLength;
			var fh = (this.m_OBBox_Max.y-this.m_OBBox_Min.y)/this.mTextureData.m_fWidth;
			
			this.mTextureData.mTexture.offset.set(  0, 0 );
			this.mTextureData.mTexture.repeat.set( fw*10,fh*10 );
			this.mTextureData.mTexture.center.set(  0, 0 );
			this.mTextureData.mTexture.rotation = 0; 
			
			this.mTextureData.m_x1 = (this.m_OBBox_Max.x+this.m_OBBox_Min.x)/2;
			this.mTextureData.m_y1 = (this.m_OBBox_Max.y+this.m_OBBox_Min.y)/2;
			// 判断3D地面是否生成
			if( this.mFloorMesh3D != undefined )
			{
				this.mFloorMesh3D.material.map = this.mTextureData.mTexture;
				this.mFloorMesh3D.material.needsUpdate = true;	
			}
			this.mFloorMesh.material.map = this.mTextureData.mTexture;
	    	this.mFloorMesh.material.needsUpdate = true;
		};
			
		this.OnShowLabel = function(bShow)
		{
			if( this.mFloorMesh.visible == false )
				return;
			for(var i = 0; i<this.mLabelArray.length; i++)
				this.mLabelArray[i].OnShowLabel(bShow)
		};
		
		// 显示 区域的轮廓尺寸标注
		this.OnShowLabel_Out = function(bShow)
		{
			return;
			
			var fCenterX = (mHouseClass.mFloorClass.m_OBBox_Max.x+mHouseClass.mFloorClass.m_OBBox_Min.x)/2;
			var fCenterY = (mHouseClass.mFloorClass.m_OBBox_Max.y+mHouseClass.mFloorClass.m_OBBox_Min.y)/2;

			var off 	= 160; // 偏移高度
			for(var i = 0; i<this.mLabelArray_Out.length; i++)
			{
				if(this.mLabelArray_Out[i].mbShowLabel == false)	// 如果不显示，则不更新
					continue;
				
				var fPosX = (this.mLabelArray_Out[i].m_vEnd.x+this.mLabelArray_Out[i].m_vStart.x)/2;
				var fPosY = (this.mLabelArray_Out[i].m_vEnd.y+this.mLabelArray_Out[i].m_vStart.y)/2;
				
				var fL    = Math.abs(this.mLabelArray_Out[i].m_vEnd.x - this.mLabelArray_Out[i].m_vStart.x);
				var fW	  = Math.abs(this.mLabelArray_Out[i].m_vEnd.y - this.mLabelArray_Out[i].m_vStart.y);
				
				//横向画线
				if( fL > fW )
				{
					if( fPosY > fCenterY )
					{
						var vStartH = new THREE.Vector3(this.mLabelArray_Out[i].m_vStart.x, mHouseClass.mFloorClass.m_OBBox_Max.y+off, 0);
						var vEndH 	= new THREE.Vector3(this.mLabelArray_Out[i].m_vEnd.x, mHouseClass.mFloorClass.m_OBBox_Max.y+off, 0);	
						this.mLabelArray_Out[i].OnUpdateLabel_3(vStartH,vEndH);
						
					}
					else
					{
						var vStartH = new THREE.Vector3(this.mLabelArray_Out[i].m_vStart.x, mHouseClass.mFloorClass.m_OBBox_Min.y-off, 0);
						var vEndH 	= new THREE.Vector3(this.mLabelArray_Out[i].m_vEnd.x, mHouseClass.mFloorClass.m_OBBox_Min.y-off, 0);	
						this.mLabelArray_Out[i].OnUpdateLabel_4(vStartH,vEndH);
					}
				}
				else	//竖向画线
				{
					if( fPosX > fCenterX )
					{
						var vStartV = new THREE.Vector3(mHouseClass.mFloorClass.m_OBBox_Max.x+off, this.mLabelArray_Out[i].m_vStart.y, 0);
						var vEndV 	= new THREE.Vector3(mHouseClass.mFloorClass.m_OBBox_Max.x+off, this.mLabelArray_Out[i].m_vEnd.y, 0);				
						this.mLabelArray_Out[i].OnUpdateLabel_3(vStartV,vEndV);
					}
					else
					{
						var vStartV = new THREE.Vector3(mHouseClass.mFloorClass.m_OBBox_Min.x-off, this.mLabelArray_Out[i].m_vStart.y, 0);
						var vEndV 	= new THREE.Vector3(mHouseClass.mFloorClass.m_OBBox_Min.x-off, this.mLabelArray_Out[i].m_vEnd.y, 0);
						this.mLabelArray_Out[i].OnUpdateLabel_3(vStartV,vEndV);
					}
				}
				
					this.mLabelArray_Out[i].OnShowLabel(bShow);
			}
		};

		/**
		 * @api OnClear()
		 * @apiGroup FloorData 
		 * @apiName  0
		 * @apiDescription 清除当前地面
		 * 
		 */	
		this.OnClear = function()
		{
			this.OnClear2D();
			this.OnClear3D();
			mHouseClass.mTextClass.OnDelete(this.mTextData);
		};
		
		/**
		 * @api OnClear2D()
		 * @apiGroup FloorData 
		 * @apiName  0
		 * @apiDescription 清除当前2D地面
		 * 
		 */			
		this.OnClear2D = function()
		{
			scene.remove(this.mFloorMesh);		// 地面	
			scene.remove(this.mFloorMeshSVG);
			for(var i = 0; i<this.mLabelArray.length; i++)
				this.mLabelArray[i].OnClear();
		
			this.mLabelArray.length = 0;
			
			for(var i = 0; i<this.mLabelArray_Out.length; i++)
				this.mLabelArray_Out[i].OnClear();
		
			this.mLabelArray_Out.length = 0;			
		};
		
		/**
		 * @api OnClear3D()
		 * @apiGroup FloorData 
		 * @apiName  0
		 * @apiDescription 清除当前3D地面
		 * 
		 */	
		this.OnClear3D = function()
		{
			scene3D.remove(this.mFloorMesh3D);
		};
		
		// 循环所有的标签，2D下拾取标注尺寸
		this.OnPick2D_Label = function(mouseX,mouseY)
		{
			for(var i = 0; i<this.mLabelArray_Out.length; i++)
			{
				var ab = this.mLabelArray_Out[i].CheckPosOnLine(mouseX,mouseY);			
				if( ab[0] !=0 )
				{				
					return this.mLabelArray_Out[i];
				}
			}
			return null;
		};
		
		this.OnChange2DTo3D = function()
		{    			        
			var geom = new THREE.Geometry();
			var faces = this.mFloorMesh.geometry.faces;
			for( var k = 0; k< faces.length; k++ ) 
			{
			    var v1 = this.mFloorMesh.geometry.vertices[faces[k].a]; 
			    var v2 = this.mFloorMesh.geometry.vertices[faces[k].b]; 
			    var v3 = this.mFloorMesh.geometry.vertices[faces[k].c];
				
				if( this.mFloorMesh3D == null )
				{
					geom.vertices.push(new THREE.Vector3(v1.x, v1.y, v1.z)); 	        	 
	        		geom.vertices.push(new THREE.Vector3(v2.x, v2.y, v2.z)); 
	        		geom.vertices.push(new THREE.Vector3(v3.x, v3.y, v3.z));					
				}
				else
				{
					var v11 = this.mFloorMesh3D.geometry.vertices[faces[k].a]; 
				    var v21 = this.mFloorMesh3D.geometry.vertices[faces[k].b]; 
				    var v31 = this.mFloorMesh3D.geometry.vertices[faces[k].c];
	
	    			geom.vertices.push(new THREE.Vector3(v1.x, v1.y, v11.z)); 	        	 
		        	geom.vertices.push(new THREE.Vector3(v2.x, v2.y, v21.z)); 
		        	geom.vertices.push(new THREE.Vector3(v3.x, v3.y, v31.z));
	        	}
	        	geom.faces.push(new THREE.Face3(3*k+0,3*k+1,3*k+2));
	        
	        	var uv1 = this.mFloorMesh.geometry.faceVertexUvs[0][k][0]; 
			    var uv2 = this.mFloorMesh.geometry.faceVertexUvs[0][k][1];
			    var uv3 = this.mFloorMesh.geometry.faceVertexUvs[0][k][2];  
	        	geom.faceVertexUvs[0][k] = [ new THREE.Vector2(uv1.x, uv1.y), new THREE.Vector2(uv2.x, uv2.y),new THREE.Vector2(uv3.x, uv3.y)];
    		}		

 	        geom.computeFaceNormals();
	        geom.verticesNeedUpdate = true;
			geom.uvsNeedUpdate = true;

			scene3D.remove(this.mFloorMesh3D);
			
			if( this.mTextureData == null)	// 默认的地面
			{
				
				var floorMat = new THREE.MeshStandardMaterial( {
					roughness: 0.2,
					color: 0xbbbbbb,
					metalness: 0.2,
					map: mResource.floorDiffuseTex,
					bumpMap:mResource.floorBumpTex,
					roughnessMap:mResource.floorRoughnessTex
				} );
			
				this.mFloorMesh3D = new THREE.Mesh( geom, floorMat);
				mResource.floorMat.needsUpdate = true;
			}
			else
			{
				var tMat = new THREE.MeshStandardMaterial( {
					map: this.mTextureData.mTexture,
					roughness: 1,
				} );
				this.mFloorMesh3D = new THREE.Mesh( geom, tMat);
			}
			this.mFloorMesh3D.rotation.x = -Math.PI/2;			
			scene3D.add(this.mFloorMesh3D);
		};
		

		this.IsSameAs = function( tFloor )
		{
			// 判断是否是相同地面区域
			// 中心点相同 && 面积相同 && 			
			var fCenterXOld = (this.m_OBBox_Max.x+this.m_OBBox_Min.x)/2;
			var fCenterYOld = (this.m_OBBox_Max.y+this.m_OBBox_Min.y)/2;

			var fCenterX = (tFloor.m_OBBox_Max.x+tFloor.m_OBBox_Min.x)/2;
			var fCenterY = (tFloor.m_OBBox_Max.y+tFloor.m_OBBox_Min.y)/2;
			
			// 面积相同 且 中心点相同
			if(Math.abs(tFloor.mfArea- this.mfArea)<1 &&
			   Math.abs(fCenterXOld- fCenterX)<1 && Math.abs(fCenterYOld- fCenterY)<1)
			{
				var faces = this.mFloorMesh.geometry.faces;					
				for( var k = 0; k< faces.length; k++ ) 
				{
				    var v1 = this.mFloorMesh.geometry.vertices[faces[k].a]; 
				    var v2 = this.mFloorMesh.geometry.vertices[faces[k].b]; 
				    var v3 = this.mFloorMesh.geometry.vertices[faces[k].c];
				    
				    var n1 = tFloor.mFloorMesh.geometry.vertices[faces[k].a]; 
				    var n2 = tFloor.mFloorMesh.geometry.vertices[faces[k].b]; 
				    var n3 = tFloor.mFloorMesh.geometry.vertices[faces[k].c];
				    
					if(Math.abs(v1.x - n1.x)>0.001 || Math.abs(v1.y - n1.y)>0.001 || Math.abs(v1.z - n1.z)>0.001 )
						return false;
					if(Math.abs(v2.x - n2.x)>0.001 || Math.abs(v2.y - n2.y)>0.001 || Math.abs(v2.z - n2.z)>0.001 )
						return false;
					if(Math.abs(v3.x - n3.x)>0.001 || Math.abs(v3.y - n3.y)>0.001 || Math.abs(v3.z - n3.z)>0.001 )
						return false;						
				}
				return true;
			}
			
			return false;
		};

		
		this.OnUpdateTmpWall = function()
		{
			var tLineArray = mHouseClass.mRoomClass.OnUpdateWall_3D_Out(this, -20);
			
			var tReg = [];
			for(var j = 0; j < tLineArray.length-1; j++)
				tReg.push(new poly2tri.Point(tLineArray[j].x ,tLineArray[j].y ));
	
			var swctx     = new poly2tri.SweepContext(tReg);
			//===========================================================
			var hole = [];
			for(var j = 0; j < this.mPath.length; j++)
			{
				hole.push(new poly2tri.Point(this.mPath[j].X ,this.mPath[j].Y ));
			}
			swctx.addHole(hole);
	
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

			scene.remove(this.m_tmpWall);
			this.m_tmpWall = new THREE.Mesh( geom, new THREE.MeshBasicMaterial( { side: THREE.DoubleSide, opacity:1, transparent: false, color: 0xAAAAAA  } ) );
			scene.add(this.m_tmpWall);
		};
		
		
		
		this.GetWinAndDoorFromWall = function(iWall)
		{
			for( var k =0; k< mHouseClass.mWindowClass.mWindowArray.length; k++ )
			{
				var ab   = mMathClass.ClosestPointOnLine1(this.mLabelArray_Out[iWall].m_vStart_Floor.x,
							this.mLabelArray_Out[iWall].m_vStart_Floor.y,
							this.mLabelArray_Out[iWall].m_vEnd_Floor.x,
							this.mLabelArray_Out[iWall].m_vEnd_Floor.y,
							mHouseClass.mWindowClass.mWindowArray[k].m_vPos.x,
							mHouseClass.mWindowClass.mWindowArray[k].m_vPos.y, 25);
				if( ab[0] != 0 )
					return true;
			}
			
			for( var k =0; k< mHouseClass.mDoorClass.mDoorArray.length; k++ )
			{
				var ab   = mMathClass.ClosestPointOnLine1(this.mLabelArray_Out[iWall].m_vStart_Floor.x,
							this.mLabelArray_Out[iWall].m_vStart_Floor.y,
							this.mLabelArray_Out[iWall].m_vEnd_Floor.x,
							this.mLabelArray_Out[iWall].m_vEnd_Floor.y,
							mHouseClass.mDoorClass.mDoorArray[k].m_vPos.x,
							mHouseClass.mDoorClass.mDoorArray[k].m_vPos.y, 25);
				if( ab[0] != 0 )
					return true;
			}
			
			return false;
		};
		
		this.GetWinArray = function()
		{
			// 得到房间内的窗户数组
			var winArray = new Array();
			for(var i = 0; i<this.mLabelArray_Out.length; i++)
			{
				for( var k =0; k< mHouseClass.mWindowClass.mWindowArray.length; k++ )
				{
					var ab   = mMathClass.ClosestPointOnLine1(this.mLabelArray_Out[i].m_vStart_Floor.x,
								this.mLabelArray_Out[i].m_vStart_Floor.y,
								this.mLabelArray_Out[i].m_vEnd_Floor.x,
								this.mLabelArray_Out[i].m_vEnd_Floor.y,
								mHouseClass.mWindowClass.mWindowArray[k].m_vPos.x,
								mHouseClass.mWindowClass.mWindowArray[k].m_vPos.y, 25);
					if( ab[0] != 0 )
						winArray.push(mHouseClass.mWindowClass.mWindowArray[k]);
				}
			}
			return winArray;
		};		
		
		this.GetDoorArray = function()
		{
			// 得到房间内的窗户数组
			var doorArray = new Array();
			for(var i = 0; i<this.mLabelArray_Out.length; i++)
			{
				for( var k =0; k< mHouseClass.mDoorClass.mDoorArray.length; k++ )
				{
					var ab   = mMathClass.ClosestPointOnLine1(this.mLabelArray_Out[i].m_vStart_Floor.x,
								this.mLabelArray_Out[i].m_vStart_Floor.y,
								this.mLabelArray_Out[i].m_vEnd_Floor.x,
								this.mLabelArray_Out[i].m_vEnd_Floor.y,
								mHouseClass.mDoorClass.mDoorArray[k].m_vPos.x,
								mHouseClass.mDoorClass.mDoorArray[k].m_vPos.y, 25);
					if( ab[0] != 0 )
						doorArray.push(mHouseClass.mDoorClass.mDoorArray[k]);
				}
			}
			return doorArray;
		};
		
		this.GetLengthFromWall = function(iWall)
		{
			// 得到墙体长度
			var fLength = Math.sqrt((this.mLabelArray_Out[iWall].m_vEnd_Floor.x-this.mLabelArray_Out[iWall].m_vStart_Floor.x)*
									(this.mLabelArray_Out[iWall].m_vEnd_Floor.x-this.mLabelArray_Out[iWall].m_vStart_Floor.x)+
									(this.mLabelArray_Out[iWall].m_vEnd_Floor.y-this.mLabelArray_Out[iWall].m_vStart_Floor.y)*
									(this.mLabelArray_Out[iWall].m_vEnd_Floor.y-this.mLabelArray_Out[iWall].m_vStart_Floor.y));
			return fLength;
		};
		
		this.GetCountWall = function()
		{
			// 得到墙体数量
			return this.mLabelArray_Out.length;
		};
		
		// 获取角度
		this.GetAngleFromWall = function(iWall,vPos2)
		{
/*		    var vPos    = new THREE.Vector3();
		    vPos.x = ( this.mLabelArray_Out[iWall].m_vEnd_Floor.x + this.mLabelArray_Out[iWall].m_vStart_Floor.x )/2;
		    vPos.y = ( this.mLabelArray_Out[iWall].m_vEnd_Floor.y + this.mLabelArray_Out[iWall].m_vStart_Floor.y )/2;
		    vPos.z = ( this.mLabelArray_Out[iWall].m_vEnd_Floor.z + this.mLabelArray_Out[iWall].m_vStart_Floor.z )/2;	
	    				
			var vPosNew = new THREE.Vector3( vPos2.x - vPos.x, vPos2.y- vPos.y, 0);
			
			var P0 = new THREE.Vector3(0,0,0);
			var P1 = new THREE.Vector3(1,0,0);
			var fDegree = mMathClass.GetAngleFromP4(P0, P1, P0,vPosNew);
			
			if( (fDegree<=45 && fDegree>=-45) || (fDegree<=-145 && fDegree>=-180) )
				fDegree = fDegree+90;
			else
				fDegree = fDegree-90;
				
			return fDegree;*/
			
			var edge1   = new THREE.Vector3;
		    edge1.x =  this.mLabelArray_Out[iWall].m_vEnd_Floor.x - this.mLabelArray_Out[iWall].m_vStart_Floor.x;
		    edge1.y =  this.mLabelArray_Out[iWall].m_vEnd_Floor.y - this.mLabelArray_Out[iWall].m_vStart_Floor.y;
		    edge1.z =  this.mLabelArray_Out[iWall].m_vEnd_Floor.z - this.mLabelArray_Out[iWall].m_vStart_Floor.z;	
			
			if( Math.abs(edge1.x) < 0.001 )				
				edge1.x = 0.0;
			if( Math.abs(edge1.y) < 0.001 )
				edge1.y = 0.0;
			
			var fRotate = 0;
			if( edge1.x == 0.0 && edge1.y == 0.0)			// atanf(0/0)ֵ
				fRotate = 0.0;
			else
				fRotate = Math.atan(edge1.y/edge1.x);
			return fRotate*180/Math.PI;	
		};
		
		// fDisWall 离墙距离
		// fOffset  墙中心位置偏移距离
		this.GetPosFromWall = function(iWall,fDisWall,fOffset)
		{
		    var vPos    = new THREE.Vector3();
		    vPos.x = ( this.mLabelArray_Out[iWall].m_vEnd_Floor.x + this.mLabelArray_Out[iWall].m_vStart_Floor.x )/2;
		    vPos.y = ( this.mLabelArray_Out[iWall].m_vEnd_Floor.y + this.mLabelArray_Out[iWall].m_vStart_Floor.y )/2;
		    vPos.z = ( this.mLabelArray_Out[iWall].m_vEnd_Floor.z + this.mLabelArray_Out[iWall].m_vStart_Floor.z )/2;	
	    
		    var fRotate = 0;
		    var edge1   = new THREE.Vector3;
		    edge1.x = this.mLabelArray_Out[iWall].m_vEnd_Floor.x - this.mLabelArray_Out[iWall].m_vStart_Floor.x;
		    edge1.y = this.mLabelArray_Out[iWall].m_vEnd_Floor.y - this.mLabelArray_Out[iWall].m_vStart_Floor.y;
		
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
	    
		    var vPos1 = new THREE.Vector3( vPos.x + 2, vPos.y+fOffset, 0 );
		    var vPos2 = vPos1.applyMatrix4(tmpMatrix3);
		    var vNormal = new THREE.Vector3(0,0,-1);
		    var raycaster1 = new THREE.Raycaster(vPos2,vNormal);
	    	var Intersections = raycaster1.intersectObject( this.mFloorMesh );

		    if( Intersections.length<=0 )
		    {
		        fDisWall =-fDisWall;
			    vPos1 = new THREE.Vector3( vPos.x + fDisWall, vPos.y+fOffset, 0 );
			    vPos2 = vPos1.applyMatrix4(tmpMatrix3);
			}
		    else
		    {
			    vPos1 = new THREE.Vector3( vPos.x + fDisWall, vPos.y+fOffset, 0 );
			    vPos2 = vPos1.applyMatrix4(tmpMatrix3);		    	
		    }
		    
			return vPos2;
		};
		
		// 对面墙体
		this.GetOppositeWallFromWall = function(iWall,fDisWall,fOffset)
		{
			var tPos 	   = new THREE.Vector3()
		    var vCenter    = new THREE.Vector3();
		    vCenter.x = ( this.mLabelArray_Out[iWall].m_vEnd_Floor.x + this.mLabelArray_Out[iWall].m_vStart_Floor.x )/2;
		    vCenter.y = ( this.mLabelArray_Out[iWall].m_vEnd_Floor.y + this.mLabelArray_Out[iWall].m_vStart_Floor.y )/2;
		    vCenter.z = ( this.mLabelArray_Out[iWall].m_vEnd_Floor.z + this.mLabelArray_Out[iWall].m_vStart_Floor.z )/2;	

			var vPos  = this.GetPosFromWall(iWall,fDisWall,fOffset);
			
			for(var i =0; i< this.mLabelArray_Out.length; i++)
			{
				if( i == iWall || i+1== iWall || i-1 == iWall)
					continue;
				// 两直线交点	
				var tArray = mMathClass.Get2Line(vCenter,vPos,this.mLabelArray_Out[i].m_vStart_Floor,this.mLabelArray_Out[i].m_vEnd_Floor);
				if( tArray[0] == true)
				{
					tPos.x = tArray[1];
					tPos.y = tArray[2];
					tPos.z = 0;
					
					var fTemp1 = this.mLabelArray_Out[i].m_vStart_Floor.distanceTo(tPos);
					var fTemp2 = this.mLabelArray_Out[i].m_vEnd_Floor.distanceTo(tPos);
					var fL     = this.mLabelArray_Out[i].m_vEnd_Floor.distanceTo(this.mLabelArray_Out[i].m_vStart_Floor);
					if(fTemp1<fL && fTemp2<fL)// 交点在线段内
					 return i;
				}
			}
			
			return -1;
		};
		
}


