function DoorData()
{
	this.m_vPos;
	this.m_fLength;					// 长
	this.m_fHeight;					// 高
	this.m_fRotate;   			// 旋转
	this.m_fWidth;					// 宽
	this.m_fHight =  0;			// 离地高
	this.m_iMode;						//
	this.m_iMirror;					// 镜像
	this.m_fMirror= 0;
	this.m_strFile;					//
	this.m_iStyle;					// 单开门 0  	 双开门 2 		推拉门 3		门洞 4
	this.mData;							// 原始数据

	this.m_RenderData2D;		// 2D图标绘制
	this.m_RenderWin2D;
	this.m_Object;

//		this.m_fLength2;				// 移动时遇到短墙保存
	this.m_fLengthOld;
	this.m_fWidthOld;
	this.m_fHeightOld;

	this.OnInit1 = function(a,index)
	{
		this.m_strFile 	 = "cAF2488D8F0DE8F7D6C534817A60F9391/c8157435A40887E2EB4A54817A660A446/c74000EF390AFD5E068CBC00C0ACE93B1/Mldc688/Mldc688.jpg";
		this.mData 		   = a;
		this.m_vPos 		 = new THREE.Vector3(-9999,-9999,0);

		if( a == 0)	// 单开门
		{
			this.m_strFile 	 = "c9D6CCC12727C54E017D32BFCC7A6D68E/c3BE84C5ED247622240F82AC908B17E59/c74000EF390AFD5E068CBC00C0ACE93B1/MECmen08/MECmen08.jpg";
			this.m_fLength   = 100;//100;
			this.m_fWidth    = 22;//22;//fWidth/10;
			this.m_fHeight   = 230;//220;
			this.m_fRotate   = 0;
			this.m_iMode     = 0;
			this.m_iMirror   = 0;
			this.m_iStyle = 0;
		}

		if( a == 2)	// 双开门
		{
			this.m_strFile 	 = "c9D6CCC12727C54E017D32BFCC7A6D68E/c916BA0B2F61BA555BB502B5BD2613533/c74000EF390AFD5E068CBC00C0ACE93B1/MECmen09/MECmen09.jpg";
			this.m_fLength   = 150;
			this.m_fWidth    = 22;//22;//fWidth/10;
			this.m_fHeight   = 230;//220;
			this.m_fRotate   = 0;
			this.m_iMode     = 0;
			this.m_iMirror   = 0;
			this.m_iStyle = 2;
		}

		if( a == 3)	// 推拉门
		{
			this.m_strFile 	 = "c9D6CCC12727C54E017D32BFCC7A6D68E/c019CDDB9E1CADEF8D5A325EB3EC1AC25/c74000EF390AFD5E068CBC00C0ACE93B1/MECmen07/MECmen07.jpg";
			this.m_fLength   = 200;//180;
			this.m_fWidth    = 22;//22;//fWidth/10;
			this.m_fHeight   = 230;//220;
			this.m_fRotate   = 0;
			this.m_iMode     = 0;
			this.m_iMirror   = 0;
			this.m_iStyle = 3;
		}


		if( a == 4)	// 门洞
		{
			this.m_strFile 	 = "c9D6CCC12727C54E017D32BFCC7A6D68E/c916BA0B2F61BA555BB502B5BD2613533/c318DC7341D80337E0C93745A20367092/SFdfs01/SFdfs01.jpg";
			this.m_fLength   = 180;
			this.m_fWidth    = 22;//fWidth/10;
			this.m_fHeight   = 220;
			this.m_fRotate   = 0;
			this.m_iMode     = 0;
			this.m_iMirror   = 0;
			this.m_iStyle = 4;
		}

		if( a == 5)	// 圆拱门
		{
			this.m_strFile 	 = "c9D6CCC12727C54E017D32BFCC7A6D68E/c318DC7341D80337E0C93745A20367092/c318DC7341D80337E0C93745A20367092/GXmen01/GXmen01.jpg";
			this.m_fLength   = 98;//100;
			this.m_fWidth    = 22;//22;//fWidth/10;
			this.m_fHeight   = 230;//220;
			this.m_fRotate   = 0;
			this.m_iMode     = 0;
			this.m_iMirror   = 0;
			this.m_iStyle 	 = 5;
		}

		if( a == 6)	// 圆角门
		{
			this.m_strFile 	 = "c9D6CCC12727C54E017D32BFCC7A6D68E/c318DC7341D80337E0C93745A20367092/c318DC7341D80337E0C93745A20367092/GXmen02/GXmen02.jpg";
			this.m_fLength   = 98;//100;
			this.m_fWidth    = 22;//22;//fWidth/10;
			this.m_fHeight   = 230;//220;
			this.m_fRotate   = 0;
			this.m_iMode     = 0;
			this.m_iMirror   = 0;
			this.m_iStyle 	 = 5;
		}

		if( a == 7 )	// 子母门
		{
			this.m_strFile 	 = "c9D6CCC12727C54E017D32BFCC7A6D68E/c916BA0B2F61BA555BB502B5BD2613533/c74000EF390AFD5E068CBC00C0ACE93B1/MECmen09/MECmen09.jpg";
			this.m_fLength   = 120;//100;
			this.m_fWidth    = 22;//22;//fWidth/10;
			this.m_fHeight   = 230;//220;
			this.m_fRotate   = 0;
			this.m_iMode     = 0;
			this.m_iMirror   = 0;
			this.m_iStyle 	 = 7;
		}
	};

	this.OnInit = function(a,index)
	{
		this.m_strFile 	 = "cAF2488D8F0DE8F7D6C534817A60F9391/c8157435A40887E2EB4A54817A660A446/c74000EF390AFD5E068CBC00C0ACE93B1/Mldc688/Mldc688.jpg";
		this.mData 		   = a;
		this.m_vPos 		 = new THREE.Vector3(-9999,-9999,0);

		if( a == 0)	// 单开门
		{
			this.m_strFile 	 = "c9D6CCC12727C54E017D32BFCC7A6D68E/c3BE84C5ED247622240F82AC908B17E59/c74000EF390AFD5E068CBC00C0ACE93B1/MECmen08/MECmen08.jpg";
			this.m_fLength   = 100;//100;
			this.m_fWidth    = 22;//22;//fWidth/10;
			this.m_fHeight   = 230;//220;
			this.m_fRotate   = 0;
			this.m_iMode     = 0;
			this.m_iMirror   = 0;
			this.m_iStyle = 0;
		}

		if( a == 2)	// 双开门
		{
			this.m_strFile 	 = "c9D6CCC12727C54E017D32BFCC7A6D68E/c916BA0B2F61BA555BB502B5BD2613533/c74000EF390AFD5E068CBC00C0ACE93B1/MECmen09/MECmen09.jpg";
			this.m_fLength   = 150;
			this.m_fWidth    = 22;//22;//fWidth/10;
			this.m_fHeight   = 230;//220;
			this.m_fRotate   = 0;
			this.m_iMode     = 0;
			this.m_iMirror   = 0;
			this.m_iStyle = 2;
		}

		if( a == 3)	// 推拉门
		{
			this.m_strFile 	 = "c9D6CCC12727C54E017D32BFCC7A6D68E/c019CDDB9E1CADEF8D5A325EB3EC1AC25/c74000EF390AFD5E068CBC00C0ACE93B1/MECmen07/MECmen07.jpg";
			this.m_fLength   = 200;//180;
			this.m_fWidth    = 22;//22;//fWidth/10;
			this.m_fHeight   = 230;//220;
			this.m_fRotate   = 0;
			this.m_iMode     = 0;
			this.m_iMirror   = 0;
			this.m_iStyle 	 = 3;
		}


		if( a == 4)	// 门洞
		{
			this.m_strFile 	 = "c9D6CCC12727C54E017D32BFCC7A6D68E/c916BA0B2F61BA555BB502B5BD2613533/c318DC7341D80337E0C93745A20367092/SFdfs01/SFdfs01.jpg";
			this.m_fLength   = 180;
			this.m_fWidth    = 22;//fWidth/10;
			this.m_fHeight   = 220;
			this.m_fRotate   = 0;
			this.m_iMode     = 0;
			this.m_iMirror   = 0;
			this.m_iStyle = 4;
		}

		if( a == 5)	// 圆拱门
		{
			this.m_strFile 	 = "c9D6CCC12727C54E017D32BFCC7A6D68E/c318DC7341D80337E0C93745A20367092/c318DC7341D80337E0C93745A20367092/GXmen01/GXmen01.jpg";
			this.m_fLength   = 98;//100;
			this.m_fWidth    = 22;//22;//fWidth/10;
			this.m_fHeight   = 230;//220;
			this.m_fRotate   = 0;
			this.m_iMode     = 0;
			this.m_iMirror   = 0;
			this.m_iStyle 	 = 5;
		}

		if( a == 6)	// 圆角门
		{
			this.m_strFile 	 = "c9D6CCC12727C54E017D32BFCC7A6D68E/c318DC7341D80337E0C93745A20367092/c318DC7341D80337E0C93745A20367092/GXmen02/GXmen02.jpg";
			this.m_fLength   = 98;//100;
			this.m_fWidth    = 22;//22;//fWidth/10;
			this.m_fHeight   = 230;//220;
			this.m_fRotate   = 0;
			this.m_iMode     = 0;
			this.m_iMirror   = 0;
			this.m_iStyle 	 = 5;
		}

		if( a == 7 )	// 子母门
		{
			this.m_strFile 	 = "c9D6CCC12727C54E017D32BFCC7A6D68E/c916BA0B2F61BA555BB502B5BD2613533/c74000EF390AFD5E068CBC00C0ACE93B1/MECmen09/MECmen09.jpg";
			this.m_fLength   = 120;//100;
			this.m_fWidth    = 22;//22;//fWidth/10;
			this.m_fHeight   = 230;//220;
			this.m_fRotate   = 0;
			this.m_iMode     = 0;
			this.m_iMirror   = 0;
			this.m_iStyle 	 = 7;
		}

		this.OnCreateDoor2D();
		this.OnCreateDoor3D(index);
		this.UpdateDoor();
	};

	this.OnClear = function()
	{
		if(this.m_Object != undefined && this.m_Object != null)
		{
			for(var i = 0; i<this.m_Object.children.length;i++)
			{
				scene3D.remove( this.m_Object.children[i] );
			}
			scene3D.remove(this.m_Object);
		}
		scene.remove(this.m_RenderData2D);
		scene.remove(this.m_RenderWin2D);

	};

	// 3D下旋转
	this.OnUpdate3D = function()
	{

		var tmpMatrix4= new THREE.Matrix4().makeScale(this.m_fLength/this.m_fLengthOld,
			this.m_fWidth /this.m_fWidthOld,
			this.m_fHeight/this.m_fHeightOld);
		//	var tmpMatrix0= new THREE.Matrix4().makeTranslation(0,12,0);	// 墙体厚度
		var tmpMatrix0= new THREE.Matrix4().makeTranslation(0,0,0);
		var tmpMatrix1= new THREE.Matrix4().makeRotationZ(this.m_fRotate);
		//var tmpMatrix2= new THREE.Matrix4().makeTranslation(this.m_vPos.x,this.m_vPos.y,this.m_fHeight/2);
		var tmpMatrix2= new THREE.Matrix4().makeTranslation(this.m_vPos.x,this.m_vPos.y,0);
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

	this.OnCreateDoor3D = function(index)
	{
		var loader = new THREE.TDSLoader( );

		var strPathFile = m_strHttp +"jiaju/"+ this.m_strFile.slice(0,this.m_strFile.length-4)+".3ds";
		/*			// 兼容户型库老门窗数据
                    if( this.m_strFile.slice(0,4) == "door")
                            strPathFile = m_strHttp + this.m_strFile.slice(0,this.m_strFile.length-4)+".3ds";*/


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
				mHouseClass.mDoorClass.m_pCurDoor.m_Object = object;
				mHouseClass.mDoorClass.m_pCurDoor.m_fLengthOld= (box.max.x - box.min.x );
				mHouseClass.mDoorClass.m_pCurDoor.m_fWidthOld = (box.max.y - box.min.y );
				mHouseClass.mDoorClass.m_pCurDoor.m_fHeightOld= (box.max.z - box.min.z );
			}
			else
			{
				mHouseClass.mDoorClass.mDoorArray[index].m_Object = object;
				mHouseClass.mDoorClass.mDoorArray[index].m_fLengthOld= (box.max.x - box.min.x );
				mHouseClass.mDoorClass.mDoorArray[index].m_fWidthOld = (box.max.y - box.min.y );
				mHouseClass.mDoorClass.mDoorArray[index].m_fHeightOld= (box.max.z - box.min.z );
			}

		});
	};

	this.OnChangeMirror = function()
	{
		this.BuildDoorIcon(this.m_iStyle);

		if(this.m_iStyle  == 0) // 单开门
		{

			if( this.m_iMirror == 0 )
			{
				this.m_fMirror = 0;
				return;
			}

			if( this.m_iMirror == 1 )
			{
				this.m_fMirror = 0;
				for(let i = 0; i<this.m_RenderWin2D.geometry.vertices.length; i++)
				{
					this.m_RenderWin2D.geometry.vertices[i].x =  -this.m_RenderWin2D.geometry.vertices[i].x;
					this.m_RenderWin2D.geometry.verticesNeedUpdate = true;
				}
				return;
			}

			if( this.m_iMirror == 2 )
			{
				this.m_fMirror = Math.PI;
				return;
			}

			if( this.m_iMirror == 3 )
			{
				this.m_fMirror = Math.PI;
				for(let i = 0; i<this.m_RenderWin2D.geometry.vertices.length; i++)
				{
					this.m_RenderWin2D.geometry.vertices[i].x =  -this.m_RenderWin2D.geometry.vertices[i].x;
					this.m_RenderWin2D.geometry.verticesNeedUpdate = true;
				}
				return;
			}
		}

		if(this.m_iStyle  == 2) // 对开门
		{
			if( this.m_iMirror == 0 )
			{
				this.m_fMirror = 0;
				return;
			}

			if( this.m_iMirror == 2 )
			{
				this.m_fMirror = Math.PI;
				return;
			}
		}

		if(this.m_iStyle  == 7) // 单开门
		{

			if( this.m_iMirror == 0 )
			{
				this.m_fMirror = 0;
				return;
			}

			if( this.m_iMirror == 1 )
			{
				this.m_fMirror = 0;
				for(let i = 0; i<this.m_RenderWin2D.geometry.vertices.length; i++)
				{
					this.m_RenderWin2D.geometry.vertices[i].x =  -this.m_RenderWin2D.geometry.vertices[i].x;
					this.m_RenderWin2D.geometry.verticesNeedUpdate = true;
				}
				return;
			}

			if( this.m_iMirror == 2 )
			{
				this.m_fMirror = Math.PI;
				return;
			}

			if( this.m_iMirror == 3 )
			{
				this.m_fMirror = Math.PI;
				for(let i = 0; i<this.m_RenderWin2D.geometry.vertices.length; i++)
				{
					this.m_RenderWin2D.geometry.vertices[i].x =  -this.m_RenderWin2D.geometry.vertices[i].x;
					this.m_RenderWin2D.geometry.verticesNeedUpdate = true;
				}
				return;
			}
		}
	};

	this.OnCreateDoor2D = function()
	{
		var groundGeometry  = new THREE.PlaneGeometry(1, 1, 1, 1);
		var groundMaterial  = new THREE.MeshBasicMaterial({color: 0xffffff, opacity: 1, transparent: true});
		this.m_RenderData2D = new THREE.Mesh(groundGeometry, groundMaterial);
		scene.add(this.m_RenderData2D);
		switch(parseInt(this.m_iStyle))
		{
			case 0:		// 单开门
				this.BuildDoorIcon(0);
				break;
			case 2:	//双开门
				this.BuildDoorIcon(2);
				break;
			case 3: //推拉门
				this.BuildDoorIcon(3);
				break;
			case 4: // 洞
			case 5:
				this.BuildDoorIcon(4);
				break;
			case 7:
				this.BuildDoorIcon(7);
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
		this.UpdateDoor();
	};

	/****
	 *
	 *
	 */
	this.UpdateDoor = function()
	{
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
		var axis  = new THREE.Vector3(0,0,1,0);
		var tmpMatrix = new THREE.Matrix4();
		switch( parseInt(this.m_iStyle) )
		{
			case 0:
			{
				var tmpMatrix1= new THREE.Matrix4().makeTranslation(0,100/2,0);		// 门框图标是矩形
				var tmpMatrix2= new THREE.Matrix4().makeScale(this.m_fLength/100,this.m_fLength/100,1);// 100   符号初始大小
				var tmpMatrix3= new THREE.Matrix4().makeTranslation(0,this.m_fWidth/2,0);
				var tmpMatrix4= new THREE.Matrix4().makeRotationZ(this.m_fRotate+this.m_fMirror);
				var tmpMatrix5= new THREE.Matrix4().makeTranslation(this.m_vPos.x,this.m_vPos.y,1);
				tmpMatrix2.multiply(tmpMatrix1);
				tmpMatrix3.multiply(tmpMatrix2);
				tmpMatrix4.multiply(tmpMatrix3);
				tmpMatrix5.multiply(tmpMatrix4);
				this.m_RenderWin2D.applyMatrix(tmpMatrix5);

				var tmpMatrix3= new THREE.Matrix4().makeScale(this.m_fLength,this.m_fWidth,1);
				var tmpMatrix4= new THREE.Matrix4().makeRotationZ(this.m_fRotate);
				var tmpMatrix5= new THREE.Matrix4().makeTranslation(this.m_vPos.x,this.m_vPos.y,1);
				tmpMatrix4.multiply(tmpMatrix3);
				tmpMatrix5.multiply(tmpMatrix4);
				this.m_RenderData2D.applyMatrix(tmpMatrix5);
			}
				break;
			case 2:
			{
				var tmpMatrix1= new THREE.Matrix4().makeTranslation(0,180/4,0);		// 门框图标是矩形	 180是初始大小
				var tmpMatrix2= new THREE.Matrix4().makeScale(this.m_fLength/180,this.m_fLength/180,1);// 180   符号初始大小
				var tmpMatrix3= new THREE.Matrix4().makeTranslation(0,this.m_fWidth/2,0);
				var tmpMatrix4= new THREE.Matrix4().makeRotationZ(this.m_fRotate+this.m_fMirror);
				var tmpMatrix5= new THREE.Matrix4().makeTranslation(this.m_vPos.x,this.m_vPos.y,1);
				tmpMatrix2.multiply(tmpMatrix1);
				tmpMatrix3.multiply(tmpMatrix2);
				tmpMatrix4.multiply(tmpMatrix3);
				tmpMatrix5.multiply(tmpMatrix4);
				this.m_RenderWin2D.applyMatrix(tmpMatrix5);

				var tmpMatrix4= new THREE.Matrix4().makeScale(this.m_fLength,this.m_fWidth,1);
				var tmpMatrix5= new THREE.Matrix4().makeRotationZ(this.m_fRotate);
				var tmpMatrix6= new THREE.Matrix4().makeTranslation(this.m_vPos.x,this.m_vPos.y,1);
				tmpMatrix5.multiply(tmpMatrix4);
				tmpMatrix6.multiply(tmpMatrix5);
				this.m_RenderData2D.applyMatrix(tmpMatrix6);
			}
				break;
			case 3:
			{
				var tmpMatrix1= new THREE.Matrix4().makeScale(this.m_fLength/180,this.m_fWidth/24,1);
				var tmpMatrix2= new THREE.Matrix4().makeRotationZ(this.m_fRotate);
				var tmpMatrix3= new THREE.Matrix4().makeTranslation(this.m_vPos.x,this.m_vPos.y,1);
				tmpMatrix2.multiply(tmpMatrix1);
				tmpMatrix3.multiply(tmpMatrix2);
				this.m_RenderWin2D.applyMatrix(tmpMatrix3);

				var tmpMatrix4= new THREE.Matrix4().makeScale(this.m_fLength,this.m_fWidth,1);
				var tmpMatrix5= new THREE.Matrix4().makeRotationZ(this.m_fRotate);
				var tmpMatrix6= new THREE.Matrix4().makeTranslation(this.m_vPos.x,this.m_vPos.y,1);
				tmpMatrix5.multiply(tmpMatrix4);
				tmpMatrix6.multiply(tmpMatrix5);
				this.m_RenderData2D.applyMatrix(tmpMatrix6);
			}
				break;

			case 4:	//  洞
			case 5:
			{
				var tmpMatrix1= new THREE.Matrix4().makeScale(this.m_fLength/180,this.m_fWidth/24,1);
				var tmpMatrix2= new THREE.Matrix4().makeRotationZ(this.m_fRotate);
				var tmpMatrix3= new THREE.Matrix4().makeTranslation(this.m_vPos.x,this.m_vPos.y,1);
				tmpMatrix2.multiply(tmpMatrix1);
				tmpMatrix3.multiply(tmpMatrix2);
				this.m_RenderWin2D.applyMatrix(tmpMatrix3);

				var tmpMatrix4= new THREE.Matrix4().makeScale(this.m_fLength,this.m_fWidth,1);
				var tmpMatrix5= new THREE.Matrix4().makeRotationZ(this.m_fRotate);
				var tmpMatrix6= new THREE.Matrix4().makeTranslation(this.m_vPos.x,this.m_vPos.y,1);
				tmpMatrix5.multiply(tmpMatrix4);
				tmpMatrix6.multiply(tmpMatrix5);
				this.m_RenderData2D.applyMatrix(tmpMatrix6);
			}
				break;
			case 7:	//子母门
			{
				var tmpMatrix1= new THREE.Matrix4().makeTranslation(0,120/4,0);		// 门框图标是矩形
				var tmpMatrix2= new THREE.Matrix4().makeScale(this.m_fLength/100,this.m_fLength/100,1);// 100   符号初始大小
				var tmpMatrix3= new THREE.Matrix4().makeTranslation(0,this.m_fWidth/2,0);
				var tmpMatrix4= new THREE.Matrix4().makeRotationZ(this.m_fRotate+this.m_fMirror);
				var tmpMatrix5= new THREE.Matrix4().makeTranslation(this.m_vPos.x,this.m_vPos.y,1);
				tmpMatrix2.multiply(tmpMatrix1);
				tmpMatrix3.multiply(tmpMatrix2);
				tmpMatrix4.multiply(tmpMatrix3);
				tmpMatrix5.multiply(tmpMatrix4);
				this.m_RenderWin2D.applyMatrix(tmpMatrix5);

				var tmpMatrix3= new THREE.Matrix4().makeScale(this.m_fLength,this.m_fWidth,1);
				var tmpMatrix4= new THREE.Matrix4().makeRotationZ(this.m_fRotate);
				var tmpMatrix5= new THREE.Matrix4().makeTranslation(this.m_vPos.x,this.m_vPos.y,1);
				tmpMatrix4.multiply(tmpMatrix3);
				tmpMatrix5.multiply(tmpMatrix4);
				this.m_RenderData2D.applyMatrix(tmpMatrix5);
			}
				break;
		}
	};

	this.OnShowHelp = function()
	{
		this.m_RenderWin2D.material.color.set(0x00A2E8);
		$('#container' ).css("cursor","move");
	};

	this.BuildDoorIcon = function(iType)
	{
		var part = (180*Math.PI/180)/20;
		var result_poly = new THREE.Geometry();

		scene.remove(this.m_RenderWin2D);
		var tLength = 98;
		var tWidth  = 22;
		switch( iType )
		{
			case 0:	// 单开门
			{
				tLength = 98;
				for(var i = 0;i<=4*2;i++)		// 弧形扇面
				{
					var dx  = Math.cos(0+i*part)*tLength;
					var dy  = Math.sin(0+i*part)*tLength;
					var dx1 = Math.cos(0+(i+1)*part)*tLength;
					var dy1 = Math.sin(0+(i+1)*part)*tLength;
					result_poly.vertices.push(new THREE.Vector3(-tLength/2+dx,  -tLength/2+dy,  1));
					result_poly.vertices.push(new THREE.Vector3(-tLength/2+dx1, -tLength/2+dy1, 1));
				}
				// 门扇
				result_poly.vertices.push(new THREE.Vector3(-tLength/2+10, tLength/2, 1), new THREE.Vector3(-tLength/2+10, -tLength/2-10, 1));
				result_poly.vertices.push(new THREE.Vector3(-tLength/2+0, -tLength/2-10, 1), new THREE.Vector3(-tLength/2+0, tLength/2, 1));
				result_poly.vertices.push(new THREE.Vector3(-tLength/2+10, tLength/2, 1));
				this.m_RenderWin2D = new THREE.Line( result_poly, new THREE.LineBasicMaterial( { color: mResource.mColor, linewidth:1, opacity: 1 } ) );
				scene.add(this.m_RenderWin2D);
			}
				break;
			case 2:	// 双开门
			{
				tLength = 180;	// 初始大小
				result_poly.vertices.push(new THREE.Vector3(-tLength/2+10, tLength/4, 1), new THREE.Vector3(-tLength/2-0,  tLength/4, 1));
				result_poly.vertices.push(new THREE.Vector3(-tLength/2-0,  tLength/4, 1), new THREE.Vector3(-tLength/2-0, -tLength/4-10, 1));
				result_poly.vertices.push(new THREE.Vector3(-tLength/2+10,-tLength/4-10, 1), new THREE.Vector3(-tLength/2+10, tLength/4, 1));

				for(var i = 4*2;i>=0;i--)
				{
					var dx  = Math.cos(0+i*part)*tLength/2;
					var dy  = Math.sin(0+i*part)*tLength/2;
					var dx1 = Math.cos(0+(i+1)*part)*tLength/2;
					var dy1 = Math.sin(0+(i+1)*part)*tLength/2;
					//		result_poly.vertices.push(new THREE.Vector3(-tLength/2+dx,  -tLength/4+dy,  1));
					result_poly.vertices.push(new THREE.Vector3(-tLength/2+dx1, -tLength/4+dy1, 1));
				}

				for(var i = 0;i<=4*2;i++)
				{
					var dx  = tLength-Math.cos(0+(i+1)*part)*tLength/2;
					var dy  = Math.sin(0+(i+1)*part)*tLength/2;
					var dx1 = tLength-Math.cos(0+(i+1)*part)*tLength/2;
					var dy1 = Math.sin(0+(i+1)*part)*tLength/2;
					result_poly.vertices.push(new THREE.Vector3(-tLength/2+dx,  -tLength/4+dy,  1));
					result_poly.vertices.push(new THREE.Vector3(-tLength/2+dx1, -tLength/4+dy1, 1));
				}
				result_poly.vertices.push(new THREE.Vector3(tLength/2-10, tLength/4, 1), new THREE.Vector3(tLength/2-10, -tLength/4-10, 1));
				result_poly.vertices.push(new THREE.Vector3(tLength/2+0, -tLength/4-10, 1), new THREE.Vector3(tLength/2+0, tLength/4, 1));
				result_poly.vertices.push(new THREE.Vector3(tLength/2-10, tLength/4, 1));
				this.m_RenderWin2D = new THREE.Line( result_poly, new THREE.LineBasicMaterial( { color: mResource.mColor, linewidth:1, opacity: 1 } ) );
				scene.add(this.m_RenderWin2D);
			}
				break;

			case 3:	//移门
			{
				tLength = 180;	// 初始大小
				tWidth	=22;
				var result_poly = new THREE.Geometry();
				result_poly.vertices.push(new THREE.Vector3(-tLength/2, -tWidth/2, 1), new THREE.Vector3(-tLength/2, tWidth/2, 1));
				result_poly.vertices.push(new THREE.Vector3(-tLength/2,  tWidth/2, 1), new THREE.Vector3( tLength/8, tWidth/2, 1));
				result_poly.vertices.push(new THREE.Vector3( tLength/2, -tWidth/2, 1), new THREE.Vector3(-tLength/8,-tWidth/2, 1));
				result_poly.vertices.push(new THREE.Vector3( tLength/2, -tWidth/2, 1), new THREE.Vector3( tLength/2, tWidth/2, 1));

				result_poly.vertices.push(new THREE.Vector3(-tLength/2,  			0.0, 1), new THREE.Vector3(  tLength/2, 		0.0, 	1));
				result_poly.vertices.push(new THREE.Vector3(-tLength/8, -tWidth/2, 1), new THREE.Vector3( -tLength/8, 		0.0, 	1));
				result_poly.vertices.push(new THREE.Vector3( tLength/8, 			0.0, 1), new THREE.Vector3(  tLength/8, tWidth/2, 1));

				//		result_poly.vertices.push(new THREE.Vector3(-this.m_fLength/2+10,-this.m_fWidth/2, 1), new THREE.Vector3( -this.m_fLength/2+10, this.m_fWidth/2, 1));
				//		result_poly.vertices.push(new THREE.Vector3( this.m_fLength/2-10,-this.m_fWidth/2, 1), new THREE.Vector3(  this.m_fLength/2-10, this.m_fWidth/2, 1));

				//		result_poly.vertices.push(new THREE.Vector3( this.m_fLength/2,  this.m_fWidth/2, 1),new THREE.Vector3( this.m_fLength/2-10,  this.m_fWidth/2, 1));
				//		result_poly.vertices.push(new THREE.Vector3(-this.m_fLength/2, -this.m_fWidth/2, 1),new THREE.Vector3(-this.m_fLength/2+10, -this.m_fWidth/2, 1));

				this.m_RenderWin2D = new THREE.LineSegments( result_poly, new THREE.LineBasicMaterial( { color: mResource.mColor, opacity: 1 } ) );
				scene.add(this.m_RenderWin2D);
			}
				break;

			case 4:	//移门
			{
				let geometry = new THREE.PlaneGeometry(1,1);
				let material = new THREE.MeshBasicMaterial({color:0xffffff});
				this.m_RenderWin2D = new THREE.Mesh(geometry,material);
				scene.add(this.m_RenderWin2D);
			}
				break;

			case 7:	// 字
			{
				tLength = 80;	// 初始大小
				result_poly.vertices.push(new THREE.Vector3(-tLength/2+0, tLength/4-13, 1), new THREE.Vector3(-tLength/2-10,  tLength/4-13, 1));
				result_poly.vertices.push(new THREE.Vector3(-tLength/2-10,  tLength/4-13, 1), new THREE.Vector3(-tLength/2-10, -tLength/4-20, 1));
				result_poly.vertices.push(new THREE.Vector3(-tLength/2+0,-tLength/4-20, 1), new THREE.Vector3(-tLength/2+0, tLength/4-13, 1));

				tLength = 70;
				for(var i = 4*2;i>=0;i--)
				{
					var dx1 = Math.cos(0+(i+1)*part)*tLength/2;
					var dy1 = Math.sin(0+(i+1)*part)*tLength/2;
					result_poly.vertices.push(new THREE.Vector3(-tLength/2+dx1-10, -tLength/4+dy1-10, 1));
				}

				tLength = 120;
				for(var i = 0;i<=4*2;i++)
				{
					var dx  = tLength-Math.cos(0+(i+1)*part)*tLength/2;
					var dy  = Math.sin(0+(i+1)*part)*tLength/2;
					var dx1 = tLength-Math.cos(0+(i+1)*part)*tLength/2;
					var dy1 = Math.sin(0+(i+1)*part)*tLength/2;
					result_poly.vertices.push(new THREE.Vector3(-tLength/2+dx-10,  -tLength/4+dy,  1));
					result_poly.vertices.push(new THREE.Vector3(-tLength/2+dx1-10, -tLength/4+dy1, 1));
				}
				result_poly.vertices.push(new THREE.Vector3(tLength/2-20, tLength/4, 1), new THREE.Vector3(tLength/2-20, -tLength/4-10, 1));
				result_poly.vertices.push(new THREE.Vector3(tLength/2-10, -tLength/4-10, 1), new THREE.Vector3(tLength/2-10, tLength/4, 1));
				result_poly.vertices.push(new THREE.Vector3(tLength/2-20, tLength/4, 1));
				this.m_RenderWin2D = new THREE.Line( result_poly, new THREE.LineBasicMaterial( { color: mResource.mColor, linewidth:1, opacity: 1 } ) );
				scene.add(this.m_RenderWin2D);
			}
				break;
		}
	};


	this.OnChangeDoor = function(ab)
	{
		this.m_strFile = ab[1];

		if(this.m_Object != undefined && this.m_Object != null)
		{
			for(var i = 0; i<this.m_Object.children.length;i++)
			{
				scene3D.remove( this.m_Object.children[i] );
			}
			scene3D.remove(this.m_Object);
		}
		var iIndex = mHouseClass.mDoorClass.mDoorArray.indexOf(this);
		this.OnCreateDoor3D(iIndex);
		this.OnUpdate3D();
	};


	this.FormatMesh = function()
	{
		var tMaterial = new THREE.MeshBasicMaterial({ color: '#FFFF00', wireframe: true,transparent:true,opacity:0.6});

		var k = 0;
		var n = 0;
		var geom = new THREE.Geometry();

		for(var m=1; m<this.m_Object.children.length; m++)
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

		var tmpMatrix0= new THREE.Matrix4().makeTranslation(0,0,0);
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
}