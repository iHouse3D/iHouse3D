
function WallClass3D_In()
{
	//墙面信息类
	this.mWallArray = new Array();
	this.m_fHeight   = 280;
	this.OnClear = function()
	{
		for( var k =0; k< this.mWallArray.length; k++ )
			this.mWallArray[k].OnClear();

		this.mWallArray.length = 0;	
	};
	
	this.OnShowAll = function(bShow)
	{
		for(var j = 0; j<this.mWallArray.length; j++)
			this.mWallArray[j].mWallMesh.visible = bShow;		
	};
	
	// 根据线框创建原始墙体
	this.OnCreate = function(solution_paths, iMaxAreaFloor)
	{
		// 清除mesh
		for( var j =0; j< this.mWallArray.length; j++ )
			this.mWallArray[j].OnClear();
		
		for(var i = 0; i < solution_paths.length; i++)
		{
			if( i == iMaxAreaFloor )
				continue;
			var tLine = [];
			for(var j = 0; j < solution_paths[i].length; j++)
				tLine.push(new THREE.Vector2(solution_paths[i][j].X ,solution_paths[i][j].Y ));

			tLine.push(new THREE.Vector2(solution_paths[i][0].X ,solution_paths[i][0].Y ));
				
			for(k = 0; k < tLine.length-1; k++)
			{
				var vStart = new THREE.Vector3(tLine[k+0].x, tLine[k+0].y, 0);
				var vEnd   = new THREE.Vector3(tLine[k+1].x, tLine[k+1].y, 0);
				var geom = new THREE.Geometry();
				geom.vertices.push(new THREE.Vector3(tLine[k+0].x, tLine[k+0].y, 0));
				geom.vertices.push(new THREE.Vector3(tLine[k+1].x, tLine[k+1].y, 0));
				geom.vertices.push(new THREE.Vector3(tLine[k+0].x, tLine[k+0].y, this.m_fHeight));
				
				geom.vertices.push(new THREE.Vector3(tLine[k+0].x, tLine[k+0].y, this.m_fHeight));
				geom.vertices.push(new THREE.Vector3(tLine[k+1].x, tLine[k+1].y, 0));
				geom.vertices.push(new THREE.Vector3(tLine[k+1].x, tLine[k+1].y, this.m_fHeight));

				geom.faces.push(new THREE.Face3(0,1,2));
				geom.faces.push(new THREE.Face3(3,4,5));

				geom.faceVertexUvs[0][0] = [ new THREE.Vector2(0, 0),new THREE.Vector2(1, 0),new THREE.Vector2(0, 1)];
				geom.faceVertexUvs[0][1] = [ new THREE.Vector2(0, 1),new THREE.Vector2(1, 0),new THREE.Vector2(1, 1)];

				geom.computeFaceNormals();
				geom.verticesNeedUpdate = true;
				geom.uvsNeedUpdate = true;

				var vPos1 = new THREE.Vector3(tLine[k+0].x, tLine[k+0].y, 0);
				var vPos2 = new THREE.Vector3(tLine[k+1].x, tLine[k+1].y, 0);
				var vPos3 = new THREE.Vector3(tLine[k+0].x, tLine[k+0].y, this.m_fHeight);
						
				// 循环是否有贴图
				var bCreate = true;
				for( var m =0; m< this.mWallArray.length; m++ )
				{
					if(this.mWallArray[m].mTextureData ==undefined || this.mWallArray[m].mTextureData == null)
						continue;
					
					if(this.mWallArray[m].mWallMesh !=null)
						continue;	
						
					// 材质已存在	
					var testPos = new THREE.Vector3(this.mWallArray[m].mTextureData.m_x1,
													this.mWallArray[m].mTextureData.m_y1,
													this.mWallArray[m].mTextureData.m_z1);
					var bUse = mMathClass.IntersectedPlane(vPos1,vPos2,vPos3,testPos,3);
					if( bUse == true )
					{
						this.mWallArray[m].mWallMesh = new THREE.Mesh( geom, this.mWallArray[m].mTextureData.mMaterial);
						this.mWallArray[m].mWallMesh.rotation.x = -Math.PI/2;
						this.mWallArray[m].mWallMesh.material.map = this.mWallArray[m].mTextureData.mTexture;
	    				this.mWallArray[m].mWallMesh.material.needsUpdate = true;						
						this.mWallArray[m].mTextureData.OnUpdateUV(this.mWallArray[m].mWallMesh);	
						scene3D.add(this.mWallArray[m].mWallMesh);
						bCreate = false;
						break;					
					}
				}

				// 新建墙面
				if(bCreate == true)
				{				
					var tWallData3D_In 				= new WallData3D_In();
						tWallData3D_In.mTextureData = new TextureData();												
						tWallData3D_In.mTextureData.mMaterial = new THREE.MeshStandardMaterial( {color: new THREE.Color( '#ffffff' )} );			
						tWallData3D_In.mTextureData.mTexture  = null;
						tWallData3D_In.mWallMesh = new THREE.Mesh( geom, tWallData3D_In.mTextureData.mMaterial);
						tWallData3D_In.mWallMesh.rotation.x = -Math.PI/2;
						tWallData3D_In.OnCreate(tWallData3D_In.mWallMesh);
						tWallData3D_In.m_vStart = vStart;
						tWallData3D_In.m_vEnd   = vEnd;
					scene3D.add(tWallData3D_In.mWallMesh);	
					this.mWallArray.push(tWallData3D_In);
					
					var edges = new THREE.EdgesGeometry( tWallData3D_In.mWallMesh.geometry );
					tWallData3D_In.m_Outline = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x000000 } ) );
					tWallData3D_In.m_Outline.rotation.x = -Math.PI/2;
					scene3D.add( tWallData3D_In.m_Outline );
					tWallData3D_In.m_Outline.visible = false;
				}
			}
		}
		
		// 删除没用的墙体节点
		for( var j =0; j< this.mWallArray.length; j++ )
		{
			if(this.mWallArray[j].mWallMesh == null)
			{
				this.mWallArray.splice(j, 1);
				j= -1;
			}
		}
	};
	
	this.OnWireframe = function(bShow)
	{
		for( var k =0; k< this.mWallArray.length; k++ )
			this.mWallArray[k].m_Outline.visible = bShow;		
	};
	
	this.OnMaterial = function(bShow)
	{
		for( var k =0; k< this.mWallArray.length; k++ )
			this.mWallArray[k].mWallMesh.visible = bShow;		
	};
	
	// 内墙门窗洞
	this.CreateHole = function(tWindowArray,tDoorArray)
	{
		for( var i = 0; i< this.mWallArray.length; i++ )
		{
			this.mWallArray[i].CreateHole(tWindowArray);
			this.mWallArray[i].CreateHole(tDoorArray);
		}		
	};
	
	this.ChangeEmptyRoom = function()
	{
		var selectTime = new Date().getTime();//获取时间戳
		for( var i = 0; i< this.mWallArray.length; i++ )
		{			
			var tMesh = this.mWallArray[i].mWallMesh;
			tMesh.geometry.computeBoundingBox();
			var diffuseTex = new THREE.TextureLoader().load( 'img/brick_diffuse1.jpg?'+selectTime);
			diffuseTex.wrapS = THREE.RepeatWrapping;
			diffuseTex.wrapT = THREE.RepeatWrapping;

			var tMat = new THREE.MeshPhysicalMaterial( {
				map: diffuseTex,
				bumpMap: mResource.bumpTex,
				bumpScale: 0.3,
			} );
			
			var fLength = Math.sqrt((tMesh.geometry.boundingBox.min.x-tMesh.geometry.boundingBox.max.x)*
									(tMesh.geometry.boundingBox.min.x-tMesh.geometry.boundingBox.max.x)+
									(tMesh.geometry.boundingBox.min.y-tMesh.geometry.boundingBox.max.y)*
									(tMesh.geometry.boundingBox.min.y-tMesh.geometry.boundingBox.max.y));
			
			var fw = fLength/2600;
			var fh = (tMesh.geometry.boundingBox.max.z-tMesh.geometry.boundingBox.min.z)/2600;
	
			diffuseTex.offset.set(  0, 0 );
			diffuseTex.repeat.set( fw*10,fh*10 );
			diffuseTex.center.set(  0, 0 );
			diffuseTex.rotation = 0;	

			this.mWallArray[i].mWallMesh.material = tMat;
	    	this.mWallArray[i].mWallMesh.material.needsUpdate = true;	
		}
	};
	
	this.OnPick3D = function(mouseX,mouseY)
	{
		var tWall = null;
		let tDis  = 99999;
		for( let j=0; j<this.mWallArray.length; j++)
		{
			var Intersections = raycaster.intersectObject(  this.mWallArray[j].mWallMesh );
			if( Intersections.length>=1)
			{
				if( tDis > Intersections[0].distance)
				{
					tDis  = Intersections[0].distance;
					tWall = this.mWallArray[j];
				}
			}			
		}
		
		if( tWall != null )
			return tWall;
		
		return null;			
	};
	
	this.OnSave_XML = function()
	{
		var iIndex = 0;
		for(let k=0; k<this.mWallArray.length; k++)
		{
			let that = this.mWallArray[k].mTextureData;
			if( that ==undefined)
				continue;
				
			iIndex++;
		}
	
		let strXML = `<SplitLine3D num="${iIndex}"/>`;
		
		for(let k=0; k<this.mWallArray.length; k++)
		{
			if( this.mWallArray[k].mTextureData ==undefined)
				continue;
				
			strXML += this.mWallArray[k].OnSave_XML();
		}
		return strXML;		
	};
	
}