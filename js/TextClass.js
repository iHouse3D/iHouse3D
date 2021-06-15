/**
 * @api TextClass
 * @apiGroup TextClass
 * @apiName  0
 * @apiDescription 文字操作类
 * @apiParam (成员变量) mTextArray  文字数组
 * @apiParam (成员变量) m_pCurText  创建文字
 * @apiParam (成员变量) m_pMoveText 移动文字
 * @apiParam (成员变量) mCurMouseX 记录鼠标X位置
 * @apiParam (成员变量) mCurMouseY 记录鼠标Y位置
 */
function TextClass()
{
		this.mTextArray = new Array(); // 主体墙线	
		this.m_pCurText = null;
		this.m_pMoveText= null;
		this.mCurMouseX = 0;
		this.mCurMouseY = 0;		
		
		/**
		 * @api OnCreate(x,y)
		 * @apiDescription 平面上创建文字函数
		 * @apiGroup TextClass
		 * @apiParam (参数) x X位置
		 * @apiParam (参数) y Y位置                           
		 */	
		this.CreateText = function()
		{
			if( IsContain(container, renderer2.domElement ) != false )
			{
				alert("请到2D下操作.");
				return;
			}
			OnMouseRightUp();
			m_cPenType = 23;
		  	this.m_pCurText = new TextData();
		  	this.m_pCurText.OnInit();	
		  	this.m_pCurText.OnCreate(-9999,-9999);
			this.m_pCurText.OnCreate3D();
		};	
		
		/**
		 * @api DrawText
		 * @apiDescription 开始绘制文字
		 * @apiGroup TextClass                      
		 */		
		this.DrawText = function()
		{
			if( true == this.OnMouseMove1(g_mouseX,g_mouseY) )
			{
				this.mTextArray.push(this.m_pCurText);
				this.m_pCurText = null;					
				m_cPenType = 0;
			}
		};
		
		this.OnMouseMove1 = function(mouseX,mouseY)
		{
			if(this.m_pCurText != null)
			{
				this.m_pCurText.mText.position.x = mouseX;
				this.m_pCurText.mText.position.y = mouseY;				
				this.m_pCurText.m_vPos.x = mouseX;
				this.m_pCurText.m_vPos.y = mouseY;
				this.m_pCurText.OnUpdateText();				
				return true;
			}	
			return false;			
		};
		
		 
		this.OnCreate = function(x,y)
		{
			var tText = new TextData();
			tText.OnInit();
			tText.OnCreate(x,y);
			tText.OnCreate3D();
			this.mTextArray.push(tText);
			tText.OnUpdateText();
			return tText;
		};
		
		/**
		 * @api OnClear()
		 * @apiDescription 清空所有文字信息
		 * @apiGroup TextClass                       
		 */			
		this.OnClear = function()
		{
			for( var i =0 ;i< this.mTextArray.length; i++ )
				this.mTextArray[i].OnDelete();
			
			this.mTextArray.length = 0;
		};

		/**
		 * @api OnDelete(tText)
		 * @apiDescription 删除指定的文字
		 * @apiGroup TextClass 
		 * @apiParam (参数) tText 指定的文字
		 */
		this.OnDelete = function(tText)
		{
			if( tText == null)
				return;	
			tText.OnDelete();	
			
			var iIndex = this.mTextArray.indexOf(tText);
			if( iIndex == -1 )
				return;
			this.mTextArray.splice(iIndex,1);
		};
		

		/**
		 * @api OnShowRoomName(bShow)
		 * @apiDescription 显示所有文字
		 * @apiGroup TextClass 
		 * @apiParam (参数) bShow false不显示，true显示
		 */		
		this.OnShowRoomName = function(bShow)
		{
			for( j=0; j<this.mTextArray.length; j++)
			{
				this.mTextArray[j].OnShow(bShow);	
			}			
		};
		
 
		/**
		 * @api OnMouseDown(mouseX,mouseY)
		 * @apiDescription 平面下左键点击移动文字
		 * @apiGroup TextClass 
		 * @apiParam (参数) mouseX 鼠标X坐标
		 * @apiParam (参数) mouseY 鼠标Y坐标
		 * @apiParam (返回) Bool false未点到文字,true点到文字
		 */		
		this.OnMouseDown = function(mouseX,mouseY)
		{
			this.mCurMouseX = 0;
			this.mCurMouseY = 0;				
			this.m_pMoveText = null;
			for( j=0; j<this.mTextArray.length; j++)
			{
				var Intersections = raycaster.intersectObject(  this.mTextArray[j].mTextBox );
				for( var i = 0; i< Intersections.length ; i++)
				{						
						this.m_pMoveText = this.mTextArray[j];
						m_ParamTextDlg.Show(this.mTextArray[j]);
						this.mCurMouseX = mouseX;
						this.mCurMouseY = mouseY;	
						bMouseUp2D = true;
						return true;
				}				
			}
			return false;
		};
		
		/**
		 * @api OnMouseDown(mouseX,mouseY,e)
		 * @apiDescription 平面下左键移动文字, 与OnMouseDown连用
		 * @apiGroup TextClass 
		 * @apiParam (参数) mouseX 鼠标X坐标
		 * @apiParam (参数) mouseY 鼠标Y坐标
		 * @apiParam (参数) e 鼠标按键信息
		 * @apiParam (返回) Bool false无移动文字,true有移动文字
		 */			
		this.OnMouseMove = function(mouseX,mouseY,e){
			if(e.buttons == 1 && this.m_pMoveText != null)
			{
				this.m_pMoveText.mText.position.x += mouseX-this.mCurMouseX;
				this.m_pMoveText.mText.position.y += mouseY-this.mCurMouseY;
								
				this.m_pMoveText.m_vPos.x += mouseX-this.mCurMouseX;
				this.m_pMoveText.m_vPos.y += mouseY-this.mCurMouseY;
				
				this.m_pMoveText.OnUpdateText();				
								
				this.mCurMouseX = mouseX;
				this.mCurMouseY = mouseY;	
				return true;
			}	
			return false;
		};
		
		/**
		 * @api OnMouseRightUp2D()
		 * @apiDescription 平面下右键点击鼠标
		 * @apiGroup TextClass                           
		 */		
		this.OnMouseRightUp2D = function(){
			this.OnDelete(this.m_pCurText);
			this.m_pCurText = null;
			this.m_pMoveText
		};
		
		/**
		 * @api OnSave_XML()
		 * @apiDescription 保存房间文字信息
		 * @apiGroup TextClass                           
		 */			
		this.OnSave_XML = function(){
			
			let nTextNum   = this.mTextArray.length;
            let strTextXML = `<TextInfo num="${nTextNum}"/>`;

            for(let index = 0; index < nTextNum; ++index)
			{
				let textInfo = this.mTextArray[index];
				strTextXML += `<TextData PosX="${textInfo.m_vPos.x}" PosY="${textInfo.m_vPos.y}" PosZ="${textInfo.m_vPos.z}" 
                               Text="${textInfo.mRoomName}"/>`;
			}
      		return strTextXML;		
		};
		
		/**
		 * @api OnLoad_XML()
		 * @apiDescription 读取文字信息
		 * @apiGroup TextClass                           
		 */			
		this.OnLoad_XML = function(data)
		{			  
			var x1 = parseFloat($(data).attr('PosX'));
			var y1 = parseFloat($(data).attr('PosY'));		  

			var strText = $(data).attr('Text');
			
			var tText = new TextData();
			tText.OnInit();
			tText.OnCreate(x1,y1);
			tText.OnCreate3D();
			
			tText.OnUpdateName(strText);
			tText.OnUpdateText();				
			this.mTextArray.push(tText);
		};
}