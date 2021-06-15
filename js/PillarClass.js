/**
 * @api PillarClass
 * @apiGroup PillarClass
 * @apiName  0
 * @apiDescription 柱子操作类
 * @apiParam (成员变量) mFlueArray 柱子数组
 */
function PillarClass()
{
	//柱子
	this.mFlueArray = new Array(); 
	this.m_pCurFlue = null; 
	this.mCurMouseX;
	this.mCurMouseY;
		
	// 操控帮助界面(不用保存)
	//====================================================================
	this.m_HelpBox;
	this.m_HelpBox1;
	this.m_HelpBox2;
	this.m_HelpBox3;
	this.m_HelpBox4;
	this.m_HelpBox5;
	this.m_HelpBox6;
	this.m_HelpBox7;
	this.m_HelpBox8;

	this.m_LineLeft_Label;
	this.m_LineRight_Label;
	this.m_LineTop_Label;
	this.m_LineBottom_Label;
	this.m_LineLeft_Box;
	this.m_LineTop_Box;
	this.m_LineRight_Box;
	this.m_LineBottom_Box;
	
	this.m_LineLeft_Box1;
	this.m_LineTop_Box1;
	this.m_LineRight_Box1;
	this.m_LineBottom_Box1;
	
	this.m_LineLeft;
	this.m_LineRight;
	this.m_LineTop;
	this.m_LineBottom;
	this.m_iSelected = 0;
	this.g_GaiLiQiangJuLi;
	this.m_strLeft_Value;
	this.m_strRight_Value;
	this.m_strTop_Value;
	this.m_strBottom_Value;
	this.m_fLeftOld;
	this.m_fRightOld;
	this.m_fTopOld;
	this.m_fBottomOld;	
	
	this.OnInit = function()
	{	
		var result_poly = new THREE.Geometry();					
		result_poly.vertices.push(new THREE.Vector3(-0.5, -0.5, 1), new THREE.Vector3(-0.5, 0.5, 1));				
		result_poly.vertices.push(new THREE.Vector3( 0.5,  0.5, 1), new THREE.Vector3( 0.5,-0.5, 1));	
	//	result_poly.vertices.push(new THREE.Vector3(-0.5, -0.5, 1));					
		this.m_HelpBox = new THREE.LineSegments( result_poly, new THREE.LineBasicMaterial( { color: 0x00A2E8, linewidth:15, opacity: 1 } ) );
		scene.add(this.m_HelpBox);
		
		var geometry1 = new THREE.Geometry();
		geometry1.vertices.push( new THREE.Vector3( 0,0, 1 ), new THREE.Vector3( 0,0, 1 ));
		var geometry2 = new THREE.Geometry();
		geometry2.vertices.push( new THREE.Vector3( 0,0, 1 ), new THREE.Vector3( 0,0, 1 ));
		var geometry3 = new THREE.Geometry();
		geometry3.vertices.push( new THREE.Vector3( 0,0, 1 ), new THREE.Vector3( 0,0, 1 ));
		var geometry4 = new THREE.Geometry();
		geometry4.vertices.push( new THREE.Vector3( 0,0, 1 ), new THREE.Vector3( 0,0, 1 ));	
		this.m_LineLeft 	= new THREE.LineSegments( geometry1, new THREE.LineBasicMaterial( { color: 0xAAAAAA, opacity: 1, linewidth:0.5 } ) );
		this.m_LineRight	= new THREE.LineSegments( geometry2, new THREE.LineBasicMaterial( { color: 0xAAAAAA, opacity: 1, linewidth:0.5 } ) );
		this.m_LineTop  	= new THREE.LineSegments( geometry3, new THREE.LineBasicMaterial( { color: 0xAAAAAA, opacity: 1, linewidth:0.5 } ) );
		this.m_LineBottom 	= new THREE.LineSegments( geometry4, new THREE.LineBasicMaterial( { color: 0xAAAAAA, opacity: 1, linewidth:0.5 } ) );
				
		scene.add(this.m_LineLeft);
		scene.add(this.m_LineRight);
		scene.add(this.m_LineTop);
		scene.add(this.m_LineBottom);			
		
		this.OnHideCtrl();	// 隐藏操控
	};
		
	this.CreatePillar = function()
	{
		if( IsContain(container, renderer2.domElement ) != false )
		{
			alert("请到2D下操作.");
			return;
		}
		OnMouseRightUp();
		m_cPenType = 14;
	  	this.m_pCurFlue = new PillarData();
	  	this.m_pCurFlue.OnInit();	
	};
	
	this.OnClear = function()
	{
		for( var i=0; i<this.mFlueArray.length; i++ )
			this.mFlueArray[i].OnClear();
			
		this.mFlueArray.length = 0;
		this.m_pCurFlue = null;
	};
	
	// 平面上移动
	this.OnMouseMove = function(mouseX,mouseY)
	{
		if( this.m_pCurFlue == null )
			return false;
		this.m_pCurFlue.OnMouseMove(mouseX,mouseY);
		mFloorCameraClass.OnUpdatePillar();
		return true;
	};
	
	// 右键撤销
	this.OnMouseRightUp2D = function()
	{
		if(this.m_pCurFlue && m_cPenType ==14)
		{
			this.OnDelete(this.m_pCurFlue);		
			this.m_pCurFlue = null;
		} 	
		
		this.OnHideCtrl();
		mFloorCameraClass.OnUpdatePillar();
	
	};
			
	// 删除
	this.OnDelete = function(tFlue)
	{			
		this.OnHideCtrl();
		tFlue.OnClear();
		var iIndex = this.mFlueArray.indexOf(tFlue);
		if( iIndex == -1 )
			return;
		this.mFlueArray.splice(iIndex,1);
		mFloorCameraClass.OnUpdatePillar();
	};
	
	this.OnMouseDown  = function()
	{								
		if( true == this.OnMouseMove(g_mouseX,g_mouseY) )
		{
			this.mFlueArray.push(this.m_pCurFlue);
			mFloorCameraClass.OnUpdatePillar();
			this.m_pCurFlue = null;					
			m_cPenType = 0;

			$('#zhuzi').show();
		}
	};
	
	this.OnMouseDown_Flue = function(mouseX,mouseY){
		
		// 点击输入数字区域,保持显示
		this.g_GaiLiQiangJuLi = this.OnShowHelp(mouseX,mouseY);
		if( (this.g_GaiLiQiangJuLi == this.m_LineLeft_Box ||
			this.g_GaiLiQiangJuLi == this.m_LineRight_Box ||
			this.g_GaiLiQiangJuLi == this.m_LineTop_Box ||
			this.g_GaiLiQiangJuLi == this.m_LineBottom_Box) && this.g_GaiLiQiangJuLi)
		{
			return true;
		}
			
		this.m_pCurFlue = null;
		this.mCurMouseX = 0;
		this.mCurMouseY = 0;				

		for( j=0; j<this.mFlueArray.length; j++)
		{
			var Intersections = raycaster.intersectObject(  this.mFlueArray[j].m_RenderData2D );
			for( var i = 0; i< Intersections.length ; i++)
			{						
					this.m_pCurFlue = this.mFlueArray[j];
					this.mCurMouseX = mouseX;
					this.mCurMouseY = mouseY;	
					this.OnShowCtrl(this.mFlueArray[j]);	//  操作框
					this.m_pCurFlue.OnHideCtrl();			//  自身高亮框关闭
					return true;
			}				
		}
		return false;
	};
	
	// 拖拽移动选中的烟道
	this.OnMouseMove_Flue = function(mouseX,mouseY,e){

		if(e.buttons == 1 && this.m_pCurFlue != null)
		{		
			switch( this.m_iSelected )
			{
				case 0:	// 整体移动
				{
					//靠墙
/*					for( var i = 0; i< mHouseClass.mWallClass.mWallArray.length; i++ )
					{
						var ab = mMathClass.ClosestPointOnLine1(
								 mHouseClass.mWallClass.mWallArray[i].m_vStart.x,
								 mHouseClass.mWallClass.mWallArray[i].m_vStart.y,
								 mHouseClass.mWallClass.mWallArray[i].m_vEnd.x,
								 mHouseClass.mWallClass.mWallArray[i].m_vEnd.y, 
								 mouseX,mouseY, this.m_pCurFlue.m_fLength/2+mHouseClass.mWallClass.mWallArray[i].m_fWidth/2+5);	//距离20 吸附	
							if( ab[0] != 0 )
							{
								this.m_pCurFlue.m_vPos.x = ab[1];
								this.m_pCurFlue.m_vPos.y = ab[2];
								this.m_pCurFlue.UpdateFlue();
								this.OnShowCtrl(this.m_pCurFlue);
								this.mCurMouseX = mouseX;
								this.mCurMouseY = mouseY;
								return true;
							}				
					}*/					
					
					this.m_pCurFlue.m_vPos.x += mouseX-this.mCurMouseX;
					this.m_pCurFlue.m_vPos.y += mouseY-this.mCurMouseY;	
					this.m_pCurFlue.UpdateFlue();
				}
				break;
				case 1:	// 左下
				{
					this.m_pCurFlue.m_fLength-= mouseX-this.mCurMouseX;
					this.m_pCurFlue.m_fWidth -= mouseY-this.mCurMouseY;
					this.m_pCurFlue.m_vPos.x += (mouseX-this.mCurMouseX)/2;
					this.m_pCurFlue.m_vPos.y += (mouseY-this.mCurMouseY)/2;
					this.m_pCurFlue.UpdateFlue();
				}
				break;	
				case 2:	// 左上
				{
					this.m_pCurFlue.m_fLength-= mouseX-this.mCurMouseX;
					this.m_pCurFlue.m_fWidth += mouseY-this.mCurMouseY;
					this.m_pCurFlue.m_vPos.x += (mouseX-this.mCurMouseX)/2;
					this.m_pCurFlue.m_vPos.y += (mouseY-this.mCurMouseY)/2;
					this.m_pCurFlue.UpdateFlue();
				}
				break;
				case 3: // 右上
				{
					this.m_pCurFlue.m_fLength+= mouseX-this.mCurMouseX;
					this.m_pCurFlue.m_fWidth += mouseY-this.mCurMouseY;
					this.m_pCurFlue.m_vPos.x += (mouseX-this.mCurMouseX)/2;
					this.m_pCurFlue.m_vPos.y += (mouseY-this.mCurMouseY)/2;
					this.m_pCurFlue.UpdateFlue();					
				}
				break;
				case 4:
				{
					this.m_pCurFlue.m_fLength+= mouseX-this.mCurMouseX;
					this.m_pCurFlue.m_fWidth -= mouseY-this.mCurMouseY;
					this.m_pCurFlue.m_vPos.x += (mouseX-this.mCurMouseX)/2;
					this.m_pCurFlue.m_vPos.y += (mouseY-this.mCurMouseY)/2;
					this.m_pCurFlue.UpdateFlue();					
				}
				break;
				case 5:	// 左中
				{
					this.m_pCurFlue.m_fLength-= mouseX-this.mCurMouseX;
					this.m_pCurFlue.m_vPos.x += (mouseX-this.mCurMouseX)/2;
					this.m_pCurFlue.UpdateFlue();
				}
				break;
				case 6:	// 下中
				{
					this.m_pCurFlue.m_fWidth-= mouseY-this.mCurMouseY;
					this.m_pCurFlue.m_vPos.y+= (mouseY-this.mCurMouseY)/2;
					this.m_pCurFlue.UpdateFlue();
				}
				break;	
				case 7:	// 上中
				{
					this.m_pCurFlue.m_fWidth+= mouseY-this.mCurMouseY;
					this.m_pCurFlue.m_vPos.y+= (mouseY-this.mCurMouseY)/2;
					this.m_pCurFlue.UpdateFlue();
				}
				break;				
				case 8:	// 右中
				{
					this.m_pCurFlue.m_fLength+= mouseX-this.mCurMouseX;
					this.m_pCurFlue.m_vPos.x += (mouseX-this.mCurMouseX)/2;
					this.m_pCurFlue.UpdateFlue();
				}
				break;				
			}
			
		 	this.OnShowCtrl(this.m_pCurFlue);
			this.mCurMouseX = mouseX;
			this.mCurMouseY = mouseY;	
			mFloorCameraClass.OnUpdatePillar();
			return true;
		}
		return false;
	};
	
	this.OnHideCtrl = function()
	{
		this.m_HelpBox.position.x  = -99999;			
		this.m_HelpBox.position.y  = -99999;
		
		this.m_LineLeft.visible   = false;
		this.m_LineRight.visible  = false;
		this.m_LineTop.visible 	  = false;
		this.m_LineBottom.visible = false;		
	};
	
		// 单击显示操作系统
	this.OnShowCtrl = function(tFlue)
	{
		
		this.m_HelpBox.remove(this.m_HelpBox1);
		this.m_HelpBox.remove(this.m_HelpBox2);
		this.m_HelpBox.remove(this.m_HelpBox3);
		this.m_HelpBox.remove(this.m_HelpBox4);
		this.m_HelpBox.remove(this.m_HelpBox5);
		this.m_HelpBox.remove(this.m_HelpBox6);
		this.m_HelpBox.remove(this.m_HelpBox7);
		this.m_HelpBox.remove(this.m_HelpBox8);
		
		this.m_HelpBox.geometry.vertices.length = 0;
		this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(-tFlue.m_fLength/2, -tFlue.m_fWidth/2, 1.3), new THREE.Vector3(-tFlue.m_fLength/2, tFlue.m_fWidth/2, 1.3));	
		this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(-tFlue.m_fLength/2,  tFlue.m_fWidth/2, 1.3), new THREE.Vector3( tFlue.m_fLength/2, tFlue.m_fWidth/2, 1.3));
		this.m_HelpBox.geometry.vertices.push(new THREE.Vector3( tFlue.m_fLength/2,  tFlue.m_fWidth/2, 1.3), new THREE.Vector3( tFlue.m_fLength/2,-tFlue.m_fWidth/2, 1.3));	
		this.m_HelpBox.geometry.vertices.push(new THREE.Vector3( tFlue.m_fLength/2, -tFlue.m_fWidth/2, 1.3), new THREE.Vector3(-tFlue.m_fLength/2,-tFlue.m_fWidth/2, 1.3));
	
		var k = 4;
		// 方块1 (左下)
		this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(-tFlue.m_fLength/2-k, -tFlue.m_fWidth/2-k, 1.5), new THREE.Vector3(-tFlue.m_fLength/2-k, -tFlue.m_fWidth/2+k, 1.5));
		this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(-tFlue.m_fLength/2-k, -tFlue.m_fWidth/2+k, 1.5), new THREE.Vector3(-tFlue.m_fLength/2+k, -tFlue.m_fWidth/2+k, 1.5));
		this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(-tFlue.m_fLength/2+k, -tFlue.m_fWidth/2+k, 1.5), new THREE.Vector3(-tFlue.m_fLength/2+k, -tFlue.m_fWidth/2-k, 1.5));	
		this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(-tFlue.m_fLength/2+k, -tFlue.m_fWidth/2-k, 1.5), new THREE.Vector3(-tFlue.m_fLength/2-k, -tFlue.m_fWidth/2-k, 1.5));	

		var geometry1 	= new THREE.PlaneGeometry( k*2, k*2);
		this.m_HelpBox1	= new THREE.Mesh(geometry1, new THREE.MeshBasicMaterial( { color: 0xFFFFFF } ) ); 
		this.m_HelpBox1.position.x  = -tFlue.m_fLength/2;			
		this.m_HelpBox1.position.y  = -tFlue.m_fWidth/2;
		this.m_HelpBox1.position.z  = 1.4;
		
		// 方块2 (左上)
		this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(-tFlue.m_fLength/2-k, tFlue.m_fWidth/2-k, 1.5), new THREE.Vector3(-tFlue.m_fLength/2-k, tFlue.m_fWidth/2+k, 1.5));
		this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(-tFlue.m_fLength/2-k, tFlue.m_fWidth/2+k, 1.5), new THREE.Vector3(-tFlue.m_fLength/2+k, tFlue.m_fWidth/2+k, 1.5));
		this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(-tFlue.m_fLength/2+k, tFlue.m_fWidth/2+k, 1.5), new THREE.Vector3(-tFlue.m_fLength/2+k, tFlue.m_fWidth/2-k, 1.5));	
		this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(-tFlue.m_fLength/2+k, tFlue.m_fWidth/2-k, 1.5), new THREE.Vector3(-tFlue.m_fLength/2-k, tFlue.m_fWidth/2-k, 1.5));	
		
		var geometry2 	= new THREE.PlaneGeometry( k*2, k*2);
		this.m_HelpBox2	= new THREE.Mesh(geometry2, new THREE.MeshBasicMaterial( { color: 0xFFFFFF } ) ); 
		this.m_HelpBox2.position.x  = -tFlue.m_fLength/2;			
		this.m_HelpBox2.position.y  =  tFlue.m_fWidth/2;
		this.m_HelpBox2.position.z  = 1.4;
		
		// 方块3 (右上)
		this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(tFlue.m_fLength/2-k, tFlue.m_fWidth/2-k, 1.5), new THREE.Vector3(tFlue.m_fLength/2-k, tFlue.m_fWidth/2+k, 1.5));
		this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(tFlue.m_fLength/2-k, tFlue.m_fWidth/2+k, 1.5), new THREE.Vector3(tFlue.m_fLength/2+k, tFlue.m_fWidth/2+k, 1.5));
		this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(tFlue.m_fLength/2+k, tFlue.m_fWidth/2+k, 1.5), new THREE.Vector3(tFlue.m_fLength/2+k, tFlue.m_fWidth/2-k, 1.5));	
		this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(tFlue.m_fLength/2+k, tFlue.m_fWidth/2-k, 1.5), new THREE.Vector3(tFlue.m_fLength/2-k, tFlue.m_fWidth/2-k, 1.5));	
		var geometry3 	= new THREE.PlaneGeometry( k*2, k*2);
		this.m_HelpBox3	= new THREE.Mesh(geometry3, new THREE.MeshBasicMaterial( { color: 0xFFFFFF } ) ); 
		this.m_HelpBox3.position.x  =  tFlue.m_fLength/2;			
		this.m_HelpBox3.position.y  =  tFlue.m_fWidth/2;
		this.m_HelpBox3.position.z  = 1.4;
		
		// 方块4 (右下)
		this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(tFlue.m_fLength/2-k, -tFlue.m_fWidth/2-k, 1.5), new THREE.Vector3(tFlue.m_fLength/2-k, -tFlue.m_fWidth/2+k, 1.5));
		this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(tFlue.m_fLength/2-k, -tFlue.m_fWidth/2+k, 1.5), new THREE.Vector3(tFlue.m_fLength/2+k, -tFlue.m_fWidth/2+k, 1.5));
		this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(tFlue.m_fLength/2+k, -tFlue.m_fWidth/2+k, 1.5), new THREE.Vector3(tFlue.m_fLength/2+k, -tFlue.m_fWidth/2-k, 1.5));	
		this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(tFlue.m_fLength/2+k, -tFlue.m_fWidth/2-k, 1.5), new THREE.Vector3(tFlue.m_fLength/2-k, -tFlue.m_fWidth/2-k, 1.5));	
		var geometry4 	= new THREE.PlaneGeometry( k*2, k*2);
		this.m_HelpBox4	= new THREE.Mesh(geometry4, new THREE.MeshBasicMaterial( { color: 0xFFFFFF } ) ); 
		this.m_HelpBox4.position.x  =  tFlue.m_fLength/2;			
		this.m_HelpBox4.position.y  = -tFlue.m_fWidth/2;
		this.m_HelpBox4.position.z  = 1.4;
		
		
		// 方块5 (左中)
		this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(-tFlue.m_fLength/2-k, 0-k, 1.5), new THREE.Vector3(-tFlue.m_fLength/2-k, 0+k, 1.5));
		this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(-tFlue.m_fLength/2-k, 0+k, 1.5), new THREE.Vector3(-tFlue.m_fLength/2+k, 0+k, 1.5));
		this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(-tFlue.m_fLength/2+k, 0+k, 1.5), new THREE.Vector3(-tFlue.m_fLength/2+k, 0-k, 1.5));	
		this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(-tFlue.m_fLength/2+k, 0-k, 1.5), new THREE.Vector3(-tFlue.m_fLength/2-k, 0-k, 1.5));	
		var geometry5 	= new THREE.PlaneGeometry( k*2, k*2);
		this.m_HelpBox5	= new THREE.Mesh(geometry5, new THREE.MeshBasicMaterial( { color: 0xFFFFFF } ) ); 
		this.m_HelpBox5.position.x  = -tFlue.m_fLength/2;			
		this.m_HelpBox5.position.y  = 0;
		this.m_HelpBox5.position.z  = 1.4;		
		
		// 方块6 (下中)
		this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(0-k, -tFlue.m_fWidth/2-k, 1.5), new THREE.Vector3(0-k, -tFlue.m_fWidth/2+k, 1.5));
		this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(0-k, -tFlue.m_fWidth/2+k, 1.5), new THREE.Vector3(0+k, -tFlue.m_fWidth/2+k, 1.5));
		this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(0+k, -tFlue.m_fWidth/2+k, 1.5), new THREE.Vector3(0+k, -tFlue.m_fWidth/2-k, 1.5));	
		this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(0+k, -tFlue.m_fWidth/2-k, 1.5), new THREE.Vector3(0-k, -tFlue.m_fWidth/2-k, 1.5));	
		var geometry6 	= new THREE.PlaneGeometry( k*2, k*2);
		this.m_HelpBox6	= new THREE.Mesh(geometry6, new THREE.MeshBasicMaterial( { color: 0xFFFFFF } ) ); 
		this.m_HelpBox6.position.x  = 0;			
		this.m_HelpBox6.position.y  = -tFlue.m_fWidth/2;
		this.m_HelpBox6.position.z  = 1.4;		
		
		// 方块7 (上中)
		this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(0-k, tFlue.m_fWidth/2-k, 1.5), new THREE.Vector3(0-k, tFlue.m_fWidth/2+k, 1.5));
		this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(0-k, tFlue.m_fWidth/2+k, 1.5), new THREE.Vector3(0+k, tFlue.m_fWidth/2+k, 1.5));
		this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(0+k, tFlue.m_fWidth/2+k, 1.5), new THREE.Vector3(0+k, tFlue.m_fWidth/2-k, 1.5));	
		this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(0+k, tFlue.m_fWidth/2-k, 1.5), new THREE.Vector3(0-k, tFlue.m_fWidth/2-k, 1.5));	
		var geometry7 	= new THREE.PlaneGeometry( k*2, k*2);
		this.m_HelpBox7	= new THREE.Mesh(geometry6, new THREE.MeshBasicMaterial( { color: 0xFFFFFF } ) ); 
		this.m_HelpBox7.position.x  = 0;			
		this.m_HelpBox7.position.y  = tFlue.m_fWidth/2;
		this.m_HelpBox7.position.z  = 1.4;	
		
		// 方块8 (右中)
		this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(tFlue.m_fLength/2-k, 0-k, 1.5), new THREE.Vector3(tFlue.m_fLength/2-k, 0+k, 1.5));
		this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(tFlue.m_fLength/2-k, 0+k, 1.5), new THREE.Vector3(tFlue.m_fLength/2+k, 0+k, 1.5));
		this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(tFlue.m_fLength/2+k, 0+k, 1.5), new THREE.Vector3(tFlue.m_fLength/2+k, 0-k, 1.5));	
		this.m_HelpBox.geometry.vertices.push(new THREE.Vector3(tFlue.m_fLength/2+k, 0-k, 1.5), new THREE.Vector3(tFlue.m_fLength/2-k, 0-k, 1.5));	
		var geometry8 	= new THREE.PlaneGeometry( k*2, k*2);
		this.m_HelpBox8	= new THREE.Mesh(geometry6, new THREE.MeshBasicMaterial( { color: 0xFFFFFF } ) ); 
		this.m_HelpBox8.position.x  = tFlue.m_fLength/2;			
		this.m_HelpBox8.position.y  = 0;
		this.m_HelpBox8.position.z  = 1.4;			
		
		this.m_HelpBox.geometry.verticesNeedUpdate = true;
		
		this.m_HelpBox.add(this.m_HelpBox1);
		this.m_HelpBox.add(this.m_HelpBox2);
		this.m_HelpBox.add(this.m_HelpBox3);
		this.m_HelpBox.add(this.m_HelpBox4);
		this.m_HelpBox.add(this.m_HelpBox5);
		this.m_HelpBox.add(this.m_HelpBox6);
		this.m_HelpBox.add(this.m_HelpBox7);
		this.m_HelpBox.add(this.m_HelpBox8);
		
		var tmpMatrix2= new THREE.Matrix4().makeRotationZ(tFlue.m_fRotate);
		var tmpMatrix3= new THREE.Matrix4().makeTranslation(tFlue.m_vPos.x,tFlue.m_vPos.y,1.5);
		tmpMatrix3.multiply(tmpMatrix2);
		this.m_HelpBox.rotation.z = 0;
		this.m_HelpBox.position.x = 0;			
		this.m_HelpBox.position.y = 0;
		this.m_HelpBox.position.z = 0;
		this.m_HelpBox.scale.x    = 1;
		this.m_HelpBox.scale.y    = 1;
		this.m_HelpBox.scale.z    = 1;
		this.m_HelpBox.matrixWorld.identity();
		this.m_HelpBox.matrix.identity();
		this.m_HelpBox.updateMatrixWorld(true);
		this.m_HelpBox.applyMatrix(tmpMatrix3);		
		
		// 显示离墙距离
		this.UpdateLabel(tFlue);	//更新到四边的距离 		
	};
	
	/**
	 * @api UpdateLabel(tFlue)
	 * @apiGroup PillarClass
	 * @apiDescription 更新模型到四边的距离
	 * @apiParam (参数) tFlue  当前模型
	 *                             
	 */
	this.UpdateLabel = function(tFlue)
	{
		
		//得到当前所在地面
		var vPos1 = new THREE.Vector3( tFlue.m_RenderData2D.position.x, tFlue.m_RenderData2D.position.y, 10 );
		var vNormal = new THREE.Vector3(0,0,-1);
		var raycaster1 = new THREE.Raycaster(vPos1,vNormal);
			raycaster1.linePrecision = 3;

		var tFloor = null;
		var tDis   =-99999;
		for(var j=0; j<mHouseClass.mFloorClass.mFloorArray.length; j++)
		{
			var Intersections;
			if(mHouseClass.mFloorClass.mFloorArray[j].mFloorMesh.visible == true)
			   Intersections = raycaster1.intersectObject(  mHouseClass.mFloorClass.mFloorArray[j].mFloorMesh );
			else
			   Intersections = raycaster1.intersectObject(  mHouseClass.mFloorClass.mFloorArray[j].mFloorMeshSVG );
			if( Intersections.length>=1)
			{
				if( tDis < mHouseClass.mFloorClass.mFloorArray[j].mfLayer)
				{
					tDis  = mHouseClass.mFloorClass.mFloorArray[j].mfLayer;
					tFloor= mHouseClass.mFloorClass.mFloorArray[j];
				}
			}			
		}
		
		this.m_LineLeft.visible   = false;
		this.m_LineRight.visible  = false;
		this.m_LineTop.visible 	  = false;
		this.m_LineBottom.visible = false;			
		
		if( tFloor == null )// 无过没有地面，则不显示尺寸
			return;
		
		var box = new THREE.Box3();
			box.setFromObject( tFlue.m_RenderData2D );
			
		var posStart1 = new THREE.Vector3(box.min.x,   (box.max.y+box.min.y)/2, 0);
		var posEnd1   = new THREE.Vector3(box.min.x-1, (box.max.y+box.min.y)/2, 0);
		var posStart2 = new THREE.Vector3(box.max.x,   (box.max.y+box.min.y)/2, 0);
		var posEnd2   = new THREE.Vector3(box.max.x+1, (box.max.y+box.min.y)/2, 0);	
		var posStart3 = new THREE.Vector3((box.max.x+box.min.x)/2, box.max.y, 	0);
		var posEnd3   = new THREE.Vector3((box.max.x+box.min.x)/2, box.max.y+1, 0);			
		var posStart4 = new THREE.Vector3((box.max.x+box.min.x)/2, box.min.y, 	0);
		var posEnd4   = new THREE.Vector3((box.max.x+box.min.x)/2, box.min.y-1, 0);			
		var fLeft  = this.GetLiQiangJuLi(posStart1, posEnd1, tFloor);
		var fRight = this.GetLiQiangJuLi(posStart2, posEnd2, tFloor);
		var fTop   = this.GetLiQiangJuLi(posStart3, posEnd3, tFloor);
		var fBottom= this.GetLiQiangJuLi(posStart4, posEnd4, tFloor);
		
		this.m_fLeftOld  = fLeft;
		this.m_fRightOld = fRight;
		this.m_fTopOld	 = fTop;
		this.m_fBottomOld= fBottom;

		if( fLeft !=9999999)
			this.m_LineLeft.visible   = true;
		if( fRight !=9999999)	
			this.m_LineRight.visible  = true;
		if( fTop !=9999999)
			this.m_LineTop.visible 	  = true;
		if( fBottom !=9999999)
			this.m_LineBottom.visible = true;
				
		this.m_LineLeft.geometry.vertices.length 	= 0;
		this.m_LineRight.geometry.vertices.length 	= 0;
		this.m_LineTop.geometry.vertices.length 	= 0;
		this.m_LineBottom.geometry.vertices.length 	= 0;
							
		this.m_LineLeft.geometry.vertices.push(new THREE.Vector3(box.min.x, (box.max.y+box.min.y)/2, 1), 
											   new THREE.Vector3(box.min.x-fLeft, (box.max.y+box.min.y)/2, 1));
		this.m_LineLeft.geometry.verticesNeedUpdate = true;
		
		this.m_LineRight.geometry.vertices.push(new THREE.Vector3(box.max.x, (box.max.y+box.min.y)/2, 1), 
												new THREE.Vector3(box.max.x+fRight, (box.max.y+box.min.y)/2, 1));
		this.m_LineRight.geometry.verticesNeedUpdate = true;
		
		this.m_LineTop.geometry.vertices.push(new THREE.Vector3((box.max.x+box.min.x)/2, box.max.y, 1), 
											  new THREE.Vector3((box.max.x+box.min.x)/2, box.max.y+fTop, 1));
		this.m_LineTop.geometry.verticesNeedUpdate 	= true;
		
		this.m_LineBottom.geometry.vertices.push(new THREE.Vector3((box.max.x+box.min.x)/2, box.min.y, 1), 
												 new THREE.Vector3((box.max.x+box.min.x)/2, box.min.y-fBottom, 0, 1));
		this.m_LineBottom.geometry.verticesNeedUpdate = true;		
			
		this.ShowText(tFlue,fLeft,	0);
		this.ShowText(tFlue,fRight,	1);
		this.ShowText(tFlue,fTop,	2);
		this.ShowText(tFlue,fBottom,3);
	};	
	
	this.ShowText = function(tFlue,fValue,iType)
	{
		var box = new THREE.Box3();
			box.setFromObject( tFlue.m_RenderData2D );
				
		switch(iType)	// 显示离墙距离
		{
			case 0:
			{
				this.m_LineLeft.remove(this.m_LineLeft_Label);
				
				this.m_strLeft_Value = parseInt(fValue).toString();		// 距离值

				// 左边数字
				var shapes = mHouseClass.mFont.generateShapes( parseInt(fValue).toString(), 8 );
				var geometryText = new THREE.ShapeBufferGeometry( shapes );
					geometryText.computeBoundingBox();
				var tWidth = geometryText.boundingBox.max.x - geometryText.boundingBox.min.x;
				var tHeight= geometryText.boundingBox.max.y - geometryText.boundingBox.min.y;		
				geometryText.translate( - 0.5 * tWidth, -0.5*tHeight, 1.2 );
				this.m_LineLeft_Label = new THREE.Mesh( geometryText, mResource.mFontTex );	// 数字mesh
				
				var geometry  = new THREE.BoxBufferGeometry( tWidth+10, tHeight+10, 0);
				geometry.translate( 0, 0, 0.5 );
				// 数字的灰色背景
			  	this.m_LineLeft_Box1= new THREE.Mesh(geometry, new THREE.MeshBasicMaterial( { color: 0xeeeeee, opacity: 1.0, transparent: true } ) ); 
				var tPoly = new THREE.Geometry();					
				tPoly.vertices.push(new THREE.Vector3(-(tWidth+10)/2, -(tHeight+10)/2, 1), new THREE.Vector3(-(tWidth+10)/2, (tHeight+10)/2, 1));				
				tPoly.vertices.push(new THREE.Vector3( (tWidth+10)/2,  (tHeight+10)/2, 1), new THREE.Vector3( (tWidth+10)/2,-(tHeight+10)/2, 1));						
				tPoly.vertices.push(new THREE.Vector3(-(tWidth+10)/2, -(tHeight+10)/2, 1));
				// 数字框线
				this.m_LineLeft_Box = new THREE.Line( tPoly, new THREE.LineBasicMaterial( { color: 0x0088F8, linewidth:1, opacity: 1 } ) );
				
				this.m_LineLeft_Label.add(this.m_LineLeft_Box1);
				this.m_LineLeft_Label.add(this.m_LineLeft_Box);
				this.m_LineLeft_Label.position.x  = box.min.x-fValue/2;			
				this.m_LineLeft_Label.position.y  = (box.max.y+box.min.y)/2;				
				this.m_LineLeft.add(this.m_LineLeft_Label);
			}
			break;
			case 1:
			{
				this.m_LineRight.remove(this.m_LineRight_Label);
				
				this.m_strRight_Value = parseInt(fValue).toString();	// 距离值
				
				// 右边数字
				//===========================================================================================================================
				var shapes1 = mHouseClass.mFont.generateShapes( parseInt(fValue).toString(), 8 );
				var geometryText1 = new THREE.ShapeBufferGeometry( shapes1 );
					geometryText1.computeBoundingBox();
				tWidth = geometryText1.boundingBox.max.x - geometryText1.boundingBox.min.x;
				tHeight= geometryText1.boundingBox.max.y - geometryText1.boundingBox.min.y;		
				geometryText1.translate( - 0.5 * tWidth, -0.5*tHeight, 1.2 );
				this.m_LineRight_Label = new THREE.Mesh( geometryText1, mResource.mFontTex );
				
				var geometry1  = new THREE.BoxBufferGeometry( tWidth+10, tHeight+10, 0);
				geometry1.translate( 0, 0, 0.5 );
			  	this.m_LineRight_Box1= new THREE.Mesh(geometry1, new THREE.MeshBasicMaterial( { color: 0xeeeeee, opacity: 1.0, transparent: true } ) ); 		
				var tPoly1 = new THREE.Geometry();					
				tPoly1.vertices.push(new THREE.Vector3(-(tWidth+10)/2, -(tHeight+10)/2, 1), new THREE.Vector3(-(tWidth+10)/2, (tHeight+10)/2, 1));				
				tPoly1.vertices.push(new THREE.Vector3( (tWidth+10)/2,  (tHeight+10)/2, 1), new THREE.Vector3( (tWidth+10)/2,-(tHeight+10)/2, 1));						
				tPoly1.vertices.push(new THREE.Vector3(-(tWidth+10)/2, -(tHeight+10)/2, 1));
				this.m_LineRight_Box = new THREE.Line( tPoly1, new THREE.LineBasicMaterial( { color: 0x0088F8, linewidth:1, opacity: 1 } ) );
				this.m_LineRight_Label.add(this.m_LineRight_Box);
				this.m_LineRight_Label.add(this.m_LineRight_Box1);
				this.m_LineRight_Label.position.x  = box.max.x+fValue/2;			
				this.m_LineRight_Label.position.y  = (box.max.y+box.min.y)/2;	
				//===========================================================================================================================		
				this.m_LineRight.add(this.m_LineRight_Label);
			}
			break;
			case 2:
			{
				this.m_LineTop.remove(this.m_LineTop_Label);
				this.m_strTop_Value = parseInt(fValue).toString();
						
				// 顶部数字
				//===========================================================================================================================
				var shapes2 = mHouseClass.mFont.generateShapes( parseInt(fValue).toString(), 8 );
				var geometryText2 = new THREE.ShapeBufferGeometry( shapes2 );
					geometryText2.computeBoundingBox();
				tWidth = geometryText2.boundingBox.max.x - geometryText2.boundingBox.min.x;
				tHeight= geometryText2.boundingBox.max.y - geometryText2.boundingBox.min.y;		
				geometryText2.translate( - 0.5 * tWidth, -0.5*tHeight, 1.2 );
				this.m_LineTop_Label = new THREE.Mesh( geometryText2, mResource.mFontTex );
				
				var geometry2  = new THREE.BoxBufferGeometry( tWidth+10, tHeight+10, 0);
				geometry2.translate( 0, 0, 0.5 );
			  	this.m_LineTop_Box1= new THREE.Mesh(geometry2, new THREE.MeshBasicMaterial( { color: 0xeeeeee, opacity: 1.0, transparent: true } ) ); 
				this.m_LineTop_Label.add(this.m_LineTop_Box1);
				
				var tPoly2 = new THREE.Geometry();					
				tPoly2.vertices.push(new THREE.Vector3(-(tWidth+10)/2, -(tHeight+10)/2, 1), new THREE.Vector3(-(tWidth+10)/2, (tHeight+10)/2, 1));				
				tPoly2.vertices.push(new THREE.Vector3( (tWidth+10)/2,  (tHeight+10)/2, 1), new THREE.Vector3( (tWidth+10)/2,-(tHeight+10)/2, 1));						
				tPoly2.vertices.push(new THREE.Vector3(-(tWidth+10)/2, -(tHeight+10)/2, 1));
				this.m_LineTop_Box = new THREE.Line( tPoly2, new THREE.LineBasicMaterial( { color: 0x0088F8, linewidth:1, opacity: 1 } ) );
				this.m_LineTop_Label.add(this.m_LineTop_Box);
		
				this.m_LineTop_Label.position.x  = (box.max.x+box.min.x)/2;
				this.m_LineTop_Label.position.y  = box.max.y+fValue/2;	
				//===========================================================================================================================				
				this.m_LineTop.add(this.m_LineTop_Label);
			}
			break;
			case 3:
			{
				this.m_LineBottom.remove(this.m_LineBottom_Label);
				this.m_strBottom_Value = parseInt(fValue).toString();		
				// 底部数字
				//===========================================================================================================================
				var shapes3 = mHouseClass.mFont.generateShapes( parseInt(fValue).toString(), 8 );
				var geometryText3 = new THREE.ShapeBufferGeometry( shapes3 );
					geometryText3.computeBoundingBox();
				tWidth = geometryText3.boundingBox.max.x - geometryText3.boundingBox.min.x;
				tHeight= geometryText3.boundingBox.max.y - geometryText3.boundingBox.min.y;		
				geometryText3.translate( - 0.5 * tWidth, -0.5*tHeight, 1.2 );		
				this.m_LineBottom_Label = new THREE.Mesh( geometryText3, mResource.mFontTex );
				
				var geometry3  = new THREE.BoxBufferGeometry( tWidth+10, tHeight+10, 0);
				geometry3.translate( 0, 0, 0.5 );
			  	this.m_LineBottom_Box1 = new THREE.Mesh(geometry3, new THREE.MeshBasicMaterial( { color: 0xeeeeee, opacity: 1.0, transparent: true } ) ); 
				this.m_LineBottom_Label.add(this.m_LineBottom_Box1);
				var tPoly3 = new THREE.Geometry();					
				tPoly3.vertices.push(new THREE.Vector3(-(tWidth+10)/2, -(tHeight+10)/2, 1), new THREE.Vector3(-(tWidth+10)/2, (tHeight+10)/2, 1));				
				tPoly3.vertices.push(new THREE.Vector3( (tWidth+10)/2,  (tHeight+10)/2, 1), new THREE.Vector3( (tWidth+10)/2,-(tHeight+10)/2, 1));						
				tPoly3.vertices.push(new THREE.Vector3(-(tWidth+10)/2, -(tHeight+10)/2, 1));
				this.m_LineBottom_Box = new THREE.Line( tPoly3, new THREE.LineBasicMaterial( { color: 0x0088F8, linewidth:1, opacity: 1 } ) );
				this.m_LineBottom_Label.add(this.m_LineBottom_Box);		
				this.m_LineBottom_Label.position.x  = (box.max.x+box.min.x)/2;			
				this.m_LineBottom_Label.position.y  = box.min.y-fValue/2;	
				//===========================================================================================================================				
				this.m_LineBottom.add(this.m_LineBottom_Label);
			}
			break;
		}		
	};	
	
	this.UpdateText = function(tFlue,fValue,iType)
	{
		// 只更新文字，不更新位置
		var box = new THREE.Box3();
			box.setFromObject( tFlue.m_RenderData2D );
		// 显示离墙距离		
		switch(iType)
		{
			case 0:
			{
				
				var fx = this.m_LineLeft_Label.position.x;
				var fy = this.m_LineLeft_Label.position.y;
				this.m_LineLeft.remove(this.m_LineLeft_Label);
				
				this.m_strLeft_Value = parseInt(fValue).toString();

				// 左边数字
				var shapes = mHouseClass.mFont.generateShapes( parseInt(fValue).toString(), 8 );
				var geometryText = new THREE.ShapeBufferGeometry( shapes );
					geometryText.computeBoundingBox();
				var tWidth = geometryText.boundingBox.max.x - geometryText.boundingBox.min.x;
				var tHeight= geometryText.boundingBox.max.y - geometryText.boundingBox.min.y;		
				geometryText.translate( - 0.5 * tWidth, -0.5*tHeight, 1.2 );
				this.m_LineLeft_Label = new THREE.Mesh( geometryText, mResource.mFontTex );
				
				var geometry  = new THREE.BoxBufferGeometry( tWidth+10, tHeight+10, 0);
				geometry.translate( 0, 0, 0.5 );
			  	this.m_LineLeft_Box1= new THREE.Mesh(geometry, new THREE.MeshBasicMaterial( { color: 0xeeeeee, opacity: 1.0, transparent: true } ) ); 
				var tPoly = new THREE.Geometry();					
				tPoly.vertices.push(new THREE.Vector3(-(tWidth+10)/2, -(tHeight+10)/2, 1), new THREE.Vector3(-(tWidth+10)/2, (tHeight+10)/2, 1));				
				tPoly.vertices.push(new THREE.Vector3( (tWidth+10)/2,  (tHeight+10)/2, 1), new THREE.Vector3( (tWidth+10)/2,-(tHeight+10)/2, 1));						
				tPoly.vertices.push(new THREE.Vector3(-(tWidth+10)/2, -(tHeight+10)/2, 1));
				this.m_LineLeft_Box = new THREE.Line( tPoly, new THREE.LineBasicMaterial( { color: 0x0088F8, linewidth:1, opacity: 1 } ) );
				this.m_LineLeft_Label.add(this.m_LineLeft_Box1);
				this.m_LineLeft_Label.add(this.m_LineLeft_Box);
				this.m_LineLeft_Label.position.x  = fx;			
				this.m_LineLeft_Label.position.y  = fy;				
				this.m_LineLeft.add(this.m_LineLeft_Label);
			}
			break;
			case 1:
			{
				var fx = this.m_LineRight_Label.position.x;
				var fy = this.m_LineRight_Label.position.y;				
				this.m_LineRight.remove(this.m_LineRight_Label);
				
				this.m_strRight_Value = parseInt(fValue).toString();
				
				// 右边数字
				//===========================================================================================================================
				var shapes1 = mHouseClass.mFont.generateShapes( parseInt(fValue).toString(), 8 );
				var geometryText1 = new THREE.ShapeBufferGeometry( shapes1 );
					geometryText1.computeBoundingBox();
				tWidth = geometryText1.boundingBox.max.x - geometryText1.boundingBox.min.x;
				tHeight= geometryText1.boundingBox.max.y - geometryText1.boundingBox.min.y;		
				geometryText1.translate( - 0.5 * tWidth, -0.5*tHeight, 1.2 );
				this.m_LineRight_Label = new THREE.Mesh( geometryText1, mResource.mFontTex );
				
				var geometry1  = new THREE.BoxBufferGeometry( tWidth+10, tHeight+10, 0);
				geometry1.translate( 0, 0, 0.5 );
			  	this.m_LineRight_Box1= new THREE.Mesh(geometry1, new THREE.MeshBasicMaterial( { color: 0xeeeeee, opacity: 1.0, transparent: true } ) ); 		
				var tPoly1 = new THREE.Geometry();					
				tPoly1.vertices.push(new THREE.Vector3(-(tWidth+10)/2, -(tHeight+10)/2, 1), new THREE.Vector3(-(tWidth+10)/2, (tHeight+10)/2, 1));				
				tPoly1.vertices.push(new THREE.Vector3( (tWidth+10)/2,  (tHeight+10)/2, 1), new THREE.Vector3( (tWidth+10)/2,-(tHeight+10)/2, 1));						
				tPoly1.vertices.push(new THREE.Vector3(-(tWidth+10)/2, -(tHeight+10)/2, 1));
				this.m_LineRight_Box = new THREE.Line( tPoly1, new THREE.LineBasicMaterial( { color: 0x0088F8, linewidth:1, opacity: 1 } ) );
				this.m_LineRight_Label.add(this.m_LineRight_Box);
				this.m_LineRight_Label.add(this.m_LineRight_Box1);
				this.m_LineRight_Label.position.x  = fx;			
				this.m_LineRight_Label.position.y  = fy;	
				//===========================================================================================================================		
				this.m_LineRight.add(this.m_LineRight_Label);
			}
			break;
			case 2:
			{
				var fx = this.m_LineTop_Label.position.x;
				var fy = this.m_LineTop_Label.position.y;				
				this.m_LineTop.remove(this.m_LineTop_Label);
				this.m_strTop_Value = parseInt(fValue).toString();
						
				// 顶部数字
				//===========================================================================================================================
				var shapes2 = mHouseClass.mFont.generateShapes( parseInt(fValue).toString(), 8 );
				var geometryText2 = new THREE.ShapeBufferGeometry( shapes2 );
					geometryText2.computeBoundingBox();
				tWidth = geometryText2.boundingBox.max.x - geometryText2.boundingBox.min.x;
				tHeight= geometryText2.boundingBox.max.y - geometryText2.boundingBox.min.y;		
				geometryText2.translate( - 0.5 * tWidth, -0.5*tHeight, 1.2 );
				this.m_LineTop_Label = new THREE.Mesh( geometryText2, mResource.mFontTex );
				
				var geometry2  = new THREE.BoxBufferGeometry( tWidth+10, tHeight+10, 0);
				geometry2.translate( 0, 0, 0.5 );
			  	this.m_LineTop_Box1= new THREE.Mesh(geometry2, new THREE.MeshBasicMaterial( { color: 0xeeeeee, opacity: 1.0, transparent: true } ) ); 
				this.m_LineTop_Label.add(this.m_LineTop_Box1);
				
				var tPoly2 = new THREE.Geometry();					
				tPoly2.vertices.push(new THREE.Vector3(-(tWidth+10)/2, -(tHeight+10)/2, 1), new THREE.Vector3(-(tWidth+10)/2, (tHeight+10)/2, 1));				
				tPoly2.vertices.push(new THREE.Vector3( (tWidth+10)/2,  (tHeight+10)/2, 1), new THREE.Vector3( (tWidth+10)/2,-(tHeight+10)/2, 1));						
				tPoly2.vertices.push(new THREE.Vector3(-(tWidth+10)/2, -(tHeight+10)/2, 1));
				this.m_LineTop_Box = new THREE.Line( tPoly2, new THREE.LineBasicMaterial( { color: 0x0088F8, linewidth:1, opacity: 1 } ) );
				this.m_LineTop_Label.add(this.m_LineTop_Box);
		
				this.m_LineTop_Label.position.x  = fx;
				this.m_LineTop_Label.position.y  = fy;	
				//===========================================================================================================================				
				this.m_LineTop.add(this.m_LineTop_Label);
			}
			break;
			case 3:
			{
				var fx = this.m_LineBottom_Label.position.x;
				var fy = this.m_LineBottom_Label.position.y;				
				this.m_LineBottom.remove(this.m_LineBottom_Label);
				this.m_strBottom_Value = parseInt(fValue).toString();		
				// 底部数字
				//===========================================================================================================================
				var shapes3 = mHouseClass.mFont.generateShapes( parseInt(fValue).toString(), 8 );
				var geometryText3 = new THREE.ShapeBufferGeometry( shapes3 );
					geometryText3.computeBoundingBox();
				tWidth = geometryText3.boundingBox.max.x - geometryText3.boundingBox.min.x;
				tHeight= geometryText3.boundingBox.max.y - geometryText3.boundingBox.min.y;		
				geometryText3.translate( - 0.5 * tWidth, -0.5*tHeight, 1.2 );		
				this.m_LineBottom_Label = new THREE.Mesh( geometryText3, mResource.mFontTex );
				
				var geometry3  = new THREE.BoxBufferGeometry( tWidth+10, tHeight+10, 0);
				geometry3.translate( 0, 0, 0.5 );
			  	this.m_LineBottom_Box1 = new THREE.Mesh(geometry3, new THREE.MeshBasicMaterial( { color: 0xeeeeee, opacity: 1.0, transparent: true } ) ); 
				this.m_LineBottom_Label.add(this.m_LineBottom_Box1);
				var tPoly3 = new THREE.Geometry();					
				tPoly3.vertices.push(new THREE.Vector3(-(tWidth+10)/2, -(tHeight+10)/2, 1), new THREE.Vector3(-(tWidth+10)/2, (tHeight+10)/2, 1));				
				tPoly3.vertices.push(new THREE.Vector3( (tWidth+10)/2,  (tHeight+10)/2, 1), new THREE.Vector3( (tWidth+10)/2,-(tHeight+10)/2, 1));						
				tPoly3.vertices.push(new THREE.Vector3(-(tWidth+10)/2, -(tHeight+10)/2, 1));
				this.m_LineBottom_Box = new THREE.Line( tPoly3, new THREE.LineBasicMaterial( { color: 0x0088F8, linewidth:1, opacity: 1 } ) );
				this.m_LineBottom_Label.add(this.m_LineBottom_Box);		
				this.m_LineBottom_Label.position.x  = fx;			
				this.m_LineBottom_Label.position.y  = fy;	
				//===========================================================================================================================				
				this.m_LineBottom.add(this.m_LineBottom_Label);
			}
			break;
		}		
	};			
		
	this.GetLiQiangJuLi = function(posStart1, posEnd1, tFloor)
	{
		var vVec;	
		tDis   =9999999;
	    for(var i = 0; i<tFloor.mLabelArray.length; i++)
	    {
	        PosArray  = mMathClass.Get2Line(posStart1,posEnd1,tFloor.mLabelArray[i].m_vStart_Floor,tFloor.mLabelArray[i].m_vEnd_Floor);
	        if( PosArray[0] == true )
	        {
	        	var vVec1 = new THREE.Vector3(PosArray[1],PosArray[2],0);
	        	
	        	var f1 = vVec1.distanceTo(posStart1);
	        	var f2 = vVec1.distanceTo(posEnd1);

	        	if(f1 > f2)
	        	{
					if( tDis > f1)
					{
						var maxX=(tFloor.mLabelArray[i].m_vStart_Floor.x>tFloor.mLabelArray[i].m_vEnd_Floor.x)?tFloor.mLabelArray[i].m_vStart_Floor.x:tFloor.mLabelArray[i].m_vEnd_Floor.x;
	        			var minX=(tFloor.mLabelArray[i].m_vStart_Floor.x<tFloor.mLabelArray[i].m_vEnd_Floor.x)?tFloor.mLabelArray[i].m_vStart_Floor.x:tFloor.mLabelArray[i].m_vEnd_Floor.x;
	        			var maxY=(tFloor.mLabelArray[i].m_vStart_Floor.y>tFloor.mLabelArray[i].m_vEnd_Floor.y)?tFloor.mLabelArray[i].m_vStart_Floor.y:tFloor.mLabelArray[i].m_vEnd_Floor.y;
	        			var minY=(tFloor.mLabelArray[i].m_vStart_Floor.y<tFloor.mLabelArray[i].m_vEnd_Floor.y)?tFloor.mLabelArray[i].m_vStart_Floor.y:tFloor.mLabelArray[i].m_vEnd_Floor.y;
	      				// 线段内	
	      				if( vVec1.x <= maxX && vVec1.x >= minX && vVec1.y <= maxY && vVec1.y >= minY )
	      				{
							tDis  = f1;
							vVec  = vVec1;
						}
					}	        		
	        	}
	       }
	    }	
	    
	    return tDis;
	};	
		
	// 鼠标移动上去显示高亮
	this.OnShowHelp = function(mouseX, mouseY)
	{
		$('#container' ).css("cursor","default");	
		
		if(this.m_LineLeft_Box != undefined && this.m_LineLeft_Box != null)
		   this.m_LineLeft_Box.material.color.set(0x0088F8);
		if(this.m_LineRight_Box!= undefined && this.m_LineRight_Box != null)
		   this.m_LineRight_Box.material.color.set(0x0088F8);
		if(this.m_LineTop_Box  != undefined && this.m_LineTop_Box != null)   
		   this.m_LineTop_Box.material.color.set(0x0088F8);
		if(this.m_LineBottom_Box!= undefined&& this.m_LineBottom_Box != null)
		   this.m_LineBottom_Box.material.color.set(0x0088F8);
			   
		for(var j=0; j<this.mFlueArray.length; j++)
			this.mFlueArray[j].OnHideCtrl();
		
		// 整体移动
		for( j=0; j<this.mFlueArray.length; j++)
		{
			var Intersections = raycaster.intersectObject(  this.mFlueArray[j].m_RenderData2D );
			if(Intersections.length>0)
			{		
				$('#container' ).css("cursor","move");
				this.mFlueArray[j].OnShowHelp();
				this.OnShowCtrl_Cursor(this.mFlueArray[j],mouseX, mouseY);
				return this.mFlueArray[j];
			}				
		}
		
		// 选中尺寸标注
		var Intersections;
		if(this.m_LineLeft_Box != undefined && this.m_LineLeft_Box != null)
		{
			Intersections = raycaster.intersectObject(  this.m_LineLeft_Box1 );
			if(Intersections.length>0)
			{		
				$('#container' ).css("cursor","text");					
				this.m_LineLeft_Box.material.color.set(0xffff88);
				return this.m_LineLeft_Box;
			}	
		}
		if(this.m_LineRight_Box!= undefined && this.m_LineRight_Box != null)
		{
			Intersections = raycaster.intersectObject(  this.m_LineRight_Box1 );
			if(Intersections.length>0)
			{		
				$('#container' ).css("cursor","text");					
				this.m_LineRight_Box.material.color.set(0xffff88);
				return this.m_LineRight_Box;
			}
		}
		if(this.m_LineTop_Box  != undefined && this.m_LineTop_Box != null) 
		{
			Intersections = raycaster.intersectObject(  this.m_LineTop_Box1 );
			if(Intersections.length>0)
			{		
				$('#container' ).css("cursor","text");					  
				this.m_LineTop_Box.material.color.set(0xffff88);
				return this.m_LineTop_Box;
			}
		}
		
		if(this.m_LineBottom_Box!= undefined&& this.m_LineBottom_Box != null)
		{
			Intersections = raycaster.intersectObject(  this.m_LineBottom_Box1 );
			if(Intersections.length>0)
			{		
				$('#container' ).css("cursor","text");				
				this.m_LineBottom_Box.material.color.set(0xffff88); 
				return this.m_LineBottom_Box;
			}
		}		
		
		// 左下点
		return null;
	};
	
	// 显示
	this.OnShowCtrl_Cursor = function(tFlue,mouseX, mouseY)
	{
		this.m_iSelected = 0;
		if(this.m_HelpBox1== undefined)
			return;
		var Intersections = raycaster.intersectObject( this.m_HelpBox1 );
		if(Intersections.length>0)
		{		
			$('#container' ).css("cursor","ne-resize");
			this.m_iSelected = 1;
			return;
		}
		
		Intersections = raycaster.intersectObject( this.m_HelpBox2 );
		if(Intersections.length>0)
		{		
			$('#container' ).css("cursor","se-resize");
			this.m_iSelected = 2;
			return;
		}	
		
		Intersections = raycaster.intersectObject( this.m_HelpBox3 );
		if(Intersections.length>0)
		{		
			$('#container' ).css("cursor","ne-resize");
			this.m_iSelected = 3;
			return;
		}
		
		Intersections = raycaster.intersectObject( this.m_HelpBox4 );
		if(Intersections.length>0)
		{		
			$('#container' ).css("cursor","se-resize");
			this.m_iSelected = 4;
			return;
		}
		
		Intersections = raycaster.intersectObject( this.m_HelpBox5 );	// 左中
		if(Intersections.length>0)
		{		
			$('#container' ).css("cursor","w-resize");
			this.m_iSelected = 5;
			return;
		}
		
		Intersections = raycaster.intersectObject( this.m_HelpBox6 );	// 下中
		if(Intersections.length>0)
		{		
			$('#container' ).css("cursor","s-resize");
			this.m_iSelected = 6;
			return;
		}
		
		Intersections = raycaster.intersectObject( this.m_HelpBox7 );	// 上中
		if(Intersections.length>0)
		{		
			$('#container' ).css("cursor","s-resize");
			this.m_iSelected = 7;
			return;
		}
		
		Intersections = raycaster.intersectObject( this.m_HelpBox8 );	// 右中
		if(Intersections.length>0)
		{		
			$('#container' ).css("cursor","w-resize");
			this.m_iSelected = 8;
			return;
		}
	};
	
	// 生成3D
	this.OnUpdate3D = function()
	{
		for(var i=0; i<this.mFlueArray.length; i++)
			this.mFlueArray[i].OnUpdate3D();
	};
	
	/**
	 * @api OnKeyDown(iKey)
	 * @apiGroup PillarClass
	 * @apiDescription 键盘操作
	 * @apiParam (参数) iKey  键盘值
	 *                             
	 */		
	this.OnKeyDown = function(iKey)
	{
		// 键盘操作
		if(this.m_pCurFlue== null)
			return false;
				
		switch(iKey)
		{
			case 46:	// 删除
			{
			   if(this.m_pCurFlue)
			   	 this.OnDelete(this.m_pCurFlue);
			   this.m_pCurFlue = null;
			}
			return true;
		}
		
		if((this.m_HelpBox.position.x  != -99999 || 
			this.m_HelpBox.position.y  != -99999 ) && 
			this.g_GaiLiQiangJuLi  != null && this.m_pCurFlue != null)	// 调整svg离墙距离
		{
			
			var a=e.keyCode;
			if( a == 46||a == 48||
				a == 49||a == 50||
				a == 51||a == 52||
				a == 53||a == 54||
				a == 55||a == 56||
				a == 57)
			{
				if( this.g_GaiLiQiangJuLi ==  this.m_LineLeft_Box)
				{
					var strText = this.m_strLeft_Value;
					if(strText.length<5)
					{
					   strText +=String.fromCharCode(a);			
					   this.UpdateText(this.m_pCurFlue,parseInt(strText),0);
					   this.g_GaiLiQiangJuLi =  this.m_LineLeft_Box;
					}
					return true;
				}
				if( this.g_GaiLiQiangJuLi ==  this.m_LineRight_Box)
				{
					var strText = this.m_strRight_Value;
					if(strText.length<5)
					{
					   strText +=String.fromCharCode(a);			
					   this.UpdateText(this.m_pCurFlue,parseInt(strText),1);
					   this.g_GaiLiQiangJuLi =  this.m_LineRight_Box;
					}	
					return true;
				}
				if( this.g_GaiLiQiangJuLi ==  this.m_LineTop_Box)
				{
					var strText = this.m_strTop_Value;
					if(strText.length<5)
					{
					   strText +=String.fromCharCode(a);			
					   this.UpdateText(this.m_pCurFlue,parseInt(strText),2);
					   this.g_GaiLiQiangJuLi =  this.m_LineTop_Box;
					}
					return true;
				}
				if( this.g_GaiLiQiangJuLi ==  this.m_LineBottom_Box)
				{
					var strText = this.m_strBottom_Value;
					if(strText.length<5)
					{
					   strText +=String.fromCharCode(a);			
					   this.UpdateText(this.m_pCurFlue,parseInt(strText),3);
					   this.g_GaiLiQiangJuLi =  this.m_LineBottom_Box;
					}
					return true;
				}
			}
			
			if( a== 8 )		// 后退
			{			
				if( this.g_GaiLiQiangJuLi ==  this.m_LineLeft_Box)
				{
					var strText = this.m_strLeft_Value;
						if(strText.length == 1)
						   strText = 0;
						else
							strText = strText.slice(0,strText.length-1);			
					this.UpdateText(this.m_pCurFlue,parseInt(strText),0);
					this.g_GaiLiQiangJuLi =  this.m_LineLeft_Box;
					return true;
				}
				if( this.g_GaiLiQiangJuLi ==  this.m_LineRight_Box)
				{
					var strText = this.m_strRight_Value;
						if(strText.length == 1)
						   strText = 0;
						else				
						   strText = strText.slice(0,strText.length-1);	
					this.UpdateText(this.m_pCurFlue,parseInt(strText),1);
					this.g_GaiLiQiangJuLi =  this.m_LineRight_Box;	
					return true;
				}
				if( this.g_GaiLiQiangJuLi ==  this.m_LineTop_Box)
				{
					var strText = this.m_strTop_Value;
						if(strText.length == 1)
						   strText = 0;
						else
						   strText = strText.slice(0,strText.length-1);
					this.UpdateText(this.m_pCurFlue,parseInt(strText),2);
					this.g_GaiLiQiangJuLi =  this.m_LineTop_Box;
					return true;
				}
				if( this.g_GaiLiQiangJuLi ==  this.m_LineBottom_Box)
				{
					var strText = this.m_strBottom_Value;
						if(strText.length == 1)
						   strText = 0;
						else
						   strText = strText.slice(0,strText.length-1);		
					this.UpdateText(this.m_pCurFlue,parseInt(strText),3);
					this.g_GaiLiQiangJuLi =  this.m_LineBottom_Box;
					return true;
				}			
			}
			
			if( a == 13 )	// 回车移动
			{			
				if( this.g_GaiLiQiangJuLi ==  this.m_LineLeft_Box)
				{
					this.m_pCurFlue.m_vPos.x -= this.m_fLeftOld-parseInt(this.m_strLeft_Value);	
					this.m_pCurFlue.UpdateFlue();
					this.OnShowCtrl(this.m_pCurFlue);
					this.g_GaiLiQiangJuLi =  this.m_LineLeft_Box;
					return true;
				}
				if( this.g_GaiLiQiangJuLi ==  this.m_LineRight_Box)
				{
					this.m_pCurFlue.m_vPos.x +=this.m_fRightOld -parseInt(this.m_strRight_Value);
					this.m_pCurFlue.UpdateFlue();
					this.OnShowCtrl(this.m_pCurFlue);
					this.g_GaiLiQiangJuLi =  this.m_LineRight_Box;	
					return true;
				}
				if( this.g_GaiLiQiangJuLi ==  this.m_LineTop_Box)
				{
					this.m_pCurFlue.m_vPos.y +=this.m_fTopOld-parseInt(this.m_strTop_Value);
					this.m_pCurFlue.UpdateFlue();
					this.OnShowCtrl(this.m_pCurFlue);
					this.g_GaiLiQiangJuLi =  this.m_LineTop_Box;
					return true;
				}
				if( this.g_GaiLiQiangJuLi ==  this.m_LineBottom_Box)
				{
					this.m_pCurFlue.m_vPos.y -=this.m_fBottomOld-parseInt(this.m_strBottom_Value);
					this.m_pCurFlue.UpdateFlue();
					this.OnShowCtrl(this.m_pCurFlue);
					this.g_GaiLiQiangJuLi =  this.m_LineBottom_Box;
					return true;
				}			
			}
		}		
		
		return false;
	};	
}