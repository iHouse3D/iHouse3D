/**
 * @api WallData3D_In
 * @apiGroup WallData3D_In
 * @apiName  0
 * @apiDescription 室内墙面类
 * @apiParam (成员变量) mWallMesh 	 墙体mesh
 * @apiParam (成员变量) mTextureData 使用的材质数据
 * @apiParam (成员变量) mUV 			 UV坐标数据备份
 * @apiParam (成员变量) m_vStart 	 起点
 * @apiParam (成员变量) m_vEnd 		 终点
 * @apiParam (成员变量) m_Outline 	 墙面轮廓线
 */
function WallData3D_In()
{
	//墙面信息类
	this.mWallMesh;					// 当前Mesh
	this.mTextureData;				// 材质数据
	this.mUV = new Array();			// 几何体的UV
	this.m_vStart;					// 原始起点
	this.m_vEnd;					// 原始终点
	this.m_Outline;					// 墙面轮廓线
	
	this.OnClear = function()
	{
		scene3D.remove(this.mWallMesh);
		scene3D.remove( this.m_Outline );
		this.mWallMesh  = null;
	};
	
	this.OnCreate = function(tMesh)
	{
		this.mWallMesh = tMesh;
	};
		
	this.CreateHole = function(tWinOrDoorArray)
	{
		// 已有Mesh挖洞
		var doorMaterial = new THREE.MeshBasicMaterial({ color: '#FFFF00', wireframe: true,transparent:true,opacity:0.6});
		if(this.mWallMesh)
			this.mWallMesh.geometry.computeBoundingBox();
		for( var k =0; k< tWinOrDoorArray.length; k++ )
		{	// 判断当前门窗在墙上
			var ab   = mMathClass.ClosestPointOnLine1(this.mWallMesh.geometry.boundingBox.min.x,
				this.mWallMesh.geometry.boundingBox.min.y,
				this.mWallMesh.geometry.boundingBox.max.x,
				this.mWallMesh.geometry.boundingBox.max.y,
				tWinOrDoorArray[k].m_vPos.x,
				tWinOrDoorArray[k].m_vPos.y, 25);
			if( ab[0] != 0 )
			{
				var resultBSP; // 老的挖洞方式
				if( tWinOrDoorArray[k].m_iStyle == 1 || tWinOrDoorArray[k].m_iStyle == 2 || tWinOrDoorArray[k].m_iStyle == 7 ||
					tWinOrDoorArray[k].m_iStyle == 3 || tWinOrDoorArray[k].m_iStyle == 4 || tWinOrDoorArray[k].m_iStyle == 0)
				{
					var winGeometry = new THREE.BoxGeometry(1, 1, 1);
					var winMesh 	= new THREE.Mesh( winGeometry,doorMaterial );
					var tmpMatrix0	= new THREE.Matrix4().makeScale(tWinOrDoorArray[k].m_fLength,52,tWinOrDoorArray[k].m_fHeight);
					var tmpMatrix1	= new THREE.Matrix4().makeRotationZ(tWinOrDoorArray[k].m_fRotate);
					var tmpMatrix2	= new THREE.Matrix4().makeTranslation(tWinOrDoorArray[k].m_vPos.x,tWinOrDoorArray[k].m_vPos.y,
																		  tWinOrDoorArray[k].m_fHight+tWinOrDoorArray[k].m_fHeight/2);
					var tmpMatrix3	= new THREE.Matrix4().makeRotationX(-Math.PI/2);
						tmpMatrix1.multiply(tmpMatrix0);
						tmpMatrix2.multiply(tmpMatrix1);
						tmpMatrix3.multiply(tmpMatrix2);
					winMesh.applyMatrix(tmpMatrix3);	
					
					var tWallBSP = new ThreeBSP(this.mWallMesh);
					var tWinBSP  = new ThreeBSP(winMesh);
					resultBSP = tWallBSP.union(tWinBSP);		
				}
				else	// 异形挖洞方式
				{
					var winMesh  = tWinOrDoorArray[k].FormatMesh();
					var tWallBSP = new ThreeBSP(this.mWallMesh);
					var tWinBSP  = new ThreeBSP(winMesh);
					resultBSP = tWallBSP.intersect(tWinBSP);	//intersect,subtract,union
				}

				result = resultBSP.toMesh();
				if( result )
				{
					result.geometry.computeFaceNormals();
					var geom = new THREE.Geometry();
					var iIndex = 0;
					this.mUV.length = 0;
					for(var j = 0; j<result.geometry.vertices.length; j+=3 )
					{
						var ab1   = mMathClass.ClosestPointOnLine1(
							this.mWallMesh.geometry.boundingBox.min.x,
							this.mWallMesh.geometry.boundingBox.min.y,
							this.mWallMesh.geometry.boundingBox.max.x,
							this.mWallMesh.geometry.boundingBox.max.y,
							result.geometry.vertices[j+0].x,result.geometry.vertices[j+0].y, 1);
						var ab2   = mMathClass.ClosestPointOnLine1(
							this.mWallMesh.geometry.boundingBox.min.x,
							this.mWallMesh.geometry.boundingBox.min.y,
							this.mWallMesh.geometry.boundingBox.max.x,
							this.mWallMesh.geometry.boundingBox.max.y,
							result.geometry.vertices[j+1].x,result.geometry.vertices[j+1].y, 1);
						var ab3   = mMathClass.ClosestPointOnLine1(
							this.mWallMesh.geometry.boundingBox.min.x,
							this.mWallMesh.geometry.boundingBox.min.y,
							this.mWallMesh.geometry.boundingBox.max.x,
							this.mWallMesh.geometry.boundingBox.max.y,
							result.geometry.vertices[j+2].x,result.geometry.vertices[j+2].y, 1);
						if( ab1[0] != 0&& ab2[0] != 0 && ab3[0] != 0 )
						{
							geom.vertices.push(new THREE.Vector3(result.geometry.vertices[j+0].x,
								result.geometry.vertices[j+0].y,
								result.geometry.vertices[j+0].z));

							geom.vertices.push(new THREE.Vector3(result.geometry.vertices[j+1].x,
								result.geometry.vertices[j+1].y,
								result.geometry.vertices[j+1].z));

							geom.vertices.push(new THREE.Vector3(result.geometry.vertices[j+2].x,
								result.geometry.vertices[j+2].y,
								result.geometry.vertices[j+2].z));

							geom.faces.push(new THREE.Face3(iIndex*3+0,iIndex*3+1,iIndex*3+2));
							geom.faceVertexUvs[0][iIndex] = [ 
								new THREE.Vector2(result.geometry.vertices[j+0].uv.x, result.geometry.vertices[j+0].uv.y),
								new THREE.Vector2(result.geometry.vertices[j+1].uv.x, result.geometry.vertices[j+1].uv.y),
								new THREE.Vector2(result.geometry.vertices[j+2].uv.x, result.geometry.vertices[j+2].uv.y)];
							iIndex++;
							
							this.mUV.push(new THREE.Vector2(result.geometry.vertices[j+0].uv.x, result.geometry.vertices[j+0].uv.y));
							this.mUV.push(new THREE.Vector2(result.geometry.vertices[j+1].uv.x, result.geometry.vertices[j+1].uv.y));
							this.mUV.push(new THREE.Vector2(result.geometry.vertices[j+2].uv.x, result.geometry.vertices[j+2].uv.y));
						}
					}
					geom.computeFaceNormals();
					geom.computeBoundingBox();
					geom.verticesNeedUpdate = true;
					geom.uvsNeedUpdate = true;

					if(geom.vertices.length>0 )
					{
						scene3D.remove(this.mWallMesh);
						this.mWallMesh = new THREE.Mesh( geom, this.mTextureData.mMaterial);
						this.mWallMesh.rotation.x = -Math.PI/2;
						scene3D.add(this.mWallMesh);
					}
				}
			}
		}
	};
	
	this.GetAngle = function()
	{		
		var box = new THREE.Box3();
			box.setFromObject( this.mWallMesh )
			box.max.y = box.max.z;
			box.min.y = box.min.z;	
			box.max.z = 0;
			box.min.z = 0;
			
		var edge1   = new THREE.Vector3;
	    edge1.x =  box.max.x - box.min.x;
	    edge1.y =  box.max.y - box.min.y;
	    edge1.z =  0;	
		
		if( Math.abs(edge1.x) < 0.001 )				
			edge1.x = 0.0;
		if( Math.abs(edge1.y) < 0.001 )
			edge1.y = 0.0;
		
		var fRotate = 0;
		if( edge1.x == 0.0 && edge1.y == 0.0)			// atanf(0/0)ֵ
			fRotate = 0.0;
		else
			fRotate = Math.atan(edge1.y/edge1.x);
		return fRotate*180/Math.PI;	
	};	
	
	this.OnUpdateTex = function(ab)
	{
		this.mWallMesh.geometry.computeBoundingBox();
		this.mTextureData = new TextureData();			
		this.mTextureData.OnCreate(ab,this.mWallMesh);

		this.mWallMesh.material.map = this.mTextureData.mTexture;
	    this.mWallMesh.material.needsUpdate = true;		
	};
	
	this.OnSave_XML = function()
	{
		let that = this.mTextureData;
		let strFile = 'texture/'+that.m_strFile;
		let strX = 1;
		let strY = 1;
		if( strFile !="texture/floor.jpg")
		{
			strX = that.mTexture.repeat.x;
		 	strY = that.mTexture.repeat.y;
		}
		
		var strXML  = `<Line3D PosX="${that.m_x1}" PosY="${that.m_y1}" PosZ="${that.m_z1}"
                     TexWidth="${that.m_fLength/10}" TexHeight="${that.m_fWidth/10}" 
                     OffX="${that.m_fOffX}" OffY="${that.m_fOffY}" Alpha="${that.m_fAlpha}" 
                     Rotate="${that.m_fRotate}"  source="${strFile}" Mode="${that.m_fMode}" 
                     ScaleX="${strX}" ScaleY="${strY}" />`;
                         
        return strXML;
	};
}