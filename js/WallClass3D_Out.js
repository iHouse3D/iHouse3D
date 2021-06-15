
function WallClass3D_Out()
{
	//墙面信息类
	this.mWallArray = new Array();
	this.m_fHeight = 280;
	this.OnClear = function()
	{
		for( var k =0; k< this.mWallArray.length; k++ )
			this.mWallArray[k].OnClear();

		this.mWallArray.length = 0;	
	};
	
	this.OnShowAll = function(bShow)
	{
		// 隐藏所有外墙
		for(var j = 0; j<this.mWallArray.length; j++)
			this.mWallArray[j].mWallMesh.visible = bShow;
	}
	
	this.OnWireframe = function(bShow)
	{
		for( var k =0; k< this.mWallArray.length; k++ )
			this.mWallArray[k].m_Outline.visible = bShow;		
	};
	
	this.OnMaterial = function(bShow)
	{
		for( var k =0; k< this.mWallArray.length; k++ )
			this.mWallArray[k].mWallMesh.visible = bShow;		
	};
	
	this.OnCreate = function(solution_paths, iMaxAreaFloor)
	{
		for(i = 0; i < solution_paths.length; i++)
		{
			if( i != iMaxAreaFloor )
				continue;
			var tFloor = [];
			for(j = 0; j < solution_paths[i].length; j++)
				tFloor.push(new THREE.Vector2(solution_paths[i][j].X ,solution_paths[i][j].Y ));

			tFloor.push(new THREE.Vector2(solution_paths[i][0].X ,solution_paths[i][0].Y ));

			for(k = 0; k < tFloor.length-1; k++)
			{
				var geom = new THREE.Geometry();
				geom.vertices.push(new THREE.Vector3(tFloor[k+0].x, tFloor[k+0].y, 0));
				geom.vertices.push(new THREE.Vector3(tFloor[k+1].x, tFloor[k+1].y, 0));
				geom.vertices.push(new THREE.Vector3(tFloor[k+0].x, tFloor[k+0].y, this.m_fHeight));
				
				geom.vertices.push(new THREE.Vector3(tFloor[k+0].x, tFloor[k+0].y, this.m_fHeight));
				geom.vertices.push(new THREE.Vector3(tFloor[k+1].x, tFloor[k+1].y, 0));
				geom.vertices.push(new THREE.Vector3(tFloor[k+1].x, tFloor[k+1].y, this.m_fHeight));

				geom.faces.push(new THREE.Face3(0,1,2));
				geom.faces.push(new THREE.Face3(3,4,5));

				geom.faceVertexUvs[0][0] = [ new THREE.Vector2(0, 0),new THREE.Vector2(1, 0),new THREE.Vector2(0, 1)];
				geom.faceVertexUvs[0][1] = [ new THREE.Vector2(0, 1),new THREE.Vector2(1, 0),new THREE.Vector2(1, 1)];

				geom.computeFaceNormals();
				geom.verticesNeedUpdate = true;
				geom.uvsNeedUpdate = true;		
				
				
/*					var diffuseColor = new THREE.Color().setHSL( 0.1, 0.5, 0.1 * 0.5 + 0.1 ).multiplyScalar( 1 - 0.1 * 0.2 );	
					var specularShininess = Math.pow( 2, 0.1 * 10 );
					var specularColor = new THREE.Color( 0.1 * 0.2, 0.1 * 0.2, 0.1 * 0.2 );
					var material = new THREE.MeshToonMaterial( {
								map: null,
								bumpMap: null,
								bumpScale: 1,
								color: diffuseColor,
								specular: specularColor,
								reflectivity: 0.1,
								shininess: specularShininess,
								envMap:  null
							} );				
					var result_wall = new THREE.Mesh( geom, material);*/
				var result_wall = new THREE.Mesh( geom, new THREE.MeshStandardMaterial( { side: THREE.DoubleSide, opacity:0.4, transparent: true, map: mResource.mWallTex } ) );	
				
				// THREE.FrontSide  THREE.BackSide  ,THREE.DoubleSide
				result_wall.rotation.x = -Math.PI/2;
				scene3D.add(result_wall);
				
				var tWallData3D_Out = new WallData3D_Out();
					tWallData3D_Out.OnCreate(result_wall);
				this.mWallArray.push(tWallData3D_Out);
				
				var edges = new THREE.EdgesGeometry( tWallData3D_Out.mWallMesh.geometry );
				tWallData3D_Out.m_Outline = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x000000 } ) );
				tWallData3D_Out.m_Outline.rotation.x = -Math.PI/2;
				scene3D.add( tWallData3D_Out.m_Outline );
				tWallData3D_Out.m_Outline.visible = false;				
			}
		}
	};
	
	// 按线条方式创建3D外墙
	this.OnCreate_Room = function(tLineArray)
	{
		for(k = 0; k < tLineArray.length-1; k++)
		{
			var geom = new THREE.Geometry();
			geom.vertices.push(new THREE.Vector3(tLineArray[k+0].x, tLineArray[k+0].y, 0));
			geom.vertices.push(new THREE.Vector3(tLineArray[k+1].x, tLineArray[k+1].y, 0));
			geom.vertices.push(new THREE.Vector3(tLineArray[k+0].x, tLineArray[k+0].y, this.m_fHeight));
			
			geom.vertices.push(new THREE.Vector3(tLineArray[k+0].x, tLineArray[k+0].y, this.m_fHeight));
			geom.vertices.push(new THREE.Vector3(tLineArray[k+1].x, tLineArray[k+1].y, 0));
			geom.vertices.push(new THREE.Vector3(tLineArray[k+1].x, tLineArray[k+1].y, this.m_fHeight));

			geom.faces.push(new THREE.Face3(0,1,2));
			geom.faces.push(new THREE.Face3(3,4,5));

			geom.faceVertexUvs[0][0] = [ new THREE.Vector2(0, 0),new THREE.Vector2(1, 0),new THREE.Vector2(0, 1)];
			geom.faceVertexUvs[0][1] = [ new THREE.Vector2(0, 1),new THREE.Vector2(1, 0),new THREE.Vector2(1, 1)];

			geom.computeFaceNormals();
			geom.verticesNeedUpdate = true;
			geom.uvsNeedUpdate = true;				
			var result_wall = new THREE.Mesh( geom, new THREE.MeshStandardMaterial( { side: THREE.DoubleSide, opacity:0.4, transparent: true, map: mResource.mWallTex } ) );	
			result_wall.rotation.x = -Math.PI/2;
			scene3D.add(result_wall);
			
			var tWallData3D_Out = new WallData3D_Out();
				tWallData3D_Out.OnCreate(result_wall);
			this.mWallArray.push(tWallData3D_Out);
		}		
	};

	// 外墙窗洞
	this.CreateHole = function(tWindowArray,tDoorArray)
	{
		for( var i = 0; i< this.mWallArray.length; i++ )
		{
			this.mWallArray[i].CreateHole(tWindowArray);
			this.mWallArray[i].CreateHole(tDoorArray);
		}		
	};
	
}