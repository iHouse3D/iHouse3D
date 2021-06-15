
function DecalClass()
{
	//单块贴图操作类
	this.mDecalArray= new Array();
	this.m_pCurDecal;
	this.mCurMouseX = 0;
	this.mCurMouseY = 0;
		
	this.OnInit = function()
	{
	};

	this.OnClear = function()
	{
		for( var k =0; k< this.mDecalArray.length; k++ )
			this.mDecalArray[k].OnClear();

		this.mDecalArray.length = 0;
	};
	
	this.OnCreateDecal = function(intersects,tMesh)
	{
		this.m_pCurDecal = new DecalData();
		this.m_pCurDecal.OnInit();
		this.m_pCurDecal.OnCreateDecal(intersects,tMesh,g_dataTex);	
		this.mDecalArray.push(this.m_pCurDecal);
	};	


	//  移动贴花材质
	this.OnMouseDown = function(mouseX,mouseY)
	{
		this.mCurMouseX  = 0;
		this.mCurMouseY  = 0;				
		this.m_pCurDecal = null;
		for( j=0; j<this.mDecalArray.length; j++)
		{
			var Intersections = raycaster.intersectObject(  this.mDecalArray[j].mDecalMesh );
			for( var i = 0; i< Intersections.length ; i++)
			{						
					this.m_pCurDecal = this.mDecalArray[j];
				//	m_ParamTextDlg.Show(this.mTextArray[j]);
					this.mCurMouseX = mouseX;
					this.mCurMouseY = mouseY;	
					bMouseUp2D = true;
					return true;
			}				
		}
		return false;
	};	
	
	this.OnMouseMove = function(mouseX,mouseY,e)
	{
		if(e.buttons == 1 && this.m_pCurDecal != null)
		{
			this.m_pCurDecal.mDecalMesh.position.x += mouseX-this.mCurMouseX;
			this.m_pCurDecal.mDecalMesh.position.y += mouseY-this.mCurMouseY;
			this.m_pCurDecal.mDecalMesh3D.position.x += mouseX-this.mCurMouseX;
			this.m_pCurDecal.mDecalMesh3D.position.z += mouseY-this.mCurMouseY;												
			this.mCurMouseX = mouseX;
			this.mCurMouseY = mouseY;	
			return true;
		}	
		return false;
	};
	
	this.OnMouseRightUp2D = function(){	
		this.m_pCurDecal = null;
	};	
	
	this.OnShowAll = function(bShow)
	{
		for( k=0; k<this.mDecalArray.length; k++)
		{
			this.mDecalArray[k].mDecalMesh.visible = bShow;
		}
	};
}