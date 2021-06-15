/**
 * @api WallData
 * @apiGroup WallData
 * @apiName  0
 * @apiDescription 每段墙体类
 * @apiParam (成员变量) m_vStart  起点
 * @apiParam (成员变量) m_vEnd 	   终点
 * @apiParam (成员变量) m_vCenter 中心点
 * @apiParam (成员变量) m_fLength 墙体长度
 * @apiParam (成员变量) m_fWidth  墙体宽度
 * @apiParam (成员变量) m_fHeight 墙体高度
 * @apiParam (成员变量) m_fRotate 旋转弧度
 * @apiParam (成员变量) m_fValue  捕捉精度常数
 */
function WallData()
{
		this.m_vStart;		// 起点			
		this.m_vEnd;		// 终点			
		this.m_vCenter;		// 中心点		
		this.m_fLength;		// 长度
		this.m_iType		= 0;		// 0 墙中线对齐，1内墙线对齐，2外墙线对齐
		this.m_fWidth	   	= 20;
		this.m_fHeight     	= 280;	// 高度
		this.m_fRotate;				// 旋转弧度
		this.m_fValue      	= 0;
		this.m_WallLineArray;		// 计算用线条
		this.m_LastLineArray;		// 渲染用线条
		this.mCurMouseX 	= 0;
		this.mCurMouseY 	= 0;
		
		this.mLabel;		// 标注尺寸线
		this.mText;			// 尺寸文字
		this.m_bShowLabel;	// 2D下是否显示标注到外侧

		this.m_iWallType = 0; // 墙体类型 0 非承重墙; 1承重墙; 2矮墙（m_fHeight相关)
		this.mWall;			  // 辅助墙体
		this.m_fLayer = 0.8;  // 帮助层高
		this.mLoadBearingWall;// 承重墙显示
		this.mLowWall;		  // 矮墙显示
		this.mHelpPos1;
		this.mHelpPos2
		
		/**
		 * @api OnInit
		 * @apiDescription 初始化函数
		 * @apiGroup WallData                        
		 */			
		this.OnInit = function( x1,y1,iType )
		{
			this.m_iType  = iType;
			this.m_fWidth = app.attributeInterface.wall.width.int/10;	//墙体宽度
			this.m_bShowLabel = true;	// 是否显示尺寸
			
			this.m_vStart  		 = new THREE.Vector3( x1, y1, 0 );
			this.m_vEnd		 	 = new THREE.Vector3( x1, y1, 0 );
			this.m_vCenter 		 = new THREE.Vector3( x1, y1, 0 );    
			
     		this.m_WallLineArray = new Array();
     		var geom = new THREE.Geometry();
     		
     		if(this.m_iType == 0 )	// 0 墙中线对齐，1内墙线对齐，2外墙线对齐
     		   this.m_fValue =0;
     		if(this.m_iType == 1 )
     		   this.m_fValue = 0.5;
     		if(this.m_iType == 2 )
     		   this.m_fValue =-0.5;
     		   
			this.m_WallLineArray.push(new THREE.Vector3(-0.5, -0.5+this.m_fValue, 0));
			this.m_WallLineArray.push(new THREE.Vector3( 0.5, -0.5+this.m_fValue, 0));
			this.m_WallLineArray.push(new THREE.Vector3(-0.5,  0.5+this.m_fValue, 0));
			this.m_WallLineArray.push(new THREE.Vector3( 0.5,  0.5+this.m_fValue, 0));
			
			this.m_LastLineArray = new Array();	
			this.m_LastLineArray.push(new THREE.Vector3(-0.5, -0.5+this.m_fValue, 0));
			this.m_LastLineArray.push(new THREE.Vector3( 0.5, -0.5+this.m_fValue, 0));			
			this.m_LastLineArray.push(new THREE.Vector3(-0.5,  0.5+this.m_fValue, 0));
			this.m_LastLineArray.push(new THREE.Vector3( 0.5,  0.5+this.m_fValue, 0));
			
			geom.vertices.push(new THREE.Vector3(-0.5, -0.5+this.m_fValue, 0));
			geom.vertices.push(new THREE.Vector3( 0.5, -0.5+this.m_fValue, 0));
			geom.vertices.push(new THREE.Vector3(-0.5,  0.5+this.m_fValue, 0));
			
			geom.vertices.push(new THREE.Vector3( 0.5, -0.5+this.m_fValue, 0));
			geom.vertices.push(new THREE.Vector3( 0.5,  0.5+this.m_fValue, 0));
			geom.vertices.push(new THREE.Vector3(-0.5,  0.5+this.m_fValue, 0));	

			geom.faces.push(new THREE.Face3(0,1,2));
			geom.faces.push(new THREE.Face3(3,4,5));
			geom.faceVertexUvs[0][0] = [ new THREE.Vector2(0, 0),new THREE.Vector2(0, 0), new THREE.Vector2(0, 0)]; 
			geom.faceVertexUvs[0][1] = [ new THREE.Vector2(0, 0),new THREE.Vector2(0, 0), new THREE.Vector2(0, 0)]; 
			
        	geom.computeFaceNormals();
        	geom.verticesNeedUpdate = true;
			geom.uvsNeedUpdate 		= true;

			this.mWall = new THREE.Mesh( geom, new THREE.MeshBasicMaterial( { color: 0x66A0f0, opacity: 0.6, transparent: true  } ) );
			scene.add(this.mWall);	
				
			var geometry_2 = new THREE.Geometry();			
				geometry_2.vertices.push( new THREE.Vector3( -0.5, -0.5+this.m_fValue, 0.1 ), new THREE.Vector3( 0.5, -0.5+this.m_fValue, 0.1 ));
				geometry_2.vertices.push( new THREE.Vector3(  0.5, -0.5+this.m_fValue, 0.1 ), new THREE.Vector3( 0.5,  0.5+this.m_fValue, 0.1 ));
				geometry_2.vertices.push( new THREE.Vector3(  0.5,  0.5+this.m_fValue, 0.1 ), new THREE.Vector3(-0.5,  0.5+this.m_fValue, 0.1 ));
				geometry_2.vertices.push( new THREE.Vector3( -0.5,  0.5+this.m_fValue, 0.1 ), new THREE.Vector3(-0.5, -0.5+this.m_fValue, 0.1 ));
								
			tEdge = new THREE.LineSegments( geometry_2, new THREE.LineBasicMaterial( { color: 0x999999, opacity: 1 } ) );			
			
			this.mWall.add(tEdge);
			var sphere = new THREE.CircleGeometry( 6,16 );	
			tMat = new THREE.PointsMaterial( {color: 0xeeeeee } );
			this.mHelpWallPos1 = new THREE.Mesh( sphere, tMat );
			this.mHelpWallPos2 = new THREE.Mesh( sphere, tMat );
			this.mHelpWallPos1.position.x =-99999;
			this.mHelpWallPos1.position.y =-99999;
			this.mHelpWallPos1.position.z = 1.15;
			this.mHelpWallPos2.position.x =-99999;
			this.mHelpWallPos2.position.y =-99999;
			this.mHelpWallPos2.position.z = 1.15;
			scene.add(this.mHelpWallPos1);
			scene.add(this.mHelpWallPos2);
			var geometry = new THREE.Geometry();
			geometry.vertices.push( 
				new THREE.Vector3(-100/2,    0, 0),   new THREE.Vector3( 100/2,    0, 0), 
				new THREE.Vector3(-100/2,  -20, 0),   new THREE.Vector3(-100/2,   20, 0),
				new THREE.Vector3( 100/2,  -20, 0),   new THREE.Vector3( 100/2,   20, 0)
			);  
	  		this.mLabel = new THREE.LineSegments(geometry, new THREE.LineBasicMaterial( { color: '#525759', linewidth:1, opacity: 1 } ) );				
			this.mLabel.visible = false;
			scene.add( this.mLabel );
			
			this.mWall.position.x = -99999;			
			this.mWall.position.y = -99999;			
		};
		
		this.OnChangeType = function()
		{
			var tWall  = new WallData();
			// 改变墙体类型
			switch(this.m_iType)
			{
				case 1:
					this.m_iType = 2;
					break;
				case 2:
					this.m_iType = 1;
					break;				
			}
			var tWall  = new WallData();   	
				tWall.OnInit(this.m_vStart.x,this.m_vStart.y,this.m_iType);	
				tWall.m_vEnd.x = this.m_vEnd.x;
				tWall.m_vEnd.y = this.m_vEnd.y;
				tWall.OnRender();
			mHouseClass.mWallClass.OnDelete(this);
			mHouseClass.mWallClass.m_pCurWall = tWall;
		};
		
		/**
		 * @api OnInit
		 * @apiDescription 初始化函数
		 * @apiGroup WallData                        
		 */		
		this.DeDaoZhongXian = function()
		{
			//得到中线		
			var tArray = new Array();
			var f1 = this.m_LastLineArray[0].distanceTo(this.m_LastLineArray[1]);
			var f2 = this.m_LastLineArray[0].distanceTo(this.m_LastLineArray[3]);
			if( f1>f2 )	// 较长一端为中轴
			{
				var vec1 = new THREE.Vector3((this.m_LastLineArray[0].x + this.m_LastLineArray[3].x)/2,(this.m_LastLineArray[0].y + this.m_LastLineArray[3].y)/2,0);
				var vec2 = new THREE.Vector3((this.m_LastLineArray[1].x + this.m_LastLineArray[2].x)/2,(this.m_LastLineArray[1].y + this.m_LastLineArray[2].y)/2,0);
				tArray.push(vec1);
				tArray.push(vec2);				
			}
			else
			{
				var vec1 = new THREE.Vector3((this.m_LastLineArray[0].x + this.m_LastLineArray[1].x)/2,(this.m_LastLineArray[0].y + this.m_LastLineArray[1].y)/2,0);
				var vec2 = new THREE.Vector3((this.m_LastLineArray[2].x + this.m_LastLineArray[3].x)/2,(this.m_LastLineArray[2].y + this.m_LastLineArray[3].y)/2,0);
				tArray.push(vec1);
				tArray.push(vec2);				
			}
			return tArray;
		};
		
		this.OnUpdate= function()
		{
			//更新墙体
			this.m_fLength = Math.sqrt((  this.m_vEnd.x-this.m_vStart.x)*(this.m_vEnd.x-this.m_vStart.x)
										+(this.m_vEnd.y-this.m_vStart.y)*(this.m_vEnd.y-this.m_vStart.y) 
										+(this.m_vEnd.z-this.m_vStart.z)*(this.m_vEnd.z-this.m_vStart.z));	
			
			var edge1   = new THREE.Vector3;
				edge1.x = this.m_vEnd.x - this.m_vStart.x;
				edge1.y = this.m_vEnd.y - this.m_vStart.y;
				edge1.z = this.m_vEnd.z - this.m_vStart.z;
			
			if( Math.abs(edge1.x) < 0.001 )				
				edge1.x = 0.0;
			if( Math.abs(edge1.y) < 0.001 )
				edge1.y = 0.0;
			
			if( edge1.x == 0.0 && edge1.y == 0.0)			// atanf(0/0)�����ֵ
				this.m_fRotate = 0.0;
			else
				this.m_fRotate = Math.atan(edge1.y/edge1.x);	
			
			this.m_vCenter.x = ( this.m_vEnd.x+ this.m_vStart.x )/2;
			this.m_vCenter.y = ( this.m_vEnd.y+ this.m_vStart.y )/2;
			this.m_vCenter.z = ( this.m_vEnd.z+ this.m_vStart.z )/2;					
		};
		
		this.OnClear = function()
		{
			this.OnClearLine();
			scene.remove(this.mWall);		// 墙体
			scene.remove(this.mLabel);		// 尺寸线
			scene.remove(this.mText);		// 文字	
			scene.remove(this.mHelpWallPos1);
			scene.remove(this.mHelpWallPos2);
		};
		
		this.OnClearLine= function()
		{
			this.m_WallLineArray[0].x = -0.5;
			this.m_WallLineArray[0].y =  0.5+this.m_fValue;
			this.m_WallLineArray[0].z =  0;

			this.m_WallLineArray[1].x =  0.5;
			this.m_WallLineArray[1].y =  0.5+this.m_fValue;
			this.m_WallLineArray[1].z =  0;
			
			this.m_WallLineArray[2].x = -0.5;
			this.m_WallLineArray[2].y = -0.5+this.m_fValue;
			this.m_WallLineArray[2].z =  0;
			
			this.m_WallLineArray[3].x =  0.5;
			this.m_WallLineArray[3].y = -0.5+this.m_fValue;
			this.m_WallLineArray[3].z =  0;
		};
		
		// 绘制临时墙体
		this.OnRender = function()
		{
			this.OnClearLine();
      		this.OnUpdate();
			if( this.m_fLength < 0.1 )
				return;
							
			this.mWall.scale.set(this.m_fLength,this.m_fWidth,1);
			this.mWall.rotation.z = this.m_fRotate;
			this.mWall.position.x = this.m_vCenter.x;			
			this.mWall.position.y = this.m_vCenter.y;
			this.mWall.position.z = this.m_fLayer;
			this.mWall.geometry.verticesNeedUpdate = true;
			this.mWall.updateMatrix();
			this.m_WallLineArray[0]= this.m_WallLineArray[0].applyMatrix4(this.mWall.matrix);
			this.m_WallLineArray[1]= this.m_WallLineArray[1].applyMatrix4(this.mWall.matrix);
			this.m_WallLineArray[2]= this.m_WallLineArray[2].applyMatrix4(this.mWall.matrix);
			this.m_WallLineArray[3]= this.m_WallLineArray[3].applyMatrix4(this.mWall.matrix);
			
			this.mHelpWallPos1.position.x = this.m_vStart.x;			
			this.mHelpWallPos1.position.y = this.m_vStart.y;
			
			this.mHelpWallPos2.position.x = this.m_vEnd.x;			
			this.mHelpWallPos2.position.y = this.m_vEnd.y;
			
			this.UpdateLabel(0);
		};
		
		
		this.OnRender1 = function()
		{
			this.OnClearLine();
      		this.OnUpdate();
			if( this.m_fLength < 0.1 )
				return;
							
			this.mWall.scale.set(this.m_fLength,this.m_fWidth,1);
			this.mWall.rotation.z = this.m_fRotate;
			this.mWall.position.x = this.m_vCenter.x;			
			this.mWall.position.y = this.m_vCenter.y;
			this.mWall.position.z = this.m_fLayer;
			this.mWall.geometry.verticesNeedUpdate = true;
			this.mWall.updateMatrix();
		//	this.mWall.visible    = true;
			this.m_WallLineArray[0]= this.m_WallLineArray[0].applyMatrix4(this.mWall.matrix);
			this.m_WallLineArray[1]= this.m_WallLineArray[1].applyMatrix4(this.mWall.matrix);
			this.m_WallLineArray[2]= this.m_WallLineArray[2].applyMatrix4(this.mWall.matrix);
			this.m_WallLineArray[3]= this.m_WallLineArray[3].applyMatrix4(this.mWall.matrix);
			this.mHelpWallPos1.position.x = this.m_vStart.x;			
			this.mHelpWallPos1.position.y = this.m_vStart.y;
			
			this.mHelpWallPos2.position.x = this.m_vEnd.x;			
			this.mHelpWallPos2.position.y = this.m_vEnd.y;
			
			//this.UpdateLabel(0);
		};
		
		this.OnRenderColor = function(iColor)
		{
			//0x66A0f0
			this.mWall.material.color.set(iColor);
			this.mWall.material.needsUpdate = true;
			this.mWall.geometry.verticesNeedUpdate = true;
			this.mWall.visible    = true;
			render();
		};		
		
		// 0. 沿墙显示尺寸  1. 周边显示尺寸
		this.UpdateLabel = function( iMode )
		{	
			this.mLabel.geometry.vertices.length = 0;
			this.mLabel.geometry.vertices.push( 
				new THREE.Vector3(-this.m_fLength/2,    0, 0),   new THREE.Vector3( this.m_fLength/2,    0, 0), 
				new THREE.Vector3(-this.m_fLength/2,  -10, 0),   new THREE.Vector3(-this.m_fLength/2,   10, 0),
				new THREE.Vector3(-this.m_fLength/2-7, -8, 0),   new THREE.Vector3(-this.m_fLength/2+7,  8, 0),
				new THREE.Vector3( this.m_fLength/2-7, -8, 0),   new THREE.Vector3( this.m_fLength/2+7,  8, 0),
				new THREE.Vector3( this.m_fLength/2,  -10, 0),   new THREE.Vector3( this.m_fLength/2,   10, 0)
			);  
			this.mLabel.geometry.verticesNeedUpdate = true;
				
			if(iMode == 0 )
			{				
				var tmpMatrix1 = new THREE.Matrix4().makeTranslation(1,30,1);
				var tmpMatrix2 = new THREE.Matrix4().makeRotationZ(this.m_fRotate);
				var tmpMatrix3 = new THREE.Matrix4().makeTranslation(this.m_vCenter.x,this.m_vCenter.y,this.m_vCenter.z);	
				tmpMatrix2.multiply(tmpMatrix1);
				tmpMatrix3.multiply(tmpMatrix2);
						
				this.mLabel.rotation.z = 0;
				this.mLabel.position.x = 0;			
				this.mLabel.position.y = 0;
				this.mLabel.position.z = 0;
				this.mLabel.matrixWorld.identity();
				this.mLabel.matrix.identity();
				this.mLabel.updateMatrixWorld(true);
				this.mLabel.applyMatrix(tmpMatrix3);	
				this.mLabel.visible = true;				
			}
			this.UpdateText();
		};
		
		// 更新文字信息
		this.UpdateText = function()
		{
			scene.remove(this.mText);
			var shapes = mHouseClass.mFont.generateShapes( (parseInt(this.m_fLength)*10).toString(), 100 );
			var geometryText = new THREE.ShapeBufferGeometry( shapes );
			geometryText.computeBoundingBox();
			geometryText.translate( - 0.5 * ( geometryText.boundingBox.max.x - geometryText.boundingBox.min.x ), 0, 0 );

			this.mText = new THREE.Mesh( geometryText, mResource.mFontTex );
			scene.add( this.mText );	
			
			var tmpMatrix1 = new THREE.Matrix4().makeTranslation(1,350,1);
			var tmpMatrix2 = new THREE.Matrix4().makeScale(0.13,0.13,1);
			var tmpMatrix3 = new THREE.Matrix4().makeRotationZ(this.m_fRotate);
			var tmpMatrix4 = new THREE.Matrix4().makeTranslation(this.m_vCenter.x,this.m_vCenter.y,this.m_vCenter.z);	
			tmpMatrix2.multiply(tmpMatrix1);
			tmpMatrix3.multiply(tmpMatrix2);
			tmpMatrix4.multiply(tmpMatrix3);
			this.mText.rotation.z = 0;
			this.mText.position.x = 0;			
			this.mText.position.y = 0;
			this.mText.position.z = 0;
			this.mText.scale.x = 1;
			this.mText.scale.y = 1;
			this.mText.scale.z = 1;
			this.mText.matrixWorld.identity();
			this.mText.matrix.identity();
			this.mText.updateMatrixWorld(true);
			this.mText.applyMatrix(tmpMatrix4);	
		};
		
		this.OnShow = function( bShow )
		{
			this.mWall.visible  	= bShow;
			this.mText.visible  	= bShow;
			this.mLabel.visible 	= bShow;
			this.mHelpWallPos1.visible=bShow;
			this.mHelpWallPos2.visible=bShow;
			this.mHelpWallPos1.position.x = this.m_vStart.x;			
			this.mHelpWallPos1.position.y = this.m_vStart.y;
			
			this.mHelpWallPos2.position.x = this.m_vEnd.x;			
			this.mHelpWallPos2.position.y = this.m_vEnd.y;
		};
				
		this.OnMoveWall = function(mouseX, mouseY)
		{
			var transform  = new THREE.Vector3(mouseX-this.mCurMouseX, mouseY-this.mCurMouseY, 0);			
			var angle  = this.m_fRotate*180/Math.PI;	// 控制水平，还是垂直移动
			if( angle<44 && angle>-44)
				transform.x = 0.0;
			else
				transform.y = 0.0;

			// 更新相关门窗 (位置，宽度)
			// 移动附属门
			//=============================================================================================================
			for(var j = 0; j<mHouseClass.mDoorClass.mDoorArray.length;j++ )
			{
				var ab = mMathClass.ClosestPointOnLine1(this.m_vStart.x,this.m_vStart.y,
				 										this.m_vEnd.x,this.m_vEnd.y, 
				 										mHouseClass.mDoorClass.mDoorArray[j].m_vPos.x,
				 										mHouseClass.mDoorClass.mDoorArray[j].m_vPos.y, 20);
				if( ab[0] != 0 )
				{
					mHouseClass.mDoorClass.mDoorArray[j].m_vPos.x += transform.x;
					mHouseClass.mDoorClass.mDoorArray[j].m_vPos.y += transform.y;
					mHouseClass.mDoorClass.mDoorArray[j].OnMouseMove(
											mHouseClass.mDoorClass.mDoorArray[j].m_vPos.x,
											mHouseClass.mDoorClass.mDoorArray[j].m_vPos.y, 
											0, mHouseClass.mDoorClass.mDoorArray[j].m_fRotate,
											this.m_fWidth);						
				}
			}	
			
			// 更新相关窗 (位置，宽度)
			// 移动附属窗
			//=============================================================================================================
			for(var j = 0; j<mHouseClass.mWindowClass.mWindowArray.length;j++ )
			{
				var ab = mMathClass.ClosestPointOnLine1(this.m_vStart.x,this.m_vStart.y,
				 										this.m_vEnd.x,this.m_vEnd.y, 
				 										mHouseClass.mWindowClass.mWindowArray[j].m_vPos.x,
				 										mHouseClass.mWindowClass.mWindowArray[j].m_vPos.y, 20);
				if( ab[0] != 0 )
				{
					mHouseClass.mWindowClass.mWindowArray[j].m_vPos.x += transform.x;
					mHouseClass.mWindowClass.mWindowArray[j].m_vPos.y += transform.y;
					mHouseClass.mWindowClass.mWindowArray[j].OnMouseMove(
											mHouseClass.mWindowClass.mWindowArray[j].m_vPos.x,
											mHouseClass.mWindowClass.mWindowArray[j].m_vPos.y, 
											0, mHouseClass.mWindowClass.mWindowArray[j].m_fRotate,
											this.m_fWidth);						
				}
			}
			
			this.m_vStart.x += transform.x;
			this.m_vStart.y += transform.y;
			this.m_vEnd.x 	+= transform.x;	
			this.m_vEnd.y 	+= transform.y;
			
			this.mCurMouseX = mouseX;
			this.mCurMouseY = mouseY;			
		};
		
		// 墙体外围标注是否显示
		this.OnShowLabel = function(bShow)
		{
			for( i=0; i<mHouseClass.mFloorClass.mFloorArray.length; i++)
				mHouseClass.mFloorClass.mFloorArray[i].OnShowLabel_Out(true);
		};
}