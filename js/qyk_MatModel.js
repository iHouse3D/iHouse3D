
	var qyk_mx={
		curPage:'',
		totalPage:'',
		totalCount:'',
		m_strObjData:[],
		m_pageObjData:[],
		m_ObjGroup:[],
	},
	qyk_sc={
		curPage:'',
		totalPage:'',
		totalCount:'',
		m_strObjData:[],
		m_pageObjData:[],
		m_ObjGroup:[],
	},
	qyk_data={},qyk_name='qyk_mx',
	qyk_styleClass_mx={
		data_1:[],
		data_2:[]
	},qyk_styleClass_sc={
		data_1:[],
		data_2:[]
	};
var setTimeOutInt='',styleClass_mx='',styleClass_sc='';


$(function(){

	$('#qiyeku_model .qiyeku_model-buttom>button').click(function(event) {
		/* Act on the event */
		let int=$(this).index();
		if (int<2) {
			if ($(this).attr('class')!='el-button el-button--primary') {
				$(this).siblings().attr('class','el-button el-button--default');
				$(this).attr('class',"el-button el-button--primary");
			}
			qyk_setHtml(int);
			qyk_styleClassHtml();
			$('.qyk_conter').hide();
		}
	});

	$('#qiyeku_model .qiyeku_seach>button').click(function(){
		$('.qyk_conter').show();
	});

	// $('.qyk_conter').hover(function(){
	// 	clearTimeout(setTimeOutInt);
	// },function(){
	// 	setTimeOutInt=setTimeout(function(){	
	// 		$('.qyk_conter').hide();
	// 	}, 100);
	// });

	$('#app').delegate('div.qyk_conter', 'mouseover', function(event) {
			clearTimeout(setTimeOutInt);
	});
	$('#app').delegate('div.qyk_conter', 'mouseout', function(event) {
		setTimeOutInt=setTimeout(function(){	
			$('.qyk_conter').hide();
		}, 100);
	});

	$('#app').delegate('div.qyk_conter li', 'click', function(event) {
		$('.qyk_conter li').removeClass('active');
		$(this).addClass('active');

		let index=$(this).attr('index');
		index=index.split('-');
		if (qyk_name=='qyk_mx') {
			initQiYeKu_model(index[0],index[1]);
			qyk_setHtml(0);
		}else if(qyk_name=='qyk_sc'){
			initQiYeKu_cailiao(index[0],index[1]);
			qyk_setHtml(1);
		}
	});
});

function qyk_reload(){
	initQiYeKu_model();
	initQiYeKu_cailiao();	
	setqiyekuHtml_mx();
	setqiyekuHtml_sc();

	qyk_setHtml(0);
	qyk_styleClassHtml();

}

function qyk_setHtml(int){
	if (int==0) {
		qyk_name='qyk_mx';
		qyk_data=qyk_mx;
	}else if (int==1){
		qyk_name='qyk_sc';
		qyk_data=qyk_sc;
	}
	$('.mpLists_qiyeku').html("");
	setPager_qiyeku(0);
	$("#qiyekuPageNum").text(1);
	$("#qiyekuPageAccount").text(parseInt(qyk_data.totalPage));
	$("#qiyekuPicNumber").text(qyk_data.totalCount);
}


function qyk_styleClassHtml(){
	let setHtml={},HTmlText_1='',HTmlText_2='',fleg=true;
	if (qyk_name=='qyk_mx') {
		if (styleClass_mx!='') {
			styleClass_sc=$('.qyk_conter').html();
			$('.qyk_conter').html(styleClass_mx);
			fleg=false;
		}else{
			setHtml=qyk_styleClass_mx;
			fleg=true;
		}
	}else if(qyk_name=='qyk_sc'){
		if (styleClass_sc!='') {
			styleClass_mx=$('.qyk_conter').html();
			$('.qyk_conter').html(styleClass_sc);
			fleg=false;
		}else{
			setHtml=qyk_styleClass_sc;
			fleg=true;
		}
	}

	if (fleg) {
		$('.qyk_conter').html('');
		if ($('.qyk_conter').length==0) {
			$('#app').append('<div class="qyk_conter"></div>');
		}

		for (var i in setHtml.data_1) {
			HTmlText_2='';
			
			HTmlText_1='<p class="modelBase_type_title">'+setHtml.data_1[i]+'</p>';
			for (var j in setHtml.data_2[i]) {
				HTmlText_2+='<li index="'+setHtml.data_1[i]+'-'+setHtml.data_2[i][j]+'">'+setHtml.data_2[i][j]+'</li>';
			}

			let setHtml_1='<div class="modelBase_type_listItem">'+HTmlText_1+'<ul class="modelBase_type_listItem_block clearfloat">'+HTmlText_2+'</ul></div>'
			$('.qyk_conter').append(setHtml_1);

		}
	}
}
//===============模型==========================================================================================	
 	function initQiYeKu_model(int_1,int_2,int_3) 
	{	
		qyk_mx.m_ObjGroup.length = 0;
		if (qyk_mx.m_strObjData.length==0) {
			let timestamp = new Date().getTime().toString();
			var data_1="",data_2="",data_3="";

			$.ajax({url:m_strWebService + "users/" + sessionStorage.getItem('userFolder') + "/jiaju_upload.csv?"+timestamp,async:false,success:function(data){
				data_1=data;
			},error: function (err){
	    		data_1='';
	 		}});
			$.ajax({url:m_strWebService + "users/" + sessionStorage.getItem('userFolder') + "/jiaju_buy.csv?"+timestamp,async:false,success:function(data){
				data_2=data;
			},error: function (err){
	    		data_2='';
	 		}});
			$.ajax({url:m_strWebService + "users/" + sessionStorage.getItem('userFolder') + "/jiaju_template.csv?"+timestamp,async:false,success:function(data){
				data_3=data;
			},error: function (err){
	    		data_3='';
	 		}});

			qyk_mx.m_strObjData=data_1+data_2+data_3;
			if(m_version=='index_3'){
				m_strObjData=qyk_mx.m_strObjData;
			}
	   		qyk_mx.m_strObjData = qyk_mx.m_strObjData.split("\r\n");
		}

   		var a1 = qyk_mx.m_strObjData;

   		var iIndex = 0;
	 	for(var i=0; i<a1.length; i++) 
		{
				var s2 =a1[i];
				var a2 =s2.split(',');

			    if(!IsEffectiveModel(a2))
				   continue;

				var dataArray = new Array();
				var tempNodeLi;
				var if_flog;
				if (int_1==undefined && int_2==undefined && int_3==undefined) {
					if_flog=a2[1]!= undefined && a2[1] != null &&a2[2]!=null && a2[4]!=null;
				}else{
					if_flog=a2[1]!= undefined && a2[1] != null &&a2[2]!=null && a2[4]!=null && a2[6]==int_1 && a2[7]==int_2;
				}

				if( if_flog )
				{
					var k   = a2[2].lastIndexOf(".");
					var str = a2[2].slice(k+1);
					if( str == "a3d")
						 continue;
					if(m_version=='index_2'){
						tempNodeLi ='<li class="meshPic"><i class="icon iconfont icon-xinxi"></i><i class="icon iconfont icon-d-" id="'+iIndex+'-1"></i><i class="icon iconfont icon-xing"></i><img id="'+iIndex+'" src="'+m_strHttp + 'jiaju/'+ a2[1]+'" alt="image"  onclick="OnqiyekuClick(this);" ></li>';
					}else if(m_version=='index_3'){
						tempNodeLi ='<li class="meshPic"><i class="icon iconfont icon-xinxi"></i><i class="icon iconfont icon-xing"></i><img id="'+iIndex+'" src="'+m_strHttp + 'jiaju/'+ a2[1]+'" alt="image"  onclick="OnqiyekuClick(this);" ></li>';
					}
				  	dataArray.push(tempNodeLi);
					dataArray.push(a2);
					iIndex++;
					qyk_mx.m_ObjGroup.push(dataArray);
				}				 	
		}
 		if( qyk_mx.m_ObjGroup.length > 0)
		{
			qyk_mx.totalCount = qyk_mx.m_ObjGroup.length;
			qyk_mx.totalPage = Math.ceil(qyk_mx.totalCount/pageCount);
			qyk_mx.curPage 	= 1;
		}
		else
		{
			qyk_mx.totalCount = 0;
			qyk_mx.totalPage 	= 0;
			qyk_mx.curPage 	= 0;
		}	
	}


    function OnqiyekuClick(that)
    {
    	 mHouseClass.mFurnitureClass.CreateObj(qyk_data.m_ObjGroup[that.id][1]);
    }

    function setqiyekuHtml_mx(){
		
		var MatArr_split=[],MatArr_1=[],MatArr_2=[],MatHtml=[],HTmlText_1='',HTmlText_2='';
		for(var i in qyk_mx.m_strObjData){
			if (qyk_mx.m_strObjData[i]!='') {
				MatArr_split.push(qyk_mx.m_strObjData[i].split(','));
				MatArr_1.push(qyk_mx.m_strObjData[i].split(',')[6])
			}
		}

		MatArr_1=distinct(MatArr_1);
		
		for(var i in MatArr_1){
			MatArr_2[i] = Array();
			for(var j in MatArr_split){
				if (MatArr_split[j][6]==MatArr_1[i]) {
					MatArr_2[i].push(MatArr_split[j][7]);
				}
			}
		}

		for (var i in MatArr_2) {
			MatArr_2[i]=distinct(MatArr_2[i]);
		}

		qyk_styleClass_mx.data_1=MatArr_1;
		qyk_styleClass_mx.data_2=MatArr_2;

	}



	//===============素材==========================================================================================	
	function initQiYeKu_cailiao(int_1,int_2) 
 	{
 		qyk_sc.m_ObjGroup.length = 0;
 		if (qyk_sc.m_strObjData.length==0) {
	 		let s_data_1,s_data_2,s_data_3;
	 		$.ajax({url:m_strWebService + "users/" + sessionStorage.getItem('userFolder') + "/huawen_upload.csv",async:false,success:function(data){
				s_data_1=data;
			},error: function (err){
	    		s_data_1='';
	 		}});
	 		$.ajax({url:m_strWebService + "users/" + sessionStorage.getItem('userFolder') + "/huawen_buy.csv",async:false,success:function(data){
				s_data_2=data;
			},error: function (err){
	    		s_data_2='';
	 		}});
	 		$.ajax({url:m_strWebService + "users/" + sessionStorage.getItem('userFolder') + "/huawen_template.csv",async:false,success:function(data){
				s_data_3=data;
			},error: function (err){
	    		s_data_3='';
	 		}});

	       	qyk_sc.m_strObjData = (s_data_1+s_data_2+s_data_3).split("\r\n");
	       	if(m_version=='index_3'){
				m_strMatData=qyk_sc.m_strObjData;
			}
 		}

       	var iIndex = 0;
    	for(var i=0; i<qyk_sc.m_strObjData.length; i++) 
		{
			var s2 =qyk_sc.m_strObjData[i];
			var a2 =s2.split(',');

		//	if(!IsEffectiveModel(a2))
		//		continue;

			var dataArray = new Array();
			var tempNodeLi;
			var if_flog;
				if (int_1==undefined && int_2==undefined) {
					if_flog=a2[1]!= undefined && a2[1] != null &&a2[2]!=null && a2[4]!=null;
				}else{
					if_flog=a2[1]!= undefined && a2[1] != null &&a2[2]!=null && a2[3]==int_1 && a2[4]==int_2;
				}		
			if( if_flog)		
			{
				if (accountType==0){
					tempNodeLi = '<li class="meshPic"><img id="' + iIndex + '" src="' + m_strHttp + 'texture/' + a2[1] +'" alt="image"  onclick="OnYouingZhuangImageClick_qiyeku(this);" ></li>';
				}else if(accountType==1){
					tempNodeLi = '<li class="meshPic"><img id="' + iIndex + '" src="' + m_strHttp + 'texture/' + a2[1] +'" alt="image"  onclick="OnYouingZhuangImageClick_qiyeku(this);" ></li>';
				}
			  	dataArray.push(tempNodeLi);
				dataArray.push(a2);
				iIndex++;
				qyk_sc.m_ObjGroup.push(dataArray);
			}				 	
		}
	 	if( qyk_sc.m_ObjGroup.length > 0) 
		{
			qyk_sc.totalCount = qyk_sc.m_ObjGroup.length;
			qyk_sc.totalPage = Math.ceil(qyk_sc.totalCount/pageCount);
			qyk_mx.curPage 	= 1;
		}
		else
		{
			qyk_sc.totalCount 	= 0;
			qyk_sc.totalPage 	= 0;
			qyk_sc.curPage 	= 0;
		}
 	}
 		
	function setPager_qiyeku(fValue)
	{     
		if(fValue <0 || (fValue+1)>qyk_data.totalPage){    				                  
			return;  
		}
		qyk_data.curPage = fValue;                  	     
		var curNum = fValue*pageCount;         

		$('.mpLists_qiyeku').html("");

		$("#qiyekuPageNum").text(Math.floor(fValue)+1);
		
		qyk_data.m_pageObjData.length = 0;
		for(var i = 0; curNum<qyk_data.m_ObjGroup.length&&i<pageCount; i++,curNum++)
		{                      
			qyk_data.m_pageObjData.push(qyk_data.m_ObjGroup[curNum][0]);  
		}                  
		var temp=qyk_data.curPage+1;                  
		for(var i=0; i<qyk_data.m_pageObjData.length; i++) 		
		{
			$('.mpLists_qiyeku').append(qyk_data.m_pageObjData[i]);
		}

		Mods_Arr=qyk_data.m_ObjGroup;

		if (qyk_name=='qyk_mx') {
			qyk_mx=qyk_data;
		}else if(qyk_name=='qyk_sc'){
			qyk_sc=qyk_data;
		}
	}


	function setqiyekuHtml_sc(){
		
		var qiyekuArr_split=[],qiyekuArr_1=[],qiyekuArr_2=[],qiyekuHtml=[],HTmlText_1='',HTmlText_2='';
		
		for(var i in qyk_sc.m_strObjData){
			if (qyk_sc.m_strObjData[i]!='') {
				qiyekuArr_split.push(qyk_sc.m_strObjData[i].split(','));
				qiyekuArr_1.push(qyk_sc.m_strObjData[i].split(',')[3])
			}
		}

		qiyekuArr_1=distinct(qiyekuArr_1);
		
		for(var i in qiyekuArr_1){
			qiyekuArr_2[i] = Array();
			for(var j in qiyekuArr_split){
				if (qiyekuArr_split[j][3]==qiyekuArr_1[i]) {
					qiyekuArr_2[i].push(qiyekuArr_split[j][4]);
				}
			}
		}

		for (var i in qiyekuArr_2) {
			qiyekuArr_2[i]=distinct(qiyekuArr_2[i]);
		}

		qyk_styleClass_sc.data_1=qiyekuArr_1;
		qyk_styleClass_sc.data_2=qiyekuArr_2;
	}
	
    function OnImageClick(that)
    {
    	g_dataTex = Mods_Arr[that.id][1];
    	m_cPenType = 6;
 	 	$(".hover_img").attr("src",that.src);
		moverBlok(".hover_img");	
    }

    //硬装点击
    function OnYouingZhuangImageClick_qiyeku(that) {
		g_dataTex = qyk_data.m_ObjGroup[that.id][1];
		m_cPenType = 6;
		$(".hover_img").attr("src", that.src);
		moverBlok(".hover_img");
	}

	function keyWord_qyk(val){
		var strArr;

			qyk_mx=JSON.parse(JSON.stringify(qyk_mx));
			qyk_sc=JSON.parse(JSON.stringify(qyk_sc));
			// console.log(qyk_sc);

		if (qyk_name=='qyk_mx' || qyk_name=='search_mx') {
			strArr=fuzzyQuery( qyk_mx.m_strObjData,val);
			qyk_name='search_mx';
			qyk_data.m_strObjData=strArr;
			initQiYeKu_search('mx');
			qyk_setHtml(3);
		}else if(qyk_name=='qyk_sc' || qyk_name=='search_sc'){
			strArr=fuzzyQuery( qyk_sc.m_strObjData,val);
			qyk_name='search_sc';
			qyk_data.m_strObjData=strArr;
			initQiYeKu_search('sc');
			qyk_setHtml(3);
		}

	}

function initQiYeKu_search(type) 
	{
		qyk_data=JSON.parse(JSON.stringify(qyk_data));

		qyk_data.m_ObjGroup.length=0;

   		var a1 = qyk_data.m_strObjData;

   		var iIndex = 0;
	 	for(var i=0; i<a1.length; i++) 
		{
				var s2 =a1[i];
				var a2 =s2.split(',');

				var dataArray = new Array();

				var tempNodeLi;
				var k   = a2[2].lastIndexOf(".");
				var str = a2[2].slice(k+1);
				if( str == "a3d")
					 continue;

				if (type=='mx') {
					if (accountType==0){
						tempNodeLi ='<li class="meshPic"><i class="icon iconfont icon-xinxi"></i><i class="icon iconfont icon-d-" id="'+iIndex+'-1"></i><i class="icon iconfont icon-xing"></i><img id="'+iIndex+'" src="'+m_strHttp + 'jiaju/'+ a2[1]+'" alt="image"  onclick="OnqiyekuClick(this);" ></li>';
					}else if(accountType==1){
						tempNodeLi ='<li class="meshPic"><i class="icon iconfont icon-xinxi"></i><i class="icon iconfont icon-xing"></i><img id="'+iIndex+'" src="'+m_strHttp + 'jiaju/'+ a2[1]+'" alt="image"  onclick="OnqiyekuClick(this);" ></li>';
					}
				}else if(type=="sc"){
					if (accountType==0){
						tempNodeLi = '<li class="meshPic"><img id="' + iIndex + '" src="' + m_strHttp + 'texture/' + a2[1] +'" alt="image"  onclick="OnYouingZhuangImageClick_qiyeku(this);" ></li>';
					}else if(accountType==1){
						tempNodeLi = '<li class="meshPic"><img id="' + iIndex + '" src="' + m_strHttp + 'texture/' + a2[1] +'" alt="image"  onclick="OnYouingZhuangImageClick_qiyeku(this);" ></li>';
					}
				}


			  	dataArray.push(tempNodeLi);
				dataArray.push(a2);
				iIndex++;
				qyk_data.m_ObjGroup.push(dataArray);			 	
		}
 		if( qyk_data.m_ObjGroup.length > 0)
		{
			qyk_data.totalCount = qyk_data.m_ObjGroup.length;
			qyk_data.totalPage = Math.ceil(qyk_data.totalCount/pageCount);
			qyk_data.curPage 	= 1;
		}
		else
		{
			qyk_data.totalCount = 0;
			qyk_data.totalPage 	= 0;
			qyk_data.curPage 	= 0;
			$('.mpLists_qiyeku').html('');
		}
	}