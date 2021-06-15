/**
 * @api PluginsClass
 * @apiGroup PluginsClass
 * @apiDescription 插件类
 * @apiParam (成员变量) mVersion 版本号
 * @apiParam (成员变量) mCurrentOpenSceneFile 当前打开场景的路径
 *                             
 */
function PluginsClass()
{
	//默认绘制场景保存在demo目录下
	this.mVersion;
	this.mCurrentOpenSceneFile = ""; //当前打开场景的路径

	//保存场景灯参数到数据库的UUID(渲染端保存灯光数据到数据库，前端场景保存时需要通过这个uuid取得灯光参数然后保存到场景文件中)
	this.mSceneLightUUID = "";

	this.OnClear = function()
	{
		this.mCurrentOpenSceneFile = "";

		if(this.mSceneLightUUID != "")
		{
			mHouseClass.mPlaneLightClass.OnClear(this.mSceneLightUUID);
			this.mSceneLightUUID = "";
		}
	};

	// 保存路径
	this.OnSaveHttp = function()
	{
		sessionStorage.setItem("ihouse_http",m_strHttp);
	};
	

	/**
	 * @api OnRoam()
	 * @apiDescription 虚拟漫游
	 * @apiGroup PluginsClass
	 */		
	this.OnRoam = function()
	{
		if( IsContain(container, renderer2.domElement ) == false )
			OnShow3D();
		
    	this.OnSaveHttp();
    	
		var strXML  = `<iHouseXML><Ver Num="0"/>`;
			strXML += `<Camera x="${mCameraClass.m_Camera3D.position.x}" y="${mCameraClass.m_Camera3D.position.y}" z="${mCameraClass.m_Camera3D.position.z}" />`;
 			strXML  = this.OnSaveWallIn(strXML);
 			strXML  = this.OnSaveWallOut(strXML);
 			strXML  = this.OnSaveFloor(strXML);
 			strXML  = this.OnSaveCeilingTop(strXML);
 			strXML  = this.OnSaveCeiling(strXML);
 			strXML  = this.OnSaveDoor(strXML);
 			strXML  = this.OnSaveWindow(strXML);
 			strXML  = this.OnSaveFurniture(strXML);
 			strXML  = this.OnSavePlaneLight(strXML);
 			strXML  = mAnimation.OnSaveAnimationMatrix(strXML);
		    strXML += "</iHouseXML>";
		
		sessionStorage.setItem("ihouse_xml_vr",strXML);
		sessionStorage.setItem("ihouse_http_vr",m_strHttp);
		
		if( app.header.showLable.check_ChildRoam3D == true )
      		window.open('Player/Player.html')
      	else
      	{
      		mParamSystemDlg.OnHideView();
  			$('#container1').attr('src','Player/Player.html');
			$('#container1').show();
      	}
	};
	
	//保存场景数据，传递到渲染页面
    this.OnSaveToRender=function() 
    {
		if( IsContain(container, renderer2.domElement ) == false )
			OnShow3D();
		
    	this.OnSaveHttp();
    	let scenePath = this.OnGetScenePath();

		var strXML  = `<iHouseXML><Ver Num="0"/>`;
			strXML += `<Camera x="${mCameraClass.m_Camera3D.position.x}" y="${mCameraClass.m_Camera3D.position.y}" z="${mCameraClass.m_Camera3D.position.z}" />`;
 			strXML  = this.OnSaveWallIn(strXML);
 			strXML  = this.OnSaveWallOut(strXML);
 			strXML  = this.OnSaveFloor(strXML);
 			strXML  = this.OnSaveCeilingTop(strXML);
 			strXML  = this.OnSaveCeiling(strXML);
 			strXML  = this.OnSaveDoor(strXML);
 			strXML  = this.OnSaveWindow(strXML);
 			strXML  = this.OnSaveFurniture(strXML);
 			strXML  = this.OnSavePlaneLight(strXML);
 			strXML  = mAnimation.OnSaveAnimationMatrix(strXML);
		    strXML += `<SceneFilePath>${scenePath}</SceneFilePath>`;
		    strXML += `<UserAccount>${mUserAccount}</UserAccount>`;
		    strXML += `<SystemVersion></SystemVersion>`;
		    strXML += "</iHouseXML>";

		this.OnSaveSceneData(strXML);
    };

    this.OnGetScenePath = function()
	{
		let SceneFilePath = this.mCurrentOpenSceneFile;
		if(SceneFilePath=="")
		{
			SceneFilePath = `C:\\inetpub\\wwwroot\\users\\${mUserFolder}\\${mUserAccount}\\savefile\\demo\\`;
		}
		else
		{
			//打开方案时进行渲染
			if (-1 != SceneFilePath.indexOf(m_strWebService)) {
				SceneFilePath = SceneFilePath.replace(m_strWebService, 'C:\\inetpub\\wwwroot\\');
				let nPos = SceneFilePath.lastIndexOf('/');
				SceneFilePath = SceneFilePath.substr(0, nPos + 1);
				SceneFilePath = SceneFilePath.replace(/\//g, "\\")
			}
			else
			{
				//当前保存的方案
				SceneFilePath = SceneFilePath.replace(/\\\\/g, "\\")
				SceneFilePath = "C:\\inetpub\\wwwroot\\" + SceneFilePath + "\\";
			}
		}

		return SceneFilePath;
	}

    this.OnSaveSceneData = function(strXML)
	{
		let base64Data = base64_encode(encodeURIComponent(strXML));
		let that = this;

		$.ajax({
			url: m_strWebService +'Service1.asmx/StorageData',
			type: "post",
			dataType: "json",
			contentType: "application/x-www-form-urlencoded",
			async:false,
			data:
				{
					Basse64Data: base64Data,
					UUID:""
				},
			success: function (data)
			{
				if("1" == data.code)
				{
					if( app.header.showLable.check_ChildRender == true )
					{
						window.open(m_strWebService+`h5/rendering/render.html?id=${data.uuid}&WebService=${m_strWebService}`);
					    //window.open(`rendering/render.html?id=${data.uuid}&WebService=${m_strWebService}`);
					}
					else
					{
						$('#RenderingModel').attr('src',m_strWebService +`h5/rendering/render.html?id=${data.uuid}&WebService=${m_strWebService}`);
						$('#RenderingModel').show();
					}

					that.mSceneLightUUID = data.uuid;
				}
			},
			error: function (err)
			{
				return false;
			}
		});
	}

	this.OnSaveWallIn = function(strXML)
	{
		for(var i = 0; i<mHouseClass.mWallClass3D_In.mWallArray.length; i++)
		{
			if(mHouseClass.mWallClass3D_In.mWallArray[i].mWallMesh == null)
				continue;			
			strXML+='<Wall>\r\n';
			strXML+='<PosArray>\r\n';			
			var faces = mHouseClass.mWallClass3D_In.mWallArray[i].mWallMesh.geometry.faces;
			for (var k= 0; k < faces.length ; k++)
			{
				var v1 = mHouseClass.mWallClass3D_In.mWallArray[i].mWallMesh.geometry.vertices[faces[k].a];
				var v2 = mHouseClass.mWallClass3D_In.mWallArray[i].mWallMesh.geometry.vertices[faces[k].b];
				var v3 = mHouseClass.mWallClass3D_In.mWallArray[i].mWallMesh.geometry.vertices[faces[k].c];	
				strXML+='<pos X="'+v1.x +'" Y="'+v1.y+'" Z="'+v1.z+'"/>\r\n';
				strXML+='<pos X="'+v3.x +'" Y="'+v3.y+'" Z="'+v3.z+'"/>\r\n';
				strXML+='<pos X="'+v2.x +'" Y="'+v2.y+'" Z="'+v2.z+'"/>\r\n';
			}
			strXML+='</PosArray>\r\n';	
			
			strXML+='<UVArray>\r\n';
			for (var k= 0; k < faces.length ; k++)
			{
			    var uv11 = mHouseClass.mWallClass3D_In.mWallArray[i].mWallMesh.geometry.faceVertexUvs[0][k][0]; 
			    var uv21 = mHouseClass.mWallClass3D_In.mWallArray[i].mWallMesh.geometry.faceVertexUvs[0][k][1];
			    var uv31 = mHouseClass.mWallClass3D_In.mWallArray[i].mWallMesh.geometry.faceVertexUvs[0][k][2]; 
			    
			    if(mHouseClass.mWallClass3D_In.mWallArray[i].mTextureData &&
			   	   mHouseClass.mWallClass3D_In.mWallArray[i].mTextureData.mTexture)
			    {
				    var tMatrix = mHouseClass.mWallClass3D_In.mWallArray[i].mTextureData.mTexture.matrix;
					var uv1 = new THREE.Vector2(uv11.x,uv11.y);
					var uv2 = new THREE.Vector2(uv21.x,uv21.y);
					var uv3 = new THREE.Vector2(uv31.x,uv31.y);
					
					var uv1 = uv1.applyMatrix3(tMatrix);
					var uv2 = uv2.applyMatrix3(tMatrix);
					var uv3 = uv3.applyMatrix3(tMatrix);
					
					strXML+='<uv u="'+uv1.x +'" v="'+uv1.y+'"/>\r\n';
			    	strXML+='<uv u="'+uv3.x +'" v="'+uv3.y+'"/>\r\n';
			    	strXML+='<uv u="'+uv2.x +'" v="'+uv2.y+'"/>\r\n';
				}
			    else
			    {
					strXML+='<uv u="'+uv11.x +'" v="'+uv11.y+'"/>\r\n';
			    	strXML+='<uv u="'+uv31.x +'" v="'+uv31.y+'"/>\r\n';
			    	strXML+='<uv u="'+uv21.x +'" v="'+uv21.y+'"/>\r\n';			    	
			    }

			}
			strXML+='</UVArray>\r\n';
			
			var picLength = 100;
			var picWidth  = 100;
			var strResImage ='system/bai.jpg';

			if(mHouseClass.mWallClass3D_In.mWallArray[i].mTextureData &&
			   mHouseClass.mWallClass3D_In.mWallArray[i].mTextureData.mTexture)
			{
				picLength 	= mHouseClass.mWallClass3D_In.mWallArray[i].mTextureData.m_fLength;
				picWidth 	= mHouseClass.mWallClass3D_In.mWallArray[i].mTextureData.m_fWidth;
				strResImage = mHouseClass.mWallClass3D_In.mWallArray[i].mTextureData.m_strFile;
			}

			strXML+= `<SourceImage src="${strResImage}"  length="${picLength}"  width="${picWidth}"/>\r\n`;
			strXML+='</Wall>\r\n';	
		}
		
		return strXML;
	};
	
	this.OnSaveWallOut = function(strXML)
	{	
		for(var i = 0; i<mHouseClass.mWallClass3D_Out.mWallArray.length; i++)
		{
			if(mHouseClass.mWallClass3D_Out.mWallArray[i].mWallMesh == null)
				continue;
			strXML+='<WallOut>\r\n';
			strXML+='<PosArray>\r\n';			
			var faces = mHouseClass.mWallClass3D_Out.mWallArray[i].mWallMesh.geometry.faces;
			for (var k= 0; k < faces.length ; k++)
			{
				var v1 = mHouseClass.mWallClass3D_Out.mWallArray[i].mWallMesh.geometry.vertices[faces[k].a];
				var v2 = mHouseClass.mWallClass3D_Out.mWallArray[i].mWallMesh.geometry.vertices[faces[k].b];
				var v3 = mHouseClass.mWallClass3D_Out.mWallArray[i].mWallMesh.geometry.vertices[faces[k].c];	
				strXML+='<pos X="'+v1.x +'" Y="'+v1.y+'" Z="'+v1.z+'"/>\r\n';
				strXML+='<pos X="'+v2.x +'" Y="'+v2.y+'" Z="'+v2.z+'"/>\r\n';
				strXML+='<pos X="'+v3.x +'" Y="'+v3.y+'" Z="'+v3.z+'"/>\r\n';
			}
			strXML+='</PosArray>\r\n';	
			
			strXML+='<UVArray>\r\n';
			for (var k= 0; k < faces.length ; k++)
			{
			    var uv1 = mHouseClass.mWallClass3D_Out.mWallArray[i].mWallMesh.geometry.faceVertexUvs[0][k][0]; 
			    var uv2 = mHouseClass.mWallClass3D_Out.mWallArray[i].mWallMesh.geometry.faceVertexUvs[0][k][1];
			    var uv3 = mHouseClass.mWallClass3D_Out.mWallArray[i].mWallMesh.geometry.faceVertexUvs[0][k][2]; 
			    
			    strXML+='<uv u="'+uv1.x +'" v="'+uv1.y+'"/>\r\n';
			    strXML+='<uv u="'+uv2.x +'" v="'+uv2.y+'"/>\r\n';
			    strXML+='<uv u="'+uv3.x +'" v="'+uv3.y+'"/>\r\n';
			}
			strXML+='</UVArray>\r\n';
			
			var picLength = 100;
			var picWidth  = 100;
			var strResImage ='system/bai.jpg';
			strXML+= `<SourceImage src="${strResImage}"  length="${picLength}"  width="${picWidth}"/>\r\n`;
			strXML+='</WallOut>\r\n';	
		}
		return strXML;
	};
	
	this.OnSaveFloor = function(strXML)
	{				
		for(var i = 0; i<mHouseClass.mFloorClass.mFloorArray.length; i++)		
		{
			strXML+='<Floor>\r\n';
			strXML+='<PosArray>\r\n';			
			var faces = mHouseClass.mFloorClass.mFloorArray[i].mFloorMesh3D.geometry.faces;
			for (var k= 0; k < faces.length ; k++)
			{
				var v1 = mHouseClass.mFloorClass.mFloorArray[i].mFloorMesh3D.geometry.vertices[faces[k].a];
				var v2 = mHouseClass.mFloorClass.mFloorArray[i].mFloorMesh3D.geometry.vertices[faces[k].b];
				var v3 = mHouseClass.mFloorClass.mFloorArray[i].mFloorMesh3D.geometry.vertices[faces[k].c];
								
				strXML+='<pos X="'+v1.x +'" Y="'+v1.y+'" Z="'+v1.z+'"/>\r\n';
				strXML+='<pos X="'+v2.x +'" Y="'+v2.y+'" Z="'+v2.z+'"/>\r\n';
				strXML+='<pos X="'+v3.x +'" Y="'+v3.y+'" Z="'+v3.z+'"/>\r\n';
			}
			strXML+='</PosArray>\r\n';	
			
			strXML+='<UVArray>\r\n';
			for (var k= 0; k < faces.length ; k++)
			{
			    var uv11 = mHouseClass.mFloorClass.mFloorArray[i].mFloorMesh3D.geometry.faceVertexUvs[0][k][0]; 
			    var uv21 = mHouseClass.mFloorClass.mFloorArray[i].mFloorMesh3D.geometry.faceVertexUvs[0][k][1];
			    var uv31 = mHouseClass.mFloorClass.mFloorArray[i].mFloorMesh3D.geometry.faceVertexUvs[0][k][2]; 
			    
			    if(mHouseClass.mFloorClass.mFloorArray[i].mTextureData != null &&
			       mHouseClass.mFloorClass.mFloorArray[i].mTextureData != undefined &&
			   	   mHouseClass.mFloorClass.mFloorArray[i].mTextureData.mTexture)
			    {
				    var tMatrix = mHouseClass.mFloorClass.mFloorArray[i].mTextureData.mTexture.matrix;
				    
					var uv1 = new THREE.Vector2(uv11.x,uv11.y);
					var uv2 = new THREE.Vector2(uv21.x,uv21.y);
					var uv3 = new THREE.Vector2(uv31.x,uv31.y);
					
					var uv1 = uv1.applyMatrix3(tMatrix);
					var uv2 = uv2.applyMatrix3(tMatrix);
					var uv3 = uv3.applyMatrix3(tMatrix);
					
				    strXML+='<uv u="'+uv1.x +'" v="'+uv1.y+'"/>\r\n';
				    strXML+='<uv u="'+uv2.x +'" v="'+uv2.y+'"/>\r\n';
				    strXML+='<uv u="'+uv3.x +'" v="'+uv3.y+'"/>\r\n';
			    }
			    else
			    {
			    	var tmpMatrix0	= new THREE.Matrix4().makeScale(10,10);
			    	var v1 = new THREE.Vector3(uv11.x,uv11.y,0);
						v1 = v1.applyMatrix4(tmpMatrix0);
			
						var v2 = new THREE.Vector3(uv21.x,uv21.y,0);
						v2 = v2.applyMatrix4(tmpMatrix0);
			
						var v3 = new THREE.Vector3(uv31.x,uv31.y,0);
						v3 = v3.applyMatrix4(tmpMatrix0);
			    	strXML+='<uv u="'+v1.x +'" v="'+v1.y+'"/>\r\n';
				    strXML+='<uv u="'+v2.x +'" v="'+v2.y+'"/>\r\n';
				    strXML+='<uv u="'+v3.x +'" v="'+v3.y+'"/>\r\n';
			    }
			}
			strXML+='</UVArray>\r\n';
			
			
			var picLength = 1000;//mHouseClass.mFloorClass.mFloorArray[i].mTextureData.m_fLength;
			var picWidth  = 1000;//mHouseClass.mFloorClass.mFloorArray[i].mTextureData.m_fWidth;
			var strResImage ='system/floor.jpg'//mHouseClass.mFloorClass.mFloorArray[i].mTextureData.m_strFile;

			if(mHouseClass.mFloorClass.mFloorArray[i].mTextureData !=null &&
			   mHouseClass.mFloorClass.mFloorArray[i].mTextureData != undefined &&
			   mHouseClass.mFloorClass.mFloorArray[i].mTextureData.m_strFile)
			{
				strResImage = mHouseClass.mFloorClass.mFloorArray[i].mTextureData.m_strFile;
				picLength   = mHouseClass.mFloorClass.mFloorArray[i].mTextureData.m_fLength;
				picWidth    = mHouseClass.mFloorClass.mFloorArray[i].mTextureData.m_fWidth;
			}

			strXML+= `<SourceImage src="${strResImage}"  length="${picLength}"  width="${picWidth}"/>\r\n`;
			strXML+='</Floor>\r\n';	
		}
		return strXML;
	};
	
	this.OnSaveCeilingTop = function(strXML)
	{
		if(0 == mHouseClass.mRenderCeilingTop.length)
			return strXML;

		strXML+='<CeilingTop>\r\n';
		strXML+='<PosArray>\r\n';
		var faces = mHouseClass.mRenderCeilingTop[0].geometry.faces;
		for (var k= 0; k < faces.length ; k++)
		{
			var v1 = mHouseClass.mRenderCeilingTop[0].geometry.vertices[faces[k].a];
			var v2 = mHouseClass.mRenderCeilingTop[0].geometry.vertices[faces[k].b];
			var v3 = mHouseClass.mRenderCeilingTop[0].geometry.vertices[faces[k].c];
			strXML+='<pos X="'+v1.x +'" Y="'+v1.y+'" Z="'+v1.z+'"/>\r\n';
			strXML+='<pos X="'+v2.x +'" Y="'+v2.y+'" Z="'+v2.z+'"/>\r\n';
			strXML+='<pos X="'+v3.x +'" Y="'+v3.y+'" Z="'+v3.z+'"/>\r\n';
		}
		strXML+='</PosArray>\r\n';	
		
		strXML+='<UVArray>\r\n';
		for (var k= 0; k < faces.length ; k++)
		{
		    var uv1 = mHouseClass.mRenderCeilingTop[0].geometry.faceVertexUvs[0][k][0]; 
		    var uv2 = mHouseClass.mRenderCeilingTop[0].geometry.faceVertexUvs[0][k][1];
		    var uv3 = mHouseClass.mRenderCeilingTop[0].geometry.faceVertexUvs[0][k][2]; 
		    
		    strXML+='<uv u="'+uv1.x +'" v="'+uv1.y+'"/>\r\n';
		    strXML+='<uv u="'+uv2.x +'" v="'+uv2.y+'"/>\r\n';
		    strXML+='<uv u="'+uv3.x +'" v="'+uv3.y+'"/>\r\n';
		}
		strXML+='</UVArray>\r\n';
		
		var picLength = 100;
		var picWidth  = 100;
		var strResImage ='system/bai.jpg';
		strXML+= `<SourceImage src="${strResImage}"  length="${picLength}"  width="${picWidth}"/>\r\n`;
		strXML+='</CeilingTop>\r\n';	

		return strXML;	
	};

	this.OnSaveCeiling = function(strXML)
	{
		if(0 == mHouseClass.mCeilingClass.mCeilingArray.length)
			return strXML;

		for(var i = 0; i<mHouseClass.mCeilingClass.mCeilingArray.length; i++)
		{
			strXML+='<Ceiling>\r\n';
			strXML+='<PosArray>\r\n';
			var faces = mHouseClass.mCeilingClass.mCeilingArray[i].mCeilingMesh3D.geometry.faces;
			for (var k= 0; k < faces.length ; k++)
			{
				var v1 = mHouseClass.mCeilingClass.mCeilingArray[i].mCeilingMesh3D.geometry.vertices[faces[k].a];
				var v2 = mHouseClass.mCeilingClass.mCeilingArray[i].mCeilingMesh3D.geometry.vertices[faces[k].b];
				var v3 = mHouseClass.mCeilingClass.mCeilingArray[i].mCeilingMesh3D.geometry.vertices[faces[k].c];
				
			//	var v1 = v11.applyMatrix4(mHouseClass.mRenderCeiling[i].matrixWorld);
			//	var v2 = v21.applyMatrix4(mHouseClass.mRenderCeiling[i].matrixWorld);
			//	var v3 = v31.applyMatrix4(mHouseClass.mRenderCeiling[i].matrixWorld);
				
				strXML+='<pos X="'+v1.x +'" Y="'+v1.y+'" Z="'+v1.z+'"/>\r\n';
				strXML+='<pos X="'+v2.x +'" Y="'+v2.y+'" Z="'+v2.z+'"/>\r\n';
				strXML+='<pos X="'+v3.x +'" Y="'+v3.y+'" Z="'+v3.z+'"/>\r\n';
			}
			strXML+='</PosArray>\r\n';
	
			var picLength = 100;
			var picWidth  = 100;
			var strResImage ='system/bai.jpg';
			var tMatrix = new THREE.Matrix3();

			strResImage = mHouseClass.mCeilingClass.mCeilingArray[i].mTextureData.m_strFile;
			picLength   = mHouseClass.mCeilingClass.mCeilingArray[i].mTextureData.m_fLength;
			picWidth    = mHouseClass.mCeilingClass.mCeilingArray[i].mTextureData.m_fWidth;
			
			tMatrix = mHouseClass.mCeilingClass.mCeilingArray[i].mTextureData.mTexture.matrix;

			strXML+='<UVArray>\r\n';
			for (var k= 0; k < faces.length ; k++)
			{
				var uv11 = mHouseClass.mCeilingClass.mCeilingArray[i].mCeilingMesh3D.geometry.faceVertexUvs[0][k][0];
				var uv21 = mHouseClass.mCeilingClass.mCeilingArray[i].mCeilingMesh3D.geometry.faceVertexUvs[0][k][1];
				var uv31 = mHouseClass.mCeilingClass.mCeilingArray[i].mCeilingMesh3D.geometry.faceVertexUvs[0][k][2];
				
				var uv1 = new THREE.Vector2(uv11.x,uv11.y);
				var uv2 = new THREE.Vector2(uv21.x,uv21.y);
				var uv3 = new THREE.Vector2(uv31.x,uv31.y);
				
				var uv1 = uv1.applyMatrix3(tMatrix);
				var uv2 = uv2.applyMatrix3(tMatrix);
				var uv3 = uv3.applyMatrix3(tMatrix);
				strXML+='<uv u="'+uv1.x +'" v="'+uv1.y+'"/>\r\n';
				strXML+='<uv u="'+uv2.x +'" v="'+uv2.y+'"/>\r\n';
				strXML+='<uv u="'+uv3.x +'" v="'+uv3.y+'"/>\r\n';
			}
			strXML+='</UVArray>\r\n';
	

			strXML+= `<SourceImage src="${strResImage}"  length="${picLength}"  width="${picWidth}"/>\r\n`;
			strXML+='</Ceiling>\r\n';
		}
		return strXML;
	};
	
	this.OnSaveDoor = function(strXML)
	{
		for (var i= 0; i < mHouseClass.mDoorClass.mDoorArray.length; i++)
		{
			strXML+='<Door>\r\n';
			var x1 = mHouseClass.mDoorClass.mDoorArray[i].m_Object.position.x;
			var y1 = mHouseClass.mDoorClass.mDoorArray[i].m_Object.position.y;
			var z1 = mHouseClass.mDoorClass.mDoorArray[i].m_Object.position.z;	
			
			var rotateX = mHouseClass.mDoorClass.mDoorArray[i].m_Object.rotation.x;
			var rotateY = mHouseClass.mDoorClass.mDoorArray[i].m_Object.rotation.y;
			var rotateZ = mHouseClass.mDoorClass.mDoorArray[i].m_Object.rotation.z;
			
			var scaleX = mHouseClass.mDoorClass.mDoorArray[i].m_Object.scale.x;
			var scaleY = mHouseClass.mDoorClass.mDoorArray[i].m_Object.scale.y;
			var scaleZ = mHouseClass.mDoorClass.mDoorArray[i].m_Object.scale.z;	
			
			var strPathFile =  mHouseClass.mDoorClass.mDoorArray[i].m_strFile.slice(0,mHouseClass.mDoorClass.mDoorArray[i].m_strFile.length-4)+".3ds";
			
			strXML+= `<Param X="${x1}" Y="${y1}" Z="${z1}" `;
			strXML+=` rotateX="${rotateX}" rotateY="${rotateY}" rotateZ="${rotateZ}" `;
			strXML+=` scaleX="${scaleX}" scaleY="${scaleY}" scaleZ="${scaleZ}" `;
			strXML+=` Length="${mHouseClass.mDoorClass.mDoorArray[i].m_fLength}" Width="${mHouseClass.mDoorClass.mDoorArray[i].m_fWidth}" Height="${mHouseClass.mDoorClass.mDoorArray[i].m_fHeight}" `;
			strXML+=` src="${strPathFile}" `;
			strXML+= `/>\r\n`;
			strXML+='</Door>\r\n';
		}
		return strXML;			
	};
	
	this.OnSaveWindow = function(strXML)
	{
		for (var i= 0; i < mHouseClass.mWindowClass.mWindowArray.length; i++)
		{
			strXML+='<Window>\r\n';
			var x1 = mHouseClass.mWindowClass.mWindowArray[i].m_Object.position.x;
			var y1 = mHouseClass.mWindowClass.mWindowArray[i].m_Object.position.y;
			var z1 = mHouseClass.mWindowClass.mWindowArray[i].m_Object.position.z;	
			
			var rotateX = mHouseClass.mWindowClass.mWindowArray[i].m_Object.rotation.x;
			var rotateY = mHouseClass.mWindowClass.mWindowArray[i].m_Object.rotation.y;
			var rotateZ = mHouseClass.mWindowClass.mWindowArray[i].m_Object.rotation.z;
			
			var scaleX = mHouseClass.mWindowClass.mWindowArray[i].m_Object.scale.x;
			var scaleY = mHouseClass.mWindowClass.mWindowArray[i].m_Object.scale.y;
			var scaleZ = mHouseClass.mWindowClass.mWindowArray[i].m_Object.scale.z;	
			
			var strPathFile =  mHouseClass.mWindowClass.mWindowArray[i].m_strFile.slice(0,mHouseClass.mWindowClass.mWindowArray[i].m_strFile.length-4)+".3ds";
			
			strXML+= `<Param X="${x1}" Y="${y1}" Z="${z1}" `;
			strXML+=` rotateX="${rotateX}" rotateY="${rotateY}" rotateZ="${rotateZ}" `;
			strXML+=` scaleX="${scaleX}" scaleY="${scaleY}" scaleZ="${scaleZ}" `;
			strXML+=` Length="${mHouseClass.mWindowClass.mWindowArray[i].m_fLength}" Width="${mHouseClass.mWindowClass.mWindowArray[i].m_fWidth}" Height="${mHouseClass.mWindowClass.mWindowArray[i].m_fHeight}" `;
			strXML+=` src="${strPathFile}" `;
			strXML+= `/>\r\n`;
			strXML+='</Window>\r\n';	
		}
		return strXML;		
	};
	
	this.OnSaveFurniture = function(strXML)
	{
		for (var i= 0; i < mHouseClass.mFurnitureClass.mFurnitureArray.length; i++)
		{
			var bUse = true;
					
			for( var j = 0; j<m_ParamObjDlg.ModeHideArray.length; j++ )	// 是否是隐藏的模型	
			{
				if(m_ParamObjDlg.ModeHideArray[j]==mHouseClass.mFurnitureClass.mFurnitureArray[i])
				{
					bUse = false;
					break;
				}
			}	
			if(bUse == true)
			{
				strXML+='<Furniture>\r\n';
				strXML+= mHouseClass.mFurnitureClass.mFurnitureArray[i].OnSave();
				strXML+='</Furniture>\r\n';
			}
		}
		return strXML;		
	};

	this.OnSavePlaneLight = function(strXML)
	{
		for (var i= 0; i < mHouseClass.mPlaneLightClass.mPlaneLightArray.length; i++)
		{
			let planeLight =  mHouseClass.mPlaneLightClass.mPlaneLightArray[i];

			strXML+='<LightData>\rOnCreate3D1\n';
			strXML += `<Param PosX="${planeLight.m_fPosX}" PosY="${planeLight.m_fPosY}" RotateX="${planeLight.m_fRotateX}" RotateY="${planeLight.m_fRotateY}" PosZ="${planeLight.m_fPosZ}" iType="${planeLight.m_nLightType}" ColorR="${planeLight.m_fColorR}" ColorG="${planeLight.m_fColorG}" ColorB="${planeLight.m_fColorB}" Length="${planeLight.m_fLength}" Width="${planeLight.m_fWidth}" Intensity="${planeLight.m_fIntensity}" IES="${planeLight.m_IES}" Enable="${planeLight.m_bEnable}" AreaShow="${planeLight.m_bAreaShow}" AreaDouble="${planeLight.m_bAreaDouble}"/>`;
			strXML+='</LightData>\r\n';
		}

		return strXML;
	};


	/**
	 * @api OnSaveScene
	 * @apiGroup PluginClass
	 * @apiDescription 保存设计方案到服务器
	 *                           
	 */		
	this.OnSaveScene = function()
	{
		//保存场景到服务器
		let strXML = '<root>';		//场景版本
		
		strXML += '<Version ver="2019"/>';	// h5版本
		strXML += `<SceneHigh value="${mHouseClass.m_fHeight}"/>`;	//场景默认高度(暂时固定为2.8米)
		
		strXML += mHouseClass.OnSaveWall_XML();				// 户型数据
		strXML += mHouseClass.mDoorClass.OnSave_XML();		// 门数据
		strXML += mHouseClass.mWindowClass.OnSave_XML();	// 窗数据			
		strXML += mHouseClass.mTextClass.OnSave_XML();		// 保存房间名称
		strXML += mHouseClass.mGroundClass.OnSave_XML();	// 舞台数据
		
		if(mHouseClass.mFurnitureClass.mFurnitureArray.length>0)//家具数据
			strXML += mHouseClass.mFurnitureClass.OnSave_XML();
	
		strXML += mHouseClass.mFloorClass.OnSave_XML();			//地面材质
		strXML += mHouseClass.mWallClass3D_In.OnSave_XML();		//墙面材质
		strXML += mHouseClass.mPlaneLightClass.OnSave_XML();    //保存灯光 (点光源、面光源、射灯)
		strXML += '</root>';

		return strXML;
	};

	//读取场景
	//======================================================================================================
	this.OnLoadScene = function(str)
	{
		OnClear();

		this.mCurrentOpenSceneFile = str;
		var selectTime = new Date().getTime();//获取时间戳
		var str1 = str+'?'+selectTime;
		var data =$.ajax({url:str1,async:false,});
		var xmlDoc;
		if( data.responseText == undefined )	//  判断是否为百施通
		{
			xmlDoc = $.parseXML(str);
			if(xmlDoc == null)	// 百施通str为XML， 普通场景 str 为链接地址
			{
				alert("户型不存在，请联系技术支持!");
				return;
			}
		}
		else
		{
			xmlDoc = $.parseXML( data.responseText );
			if(xmlDoc == null)
			{
				alert("户型不存在，请联系技术支持!");
				return;
			}
		}

		ShowLoadingDlg(true);
		var  $xml = $( xmlDoc );

		this.mVersion = $xml.find("Version").attr('ver');							//版本信息
		mHouseClass.m_fHeight = parseFloat($xml.find("SceneHigh").attr('value'));	//整体户型高度
		if( mHouseClass.m_fHeight<10)	// Flash版与H5版兼容
			mHouseClass.m_fHeight *=100;
		app.GlobalSettings.num_2.int = mHouseClass.m_fHeight*10;

		$xml.find("WallData ").each(function(j){mHouseClass.OnLoadWall_XML($(this));});
		for( var i = 0; i< mHouseClass.mWallClass.mWallArray.length; i++ )	// 隐藏标注
			mHouseClass.mWallClass.mWallArray[i].OnShow(false);

		mHouseClass.mWallClass.OnUpdateAllWall();
		$xml.find("DoorData ").each(function(j){mHouseClass.mDoorClass.OnLoadDoor_XML($(this));});
		$xml.find("WinData").each(function(j){mHouseClass.mWindowClass.OnLoadWindow_XML($(this));});

		// 读取家具
		mHouseClass.mFurnitureClass.m_iLoadingNow = 0;
		mHouseClass.mFurnitureClass.m_iLoading 	  = $xml.find("Furniture3D").length;

		if($xml.find("Furniture3D").length == 0 )
			ShowLoadingDlg(false);

		$xml.find("Furniture3D").each(function(j){mHouseClass.mFurnitureClass.OnLoadFurniture_XML($(this));});
		//文字
		$xml.find("TextData").each(function(j){mHouseClass.mTextClass.OnLoad_XML($(this));});
		//灯光
		$xml.find("LightData").each(function(j){mHouseClass.mPlaneLightClass.OnLoadPlaneLight_XML($(this));});

		mHouseClass.mPlaneLightClass.OnLoadEnvironmentAndSunLight($xml);

		//吊顶
		var iFloor  = parseInt($xml.find("Floor3D").attr('num'));		// 地面
		var iWall   = parseInt($xml.find("SplitLine3D").attr('num'));	// 墙面
		var tLine3D = $xml.find("Line3D");
		var tFloorTexArray = new Array();
		var tWallTexArray  = new Array();

		for(var i = 0; i<iFloor+iWall; i++ )	// 先地面，后墙面
		{
			var textureData = new TextureData();

			textureData.m_x1 		= parseFloat($(tLine3D[i]).attr('PosX'));			// 位置
			textureData.m_y1 		= parseFloat($(tLine3D[i]).attr('PosY'));
			textureData.m_z1 		= parseFloat($(tLine3D[i]).attr('PosZ'));
			textureData.m_fRotate 	= parseFloat($(tLine3D[i]).attr('Rotate'));			// 旋转
			textureData.m_fMode 	= parseInt($(tLine3D[i]).attr('Mode'));
			textureData.m_fOffX 	= parseFloat($(tLine3D[i]).attr('OffX'));			// 偏移
			textureData.m_fOffY 	= parseFloat($(tLine3D[i]).attr('OffY'));
			textureData.m_fLength 	= parseFloat($(tLine3D[i]).attr('TexWidth'));
			textureData.m_fWidth	= parseFloat($(tLine3D[i]).attr('TexHeight'));
			textureData.m_strFile	= $(tLine3D[i]).attr('source');						// 文件路径
			textureData.m_fAlpha	= parseFloat($(tLine3D[i]).attr('Alpha'));

			if( i< iFloor)
			{
				if(this.mVersion =='2019')	// h5	新版
				{
					textureData.m_fLength = parseFloat($(tLine3D[i]).attr('TexWidth'))/10;
					textureData.m_fWidth  = parseFloat($(tLine3D[i]).attr('TexHeight'))/10;
				}
				tFloorTexArray.push(textureData);
			}
			else
			{
				if(this.mVersion =='2019')	// h5	新版
				{
					textureData.m_fLength 	= parseFloat($(tLine3D[i]).attr('TexWidth'))*10;
					textureData.m_fWidth	= parseFloat($(tLine3D[i]).attr('TexHeight'))*10;
				}
				tWallTexArray.push(textureData);
			}
			textureData.mMaterial   = new THREE.MeshStandardMaterial( {color: new THREE.Color( '#ffffff' )} );

			//if( textureData.m_fMode == 0 )	// 子分割线
			//	continue;

			if(textureData.m_strFile == "floor.jpg")
				textureData.mTexture 	= mResource.mFloorTex;
			else if(textureData.m_strFile == "windows/win1.png")
				textureData.mTexture = mResource.mWallTex;
			else
			{
				textureData.m_strFile= textureData.m_strFile.replace(/texture\//g,'/');
				textureData.mTexture = new THREE.TextureLoader( ).load( m_strHttp +'/texture'+textureData.m_strFile );
			}

			textureData.mTexture.wrapS = textureData.mTexture.wrapT = THREE.RepeatWrapping;
		}

		this.SetFloorTex( tFloorTexArray );		// 设置地面材质
		this.SetWallTex( tWallTexArray );		// 设置墙面材质

		$xml.find("GroundClass").each(function(j){mHouseClass.mGroundClass.OnLoad_XML($(this));});
		this.mSceneLightUUID = "";

		if(app.loading)
		   app.loading.close();

		return;
	};

	// 读取墙面
	this.SetWallTex  = function(tWallTexArray)
	{
		for(var i = 0; i<tWallTexArray.length; i++ )
		{
			var tWallData3D_In = new WallData3D_In();
				tWallData3D_In.mTextureData = tWallTexArray[i];	
			mHouseClass.mWallClass3D_In.mWallArray.push(tWallData3D_In);
		}
	};

	// 读取地面
	this.SetFloorTex = function(tFloorTexArray)
	{
		for(var i = 0; i<tFloorTexArray.length; i++ )
		{		

			if(tFloorTexArray[i].m_z1>0)	// 排除老版本 顶面的材质
			   continue;
			   
			// 替换材质
			for(var j=0; j<mHouseClass.mFloorClass.mFloorArray.length; j++)
			{
				var tFloor = mHouseClass.mFloorClass.mFloorArray[j];
				if( tFloor.mTextureData != undefined||tFloor.mTextureData != null)
					continue;
				var vPos1 = new THREE.Vector3( tFloorTexArray[i].m_x1, tFloorTexArray[i].m_y1, 10 );
	    		var vNormal = new THREE.Vector3(0,0,-1);
	    		var raycaster1 = new THREE.Raycaster(vPos1,vNormal);
	    			raycaster1.linePrecision = 3;
	    		var Intersections = raycaster1.intersectObject( tFloor.mFloorMesh );
	    		if( Intersections.length>0 )
	    		{
					var fw = (tFloor.m_OBBox_Max.x-tFloor.m_OBBox_Min.x)/tFloorTexArray[i].m_fLength;
					var fh = (tFloor.m_OBBox_Max.y-tFloor.m_OBBox_Min.y)/tFloorTexArray[i].m_fWidth;
					
					tFloorTexArray[i].mTexture.offset.set(  0, 0 );
					tFloorTexArray[i].mTexture.repeat.set( fw,fh );
					tFloorTexArray[i].mTexture.center.set(  0, 0 );
					tFloorTexArray[i].mTexture.rotation = tFloorTexArray[i].m_fRotate;
					
					// 判断3D地面是否生成
					if( tFloor.mFloorMesh3D != undefined )
					{
						tFloor.mFloorMesh3D.material.map = tFloorTexArray[i].mTexture;
						tFloor.mFloorMesh3D.material.needsUpdate = true;	
					}
					tFloor.mTextureData = tFloorTexArray[i];
					tFloor.mFloorMesh.material.map = tFloorTexArray[i].mTexture;
			    	tFloor.mFloorMesh.material.needsUpdate = true;
					break;
				}
			}
		}	
	};
	
	// 
	/**
	 * @api OnLoadHouse()
	 * @apiGroup PluginClass 
	 * @apiName  0
	 * @apiDescription 读取户型库数据
	 * @apiParam (参数) strFile 要下载的房间模板全路径
	 */	
	this.OnLoadHouse = function(strFile)
	{
		OnClear();
		var data =$.ajax({url:strFile,async:false,});
		var  xmlDoc = $.parseXML( data.responseText );
		if(xmlDoc == null)
		{
			alert("户型不存在，请联系技术支持!");
			return;
		}
		var  $xml = $( xmlDoc );
		
		$xml.find("WallData ").each(function(j){mHouseClass.OnLoadWall_XML($(this));});
		for( var i = 0; i< mHouseClass.mWallClass.mWallArray.length; i++ ){
			mHouseClass.mWallClass.mWallArray[i].OnShow(false);
		}
		mHouseClass.mWallClass.OnUpdateAllWall();
		
		$xml.find("DoorData").each(function(j){mHouseClass.mDoorClass.OnLoadDoor_XML($(this));});
		$xml.find("WinData").each(function(j){mHouseClass.mWindowClass.OnLoadWindow_House($(this));});
	};

	//根据标题判断另存为还是分享设计
	this.OnSave = function()
	{
		let strTitle = $('.design-dialog-title').text();
		//分享设计
		if(strTitle ==  i18n.t(`Language.ShareScheme`))
		{
			this.OnSaveShare();
		}
		//另存为
		else if(strTitle ==  i18n.t(`Language.SaveAs`) || strTitle == '保存')
		{
			this.OnSaveAsScheme();
		}
	};

	
	this.OnSaveScheme = function()
	{
		//保存场景方案
		//由于获取场景数据还没有完成，所以暂时先返回(正常流程已测试走通)
		if(mHouseClass.mWallClass.mWallArray.length == 0 &&
			mHouseClass.mWindowClass.mWindowArray.length == 0 &&
			mHouseClass.mDoorClass.mDoorArray.length == 0 &&
			mHouseClass.mFloorClass.mFloorArray.length == 0&&
			mHouseClass.mFurnitureClass.mFurnitureArray.length == 0)
		{
			alert('当前方案为空');
			return;
		}
		// 生成平面图
		m_Coordniate.OnShow(false);    // 隐藏网格

		var fOldZ = mCameraClass.m_Camera.position.z;
		mCameraClass.m_Camera.position.z = 1000;

		var objData =CaptureScreen(); //renderer.domElement.toDataURL("image/jpeg");
		var image = new Image();
		image.width = 220*window.innerWidth/window.innerHeight;
		image.height = 220;
		image.src = objData;
	
		let that = this;
		//使用setTimeout主要防止缩放图片没完成前，调用ajax接口
		setTimeout(function ()
		{
			//缩放图片大小为140*100
			//ScaleImage(image,140,100);

			setTimeout(function ()
			{
				
				var canvas = document.createElement("canvas");
				canvas.width = 290;
				canvas.height = 220;
				var ctx = canvas.getContext("2d");
				var i = -(image.width -290)/2;
				ctx.drawImage(image, i, 0, image.width, image.height);
				objData = canvas.toDataURL("image/jpeg");
			
				//取得转换后图片base64数据
				//objData = GetBase64Image(image);

				//转换成标准base64格式，不然后台c#解析失败
				objData.replace(/%([0-9A-F]{2})/g, function (match, p1)
				{
					return String.fromCharCode('0x' + p1);
				});

				mCameraClass.m_Camera.position.z = fOldZ;
				mParamSystemDlg.OnShowCoord(); //

				//场景数据
				var strSceneData = that.OnSaveScene(); //取得场景数据

				//如果打开的是共享场景，保存到demo目录中,其它保存到打开场景的方案中
				let strScenePath = mPluginsClass.GetSaveScenePath(mPluginsClass.mCurrentOpenSceneFile);

				//场景缩略图
				let sceneThumbnailName = strScenePath + '\\data_icon.jpg';

				//场景文件名
				let sceneFileName = strScenePath + '\\data_scene.xml';

				objData = objData.replace("data:image/jpeg;base64,", "");

				//缩略图数据
				var byThumbnail = Base64Binary.decodeArrayBuffer(objData);
				//var thumbnailData = btoa(String.fromCharCode.apply(null, new Uint8Array(byThumbnail) ));
				var thumbnailData = btoa(new Uint8Array(byThumbnail).reduce(function (data, byte)
				                         {return data + String.fromCharCode(byte);}, ''));
				if(!thumbnailData)
				{
					app.$message({message: '获取缩略图数据失败', type: 'info'});
					return;
				}

				//场景数据
				var bySceneData = StringToByte(strSceneData);
				//var sceneData = btoa(String.fromCharCode.apply(null, new Uint8Array(bySceneData) ));
				var sceneData = btoa(new Uint8Array(bySceneData).reduce(function (data, byte) {
					return data + String.fromCharCode(byte);
				}, ''));

				if(!sceneData)
				{
					app.$message({message: '获取场景数据失败', type: 'info'});
					return;
				}

				that.SaveSceneFile(thumbnailData,sceneThumbnailName,sceneData,sceneFileName);

			}, 100);
		}, 100);
	};

	this.GetSaveScenePath = function(strCurrentSceneFile)
	{
		let strScenePath = strCurrentSceneFile;
		//如果打开的是共享场景或是新创建的场景，打开的共享场景保存到demo目录下
		if("" == strScenePath || -1 != strScenePath.indexOf("share"))
		{
			strScenePath = "users\\"+ mUserFolder +"\\"+mUserAccount + '\\savefile\\demo';
		}
		else
		{
			strScenePath = strScenePath.replace(m_strWebService,'');
			strScenePath = strScenePath.replace('data_scene.xml','');
			strScenePath = strScenePath.replace(new RegExp( '/' , "g" ),'\\');
		}
		return "C:\\inetpub\\wwwroot\\" + strScenePath;
	};

	//取得方案相对目录
	this.GetSchemePath = function(strCurrentSceneFile)
	{
		let strScenePath = strCurrentSceneFile;

		strScenePath = strScenePath.replace(m_strWebService,'');
		strScenePath = strScenePath.replace('data_scene.xml','');
		strScenePath = strScenePath.replace(new RegExp( '/' , "g" ),'\\');

		return strScenePath;
	};

	// 保存场景
	this.SaveSceneFile = function(base64SceneThumbnail,sceneThumbnailName,base64SceneData,sceneFileName)
	{
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open('POST', m_strWebService + 'service1.asmx', true);
		var sr =
			'<?xml version="1.0" encoding="utf-8"?>'+
			'<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">'+
			'  <soap12:Body>'+
			'    <SaveSceneFile xmlns="http://tempuri.org/">'+
			'      <bindata1>'+base64SceneThumbnail+'</bindata1>'+
			'      <strFile1>'+sceneThumbnailName+'</strFile1>' +
			'      <bindata2>'+base64SceneData+'</bindata2>'+
			'      <strFile2>'+sceneFileName+'</strFile2>'+
			'    </SaveSceneFile>'+
			'  </soap12:Body>'+
			'</soap12:Envelope>';

		xmlhttp.setRequestHeader('Content-Type', 'text/xml;charset=utf-8');
		xmlhttp.send(sr);

		xmlhttp.onreadystatechange = function ()
		{
			if (xmlhttp.readyState == 4)
			{
				if (xmlhttp.status == 200)
				{
					//console.log(xmlhttp.responseXML);
					var value = xmlhttp.responseXML.getElementsByTagName("soap:Body")[0].childNodes[0].childNodes[0].textContent

					if("true" == value)
					{
						$('.createDesignClose').trigger("click");

						alert('保存成功');
					}
				}
			}
		}
	};

	//取得用户所有方案数据
	this.OnGetUserSchemeXMLData = function()
	{
		var selectTime = new Date().getTime();//获取时间戳

		let strXMLData=$.ajax({url:m_strWebService + 'users/' + mUserFolder + '/' + mUserAccount + '/savefile/scene.xml?' + selectTime,async:false,dataType: 'xml'});;

		return strXMLData.responseXML.childNodes[0].innerHTML;
	};

	//方案另存为
	this.OnSaveAsScheme = function()
	{
		if(mHouseClass.mWallClass.mWallArray.length == 0 &&
			mHouseClass.mWindowClass.mWindowArray.length == 0 &&
			mHouseClass.mDoorClass.mDoorArray.length == 0 &&
			mHouseClass.mFloorClass.mFloorArray.length == 0&&
			mHouseClass.mFurnitureClass.mFurnitureArray.length == 0)
		{
			alert('当前方案为空');
			return;
		}

		let strUUID = this.GenerateGuid();
		let strCurrentDate = this.GetNowFormatDate();

		let strBaseInfo = `<scene Name ="${app.programEditor.name}" Folder="${strUUID}" CustoerName="${app.programEditor.designUnit}" Address="${app.programEditor.schemeAddr}" Area="" Style="${app.programEditor.style}" Date="${strCurrentDate}" Desc="${app.programEditor.schemeDescription}"/>`;

		var selectTime = new Date().getTime();//获取时间戳

		let strUserSchemeXMLData = this.OnGetUserSchemeXMLData();
		strUserSchemeXMLData += "\r\n";
		strUserSchemeXMLData += strBaseInfo;

        let strAllNode = "<root>\r\n";
		strAllNode += strUserSchemeXMLData;
		strAllNode += "\r\n</root>";

		let strScenePath = `C:\\inetpub\\wwwroot\\users\\${mUserFolder}\\${mUserAccount}\\savefile\\${strUUID}`;
		this.mCurrentOpenSceneFile = `users\\\\${mUserFolder}\\\\${mUserAccount}\\\\savefile\\\\${strUUID}`;
		let strSceneXML = `C:\\inetpub\\wwwroot\\users\\${mUserFolder}\\${mUserAccount}\\savefile\\scene.xml`;

		var bySceneXMLData = StringToByte(strAllNode);
		var sceneData = btoa(String.fromCharCode.apply(null, new Uint8Array(bySceneXMLData) ));

		//新场景的一条xml数据插入到用户方案xml中
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open('POST', m_strWebService + 'service1.asmx', true);
		var sr =
			'<?xml version="1.0" encoding="utf-8"?>'+
			'<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">'+
			'  <soap12:Body>'+
			'    <CreateSceneFile xmlns="http://tempuri.org/">'+
			'      <strPathFile>'+strScenePath+'</strPathFile>'+
			'      <bindata>'+sceneData+'</bindata>' +
			'      <strScene>'+strSceneXML+'</strScene>'+
			'    </CreateSceneFile>'+
			'  </soap12:Body>'+
			'</soap12:Envelope>';

		xmlhttp.setRequestHeader('Content-Type', 'text/xml;charset=utf-8');
		xmlhttp.send(sr);

		xmlhttp.onreadystatechange = function ()
		{
			if (xmlhttp.readyState == 4)
			{
				if (xmlhttp.status == 200)
				{
					//console.log(xmlhttp.responseXML);
					var value = xmlhttp.responseXML.getElementsByTagName("soap:Body")[0].childNodes[0].childNodes[0].textContent;

					if("true" == value)
					{
						//保存户型及缩略图
						mPluginsClass.OnSaveAsSchemeData();
					}
					else
					{
						alert('保存失败');
					}
				}
			}
		}

	};

	//另存为(保存户型及缩略图)
	this.OnSaveAsSchemeData = function()
	{

		//场景数据
		var strSceneData = mPluginsClass.OnSaveScene(); //取得场景数据

		//如果打开的是共享场景，保存到demo目录中,其它保存到打开场景的方案中
		let strScenePath = mPluginsClass.GetSaveScenePath(mPluginsClass.mCurrentOpenSceneFile);

		//场景缩略图
		let sceneThumbnailName = strScenePath + '\\data_icon.jpg';

		//场景文件名
		let sceneFileName = strScenePath + '\\data_scene.xml';

		let objData = $('#program-editor-image').attr('src');
		objData = objData.replace("data:image/jpeg;base64,", "");

		//缩略图数据
		var byThumbnail = Base64Binary.decodeArrayBuffer(objData);
		//var thumbnailData = btoa(String.fromCharCode.apply(null, new Uint8Array(byThumbnail) ));

		var thumbnailData = btoa(new Uint8Array(byThumbnail).reduce(function (data, byte)
								{return data + String.fromCharCode(byte);}, ''));
		if(!thumbnailData)
		{
			app.$message({message: '获取缩略图数据失败', type: 'info'});
			return;
		}

		//场景数据
		var bySceneData = StringToByte(strSceneData);
		//var sceneData = btoa(String.fromCharCode.apply(null, new Uint8Array(bySceneData) ));

		var sceneData = btoa(new Uint8Array(bySceneData).reduce(function (data, byte)
							{return data + String.fromCharCode(byte);}, ''));
		if(!sceneData)
		{
			app.$message({message: '获取场景数据失败', type: 'info'});
			return;
		}

		this.SaveSceneFile(thumbnailData,sceneThumbnailName,sceneData,sceneFileName);
	};

	//共享方案
	this.OnSaveShare = function()
	{
		if(mHouseClass.mWallClass.mWallArray.length == 0 &&
			mHouseClass.mWindowClass.mWindowArray.length == 0 &&
			mHouseClass.mDoorClass.mDoorArray.length == 0 &&
			mHouseClass.mFloorClass.mFloorArray.length == 0&&
			mHouseClass.mFurnitureClass.mFurnitureArray.length == 0)
		{
			alert('当前方案为空');
			return;
		}

		//场景数据
		var strSceneData = mPluginsClass.OnSaveScene(); //取得场景数据

		//共享方案目录
		let strFloder = "C:\\inetpub\\wwwroot\\users\\share\\chenx\\savefile\\";
		let strUUID   = this.GenerateGuid();
		strFloder = strFloder+ strUUID + "\\";

		//场景缩略图
		let sceneThumbnailName = strFloder + 'data_icon.jpg';

		//场景文件名
		let sceneFileName = strFloder + 'data_scene.xml';

		let strShareName = app.programEditor.name;
		let strUser  = mUserAccount;


		//方案缩略图
		let objData = $('#program-editor-image').attr('src');
		objData = objData.replace("data:image/jpeg;base64,", "");

		//缩略图数据
		var byThumbnail = Base64Binary.decodeArrayBuffer(objData);
		//var thumbnailData = btoa(String.fromCharCode.apply(null, new Uint8Array(byThumbnail) ));
		var thumbnailData = btoa(new Uint8Array(byThumbnail).reduce(function (data, byte)
		                         {return data + String.fromCharCode(byte);}, ''));
		if(!thumbnailData)
		{
			app.$message({message: '获取缩略图失败', type: 'info'});
			return;
		}

		//场景数据
		var bySceneData = StringToByte(strSceneData);
		//var sceneData = btoa(String.fromCharCode.apply(null, new Uint8Array(bySceneData) ));
		var sceneData = btoa(new Uint8Array(bySceneData).reduce(function (data, byte)
			                     {return data + String.fromCharCode(byte);}, ''));
		if(!sceneData)
		{
			app.$message({message: '获取场景数据失败', type: 'info'});
			return;
		}
		var strScenePath = this.GetSchemePath(this.mCurrentOpenSceneFile);

		this.SaveShareScene(thumbnailData,sceneThumbnailName,sceneData,sceneFileName,strFloder,strUUID,strShareName,strUser,strScenePath);
	};

	//调用共享服务
	this.SaveShareScene = function(thumbnailData,sceneThumbnailName,sceneData,sceneFileName,
								   strFloder,strUUID,strShareName,strUser,strScenePath)
	{
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open('POST', m_strWebService + 'service1.asmx', true);

		var sr =
			'<?xml version="1.0" encoding="utf-8"?>'+
			'<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">'+
			'  <soap12:Body>'+
			'    <SaveShareSceneByCompanyID xmlns="http://tempuri.org/">'+
			'      <bindata1>'+thumbnailData+'</bindata1>'+
			'      <strFile1>'+sceneThumbnailName+'</strFile1>' +
			'      <bindata2>'+sceneData+'</bindata2>'+
			'      <strFile2>'+sceneFileName+'</strFile2>'+
			'      <strFloder>'+strFloder+'</strFloder>'+
			'      <strUUID>'+strUUID+'</strUUID>'+
			'      <strTitle>'+strShareName+'</strTitle>'+
			'      <strUser>'+strUser+'</strUser>'+
			'      <strScenePath>'+strScenePath+'</strScenePath>'+
			'      <strCompanyID>'+mCompanyID+'</strCompanyID>'+
			'    </SaveShareSceneByCompanyID>'+
			'  </soap12:Body>'+
			'</soap12:Envelope>';

		xmlhttp.setRequestHeader('Content-Type', 'text/xml;charset=utf-8');
		xmlhttp.send(sr);

		xmlhttp.onreadystatechange = function ()
		{
			if (xmlhttp.readyState == 4)
			{
				if (xmlhttp.status == 200)
				{
					//console.log(xmlhttp.responseXML);
					var value = xmlhttp.responseXML.getElementsByTagName("soap:Body")[0].childNodes[0].childNodes[0].textContent;

					if("true" == value)
					{
						$('.createDesignClose').trigger("click");

						alert('共享成功');
					}
					else
					{
						alert('共享失败');
					}
				}
			}
		}
	};

	//保存户型
	this.OnSaveHouseType = function()
	{
		if(mHouseClass.mWallClass.mWallArray.length == 0 )
		{
			alert('场景无户型数据!');
			return;
		}

		//方案缩略图
		let objData = $('#program-housetype-image').attr('src');
		objData = objData.replace("data:image/jpeg;base64,", "");

		var byThumbnail = Base64Binary.decodeArrayBuffer(objData);
		var thumbnailData = btoa(String.fromCharCode.apply(null, new Uint8Array(byThumbnail) ));

		//场景数据
		let strSceneData = this.OnSaveScene();
		var bySceneData = StringToByte(strSceneData);
		var sceneData = btoa(String.fromCharCode.apply(null, new Uint8Array(bySceneData) ));

		let strArea = $('#mArea').html();

		//方案基础数据
		let objBaseInfo = {"name": app.programSaveHouseType.name,
						"housetype": app.programSaveHouseType.housetype,
						"area": strArea,
						"province": app.programSaveHouseType.province,
						"city": app.programSaveHouseType.city,
						"address": app.programSaveHouseType.address,
						"designer": mUserAccount,
						"designerid": mCompanyID,
						"createtime":this.GetNowFormatDate(),
						"companyid":mCompanyID,
						"fuzzysearch": app.programSaveHouseType.description,
						"version": "2016"
					};

		var strBaseInfo = JSON.stringify(objBaseInfo);

		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open('POST', m_strWebService + 'service1.asmx', true);

		var sr =
			'<?xml version="1.0" encoding="utf-8"?>'+
			'<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">'+
			'  <soap12:Body>'+
			'    <SaveHouseType xmlns="http://tempuri.org/">'+
			'      <byteThumbnail>'+thumbnailData+'</byteThumbnail>'+
			'      <byteScene>'+sceneData+'</byteScene>' +
			'      <strSceneScheme>'+strBaseInfo+'</strSceneScheme>'+
			'    </SaveHouseType>'+
			'  </soap12:Body>'+
			'</soap12:Envelope>';

		xmlhttp.setRequestHeader('Content-Type', 'text/xml;charset=utf-8');
		xmlhttp.send(sr);

		xmlhttp.onreadystatechange = function ()
		{
			if (xmlhttp.readyState == 4)
			{
				if (xmlhttp.status == 200)
				{
					//console.log(xmlhttp.responseXML);
					let strResult = xmlhttp.responseXML.getElementsByTagName("soap:Body")[0].childNodes[0].childNodes[0].textContent;
					let jsonData = JSON.parse(strResult);

					$('.createDesignClose').trigger("click");

					alert(jsonData.nofityMsg);
				}
			}
		}
	};

	//获取当前时间
	this.GetNowFormatDate = function()
	{
		var date = new Date();
		var seperator1 = "-";
		var seperator2 = ":";
		var month = date.getMonth() + 1<10? "0"+(date.getMonth() + 1):date.getMonth() + 1;
		var strDate = date.getDate()<10? "0" + date.getDate():date.getDate();
		var currentdate = date.getFullYear() + seperator1  + month  + seperator1  + strDate
			+ " "  + date.getHours()  + seperator2  + date.getMinutes()
			+ seperator2 + date.getSeconds();
		return currentdate;
	};

	this.GenerateGuid = function()
	{
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c)
		{
			var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
			return v.toString(16);
		});
	};
}
