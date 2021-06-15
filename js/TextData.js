/**
 * @api TextData
 * @apiGroup TextData
 * @apiName  0
 * @apiDescription 单个文字类
 * @apiParam (成员变量) mRoomName 文字内容
 * @apiParam (成员变量) mText 文字Mesh
 * @apiParam (成员变量) mTextWhile 暂时没有使用
 * @apiParam (成员变量) mLabel3D 文字3D下标签
 * @apiParam (成员变量) mTextBox 平面下文字想要鼠标点击用box
 * @apiParam (成员变量) m_vPos 平面下文字的位置
 */
function TextData()
{		
		this.mRoomName = i18n.t("Language.RoomName"); //'{{ $t("Language.RoomName")}}' ; //"房间名称";//i18n.t("Language.RoomName");
		this.mText;
		this.mTextWhile;
		this.mLabel3D;
		this.mDiv3D;
		this.mTextBox;	
		this.m_vPos;

		/**
		 * @api OnInit()
		 * @apiDescription 初始化文字
		 * @apiGroup TextData
		 *                           
		 */	
		this.OnInit = function()
		{
			this.m_vPos	   = new THREE.Vector3(0,0,0);
		};
		
		/**
		 * @api OnCreate(x,y)
		 * @apiDescription 创建新的文字
		 * @apiGroup TextData
		 *                           
		 */			
		this.OnCreate = function(x,y){
			
			if (x == -99999 && y == -99999) 	// 更新
			{
				this.m_vPos.x=this.mText.position.x;
				this.m_vPos.y=this.mText.position.y;
				this.m_vPos.z=this.mText.position.z;
			}
			else
			{
				this.m_vPos.x=x;
				this.m_vPos.y=y;				
			}
			scene.remove(this.mText);
			scene.remove(this.mTextBox);
			
			var shapes = mHouseClass.mFont.generateShapes( this.mRoomName, 70 );
			var geometryText = new THREE.ShapeBufferGeometry( shapes );
			geometryText.computeBoundingBox();
			geometryText.translate( - 0.5 * ( geometryText.boundingBox.max.x - geometryText.boundingBox.min.x ), 0, 0 );
		
		//	var shapes1 = mHouseClass.mFont.generateShapes( this.mRoomName, 100 );
		//	var geometryText1 = new THREE.ShapeBufferGeometry( shapes1 );
		//	geometryText1.computeBoundingBox();
		//	geometryText1.translate( - 0.5 * ( geometryText.boundingBox.max.x - geometryText.boundingBox.min.x ), 0, 0 );
		
		
			this.mText = new THREE.Mesh( geometryText, mResource.mFontTex );
		//	this.mTextWhile = new THREE.Mesh( geometryText1, mResource.mFontBuleTex );
		//	this.mText.name = "FloorText";

			tWidth = geometryText.boundingBox.max.x - geometryText.boundingBox.min.x;
			tHeight= geometryText.boundingBox.max.y - geometryText.boundingBox.min.y;
			var geometry  = new THREE.BoxBufferGeometry( tWidth+10, tHeight+10, 0);
		  	this.mTextBox= new THREE.Mesh(geometry, new THREE.MeshBasicMaterial( { color: 0xff0000, opacity: 0.0, transparent: true } ) ); 
			this.mText.add(this.mTextBox);
		//	this.mText.add(this.mTextWhile);
			scene.add( this.mText );
			
				
			var tmpMatrix0 = new THREE.Matrix4().makeTranslation(0,40,0);
			this.mTextBox.applyMatrix(tmpMatrix0);
			var tmpMatrix1 = new THREE.Matrix4().makeTranslation(0,0,0);
			var tmpMatrix2 = new THREE.Matrix4().makeScale(0.3,0.3,1);
			var tmpMatrix3 = new THREE.Matrix4().makeRotationZ(0);
			var tmpMatrix4 = new THREE.Matrix4().makeTranslation(this.m_vPos.x,this.m_vPos.y,0);	
			tmpMatrix2.multiply(tmpMatrix1);
			tmpMatrix3.multiply(tmpMatrix2);
			tmpMatrix4.multiply(tmpMatrix3);
			this.mText.rotation.z = 0;
		//	this.mText.position.x = 0;			
		//	this.mText.position.y = 0;
			this.mText.position.z = 1;
			this.mText.scale.x = 1;
			this.mText.scale.y = 1;
			this.mText.scale.z = 1;
			this.mText.matrixWorld.identity();
			this.mText.matrix.identity();
			this.mText.updateMatrixWorld(true);
			this.mText.applyMatrix(tmpMatrix4);
		};
		
		/**
		 * @api OnDelete()
		 * @apiDescription 删除当前文字
		 * @apiGroup TextData
		 *                           
		 */		
		this.OnDelete = function()
		{
			scene.remove(this.mText);
			scene.remove(this.mTextBox);
			scene3D.remove(this.mLabel3D);
			scene3D.remove(this.mLine);
			scene3D.remove(this.m_boxMesh1 );
			scene3D.remove(this.m_boxMesh2 );
			
			if(this.mDiv3D != undefined)
			{
			   if(document.body.contains(this.mDiv3D)== true)
			   	  document.body.removeChild(this.mDiv3D);
			}
		};
		
		/**
		 * @api OnUpdateName(strText)
		 * @apiDescription 更新文字内容
		 * @apiGroup TextData
		 * @apiParam (参数) strText 文字内容                          
		 */			
		this.OnUpdateName = function(strText)
		{
			this.mRoomName=strText;
			this.OnDelete();
			this.OnCreate(-99999,-99999);
			this.OnCreate3D();
			this.OnUpdateText();
		};
		
		/**
		 * @api OnCreate3D()
		 * @apiDescription 在3D中创建文字
		 * @apiGroup TextData
		 *                       
		 */		
		this.OnCreate3D = function()
		{
			this.mDiv3D = document.createElement( 'div' );
			this.mDiv3D.className = 'labelText';
			this.mDiv3D.textContent = this.mRoomName;
			this.mDiv3D.style.marginTop = '-1em';
			this.mLabel3D = new THREE.CSS2DObject( this.mDiv3D );
			
			scene3D.add( this.mLabel3D );	
			
			var fCenterX = (mHouseClass.mFloorClass.m_OBBox_Max.x+mHouseClass.mFloorClass.m_OBBox_Min.x)/2;
			var fCenterY = (mHouseClass.mFloorClass.m_OBBox_Max.y+mHouseClass.mFloorClass.m_OBBox_Min.y)/2;
			var geometry = new THREE.Geometry();	
			
			var fValue1= 120;
			var fValue2= 360;
			if( this.m_vPos.x < fCenterX) // 右
			{
				fValue1 = -fValue1;
			}
			
/*			if(this.m_vPos.y > fCenterY)	// 上
			{
				fValue2 = -fValue2;
			}*/
			this.mLabel3D.position.set(this.m_vPos.x+fValue1,fValue2,this.m_vPos.y );
			geometry.vertices.push( new THREE.Vector3( this.m_vPos.x,  0,this.m_vPos.y ), new THREE.Vector3( this.m_vPos.x,    		  fValue2,this.m_vPos.y ));
			geometry.vertices.push( new THREE.Vector3( this.m_vPos.x,fValue2,this.m_vPos.y ), new THREE.Vector3( this.m_vPos.x+fValue1,fValue2,this.m_vPos.y));

			this.mLine = new THREE.LineSegments( geometry, new THREE.LineBasicMaterial( { color: 0xB49464, opacity: 1 } ) );//			
			scene3D.add( this.mLine );
			
			var box1     = new THREE.BoxBufferGeometry( 12, 12, 0 );
			var mat    	   = new THREE.LineBasicMaterial( { color: 0xB49464, opacity: 1 } );
			this.m_boxMesh1= new THREE.Mesh( box1, mat);
			
			var box2     = new THREE.BoxBufferGeometry( 12, 12, 0 );
			this.m_boxMesh2= new THREE.Mesh( box2, mat);
			
			scene3D.add( this.m_boxMesh1 );
			scene3D.add( this.m_boxMesh2 );
			
		};
		
		/**
		 * @api OnUpdateText()
		 * @apiDescription 在3D中更新文字位置
		 * @apiGroup TextData
		 *                       
		 */		
		this.OnUpdateText = function()
		{
			var fCenterX = (mHouseClass.mFloorClass.m_OBBox_Max.x+mHouseClass.mFloorClass.m_OBBox_Min.x)/2;
			var fCenterY = (mHouseClass.mFloorClass.m_OBBox_Max.y+mHouseClass.mFloorClass.m_OBBox_Min.y)/2;			
			var fValue1  = 120;
			var fValue2  = 360;
			if( this.m_vPos.x < fCenterX) // 右
			{
				fValue1 = -fValue1;
			}
        	this.mLine.geometry.vertices[0].set(this.m_vPos.x,       		0,-this.m_vPos.y);
			this.mLine.geometry.vertices[1].set(this.m_vPos.x, 		  fValue2,-this.m_vPos.y);
			this.mLine.geometry.vertices[2].set(this.m_vPos.x, 		  fValue2,-this.m_vPos.y);
			this.mLine.geometry.vertices[3].set(this.m_vPos.x+fValue1,fValue2,-this.m_vPos.y);
	        this.mLine.geometry.verticesNeedUpdate = true;	
	        
	        this.mLabel3D.position.set( this.m_vPos.x+fValue1, fValue2, -this.m_vPos.y ); 
	        this.m_boxMesh1.position.set( this.m_vPos.x+fValue1, fValue2, -this.m_vPos.y );
	        this.m_boxMesh2.position.set( this.m_vPos.x,       		   6, -this.m_vPos.y );
		};
		
		/**
		 * @api OnShow(bShow)
		 * @apiDescription 是否显示文字
		 * @apiGroup TextData
		 *                       
		 */		
		this.OnShow = function(bShow)
		{
			this.mText.visible     =bShow;	
			this.mTextBox.visible  =bShow;
			this.mLabel3D.visible  =bShow;
			this.mDiv3D.visible    =bShow;
			this.mLabel3D.visible  =bShow;
			this.mLine.visible     =bShow;
			this.m_boxMesh1.visible=bShow;
			this.m_boxMesh2.visible=bShow;			
		};
}