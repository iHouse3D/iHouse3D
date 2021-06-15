
function CeilingData()
{
	//墙面信息类
	this.mCeilingMesh;
	this.mCeilingMesh3D;				// 和mHouseClass.mRenderCeiling 相同
	this.mTextureData;								// 材质数据
	this.mTextureData3D;
	this.bUpdate = false;							// 是否更新
	this.m_OBBox_Max  = new THREE.Vector3();		// 包围盒
	this.m_OBBox_Min  = new THREE.Vector3();
	this.mVerticesOld = new Array();				// 原始数据
	this.m_fHeight	  = 0;							// 高度
	this.OnClear = function()
	{
		scene.remove(this.mCeilingMesh);
		scene3D.remove(this.mCeilingMesh3D);
		this.mCeilingMesh3D= null;
		this.mCeilingMesh  = null;
	};
	// 更新材质
	this.OnUpdateTex = function(ab)
	{
		this.mTextureData = new TextureData();			
		this.mTextureData.OnCreate(ab,this.mCeilingMesh);
		this.mTextureData.mTexture.wrapS = this.mTextureData.mTexture.wrapT = THREE.RepeatWrapping;
		
		var fw = (this.m_OBBox_Max.x-this.m_OBBox_Min.x)/this.mTextureData.m_fLength;
		var fh = (this.m_OBBox_Max.y-this.m_OBBox_Min.y)/this.mTextureData.m_fWidth;
		
		this.mTextureData.mTexture.offset.set(  0, 0 );
		this.mTextureData.mTexture.repeat.set( fw*10,fh*10 );
		this.mTextureData.mTexture.center.set(  0, 0 );
		this.mTextureData.mTexture.rotation = 0; 
		
		this.mTextureData.m_x1 = (this.m_OBBox_Max.x+this.m_OBBox_Min.x)/2;
		this.mTextureData.m_y1 = (this.m_OBBox_Max.y+this.m_OBBox_Min.y)/2;

		this.mCeilingMesh.material.map = this.mTextureData.mTexture;
    	this.mCeilingMesh.material.needsUpdate = true;		
	};
	
	
	// 生成所有顶面区域
	this.OnBuildCeiling = function(paths, fLayer)
	{
		this.mPath = paths;
		this.mfLayer = fLayer;
		var tFloor = [];
		for(j = 0; j < paths.length; j++)
		{
  			tFloor.push(new poly2tri.Point(paths[j].X ,paths[j].Y ));
			if( this.m_OBBox_Max.x < paths[j].X ) this.m_OBBox_Max.x  = paths[j].X;
			if( this.m_OBBox_Max.y < paths[j].Y ) this.m_OBBox_Max.y  = paths[j].Y;
			if( this.m_OBBox_Min.x > paths[j].X ) this.m_OBBox_Min.x  = paths[j].X;
			if( this.m_OBBox_Min.y > paths[j].Y ) this.m_OBBox_Min.y  = paths[j].Y; 
		} 

		var swctx = new poly2tri.SweepContext(tFloor);
			swctx.triangulate();
		var triangles = swctx.getTriangles();
		
		var fw = (this.m_OBBox_Max.x-this.m_OBBox_Min.x);
		var fh = (this.m_OBBox_Max.y-this.m_OBBox_Min.y);
		this.mfArea= 0;
		var geom = new THREE.Geometry();
		for( var k = 0; k< triangles.length; k++ ) 
		{
			geom.vertices.push(new THREE.Vector3(triangles[k].points_[0].x, triangles[k].points_[0].y, fLayer)); 
        	geom.vertices.push(new THREE.Vector3(triangles[k].points_[1].x, triangles[k].points_[1].y, fLayer));
        	geom.vertices.push(new THREE.Vector3(triangles[k].points_[2].x, triangles[k].points_[2].y, fLayer)); 
      	
      		this.mVerticesOld.push(new THREE.Vector3(triangles[k].points_[0].x, triangles[k].points_[0].y, fLayer));
      		this.mVerticesOld.push(new THREE.Vector3(triangles[k].points_[1].x, triangles[k].points_[1].y, fLayer));
      		this.mVerticesOld.push(new THREE.Vector3(triangles[k].points_[2].x, triangles[k].points_[2].y, fLayer));
        	geom.faces.push(new THREE.Face3(3*k+0,3*k+1,3*k+2));
        	
        	geom.faceVertexUvs[0][k] = [ 
        	new THREE.Vector2((triangles[k].points_[0].x - this.m_OBBox_Min.x)/fw, (triangles[k].points_[0].y - this.m_OBBox_Min.y)/fh),
        	new THREE.Vector2((triangles[k].points_[1].x - this.m_OBBox_Min.x)/fw, (triangles[k].points_[1].y - this.m_OBBox_Min.y)/fh), 
        	new THREE.Vector2((triangles[k].points_[2].x - this.m_OBBox_Min.x)/fw, (triangles[k].points_[2].y - this.m_OBBox_Min.y)/fh)];
			
			this.mfArea+=mMathClass.GetAreaInTri( triangles[k].points_[0].x, triangles[k].points_[0].y,
									 			  triangles[k].points_[1].x, triangles[k].points_[1].y,
									 			  triangles[k].points_[2].x, triangles[k].points_[2].y);
		}
        geom.computeFaceNormals();
        geom.verticesNeedUpdate = true;
		geom.uvsNeedUpdate = true;
				
		var mat = new THREE.MeshBasicMaterial( { map: mResource.mWallTex } );
		this.mCeilingMesh   = new THREE.Mesh( geom, mat);
		
		scene.add(this.mCeilingMesh);
		
	//	var str ="吊顶001,c828FF80D185184461A9C5BA35AEAD29A/c2FF8C334AE0D9F76BB576D492888D5CB/yo19/yo19.jpg,600A600,地毯,化纤,3,,,,2,,";
		var str ="吊顶001,cB40CF83708ED585F0113558458A14863/c294F1B5B3B3AAFFB95134FCCB64D6EFB/SUSEBZ02/SUSEBZ02.jpg,600A600,地毯,化纤,3,,,,2,,";
		var ab =str.split(',');
		this.OnUpdateTex(ab);
		
		this.m_fHeight = mHouseClass.m_fHeight;	// 高度
	};
	
	// 判断是否是相同地面区域
	this.IsSameAs = function( tCeiling )
	{
		//this.mPath
		var fCenterXOld = (this.m_OBBox_Max.x+this.m_OBBox_Min.x)/2;
		var fCenterYOld = (this.m_OBBox_Max.y+this.m_OBBox_Min.y)/2;

		var fCenterX = (tCeiling.m_OBBox_Max.x+tCeiling.m_OBBox_Min.x)/2;
		var fCenterY = (tCeiling.m_OBBox_Max.y+tCeiling.m_OBBox_Min.y)/2;
		
		// 面积相同 且 中心点相同
		if(Math.abs(tCeiling.mfArea- this.mfArea)<1 &&
		   Math.abs(fCenterXOld- fCenterX)<1 && Math.abs(fCenterYOld- fCenterY)<1)
		{
			return true;
		}
		
		return false;
	};
	
	this.OnUpdate3D = function()
	{	
		scene3D.remove(this.mCeilingMesh3D);
		this.m_fHeight = mHouseClass.m_fHeight;	// 高度
		
		var tCeiling = [];
		for( var j = 0; j < this.mPath.length; j++)
  			tCeiling.push(new poly2tri.Point(this.mPath[j].X ,this.mPath[j].Y )); 
		
		var swctx = new poly2tri.SweepContext(tCeiling);
			swctx.triangulate();
		var triangles = swctx.getTriangles();
		
		var fw = (this.m_OBBox_Max.x-this.m_OBBox_Min.x);
		var fh = (this.m_OBBox_Max.y-this.m_OBBox_Min.y);

		var geom = new THREE.Geometry();
		for( var k = 0; k< triangles.length; k++ ) 
		{
			geom.vertices.push(new THREE.Vector3(triangles[k].points_[0].x, triangles[k].points_[0].y, this.m_fHeight));
			geom.vertices.push(new THREE.Vector3(triangles[k].points_[2].x, triangles[k].points_[2].y, this.m_fHeight));
			geom.vertices.push(new THREE.Vector3(triangles[k].points_[1].x, triangles[k].points_[1].y, this.m_fHeight));

			geom.faces.push(new THREE.Face3(3*k+0,3*k+1,3*k+2));

			geom.faceVertexUvs[0][k] = [
				new THREE.Vector2((triangles[k].points_[0].x - this.m_OBBox_Min.x)/fw, (triangles[k].points_[0].y - this.m_OBBox_Min.y)/fh),
				new THREE.Vector2((triangles[k].points_[2].x - this.m_OBBox_Min.x)/fw, (triangles[k].points_[2].y - this.m_OBBox_Min.y)/fh),
				new THREE.Vector2((triangles[k].points_[1].x - this.m_OBBox_Min.x)/fw, (triangles[k].points_[1].y - this.m_OBBox_Min.y)/fh)];
		}
        geom.computeFaceNormals();
        geom.verticesNeedUpdate = true;
		geom.uvsNeedUpdate = true;
	
		
			
		var mat    = new THREE.MeshBasicMaterial( { map: mResource.mWallTex } );		
		this.mCeilingMesh3D = new THREE.Mesh( geom, mat);	
		this.mCeilingMesh3D.rotation.x = -Math.PI/2;

		scene3D.add(this.mCeilingMesh3D);
		
	//	var str ="吊顶001,c828FF80D185184461A9C5BA35AEAD29A/c2FF8C334AE0D9F76BB576D492888D5CB/yo19/yo19.jpg,600A600,地毯,化纤,3,,,,2,,";
		var str ="吊顶001,cB40CF83708ED585F0113558458A14863/c294F1B5B3B3AAFFB95134FCCB64D6EFB/SUSEBZ02/SUSEBZ02.jpg,600A600,地毯,化纤,3,,,,2,,";	
		var ab =str.split(',');
		this.OnUpdateTex3D(ab);

	};
	
	this.OnUpdateHeight = function(fHeight)
	{
		if(this.mCeilingMesh3D == null )
			return;
		this.m_fHeight = fHeight;
		for(var i = 0; i<this.mCeilingMesh3D.geometry.vertices.length; i++ )
		{
			this.mCeilingMesh3D.geometry.vertices[i].z = fHeight;
		}
		this.mCeilingMesh3D.geometry.computeBoundingBox();
		this.mCeilingMesh3D.geometry.computeFaceNormals();
		this.mCeilingMesh3D.geometry.verticesNeedUpdate = true;
		this.mCeilingMesh3D.geometry.uvsNeedUpdate = true;	
	};
	
	// 更新材质
	this.OnUpdateTex3D = function(ab)
	{
		this.mTextureData3D = new TextureData();			
		this.mTextureData3D.OnCreate(ab,this.mCeilingMesh3D);
		this.mTextureData3D.mTexture.wrapS = this.mTextureData3D.mTexture.wrapT = THREE.RepeatWrapping;
		
		var fw = (this.m_OBBox_Max.x-this.m_OBBox_Min.x)/this.mTextureData3D.m_fLength;
		var fh = (this.m_OBBox_Max.y-this.m_OBBox_Min.y)/this.mTextureData3D.m_fWidth;
		
		this.mTextureData3D.mTexture.offset.set(  0, 0 );
		this.mTextureData3D.mTexture.repeat.set( fw*10,fh*10 );
		this.mTextureData3D.mTexture.center.set(  0, 0 );
		this.mTextureData3D.mTexture.rotation = 0; 
		
		this.mTextureData3D.m_x1 = (this.m_OBBox_Max.x+this.m_OBBox_Min.x)/2;
		this.mTextureData3D.m_y1 = (this.m_OBBox_Max.y+this.m_OBBox_Min.y)/2;

		this.mCeilingMesh3D.material.map = this.mTextureData3D.mTexture;
    	this.mCeilingMesh3D.material.needsUpdate = true;	 	
	};
}