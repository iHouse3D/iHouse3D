/**
 * @api CeLiangClass
 * @apiGroup CeLiangClass
 * @apiName  0
 * @apiDescription 平面测量类
 * @apiParam (成员变量) mArray 测量线段数组
 * @apiParam (成员变量) m_pCurCeLiang 当前操作的测量线段
 */
function CeLiangClass()
{	
	// 平面上测量距离
	this.mArray = new Array();
	this.m_pCurCeLiang;

	this.OnInit= function ()
	{		
	};
		
	/**
	 * @api OnClear()
	 * @apiGroup CeLiangClass
	 * @apiDescription 清除所有测量线段组
	 */		
	this.OnClear = function()
	{	
		// 清空
		for( var i =0; i< this.mArray.length; i++ )
			this.mArray[i].OnClear();

		this.mArray.length = 0;
		this.m_pCurCeLiang = null;
		
	};
	
	/**
	 * @api OnBuildCeLiang(mouseX,mouseY)
	 * @apiGroup CeLiangClass
	 * @apiDescription 创建新测量线段
	 * @apiParam (参数) mouseX 鼠标X坐标
	 * @apiParam (参数) mouseY 鼠标Y坐标
	 */	
	this.OnBuildCeLiang = function(mouseX,mouseY)
	{	
		this.mMouseX = mouseX;
		this.mMouseY = mouseY;			
		this.m_pCurCeLiang  = new CeLiangData();	
		this.m_pCurCeLiang.OnInit(mouseX,mouseY);
	};	
	
	/**
	 * @api OnMouseDown(mouseX,mouseY)
	 * @apiGroup CeLiangClass
	 * @apiDescription 鼠标左键创建新测量线段
	 * @apiParam (参数) mouseX 鼠标X坐标
	 * @apiParam (参数) mouseY 鼠标Y坐标	 
	 */	
	this.OnMouseDown = function(mouseX,mouseY)
	{	
		//创建标尺
		if( this.m_pCurCeLiang == null ){
			this.OnBuildCeLiang(mouseX,mouseY);
		}
		else
		{	
		//	this.CheckWallPos();
			var d = this.m_pCurCeLiang.m_vStart.distanceTo(this.m_pCurCeLiang.m_vEnd);	// 两个点距离太近 ，不创建墙体
			if( d < 2 )	
				return;
			
			this.mArray.push(this.m_pCurCeLiang);						
			this.m_pCurCeLiang = null;
		}		
	};
	
	/**
	 * @api OnMouseRightUp2D()
	 * @apiGroup CeLiangClass
	 * @apiDescription 鼠标右键停止测量相关操作	 
	 */	
	this.OnMouseRightUp2D= function()
	{ // 鼠标右键释放
		if(this.m_pCurCeLiang)
		{ 
			if( this.mArray.indexOf(this.m_pCurCeLiang) == -1)
				this.OnDelete(this.m_pCurCeLiang);		
			this.m_pCurCeLiang = null;		
		}	
		for(var k= 0; k<this.mArray.length; k++)
			this.mArray[k].GaiYanSe(0x00000);		
	};	
	
	/**
	 * @api OnMouseMove(mouseX,mouseY,buttonDown)
	 * @apiGroup CeLiangClass
	 * @apiDescription 鼠标左键创建新测量线段的移动操作
	 * @apiParam (参数) mouseX 鼠标X坐标
	 * @apiParam (参数) mouseY 鼠标Y坐标	
	 * @apiParam (参数) buttonDown 鼠标按键信息	 
	 */		
	this.OnMouseMove= function(mouseX,mouseY,buttonDown)
	{
		// 移动鼠标
		if( this.m_pCurCeLiang )
		{		
			this.m_pCurCeLiang.m_vEnd.x   =  mouseX;  
			this.m_pCurCeLiang.m_vEnd.y   =  mouseY; 
			
			mMathClass.RotateVecFromAxis( this.m_pCurCeLiang.m_vEnd, this.m_pCurCeLiang.m_vStart, 5);
			this.m_pCurCeLiang.m_vEnd.x =  mMathClass.mRetVec.x;  
			this.m_pCurCeLiang.m_vEnd.y =  mMathClass.mRetVec.y;	

			this.m_pCurCeLiang.OnUpdateLabel();			// 绘制临时墙体
			this.mMouseX = this.m_pCurCeLiang.m_vEnd.x;
			this.mMouseY = this.m_pCurCeLiang.m_vEnd.y;
		}
		else		
		{
			this.mMouseX = mouseX;
			this.mMouseY = mouseY;				
/*			var ab1 = this.CheckPosOnLine(mouseX,mouseY);			
			if( ab1[0] !=0 )
			{
				this.mMouseX = ab1[1];
				this.mMouseY = ab1[2];								
			}*/	
		}
	};

	/**
	 * @api OnKeyDown(iKey)
	 * @apiGroup CeLiangClass
	 * @apiDescription 键盘操作函数
	 * @apiParam (参数) iKey 键盘值 
	 */	
	this.OnKeyDown = function(iKey)
	{
		if(this.m_pCurCeLiang== null)
			return false;
		
		if(iKey == 46)
		{
		   this.OnDelete(this.m_pCurCeLiang);
		   this.m_pCurCeLiang = null;
		}	
		return true;
	};
	
	/**
	 * @api OnDelete(tCeLiang)
	 * @apiGroup CeLiangClass
	 * @apiDescription 删除指定的测量线段
	 * @apiParam (参数) tCeLiang 指定的测量线段
	 */		
	this.OnDelete = function(tCeLiang)
	{			
		tCeLiang.OnClear();
		var iIndex = this.mArray.indexOf(tCeLiang);
		if( iIndex == -1 )
			return;
		this.mArray.splice(iIndex,1);
	};	
	
	/**
	 * @api OnPick2D(mouseX,mouseY,e)
	 * @apiGroup CeLiangClass
	 * @apiDescription 平面下拾取测量线段
	 * @apiParam (参数) mouseX 鼠标X坐标
	 * @apiParam (参数) mouseY 鼠标Y坐标	
	 * @apiParam (参数) e 鼠标信息	 
	 */	
	this.OnPick2D = function(mouseX,mouseY,e)
	{	
		for(var k= 0; k<this.mArray.length; k++)
			this.mArray[k].GaiYanSe(0x00000);
			
		for(var k= 0; k<this.mArray.length; k++)
		{		
			var ab = mMathClass.ClosestPointOnLine1(this.mArray[k].m_vStart.x, this.mArray[k].m_vStart.y,
													this.mArray[k].m_vEnd.x, this.mArray[k].m_vEnd.y,mouseX,mouseY, 10);
			if( ab[0] != 0 )
			{
				this.m_pCurCeLiang = this.mArray[k];
			 	this.m_pCurCeLiang.GaiYanSe(0x00A2E8);
				return true;
			}
		}
		return false;
	};	
}