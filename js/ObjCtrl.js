
/**
 * @api ObjCtrl
 * @apiGroup ObjCtrl
 * @apiName  0
 * @apiDescription 物体操作辅助工具
 * @apiParam (成员变量) m_curObj 当前物体
 * @apiParam (成员变量) m_Outline 2D下轮廓
 * @apiParam (成员变量) mRingGeometry 3D下旋转显示用mesh
 * @apiParam (成员变量) mRingGeometry_Pick 3D下旋转拾取用mesh
 * @apiParam (成员变量) mArrowGeometry 3D下显示箭头用mesh
 * @apiParam (成员变量) mCylinderGeometry 3D下显示柱体用mesh
 * @apiParam (成员变量) mPickGeometry 3D下拾取区域
 * @apiParam (成员变量) g_bObjRotate 3D下是否旋转
 * @apiParam (成员变量) mCurMouseX 鼠标X位置
 * @apiParam (成员变量) mCurMouseY 鼠标Y位置
 * @apiParam (成员变量) g_bObjRaise 3D下是否升高
 * @apiParam (成员变量) m_fValue 通用系数
 */
function ObjCtrl()
{
	this.m_curObj  			= null;
	
	//2D
	this.m_Outline;	// 轮廓
	
	//3D
	this.mRingGeometry  	= null;	  // 旋转操作
	this.mRingGeometry_Pick = null;	  // 旋转拾取
	this.mArrowGeometry 	= null;	  // 箭头
	this.mCylinderGeometry	= null;   // 向上柱子
	this.mPickGeometry		= null;	  // 拾取区域
	this.g_bObjRotate 		= false;  // 旋转
	this.g_bObjRaise  		= false;  // 升高	
	this.mCurMouseX = 0;
	this.mCurMouseY = 0;
	this.m_fValue   = -0.5;
	
	/**
	 * @api OnInit()
	 * @apiGroup ObjCtrl
	 * @apiDescription 初始化物体操作辅助工具
	 */
	this.OnInit = function()
	{
		var mGeometry = new THREE.Geometry();
		mGeometry.vertices.push( new THREE.Vector3(-0.5,  0.5+this.m_fValue, 0), 
								 new THREE.Vector3( 0.5,  0.5+this.m_fValue, 0),
								 new THREE.Vector3( 0.5,  0.5+this.m_fValue, 0),
								 new THREE.Vector3( 0.5, -0.5+this.m_fValue, 0),
								 new THREE.Vector3( 0.5, -0.5+this.m_fValue, 0),
								 new THREE.Vector3(-0.5, -0.5+this.m_fValue, 0),
								 new THREE.Vector3(-0.5, -0.5+this.m_fValue, 0),
								 new THREE.Vector3(-0.5,  0.5+this.m_fValue, 0));	// 移动杆
							
	  	this.m_Outline = new THREE.LineSegments( mGeometry, new THREE.LineBasicMaterial( { color:'#31B6F8', linewidth:2, opacity: 1 } ) );
		this.m_Outline.computeLineDistances();
		scene.add( this.m_Outline );		
	};
	
	/**
	 * @api Hide()
	 * @apiGroup ObjCtrl
	 * @apiName  0
	 * @apiDescription 隐藏物体操作辅助工具
	 * 
	 */	
	this.Hide =function()
	{
		this.m_curObj   = null;
		this.mCurMouseX = 0;
		this.mCurMouseY = 0;
		this.Hide2D();
		this.Hide3D();
	};
	/**
	 * @api OnClear()
	 * @apiGroup ObjCtrl
	 * @apiName  0
	 * @apiDescription 清楚物体操作内容
	 * 
	 */		
	this.OnClear = function()
	{
		this.Hide();
		if(this.m_curObj)
		this.m_curObj   = null;
	};
	/**
	 * @api Hide2D()
	 * @apiGroup ObjCtrl
	 * @apiName  0
	 * @apiDescription 2D下隐藏物体操作类
	 * 
	 */		
	this.Hide2D = function()
	{
		this.m_Outline.visible = false;
	};
	/**
	 * @api Hide3D()
	 * @apiGroup ObjCtrl
	 * @apiName  0
	 * @apiDescription 3D下隐藏物体操作类
	 * 
	 */	
	this.Hide3D = function()
	{
		scene3D.remove(this.mRingGeometry);
		scene3D.remove(this.mRingGeometry_Pick);
		scene3D.remove(this.mArrowGeometry);
		scene3D.remove(this.mCylinderGeometry);	
		scene3D.remove(this.mPickGeometry);
		this.mRingGeometry 		= null;
		this.mRingGeometry_Pick = null;
		this.mArrowGeometry		= null;
		this.mCylinderGeometry	= null;
		this.mPickGeometry		= null;
		   
		this.g_bObjRotate = false;	// 旋转
		this.g_bObjRaise  = false;  // 升高   		
	};
	/**
	 * @api Show(tObject)
	 * @apiGroup ObjCtrl
	 * @apiName  0
	 * @apiDescription 在选中的物体上显示物体操作辅助工具
	 * @apiParam (参数) tObject 选中的物体
	 */	
	this.Show = function( tObject )
	{
		if( tObject == null )
			return;
			
		this.Hide();
		this.m_curObj = tObject;
		
		this.Show2D();
	//	this.Show3D();
		this.mCurMouseX = g_mouseX;
		this.mCurMouseY = g_mouseY;	
		this.OnUpdate();
	}
	/**
	 * @api Show2D()
	 * @apiGroup ObjCtrl
	 * @apiName  0
	 * @apiDescription 2D显示物体操作辅助工具
	 * 
	 */		
	this.Show2D = function()
	{
		this.m_Outline.visible = true;
	}
	/**
	 * @api Show3D()
	 * @apiGroup ObjCtrl
	 * @apiName  0
	 * @apiDescription 3D显示物体操作辅助工具
	 * 
	 */	
	this.Show3D = function()
	{
		var fL = parseInt(this.m_curObj.m_fLength);
		if(parseInt(this.m_curObj.m_fLength)<parseInt(this.m_curObj.m_fWidth))
			fL = parseInt(this.m_curObj.m_fWidth);
			
		// 旋转圈显示	
		var tGeometry = new THREE.RingGeometry( fL/20+20, fL/20+35, 64 );
		var tMaterial = new THREE.MeshBasicMaterial( { color: 0x00A8ff, opacity: 0.4, transparent: true,  side: THREE.DoubleSide } );
		this.mRingGeometry = new THREE.Mesh( tGeometry, tMaterial );			
		this.mRingGeometry.position.x = this.m_curObj.mBoxHelper.position.x;
		this.mRingGeometry.position.y = this.m_curObj.mBoxHelper.position.y+10;
		this.mRingGeometry.position.z = this.m_curObj.mBoxHelper.position.z;
		this.mRingGeometry.rotation.x = -Math.PI/2;
		scene3D.add(this.mRingGeometry);
		
		var tGeometry2 = new THREE.RingGeometry( fL/20+20-10, fL/20+35+10, 64 );
		var tMaterial2 = new THREE.MeshBasicMaterial( { color: 0x0000ff, opacity: 0.0, transparent: true,  side: THREE.DoubleSide } );
		this.mRingGeometry_Pick = new THREE.Mesh( tGeometry2, tMaterial2 );			
		this.mRingGeometry_Pick.position.x = this.m_curObj.mBoxHelper.position.x;
		this.mRingGeometry_Pick.position.y = this.m_curObj.mBoxHelper.position.y+10;
		this.mRingGeometry_Pick.position.z = this.m_curObj.mBoxHelper.position.z;
		this.mRingGeometry_Pick.rotation.x = -Math.PI/2;
		scene3D.add(this.mRingGeometry_Pick);			
		
		var geometry3 = new THREE.ConeGeometry( 8, 25  );
		var tMaterial1= new THREE.MeshBasicMaterial( { color: 0x00ff00, opacity: 0.5, transparent: true,depthTest:false } )
		this.mArrowGeometry = new THREE.Mesh(geometry3, tMaterial1 ); 	
		this.mArrowGeometry.position.x = this.m_curObj.mBoxHelper.position.x;
		this.mArrowGeometry.position.y = this.m_curObj.mBoxHelper.position.y+80;
		this.mArrowGeometry.position.z = this.m_curObj.mBoxHelper.position.z;
	//	this.mArrowGeometry.rotation.x = -Math.PI/2;
		scene3D.add( this.mArrowGeometry );
		
		var geometry4 = new THREE.CylinderGeometry( 2, 2, 80, 32 );
		this.mCylinderGeometry = new THREE.Mesh(geometry4, tMaterial1 );
		this.mCylinderGeometry.position.x = this.m_curObj.mBoxHelper.position.x;
		this.mCylinderGeometry.position.y = this.m_curObj.mBoxHelper.position.y+40;
		this.mCylinderGeometry.position.z = this.m_curObj.mBoxHelper.position.z;		
		scene3D.add( this.mCylinderGeometry );
		
		var geometry5 = new THREE.CylinderGeometry( 8, 8, 200, 32 );
		this.mPickGeometry = new THREE.Mesh(geometry5, new THREE.MeshBasicMaterial( { color: 0x00ffff, opacity: 0.0, transparent: true,depthTest:false } ));
		this.mPickGeometry.position.x = this.m_curObj.mBoxHelper.position.x;
		this.mPickGeometry.position.y = this.m_curObj.mBoxHelper.position.y+40;
		this.mPickGeometry.position.z = this.m_curObj.mBoxHelper.position.z;		
		scene3D.add( this.mPickGeometry );		
		
		this.m_curObj.OnShowGroup(1);
	}	
	/**
	 * @api OnUpdate()
	 * @apiGroup ObjCtrl
	 * @apiName  0
	 * @apiDescription 更新物体操作辅助工具
	 * 
	 */
	this.OnUpdate = function()
	{
		if( this.m_curObj == null )
			return;
			
		this.OnUpdate2D();
		this.OnUpdate3D();
	}
	
	this.OnUpdate2D = function()
	{
		this.m_Outline.scale.set(this.m_curObj.m_fLength,this.m_curObj.m_fWidth,1);
		this.m_Outline.rotation.z = this.m_curObj.m_Group2D.rotation.z;
		this.m_Outline.position.x = this.m_curObj.m_Group2D.position.x;			
		this.m_Outline.position.y = this.m_curObj.m_Group2D.position.y;
		this.m_Outline.position.z = 0;		
	}
	
	this.OnUpdate3D = function()
	{
		//this.m_curObj.m_Group3D.rotation.y = this.m_curObj.m_Group2D.rotation.z;
	}
	
	// 2D下移动物体
	this.OnMouseMove2D = function(mouseX,mouseY,e)
	{
		if(e.buttons == 1 && this.m_curObj != null)
		{
			if( this.m_curObj .m_Locking == true)	// 锁定无法移动
			return;

			if( this.m_curObj.m_Group3D )
			{
				this.m_curObj.m_Group3D.position.x +=  mouseX-this.mCurMouseX;
				this.m_curObj.m_Group3D.position.z += -mouseY+this.mCurMouseY;
			}
			this.m_curObj.m_Group2D.position.x += mouseX-this.mCurMouseX;
			this.m_curObj.m_Group2D.position.y += mouseY-this.mCurMouseY;	
			this.mCurMouseX = mouseX;
			this.mCurMouseY = mouseY;
			
			this.OnUpdate();
			
			bMouseUp2D = true;
		}
	}	
	
	this.OnMove3D = function(mouseX,mouseY,buttonDown)
	{
		if( buttonDown != 1 || this.m_curObj == null)
			return false;	
			
		if( this.m_curObj.m_Locking == true)	// 锁定无法移动
			return false;	
			
		//2D移动时的模型
		if( this.m_curObj.m_Group3D )
		{
			this.m_curObj.m_Group3D.position.x +=  mouseX;
			this.m_curObj.m_Group3D.position.z +=  mouseY;			
		}
		this.m_curObj.m_Group2D.position.x += mouseX;
		this.m_curObj.m_Group2D.position.y += mouseY;	
		
		return true;
/*		if(this.mRingGeometry)
		{
			this.mRingGeometry.position.x = tFurniture.mBoxHelper.position.x;
			this.mRingGeometry.position.z = tFurniture.mBoxHelper.position.z;
		}
		
		if(this.mRingGeometry_Pick)
		{
			this.mRingGeometry_Pick.position.x = tFurniture.mBoxHelper.position.x;
			this.mRingGeometry_Pick.position.z = tFurniture.mBoxHelper.position.z;
		}			
		
		if(this.mArrowGeometry)
		{
			this.mArrowGeometry.position.x = tFurniture.mBoxHelper.position.x;
			this.mArrowGeometry.position.z = tFurniture.mBoxHelper.position.z;				
		}
		
		if(this.mCylinderGeometry)
		{
			this.mCylinderGeometry.position.x = tFurniture.mBoxHelper.position.x;
			this.mCylinderGeometry.position.z = tFurniture.mBoxHelper.position.z;
			
			this.mPickGeometry.position.x = tFurniture.mBoxHelper.position.x;
			this.mPickGeometry.position.z = tFurniture.mBoxHelper.position.z;
		}*/
	}		
}