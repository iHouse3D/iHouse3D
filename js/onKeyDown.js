document.onkeydown = hotkey;
var mCtrlKeyPress  = false;	// Ctrl是否按下
function hotkey(evt)  
{  
	 e   = window.event || evt;
	var a=e.keyCode;	
	if( true == mHouseClass.mFurnitureClass.OnKeyDown(a))
		return;
		
	if( true == mHouseClass.mWindowClass.OnKeyDown(a))
		return;	
	
	if( true == mHouseClass.mDoorClass.OnKeyDown(a))
		return;
		
	if( true == mHouseClass.mCeLiangClass.OnKeyDown(a))
		return;
		
	if( true == mHouseClass.mWallClass.OnKeyDown(a))
		return;

	if( true == mHouseClass.mFlueClass.OnKeyDown(a))
		return;
		
	if( true == mHouseClass.mPillarClass.OnKeyDown(a))
		return;
	
	if( true == mHouseClass.mLiangClass.OnKeyDown(a))
		return;
		
	if((a==66)&&(e.ctrlKey))//ctrl+B 
	{  
		app.header.showLable.check_coord=!app.header.showLable.check_coord;
		mParamSystemDlg.OnShowCoord()
	}

	if((a==83)&&(e.altKey))//alt+S 
	{  
		app.header.showLable.check_label=!app.header.showLable.check_label;
		mParamSystemDlg.OnShowLabel();
	} 

	if((a==70)&&(e.altKey))//alt+F 
	{  
		app.header.showLable.check_Furniture=!app.header.showLable.check_Furniture;
		mParamSystemDlg.OnShowFurniture();
	} 

	if((a==82)&&(e.altKey))//alt+R 
	{  
		app.header.showLable.check_RoomName=!app.header.showLable.check_RoomName;
		mParamSystemDlg.OnShowRoomName();
	} 

	if((a==87)&&(e.altKey))//alt+W
	{  
		app.header.showLable.check_TransparentWall=!app.header.showLable.check_TransparentWall;
		mParamSystemDlg.OnShowTransparentWall();
	} 
};

