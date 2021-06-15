function ObjData()
{		
		this.m_Object;			// 3D模型
		this.m_strFile;				// 模型绝对路径
		this.m_fLength;
		this.m_fWidth;
		this.m_fHeight;
		this.m_fPosY;

		this.m_ModeType = '0';  //0:一般模型 1：舞台灯光

		//聚光灯参数
		this.m_LightR = 1;
		this.m_LightG = 1;
		this.m_LightB = 1;
		this.m_Intensity = 500000;
		this.m_Hotspot = 0.3504916; //聚光区/光束
		this.m_Fallsize = 0.3853982; //衰减区/区域
		this.m_infoXML;
		this.OnCreate3D = function(CurObjData,data)
		{		
			this.m_infoXML = data;
		//	var posX 	= data.find('Furniture3D').attr('PosX');	
		//	var posY 	= data.find('Furniture3D').attr('PosY');
		//	var posZ 	= data.find('Furniture3D').attr('PosZ');
			var posX = data.find('Furniture3D').attr('PosX');
			var posY = data.find('Furniture3D').attr('PosZ');
			var posZ =-data.find('Furniture3D').attr('PosY');;
			
			this.m_fPosY = posY;

			var rotateX = data.find('Furniture3D').attr('RotateX');
			var rotateY = data.find('Furniture3D').attr('RotateY');
			var rotateZ = data.find('Furniture3D').attr('Rotate');
			
			CurObjData.m_fLength 	= data.find('Furniture3D').attr('Length');
			CurObjData.m_fWidth 	= data.find('Furniture3D').attr('Width');
			CurObjData.m_fHeight 	= data.find('Furniture3D').attr('Height');
	
			var strFilePath = data.find('Furniture3D').attr('source');	//  绝对路径

			var strModeType = data.find('Furniture3D').attr('ModeType');
			if("1" == strModeType)
			{
				this.m_ModeType = strModeType;
				this.m_LightR = data.find('Furniture3D').attr('LightR');
				this.m_LightG = data.find('Furniture3D').attr('LightG');
				this.m_LightB = data.find('Furniture3D').attr('LightB');
				this.m_Intensity = data.find('Furniture3D').attr('Intensity');
				this.m_Hotspot =data.find('Furniture3D').attr('Hotspot');
				this.m_Fallsize = data.find('Furniture3D').attr('Fallsize');
			}
			
			this.m_strFile  = strFilePath;
			var tData= data;
		  	var loader = new THREE.TDSLoader( );		  				
		  	loader.load( m_strHttp +"jiaju/" +strFilePath,function ( object ) {
					scene.add( object );
					
					for( let i = 0; i<object.children.length; i++)
						objects.push(object.children[i]);							
					CurObjData.m_Object = object;
					var box = new THREE.Box3();
								box.setFromObject( object );
							
					var fLengthOld= (box.max.x - box.min.x );               
					var fWidthOld = (box.max.y - box.min.y );
					var fHeightOld= (box.max.z - box.min.z );
					
					object.scale.set(CurObjData.m_fLength/fLengthOld,
									 CurObjData.m_fWidth/fWidthOld,
									 CurObjData.m_fHeight/fHeightOld);
					object.rotation.x = rotateX;
					object.rotation.y = rotateY;
					object.rotation.z = rotateZ;
					
					object.position.x = posX;
					object.position.y = posY;
					object.position.z = posZ;
					
					// 替换的贴图
					for ( var i = 0; i<tData.find('node').length; i++ ) 
			        {
			        	var strPathImage = tData.find('node')[i].attributes[1].nodeValue;
			        	if( strPathImage != "")
							object.children[i].material.map = new THREE.TextureLoader().load(m_strHttp+"texture/"+strPathImage);
			        }
			   	});	
		}
		
		// 门窗
		this.OnCreate3D1 = function(CurObjData,data)
		{			
			var posX 	= data.find('Param').attr('X');
			var posY 	= data.find('Param').attr('Y');
			var posZ 	= data.find('Param').attr('Z');
			this.m_fPosY = posY;

			var rotateX = data.find('Param').attr('rotateX');
			var rotateY = data.find('Param').attr('rotateY');
			var rotateZ = data.find('Param').attr('rotateZ');
	
			var scaleX 	= data.find('Param').attr('scaleX');
			var scaleY 	= data.find('Param').attr('scaleY');
			var scaleZ 	= data.find('Param').attr('scaleZ');
			
			CurObjData.m_fLength = data.find('Param').attr('Length');
			CurObjData.m_fWidth  = data.find('Param').attr('Width');
			CurObjData.m_fHeight = data.find('Param').attr('Height');
	
			var strFilePath = data.find('Param').attr('src');	//  绝对路径
			var strModeType = data.find('Param').attr('ModeType');

			if("1" == strModeType)
			{
				this.m_ModeType = strModeType;
				this.m_LightR = data.find('Param').attr('LightR');
				this.m_LightG = data.find('Param').attr('LightG');
				this.m_LightB = data.find('Param').attr('LightB');
				this.m_Intensity= data.find('Param').attr('Intensity');
				this.m_Hotspot 	= data.find('Param').attr('Hotspot');
				this.m_Fallsize = data.find('Param').attr('Fallsize');
			}

			this.m_strFile  = strFilePath;
		  	var loader = new THREE.TDSLoader( );		  				
		  	loader.load( m_strHttp +"jiaju/" +strFilePath,function ( object ) {
					scene.add( object );
												
					CurObjData.m_Object = object;
					
					object.scale.set(scaleX,scaleY,scaleZ);
					object.rotation.x = rotateX;
					object.rotation.y = rotateY;
					object.rotation.z = rotateZ;
					
					object.position.x = posX;
					object.position.y = posY;
					object.position.z = posZ;			
			});	
		}		
								
		this.OnRender = function()
		{
      		this.OnUpdate();			
		}
		
}