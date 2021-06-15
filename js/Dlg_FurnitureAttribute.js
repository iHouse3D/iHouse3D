function Dlg_FurnitureAttribute()
{
	this.mFurniture = null;
	this.m_pageData_function=[];
	this.m_pageInt=0;
	this.ModeHideArray=[];
	this.mData_1='';
	this.mData_2='';
	this.mData_3='';

	
	this.Show = function(tObj)
	{
		// 显示属性窗口
		this.mFurniture = tObj;
		
		$('.attributeInterface').hide();
		$("#furniture").show();
		if(m_SystemVersion=='kz'){
			$('#furniture').css('left','60px');			
		}
		
		$("#furniture .goodsImg img").attr('src',m_strHttp+'jiaju/'+this.mFurniture.mData[1]);
		$("#furniture .goosNmaes p span").text(this.mFurniture.mData[13]);
		$("#furniture .goosNmaes p").eq(0).text(this.mFurniture.mData[0]);
		
		app.attributeInterface.furniture.locking = this.mFurniture.m_Locking;
		
		var index = 10;
		app.attributeInterface.furniture.length.int=parseInt(this.mFurniture.m_fLength);
				
		app.attributeInterface.furniture.length.max=parseInt(parseInt(this.mFurniture.mData[3])*index);
		app.attributeInterface.furniture.length.min=parseInt(parseInt(this.mFurniture.mData[3])/index);
		
		app.attributeInterface.furniture.width.int=parseInt(this.mFurniture.m_fWidth);
		app.attributeInterface.furniture.width.max=parseInt(parseInt(this.mFurniture.mData[4])*index);
		app.attributeInterface.furniture.width.min=parseInt(parseInt(this.mFurniture.mData[4])/index);
		
		app.attributeInterface.furniture.height.int=parseInt(this.mFurniture.m_fHeight);
		app.attributeInterface.furniture.height.max=parseInt(parseInt(this.mFurniture.mData[5])*index);
		app.attributeInterface.furniture.height.min=parseInt(parseInt(this.mFurniture.mData[5])/index);
		
		app.attributeInterface.furniture.checked=false;

		this.UpdateRepaceLib(this.mFurniture.mData[6],this.mFurniture.mData[7],this.mFurniture.mData[8]);
		
		if(this.mFurniture.m_fRotate<0)
		 this.mFurniture.m_fRotate = 360+this.mFurniture.m_fRotate;
		app.attributeInterface.furniture.angle.int=parseInt(this.mFurniture.m_fRotate);
		app.attributeInterface.furniture.groundLevel.int=parseInt(this.mFurniture.m_fHight);

		app.attributeInterface.furniture.Xaxis.int = this.mFurniture.m_fRotateX;
		app.attributeInterface.furniture.Yaxis.int = this.mFurniture.m_fRotateY;

		//舞台灯类型
		if(1 == this.mFurniture.m_fModeType)
		{
			app.attributeInterface.furniture.light_hotspot.int   = parseInt(this.mFurniture.m_fHotspot * 1000);
			app.attributeInterface.furniture.light_fallsize.int  = parseInt(this.mFurniture.m_fFallsize * 1000);
			app.attributeInterface.furniture.light_intensity.int = parseInt(this.mFurniture.m_fIntensity/1000);

			let color = `rgb(${this.mFurniture.m_fLightR*255},${this.mFurniture.m_fLightG*255},${this.mFurniture.m_fLightB*255})`;
			app.attributeInterface.furniture.stageLightColor    = this.colorRGBtoHex(color);

			app.attributeInterface.furniture.stageLight_checked = true;
			app.attributeInterface.furniture.light_projector_map = this.mFurniture.m_projector_map;
		}
		else {
			app.attributeInterface.furniture.light_hotspot.int   = 350;
			app.attributeInterface.furniture.light_fallsize.int  = 385;
			app.attributeInterface.furniture.light_intensity.int = 500;

			let color = `rgb(255,255,255)`;
			app.attributeInterface.furniture.stageLightColor = this.colorRGBtoHex(color);
			app.attributeInterface.furniture.stageLight_checked = false;
			app.attributeInterface.furniture.light_projector_map = '';
		}

		this.SetProjectorMap();

		//界面灯光按钮状态更新
		this.OnUseStageLight();
		
	    if( this.mFurniture.m_iFloor == -10)
	   		app.Obj_floorValue ='全部';
	   		
	    if( this.mFurniture.m_iFloor == 1)
	   		app.Obj_floorValue ='一层';
	   		
	    if( this.mFurniture.m_iFloor == 2)
	   		app.Obj_floorValue ='二层';	   		
		
	    if( this.mFurniture.m_iFloor == 3)
	   		app.floorValue ='三层';			
	};
	
	this.OnReset = function()
	{
		m_ParamObjDlg.length(parseInt(this.mFurniture.mData[3]));
		m_ParamObjDlg.width(parseInt(this.mFurniture.mData[4]));
		m_ParamObjDlg.height(parseInt(this.mFurniture.mData[5]));
		
		app.attributeInterface.furniture.length.int=parseInt(this.mFurniture.m_fLength);
		app.attributeInterface.furniture.width.int=parseInt(this.mFurniture.m_fWidth);
		app.attributeInterface.furniture.height.int=parseInt(this.mFurniture.m_fHeight);
		
		mHouseClass.mFurnitureClass.ShowObjCtrl();		
	};

	//设置舞台灯投影贴图
	this.SetProjectorMap = function()
	{
		$('.body-item-list-img>li').removeClass('body-item-img').children("i").remove();
		let projectorMap = app.attributeInterface.furniture.light_projector_map;
		if("" != projectorMap)
		{
			let index = parseInt(projectorMap);
			$('.body-item-list-img>li').eq(index).addClass('body-item-img').append('<i class="el-icon-check"></i>');
			console.log(index);
		}
	};

	this.colorRGBtoHex = function(color) {
		var rgb = color.split(',');
		var r = parseInt(rgb[0].split('(')[1]);
		var g = parseInt(rgb[1]);
		var b = parseInt(rgb[2].split(')')[0]);
		var hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
		return hex;
	};

	this.colorHextoRGB = function(str){
		var sColor = str.toLowerCase();
		if(sColor && reg.test(sColor)){
		if(sColor.length === 4){
	var sColorNew = "#";
	for(var i=1; i<4; i+=1){
	sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));
	}
	sColor = sColorNew;
	}
	//处理六位的颜色值
	var sColorChange = [];
	for(var i=1; i<7; i+=2){
	sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));
	}
	return "RGB(" + sColorChange.join(",") + ")";
	}else{
	return sColor;
	}
	}

	// 功能区数据筛选

    this.UpdateRepaceLib=function(int_1,int_2,int_3){
    	this.m_pageData_function.length=0;
    	var a1="";
    	if (m_version=='index_3') {
    		a1=(qyk_mx.m_strObjData).concat(grk_mx.m_strObjData);
    	}else{
	    	a1 = m_strObjData.responseText.split("\r\n");
    	}
       	var iIndex = 0;
       	for(var i=1; i<a1.length; i++) {
       		var s2 =a1[i];
			var a2 =s2.split(',');
			var dataArray = new Array();
			var tempNodeLi;

			if(a2[1]!= undefined && a2[1] != null &&a2[2]!=null && a2[4]!=null && a2[6]==int_1 && a2[7]==int_2 && a2[8]==int_3){
				var k   = a2[2].lastIndexOf(".");
				var str = a2[2].slice(k+1);
				if( str == "a3d")
					 continue;
				if(m_version!='index_3'){
					tempNodeLi ='<li class="meshPic"><i class="icon iconfont icon-xinxi"></i><i class="icon iconfont icon-d-" id="'+iIndex+'-1"></i><i class="icon iconfont icon-xing"></i><img id="'+iIndex+'" src="'+m_strHttp + 'jiaju/'+ a2[1]+'" alt="image"  onclick="m_ParamObjDlg.OnFurnAttrClick(this);" ></li>';
				}else{
					tempNodeLi ='<li class="meshPic"><i class="icon iconfont icon-xinxi"></i><i class="icon iconfont icon-xing"></i><img id="'+iIndex+'" src="'+m_strHttp + 'jiaju/'+ a2[1]+'" alt="image"  onclick="m_ParamObjDlg.OnFurnAttrClick(this);" ></li>';
				}
				dataArray.push(tempNodeLi); //html数据
				dataArray.push(a2);			//分割数据
				iIndex++;
				this.m_pageData_function.push(dataArray);
			}

       	}
       	// console.log(this.m_pageData_function);
       	if (this.mData_1!=int_1 && this.mData_2!=int_2 && this.mData_3!=int_3) {
	       	this.m_pageInt=0;
	       	this.mData_1=int_1;
	       	this.mData_2=int_2;
	       	this.mData_3=int_3;
       	}
       	
       	this.pageData();
    };
    this.pageData = function(){
    	var cont_page=parseInt(this.m_pageData_function.length/21);
    	
    	if (this.m_pageInt>=0 && this.m_pageInt<=cont_page) {
	    	$('#furniture .itemList-goodList').html('');
	    	for (var i = this.m_pageInt*21; i < (this.m_pageInt*21)+21; i++) {
	    		// 
	    		if(this.m_pageData_function[i]==undefined){
	    			return;
	    		}
	    		$('#furniture .itemList-goodList').append(this.m_pageData_function[i][0]);
	    	}
    	}else if(this.m_pageInt<0){
    		this.m_pageInt=0;
    	}else if(this.m_pageInt>cont_page){
    		this.m_pageInt=cont_page;
    	}
   	};
   	this.OnFurnAttrClick = function(_this){
   		var pageData_function=this.m_pageData_function;
   		mHouseClass.mFurnitureClass.CreateObj(pageData_function[_this.id][1]);
   	};
   	// 显示家具熟悉bar
	this.ShowBar = function(tObj)
	{
		this.mFurniture = tObj;
		
		$("#mFurnitureBar").show();
		
		var div1=document.getElementById("mFurnitureBar");
		div1.style.left= mouseScreen.x+10+'px';
		div1.style.top= mouseScreen.y-130+'px';
	};
	
	this.HideBar = function()
	{
		$("#mFurnitureBar").hide();
		$('.attributeInterface').hide();
	//	mHouseClass.mFurnitureClass.OnMouseRightUp2D();
	};
	
	this.HideParamDlg = function()
	{
		this.mFurniture = null;
		$("#furniture").hide();
	};
	
	this.Delete = function()
	{
		if( this.mFurniture )
			mHouseClass.mFurnitureClass.Delete(this.mFurniture);
		HideDlg();
	};
	
	this.Copy = function(iDirection)
	{
		this.mFurniture = mHouseClass.mFurnitureClass.Clone(this.mFurniture,iDirection);
	};

	this.Hide =function()
	{
		if( this.mFurniture )
		{
			mHouseClass.mFurnitureClass.HideObjCtrl();
			mHouseClass.mFurnitureClass.OnHideCtrl();
			this.mFurniture.OnShow(false);
			this.ModeHideArray.unshift(this.mFurniture);
			HideDlg();
			m_ModelHideDlg();
		}
	};
	
	
	//被隐藏界面 全部显示按钮 
	this.AllShow = function(){
		this.ModeHideArray=[];
		for (var i = 0; i < mHouseClass.mFurnitureClass.mFurnitureArray.length; i++) {
			mHouseClass.mFurnitureClass.mFurnitureArray[i].OnShow(true);
		}
		m_ModelHideDlg();
	};

	this.length = function(value){
		// console.log(this.mFurniture.m_fLength);
		if (this.mFurniture.m_fLength==null)
			return;

		this.mFurniture.m_fLength=parseInt(value);
		
		this.mFurniture.OnUpdate3D();
	};

	this.width = function(value){
		if (this.mFurniture.m_fWidth==null)
			return;

		this.mFurniture.m_fWidth=parseInt(value);
		this.mFurniture.OnUpdate3D();
	}
	this.height = function(value){
		if (this.mFurniture.m_fHeight==null)
			return;

		this.mFurniture.m_fHeight=parseInt(value);
		this.mFurniture.OnUpdate3D();
	};

	this.angle = function(value){
		if (this.mFurniture.m_fRotate==null)
			return;

		this.mFurniture.m_fRotate=value;
		this.mFurniture.OnUpdate3D();
	};

	this.angleX = function(value){
		if (this.mFurniture.m_fRotateX==null)
			return;

		this.mFurniture.m_fRotateX=value;
		this.mFurniture.OnUpdate3D();
	};

	this.angleY = function(value){
		if (this.mFurniture.m_fRotateY==null)
			return;

		this.mFurniture.m_fRotateY=value;
		this.mFurniture.OnUpdate3D();
	};

	this.groundLevel = function(value){
		if (this.mFurniture.m_fHight==null)
			return;

		this.mFurniture.m_fHight=parseInt(value);
		this.mFurniture.OnUpdate3D();
	};
	
	this.OnUpdate3DModel = function(infoXML){
		this.mFurniture.m_infoXML = infoXML;
		this.mFurniture.OnUpdateTex3D();
	};

	this.OnUseStageLight = function(){
		this.mFurniture.m_fModeType = app.attributeInterface.furniture.stageLight_checked ? 1 : 0;
		app.attributeInterface.furniture.light_hotspot.disabled = !app.attributeInterface.furniture.stageLight_checked;
		app.attributeInterface.furniture.light_fallsize.disabled = !app.attributeInterface.furniture.stageLight_checked;
		app.attributeInterface.furniture.light_intensity.disabled = !app.attributeInterface.furniture.stageLight_checked;
		app.attributeInterface.furniture.Xaxis.disabled = !app.attributeInterface.furniture.stageLight_checked;
		app.attributeInterface.furniture.Yaxis.disabled = !app.attributeInterface.furniture.stageLight_checked;

		if(1 == this.mFurniture.m_fModeType)
		{
			$(".body-list-item").enable();
		}
		else
		{
			$(".body-list-item").disable();
		}
	};
		
	this.OnChangeLocking = function()
	{
		this.mFurniture.m_Locking = app.attributeInterface.furniture.locking;
	};
	
	this.OnChangeScale = function(value)
	{
		let m_Length=Math.ceil(value*this.mFurniture.m_fLength2);
		let m_Width	=Math.ceil(value*this.mFurniture.m_fWidth2);
		let m_Height=Math.ceil(value*this.mFurniture.m_fHeight2);


/*		app.attributeInterface.furniture.width.int=m_Width;
		app.attributeInterface.furniture.length.int=m_Length;
		app.attributeInterface.furniture.height.int=m_Height;


		this.mFurniture.m_fLength=m_Width;
		this.mFurniture.m_fWidth=m_Length
		this.mFurniture.m_fHeight=m_Height;
		this.mFurniture.OnUpdate3D();*/
		m_ParamObjDlg.length(m_Length);
		m_ParamObjDlg.width(m_Width);
		m_ParamObjDlg.height(m_Height);
		mHouseClass.mFurnitureClass.ShowObjCtrl();
	};
		
		// 选择楼层
	this.OnChangeFloor = function()
	{
		if( this.mFurniture == null )
			return;
		this.mFurniture.m_iFloor = parseInt(app.Obj_floorValue);
	};

	this.light_hotspot = function(int){
		if(this.mFurniture) {
			this.mFurniture.m_fHotspot = int/1000;
		}
	};

	this.light_fallsize = function(int){
		if(this.mFurniture) {
			this.mFurniture.m_fFallsize = int/1000;
		}
	};

	this.light_intensity = function(int){
		if(this.mFurniture) {
			this.mFurniture.m_fIntensity = int * 1000;
		}
	};

	this.OnChangeLightColor = function() {
		if (this.mFurniture) {

			var strRGBData = app.attributeInterface.furniture.stageLightColor;
			var regex = "\\((.+?)\\)";
			var strRGB = strRGBData.match(regex)[1];
			if (strRGB) {
				var strArray = strRGB.split(",");
				this.mFurniture.m_fLightR = parseInt(strArray[0]) / 255.0;
				this.mFurniture.m_fLightG = parseInt(strArray[1]) / 255.0;
				this.mFurniture.m_fLightB = parseInt(strArray[2]) / 255.0
			}
		}
	};

}



// 家具功能属性分页按钮
$('#furniture .md-itemList button').eq(0).click(function(){
	// var Dlg_FurnitureAttribute=new Dlg_FurnitureAttribute();
	m_ParamObjDlg.m_pageInt=m_ParamObjDlg.m_pageInt-1;
	m_ParamObjDlg.pageData();
	// console.log();
})

// 家具功能属性分页按钮 
$('#furniture .md-itemList button').eq(1).click(function(){
	m_ParamObjDlg.m_pageInt=m_ParamObjDlg.m_pageInt+1;
	m_ParamObjDlg.pageData();
	
})

// 材质替换
$('#furniture .itemList-goodList').delegate('.icon-d-','click',function(){
	var strArray = this.id.split('-');
	if( strArray[1] == "1")
		sessionStorage.setItem("ihouseshow3d",m_ParamObjDlg.m_pageData_function[strArray[0]][1]);

	//window.open('../h5/Material/materialTexture.html');
	window.open('Material/materialTexture1.html');
})

// 收藏

$('#furniture .itemList-goodList').delegate('.icon-xing','click',function(){
		let itemId=$(this).prev().attr('id'),strArr=itemId.split('-');
		
		
		if (m_CollectionGroup.length==0) {
			m_CollectionGroup.push(m_ParamObjDlg.m_pageData_function[strArr[0]]);
		}else{
			for(let i in m_CollectionGroup){
				if (m_CollectionGroup[i][0]==m_ParamObjDlg.m_pageData_function[strArr[0]][0]) {
					return;
				}
			}
			m_CollectionGroup.push(m_ParamObjDlg.m_pageData_function[strArr[0]]);
		}
	})

//被隐藏界面 单个显示按钮

$('#mModelHideDlg .mpLists_ModelHide').delegate('p','click',function(){
	let itemId=$(this).prev().attr('strint'),strArr=itemId.split('-');

	m_ParamObjDlg.ModeHideArray=[];
	for (var i = 0; i < mHouseClass.mFurnitureClass.mFurnitureArray.length; i++) {
		if (Mods_Arr[strArr[0]][2]==mHouseClass.mFurnitureClass.mFurnitureArray[i]) {
			mHouseClass.mFurnitureClass.mFurnitureArray[i].m_Object3D.visible=true;
			mHouseClass.mFurnitureClass.mFurnitureArray[i].m_RenderData2D.visible = true;
		}

		if (mHouseClass.mFurnitureClass.mFurnitureArray[i].m_Object3D.visible==false) {
			m_ParamObjDlg.ModeHideArray.push(mHouseClass.mFurnitureClass.mFurnitureArray[i]);
		}
	}

	m_ModelHideDlg();
})
