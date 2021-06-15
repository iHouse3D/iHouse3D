
function PolygonClass()
{
	// 地台
	this.mPolygonArray = new Array(); //多少地面形状	
	this.m_pCurPolygon = null;		
	this.OnInit = function( )
	{
	};

	this.OnMouseDown = function(mouseX,mouseY)
	{
		if( this.m_pCurPolygon == null)
		{
			this.m_pCurPolygon = new PolygonData();
			this.m_pCurPolygon.OnMouseDown(mouseX,mouseY);
		}
		else
		{
			
		}
	};
	
	this.OnMouseMove= function(mouseX,mouseY,buttonDown)
	{
	};
	
	// 生成3D
	this.OnUpdate3D =function()
	{
		if( this.mPolygonArray.length == 0 )
			return;	
	};
		
	// 清空墙体		
	this.OnClear= function()
	{
		for( var i = 0; i< this.mPolygonArray.length; i++ ){
			this.mPolygonArray[i].OnClear();
		}
		this.mPolygonArray.length = 0;
		this.m_pCurPolygon = null;
	};
	
	// 拾取墙体
	this.OnPick2D = function(mouseX, mouseY)
	{
		return null;
	};
	
	this.OnMouseRightUp2D = function()
	{
	};
	
	
	this.OnDelete = function(tCurPolygon)
	{			
		tCurPolygon.OnClear();
		var iIndex = this.mPolygonArray.indexOf(tCurPolygon);
		if( iIndex == -1 )
			return;
		this.mPolygonArray.splice(iIndex,1);
	};
}