function HelpClass()
{		
		this.mHelpCoss;						// 十字线
		
		this.mHelpWallPos1;					// 墙体顶点
		this.mHelpWallPos2;
		this.mHelpWallPos3;
		this.mHelpWallPos4;
		this.mHelpWall;						// 移动时感应变红的墙体
		this.mPointsMaterial;
		this.mBlueMaterial;
		this.mOutLine = null;
		
		// 参考线
		this.mHelpLine_Start = null;	// 辅助线
		this.mHelpLine_End   = null;
		
		// 十字参考线
		this.CreateHelpCross= function()
		{
			var h = 8000;
			var geometry = new THREE.Geometry();
			geometry.vertices.push( new THREE.Vector3( -h, 0, 1 ), new THREE.Vector3(  h, 0, 1 ));
			geometry.vertices.push( new THREE.Vector3(  0,-h, 1 ), new THREE.Vector3(  0, h, 1 ));			
			this.mHelpCoss = new THREE.LineSegments( geometry, new THREE.LineDashedMaterial( { color: 0xff0000, dashSize: 30, gapSize: 10, linewidth: 1,opacity: 0.5,transparent: true } ) );				
			this.mHelpCoss.computeLineDistances();
			this.mHelpCoss.visible = true;
			objects.push( this.mHelpCoss );
			scene.add( this.mHelpCoss );
			
/*			var sphere = new THREE.CircleGeometry( 6,16 );
			this.mPointsMaterial = new THREE.PointsMaterial( {color: 0x00A1ff } );
			this.sphereMesh 	 = new THREE.Mesh( sphere, this.mPointsMaterial);
			this.mBlueMaterial   = new THREE.LineBasicMaterial({ color: 0x0000ff });
			this.sphereMesh.position.z     = 1;
			this.mHelpCoss.add(this.sphereMesh);
			this.mHelpCoss.add(new THREE.Line(sphere, this.mBlueMaterial));*/
			
		};
		
		// 创建辅助点
		this.CreateHelpPos1 = function()
		{
			var sphere = new THREE.CircleGeometry( 6,16 );			
			this.mHelpWallPos1 = new THREE.Mesh( sphere, this.mPointsMaterial );
			this.mHelpWallPos2 = new THREE.Mesh( sphere, this.mPointsMaterial );
			this.mHelpWallPos3 = new THREE.Mesh( sphere, this.mPointsMaterial );
			this.mHelpWallPos4 = new THREE.Mesh( sphere, this.mPointsMaterial );
			this.mHelpWallPos1.add(new THREE.Line(sphere, this.mBlueMaterial));
			this.mHelpWallPos2.add(new THREE.Line(sphere, this.mBlueMaterial));
			this.mHelpWallPos3.add(new THREE.Line(sphere, this.mBlueMaterial));
			this.mHelpWallPos4.add(new THREE.Line(sphere, this.mBlueMaterial));
			scene.add(this.mHelpWallPos1);
			scene.add(this.mHelpWallPos2);
			scene.add(this.mHelpWallPos3);
			scene.add(this.mHelpWallPos4);
		};
		
		this.CreateHelpWall=function()
		{
			var geometry  = new THREE.BoxBufferGeometry( 1, 1, 0.5);
		  	this.mHelpWall = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: 0xff0000, opacity: 1, transparent: false } ) );
			this.mHelpWall.visible = false;
		//	scene.add( this.mHelpWall );				
		};
		
		this.OnInit = function()
		{
			this.CreateHelpCross();
			this.CreateHelpWall();
			this.CreateHelpPos1();
		//	this.OnCreateMultiSelect();	//  多选
			this.OnClear();
		};
		// 初始化状态
		this.OnClear = function(){
		//	this.mHelpCoss.visible = false;
			this.mHelpCoss.position.x 	  = -999999;
			this.mHelpCoss.position.y     = -999999;
			this.mHelpWallPos1.position.x = -999999;
			this.mHelpWallPos1.position.y = -999999;
			this.mHelpWallPos2.position.x = -999999;
			this.mHelpWallPos2.position.y = -999999;
			this.mHelpWallPos3.position.x = -999999;
			this.mHelpWallPos3.position.y = -999999;
			this.mHelpWallPos4.position.x = -999999;
			this.mHelpWallPos4.position.y = -999999;			
			this.ClearOutline();
		};

		this.mouseMove = function()
		{
		};
		
	  	this.OnShow = function(bShow)
		{
			this.mHelpCoss.visible = bShow;
			this.mHelpWallPos1.visible = bShow;
		};
		
		this.OnShowPosAll = function( vPos1, vPos2, vPos3,vPos4 )
		{
			this.mHelpWallPos1.position.x = vPos1.x;
			this.mHelpWallPos1.position.y = vPos1.y;
			this.mHelpWallPos2.position.x = vPos2.x;
			this.mHelpWallPos2.position.y = vPos2.y;	
			this.mHelpWallPos3.position.x = vPos3.x;
			this.mHelpWallPos3.position.y = vPos3.y;
			this.mHelpWallPos4.position.x = vPos4.x;
			this.mHelpWallPos4.position.y = vPos4.y;			
			this.mHelpWallPos1.position.z = 2;
			this.mHelpWallPos2.position.z = 2;
			this.mHelpWallPos3.position.z = 2;
			this.mHelpWallPos4.position.z = 2;			
		};
		
		this.OnHidePosAll = function()
		{
			this.mHelpWallPos1.position.x = -999999;
			this.mHelpWallPos1.position.y = -999999;
			this.mHelpWallPos2.position.x = -999999;
			this.mHelpWallPos2.position.y = -999999;
			this.mHelpWallPos3.position.x = -999999;
			this.mHelpWallPos3.position.y = -999999;
			this.mHelpWallPos4.position.x = -999999;
			this.mHelpWallPos4.position.y = -999999;			
			this.mHelpWall.visible = false;
		};	
		
		this.OnShowHelpWall = function(tWall)
		{
			this.mHelpWallPos1.visible = true;
			this.mHelpWallPos2.visible = true;
			this.mHelpWallPos1.position.x = tWall.m_vStart.x;
			this.mHelpWallPos1.position.y = tWall.m_vStart.y;
			this.mHelpWallPos2.position.x = tWall.m_vEnd.x;
			this.mHelpWallPos2.position.y = tWall.m_vEnd.y;	
			this.mHelpWallPos1.position.z = 2;
			this.mHelpWallPos2.position.z = 2;
		};
		
		this.ClearOutline = function()
		{
			scene.remove( this.mOutLine );
			scene3D.remove( this.mOutLine );
			
			for( var j=0; j<mHouseClass.mFloorClass.mFloorArray.length; j++)
				mHouseClass.mFloorClass.mFloorArray[j].OnShowLabel(true);
			
			//scene.remove(mHouseClass.mWallClass.mHelpWall);
		};
		
		// 显示轮廓辅助线
		this.ShowOutLine_Floor3D = function(tFloor)
		{
			this.ClearOutline();
			
			var positions = [];
			var colors = [];
			var geom = new THREE.Geometry();
			for(var i = 0; i<tFloor.mLabelArray_Out.length; i++)
			{
				positions.push(tFloor.mLabelArray_Out[i].m_vStart_Floor.x, 0,-tFloor.mLabelArray_Out[i].m_vStart_Floor.y);
				positions.push(tFloor.mLabelArray_Out[i].m_vEnd_Floor.x,0,-tFloor.mLabelArray_Out[i].m_vEnd_Floor.y);					
				colors.push(1,1,0.5);
				colors.push(1,1,0.5);
			}
			
			var geometry1 = new THREE.LineGeometry();
			geometry1.setPositions( positions );
			geometry1.setColors( colors );
			
			this.mOutLine = new THREE.Line2( geometry1, mResource.matLine );
			scene3D.add(this.mOutLine);
		};
		
		this.ShowOutLine_Floor2D = function(tFloor)
		{
			this.ClearOutline();
			
			var positions = [];
			var colors = [];
			var geom = new THREE.Geometry();
			for(var i = 0; i<tFloor.mLabelArray_Out.length; i++)
			{
				positions.push(tFloor.mLabelArray_Out[i].m_vStart_Floor.x, tFloor.mLabelArray_Out[i].m_vStart_Floor.y, 0);
				positions.push(tFloor.mLabelArray_Out[i].m_vEnd_Floor.x,   tFloor.mLabelArray_Out[i].m_vEnd_Floor.y, 0);					
				colors.push(1,1,0.5);
				colors.push(1,1,0.5);
			}
			
			var geometry1 = new THREE.LineGeometry();
			geometry1.setPositions( positions );
			geometry1.setColors( colors );
			
			this.mOutLine = new THREE.Line2( geometry1, mResource.matLine );
			scene.add(this.mOutLine);
		};
}