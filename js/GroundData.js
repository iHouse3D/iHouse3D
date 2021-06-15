function GroundData()
{
		this.m_vStart;				// 起点			
		this.m_vEnd;				// 终点		
		this.m_vCenter;				// 中心点		
		this.m_fLength	   = 1;	   	// 长度
		this.m_fWidth	   = 1;
		this.m_fRotate;				// 旋转弧度
		this.mLine;
		this.mWallData3D_In= null;				// 3D平面    （正常保存)
		this.m_pFurniture  = null;				// 收边模型 （正常保存)
		this.m_fDist       = 0;
		
		this.mLabel;	// 标注尺寸线
		this.mText;		// 尺寸文字
		this.OnInit = function( x1,y1,z1,fWidth )
		{
			this.m_vStart  		 = new THREE.Vector3( x1, y1, z1 );
			this.m_vEnd		 	 = new THREE.Vector3( x1, y1, z1 );
			this.m_vCenter 		 = new THREE.Vector3( x1, y1, z1 );
			
			var geom = new THREE.Geometry();
				geom.vertices.push(new THREE.Vector3(-0.5, 0, 0));
				geom.vertices.push(new THREE.Vector3( 0.5, 0, 0));
			this.mLine = new THREE.LineSegments( geom, new THREE.LineBasicMaterial( { color: '#363636', linewidth:1,} ) );
			scene.add(this.mLine);
			
			var geometry = new THREE.Geometry();
			geometry.vertices.push( 
				new THREE.Vector3(-100/2,    0, 0),   new THREE.Vector3( 100/2,    0, 0), 
				new THREE.Vector3(-100/2,  -20, 0),   new THREE.Vector3(-100/2,   20, 0),
				new THREE.Vector3( 100/2,  -20, 0),   new THREE.Vector3( 100/2,   20, 0)
			);  	
			this.mLabel = new THREE.LineSegments(geometry, new THREE.LineBasicMaterial( { color: '#58A3F3', linewidth:1, opacity: 1 } ) );				
		//	this.mLabel.computeLineDistances();
			this.mLabel.visible = false;
			scene.add( this.mLabel );			
		};
		
		/***
		 * 更新墙体
		 * 
		 */
		this.OnUpdate= function()
		{
			this.m_fLength = Math.sqrt((  this.m_vEnd.x-this.m_vStart.x)*(this.m_vEnd.x-this.m_vStart.x)
										+(this.m_vEnd.y-this.m_vStart.y)*(this.m_vEnd.y-this.m_vStart.y) 
										+(this.m_vEnd.z-this.m_vStart.z)*(this.m_vEnd.z-this.m_vStart.z));	
			
			var edge1   = new THREE.Vector3;
				edge1.x = this.m_vEnd.x - this.m_vStart.x;
				edge1.y = this.m_vEnd.y - this.m_vStart.y;
				edge1.z = this.m_vEnd.z - this.m_vStart.z;
			
			if( Math.abs(edge1.x) < 0.001 )				
				edge1.x = 0.0;
			if( Math.abs(edge1.y) < 0.001 )
				edge1.y = 0.0;
			
			if( edge1.x == 0.0 && edge1.y == 0.0)			// atanf(0/0)ֵ
				this.m_fRotate = 0.0;
			else
				this.m_fRotate = Math.atan(edge1.y/edge1.x);	
			
			this.m_vCenter.x = ( this.m_vEnd.x+ this.m_vStart.x )/2;
			this.m_vCenter.y = ( this.m_vEnd.y+ this.m_vStart.y )/2;
			this.m_vCenter.z = ( this.m_vEnd.z+ this.m_vStart.z )/2;
		};
		// 生成立面
		this.OnUpdate3D = function(fHeight)
		{
			if(this.mWallData3D_In)
			{
			   scene3D.remove(this.mWallData3D_In.mWallMesh);
			   index = mHouseClass.mWallClass3D_In.mWallArray.indexOf(this.mWallData3D_In);
				if (index > -1) {
	    			mHouseClass.mWallClass3D_In.mWallArray.splice(index, 1);
				}	
			}
			
			var geom = new THREE.Geometry();
			geom.vertices.push(new THREE.Vector3(this.m_vStart.x, this.m_vStart.y, this.m_fDist));
			geom.vertices.push(new THREE.Vector3(this.m_vEnd.x,   this.m_vEnd.y,   this.m_fDist));
			geom.vertices.push(new THREE.Vector3(this.m_vStart.x, this.m_vStart.y, this.m_fDist+fHeight));
			
			geom.vertices.push(new THREE.Vector3(this.m_vStart.x, this.m_vStart.y, this.m_fDist+fHeight));
			geom.vertices.push(new THREE.Vector3(this.m_vEnd.x,   this.m_vEnd.y,   this.m_fDist));
			geom.vertices.push(new THREE.Vector3(this.m_vEnd.x,   this.m_vEnd.y,   this.m_fDist+fHeight));
			
			geom.vertices.push(new THREE.Vector3(this.m_vStart.x, this.m_vStart.y, this.m_fDist));
			geom.vertices.push(new THREE.Vector3(this.m_vStart.x, this.m_vStart.y, this.m_fDist+fHeight));
			geom.vertices.push(new THREE.Vector3(this.m_vEnd.x,   this.m_vEnd.y,   this.m_fDist));
			
			geom.vertices.push(new THREE.Vector3(this.m_vStart.x, this.m_vStart.y, this.m_fDist+fHeight));
			geom.vertices.push(new THREE.Vector3(this.m_vEnd.x,   this.m_vEnd.y,   this.m_fDist+fHeight));
			geom.vertices.push(new THREE.Vector3(this.m_vEnd.x,   this.m_vEnd.y,   this.m_fDist));
						
			geom.faces.push(new THREE.Face3(0,1,2));
			geom.faces.push(new THREE.Face3(3,4,5));
			geom.faces.push(new THREE.Face3(6,7,8));
			geom.faces.push(new THREE.Face3(9,10,11));			

			geom.faceVertexUvs[0][0] = [ new THREE.Vector2(0, 0),new THREE.Vector2(1, 0),new THREE.Vector2(0, 1)];
			geom.faceVertexUvs[0][1] = [ new THREE.Vector2(0, 1),new THREE.Vector2(1, 0),new THREE.Vector2(1, 1)];
			
			geom.faceVertexUvs[0][2] = [ new THREE.Vector2(0, 0),new THREE.Vector2(0, 1),new THREE.Vector2(1, 0)];
			geom.faceVertexUvs[0][3] = [ new THREE.Vector2(0, 1),new THREE.Vector2(1, 1),new THREE.Vector2(1, 0)];
			
			geom.computeFaceNormals();
			geom.verticesNeedUpdate = true;
			geom.uvsNeedUpdate = true;

			var str ="吊顶001,cB40CF83708ED585F0113558458A14863/c294F1B5B3B3AAFFB95134FCCB64D6EFB/SUSEBZ02/SUSEBZ02.jpg,600A600,地毯,化纤,3,,,,2,,";
			var ab =str.split(',');

			this.mWallData3D_In 	= new WallData3D_In();
			this.mWallData3D_In.mWallMesh = new THREE.Mesh( geom,new THREE.MeshStandardMaterial( {color: new THREE.Color( '#ffffff' )}));
			this.mWallData3D_In.mWallMesh.rotation.x = -Math.PI/2;
			this.mWallData3D_In.OnUpdateTex(ab);
			
			scene3D.add(this.mWallData3D_In.mWallMesh);	
			mHouseClass.mWallClass3D_In.mWallArray.push(this.mWallData3D_In);
		};
				
		// 舞台整体高度
		this.OnUpdateHeight = function(fDist,fHeight)
		{
			if( this.mWallData3D_In == null)
			{
				this.OnUpdate3D(fHeight);
				return;
			}
			
			if(this.mWallData3D_In.mWallMesh == null)
			{
				this.OnUpdate3D(fHeight);
				return;				
			}
			this.mWallData3D_In.mWallMesh.geometry.vertices[0].z = fDist;
			this.mWallData3D_In.mWallMesh.geometry.vertices[1].z = fDist;
			this.mWallData3D_In.mWallMesh.geometry.vertices[2].z = fDist+fHeight;
			this.mWallData3D_In.mWallMesh.geometry.vertices[3].z = fDist+fHeight;
			this.mWallData3D_In.mWallMesh.geometry.vertices[4].z = fDist;
			this.mWallData3D_In.mWallMesh.geometry.vertices[5].z = fDist+fHeight;
			this.mWallData3D_In.mWallMesh.geometry.vertices[6].z = fDist;
			this.mWallData3D_In.mWallMesh.geometry.vertices[7].z = fDist+fHeight;
			this.mWallData3D_In.mWallMesh.geometry.vertices[8].z = fDist;
			this.mWallData3D_In.mWallMesh.geometry.vertices[9].z = fDist+fHeight;
			this.mWallData3D_In.mWallMesh.geometry.vertices[10].z= fDist+fHeight;
			this.mWallData3D_In.mWallMesh.geometry.vertices[11].z= fDist;
			this.mWallData3D_In.mWallMesh.geometry.computeBoundingBox();
			this.mWallData3D_In.mWallMesh.geometry.computeFaceNormals();
			this.mWallData3D_In.mWallMesh.geometry.verticesNeedUpdate = true;
			this.mWallData3D_In.mWallMesh.geometry.uvsNeedUpdate = true;
			
			this.mWallData3D_In.mWallMesh.material.map = this.mWallData3D_In.mTextureData.mTexture;
			this.mWallData3D_In.mWallMesh.material.needsUpdate = true;
		};
		
		this.OnClear= function()
		{
			scene.remove(this.mLine);
			if(this.mWallData3D_In)
			{
			   scene3D.remove(this.mWallData3D_In.mWallMesh);
				index = mHouseClass.mWallClass3D_In.mWallArray.indexOf(this.mWallData3D_In);
				if (index > -1) {
	    			mHouseClass.mWallClass3D_In.mWallArray.splice(index, 1);
				}	
			}		
			this.OnDelEdge();
			
			scene.remove(this.mLabel);		// 尺寸线
			scene.remove(this.mText);		// 文字				
		};
		
		this.OnShow = function( bShow )
		{
			//this.mWall.visible  	= bShow;
			this.mText.visible  	= bShow;
			this.mLabel.visible 	= bShow;
		};
		
		this.OnRender = function()
		{
			this.OnUpdate();
			this.mLine.geometry.vertices[0].x =  this.m_vStart.x;
			this.mLine.geometry.vertices[0].y =  this.m_vStart.y;
			this.mLine.geometry.vertices[0].z =  this.m_vStart.z;
			
			this.mLine.geometry.vertices[1].x =  this.m_vEnd.x;
			this.mLine.geometry.vertices[1].y =  this.m_vEnd.y;
			this.mLine.geometry.vertices[1].z =  this.m_vEnd.z;

			this.mLine.geometry.verticesNeedUpdate = true;
			
			this.UpdateLabel(0);
		};
		
		// 0. 沿墙显示尺寸  1. 周边显示尺寸
		this.UpdateLabel = function( iMode )
		{	
			this.mLabel.geometry.vertices.length = 0;
			this.mLabel.geometry.vertices.push( 
				new THREE.Vector3(-this.m_fLength/2,    0, 0),   new THREE.Vector3( this.m_fLength/2,    0, 0), 
				new THREE.Vector3(-this.m_fLength/2,  -10, 0),   new THREE.Vector3(-this.m_fLength/2,   10, 0),
				new THREE.Vector3( this.m_fLength/2,  -10, 0),   new THREE.Vector3( this.m_fLength/2,   10, 0)
			);  
			this.mLabel.geometry.verticesNeedUpdate = true;
				
			if(iMode == 0 )
			{				
				var tmpMatrix1 = new THREE.Matrix4().makeTranslation(1,50,1);
				var tmpMatrix2 = new THREE.Matrix4().makeRotationZ(this.m_fRotate);
				var tmpMatrix3 = new THREE.Matrix4().makeTranslation(this.m_vCenter.x,this.m_vCenter.y,this.m_vCenter.z);	
				tmpMatrix2.multiply(tmpMatrix1);
				tmpMatrix3.multiply(tmpMatrix2);
						
				this.mLabel.rotation.z = 0;
				this.mLabel.position.x = 0;			
				this.mLabel.position.y = 0;
				this.mLabel.position.z = 0;
				this.mLabel.matrixWorld.identity();
				this.mLabel.matrix.identity();
				this.mLabel.updateMatrixWorld(true);
				this.mLabel.applyMatrix(tmpMatrix3);	
				this.mLabel.visible = true;				
			}
			this.UpdateText();
		};
		
		// 更新文字信息
		this.UpdateText = function()
		{
			scene.remove(this.mText);
			var shapes = mHouseClass.mFont.generateShapes( (parseInt(this.m_fLength)*10).toString(), 100 );
			var geometryText = new THREE.ShapeBufferGeometry( shapes );
			geometryText.computeBoundingBox();
			geometryText.translate( - 0.5 * ( geometryText.boundingBox.max.x - geometryText.boundingBox.min.x ), 0, 0 );

			this.mText = new THREE.Mesh( geometryText, mResource.mFontBuleTex );
			scene.add( this.mText );	
			
			var tmpMatrix1 = new THREE.Matrix4().makeTranslation(1,380,1);
			var tmpMatrix2 = new THREE.Matrix4().makeScale(0.15,0.15,1);
			var tmpMatrix3 = new THREE.Matrix4().makeRotationZ(this.m_fRotate);
			var tmpMatrix4 = new THREE.Matrix4().makeTranslation(this.m_vCenter.x,this.m_vCenter.y,this.m_vCenter.z);	
			tmpMatrix2.multiply(tmpMatrix1);
			tmpMatrix3.multiply(tmpMatrix2);
			tmpMatrix4.multiply(tmpMatrix3);
			this.mText.rotation.z = 0;
			this.mText.position.x = 0;			
			this.mText.position.y = 0;
			this.mText.position.z = 0;
			this.mText.scale.x = 1;
			this.mText.scale.y = 1;
			this.mText.scale.z = 1;
			this.mText.matrixWorld.identity();
			this.mText.matrix.identity();
			this.mText.updateMatrixWorld(true);
			this.mText.applyMatrix(tmpMatrix4);	
		};
		
		this.OnDelEdge = function()
		{
			if(this.m_pFurniture == null)
			return;
			
			mHouseClass.mFurnitureClass.Delete(this.m_pFurniture);
			this.m_pFurniture = null;
		};
		
		//保存
		this.OnSave_XML = function()
		{
			
			var iWallData3D_In = -1;
			var iFurniture = -1;
			
			var strXML = `<GroundData x="${this.m_vStart.x}"  y="${this.m_vStart.y}"  z="${this.m_vStart.z}" 
									   x1="${this.m_vEnd.x}" y1="${this.m_vEnd.y}" z1="${this.m_vEnd.z}"
						   	fDist="${this.m_fDist}">`;
			
			
			if( this.mWallData3D_In )
			{
				let that = this.mWallData3D_In.mTextureData;
				let strFile = 'texture/'+that.m_strFile;
				strXML += `<GroundWall PosX="${that.m_x1}" PosY="${that.m_y1}" PosZ="${that.m_z1}"
	                        TexWidth="${that.m_fLength/10}" TexHeight="${that.m_fWidth/10}" 
	                        OffX="${that.m_fOffX}" OffY="${that.m_fOffY}" Alpha="${that.m_fAlpha}" 
	                        Rotate="${that.m_fRotate}" source="${strFile}" Mode="${that.m_fMode}"
	                        ScaleX="${that.mTexture.repeat.x}" ScaleY="${that.mTexture.repeat.y}"/>`;				
			}
			
			if( this.m_pFurniture )
				strXML +=`<GroundObj UUID="${this.m_pFurniture.m_uuid}"/>`;
			
			strXML += `</GroundData>`;
			return strXML;			
		};
		
		// 添加模型
		this.OnLoad_XML = function(data, fDist, fHeight)
		{
			if($(data)[0].localName.toLowerCase() =="grounddata" )
			{
				var x1 = $($(data)[0]).attr('x');
				var y1 = $($(data)[0]).attr('y');
				var x2 = $($(data)[0]).attr('x1');
				var y2 = $($(data)[0]).attr('y1');			
				
				this.OnInit(x1,y1,0);
				this.m_vEnd.x = x2;  
				this.m_vEnd.y = y2;
				this.OnRender();	
				this.OnShow(false);
				
				this.OnUpdate3D(fHeight);			// 生成3D 
				this.OnUpdateHeight(fDist,fHeight);	// 设置高度
				
				for(let i =0; i<$(data)[0].childNodes.length; i++)
				{
					// 读取贴图
					if($(data)[0].childNodes[i].localName.toLowerCase() =="groundwall" )
					{
						var texData = new TextureData();
						texData.m_x1 		= parseFloat($($(data)[0].childNodes[i]).attr('PosX'));
						texData.m_y1 		= parseFloat($($(data)[0].childNodes[i]).attr('PosY'));
						texData.m_z1 		= parseFloat($($(data)[0].childNodes[i]).attr('PosZ'));
						texData.m_fRotate 	= parseFloat($($(data)[0].childNodes[i]).attr('Rotate'));
						texData.m_fMode 	= parseInt($($(data)[0].childNodes[i]).attr('Mode'));
						texData.m_fOffX 	= parseFloat($($(data)[0].childNodes[i]).attr('OffX'));
						texData.m_fOffY 	= parseFloat($($(data)[0].childNodes[i]).attr('OffY'));
						texData.m_fLength 	= parseFloat($($(data)[0].childNodes[i]).attr('TexWidth'));
						texData.m_fWidth	= parseFloat($($(data)[0].childNodes[i]).attr('TexHeight'));
						texData.m_strFile	= $($(data)[0].childNodes[i]).attr('source');
						texData.m_fAlpha	= parseFloat($($(data)[0].childNodes[i]).attr('Alpha'));
						
						texData.mMaterial   = new THREE.MeshStandardMaterial( {color: new THREE.Color( '#ffffff' )} );					
						texData.mTexture 	= new THREE.TextureLoader( ).load( m_strHttp+texData.m_strFile );
						texData.mTexture.wrapS = texData.mTexture.wrapT = THREE.RepeatWrapping;
						
						var fw = parseFloat($($(data)[0].childNodes[i]).attr('ScaleX'));
						var fh = parseFloat($($(data)[0].childNodes[i]).attr('ScaleY'));
						
						texData.mTexture.offset.set(  0, 0 );
						texData.mTexture.repeat.set( fw,fh );
						texData.mTexture.center.set(  0, 0 );
						texData.mTexture.rotation = texData.m_fRotate;		
											
						this.mWallData3D_In.mTextureData = texData;
						this.mWallData3D_In.mWallMesh.material.map = texData.mTexture;
				    	this.mWallData3D_In.mWallMesh.material.needsUpdate = true;
					}
					
					if($(data)[0].childNodes[i].localName.toLowerCase() =="groundobj" )
					{
						let strUUID = $($(data)[0].childNodes[i]).attr('UUID');
			
						for(var j=0; j< mHouseClass.mFurnitureClass.mFurnitureArray.length; j++)
						{
							if( strUUID == mHouseClass.mFurnitureClass.mFurnitureArray[j].m_uuid)
							{
								this.m_pFurniture = mHouseClass.mFurnitureClass.mFurnitureArray[j];
								break;
							}
						}	
					}
				}
			}
		};
		
}