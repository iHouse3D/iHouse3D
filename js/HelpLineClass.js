
function HelpLineClass()
{
	// 线式墙体
		this.m_vStart =null;				// 启点			
		this.m_vEnd	  =null;				// 终点		
		this.mLine;
		this.OnInit = function()
		{	
			
			var h = 8000;		
			var positions = [];
			var colors = [];
			positions.push(-h, 0,1);
			positions.push( h, 0,1);					
			colors.push(1,1,0.5);
			colors.push(1,1,0.5);
		
			var geometry1 = new THREE.LineGeometry();
			geometry1.setPositions( positions );
			geometry1.setColors( colors );		
			this.mLine = new THREE.Line2( geometry1, mResource.matLine );
			this.mLine.visible = false;
			scene.add( this.mLine );			
		};
						
		this.OnClear= function()
		{
			this.m_vStart = null;
			this.m_vEnd   = null;

			this.mLine.visible = false;
		};
		
		this.DrawHelpLine = function()
		{
			this.OnClear();
			m_cPenType = 12;
			$('#container' ).css("cursor","crosshair");
		};
		
		this.OnMouseDown = function(mouseX,mouseY)
		{
			if( this.m_vStart == null ){
				this.m_vStart = new THREE.Vector3( mouseX,mouseY,1);
				this.m_vEnd   = new THREE.Vector3( mouseX,mouseY,1);
				this.OnUpdate();
				this.mLine.visible = true;
			}
			else
			{	
				this.m_vEnd.x = mouseX;
				this.m_vEnd.y = mouseY;
				m_cPenType = 0;
			}			
		};
		
		this.OnMouseMove= function(mouseX,mouseY)
		{
			if( this.m_vStart )
			{
				this.m_vEnd.x = mouseX;
				this.m_vEnd.y = mouseY;				
				mMathClass.RotateVecFromAxis( this.m_vEnd, this.m_vStart, 15);
				this.m_vEnd.x =  mMathClass.mRetVec.x;  
				this.m_vEnd.y =  mMathClass.mRetVec.y;	
				this.OnUpdate();
			}
		};
		
		this.OnMouseRightUp2D = function()
		{
		//	m_cPenType = 0;
		};
		
		this.OnUpdate = function()
		{
			scene.remove( this.mLine );		
/*			this.mLine.geometry.attributes.position.array[0] =  this.m_vStart.x;
			this.mLine.geometry.attributes.position.array[1] =  this.m_vStart.y;
			this.mLine.geometry.attributes.position.array[2] =  1.5;
			
			this.mLine.geometry.attributes.position.array[7] =  this.m_vEnd.x;
			this.mLine.geometry.attributes.position.array[8] =  this.m_vEnd.y;
			this.mLine.geometry.attributes.position.array[9] =  1.5;

			this.mLine.geometry.verticesNeedUpdate = true;*/
				
			var positions = [];
			var colors = [];
			positions.push(this.m_vStart.x, this.m_vStart.y,1.5);
			positions.push(this.m_vEnd.x, this.m_vEnd.y,1.5);					
			colors.push(1,0,0);
			colors.push(1,0,0);
		
		
			var geometry1 = new THREE.LineGeometry();
			geometry1.setPositions( positions );
			geometry1.setColors( colors );		
			this.mLine = new THREE.Line2( geometry1, mResource.matLine1 );

			scene.add( this.mLine );			
			
		};
		
}