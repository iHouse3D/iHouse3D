function Dlg_WindowAttribute()
{
	this.mWindow;
	this.mWindowData=[];
	this.sampleWindow_data='';
	this.sampleWindow_Arr;
	this.sampleWindow_Arr_2=[];
	this.sampleWindow_Arr_3=[];
	this.m_pageInt=0;
	
	// 显示属性窗口
	this.Show = function(tObj)
	{
		this.mWindow = tObj;

		// console.log(tObj);
/*		this.mWindow.mData[1];		//缩略图
		this.mWindow.mData[3];		// 长
		this.mWindow.mData[4];		// 宽
		this.mWindow.mData[5];		// 高
		
		this.mWindow.mData[6];		// 一级分类
		this.mWindow.mData[7];		// 二级分类
		this.mWindow.mData[8];		// 三级分类
		
		this.mWindow.m_Ojbect3D.rotation.y*180/Math.PI;	// 度(0-360);
		this.mWindow.m_Ojbect3D.position.y;	// 离地高*/
		if (this.sampleWindow_data=='') {			
			this.WindowCsvData();
		}
		

		$('.attributeInterface').hide();
		$("#window").show();
		if(m_SystemVersion=='kz'){
			$('#window').css('left','60px');			
		}

		// console.log(this.mWindow.m_strFile);
		for (var i in this.sampleWindow_Arr_2) {
			if (this.sampleWindow_Arr_2[i][1][1]==this.mWindow.m_strFile) {
				this.mWindowData=this.sampleWindow_Arr_2[i][1];
			}
		}

		$("#window .goodsImg img").attr('src',m_strHttp+'jiaju/'+this.mWindow.m_strFile);
		$("#window .goosNmaes p span").text(this.mWindowData[13]);
		$("#window .goosNmaes p").eq(0).text(this.mWindowData[0]);

		this.windowClassData(this.mWindowData[4]);
		this.pageData();


		app.attributeInterface.window.length.int=parseInt(this.mWindow.m_fLength*10);
		app.attributeInterface.window.height.int=parseInt(this.mWindow.m_fHeight*10);
		app.attributeInterface.window.groundLevel.int=parseInt(this.mWindow.m_fHight)*10;
		app.attributeInterface.window.radio=this.mWindow.m_iStyle;
		console.log()

	};

	// 窗类数据
	this.WindowCsvData = function(){
		this.sampleWindow_data=$.ajax({url:m_strHttp+'windows/windows_brick.csv',async:false,});
		this.sampleWindow_Arr=this.sampleWindow_data.responseText.split('\n');
		
		var itemArr=[],tempNodeLi,iIndex = 0;
		for (var i = 2; i < this.sampleWindow_Arr.length-1; i++) {
			itemArr=[];
			let Windows_a2=this.sampleWindow_Arr[i].split(',');
			if (accountType==0){
				tempNodeLi ='<li class="meshPic"><i class="icon iconfont icon-xinxi"></i><i class="icon iconfont icon-d-" id="'+iIndex+'-1"></i><i class="icon iconfont icon-xing"></i><img id="'+iIndex+'" src="'+m_strHttp + 'jiaju/'+ Windows_a2[1]+'" alt="image"  onclick="m_ParamWinDlg.OnWindowListClick(this);" ></li>';
			}else if(accountType==1){
				tempNodeLi ='<li class="meshPic"><i class="icon iconfont icon-xinxi"></i><i class="icon iconfont icon-xing"></i><img id="'+iIndex+'" src="'+m_strHttp + 'jiaju/'+ Windows_a2[1]+'" alt="image"  onclick="m_ParamWinDlg.OnWindowListClick(this);" ></li>';
			}
			//itemArr.push(this.sampleWindow_Arr[i]);//原始数据
			itemArr.push(tempNodeLi);			 //html数据
			itemArr.push(Windows_a2);				 //分割数据
			this.sampleWindow_Arr_2.push(itemArr);

			iIndex++;
		}
	};

	this.windowClassData = function(str){
		this.sampleWindow_Arr_3=[];
		this.m_pageInt=0;
		for (var i in this.sampleWindow_Arr_2) {
			if (this.sampleWindow_Arr_2[i][1][4]==str) {
				this.sampleWindow_Arr_3.push(this.sampleWindow_Arr_2[i]);
			}
		}
	};

	// 分页函数
	this.pageData = function(){
		var cont_page=this.sampleWindow_Arr_3.length/21;
		if (parseInt(cont_page)==cont_page) {
	    	cont_page=cont_page-1;
		}else{
	    	cont_page=parseInt(cont_page);
		}

    	if (this.m_pageInt>=0 && this.m_pageInt<=cont_page) {
	    	$('#window .itemList-goodList').html('');
	    	for (var i = this.m_pageInt*21; i < (this.m_pageInt*21)+21; i++) {
	    		// 
	    		if(this.sampleWindow_Arr_3[i]==undefined){
	    			return;
	    		}
	    		$('#window .itemList-goodList').append(this.sampleWindow_Arr_3[i][0]);
	    	}
    	}else if(this.m_pageInt<0){
    		this.m_pageInt=0;
    	}else if(this.m_pageInt>cont_page){
    		this.m_pageInt=cont_page;
    	}
   	};

   	// 显示门bar
	this.ShowBar = function()
	{
		$("#mWindowBar").show();
		
		var div1=document.getElementById("mWindowBar");
		div1.style.left= mouseScreen.x+10+'px';
		div1.style.top= mouseScreen.y-150+'px';
	};

	// 隐藏门bar
	this.HideBar = function()
	{
		$("#mWindowBar").hide();
	};

	this.Delete = function()
	{
		if( this.mWindow )
			mHouseClass.mWindowClass.OnDelete(this.mWindow);

		HideDlg();
	};
	
	// 替换当前模型
   	this.OnWindowListClick = function(_this)
   	{
   		this.mWindow.OnChangeWindow(this.sampleWindow_Arr_2[_this.id][1]);
   		$("#window .goodsImg img").attr('src',m_strHttp+'jiaju/'+this.mWindow.m_strFile);
   	};

   	this.lenght = function(int){
   		if (this.mWindow.m_fLength==null)
			return;

		this.mWindow.m_fLength=parseInt(int)/10;
		this.mWindow.OnUpdate3D();
		this.mWindow.UpdateWindow();
		mHouseClass.mWindowClass.OnShowCtrl(this.mWindow);
   	};

   	this.height = function(int){
   		if (this.mWindow.m_fHeight==null)
			return;

		this.mWindow.m_fHeight=parseInt(int)/10;
		this.mWindow.OnUpdate3D();
		this.mWindow.UpdateWindow();
   	};

   	this.groundLevel = function(int){
   		if (this.mWindow.m_fHight==null)
			return;

		this.mWindow.m_fHight=parseInt(int)/10;
		this.mWindow.OnUpdate3D();
		this.mWindow.UpdateWindow();
   	};

   	this.Restore = function(){

   		if (this.mWindow.m_iStyle==0) {
	   		this.mWindow.m_fLength   = 150;
		//	this.mWindow.m_fWidth    = 22;//fWidth/10;
			this.mWindow.m_fHeight   = 220;			
		//	this.mWindow.m_fRotate   = 0;
			this.mWindow.m_fHight	 = 50;
			this.mWindow.m_iMode     = 0;
			this.mWindow.m_iMirror   = 0;
   		}else if(this.mWindow.m_iStyle==1){
   			this.mWindow.m_fLength   = 200;
		//	this.mWindow.m_fWidth    = 22;//fWidth/10;
			this.mWindow.m_fHeight   = 100;			
		//	this.mWindow.m_fRotate   = 0;
			this.mWindow.m_fHight	 = 50;
			this.mWindow.m_iMode     = 0;
			this.mWindow.m_iMirror   = 0;
   		}else if(this.mWindow.m_iStyle==2){
   			this.mWindow.m_fLength   = 250; //150
		//	this.mWindow.m_fWidth    = 90;//fWidth/10;
			this.mWindow.m_fHeight   = 210;	 //100
		//	this.mWindow.m_fRotate   = 0;
			this.mWindow.m_fHight	 = 50;
			this.mWindow.m_iMode     = 0;
			this.mWindow.m_iMirror   = 0;
   		}

		app.attributeInterface.window.length.int=(this.mWindow.m_fLength*10);
		app.attributeInterface.window.height.int=(this.mWindow.m_fHeight*10);
		app.attributeInterface.window.groundLevel.int=parseInt(this.mWindow.m_fHight)*10;
		app.attributeInterface.window.radio=this.mWindow.m_iStyle;
		
   		this.mWindow.OnUpdate3D();
		this.mWindow.UpdateWindow();
   	};

   	this.Material = function(){
   		var str = "win,jpg,"+this.mWindow.m_strFile.slice(0,this.mWindow.m_strFile.length-4)+".3ds";
		sessionStorage.setItem("ihouseshow3d",str);
		//window.open('../h5/Material/materialTexture.html');
		window.open('Material/materialTexture1.html');
	};

}

// 家具功能属性上一页分页按钮
$('#window .md-itemList button').eq(0).click(function(){
	// var Dlg_FurnitureAttribute=new Dlg_FurnitureAttribute();
	m_ParamWinDlg.m_pageInt=m_ParamWinDlg.m_pageInt-1;
	m_ParamWinDlg.pageData();
	// console.log();
})

// 家具功能属性下一页分页按钮 
$('#window .md-itemList button').eq(1).click(function(){
	m_ParamWinDlg.m_pageInt=m_ParamWinDlg.m_pageInt+1;
	m_ParamWinDlg.pageData();
	
})

// 材质替换
$('#window .itemList-goodList').delegate('.icon-d-','click',function(){
	var strArray = this.id.split('-');
		if(strArray[1] == "1")
			sessionStorage.setItem("ihouseshow3d",m_ParamWinDlg.sampleWindow_Arr_2[strArray[0]][1]);
	
		//window.open('../h5/Material/materialTexture.html');
	    window.open('Material/materialTexture1.html');
})

// 收藏

$('#window .itemList-goodList').delegate('.icon-xing','click',function(){
		let itemId=$(this).prev().attr('id'),strArr=itemId.split('-');
		
		
		if (m_CollectionGroup.length==0) {
			m_CollectionGroup.push(m_ParamWinDlg.sampleWindow_Arr_2[strArr[0]]);
		}else{
			for(let i in m_CollectionGroup){
				if (m_CollectionGroup[i][0]==m_ParamWinDlg.sampleWindow_Arr_2[strArr[0]][0]) {
					return;
				}
			}
			m_CollectionGroup.push(m_ParamWinDlg.sampleWindow_Arr_2[strArr[0]]);
		}
})