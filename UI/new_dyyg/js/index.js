var moveBlockFlat="1",Mods_Arr=[];

var mViewerMode = 0; //0:平面  1：3d

function outerHeight(obj_1,obj_2,obj_3,int){
	if (int==undefined) {
		// console.log(obj_2,$(obj_2).outerHeight(true),$(obj_3).outerHeight(true));
		$(obj_1).height($(obj_2).outerHeight(true)-$(obj_3).outerHeight(true));
	}else{
		$(obj_1).height($(obj_2).outerHeight(true)-$(obj_3).outerHeight(true)+int);
	}
}
function outerWidth(obj_1,obj_2,obj_3,int){
	if (int==undefined) {
		$(obj_1).width($(obj_2).outerWidth(true)-$(obj_3).outerWidth(true));
	}else{
		$(obj_1).width($(obj_2).outerWidth(true)-$(obj_3).outerWidth(true)+int);
	}
}

$(function(){

	localStorage.setItem('WebService',m_strWebService);
outerHeight(".cont-main",window,".cont-header");
// outerHeight(".main-body",".cont-main",".main-header-title");
outerHeight(".template-listInfo",".main-body",".template-search",-60);
outerHeight(".template-listInfo-typ",".main-body",".template-search",10);
outerWidth(".modelBase-right",".main-body",".modelBase-left_block");
outerHeight(".attrBody",".attributeInterface",".attrTitle");
outerHeight(".roomText-block",".attrBody",".customize-text",-56);
moveBlock();
$(window).resize(function(){
	moveBlock();
	outerHeight(".cont-main",window,".cont-header");
	// outerHeight(".main-body",".cont-main",".main-header-title");
	outerHeight(".template-listInfo",".main-body",".template-search",-60);
	outerHeight(".template-listInfo-typ",".main-body",".template-search",15);
	outerWidth(".modelBase-right",".main-body",".modelBase-left_block");
	outerHeight(".attrBody",".attributeInterface",".attrTitle");
	outerHeight(".roomText-block",".attrBody",".customize-text",-56);
})

$('.modelBase-right').hide();
$('.modelBase-right').eq(0).show();

// 类型界面选项卡
$('.main-header-title>span').click(function(){
	$(this).siblings().removeClass("button-line");
	$(this).addClass("button-line");

	$(".main-body>div").hide();

	if(i18n.locale == "en")
	{
		if ($(this).text()=='Create') {
			$(".create-cont").show();
		}else if($(this).text()=='AI Room'){
			$(".templateRoom").show();
		}else if($(this).text()=='Model Library'){
			$(".modelBase").show();
		}
	}
	else if(i18n.locale == "vi")
	{
		if ($(this).text()=='Tạo') {
			$(".create-cont").show();
		}else if($(this).text()=='Phòng mẫu'){
			$(".templateRoom").show();
		}else if($(this).text()=='Thư viện mẫu'){
			$(".modelBase").show();
		}
	}
	else if(i18n.locale == "zh")
	{
		if ($(this).text()=='创建') {
			$(".create-cont").show();
		}else if($(this).text()=='样板间'){
			$(".templateRoom").show();
		}else if($(this).text()=='模型库'){
			$(".modelBase").show();
		}
	}
})

// 类型界面选项卡

//门窗功能

$(".itemList-title").click(function(){
	if ($(this).next().height()!=0) {
		$(this).attr("mdHight",$(this).next().height());
		$(this).next().height($(this).next().height());
		$(this).next().height(0);
		$(this).children('span').css("transform","rotate(180deg)");
	}else{
		$(this).next().height($(this).attr("mdHight"));
		$(this).children('span').css("transform","rotate(0deg)");
	}

})

//门窗功能


// 分类选项

// $(".type-cont li").click(function(){
// 	if ($(this).parents('.type-cont').attr("multiSelect")=='true') {
// 		$(this).toggleClass('el-icon-remove-outline');
		
// 	}else{
// 		$(this).siblings().removeClass('type-link-1');
// 		$(this).addClass('type-link-1');
// 	}
// })

// 分类选项

// 模型库类型模块点击事件

	$('.modelBase-left>li').click(function(){
		$(this).siblings().removeClass('modelBase_link');
		$('.modelBase-my-item>li').removeClass('modelBase_link');
		$('.modelBase-Exhibition-item>li').removeClass('modelBase_link');
		$('.modelBase-Ceiling-item>li').removeClass('modelBase_link');
		$(this).addClass('modelBase_link');


		$(".modelBase_link_model").hide();
		$('.modelBase-right').hide();
		$('.modelBase_Mat_model').hide();
		
		console.log(11);
		app.modelBase.searchInput='';

		if(this.id =="101" )
		{
			let obj=$(this);
			$("#mMaterialDlg").show();
			setMatHtml(obj);
			Mods_Arr=m_MatGroup;
			MatType=2;//判断是否为硬装
			return;
		}
		else if(this.id =="102")
		{
			$("#mCupboardDlg").show();

			Mods_Arr=m_ObjGroup_Cupboard;
		}
		else if(this.id =="103")
		{
			$("#mLightingDlg").show();	
			Mods_Arr=m_ObjGroup_Lighting;
		}		
		else if(this.id =="104")
		{
			$("#mFurnitureDlg").show();	
			Mods_Arr=m_ObjGroup;
		}
		else if(this.id =="105")
		{
			$("#mApplianceDlg").show();	
			Mods_Arr=m_ApplianceGroup;
		}
		else if(this.id =="106")
		{
			$("#mDecorationDlg").show();	
			Mods_Arr=m_DecorationGroup;
		}else if(this.id =="107"){
			$("#mToolingDlg").show();
			Mods_Arr=m_ToolingGroup;
		}else if(this.id =="108"){
			$('#mModelHideDlg').show();
			// m_ModelHideDlg();
			Mods_Arr=m_ModelHideGroup;
		}else if(this.id =="99") {		// 我的
			// if ($(this).children('span').text()==i18n.t("Language.My")) {
			// 	// console.log(itemHeight);
			// }
			if ($(this).children('ul').height()!=0) {
				let itemHeight=$(this).children('ul').height();
				$(this).children('ul').attr("autoHeight",itemHeight);
				$(this).children('ul').height($(this).children('ul').height());
				$(this).children('ul').height(0);
				$(this).children('i').css("transform","rotate(0deg)");
			}else{
				$(this).children('ul').height($(this).children('ul').attr("autoHeight"));
				$(this).children('i').css("transform","rotate(180deg)");
			}
			$('#mCollectionDlg').show();
			Mods_Arr=m_CollectionGroup;
			m_pageData_Collection();
		}else if(this.id == "98")
		{
			if ($(this).children('ul').height()!=0) {
				let itemHeight=$(this).children('ul').height();
				$(this).children('ul').attr("autoHeight",itemHeight);
				$(this).children('ul').height($(this).children('ul').height());
				$(this).children('ul').height(0);
				$(this).children('i').css("transform","rotate(0deg)");
			}else{
				$(this).children('ul').height($(this).children('ul').attr("autoHeight"));
				$(this).children('i').css("transform","rotate(180deg)");
			}			
			$('#mDataTab1').show();
			Mods_Arr=m_DataTabGroup1;
			m_pageData_Collection();			
		}else if(this.id == "111")
		{
			if ($(this).children('ul').height()!=0) {
				let itemHeight=$(this).children('ul').height();
				$(this).children('ul').attr("autoHeight",itemHeight);
				$(this).children('ul').height($(this).children('ul').height());
				$(this).children('ul').height(0);
				$(this).children('i').css("transform","rotate(0deg)");
			}else{
				$(this).children('ul').height($(this).children('ul').attr("autoHeight"));
				$(this).children('i').css("transform","rotate(180deg)");
			}			
			$('#mDataTab7').show();
			Mods_Arr=m_DataTabGroup7;
			m_pageData_Collection();			
		}
		
		else if(this.id == "100"){
			$('#mModelBrand').show();
			GetUserBrands();
		}else if(this.id == "110"){
			$('#mCabinetDlg').show();
			Mods_Arr=m_CabinetGroup;
		}else if(this.id =="111"){
			$("#mExhibitionDlg").show();
			Mods_Arr=m_ExhibitionGroup;
		}else if(this.id =="112"){
			$("#CeilingDesign").show();
			// Mods_Arr=m_ExhibitionGroup;
		}else if(this.id =="113"){
			$("#mcombinationDlg").show();
			Mods_Arr=m_combinationGroup;
		}
		//苏州小丑鱼
		else if(this.id == "300") //场景
		{
			$("#mSceneDlg").show();
			Mods_Arr=m_ObjGroup_Scene;
		}
		else if(this.id == "301") //基础
		{
			$("#mBaseDlg").show();
			Mods_Arr=m_ObjGroup_Base;
		}
		else if(this.id == "302") //舞美
		{
			$("#mWuMeiDlg").show();
			Mods_Arr=m_ObjGroup_WuMei;
		}
		else if(this.id == "303") //美陈
		{
			$("#mMeiChenDlg").show();
			Mods_Arr=m_ObjGroup_MeiChen;
		}
		else if(this.id == "304") //人物
		{
			$("#mPersonDlg").show();
			Mods_Arr=m_ObjGroup_Person;
		}
		else if(this.id == "305") //人物
		{
			$("#mOtherDlg").show();
			Mods_Arr=m_ObjGroup_Other;
		}		
		//-------end 苏州小丑鱼
		
			MatType=1;//判断是否为硬装

		// 显示分类窗口
		// if ($(this).attr("showModel")=='1') {
//			let obj=$(this),name=$(this).text();
//			setHtmlName(obj,name);
		// }
	})

// 模型库类型模块点击事件

$('.modelBase-left>li').hover(function(){
	if(app.GlobalSettings.checked_5 == true)
		return;
		
	if(this.id =="101" )
	{
		let obj=$(this);
		$("#mMaterialDlg").show();
		$('.modelBase_link_model').hide();
		Mods_Arr=m_MatGroup;
		setMatHtml(obj);
		app.modelBase.searchInput='';
	}else{
		let obj=$(this),name=$(this).text();
		$('.modelBase_Mat_model ').hide();
		setHtmlName(obj,name);
	}
	
})


$('.modelBase-left>li').click(function(){
	if(app.GlobalSettings.checked_5 == false)
		return;
		
	if(this.id =="101" )
	{
		let obj=$(this);
		$("#mMaterialDlg").show();
		setMatHtml(obj);
		$('.modelBase_link_model').hide();
	}else{
		$('.modelBase_Mat_model ').hide();
		let obj=$(this),name=$(this).text();
		setHtmlName(obj,name);
	}
	
})

//禁用
$.fn.disable = function () {
	$(this).addClass("disable");
};

//启用
$.fn.enable = function () {
	$(this).removeClass("disable");
};

//舞台灯样式
$(".body-item-list-img").delegate('li','click',function(){
	m_ParamObjDlg.mFurniture.m_projector_map = $(this).find("img").attr("data-value");

	$(this).siblings().removeClass('body-item-img').children("i").remove();
	$(this).addClass('body-item-img').append('<i class="el-icon-check"></i>');
});


// 下拉菜单功能

function m_pageData_Collection(){
	if( m_CollectionGroup.length > 0) 
	{
		totalCount_Collection = m_CollectionGroup.length;
		totalPage_Collection = (totalCount_Collection + pageCount -1)/pageCount;
		setPager_Collection(0);  
		$("#CollectionageNum").text(1);
		$("#CollectionPageAccount").text(parseInt(totalPage_Collection));
		$("#CollectionPicNumber").text(totalCount_Collection);
	}
	else
	{
		totalCount_Collection 	= 0;
		totalPage_Collection 	= 0;
		curPage_Collection 	= 0;
		$("#CollectionageNum").text(0);
		$("#CollectionPageAccount").text(parseInt(totalPage_Collection));
		$("#CollectionPicNumber").text(totalCount_Collection);
		$('.mpLists_Collection').html("");
	}	
}

$('.modelBase-my-item>li').click(function(e){

	$('.modelBase-left>li').removeClass('modelBase_link');
	$('.modelBase-left>li').eq(0).addClass('modelBase_link');
	$(this).siblings().removeClass('modelBase_link');
	$(this).addClass("modelBase_link");

	$(".modelBase-right").hide();
	if (this.id=='0') {
		$('#mCollectionDlg').show();
		Mods_Arr=m_CollectionGroup;
		m_pageData_Collection();
		// console.log(m_CollectionGroup)
	}else if(this.id='1'){
		$('#mModelHideDlg').show();
			// m_ModelHideDlg();
			Mods_Arr=m_ModelHideGroup;
	}else if(this.id='2'){

	}
	e.stopPropagation();
})


// 点击消息
$('.modelBase-Exhibition-item>li').click(function(e){

	$('.modelBase-left>li').removeClass('modelBase_link');
	$('.modelBase-left>li').eq(0).addClass('modelBase_link');
	$(this).siblings().removeClass('modelBase_link');
	$(this).addClass("modelBase_link");

	$(".modelBase-right").hide();
	if (this.id=='113') {
		$('#mDataTab1').show();
		Mods_Arr=m_DataTabGroup1;
	//	m_pageData_Collection();
	}else if(this.id=='114'){
		$('#mDataTab2').show();
		Mods_Arr=m_DataTabGroup2;		
	}else if(this.id=='115'){
		$('#mDataTab3').show();
		Mods_Arr=m_DataTabGroup3;
	}else if(this.id=='116'){
		$('#mDataTab4').show();
		Mods_Arr=m_DataTabGroup4;
	}else if(this.id=='117'){
		$('#mDataTab5').show();
		Mods_Arr=m_DataTabGroup5;
	}else if(this.id=='118'){
		$('#mDataTab6').show();
		Mods_Arr=m_DataTabGroup6;
	}
	e.stopPropagation();
})

$('.modelBase-Ceiling-item>li').click(function(e){

	$('.modelBase-left>li').removeClass('modelBase_link');
	$('.modelBase-left>li').eq(0).addClass('modelBase_link');
	$(this).siblings().removeClass('modelBase_link');
	$(this).addClass("modelBase_link");

	$(".modelBase-right").hide();
	if (this.id=='200') {
		$('#mDataTab7').show();
		Mods_Arr=m_DataTabGroup7;
	}else if(this.id=='201'){
		$('#mDataTab8').show();
		Mods_Arr=m_DataTabGroup8;		
	}else if(this.id=='202'){
		$('#mDataTab9').show();
		Mods_Arr=m_DataTabGroup9;
	}
	e.stopPropagation();
})
// 下拉菜单功能

// hover 活动块
var setTimeOutInt,modelBaseListItem=null,modelBaseListInt=0;
$(".modelBase-left>li").hover(function(){


	clearTimeout(setTimeOutInt);
	// $(".modelBase_link_model").removeAttr("style");


	var block_top=$(this).offset().top+13,block_left=$(this).offset().left+4;
	$(".left-block-adsloute").show();
	$(".left-block-adsloute").offset({left:block_left,top:block_top});

		modelBaseListItem=this;
},function(){
	$(".left-block-adsloute").hide();

	if ($(this).attr("showModel")=='1') {
		setTimeOutInt=setTimeout(function(){	
			$(".modelBase_link_model").removeAttr("style");

		}, 100);
	}
})

// $(".modelBase_link_model").hover(function(){
// 	clearTimeout(setTimeOutInt);
// },function(){
// 	setTimeOutInt=setTimeout(function(){	
// 		$(".modelBase_link_model").removeAttr("style");
// 	}, 100);
// })

// 分类点击

$('.modelBase_link_model').delegate('li','click',function(){
	let index=$(this).attr("index");

	$(this).parent().parent().siblings().children().children().removeClass('modelBase_type_links');
	$(this).siblings().removeClass('modelBase_type_links');
	$(this).addClass('modelBase_type_links');

	$('.modelBase_link_model').hide();
	$('.modelBase-right').hide();
	index=index.split('-');
	let strCategoryType = i18n.t(`Language.${categoryType[index[0]]}`);
	
	$('.modelBase-left>li').removeClass("modelBase_link");
	
	if (strCategoryType == i18n.t("Language.家具")) {
		$('#mFurnitureDlg').show();
		$('.modelBase-left>li').eq(6).addClass("modelBase_link");
		initFurniture(index[0],index[1],index[2]);		// 家具
	}else if(strCategoryType==i18n.t("Language.照明")){
		$('#mLightingDlg').show();
		$('.modelBase-left>li').eq(5).addClass("modelBase_link");
		initLighting(index[0],index[1],index[2]);		// 照明
	}else if(strCategoryType==i18n.t("Language.厨卫")){
		$('#mCupboardDlg').show();
		$('.modelBase-left>li').eq(4).addClass("modelBase_link");
		initCupboard(index[0],index[1],index[2]);		// 厨卫
	}else if(strCategoryType==i18n.t("Language.硬装")){
		$('#mMaterialDlg').show();
		$('.modelBase-left>li').eq(3).addClass("modelBase_link");
		initMat(index[0],index[1],index[2]);			// 硬装
	}else if(strCategoryType==i18n.t("Language.家电")){
		$('#mApplianceDlg').show();
		$('.modelBase-left>li').eq(7).addClass("modelBase_link");
		intAppliance(index[0],index[1],index[2]);		// 家电
	}else if(strCategoryType==i18n.t("Language.家饰")){
		$('#mDecorationDlg').show();
		$('.modelBase-left>li').eq(8).addClass("modelBase_link");
		intDecoration(index[0],index[1],index[2]);		// 家饰
	}else if(strCategoryType==i18n.t("Language.工装")){
		$('#mToolingDlg').show();
		$('.modelBase-left>li').eq(9).addClass("modelBase_link");
		intTooling(index[0],index[1],index[2]);			// 工装
	}else if(strCategoryType==i18n.t("Language.实验台柜")){
		$('#mCabinetDlg').show();
		$('.modelBase-left>li').eq(10).addClass("modelBase_link");
		intCabinet(index[0],index[1],index[2]);			// 实验台柜
	}else if(strCategoryType==i18n.t("Language.会展")){
		intExhibition(index[0],index[1],index[2]);			// 会展
	}
	else if(strCategoryType=="场景"){
		$('#mSceneDlg').show();
		initScene(index[0],index[1],index[2]);			// 场景
	}
	else if(strCategoryType=="基础"){
		$('#mBaseDlg').show();
		$('.modelBase-left>li').eq(10).addClass("modelBase_link");
		initBase(index[0],index[1],index[2]);			// 基础
	}
	else if(strCategoryType=="舞美"){
		$('#mWuMeiDlg').show();
		$('.modelBase-left>li').eq(11).addClass("modelBase_link");
		initWuMei(index[0],index[1],index[2]);			// 舞美
	}
	else if(strCategoryType=="美陈"){
		$('#mMeiChenDlg').show();
		$('.modelBase-left>li').eq(12).addClass("modelBase_link");
		initMeiChen(index[0],index[1],index[2]);			// 美陈
	}
	else if(strCategoryType=="人物"){
		$('#mPersonDlg').show();
		$('.modelBase-left>li').eq(13).addClass("modelBase_link");
		initPerson(index[0],index[1],index[2]);			// 人物
	}
	else if(strCategoryType=="其他"){
		$('#mOtherDlg').show();
		$('.modelBase-left>li').eq(13).addClass("modelBase_link");
		initOther(index[0],index[1],index[2]);			// 人物
	}	

})

$(".modelBase_Mat_model .modelBase_Mat_scrollbar").delegate("li",'click',function(){
	let index=$(this).attr("index");

	$(this).parent().parent().siblings().children().children().removeClass('modelBase_type_links');
	$(this).siblings().removeClass('modelBase_type_links');
	$(this).addClass('modelBase_type_links');
	$(".modelBase_Mat_model").hide();
	
	$('.modelBase-right').hide();
	$('.modelBase-left>li').removeClass("modelBase_link");
	$('#mMaterialDlg').show();
	$('.modelBase-left>li').eq(3).addClass("modelBase_link");
	
	index=index.split('-');
	initMat(index[0],index[1]);
})


// 系统设计
var viewsSwitching_li;


$(".systemDesign").hover(function(){
	clearTimeout(setTimeOutInt);
},function(){
	setTimeOutInt=setTimeout(function(){
		viewsSwitching_li.css("transform","rotate(0deg)");
		$(".systemDesign").height(0);
		$(".systemDesign").hide();
	},100);
})
// 系统设计
// 切换视图

	// 3D单独显示 通过ID号

	$('.modelBase-right ul').delegate('.icon-d-','click',function(){
		
		var strArray = this.id.split('-');
			if(strArray[1] == "1")
			{
				sessionStorage.setItem("ihouseshow3d",Mods_Arr[strArray[0]][1]);
				sessionStorage.setItem("ihouse_model_xml","");
				sessionStorage.setItem("ihouse_model_type",0); // 0 不返回修改  1返回修改
				m_ParamObjDlg.Open3DModel();
		   }
		  //  window.open('Material/materialTexture.html');		    
	})

	$('.modelBase-right ul').delegate('.icon-xing','click',function(){
		let itemId=$(this).prev().attr('id'),strArr=itemId.split('-');
		if (m_CollectionGroup==Mods_Arr) {
			// Mods_Arr.splice(strArr[0],1);
			for(let i in m_CollectionGroup){
				if ($(this).parent().html()==$(m_CollectionGroup[i][0]).html()) {
					Mods_Arr.splice(i,1);
					m_CollectionGroup=Mods_Arr;
					m_pageData_Collection();
					return;
				}
			}
		}else{
			if (m_CollectionGroup.length==0) {
				m_CollectionGroup.push(Mods_Arr[strArr[0]]);
			}else{
				for(let i in m_CollectionGroup){
					if (m_CollectionGroup[i][0]==Mods_Arr[strArr[0]][0]) {
						alert("已经收藏！");
						return;
					}
				}
				m_CollectionGroup.push(Mods_Arr[strArr[0]]);
			}
		}
		
	})
	$('.modelBase-right ul').delegate('.icon-xinxi','click',function(){
		let itemId=$(this).next().attr('id');
		if (itemId==undefined) {
			itemId=$(this).next().attr('strint');
		}
		// console.log(itemId);
		let strArr=itemId.split('-');

		clearTimeout(setTimeOutInt);
		$(".modelBaseInformation").show();
		setTimeOutInt = setTimeout(function(){$(".modelBaseInformation").hide();},2000);

		if (($('.modelBaseInformation').height()+$(this).offset().top)>$(window).height()) {
			$('.modelBaseInformation').css('top',$(window).height()-$('.modelBaseInformation').height()*0.6);	
		}else{
			$('.modelBaseInformation').css('top',$(this).offset().top);
		}
		$('.modelBaseInformation>.goosInforImg').html('<img src="'+m_strWebService+'/ihouse/data/jiaju/'+Mods_Arr[strArr[0]][1][1]+'"/>');
		$('.modelBaseInformation>.goosInforTitle>span').text(Mods_Arr[strArr[0]][1][0]);
	})

	$(".modelBaseInformation").hover(function(){
		// $(".modelBaseInformation").show();
		clearTimeout(setTimeOutInt);
	},function(){
		setTimeOutInt = setTimeout(function(){$(".modelBaseInformation").hide();},100);
	})
 //    $(".icon-d-").click(function(){
		
	// 	var strArray = this.id.split('-');
	// 	if(strArray[1] == "1")
	// 		sessionStorage.setItem("ihouseshow3d",m_ObjGroup[strArray[0]][1]);
		
	// 	window.open('../dyyj/DYYJMaterial/materialTexture.html');
	// })  
	
	$('#viewsSwitching-block>li').click(function(){
		var viewsSwitching_top=$(".viewsSwitching-line").offset().top,viewsSwitching_left=$(this).offset().left;
		$(".viewsSwitching-line").offset({"left":viewsSwitching_left,"top":viewsSwitching_top});
		$(this).siblings().removeClass('viewsSwitching-link');
		$(this).addClass("viewsSwitching-link");

	})

// 切换视图

// 左侧弹出框

	$('.rendering-title>i').click(function(){
		var showMain=$(this).parent().parent().attr("showMain");
		$(this).parent().parent().fadeOut(150,function(){
			$(showMain).fadeIn(150);
			moveBlock();
		});
	})

	$(".apartmentNavigation-min-title").click(function(){
		var showMain=$(this).parent().attr("showMain");
		$(this).parent().fadeOut(150,function(){
			$(showMain).fadeIn(150);
			moveBlock();
		});
	})

	$(".shrinkBar").click(function(){
		var showMain=$(this).parent().attr("showMain");
		$(this).parent().fadeOut(150,function(){
			$(showMain).fadeIn(150);
			// moveBlock();
		});
	})

// 左侧弹出框
	var intWidth=0;
	$(".createDesign-scroll-right").click(function(){
		var parWidth=$(".createDesign-scroll-img>li").eq(2).outerWidth(true),
		contWidth=$(".createDesign-scroll-img").outerWidth(true)-((parWidth*4)+10);
		if (contWidth>=intWidth) {
			intWidth+=parWidth;
		}else{
			intWidth=0;
		}
		$(".createDesign-scroll-img").css("transform","translateX(-"+intWidth+"px)");
		
	})

	$(".createDesign-scroll-left").click(function(){
		var parWidth=$(".createDesign-scroll-img>li").eq(2).outerWidth(true),
		contWidth=$(".createDesign-scroll-img").outerWidth(true)-((parWidth*4)+10);
	
		if (intWidth>=0) {
			intWidth=-(parWidth*($(".createDesign-scroll-img>li").length-4));
			// console.log($(".createDesign-scroll-img>li").length-4);
		}else{
			intWidth+=parWidth;
		}
		$(".createDesign-scroll-img").css("transform","translateX("+intWidth+"px)");
	})

	$(".createDesignClose").click(function(){
		$("#mBak").hide();
		var parents=$(this).parent().parent();
		parents.addClass("fadeOutUp");
		setTimeout(function(){
			parents.hide();
			parents.removeClass("fadeOutUp");
		},300)
	})

	$(".QiangMian_MoHuiClose").click(function(){
		$("#mBak").hide();
		var parents=$(this).parent().parent();
		parents.addClass("fadeOutUp");
		setTimeout(function(){
			parents.hide();
			parents.removeClass("fadeOutUp");
		},300)
	})


	// 查找户型

	$(".huxingAndScheme-types-list li").click(function(){
		
		$(this).siblings().removeClass('huxingAndScheme-types-link');
		$(this).addClass("huxingAndScheme-types-link");

		var typeName=$(this).parent().prev().text();
		var itemName=$(this).text();
		if (typeName=="类型:") {
			app.huxingAndScheme.type=itemName;
		}else if(typeName=="面积:"){
			app.huxingAndScheme.area=itemName;
		}else if (typeName=="户型:") {
			app.huxingAndScheme.apartmente=itemName;
		}else if (typeName=="风格:") {
			app.huxingAndScheme.stylee=itemName;
		}

		huxingAndSchemePost();
	})


	$(".huxingAndScheme-tooptip").hover(function(){
	},function(){
		$(this).hide();
	})

	// 查找户型
	
	//下拉收缩
	
	$('#mTool').delegate('.md-itemList>.itemList-title','click',function(){
		let h_1=$(this).parent().outerHeight(true),h_2=$(this).outerHeight(true),type=$(this).attr('autoTyep');

		if(type==undefined){
			$(this).parent().css({
				'height':h_2,
				'overflow':'hidden'
			});
			$(this).attr('autoTyep','1');
			
		}else if(type=='1'){
			$(this).parent().removeAttr('style');
			$(this).removeAttr('autoTyep');
		}
		
	});
	
	//下拉收缩

	// 品牌
	$('#mModelBrand .mpLists_ModelHide').delegate("img",'click',function(){
		let brandname=$(this).attr('brandname'),compnayid=$(this).attr('compnayid');
		// console.log(brandname);
		// console.log(compnayid);
		$('#mModelBrand').hide();
		$("#mModelBrand-info .modelBrand-buttom>button").text(brandname);
		$('#mModelBrand-info').show();
		initBrand(compnayid,1);
	})


	$('#mModelBrand-info .modelBrand-buttom div>button').click(function(event) {
		/* Act on the event */
		if ($(this).attr('class')!='el-button el-button--primary') {
			$(this).siblings().attr('class','el-button el-button--default');
			$(this).attr('class',"el-button el-button--primary");
		}
	});
	$('#mModelBrand-info .modelBrand-buttom div>button').eq(0).click(function(event) {
		/* Act on the event */
		initBrand('',1);
	});
	$('#mModelBrand-info .modelBrand-buttom div>button').eq(1).click(function(event) {
		/* Act on the event */
		initBrand('',2);
	});
	// 品牌

	// 功能属性界面
	$(".attrClose").click(function(){
		$(".attributeInterface").hide();
	});

	// 详细信息界面

	$(".goodsInfo").hover(function(){
		var _toptip=$(this).attr('toptip');
		clearTimeout(setTimeOutInt);

		if (_toptip=='funtion') {
			$("#furniture .detailedInformation").show();
			$('#furniture .detailedInformation .goosInforImg').html('<img src="'+m_strHttp+'jiaju/'+m_ParamObjDlg.mFurniture.mData[1]+'"/>');
			$('#furniture .detailedInformation .goosInforTitle img').attr('src',m_strHttp+'jiaju/'+m_ParamObjDlg.mFurniture.mData[1]);
			if (m_ParamObjDlg.mFurniture.mData[17]=='') {
				$('#furniture .detailedInformation .goosInforTitle span').text(m_ParamObjDlg.mFurniture.mData[0]);
			}else{
				$('#furniture .detailedInformation .goosInforTitle span').text(m_ParamObjDlg.mFurniture.mData[0]);
			}
			$('#furniture .detailedInformation .goosInforText>p').text(m_ParamObjDlg.mFurniture.mData[15]);
			$('#furniture .detailedInformation .goodsInfoPlay p span').text(m_ParamObjDlg.mFurniture.mData[14]);

		}else if(_toptip=='window'){
			$("#window .detailedInformation").show();
			$('#window .detailedInformation .goosInforImg').html('<img src="'+m_strHttp+'jiaju/'+m_ParamWinDlg.mWindowData[1]+'"/>');
			$('#window .detailedInformation .goosInforTitle img').attr('src',m_strHttp+'jiaju/'+m_ParamWinDlg.mWindowData[1]);
			if (m_ParamWinDlg.mWindowData[17]=='') {
				$('#window .detailedInformation .goosInforTitle span').text(m_ParamWinDlg.mWindowData[0]);
			}else{
				$('#window .detailedInformation .goosInforTitle span').text(m_ParamWinDlg.mWindowData[0]);
			}
			$('#window .detailedInformation .goosInforText>p').text(m_ParamWinDlg.mWindowData[15]);
			$('#window .detailedInformation .goodsInfoPlay p span').text(m_ParamWinDlg.mWindowData[14]);
		}else if(_toptip=='door'){
			$("#door .detailedInformation").show();
			$('#door .detailedInformation .goosInforImg').html('<img src="'+m_strHttp+'jiaju/'+m_ParamDoorDlg.mDoorData[1]+'"/>');
			$('#door .detailedInformation .goosInforTitle img').attr('src',m_strHttp+'jiaju/'+m_ParamDoorDlg.mDoorData[1]);
			if (m_ParamDoorDlg.mDoorData[17]=='') {
				$('#door .detailedInformation .goosInforTitle span').text(m_ParamDoorDlg.mDoorData[0]);
			}else{
				$('#door .detailedInformation .goosInforTitle span').text(m_ParamDoorDlg.mDoorData[0]);
			}
			$('#door .detailedInformation .goosInforText>p').text(m_ParamDoorDlg.mDoorData[15]);
			$('#door .detailedInformation .goodsInfoPlay p span').text(m_ParamDoorDlg.mDoorData[14]);
		}

	},function(){
		setTimeOutInt = setTimeout(function(){$(".detailedInformation").hide();},500);
	})
	$(".detailedInformation").hover(function(){
		$(".detailedInformation").show();
		clearTimeout(setTimeOutInt);
	},function(){
		setTimeOutInt = setTimeout(function(){$(".detailedInformation").hide();},100);
	})

/*	setTimeOutInt = setTimeout(function(){
		$('#app .pic-bg').empty();
		$("div").detach('.pic-bg');
	},100);*/





	// 房间文字

	// 创建设计
		$(".createDesign-title span").click(function(event) {
			/* Act on the event */
			$(this).siblings().removeClass('createDesign-title-link');
			$(this).addClass('createDesign-title-link');
			if ($(this).text()==i18n.t("Language.MyDesign")) {
				myPlan();
				created_myplan=0;
				// $('.myDesign_pag').hide();
			}
			else{
				created_myplan=1;
				GetInfoFromShare();
				// $('.myDesign_pag').show();
			}
		});

	// 创建设计
	
	// 顶面

	$('#serVue').remove();
})

function hideShow_hide(int){
	// console.log($('.modelBase-left>li'));

	for (var i = 0; i < $('.modelBase-left>li').length; i++) {
		$('.modelBase-left>li').eq(i).hide();
		var strInt=$('.modelBase-left>li').eq(i).attr('hide');

		if (parseInt(strInt)==0) {
			$('.modelBase-left>li').eq(i).show();
		}else if(parseInt(strInt)==int){
			$('.modelBase-left>li').eq(i).show();
		}
	}
}

function closeBtnModel(obj){
	$(obj).parents('.template-input-buttom-type').hide();
}


function opensBtnModel(_this,obj){

	if (homeDecorationType==0) {
		var icon_top=$(_this).offset().top,icon_left=315;

		$(obj).removeAttr("style");
		$(obj).offset({left:icon_left,top:icon_top})
		$(obj).show();
	}
}

function moveBlock(){
	var moveHeight_1=$(".apartmentNavigation").outerHeight(true),
	moveTop_1=$(".apartmentNavigation").offset().top,
	moveHeight_2=$(".apartmentNavigation-min").outerHeight(true),
	moveTop_2=$(".apartmentNavigation-min").offset().top;


	if (moveTop_1==0) {
		$(".designSketch-min").css("top",moveHeight_2+moveTop_2);
		$(".designSketch").css("top",moveHeight_2+moveTop_2);
	
	}else{
		$(".designSketch-min").css("top",moveHeight_1+moveTop_1-30);
		if (moveBlockFlat=="1") {
			$(".designSketch").css("top",moveHeight_1+moveTop_1);
			moveBlockFlat="2";
		}else{
			$(".designSketch").css("top",moveHeight_1+moveTop_1-30);
		}
	}
}

// 查找户型
// function openApartment(){
// 	// $("#mBak").show();
// 	// $(".huxingAndScheme").show();
// 	// $(".huxingAndScheme").addClass("fadeInDown");
// 	// setTimeout(function(){
// 	// 	$(".huxingAndScheme").removeClass("fadeInDown");
// 	// },200);
// 	window.open('http://134.175.95.142:8080');
// }

function myTooptip(){
	$(".huxingAndScheme-tooptip").show();
}

function huxingAndSchemePost(){
	// console.log(app.huxingAndScheme.type);
}

function OnpenGlobalSettings() { //全局设置
	$("#mBak").show();
	$(".GlobalSettings").show();
	$(".GlobalSettings").addClass("fadeInDown");
	setTimeout(function(){
		$(".GlobalSettings").removeClass("fadeInDown");
	},150);
}

function Onpenshortcutkeys() { //快捷键
	$("#mBak").show();
	$(".shortcutkeys").show();
	$(".shortcutkeys").addClass("fadeInDown");
	setTimeout(function(){
		$(".shortcutkeys").removeClass("fadeInDown");
	},150);
}

function readyModelClear() {
	$('#RenderingModel').hide();
	$('#RenderingModel').attr('src','');
}

function reImgHtml(){
	var renderImg= sessionStorage.getItem("renderImg");
	$(".rendering-img-video").html('');
	if(renderImg!=null){
		renderImg=JSON.parse(renderImg);
		for(var i = renderImg.length-1; i < renderImg.length;i++){
			let setHtml=`<div class="rendering-video-2">
						<div class="camera">
							<i class="el-icon-camera-solid"></i><span>标清</span>
						</div>
						<img src="${renderImg[i]}" alt="" />
					</div>`;
 			$(".rendering-img-video").prepend(setHtml);
		}
	}
	
}

function moverBlok(mov){

	$(mov).css({"display":"block","cursor":"none"});
	mouserhover();

	function mouserhover(){
		$(window).mousemove(function(e){
			// console.log(e);
			$(mov).css({
				"left":e.clientX-($(mov).width()/2),
				"top":e.clientY-($(mov).height()/2),
			});
		});

		// 铺贴材料
		$(mov).click(function(e){
			$(mov).css("display","none");
			mouseMove(e);
			mouseDown(e);
		});

		$(mov).mousedown(function(e){
			if (e.which==3) {
				$(mov).css("display","none");
			}
		});
	}
}

function OpenWeb(url)
{
	window.open(m_strWebService + url,"_blank");
}


function loginScroll(){
	var num = 0;
	var timer = setInterval(function(){
		if (num >= 100) {
			num = 100;
			$('.scroll').val(100);
		//	$('.scroll_Tips').html("加载进度中,完成度"+100+'&#37;');
			setTimeout(function(){
				$('#app .pic-bg').empty();
				$("div").detach('.pic-bg');
				$("progress").detach('.scroll');
			}, 200);
			clearInterval(timer);

			AutoLogin();

		}else if(num >= 80){
			$('.scroll').val(num);
		//	$('.scroll_Tips').html("加载进度中,完成度"+num+'&#37;');
		}else{
			$('.scroll').val(num);
		//	$('.scroll_num').html(num+'&#37;');
		}
		num++;
	},30)
}

//关闭抹灰对话框
function OnMoHuiClose()
{
	$("#mBak").hide();
	$('.QiangMian_MoHui').hide();
}

//关闭找平对话框
function OnZhaoPingClose()
{
	$("#mBak").hide();
	$('.DiMian_ZhaoPing').hide();
}

//关闭工程项目对话框
function OnGongChengClose()
{
	$("#mBak").hide();
	$('.bst_project').hide();
}


