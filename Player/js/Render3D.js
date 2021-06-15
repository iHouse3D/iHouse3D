	var m_strWebService = localStorage.getItem('WebService');
	var m_strHttp = m_strWebService + 'ihouse/data/';	
	var m_strXML;

	var camera, scene, renderer, controls,mHouseClass,mResource,mAmbientLight,mLightPos;
	var objects = [];
	var raycaster,hemiLight;
	var mouse       = new THREE.Vector2(), INTERSECTED;
	var moveForward  = false;
	var moveBackward = false;
	var moveLeft 	 = false;
	var moveRight 	 = false;
	var canJump 	 = false;

	var prevTime = performance.now();
	var velocity = new THREE.Vector3();
	var direction = new THREE.Vector3();
	var vertex = new THREE.Vector3();
	var color = new THREE.Color();

	var bCollision = true;
	init();
	animate();

	var m_fSpeed = 1000;
	function init() {

		camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 50000 );
		camera.position.x = 0;
		camera.position.y = 160;
		camera.position.z = 0;
		scene = new THREE.Scene();
		//scene.background = new THREE.Color( 0x666666 );
		
		hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
		hemiLight.color.setHSL( 0.6, 1, 0.6 );
		hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
		hemiLight.position.set( 0, 50, 0 );
	//	scene.add( hemiLight );
				
		var vertexShader = document.getElementById( 'vertexShader' ).textContent;
		var fragmentShader = document.getElementById( 'fragmentShader' ).textContent;
				var uniforms = {
					"topColor": { value: new THREE.Color( 0x0077ff ) },
					"bottomColor": { value: new THREE.Color( 0xffffff ) },
					"offset": { value: 33 },
					"exponent": { value: 0.6 }
				};
				uniforms[ "topColor" ].value.copy( hemiLight.color );

		//		scene.fog.color.copy( uniforms[ "bottomColor" ].value );
				
		var skyGeo = new THREE.SphereBufferGeometry( 4000, 32, 15 );
				var skyMat = new THREE.ShaderMaterial( {
					uniforms: uniforms,
					vertexShader: vertexShader,
					fragmentShader: fragmentShader,
					side: THREE.BackSide
				} );

				var sky = new THREE.Mesh( skyGeo, skyMat );
				scene.add( sky );
				
				
		mAmbientLight = new THREE.AmbientLight(0xffffff);
		mAmbientLight.intensity = 0.65;
    	mAmbientLight.position.set(0, 0, 800); 								
    	scene.add(mAmbientLight);
    	
    	// 镜头光
 		mLightPos = new THREE.PointLight( 0xffffff, 1, 260 );	
		mLightPos.position.x = 0;
		mLightPos.position.y = 0;
		mLightPos.position.z = 0;
		scene.add( mLightPos );
	//	var tSphere 	  = new THREE.SphereBufferGeometry( 10, 8, 8 );
	//	this.mLightMesh   = new THREE.Mesh( tSphere, new THREE.MeshBasicMaterial( { color: 0xff0000 } ) )
	//	this.mLightMesh.position.set( 10, 150, -100 );
	//	scene.add( this.mLightMesh )
		
		
/* 		var rectLight = new THREE.RectAreaLight( 0xffffff, 10, 100,100 );	
		rectLight.position.set( 0, 270, 0 );
		rectLight.lookAt( 0, 0, 0 );
		rectLight.rotation.x = - Math.PI / 2;
		scene.add( rectLight );
		var redRectLightHelper = new THREE.RectAreaLightHelper( rectLight, 0xffffff );
		redRectLightHelper.position.set( 0, 270, 0 );
		redRectLightHelper.rotation.x = - Math.PI / 2;
		scene.add( redRectLightHelper );*/
		
		// 地面
		var groundGeo = new THREE.PlaneBufferGeometry( 50000, 50000 );
		var groundMat = new THREE.MeshLambertMaterial( { color: 0x555555 } );
		var ground = new THREE.Mesh( groundGeo, groundMat );
		ground.rotation.x = - Math.PI / 2;
		ground.position.y = -2;
		scene.add( ground );
		
    	
		controls = new THREE.PointerLockControls( camera );

		var blocker 	 = document.getElementById( 'blocker' );
		var instructions = document.getElementById( 'instructions' );

		instructions.addEventListener( 'click', function () {
			controls.lock();
		}, false );

		controls.addEventListener( 'lock', function () {
			instructions.style.display = 'none';
			blocker.style.display = 'none';
			moveForward  = false;
			moveLeft 	 = false;
			moveBackward = false;
			moveRight 	 = false;
			velocity.x   = 0;
			velocity.y   = 0;
			velocity.z   = 0;
		} );

		controls.addEventListener( 'unlock', function () {
			blocker.style.display = 'block';
			instructions.style.display = '';
		} );

		scene.add( controls.getObject() );
		
		var onKeyDown = function ( event ) {

			switch ( event.keyCode ) {
				case 38: // up
				case 87: // w
					moveForward = true;
 
		/*				if(velocity.y<=0)
						{
							if ( canJump === true )
								velocity.y += 300;	//向下跳
							canJump = false;
						}*/

					break;

				case 37: // left
				case 65: // a
					moveLeft = true;
					break;

				case 40: // down
				case 83: // s
					moveBackward = true;
					break;

				case 39: // right
				case 68: // d
					moveRight = true;
					break;

				case 32: // space
					if ( canJump === true ) 
					{
				/*		if(g_fFloor == 0) // 向上跳
							velocity.y += 1000;
						else*/		
							velocity.y += 350;	//向下跳
						g_fFloor = 0;
					}
					canJump = false;
					break;
			}
		};

		var onKeyUp = function ( event ) {
			
			switch ( event.keyCode ) {
				case 38: // up
				case 87: // w
					moveForward = false;
					break;
				case 37: // left
				case 65: // a
					moveLeft = false;
					break;
				case 40: // down
				case 83: // s
					moveBackward = false;
					break;
				case 39: // right
				case 68: // d
					moveRight = false;
					break;
				case 82: // 'R'
				{
					if( bCollision == false )
					{
				   		bCollision = true;
				   		$('#myText').html("漫游模式已打开,按R键切换");
				   		canJump = true;
				   	}
				   	else
				   	{
				   		bCollision = false;
				   		$('#myText').html("飞行模式已打开,,按R键切换");
				   	}
				}
				break;					
			}
		};

		document.addEventListener( 'keydown', onKeyDown, false );
		document.addEventListener( 'keyup', onKeyUp, false );
		
		mResource  = new Resource();
		mResource.OnInit();

		raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

		renderer = new THREE.WebGLRenderer( { antialias: true } );
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );
				
	//	document.body.appendChild( renderer.domElement );
		container.appendChild( renderer.domElement );
		window.addEventListener( 'resize', onWindowResize, false );
		window.addEventListener('mousemove', mouseMove,  false );
		m_strXML  = sessionStorage.getItem("ihouse_xml_vr");
		m_strHttp = sessionStorage.getItem("ihouse_http_vr");
		mHouseClass = new HouseClass();
		mHouseClass.OnLoadXML(m_strXML);

	//	scene.background = mResource.mBackground;
		// 毛坯房
		//====================================================================
	/*	mHouseClass.ChangeEmptyRoom();
		mHouseClass.ChangeEmptyRoom_Floor();
		mHouseClass.ChangeEmptyRoom_Ceiling();
		mHouseClass.OnCreateLight();*/	
		
		var gui = new dat.GUI( {  width: 280,autoPlace: false } );
		var customContainer = document.getElementById('myGui');
			customContainer.appendChild(gui.domElement);		

		gui.open();
		param = {'移动速度': 1500,
				 '视野': 60,
				 '环境光': 1,
				 '镜头光': 200};

		var lightFolder = gui.addFolder( '控制窗口' );
		lightFolder.add( param, '移动速度',500,2000 ).step( 10 ).onChange( function ( val ) {
			m_fSpeed = val;
		} );
		lightFolder.add( param, '视野', 45, 120 ).step( 1 ).onChange( function ( val ) {
			camera.fov = val;
			camera.updateProjectionMatrix();
		} );
		lightFolder.add( param, '环境光', 0.3, 3 ).step( 0.01 ).onChange( function ( val ) {
			mAmbientLight.intensity = val;
		} );
		lightFolder.add( param, '镜头光', 50, 500 ).step( 10 ).onChange( function ( val ) {
			mLightPos.distance  = val;
		} );
		lightFolder.open();			
	}
	
	function mouseMove(e)
	{ 
	//	event.preventDefault();
		mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( (e.clientY-0) / window.innerHeight ) * 2 + 1;
	}


	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
	}

	var g_fFloor = 0;
	var distance = 110;
	var direction1 = new THREE.Vector3();
	function animate() {

		requestAnimationFrame( animate );

		if ( controls.isLocked === true ) {

			// 向一个方向移动
//============================================================================================================
			camera.getWorldDirection( direction1 );
			this.mLightPos.position.set(camera.position.x,camera.position.y,camera.position.z );
			this.mLightPos.position.add( direction1.multiplyScalar(distance) );
//============================================================================================================

			raycaster.ray.origin.copy( controls.getObject().position );
			raycaster.ray.origin.y -= 10;

			var intersections = raycaster.intersectObjects( objects );

			var onObject = intersections.length > 0;	

			var time = performance.now();

			var delta = ( time - prevTime ) / m_fSpeed;

			
			velocity.x -= velocity.x * 10.0 * delta;
			velocity.z -= velocity.z * 10.0 * delta;
			velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
			
			direction.z = Number( moveForward ) - Number( moveBackward );
			direction.x = Number( moveLeft ) 	- Number( moveRight );
			direction.normalize();	
								
			if ( onObject == true && bCollision ==true) {
				
/*				if ( moveForward || moveBackward ) velocity.z += direction.z * 4000.0 * delta;
				if ( moveLeft || moveRight ) 	   velocity.x += direction.x * 4000.0 * delta;
				velocity.y = Math.max( 0, velocity.y );
				canJump = true;
				velocity.y -= 10;
				var fdist = 99999;
				var iIndex= 0;
				for( var i =0; i<intersections.length; i++ )
				{
					if(fdist>intersections[i].distance)
					{
						fdist = intersections[i].distance;
						iIndex=i;
					}
				}
				if(fdist < 500 && fdist> 100 )
				{
					controls.getObject().translateX( velocity.x * delta );
					controls.getObject().position.y += ( velocity.y * delta ); // new behavior
					controls.getObject().translateZ( velocity.z * delta );
					
					if ( controls.getObject().position.y < 160 ) {
						velocity.y = 0;
						controls.getObject().position.y = 160;
						canJump = true;
					}
					prevTime = time;
					renderer.render( scene, camera );
					return;
				}*/
					
				controls.getObject().translateX( velocity.x * delta );
				controls.getObject().position.y += ( velocity.y * delta ); // new behavior
				controls.getObject().translateZ( velocity.z * delta );
				
			//	g_fFloor = intersections[0].point.y;
			
				prevTime = time;
				renderer.render( scene, camera );
				return;		
			}
			else
			{
				if ( moveForward || moveBackward ) velocity.z -= direction.z * 4000.0 * delta;
				if ( moveLeft || moveRight ) 	   velocity.x -= direction.x * 4000.0 * delta;	
			}
			
			controls.getObject().translateX( velocity.x * delta );
			controls.getObject().translateZ( velocity.z * delta );
			if(bCollision == true)
			{
				controls.getObject().position.y += ( velocity.y * delta ); // new behavior					
			}

			if ( controls.getObject().position.y < g_fFloor+160 ) {
				velocity.y = 0;
				controls.getObject().position.y = g_fFloor+160;
				canJump = true;
			}
			/*else if ( controls.getObject().position.y < 160 )
			{
				velocity.y = 0;
				controls.getObject().position.y = 160;
				canJump = true;
			}*/

			prevTime = time;
		}

		renderer.render( scene, camera );
	}