
function DecalData()
{
	//单块贴图(集成吊顶电器、单花等)
	this.mDecalMesh;								// 模型数据
	this.mDecalMesh3D;							
	this.mTextureData;								// 材质数据
	this.mfWidth =100;
	this.mfHeight=100;
	this.m_OBBox_Max  = new THREE.Vector3();		// 包围盒
	this.m_OBBox_Min  = new THREE.Vector3();
	
	var mouseHelper;
	var orientation = new THREE.Euler();
		
	this.OnInit = function()
	{
		mouseHelper = new THREE.Mesh( new THREE.BoxBufferGeometry( 1, 1, 10 ), new THREE.MeshNormalMaterial() );
		mouseHelper.visible = false;
		//scene.add( mouseHelper );
	};
		
	this.OnClear = function()
	{
		scene.remove(this.mDecalMesh);
		scene3D.remove(this.mDecalMesh3D);
		this.mDecalMesh  = null;
		this.mDecalMesh3D= null;
	};

	// 生成所有顶面区域
	this.OnCreateDecal = function(intersects, tCeiling,ab)
	{
		this.OnUpdateTex(ab);
		tCeiling.mCeilingMesh.updateMatrixWorld();
		var p = intersects[ 0 ].point;
		mouseHelper.position.copy( p );	
		var n = intersects[ 0 ].face.normal.clone();
			n.transformDirection( tCeiling.mCeilingMesh.matrixWorld );
			n.multiplyScalar( 10 );
			n.add( intersects[ 0 ].point );

		mouseHelper.lookAt( n );			
		orientation.copy( mouseHelper.rotation );
		
		var size = new THREE.Vector3( this.mfWidth/10, this.mfHeight/10, 1 );	
		var decalMaterial = new THREE.MeshBasicMaterial({ map: this.mTextureData.mTexture });	
			
		this.mDecalMesh = new THREE.Mesh( new THREE.DecalGeometry( tCeiling.mCeilingMesh, p, orientation, size ), decalMaterial );
		scene.add( this.mDecalMesh );
		
		var decalMat3D = new THREE.MeshBasicMaterial({ map: this.mTextureData.mTexture, side: THREE.DoubleSide });
		this.mDecalMesh3D = new THREE.Mesh( new THREE.DecalGeometry( tCeiling.mCeilingMesh, p, orientation, size ), decalMat3D );
		this.mDecalMesh3D.position.y = mHouseClass.m_fHeight -0.1;
		this.mDecalMesh3D.rotation.x = -Math.PI/2;
		scene3D.add(this.mDecalMesh3D);
	};
	
	this.OnUpdateTex = function(ab)
	{			
		this.mTextureData = new TextureData();			
		this.mTextureData.OnCreate(ab);
		this.mTextureData.mTexture.wrapS = this.mTextureData.mTexture.wrapT = THREE.RepeatWrapping;
		
		this.mfWidth = this.mTextureData.m_fLength;
		this.mfHeight= this.mTextureData.m_fWidth;
		
		this.mTextureData.mTexture.offset.set(  0, 0 );
		this.mTextureData.mTexture.repeat.set( 1,1 );
		this.mTextureData.mTexture.center.set(  0, 0 );
		this.mTextureData.mTexture.rotation = 0; 
		
		this.mTextureData.m_x1 = this.mfWidth/2;
		this.mTextureData.m_y1 = this.mfHeight/2;	    	
	};		
	
}