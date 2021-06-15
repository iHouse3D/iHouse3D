
function WallData3D_Out()
{		
	this.mWallMesh;
	this.m_Outline;	// 菜单里的轮廓线
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
		var doorMaterial = new THREE.MeshBasicMaterial({ color: '#FFFF00', wireframe: true,transparent:true,opacity:0.6});

		this.mWallMesh.geometry.computeBoundingBox();
		for( var k =0; k< tWinOrDoorArray.length; k++ )
		{
			var ab   = mMathClass.ClosestPointOnLine1(this.mWallMesh.geometry.boundingBox.min.x,
				this.mWallMesh.geometry.boundingBox.min.y,
				this.mWallMesh.geometry.boundingBox.max.x,
				this.mWallMesh.geometry.boundingBox.max.y,
				tWinOrDoorArray[k].m_vPos.x,
				tWinOrDoorArray[k].m_vPos.y, 25);
			if( ab[0] != 0 )
			{
				var resultBSP; 
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
				else
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
							geom.faceVertexUvs[0][iIndex] = [ new THREE.Vector2(result.geometry.vertices[j+0].uv.x, result.geometry.vertices[j+0].uv.y),
								new THREE.Vector2(result.geometry.vertices[j+1].uv.x, result.geometry.vertices[j+1].uv.y),
								new THREE.Vector2(result.geometry.vertices[j+2].uv.x, result.geometry.vertices[j+2].uv.y)];
							iIndex++;
						}
					}
					geom.computeFaceNormals();
					geom.computeBoundingBox();
					geom.verticesNeedUpdate = true;
					geom.uvsNeedUpdate = true;
					
					if(geom.vertices.length>0 )
					{	
						scene3D.remove(this.mWallMesh);
						this.mWallMesh = new THREE.Mesh( geom, new THREE.MeshStandardMaterial( { side: THREE.DoubleSide, opacity:0.4, transparent: true, map: mResource.mWallTex } ) );
						this.mWallMesh.rotation.x = -Math.PI/2;
						scene3D.add(this.mWallMesh);
					}
				}
			}
		}
	};
}