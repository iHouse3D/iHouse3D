function RoomData()
{		
	this.mFloor;
	this.mWallArray_3D;	//内墙
	this.mWallArray_2D;
	
	// 更新房间信息
	this.OnUpdate = function(tFloor)
	{
		this.OnClear();
		this.mFloor = tFloor;
		this.OnUpdateWall_2D();
		this.OnUpdateWall_3D();
		this.OnUpdateWall_3D_Out();
	};
	
	// 清空
	this.OnClear = function()
	{
		this.mFloor = null;
	};
	
	// 创建2D墙体
	// 显示相关门窗
	this.OnUpdateWall_2D = function()
	{
	};
	
	// 生成相应外墙轮廓
	this.OnUpdateWall_3D_Out = function()
	{	
	};
}