function MathClass()
{				
	this.mRetVec;
	
    this.GetUUID = function() {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        var uuid = s.join("");
        return uuid;
    };
    
    this.Identity = function(tObject)
    {
		tObject.rotation.x = 0;	
		tObject.rotation.y = 0;	
		tObject.rotation.z = 0;
		tObject.position.x = 0;			
		tObject.position.y = 0;
		tObject.position.z = 0;
		tObject.scale.x = 1;
		tObject.scale.y = 1;
		tObject.scale.z = 1;
		tObject.matrixWorld.identity();
		tObject.matrix.identity();	   	
    };

	this.RotateVecFromAxis= function(vVec,vAxis,angle)
	{
		
		var edge1 = new THREE.Vector3(vVec.x - vAxis.x,vVec.y - vAxis.y,vVec.z - vAxis.z);
		
		if( Math.abs(edge1.x) < 0.001 )				
			edge1.x = 0.0;
		if( Math.abs(edge1.y) < 0.001 )
			edge1.y = 0.0;
		
		var radian;
		if( edge1.x != 0 )
				radian =  Math.atan(edge1.y/edge1.x);		
	  else
				radian = 0;
		var degree = radian*180/Math.PI;					
		
		if( degree < 0 )
			degree = 360 +degree;
		
		var itmp = degree/angle;
		
		degree = degree - Math.floor(itmp) *angle;
		if(degree > angle /2.0 )
			degree-=angle;
				
		var tmpMatrix  = new THREE.Matrix4().makeTranslation(-vAxis.x, -vAxis.y, -vAxis.z );		
		var tmpMatrix1 = new THREE.Matrix4().makeRotationZ(-degree*Math.PI/180);
		var tmpMatrix2 = new THREE.Matrix4().makeTranslation( vAxis.x,  vAxis.y,  vAxis.z );
		tmpMatrix1.multiply(tmpMatrix);
		tmpMatrix2.multiply(tmpMatrix1);
		
		this.mRetVec = vVec.applyMatrix4(tmpMatrix2);
	};
		
	this.Float_Equals= function ( a, b,fValue )
	{
		if( Math.abs(a-b)< fValue )
		  return true;
		return false;
	};
	
	this.Vec_Equals= function ( a, b, fValue )
	{
		if( true == this.Float_Equals(a.x,b.x,fValue) &&
		    true == this.Float_Equals(a.y,b.y,fValue) &&
		    true == this.Float_Equals(a.z,b.z,fValue) )
		    return true;
		return false;
	};
	

	this.dotProduct= function( vPos1, vPos2, vPos3)
	{
		var vVector1 = new THREE.Vector3(vPos3.x - vPos2.x, vPos3.y - vPos2.y, vPos3.z - vPos2.z);
		var vVector2 = new THREE.Vector3(vPos1.x - vPos2.x, vPos1.y - vPos2.y, vPos1.z - vPos2.z);
		vVector1.normalize();
		vVector2.normalize();
		var fRadian = Math.acos(vVector2.dot(vVector1));
		
		var fArea =  this.GetAreaInTri(vPos1.x,vPos1.y,vPos2.x,vPos2.y,vPos3.x,vPos3.y);
		
		if( fArea < 0)
			return fRadian*180/Math.PI;
		
		return -fRadian*180/Math.PI;
	};
	

	this.GetAreaInTri= function( x1,y1, x2,y2,x3, y3 )
	{
		return (x1-x3)*(y2-y3)-(y1-y3)*(x2-x3);
	};	
	

	this.Get2Line= function(a, b,c, d)
	{
		var vLine11 = new THREE.Vector3(a.x,a.y,a.z);
		var vLine12 = new THREE.Vector3(b.x,b.y,c.z);
		var vLine21 = new THREE.Vector3(c.x,c.y,c.z);				
		var vLine22 = new THREE.Vector3(d.x,d.y,d.z);
		
		var vOutPos = new THREE.Vector3;
		
		var bRet  = false;
		var array = new Array;
		array.push(bRet);
		
		
		var A1  =   vLine12.y - vLine11.y;  		
		var B1  =   vLine11.x - vLine12.x;
		var C1  =   vLine12.x * vLine11.y   -   vLine11.x * vLine12.y;   
		
		var A2  =   vLine22.y - vLine21.y;     
		var B2  =   vLine21.x - vLine22.x;   
		var C2  =   vLine22.x * vLine21.y   -   vLine21.x * vLine22.y;   
		
		if( Math.abs(A1*B2 - B1*A2) < 0.001)         
		{   
/*			if( Math.abs( (A1+B1)*C2 - (A2+B2)*C1 ) )   
			return false;	 
			else
			return false;  */
			return array;
		}   
		else
		{   
			vOutPos.x = ( B2*C1 - B1*C2 ) / ( A2*B1 - A1*B2 );   
			vOutPos.y = ( A1*C2 - A2*C1 ) / ( A2*B1 - A1*B2 );   
			vOutPos.z = 0;  
			array[0] = true;
			array.push(vOutPos.x);
			array.push(vOutPos.y);
			array.push(vOutPos.z);
		} 
		return array;			
	};
							

	this.ClosestPointOnLine= function( pWallLine, x1, y1, z1, fDis )
	{	
		/***
		 * 点是否在线段上
		 * 
		 */			
		var ab = new Array();	
		if( Math.abs(x1 - pWallLine.m_vStart.x)<fDis&&
				Math.abs(y1 - pWallLine.m_vStart.y)<fDis )
		{	
			ab.push(1);
			ab.push(pWallLine.m_vStart.x);
			ab.push(pWallLine.m_vStart.y);
			ab.push(pWallLine.m_vStart.z);
			return ab;
		}
		
		if( Math.abs(x1 - pWallLine.m_vEnd.x)<fDis&&
				Math.abs(y1 - pWallLine.m_vEnd.y)<fDis )
		{	
			ab.push(2);
			ab.push(pWallLine.m_vEnd.x);
			ab.push(pWallLine.m_vEnd.y);
			ab.push(pWallLine.m_vEnd.z);
			return ab;
		}			
		
		var vVector1 = new THREE.Vector3(x1 - pWallLine.m_vStart.x,y1 - pWallLine.m_vStart.y,z1 - pWallLine.m_vStart.z);
		var vVector2 = new THREE.Vector3(pWallLine.m_vEnd.x - pWallLine.m_vStart.x,pWallLine.m_vEnd.y - pWallLine.m_vStart.y,pWallLine.m_vEnd.z - pWallLine.m_vStart.z);
		
		vVector2.normalize();
		
		var d = Math.sqrt( (pWallLine.m_vEnd.x - pWallLine.m_vStart.x) * (pWallLine.m_vEnd.x - pWallLine.m_vStart.x) +
											 (pWallLine.m_vEnd.y - pWallLine.m_vStart.y) * (pWallLine.m_vEnd.y - pWallLine.m_vStart.y) +
											 (pWallLine.m_vEnd.z - pWallLine.m_vStart.z) * (pWallLine.m_vEnd.z - pWallLine.m_vStart.z) );
		
		var t = vVector2.dot(vVector1);
		
		
		if (t <= 0) 
		{
			ab.push(0);
			return ab;
		}
		if (t >= d) 
		{
			ab.push(0);
			return ab;
		}
		
		
		var vClosestPoint = new THREE.Vector3();
		vClosestPoint.x = pWallLine.m_vStart.x + vVector2.x * t;
		vClosestPoint.y = pWallLine.m_vStart.y + vVector2.y * t;
		vClosestPoint.z = pWallLine.m_vStart.z + vVector2.z * t;
		
		
		d = Math.sqrt( (x1 - vClosestPoint.x) * (x1 - vClosestPoint.x) +
			(y1 - vClosestPoint.y) * (y1 - vClosestPoint.y) +
			(z1 - vClosestPoint.z) * (z1 - vClosestPoint.z) );
		
		
		if( d >= fDis )	
		{
			ab.push(0);
			return ab;
		}
		
		ab.push(3);
		ab.push(vClosestPoint.x);
		ab.push(vClosestPoint.y);
		ab.push(vClosestPoint.z);
		
		return ab;
	};		
	
	this.ClosestPointOnLine1= function( sx,sy, ex, ey, x1, y1, fDis )
	{			
		// 判断点是否在线段内
		var ab = new Array();	
		if( Math.abs(x1 - sx)<fDis&&
				Math.abs(y1 - sy)<fDis )
		{	
			ab.push(1);
			ab.push(sx);
			ab.push(sy);
			ab.push(0);
			return ab;
		}
		
		if( Math.abs(x1 - ex)<fDis&&
				Math.abs(y1 - ey)<fDis )
		{	
			ab.push(2);
			ab.push(ex);
			ab.push(ey);
			ab.push(0);
			return ab;
		}			
		
		var vVector1 = new THREE.Vector3(x1 - sx,y1 - sy,0);
		var vVector2 = new THREE.Vector3(ex - sx,ey - sy,0);
		
		vVector2.normalize();
		
		var d = Math.sqrt( (ex - sx) * (ex - sx) +
											 (ey - sy) * (ey - sy) +
											 0 );
		
		var t = vVector2.dot(vVector1);
		
		
		if (t <= 0) 
		{
			ab.push(0);
			return ab;
		}
		if (t >= d) 	// 判断是否在线段内
		{
			ab.push(0);
			return ab;
		}
		
		
		var vClosestPoint = new THREE.Vector3();
		vClosestPoint.x = sx + vVector2.x * t;
		vClosestPoint.y = sy + vVector2.y * t;
		vClosestPoint.z =  0 + vVector2.z * t;
		
		
		d = Math.sqrt( (x1 - vClosestPoint.x) * (x1 - vClosestPoint.x) +
			(y1 - vClosestPoint.y) * (y1 - vClosestPoint.y) + 0 );
		
		
		if( d >= fDis )	
		{
			ab.push(0);
			return ab;
		}
		
		ab.push(3);
		ab.push(vClosestPoint.x);
		ab.push(vClosestPoint.y);
		ab.push(d);
		
		return ab;
	};	
	
	this.ClosestPointOnLine2= function( sx,sy, ex, ey, x1, y1, fDis )
	{			
		// 判断点是否在直线上
		var ab = new Array();	
		if( Math.abs(x1 - sx)<fDis&&
				Math.abs(y1 - sy)<fDis )
		{	
			ab.push(1);
			ab.push(sx);
			ab.push(sy);
			ab.push(0);
			return ab;
		}
		
		if( Math.abs(x1 - ex)<fDis&&
				Math.abs(y1 - ey)<fDis )
		{	
			ab.push(2);
			ab.push(ex);
			ab.push(ey);
			ab.push(0);
			return ab;
		}			
		
		var vVector1 = new THREE.Vector3(x1 - sx,y1 - sy,0);
		var vVector2 = new THREE.Vector3(ex - sx,ey - sy,0);
		
		vVector2.normalize();
		
		var d = Math.sqrt( (ex - sx) * (ex - sx) +
											 (ey - sy) * (ey - sy) +
											 0 );
		
		var t = vVector2.dot(vVector1);
			
		var vClosestPoint = new THREE.Vector3();
		vClosestPoint.x = sx + vVector2.x * t;
		vClosestPoint.y = sy + vVector2.y * t;
		vClosestPoint.z =  0 + vVector2.z * t;
		
		
		d = Math.sqrt( (x1 - vClosestPoint.x) * (x1 - vClosestPoint.x) +
			(y1 - vClosestPoint.y) * (y1 - vClosestPoint.y) + 0 );
		
		
		if( d >= fDis )	
		{
			ab.push(0);
			return ab;
		}
		
		ab.push(3);
		ab.push(vClosestPoint.x);
		ab.push(vClosestPoint.y);
		ab.push(d);
		
		return ab;
	};		
	
	
	this.GetLineRotate= function(sx,sy,ex,ey)
	{
		// 旋转角度
		var fRotate;
		var edge1   = new THREE.Vector3;
			  edge1.x = ex - sx;				
				edge1.y = ey - sy;
				edge1.z = 0;
		
		if( Math.abs(edge1.x) < 0.001 )					
			edge1.x = 0.0;
		if( Math.abs(edge1.y) < 0.001 )
			edge1.y = 0.0;
		
		if( edge1.x == 0.0 && edge1.y == 0.0)	
			fRotate = 0.0;
		else
			fRotate = Math.atan(edge1.y/edge1.x);	
			
			return fRotate;			
	};	
	
	
	this.IntersectedPlane = function(vPos1,vPos2,vPos3,testPos,fValue)
	{
		// 判断一个点在平面内
		var vec1 = new THREE.Vector3(vPos1.x,vPos1.y,vPos1.z);
		var vec2 = new THREE.Vector3(vPos2.x,vPos2.y,vPos2.z);
		var vec3 = new THREE.Vector3(vPos3.x,vPos3.y,vPos3.z);
		var a = ( (vec2.y-vec1.y)*(vec3.z-vec1.z)-(vec2.z-vec1.z)*(vec3.y-vec1.y) );
		var b = ( (vec2.z-vec1.z)*(vec3.x-vec1.x)-(vec2.x-vec1.x)*(vec3.z-vec1.z) );
		var c = ( (vec2.x-vec1.x)*(vec3.y-vec1.y)-(vec2.y-vec1.y)*(vec3.x-vec1.x) );
		var d = ( 0-(a*vec1.x+b*vec1.y+c*vec1.z) );
		
		var ftmp = Math.abs(a*testPos.x+b*testPos.y+c*testPos.z+d) / Math.sqrt(a*a+b*b+c*c);
		if( ftmp <fValue ) //0.1
		   return true;
		
		return false;
	};
	
	this.GetAngleFromP4 = function(p1,p2, p3,p4)
	{
		var vVector1 = new THREE.Vector3;
		var vVector2 = new THREE.Vector3;
		
		vVector1.x = p2.x - p1.x;
		vVector1.y = p2.y - p1.y;
		vVector1.z = p2.z - p1.z;
		
		vVector2.x = p4.x - p3.x;
		vVector2.y = p4.y - p3.y;
		vVector2.z = p4.z - p3.z;
		
	//	vVector1.normalize();
		vVector2.normalize();
		var t  = vVector2.dot(vVector1);
		var t1 = Math.sqrt( (vVector1.x * vVector1.x) + (vVector1.y * vVector1.y) + (vVector1.z * vVector1.z) );
		var t2 = Math.sqrt( (vVector2.x * vVector2.x) + (vVector2.y * vVector2.y) + (vVector2.z * vVector2.z) );
		
		var fAngle = Math.acos( t / (t1*t2) )*180/Math.PI;
		
		var dx1 = p2.x - p1.x;
		var dx2 = p4.x - p1.x;
		var dy1 = p2.y - p1.y;
		var dy2 = p4.y - p1.y;
		
		if(dx1 * dy2 - dy1 * dx2 >= 0)
		{
			fAngle = -fAngle;
		}
		return fAngle;
	};

	this.OnCreateLine_In = function(tFloor, fValue)
	{
		// 生成外轮廓
		//=========================================================================================================
		var vVec2;
		//var fValue = -30;
		var tLineArray = new Array;
	    var SegArray1 = this.GetStartAndEndPosFromWall1(tFloor.mPath[0],tFloor.mPath[1],tFloor.mFloorMesh, fValue);
	    var SegArray2 = this.GetStartAndEndPosFromWall1(tFloor.mPath[tFloor.mPath.length-1],tFloor.mPath[0],tFloor.mFloorMesh,fValue);
	
	    var PosArray = mMathClass.Get2Line(SegArray1[0],SegArray1[1],SegArray2[0],SegArray2[1]);
	    if( PosArray[0] == true )
	    {
	        vVec2 = new THREE.Vector3(PosArray[1],PosArray[2],0);
	        tLineArray.push(vVec2);
	    }
	    
	    for(var i = 1; i<tFloor.mPath.length-1; i++)
	    {
	        SegArray1 = this.GetStartAndEndPosFromWall1(tFloor.mPath[i-1],tFloor.mPath[i], tFloor.mFloorMesh, fValue);
	        SegArray2 = this.GetStartAndEndPosFromWall1(tFloor.mPath[i],tFloor.mPath[i+1], tFloor.mFloorMesh, fValue);
	        PosArray  = mMathClass.Get2Line(SegArray1[0],SegArray1[1],SegArray2[0],SegArray2[1]);
	        if( PosArray[0] == true )
	        {
	            var vVec1 = new THREE.Vector3(PosArray[1],PosArray[2],0);
	            tLineArray.push(vVec1);	
	       }
	    }

        SegArray1 = this.GetStartAndEndPosFromWall1(tFloor.mPath[tFloor.mPath.length-1],tFloor.mPath[0], tFloor.mFloorMesh, fValue);
        SegArray2 = this.GetStartAndEndPosFromWall1(tFloor.mPath[tFloor.mPath.length-2],tFloor.mPath[tFloor.mPath.length-1], tFloor.mFloorMesh, fValue);
        PosArray  = mMathClass.Get2Line(SegArray1[0],SegArray1[1],SegArray2[0],SegArray2[1]);
        if( PosArray[0] == true )
        {
            var vVec1 = new THREE.Vector3(PosArray[1],PosArray[2],0);
            tLineArray.push(vVec1);	
        }
        
        tLineArray.push(vVec2);
		return tLineArray;
	};
	
	this.GetStartAndEndPosFromWall1= function ( vStart, vEnd, tMesh, fDisWall)
	{
	    var vecMax  = new THREE.Vector3(vEnd.X,vEnd.Y,0);
	    var vecMin  = new THREE.Vector3(vStart.X,vStart.Y,0);
	    var vPos    = new THREE.Vector3;
	    vPos.x = ( vecMax.x + vecMin.x )/2;
	    vPos.y = ( vecMax.y + vecMin.y )/2;
	    vPos.z = ( vecMax.z + vecMin.z )/2;
	
	    var fRotate = 0;
	    var edge1   = new THREE.Vector3;
	    edge1.x = vEnd.X - vStart.X;
	    edge1.y = vEnd.Y - vStart.Y;
	
	    if( Math.abs(edge1.x) < 0.001 )
	        edge1.x = 0.0;
	    if( Math.abs(edge1.y) < 0.001 )
	        edge1.y = 0.0;
	
	    var fRotate;
	    if( edge1.x == 0.0 && edge1.y == 0.0)
	        fRotate = 0.0;
	    else
	        fRotate = Math.atan(edge1.y/edge1.x);
		
	    var tmpMatrix1 = new THREE.Matrix4().makeTranslation(-vPos.x, -vPos.y, 0);
	    var tmpMatrix2 = new THREE.Matrix4().makeRotationZ(Math.PI/2+fRotate);		// 当前角度
	    var tmpMatrix3 = new THREE.Matrix4().makeTranslation(vPos.x,  vPos.y, 0);
	    tmpMatrix2.multiply(tmpMatrix1);
	    tmpMatrix3.multiply(tmpMatrix2);
	
	    var vPos1 = new THREE.Vector3( vPos.x + fDisWall, vPos.y, 10 );
	    var vPos2 = vPos1.applyMatrix4(tmpMatrix3);
	    var vNormal = new THREE.Vector3(0,0,-1);
	    var raycaster1 = new THREE.Raycaster(vPos2,vNormal);
	    raycaster1.linePrecision = 3;
	 	
		tMesh.geometry.computeFaceNormals();
		tMesh.geometry.computeVertexNormals();
		tMesh.geometry.uvsNeedUpdate = true;	
		tMesh.geometry.normalsNeedUpdate = true;
		tMesh.geometry.computeBoundingSphere();
		tMesh.updateMatrixWorld();
	    var Intersections = raycaster1.intersectObject( tMesh );
	
	    var vPosStart,vPosEnd;
	
	    if( Intersections.length<=0 )
	    {
	        fDisWall =-fDisWall;
		}

	    var tmpMatrix1 = new THREE.Matrix4().makeTranslation(-vStart.X, -vStart.Y, 0);
	    var tmpMatrix2 = new THREE.Matrix4().makeRotationZ(Math.PI/2+fRotate);		// 当前角度
	    var tmpMatrix3 = new THREE.Matrix4().makeTranslation( vStart.X,  vStart.Y, 0);
	    tmpMatrix2.multiply(tmpMatrix1);
	    tmpMatrix3.multiply(tmpMatrix2);
	
	    vPos1 = new THREE.Vector3( vStart.X + fDisWall, vStart.Y, 0 );
	    vPosStart = vPos1.applyMatrix4(tmpMatrix3);
	
	    var tmpMatrix4 = new THREE.Matrix4().makeTranslation(-vEnd.X, -vEnd.Y, 0);
	    var tmpMatrix5 = new THREE.Matrix4().makeRotationZ(Math.PI/2+fRotate);
	    var tmpMatrix6 = new THREE.Matrix4().makeTranslation( vEnd.X,  vEnd.Y, 0);
	    tmpMatrix5.multiply(tmpMatrix4);
	    tmpMatrix6.multiply(tmpMatrix5);
	
	    vPos1  = new THREE.Vector3( vEnd.X + fDisWall,vEnd.Y, 0 );
	    vPosEnd = vPos1.applyMatrix4(tmpMatrix6);
	
	    var OutArray = new Array;
	    OutArray.push(vPosStart);
	    OutArray.push(vPosEnd);
	    return OutArray;
	};	
		
	this.MoXingWaDong = function(tObj,tDong)
	{
		if(tObj.m_Object3D.children.length == 0)	// 已经挖洞的墙体
			return;
			
		var tMesh1 = this.FormatMesh(tObj);
		var tMesh2 = this.FormatMeshBox(tDong);
		var tMeshBSP1 = new ThreeBSP(tMesh1);
		var tMeshBSP2 = new ThreeBSP(tMesh2);
		var resultBSP = tMeshBSP1.subtract(tMeshBSP2);
		var result = resultBSP.toMesh();

		if( result )
		{
    		result.scale.set((tObj.m_fLength/tObj.m_fLengthOld)/10,
					    	 (tObj.m_fWidth/tObj.m_fWidthOld)/10,
							 (tObj.m_fHeight/tObj.m_fHeightOld)/10);
 								  
			var tImage1 = tObj.m_Object3D.children[0].material.map.image.src;
			    
		    result.material     = new THREE.MeshPhongMaterial();
		    result.material.color.setRGB( 0.5843137254901961, 0.5843137254901961, 0.5843137254901961);//0.5882352941176471
		    result.material.map = new THREE.TextureLoader().load(tImage1);
		    result.material.shininess = 48;
		    result.material.specular.setRGB( 0.8980392156862745, 0.8980392156862745, 0.8980392156862745);
	    	result.material.needsUpdate = true;
	    	tObj.ChangeMesh(result);
	    //  	tObj.ShowEdges(tObj.m_iColor);
	     
/*		    result.material     = tObj.m_Object3D.children[0].material.clone();
	    	result.material.needsUpdate = true;
	    	tObj.ChangeMesh(result);*/	     
		}			
	};
		
	this.FormatMesh = function(tObj)
	{
		//格式化MESH
		var tMaterial = new THREE.MeshBasicMaterial({ color: '#FFFF00', wireframe: true,transparent:true,opacity:0.6});
		var tGeometry = tObj.m_Object3D.children[0].geometry;
		
		var k = 0;
		var geom = new THREE.Geometry();    
        for( let i = 0; i<tGeometry.attributes.position.length/9; i++ )
        {
         	var x1 = tGeometry.attributes.position.array[i*9+0];
         	var y1 = tGeometry.attributes.position.array[i*9+1];
         	var z1 = tGeometry.attributes.position.array[i*9+2];
         	
         	var x2 = tGeometry.attributes.position.array[i*9+3];
         	var y2 = tGeometry.attributes.position.array[i*9+4];
         	var z2 = tGeometry.attributes.position.array[i*9+5];
         	
         	var x3 = tGeometry.attributes.position.array[i*9+6];
         	var y3 = tGeometry.attributes.position.array[i*9+7];
         	var z3 = tGeometry.attributes.position.array[i*9+8]; 
         	
        	geom.vertices.push(new THREE.Vector3(x1, y1, z1));
        	geom.vertices.push(new THREE.Vector3(x2, y2, z2));
        	geom.vertices.push(new THREE.Vector3(x3, y3, z3));
        	
        	geom.faces.push(new THREE.Face3(k+0,k+1,k+2));
        	k=k+3;
        }
        
        for( let i = 0; i<tGeometry.attributes.uv.length/6; i++)
        {
        	var u1 = tGeometry.attributes.uv.array[i*6+0];
         	var v1 = tGeometry.attributes.uv.array[i*6+1];
         	
         	var u2 = tGeometry.attributes.uv.array[i*6+2];
         	var v2 = tGeometry.attributes.uv.array[i*6+3];
         	
        	var u3 = tGeometry.attributes.uv.array[i*6+4];
         	var v3 = tGeometry.attributes.uv.array[i*6+5];
         	
         	var t0 = new THREE.Vector2(u1,v1);
         	var t1 = new THREE.Vector2(u2,v2);
         	var t2 = new THREE.Vector2(u3,v3);
         	
         	uv1 = [t0,t1,t2];

        	geom.faceVertexUvs[0].push(uv1);
        }
		geom.computeFaceNormals();
		geom.verticesNeedUpdate = true;
		geom.uvsNeedUpdate = true;        
        var tMesh = new THREE.Mesh( geom, tMaterial);
    	tMesh.scale.set((tObj.m_fLength/tObj.m_fLengthOld)/10,
					    (tObj.m_fWidth/tObj.m_fWidthOld)/10,
						(tObj.m_fHeight/tObj.m_fHeightOld)/10);						 
		tMesh.rotation.x = -Math.PI/2;
		tMesh.rotation.z = tObj.m_fRotate*Math.PI/180;	
		tMesh.position.x = tObj.m_Object3D.position.x;
		tMesh.position.y = tObj.m_Object3D.position.y;
		tMesh.position.z = tObj.m_Object3D.position.z;
		
		return  tMesh;
	};	
	
	this.FormatMeshBox = function(tObj)
	{		
		var tMaterial = new THREE.MeshBasicMaterial({ color: '#FFFF00',transparent:true,opacity:0.6});
		var geometrBox = new THREE.BoxGeometry(tObj.m_fLength, tObj.m_fWidth+20, tObj.m_fHeight);      
	
        var tMesh = new THREE.Mesh( geometrBox, tMaterial);		
        
		var tmpMatrix4 = new THREE.Matrix4().makeScale((tObj.m_fLength/tObj.m_fLengthOld),
						    						   ((tObj.m_fWidth+20)/tObj.m_fWidthOld),
													   (tObj.m_fHeight/tObj.m_fHeightOld));	        
		var tmpMatrix0= new THREE.Matrix4().makeTranslation(0,0,0);
		var tmpMatrix1= new THREE.Matrix4().makeRotationZ(tObj.m_fRotate);
		var tmpMatrix2= new THREE.Matrix4().makeTranslation(tObj.m_Object.position.x,-tObj.m_Object.position.z,tObj.m_Object.position.y);											
		var tmpMatrix3= new THREE.Matrix4().makeRotationX(-Math.PI/2);																								
			//	tmpMatrix0.multiply(tmpMatrix4);
				tmpMatrix1.multiply(tmpMatrix0);
				tmpMatrix2.multiply(tmpMatrix1);
				tmpMatrix3.multiply(tmpMatrix2);
			
		tMesh.rotation.x = 0;	
		tMesh.rotation.y = 0;	
		tMesh.rotation.z = 0;
		tMesh.position.x = 0;			
		tMesh.position.y = 0;
		tMesh.position.z = 0;
		tMesh.scale.x = 1;
		tMesh.scale.y = 1;
		tMesh.scale.z = 1;
		tMesh.matrixWorld.identity();
		tMesh.matrix.identity();						
		tMesh.applyMatrix(tmpMatrix3); 
		tMesh.updateMatrixWorld(true);
		return  tMesh;		
	};	
	
	this.FormatMeshBox1 = function(tObj)
	{
		var minX = 99999; 
		var maxX =-99999;
		var minY = 99999;
		var maxY =-99999;
		var minZ = 99999;
		var maxZ =-99999;
		
		var tMaterial = new THREE.MeshBasicMaterial({ color: '#FFFF00',transparent:true,opacity:0.6});
		
		for( var i = 0; i< tObj.m_Object.children.length; i++)
		{
			tObj.m_Object.children[i].geometry.computeBoundingBox();
			var tGeometry1 = tObj.m_Object.children[i].geometry;											  
			var minVec = new THREE.Vector3(tGeometry1.boundingBox.min.x, tGeometry1.boundingBox.min.y, tGeometry1.boundingBox.min.z);
			var maxVec = new THREE.Vector3(tGeometry1.boundingBox.max.x, tGeometry1.boundingBox.max.y, tGeometry1.boundingBox.max.z);					
			if( minVec.x< minX)
				minX = minVec.x;
			if( minVec.y< minY)
				minY = minVec.y;
			if( minVec.z< minZ)
				minZ = minVec.z;
				
			if( maxVec.x> maxX)
				maxX = maxVec.x;
			if( maxVec.y> maxY)
				maxY = maxVec.y;
			if( maxVec.z> maxZ)
				maxZ = maxVec.z;		
		}	

		var geom = new THREE.Geometry();        	        	
			geom.vertices.push(new THREE.Vector3(minX, maxY, minZ));	// 底面
		    geom.vertices.push(new THREE.Vector3(minX, minY, minZ));			    
        	geom.vertices.push(new THREE.Vector3(maxX, minY, minZ)); 
         	geom.vertices.push(new THREE.Vector3(maxX, minY, minZ));	
		    geom.vertices.push(new THREE.Vector3(maxX, maxY, minZ));			    
        	geom.vertices.push(new THREE.Vector3(minX, maxY, minZ));       	
        	
			geom.vertices.push(new THREE.Vector3(minX, maxY, maxZ));	// 顶面		    			    
        	geom.vertices.push(new THREE.Vector3(maxX, minY, maxZ)); 
      		geom.vertices.push(new THREE.Vector3(minX, minY, maxZ));
         	geom.vertices.push(new THREE.Vector3(maxX, minY, maxZ));	    
        	geom.vertices.push(new THREE.Vector3(minX, maxY, maxZ));
        	geom.vertices.push(new THREE.Vector3(maxX, maxY, maxZ));
        	
         	geom.vertices.push(new THREE.Vector3(minX, minY, minZ));	// 左面
		    geom.vertices.push(new THREE.Vector3(minX, maxY, minZ));
		    geom.vertices.push(new THREE.Vector3(minX, maxY, maxZ));
        	geom.vertices.push(new THREE.Vector3(minX, maxY, maxZ));        			    
        	geom.vertices.push(new THREE.Vector3(minX, minY, maxZ));
        	geom.vertices.push(new THREE.Vector3(minX, minY, minZ));
        	
         	geom.vertices.push(new THREE.Vector3(maxX, minY, minZ));	// 右面
		    geom.vertices.push(new THREE.Vector3(maxX, maxY, maxZ));
		    geom.vertices.push(new THREE.Vector3(maxX, maxY, minZ));
        	geom.vertices.push(new THREE.Vector3(maxX, maxY, maxZ));            	
        	geom.vertices.push(new THREE.Vector3(maxX, minY, minZ));  
        	geom.vertices.push(new THREE.Vector3(maxX, minY, maxZ));

	   	for(let i = 0; i<24/3; i++)
	   	{
    		geom.faces.push(new THREE.Face3(i*3+0,i*3+1,i*3+2));  
    		geom.faceVertexUvs[0][i] = [new THREE.Vector2(0, 0),new THREE.Vector2(0, 0),new THREE.Vector2(0, 0)];
   	    }    	
			
		geom.computeFaceNormals();
		geom.verticesNeedUpdate = true;
		geom.uvsNeedUpdate 		= true;        
	
        var tMesh = new THREE.Mesh( geom, tMaterial);		
        
		var tmpMatrix4 = new THREE.Matrix4().makeScale((tObj.m_fLength/tObj.m_fLengthOld),
						    						   ((tObj.m_fWidth+20)/tObj.m_fWidthOld),
													   (tObj.m_fHeight/tObj.m_fHeightOld));	        
		var tmpMatrix0= new THREE.Matrix4().makeTranslation(0,0,0);
		var tmpMatrix1= new THREE.Matrix4().makeRotationZ(tObj.m_fRotate);
		var tmpMatrix2= new THREE.Matrix4().makeTranslation(tObj.m_Object.position.x,-tObj.m_Object.position.z,tObj.m_Object.position.y);											
		var tmpMatrix3= new THREE.Matrix4().makeRotationX(-Math.PI/2);																								
				tmpMatrix0.multiply(tmpMatrix4);
				tmpMatrix1.multiply(tmpMatrix0);
				tmpMatrix2.multiply(tmpMatrix1);
				tmpMatrix3.multiply(tmpMatrix2);
			
		tMesh.rotation.x = 0;	
		tMesh.rotation.y = 0;	
		tMesh.rotation.z = 0;
		tMesh.position.x = 0;			
		tMesh.position.y = 0;
		tMesh.position.z = 0;
		tMesh.scale.x = 1;
		tMesh.scale.y = 1;
		tMesh.scale.z = 1;
		tMesh.matrixWorld.identity();
		tMesh.matrix.identity();						
		tMesh.applyMatrix(tmpMatrix3); 
		tMesh.updateMatrixWorld(true);
		return  tMesh;		
	};		
}