
function Resource()
{
	// 初始化时用到的资源
		this.mFloorTex;					//2D初始地面材质
		this.mWallTex;
		this.mFontTex;
		this.mRedTex;
		this.mCeilingTex;
		this.mColor  = 0x525759;
		this.mBKColor= 0xffffff;		//0x1d1f21
		this.mCircularTex;
		this.mMatcap;
		this.mBackground;
		this.mBackColor;
		this.wallMat;
		this.rMap;
		this.boxProjectedMat;
		this.floorMat;					// 初始地面
		this.matLine;
		this.matLine1;
		this.matLine_selected;
		this.mGroundTex;				// 地面贴图
		
		this.diffuseTex;
		this.bumpTex;
		
		this.floorDiffuseTex;
		this.floorBumpTex;
		this.floorRoughnessTex;		
		this.OnInit = function()
		{			
	  		this.mFloorTex = new THREE.TextureLoader().load('img/floor.jpg' );	//hardwood2_diffuse.jpg
  			this.mFloorTex.wrapS = this.mFloorTex.wrapT = THREE.RepeatWrapping;
		//	this.mFloorTex.repeat.set( 0.005, 0.005 );
			this.mFloorTex.repeat.set( 2.5, 2.5 );
 			this.mFloorTex.needsUpdate = true;
 			
 	  		this.mCircularTex = new THREE.TextureLoader().load('system/circular.png' );
  			this.mCircularTex.wrapS = this.mFloorTex.wrapT = THREE.RepeatWrapping;
		//	this.mFloorTex.repeat.set( 0.005, 0.005 );
		//	this.mFloorTex.repeat.set( 2, 2 );
 			this.mCircularTex.needsUpdate = true;	
 			
 			
 			this.mGroundTex   = new THREE.TextureLoader().load('img/0001.jpg' );
   			this.mGroundTex.wrapS = this.mGroundTex.wrapT = THREE.RepeatWrapping;
		//	this.mFloorTex.repeat.set( 0.005, 0.005 );
			this.mGroundTex.repeat.set( 10, 10 );
 			this.mGroundTex.needsUpdate = true;			
 			
 			this.mWaveLineTex = new THREE.TextureLoader().load(m_strHttp + 'texture/'+ "c75AB6AAC376BC72D0723CC4096976E1F/c03320A66FA56EA2D047F042E53EEFEF1/UIKE7827/UIKE7827.jpg");
  			this.mWaveLineTex.wrapS = this.mWaveLineTex.wrapT = THREE.RepeatWrapping;
		//	this.mFloorTex.repeat.set( 0.005, 0.005 );
		//	this.mFloorTex.repeat.set( 2, 2 );
 			this.mWaveLineTex.needsUpdate = true;
 			
 				
 			this.mWallTex = new THREE.TextureLoader().load('system/bai.jpg' );
  			this.mWallTex.wrapS = this.mWallTex.wrapT = THREE.RepeatWrapping;
			this.mWallTex.repeat.set( 0.01, 0.01 );
 			this.mWallTex.needsUpdate = true;	
 				
 			this.mCeilingTex = new THREE.TextureLoader().load('system/lightmap13.png' );

  			this.mCeilingTex.wrapS = this.mFloorTex.wrapT = THREE.RepeatWrapping;
		//	this.mCeilingTex.repeat.set( 0.01, 0.01 );
 			this.mCeilingTex.needsUpdate = true;	 				
 	
 			this.mFontTex = new THREE.MeshBasicMaterial( {
				color: 0x525759,transparent: false,side: THREE.DoubleSide} );
				
			this.mFontBuleTex = new THREE.MeshBasicMaterial( {
				color: 0x363636,transparent: false,side: THREE.DoubleSide} );//0x58A3F3
				
			this.mRedTex  = new THREE.MeshBasicMaterial( {
				color: 0xff0000,transparent: false,side: THREE.DoubleSide} );
				
			this.mMatcap = new THREE.TextureLoader().load( 'img/matcap.jpg', function () {
					//matcap.encoding = THREE.sRGBEncoding;
					mResource.mMatcap.encoding = THREE.sRGBEncoding;
			});
			
			this.mBackColor = new THREE.Color( 0xf1f3f8 );// 0xe8e8e8
			
			this.mBackground = new THREE.CubeTextureLoader()
					.setPath( 'img/Park3Med/' )
					.load( [ 'px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg' ] );
					
			// 初始墙体 walls
			//======================================================================================	
			var selectTime = new Date().getTime();//获取时间戳
			this.diffuseTex = new THREE.TextureLoader().load( 'img/brick_diffuse1.jpg?'+selectTime);
			this.bumpTex =new THREE.TextureLoader().load( 'img/brick_bump1.jpg?'+selectTime);
			this.bumpTex.wrapS = THREE.RepeatWrapping;
			this.bumpTex.wrapT = THREE.RepeatWrapping;

			this.wallMat = new THREE.MeshPhysicalMaterial( {
			//	side: THREE.BackSide,
				map: mResource.diffuseTex,
				bumpMap: mResource.bumpTex,
				bumpScale: 0.3,
			} );
			
		//	this.wallMat = new THREE.TextureLoader().load( 'img/brick_diffuse.jpg');			
			
			this.rMap = new THREE.TextureLoader().load( 'img/lavatile.jpg' );
			this.rMap.wrapS = THREE.RepeatWrapping;
			this.rMap.wrapT = THREE.RepeatWrapping;
			this.rMap.repeat.set( 2, 1 );
			
			this.boxProjectedMat = new THREE.MeshPhysicalMaterial( {
				//	map: this.mFloorTex,
					color: new THREE.Color( '#ffffff' ),
					roughness: 1,
				//	envMap: cubeCamera.renderTarget.texture,
					roughnessMap: mResource.rMap
				} );
			
			//======================================================img/hardwood2_diffuse.jpg
			this.floorDiffuseTex =new THREE.TextureLoader().load( "img/floor.jpg", function ( map ) {
					map.wrapS = THREE.RepeatWrapping;
					map.wrapT = THREE.RepeatWrapping;
					map.anisotropy = 4;
					map.repeat.set( 2.5, 2.5 );
			} );

			this.floorBumpTex =new THREE.TextureLoader().load( 'img/hardwood2_bump.jpg', function (map) {
					map.wrapS = THREE.RepeatWrapping;
					map.wrapT = THREE.RepeatWrapping;
					map.anisotropy = 4;
					map.repeat.set( 2.5, 6 );
			} );
			
			this.floorRoughnessTex =new THREE.TextureLoader().load( 'img/hardwood2_roughness.jpg', function (map) {	
					map.wrapS = THREE.RepeatWrapping;
					map.wrapT = THREE.RepeatWrapping;
					map.anisotropy = 4;
					map.repeat.set( 2.5, 6 );
			} );			
			
			this.floorMat = new THREE.MeshStandardMaterial( {
					roughness: 0.2,
					color: 0xbbbbbb,
					metalness: 0.2,
					map: this.floorDiffuseTex,
					bumpMap:this.floorBumpTex,
					roughnessMap:this.floorRoughnessTex
			} );				

			this.matLine = new THREE.LineMaterial( {
					depthTest:false,
					color: 0xffffff,
					linewidth: 3, // in pixels
					vertexColors: THREE.VertexColors,
					//resolution:  // to be set by renderer, eventually
					dashed: false
				} );
					
			this.matLine1 = new THREE.LineMaterial( {
					depthTest:false,
					color: 0xffffff,
					linewidth: 2, // in pixels
					vertexColors: THREE.VertexColors,
					dashed: false
				} );				
			
			this.matLine_selected = new THREE.LineMaterial( {
					color: 0xff0000,
					linewidth: 4, // in pixels
					vertexColors: THREE.VertexColors,
					//resolution:  // to be set by renderer, eventually
					dashed: false
				} );
				
			this.matLine1.resolution.set( window.innerWidth, window.innerHeight );
			this.matLine.resolution.set( window.innerWidth, window.innerHeight ); 
			this.matLine_selected.resolution.set( window.innerWidth, window.innerHeight );			
		};
		

}