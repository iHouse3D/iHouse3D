/**
 * @api HouseClass
 * @apiGroup HouseClass
 * @apiDescription 房屋类
 * @apiParam (成员变量) mRenderFloor 	3D地面mesh数组
 * @apiParam (成员变量) mRenderWall_In 	3D内墙mesh数组 
 * @apiParam (成员变量) mRenderCeilingTop 3D墙体顶面mesh数组
 * @apiParam (成员变量) mRenderCeiling 	 3D房间顶面mesh数组
 *                             
 */
function HouseClass()
{
	this.mRenderFloor 		= new Array(); 
	this.mRenderWall_In 	= new Array();
	this.mRenderCeilingTop  = new Array();
	this.mRenderCeiling     = new Array();
	this.mRenderWall_Out	= new Array();
	this.mDoorArray			= new Array();
	this.mWindowArray		= new Array();
	this.mFurnitureArray	= new Array();
	this.mPlaneLightArray   = new Array();
	this.m_BOX              = new THREE.Box3();
	
	// 读取渲染数据
	this.OnLoadXML = function(strXML)
	{
		var  xmlDoc = $.parseXML( strXML );
		var  $xml = $( xmlDoc );
		
	    $xml.find("Wall").each(function(j){mHouseClass.OnLoadWallIn($(this));});	
	 
	    $xml.find("WallOut").each(function(j){mHouseClass.OnLoadWallOut($(this));});	
	    
	   	$xml.find("Floor").each(function(j){mHouseClass.OnLoadFloor($(this));});
	 
	 	$xml.find("CeilingTop").each(function(j){mHouseClass.OnLoadCeilingTop($(this));});

		$xml.find("Ceiling").each(function(j){mHouseClass.OnLoadCeiling($(this));});

	 	$xml.find("Door").each(function(j){mHouseClass.OnLoadDoor($(this));});	
	 
	 	$xml.find("Window").each(function(j){mHouseClass.OnLoadWindow($(this));});
	 	
	 	$xml.find("Furniture").each(function(j){mHouseClass.OnLoadFurniture($(this));});

		$xml.find("Wallboard").each(function(j){mHouseClass.OnLoadObj($(this));});
		
//		$xml.find("LightData").each(function(j){mHouseClass.OnLoadPlaneLight($(this));});

//		$xml.find("AnimationMatrix").each(function(j){mHouseClass.OnLoadAnimationMatrix($(this));});
	}
		
	this.OnLoadXML_Bake = function(strXML)
	{
		var  xmlDoc = $.parseXML( strXML );
		var  $xml = $( xmlDoc );
	}
	
	this.OnLoadObj = function(data)
	{
		var geom = new THREE.Geometry();
		// 得到顶点数据
		for( var i=0; i<data.find('PosArray').find('pos').length;i++)
		{
			var posX = parseFloat($(data.find('PosArray').find('pos')[i]).attr('X'));
			var posY = parseFloat($(data.find('PosArray').find('pos')[i]).attr('Y'));
			var posZ = parseFloat($(data.find('PosArray').find('pos')[i]).attr('Z'));
				geom.vertices.push(new THREE.Vector3(posX, posY, posZ));	
		}

		for(var index = 0; index < geom.vertices.length;index +=3)
			geom.faces.push(new THREE.Face3(3*index/3+0,3*index/3+2,3*index/3+1));

		geom.computeBoundingBox();
		geom.faceVertexUvs[0] = new Array();
		for( var i=0; i<data.find('UVArray').find('uv').length;i+=3)
		{
			var u1 = parseFloat($(data.find('UVArray').find('uv')[i+0]).attr('u'));
			var v1 = parseFloat($(data.find('UVArray').find('uv')[i+0]).attr('v'));
			var u3 = parseFloat($(data.find('UVArray').find('uv')[i+1]).attr('u'));
			var v3 = parseFloat($(data.find('UVArray').find('uv')[i+1]).attr('v'));
			var u2 = parseFloat($(data.find('UVArray').find('uv')[i+2]).attr('u'));
			var v2 = parseFloat($(data.find('UVArray').find('uv')[i+2]).attr('v'));
			geom.faceVertexUvs[0].push([ new THREE.Vector2(u1 , v1), new THREE.Vector2(u2 , v2), new THREE.Vector2(u3 , v3)]);	
		}
		
		geom.computeFaceNormals();
		geom.verticesNeedUpdate = true;
		geom.uvsNeedUpdate  	= true;
		
		let strImage   = data.find('Image').attr('src');
		var tImageTex = new THREE.TextureLoader().load(strImage);				
		tImageTex.wrapS = tImageTex.wrapT = THREE.RepeatWrapping;			
		
		var tMat = new THREE.MeshPhongMaterial( {
			side: THREE.DoubleSide,
			map: tImageTex,
		} );	
		
		var tMesh = new THREE.Mesh(geom,tMat);
		//tMesh.rotation.x = -Math.PI/2;
		scene.add(tMesh);	
	}

	this.OnLoadWallIn = function(data)
	{
		var geom = new THREE.Geometry();
		// 得到顶点数据
		for( var i=0; i<data.find('PosArray').find('pos').length;i++)
		{
			var posX = parseFloat($(data.find('PosArray').find('pos')[i]).attr('X'));
			var posY = parseFloat($(data.find('PosArray').find('pos')[i]).attr('Y'));
			var posZ = parseFloat($(data.find('PosArray').find('pos')[i]).attr('Z'));
				geom.vertices.push(new THREE.Vector3(posX, posY, posZ));	
		}

		for(var index = 0; index < geom.vertices.length;index +=3)
			geom.faces.push(new THREE.Face3(3*index/3+0,3*index/3+1,3*index/3+2));

		geom.computeBoundingBox();
		geom.faceVertexUvs[1] = new Array();
		for( var i=0; i<data.find('UVArray').find('uv').length;i+=3)
		{
			var u1 = parseFloat($(data.find('UVArray').find('uv')[i+0]).attr('u'));
			var v1 = parseFloat($(data.find('UVArray').find('uv')[i+0]).attr('v'));

			var u2 = parseFloat($(data.find('UVArray').find('uv')[i+1]).attr('u'));
			var v2 = parseFloat($(data.find('UVArray').find('uv')[i+1]).attr('v'));

			var u3 = parseFloat($(data.find('UVArray').find('uv')[i+2]).attr('u'));
			var v3 = parseFloat($(data.find('UVArray').find('uv')[i+2]).attr('v'));

			if( data.find('UV2Array').find('uv').length == 0 )
				geom.faceVertexUvs[0].push([ new THREE.Vector2(u1 , v1), new THREE.Vector2(u2 , v2), new THREE.Vector2(u3 , v3)]);	
			else
				geom.faceVertexUvs[1].push([ new THREE.Vector2(u1 , v1), new THREE.Vector2(u2 , v2), new THREE.Vector2(u3 , v3)]);				
		}
		
		for( var i=0; i<data.find('UV2Array').find('uv').length;i+=3)
		{
			var u1 = parseFloat($(data.find('UV2Array').find('uv')[i+0]).attr('u'));
			var v1 = parseFloat($(data.find('UV2Array').find('uv')[i+0]).attr('v'));

			var u2 = parseFloat($(data.find('UV2Array').find('uv')[i+1]).attr('u'));
			var v2 = parseFloat($(data.find('UV2Array').find('uv')[i+1]).attr('v'));

			var u3 = parseFloat($(data.find('UV2Array').find('uv')[i+2]).attr('u'));
			var v3 = parseFloat($(data.find('UV2Array').find('uv')[i+2]).attr('v'));

			geom.faceVertexUvs[0].push([ new THREE.Vector2(u1 , v1),new THREE.Vector2(u2 , v2),new THREE.Vector2(u3 , v3)]);	
		}

		geom.computeFaceNormals();
		geom.verticesNeedUpdate = true;
		geom.uvsNeedUpdate  	= true;


			
		var tMat;
		if( data.find('UV2Array').find('uv').length == 0 )
		{
			let strImage   = data.find('SourceImage').attr('src');
			var tImageTex = new THREE.TextureLoader().load(m_strHttp+"texture/"+strImage);				
			tImageTex.wrapS = tImageTex.wrapT = THREE.RepeatWrapping;			
			
			tMat = new THREE.MeshPhongMaterial( {
				side: THREE.DoubleSide,
				map: tImageTex,
			} );		
		}
		else
		{
			let strImage   = data.find('SourceImage').attr('src1');
			let strLightMap= data.find('SourceImage').attr('src2');
			
			var tImageTex = new THREE.TextureLoader().load(strImage);				
				tImageTex.wrapS = tImageTex.wrapT = THREE.RepeatWrapping;
		
			var tLighmapTex = new THREE.TextureLoader().load(strLightMap);				
				tLighmapTex.wrapS = tLighmapTex.wrapT = THREE.RepeatWrapping;
				
			tMat = new THREE.MeshPhongMaterial( {
				side: THREE.DoubleSide,
				lightMap:tImageTex,
				map: tLighmapTex,
			} );			
		}

		var tMesh = new THREE.Mesh(geom,tMat);
		tMesh.rotation.x = -Math.PI/2;
		scene.add(tMesh);
		this.mRenderWall_In.push(tMesh);
	}

	this.OnLoadWallOut = function(data)
	{
		var geom = new THREE.Geometry();
		// 得到顶点数据
		for( var i=0; i<data.find('PosArray').find('pos').length;i++)
		{
			var posX = parseFloat($(data.find('PosArray').find('pos')[i]).attr('X'));
			var posY = parseFloat($(data.find('PosArray').find('pos')[i]).attr('Y'));
			var posZ = parseFloat($(data.find('PosArray').find('pos')[i]).attr('Z'));
				geom.vertices.push(new THREE.Vector3(posX, posY, posZ));	
		}

		for(var index = 0; index < geom.vertices.length;index +=3)
			geom.faces.push(new THREE.Face3(3*index/3+0,3*index/3+2,3*index/3+1));

		geom.computeBoundingBox();
		geom.faceVertexUvs[1] = new Array();
		for( var i=0; i<data.find('UVArray').find('uv').length;i+=3)
		{
			var u1 = parseFloat($(data.find('UVArray').find('uv')[i+0]).attr('u'));
			var v1 = parseFloat($(data.find('UVArray').find('uv')[i+0]).attr('v'));

			var u2 = parseFloat($(data.find('UVArray').find('uv')[i+1]).attr('u'));
			var v2 = parseFloat($(data.find('UVArray').find('uv')[i+1]).attr('v'));

			var u3 = parseFloat($(data.find('UVArray').find('uv')[i+2]).attr('u'));
			var v3 = parseFloat($(data.find('UVArray').find('uv')[i+2]).attr('v'));

			if( data.find('UV2Array').find('uv').length == 0 )
				geom.faceVertexUvs[0].push([ new THREE.Vector2(u1 , v1), new THREE.Vector2(u2 , v2), new THREE.Vector2(u3 , v3)]);	
			else
				geom.faceVertexUvs[1].push([ new THREE.Vector2(u1 , v1), new THREE.Vector2(u2 , v2), new THREE.Vector2(u3 , v3)]);				
		}
		
		
		for( var i=0; i<data.find('UV2Array').find('uv').length;i+=3)
		{
			var u1 = parseFloat($(data.find('UV2Array').find('uv')[i+0]).attr('u'));
			var v1 = parseFloat($(data.find('UV2Array').find('uv')[i+0]).attr('v'));

			var u2 = parseFloat($(data.find('UV2Array').find('uv')[i+1]).attr('u'));
			var v2 = parseFloat($(data.find('UV2Array').find('uv')[i+1]).attr('v'));

			var u3 = parseFloat($(data.find('UV2Array').find('uv')[i+2]).attr('u'));
			var v3 = parseFloat($(data.find('UV2Array').find('uv')[i+2]).attr('v'));

			geom.faceVertexUvs[0].push([ new THREE.Vector2(u1 , v1),new THREE.Vector2(u2 , v2),new THREE.Vector2(u3 , v3)]);	
		}
		
		geom.computeFaceNormals();
		geom.verticesNeedUpdate = true;
		geom.uvsNeedUpdate  	= true;


			
		var tMat;
		if( data.find('UV2Array').find('uv').length == 0 )
		{
			let strImage   = data.find('SourceImage').attr('src');
			var tImageTex = new THREE.TextureLoader().load(m_strHttp+"texture/"+strImage);				
			tImageTex.wrapS = tImageTex.wrapT = THREE.RepeatWrapping;			
			
			tMat = new THREE.MeshPhongMaterial( {
				side: THREE.DoubleSide,
				map: tImageTex,
			} );	
		}
		else
		{
			let strImage   = data.find('SourceImage').attr('src1');
			let strLightMap= data.find('SourceImage').attr('src2');
			
			var tImageTex = new THREE.TextureLoader().load(strImage);				
			tImageTex.wrapS = tImageTex.wrapT = THREE.RepeatWrapping;			
			var tLighmapTex = new THREE.TextureLoader().load(strLightMap);				
				tLighmapTex.wrapS = tLighmapTex.wrapT = THREE.RepeatWrapping;		
			tMat = new THREE.MeshPhongMaterial( { side: THREE.DoubleSide, lightMap:tImageTex, map: tLighmapTex} );			
		}
		
		//	lightMapIntensity:0.25
		var tMesh = new THREE.Mesh(geom,tMat);
		tMesh.rotation.x = -Math.PI/2;
		scene.add(tMesh);
		this.mRenderWall_Out.push(tMesh);
	}
		
	this.OnLoadFloor = function(data)
	{
		var geom = new THREE.Geometry();
		// 得到顶点数据
		for( var i=0; i<data.find('PosArray').find('pos').length;i++)
		{
			var posX = parseFloat($(data.find('PosArray').find('pos')[i]).attr('X'));
			var posY = parseFloat($(data.find('PosArray').find('pos')[i]).attr('Y'));
			var posZ = parseFloat($(data.find('PosArray').find('pos')[i]).attr('Z'));
				geom.vertices.push(new THREE.Vector3(posX, posY, posZ));	
		}

		for(var index = 0; index < geom.vertices.length;index +=3)
			geom.faces.push(new THREE.Face3(3*index/3+0,3*index/3+1,3*index/3+2));

		geom.computeBoundingBox();
		geom.faceVertexUvs[1] = new Array();
		for( var i=0; i<data.find('UVArray').find('uv').length;i+=3)
		{
			var u1 = parseFloat($(data.find('UVArray').find('uv')[i+0]).attr('u'));
			var v1 = parseFloat($(data.find('UVArray').find('uv')[i+0]).attr('v'));

			var u2 = parseFloat($(data.find('UVArray').find('uv')[i+1]).attr('u'));
			var v2 = parseFloat($(data.find('UVArray').find('uv')[i+1]).attr('v'));

			var u3 = parseFloat($(data.find('UVArray').find('uv')[i+2]).attr('u'));
			var v3 = parseFloat($(data.find('UVArray').find('uv')[i+2]).attr('v'));

			if( data.find('UV2Array').find('uv').length == 0 )
				geom.faceVertexUvs[0].push([ new THREE.Vector2(u1 , v1), new THREE.Vector2(u2 , v2), new THREE.Vector2(u3 , v3)]);	
			else
				geom.faceVertexUvs[1].push([ new THREE.Vector2(u1 , v1), new THREE.Vector2(u2 , v2), new THREE.Vector2(u3 , v3)]);				

		}
		
		
		for( var i=0; i<data.find('UV2Array').find('uv').length;i+=3)
		{
			var u1 = parseFloat($(data.find('UV2Array').find('uv')[i+0]).attr('u'));
			var v1 = parseFloat($(data.find('UV2Array').find('uv')[i+0]).attr('v'));

			var u2 = parseFloat($(data.find('UV2Array').find('uv')[i+1]).attr('u'));
			var v2 = parseFloat($(data.find('UV2Array').find('uv')[i+1]).attr('v'));

			var u3 = parseFloat($(data.find('UV2Array').find('uv')[i+2]).attr('u'));
			var v3 = parseFloat($(data.find('UV2Array').find('uv')[i+2]).attr('v'));

			geom.faceVertexUvs[0].push([ new THREE.Vector2(u1 , v1),
										 new THREE.Vector2(u2 , v2),
										 new THREE.Vector2(u3 , v3)]);	
		}
		
		geom.computeFaceNormals();
		geom.verticesNeedUpdate = true;
		geom.uvsNeedUpdate  	= true;

	
/*		var tMat = new THREE.MeshPhongMaterial( {
			side: THREE.DoubleSide,
			lightMap:tImageTex,
			map: tLighmapTex,
		//	lightMapIntensity:0.25
		} );	*/
		
		var tMat;
		if( data.find('UV2Array').find('uv').length == 0 )
		{
			let strImage   = data.find('SourceImage').attr('src');
			var tImageTex = new THREE.TextureLoader().load(m_strHttp+"texture/"+strImage);				
			tImageTex.wrapS = tImageTex.wrapT = THREE.RepeatWrapping;
			
			tMat = new THREE.MeshStandardMaterial( {
					roughness: 0.2,
					color: 0xbbbbbb,
					metalness: 0.2,
					map: mResource.floorDiffuseTex,
					bumpMap:mResource.floorBumpTex,
					roughnessMap:mResource.floorRoughnessTex
			} );
		}
		else
		{
			let strImage   = data.find('SourceImage').attr('src1');
			let strLightMap= data.find('SourceImage').attr('src2');
		
			var tLighmapTex = new THREE.TextureLoader().load(strLightMap);				
				tLighmapTex.wrapS = tLighmapTex.wrapT = THREE.RepeatWrapping;				
			var tImageTex = new THREE.TextureLoader().load(strImage);				
				tImageTex.wrapS = tImageTex.wrapT = THREE.RepeatWrapping;		
			tMat = new THREE.MeshStandardMaterial( {
					roughness: 0.2,
					color: 0xbbbbbb,
					metalness: 0.2,
					lightMap:tImageTex,
					map: mResource.floorDiffuseTex,
					bumpMap:mResource.floorBumpTex,
					roughnessMap:mResource.floorRoughnessTex
			} );		
		}
		
		var tMesh = new THREE.Mesh(geom,tMat);
		tMesh.rotation.x = -Math.PI/2;
		scene.add(tMesh);
		this.mRenderFloor.push(tMesh);
	}		

	this.OnLoadCeilingTop = function(data)
	{
		var geom = new THREE.Geometry();
		// 得到顶点数据
		for( var i=0; i<data.find('PosArray').find('pos').length;i++)
		{
			var posX = parseFloat($(data.find('PosArray').find('pos')[i]).attr('X'));
			var posY = parseFloat($(data.find('PosArray').find('pos')[i]).attr('Y'));
			var posZ = parseFloat($(data.find('PosArray').find('pos')[i]).attr('Z'));
				geom.vertices.push(new THREE.Vector3(posX, posY, posZ));	
		}

		for(var index = 0; index < geom.vertices.length;index +=3)
			geom.faces.push(new THREE.Face3(3*index/3+0,3*index/3+1,3*index/3+2));

		geom.computeBoundingBox();

		for( var i=0; i<data.find('UVArray').find('uv').length;i+=3)
		{
			var u1 = parseFloat($(data.find('UVArray').find('uv')[i+0]).attr('u'));
			var v1 = parseFloat($(data.find('UVArray').find('uv')[i+0]).attr('v'));

			var u2 = parseFloat($(data.find('UVArray').find('uv')[i+1]).attr('u'));
			var v2 = parseFloat($(data.find('UVArray').find('uv')[i+1]).attr('v'));

			var u3 = parseFloat($(data.find('UVArray').find('uv')[i+2]).attr('u'));
			var v3 = parseFloat($(data.find('UVArray').find('uv')[i+2]).attr('v'));

			geom.faceVertexUvs[0].push([ new THREE.Vector2(u1 , v1),
										 new THREE.Vector2(u2 , v2),
										 new THREE.Vector2(u3 , v3)]);	
		}
	
		geom.computeFaceNormals();
		geom.verticesNeedUpdate = true;
		geom.uvsNeedUpdate  	= true;

		var tMat
		let strImage   = data.find('SourceImage').attr('src1');
		if(strImage == undefined)
		{
			let strImage   = data.find('SourceImage').attr('src');
			var tImageTex = new THREE.TextureLoader().load(m_strHttp+"texture/"+strImage);	
			
				tMat = new THREE.MeshPhongMaterial( {
				side: THREE.DoubleSide,
				map: tImageTex,
			//	lightMapIntensity:0.25
			} );				
		}
		else
		{
			var tImageTex = new THREE.TextureLoader().load(strImage);				
				tImageTex.wrapS = tImageTex.wrapT = THREE.RepeatWrapping;
			
				tMat = new THREE.MeshPhongMaterial( {
				side: THREE.DoubleSide,
				map: tImageTex,
			//	lightMapIntensity:0.25
			} );				
		}

		
		var tMesh = new THREE.Mesh(geom,tMat);
		tMesh.rotation.x = -Math.PI/2;
		scene.add(tMesh);
		this.mRenderCeilingTop.push(tMesh);
	}	
	
	this.OnLoadCeiling = function(data)
	{
		var geom = new THREE.Geometry();
		// 得到顶点数据
		for( var i=0; i<data.find('PosArray').find('pos').length;i++)
		{
			var posX = parseFloat($(data.find('PosArray').find('pos')[i]).attr('X'));
			var posY = parseFloat($(data.find('PosArray').find('pos')[i]).attr('Y'));
			var posZ = parseFloat($(data.find('PosArray').find('pos')[i]).attr('Z'));
				geom.vertices.push(new THREE.Vector3(posX, posY, posZ));	
		}

		for(var index = 0; index < geom.vertices.length;index +=3)
			geom.faces.push(new THREE.Face3(3*index/3+0,3*index/3+1,3*index/3+2));

		geom.computeBoundingBox();
		geom.faceVertexUvs[1] = new Array();
		for( var i=0; i<data.find('UVArray').find('uv').length;i+=3)
		{
			var u1 = parseFloat($(data.find('UVArray').find('uv')[i+0]).attr('u'));
			var v1 = parseFloat($(data.find('UVArray').find('uv')[i+0]).attr('v'));

			var u2 = parseFloat($(data.find('UVArray').find('uv')[i+1]).attr('u'));
			var v2 = parseFloat($(data.find('UVArray').find('uv')[i+1]).attr('v'));

			var u3 = parseFloat($(data.find('UVArray').find('uv')[i+2]).attr('u'));
			var v3 = parseFloat($(data.find('UVArray').find('uv')[i+2]).attr('v'));

			if( data.find('UV2Array').find('uv').length == 0 )
				geom.faceVertexUvs[0].push([ new THREE.Vector2(u1 , v1), new THREE.Vector2(u2 , v2), new THREE.Vector2(u3 , v3)]);	
			else
				geom.faceVertexUvs[1].push([ new THREE.Vector2(u1 , v1), new THREE.Vector2(u2 , v2), new THREE.Vector2(u3 , v3)]);				

		}
		
		
		for( var i=0; i<data.find('UV2Array').find('uv').length;i+=3)
		{
			var u1 = parseFloat($(data.find('UV2Array').find('uv')[i+0]).attr('u'));
			var v1 = parseFloat($(data.find('UV2Array').find('uv')[i+0]).attr('v'));

			var u2 = parseFloat($(data.find('UV2Array').find('uv')[i+1]).attr('u'));
			var v2 = parseFloat($(data.find('UV2Array').find('uv')[i+1]).attr('v'));

			var u3 = parseFloat($(data.find('UV2Array').find('uv')[i+2]).attr('u'));
			var v3 = parseFloat($(data.find('UV2Array').find('uv')[i+2]).attr('v'));

			geom.faceVertexUvs[0].push([ new THREE.Vector2(u1 , v1),
										 new THREE.Vector2(u2 , v2),
										 new THREE.Vector2(u3 , v3)]);	
		}
		
		geom.computeFaceNormals();
		geom.verticesNeedUpdate = true;
		geom.uvsNeedUpdate  	= true;
				
		var tMat;
		if( data.find('UV2Array').find('uv').length == 0 )
		{
			let strImage   = data.find('SourceImage').attr('src');
			var tImageTex = new THREE.TextureLoader().load(m_strHttp+"texture/"+strImage);				
			tMat = new THREE.MeshPhongMaterial( { side: THREE.DoubleSide, map: tImageTex} );		
		}
		else
		{
			let strImage   = data.find('SourceImage').attr('src1');
			let strLightMap= data.find('SourceImage').attr('src2');
			
			var tImageTex = new THREE.TextureLoader().load(strImage);				
				tImageTex.wrapS = tImageTex.wrapT = THREE.RepeatWrapping;
			
			var tLighmapTex = new THREE.TextureLoader().load(strLightMap);				
				tLighmapTex.wrapS = tLighmapTex.wrapT = THREE.RepeatWrapping;		
	
			var tMat = new THREE.MeshPhongMaterial( {
				side: THREE.DoubleSide,
				lightMap:tImageTex,
				map: tLighmapTex,
			} );			
		}		
		
		var tMesh = new THREE.Mesh(geom,tMat);
		tMesh.rotation.x = -Math.PI/2;
		scene.add(tMesh);
		this.mRenderCeiling.push(tMesh);
	}		

	this.SetBoundingBox = function(box3)
	{
		if(box3.max.x > this.m_BOX.max.x )
		{
			this.m_BOX.max.x = box3.max.x;
		}

		if(box3.max.y > this.m_BOX.max.y )
		{
			this.m_BOX.max.y = box3.max.y;
		}

		if(box3.min.x < this.m_BOX.min.x )
		{
			this.m_BOX.min.x = box3.min.x;
		}

		if(box3.min.y < this.m_BOX.min.y )
		{
			this.m_BOX.min.y = box3.min.y;
		}
	}
	
	this.OnLoadDoor = function(data){
		var tObj = new ObjData();
		this.mDoorArray.push(tObj);	
		tObj.OnCreate3D1(tObj,data);
	}
	
	this.OnLoadWindow= function(data){
		var tObj = new ObjData();
		this.mWindowArray.push(tObj);	
		tObj.OnCreate3D1(tObj,data);		
	}
	
	this.OnLoadFurniture= function(data){
		var tObj = new ObjData();
		this.mFurnitureArray.push(tObj);	
		tObj.OnCreate3D(tObj,data);
		
	}

	this.OnLoadPlaneLight = function(data) {
		m_PlaneLightClass.OnLoadPlaneLight_XML(data);
	}

	this.OnLoadAnimationMatrix = function(data)
	{
		m_AnimationClass.OnLoadAnimationMatrix(data);
	}

	this.HideAllCeiling = function()
	{
		for(var i = 0; i<this.mFurnitureArray.length; i++ )
		{
			if(270 < this.mFurnitureArray[i].m_fHight)
			{
				this.mFurnitureClass.mFurnitureArray[i].OnShow(false);
			}
		}
	}


	this.ChangeEmptyRoom = function()
	{
		var selectTime = new Date().getTime();//获取时间戳
		for( var i = 0; i< this.mRenderWall_In.length; i++ )
		{			
			var tMesh = this.mRenderWall_In[i];
			tMesh.geometry.computeBoundingBox();
			var diffuseTex = new THREE.TextureLoader().load( 'img/brick_diffuse.jpg?'+selectTime);
			diffuseTex.wrapS = THREE.RepeatWrapping;
			diffuseTex.wrapT = THREE.RepeatWrapping;

			var tMat = new THREE.MeshPhysicalMaterial( {
				side: THREE.DoubleSide,
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

			this.mRenderWall_In[i].material = tMat;
	    	this.mRenderWall_In[i].material.needsUpdate = true;	
		}
	}
	
	this.ChangeEmptyRoom_Ceiling = function()
	{
		var tMat = new THREE.MeshBasicMaterial( {
			side: THREE.FrontSide,
			color: 0x333333,
		} );
		for( k=0; k<this.mRenderCeiling.length; k++)
		{	
				this.mRenderCeiling[k].material = tMat;
				this.mRenderCeiling[k].material.needsUpdate = true;			
		}
	}
	
	this.ChangeEmptyRoom_Floor = function()
	{
		for(var k=0; k<this.mRenderFloor.length; k++)
		{
			this.mRenderFloor[k].material = mResource.boxProjectedMat;
			this.mRenderFloor[k].material.needsUpdate = true;
		}	
				
	}
	
	this.OnCreateLight = function()
	{
		//lights
		var width = 100;
		var height = 100;
		var intensity = 30;
						
		// 两扇窗户一下加顶灯
		if( this.mWindowArray.length <= 2 )
		{
			for(var i = 0; i<this.mRenderFloor.length ; i++)
			{
				var box = new THREE.Box3();
					box.setFromObject( this.mRenderFloor[i] );
								
				var fCenterX = (box.max.x+box.min.x)/2;
				var fCenterY = (box.max.y+box.min.y)/2;
				//0xf3aaaa
				var tRectLight = new THREE.RectAreaLight( 0xffffff, 60, width, height );
				tRectLight.position.set( fCenterX, 280, -fCenterY );
				tRectLight.lookAt( fCenterX, 0, -fCenterY );
				scene.add( tRectLight );
			}
		}
		
	/*	for(var j=0; j<this.mWindowArray.length; j++)
		{	
			var tmpMatrix1= new THREE.Matrix4().makeRotationZ(this.mWindowArray[j].m_fRotate);			
			var vPos1 = new THREE.Vector3( 1,0,0 );	
			var vPos2 = vPos1.applyMatrix4(tmpMatrix1);

			var tLight = new THREE.RectAreaLight( 0xffffff, intensity/2, width, height );	//0x9aaeff //0xf3aaaa
			tLight.position.set( this.mWindowArray[j].m_vPos.x,this.mWindowArray[j].m_fHight+this.mWindowArray[j].m_fHeight/2,-this.mWindowArray[j].m_vPos.y );
			tLight.lookAt( vPos2.x, this.mWindowArray[j].m_fHight+this.mWindowArray[j].m_fHeight/2, -vPos2.y );
			scene.add( tLight );	
		}	*/
	}	
}