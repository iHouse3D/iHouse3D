//Init();
function Init()
{
	InitAPI_Parts();
	InitAPI_DoorAndWindow();	// 门窗功能模块
	InitAPI_RoomTemplate();		// 样板间功能模块
	InitAPI_Base();				// 基础绘制功能模块
}

//-------------------------------------------------------------
function InitAPI_Base()
{

	var tempNode =`	<div class="md-itemList">
						<div class="itemList-title">
							<p>`+i18n.t("Language.DrawWall")+`</p>
							<span class="el-icon-arrow-up"></span>
						</div>
						<ul class="itemList-imgList clearfloat">
							<li><img src="img/apartment_01.png" alt='{{ $t("Language.DrawWall")}}'
									onclick="OnCreateWall()">
								<p>中线画墙</p>
							</li>
							<li><img src="img/apartment_11.png" alt='{{ $t("Language.DrawWall")}}'
									onclick="OnCreateWall1()">
								<p>内线画墙</p>
							</li>								
							<li><img src="img/font.png" onclick="mHouseClass.mTextClass.CreateText()">
								<p>`+i18n.t("Language.Name")+`</p>
							</li>								
						</ul>
					</div>`;				
	$('#mTool .el-scrollbar__view').prepend(tempNode);
}

function InitAPI_RoomTemplate()
{
	var tempNode =`	<div class="md-itemList">
						<div class="itemList-title">
							<p>房间形状模板</p>
							<span class="el-icon-arrow-up"></span>
						</div>
						<ul class="itemList-imgList clearfloat">
							<li><img src="img/apartment_02.png" onclick="OnCreateRoom(1)">
								<p>`+i18n.t("Language.HouseType1")+`</p>
							</li>
							<li><img src="img/apartment_03.png" onclick="OnCreateRoom(2)">
								<p>`+i18n.t("Language.HouseType2")+`</p>
							</li>
							<li><img src="img/apartment_04.png" onclick="OnCreateRoom(3)">
								<p>`+i18n.t("Language.HouseType3")+`</p>
							</li>
							<li><img src="img/apartment_05.png" onclick="OnCreateRoom(4)">
								<p>`+i18n.t("Language.HouseType4")+`</p>
							</li>
						</ul>
					</div>`;
	$('#mTool .el-scrollbar__view').prepend(tempNode);
}

function InitAPI_DoorAndWindow()
{
	var tempNode =`	<div class="md-itemList">
						<div class="itemList-title">
							<p>`+i18n.t("Language.DoorAndWindow")+`</p>
							<span class="el-icon-arrow-up"></span>
						</div>
						<ul class="itemList-imgList clearfloat">
							<li><img src="img/doorwindns_01.png" 
									onclick="mHouseClass.mDoorClass.CreateDoor(0)">
								<p>`+i18n.t("Language.SingleLeafDoor")+`</p>
							</li>
							<li><img src="img/doorwindns_02.png" 
									onclick="mHouseClass.mDoorClass.CreateDoor(2)">
								<p>`+i18n.t("Language.DoubleLeafDoor")+`</p>
							</li>
							<li><img src="img/door001.png" 
									onclick="mHouseClass.mDoorClass.CreateDoor(7)">
								<p>子母门</p>
							</li>								
							<li><img src="img/doorwindns_03.png" 
									onclick="mHouseClass.mDoorClass.CreateDoor(3)">
								<p>`+i18n.t("Language.MoveDoor")+`</p>
							</li>
							<li><img src="img/structure_04.png"
									onclick="mHouseClass.mDoorClass.CreateDoor(4)">
								<p>`+i18n.t("Language.DoorOpening")+`</p>
								
							<li style="display:none"><img src="img/doorwindns_09.png" 
									onclick="mHouseClass.mDoorClass.CreateDoor(5)">
								<p>拱形门</p>
							</li>										
									
							<li><img src="img/doorwindns_04.png" 
									onClick="mHouseClass.mWindowClass.CreateWindow(0);">
								<p>`+i18n.t("Language.Window")+`</p>
							</li>
							<li><img src="img/doorwindns_05.png" 
									onClick="mHouseClass.mWindowClass.CreateWindow(1);">
								<p>`+i18n.t("Language.FrenchWindows")+`</p>
							</li>
							<li><img src="img/doorwindns_06.png" 
									onClick="mHouseClass.mWindowClass.CreateWindow(2);">
								<p>`+i18n.t("Language.BayWindow")+`</p>
							</li>
							</li>		
								<li><img src="img/doorwin.png"
									onclick="mHouseClass.mWindowClass.CreateWindow(5)">
								<p>窗洞</p>
							</li>							
						</ul>
					</div>`;
	$('#mTool .el-scrollbar__view').prepend(tempNode);
}

function InitAPI_Parts()
{
	var tempNode =` <div class="md-itemList">
							<div class="itemList-title">
								<p>`+i18n.t("Language.Stucture")+`</p>
								<span class="el-icon-arrow-up"></span>
							</div>
							<ul class="itemList-imgList clearfloat">
								<li><img src="img/structure_01.png" onclick="mHouseClass.mPillarClass.CreatePillar()">
									<p>`+i18n.t("Language.Column")+`</p>
								</li>
								<li><img src="img/structure_02.png" onclick="mHouseClass.mLiangClass.CreateLiang();">
									<p>`+i18n.t("Language.Beam")+`</p>
								</li>
								<li><img src="img/structure_05.png" onclick="mHouseClass.mFlueClass.CreateFlue()">
									<p>`+i18n.t("Language.Flue")+`</p>
								</li>
							</ul>
						</div>`
	$('#mTool .el-scrollbar__view').prepend(tempNode);
}


