
function Resource()
{

		this.mLightMapTex;
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
		this.floorDiffuseTex;
		this.floorBumpTex;
		this.floorRoughnessTex;
		this.matLine;
		this.matLine_selected;
		this.mWallTex;
		this.diffuseTex;
		this.bumpTex;
		
		this.OnInit = function()
		{		
			//==========================================================================================================
/*			this.floorDiffuseTex =new THREE.TextureLoader().load( "img/j1.jpg", function ( map ) {
					map.wrapS = THREE.RepeatWrapping;
					map.wrapT = THREE.RepeatWrapping;
					map.anisotropy = 4;
					map.repeat.set( 0.5, 0.5 );
			} );

			this.floorBumpTex =new THREE.TextureLoader().load( 'img/j2.jpg', function (map) {
					map.wrapS = THREE.RepeatWrapping;
					map.wrapT = THREE.RepeatWrapping;
					map.anisotropy = 4;
					map.repeat.set( 0.5, 0.5 );
			} );
			
			this.floorRoughnessTex =new THREE.TextureLoader().load( 'img/j3.jpg', function (map) {	
					map.wrapS = THREE.RepeatWrapping;
					map.wrapT = THREE.RepeatWrapping;
					map.anisotropy = 4;
					map.repeat.set( 0.5, 0.5 );
			} );			
			
			this.floorMat = new THREE.MeshStandardMaterial( {
					roughness: 0.2,
					color: 0xbbbbbb,
					metalness: 0.2,
					map: this.floorDiffuseTex,
					bumpMap:this.floorBumpTex,
					roughnessMap:this.floorRoughnessTex
			} );*/
			//==========================================================================================================
			
			this.floorDiffuseTex =new THREE.TextureLoader().load( "img/j1.jpg", function ( map ) {
					map.wrapS = THREE.RepeatWrapping;
					map.wrapT = THREE.RepeatWrapping;
					map.anisotropy = 4;
					map.repeat.set( 0.5, 0.5 );
				//	map.repeat.set( 1, 1 );
			} );

			this.floorBumpTex =new THREE.TextureLoader().load( 'img/j2.jpg', function (map) {
					map.wrapS = THREE.RepeatWrapping;
					map.wrapT = THREE.RepeatWrapping;
					map.anisotropy = 4;
					map.repeat.set( 0.5, 0.5 );
				//	map.repeat.set( 1, 1 );
			} );
			
			this.floorRoughnessTex =new THREE.TextureLoader().load( 'img/j3.jpg', function (map) {	
					map.wrapS = THREE.RepeatWrapping;
					map.wrapT = THREE.RepeatWrapping;
					map.anisotropy = 4;
					map.repeat.set( 0.5, 0.5 );
				//	map.repeat.set(1, 1 );
			} );			
			
			this.floorMat = new THREE.MeshStandardMaterial( {
					roughness: 0.2,
					color: 0xbbbbbb,
					metalness: 0.2,
					map: this.floorDiffuseTex,
					bumpMap:this.floorBumpTex,
					roughnessMap:this.floorRoughnessTex
			} );			
			
 			
			
 			this.mLightMapTex = new THREE.TextureLoader().load('img/lightmap88.jpg' );
 			this.mLightMapTex.wrapS = this.mLightMapTex.wrapT = THREE.RepeatWrapping;
 			this.mLightMapTex.needsUpdate = true;
 					
 			this.mWaveLineTex = new THREE.TextureLoader().load(m_strHttp + 'texture/'+ "c75AB6AAC376BC72D0723CC4096976E1F/c03320A66FA56EA2D047F042E53EEFEF1/UIKE7827/UIKE7827.jpg");
  			this.mWaveLineTex.wrapS = this.mWaveLineTex.wrapT = THREE.RepeatWrapping;
		//	this.mFloorTex.repeat.set( 0.005, 0.005 );
		//	this.mFloorTex.repeat.set( 2, 2 );
 			this.mWaveLineTex.needsUpdate = true;
 				
			this.mBackColor = new THREE.Color( 0xe8e8e8 );//
			
			this.mBackground = new THREE.CubeTextureLoader()
					.setPath( 'img/Park3Med/' )
					.load( [ 'px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg' ] );
					
			// 砖墙 walls
			//======================================================================================	
			var selectTime = new Date().getTime();//获取时间戳
			this.diffuseTex = new THREE.TextureLoader().load( 'img/brick_diffuse1.jpg?'+selectTime);
			this.bumpTex =new THREE.TextureLoader().load( 'img/brick_diffuse2.jpg?'+selectTime);
			this.bumpTex.wrapS = THREE.RepeatWrapping;
			this.bumpTex.wrapT = THREE.RepeatWrapping;

			this.wallMat = new THREE.MeshPhysicalMaterial( {
				side: THREE.BackSide,
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
				
			this.mWallTex = new THREE.TextureLoader().load('../system/bai.jpg' );
  			this.mWallTex.wrapS = this.mWallTex.wrapT = THREE.RepeatWrapping;
			this.mWallTex.repeat.set( 0.01, 0.01 );
 			this.mWallTex.needsUpdate = true;		
			
		}
		

}