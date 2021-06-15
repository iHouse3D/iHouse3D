
function CeLiangData()
{	 
	// 尺寸标注 (内墙线)
	this.mbShowLabel = true;
	this.mLabel;	// 标注尺寸线
	this.mText;		// 尺寸文字 
	this.mMeshArrow  =null;
	this.mColor = 0x00000;
	this.m_vStart = new THREE.Vector3(0,0,0);
	this.m_vEnd   = new THREE.Vector3(0,0,0);
	this.m_fRotate= 0;
	this.m_fLength= 0;
	this.m_fCenterX=0;
	this.m_fCenterY=0;
	this.OnInit= function (mouseX,mouseY) 
	{
		//初始化尺寸线
		var geometry = new THREE.Geometry();
		this.OnBuildLine(geometry,0.1);
  		this.mLabel = new THREE.LineSegments(geometry, new THREE.LineBasicMaterial( { color: this.mColor , linewidth:1, opacity: 1 } ) );				
		this.mLabel.computeLineDistances();
		scene.add( this.mLabel );
		
		this.m_vStart.x   =  mouseX;  
		this.m_vStart.y   =  mouseY; 
	};
	
	this.GaiYanSe = function(iColor)
	{
		this.mMeshArrow.material.color.set(iColor);
		this.mLabel.material.color.set(iColor);
		this.mText.material.color.set(iColor);
	//	this.mMeshArrow.material.needsUpdate = true;
	//	this.mLabel.material.needsUpdate = true;
	};
		
	// 清空
	this.OnClear = function()
	{	
		this.mLabel.visible = false;
		if(this.mText)
		   this.mText.visible  = false;
		scene.remove(this.mLabel);
		scene.remove(this.mText);
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
		
	
	this.OnBuildLine = function(geometry,fLength)
	{
		var ftmp = 0;
		geometry.vertices.push( 
			new THREE.Vector3(-fLength/2,    0, ftmp),   new THREE.Vector3( fLength/2,    0, ftmp), 
			new THREE.Vector3(-fLength/2,  -10, ftmp),   new THREE.Vector3(-fLength/2,   10, ftmp),
			new THREE.Vector3( fLength/2,  -10, ftmp),   new THREE.Vector3( fLength/2,   10, ftmp)
		); 
		geometry.verticesNeedUpdate = true;
	};
	// 2是内墙线
	this.OnBuildArrow = function(fLength)
	{
		var off1 = 16;	
		var off2 = 6;
		var ftmp = 0;
		var geom = new THREE.Geometry();
		geom.vertices.push(new THREE.Vector3(-fLength/2, 0, ftmp)); 
    	geom.vertices.push(new THREE.Vector3(-fLength/2+off1, -off2, ftmp));      
    	geom.vertices.push(new THREE.Vector3(-fLength/2+off1,  off2, ftmp)); 
		geom.vertices.push(new THREE.Vector3( fLength/2, 0, ftmp)); 
    	geom.vertices.push(new THREE.Vector3( fLength/2-off1, -off2, ftmp));      
    	geom.vertices.push(new THREE.Vector3( fLength/2-off1,  off2, ftmp)); 
    	
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
	this.OnUpdateLabel = function()
	{		
		this.OnUpdate(this.m_vStart,this.m_vEnd);
		this.mLabel.geometry.vertices.length = 0;	
		this.OnBuildLine(this.mLabel.geometry,this.m_fLength);
		this.mLabel.remove(this.mMeshArrow);
		this.OnBuildArrow(this.m_fLength);
		
		var tmpMatrix1 = new THREE.Matrix4().makeTranslation(0,0,0);
		var tmpMatrix2 = new THREE.Matrix4().makeRotationZ(this.m_fRotate);
		var tmpMatrix3 = new THREE.Matrix4().makeTranslation(this.m_fCenterX,this.m_fCenterY,1);	
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
		var shapes = mHouseClass.mFont.generateShapes( (parseInt(this.m_fLength)*10).toString(), 13 );
		var geometryText = new THREE.ShapeBufferGeometry( shapes );
		geometryText.computeBoundingBox();
		geometryText.translate( - 0.5 * ( geometryText.boundingBox.max.x - geometryText.boundingBox.min.x ), 0, 0 );

		this.mText = new THREE.Mesh( geometryText, new THREE.MeshBasicMaterial( { side: THREE.DoubleSide, color: this.mColor } ));
		scene.add( this.mText );	
		
		var tmpMatrix1 = new THREE.Matrix4().makeTranslation(0,20,0);
		var tmpMatrix2 = new THREE.Matrix4().makeScale(1,1,1);
		var tmpMatrix3 = new THREE.Matrix4().makeRotationZ(this.m_fRotate);
		var tmpMatrix4 = new THREE.Matrix4().makeTranslation(this.m_fCenterX,this.m_fCenterY,1);	
		tmpMatrix2.multiply(tmpMatrix1);
		tmpMatrix3.multiply(tmpMatrix2);
		tmpMatrix4.multiply(tmpMatrix3);
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