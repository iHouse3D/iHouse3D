
function LineData()
{
	// 线段
		this.m_vStart;				// 起点			
		this.m_vEnd;				// 终点		
		this.m_vCenter;				// 中心点		
		this.m_fLength	   = 1;	   	// 长度
		this.m_fWidth	   = 1;
		this.m_fRotate;				// 旋转弧度
		this.mLine;
		this.mWallData3D_In= null;				// 3D平面
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
		this.OnUpdate3D = function()
		{
			var geom = new THREE.Geometry();
			geom.vertices.push(new THREE.Vector3(this.m_vStart.x, this.m_vStart.y, 0));
			geom.vertices.push(new THREE.Vector3(this.m_vEnd.x,   this.m_vEnd.y,   0));
			geom.vertices.push(new THREE.Vector3(this.m_vStart.x, this.m_vStart.y, mHouseClass.m_fHeight));
			
			geom.vertices.push(new THREE.Vector3(this.m_vStart.x, this.m_vStart.y, mHouseClass.m_fHeight));
			geom.vertices.push(new THREE.Vector3(this.m_vEnd.x,   this.m_vEnd.y,   0));
			geom.vertices.push(new THREE.Vector3(this.m_vEnd.x,   this.m_vEnd.y,   mHouseClass.m_fHeight));
			
			geom.vertices.push(new THREE.Vector3(this.m_vStart.x, this.m_vStart.y, 0));
			geom.vertices.push(new THREE.Vector3(this.m_vStart.x, this.m_vStart.y, mHouseClass.m_fHeight));
			geom.vertices.push(new THREE.Vector3(this.m_vEnd.x,   this.m_vEnd.y,   0));
			
			geom.vertices.push(new THREE.Vector3(this.m_vStart.x, this.m_vStart.y, mHouseClass.m_fHeight));
			geom.vertices.push(new THREE.Vector3(this.m_vEnd.x,   this.m_vEnd.y,   mHouseClass.m_fHeight));
			geom.vertices.push(new THREE.Vector3(this.m_vEnd.x,   this.m_vEnd.y,   0));
						
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
			
			this.mWallData3D_In 	= new WallData3D_In();
			this.mWallData3D_In.mTextureData = new TextureData();
				
			this.mWallData3D_In.mTextureData.mMaterial = new THREE.MeshStandardMaterial( {color: new THREE.Color( '#ffffff' )} );	
			this.mWallData3D_In.mTextureData.mTexture  = null;
			this.mWallData3D_In.mWallMesh = new THREE.Mesh( geom, this.mWallData3D_In.mTextureData.mMaterial);
			this.mWallData3D_In.mWallMesh.rotation.x = -Math.PI/2;
			this.mWallData3D_In.OnCreate(this.mWallData3D_In.mWallMesh);
			scene3D.add(this.mWallData3D_In.mWallMesh);	
			mHouseClass.mWallClass3D_In.mWallArray.push(this.mWallData3D_In);
		};
				
		this.OnClear= function()
		{
			scene.remove(this.mLine);
		};
		
		this.OnRender = function()
		{
			this.mLine.geometry.vertices[0].x =  this.m_vStart.x;
			this.mLine.geometry.vertices[0].y =  this.m_vStart.y;
			this.mLine.geometry.vertices[0].z =  this.m_vStart.z;
			
			this.mLine.geometry.vertices[1].x =  this.m_vEnd.x;
			this.mLine.geometry.vertices[1].y =  this.m_vEnd.y;
			this.mLine.geometry.vertices[1].z =  this.m_vEnd.z;

			this.mLine.geometry.verticesNeedUpdate = true;
		};
		
}