function WallLineClass()
{
		this.mLineArray = new Array(); // 主体墙线	
		this.m_pCurLine = null;
		this.mMouseX = 0;
		this.mMouseY = 0;		
		this.OnInit = function( )
		{
		};
		
		// 增加墙体
		this.OnAddWall = function(x1,y1,x2,y2)
		{
			var tWallLine  = new WallLineData();
				tWallLine.OnInit(x1,y1,0);
				tWallLine.m_vEnd.x = x2;
				tWallLine.m_vEnd.y = y2;
				tWallLine.OnRender();
			this.mLineArray.push(tWallLine);
		};
		
		// 挤压形状
		this.OnBuildEdges = function(tFloorMesh)
		{	
			
			var tWallBSP1 = new ThreeBSP(this.mLineArray[0].mWallData3D_In.mWallMesh);
			for(var i = 1; i<this.mLineArray.length; i++ )
			{
				var tWallBSP2  = new ThreeBSP(this.mLineArray[i].mWallData3D_In.mWallMesh);
				tWallBSP1	   = tWallBSP1.union(tWallBSP2);
			}
						
			var tFloorBSP = new ThreeBSP(tFloorMesh);			
			var resultBSP = tFloorBSP.subtract(tWallBSP1);
			var result    = resultBSP.toMesh();
			if( result )
			{
			//	scene3D.remove(tFloorMesh);
	
				scene3D.add( tFloorMesh );
			}
			
		/*	var cpr= new ClipperLib.Clipper();
			var subj_paths = [[{X:this.mLineArray[0].m_vStart.x,Y:this.mLineArray[0].m_vStart.y},
	  						   {X:this.mLineArray[0].m_vEnd.x, Y:this.mLineArray[0].m_vEnd.y}]];			
	  			ClipperLib.JS.ScaleUpPaths(subj_paths, 1);			
			cpr.AddPaths(subj_paths, ClipperLib.PolyType.ptSubject, true);
			
			for(var i = 1; i<2; i++ )	//this.mLineArray.length
			{
	  			var clip_paths = [[{X:this.mLineArray[i].m_vStart.x,Y:this.mLineArray[i].m_vStart.y},
	  							   {X:this.mLineArray[i].m_vEnd.x,	Y:this.mLineArray[i].m_vEnd.y}]];			
	  			ClipperLib.JS.ScaleUpPaths(clip_paths, 1);
	  			cpr.AddPaths(clip_paths, ClipperLib.PolyType.ptClip, true);	
			}
			
  			this.solution_paths = new ClipperLib.Paths();
			var succeeded  = cpr.Execute(ClipperLib.ClipType.ctUnion, this.solution_paths, ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero);
				
			return;
			cpr.AddPaths(subj_paths, ClipperLib.PolyType.ptSubject, true);
			ClipperLib.JS.ScaleUpPaths(subj_paths, 1);
            var pt = new ClipperLib.PolyTree();
            cpr.Execute(ClipperLib.PolyFillType.ctUnion, pt, ClipperLib.PolyFillType.pftEvenOdd, ClipperLib.PolyFillType.pftNonZero);
            var solution_exPolygons = ClipperLib.JS.PolyTreeToExPolygons(pt);	
				
			var edges = new THREE.EdgesGeometry( tWallData3D_Out.mWallMesh.geometry );
			tWallData3D_Out.m_Outline = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0xff0000 } ) );
			tWallData3D_Out.m_Outline.rotation.x = -Math.PI/2;
			scene3D.add( tWallData3D_Out.m_Outline );
			tWallData3D_Out.m_Outline.visible = false;*/
		};
		
		// 生成3D
		this.OnUpdate3D =function()
		{
			for( let i = 0; i< this.mLineArray.length; i++ )
			{
				if(this.mLineArray[i].mWallData3D_In == null)
					this.mLineArray[i].OnUpdate3D();
			}
		};
		
		this.DrawWallLine = function(mouseX,mouseY)
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
				this.CheckWallPos();
				
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
			this.m_pCurLine  = new WallLineData();	
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
		};
		
		this.OnDelete = function(tCurLine)
		{			
			tCurLine.OnClear();
			var iIndex = this.mLineArray.indexOf(tCurLine);
			if( iIndex == -1 )
				return;
			this.mLineArray.splice(iIndex,1);
		};
		
		this.OnShow = function(tLine)
		{
			$('#mWallLineBar').show();
			var div1=document.getElementById("mWallLineBar");
			div1.style.left= mouseScreen.x+10+'px';
			div1.style.top= mouseScreen.y-100+'px';


			$('#mShowProjectBar').show();
			var div2=document.getElementById("mShowProjectBar");
			if(div2)
			{
				div2.style.left= mouseScreen.x+40+'px';
				div2.style.top= mouseScreen.y-100+'px';
			}
		};
		
		this.AddLine = function(x1,y1,x2,y2)
		{
			this.m_pCurLine  = new WallLineData();	
			this.m_pCurLine.OnInit(x1,y1,0);
			this.m_pCurLine.m_vEnd.x = x2;  
			this.m_pCurLine.m_vEnd.y = y2; 			
			this.m_pCurLine.OnRender();	
			this.mLineArray.push(this.m_pCurLine);
			this.m_pCurLine = null;
		};
		
}