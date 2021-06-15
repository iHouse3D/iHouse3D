
function CeilingClass3D()
{
	//墙面信息类
	this.mRenderCeiling	   = new Array();
	this.m_OBBox_Max  = new THREE.Vector3();		// 户型包围盒
	this.m_OBBox_Min  = new THREE.Vector3();

	this.OnInit = function()
	{

	};



	//this.OnCreate = function(x1,y1)
	//{

	//}

	this.OnClear = function()
	{
		for( var k =0; k< this.mRenderCeiling.length; k++ )
			this.mRenderCeiling[k].OnClear();

		this.mRenderCeiling.length = 0;

		this.m_OBBox_Max.x= -99999;
		this.m_OBBox_Max.y= -99999;
		this.m_OBBox_Min.x=  99999;
		this.m_OBBox_Min.y=  99999;
	};

	this.OnCreate = function(solution_paths, iMaxAreaFloor)
	{
		for(i = 0; i < solution_paths.length; i++)
		{
			if( i == iMaxAreaFloor )
				continue;
			var tFloor = [];
			for(j = 0; j < solution_paths[i].length; j++)
			{
				tFloor.push(new poly2tri.Point(solution_paths[i][j].X ,solution_paths[i][j].Y ));
			}
			var swctx     = new poly2tri.SweepContext(tFloor);
			swctx.triangulate();

			var triangles = swctx.getTriangles();

			var fw = 200/ (this.m_OBBox_Max.x-this.m_OBBox_Min.x);
			var fh = 200/(this.m_OBBox_Max.y-this.m_OBBox_Min.y);

			var geom = new THREE.Geometry();

			for( var k = 0; k< triangles.length; k++ )
			{
				geom.vertices.push(new THREE.Vector3(triangles[k].points_[0].x, triangles[k].points_[0].y, this.m_fHeight));
				geom.vertices.push(new THREE.Vector3(triangles[k].points_[2].x, triangles[k].points_[2].y, this.m_fHeight));
				geom.vertices.push(new THREE.Vector3(triangles[k].points_[1].x, triangles[k].points_[1].y, this.m_fHeight));

				geom.faces.push(new THREE.Face3(3*k+0,3*k+1,3*k+2));

				geom.faceVertexUvs[0][k] = [
					new THREE.Vector2((triangles[k].points_[0].x - this.m_OBBox_Min.x)/fw, (triangles[k].points_[0].y - this.m_OBBox_Min.y)/fh),
					new THREE.Vector2((triangles[k].points_[2].x - this.m_OBBox_Min.x)/fw, (triangles[k].points_[2].y - this.m_OBBox_Min.y)/fh),
					new THREE.Vector2((triangles[k].points_[1].x - this.m_OBBox_Min.x)/fw, (triangles[k].points_[1].y - this.m_OBBox_Min.y)/fh)];
			}
//		  geom.faceVertexUvs[0][0] = [ new THREE.Vector2(0, 0),new THREE.Vector2(0, 100), new THREE.Vector2(100, 0)];
//      geom.faceVertexUvs[0][1] = [ new THREE.Vector2(0, 100), new THREE.Vector2(100, 100),new THREE.Vector2(100, 0)];

			geom.computeFaceNormals();
			geom.verticesNeedUpdate = true;
			geom.uvsNeedUpdate = true;

			//	var mesh = new THREE.Mesh( geom, new THREE.MeshPhongMaterial( { side: THREE.FrontSide, map: mResource.mCeilingTex } ) );
			var tMat = new THREE.MeshPhysicalMaterial( {
				map: mResource.mCeilingTex,
			} );

			//
			var tCeilingData3D 	= new CeilingData3D();
			tCeilingData3D.mTextureData = new TextureData();
			tCeilingData3D.mTextureData.mMaterial = new THREE.MeshStandardMaterial( {color: new THREE.Color( '#ffffff' )} );
			tCeilingData3D.mTextureData.mTexture  = null;
			tCeilingData3D.mCeilingMesh = new THREE.Mesh( geom, tCeilingData3D.mTextureData.mMaterial);
			tCeilingData3D.mCeilingMesh.rotation.x = -Math.PI/2;
			tCeilingData3D.OnCreate(tCeilingData3D.mCeilingMesh);
			scene3D.add(tCeilingData3D.mCeilingMesh);
			this.mRenderCeiling.push(tCeilingData3D);

			//
			/*
			mesh = new THREE.Mesh( geom, tMat);
			mesh.rotation.x = -Math.PI/2;
			scene3D.add(mesh);
			this.mRenderCeiling.push(mesh);
			*/
		}
	};

	this.OnPick3D = function(mouseX,mouseY)
	{
		var tCeiling = null;
		var tDis  = -99999;

		for( j=0; j<this.mRenderCeiling.length; j++)
		{
			var Intersections = raycaster.intersectObject( this.mRenderCeiling[j].mCeilingMesh );
			if( Intersections.length>=1)
			{

				if( tDis < Intersections[0].distance)
				{
					tDis  = Intersections.distance;
					tCeiling = this.mRenderCeiling[j];
				}
			}
		}

		if( tCeiling != null )
			return tCeiling;

		return null;
	};
}