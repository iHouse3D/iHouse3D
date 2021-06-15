
/**
 * @api CtrlObj2D
 * @apiGroup CtrlObj2D
 * @apiName  0
 * @apiDescription 2D物体操作控制器
 * @apiParam (成员变量) m_HelpBox 当前物体
 * @apiParam (成员变量) m_HelpBox1 2D下轮廓
 * @apiParam (成员变量) m_HelpBox2 3D下旋转显示用mesh
 * @apiParam (成员变量) m_HelpBox3 3D下旋转拾取用mesh
 * @apiParam (成员变量) m_HelpBox4 3D下显示箭头用mesh
 * @apiParam (成员变量) m_HelpBox5 3D下显示柱体用mesh
 * @apiParam (成员变量) m_HelpBox6 3D下拾取区域
 * @apiParam (成员变量) m_HelpBox7 3D下是否旋转
 * @apiParam (成员变量) m_HelpBox8 鼠标X位置
 * @apiParam (成员变量) m_LineLeft_Label 鼠标Y位置
 * @apiParam (成员变量) m_LineRight_Label 3D下是否升高
 * @apiParam (成员变量) m_LineTop_Label 通用系数
 */
function CtrlObj2D()
{
	this.m_HelpBox;
	this.m_HelpBox1;
	this.m_HelpBox2;
	this.m_HelpBox3;
	this.m_HelpBox4;
	this.m_HelpBox5;
	this.m_HelpBox6;
	this.m_HelpBox7;
	this.m_HelpBox8;	
	
	this.m_LineLeft_Label;
	this.m_LineRight_Label;
	this.m_LineTop_Label;
	this.m_LineBottom_Label;
	this.m_LineLeft_Box;
	this.m_LineTop_Box;
	this.m_LineRight_Box;
	this.m_LineBottom_Box;
	
	this.m_LineLeft_Box1;
	this.m_LineTop_Box1;
	this.m_LineRight_Box1;
	this.m_LineBottom_Box1;
	
	this.m_LineLeft;
	this.m_LineRight;
	this.m_LineTop;
	this.m_LineBottom;
	this.m_iSelected = 0;
	this.g_GaiLiQiangJuLi;
	this.m_strLeft_Value;
	this.m_strRight_Value;
	this.m_strTop_Value;
	this.m_strBottom_Value;
	this.m_fLeftOld;
	this.m_fRightOld;
	this.m_fTopOld;
	this.m_fBottomOld;	

	/**
	 * @api OnInit()
	 * @apiGroup CtrlObj2D
	 * @apiDescription 2D物体操作控制器
	 */
	this.OnInit = function()
	{
		// 2D操作区域
		var result_poly = new THREE.Geometry();					
		result_poly.vertices.push(new THREE.Vector3(-0.5, -0.5, 1), new THREE.Vector3(-0.5, 0.5, 1));				
		result_poly.vertices.push(new THREE.Vector3( 0.5,  0.5, 1), new THREE.Vector3( 0.5,-0.5, 1));	
		this.m_HelpBox = new THREE.LineSegments( result_poly, new THREE.LineBasicMaterial( { color: 0x00A2E8, linewidth:15, opacity: 1 } ) );
		scene.add(this.m_HelpBox);
		
		var geometry1 = new THREE.Geometry();
		geometry1.vertices.push( new THREE.Vector3( 0,0, 1 ), new THREE.Vector3( 0,0, 1 ));
		var geometry2 = new THREE.Geometry();
		geometry2.vertices.push( new THREE.Vector3( 0,0, 1 ), new THREE.Vector3( 0,0, 1 ));
		var geometry3 = new THREE.Geometry();
		geometry3.vertices.push( new THREE.Vector3( 0,0, 1 ), new THREE.Vector3( 0,0, 1 ));
		var geometry4 = new THREE.Geometry();
		geometry4.vertices.push( new THREE.Vector3( 0,0, 1 ), new THREE.Vector3( 0,0, 1 ));	
		this.m_LineLeft 	= new THREE.LineSegments( geometry1, new THREE.LineBasicMaterial( { color: 0xAAAAAA, opacity: 1, linewidth:0.5 } ) );
		this.m_LineRight	= new THREE.LineSegments( geometry2, new THREE.LineBasicMaterial( { color: 0xAAAAAA, opacity: 1, linewidth:0.5 } ) );
		this.m_LineTop  	= new THREE.LineSegments( geometry3, new THREE.LineBasicMaterial( { color: 0xAAAAAA, opacity: 1, linewidth:0.5 } ) );
		this.m_LineBottom 	= new THREE.LineSegments( geometry4, new THREE.LineBasicMaterial( { color: 0xAAAAAA, opacity: 1, linewidth:0.5 } ) );
				
		scene.add(this.m_LineLeft);
		scene.add(this.m_LineRight);
		scene.add(this.m_LineTop);
		scene.add(this.m_LineBottom);			
		this.OnHideCtrl();	// 隐藏操控			
	}
	
	/**
	 * @api OnHideCtrl()
	 * @apiGroup CtrlObj2D
	 * @apiDescription 隐藏物体操作控制器
	 */	
	this.OnHideCtrl = function()
	{
		this.m_HelpBox.position.x  = -99999;			
		this.m_HelpBox.position.y  = -99999;	
		
		this.m_LineLeft.visible   = false;
		this.m_LineRight.visible  = false;
		this.m_LineTop.visible 	  = false;
		this.m_LineBottom.visible = false;
	};

	/**
	 * @api OnShowHelpBox(bShow)
	 * @apiGroup CtrlObj2D
	 * @apiDescription 隐藏物体操作控制器
	 */
	this.OnShowHelpBox  = function(bShow)
	{
		this.mHelpBox.visible = bShow;
	};	
}