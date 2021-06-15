
function LabelClass()
{
	// 尺寸标注 (内墙线)
	this.mbShowLabel = true;
	this.mLabel;	// 标注尺寸线
	this.mText;		// 尺寸文字 
	this.mMeshArrow;
	this.mColor;
	this.m_vStart = new THREE.Vector3(0,0,0);
	this.m_vEnd   = new THREE.Vector3(0,0,0);
	this.m_vStart_Floor = new THREE.Vector3(0,0,0);		//地面轮廓
	this.m_vEnd_Floor   = new THREE.Vector3(0,0,0);	
	this.m_fRotate= 0;
	this.m_fLength= 0;
	this.m_fCenterX=0;
	this.m_fCenterY=0;
	this.m_Outline;	
	this.OnInit= function (iColor) //初始化尺寸线
	{
		this.mColor = iColor;
		var geometry = new THREE.Geometry();
		this.OnBuildLine_2(geometry,100);
  		this.mLabel = new THREE.LineSegments(geometry, new THREE.LineBasicMaterial( { color: this.mColor , linewidth:15, opacity: 1 } ) );				
		this.mLabel.computeLineDistances();
		this.mLabel.visible = false;
		scene.add( this.mLabel );		
	};
		
	// 清空
	this.OnClear = function()
	{	
		this.mLabel.visible = false;
		if(this.mText)
		   this.mText.visible  = false;
		scene.remove(this.mLabel);
		scene.remove(this.mText);
		scene.remove(this.m_Outline );
	};
	
	// 显示尺寸
	this.OnShowLabel = function(bShow)
	{
		this.mLabel.visible = bShow;
		if(this.mText)
		   this.mText.visible  = bShow;
		if(this.mMeshArrow)
		   this.mMeshArrow.visible=bShow;
	};
	
	this.OnBuildLine_2D_Floor = function(geometry,fLength,tFloor)
	{
	    var vPos = new THREE.Vector3(0, -20, 1);
		var tmpMatrix2 = new THREE.Matrix4().makeRotationZ(Math.PI+this.m_fRotate);
		var tmpMatrix3 = new THREE.Matrix4().makeTranslation(this.m_fCenterX,this.m_fCenterY,1);	
		tmpMatrix3.multiply(tmpMatrix2);
		vPos = vPos.applyMatrix4(tmpMatrix3);	   
		
		this.mLabel.applyMatrix(tmpMatrix3);	

		// 文字 横
		//=================================================================================================== 
		scene.remove(this.mText);
		var shapes = mHouseClass.mFont.generateShapes( (parseInt(this.m_fLength)*10).toString(), 9 );
		var geometryText = new THREE.ShapeBufferGeometry( shapes );
		geometryText.computeBoundingBox();
		geometryText.translate( - 0.5 * ( geometryText.boundingBox.max.x - geometryText.boundingBox.min.x ), 0, 0.1 );

		this.mText = new THREE.Mesh( geometryText, mResource.mFontBuleTex );
		scene.add( this.mText );		
		
		
/*		var shapes1 = mHouseClass.mFont.generateShapes( (parseInt(this.m_fLength)*10).toString(), 11 );
		var geometryText1 = new THREE.ShapeBufferGeometry( shapes1 );
		geometryText1.computeBoundingBox();
		geometryText1.translate( - 0.5 * ( geometryText1.boundingBox.max.x - geometryText1.boundingBox.min.x ), -0.4, 0 );
		//geometryText1.scale(1.2,1.2,1);
		var tText1 = new THREE.Mesh( geometryText1, new THREE.MeshBasicMaterial( {color: 0xffffff,side: THREE.DoubleSide} ) );
		this.mText.add( tText1 );	*/
		
		var holeShapes = [];
		for ( var i = 0; i < shapes.length; i ++ ) {
			var shape = shapes[ i ];
			if ( shape.holes && shape.holes.length > 0 ) {
				for ( var j = 0; j < shape.holes.length; j ++ ) {
					var hole = shape.holes[ j ];
					holeShapes.push( hole );
				}
			}
		}
		
		shapes.push.apply( shapes, holeShapes );
		var lineText = new THREE.Object3D();
		for ( var i = 0; i < shapes.length; i ++ ) {
			var shape = shapes[ i ];
			var points = shape.getPoints();
			var geometry1 = new THREE.BufferGeometry().setFromPoints( points );
			geometry1.translate( - 0.5 * ( geometryText.boundingBox.max.x - geometryText.boundingBox.min.x ), 0, 0 );
			var lineMesh = new THREE.Line( geometry1, new THREE.MeshBasicMaterial( {color: 0xffffff,side: THREE.DoubleSide} ) );
			lineText.add( lineMesh );
		}		
		this.mText.add( lineText );
		
	    var vNormal = new THREE.Vector3(0,0,-1);
	    var raycaster1 = new THREE.Raycaster(vPos,vNormal);
	    raycaster1.linePrecision = 3;
		 	
		var Intersections = raycaster1.intersectObject( tFloor.mFloorMesh );
	    if( Intersections.length<=0 )
	    {
	        geometry.vertices.push( 
			new THREE.Vector3(-fLength/2,   10, 1),   new THREE.Vector3( fLength/2,   10, 1), 
			new THREE.Vector3(-fLength/2,   20, 1),   new THREE.Vector3(-fLength/2,    0, 1),
			new THREE.Vector3( fLength/2,   20, 1),   new THREE.Vector3( fLength/2,    0, 1)
			); 
			
			var tmpMatrix1 = new THREE.Matrix4().makeTranslation(0,-30,0);
			var tmpMatrix2 = new THREE.Matrix4().makeScale(1,1,1);
			var tmpMatrix3 = new THREE.Matrix4().makeRotationZ(this.m_fRotate);
			var tmpMatrix4 = new THREE.Matrix4().makeTranslation(this.m_fCenterX,this.m_fCenterY,1);	
			tmpMatrix2.multiply(tmpMatrix1);
			tmpMatrix3.multiply(tmpMatrix2);
			tmpMatrix4.multiply(tmpMatrix3);
			this.mText.applyMatrix(tmpMatrix4);				
		}
	    else{
			geometry.vertices.push( 
				new THREE.Vector3(-fLength/2,  -10, 1),   new THREE.Vector3( fLength/2,  -10, 1), 
				new THREE.Vector3(-fLength/2,  -20, 1),   new THREE.Vector3(-fLength/2,    0, 1),
				new THREE.Vector3( fLength/2,  -20, 1),   new THREE.Vector3( fLength/2,    0, 1)
				);
						
				var tmpMatrix1 = new THREE.Matrix4().makeTranslation(0,20,0);
				var tmpMatrix2 = new THREE.Matrix4().makeScale(1,1,1);
				var tmpMatrix3 = new THREE.Matrix4().makeRotationZ(this.m_fRotate);
				var tmpMatrix4 = new THREE.Matrix4().makeTranslation(this.m_fCenterX,this.m_fCenterY,1);	
				tmpMatrix2.multiply(tmpMatrix1);
				tmpMatrix3.multiply(tmpMatrix2);
				tmpMatrix4.multiply(tmpMatrix3);
				this.mText.applyMatrix(tmpMatrix4);					
	    }
	    geometry.verticesNeedUpdate = true;

	};
	
	// 2 是 
	this.OnBuildLine_2 = function(geometry,fLength)
	{
		geometry.vertices.push( 
			new THREE.Vector3(-fLength/2,    0, 1),   new THREE.Vector3( fLength/2,    0, 1) 
		//	new THREE.Vector3(-fLength/2,  -10, 1),   new THREE.Vector3(-fLength/2,   10, 1),
		//	new THREE.Vector3( fLength/2,  -10, 1),   new THREE.Vector3( fLength/2,   10, 1)
		); 
		geometry.verticesNeedUpdate = true;
	};
	// 2是内墙线
	this.OnBuildArrow_2 = function(fLength)
	{
		var off1 = 16;	
		var off2 = 6;
		var geom = new THREE.Geometry();
		geom.vertices.push(new THREE.Vector3(-fLength/2, 0, 1)); 
    	geom.vertices.push(new THREE.Vector3(-fLength/2+off1, -off2, 1));      
    	geom.vertices.push(new THREE.Vector3(-fLength/2+off1,  off2, 1)); 
		geom.vertices.push(new THREE.Vector3( fLength/2, 0, 0)); 
    	geom.vertices.push(new THREE.Vector3( fLength/2-off1, -off2, 1));      
    	geom.vertices.push(new THREE.Vector3( fLength/2-off1,  off2, 1)); 
    	
	    geom.faces.push(new THREE.Face3(0,1,2));
	    geom.faces.push(new THREE.Face3(3,4,5));
	        	
		geom.faceVertexUvs[0][0] = [ new THREE.Vector2(0, 0),new THREE.Vector2(0, 0), new THREE.Vector2(0, 0)];
		geom.faceVertexUvs[0][1] = [ new THREE.Vector2(0, 0),new THREE.Vector2(0, 0), new THREE.Vector2(0, 0)];
	  
        geom.computeFaceNormals();
        geom.verticesNeedUpdate = true;
		geom.uvsNeedUpdate = true;
					
		this.mMeshArrow = new THREE.Mesh( geom, new THREE.MeshBasicMaterial( { side: THREE.DoubleSide, color: this.mColor } ) );
		this.mLabel.add(this.mMeshArrow);
	};
		
	// 显示尺寸
	this.OnUpdateLabel_2 = function(vStart,vEnd,tFloor)
	{		
		this.OnUpdate(vStart,vEnd);
		this.mLabel.geometry.vertices.length = 0;	
		this.OnBuildLine_2D_Floor(this.mLabel.geometry,this.m_fLength,tFloor);
		
/*		this.OnBuildLine_2(this.mLabel.geometry,m_fLength);	
		this.OnBuildArrow_2(m_fLength);
		
		var tmpMatrix1 = new THREE.Matrix4().makeTranslation(0,0,0);
		var tmpMatrix2 = new THREE.Matrix4().makeRotationZ(Math.PI+this.m_fRotate);
		var tmpMatrix3 = new THREE.Matrix4().makeTranslation(this.m_fCenterX,this.m_fCenterY,1);	
		tmpMatrix2.multiply(tmpMatrix1);
		tmpMatrix3.multiply(tmpMatrix2);
		this.mLabel.applyMatrix(tmpMatrix3);	

		// 文字 横
		//=================================================================================================== 
		scene.remove(this.mText);
		var shapes = mHouseClass.mFont.generateShapes( (parseInt(this.m_fLength)*10).toString(), 13 );
		var geometryText = new THREE.ShapeBufferGeometry( shapes );
		geometryText.computeBoundingBox();
		geometryText.translate( - 0.5 * ( geometryText.boundingBox.max.x - geometryText.boundingBox.min.x ), 0, 0 );

		this.mText = new THREE.Mesh( geometryText, mResource.mFontBuleTex );
		scene.add( this.mText );	
		
		var tmpMatrix1 = new THREE.Matrix4().makeTranslation(0,-7,0);
		var tmpMatrix2 = new THREE.Matrix4().makeScale(1,1,1);
		var tmpMatrix3 = new THREE.Matrix4().makeRotationZ(this.m_fRotate);
		var tmpMatrix4 = new THREE.Matrix4().makeTranslation(this.m_fCenterX,this.m_fCenterY,1);	
		tmpMatrix2.multiply(tmpMatrix1);
		tmpMatrix3.multiply(tmpMatrix2);
		tmpMatrix4.multiply(tmpMatrix3);
		this.mText.applyMatrix(tmpMatrix4);*/						
	};
		
	this.OnBuildLine_3 = function(geometry,fLength)
	{
		geometry.vertices.push( 
			new THREE.Vector3(-fLength/2,     0, 1),   new THREE.Vector3( fLength/2,    0, 1), 
			new THREE.Vector3(-fLength/2-6,  -6, 1),   new THREE.Vector3(-fLength/2+6,  6, 1),
			new THREE.Vector3( fLength/2-6,  -6, 1),   new THREE.Vector3( fLength/2+6,  6, 1),
			new THREE.Vector3(-fLength/2,   -10, 1),   new THREE.Vector3(-fLength/2,   30, 1),
			new THREE.Vector3( fLength/2,   -10, 1),   new THREE.Vector3( fLength/2,   30, 1)
		); 
		geometry.verticesNeedUpdate = true;
	};
			
	// 显示总尺寸
	this.OnUpdateLabel_3 = function(vStart,vEnd)
	{		
		this.OnUpdate(vStart,vEnd);
		this.mLabel.geometry.vertices.length = 0;
		this.OnBuildLine_3(this.mLabel.geometry,this.m_fLength);
		
		var tmpMatrix1 = new THREE.Matrix4().makeTranslation(0,0,0);
		var tmpMatrix2 = new THREE.Matrix4().makeRotationZ(Math.PI+this.m_fRotate);
		var tmpMatrix3 = new THREE.Matrix4().makeTranslation(this.m_fCenterX,this.m_fCenterY,0);	
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
		
		// 文字 横
		//=================================================================================================== 
		scene.remove(this.mText);
		var shapes = mHouseClass.mFont.generateShapes( (parseInt(this.m_fLength)*10).toString(), 15 );
		var geometryText = new THREE.ShapeBufferGeometry( shapes );
		geometryText.computeBoundingBox();
		geometryText.translate( - 0.5 * ( geometryText.boundingBox.max.x - geometryText.boundingBox.min.x ), 0, 0 );

		this.mText = new THREE.Mesh( geometryText, mResource.mFontTex );
		scene.add( this.mText );	
		
		var tmpMatrix1 = new THREE.Matrix4().makeTranslation(0,10,0);
		var tmpMatrix2 = new THREE.Matrix4().makeScale(1,1,1);
		var tmpMatrix3 = new THREE.Matrix4().makeRotationZ(this.m_fRotate);
		var tmpMatrix4 = new THREE.Matrix4().makeTranslation(this.m_fCenterX,this.m_fCenterY,0);	
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
	
	// 外围下边标注
	this.OnUpdateLabel_4 = function(vStart,vEnd)
	{
		this.OnUpdate(vStart,vEnd);
		this.mLabel.geometry.vertices[ 6 ].y = -30;
		this.mLabel.geometry.vertices[ 7 ].y = 10;
		this.mLabel.geometry.vertices[ 8 ].y = -30;
		this.mLabel.geometry.vertices[ 9 ].y = 10;
		this.mLabel.geometry.verticesNeedUpdate = true;
		this.OnBuildArrow_3(m_fLength);
		var tmpMatrix1 = new THREE.Matrix4().makeTranslation(0,0,0);
		var tmpMatrix2 = new THREE.Matrix4().makeRotationZ(Math.PI+this.m_fRotate);
		var tmpMatrix3 = new THREE.Matrix4().makeTranslation(this.m_fCenterX,this.m_fCenterY,0);	
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

		// 文字 横
		//=================================================================================================== 
		scene.remove(this.mText);
		var shapes = mHouseClass.mFont.generateShapes( (parseInt(m_fLength)*10).toString(), 15 );
		var geometryText = new THREE.ShapeBufferGeometry( shapes );
		geometryText.computeBoundingBox();
		geometryText.translate( - 0.5 * ( geometryText.boundingBox.max.x - geometryText.boundingBox.min.x ), 0, 0 );

		this.mText = new THREE.Mesh( geometryText, mResource.mFontTex );
		scene.add( this.mText );	
		
		var tmpMatrix1 = new THREE.Matrix4().makeTranslation(0,10,0);
		var tmpMatrix2 = new THREE.Matrix4().makeScale(1,1,1);
		var tmpMatrix3 = new THREE.Matrix4().makeRotationZ(fRotate);
		var tmpMatrix4 = new THREE.Matrix4().makeTranslation(fCenterX,fCenterY,0);	
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

	this.CheckPosOnLine = function( posX, posY )
	{
		var ab1 =new Array();
		ab1.push(0);
		
		var ab = mMathClass.ClosestPointOnLine1(this.m_vStart_Floor.x, this.m_vStart_Floor.y,
												this.m_vEnd_Floor.x, this.m_vEnd_Floor.y,posX, posY, 20);
		if( ab[0] != 0 )
		{
			ab.push(i);
			return ab;
		}
		return ab1;		
	};

	this.OnUpdate = function(vStart,vEnd)
	{
		this.m_vStart.x = vStart.x;
		this.m_vStart.y = vStart.y;
		this.m_vStart.z = vStart.z;
		
		this.m_vEnd.x = vEnd.x;
		this.m_vEnd.y = vEnd.y;
		this.m_vEnd.z = vEnd.z;	
		
		this.m_fLength  = Math.sqrt((vEnd.x-vStart.x)*(vEnd.x-vStart.x)+(vEnd.y-vStart.y)*(vEnd.y-vStart.y));	
										
		this.m_fCenterX = (vEnd.x+vStart.x)/2;
		this.m_fCenterY = (vEnd.y+vStart.y)/2;

		var edge1   = new THREE.Vector3;
			edge1.x = vEnd.x - vStart.x;
			edge1.y = vEnd.y - vStart.y;
			
		if( Math.abs(edge1.x) < 0.001 )				
			edge1.x = 0.0;
		if( Math.abs(edge1.y) < 0.001 )
			edge1.y = 0.0;
		
		if( edge1.x == 0.0 && edge1.y == 0.0)
			this.m_fRotate = 0.0;
		else
			this.m_fRotate = Math.atan(edge1.y/edge1.x);			
	};
}