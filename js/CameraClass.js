function CameraClass()
{
		this.m_Camera;
		this.m_Camera3D;
		this.m_Control3D;
		
		//=======================================================
		this.moveForward 	= false;
		this.moveBackward 	= false;
		this.moveLeft 		= false;
		this.moveRight 		= false;
		this.canJump 		= false;
		this.prevTime = performance.now();
		this.velocity 		= new THREE.Vector3();
		this.direction 		= new THREE.Vector3();
		this.vertex 		= new THREE.Vector3();		
		//=======================================================
		this.WIDTH   = window.innerWidth;
		this.HEIGHT  = window.innerHeight;
		this.OnInit = function()
		{		
				// 2D视角 
				this.m_Camera = new THREE.PerspectiveCamera( 70, this.WIDTH / this.HEIGHT, 1, 50000 );
				this.m_Camera.position.x = 0;
				this.m_Camera.position.y = 0;
				this.m_Camera.position.z = 600;
				
				this.m_Camera3D = new THREE.PerspectiveCamera( 70, this.WIDTH / this.HEIGHT, 1, 50000 );
				this.m_Camera3D.position.x = 0;
				this.m_Camera3D.position.y = 400;
				this.m_Camera3D.position.z = 820;	
								
			//	this.m_Control3D 			  = new THREE.EditorControls( this.m_Camera3D, renderer2.domElement );
			//	this.m_Control3D 			  = new THREE.EditorControls( this.m_Camera3D, labelRenderer.domElement );
				this.m_Control3D 			  = new THREE.OrbitControls( this.m_Camera3D, labelRenderer.domElement );

				this.m_Control3D.enabled 	  = true;
			//	this.m_Control3D.rotateSpeed  = 2.0;
				this.m_Control3D.maxPolarAngle = Math.PI / 2;
				this.m_Control3D.center.x = 0;
				this.m_Control3D.center.y = 160;
				this.m_Control3D.center.z = 0;

				document.addEventListener( 'keydown', this.onKeyDown, false );
				document.addEventListener( 'keyup', this.onKeyUp, false );
				
		};
		// 设置2D 高度
		this.setCamera2D_z = function(fValue)
		{
			this.m_Camera.position.z = fValue;
            this.m_Camera.updateProjectionMatrix();
            renderer.render(scene, this.m_Camera);
		};
		
		this.OnClear = function()
		{
			this.m_Camera.position.x = 0;
			this.m_Camera.position.y = 0;
			this.m_Camera.position.z = 600;	
			this.m_Camera.rotation.x = 0;
			this.m_Camera.rotation.y = 0;
			this.m_Camera.rotation.z = 0;
			
			this.m_Camera3D.position.x = 0;
			this.m_Camera3D.position.y = 200;
			this.m_Camera3D.position.z = 820;	
			this.m_Camera3D.rotation.x = 0;
			this.m_Camera3D.rotation.y = 0;
			this.m_Camera3D.rotation.z = 0;	
							
		};
		
		this.onKeyDown = function ( evt ) 
		{
			 e   = window.event || evt;
			switch ( e.keyCode ) {
				case 38: // up
				case 87: // w
					mCameraClass.moveForward = true;
					break;
				case 37: // left
				case 65: // a
					mCameraClass.moveLeft = true;
					break;
				case 40: // down
				case 83: // s
					mCameraClass.moveBackward = true;
					break;
				case 39: // right
				case 68: // d
					mCameraClass.moveRight = true;
					break;
				case 32: // space
					if ( mCameraClass.canJump === true ) mCameraClass.velocity.y += 400;
					mCameraClass.canJump = false;
					break;
			}
		};
		
		this.onKeyUp = function ( evt ) 
		{
			 e   = window.event || evt;
			switch ( e.keyCode ) {
				case 38: // up
				case 87: // w
					mCameraClass.moveForward = false;
					break;
				case 37: // left
				case 65: // a
					mCameraClass.moveLeft = false;
					break;
				case 40: // down
				case 83: // s
					mCameraClass.moveBackward = false;
					break;
				case 39: // right
				case 68: // d
					mCameraClass.moveRight = false;
					break;
			}
		};
				
}