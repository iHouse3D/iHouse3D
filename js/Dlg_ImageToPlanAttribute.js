function Dlg_ImageToPlanAttribute()
{
	this.mFurniture;
	this.m_pageData_function=[];
	this.m_pageInt=0;
	this.ModeHideArray=[];

	this.mData_1='';
	this.mData_2='';
	this.mData_3='';

	// 显示属性窗口
	this.Show = function(tObj)
	{
		this.mFurniture = tObj;
		
		$('.attributeInterface').hide();
		$("#mFloorParamUI").show();
		
/*		$("#mFloorParamUI .goodsImg img").attr('src',m_strHttp+'jiaju/'+this.mFurniture.mData[1]);
		$("#mFloorParamUI .goosNmaes p span").text(this.mFurniture.mData[13]);
		$("#mFloorParamUI .goosNmaes p").eq(0).text(this.mFurniture.mData[0]);
		

		app.attributeInterface.furniture.length.int=(this.mFurniture.m_fLength);
		app.attributeInterface.furniture.width.int=(this.mFurniture.m_fWidth);
		app.attributeInterface.furniture.height.int=(this.mFurniture.m_fHeight);
		this.function_Data(this.mFurniture.mData[6],this.mFurniture.mData[7],this.mFurniture.mData[8]);
		app.attributeInterface.furniture.angle.int=parseInt(this.mFurniture.m_fRotate);
		app.attributeInterface.furniture.groundLevel.int=parseInt(this.mFurniture.m_fHight);	*/
	};
	
	this.HideParamDlg = function()
	{
		$("#mFloorParamUI").hide();
		mHouseClass.mFurnitureClass.OnMouseRightUp2D();
	};
}
