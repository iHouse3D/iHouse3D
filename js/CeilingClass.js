
function CeilingClass()
{
	//墙面信息类
	this.mCeilingArray	= new Array();

	this.m_pCurCeiling;
	this.m_OBBox_Max  = new THREE.Vector3();		// 包围盒
	this.m_OBBox_Min  = new THREE.Vector3();
	
	this.OnInit = function()
	{
	};

	this.OnClear = function()
	{
		for( var k =0; k< this.mCeilingArray.length; k++ )
			this.mCeilingArray[k].OnClear();

		this.mCeilingArray.length = 0;

		this.m_OBBox_Max.x= -99999;
		this.m_OBBox_Max.y= -99999;
		this.m_OBBox_Min.x=  99999;
		this.m_OBBox_Min.y=  99999;
	};
	
	this.OnUpdateCeiling = function(solution_paths, iMaxAreaFloor)
	{
		if( solution_paths == null)
		    return;
		
		for( k=0; k<this.mCeilingArray.length; k++)
			this.mCeilingArray[k].bUpdate = true;

		for(var j = 0; j < solution_paths.length; j++) 
		{				
			if( j == iMaxAreaFloor )	// 去掉外轮廓
				continue;
			
			this.m_pCurCeiling = new CeilingData();
			this.m_pCurCeiling.OnBuildCeiling(solution_paths[j],0);
			for(var i=0; i<this.mCeilingArray.length; i++)
			{
				if( true == this.mCeilingArray[i].IsSameAs(this.m_pCurCeiling))	//   判断是否相同
				{
					this.mCeilingArray[i].bUpdate = false;	// 不更新
					this.m_pCurCeiling.OnClear();	
					this.m_pCurCeiling = null;
					break;
				}	
			}		    	
	    	if(this.m_pCurCeiling)	    		
				this.mCeilingArray.push(this.m_pCurCeiling);
		}
		this.m_pCurCeiling = null;
					
		
		// 清除不用的地面
		for( k=0; k<this.mCeilingArray.length; k++)
		{
			if( this.mCeilingArray[k].bUpdate == true )
			{
				this.mCeilingArray[k].OnClear();
				this.mCeilingArray.splice(k,1);
				k= -1;
			}
		}	
		
		this.OnShowAll(false);
	};

	this.OnUpdateHeight = function()
	{
		for( let k=0; k<this.mCeilingArray.length; k++)
		{
			this.mCeilingArray[k].OnUpdateHeight(mHouseClass.m_fHeight);// 高度
		}
	};

	this.OnPick2D = function(mouseX,mouseY)
	{
		var tCeiling = null;
		var tDis  = -99999;

		for( j=0; j<this.mCeilingArray.length; j++)
		{
			var Intersections = raycaster.intersectObject( this.mCeilingArray[j].mCeilingMesh );
			if( Intersections.length>=1)
			{

				if( tDis < Intersections[0].distance)
				{
					tDis  = Intersections.distance;
					tCeiling = this.mCeilingArray[j];
				}
			}
		}

		if( tCeiling != null )
			return tCeiling;

		return null;
	};
	
	this.OnChangeTex = function(mouseX,mouseY,ab)
	{
		var tCeiling = this.OnPick2D(mouseX,mouseY);
		if(tCeiling)
		{
		   tCeiling.OnUpdateTex(ab);
		   g_dataTex = null;
		   m_cPenType= 0;
		}
	
	};
	
	this.OnShowAll = function(bShow)
	{
		for( k=0; k<this.mCeilingArray.length; k++)
		{
			this.mCeilingArray[k].mCeilingMesh.visible = bShow;
		}
		mHouseClass.mDecalClass.OnShowAll(bShow);
	};
	
	this.OnShowAll_3D = function(bShow)
	{
		for( k=0; k<this.mCeilingArray.length; k++)
			this.mCeilingArray[k].mCeilingMesh3D.visible = bShow;
	};	
	
	// 创建贴花材质
	this.DrawDecal = function(mouseX,mouseY)
	{
		for( var j=0; j<this.mCeilingArray.length; j++)
		{
			var Intersections = raycaster.intersectObject(  this.mCeilingArray[j].mCeilingMesh );
			if( Intersections.length>=1)
			{
				mHouseClass.mDecalClass.OnCreateDecal(Intersections,this.mCeilingArray[j]);
				m_cPenType= 0;
				return;
			}			
		}
	};
	
	// 更新3D数据
	this.OnUpdate3D = function()
	{
		for( var j=0; j<this.mCeilingArray.length; j++)
		{
			this.mCeilingArray[j].OnUpdate3D();
		}
	};
	
	this.CreatePlatformPoly= function(vLineArray,fValue)
	{
		var clip_paths =[];
		var tArray = [];
		for(let i = 0; i< vLineArray.length; i++)
			tArray.push({X:vLineArray[i].x,Y:vLineArray[i].y});

		clip_paths.push(tArray);
		ClipperLib.JS.ScaleUpPaths(clip_paths, 1);
		
		this.m_pCurCeiling = new CeilingData();
		this.m_pCurCeiling.OnBuildCeiling(clip_paths[0],0); 		
		this.mCeilingArray.push(this.m_pCurCeiling); 
	};
	
	this.OnDelete = function(tCeiling)
	{
		tCeiling.OnClear();
		var iIndex = this.mCeilingArray.indexOf(tCeiling);
		if( iIndex == -1 )
		return;
		this.mCeilingArray.splice(iIndex,1);
	};
		
}