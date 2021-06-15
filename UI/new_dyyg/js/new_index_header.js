DY_header_center();
function DY_header_center(){
	let html=`<ul class="mainMenu clearfloat">
					<li class="mainMenu-item">
						<i class="icon iconfont icon-ziyuan3"></i>
						<p>文件</p>
						<i class="el-icon-arrow-down"></i>
						<ul class="submenu transition-draw">
							<li class="submenu-item" onClick="openCreate_huxing()"><span class="submenu-item-name" >开始设计</span></li>
							<li class="submenu-item" onClick="show_fanganDaoru()"><span class="submenu-item-name" >导入户型图</span></li>
							<li class="submenu-item" onClick="OnpenProjectEditor('保存')"><span class="submenu-item-name">保存</span></li>
							<li class="submenu-item" onClick='OnpenProjectEditor("另存为")' v-if="!accountType==1"><span class="submenu-item-name">另存为</span></li>
						</ul>
					</li>
					<li class="mainMenu-item" onClick="OnpenProjectEditor('保存')">
						<i class="icon iconfont icon-ziyuan4"></i>
						<p>保存</p>
					</li>
					<li class="mainMenu-item">
						<i class="icon iconfont icon-ziyuan7"></i>
						<p>清空</p>
						<i class="el-icon-arrow-down"></i>
						<ul class="submenu transition-draw">
							<li class="submenu-item" onclick="OnClear()"><span class="submenu-item-name" >清空视图</span></li>
							<li class="submenu-item" onclick="OnClearObj()"><span class="submenu-item-name">清空家具</span></li>
						</ul>
					</li>
					<li class="rightline"></li>
					<li class="mainMenu-item" onclick="OnCreateCeLiang()">
						<i class="icon iconfont icon-ziyuan13"></i>
						<p>测量</p>
					</li>
					<li class="mainMenu-item">
						<i class="icon iconfont icon-ziyuan10"></i>
						<p>显示</p>
						<i class="el-icon-arrow-down"></i>
						<ul class="submenu transition-draw">
							<li class="submenu-item"><span class="submenu-item-name" style="font-size:13px">3D模式</span><span class="el-icon-arrow-right"></span>
								<ul class="grandsonMenu">
									<li class="grandsonMenu-item"><el-radio v-model="header.showLable.wallLine" label="1" onclick="mParamSystemDlg.OnWireframe(false);mParamSystemDlg.OnMaterial(true);">材质模式</el-radio></li>
									<li class="grandsonMenu-item"><el-radio v-model="header.showLable.wallLine" label="2" onclick="mParamSystemDlg.OnWireframe(true);mParamSystemDlg.OnMaterial(false);">线框模式</el-radio></li>
									<li class="grandsonMenu-item"><el-radio v-model="header.showLable.wallLine" label="3" onclick="mParamSystemDlg.OnWireframe(true);mParamSystemDlg.OnMaterial(true);">材质+线框</el-radio></li>
								</ul>
							</li>
					<!--		<li class="submenu-item"><span class="submenu-item-name" style="font-size:13px">尺寸线</span><span class="el-icon-arrow-right"></span>
								<ul class="grandsonMenu">
									<li class="grandsonMenu-item"><el-radio v-model="header.showLable.wallLine" label="1">墙中线</el-radio></li>
									<li class="grandsonMenu-item"><el-radio v-model="header.showLable.wallLine" label="2">位置</el-radio></li>
									<li class="grandsonMenu-item"><el-radio v-model="header.showLable.wallLine" label="3">不显示</el-radio></li>
								</ul>
							</li> -->
							<li class="submenu-item"><span class="submenu-item-name" style="font-size:13px">窗口打开方式</span><span class="el-icon-arrow-right"></span>
								<ul class="grandsonMenu">
									<li class="grandsonMenu-item"><el-checkbox v-model="header.showLable.check_ChildRoam3D">新窗口打开漫游</el-checkbox></li>
									<li class="grandsonMenu-item"><el-checkbox v-model="header.showLable.check_ChildRender">新窗口打开渲染</el-checkbox></li>
									<li class="grandsonMenu-item"><el-checkbox v-model="header.showLable.check_ChildMat3D">新窗口打开材质替换</el-checkbox></li>
								</ul>
							</li>
							<li class="submenu-item"><span class="submenu-item-name" style="font-size:13px">3D外墙方式</span><span class="el-icon-arrow-right"></span>
								<ul class="grandsonMenu">
									<li class="grandsonMenu-item"><el-radio v-model="header.showLable.check_WallMode" :label="1" onchange="mParamSystemDlg.OnShowAlphaWAll()">半透明外墙</el-radio></li>
									<li class="grandsonMenu-item"><el-radio v-model="header.showLable.check_WallMode" :label="2" onchange="mParamSystemDlg.OnShowAlphaWAll()">全透明外墙</el-radio></li>
									<li class="grandsonMenu-item"><el-radio v-model="header.showLable.check_WallMode" :label="3" onchange="mParamSystemDlg.OnShowAlphaWAll()">不透明外墙</el-radio></li>
								</ul>
							</li>							
							<li class="submenu-item" ><el-checkbox v-model="header.showLable.check_coord"
								onchange="mParamSystemDlg.OnShowCoord()">背景网络</el-checkbox></li>
							<li class="submenu-item"><el-checkbox v-model="header.showLable.check_label" onclick="mParamSystemDlg.OnShowLabel()">
								尺寸</el-checkbox></li>
							<li class="submenu-item"><el-checkbox v-model="header.showLable.check_Furniture"
								onclick="mParamSystemDlg.OnShowFurniture()">家具</el-checkbox></li>
							<li class="submenu-item"><el-checkbox v-model="header.showLable.check_RoomName"
								onchange="mParamSystemDlg.OnShowRoomName()">房间名称</el-checkbox></li>
								
								
							<li class="submenu-item"><el-checkbox v-model="header.showLable.check_TransparentWall"
								onclick="mParamSystemDlg.OnShowTransparentWall()">透明外墙</el-checkbox></li>
							<li class="submenu-item"><el-checkbox v-model="header.showLable.check_TransparentWall1" 
				     			onclick="mParamSystemDlg.OnShowTransparentWall_In()">内墙透明</el-checkbox></li>
							<li class="submenu-item"><el-checkbox v-model="header.showLable.check_ObjectAdsorption">墙体吸附</el-checkbox></li>
							<li class="submenu-item"><el-checkbox v-model="header.showLable.check_LockAll" onchange="mHouseClass.mFurnitureClass.OnLockAll()">锁定所有物体</el-checkbox></li>
							<li class="submenu-item"><el-checkbox v-model="header.showLable.check_DelWall" >连续删除墙体</el-checkbox></li>							
						</ul>
					</li>
					<li class="mainMenu-item" style="font-size:13px">
						<i class="icon iconfont icon-ziyuan11"></i>
						<p>助手</p>
						<i class="el-icon-arrow-down"></i>
						<ul class="submenu transition-draw">
							<li class="submenu-item"><span class="submenu-item-name">场景转换</span><span class="el-icon-arrow-right"></span>
								<ul class="grandsonMenu">
									<li class="grandsonMenu-item" onclick="mHouseClass.HorizontalMirror()"><span class="grandsonMenu-item-name">水平镜像</span></li>
									<li class="grandsonMenu-item" onclick="mHouseClass.VerticalMirror()"><span class="grandsonMenu-item-name">垂直镜像</span></li>
									<li class="grandsonMenu-item" onclick="mHouseClass.Rotate_Mirror()"><span class="grandsonMenu-item-name">90°旋转</span></li>
								</ul>
							</li>
							<li class="submenu-item" onClick="OnpenupdateLogs()"><span class="submenu-item-name">更新日志</span></li>
							<li class="submenu-item" @click="dialogTableVisible=true"><span class="submenu-item-name">错误日志</span></li>
							<li class="submenu-item" onClick="OpenCharts()"><span class="submenu-item-name">系统功能图</span></li>
							<li class="submenu-item" onClick="Onpenshortcutkeys()"><span class="submenu-item-name">快捷键</span></li>
							<li class="submenu-item" onClick="OnpenGlobalSettings()"><span class="submenu-item-name">全局设置</span></li>
							<li class="submenu-item" onclick="OnWXShare(document.documentElement)"><span class="submenu-item-name">全景分享</span></li>
							<li class="submenu-item" onclick="OnClickFullScreen(document.documentElement)"><span class="submenu-item-name">全屏</span></li>
							<li class="submenu-item" onclick="openCreate(4)" id="mMyModel"><span class="submenu-item-name">我的产品</span></li>
							<li class="submenu-item"><span class="submenu-item-name">动画路径</span><span class="el-icon-arrow-right"></span>
								<ul class="grandsonMenu">
									<li class="grandsonMenu-item" onclick="mAnimation.AnimationOper(0)"><span class="grandsonMenu-item-name">创建动画路径</span></li>
									<li class="grandsonMenu-item" onclick="mAnimation.AnimationOper(2)"><span class="grandsonMenu-item-name">动画预览</span></li>
									<li class="grandsonMenu-item" onclick="mAnimation.AnimationOper(3)"><span class="grandsonMenu-item-name">动画停止</span></li>
									<li class="grandsonMenu-item" onclick="mAnimation.AnimationOper(1)"><span class="grandsonMenu-item-name">删除动画路径</span></li>
								</ul>
							</li>
						</ul>
					</li>
					<li class="mainMenu-item">
						<i class="icon iconfont icon-ziyuan12"></i>
						<p>导出</p>
						<i class="el-icon-arrow-down"></i>
						<ul class="submenu transition-draw">
							<li class="submenu-item" onclick="mHouseClass.OnSave2DtoImage()"><span class="grandsonMenu-item-name">导出平面图</span></li>
							<li class="submenu-item" onclick="OnExportCAD()"><span class="submenu-item-name">导出CAD</span></li>
						</ul>
					</li>
				</ul>
				<ul class="rendering">
					<li class="rendering-item" onclick="mPluginsClass.OnSaveToRender()">
						<i class="icon iconfont icon-xiangji"></i>
						<p>渲染效果</p>
					</li>
					<li class="renderingLine"></li>
					<li class="rendering-item" onClick="openCreate(1)">
						<i class="icon iconfont icon-ziyuan16"></i>
						<p>图册</p>
					</li>
				</ul>`;
	$('.header-menu').html(html);
}
DY_header_right();
function DY_header_right(){
	let html=`<div class="head-help" onclick="mParamSystemDlg.ShowHelp()">
					<i class="icon iconfont icon-bangzhu"></i>
						<p>帮助</p>
				</div>
				<div class="head-fullScreen"  onclick="OnClickFullScreen(document.documentElement)">
					<i class="icon iconfont icon-ziyuan2"></i>
						<p>全屏</p>
				</div>
				<div class="btn-complete">
					<i class="icon iconfont icon-ziyuan14"></i>
					<span>完成</span>
				</div>`;
	$('.header-help').html(html);
}
