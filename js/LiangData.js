function LiangData()
{
	  this.m_vPos;
		this.m_fLength;					// 长
		this.m_fRotate;   			// 旋转
		this.m_fWidth;					// 宽

		this.m_RenderData2D;		// 2D图标绘制
		this.m_RenderWin2D;			
		this.m_Object; 					// 3D
				
		this.m_HelpBox;
		this.mTextureData1 = null;
		this.mTextureData2 = null;
		this.mTextureData3 = null;
		this.mTextureData4 = null;
		this.OnInit = function()
		{			
			this.m_vPos 		 = new THREE.Vector3(0,0,0);
			this.m_fLength   = 200;
			this.m_fWidth    = 50;
			this.m_fRotate   = 0;

			var result_poly = new THREE.Geometry();					
			result_poly.vertices.push(new THREE.Vector3(-0.5, -0.5, 1), new THREE.Vector3(-0.5, 0.5, 1));				
			result_poly.vertices.push(new THREE.Vector3( 0.5,  0.5, 1), new THREE.Vector3( 0.5,-0.5, 1));	
			result_poly.vertices.push(new THREE.Vector3(-0.5, -0.5, 1));					
			this.m_HelpBox = new THREE.Line( result_poly, new THREE.LineBasicMaterial( { color: 0x00A2E8, linewidth:1, opacity: 1 } ) );
			scene.add(this.m_HelpBox);

			this.OnCreate2D();
			this.UpdateFlue();
		};
		
		this.OnClear = function()
		{
			scene.remove(this.m_HelpBox);
			scene.remove(this.m_RenderData2D);
			scene.remove(this.m_RenderWin2D);		
		};
		
		this.OnShow = function(bShow)
		{
			this.m_HelpBox.visible 			= bShow;
			this.m_RenderData2D.visible = bShow;
			this.m_RenderWin2D.visible 	= bShow;
		};
				
		this.OnCreate2D = function()
		{
				var groundGeometry  = new THREE.PlaneGeometry(1, 1, 1, 1);		
				var groundMaterial  = new THREE.MeshBasicMaterial({color: 0xffffff, opacity: 1, transparent: true});		
				this.m_RenderData2D = new THREE.Mesh(groundGeometry, groundMaterial);								
				scene.add(this.m_RenderData2D);

				this.BuildIcon(0);
		};

		this.OnMouseMove = function(x1,y1)
		{
			this.m_vPos.x = x1;
			this.m_vPos.y = y1;	
			this.UpdateFlue();					
		};
		
		this.OnHideCtrl = function()
		{
			this.m_HelpBox.position.x  = -99999;			
			this.m_HelpBox.position.y  = -99999;
		};
		
		this.OnShowHelp = function()
		{
			this.m_HelpBox.geometry.vertices.length = 0;		
			this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(-this.m_fLength/2, -this.m_fWidth/2, 1.3), new THREE.Vector3(-this.m_fLength/2, this.m_fWidth/2, 1.3));				
			this.m_HelpBox.geometry.vertices.push(new THREE.Vector3( this.m_fLength/2,  this.m_fWidth/2, 1.3), new THREE.Vector3( this.m_fLength/2,-this.m_fWidth/2, 1.3));	
			this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(-this.m_fLength/2, -this.m_fWidth/2, 1.3));	
			this.m_HelpBox.geometry.verticesNeedUpdate = true;
			
			var tmpMatrix2= new THREE.Matrix4().makeRotationZ(this.m_fRotate);
			var tmpMatrix3= new THREE.Matrix4().makeTranslation(this.m_vPos.x,this.m_vPos.y,1.3);
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
		};
		
		this.UpdateFlue = function()
		{
				this.m_RenderWin2D.rotation.z = 0;
				this.m_RenderWin2D.position.x = 0;			
				this.m_RenderWin2D.position.y = 0;
				this.m_RenderWin2D.position.z = 0;
				this.m_RenderWin2D.scale.x    = 1;
				this.m_RenderWin2D.scale.y    = 1;
				this.m_RenderWin2D.scale.z    = 1;	
				this.m_RenderWin2D.matrixWorld.identity();
				this.m_RenderWin2D.matrix.identity();
				this.m_RenderWin2D.updateMatrixWorld(true);
				
				this.m_RenderData2D.rotation.z = 0;
				this.m_RenderData2D.position.x = 0;			
				this.m_RenderData2D.position.y = 0;
				this.m_RenderData2D.position.z = 0;
				this.m_RenderData2D.scale.x    = 1;
				this.m_RenderData2D.scale.y    = 1;
				this.m_RenderData2D.scale.z    = 1;
				this.m_RenderData2D.matrixWorld.identity();
				this.m_RenderData2D.matrix.identity();
				this.m_RenderData2D.updateMatrixWorld(true);
										
				var tmpMatrix2= new THREE.Matrix4().makeRotationZ(this.m_fRotate);
				var tmpMatrix3= new THREE.Matrix4().makeTranslation(this.m_vPos.x,this.m_vPos.y,1);
				tmpMatrix3.multiply(tmpMatrix2);
				this.BuildIcon();
				this.m_RenderWin2D.applyMatrix(tmpMatrix3);	
				
				var tmpMatrix4= new THREE.Matrix4().makeScale(this.m_fLength,this.m_fWidth,1);// 100   符号初始大小
				var tmpMatrix5= new THREE.Matrix4().makeRotationZ(this.m_fRotate);
				var tmpMatrix6= new THREE.Matrix4().makeTranslation(this.m_vPos.x,this.m_vPos.y,1);
						tmpMatrix5.multiply(tmpMatrix4);
						tmpMatrix6.multiply(tmpMatrix5);				
				this.m_RenderData2D.applyMatrix(tmpMatrix6);							
		};

		this.BuildIcon = function()
		{
			scene.remove(this.m_RenderWin2D);
			var tLength = this.m_fLength;
			var tWidth  = this.m_fWidth;
			var result_poly = new THREE.Geometry();
			result_poly.vertices.push(new THREE.Vector3(-tLength/2,-tWidth/2, 1.3), new THREE.Vector3( tLength/2,-tWidth/2, 1.3));										
			result_poly.vertices.push(new THREE.Vector3( tLength/2,-tWidth/2, 1.3), new THREE.Vector3( tLength/2, tWidth/2, 1.3));
			result_poly.vertices.push(new THREE.Vector3( tLength/2, tWidth/2, 1.3), new THREE.Vector3(-tLength/2, tWidth/2, 1.3));
			result_poly.vertices.push(new THREE.Vector3(-tLength/2, tWidth/2, 1.3), new THREE.Vector3(-tLength/2,-tWidth/2, 1.3));
		
			this.m_RenderWin2D = new THREE.LineSegments( result_poly, new THREE.LineBasicMaterial( { color: mResource.mColor, linewidth:1, opacity: 1 } ) );
			scene.add(this.m_RenderWin2D);
		};
		
		// 再生成柱体面时，mWallClass3D_In 原来已经清干净
		this.OnUpdate3D = function()
		{
				var pos1 = new THREE.Vector3(-this.m_fLength/2,-this.m_fWidth/2, 1.3);
				var pos2 = new THREE.Vector3( this.m_fLength/2,-this.m_fWidth/2, 1.3);
				var pos3 = new THREE.Vector3( this.m_fLength/2, this.m_fWidth/2, 1.3);
				var pos4 = new THREE.Vector3(-this.m_fLength/2, this.m_fWidth/2, 1.3);
				var tmpMatrix = new THREE.Matrix4().makeTranslation(this.m_vPos.x,this.m_vPos.y,1);
						pos1 = pos1.applyMatrix4(tmpMatrix);
						pos2 = pos2.applyMatrix4(tmpMatrix);
						pos3 = pos3.applyMatrix4(tmpMatrix);
						pos4 = pos4.applyMatrix4(tmpMatrix);
				
				this.OnCreatePlane(pos1,pos2,1);
				this.OnCreatePlane(pos2,pos3,2);
				this.OnCreatePlane(pos3,pos4,3);
				this.OnCreatePlane(pos4,pos1,4);
				
				this.OnCreatePlane(pos2,pos1,5);
				this.OnCreatePlane(pos3,pos2,5);
				this.OnCreatePlane(pos4,pos3,5);
				this.OnCreatePlane(pos1,pos4,5);
				
				this.OnCreatePlaneTop(pos1,pos2,pos3,pos4);
		};
		
		this.OnCreatePlaneTop  = function(pos1,pos2,pos3,pos4)
		{
			// 创建顶面
				var geom = new THREE.Geometry();
				geom.vertices.push(new THREE.Vector3(pos1.x, pos1.y, mHouseClass.m_fHeight));
				geom.vertices.push(new THREE.Vector3(pos4.x, pos4.y, mHouseClass.m_fHeight));
				geom.vertices.push(new THREE.Vector3(pos3.x, pos3.y, mHouseClass.m_fHeight));
				
				geom.vertices.push(new THREE.Vector3(pos3.x, pos3.y, mHouseClass.m_fHeight));
				geom.vertices.push(new THREE.Vector3(pos2.x, pos2.y, mHouseClass.m_fHeight));
				geom.vertices.push(new THREE.Vector3(pos1.x, pos1.y, mHouseClass.m_fHeight));
				
				geom.vertices.push(new THREE.Vector3(pos1.x, pos1.y, mHouseClass.m_fHeight-50));
				geom.vertices.push(new THREE.Vector3(pos4.x, pos4.y, mHouseClass.m_fHeight-50));
				geom.vertices.push(new THREE.Vector3(pos3.x, pos3.y, mHouseClass.m_fHeight-50));
				
				geom.vertices.push(new THREE.Vector3(pos3.x, pos3.y, mHouseClass.m_fHeight-50));
				geom.vertices.push(new THREE.Vector3(pos2.x, pos2.y, mHouseClass.m_fHeight-50));
				geom.vertices.push(new THREE.Vector3(pos1.x, pos1.y, mHouseClass.m_fHeight-50));				
				
				geom.faces.push(new THREE.Face3(0,2,1));
				geom.faces.push(new THREE.Face3(3,5,4));
				
				geom.faces.push(new THREE.Face3(6,7,8));
				geom.faces.push(new THREE.Face3(9,10,11));
				
				geom.faceVertexUvs[0][0] = [ new THREE.Vector2(0, 1),new THREE.Vector2(0, 0),new THREE.Vector2(1, 0)];
				geom.faceVertexUvs[0][1] = [ new THREE.Vector2(1, 0),new THREE.Vector2(1, 1),new THREE.Vector2(0, 1)];
				
				geom.faceVertexUvs[0][2] = [ new THREE.Vector2(0, 1),new THREE.Vector2(1, 0),new THREE.Vector2(0, 0)];
				geom.faceVertexUvs[0][3] = [ new THREE.Vector2(1, 0),new THREE.Vector2(0, 1),new THREE.Vector2(1, 1)];
				
				geom.computeFaceNormals();
				geom.verticesNeedUpdate = true;
				geom.uvsNeedUpdate = true;

				var tWallData3D_In 						  = new WallData3D_In();
						tWallData3D_In.mTextureData = this.mTextureData1;
						tWallData3D_In.mWallMesh 	  = new THREE.Mesh( geom, tWallData3D_In.mTextureData.mMaterial);
						tWallData3D_In.mWallMesh.rotation.x = -Math.PI/2;
						tWallData3D_In.OnCreate(tWallData3D_In.mWallMesh);					

				scene3D.add(tWallData3D_In.mWallMesh);	
				mHouseClass.mWallClass3D_In.mWallArray.push(tWallData3D_In);
				return tWallData3D_In;
		};
		
		// 创建立面
		this.OnCreatePlane = function(pos1,pos2,iTextureData)
		{
				var geom = new THREE.Geometry();
				geom.vertices.push(new THREE.Vector3(pos1.x, pos1.y, mHouseClass.m_fHeight-50));
				geom.vertices.push(new THREE.Vector3(pos2.x, pos2.y, mHouseClass.m_fHeight-50));
				geom.vertices.push(new THREE.Vector3(pos1.x, pos1.y, mHouseClass.m_fHeight));
				
				geom.vertices.push(new THREE.Vector3(pos1.x, pos1.y, mHouseClass.m_fHeight));
				geom.vertices.push(new THREE.Vector3(pos2.x, pos2.y, mHouseClass.m_fHeight-50));
				geom.vertices.push(new THREE.Vector3(pos2.x, pos2.y, mHouseClass.m_fHeight));

				geom.faces.push(new THREE.Face3(0,1,2));
				geom.faces.push(new THREE.Face3(3,4,5));

				geom.faceVertexUvs[0][0] = [ new THREE.Vector2(0, 0),new THREE.Vector2(1, 0),new THREE.Vector2(0, 1)];
				geom.faceVertexUvs[0][1] = [ new THREE.Vector2(0, 1),new THREE.Vector2(1, 0),new THREE.Vector2(1, 1)];

				geom.computeFaceNormals();
				geom.verticesNeedUpdate = true;
				geom.uvsNeedUpdate = true;

				var tWallData3D_In 				= new WallData3D_In();
				
				if( iTextureData == 1 && this.mTextureData1)
				{
					tWallData3D_In.mTextureData = this.mTextureData1;
					tWallData3D_In.mWallMesh = new THREE.Mesh( geom, tWallData3D_In.mTextureData.mMaterial);
					tWallData3D_In.mWallMesh.rotation.x = -Math.PI/2;
					tWallData3D_In.OnCreate(tWallData3D_In.mWallMesh);					
				}
				else if( iTextureData == 2 && this.mTextureData2)
				{
					tWallData3D_In.mTextureData = this.mTextureData2;
					tWallData3D_In.mWallMesh = new THREE.Mesh( geom, tWallData3D_In.mTextureData.mMaterial);
					tWallData3D_In.mWallMesh.rotation.x = -Math.PI/2;
					tWallData3D_In.OnCreate(tWallData3D_In.mWallMesh);					
				}
				else if( iTextureData == 3 && this.mTextureData3)
				{
					tWallData3D_In.mTextureData = this.mTextureData3;
					tWallData3D_In.mWallMesh = new THREE.Mesh( geom, tWallData3D_In.mTextureData.mMaterial);
					tWallData3D_In.mWallMesh.rotation.x = -Math.PI/2;
					tWallData3D_In.OnCreate(tWallData3D_In.mWallMesh);					
				}
				else if( iTextureData == 4 && this.mTextureData4)
				{
					tWallData3D_In.mTextureData = this.mTextureData4;
					tWallData3D_In.mWallMesh = new THREE.Mesh( geom, tWallData3D_In.mTextureData.mMaterial);
					tWallData3D_In.mWallMesh.rotation.x = -Math.PI/2;
					tWallData3D_In.OnCreate(tWallData3D_In.mWallMesh);					
				}				
				else
				{
					tWallData3D_In.mTextureData = new TextureData();												
					tWallData3D_In.mTextureData.mMaterial = new THREE.MeshStandardMaterial( {color: new THREE.Color( '#ffffff' )} );			
					tWallData3D_In.mTextureData.mTexture  = null;
					tWallData3D_In.mWallMesh = new THREE.Mesh( geom, tWallData3D_In.mTextureData.mMaterial);
					tWallData3D_In.mWallMesh.rotation.x = -Math.PI/2;
					tWallData3D_In.OnCreate(tWallData3D_In.mWallMesh);
					
					if(iTextureData == 1)
						 this.mTextureData1 = tWallData3D_In.mTextureData;
					if(iTextureData == 2)
						 this.mTextureData2 = tWallData3D_In.mTextureData;
					if(iTextureData == 3)
						 this.mTextureData3 = tWallData3D_In.mTextureData;
					if(iTextureData == 4)
						 this.mTextureData4 = tWallData3D_In.mTextureData;						 
				}				
				scene3D.add(tWallData3D_In.mWallMesh);	
				mHouseClass.mWallClass3D_In.mWallArray.push(tWallData3D_In);
				return tWallData3D_In;
		};
}