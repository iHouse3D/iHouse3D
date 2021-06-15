
function PolygonData()
{
	// 平面多边形
		this.mLineArray = new Array(); // 2D平面上构成形状的线条	
		this.m_pCurLine = null;
		this.mMouseX = 0;
		this.mMouseY = 0;
		
		this.m_floor = null;	// 地面数据指针，不需要保存
		this.m_WallArray= null;	// 包围地面的类似墙面数据，不需要保存
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
				tLineArray.push(this.mLineArray[i].m_vStart);
			
			// 地面使用的材质
			var str ="ASDSD1204,c75AB6AAC376BC72D0723CC4096976E1F/c9D9A6E6DEA8974A7DDF4F2F3FCBF90BC/ASDSD1204/ASDSD1204.jpg,900A900,地毯,化纤,3,,,,2,,";
			var ab =str.split(',');
			mHouseClass.mFloorClass.CreatePlatformPoly(tLineArray,0);
			mHouseClass.mFloorClass.m_pCurFloor.OnUpdateTex3D(ab);
			mHouseClass.mFloorClass.m_pCurFloor = null;
		};
		
		this.OnMouseDown = function(mouseX,mouseY)
		{
			if( this.m_pCurLine == null ){
				this.OnBuildNewLine(mouseX,mouseY);
			}
			else
			{	
				this.CheckLinePos();
				var d = this.m_pCurLine.m_vStart.distanceTo(this.m_pCurLine.m_vEnd);	// 两个点距离太近 ，不创建墙体
				if( d < 3 )	
					return;
				
				this.mLineArray.push(this.m_pCurLine);						
				this.OnBuildNewLine(this.m_pCurLine.m_vEnd.x,this.m_pCurLine.m_vEnd.y);		// 新墙	
			}			
		};
		
		this.OnMouseMove= function(mouseX,mouseY,buttonDown)
		{
			mHelpClass.mHelpCoss.position.x = -999999;
			mHelpClass.mHelpCoss.position.y = -999999;			
			if( this.m_pCurLine )
			{		
				this.m_pCurLine.m_vEnd.x   =  mouseX;  
				this.m_pCurLine.m_vEnd.y   =  mouseY; 
				
				this.CheckXYPos(this.m_pCurLine.m_vEnd);	//XY轴对齐
				this.CheckLinePos();
				
				this.m_pCurLine.OnRender();		
									
				this.mMouseX = this.m_pCurLine.m_vEnd.x;
				this.mMouseY = this.m_pCurLine.m_vEnd.y;
				mHelpClass.mHelpCoss.position.x = this.mMouseX;
				mHelpClass.mHelpCoss.position.y = this.mMouseY;	
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
					mHelpClass.mHelpCoss.position.x = this.mMouseX;
					mHelpClass.mHelpCoss.position.y = this.mMouseY;
				}	
			}
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
				var ab = mMathClass.ClosestPointOnLine(this.mLineArray[i], posX, posY, 0, 5);
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
		
		this.CheckLinePos=function()
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
			if( this.m_pCurLine )
				this.OnDelete(this.m_pCurLine);		
			this.m_pCurLine = null;
			mHelpClass.mHelpCoss.position.x = -999999;
			mHelpClass.mHelpCoss.position.y = -999999;
			
			this.OnUpdate3D();
		};
		
		
		this.OnDelete = function(tCurLine)
		{			
			tCurLine.OnClear();
			var iIndex = this.mLineArray.indexOf(tCurLine);
			if( iIndex == -1 )
				return;
			this.mLineArray.splice(iIndex,1);
		};
		
/*		this.OnShow = function(tLine)
		{
			$('#mWallLineBar').show();
			var div1=document.getElementById("mWallLineBar");
			div1.style.left= mouseScreen.x+10+'px';
			div1.style.top= mouseScreen.y-100+'px';			
		}
		
		this.AddLine = function(x1,y1,x2,y2)
		{
			this.m_pCurLine  = new GroundData();	
			this.m_pCurLine.OnInit(x1,y1,0);
			this.m_pCurLine.m_vEnd.x = x2;  
			this.m_pCurLine.m_vEnd.y = y2; 			
			this.m_pCurLine.OnRender();	
			this.mLineArray.push(this.m_pCurLine);
			this.m_pCurLine = null;
		}*/
		
}