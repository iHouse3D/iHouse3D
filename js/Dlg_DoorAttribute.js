function Dlg_DoorAttribute()
{
	this.mDoor;
	this.mDoorData=[];
	this.sampleDoor_data='';
	this.sampleDoor_Arr;
	this.sampleDoor_Arr_2=[];
	this.sampleDoor_Arr_3=[];
	this.m_ObjGroup =[];
	this.m_pageInt=0;
	
	// 显示属性窗口
	this.Show = function(tObj)
	{
		this.mDoor = tObj;

/*		this.mDoor.mData[1];		//缩略图
		this.mDoor.mData[3];		// 长
		this.mDoor.mData[4];		// 宽
		this.mDoor.mData[5];		// 高
		
		this.mDoor.mData[6];		// 一级分类
		this.mDoor.mData[7];		// 二级分类
		this.mDoor.mData[8];		// 三级分类
		
		this.mDoor.m_Ojbect3D.rotation.y*180/Math.PI;	// 度(0-360);
		this.mDoor.m_Ojbect3D.position.y;	// 离地高*/
		if (this.sampleDoor_data=='') {			
			this.DoorCsvData();
		}

		for (var i in this.sampleDoor_Arr_2) {
			if (this.sampleDoor_Arr_2[i][1][1]==this.mDoor.m_strFile) {
				this.mDoorData=this.sampleDoor_Arr_2[i][1];
			}
		}


		$('.attributeInterface').hide();
		$("#door").show();
		if(m_SystemVersion=='kz'){
			$('#door').css('left','60px');			
		}

		$("#door .goodsImg img").attr('src',m_strHttp+'jiaju/'+this.mDoorData[1]);

		$("#door .goosNmaes p span").text(this.mDoorData[13]);
		$("#door .goosNmaes p").eq(0).text(this.mDoorData[0]);

		app.attributeInterface.door.length.int=parseInt(this.mDoor.m_fLength*10);
		app.attributeInterface.door.height.int=parseInt(this.mDoor.m_fHeight*10);
		app.attributeInterface.door.groundLevel.int=parseInt(this.mDoor.m_fHight)*10;
		app.attributeInterface.door.radio=this.mDoor.m_iStyle;

		this.doorClassData(this.mDoorData[4]);
		this.pageData();
	};
	
	// 分类数据
	this.doorClassData = function(str){
		this.sampleDoor_Arr_3=[];
		for (var i in this.sampleDoor_Arr_2) {
			if (this.sampleDoor_Arr_2[i][1][4]==str) {
				this.sampleDoor_Arr_3.push(this.sampleDoor_Arr_2[i]);
			}
		}
		this.m_pageInt=0;
	};
	
	// 门类数据
	this.DoorCsvData = function(){
		this.m_ObjGroup.length = 0;
		this.sampleDoor_data=$.ajax({url:m_strHttp+'doors/doors.csv',async:false,});
		this.sampleDoor_Arr=this.sampleDoor_data.responseText.split('\n');
		
		var itemArr=[],tempNodeLi,iIndex = 0;
		for (var i = 2; i < this.sampleDoor_Arr.length-1; i++) {
			itemArr=[];
			let doors_a2=this.sampleDoor_Arr[i].split(',');
			if (accountType==0){
				tempNodeLi ='<li class="meshPic"><i class="icon iconfont icon-xinxi"></i><i class="icon iconfont icon-d-" id="'+iIndex+'-1"></i><i class="icon iconfont icon-xing"></i><img id="'+iIndex+'" src="'+m_strHttp + 'jiaju/'+ doors_a2[1]+'" alt="image"  onclick="m_ParamDoorDlg.OnChangeDoor(this);" ></li>';
			}else if(accountType==1){
				tempNodeLi ='<li class="meshPic"><i class="icon iconfont icon-xinxi"></i><i class="icon iconfont icon-xing"></i><img id="'+iIndex+'" src="'+m_strHttp + 'jiaju/'+ doors_a2[1]+'" alt="image"  onclick="m_ParamDoorDlg.OnChangeDoor(this);" ></li>';
			}
			//itemArr.push(this.sampleDoor_Arr[i]);//原始数据
			itemArr.push(tempNodeLi);			 //html数据
			itemArr.push(doors_a2);				 //分割数据
			this.sampleDoor_Arr_2.push(itemArr);

			iIndex++;
		}
	};
	// 分页函数
	this.pageData = function(){
    	var cont_page=this.sampleDoor_Arr_3.length/21;
		if (parseInt(cont_page)==cont_page) {
	    	cont_page=cont_page-1;
		}else{
	    	cont_page=parseInt(cont_page);
		}
    	if (this.m_pageInt>=0 && this.m_pageInt<=cont_page) {
	    	$('#door .itemList-goodList').html('');
	    	for (var i = this.m_pageInt*21; i < (this.m_pageInt*21)+21; i++) {
	    		// 
	    		if(this.sampleDoor_Arr_3[i]==undefined){
	    			return;
	    		}
	    		$('#door .itemList-goodList').append(this.sampleDoor_Arr_3[i][0]);
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
		$("#mDoorBar").show();
		
		var div1=document.getElementById("mDoorBar");
		div1.style.left= mouseScreen.x+10+'px';
		div1.style.top= mouseScreen.y-150+'px';
	};

	// 隐藏门bar
	this.HideBar = function()
	{
		$("#mDoorBar").hide();
		$('.attributeInterface').hide();
	};

	this.Delete = function()
	{
		if( this.mDoor )
			mHouseClass.mDoorClass.OnDelete(this.mDoor);

		HideDlg();
	};

	this.Copy = function(){
		
	};
	
	// 替换门
	this.OnChangeDoor = function(that)
	{
   		this.mDoor.OnChangeDoor(this.sampleDoor_Arr_2[that.id][1]);
   		$("#door .goodsImg img").attr('src',m_strHttp+'jiaju/'+this.mDoor.m_strFile);
	};

	// 旋转门
   	this.OnRotate = function(){

		if( m_ParamDoorDlg.mDoor.m_iStyle == 0)	// 单开门
		{
			m_ParamDoorDlg.mDoor.m_iMirror++;
			if(m_ParamDoorDlg.mDoor.m_iMirror>=4)
				m_ParamDoorDlg.mDoor.m_iMirror =0;
		}
		
		if( m_ParamDoorDlg.mDoor.m_iStyle == 7)	// 单开门
		{
			m_ParamDoorDlg.mDoor.m_iMirror++;
			if(m_ParamDoorDlg.mDoor.m_iMirror>=4)
				m_ParamDoorDlg.mDoor.m_iMirror =0;
		}		
		
		if( m_ParamDoorDlg.mDoor.m_iStyle == 2 )	//  双开门
		{
			if(m_ParamDoorDlg.mDoor.m_iMirror == 0 )
				m_ParamDoorDlg.mDoor.m_iMirror=2;
			else
				m_ParamDoorDlg.mDoor.m_iMirror =0;
		}
		m_ParamDoorDlg.mDoor.OnChangeMirror();		
		m_ParamDoorDlg.mDoor.UpdateDoor();		
   	};

   	this.length = function(int){
   		if (this.mDoor.m_fLength==null)
			return;

		this.mDoor.m_fLength=parseInt(int)/10;
		this.mDoor.OnUpdate3D();
		this.mDoor.UpdateDoor();
		mHouseClass.mDoorClass.OnShowCtrl(this.mDoor);
   	};

   	this.height = function(int){
   		if (this.mDoor.m_fHeight==null)
			return;

		this.mDoor.m_fHeight=parseInt(int)/10;
		this.mDoor.OnUpdate3D();
		this.mDoor.UpdateDoor();
   	};

   	this.groundLevel = function(int){
   		if (this.mDoor.m_fHight==null)
			return;

		this.mDoor.m_fHight=parseInt(int)/10;
		this.mDoor.OnUpdate3D();
		this.mDoor.UpdateDoor();
   	};

	// 回复尺寸
   	this.Restore = function(){
   		if (this.mDoor.m_iStyle==0) {
	   		this.mDoor.m_fLength   = 98;
			this.mDoor.m_fWidth    = 22;//fWidth/10;
			this.mDoor.m_fHeight   = 230;
			this.mDoor.m_iMode     = 0;
			this.mDoor.m_iMirror   = 0;
   		}else if(this.mDoor.m_iStyle==2){
   			this.mDoor.m_fLength   = 150;
			this.mDoor.m_fWidth    = 22;//fWidth/10;
			this.mDoor.m_fHeight   = 230;
			this.mDoor.m_iMode     = 0;
			this.mDoor.m_iMirror   = 0;
   		}else if(this.mDoor.m_iStyle==3){
   			this.mDoor.m_fLength   = 200;
			this.mDoor.m_fWidth    = 22;//fWidth/10;
			this.mDoor.m_fHeight   = 230;
			this.mDoor.m_iMode     = 0;
			this.mDoor.m_iMirror   = 0;
   		}else if(this.mDoor.m_iStyle==4 || this.mDoor.m_iStyle==5){
   			this.mDoor.m_fLength   = 200;
			this.mDoor.m_fWidth    = 22;//fWidth/10;
			this.mDoor.m_fHeight   = 230;
			this.mDoor.m_iMode     = 0;
			this.mDoor.m_iMirror   = 0;
   		}
   		
   		
		app.attributeInterface.door.length.int=(this.mDoor.m_fLength)*10;
		app.attributeInterface.door.height.int=(this.mDoor.m_fHeight)*10;
		app.attributeInterface.door.groundLevel.int=parseInt(this.mDoor.m_fHight)*10;
		app.attributeInterface.door.radio=this.mDoor.m_iStyle;

   		this.mDoor.OnUpdate3D();
		this.mDoor.UpdateDoor();
   	};

   	this.Material = function(){
   		
   		var str = "win,jpg,"+this.mDoor.m_strFile.slice(0,this.mDoor.m_strFile.length-4)+".3ds";
		sessionStorage.setItem("ihouseshow3d",str);
		//window.open('../h5/Material/materialTexture.html');
		window.open('Material/materialTexture1.html');
	};
}

// 家具功能属性上一页分页按钮
$('#door .md-itemList button').eq(0).click(function(){
	// var Dlg_FurnitureAttribute=new Dlg_FurnitureAttribute();
	m_ParamDoorDlg.m_pageInt=m_ParamDoorDlg.m_pageInt-1;
	m_ParamDoorDlg.pageData();
})

// 家具功能属性下一页分页按钮 
$('#door .md-itemList button').eq(1).click(function(){
	m_ParamDoorDlg.m_pageInt=m_ParamDoorDlg.m_pageInt+1;
	m_ParamDoorDlg.pageData();
})

// 材质替换
$('#door .itemList-goodList').delegate('.icon-d-','click',function(){
	var strArray = this.id.split('-');
		if(strArray[1] == "1")
			sessionStorage.setItem("ihouseshow3d",m_ParamDoorDlg.sampleDoor_Arr_2[strArray[0]][1]);
		//window.open('../h5/Material/materialTexture.html');
	    window.open('Material/materialTexture1.html');
})

// 收藏
$('#door .itemList-goodList').delegate('.icon-xing','click',function(){
		let itemId=$(this).prev().attr('id'),strArr=itemId.split('-');
		
		if (m_CollectionGroup.length==0) {
			m_CollectionGroup.push(m_ParamDoorDlg.sampleDoor_Arr_2[strArr[0]]);
		}else{
			for(let i in m_CollectionGroup){
				if (m_CollectionGroup[i][0]==m_ParamDoorDlg.sampleDoor_Arr_2[strArr[0]][0]) {
					return;
				}
			}
			m_CollectionGroup.push(m_ParamDoorDlg.sampleDoor_Arr_2[strArr[0]]);
		}
})