function TextureData()
{		
		this.m_fLength   = 100;		
		this.m_fWidth	 = 50;
		this.m_fRotate   = 0;		
		this.m_strFile	 ="floor.jpg";
		this.m_strPath;
		this.mData;
	  	this.mTexture    = null;	
	  	this.mMaterial	 = null;
		this.m_x1 		 = 0;
		this.m_y1		 = 0;
		this.m_z1		 = 0;
	
		this.m_fMode	 = 1;		//0 子分割线  1无子分割线
		this.m_fOffX	 = 0;
		this.m_fOffY	 = 0;
		this.m_fAlpha    = 1;	  	
		this.OnCreate = function(ab, tMesh)
		{
			this.mData  	= ab;   			
			this.m_strFile 	= ab[1];
			this.m_fRotate  = 0;
			var a2 			= ab[2].split('A');
			this.m_fLength 	= a2[0];
			this.m_fWidth  	= a2[1];		
			this.mTexture 	= new THREE.TextureLoader( ).load( m_strHttp + 'texture/'+this.m_strFile );
			this.mMaterial  = new THREE.MeshStandardMaterial( {color: new THREE.Color( '#ffffff' )} );	
		
			this.m_x1 = 0;
			this.m_y1 = 0;
			this.m_z1 = 0;	
			this.m_fOffX  = 0;
			this.m_fOffY  = 0;
			this.m_fAlpha = 1;
			this.m_fMode  = 1;
			if(tMesh == null)
			   return;
			tMesh.geometry.computeBoundingBox();
			this.m_x1 = ( tMesh.geometry.boundingBox.min.x+tMesh.geometry.boundingBox.max.x )/2;
			this.m_y1 = ( tMesh.geometry.boundingBox.min.y+tMesh.geometry.boundingBox.max.y )/2;
			this.m_z1 = ( tMesh.geometry.boundingBox.min.z+tMesh.geometry.boundingBox.max.z )/2;
			this.mTexture.wrapS = this.mTexture.wrapT = THREE.RepeatWrapping;
			this.mTexture.needsUpdate = true;
				
			var fLength = Math.sqrt((tMesh.geometry.boundingBox.min.x-tMesh.geometry.boundingBox.max.x)*
									(tMesh.geometry.boundingBox.min.x-tMesh.geometry.boundingBox.max.x)+
									(tMesh.geometry.boundingBox.min.y-tMesh.geometry.boundingBox.max.y)*
									(tMesh.geometry.boundingBox.min.y-tMesh.geometry.boundingBox.max.y));
			
			var fw = fLength/this.m_fLength;
			var fh = (tMesh.geometry.boundingBox.max.z-tMesh.geometry.boundingBox.min.z)/this.m_fWidth;
	
			this.mTexture.offset.set(  0, 0 );
			this.mTexture.repeat.set( fw*10,fh*10 );
			this.mTexture.center.set(  0, 0 );
			this.mTexture.rotation = 0;				
		};
		
		this.OnUpdateUV = function(tMesh) 
		{
			tMesh.geometry.computeBoundingBox();
			this.mTexture.wrapS = this.mTexture.wrapT = THREE.RepeatWrapping;
			this.mTexture.needsUpdate = true;
				
			var fLength = Math.sqrt((tMesh.geometry.boundingBox.min.x-tMesh.geometry.boundingBox.max.x)*
									(tMesh.geometry.boundingBox.min.x-tMesh.geometry.boundingBox.max.x)+
									(tMesh.geometry.boundingBox.min.y-tMesh.geometry.boundingBox.max.y)*
									(tMesh.geometry.boundingBox.min.y-tMesh.geometry.boundingBox.max.y));
			
			var fw = fLength/this.m_fLength;
			var fh = (tMesh.geometry.boundingBox.max.z-tMesh.geometry.boundingBox.min.z)/this.m_fWidth;
	
			this.mTexture.offset.set(  0, 0 );
			this.mTexture.repeat.set( fw*10,fh*10);
			this.mTexture.center.set(  0, 0 );
			this.mTexture.rotation = 0;				
		};
		
		
		this.OnCreate1 = function(ab, tTex)
		{
			this.mData  	= ab;   			
			this.m_strFile 	= ab[1];
			this.m_fRotate  = 0;
			var a2 			= ab[2].split('A');
			this.m_fLength 	= a2[0];
			this.m_fWidth  	= a2[1];		
			this.mTexture 	= tTex;
			this.mMaterial  = new THREE.MeshStandardMaterial( {color: new THREE.Color( '#ffffff' )} );	
		
			this.m_x1 = 0;
			this.m_y1 = 0;
			this.m_z1 = 0;	
			this.m_fOffX = 0;
			this.m_fOffY = 0;
			this.m_fAlpha = 1;
			this.m_fMode  = 1;			
		};
}