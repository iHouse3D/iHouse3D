function GroundClass()
{
	this.mGroundArray = new Array();	// 多个舞台
	this.m_pCurGround = null;

	// 创建舞台
	this.DrawGround = function( mouseX,mouseY )
	{
		if(this.m_pCurGround == null)
		{
			this.m_pCurGround = new GroundUnit();
			this.m_pCurGround.m_flayer = this.mGroundArray.length;	
		}
		this.m_pCurGround.DrawGround(mouseX,mouseY);
	};
	
	// 移动舞台
	this.OnMouseMove= function(mouseX,mouseY,buttonDown)
	{
		var fDis = 10;
		for( var i = 0; i<this.mGroundArray.length; i++)
		{
			if(true ==this.mGroundArray[i].OnMouseMove_Help(mouseX,mouseY) )
				break;
		}		
		if(this.m_pCurGround)
		   this.m_pCurGround.OnMouseMove(mouseX,mouseY,buttonDown);
	};
	
	// 单击右键    创建舞台
	this.OnMouseRightUp2D = function()
	{
		if(this.m_pCurGround)
		{
		   this.m_pCurGround.OnMouseRightUp2D();
		   this.mGroundArray.push(this.m_pCurGround);
		}
		this.m_pCurGround = null;
	};
	
	// 2D拾取操作
	this.OnPick2D = function(mouseX, mouseY)
	{
/*		var ab = this.CheckPosOnLine(mouseX,mouseY);			
		if( ab[0] !=0 )
		{				
			return this.mLineArray[ab[4]];
		}*/
		return null;
	};
	
	// 清空所有舞台
	this.OnClear = function()
	{
		for( var i = 0; i<this.mGroundArray.length; i++)
			this.mGroundArray[i].OnClear();
			
		this.mGroundArray.length = 0;
	};
	
	// 删除指定的舞台
	this.OnDelete = function(tGround)
	{
		if(tGround == null)
			return;
			
		tGround.OnClear();
		var iIndex = this.mGroundArray.indexOf(tGround);
		if( iIndex == -1 )
			return;
		this.mGroundArray.splice(iIndex,1);
	};
	
	this.CreateRect = function()
	{
		this.m_pCurGround = new GroundUnit();
		this.m_pCurGround.CreateRect();
		this.mGroundArray.push(this.m_pCurGround);
		this.m_pCurGround = null;
	};
	
	// 由地面得到地台
	this.FindGround = function(tFloor)
	{
		for(var i = 0; i<this.mGroundArray.length; i++ )
		{
			if(this.mGroundArray[i].m_pCurFloor == tFloor )
			{
				return this.mGroundArray[i];
			}
		}
		return null;
	};
	
	// 保存舞台
	this.OnSave_XML = function()
	{
        let strXML = `<GroundClass>`; 
        
		for( var i = 0; i<this.mGroundArray.length; i++)
			strXML += this.mGroundArray[i].OnSave_XML();
		
		strXML +=`</GroundClass>`;	
		return strXML;
	};
	
	// 读取舞台
	this.OnLoad_XML = function(data)
	{	
		for(var i=0;i<$(data)[0].childNodes.length;i++ )
		{
			this.m_pCurGround = new GroundUnit();
			this.m_pCurGround.OnLoad_XML($(data)[0].childNodes[i]);			
		}
	};
}