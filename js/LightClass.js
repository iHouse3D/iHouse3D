
function LightClass()
{
	// 漫游时光照
	this.mLightArray = new Array();		// 光源数据
	this.mLight1;
	this.mAmbientLight;
	this.OnInit = function()
	{
		var sphere = new THREE.SphereBufferGeometry( 10, 8, 8 );
		this.mLight1 = new THREE.PointLight( 0xffffff, 1, 1000 );
		this.mLight1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xff0000 } ) ) );
		this.mLight1.intensity = 2;	
		this.mLight1.distance  = 1000;
		this.mLight1.position.x = 0;
		this.mLight1.position.y = 1000;
		this.mLight1.position.z = 0;
		scene3D.add( this.mLight1 );
		    	
		this.mAmbientLight = new THREE.AmbientLight(0xffffff);
		this.mAmbientLight.intensity = 2;
    	this.mAmbientLight.position.set(0, 0, 800); 								
    	scene3D.add(this.mAmbientLight);
	};
	
	this.OnRemoveLight = function()
	{
		for(var i = 0; i<this.mLightArray.length; i++ )
			scene3D.remove(this.mLightArray[i]);
			
		this.mLightArray.length = 0;
	};
	
	this.OnCreateLight = function(tWindows, tFloors)
	{
		//lights
		var width = 100;
		var height = 100;
		var intensity = 30;
		
		// 两扇窗户一下加顶灯
		if( tWindows.length <= 2 )
		{
			
			for(var i = 0; i<tFloors.length ; i++)
			{
				var fCenterX = (tFloors[i].m_OBBox_Max.x+tFloors[i].m_OBBox_Min.x)/2;
				var fCenterY = (tFloors[i].m_OBBox_Max.y+tFloors[i].m_OBBox_Min.y)/2;
				//0xf3aaaa
				var tRectLight = new THREE.RectAreaLight( 0xffffff, tFloors[i].mfArea/20000, width, height );
				tRectLight.position.set( fCenterX, 280, -fCenterY );
				tRectLight.lookAt( fCenterX, 0, -fCenterY );
				scene3D.add( tRectLight );
				this.mLightArray.push(tRectLight);
			/*	var redRectLightHelper = new THREE.RectAreaLightHelper( tRectLight, 0xffffff );
				tRectLight.add( redRectLightHelper );*/
			}
		}
		
		for(var j=0; j<tWindows.length; j++)
		{	
			var tmpMatrix1= new THREE.Matrix4().makeRotationZ(tWindows[j].m_fRotate);			
			var vPos1 = new THREE.Vector3( 1,0,0 );	
			var vPos2 = vPos1.applyMatrix4(tmpMatrix1);

			var tLight = new THREE.RectAreaLight( 0xffffff, intensity/2, width, height );	//0x9aaeff //0xf3aaaa
			tLight.position.set( tWindows[j].m_vPos.x,tWindows[j].m_fHight+tWindows[j].m_fHeight/2,-tWindows[j].m_vPos.y );
			tLight.lookAt( vPos2.x, tWindows[j].m_fHight+tWindows[j].m_fHeight/2, -vPos2.y );
			scene3D.add( tLight );
			this.mLightArray.push(tLight);
		/*	var redRectLightHelper = new THREE.RectAreaLightHelper( tLight, 0xffffff );
			tLight.add( redRectLightHelper );*/			
		}	
	};
	
	// 更新实时灯光
	this.OnUpdateLight_Roam = function(tWindows, tFloors)
	{
/*		scene3D.background = mResource.mBackground;
		this.mAmbientLight.visible = true;
		this.mLight1.visible = false;
		this.mAmbientLight.intensity = 1;
		
		this.mAmbientLight.layers.enable( 1 );
		this.OnRemoveLight();
		this.OnCreateLight(tWindows, tFloors);*/
	};
	
	this.OnUpdateLight_3D = function(tWindows, tFloors)
	{
		scene3D.background = mResource.mBackColor;
		this.mAmbientLight.visible = true;
		this.mLight1.visible = true;
		this.mAmbientLight.intensity = 1.5;
		this.OnRemoveLight();
	};

}