/**
 * @api WindowData
 * @apiGroup WindowData
 * @apiName  0
 * @apiDescription 单个窗类
 * @apiParam (成员变量) m_vPos 窗户位置
 */
function WindowData()
{
	this.m_vPos;
	this.m_fLength;
	this.m_fHeight;
	this.m_fRotate;
	this.m_fWidth;
	this.m_fHight = 50;			// 离地高
	this.m_iMode;						// 门的类型 ( 单开门, 双开门 )
	this.m_iMirror;					// 开门方向
	this.m_strFile;					// 相对路径
	this.m_iStyle;
	this.mData;

	this.m_RenderData2D;
	this.m_RenderWin2D;
	this.m_Object;
//		this.m_fLength2;				// 移动时遇到短墙保存
	this.m_fLengthOld;
	this.m_fWidthOld;
	this.m_fHeightOld;
	this.m_pCurWall = null;	// 所在墙体

	this.OnInit = function(a,index)
	{

		//"cAF2488D8F0DE8F7D6C534817A60F9391/c8157435A40887E2EB4A54817A660A446/c74000EF390AFD5E068CBC00C0ACE93B1/ldc688/ldc688.jpg";
		//this.m_strFile 	 = "WSJ01/CL431.jpg";
		this.m_vPos 		 = new THREE.Vector3(-9999,-9999,0);
		if( a== 0 )//标准窗
		{
			this.m_strFile ="cAF2488D8F0DE8F7D6C534817A60F9391/cE3296A2DCE1F0578819D96F21D7EE397/c74000EF390AFD5E068CBC00C0ACE93B1/chuang01/chuang01.jpg";
			this.m_fLength   = 170;//150;
			this.m_fWidth    = 20;//22;//fWidth/10;
			this.m_fHeight   = 180;//220;
			this.m_fRotate   = 0;
			this.m_iMode     = 0;
			this.m_iMirror   = 0;
			this.m_iStyle    = a;
		}

		if( a== 1 )//落地窗
		{
			this.m_strFile ="cAF2488D8F0DE8F7D6C534817A60F9391/c8157435A40887E2EB4A54817A660A446/c74000EF390AFD5E068CBC00C0ACE93B1/Mldc688/Mldc688.jpg";
			this.m_fLength   = 200;
			this.m_fWidth    = 20;//22;//fWidth/10;
			this.m_fHeight   = 220;
			this.m_fRotate   = 0;
			this.m_iMode     = 0;
			this.m_iMirror   = 0;
			this.m_iStyle    = a;
		}

		if( a== 2 )//飘窗
		{
			this.m_strFile ="cAF2488D8F0DE8F7D6C534817A60F9391/cF817364BC362E25F172757454724B2A8/c74000EF390AFD5E068CBC00C0ACE93B1/PCdfvn01/PCdfvn01.jpg";
			this.m_fLength   = 260;//250; //150
			this.m_fWidth    = 22;//90;//fWidth/10;
			this.m_fHeight   = 215;//210;	 //100
			this.m_fRotate   = 0;
			this.m_iMode     = 0;
			this.m_iMirror   = 0;
			this.m_iStyle    = a;
		}

		if( a== 3 )
		{
			this.m_strFile ="cAF2488D8F0DE8F7D6C534817A60F9391/cE3296A2DCE1F0578819D96F21D7EE397/c74000EF390AFD5E068CBC00C0ACE93B1/chuang01/chuang01.jpg";
			this.m_fLength   = 250; //200
			this.m_fWidth    = 90;//fWidth/10; 22
			this.m_fHeight   = 210;	 //100
			this.m_fRotate   = 0;
			this.m_iMode     = 0;
			this.m_iMirror   = 0;
			this.m_iStyle    = a;
		}

		if( a== 5 )//窗洞
		{
			this.m_strFile ="cAF2488D8F0DE8F7D6C534817A60F9391/c959EB67AE571A0FFB8B85C80F3944457/c74000EF390AFD5E068CBC00C0ACE93B1/GXmen03/GXmen03.jpg";
			this.m_fLength   = 170;//150;
			this.m_fWidth    = 20;//22;//fWidth/10;
			this.m_fHeight   = 180;//220;
			this.m_fRotate   = 0;
			this.m_iMode     = 0;
			this.m_iMirror   = 0;
			this.m_iStyle    = a;
		}

		/*		if( a[4]== "飘窗" )	//|| a[4] == "矩形窗"
                        this.m_iStyle = 1;

                if( a[4]== "无窗" )
                        this.m_iStyle = 2;*/

		this.mData = a;
		this.OnCreateWin2D();
		this.OnCreateWin3D(index);
		this.UpdateWindow();
	};

	this.OnClear = function()
	{
		if(this.m_Object != undefined && this.m_Object != null)
		{
			for(var i = 0; i<this.m_Object.children.length;i++)
				scene3D.remove( this.m_Object.children[i] );

			scene3D.remove(this.m_Object);
		}
		scene.remove(this.m_RenderData2D);
		scene.remove(this.m_RenderWin2D);
		// scene3D.remove(this.m_Object);

		this.m_RenderData2D = null;
		this.m_RenderWin2D  = null;
		this.m_Object       = null;
	};

	this.OnUpdate3D = function()
	{
		var tmpMatrix4;
		if(parseInt(this.m_iStyle) == 2)	// 飘窗
			tmpMatrix4= new THREE.Matrix4().makeScale(this.m_fLength/this.m_fLengthOld,
				(this.m_fWidth+90)/this.m_fWidthOld,
				this.m_fHeight/this.m_fHeightOld);
		else
			tmpMatrix4= new THREE.Matrix4().makeScale(this.m_fLength/this.m_fLengthOld,
				this.m_fWidth /this.m_fWidthOld,
				this.m_fHeight/this.m_fHeightOld);
		//	var tmpMatrix0= new THREE.Matrix4().makeTranslation(0,12,0);	// 墙体厚度
		var tmpMatrix0= new THREE.Matrix4().makeTranslation(0,0,0);
		var tmpMatrix1= new THREE.Matrix4().makeRotationZ(this.m_fRotate);
		var tmpMatrix2= new THREE.Matrix4().makeTranslation(this.m_vPos.x,this.m_vPos.y,this.m_fHight+this.m_fHeight/2);
		var tmpMatrix3= new THREE.Matrix4().makeRotationX(-Math.PI/2);
		tmpMatrix0.multiply(tmpMatrix4);
		tmpMatrix1.multiply(tmpMatrix0);
		tmpMatrix2.multiply(tmpMatrix1);
		tmpMatrix3.multiply(tmpMatrix2);

		this.m_Object.rotation.x = 0;
		this.m_Object.rotation.y = 0;
		this.m_Object.rotation.z = 0;
		this.m_Object.position.x = 0;
		this.m_Object.position.y = 0;
		this.m_Object.position.z = 0;
		this.m_Object.scale.x = 1;
		this.m_Object.scale.y = 1;
		this.m_Object.scale.z = 1;
		this.m_Object.matrixWorld.identity();
		this.m_Object.matrix.identity();
		this.m_Object.applyMatrix(tmpMatrix3);
	};

	this.OnCreateWin3D = function(index)
	{
		var loader = new THREE.TDSLoader( );
		var strPathFile = m_strHttp +"jiaju/"+ this.m_strFile.slice(0,this.m_strFile.length-4)+".3ds";

		var k = strPathFile.lastIndexOf("/");
		this.m_strPath = strPathFile.slice(0,k+1);
		//loader.setPath( this.m_strPath );
		loader.load( strPathFile,function ( object )
		{
			scene3D.add( object );
			var box = new THREE.Box3();
			box.setFromObject( object );
			if( index == -1 )
			{
				mHouseClass.mWindowClass.m_pCurWindow.m_Object = object;
				mHouseClass.mWindowClass.m_pCurWindow.m_fLengthOld= (box.max.x - box.min.x );
				mHouseClass.mWindowClass.m_pCurWindow.m_fWidthOld = (box.max.y - box.min.y );
				mHouseClass.mWindowClass.m_pCurWindow.m_fHeightOld= (box.max.z - box.min.z );
			}
			else
			{
				mHouseClass.mWindowClass.mWindowArray[index].m_Object = object;
				mHouseClass.mWindowClass.mWindowArray[index].m_fLengthOld= (box.max.x - box.min.x );
				mHouseClass.mWindowClass.mWindowArray[index].m_fWidthOld = (box.max.y - box.min.y );
				mHouseClass.mWindowClass.mWindowArray[index].m_fHeightOld= (box.max.z - box.min.z );
			}

		});
	};

	// 移动上去高亮显示
	this.OnShowHelp = function()
	{
		this.m_RenderWin2D.material.color.set(0x00A2E8);
		$('#container' ).css("cursor","move");
	};

	this.OnCreateWin2D = function()
	{
		//0：单开门  1：双开门  2：2扇推拉门  3.3扇推拉门  4. 4扇推拉门   5. 门洞
		switch(parseInt(this.m_iStyle))
		{
			case 3: //
			{
				var groundGeometry  = new THREE.PlaneGeometry(1, 1, 1, 1);
				var groundMaterial  = new THREE.MeshBasicMaterial({color: mResource.mBKColor});
				this.m_RenderData2D = new THREE.Mesh(groundGeometry, groundMaterial);
				scene.add(this.m_RenderData2D);

				var result_poly = new THREE.Geometry();
				result_poly.vertices.push(new THREE.Vector3(-0.5, -0.5, 1), new THREE.Vector3(-0.5, 0.5, 1));
				result_poly.vertices.push(new THREE.Vector3( 0.5,  0.5, 1), new THREE.Vector3( 0.5,-0.5, 1));
				result_poly.vertices.push(new THREE.Vector3(-0.5, -0.5, 1));
				result_poly.vertices.push(new THREE.Vector3(-0.5, -0.2, 1), new THREE.Vector3( 0.5,-0.2, 1));
				result_poly.vertices.push(new THREE.Vector3( 0.5,  0.2, 1), new THREE.Vector3( -0.5, 0.2, 1));
				this.m_RenderWin2D = new THREE.Line( result_poly, new THREE.LineBasicMaterial( { color: mResource.mColor, linewidth:15, opacity: 1 } ) );
				scene.add(this.m_RenderWin2D);
			}
				break;
			case 0: //镜像单开门
			case 4: //窗洞
			case 5:
			{
				var groundGeometry  = new THREE.PlaneGeometry(1, 1, 1, 1);
				var groundMaterial  = new THREE.MeshBasicMaterial({color: mResource.mBKColor});
				this.m_RenderData2D = new THREE.Mesh(groundGeometry, groundMaterial);
				scene.add(this.m_RenderData2D);

				var result_poly = new THREE.Geometry();
				result_poly.vertices.push(new THREE.Vector3(-0.5, -0.5, 1), new THREE.Vector3(-0.5, 0.5, 1));
				result_poly.vertices.push(new THREE.Vector3( 0.5,  0.5, 1), new THREE.Vector3( 0.5,-0.5, 1));
				result_poly.vertices.push(new THREE.Vector3(-0.5, -0.5, 1));
				result_poly.vertices.push(new THREE.Vector3(-0.5, -0.2, 1), new THREE.Vector3( 0.5,-0.2,  1));
				result_poly.vertices.push(new THREE.Vector3( 0.5,  0.2, 1), new THREE.Vector3( -0.5, 0.2, 1));
				this.m_RenderWin2D = new THREE.Line( result_poly, new THREE.LineBasicMaterial( { color: mResource.mColor, linewidth:15, opacity: 1 } ) );
				scene.add(this.m_RenderWin2D);
			}
				break;
			case 2:
			{
				var groundGeometry  = new THREE.PlaneGeometry(1, 1, 1, 1);
				var groundMaterial  = new THREE.MeshBasicMaterial({color: 0xffffff});
				this.m_RenderData2D = new THREE.Mesh(groundGeometry, groundMaterial);
				scene.add(this.m_RenderData2D);

				var result_poly = new THREE.Geometry();
				result_poly.vertices.push(new THREE.Vector3(-0.5, 0.5, 1), new THREE.Vector3(-0.5, 2.5, 1));
				result_poly.vertices.push(new THREE.Vector3( 0.5, 0.5, 1), new THREE.Vector3( 0.5, 2.5, 1));
				result_poly.vertices.push(new THREE.Vector3(-0.5, 2.5, 1), new THREE.Vector3( 0.5, 2.5, 1));

				result_poly.vertices.push(new THREE.Vector3(-0.47, 0.5, 1), new THREE.Vector3(-0.47, 2.30, 1));
				result_poly.vertices.push(new THREE.Vector3( 0.47, 0.5, 1), new THREE.Vector3( 0.47, 2.30, 1));
				result_poly.vertices.push(new THREE.Vector3(-0.47, 2.30, 1), new THREE.Vector3( 0.47, 2.30, 1));

				result_poly.vertices.push(new THREE.Vector3(-0.44, 0.5, 1), new THREE.Vector3(-0.44, 2.10, 1));
				result_poly.vertices.push(new THREE.Vector3( 0.44, 0.5, 1), new THREE.Vector3( 0.44, 2.10, 1));
				result_poly.vertices.push(new THREE.Vector3(-0.44, 2.10, 1),new THREE.Vector3( 0.44, 2.10, 1));

				this.m_RenderWin2D = new THREE.LineSegments( result_poly, new THREE.LineBasicMaterial( { color: mResource.mColor, opacity: 1 } ) );
				scene.add(this.m_RenderWin2D);
			}
				break;
			case 1:
			{
				var groundGeometry  = new THREE.PlaneGeometry(1, 1, 1, 1);
				var groundMaterial  = new THREE.MeshBasicMaterial({color: mResource.mBKColor});
				this.m_RenderData2D = new THREE.Mesh(groundGeometry, groundMaterial);
				scene.add(this.m_RenderData2D);

				var result_poly = new THREE.Geometry();
				result_poly.vertices.push(new THREE.Vector3(-0.5, -0.5, 1), new THREE.Vector3(-0.5, 0.5, 1));
				result_poly.vertices.push(new THREE.Vector3(-0.5,  0.5, 1), new THREE.Vector3( 0.5, 0.5, 1));
				result_poly.vertices.push(new THREE.Vector3( 0.5,  0.5, 1), new THREE.Vector3( 0.5,-0.5, 1));
				result_poly.vertices.push(new THREE.Vector3( 0.5,-0.5, 1), new THREE.Vector3(-0.5, -0.5, 1));

				result_poly.vertices.push(new THREE.Vector3(-0.5, -0.2, 1), new THREE.Vector3( 0.5,-0.2, 1));
				result_poly.vertices.push(new THREE.Vector3( 0.5,  0.2, 1), new THREE.Vector3( -0.5, 0.2, 1));
				result_poly.vertices.push(new THREE.Vector3(-0.15, -0.5, 1), new THREE.Vector3(-0.15,  0.5, 1));
				result_poly.vertices.push(new THREE.Vector3( 0.15, -0.5, 1), new THREE.Vector3( 0.15, 0.5, 1));

				this.m_RenderWin2D = new THREE.LineSegments( result_poly, new THREE.LineBasicMaterial( { color: mResource.mColor, opacity: 1 } ) );
				scene.add(this.m_RenderWin2D);
			}
				break;
		}
	};

	this.OnMouseMove = function(x1,y1,z1,radian,width1)
	{
		this.m_vPos.x = x1;
		this.m_vPos.y = y1;
		this.m_vPos.z = z1;
		this.m_fRotate= radian;
		this.m_fWidth = width1;
		this.UpdateWindow();
	};

	/****
	 * 更新2D位置
	 *
	 */
	this.UpdateWindow = function()
	{
		var axis  = new THREE.Vector3(0,0,1,0);
		var tmpMatrix = new THREE.Matrix4();

		//0：单开门  1：双开门  2：2扇推拉门  3.3扇推拉门  4. 4扇推拉门   5. 门洞
		switch( parseInt(this.m_iStyle) )
		{
			case 0:
			case 4:
			case 5:
			case 1:
			{
				var tmpMatrix1= new THREE.Matrix4().makeScale(this.m_fLength,this.m_fWidth,1);
				var tmpMatrix2= new THREE.Matrix4().makeRotationZ(this.m_fRotate);
				var tmpMatrix3= new THREE.Matrix4().makeTranslation(this.m_vPos.x,this.m_vPos.y,1);
				tmpMatrix2.multiply(tmpMatrix1);
				tmpMatrix3.multiply(tmpMatrix2);

				this.m_RenderData2D.rotation.z = 0;
				this.m_RenderData2D.position.x = 0;
				this.m_RenderData2D.position.y = 0;
				this.m_RenderData2D.position.z = 0;
				this.m_RenderData2D.scale.x    = 1;
				this.m_RenderData2D.scale.y    = 1;
				this.m_RenderData2D.scale.z    = 1;
				this.m_RenderData2D.matrixWorld.identity();
				this.m_RenderData2D.matrix.identity();
				this.m_RenderData2D.updateMatrixWorld(true);
				this.m_RenderData2D.applyMatrix(tmpMatrix3);

				this.m_RenderWin2D.rotation.z = 0;
				this.m_RenderWin2D.position.x = 0;
				this.m_RenderWin2D.position.y = 0;
				this.m_RenderWin2D.position.z = 0;
				this.m_RenderWin2D.scale.x    = 1;
				this.m_RenderWin2D.scale.y    = 1;
				this.m_RenderWin2D.scale.z    = 1;
				this.m_RenderWin2D.matrixWorld.identity();
				this.m_RenderWin2D.matrix.identity();
				this.m_RenderWin2D.updateMatrixWorld(true);
				this.m_RenderWin2D.applyMatrix(tmpMatrix3);

			}
				break;
			case 2:		//  飘窗
			{
				var tmpMatrix0= new THREE.Matrix4().makeScale(this.m_fLength,this.m_fWidth,1);
				//	var tmpMatrix1= new THREE.Matrix4().makeTranslation(0,12,0);
				var tmpMatrix1= new THREE.Matrix4().makeTranslation(0,0,0);
				var tmpMatrix2= new THREE.Matrix4().makeRotationZ(this.m_fRotate);
				var tmpMatrix3= new THREE.Matrix4().makeTranslation(this.m_vPos.x,this.m_vPos.y,1);
				//	var tmpMatrix3= new THREE.Matrix4().makeTranslation(1,1,1);
				tmpMatrix1.multiply(tmpMatrix0);
				tmpMatrix2.multiply(tmpMatrix1);
				tmpMatrix3.multiply(tmpMatrix2);

				this.m_RenderData2D.rotation.z = 0;
				this.m_RenderData2D.position.x = 0;
				this.m_RenderData2D.position.y = 0;
				this.m_RenderData2D.position.z = 0;
				this.m_RenderData2D.scale.x    = 1;
				this.m_RenderData2D.scale.y    = 1;
				this.m_RenderData2D.scale.z    = 1;
				this.m_RenderData2D.matrixWorld.identity();
				this.m_RenderData2D.matrix.identity();
				this.m_RenderData2D.updateMatrixWorld(true);
				this.m_RenderData2D.applyMatrix(tmpMatrix3);

				this.m_RenderWin2D.geometry.vertices.length = 0;

				this.m_RenderWin2D.geometry.vertices.push(new THREE.Vector3(-this.m_fLength/2, 0.5, 1), new THREE.Vector3(-this.m_fLength/2, 2.5, 1));
				this.m_RenderWin2D.geometry.vertices.push(new THREE.Vector3( this.m_fLength/2, 0.5, 1), new THREE.Vector3( this.m_fLength/2, 2.5, 1));
				this.m_RenderWin2D.geometry.vertices.push(new THREE.Vector3(-this.m_fLength/2, 2.5, 1), new THREE.Vector3( this.m_fLength/2, 2.5, 1));

				this.m_RenderWin2D.geometry.vertices.push(new THREE.Vector3(-(this.m_fLength/2-6), 0.5, 1), new THREE.Vector3(-(this.m_fLength/2-6), 2.25, 1));
				this.m_RenderWin2D.geometry.vertices.push(new THREE.Vector3( (this.m_fLength/2-6), 0.5, 1), new THREE.Vector3( (this.m_fLength/2-6), 2.25, 1));
				this.m_RenderWin2D.geometry.vertices.push(new THREE.Vector3(-(this.m_fLength/2-6), 2.25, 1), new THREE.Vector3( (this.m_fLength/2-6),2.25, 1));

				this.m_RenderWin2D.geometry.vertices.push(new THREE.Vector3(-(this.m_fLength/2-12), 0.5, 1), new THREE.Vector3(-(this.m_fLength/2-12), 2.0, 1));
				this.m_RenderWin2D.geometry.vertices.push(new THREE.Vector3( (this.m_fLength/2-12), 0.5, 1), new THREE.Vector3( (this.m_fLength/2-12), 2.0, 1));
				this.m_RenderWin2D.geometry.vertices.push(new THREE.Vector3(-(this.m_fLength/2-12), 2.0, 1), new THREE.Vector3( (this.m_fLength/2-12), 2.0, 1));

				this.m_RenderWin2D.geometry.verticesNeedUpdate = true;
				var tmpMatrix11= new THREE.Matrix4().makeScale(1,this.m_fWidth,1);
				var tmpMatrix22= new THREE.Matrix4().makeRotationZ(this.m_fRotate);
				var tmpMatrix33= new THREE.Matrix4().makeTranslation(this.m_vPos.x,this.m_vPos.y,1);
				tmpMatrix22.multiply(tmpMatrix11);
				tmpMatrix33.multiply(tmpMatrix22);

				// 飘窗时外突
				var vPos = new THREE.Vector3(0, 2.5, 10);
				vPos = vPos.applyMatrix4(tmpMatrix33);
				var vNormal = new THREE.Vector3(0,0,-1);
				var raycaster1 = new THREE.Raycaster(vPos,vNormal);
				raycaster1.linePrecision = 3;

				for( var j=0; j<mHouseClass.mFloorClass.mFloorArray.length; j++)
				{
					var Intersections = raycaster1.intersectObject( mHouseClass.mFloorClass.mFloorArray[j].mFloorMesh );
					if( Intersections.length>0 )
					{
						this.m_fRotate +=Math.PI;
						tmpMatrix11= new THREE.Matrix4().makeScale(1,this.m_fWidth,1);
						tmpMatrix22= new THREE.Matrix4().makeRotationZ(this.m_fRotate);
						tmpMatrix33= new THREE.Matrix4().makeTranslation(this.m_vPos.x,this.m_vPos.y,1);
						tmpMatrix22.multiply(tmpMatrix11);
						tmpMatrix33.multiply(tmpMatrix22);
						break;
					}
				}

				this.m_RenderWin2D.rotation.z = 0;
				this.m_RenderWin2D.position.x = 0;
				this.m_RenderWin2D.position.y = 0;
				this.m_RenderWin2D.position.z = 0;
				this.m_RenderWin2D.scale.x    = 1;
				this.m_RenderWin2D.scale.y    = 1;
				this.m_RenderWin2D.scale.z    = 1;
				this.m_RenderWin2D.matrixWorld.identity();
				this.m_RenderWin2D.matrix.identity();
				this.m_RenderWin2D.updateMatrixWorld(true);
				this.m_RenderWin2D.applyMatrix(tmpMatrix33);

			}
				break;
		}
	};

	// 替换模型
	this.OnChangeWindow = function(ab)
	{
		this.m_strFile = ab[1];

		if(this.m_Object != undefined && this.m_Object != null)
		{
			for(var i = 0; i<this.m_Object.children.length;i++)
				scene3D.remove( this.m_Object.children[i] );

			scene3D.remove(this.m_Object);
		}
		var iIndex = mHouseClass.mWindowClass.mWindowArray.indexOf(this);
		this.OnCreateWin3D(iIndex);
		this.OnUpdate3D();
	};

	this.FormatMesh = function()
	{
		var tMaterial = new THREE.MeshBasicMaterial({ color: '#FFFF00', wireframe: true,transparent:true,opacity:0.6});

		var k = 0;
		var n = 0;
		var geom = new THREE.Geometry();

		for(var m=0; m<this.m_Object.children.length; m++)
		{
			var tGeometry = this.m_Object.children[m].geometry;
			for( let i = 0; i<tGeometry.attributes.position.length/9; i++ )
			{
				var x1 = tGeometry.attributes.position.array[n+i*9+0];
				var y1 = tGeometry.attributes.position.array[n+i*9+1];
				var z1 = tGeometry.attributes.position.array[n+i*9+2];

				var x2 = tGeometry.attributes.position.array[n+i*9+3];
				var y2 = tGeometry.attributes.position.array[n+i*9+4];
				var z2 = tGeometry.attributes.position.array[n+i*9+5];

				var x3 = tGeometry.attributes.position.array[n+i*9+6];
				var y3 = tGeometry.attributes.position.array[n+i*9+7];
				var z3 = tGeometry.attributes.position.array[n+i*9+8];

				geom.vertices.push(new THREE.Vector3(x1, y1, z1));
				geom.vertices.push(new THREE.Vector3(x2, y2, z2));
				geom.vertices.push(new THREE.Vector3(x3, y3, z3));

				geom.faces.push(new THREE.Face3(k+0,k+1,k+2));
				k=k+3;
			}

			for( let i = 0; i<tGeometry.attributes.uv.length/6; i++)
			{
				var u1 = tGeometry.attributes.uv.array[n+i*6+0];
				var v1 = tGeometry.attributes.uv.array[n+i*6+1];

				var u2 = tGeometry.attributes.uv.array[n+i*6+2];
				var v2 = tGeometry.attributes.uv.array[n+i*6+3];

				var u3 = tGeometry.attributes.uv.array[n+i*6+4];
				var v3 = tGeometry.attributes.uv.array[n+i*6+5];

				var t0 = new THREE.Vector2(u1,v1);
				var t1 = new THREE.Vector2(u2,v2);
				var t2 = new THREE.Vector2(u3,v3);

				uv1 = [t0,t1,t2];

				geom.faceVertexUvs[0].push(uv1);
			}

			n += tGeometry.attributes.position.length/9;
		}

		geom.computeFaceNormals();
		geom.verticesNeedUpdate = true;
		geom.uvsNeedUpdate = true;

		var tMesh = new THREE.Mesh( geom, tMaterial);
		var tmpMatrix4= new THREE.Matrix4().makeScale(this.m_fLength/this.m_fLengthOld,
			this.m_fWidth /this.m_fWidthOld,
			this.m_fHeight/this.m_fHeightOld);

		var tmpMatrix0= new THREE.Matrix4().makeTranslation(0,0,this.m_fHight+this.m_fHeight/2);
		var tmpMatrix1= new THREE.Matrix4().makeRotationZ(this.m_fRotate);
		var tmpMatrix2= new THREE.Matrix4().makeTranslation(this.m_vPos.x,this.m_vPos.y,0);
		var tmpMatrix3= new THREE.Matrix4().makeRotationX(-Math.PI/2);
		tmpMatrix0.multiply(tmpMatrix4);
		tmpMatrix1.multiply(tmpMatrix0);
		tmpMatrix2.multiply(tmpMatrix1);
		tmpMatrix3.multiply(tmpMatrix2);

		tMesh.matrixWorld.identity();
		tMesh.matrix.identity();
		tMesh.applyMatrix(tmpMatrix3);

		return  tMesh;
	};



	// 重新挖洞
	/*		this.ReBuildWallHole = function()
            {
                for( var i = 0; i< mHouseClass.mWallClass.mWallArray.length; i++ )
                {
                        var ab = mMathClass.ClosestPointOnLine1(
                                         mHouseClass.mWallClass.mWallArray[i].m_vStart.x,
                                         mHouseClass.mWallClass.mWallArray[i].m_vStart.y,
                                         mHouseClass.mWallClass.mWallArray[i].m_vEnd.x,
                                         mHouseClass.mWallClass.mWallArray[i].m_vEnd.y,
                                         mouseX,mouseY, 10);
                        if( ab[0] != 0 )
                        {

                        }
                }
            }*/
}