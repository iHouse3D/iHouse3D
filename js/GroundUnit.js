
function GroundUnit()
{
	// 地面
		this.mLineArray = new Array(); // 主体墙线	
		this.m_pCurLine = null;
		this.m_pCurFloor= null;			//地面
		this.m_pCurCeiling=null;		//顶面
		this.mMouseX  = 0;
		this.mMouseY  = 0;
		this.m_flayer = 0;		// 2D画线高度
		this.m_fHeight= 0.1;	// 高度
		this.m_fDist  = 0;		// 离地高
		this.m_iFloor =-10;		// 楼层属性

		this.OnInit = function( )
		{
		};
		// 生成3D
		this.OnUpdate3D =function()
		{
			if( this.mLineArray.length == 0 )
				return;
				
			var tLineArray = [];
			for( var i = 0; i<this.mLineArray.length; i++)
			{
				tLineArray.push(this.mLineArray[i].m_vStart);
			}
			
			// 地面使用的材质
			var str ="ASDSD1204,c75AB6AAC376BC72D0723CC4096976E1F/c9D9A6E6DEA8974A7DDF4F2F3FCBF90BC/ASDSD1204/ASDSD1204.jpg,900A900,地毯,化纤,3,,,,2,,";
			var ab =str.split(',');
			
			// 创建地面方式
			//============================================================================================
			mHouseClass.mFloorClass.CreatePlatformPoly(tLineArray,this.m_flayer);
			mHouseClass.mFloorClass.m_pCurFloor.OnUpdateTex3D(ab);
			this.m_pCurFloor = mHouseClass.mFloorClass.m_pCurFloor;
			this.m_pCurFloor.OnUpdateHeight(this.m_fDist+this.m_fHeight);
			
			// 地材颜色
/*			var t = Math.random()*(1 - 0.9) + 0.9;
		    var r = Math.floor( t * 256 );
		    var g = Math.floor( t * 256 );    
		    var b = Math.floor( t * 256 );
			var color = '#'+r.toString(16)+g.toString(16)+b.toString(16);
			this.m_pCurFloor.mFloorMesh.material.color = new THREE.Color(color);	
			this.m_pCurFloor.mFloorMesh.material.needsUpdate = true;
			mHouseClass.mFloorClass.m_pCurFloor = null;*/
			//================================================================================================

			mHouseClass.mCeilingClass.CreatePlatformPoly(tLineArray,this.m_flayer);
			
			mHouseClass.mCeilingClass.m_pCurCeiling.OnUpdateTex(ab);
			this.m_pCurCeiling = mHouseClass.mCeilingClass.m_pCurCeiling;
			this.m_pCurCeiling.m_fHeight = this.m_fDist;
			mHouseClass.mCeilingClass.m_pCurCeiling = null;

			mHouseClass.mFloorClass.OnUpdateLabel();
            mHouseClass.mFloorClass.OnShowLabelOut(false);	// 可显示替换材质 不清楚原因
		};
		
		// 地台厚度
		this.OnUpdateThickness = function()
		{
			for( var i = 0; i< this.mLineArray.length; i++ )
				this.mLineArray[i].OnUpdate3D(this.m_fHeight);
		};
		
		// 升高地台
		this.OnUpdateHeight = function()
		{
			for( var i = 0; i< this.mLineArray.length; i++ )
			{
				this.mLineArray[i].OnUpdateHeight(this.m_fDist,this.m_fHeight);
				if(this.mLineArray[i].m_pFurniture)
				{
					this.mLineArray[i].m_pFurniture.m_fHight =this.m_fDist*10;
					this.mLineArray[i].m_pFurniture.OnUpdate3D();
				}
			}	
			this.m_pCurFloor.OnUpdateHeight(this.m_fDist+this.m_fHeight);
			this.m_pCurCeiling.OnUpdateHeight(this.m_fDist);
		};
		
		// 绘制地台
		this.DrawGround = function(mouseX,mouseY)
		{
			if( this.m_pCurLine == null ){
				this.OnBuildNewLine(mouseX,mouseY);
			}
			else
			{	
				this.CheckWallPos();
				var d = this.m_pCurLine.m_vStart.distanceTo(this.m_pCurLine.m_vEnd);	// 两个点距离太近 ，不创建墙体
				if( d < 2 )	
					return;
				this.m_pCurLine.OnShow(false);
				this.mLineArray.push(this.m_pCurLine);						
				this.OnBuildNewLine(this.m_pCurLine.m_vEnd.x,this.m_pCurLine.m_vEnd.y);		// 新墙	
			}			
		};
		
		this.OnMouseMove= function(mouseX,mouseY,buttonDown)
		{
		//	mHelpClass.mHelpCoss.position.x = -999999;
		//	mHelpClass.mHelpCoss.position.y = -999999;			
			if( this.m_pCurLine )
			{		 
				this.m_pCurLine.m_vEnd.z   =  this.m_flayer;
				this.m_pCurLine.m_vEnd.x   =  mouseX;  
				this.m_pCurLine.m_vEnd.y   =  mouseY; 
				
				this.CheckXYPos(this.m_pCurLine.m_vEnd);	//XY轴对齐
				this.CheckWallPos();
				
				this.m_pCurLine.OnRender();		
									
				this.mMouseX = this.m_pCurLine.m_vEnd.x;
				this.mMouseY = this.m_pCurLine.m_vEnd.y;
			//	mHelpClass.mHelpCoss.position.x = this.mMouseX;
			//	mHelpClass.mHelpCoss.position.y = this.mMouseY;	
			}
			else		
			{
				this.mMouseX = mouseX;
				this.mMouseY = mouseY;				
				var ab1 = this.CheckPosOnLine(mouseX,mouseY);			
				if( ab1[0] !=0 )
				{
					this.mMouseX = ab1[1];
					this.mMouseY = ab1[2];				
				//	mHelpClass.mHelpCoss.position.x = this.mMouseX;
				//	mHelpClass.mHelpCoss.position.y = this.mMouseY;
				}	
			}
		};
		
		this.OnMouseMove_Help = function(mouseX,mouseY)
		{
			this.mMouseX = mouseX;
			this.mMouseY = mouseY;				
			var ab1 = this.CheckPosOnLine(mouseX,mouseY);			
			if( ab1[0] !=0 )
			{
				this.mMouseX = ab1[1];
				this.mMouseY = ab1[2];				
				mHelpClass.mHelpCoss.position.x = this.mMouseX;
				mHelpClass.mHelpCoss.position.y = this.mMouseY;
				mouseX = ab1[1];
				mouseY = ab1[2];
				return true;
			}
			return false;
		};
		
		// 创建新墙体开始点
		this.OnBuildNewLine = function(mouseX,mouseY)
		{
			var ab = this.CheckPosOnLine(mouseX,mouseY);	// 顶点			
			if( ab[0] ==1 || ab[0] == 2 ){
				this.mMouseX = ab[1];
				this.mMouseY = ab[2];
			}
			else{
				this.mMouseX = mouseX;
				this.mMouseY = mouseY;				
			}
			this.m_pCurLine  = new GroundData();	
			this.m_pCurLine.OnInit(this.mMouseX,this.mMouseY,0);			
		};
		
		// 点到直线的距离<10
		this.CheckPosOnLine= function ( posX, posY )
		{
			var ab1 =new Array();
			ab1.push(0);
			var pos = new THREE.Vector3(posX,posY,0);
			for( var i = 0; i< this.mLineArray.length; i++ )
			{						  	
				var ab = mMathClass.ClosestPointOnLine(this.mLineArray[i], posX, posY, 0, 10);
				if( ab[0] != 0 )
				{
					ab.push(i);
					return ab;
				}
			}
			return ab1;
		};
		
		// 判断附近是否已存在墙体点
		this.CheckXYPos = function(pos)
		{
			for( i = 0; i< this.mLineArray.length; i++ )
			{
				if(Math.abs(pos.x - this.mLineArray[i].m_vStart.x )< 15 )
				{
					pos.x = this.mLineArray[i].m_vStart.x;
					return true;
				}
				else if ( Math.abs(pos.y - this.mLineArray[i].m_vStart.y )< 15  )
				{
					pos.y = this.mLineArray[i].m_vStart.y;
					return true;
				}
				else if ( Math.abs(pos.x - this.mLineArray[i].m_vEnd.x )< 15  ) 
				{
					pos.x = this.mLineArray[i].m_vEnd.x;	
					return true;
				}
				else if (  Math.abs(pos.y - this.mLineArray[i].m_vEnd.y )< 15  ) 
				{
					pos.y = this.mLineArray[i].m_vEnd.y;
					return true;
				}
			}
			return false;
		};
		
		this.CheckWallPos=function()
		{		
			// 旋转5度
			mMathClass.RotateVecFromAxis( this.m_pCurLine.m_vEnd, this.m_pCurLine.m_vStart, 5);
			this.m_pCurLine.m_vEnd.x =  mMathClass.mRetVec.x;  
			this.m_pCurLine.m_vEnd.y =  mMathClass.mRetVec.y;			
			
			var ab = this.CheckPosOnLine(this.m_pCurLine.m_vEnd.x,this.m_pCurLine.m_vEnd.y);			
			if( ab[0] ==1 || ab[0] == 2 )	// 顶点
			{
				this.m_pCurLine.m_vEnd.x = ab[1];
				this.m_pCurLine.m_vEnd.y = ab[2];
			}		
		};
		
		// 清空墙体		
		this.OnClear= function()
		{
			for( var i = 0; i< this.mLineArray.length; i++ ){
				this.mLineArray[i].OnClear();
			}
			this.mLineArray.length = 0;
			this.m_pCurLine = null;
			
			if(this.m_pCurFloor)
			   mHouseClass.mFloorClass.OnDelete(this.m_pCurFloor);
			   
			if(this.m_pCurCeiling)
			   mHouseClass.mCeilingClass.OnDelete(this.m_pCurCeiling);
		};
		
		// 拾取墙体
		this.OnPick2D = function(mouseX, mouseY)
		{
			var ab = this.CheckPosOnLine(mouseX,mouseY);			
			if( ab[0] !=0 )
			{				
				return this.mLineArray[ab[4]];
			}
			return null;
		};
		
		this.OnMouseRightUp2D = function()
		{
			if(this.m_pCurFloor)
				return;
				
			if( this.m_pCurLine )
				this.OnDelete(this.m_pCurLine);		
			this.m_pCurLine = null;
			mHelpClass.mHelpCoss.position.x = -999999;
			mHelpClass.mHelpCoss.position.y = -999999;
			
			if(this.mLineArray.length<3)	// 少于三根线
			{
				this.OnClear();
				return;
			}
			this.OnUpdate3D();
			this.OnUpdateThickness();
		};
		
		this.OnDelete = function(tCurLine)
		{			
			tCurLine.OnClear();
			var iIndex = this.mLineArray.indexOf(tCurLine);
			if( iIndex == -1 )
				return;
			this.mLineArray.splice(iIndex,1);
		};
				
		this.AddLine = function(x1,y1,x2,y2)
		{
			this.m_pCurLine  = new GroundData();	
			this.m_pCurLine.OnInit(x1,y1,0);
			this.m_pCurLine.m_vEnd.x = x2;  
			this.m_pCurLine.m_vEnd.y = y2;
			this.m_pCurLine.OnRender();	
			this.m_pCurLine.OnShow(false);
			this.mLineArray.push(this.m_pCurLine);
			this.m_pCurLine = null;
		};
		
		this.CreateRect = function()
		{
			var fValue = 500;
			this.m_fHeight = 260;
			this.AddLine(-fValue, fValue/10, fValue, fValue/10);
			this.AddLine( fValue, fValue/10, fValue,-fValue/10);
			this.AddLine( fValue,-fValue/10,-fValue,-fValue/10);
			this.AddLine(-fValue,-fValue/10,-fValue, fValue/10);
			this.OnMouseRightUp2D();
		};
		
		// 更新轮廓线
		this.OnUpdateLineArray = function()
		{
			if( this.m_pCurFloor == null )
				return;
				
			for( var i = 0; i< this.mLineArray.length; i++ ){
				this.mLineArray[i].OnClear();
			}
			this.mLineArray.length = 0;
			this.m_pCurLine = null;
			
			if( this.m_pCurFloor.mLabelArray == null )
				return;
				
			for( var i = 0; i<this.m_pCurFloor.mLabelArray.length; i++)
			{
				var tLine = new GroundData();	
				tLine.OnInit(this.m_pCurFloor.mLabelArray[i].m_vStart_Floor.x, this.m_pCurFloor.mLabelArray[i].m_vStart_Floor.y, this.m_flayer);
 				
				tLine.m_vEnd.z   =  this.m_flayer;
				tLine.m_vEnd.x   =  this.m_pCurFloor.mLabelArray[i].m_vEnd_Floor.x;  
				tLine.m_vEnd.y   =  this.m_pCurFloor.mLabelArray[i].m_vEnd_Floor.y;
				tLine.OnUpdate3D(this.m_fHeight);
				this.mLineArray.push(tLine);
				
			}
		};
		
		// 创建收边
		this.OnCreateEdge = function(data)
		{
			for( var i = 0; i< this.mLineArray.length; i++ )
			{
				this.mLineArray[i].OnUpdate();
				this.mLineArray[i].OnDelEdge();
						
				this.mLineArray[i].m_pFurniture = new Furniture();
				var ab = new Array();	
					ab.push('');
					ab.push(data[1]);	// jpg	
					ab.push(data[2]);	// file
					ab.push(this.mLineArray[i].m_fLength*10);
					ab.push(data[4]);
					ab.push(data[5]);
					this.mLineArray[i].m_pFurniture.m_fRotate = this.mLineArray[i].m_fRotate*180/Math.PI;
					this.mLineArray[i].m_pFurniture.m_fHight  = this.m_fDist*10;
			
				var m_vPos = new THREE.Vector3( (this.mLineArray[i].m_vEnd.x+ this.mLineArray[i].m_vStart.x )/2,
												this.m_fDist,
												-(this.mLineArray[i].m_vEnd.y+ this.mLineArray[i].m_vStart.y )/2);
			
				mHouseClass.mFurnitureClass.mFurnitureArray.push( this.mLineArray[i].m_pFurniture );
				this.mLineArray[i].m_pFurniture.m_vPos = m_vPos;
				this.mLineArray[i].m_pFurniture.OnCreate3D(ab);
				this.mLineArray[i].m_pFurniture.OnCreate2D(); 
			}
		};
		// 删除收边
		this.OnDelEdge = function()
		{
			for( var i = 0; i< this.mLineArray.length; i++ )
				this.mLineArray[i].OnDelEdge();
		};

		this.CreateFloorArea = function(arrFloorData)
		{
			//地面区域
			for(let j = 0; j < arrFloorData.length; j++)
			{
				let line = arrFloorData[j];
				this.AddLine(line.startX,-line.startY,line.endX,-line.endY);
			}
		};
		
		this.OnSave_XML = function()
		{			
			var strXML = `<GroundUnit fLayer="${this.m_flayer}" fHeight="${this.m_fHeight}" fDist="${this.m_fDist}" 
						  iFloor="${this.m_iFloor}">`;
			
			if(this.m_pCurFloor)
			{
				let that = this.m_pCurFloor.mTextureData;
				let strFile = that.m_strFile;
				strXML += `<GroundFloor PosX="${that.m_x1}" PosY="${that.m_y1}" PosZ="${that.m_z1}"
	                        TexWidth="${that.m_fLength/10}" TexHeight="${that.m_fWidth/10}" 
	                        OffX="${that.m_fOffX}" OffY="${that.m_fOffY}" Alpha="${that.m_fAlpha}" 
	                        Rotate="${that.m_fRotate}" source="${strFile}" Mode="${that.m_fMode}"
	                        ScaleX="${that.mTexture.repeat.x}" ScaleY="${that.mTexture.repeat.y}"/>`;
			}
			
			if(this.m_pCurCeiling)
			{
				let that = this.m_pCurCeiling.mTextureData
				let strFile = that.m_strFile;
				strXML += `<GroundCeiling PosX="${that.m_x1}" PosY="${that.m_y1}" PosZ="${that.m_z1}"
	                        TexWidth="${that.m_fLength/10}" TexHeight="${that.m_fWidth/10}" 
	                        OffX="${that.m_fOffX}" OffY="${that.m_fOffY}" Alpha="${that.m_fAlpha}" 
	                        Rotate="${that.m_fRotate}" source="${strFile}" Mode="${that.m_fMode}"
	                        ScaleX="${that.mTexture.repeat.x}" ScaleY="${that.mTexture.repeat.y}"/>`;				
			}

			// 记录线框+ 对应的面+线条
			for( var i = 0; i<this.mLineArray.length; i++)
				strXML += this.mLineArray[i].OnSave_XML();

			strXML += `</GroundUnit>`;
			
			return strXML;
		};
		
		this.OnLoad_XML = function(data)
		{
			this.m_flayer  = parseFloat($(data).attr('fLayer'));	//  属于哪个图层
			this.m_fHeight = parseFloat($(data).attr('fHeight'));	//  高度	
			this.m_fDist   = parseFloat($(data).attr('fDist'));		//  离地高
			this.m_iFloor  = parseFloat($(data).attr('iFloor'));
			
			for( var i = 0; i<$(data)[0].childNodes.length;i++ )
			{
				if($(data)[0].childNodes[i].localName.toLowerCase() =="grounddata" )
				{					
					this.m_pCurLine  = new GroundData();
					this.m_pCurLine.OnLoad_XML($(data)[0].childNodes[i],this.m_fDist,this.m_fHeight);					
					this.mLineArray.push(this.m_pCurLine);
					this.m_pCurLine = null;	
				}
			}
						
			this.OnUpdate3D();	//生成3D 
					
			for( var i = 0; i<$(data)[0].childNodes.length;i++ )
			{
				// 读取地面 
				if($(data)[0].childNodes[i].localName.toLowerCase() =="groundfloor" )
				{
					var texData = new TextureData();
					texData.m_x1 		= parseFloat($($(data)[0].childNodes[i]).attr('PosX'));
					texData.m_y1 		= parseFloat($($(data)[0].childNodes[i]).attr('PosY'));
					texData.m_z1 		= parseFloat($($(data)[0].childNodes[i]).attr('PosZ'));
					texData.m_fRotate 	= parseFloat($($(data)[0].childNodes[i]).attr('Rotate'));
					texData.m_fMode 	= parseInt($($(data)[0].childNodes[i]).attr('Mode'));
					texData.m_fOffX 	= parseFloat($($(data)[0].childNodes[i]).attr('OffX'));
					texData.m_fOffY 	= parseFloat($($(data)[0].childNodes[i]).attr('OffY'));
					texData.m_fLength 	= parseFloat($($(data)[0].childNodes[i]).attr('TexWidth'));
					texData.m_fWidth	= parseFloat($($(data)[0].childNodes[i]).attr('TexHeight'));
					texData.m_strFile	= $($(data)[0].childNodes[i]).attr('source');
					texData.m_fAlpha	= parseFloat($($(data)[0].childNodes[i]).attr('Alpha'));
					
					texData.mMaterial   = new THREE.MeshStandardMaterial( {color: new THREE.Color( '#ffffff' )} );					
					texData.mTexture 	= new THREE.TextureLoader( ).load( m_strHttp+'texture\\'+texData.m_strFile );
					texData.mTexture.wrapS = texData.mTexture.wrapT = THREE.RepeatWrapping;
					
					var fw = parseFloat($($(data)[0].childNodes[i]).attr('ScaleX'));
					var fh = parseFloat($($(data)[0].childNodes[i]).attr('ScaleY'));
					
					texData.mTexture.offset.set(  0, 0 );
					texData.mTexture.repeat.set( fw,fh );
					texData.mTexture.center.set(  0, 0 );
					texData.mTexture.rotation = texData.m_fRotate;		
										
					// 判断3D地面是否生成
					if( this.m_pCurFloor.mFloorMesh3D != undefined )
					{
						this.m_pCurFloor.mFloorMesh3D.material.map = texData.mTexture;
						this.m_pCurFloor.mFloorMesh3D.material.needsUpdate = true;	
					}
					this.m_pCurFloor.mTextureData =texData;
					this.m_pCurFloor.mFloorMesh.material.map = texData.mTexture;
			    	this.m_pCurFloor.mFloorMesh.material.needsUpdate = true;	
				}
				
				// 读取顶面
				if($(data)[0].childNodes[i].localName.toLowerCase() =="groundceiling" )
				{
					var texData = new TextureData();
					texData.m_x1 		= parseFloat($($(data)[0].childNodes[i]).attr('PosX'));
					texData.m_y1 		= parseFloat($($(data)[0].childNodes[i]).attr('PosY'));
					texData.m_z1 		= parseFloat($($(data)[0].childNodes[i]).attr('PosZ'));
					texData.m_fRotate 	= parseFloat($($(data)[0].childNodes[i]).attr('Rotate'));
					texData.m_fMode 	= parseInt($($(data)[0].childNodes[i]).attr('Mode'));
					texData.m_fOffX 	= parseFloat($($(data)[0].childNodes[i]).attr('OffX'));
					texData.m_fOffY 	= parseFloat($($(data)[0].childNodes[i]).attr('OffY'));
					texData.m_fLength 	= parseFloat($($(data)[0].childNodes[i]).attr('TexWidth'));
					texData.m_fWidth	= parseFloat($($(data)[0].childNodes[i]).attr('TexHeight'));
					texData.m_strFile	= $($(data)[0].childNodes[i]).attr('source');
					texData.m_fAlpha	= parseFloat($($(data)[0].childNodes[i]).attr('Alpha'));
					
					texData.mMaterial   = new THREE.MeshStandardMaterial( {color: new THREE.Color( '#ffffff' )} );					
					texData.mTexture 	= new THREE.TextureLoader( ).load( m_strHttp+'texture\\'+texData.m_strFile );
					texData.mTexture.wrapS = texData.mTexture.wrapT = THREE.RepeatWrapping;
					
					var fw = parseFloat($($(data)[0].childNodes[i]).attr('ScaleX'));
					var fh = parseFloat($($(data)[0].childNodes[i]).attr('ScaleY'));
					
					texData.mTexture.offset.set(  0, 0 );
					texData.mTexture.repeat.set( fw,fh );
					texData.mTexture.center.set(  0, 0 );
					texData.mTexture.rotation = texData.m_fRotate;		
										
					// 判断3D地面是否生成
					if( this.m_pCurCeiling.mCeilingMesh3D != undefined )
					{
						this.m_pCurCeiling.mCeilingMesh3D.material.map = texData.mTexture;
						this.m_pCurCeiling.mCeilingMesh3D.material.needsUpdate = true;	
					}
					this.m_pCurCeiling.mTextureData =texData;
					this.m_pCurCeiling.mCeilingMesh.material.map = texData.mTexture;
			    	this.m_pCurCeiling.mCeilingMesh.material.needsUpdate = true;	
				}				
			}
		};
}