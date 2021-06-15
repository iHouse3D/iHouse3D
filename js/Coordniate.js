/**
 * @api Coordniate
 * @apiGroup Coordniate
 * @apiName  0
 * @apiDescription 2D,3D背景网格类
 * @apiParam (成员变量) m_bShow 是否显示网格
 * @apiParam (成员变量) m_cCoord 2D背景网格
 * @apiParam (成员变量) m_cCoord1 2D背景十字线
 * @apiParam (成员变量) m_cCoord3D 3D背景网格
 * @apiParam (成员变量) m_cCoord3D1 3D背景十字线
 * @apiParam (成员变量) m_cBigBox 鼠标操作相应界面
 */
function Coordniate()
{
		this.m_bShow    = false;
		this.m_cCoord;
		this.m_cCoord1;
		this.m_cCoord3D;
		this.m_cCoord3D1;
		this.m_cBigBox;
		this.bMoveCoord = false;
		this.m_iMouseX_Old;
		this.m_iMouseY_Old;
		this.objects = new Array();
		
		this.timer1 = null;		// 计时器
		this.iType = 0;
		this.iLayer= -2;
	
		/**
		 * @api OnInit()
		 * @apiDescription 初始化网格背景
		 * @apiGroup Coordniate
		 */			
		this.OnInit= function () 
		{
			this.CreateLine();
			this.CreateLine3D();
			this.CreateBigBox();
			this.CreateBigBox3D();
			this.m_bShow  = true;
		};
		
		/**
		 * @api CreateLine()
		 * @apiDescription 创建二维平面背景网格
		 * @apiGroup Coordniate
		 * 
		 */		
		this.CreateLine = function()
		{
			var geometry = new THREE.Geometry();
			for(var i=-8000; i<= 8000; i+=100)
			{
				geometry.vertices.push( new THREE.Vector3( -8000, i, this.iLayer ), new THREE.Vector3( 8000, i, this.iLayer ));
				geometry.vertices.push( new THREE.Vector3( i,-8000, this.iLayer ), new THREE.Vector3( i, 8000, this.iLayer ));
			}	
			this.m_cCoord = new THREE.LineSegments( geometry, new THREE.LineBasicMaterial( { color: 0xfbfbfb, opacity: 1 } ) );//			
			scene.add( this.m_cCoord );
			
			var geometry_2 = new THREE.Geometry();
			
			for(var j =-8000; j< 8000; j+=500 )
			{
				geometry_2.vertices.push( new THREE.Vector3( -8000, j, this.iLayer+1 ), new THREE.Vector3( 8000, j, this.iLayer+1 ));
				geometry_2.vertices.push( new THREE.Vector3( j,-8000, this.iLayer+1 ), new THREE.Vector3( j, 8000, this.iLayer+1 ));
			}		
			this.m_cCoord1 = new THREE.LineSegments( geometry_2, new THREE.LineBasicMaterial( { color: 0xffffff, opacity: 1 } ) );			
			scene.add( this.m_cCoord1 );			
		};
		
		/**
		 * @api CreateLine3D()
		 * @apiDescription 创建三维平面背景网格
		 * @apiGroup Coordniate
		 * 
		 */			
		this.CreateLine3D = function()
		{
			var geometry = new THREE.Geometry();
			for (i=-8000; i<= 8000; i+=100)
			{
				geometry.vertices.push( new THREE.Vector3( -8000,-5.5, i ), new THREE.Vector3( 8000,-5.5, i ));
				geometry.vertices.push( new THREE.Vector3( i,-5.5,-8000 ), new THREE.Vector3( i,-5.5, 8000));
			}	
			this.m_cCoord3D = new THREE.LineSegments( geometry, new THREE.LineBasicMaterial( { color: 0xDDDDDD, opacity: 1 } ) );//			
			
			var geometry_2 = new THREE.Geometry();			
			for( j =-8000; j< 8000; j+=500 )
			{
				geometry_2.vertices.push( new THREE.Vector3( -8000, -5, j ), new THREE.Vector3( 8000, -5, j ));
				geometry_2.vertices.push( new THREE.Vector3( j, -5, -8000 ), new THREE.Vector3( j, -5, 8000 ));
			}		
			this.m_cCoord3D1 = new THREE.LineSegments( geometry_2, new THREE.LineBasicMaterial( { color: 0xCCCCCC, opacity: 1 } ) );			
		
			scene3D.add( this.m_cCoord3D );
			scene3D.add( this.m_cCoord3D1 );	
		};		
		
		this.ChangeCoordTop = function()
		{
			if(app.header.showLable.check_CoordTop == false)
			{
				this.m_cCoord.position.z =10;
			}
			else
			{				
				this.m_cCoord.position.z =0;
			}
		};
		
		this.OnShow = function(bShow)
		{
			this.m_cCoord.visible 	= bShow;
			this.m_cCoord1.visible	= bShow;
			this.m_cCoord3D.visible	= bShow;
			this.m_cCoord3D1.visible= bShow;
		//	this.m_cBigBox.visible= bShow;
		};
		
		this.CreateBigBox = function()
		{
			var geometry  = new THREE.BoxBufferGeometry( 160000, 160000, this.iLayer-3);
		  	this.m_cBigBox= new THREE.Mesh(geometry, new THREE.MeshBasicMaterial( { color: 0xE8E8E8, opacity: 0, transparent: true } ) ); 
			this.m_cBigBox.name = 'pick';	
			this.objects.push( this.m_cBigBox );	
			scene.add( this.m_cBigBox );	
		};
		
		this.CreateBigBox3D= function()
		{
			var geometry  = new THREE.BoxBufferGeometry( 160000, -5, 160000);
		  	this.m_cBigBox3D= new THREE.Mesh(geometry, new THREE.MeshBasicMaterial( { color: 0xE8E8E8, opacity: 0, transparent: true } ) ); 
			this.m_cBigBox3D.name = 'pick';	
			scene3D.add( this.m_cBigBox3D );			
		};
		

		
		this.mousewheel= function(e)
		{
            e.preventDefault();
            if (e.wheelDelta) {  
                if (e.wheelDelta > 0) { 
                    mCameraClass.m_Camera.position.z -= app.GlobalSettings.num_1.int;
                    
                    if(mCameraClass.m_Camera.position.z<0)
                    	mCameraClass.m_Camera.position.z = 1;
                }
                if (e.wheelDelta < 0) { 
                    mCameraClass.m_Camera.position.z += app.GlobalSettings.num_1.int;
                }
            } else if (e.detail) {  
                if (e.detail > 0) { 
                    mCameraClass.m_Camera.position.z -= app.GlobalSettings.num_1.int;
                    if(mCameraClass.m_Camera.position.z<0)
                    	mCameraClass.m_Camera.position.z = 1;                    
                }
                if (e.detail < 0) { 
                    mCameraClass.m_Camera.position.z += app.GlobalSettings.num_1.int;
                }
            }
            app.sliderSize.sliderSizeValue = mCameraClass.m_Camera.position.z;
            mCameraClass.m_Camera.updateProjectionMatrix();
            renderer.render(scene, mCameraClass.m_Camera);
		};
			
		this.ZoomIn	= function(fVal)
		{
			// 2D
			if( IsContain(container, renderer2.domElement ) != true )
			{
	            if (fVal > 0) { 
	                mCameraClass.m_Camera.position.z -= app.GlobalSettings.num_1.int;
	            }
	            if (fVal < 0) { 
	                mCameraClass.m_Camera.position.z += app.GlobalSettings.num_1.int;
	            }
	  
	            app.sliderSize.sliderSizeValue = mCameraClass.m_Camera.position.z;
	            mCameraClass.m_Camera.updateProjectionMatrix();
	            renderer.render(scene, mCameraClass.m_Camera);   
            }
			
			// 3D
			if( IsContain(container, renderer2.domElement ) != false )
				mCameraClass.m_Control3D.onMouseWheel(fVal);    
		};
		
		
		this.mouseMove= function(e)
		{ 
			if( this.bMoveCoord == true )
			{
				$('#container' ).css("cursor","pointer");
				if(mCameraClass.m_Camera.position.z <2000){
			 		mCameraClass.m_Camera.position.x+=  (this.m_iMouseX_Old - e.clientX);
			 		mCameraClass.m_Camera.position.y+= -(this.m_iMouseY_Old - e.clientY);
			 	}
				else if(mCameraClass.m_Camera.position.z >=2000 && mCameraClass.m_Camera.position.z <3000){
					mCameraClass.m_Camera.position.x+=  (this.m_iMouseX_Old - e.clientX)*3;
			 		mCameraClass.m_Camera.position.y+= -(this.m_iMouseY_Old - e.clientY)*3;
				}
				else if(mCameraClass.m_Camera.position.z >=3000){
					mCameraClass.m_Camera.position.x+=  (this.m_iMouseX_Old - e.clientX)*5;
			 		mCameraClass.m_Camera.position.y+= -(this.m_iMouseY_Old - e.clientY)*5;
				}
				
			 	// 微微移动触发mouseUp
        		if( Math.abs(this.m_iMouseX_Old - e.clientX)>2 ||
        			Math.abs(this.m_iMouseY_Old - e.clientY)>2 )
        			bMouseUp2D = true;
        			
        		this.m_iMouseX_Old = e.clientX;
        		this.m_iMouseY_Old = e.clientY;
			}
		};	
		
		this.OnMoveCoord = function(iType){
		  if( m_cPenType != 1)
		  	return;
		  this.iType  = iType;
          this.timer1 = window.setInterval(function(){
          		     if(m_Coordniate.iType == 3)
                     	mCameraClass.m_Camera.position.x-=20;
          		     if(m_Coordniate.iType == 1)
                     	mCameraClass.m_Camera.position.x+=20;
           		     if(m_Coordniate.iType == 0)
                     	mCameraClass.m_Camera.position.y+=20;
          		     if(m_Coordniate.iType == 2)
                     	mCameraClass.m_Camera.position.y-=20;                    
                 },30);
		};
		
		this.OnMoveStop = function(){
			window.clearInterval(this.timer1);
		};
}