/**
 * @api FloorClass
 * @apiGroup FloorClass
 * @apiName  0
 * @apiDescription 地面操作类
 * @apiParam (成员变量) m_OBBox_Max 包围盒
 * @apiParam (成员变量) m_OBBox_Min 包围盒
 * @apiParam (成员变量) mFloorArray 房间地面数组
 * @apiParam (成员变量) m_pCurFloor 当前地面
 * @apiParam (成员变量) mLabelH 总长度尺寸标注
 * @apiParam (成员变量) mLabelV 总宽度尺寸标注
 */
function FloorClass()
{
	// 地面区域
		this.m_OBBox_Max  = new THREE.Vector3();		// 户型包围盒
		this.m_OBBox_Min  = new THREE.Vector3();	
	  	this.mFloorArray = new Array(); 
	  	this.m_pCurFloor = null; 
	  
		this.mLabelH;		// 标注尺寸线
		this.mLabelV;		// 标注尺寸线

		/**
		 * @api OnInit
		 * @apiDescription 初始化函数
		 * @apiGroup FloorClass
		 *                         
		 */			
		this.OnInit= function () 
		{
			this.mLabelH = new LabelClass();		//  包围盒长宽
			this.mLabelH.OnInit(0x363636);	
			this.mLabelV = new LabelClass();
			this.mLabelV.OnInit(0x363636);
		};


		/**
		 * @api ComputerArea
		 * @apiDescription 计算套内面积(地面面积)
		 * @apiGroup FloorClass
		 *                         
		 */			
		this.ComputerArea= function()
		{
			var fArea = 0;
			for( i=0; i<this.mFloorArray.length; i++)
				fArea += this.mFloorArray[i].mfArea;
			
			fArea = fArea/20000;
			return fArea.toFixed(2);
		};
		
		
		/**
		 * @api OnClear
		 * @apiDescription 清空
		 * @apiGroup FloorClass
		 *                         
		 */			
		this.OnClear = function()
		{	
			for( i=0; i<this.mFloorArray.length; i++)
				this.mFloorArray[i].OnClear();
			this.mFloorArray.length = 0;
			
			this.mLabelV.mLabel.visible 	= false;		// 户型总长宽尺寸显示
		   	if(this.mLabelV.mText)
		   		this.mLabelV.mText.visible  = false;
			this.mLabelH.mLabel.visible 	= false;
			if(this.mLabelH.mText)	
		   	   this.mLabelH.mText.visible  	= false;
		   	
			this.m_OBBox_Max.x= -99999;
			this.m_OBBox_Max.y= -99999;
			this.m_OBBox_Min.x=  99999;
			this.m_OBBox_Min.y=  99999;			   	
			this.m_pCurFloor  =  null;
		};
		

		/**
		 * @api OnUpdateFloor
		 * @apiDescription 更新地面
		 * 				   1. 如果新地面区域中心点与老地面区域中心点一致，且面积相同， 保留老地面区域
		 * 				   2. 否则使用新区域且材质初始化
		 * 				   3. 如果是新区域更新标注
		 * @apiGroup FloorClass
		 * @apiParam (参数) solution_paths 地面轮廓数据
		 * @apiParam (参数) iMaxAreaFloor  最外侧轮廓
		 */			
		this.OnUpdateFloor = function(solution_paths, iMaxAreaFloor)
		{		
			if( solution_paths == null)
			    return;
			    
			this.mLabelH.OnShowLabel(false);
			this.mLabelV.OnShowLabel(false);

			for( k=0; k<this.mFloorArray.length; k++)		// 准备比较所有墙线
				this.mFloorArray[k].bUpdate = true;

			for(var j = 0; j < solution_paths.length; j++) 
			{				
				if( j == iMaxAreaFloor )	// 去掉外轮廓
					continue;
				
				this.m_pCurFloor = new FloorData();
				this.m_pCurFloor.OnBuildFloor(solution_paths[j],0);
				for(var i=0; i<this.mFloorArray.length; i++)
				{
					if( true == this.mFloorArray[i].IsSameAs(this.m_pCurFloor))	//   判断是否相同
					{
						this.mFloorArray[i].bUpdate = false;	// 不更新地面
						this.m_pCurFloor.OnClear();	
						this.m_pCurFloor = null;
						break;
					}	
				}		    	
		    	if(this.m_pCurFloor)	    		
					this.mFloorArray.push(this.m_pCurFloor);
			}
			this.m_pCurFloor = null;
						
			// 清除不用的地面
			for( k=0; k<this.mFloorArray.length; k++)
			{
				if( this.mFloorArray[k].bUpdate == true && mHouseClass.mGroundClass.FindGround(this.mFloorArray[k]) == null)
				{
					this.mFloorArray[k].OnClear();
					this.mFloorArray.splice(k,1);
					k= -1;
				}
			}	
			
			this.OnUpdateBox(solution_paths, iMaxAreaFloor);	// 整个户型的BBOX
			this.OnUpdateLabel();	// 户型总尺寸			
		};
		
		/**
		 * @api OnUpdateBox()
		 * @apiGroup FloorClass 
		 * @apiName  0
		 * @apiDescription 更新总包围盒
		 * @apiParam (参数) solution_paths 地面轮廓数据
		 * @apiParam (参数) iMaxAreaFloor  最外侧轮廓
		 */			
		this.OnUpdateBox = function(solution_paths, iMaxAreaFloor)
		{
			if( solution_paths == null)
				return;
				   
			this.m_OBBox_Max.x= -99999;
			this.m_OBBox_Max.y= -99999;
			this.m_OBBox_Min.x=  99999;
			this.m_OBBox_Min.y=  99999;			
			for(i = 0; i < solution_paths.length; i++) 
			{				
				if( i == iMaxAreaFloor )
					continue;
				
    			for(j = 0; j < solution_paths[i].length; j++)
    			{
    				if( iMaxAreaFloor != -99 )
					{
						if( this.m_OBBox_Max.x < solution_paths[i][j].X ) this.m_OBBox_Max.x  = solution_paths[i][j].X;
						if( this.m_OBBox_Max.y < solution_paths[i][j].Y ) this.m_OBBox_Max.y  = solution_paths[i][j].Y;
						if( this.m_OBBox_Min.x > solution_paths[i][j].X ) this.m_OBBox_Min.x  = solution_paths[i][j].X;
						if( this.m_OBBox_Min.y > solution_paths[i][j].Y ) this.m_OBBox_Min.y  = solution_paths[i][j].Y;   		
    				}
					else
					{
						if( this.m_OBBox_Max.x < solution_paths[i][j].x ) this.m_OBBox_Max.x  = solution_paths[i][j].x;
						if( this.m_OBBox_Max.y < solution_paths[i][j].y ) this.m_OBBox_Max.y  = solution_paths[i][j].y;
						if( this.m_OBBox_Min.x > solution_paths[i][j].x ) this.m_OBBox_Min.x  = solution_paths[i][j].x;
						if( this.m_OBBox_Min.y > solution_paths[i][j].y ) this.m_OBBox_Min.y  = solution_paths[i][j].y;						
					}
				}
	    	}		
		};
		
		// 显示房间内部尺寸 + 总尺寸
		/**
		 * @api OnUpdateBox()
		 * @apiGroup FloorClass 
		 * @apiName  0
		 * @apiDescription 更新总包围盒
		 */		
		this.OnUpdateLabel = function()	
		{
			if(this.m_OBBox_Max.x ==-99999)
			 	return;	
			
			var off 	= 230; // 偏移高度		
			var vStartH = new THREE.Vector3(this.m_OBBox_Min.x, this.m_OBBox_Max.y+off, 0);
			var vEndH 	= new THREE.Vector3(this.m_OBBox_Max.x, this.m_OBBox_Max.y+off, 0);	
			this.mLabelH.OnUpdateLabel_3(vStartH,vEndH);
			this.mLabelH.OnShowLabel(true);
			
			var vStartV = new THREE.Vector3(this.m_OBBox_Max.x+off, this.m_OBBox_Max.y, 0);
			var vEndV 	= new THREE.Vector3(this.m_OBBox_Max.x+off, this.m_OBBox_Min.y, 0);						
			this.mLabelV.OnUpdateLabel_3(vStartV,vEndV);
			this.mLabelV.OnShowLabel(true);
		};
				
		/**
		 * @api OnMouseRightUp2D
		 * @apiDescription 鼠标右键
		 * @apiGroup FloorClass
		 *                         
		 */					
		this.OnMouseRightUp2D = function(){	
			this.m_pCurFloor = null;
		};
		
		/**
		 * @api OnPick3D
		 * @apiDescription 3D下拾取地面
		 * @apiGroup FloorClass
		 * @apiParam (参数) mouseX 鼠标X值
		 * @apiParam (参数) mouseY 鼠标Y值
		 */			
		this.OnPick3D = function(mouseX,mouseY)
		{
			var tFloor = null;
			var tDis  = 99999;
			mHelpClass.ClearOutline();
			for(var j=0; j<this.mFloorArray.length; j++)
			{
				var Intersections = raycaster.intersectObject(  this.mFloorArray[j].mFloorMesh3D );
				if( Intersections.length>=1)
				{
					if( tDis > Intersections[0].distance)
					{
						tDis  = Intersections[0].distance;
						tFloor= this.mFloorArray[j];
					}
				}			
			}
			
			if( tFloor != null )
			{
				this.m_pCurFloor = tFloor;
				mHelpClass.ShowOutLine_Floor3D(tFloor);	// 显示地面选择区域
				return tFloor;
			}
			return null;			
		};
				
		/**
		 * @api OnPick2D
		 * @apiDescription 2D下拾取地面
		 * @apiGroup FloorClass
		 * @apiParam (参数) mouseX 鼠标X值
		 * @apiParam (参数) mouseY 鼠标Y值
		 */	
		this.OnPick2D = function(mouseX,mouseY)
		{		
			var tFloor = null;
			var tDis   =-99999;
			mHelpClass.ClearOutline();
			for( j=0; j<this.mFloorArray.length; j++)
			{
				var Intersections;
				if(this.mFloorArray[j].mFloorMesh.visible == true)
				   Intersections = raycaster.intersectObject(  this.mFloorArray[j].mFloorMesh );
				else
				   Intersections = raycaster.intersectObject(  this.mFloorArray[j].mFloorMeshSVG );
				if( Intersections.length>=1)
				{
					if( tDis < this.mFloorArray[j].mfLayer)
					{
						tDis  = this.mFloorArray[j].mfLayer;
						tFloor= this.mFloorArray[j];
					}
				}			
			}
			
			if( tFloor != null )
			{
				this.m_pCurFloor = tFloor;
				mHelpClass.ShowOutLine_Floor2D(tFloor);	// 显示地面选择区域
				this.m_pCurFloor.OnShowLabel(false);	// 是否显示尺寸
				return tFloor;
			}
			return null;			
		};
		
		/**
		 * @api OnPick2D_Quick
		 * @apiDescription 2D下拾取地面，不检测排序
		 * @apiGroup FloorClass
		 * @apiParam (参数) mouseX 鼠标X值
		 * @apiParam (参数) mouseY 鼠标Y值
		 */			
		this.OnPick2D_Quick = function(mouseX,mouseY)
		{		
			var tFloor = null;
			for( j=0; j<this.mFloorArray.length; j++)
			{
				var Intersections = raycaster.intersectObject(  this.mFloorArray[j].mFloorMesh );
				if( Intersections.length>=1)
				{
					tFloor= this.mFloorArray[j];
					return tFloor;
				}			
			}
			return null;			
		};
		
		// 循环所有地面轮廓,拾取标注
		this.OnPick2D_Label  = function(mouseX,mouseY)
		{
			for( j=0; j<this.mFloorArray.length; j++)
			{
				var ret = this.mFloorArray[j].OnPick2D_Label(mouseX,mouseY);
				if( ret != null)
					return ret;
			}
			return null;
		};
		

		/**
		 * @api CreateFloor
		 * @apiDescription 创建地面区域
		 * @apiGroup FloorClass
		 * @apiParam (参数) itype 类型
		 */			
		this.CreateFloor = function(itype)
		{
			if(itype == 0)
				m_cPenType = 4;
		};
		
		// 绘制矩形区域
		this.DrawFloorRect = function(mouseX,mouseY)
		{
			var clip_paths = [[{X:mouseX-100,Y:mouseY-100},
  							   {X:mouseX+100,Y:mouseY-100},
  							   {X:mouseX+100,Y:mouseY+100},
  							   {X:mouseX-100,Y:mouseY+100}]];
			ClipperLib.JS.ScaleUpPaths(clip_paths, 1);
			this.m_pCurFloor = new FloorData();
    		this.m_pCurFloor.OnBuildFloor(clip_paths[0],0.1); 		
			this.mFloorArray.push(this.m_pCurFloor); 		 	
		    this.m_pCurFloor = null;
		    
		    m_cPenType = 0;
		};
		
		// 创建矩形区域
		this.CreateFloorRect = function( vMin, vMax)
		{
			var clip_paths = [[{X:vMin.x,Y:vMin.y},
  							   {X:vMax.x,Y:vMin.y},
  							   {X:vMax.x,Y:vMax.y},
  							   {X:vMin.x,Y:vMax.y}]];
			ClipperLib.JS.ScaleUpPaths(clip_paths, 1);
			this.m_pCurFloor = new FloorData();
    		this.m_pCurFloor.OnBuildFloor(clip_paths[0],-0.1); 		
			this.mFloorArray.push(this.m_pCurFloor); 		 	
		    this.m_pCurFloor = null;
		    
		    m_cPenType = 0;			
		};
		
		// 按多边形创建地面
		this.CreateFloorPoly = function(vLineArray,fValue)
		{
			var clip_paths =[];
			var tArray = [];
			for(let i = 0; i< vLineArray.length; i++)
				tArray.push({X:vLineArray[i].x,Y:vLineArray[i].y});

			clip_paths.push(tArray);
			//ClipperLib.JS.ScaleUpPaths(clip_paths, 1);
			this.m_pCurFloor = new FloorData();
    		this.m_pCurFloor.OnBuildFloor(clip_paths[0],fValue); 		
			this.mFloorArray.push(this.m_pCurFloor); 
		  //this.m_pCurFloor.ExtrudeGeometry();
		  //this.m_pCurFloor = null;			
		};
		
		// 创建地台形式
		this.CreatePlatformPoly= function(vLineArray,fValue)
		{
			var clip_paths =[];
			var tArray = [];
			for(let i = 0; i< vLineArray.length; i++)
				tArray.push({X:vLineArray[i].x,Y:vLineArray[i].y});

			clip_paths.push(tArray);
			ClipperLib.JS.ScaleUpPaths(clip_paths, 1);
			this.m_pCurFloor = new FloorData();
    		this.m_pCurFloor.OnBuildFloor(clip_paths[0],fValue); 		
			this.mFloorArray.push(this.m_pCurFloor); 
		//	this.m_pCurFloor.ExtrudeGeometry();			
		};
		

		/**
		 * @api CreateFloor
		 * @apiDescription 是否显示所有地面尺寸
		 * @apiGroup FloorClass
		 * @apiParam (参数) bShow true显示，false不显示
		 */			
		this.OnShowLabelAll = function(bShow)
		{
			if(this.mFloorArray.length<=0)		// 没有数据不要显示
				bShow = false;
				
			this.mLabelH.OnShowLabel(bShow);
			this.mLabelV.OnShowLabel(bShow);
			for(let j=0; j<this.mFloorArray.length; j++)
				this.mFloorArray[j].OnShowLabel_Out(bShow);	
		};
		
		this.OnShowAll_3D = function(bShow)
		{
			for( var i = 0; i<this.mFloorArray.length; i++ )
				this.mFloorArray[i].mFloorMesh3D.visible = bShow;
		};
		
		this.OnShowLabelOut = function(bShow)
		{
			for(let j=0; j<this.mFloorArray.length; j++)
				this.mFloorArray[j].OnShowLabel_Out(bShow);				
		};
		
		// 2D转换3D, 按2D数据重新生成3D地面
		this.OnChange2DTo3D = function()
		{
			for(var k=0; k<this.mFloorArray.length; k++)
			{
				this.mFloorArray[k].OnChange2DTo3D();
			}
		};
		
		this.ChangeEmptyRoom = function()
		{
			for(var k=0; k<this.mFloorArray.length; k++)
			{
				this.mFloorArray[k].mFloorMesh3D.material = mResource.boxProjectedMat;
				this.mFloorArray[k].mFloorMesh3D.material.needsUpdate = true;
			}			
		};
		
		this.OnShowAll = function(bShow)
		{
			for(var k=0; k<this.mFloorArray.length; k++)
			{
				this.mFloorArray[k].mFloorMesh.visible = bShow;
				this.mFloorArray[k].mFloorMeshSVG.visible= !bShow;
			}
		};
				
		this.OnSave_XML = function()
		{
			var iIndex = 0;
			for(let k=0; k<this.mFloorArray.length; k++)
			{
				let that = this.mFloorArray[k].mTextureData;
				if( that ==undefined)
					continue;
					
				iIndex++;
			}
			
			let strXML = `<Floor3D num="${iIndex}"/>`;
			
			for(let k=0; k<this.mFloorArray.length; k++)
			{
				let that = this.mFloorArray[k].mTextureData;
				if( that ==undefined)
					continue;
				let strFile = 'texture/'+that.m_strFile;
				
				let strX = 1;
				let strY = 1;
				if( strFile !="texture/floor.jpg")
				{
					strX = that.mTexture.repeat.x;
				 	strY = that.mTexture.repeat.y;
				}
		
				strXML += `<Line3D PosX="${that.m_x1}" PosY="${that.m_y1}" PosZ="${that.m_z1}"
                             TexWidth="${that.m_fLength}" TexHeight="${that.m_fWidth}" 
                             OffX="${that.m_fOffX}" OffY="${that.m_fOffY}" Alpha="${that.m_fAlpha}" 
                             Rotate="${that.m_fRotate}"  source="${strFile}" Mode="${that.m_fMode}" 
                             ScaleX="${strX}" ScaleY="${strY}"/>`;
			}
			return strXML;
		};
		
		
		this.OnDelete = function(tFloor)
		{
			tFloor.OnClear();
			var iIndex = this.mFloorArray.indexOf(tFloor);
			if( iIndex == -1 )
			return;
			this.mFloorArray.splice(iIndex,1);
		};
				
		// 查询碰撞
		this.CheckCollision = function( tFurniture)
		{
			if(tFurniture.mData[8] == '斜坡')
			 return null;
			 
			var vPos 	   = new THREE.Vector3( tFurniture.m_Object3D.position.x , tFurniture.m_Object3D.position.z, tFurniture.m_Object3D.position.y+100 );
	    	var vNormal    = new THREE.Vector3(0,-1,0);
	    	var raycaster1 = new THREE.Raycaster(vPos,vNormal);				
			
			var tFloor = null;
			var tDis  = 99999;
			for( j=0; j<this.mFloorArray.length; j++)
			{
				var Intersections = raycaster1.intersectObject(  this.mFloorArray[j].mFloorMesh3D );
				if( Intersections.length>=1)
				{
					if( tDis > Intersections[0].distance)
					{
						tDis  = Intersections[0].distance;
						tFloor= this.mFloorArray[j];
					}
				}			
			}
			
			if( tFloor != null )
			{
				this.m_pCurFloor = tFloor;
				return tFloor;
			}
			return null;			
		};

	this.GetFloorCenter = function()
	{
		var off 	= 250; // 偏移高度

		var hStart = new THREE.Vector3(this.m_OBBox_Min.x, this.m_OBBox_Max.y+off, 0);
		var hEnd 	= new THREE.Vector3(this.m_OBBox_Max.x, this.m_OBBox_Max.y+off, 0);

		var vStart = new THREE.Vector3(this.m_OBBox_Max.x+off, this.m_OBBox_Max.y, 0);
		var vEnd 	= new THREE.Vector3(this.m_OBBox_Max.x+off, this.m_OBBox_Min.y, 0);

		var fLength  = Math.sqrt((vEnd.x-vStart.x)*(vEnd.x-vStart.x)+(vEnd.y-vStart.y)*(vEnd.y-vStart.y));
		var fWidth  = Math.sqrt((hEnd.x-hStart.x)*(hEnd.x-hStart.x)+(hEnd.y-hStart.y)*(hEnd.y-hStart.y));

		var maxLength = 0;
		var fCenterX = 0;
		var fCenterY = 0;

		if(fLength > fWidth )
		{
			fCenterX = (vEnd.x+vStart.x)/2;
			fCenterY = (vEnd.y+vStart.y)/2;
			maxLength = fLength;
		}
		else
		{
			fCenterX = (hEnd.x+hStart.x)/2;
			fCenterY = (hEnd.y+hStart.y)/2;
			maxLength = fWidth;
		}

		return [fCenterX,fCenterY,maxLength];
	};
}