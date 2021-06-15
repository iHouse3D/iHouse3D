function Dlg_GroundAttribute()
{
	this.m_pGround;
	
	this.OnShow = function(tFloor)
	{
		this.m_pGround = null;
		// 由地面得到地台
		for(var i = 0; i<mHouseClass.mGroundClass.mGroundArray.length; i++ )
		{
			if(mHouseClass.mGroundClass.mGroundArray[i].m_pCurFloor == tFloor )
			{
				this.m_pGround = mHouseClass.mGroundClass.mGroundArray[i];
				break;
			}
		}
		if( this.m_pGround == null )
		{
			$('#mFloorParam').hide();
			return;
		}
		$('#mFloorParam').show();

		if(this.m_pGround && this.m_pGround.m_fHeight)	// 厚度
		   app.attributeInterface.ground.height.int=(this.m_pGround.m_fHeight*10);
		   
		if(this.m_pGround && this.m_pGround.m_fDist)	// 离地高 
		   app.attributeInterface.ground.thickness.int=(this.m_pGround.m_fDist*10);
		   
	    if( this.m_pGround.m_iFloor == -10)
	   		app.floorValue ='全部';
	   		
	    if( this.m_pGround.m_iFloor == 1)
	   		app.floorValue ='一层';
	   		
	    if( this.m_pGround.m_iFloor == 2)
	   		app.floorValue ='二层';	   		
		
	    if( this.m_pGround.m_iFloor == 3)
	   		app.floorValue ='三层';			
	};
	
	this.height = function(value)
	{
		if (this.m_pGround.m_fHeight==null)
			return;

		this.m_pGround.m_fHeight=parseInt(value)/10;
		this.m_pGround.OnUpdateHeight();
	};
	
	this.thickness = function(value)
	{
		if (this.m_pGround.m_fDist==null)
			return;

		this.m_pGround.m_fDist=parseInt(value)/10;
		this.m_pGround.OnUpdateHeight();
	};
	
	this.OnDelete = function()
	{
		if( this.m_pGround == null )
			return;
		
		mHouseClass.mGroundClass.OnDelete(this.m_pGround);
		$('#mFloorParam').hide();	
	};
	
	// 选择楼层
	this.OnChangeFloor = function()
	{
		if( this.m_pGround == null )
			return;
		this.m_pGround.m_iFloor = parseInt(app.floorValue);
	};
	
	// 
	this.OnCreateEdge = function(data)
	{
		if( this.m_pGround == null )
			return;
		this.m_pGround.OnCreateEdge(data);
	};

	this.OnDelEdge = function()
	{
		if( this.m_pGround == null )
			return;
		this.m_pGround.OnDelEdge();	
	};
}





