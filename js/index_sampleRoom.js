homeDecorationType=0;
	//======普通家装=========
function sampleRoom(){
	var imgHtttp=m_strHttp+'jiaju/';
	var sampleRoom_data,sampleRoom_Arr=[];//总数据
	var IntelligenceXml='',HomeIntelligence='',HomeClass_1;
	var pager={
			curPage:'',
			totalPage:'',
			pageArr:[],
			pageData:[]
		};//智能分页数据
	var pageCount=6;
	
	IntelligenceHome();
	var m_sampleList_data=[],m_sampleList_data2=[],m_sampleList_data3=[]; //样板间数据
	var htmlText='';

	function sampleList_data(){ //初始化加载数据
		
		if( sampleRoom_Arr.length == 0 )
		{
			sampleRoom_data=$.ajax({url:imgHtttp+'package.csv ',async:false,});
			sampleRoom_Arr=sampleRoom_data.responseText.split('\n');
			sampleRoom_Arr=distinct(sampleRoom_Arr);
			sampleRoom_Arr.splice(0,3)
			sampleRoom_Arr.splice(sampleRoom_Arr.length-1,1);			
		}
		$('.template-scrollbar-cont').html('');
		htmlText='';m_sampleList_data=[];m_sampleList_data2=[];m_sampleList_data3=[];

		for(var i in sampleRoom_Arr){
			m_sampleList_data[i]=sampleRoom_Arr[i].split(',');
			if (m_sampleList_data[i][3]=='0' && m_sampleList_data[i][4]=='0' && m_sampleList_data[i][5]=='0'){
				m_sampleList_data2.push(m_sampleList_data[i]);
			}
		}
		m_sampleList_data3=delrepeat_Arr(m_sampleList_data2);
		for (var i in m_sampleList_data3) {
			htmlText+=`<div class="template-listInfo-item clearfloat">
						<div class="listInfo-item-left">
							<img src="${imgHtttp}${m_sampleList_data3[i][1]}"></img>
						</div>
						<div class="listInfo-item-right">
							<div class="listInfo-item-icon clearfloat">
								<i class="icon iconfont icon-xinxi" setClass ='${m_sampleList_data3[i][6]}-${m_sampleList_data3[i][7]}-${m_sampleList_data3[i][8]}'></i>
							</div>
							<div class="listInfo-item-name">
								<p class="listInfo-item-name-title">${m_sampleList_data3[i][0]}</p>
								<p class="listInfo-item-name-area"><span>${m_sampleList_data3[i][13]}</span></p>
							</div>
							<div class="listInfo-item-button">
								<button type="button" class="el-button el-button--primary" onclick="OnAIRoomClick(this);"><span>${i18n.t("Language.Apply")}</span></button>
							</div>
						</div>
					</div>`;
		}
		$('.template-scrollbar-cont').append(htmlText);
	}

	function classificationIem(item_1,item_2,item_3){ //类型选择加载数据
		var htmlItemText='',if_item;
		$('.template-scrollbar-cont').html('');
		for (var i in m_sampleList_data3) {

			if (item_1!='' && item_2=='' && item_3=='') {
				if_item=m_sampleList_data3[i][6]==item_1;
			}else if(item_1!='' && item_2!='' && item_3==''){
				if_item=m_sampleList_data3[i][6]==item_1 && m_sampleList_data3[i][7]==item_2;
			}else if(item_1!='' && item_2!='' && item_3!=''){
				if_item=m_sampleList_data3[i][6]==item_1 && m_sampleList_data3[i][7]==item_2 && m_sampleList_data3[i][8]==item_3;
			}
			if (if_item) {
			// console.log(i18n.t(Language.${Use}));
				htmlItemText=`<div class="template-listInfo-item clearfloat">
							<div class="listInfo-item-left">
								<img src="${imgHtttp}${m_sampleList_data3[i][1]}"></img>
							</div>
							<div class="listInfo-item-right">
								<div class="listInfo-item-icon clearfloat">
									<i class="icon iconfont icon-xinxi" setClass ='${m_sampleList_data3[i][6]}-${m_sampleList_data3[i][7]}-${m_sampleList_data3[i][8]}'></i>
								</div>
								<div class="listInfo-item-name">
									<p class="listInfo-item-name-title">${m_sampleList_data3[i][0]}</p>
									<p class="listInfo-item-name-area"><span>${m_sampleList_data3[i][13]}</span></p>
								</div>
								<div class="listInfo-item-button">
									<button type="button" class="el-button el-button--primary" onclick="OnPackageRoomClick(this)"><span>${i18n.t("Language.Apply")}</span></button>
								</div>
							</div>
						</div>`;
				$('.template-scrollbar-cont').append(htmlItemText);
			}
		}
	}

	function delrepeat_Arr(arr){ //删除其他数据
		var arr1=[],t_a1='';
		for(var i in arr){
			if (arr[i][8]!=t_a1) {
				t_a1=arr[i][8];
				arr1.push(arr[i]);
			}
		}

		return arr1;
	}

	var setClass_1,setClass_2,setModelArr_1=[],setModelArr_2=[];

	function setHtmlItemModel(){ //详细信息 按对应的模型加载相应的数据
		var class_Arr=setClass_1.split('-'),text_setModelArr='',text_setImgArr='';
		setModelArr_1=[];
		setModelArr_2=[];
		for(var i in m_sampleList_data){
			if (m_sampleList_data[i][6]==class_Arr[0] && m_sampleList_data[i][7]==class_Arr[1] && m_sampleList_data[i][8]==class_Arr[2]) {
				if (m_sampleList_data[i][3]=='0' && m_sampleList_data[i][4]=='0' && m_sampleList_data[i][5]=='0') {
					setModelArr_1.push(m_sampleList_data[i]);
				}else{
					setModelArr_2.push(m_sampleList_data[i]);
				}
			}
		}

		for (var i in setModelArr_1) {
			if (i==0) {
				var imgSplit=setModelArr_1[i][1].split('.');
				$('.listInfo-item-info-img').html('<img src="'+imgHtttp+imgSplit[0]+'_big.jpg"></img><p>'+setModelArr_1[i][0]+'</p>');
				text_setModelArr+=`<img src="${imgHtttp}${setModelArr_1[i][1]}" class="istInfo-item-info-btn-img-link" imgsrc='${setModelArr_1[i][1]}' alt='${setModelArr_1[i][0]}'>`;
			}else{
				text_setModelArr+=`<img src="${imgHtttp}${setModelArr_1[i][1]}" imgsrc='${setModelArr_1[i][1]}' alt='${setModelArr_1[i][0]}'>`;
			}
		}
		$('.istInfo-item-info-btn-img').html(text_setModelArr);

		for (var i in setModelArr_2) {
			text_setImgArr+='<img src="'+imgHtttp+setModelArr_2[i][1]+'"></img>';
		}
		$('.listInfo-item-info-scrollbar-block').html(text_setImgArr);
	}


	var text_setTypeClass_1='',text_setTypeClass_2='',setTypeArr_1=[],setTypeArr_2=[],setTypeArr_3=[];
	
	function setTypeClass_1(){ //分类选择 类型一的数据加载
		for(var i in m_sampleList_data3){
			setTypeArr_1.push(m_sampleList_data3[i][6]);
		}
		setTypeArr_1=distinct(setTypeArr_1);

		$('#sampleRoom-class1>ul').html('');
		$('#sampleRoom-class2>ul').html('');
		$('#sampleRoom-class3>ul').html('');
		for(var i in setTypeArr_1){
			$('#sampleRoom-class1>ul').append('<li>'+setTypeArr_1[i]+'</li>');
		}
	}
	function setTypeClass_2(value){//分类选择 按类型一的数据加载类型二的数据
		setTypeArr_2=[];
		text_setTypeClass_1=value;
		for(var i in m_sampleList_data3){
			if (m_sampleList_data3[i][6]==value) {
				setTypeArr_2.push(m_sampleList_data3[i][7]);
			}
		}
		setTypeArr_2=distinct(setTypeArr_2);

		$('#sampleRoom-class2>ul').html('');
		$('#sampleRoom-class3>ul').html('');

		for(var i in setTypeArr_2){
			$('#sampleRoom-class2>ul').append('<li>'+setTypeArr_2[i]+'</li>');
		}
	}

	function setTypeClass_3(value){//分类选择 按类型一的数据和类型二的数据加载类型三的数据
		setTypeArr_3=[];
		text_setTypeClass_2=value;
		for(var i in m_sampleList_data3){
			if (m_sampleList_data3[i][6]==text_setTypeClass_1 && m_sampleList_data3[i][7]==value) {
				setTypeArr_3.push(m_sampleList_data3[i][8]);
			}
		}
		setTypeArr_3=distinct(setTypeArr_3);

		$('#sampleRoom-class3>ul').html('');

		for(var i in setTypeArr_3){
			$('#sampleRoom-class3>ul').append('<li>'+setTypeArr_3[i]+'</li>');
		}
	}

	OnPackageRoomClick=function(that){
	}
	
	OnAIRoomClick=function(that){
		if( IsContain(container, renderer2.domElement ) == true )
		{
				alert("请在平面状态下操作.");
				return;
		}
		var selectTime = new Date().getTime();//获取时间戳
		var str = m_strHttp+ that.id +'?'+selectTime;
		mHouseClass.mAIRoomClass.OnCreateRoom(str);
	}

	//======普通家装=========


	//======智能家智能========= 

	/*
	function IntelligenceHome(){
		
		var intArr=[],htmlText='';
		if (HomeIntelligence=='') {
			IntelligenceXml=$.ajax({url:m_strHttp+'/plan_h5/plan_h5.xml',async:false,}).responseText;
			HomeIntelligence=IntelligenceXml;
			
			var  xmlDoc = $.parseXML( HomeIntelligence );
			var  $xml = $( xmlDoc );

			$('.template-scrollbar-cont').html('');
			for (var i = 0; i < $xml.find('scene').length; i++) {
				var name=$($xml.find('scene')[i]).attr('name');
				var icon=$($xml.find('scene')[i]).attr('icon');
				var src =$($xml.find('scene')[i]).attr('src');
				var desc=$($xml.find('scene')[i]).attr('desc');

				htmlText=`<div class="template-listInfo-item clearfloat">
							<div class="listInfo-item-left">
								<img src="${m_strHttp+icon}"></img>
							</div>
							<div class="listInfo-item-right">
								<div class="listInfo-item-icon clearfloat">
									<i class="icon iconfont icon-xinxi" setClass ='${icon}'></i>
								</div>
								<div class="listInfo-item-name">
									<p class="listInfo-item-name-title">${name}</p>
									<p class="listInfo-item-name-area"><span>${desc}</span></p>
								</div>
								<div class="listInfo-item-button">
									<button type="button" class="el-button el-button--primary" id=${src} onclick="OnAIRoomClick(this)"><span>${i18n.t("Language.Apply")}</span></button>
								</div>
							</div>
						</div>`;

				pager.pageArr.push(htmlText);
			}
		}

		pager.curPage=1;
		pager.totalPage=Math.ceil(pager.pageArr.length/pageCount);
		setPager();
		$('.template-scrollbar-cont').append(htmlText);
	}
	 */

	function IntelligenceHome(){

		var intArr=[],htmlText='';
		if (HomeIntelligence=='') {
			IntelligenceXml=$.ajax({url:m_strHttp+'/plan_h5/plan_h5.xml',async:false,}).responseText;
			HomeIntelligence=IntelligenceXml;
		}

		var  xmlDoc = $.parseXML( HomeIntelligence );
		var  $xml = $( xmlDoc );

		$('.template-scrollbar-cont').html('');
		for (var i = 0; i < $xml.find('scene').length; i++) {
			var name=$($xml.find('scene')[i]).attr('name');
			var icon=$($xml.find('scene')[i]).attr('icon');
			var src =$($xml.find('scene')[i]).attr('src');
			var desc=$($xml.find('scene')[i]).attr('desc');
			htmlText+=`<div class="template-listInfo-item clearfloat">
						<div class="listInfo-item-left">
							<img src="${m_strHttp+icon}"></img>
						</div>
						<div class="listInfo-item-right">
							<div class="listInfo-item-icon clearfloat">
								<i class="icon iconfont icon-xinxi" setClass ='${icon}'></i>
							</div>
							<div class="listInfo-item-name">
								<p class="listInfo-item-name-title">${name}</p>
								<p class="listInfo-item-name-area"><span>${desc}</span></p>
							</div>
							<div class="listInfo-item-button">
								<button type="button" class="el-button el-button--primary" id=${src} onclick="OnAIRoomClick(this)"><span>${i18n.t("Language.Apply")}</span></button>
							</div>
						</div>
					</div>`;
		}

		$('.template-scrollbar-cont').append(htmlText);

	}

	// 点击I后显示详细信息
	function setHtmlIntelligence(){
		var setHtmlImg=[],text_setModelArr_2='',text_setImgArr_2='',itemInt='';

		var  xmlDoc = $.parseXML( HomeIntelligence );
		var  $xml = $( xmlDoc );
		
		for (var k = 0; k < $xml.find('scene').length; k++) {
			var icon=$($xml.find('scene')[k]).attr('icon');
			if (HomeClass_1==icon) {
				itemInt=k;
			}
		}		
		
		var  $xmlNode = $($xml.find('scene')[itemInt]);
		for (var i =0; i< $xmlNode.find('image').length; i++) 
		{
			var strJpg =$($xmlNode.find('image')[i]).attr('src');
			var strIcon=$($xmlNode.find('image')[i]).attr('icon');
		
			if (i==0){
				$('.listInfo-item-info-img').html('<img src="'+m_strHttp+strJpg+'"></img>');
				text_setModelArr_2=`<img src='${m_strHttp+strJpg}' class="istInfo-item-info-btn-img-link" imgsrc='${m_strHttp+strIcon}'>`;
			}else{
				text_setModelArr_2+=`<img src='${m_strHttp+strJpg}' imgsrc='${m_strHttp+strIcon}'>`;
			}

		}
		$('.istInfo-item-info-btn-img').html(text_setModelArr_2);

		for (var i =0; i< $xmlNode.find('object').length; i++) 
		{
			var strIcon=$($xmlNode.find('object')[i]).attr('icon');
			text_setImgArr_2+='<img src="'+m_strHttp+'jiaju/'+strIcon+'"></img>';
		}

		$('.listInfo-item-info-scrollbar-block').html(text_setImgArr_2);
	}

	OrderIf=function(){	
		if (homeDecorationType==1) {	//普通家装
			sampleList_data();
			setTypeClass_1();
		}else if (homeDecorationType==0) {//智能家装
			IntelligenceHome();
		}
	}


	//======智能家智能========= 
	$(function(){
		$(".template-scrollbar-cont").delegate('i','click',function(){ //点击详细信息图标 获取其中的数据 进行加载数据
			var icon_top=$(this).offset().top-40,icon_left=$(this).offset().left+35,setClass=$(this).attr('setClass');
			$('.listInfo-item-info-model').show();
			if ($(window).height()-icon_top-$(".listInfo-item-info-model").height()<=15) {
				$(".listInfo-item-info-model").offset({left:icon_left,top:$(window).height()-$(".listInfo-item-info-model").height()-35});
			}else{
				$(".listInfo-item-info-model").offset({left:icon_left,top:icon_top});
			}
			if (homeDecorationType==1) {	
				if (setClass!=setClass_1) {
					setClass_1=setClass;
					setHtmlItemModel();
				}
			}else if(homeDecorationType==0){
				HomeClass_1=setClass;
				setHtmlIntelligence();
				}
		})

		var setTimeOutInt='';
		$(".listInfo-item-info-model").hover(function(){ //详细信息界面显示与隐藏
			clearTimeout(setTimeOutInt);
		},function(){
			var _this=$(this);

			setTimeOutInt=setTimeout(function(){	
				_this.hide();
			}, 500);
		})

		$('.istInfo-item-info-btn-img').delegate('img','click',function(){ //详细信息界面点击小图标显示相应的大图标

			var strJpg=$(this).attr('src');
			if (homeDecorationType==0) {
				$('.listInfo-item-info-img').html('<img src="'+strJpg+'"></img>');
			}else{
				strJpg=strJpg.replace('.jpg','_big.jpg');
				$('.listInfo-item-info-img').html('<img src="'+strJpg+'"></img>');
	
			}
			$(this).siblings().removeClass('istInfo-item-info-btn-img-link');
			$(this).addClass('istInfo-item-info-btn-img-link');
		})

		$('.listInfo-item-tabsGroup li').click(function(){ //tab界面切换

			var block_tab=$(this).attr('tab');
			
			$(this).siblings().removeClass('active');
			$(this).addClass('active');

			if (block_tab=='0') {
				$('.listInfo-item-info-tab-1').show();
				$('.listInfo-item-info-tab-2').hide();
			}else{
				$('.listInfo-item-info-tab-1').hide();
				$('.listInfo-item-info-tab-2').show();
			}
		})


		$('#sampleRoom-class1').delegate('li','click',function(){ //类型一点击事件与数据处理
			if ($(this).parents('.type-cont').attr("multiSelect")=='true') {
				$(this).toggleClass('el-icon-remove-outline');
			}else{
				$(this).siblings().removeClass('type-link-1');
				$(this).addClass('type-link-1');

				let text=$(this).text();
				setTypeClass_2(text);
				classificationIem(text,'','');
			}
		})

		$('#sampleRoom-class2').delegate('li','click',function(){ //类型二点击事件与数据处理
			if ($(this).parents('.type-cont').attr("multiSelect")=='true') {
				$(this).toggleClass('el-icon-remove-outline');
			}else{
				$(this).siblings().removeClass('type-link-1');
				$(this).addClass('type-link-1');

				let text=$(this).text();
				setTypeClass_3(text);
				classificationIem(text_setTypeClass_1,text,'');
			}
		})

		$('#sampleRoom-class3').delegate('li','click',function(){//类型三点击事件与数据处理
			if ($(this).parents('.type-cont').attr("multiSelect")=='true') {
				$(this).toggleClass('el-icon-remove-outline');
			}else{
				$(this).siblings().removeClass('type-link-1');
				$(this).addClass('type-link-1');

				let text=$(this).text();
				// setTypeClass_3(text);
				classificationIem(text_setTypeClass_1,text_setTypeClass_2,text);


			}
		})

		$('#sampleRoom-typeList button').eq(0).click(function(){ //重置按钮
			$('#sampleRoom-typeList li').removeClass('type-link-1');
			sampleList_data();
			$('#sampleRoom-typeList #sampleRoom-class2 ul').html("");
			$('#sampleRoom-typeList #sampleRoom-class3 ul').html("");

		})

		$('.pagechang .top').click(function(){
			if (pager.curPage>1) {
				pager.curPage+=-1;
				setPager();
			}
		})

		$('.pagechang .next').click(function(){
			if (pager.curPage<pager.totalPage) {
				pager.curPage+=1;
				setPager();
			}
		})

	})

	function distinct(a) {//数组去重封装函数
	    let arr = a;
	    let result = [];
	    let obj = {};
	
	    for (let i of arr) {
	        if (!obj[i]) {
	            result.push(i);
	            obj[i] = 1;
	        }
	    }
	
	    return result;
	}

	function setPager()
	{    
		if(pager.curPage <1 || (pager.curPage)>pager.totalPage){
			return;  
		}
		$('#pageInput').attr('value',pager.curPage);

		$('.template-scrollbar-cont').html("");

		// for (var i = pager.curPage-1; i < pager.curPage+pageCount-1; i++) {
		// 	if (i>=pager.pageArr.length) {
		// 		break;
		// 	}
		// 	pager.pageData.push(pager.pageArr[i]);
		// }
		/*let int_1=(pager.curPage-1)*itemInt,int_2=(pager.curPage-1)*itemInt+itemInt
		for (var i = int_1; i < int_2; i++) {
			if (i>=pager.pageArr.length) {
				break;
			}
			$('.template-scrollbar-cont').html($('.template-scrollbar-cont').html()+pager.pageArr[i]);
		}*/
	}
}

sampleRoom();