/**
 * @api Furniture
 * @apiGroup Furniture
 * @apiDescription 模型类
 * @apiParam (成员变量) m_uuid 唯一ID
 * @apiParam (成员变量) m_fLength 当前长
 * @apiParam (成员变量) m_fWidth  当前宽
 * @apiParam (成员变量) m_fHeight 当前高
 *                            
 */
function Furniture()
{		
		this.m_uuid;
		this.m_fLength   = 100;		// 长
		this.m_fWidth	 = 50;
		this.m_fHeight   = 30;		// 高		3D下 y轴是高
		this.m_fLength2   = 100;	// 初始长
		this.m_fWidth2	 = 50;
		this.m_fHeight2   = 30;		// 初始宽	3D下 y轴是高		
		
		this.m_fRotate    = 0;		// 旋转 (度)
	    this.m_fRotateX   = -90;
	    this.m_fRotateY   = 0;
		this.m_fHight     = 0;		// 离地高
		this.m_fLengthOld;
		this.m_fWidthOld;
		this.m_fHeightOld;
		this.m_Object3D;			// 3D模型
		this.m_strFile;				// 模型相对路径
		this.m_strPath;				// 模型绝对路径
		this.mData;					// 所有数据
		this.m_strName='';
		this.mBoxHelper  = null;	
		this.m_RenderData2D;		// 平面图上显示的模型;
		this.m_Outline;				// 轮廓
		this.m_iColor;				// 轮廓颜色
		this.m_iFloor =-10;			// 楼层属性
		this.m_infoXML="";			// 保存用的数据
		this.m_Locking= false;		// 是否锁定
	    //----------------标识舞台灯模型（模型属性中包含"舞台灯光"）------
	    this.m_fModeType = 0;  //0:一般模型 1：舞台灯光

	    //聚光灯参数
	    this.m_fLightR = 1;
	    this.m_fLightG = 1;
	    this.m_fLightB = 1;
	    this.m_fIntensity = 500000;
	    this.m_fHotspot = 0.3504916; //聚光区/光束
	    this.m_fFallsize = 0.3853982; //衰减区/区域
	    this.m_projector_map = ""; //灯光投影贴图
	    //-----------end 舞台灯---------------------------------------

		this.m_vPos = new THREE.Vector3(); //不保存， 全局位置移动

		/**
		 * @api Clone()
		 * @apiGroup Furniture 
		 * @apiName  0
		 * @apiDescription 复制一个物体
		 * @apiParam (参数) iDirection 复制方向 0 x, 1 -x, 2 z, 3 -z
		 * @apiParam (返回值) tFurniture 新的物体 
		 */
		this.Clone = function(iDirection)
		{
			var tFurniture = new Furniture();
			tFurniture.mData 	  = this.mData;			// 所有数据信息，字符串形式
			tFurniture.m_strName  = this.m_strName;		
			mHouseClass.mFurnitureClass.mFurnitureArray.push( tFurniture );
			
			// 新位置
			var tmpMatrix1 = new THREE.Matrix4().makeTranslation(-this.m_Object3D.position.x, -this.m_Object3D.position.y, -this.m_Object3D.position.z);
			var tmpMatrix2 = new THREE.Matrix4().makeRotationY(this.m_fRotate*Math.PI/180);

			tmpMatrix2 = tmpMatrix2.makeRotationX(this.m_fRotateX*Math.PI/180);
			tmpMatrix2 = tmpMatrix2.makeRotationY(this.m_fRotateY*Math.PI/180);

			var tmpMatrix3 = new THREE.Matrix4().makeTranslation( this.m_Object3D.position.x,  this.m_Object3D.position.y,  this.m_Object3D.position.z);	
			tmpMatrix2.multiply(tmpMatrix1);
			tmpMatrix3.multiply(tmpMatrix2);
			
			if( iDirection == 0 )
				tFurniture.m_vPos = new THREE.Vector3( this.m_Object3D.position.x + this.m_fLength/10, this.m_Object3D.position.y, this.m_Object3D.position.z );			
			if( iDirection == 1 )
				tFurniture.m_vPos = new THREE.Vector3( this.m_Object3D.position.x - this.m_fLength/10, this.m_Object3D.position.y, this.m_Object3D.position.z );			
			if( iDirection == 2 )
				tFurniture.m_vPos = new THREE.Vector3( this.m_Object3D.position.x, this.m_Object3D.position.y, this.m_Object3D.position.z+this.m_fWidth/10 );			
			if( iDirection == 3 )
				tFurniture.m_vPos = new THREE.Vector3( this.m_Object3D.position.x, this.m_Object3D.position.y, this.m_Object3D.position.z-this.m_fWidth/10 );			
			
			tFurniture.m_vPos.applyMatrix4(tmpMatrix3);
			
		//	tFurniture.OnCreate3D(tFurniture.mData);
			
			
		  	tFurniture.m_uuid = mMathClass.GetUUID();			
			tFurniture.m_fLength  = this.m_fLength;		// 长
			tFurniture.m_fWidth   = this.m_fWidth;		// 宽
			tFurniture.m_fHeight  = this.m_fHeight;		// 高
			
			tFurniture.m_fLength2  = this.m_fLength2;	// 初始长
			tFurniture.m_fWidth2   = this.m_fWidth2;	// 初始宽
			tFurniture.m_fHeight2  = this.m_fHeight2;	// 初始高
		  		  
			tFurniture.m_fRotate   = this.m_fRotate;		// 旋转
			tFurniture.m_fRotateX  = this.m_fRotateX;
			tFurniture.m_fRotateY  = this.m_fRotateY;		  
			
			tFurniture.m_fHight   = this.m_fHight;		// 离地高
			tFurniture.m_strFile  = this.m_strFile;		// 模型相对路径
			tFurniture.m_strPath  = this.m_strPath;		// 模型绝对路径			
			tFurniture.m_infoXML  = this.m_infoXML;
			tFurniture.m_fModeType = this.m_fModeType;		// 长
			tFurniture.m_fLightR   = this.m_fLightR;
			tFurniture.m_fLightG   = this.m_fLightG;		// 高
			tFurniture.m_fLightB   = this.m_fLightB;		// 旋转
			tFurniture.m_fIntensity= this.m_fIntensity;		// 离地高
			tFurniture.m_fHotspot  = this.m_fHotspot;		// 模型相对路径
			tFurniture.m_fFallsize = this.m_fFallsize;		// 模型绝对路径
			tFurniture.m_projector_map = this.m_projector_map;
			
			
			var loader = new THREE.TDSLoader( );		  
			var strPathFile = m_strHttp + 'jiaju/'+this.m_strFile;
			tFurniture.m_strPath = this.m_strPath;			

		  	loader.load( strPathFile,function ( object ) {
						scene3D.add( object );
							
						tFurniture.m_Object3D = object;
						var box = new THREE.Box3();
							box.setFromObject( object );
						tFurniture.OnBuildBox(object);
						tFurniture.m_fLengthOld= (box.max.x - box.min.x );               
						tFurniture.m_fWidthOld = (box.max.y - box.min.y );
						tFurniture.m_fHeightOld= (box.max.z - box.min.z );
							
						object.scale.set((tFurniture.m_fLength/tFurniture.m_fLengthOld)/10,
										 (tFurniture.m_fWidth/tFurniture.m_fWidthOld)/10,
										 (tFurniture.m_fHeight/tFurniture.m_fHeightOld)/10);
						object.rotation.x = tFurniture.m_fRotateX*Math.PI/180;				 
						object.rotation.y = tFurniture.m_fRotateY*Math.PI/180;			 
						object.rotation.z = tFurniture.m_fRotate*Math.PI/180;
							
						object.position.x = tFurniture.m_vPos.x;	
						object.position.y = tFurniture.m_vPos.y;
						object.position.z = tFurniture.m_vPos.z;
							
			            tFurniture.mBoxHelper.rotation.y = object.rotation.y;

						tFurniture.m_bLoaded = true;	// 如果还没加载完，就传入数据，高度会 错
						tFurniture.mBoxHelper.position.x = object.position.x;
						tFurniture.mBoxHelper.position.y = object.position.y;
						tFurniture.mBoxHelper.position.z = object.position.z;	

						tFurniture.OnRender2DImage();	//设置2D俯视图
						tFurniture.OnCreate2D();
						tFurniture.m_RenderData2D.position.x =  object.position.x;
						tFurniture.m_RenderData2D.position.y = -object.position.z;
						tFurniture.m_RenderData2D.position.z =  tFurniture.m_fHeight/1000+object.position.y/100;
						tFurniture.m_RenderData2D.rotation.z =  object.rotation.z;

						tFurniture.OnUpdateTex3D();		//替换材质
						tFurniture.OnUpdate3D();
						mHouseClass.mFurnitureClass.OnShowCtrl(tFurniture);	//  显示操作框
			   	},
			   	function(event){}, 
			   	function(){	//出错删除	
			   		mHouseClass.mFurnitureClass.m_iLoading -=1;
			   		mHouseClass.mFurnitureClass.Delete(tFurniture);
			   	});		

			return tFurniture;
		};

		// 得到完整的最新数据
		this.GetDataFormDB = function()
		{
			if(this.mData == null)
				return;
			
		//	if(this.mData.length>6)
		//		return;
			var a1;		
			if("undefined" != typeof(m_version) && m_version=='index_3'){
				a1 = m_strObjData.split("\r\n");
			}else{
				a1 = m_strObjData.responseText.split("\r\n");
			}

		 	for(var i=1; i<a1.length; i++)
			{
				var s2 =a1[i];
				var a2 =s2.split(',');
	
				if(!IsEffectiveModel(a2))
					continue;
	
				var dataArray = new Array();
				if( a2[2] == this.mData[2])
				{
					this.mData = a2;
					return;
				}
			}	
		};
				
		this.m_bLoaded = false;
		this.OnCreate3D = function(ab)
		{
		  this.m_uuid = mMathClass.GetUUID();
		  this.mData  = ab;   			
		  this.m_strFile = ab[2];
		  this.m_fLength = parseInt(ab[3]);
		  this.m_fWidth  = parseInt(ab[4]);
		  this.m_fHeight = parseInt(ab[5]);
		  
		  this.m_fLength2 = this.m_fLength;
		  this.m_fWidth2  = this.m_fWidth;
		  this.m_fHeight2 = this.m_fHeight;
		  
		  var loader = new THREE.TDSLoader( );		  
		  var strPathFile = m_strHttp + 'jiaju/'+this.m_strFile;
		  var k = strPathFile.lastIndexOf("/");
		  this.m_strPath = strPathFile.slice(0,k+1);			

		  var that = this;
		  loader.load( strPathFile,function ( object ) {
						scene3D.add( object );

						if( that.m_vPos == null )
							that.m_vPos = new THREE.Vector3(0,0,0);
							
							that.m_Object3D = object;
							var box = new THREE.Box3();
								box.setFromObject( object );
							that.OnBuildBox(object);
							that.m_fLengthOld= (box.max.x - box.min.x );               
							that.m_fWidthOld = (box.max.y - box.min.y );
							that.m_fHeightOld= (box.max.z - box.min.z );
							
							object.scale.set((that.m_fLength/that.m_fLengthOld)/10,
											 (that.m_fWidth/that.m_fWidthOld)/10,
											 (that.m_fHeight/that.m_fHeightOld)/10);
							object.rotation.x = that.m_fRotateX*Math.PI/180;				 
							object.rotation.y = that.m_fRotateY*Math.PI/180;			 
							object.rotation.z = that.m_fRotate*Math.PI/180;
							
							object.position.x = that.m_vPos.x;	
							object.position.y = that.m_vPos.y;
							object.position.z = that.m_vPos.z;
							
				            that.mBoxHelper.rotation.y = object.rotation.y;

							that.m_bLoaded = true;	// 如果还没加载完，就传入数据，高度会 错
							that.mBoxHelper.position.x = object.position.x;
							that.mBoxHelper.position.y = object.position.y;
							that.mBoxHelper.position.z = object.position.z;	
							mHouseClass.mFurnitureClass.mHelpBox.visible = false;
							
							that.OnRender2DImage();	//设置2D俯视图
							that.m_RenderData2D.position.x =  object.position.x;
							that.m_RenderData2D.position.y = -object.position.z;
							that.m_RenderData2D.position.z =  that.m_fHeight/1000+object.position.y/100;
							that.m_RenderData2D.rotation.z =  object.rotation.z;	
							that.OnUpdateTex3D();		//替换材质
						//	that.OnUpdate3D();
							// 判断是否所有模型是否加载完成
							mHouseClass.mFurnitureClass.m_iLoadingNow +=1;
							UpdateLoading();
							if( mHouseClass.mFurnitureClass.m_iLoadingNow>=mHouseClass.mFurnitureClass.m_iLoading)
							 	ShowLoadingDlg(false);
			   	},
			   	function(event){}, 
			   	function(){	//出错删除	
			   		mHouseClass.mFurnitureClass.m_iLoading -=1;
			   		mHouseClass.mFurnitureClass.Delete(that);
			   	});
			this.GetDataFormDB();			   		
		};
				
		this.OnCreate3D_Edges = function(ab,iColor)
		{
		  this.m_uuid = mMathClass.GetUUID();
		  this.mData  = ab;  
		  this.m_strName = ab[0];
		  this.m_strFile = ab[2];
		  this.m_fLength = parseInt(ab[3]);
		  this.m_fWidth  = parseInt(ab[4]);
		  this.m_fHeight = parseInt(ab[5]);
		  
		  this.m_fLength2 = this.m_fLength;
		  this.m_fWidth2  = this.m_fWidth;
		  this.m_fHeight2 = this.m_fHeight;
		  this.m_iColor   = iColor;
		  var loader = new THREE.TDSLoader( );		  
		  var strPathFile = m_strHttp + 'jiaju/'+this.m_strFile;
		  var k = strPathFile.lastIndexOf("/");
		  this.m_strPath = strPathFile.slice(0,k+1);			

		  var that = this;
		  loader.load( strPathFile,function ( object ) {
						scene3D.add( object );

						if( that.m_vPos == null )
							that.m_vPos = new THREE.Vector3(0,0,0);
							
							that.m_Object3D = object;
							var box = new THREE.Box3();
								box.setFromObject( object );
							that.OnBuildBox(object);
							that.m_fLengthOld= (box.max.x - box.min.x );               
							that.m_fWidthOld = (box.max.y - box.min.y );
							that.m_fHeightOld= (box.max.z - box.min.z );
							
							// 偏移中心点
						/*	that.m_vPos.x -= (box.max.x + box.min.x )/2;               
							that.m_vPos.y -= 0;//(box.max.z + box.min.z )/2;updateMatrix
							that.m_vPos.z -= (box.max.z + box.min.z )/2;*/
						
							object.scale.set((that.m_fLength/that.m_fLengthOld)/10,
											 (that.m_fWidth/that.m_fWidthOld)/10,
											 (that.m_fHeight/that.m_fHeightOld)/10);
							object.rotation.x = that.m_fRotateX*Math.PI/180;				 
							object.rotation.y = that.m_fRotateY*Math.PI/180;
							object.rotation.z = that.m_fRotate*Math.PI/180;
							
							object.position.x = that.m_vPos.x;	// 是2D位置数据，不是3D位置
							object.position.y = that.m_vPos.y;
							object.position.z = that.m_vPos.z;
										
				            that.mBoxHelper.rotation.y = object.rotation.y;

							that.m_bLoaded = true;	// 如果还没加载完，就传入数据，高度会 错
							that.mBoxHelper.position.x = object.position.x;
							that.mBoxHelper.position.y = object.position.y;
							that.mBoxHelper.position.z = object.position.z;	
							mHouseClass.mFurnitureClass.mHelpBox.visible = false;
							
							that.OnRender2DImage();	//设置2D俯视图
							that.m_RenderData2D.position.x =  object.position.x;
							that.m_RenderData2D.position.y = -object.position.z;
							that.m_RenderData2D.position.z =  that.m_fHeight/1000+object.position.y/100;
							that.m_RenderData2D.rotation.z =  object.rotation.z;	
							that.OnUpdateTex3D();		//替换材质
							that.OnUpdate3D();	
							
							that.ShowEdges(that.m_iColor);

			   	},
			   	function(event){}, 
			   	function(){	//出错删除																
			   		mHouseClass.mFurnitureClass.Delete(that);
			   	});
			this.GetDataFormDB();			   		
		};		
		this.ShowEdges = function(icolor)
		{
			var edges;
			if( this.m_Object3D.children[0])
				edges = new THREE.EdgesGeometry( this.m_Object3D.children[0].geometry );
			else
				edges = new THREE.EdgesGeometry( this.m_Object3D.geometry );
			this.m_Outline = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: icolor} ) );
			scene3D.add( this.m_Outline );
			this.m_Object3D.add(this.m_Outline);
		};

		this.OnChangeColor2D = function(fColor)
		{
			// 2D变颜色
			this.m_RenderData2D.material.color.set(fColor);
		};
		
		this.OnCreate2D = function()
		{
			// 2D图片
		//	var tPlaneGeometry  = new THREE.PlaneGeometry((this.m_fLength/this.m_fLengthOld)/10,(this.m_fWidth/this.m_fWidthOld)/10, 1, 1);
			var tPlaneGeometry  = new THREE.PlaneGeometry(this.m_fLength/10, this.m_fWidth/10, 1, 1);		
			var tPlaneMaterial  = new THREE.MeshBasicMaterial({color: 0xffffff, opacity: 0.8, transparent: true});		
			this.m_RenderData2D = new THREE.Mesh(tPlaneGeometry, tPlaneMaterial);	
			scene.add(this.m_RenderData2D);		
		};

		this.OnRender2DImage = function()
		{
			var strImage = m_strHttp + 'jiaju/'+this.m_strFile.slice(0,this.m_strFile.length-4)+".png";
			var that = this;
			var ImgObj = new Image(); //判断图片是否存在  
			    ImgObj.src = strImage;

			    ImgObj.onload=function()
			    {	
					texture = new THREE.TextureLoader().load(strImage );
					texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
					texture.matrixAutoUpdate = true;
			
					var materialBox  = new THREE.MeshBasicMaterial({ map:texture, opacity: 1, transparent: true});
					that.m_RenderData2D.material = materialBox;
					that.m_RenderData2D.material.needsUpdate = true;   			    	    
			    }
			    
			    ImgObj.onerror=function(){

					ErrorLogAdd_Arr(that.m_strFile+",下载不到对应的2D图.")
					
					strImage='img/jiajv01.png';
					texture = new THREE.TextureLoader().load(strImage );
					texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
					texture.matrixAutoUpdate = true;
			
					var materialBox  = new THREE.MeshBasicMaterial({ map:texture, opacity: 1, transparent: true});
					that.m_RenderData2D.material = materialBox;
					that.m_RenderData2D.material.needsUpdate = true;  
			    }
		};
		
		this.OnBuildBox = function(tObject)
		{
			scene3D.remove(this.mBoxHelper);
			var box = new THREE.Box3();
				box.setFromObject( tObject );
			
			var min = box.min;
			var max = box.max;

			var indices   = new Uint16Array( [ 0, 1, 1, 2, 2, 3, 3, 0, 4, 5, 5, 6, 6, 7, 7, 4, 0, 4, 1, 5, 2, 6, 3, 7 ] );
			var positions = new Float32Array( 8 * 3 );
		
			var geometry = new THREE.BufferGeometry();
			geometry.setIndex( new THREE.BufferAttribute( indices, 1 ) );
			geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
		
			this.mBoxHelper = new THREE.LineSegments( geometry, new THREE.LineBasicMaterial( { color: 0x00A8ff ,opacity: 0, transparent: true} ) );
		
			var position = geometry.attributes.position;
			var array = position.array;
	
			array[ 0 ] = max.x; array[ 1 ] = max.y; array[ 2 ] = max.z;
			array[ 3 ] = min.x; array[ 4 ] = max.y; array[ 5 ] = max.z;
			array[ 6 ] = min.x; array[ 7 ] = min.y; array[ 8 ] = max.z;
			array[ 9 ] = max.x; array[ 10 ] = min.y; array[ 11 ] = max.z;
			array[ 12 ] = max.x; array[ 13 ] = max.y; array[ 14 ] = min.z;
			array[ 15 ] = min.x; array[ 16 ] = max.y; array[ 17 ] = min.z;
			array[ 18 ] = min.x; array[ 19 ] = min.y; array[ 20 ] = min.z;
			array[ 21 ] = max.x; array[ 22 ] = min.y; array[ 23 ] = min.z;
			position.needsUpdate = true;
			
			scene3D.add(this.mBoxHelper);
		};
		
	/*	this.OnUpdate3D = function()
		{
			if(this.m_Object3D)
			{
				var tmpMatrix1 = new THREE.Matrix4().makeScale((this.m_fLength/this.m_fLengthOld)/10,
										  					   (this.m_fWidth/this.m_fWidthOld)/10,
										  					   (this.m_fHeight/this.m_fHeightOld)/10);
				var tmpMatrix2 = new THREE.Matrix4().makeRotationX(0);//this.m_fRotateX*Math.PI/180
					tmpMatrix2 = tmpMatrix2.makeRotationY(this.m_fRotateY*Math.PI/180);
					tmpMatrix2 = tmpMatrix2.makeRotationZ(this.m_fRotate*Math.PI/180);
					
				var tmpMatrix3 = new THREE.Matrix4().makeTranslation( this.m_Object3D.position.x,  this.m_fHight/10,  this.m_Object3D.position.z);	
					tmpMatrix2.multiply(tmpMatrix1);
					tmpMatrix3.multiply(tmpMatrix2);
					
					mMathClass.Identity(this.m_Object3D);					
					this.m_Object3D.applyMatrix(tmpMatrix3); 
					this.m_Object3D.updateMatrixWorld(true);					
					
					mMathClass.Identity(this.mBoxHelper);					
					this.mBoxHelper.applyMatrix(tmpMatrix3); 
					this.mBoxHelper.updateMatrixWorld(true);						
			}
			this.m_RenderData2D.scale.set((this.m_fLength/this.mData[3]),(this.m_fWidth/this.mData[4]),1);
			this.m_RenderData2D.rotation.z = this.m_fRotate*Math.PI/180;			
		};*/
		
		this.OnUpdate3D = function()
		{		
			if(this.m_Object3D)
			{
				this.m_Object3D.scale.set((this.m_fLength/this.m_fLengthOld)/10,
										  (this.m_fWidth/this.m_fWidthOld)/10,
										  (this.m_fHeight/this.m_fHeightOld)/10);						 

				this.m_Object3D.rotation.x = this.m_fRotateX*Math.PI/180;
				this.m_Object3D.rotation.y = this.m_fRotateY*Math.PI/180;
				this.m_Object3D.rotation.z = this.m_fRotate*Math.PI/180;
				this.m_Object3D.position.y = this.m_fHight/10;
	
				this.mBoxHelper.scale.set((this.m_fLength/this.m_fLengthOld)/10,
										  (this.m_fWidth/this.m_fWidthOld)/10,
										  (this.m_fHeight/this.m_fHeightOld)/10);

				this.mBoxHelper.rotation.x = this.m_Object3D.rotation.x;
				this.mBoxHelper.rotation.y = this.m_Object3D.rotation.y;
				this.mBoxHelper.rotation.z = this.m_Object3D.rotation.z;	
				this.mBoxHelper.position.y = this.m_Object3D.position.y;
				
			}			
			this.m_RenderData2D.scale.set((this.m_fLength/this.mData[3]),(this.m_fWidth/this.mData[4]),1);
			this.m_RenderData2D.rotation.z = this.m_fRotate*Math.PI/180;
		};

		
		this.OnUpdateTex3D = function()
		{

			// 替换材质
			var  xmlDoc = $.parseXML( this.m_infoXML );
			if( xmlDoc == null)
				return;
			var tArray = new Array();
			
			for(var j = 0; j< this.m_Object3D.children.length; j++)
			{
				if(this.m_Object3D.children[j].material.map == null )
	        	  	continue;
	        //	if(this.m_Object3D.children[j].material.map.image== null)
	        //	  continue;	
	        	 tArray.push(j);
			}
			
			for ( var i = 0; i<xmlDoc.getElementsByTagName("node").length; i++ )
	        {
	        	var strPathImage = xmlDoc.getElementsByTagName("node")[i].attributes[1].nodeValue;
	        	if( strPathImage != "")
				{
					this.m_Object3D.children[tArray[i]].material.map = new THREE.TextureLoader().load(m_strHttp+"texture/"+strPathImage, render );
					this.m_Object3D.children[tArray[i]].material.map.wrapS = this.m_Object3D.children[tArray[i]].material.map.wrapT = THREE.RepeatWrapping;
				}
	        }
		};
							
		this.OnDelete= function()
		{
			if(!this.m_Object3D)
				return;

			for(var i = 0; i < this.m_Object3D.children.length;i++)
			{
				scene3D.remove( this.m_Object3D.children[i] );
			}
			scene3D.remove( this.m_Object3D );
			scene3D.remove( this.mBoxHelper );
			scene.remove(this.m_RenderData2D);
			scene3D.remove( this.m_Outline );
			
		};
		
		this.ChangeMesh = function(tMesh)
		{
			// 替换Mesh
			for(var i = 0; i < this.m_Object3D.children.length;i++)
				scene3D.remove( this.m_Object3D.children[i] );			
			scene3D.remove( this.m_Object3D );
			this.m_Object3D = tMesh;
			scene3D.add(tMesh);
		};
		
		this.UpdateFlue = function()
		{
			if( this.m_Object3D )
			{
				this.m_Object3D.scale.set((this.m_fLength/this.m_fLengthOld)/10,
										  (this.m_fWidth/this.m_fWidthOld)/10,
										  (this.m_fHeight/this.m_fHeightOld)/10);
				this.m_Object3D.rotation.x = this.m_fRotateX*Math.PI/180;
				this.m_Object3D.rotation.y = this.m_fRotateY*Math.PI/180;
				this.m_Object3D.rotation.z = this.m_fRotate*Math.PI/180;
				this.m_Object3D.position.y = this.m_fHight/10;
				
				this.m_Object3D.position.x =  this.m_vPos.x;
				this.m_Object3D.position.z = -this.m_vPos.y;
				
				this.mBoxHelper.scale.set((this.m_fLength/this.m_fLengthOld)/10,
										  (this.m_fWidth/this.m_fWidthOld)/10,
										  (this.m_fHeight/this.m_fHeightOld)/10);

				this.mBoxHelper.rotation.x = this.m_Object3D.rotation.x;
				this.mBoxHelper.rotation.y = this.m_Object3D.rotation.y;
				this.mBoxHelper.rotation.z = this.m_Object3D.rotation.z;				
				this.mBoxHelper.position.x =  this.m_vPos.x;
				this.mBoxHelper.position.z = -this.m_vPos.y;
			}
			
			this.m_RenderData2D.scale.set((this.m_fLength/this.mData[3]),(this.m_fWidth/this.mData[4]),1);
			this.m_RenderData2D.rotation.z = this.m_fRotate*Math.PI/180;		
			this.m_RenderData2D.position.x = this.m_vPos.x;
			this.m_RenderData2D.position.y = this.m_vPos.y;

			this.m_RenderData2D.position.z = 0.1;		// 放地面
			if(this.m_fHeight>1500)
			   this.m_RenderData2D.position.z = 0.5;	// 高柜
			if(this.m_fHeight<800)						// 类似托盘
			   this.m_RenderData2D.position.z = 0.3;
			if(this.m_fHeight<400)						// 摆件
			   this.m_RenderData2D.position.z = 0.4;			
			
			if(this.m_fHight>1000)						// 升高了
			   this.m_RenderData2D.position.z = 0.5;
		};		
		
		// 是否显示物体
		this.OnShow = function(bShow)
		{
			if(this.mBoxHelper)
			{
				this.mBoxHelper.visible    = bShow;
				this.m_Object3D.visible    = bShow;
				this.m_RenderData2D.visible= bShow;
			}
		};
		
		this.OnShowGroup = function(bShow)
		{
			if(this.mBoxHelper)
			{
				if( bShow== 1 )
					this.mBoxHelper.visible    = true;
				else
					this.mBoxHelper.visible    = false;
				this.mBoxHelper.material.opacity = bShow-0.5;
			}
		};

		this.OnHideCtrl = function()
		{
		};

		this.OnShowHelp = function()
		{				
		};
		
		this.OnSave = function()
		{
			var strXML = `<Furniture3D
						   UUID="${this.m_uuid}"
						   Name="${this.m_strName}" 
						   PosX="${this.m_RenderData2D.position.x}" 	
						   PosY="${this.m_RenderData2D.position.y}" 
						   PosZ="${this.m_Object3D.position.y}" 
                           Length="${this.m_fLength/10}" 
                           Width ="${this.m_fWidth/10}" 
                           Height="${this.m_fHeight/10}" 
                           Rotate="${this.m_fRotate*Math.PI/180}"  
                           RotateX="${this.m_fRotateX*Math.PI/180}"  
                           RotateY="${this.m_fRotateY*Math.PI/180}"  
                           source="${this.m_strFile}"
                           ModeType="${this.m_fModeType}" 
                           LightR="${this.m_fLightR}" 
                           LightG="${this.m_fLightG}" 
                           LightB="${this.m_fLightB}"
                           Intensity="${this.m_fIntensity}" 
                           Hotspot="${this.m_fHotspot}" 
                           Fallsize="${this.m_fFallsize}"
                           ProjectorMap="${this.m_projector_map}">`;
              
			strXML += `<Texture>`;
			
			var  xmlDoc = $.parseXML( this.m_infoXML );
			if(xmlDoc)
			{
				for ( var i = 0; i<xmlDoc.getElementsByTagName("node").length; i++ ) 
		        {
		        	var strOld = xmlDoc.getElementsByTagName("node")[i].attributes[2].nodeValue;
		        	var strNew = xmlDoc.getElementsByTagName("node")[i].attributes[1].nodeValue;
		        	if( strNew != "")
						strXML+= `<node index="${i}" path="${strNew}" pathOld="${strOld}"/>`;	// 被替换
					else
						strXML+= `<node index="${i}" path="" pathOld="${strOld}"/>`;			// 无替换
		        }
	        }
			else	// 第一次加载
			{
				for ( var i = 0; i < this.m_Object3D.children.length; i++ ) 	// 记录所有节点
		        {	     
		        	
		        	if(this.m_Object3D.children[i].material.map == null )
		        	  continue;
		        	
		        	if(this.m_Object3D.children[i].material.map.image== null)
		        	  continue;
		        	  
		        	var strOld = this.m_Object3D.children[i].material.map.image.src;
		        	let nPos = strOld.lastIndexOf('data/jiaju/');
					strOld = strOld.substr(nPos);

					strXML+= `<node index="${i}" path="" pathOld="${strOld}"/>`;
		        }
	        }
	        
	        strXML+= `</Texture>`;              
            strXML+= `</Furniture3D>`;
			this.m_infoXML = strXML;
			return this.m_infoXML;
		};

	this.OnCreateSVG = function(ab,xPos,yPos,zPos,rotateX,rotateY,rotateZ)
	{
/*		this.mLabelH = new LabelClass();
		this.mLabelH.OnInit(0xff0000);
		this.mLabelV = new LabelClass();
		this.mLabelV.OnInit(0xff0000);

		this.mData = ab;*/
		this.m_vPos= new THREE.Vector3(0,0,0);

		var loader = new THREE.SVGLoader();
		//this.m_strFile  = './svg/draw.svg';
		//var strPathFile = this.m_strFile+"?"+Math.floor(Math.random() * 100000);
		loader.load( "http://127.0.0.1/draw.svg", function ( paths ) {

			var tObject = new THREE.Group();

/*			var tLength;
			if(planWidth>planHeight)
				tLength = planWidth;
			else
				tLength = planHeight;*/

			var fScale = 1;//tLength/1250;
			if(fScale<1)
				fScale=1;

			var OBBox_Max = new THREE.Vector3(-99999,-99999,0);
			var OBBox_Min = new THREE.Vector3( 99999, 99999,0);

			tObject.scale.multiplyScalar(fScale);
			for ( var i = 0; i < paths.length; i ++ ) {

				var path = paths[ i ];
				var material = new THREE.LineBasicMaterial( {color: 0xffffff} );
				//var material = new THREE.LineBasicMaterial( {color: 0x000000} );

				var shapes = path.toShapes( true );
				for ( var j = 0; j < shapes.length; j ++ ) {
					var shape = shapes[ j ];
					var points = shape.getPoints();
					points.push(new THREE.Vector2(points[0].x,points[0].y));
					var geometry = new THREE.BufferGeometry().setFromPoints( points );
					//var geometry = new THREE.ShapeGeometry( shape );
					var mesh = new THREE.Line( geometry, material );

					tObject.add( mesh );
					mesh.geometry.computeBoundingBox();

					if( OBBox_Max.x < mesh.geometry.boundingBox.max.x ) OBBox_Max.x  = mesh.geometry.boundingBox.max.x;
					if( OBBox_Max.y < mesh.geometry.boundingBox.max.y ) OBBox_Max.y  = mesh.geometry.boundingBox.max.y;
					if( OBBox_Min.x > mesh.geometry.boundingBox.min.x ) OBBox_Min.x  = mesh.geometry.boundingBox.min.x;
					if( OBBox_Min.y > mesh.geometry.boundingBox.min.y ) OBBox_Min.y  = mesh.geometry.boundingBox.min.y;
				}
			}
			tObject.name = "LegendBox";

			mFrameWidth = OBBox_Max.x -OBBox_Min.x;
			mFrameHeight = OBBox_Max.y -OBBox_Min.y;
			//tObject.position.set(xPos-mFrameWidth/2,yPos+mFrameHeight/2,zPos);
			//tObject.position.set((xPos-mFrameWidth/2) * fScale,(yPos+mFrameHeight/2)*fScale,zPos);
			tObject.position.set(0,0,0);

			tObject.rotation.x += rotateX;
			tObject.rotation.y += rotateY;
			tObject.rotation.z += rotateZ;

			scene.add( tObject );
		} );
	};
}
