
	var grk_mx={
		curPage:'',
		totalPage:'',
		totalCount:'',
		m_strObjData:[],
		m_pageObjData:[],
		m_ObjGroup:[],
	},
	grk_sc={
		curPage:'',
		totalPage:'',
		totalCount:'',
		m_strObjData:[],
		m_pageObjData:[],
		m_ObjGroup:[],
	},
	grk_data={},grk_name='grk_mx',
	grk_styleClass_mx={
		data_1:[],
		data_2:[]
	},grk_styleClass_sc={
		data_1:[],
		data_2:[]
	};
var setTimeOutInt='',styleClass_mx='',styleClass_sc='';


$(function(){

	$('#gerenku_model .gerenku_model-buttom>button').click(function(event) {
		/* Act on the event */
		let int=$(this).index();
		if (int<2) {
			if ($(this).attr('class')!='el-button el-button--primary') {
				$(this).siblings().attr('class','el-button el-button--default');
				$(this).attr('class',"el-button el-button--primary");
			}
			grk_setHtml(int);
			grk_styleClassHtml();
			$('.grk_conter').hide();
		}
	});

	$('#gerenku_model .gerenku_seach>button').click(function(){
		if ($('.grk_conter>div').length!=0) {
			$('.grk_conter').show();
		}
	});

	$('#app').delegate('div.grk_conter', 'mouseover', function(event) {
			clearTimeout(setTimeOutInt);
	});
	$('#app').delegate('div.grk_conter', 'mouseout', function(event) {
		setTimeOutInt=setTimeout(function(){	
			$('.grk_conter').hide();
		}, 100);
	});

	$('.grk_conter').delegate('li', 'click', function(event) {
		$('.grk_conter li').removeClass('active');
		$(this).addClass('active');

		let index=$(this).attr('index');
		index=index.split('-');

		if (grk_name=='grk_mx') {
			initgerenku_model(index[0],index[1]);
			grk_setHtml(0);
		}else if(grk_name=='grk_sc'){
			initgerenku_cailiao(index[0],index[1]);
			grk_setHtml(1);
		}
	});
});

function grk_reload(){
	initgerenku_model();
	initgerenku_cailiao();
	setgerenkuHtml_mx();
	setgerenkuHtml_sc();

	grk_setHtml(0);
	grk_styleClassHtml();

}

function grk_setHtml(int){
	if (int==0) {
		grk_name='grk_mx';
		grk_data=grk_mx;
	}else if (int==1){
		grk_name='grk_sc';
		grk_data=grk_sc;
	}
	$('.mpLists_gerenku').html("");
	setPager_gerenku(0);
	$("#gerenkuPageNum").text(1);
	$("#gerenkuPageAccount").text(parseInt(grk_data.totalPage));
	$("#gerenkuPicNumber").text(grk_data.totalCount);
}


function grk_styleClassHtml(){
	let setHtml={},HTmlText_1='',HTmlText_2='',fleg=true;
	if (grk_name=='grk_mx') {
		if (styleClass_mx!='') {
			styleClass_sc=$('.grk_conter').html();
			$('.grk_conter').html(styleClass_mx);
			fleg=false;
		}else{
			setHtml=grk_styleClass_mx;
			fleg=true;
		}
	}else if(grk_name=='grk_sc'){
		if (styleClass_sc!='') {
			styleClass_mx=$('.grk_conter').html();
			$('.grk_conter').html(styleClass_sc);
			fleg=false;
		}else{
			setHtml=grk_styleClass_sc;
			fleg=true;
		}
	}
	if (fleg) {
		$('.grk_conter').html('');

		if ($('.grk_conter').length==0) {
			$('#app').append('<div class="grk_conter"></div>');
		}
		
		for (var i in setHtml.data_1) {
			if (setHtml.data_1[i]==undefined) {
				return;
			}
			
			HTmlText_2='';
			
			HTmlText_1='<p class="modelBase_type_title">'+setHtml.data_1[i]+'</p>';
			for (var j in setHtml.data_2[i]) {
				HTmlText_2+='<li index="'+setHtml.data_1[i]+'-'+setHtml.data_2[i][j]+'">'+setHtml.data_2[i][j]+'</li>';
			}

			let setHtml_1='<div class="modelBase_type_listItem">'+HTmlText_1+'<ul class="modelBase_type_listItem_block clearfloat">'+HTmlText_2+'</ul></div>'
			$('.grk_conter').append(setHtml_1);

		}
	}
}
//===============模型==========================================================================================	
 	function initgerenku_model(int_1,int_2,int_3) 
	{
		grk_mx.m_ObjGroup.length = 0;
		if (grk_mx.m_strObjData.length==0) {
			let timestamp = new Date().getTime().toString();
			var data_1="",data_2="",data_3="";

			// console.log(sessionStorage.getItem('userFolder'));
			// console.log(sessionStorage.getItem('userACCount'));
			$.ajax({url:m_strWebService + "users/" + sessionStorage.getItem('userFolder') + "/" + sessionStorage.getItem('userAccount') + "/jiaju_upload.csv?"+timestamp,async:false,success:function(data){
				data_1=data;
			},error: function (err){
	    		data_1='';
	 		}});
			$.ajax({url:m_strWebService + "users/" + sessionStorage.getItem('userFolder') + "/" + sessionStorage.getItem('userAccount') + "/jiaju_buy.csv?"+timestamp,async:false,success:function(data){
				data_2=data;
			},error: function (err){
	    		data_2='';
	 		}});
			/*$.ajax({url:m_strHttp + "users/" + sessionStorage.getItem('userFolder') + "/jiaju_template.csv?"+timestamp,async:false,success:function(data){
				data_3=data;
			},error: function (err){
	    		data_3='';
	 		}});*/

			grk_mx.m_strObjData=data_1+data_2+data_3;
			if(m_version=='index_3'){
				m_strObjData+=grk_mx.m_strObjData;
			}
	   		grk_mx.m_strObjData = grk_mx.m_strObjData.split("\r\n");
		}

   		var a1 = grk_mx.m_strObjData;

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
					if (m_version=='index_2'){
						tempNodeLi ='<li class="meshPic"><i class="icon iconfont icon-xinxi"></i><i class="icon iconfont icon-d-" id="'+iIndex+'-1"></i><i class="icon iconfont icon-xing"></i><img id="'+iIndex+'" src="'+m_strHttp + 'jiaju/'+ a2[1]+'" alt="image"  onclick="OngerenkuClick(this);" ></li>';
					}else if(m_version=='index_3'){
						tempNodeLi ='<li class="meshPic"><i class="icon iconfont icon-xinxi"></i><i class="icon iconfont icon-xing"></i><img id="'+iIndex+'" src="'+m_strHttp + 'jiaju/'+ a2[1]+'" alt="image"  onclick="OngerenkuClick(this);" ></li>';
					}
				  	dataArray.push(tempNodeLi);
					dataArray.push(a2);
					iIndex++;
					grk_mx.m_ObjGroup.push(dataArray);
				}				 	
		}
 		if( grk_mx.m_ObjGroup.length > 0)
		{
			grk_mx.totalCount = grk_mx.m_ObjGroup.length;
			grk_mx.totalPage = Math.ceil(grk_mx.totalCount/pageCount);
			grk_mx.curPage 	= 1;
		}
		else
		{
			grk_mx.totalCount = 0;
			grk_mx.totalPage 	= 0;
			grk_mx.curPage 	= 0;
		}	
	}


    function OngerenkuClick(that)
    {
    	 mHouseClass.mFurnitureClass.CreateObj(grk_data.m_ObjGroup[that.id][1]);
    }

    function setgerenkuHtml_mx(){
		
		var MatArr_split=[],MatArr_1=[],MatArr_2=[],MatHtml=[],HTmlText_1='',HTmlText_2='';
		for(var i in grk_mx.m_strObjData){
			if (grk_mx.m_strObjData[i]!='') {
				MatArr_split.push(grk_mx.m_strObjData[i].split(','));
				MatArr_1.push(grk_mx.m_strObjData[i].split(',')[6])
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

		grk_styleClass_mx.data_1=MatArr_1;
		grk_styleClass_mx.data_2=MatArr_2;

	}



	//===============素材==========================================================================================	
	function initgerenku_cailiao(int_1,int_2) 
 	{
 		grk_sc.m_ObjGroup.length = 0;
 		if (grk_sc.m_strObjData.length==0) {
 			let timestamp = new Date().getTime().toString();
	 		let s_data_1,s_data_2,s_data_3;
	 		$.ajax({url:m_strWebService + "users/" + sessionStorage.getItem('userFolder') + "/" + sessionStorage.getItem('userAccount') + "/huawen_upload.csv?"+timestamp,async:false,success:function(data){
				s_data_1=data;
			},error: function (err){
	    		s_data_1='';
	 		}});
	 		$.ajax({url:m_strWebService + "users/" + sessionStorage.getItem('userFolder') + "/" + sessionStorage.getItem('userAccount') + "/huawen_buy.csv?"+timestamp,async:false,success:function(data){
				s_data_2=data;
			},error: function (err){
	    		s_data_2='';
	 		}});
	 		/*$.ajax({url:m_strHttp + "users/" + sessionStorage.getItem('userFolder') + "/huawen_template.csv",async:false,success:function(data){
				s_data_3=data;
			},error: function (err){
	    		s_data_3='';
	 		}});*/
	 		if(m_version=='index_3'){
				m_strMatData+=grk_sc.m_strObjData;
			}
	       	grk_sc.m_strObjData = (s_data_1+s_data_2+s_data_3).split("\r\n");
 		}

       	var iIndex = 0;
    	for(var i=0; i<grk_sc.m_strObjData.length; i++) 
		{
			var s2 =grk_sc.m_strObjData[i];
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
					tempNodeLi = '<li class="meshPic"><img id="' + iIndex + '" src="' + m_strHttp + 'texture/' + a2[1] +'" alt="image"  onclick="OnYouingZhuangImageClick_gerenku(this);" ></li>';
				}else if(accountType==1){
					tempNodeLi = '<li class="meshPic"><img id="' + iIndex + '" src="' + m_strHttp + 'texture/' + a2[1] +'" alt="image"  onclick="OnYouingZhuangImageClick_gerenku(this);" ></li>';
				}
			  	dataArray.push(tempNodeLi);
				dataArray.push(a2);
				iIndex++;
				grk_sc.m_ObjGroup.push(dataArray);
			}				 	
		}
	 	if( grk_sc.m_ObjGroup.length > 0) 
		{
			grk_sc.totalCount = grk_sc.m_ObjGroup.length;
			grk_sc.totalPage = Math.ceil(grk_sc.totalCount/pageCount);
			grk_mx.curPage 	= 1;
		}
		else
		{
			grk_sc.totalCount 	= 0;
			grk_sc.totalPage 	= 0;
			grk_sc.curPage 	= 0;
		}	
 	}
 		
	function setPager_gerenku(fValue)              
	{     
		if(fValue <0 || (fValue+1)>grk_data.totalPage){    				                  
			return;  
		}
		grk_data.curPage = fValue;                  	     
		var curNum = fValue*pageCount;         

		$('.mpLists_gerenku').html("");

		$("#gerenkuPageNum").text(Math.floor(fValue)+1);
		
		grk_data.m_pageObjData.length = 0;
		for(var i = 0; curNum<grk_data.m_ObjGroup.length&&i<pageCount; i++,curNum++)
		{                      
			grk_data.m_pageObjData.push(grk_data.m_ObjGroup[curNum][0]);  
		}                  
		var temp=grk_data.curPage+1;                  
		for(var i=0; i<grk_data.m_pageObjData.length; i++) 		
		{
			$('.mpLists_gerenku').append(grk_data.m_pageObjData[i]);
		}

		Mods_Arr=qyk_data.m_ObjGroup;
		if (grk_name=='grk_mx') {
			grk_mx=grk_data;
		}else if(grk_name=='grk_sc'){
			grk_sc=grk_data;
		}
	}


	function setgerenkuHtml_sc(){
		
		var gerenkuArr_split=[],gerenkuArr_1=[],gerenkuArr_2=[],gerenkuHtml=[],HTmlText_1='',HTmlText_2='';
		
		for(var i in grk_sc.m_strObjData){
			if (grk_sc.m_strObjData[i]!='') {
				gerenkuArr_split.push(grk_sc.m_strObjData[i].split(','));
				gerenkuArr_1.push(grk_sc.m_strObjData[i].split(',')[3])
			}
		}

		gerenkuArr_1=distinct(gerenkuArr_1);
		
		for(var i in gerenkuArr_1){
			gerenkuArr_2[i] = Array();
			for(var j in gerenkuArr_split){
				if (gerenkuArr_split[j][3]==gerenkuArr_1[i]) {
					gerenkuArr_2[i].push(gerenkuArr_split[j][4]);
				}
			}
		}

		for (var i in gerenkuArr_2) {
			gerenkuArr_2[i]=distinct(gerenkuArr_2[i]);
		}

		grk_styleClass_sc.data_1=gerenkuArr_1;
		grk_styleClass_sc.data_2=gerenkuArr_2;
	}
	
    function OnImageClick(that)
    {
    	g_dataTex = Mods_Arr[that.id][1];
    	m_cPenType = 6;
 	 	$(".hover_img").attr("src",that.src);
		moverBlok(".hover_img");	
    }

    //硬装点击
    function OnYouingZhuangImageClick_gerenku(that) {
		g_dataTex = grk_data.m_ObjGroup[that.id][1];
		m_cPenType = 6;
		$(".hover_img").attr("src", that.src);
		moverBlok(".hover_img");
	}

	function keyWord_grk(val){
		var strArr;

			grk_mx=JSON.parse(JSON.stringify(grk_mx));
			grk_sc=JSON.parse(JSON.stringify(grk_sc));
			console.log(grk_sc);

		if (grk_name=='grk_mx' || grk_name=='search_mx') {
			strArr=fuzzyQuery( grk_mx.m_strObjData,val);
			grk_name='search_mx';
			grk_data.m_strObjData=strArr;
			initgerenku_search('mx');
			grk_setHtml(3);
		}else if(grk_name=='grk_sc' || grk_name=='search_sc'){
			strArr=fuzzyQuery( grk_sc.m_strObjData,val);
			grk_name='search_sc';
			grk_data.m_strObjData=strArr;
			initgerenku_search('sc');
			grk_setHtml(3);
		}

	}

function initgerenku_search(type) 
	{
		grk_data=JSON.parse(JSON.stringify(grk_data));

		grk_data.m_ObjGroup.length=0;

   		var a1 = grk_data.m_strObjData;

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
						tempNodeLi ='<li class="meshPic"><i class="icon iconfont icon-xinxi"></i><i class="icon iconfont icon-d-" id="'+iIndex+'-1"></i><i class="icon iconfont icon-xing"></i><img id="'+iIndex+'" src="'+m_strHttp + 'jiaju/'+ a2[1]+'" alt="image"  onclick="OngerenkuClick(this);" ></li>';
					}else if(accountType==1){
						tempNodeLi ='<li class="meshPic"><i class="icon iconfont icon-xinxi"></i><i class="icon iconfont icon-xing"></i><img id="'+iIndex+'" src="'+m_strHttp + 'jiaju/'+ a2[1]+'" alt="image"  onclick="OngerenkuClick(this);" ></li>';
					}
				}else if(type=="sc"){
					if (accountType==0){
						tempNodeLi = '<li class="meshPic"><img id="' + iIndex + '" src="' + m_strHttp + 'texture/' + a2[1] +'" alt="image"  onclick="OnYouingZhuangImageClick_gerenku(this);" ></li>';
					}else if(accountType==1){
						tempNodeLi = '<li class="meshPic"><img id="' + iIndex + '" src="' + m_strHttp + 'texture/' + a2[1] +'" alt="image"  onclick="OnYouingZhuangImageClick_gerenku(this);" ></li>';
					}
				}


			  	dataArray.push(tempNodeLi);
				dataArray.push(a2);
				iIndex++;
				grk_data.m_ObjGroup.push(dataArray);			 	
		}
 		if( grk_data.m_ObjGroup.length > 0)
		{
			grk_data.totalCount = grk_data.m_ObjGroup.length;
			grk_data.totalPage = Math.ceil(grk_data.totalCount/pageCount);
			grk_data.curPage 	= 1;
		}
		else
		{
			grk_data.totalCount = 0;
			grk_data.totalPage 	= 0;
			grk_data.curPage 	= 0;
			$('.mpLists_gerenku').html('');
		}
	}