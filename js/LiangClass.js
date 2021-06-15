function LiangClass()
{
	//梁模块
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
	this.m_iSelected = 0;
	this.OnInit = function()
	{	
		var result_poly = new THREE.Geometry();					
		result_poly.vertices.push(new THREE.Vector3(-0.5, -0.5, 1), new THREE.Vector3(-0.5, 0.5, 1));				
		result_poly.vertices.push(new THREE.Vector3( 0.5,  0.5, 1), new THREE.Vector3( 0.5,-0.5, 1));						
		this.m_HelpBox = new THREE.LineSegments( result_poly, new THREE.LineBasicMaterial( { color: 0x00A2E8, linewidth:1, opacity: 1 } ) );
		scene.add(this.m_HelpBox);
		
		this.OnHideCtrl();	// 隐藏操控
	};
		
	this.CreateLiang = function()
	{
		// 创建梁
		if( IsContain(container, renderer2.domElement ) != false )
		{
			alert("请到2D下操作.");
			return;
		}
		OnMouseRightUp();
		m_cPenType = 21;
	  	this.m_pCurFlue = new LiangData();
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
		
		return true;
	};
	
	// 右键撤销
	this.OnMouseRightUp2D = function()
	{
		if(this.m_pCurFlue && m_cPenType ==21)
		{
			this.OnDelete(this.m_pCurFlue);		
			this.m_pCurFlue = null;
		} 	
		
		this.OnHideCtrl();
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
	};
	
	this.OnMouseDown  = function()
	{								
		if( true == this.OnMouseMove(g_mouseX,g_mouseY) )
		{
			this.mFlueArray.push(this.m_pCurFlue);
			this.m_pCurFlue = null;					
			m_cPenType = 0;
		}
	};
	
	this.OnMouseDown_Flue = function(mouseX,mouseY){
		
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
			return true;
		}
		return false;
	};
	
	this.OnHideCtrl = function()
	{
		this.m_HelpBox.position.x  = -99999;			
		this.m_HelpBox.position.y  = -99999;	
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
	};

	// 鼠标移动上去显示高亮
	
	this.OnShowHelp = function(mouseX, mouseY)
	{
		$('#container' ).css("cursor","default");	
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
			case 32:	// 空格键
			{
				this.m_pCurFlue.m_fRotate+= Math.PI/2;
			//	this.m_pCurFlue.m_fRotate =(this.m_pCurFlue.m_fRotate%360)*360/Math.PI;
				this.m_pCurFlue.UpdateFlue();
				this.OnShowCtrl(this.m_pCurFlue);
			}
			return true;			
		}
		
		return false;
	};	
}