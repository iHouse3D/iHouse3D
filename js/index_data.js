	var pageCount = 16;	    
	var m_strObjData;
	var m_strMatData;
	var m_strmoxingData="";

	var MatType=1;//判断是否为硬装

  	var curPage; 		//家具类变量    		
	var totalPage;  	  		 
	var totalCount; 	  				
	var m_pageObjData =[];		
	var m_ObjGroup =[];

	var curPage_model; 		//模型类变量    		
	var totalPage_model;  	  		 
	var totalCount_model;
	var m_strObjData_model;			
	var m_pageObjData_model =[];		
	var m_ObjGroup_model =[];

  	var curPage_Lighting; 		 //照明类变量   		
	var totalPage_Lighting;  	  		 
	var totalCount_Lighting; 	
	var m_pageObjData_Lighting =[];	
	var m_ObjGroup_Lighting =[];
	
  	var curPage_Cupboard; 		   //橱柜类变量 		
	var totalPage_Cupboard;  	  		 
	var totalCount_Cupboard; 	
	var m_pageObjData_Cupboard =[];	
	var m_ObjGroup_Cupboard =[];	
	
 	var curPage_Mat; 		//硬装类变量 		
	var totalPage_Mat;  	  		
	var totalCount_Mat;
	var m_pageData_Mat =[];
	var m_MatGroup =[];	
	var MatArr_cont =[];

 	var curPage_sucai; 		//素材类变量 		
	var totalPage_sucai;  	  		
	var totalCount_sucai;
	var m_pageData_sucai =[];
	var m_sucaiGroup =[];	
	var sucaiArr_cont =[];

	var curPage_Appliance; 		//家电类变量 		
	var totalPage_Appliance;  	  		
	var totalCount_Appliance;
	var m_pageData_Appliance =[];
	var m_ApplianceGroup =[];	

	var curPage_Decoration; 		//家饰类变量 		
	var totalPage_Decoration;  	  		
	var totalCount_Decoration;
	var m_pageData_Decoration =[];
	var m_DecorationGroup =[];	
	
	var curPage_Tooling; 		//工装类变量 		
	var totalPage_Tooling;  	  		
	var totalCount_Tooling;
	var m_pageData_Tooling =[];
	var m_ToolingGroup =[];	
 
	var curPage_Collection; 		//收藏类变量 		
	var totalPage_Collection;  	  		
	var totalCount_Collection;
	var m_CollectionGroup =[];	
	var m_pageData_Collection =[];

	var curPage_ModelHide; 		//隐藏类变量 		
	var totalPage_ModelHide;  	  		
	var totalCount_ModelHide;
	var m_ModelHideGroup =[];	
	var m_pageData_ModelHide =[];

	var curPage_Brand; 		   //品牌类变量 		
	var totalPage_Brand;  	  		 
	var totalCount_Brand; 	
	var m_pageObjData_Brand =[];	
	var m_ObjGroup_Brand =[];
	var Brand_Id='';

	var curPage_Cabinet; 		//实验台柜类变量 		
	var totalPage_Cabinet;  	  		
	var totalCount_Cabinet;
	var m_pageData_Cabinet =[];
	var m_CabinetGroup =[];	

	var curPage_Exhibition; 		//会展类变量 		
	var totalPage_Exhibition;  	  		
	var totalCount_Exhibition;
	var m_pageData_Exhibition =[];
	var m_ExhibitionGroup =[];	

	var curPage_search; 		//搜索类变量
	var totalPage_search;
	var keyWord_search;
	var totalCount_search;
	var m_pageData_search =[];
	var m_searchGroup =[];	

	var curPage_combination; 		//组合类变量 		
	var totalPage_combination;  	  		
	var totalCount_combination;
	var m_pageData_combination =[];
	var m_combinationGroup =[];
	
	var categoryType=[],secondType=[],levelThreeType=[];//获取模型分类
	var levelThreeType_img=[];//获取模型
	
	if ("undefined" == typeof(m_version) ||  m_version!='index_3') {
		initFurniture();	// 家具
		initLighting();		// 照明
		initCupboard();		// 橱柜
		/*initMat();			// 硬装*/
		initMat('墙板','墙板');	// 硬装
		intAppliance();		// 家电
		intDecoration();	// 家饰
		intTooling();		// 工装
		intCabinet();		//实验台柜
		intExhibition();	//会展
		intcombination();   //组合
		GetModelClass();	//获取模型分类
	}

	$('#mToolingDlg').show();



	//-----获取模型分类--------------------------------------------------------
function GetModelClass()
{
	var strData = m_strObjData.responseText.split("\r\n");

	for (var i = 0; i < strData.length-1; i++) {// 一重
	            
            categoryType[i]=strData[i].split(",")[6];//设置类型‘一级’
        }
        categoryType=distinct(categoryType)//"一级"数组去重


        for (var i = 0; i < categoryType.length; i++) {//设置类型‘二级’ 一重

        	secondType[i] = new Array(); //创建二维数组
        	
        	for (var j = 1; j < strData.length; j++) { //二重

        		if (categoryType[i]==strData[j].split(",")[6]) {

        			secondType[i].push(strData[j].split(",")[7]);//把各自符合类型的数值添加到相应的位置
        		}
        	}
        }

        for (var i = 0; i < secondType.length; i++) {//"二级"数组去重

        	secondType[i]=distinct(secondType[i]);//数组去重后重新赋值
        }


        for (var i = 0; i < secondType.length; i++) {//设置类型"三级" 一重

        	levelThreeType[i] = new Array();//创建二维数组
        	levelThreeType_img[i] = new Array();//创建二维数组

        	for (var j = 0; j < secondType[i].length; j++) { //二重

            	levelThreeType[i][j] = new Array();//创建三维数组
            	levelThreeType_img[i][j] = new Array();//创建三维数组

        		for (var z = 1; z < strData.length; z++) { //三重

        			if (categoryType[i]==strData[z].split(",")[6]) {

        				if (secondType[i][j]==strData[z].split(",")[7]) {

        					levelThreeType[i][j].push(strData[z].split(",")[8]);//把各自符合类型的数值添加到相应的位置
        					levelThreeType_img[i][j].push(strData[z].split(",")[1]);//把各自符合类型的数值添加到相应的位置
        				}
        			}
        		}
        	}
        }

        for (var i = 0; i < levelThreeType.length; i++) {//"三级"数组去重
        	for (var j = 0; j < levelThreeType[i].length; j++) {

        		levelThreeType[i][j]=distinct(levelThreeType[i][j]);//数组去重后重新赋值
        		levelThreeType_img[i][j].length=1;
        	}
        }
}

	function setHtmlName(obj,value){

		var int_1,htmlArr=[],htmlText_1='',htmlText_2='',htmlText_3='',htmlText='',if_int=true;

		for (var i = 0; i < categoryType.length; i++) {
		//	if (i18n.t(`Language.${categoryType[i]}`)==value) {
			if (categoryType[i]==value) {
				int_1=i;
				break;
			}
		}

	//	if (i18n.t(`Language.${categoryType[int_1]}`)!=undefined) {
		if (categoryType[int_1]!=undefined) {	

			$('.modelBase_link_model>div').hide();

			$('.modelBase_link_model>div').each(function(index,item){
			//	if ($(item).attr('categoryType') ==i18n.t(`Language.${categoryType[int_1]}`) ) {
				if ($(item).attr('categoryType') ==categoryType[int_1] ) {
					$(item).show();
					// console.log(1111);
					if_int=false;
				}else{
					$('.modelBase_link_model').hide();
				}
			})

			if (if_int) {
				for (var i in secondType[int_1]) {

					let strSecondTypeValue = secondType[int_1][i];
					strSecondTypeValue = strSecondTypeValue.replace('/','');

				//	htmlText_1='<div class="modelBase_type_listItem"><p class="modelBase_type_title">'+i18n.t(`Language.${strSecondTypeValue}`)+'</p><ul class="modelBase_type_listItem_block clearfloat">'
					htmlText_1='<div class="modelBase_type_listItem clearfloat"><p class="modelBase_type_title">'+strSecondTypeValue+'</p><img src="'+m_strHttp + 'jiaju/'+ levelThreeType_img[int_1][i]+'" /><ul class="modelBase_type_listItem_block clearfloat">'
					htmlText_2='';
					for (var j in levelThreeType[int_1][i]) {
						let strlevelThreeTypeValue = levelThreeType[int_1][i][j];
						strlevelThreeTypeValue = strlevelThreeTypeValue.replace('/','');

						htmlText_2+='<li index="'+int_1+'-'+i+'-'+j+'">'+strlevelThreeTypeValue+'</li>'
					}

					htmlText_3="</ul></div>";

					htmlText+=htmlText_1+htmlText_2+htmlText_3;
				}

				let strcategoryTypeValue = categoryType[int_1];
				// console.log();
				if (strcategoryTypeValue==undefined) {
					return;
				}
				
				if (strcategoryTypeValue.replace('/','')!=undefined) {
					strcategoryTypeValue = strcategoryTypeValue.replace('/','');
				}

				$('.modelBase_link_model').append('<div categoryType="'+strcategoryTypeValue+'">'+htmlText+'</div>');
				if_int=true;
			}

			$(".modelBase_link_model").show();
			var block_top=obj.offset().top+13,block_left=obj.offset().left;

			$(".modelBase_link_model").css({
				'top':block_top
			})
			$(".modelBase_link_model").css("transform","translateY(-10%)");

			if ($(window).height()-(block_top+$(".modelBase_link_model ").height())<=15) {
				$(".modelBase_link_model").css({
					'top':$(window).height()-$(".modelBase_link_model").outerHeight(true)
				})
			}else{
				$(".modelBase_link_model").css({top:block_top});
			}

		}

	}

function setHtmlName_old(obj,value){
	var int_1,htmlArr=[],htmlText_1='',htmlText_2='',htmlText_3='',htmlText='',if_int=true;

	for (var i = 0; i < categoryType.length; i++) {
		if (categoryType[i]==value) {
			int_1=i;
		}
	}
	if (categoryType[int_1]!=undefined) {

		$('.modelBase_link_model>div').hide();

		$('.modelBase_link_model>div').each(function(index,item){
			if ($(item).attr('categoryType')==categoryType[int_1]) {
				$(item).show();
				// console.log(1111);
				if_int=false;
			}
		})
		
		if (if_int) {
			for (var i in secondType[int_1]) {

				htmlText_1='<div class="modelBase_type_listItem"><p class="modelBase_type_title">'+secondType[int_1][i]+'</p><ul class="modelBase_type_listItem_block clearfloat">'
				htmlText_2='';
				for (var j in levelThreeType[int_1][i]) {
					htmlText_2+='<li index="'+int_1+'-'+i+'-'+j+'">'+levelThreeType[int_1][i][j]+'</li>'
				}

				htmlText_3="</ul></div>";

				htmlText+=htmlText_1+htmlText_2+htmlText_3;
			}

			$('.modelBase_link_model').append('<div categoryType="'+categoryType[int_1]+'">'+htmlText+'</div>');
			if_int=true;
		}

		$(".modelBase_link_model").show();
		var block_top=obj.offset().top+13,block_left=obj.offset().left;
		
		$(".modelBase_link_model").css({
			'top':block_top
		})
		$(".modelBase_link_model").css("transform","translateY(-10%)");
		
		if ($(window).height()-block_top-$(".listInfo-item-info-model").height()<=15) {
			$(".modelBase_link_model").css({
				'top':$(window).height()-$(".modelBase_link_model").outerHeight(true)
			})
		}else{
			$(".modelBase_link_model").css({top:block_top});
		}

	}

}

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

//判断数据是否为有效的模型
function IsEffectiveModel(arrData)
{
	if(arrData.length < 20)
	{
		return false;
	}

	var strThumbnail = arrData[1].toLowerCase();
	var strModelName= arrData[2].toLowerCase();

	//老版本的缩略图路径没有使用uuid,所以一定小于101长度
	if( strThumbnail.length < 101 || -1 != strModelName.indexOf(".a3d"))
	{
		return false;
	}

	return true;
}
//-----家具--------------------------------------------------------
	function initFurniture(int_1,int_2,int_3) 
	{
		let timestamp = new Date().getTime().toString();
		m_ObjGroup.length = 0;
		m_strObjData=$.ajax({url:m_strHttp+'jiaju/jiaju.csv?'+timestamp,async:false,});
   		var a1 = m_strObjData.responseText.split("\r\n");
   		var iIndex = 0;
	 	for(var i=1; i<a1.length; i++)
		{
			var s2 =a1[i];
			var a2 =s2.split(',');

			if(!IsEffectiveModel(a2))
				continue;

			var dataArray = new Array();
			var tempNodeLi;
			var if_flog;
			if (int_1==undefined && int_2==undefined && int_3==undefined) {
				if_flog=a2[1]!= undefined && a2[1] != null &&a2[2]!=null && a2[4]!=null && a2[6]=="家具";
			}else{
				if_flog=a2[1]!= undefined && a2[1] != null &&a2[2]!=null && a2[4]!=null && a2[6]==categoryType[int_1] && a2[7]==secondType[int_1][int_2] && a2[8]==levelThreeType[int_1][int_2][int_3];
			}

			if( if_flog )
			{
				var k   = a2[2].lastIndexOf(".");
				var str = a2[2].slice(k+1);
				if( str == "a3d")
					 continue;

				if (accountType==0) {
					tempNodeLi ='<li class="meshPic"><i class="icon iconfont icon-xinxi"></i><i class="icon iconfont icon-d-" id="'+iIndex+'-1"></i><i class="icon iconfont icon-xing"></i><img id="'+iIndex+'" src="'+m_strHttp + 'jiaju/'+ a2[1]+'" alt="image"  onclick="OnFurnitureImageClick(this);" ></li>';
				}else if(accountType==1){
					tempNodeLi ='<li class="meshPic"><i class="icon iconfont icon-xinxi"></i><i class="icon iconfont icon-xing"></i><img id="'+iIndex+'" src="'+m_strHttp + 'jiaju/'+ a2[1]+'" alt="image"  onclick="OnFurnitureImageClick(this);" ></li>';
				}
			  	dataArray.push(tempNodeLi);
				dataArray.push(a2);
				iIndex++;
				m_ObjGroup.push(dataArray);
			}
		}
 		if( m_ObjGroup.length > 0)
		{
			Mods_Arr=m_ObjGroup;
			totalCount = m_ObjGroup.length;
			totalPage = (totalCount + pageCount -1)/pageCount;
			setPager_Obj(0);
		  $("#ObjPageNum").text(1);
		  $("#ObjPageAccount").text(parseInt(totalPage));
		  $("#ObjPicNumber").text(totalCount);
		}
		else
		{
			totalCount 	= 0;
			totalPage 	= 0;
			curPage 	= 0;
		  $("#ObjPageNum").text(0);
		  $("#ObjPageAccount").text(parseInt(totalPage));
		  $("#ObjPicNumber").text(totalCount);
		  $('.mpLists_Furniture').html("");
		}
	}
	
	function setPager_Obj(fValue)              
	{      
		if(fValue <0 || (fValue+1)>totalPage){    				                  
			return;  
		}                  
		curPage = fValue;                  		      
		var curNum = fValue*pageCount;        

		$('.mpLists_Furniture').html("");
		
		m_pageObjData.length = 0;
		for(var i = 0; curNum<m_ObjGroup.length&&i<pageCount; i++,curNum++)
		{                      
			m_pageObjData.push(m_ObjGroup[curNum][0]);  
		}                  
		var temp=curPage+1; 
		$("#ObjPageNum").text(parseInt(temp));
		for(var i=0; i<m_pageObjData.length; i++) 		
		{
			$('.mpLists_Furniture').append(m_pageObjData[i]);
		}

	}	
		
    function OnFurnitureImageClick(that)
    {
    	  mHouseClass.mFurnitureClass.CreateObj(m_ObjGroup[that.id][1]);
    }
    
    
    //===============照明==========================================================================================	
 	function initLighting(int_1,int_2,int_3) 
	{
		m_ObjGroup_Lighting.length = 0;
   		var a1 = m_strObjData.responseText.split("\r\n");
   		var iIndex = 0;
	 	for(var i=1; i<a1.length; i++) 
		{
				var s2 =a1[i];
				var a2 =s2.split(',');

			    if(!IsEffectiveModel(a2))
				   continue;

				var dataArray = new Array();
				var tempNodeLi;	
				var if_flog;
				if (int_1==undefined && int_2==undefined && int_3==undefined) {
			//		if_flog=a2[1]!= undefined && a2[1] != null &&a2[2]!=null && a2[4]!=null && i18n.t(`Language.${a2[6]}`)==i18n.t(`Language.照明`);
					if_flog=a2[1]!= undefined && a2[1] != null &&a2[2]!=null && a2[4]!=null && a2[6]=="照明";
				}else{
			//		if_flog=a2[1]!= undefined && a2[1] != null &&a2[2]!=null && a2[4]!=null && i18n.t(`Language.${a2[6]}`)==i18n.t(`Language.${categoryType[int_1]}`) && i18n.t(`Language.${a2[7]}`)==i18n.t(`Language.${secondType[int_1][int_2]}`) && i18n.t(`Language.${a2[8]}`)==i18n.t(`Language.${levelThreeType[int_1][int_2][int_3]}`);
					if_flog=a2[1]!= undefined && a2[1] != null &&a2[2]!=null && a2[4]!=null && a2[6]==categoryType[int_1]&& a2[7]==secondType[int_1][int_2] && a2[8]==levelThreeType[int_1][int_2][int_3];

				}

				if( if_flog )	
				{
					var k   = a2[2].lastIndexOf(".");
					var str = a2[2].slice(k+1);
					if( str == "a3d")
						 continue;
					if (accountType==0){
						tempNodeLi ='<li class="meshPic"><i class="icon iconfont icon-xinxi"></i><i class="icon iconfont icon-d-" id="'+iIndex+'-1"></i><i class="icon iconfont icon-xing"></i><img id="'+iIndex+'" src="'+m_strHttp + 'jiaju/'+ a2[1]+'" alt="image"  onclick="OnLightingClick(this);" ></li>';
					}else if(accountType==1){
						tempNodeLi ='<li class="meshPic"><i class="icon iconfont icon-xinxi"></i><i class="icon iconfont icon-xing"></i><img id="'+iIndex+'" src="'+m_strHttp + 'jiaju/'+ a2[1]+'" alt="image"  onclick="OnLightingClick(this);" ></li>';
					}
					if (accountType==0){
					}else if(accountType==1){
					}
				  	dataArray.push(tempNodeLi);
					dataArray.push(a2);
					iIndex++;
					m_ObjGroup_Lighting.push(dataArray);
				}				 	
		}		
 		if( m_ObjGroup_Lighting.length > 0) 
		{
			totalCount_Lighting = m_ObjGroup_Lighting.length;
			totalPage_Lighting = (totalCount_Lighting + pageCount -1)/pageCount;
			setPager_Lighting(0);  
		  $("#LightingPageNum").text(1);
		  $("#LightingPageAccount").text(parseInt(totalPage_Lighting));
		  $("#LightingPicNumber").text(totalCount_Lighting);
		}
		else
		{
			totalCount_Lighting = 0;
			totalPage_Lighting 	= 0;
			curPage_Lighting 	= 0;
		  $("#LightingPageNum").text(0);
		  $("#LightingPageAccount").text(parseInt(totalPage_Lighting));
		  $("#LightingPicNumber").text(totalCount_Lighting);
		  $('.mpLists_Lighting').html("");
		}	
	}
	
	function setPager_Lighting(fValue)              
	{      
		if(fValue <0 || (fValue+1)>totalPage_Lighting){    				                  
			return;  
		}                  
		curPage_Lighting = fValue;                  		      
		var curNum = fValue*pageCount;        

		$('.mpLists_Lighting').html("");
		
		m_pageObjData_Lighting.length = 0;
		for(var i = 0; curNum<m_ObjGroup_Lighting.length&&i<pageCount; i++,curNum++)
		{                      
			m_pageObjData_Lighting.push(m_ObjGroup_Lighting[curNum][0]);  
		}                  
		var temp=curPage_Lighting+1; 
		$("#LightingPageNum").text(parseInt(temp));
		for(var i=0; i<m_pageObjData_Lighting.length; i++) 		
		{
			$('.mpLists_Lighting').append(m_pageObjData_Lighting[i]);
		}
	}	
		
    function OnLightingClick(that)
    {
    	 mHouseClass.mFurnitureClass.CreateObj(m_ObjGroup_Lighting[that.id][1]);
    }   
    
    //===============橱柜==========================================================================================	
 	function initCupboard(int_1,int_2,int_3) 
	{
		m_ObjGroup_Cupboard.length = 0;
   		var a1 = m_strObjData.responseText.split("\r\n");
   		var iIndex = 0;
	 	for(var i=1; i<a1.length; i++) 
		{
				var s2 =a1[i];
				var a2 =s2.split(',');

			    if(!IsEffectiveModel(a2))
				  continue;

				var dataArray = new Array();
				var tempNodeLi;	
				var if_flog;
				if (int_1==undefined && int_2==undefined && int_3==undefined) {
				//	if_flog=a2[1]!= undefined && a2[1] != null &&a2[2]!=null && a2[4]!=null && i18n.t(`Language.${a2[6]}`)==i18n.t(`Language.厨卫`);
					if_flog=a2[1]!= undefined && a2[1] != null &&a2[2]!=null && a2[4]!=null && a2[6]=="厨卫";
				}else{
				//	if_flog=a2[1]!= undefined && a2[1] != null &&a2[2]!=null && a2[4]!=null && i18n.t(`Language.${a2[6]}`)==i18n.t(`Language.${categoryType[int_1]}`) && i18n.t(`Language.${a2[7]}`)==i18n.t(`Language.${secondType[int_1][int_2]}`) && i18n.t(`Language.${a2[8]}`)==i18n.t(`Language.${levelThreeType[int_1][int_2][int_3]}`);				
					if_flog=a2[1]!= undefined && a2[1] != null &&a2[2]!=null && a2[4]!=null && a2[6]==categoryType[int_1] &&a2[7]==secondType[int_1][int_2] && a2[8] == levelThreeType[int_1][int_2][int_3];
				}				
				if( if_flog )	
				{
					var k   = a2[2].lastIndexOf(".");
					var str = a2[2].slice(k+1);
					if( str == "a3d")
						 continue;
					if (accountType==0){
						tempNodeLi ='<li class="meshPic"><i class="icon iconfont icon-xinxi"></i><i class="icon iconfont icon-d-" id="'+iIndex+'-1"></i><i class="icon iconfont icon-xing"></i><img id="'+iIndex+'" src="'+m_strHttp + 'jiaju/'+ a2[1]+'" alt="image"  onclick="OnCupboardClick(this);" ></li>';
					}else if(accountType==1){
						tempNodeLi ='<li class="meshPic"><i class="icon iconfont icon-xinxi"></i><i class="icon iconfont icon-xing"></i><img id="'+iIndex+'" src="'+m_strHttp + 'jiaju/'+ a2[1]+'" alt="image"  onclick="OnCupboardClick(this);" ></li>';
					}
				  	dataArray.push(tempNodeLi);
					dataArray.push(a2);
					iIndex++;
					m_ObjGroup_Cupboard.push(dataArray);
				}				 	
		}		
 		if( m_ObjGroup_Cupboard.length > 0) 
		{
		  totalCount_Cupboard = m_ObjGroup_Cupboard.length;
		  totalPage_Cupboard  = (totalCount_Cupboard + pageCount -1)/pageCount;
		  setPager_Cupboard(0);  
		  $("#CupboardPageNum").text(1);
		  $("#CupboardPageAccount").text(parseInt(totalPage_Cupboard));
		  $("#CupboardPicNumber").text(totalCount_Cupboard);
		}
		else
		{
			totalCount_Cupboard = 0;
			totalPage_Cupboard 	= 0;
			curPage_Cupboard 	= 0;
		  $("#CupboardPageNum").text(0);
		  $("#CupboardPageAccount").text(parseInt(totalPage_Cupboard));
		  $("#CupboardPicNumber").text(totalCount_Cupboard);
		  $('.mpLists_Cupboard').html("");
		}	
	}
	
	function setPager_Cupboard(fValue)              
	{      
		if(fValue <0 || (fValue+1)>totalPage_Cupboard){    				                  
			return;  
		}                  
		curPage_Cupboard = fValue;                  		      
		var curNum = fValue*pageCount;        

		$('.mpLists_Cupboard').html("");
		
		m_pageObjData_Cupboard.length = 0;
		for(var i = 0; curNum<m_ObjGroup_Cupboard.length&&i<pageCount; i++,curNum++)
		{                      
			m_pageObjData_Cupboard.push(m_ObjGroup_Cupboard[curNum][0]);  
		}                  
		var temp=curPage_Cupboard+1; 
		$("#CupboardPageNum").text(parseInt(temp));
		for(var i=0; i<m_pageObjData_Cupboard.length; i++) 		
		{
			$('.mpLists_Cupboard').append(m_pageObjData_Cupboard[i]);
		}
	}	
		
    function OnCupboardClick(that)
    {
    	 mHouseClass.mFurnitureClass.CreateObj(m_ObjGroup_Cupboard[that.id][1]);
   //  	  $(".hover_img").attr("src",that.src);
			// moverBlok(".hover_img");	
    }      

	//===============硬装==========================================================================================	
	function initMat(int_1,int_2) 
 	{
 		m_MatGroup.length = 0;
 		var strObjData=$.ajax({url:m_strHttp+'texture/huawen.csv',async:false,});
 		m_strMatData = strObjData;
       	MatArr_cont = strObjData.responseText.split("\r\n");
        // setMatHtml(a1);
       	var iIndex = 0;
    	for(var i=1; i<MatArr_cont.length; i++) 
		{
			var s2 =MatArr_cont[i];
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
					tempNodeLi = '<li class="meshPic"><img id="' + iIndex + '" src="' + m_strHttp + 'texture/' + a2[1] +'" alt="image"  onclick="OnYouingZhuangImageClick(this);" ></li>';
				}else if(accountType==1){
					tempNodeLi = '<li class="meshPic"><img id="' + iIndex + '" src="' + m_strHttp + 'texture/' + a2[1] +'" alt="image"  onclick="OnYouingZhuangImageClick(this);" ></li>';
				}
			  	dataArray.push(tempNodeLi);
				dataArray.push(a2);
				iIndex++;
				m_MatGroup.push(dataArray);
			}				 	
		}
	 	if( m_MatGroup.length > 0) 
		{
			totalCount_Mat = m_MatGroup.length;
			totalPage_Mat = (totalCount_Mat + pageCount -1)/pageCount;
			setPager_Mat(0);  
			$("#MatPageNum").text(1);
			$("#MatPageAccount").text(parseInt(totalPage_Mat));
			$("#MatPicNumber").text(totalCount_Mat);
		}
		else
		{
			totalCount_Mat 	= 0;
			totalPage_Mat 	= 0;
			curPage_Mat 	= 0;
			$("#MatPageNum").text(0);
			$("#MatPageAccount").text(parseInt(totalPage_Mat));
			$("#MatPicNumber").text(totalCount_Mat);
		}	
 	}
 		
	function setPager_Mat(fValue)              
	{      
		if(fValue <0 || (fValue+1)>totalPage_Mat){    				                  
			return;  
		}                  
		curPage_Mat = fValue;                  	     
		var curNum = fValue*pageCount;         

		$('.mpLists_Mat').html("");

		$("#MatPageNum").text(Math.floor(fValue)+1);
		
		m_pageData_Mat.length = 0;
		for(var i = 0; curNum<m_MatGroup.length&&i<pageCount; i++,curNum++)
		{                      
			m_pageData_Mat.push(m_MatGroup[curNum][0]);  
		}                  
		var temp=curPage_Mat+1;                  
		for(var i=0; i<m_pageData_Mat.length; i++) 		
		{
			$('.mpLists_Mat').append(m_pageData_Mat[i]);
		}
	}	
	function setMatHtml(_obj){
		// console.log(MatArr_cont);

		var _top=$(_obj).offset().top;
		$('.modelBase_Mat_model').css("top",_top-100);
		$('.modelBase_Mat_model').show();

		if ($('.modelBase_Mat_scrollbar').html()!='') {
			return;
		}
		
		var MatArr_split=[],MatArr_1=[],MatArr_2=[],MatHtml=[],HTmlText_1='',HTmlText_2='',MatArr_img=[];
		for(var i in MatArr_cont){
			if (MatArr_cont[i]!='') {
				MatArr_split.push(MatArr_cont[i].split(','));
				MatArr_1.push(MatArr_cont[i].split(',')[3])
			}
		}

		MatArr_1=distinct(MatArr_1);
		
		for(var i in MatArr_1){
			MatArr_2[i] = Array();
			MatArr_img[i] = Array();
			for(var j in MatArr_split){
				if (MatArr_split[j][3]==MatArr_1[i]) {
					MatArr_2[i].push(MatArr_split[j][4]);
					MatArr_img[i].push(MatArr_split[j][1]);
				}
			}
		}

		for (var i in MatArr_2) {
			MatArr_2[i]=distinct(MatArr_2[i]);
			MatArr_img[i].length=1;
		}


		for (var i in MatArr_1) {
			HTmlText_2='';
			
			HTmlText_1='<p class="modelBase_type_title">'+MatArr_1[i]+'</p>';
			for (var j in MatArr_2[i]) {
				HTmlText_2+='<li index="'+MatArr_1[i]+'-'+MatArr_2[i][j]+'">'+MatArr_2[i][j]+'</li>';
			}

			let setHtml='<div class="modelBase_type_listItem">'+HTmlText_1+'<img src="' + m_strHttp + 'texture/' + MatArr_img[i][0] +'" /><ul class="modelBase_type_listItem_block clearfloat">'+HTmlText_2+'</ul></div>'
			$('.modelBase_Mat_scrollbar').append(setHtml);

		}


	}
	
	// var g_dataTex = null;
    function OnImageClick(that)
    {
    	g_dataTex = Mods_Arr[that.id][1];
    	m_cPenType = 6;
 	 	$(".hover_img").attr("src",that.src);
		moverBlok(".hover_img");	
    }

    //硬装点击
    function OnYouingZhuangImageClick(that) {
		g_dataTex = m_MatGroup[that.id][1];
		m_cPenType = 6;
		$(".hover_img").attr("src", that.src);
		moverBlok(".hover_img");
	}

   	// ===========家电==============================================

   	function intAppliance(int_1,int_2,int_3) 
 	{
 		m_ApplianceGroup.length = 0;
 		var a1 = m_strObjData.responseText.split("\r\n");
       	var iIndex = 0;
    	for(var i=1; i<a1.length; i++) 
		{
			var s2 =a1[i];
			var a2 =s2.split(',');

			if(!IsEffectiveModel(a2))
				continue;

			var dataArray = new Array();
			var tempNodeLi;	
			var if_flog;
			if (int_1==undefined && int_2==undefined && int_3==undefined) {
		//		if_flog=a2[1]!= undefined && a2[1] != null &&a2[2]!=null && a2[4]!=null && i18n.t(`Language.${a2[6]}`)==i18n.t(`Language.家电`);;
				if_flog=a2[1]!= undefined && a2[1] != null &&a2[2]!=null && a2[4]!=null && a2[6]=="家电";
			}else{
		//		if_flog=a2[1]!= undefined && a2[1] != null &&a2[2]!=null && a2[4]!=null && i18n.t(`Language.${a2[6]}`)==i18n.t(`Language.${categoryType[int_1]}`) && i18n.t(`Language.${a2[7]}`)==i18n.t(`Language.${secondType[int_1][int_2]}`) && i18n.t(`Language.${a2[8]}`)==i18n.t(`Language.${levelThreeType[int_1][int_2][int_3]}`);				
				if_flog=a2[1]!= undefined && a2[1] != null &&a2[2]!=null && a2[4]!=null && a2[6]==categoryType[int_1] && a2[7] ==secondType[int_1][int_2] && a2[8]==levelThreeType[int_1][int_2][int_3];
			}		
			if( if_flog )	
			{
				var k   = a2[2].lastIndexOf(".");
				var str = a2[2].slice(k+1);
				if( str == "a3d")
					 continue;

				if (accountType==0){
					tempNodeLi ='<li class="meshPic"><i class="icon iconfont icon-xinxi"></i><i class="icon iconfont icon-d-" id="'+iIndex+'-1"></i><i class="icon iconfont icon-xing"></i><img id="'+iIndex+'" src="'+m_strHttp + 'jiaju/'+ a2[1]+'" alt="image"  onclick="OnImageClick_Appliance(this);" ></li>';
				}else if(accountType==1){
					tempNodeLi ='<li class="meshPic"><i class="icon iconfont icon-xinxi"></i><i class="icon iconfont icon-xing"></i><img id="'+iIndex+'" src="'+m_strHttp + 'jiaju/'+ a2[1]+'" alt="image"  onclick="OnImageClick_Appliance(this);" ></li>';
				}
			  	dataArray.push(tempNodeLi);
				dataArray.push(a2);
				iIndex++;
				m_ApplianceGroup.push(dataArray);
			}				 	
		}
	 	if( m_ApplianceGroup.length > 0) 
		{
			totalCount_Appliance = m_ApplianceGroup.length;
			totalPage_Appliance = (totalCount_Appliance + pageCount -1)/pageCount;
			setPager_Appliance(0);  
			$("#ApplianceageNum").text(1);
			$("#AppliancePageAccount").text(parseInt(totalPage_Appliance));
			$("#AppliancePicNumber").text(totalCount_Appliance);
		}
		else
		{
			totalCount_Appliance 	= 0;
			totalPage_Appliance 	= 0;
			curPage_Appliance 	= 0;
			$("#ApplianceageNum").text(0);
			$("#AppliancePageAccount").text(parseInt(totalPage_Appliance));
			$("#AppliancePicNumber").text(totalCount_Appliance);
			$('.mpLists_Appliance').html("");
		}	
 	}
 		
	function setPager_Appliance(fValue)              
	{   

		// console.log(fValue);
		if(fValue <0 || (fValue+1)>totalPage_Appliance){    				                  
			return;  
		}                  
		curPage_Appliance = fValue;                  	     
		var curNum = fValue*pageCount;         

		$('.mpLists_Appliance').html("");
		$("#ApplianceageNum").text(fValue+1);
		
		m_pageData_Appliance.length = 0;
		for(var i = 0; curNum<m_ApplianceGroup.length&&i<pageCount; i++,curNum++)
		{                      
			m_pageData_Appliance.push(m_ApplianceGroup[curNum][0]);  
		}                  
		var temp=curPage_Appliance+1;                  
		for(var i=0; i<m_pageData_Appliance.length; i++) 		
		{
			$('.mpLists_Appliance').append(m_pageData_Appliance[i]);
		}
	}	

    function OnImageClick_Appliance(that)
    {
    	 	mHouseClass.mFurnitureClass.CreateObj(m_ApplianceGroup[that.id][1]);
   //  	 	$(".hover_img").attr("src",that.src);
			// moverBlok(".hover_img");	
    }
	

	// ===========家饰==============================================

	function intDecoration(int_1,int_2,int_3) 
 	{
 		m_DecorationGroup.length = 0;
 		var a1 = m_strObjData.responseText.split("\r\n");
       	var iIndex = 0;
    	for(var i=1; i<a1.length; i++) 
		{
			var s2 =a1[i];
			var a2 =s2.split(',');

			if(!IsEffectiveModel(a2))
				continue;

			var dataArray = new Array();
			var tempNodeLi;	
			var if_flog;
			if (int_1==undefined && int_2==undefined && int_3==undefined) {
			//	if_flog=a2[1]!= undefined && a2[1] != null &&a2[2]!=null && a2[4]!=null && i18n.t(`Language.${a2[6]}`)==i18n.t(`Language.家饰`);
				if_flog=a2[1]!= undefined && a2[1] != null &&a2[2]!=null && a2[4]!=null && a2[6]=="家饰";			
			}else{
			//	if_flog=a2[1]!= undefined && a2[1] != null &&a2[2]!=null && a2[4]!=null &&
			//		i18n.t(`Language.${a2[6]}`)==i18n.t(`Language.${categoryType[int_1]}`) && i18n.t(`Language.${a2[7]}`)==i18n.t(`Language.${secondType[int_1][int_2]}`) && i18n.t(`Language.${a2[8]}`)==i18n.t(`Language.${levelThreeType[int_1][int_2][int_3]}`);
				if_flog=a2[1]!= undefined && a2[1] != null &&a2[2]!=null && a2[4]!=null &&
					a2[6]==categoryType[int_1] && a2[7] == secondType[int_1][int_2] && a2[8] ==levelThreeType[int_1][int_2][int_3];
		
			}
			if( if_flog )	
			{
				var k   = a2[2].lastIndexOf(".");
				var str = a2[2].slice(k+1);
				if( str == "a3d")
					 continue;
				if (accountType==0){
					tempNodeLi ='<li class="meshPic"><i class="icon iconfont icon-xinxi"></i><i class="icon iconfont icon-d-" id="'+iIndex+'-1"></i><i class="icon iconfont icon-xing"></i><img id="'+iIndex+'" src="'+m_strHttp + 'jiaju/'+ a2[1]+'" alt="image"  onclick="OnImageClick_Decoration(this);" ></li>';
				}else if(accountType==1){
					tempNodeLi ='<li class="meshPic"><i class="icon iconfont icon-xinxi"></i><i class="icon iconfont icon-xing"></i><img id="'+iIndex+'" src="'+m_strHttp + 'jiaju/'+ a2[1]+'" alt="image"  onclick="OnImageClick_Decoration(this);" ></li>';
				}
			  	dataArray.push(tempNodeLi);
				dataArray.push(a2);
				iIndex++;
				m_DecorationGroup.push(dataArray);
			}				 	
		}
	 	if( m_DecorationGroup.length > 0) 
		{
			totalCount_Decoration = m_DecorationGroup.length;
			totalPage_Decoration = (totalCount_Decoration + pageCount -1)/pageCount;
			setPager_Decoration(0);  
			$("#DecorationageNum").text(1);
			$("#DecorationPageAccount").text(parseInt(totalPage_Decoration));
			$("#DecorationPicNumber").text(totalCount_Decoration);
		}
		else
		{
			totalCount_Decoration 	= 0;
			totalPage_Decoration 	= 0;
			curPage_Decoration 	= 0;
			$("#DecorationageNum").text(0);
			$("#DecorationPageAccount").text(parseInt(totalPage_Decoration));
			$("#DecorationPicNumber").text(totalCount_Decoration);
			$('.mpLists_Decoration').html("");
		}	
 	}
 		
	function setPager_Decoration(fValue)              
	{   

		// console.log(fValue);
		if(fValue <0 || (fValue+1)>totalPage_Decoration){    				                  
			return;  
		}                  
		curPage_Decoration = fValue;                  	     
		var curNum = fValue*pageCount;         

		$('.mpLists_Decoration').html("");
		$("#DecorationageNum").text(fValue+1);
		
		m_pageData_Decoration.length = 0;
		for(var i = 0; curNum<m_DecorationGroup.length&&i<pageCount; i++,curNum++)
		{                      
			m_pageData_Decoration.push(m_DecorationGroup[curNum][0]);  
		}                  
		var temp=curPage_Decoration+1;                  
		for(var i=0; i<m_pageData_Decoration.length; i++) 		
		{
			$('.mpLists_Decoration').append(m_pageData_Decoration[i]);
		}
	}	

    function OnImageClick_Decoration(that)
    {
    	 	mHouseClass.mFurnitureClass.CreateObj(m_DecorationGroup[that.id][1]);
   //  	 	$(".hover_img").attr("src",that.src);
			// moverBlok(".hover_img");	
    }


    // ===========工装==============================================

	function intTooling(int_1,int_2,int_3) 
 	{
 		m_ToolingGroup.length = 0;
 		var a1 = m_strObjData.responseText.split("\r\n");
       	var iIndex = 0;
    	for(var i=1; i<a1.length; i++) 
		{
			var s2 =a1[i];
			var a2 =s2.split(',');

			if(!IsEffectiveModel(a2))
				continue;

			var dataArray = new Array();
			var tempNodeLi;	
			var if_flog;
			if (int_1==undefined && int_2==undefined && int_3==undefined) {
			//	if_flog=a2[1]!= undefined && a2[1] != null &&a2[2]!=null && a2[4]!=null && i18n.t(`Language.${a2[6]}`)==i18n.t(`Language.工装`);
				if_flog=a2[1]!= undefined && a2[1] != null &&a2[2]!=null && a2[4]!=null && a2[6]=="工装";
			}else{
			//	if_flog=a2[1]!= undefined && a2[1] != null &&a2[2]!=null && a2[4]!=null && i18n.t(`Language.${a2[6]}`)==i18n.t(`Language.${categoryType[int_1]}`) && i18n.t(`Language.${a2[7]}`)==i18n.t(`Language.${secondType[int_1][int_2]}`) && i18n.t(`Language.${a2[8]}`)==i18n.t(`Language.${levelThreeType[int_1][int_2][int_3]}`);
				if_flog=a2[1]!= undefined && a2[1] != null &&a2[2]!=null && a2[4]!=null && 
					a2[6]==categoryType[int_1] && a2[7] ==secondType[int_1][int_2] && a2[8] ==levelThreeType[int_1][int_2][int_3];
			}
			if( if_flog )	
			{
				var k   = a2[2].lastIndexOf(".");
				var str = a2[2].slice(k+1);
				if( str == "a3d")
					 continue;
				if (accountType==0){
					tempNodeLi ='<li class="meshPic"><i class="icon iconfont icon-xinxi"></i><i class="icon iconfont icon-d-" id="'+iIndex+'-1"></i><i class="icon iconfont icon-xing"></i><img id="'+iIndex+'" src="'+m_strHttp + 'jiaju/'+ a2[1]+'" alt="image"  onclick="OnImageClick_Tooling(this);" ></li>';
				}else if(accountType==1){
					tempNodeLi ='<li class="meshPic"><i class="icon iconfont icon-xinxi"></i><i class="icon iconfont icon-xing"></i><img id="'+iIndex+'" src="'+m_strHttp + 'jiaju/'+ a2[1]+'" alt="image"  onclick="OnImageClick_Tooling(this);" ></li>';
				}
			  	dataArray.push(tempNodeLi);
				dataArray.push(a2);
				iIndex++;
				m_ToolingGroup.push(dataArray);
			}				 	
		}
	 	if( m_ToolingGroup.length > 0) 
		{
			totalCount_Tooling = m_ToolingGroup.length;
			totalPage_Tooling = (totalCount_Tooling + pageCount -1)/pageCount;
			setPager_Tooling(0);  
			$("#ToolingageNum").text(1);
			$("#ToolingPageAccount").text(parseInt(totalPage_Tooling));
			$("#ToolingPicNumber").text(totalCount_Tooling);
		}
		else
		{
			totalCount_Tooling 	= 0;
			totalPage_Tooling 	= 0;
			curPage_Tooling 	= 0;
			$("#ToolingageNum").text(0);
			$("#ToolingPageAccount").text(parseInt(totalPage_Tooling));
			$("#ToolingPicNumber").text(totalCount_Tooling);
			$('.mpLists_Tooling').html("");
		}	
 	}
 		
	function setPager_Tooling(fValue)              
	{   

		// console.log(fValue);
		if(fValue <0 || (fValue+1)>totalPage_Tooling){    				                  
			return;  
		}                  
		curPage_Tooling = fValue;                  	     
		var curNum = fValue*pageCount;         

		$('.mpLists_Tooling').html("");
		$("#ToolingageNum").text(fValue+1);
		
		m_pageData_Tooling.length = 0;
		for(var i = 0; curNum<m_ToolingGroup.length&&i<pageCount; i++,curNum++)
		{                      
			m_pageData_Tooling.push(m_ToolingGroup[curNum][0]);  
		}                  
		var temp=curPage_Tooling+1;
		for(var i=0; i<m_pageData_Tooling.length; i++) 		
		{
			$('.mpLists_Tooling').append(m_pageData_Tooling[i]);
		}
	}	

    function OnImageClick_Tooling(that)
    {
		   mHouseClass.mFurnitureClass.CreateObj(m_ToolingGroup[that.id][1]);
   //  	 	$(".hover_img").attr("src",that.src);
			// moverBlok(".hover_img");	
    }



    // ===========实验台柜==============================================

	function intCabinet(int_1,int_2,int_3) 
 	{
 		m_CabinetGroup.length = 0;
 		var a1 = m_strObjData.responseText.split("\r\n");
       	var iIndex = 0;
    	for(var i=1; i<a1.length; i++) 
		{
			var s2 =a1[i];
			var a2 =s2.split(',');

			if(!IsEffectiveModel(a2))
				continue;

			var dataArray = new Array();
			var tempNodeLi;	
			var if_flog;
			if (int_1==undefined && int_2==undefined && int_3==undefined) {
			//	if_flog=a2[1]!= undefined && a2[1] != null &&a2[2]!=null && a2[4]!=null && i18n.t(`Language.${a2[6]}`)==i18n.t(`Language.实验台柜`);
				if_flog=a2[1]!= undefined && a2[1] != null &&a2[2]!=null && a2[4]!=null && a2[6]=="实验台柜";
			
			}else{
			//	if_flog=a2[1]!= undefined && a2[1] != null &&a2[2]!=null && a2[4]!=null && i18n.t(`Language.${a2[6]}`)==i18n.t(`Language.${categoryType[int_1]}`) && i18n.t(`Language.${a2[7]}`)==i18n.t(`Language.${secondType[int_1][int_2]}`) && i18n.t(`Language.${a2[8]}`)==i18n.t(`Language.${levelThreeType[int_1][int_2][int_3]}`);
				if_flog=a2[1]!= undefined && a2[1] != null &&a2[2]!=null && a2[4]!=null && 
					a2[6]==categoryType[int_1] && a2[7] ==secondType[int_1][int_2] && a2[8] ==levelThreeType[int_1][int_2][int_3];
			}
			if( if_flog )	
			{
				var k   = a2[2].lastIndexOf(".");
				var str = a2[2].slice(k+1);
				if( str == "a3d")
					 continue;
				if (accountType==0){
					tempNodeLi ='<li class="meshPic"><i class="icon iconfont icon-xinxi"></i><i class="icon iconfont icon-d-" id="'+iIndex+'-1"></i><i class="icon iconfont icon-xing"></i><img id="'+iIndex+'" src="'+m_strHttp + 'jiaju/'+ a2[1]+'" alt="image"  onclick="OnImageClick_Cabinet(this);" ></li>';
				}else if(accountType==1){
					tempNodeLi ='<li class="meshPic"><i class="icon iconfont icon-xinxi"></i><i class="icon iconfont icon-xing"></i><img id="'+iIndex+'" src="'+m_strHttp + 'jiaju/'+ a2[1]+'" alt="image"  onclick="OnImageClick_Cabinet(this);" ></li>';
				}
			  	dataArray.push(tempNodeLi);
				dataArray.push(a2);
				iIndex++;
				m_CabinetGroup.push(dataArray);
			}				 	
		}
	 	if( m_CabinetGroup.length > 0) 
		{
			totalCount_Cabinet = m_CabinetGroup.length;
			totalPage_Cabinet = (totalCount_Cabinet + pageCount -1)/pageCount;
			setPager_Cabinet(0);  
			$("#CabinetageNum").text(1);
			$("#CabinetPageAccount").text(parseInt(totalPage_Cabinet));
			$("#CabinetPicNumber").text(totalCount_Cabinet);
		}
		else
		{
			totalCount_Cabinet 	= 0;
			totalPage_Cabinet 	= 0;
			curPage_Cabinet 	= 0;
			$("#CabinetageNum").text(0);
			$("#CabinetPageAccount").text(parseInt(totalPage_Cabinet));
			$("#CabinetPicNumber").text(totalCount_Cabinet);
			$('.mpLists_Cabinet').html("");
		}	
 	}
 		
	function setPager_Cabinet(fValue)              
	{   

		// console.log(fValue);
		if(fValue <0 || (fValue+1)>totalPage_Cabinet){    				                  
			return;  
		}                  
		curPage_Cabinet = fValue;                  	     
		var curNum = fValue*pageCount;         

		$('.mpLists_Cabinet').html("");
		$("#CabinetageNum").text(fValue+1);
		
		m_pageData_Cabinet.length = 0;
		for(var i = 0; curNum<m_CabinetGroup.length&&i<pageCount; i++,curNum++)
		{                      
			m_pageData_Cabinet.push(m_CabinetGroup[curNum][0]);  
		}                  
		var temp=curPage_Cabinet+1;
		for(var i=0; i<m_pageData_Cabinet.length; i++) 		
		{
			$('.mpLists_Cabinet').append(m_pageData_Cabinet[i]);
		}
	}	

    function OnImageClick_Cabinet(that)
    {
		    mHouseClass.mFurnitureClass.CreateObj(m_CabinetGroup[that.id][1]);
   //  	 	$(".hover_img").attr("src",that.src);
			// moverBlok(".hover_img");	
    }


    // ===========会展==============================================

	function intExhibition(int_1,int_2,int_3) 
 	{
 		m_ExhibitionGroup.length = 0;
 		var a1 = m_strObjData.responseText.split("\r\n");
       	var iIndex = 0;
    	for(var i=1; i<a1.length; i++) 
		{
			var s2 =a1[i];
			var a2 =s2.split(',');

			if(!IsEffectiveModel(a2))
				continue;

			var dataArray = new Array();
			var tempNodeLi;	
			var if_flog;
			if (int_1==undefined && int_2==undefined && int_3==undefined) {
			//	if_flog=a2[1]!= undefined && a2[1] != null &&a2[2]!=null && a2[4]!=null && i18n.t(`Language.${a2[6]}`)==i18n.t(`Language.会展`);
				if_flog=a2[1]!= undefined && a2[1] != null &&a2[2]!=null && a2[4]!=null && a2[6] == "会展";
			
			}else{
			//	if_flog=a2[1]!= undefined && a2[1] != null &&a2[2]!=null && a2[4]!=null && i18n.t(`Language.${a2[6]}`)==i18n.t(`Language.${categoryType[int_1]}`) && i18n.t(`Language.${a2[7]}`)==i18n.t(`Language.${secondType[int_1][int_2]}`) && i18n.t(`Language.${a2[8]}`)==i18n.t(`Language.${levelThreeType[int_1][int_2][int_3]}`);
				if_flog=a2[1]!= undefined && a2[1] != null &&a2[2]!=null && a2[4]!=null && 
					a2[6] == categoryType[int_1] && a2[7] == secondType[int_1][int_2] && a2[8]==levelThreeType[int_1][int_2][int_3];
			}
			if( if_flog )	
			{
				var k   = a2[2].lastIndexOf(".");
				var str = a2[2].slice(k+1);
				if( str == "a3d")
					 continue;
				if (accountType==0){
					tempNodeLi ='<li class="meshPic"><i class="icon iconfont icon-xinxi"></i><i class="icon iconfont icon-d-" id="'+iIndex+'-1"></i><i class="icon iconfont icon-xing"></i><img id="'+iIndex+'" src="'+m_strHttp + 'jiaju/'+ a2[1]+'" alt="image"  onclick="OnImageClick_Exhibition(this);" ></li>';
				}else if(accountType==1){
					tempNodeLi ='<li class="meshPic"><i class="icon iconfont icon-xinxi"></i><i class="icon iconfont icon-xing"></i><img id="'+iIndex+'" src="'+m_strHttp + 'jiaju/'+ a2[1]+'" alt="image"  onclick="OnImageClick_Exhibition(this);" ></li>';
				}
			  	dataArray.push(tempNodeLi);
				dataArray.push(a2);
				iIndex++;
				m_ExhibitionGroup.push(dataArray);
			}				 	
		}
	 	if( m_ExhibitionGroup.length > 0) 
		{
			totalCount_Exhibition = m_ExhibitionGroup.length;
			totalPage_Exhibition = (totalCount_Exhibition + pageCount -1)/pageCount;
			setPager_Exhibition(0);  
			$("#ExhibitionageNum").text(1);
			$("#ExhibitionPageAccount").text(parseInt(totalPage_Exhibition));
			$("#ExhibitionPicNumber").text(totalCount_Exhibition);
		}
		else
		{
			totalCount_Exhibition 	= 0;
			totalPage_Exhibition 	= 0;
			curPage_Exhibition 	= 0;
			$("#ExhibitionageNum").text(0);
			$("#ExhibitionPageAccount").text(parseInt(totalPage_Exhibition));
			$("#ExhibitionPicNumber").text(totalCount_Exhibition);
			$('.mpLists_Exhibition').html("");
		}	
 	}
 		
	function setPager_Exhibition(fValue)              
	{   

		// console.log(fValue);
		if(fValue <0 || (fValue+1)>totalPage_Exhibition){
			return;  
		}
		curPage_Exhibition = fValue;
		var curNum = fValue*pageCount;         

		$('.mpLists_Exhibition').html("");
		$("#ExhibitionageNum").text(fValue+1);
		
		m_pageData_Exhibition.length = 0;
		for(var i = 0; curNum<m_ExhibitionGroup.length&&i<pageCount; i++,curNum++)
		{                      
			m_pageData_Exhibition.push(m_ExhibitionGroup[curNum][0]);  
		}                  
		var temp=curPage_Exhibition+1;
		for(var i=0; i<m_pageData_Exhibition.length; i++) 		
		{
			$('.mpLists_Exhibition').append(m_pageData_Exhibition[i]);
		}
	}	

    function OnImageClick_Exhibition(that)
    {
		mHouseClass.mFurnitureClass.CreateObj(m_ExhibitionGroup[that.id][1]);
	   //$(".hover_img").attr("src",that.src);
	   // moverBlok(".hover_img");	
    }


// ===========搜索==============================================

	function intsearch(sArr) 
 	{
 		m_searchGroup.length = 0;
 		var a1 = sArr;
       	var iIndex = 0;
    	for(var i=1; i<a1.length; i++) 
		{
			var s2 =a1[i];
			var a2 =s2.split(',');

			if (MatType==1) {
				if(!IsEffectiveModel(a2))
					continue;
			}

			var dataArray = new Array();
			var tempNodeLi;	
			var if_flog=true;	
			if( if_flog )	
			{
				var k   = a2[2].lastIndexOf(".");
				var str = a2[2].slice(k+1);
				if( str == "a3d")
					 continue;
				if (accountType==0){
					if (MatType==1) {
						tempNodeLi ='<li class="meshPic"><i class="icon iconfont icon-xinxi"></i><i class="icon iconfont icon-d-" id="'+iIndex+'-1"></i><i class="icon iconfont icon-xing"></i><img id="'+iIndex+'" src="'+m_strHttp + 'jiaju/'+ a2[1]+'" alt="image"  onclick="OnImageClick_search(this);" ></li>';
					}else if(MatType==2){
						tempNodeLi ='<li class="meshPic"><img id="'+iIndex+'" src="'+m_strHttp + 'texture/'+ a2[1]+'" alt="image"  onclick="OnImageClick(this);" ></li>';
					}
				}else if(accountType==1){
					if (MatType==1) {
						tempNodeLi ='<li class="meshPic"><i class="icon iconfont icon-xinxi"></i><i class="icon iconfont icon-xing"></i><img id="'+iIndex+'" src="'+m_strHttp + 'jiaju/'+ a2[1]+'" alt="image"  onclick="OnImageClick_search(this);" ></li>';
					}else if(MatType==2){
						tempNodeLi ='<li class="meshPic"><img id="'+iIndex+'" src="'+m_strHttp + 'texture/'+ a2[1]+'" alt="image"  onclick="OnImageClick(this);" ></li>';
					}
				}
			  	dataArray.push(tempNodeLi);
				dataArray.push(a2);
				iIndex++;
				m_searchGroup.push(dataArray);
			}				 	
		}
	 	if( m_searchGroup.length > 0) 
		{
			totalCount_search = m_searchGroup.length;
			totalPage_search = (totalCount_search + pageCount -1)/pageCount;
			setPager_search(0);  
			$("#searchageNum").text(1);
			$("#searchPageAccount").text(parseInt(totalPage_search));
			$("#searchPicNumber").text(totalCount_search);
		}
		else
		{
			totalCount_search 	= 0;
			totalPage_search 	= 0;
			curPage_search 	= 0;
			$("#searchageNum").text(0);
			$("#searchPageAccount").text(parseInt(totalPage_search));
			$("#searchPicNumber").text(totalCount_search);
			$('.mpLists_search').html("");
		}	
 	}
 		
	function setPager_search(fValue)              
	{   

		// console.log(fValue);
		if(fValue <0 || (fValue+1)>totalPage_search){    				                  
			return;  
		}                  
		curPage_search = fValue;                  	     
		var curNum = fValue*pageCount;         

		$('.mpLists_search').html("");
		$("#searchageNum").text(fValue+1);
		
		m_pageData_search.length = 0;
		for(var i = 0; curNum<m_searchGroup.length&&i<pageCount; i++,curNum++)
		{                      
			m_pageData_search.push(m_searchGroup[curNum][0]);  
		}                  
		var temp=curPage_search+1;
		for(var i=0; i<m_pageData_search.length; i++) 		
		{
			$('.mpLists_search').append(m_pageData_search[i]);
		}
	}	

    function OnImageClick_search(that)
    {
    	
    	if (MatType==1)
    	{
    		mHouseClass.mFurnitureClass.CreateObj(m_searchGroup[that.id][1]);
    	}
    	else if (MatType==2)
    	{
    		mHouseClass.mFurnitureClass.CreateObj(m_searchGroup[that.id][1]);
    	}
		   // 
   //  	 	$(".hover_img").attr("src",that.src);
			// moverBlok(".hover_img");	
    }

    // ===========组合==============================================

	function intcombination(int_1,int_2,int_3) 
 	{
 		m_combinationGroup.length = 0;
 		var a1 = m_strObjData.responseText.split("\r\n");;
       	var iIndex = 0;
    	for(var i=1; i<a1.length; i++) 
		{
			var s2 =a1[i];
			var a2 =s2.split(',');

			if(!IsEffectiveModel(a2))
				continue;

			var dataArray = new Array();
			var tempNodeLi;	
			var if_flog=true;
			if (int_1==undefined && int_2==undefined && int_3==undefined) {
			//	if_flog=a2[1]!= undefined && a2[1] != null &&a2[2]!=null && a2[4]!=null && i18n.t(`Language.${a2[6]}`)==i18n.t("Language.家具");
				if_flog=a2[1]!= undefined && a2[1] != null &&a2[2]!=null && a2[4]!=null && a2[6] =="家具";
			}else{
			//	if_flog=a2[1]!= undefined && a2[1] != null &&a2[2]!=null && a2[4]!=null && i18n.t(`Language.${a2[6]}`)==i18n.t(`Language.${categoryType[int_1]}`) && i18n.t(`Language.${a2[7]}`)==i18n.t(`Language.${secondType[int_1][int_2]}`) && i18n.t(`Language.${a2[8]}`)==i18n.t(`Language.${[levelThreeType[int_1][int_2][int_3]]}`);
				if_flog=a2[1]!= undefined && a2[1] != null &&a2[2]!=null && a2[4]!=null && 
					a2[6] ==categoryType[int_1] && a2[7] == secondType[int_1][int_2]  && a2[8]==levelThreeType[int_1][int_2][int_3];
			
			}
			if( if_flog )	
			{
				var k   = a2[2].lastIndexOf(".");
				var str = a2[2].slice(k+1);
				if( str == "a3d")
					 continue;
				if (accountType==0){
					tempNodeLi ='<li class="meshPic"><img id="'+iIndex+'" src="'+m_strHttp + 'jiaju/'+ a2[1]+'" alt="image"  onclick="OnImageClick_combination(this);" ></li>';
				}else if(accountType==1){
					tempNodeLi ='<li class="meshPic"><img id="'+iIndex+'" src="'+m_strHttp + 'jiaju/'+ a2[1]+'" alt="image"  onclick="OnImageClick_combination(this);" ></li>';
				}
			  	dataArray.push(tempNodeLi);
				dataArray.push(a2);
				iIndex++;
				m_combinationGroup.push(dataArray);
			}				 	
		}
	 	if( m_combinationGroup.length > 0) 
		{
			totalCount_combination = m_combinationGroup.length;
			totalPage_combination = (totalCount_combination + pageCount -1)/pageCount;
			setPager_combination(0);  
			$("#combinationageNum").text(1);
			$("#combinationPageAccount").text(parseInt(totalPage_combination));
			$("#combinationPicNumber").text(totalCount_combination);
		}
		else
		{
			totalCount_combination 	= 0;
			totalPage_combination 	= 0;
			curPage_combination 	= 0;
			$("#combinationageNum").text(0);
			$("#combinationPageAccount").text(parseInt(totalPage_combination));
			$("#combinationPicNumber").text(totalCount_combination);
			$('.mpLists_combination').html("");
		}	
 	}
 		
	function setPager_combination(fValue)              
	{   

		// console.log(fValue);
		if(fValue <0 || (fValue+1)>totalPage_combination){    				                  
			return;  
		}                  
		curPage_combination = fValue;                  	     
		var curNum = fValue*pageCount;         

		$('.mpLists_combination').html("");
		$("#combinationageNum").text(fValue+1);
		
		m_pageData_combination.length = 0;
		for(var i = 0; curNum<m_combinationGroup.length&&i<pageCount; i++,curNum++)
		{                      
			m_pageData_combination.push(m_combinationGroup[curNum][0]);  
		}                  
		var temp=curPage_combination+1;
		for(var i=0; i<m_pageData_combination.length; i++) 		
		{
			$('.mpLists_combination').append(m_pageData_combination[i]);
		}
	}	

    function OnImageClick_combination(that)
    {
		   // mHouseClass.mFurnitureClass.CreateObj(m_ExhibitionGroup[that.id][1]);
   //  	 	$(".hover_img").attr("src",that.src);
			// moverBlok(".hover_img");	
    }

    
    // ==========收藏=============================================

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

    function setPager_Collection(fValue){
    	if(fValue <0 || (fValue+1)>totalPage_Collection){    				                  
			return;  
		}                  
		curPage_Collection = fValue;                  	     
		var curNum = fValue*pageCount;         

		$('.mpLists_Collection').html("");
		$("#CollectionageNum").text(fValue+1);
		
		m_pageData_Collection.length = 0;
		for(var i = 0; curNum<m_CollectionGroup.length&&i<pageCount; i++,curNum++)
		{                      
			m_pageData_Collection.push(m_CollectionGroup[curNum][0]);  
		}                  
		var temp=curPage_Collection+1;
		for(var i=0; i<m_pageData_Collection.length; i++) 		
		{
			$('.mpLists_Collection').append(m_pageData_Collection[i]);
		}
    }

    // ==========收藏=============================================
 
    
    // ==========被隐藏=============================================
    
    	function m_ModelHideDlg(){
    		m_ModelHideGroup.length=0,m_pageData_ModelHidelength=0;

    		for(var i=0; i<m_ParamObjDlg.ModeHideArray.length; i++) {
    			let dataArray=[];
    			let a2=m_ParamObjDlg.ModeHideArray[i].mData;
    			let tempNodeLi ='<li class="meshPic"><i class="icon iconfont icon-xinxi"></i><img strint="'+i+'-1" src="'+m_strHttp + 'jiaju/'+ a2[1]+'" alt="image"><p>显示</p></li>';
			  	dataArray.push(tempNodeLi);
				dataArray.push(a2);
				dataArray.push(m_ParamObjDlg.ModeHideArray[i]);
				m_ModelHideGroup.push(dataArray);
    		}
    		if( m_ModelHideGroup.length > 0) 
			{
				totalCount_ModelHide = m_ModelHideGroup.length;
				totalPage_ModelHide = (totalCount_ModelHide + pageCount -1)/pageCount;
				setPager_ModelHide(0);  
				$("#ModelHideageNum").text(1);
				$("#ModelHidePageAccount").text(parseInt(totalPage_ModelHide));
				$("#ModelHidePicNumber").text(totalCount_ModelHide);
			}
			else
			{
				totalCount_ModelHide 	= 0;
				totalPage_ModelHide	    = 0;
				curPage_ModelHide	    = 0;
				$("#ModelHideageNum").text(0);
				$("#ModelHidePageAccount").text(parseInt(totalPage_ModelHide));
				$("#ModelHidePicNumber").text(totalCount_ModelHide);
				$('.mpLists_ModelHide').html("");
			}
    	}

    	function setPager_ModelHide(fValue)              
		{   

			// console.log(fValue);
			if(fValue <0 || (fValue+1)>totalPage_ModelHide){    				                  
				return;  
			}                  
			curPage_ModelHide = fValue;                  	     
			var curNum = fValue*pageCount;         

			$('.mpLists_ModelHide').html("");
			$("#ModelHideageNum").text(fValue+1);
			
			m_pageData_ModelHide.length = 0;
			for(var i = 0; curNum<m_ModelHideGroup.length&&i<pageCount; i++,curNum++)
			{                      
				m_pageData_ModelHide.push(m_ModelHideGroup[curNum][0]);  
			}                  
			var temp=curPage_ModelHide+1;
			for(var i=0; i<m_pageData_ModelHide.length; i++) 		
			{
				$('.mpLists_ModelHide').append(m_pageData_ModelHide[i]);
			}
		}

    // ==========被隐藏=============================================


    // http://134.175.95.142/service1.asmx
    // ==========品牌=============================================

    	function GetUserBrands()
		{
			if ($("#mModelBrand .mpLists_ModelHide").html()!='') {
				return;
			}

		    $.ajax({
		        url: m_strWebService+'service1.asmx/GetUserBrands_h5', //'http://134.175.95.142/service1.asmx/GetUserBrands_h5',
		        type: "Post",
		        dataType: "json",
		        contentType: "application/x-www-form-urlencoded",
		        data: {
		                 strAccount: mUserAccount
		             },
		    success: function (data)
		    {
		        if ("1" == data.code)
		        {
		            var jsonData=JSON.parse(data.data);
		            for (var i = 0; i < jsonData.length; i++) {
		            	//let html='<li class="Brand-li"><img brandname="'+jsonData[i].brandname+'" compnayid="'+jsonData[i].compnayid+'" src="http://134.175.95.142/'+jsonData[i].brandimage+'" /></li>'
						let html=`<li class="Brand-li"><img brandname="${jsonData[i].brandname}" compnayid="${jsonData[i].compnayid}" src="${m_strWebService}${jsonData[i].brandimage}" /></li>`
			            $("#mModelBrand .mpLists_ModelHide").append(html);
		            }
		        }
		        else if ("0" == data.code)
		        {
		           console.log(data.msg);
		        }
		        //不存在品牌数据，则使用公共品牌
				else if ("2" == data.code)
				{
					GetPublicBrands();
				}
		    },
		    error: function (err)
		    {
		        console.log(err);
		    }
		   })
		}

		//获取公共品牌数据
		function GetPublicBrands()
		{
			$.ajax({
				url: m_strWebService+'service1.asmx/GetUserBrands_h5', //'http://134.175.95.142/service1.asmx/GetUserBrands_h5',
				type: "Post",
				dataType: "json",
				contentType: "application/x-www-form-urlencoded",
				data: {
					strAccount: 'public'
				},
				success: function (data)
				{
					if ("1" == data.code)
					{
						var jsonData=JSON.parse(data.data);
						for (var i = 0; i < jsonData.length; i++) {
							//let html='<li class="Brand-li"><img brandname="'+jsonData[i].brandname+'" compnayid="'+jsonData[i].compnayid+'" src="http://134.175.95.142/'+jsonData[i].brandimage+'" /></li>'
							let html=`<li class="Brand-li"><img brandname="${jsonData[i].brandname}" compnayid="${jsonData[i].compnayid}" src="${m_strWebService}${jsonData[i].brandimage}" /></li>`
							$("#mModelBrand .mpLists_ModelHide").append(html);
						}
					}
					else if ("0" == data.code)
					{
						console.log(data.msg);
					}
				},
				error: function (err)
				{
					console.log(err);
				}
			})
		}

// 
	function initBrand(int_1,int_2)
	{
		if (int_1=='') {
			int_1=Brand_Id;
		}else{
			Brand_Id=int_1;
		}

		m_ObjGroup_Brand.length = 0;
   		var a1;
   		if (int_2==1) {
	   		a1 = m_strObjData.responseText.split("\r\n");
   		}else{
   			a1 = MatArr_cont;
   		}
   		var iIndex = 0;
	 	for(var i=1; i<a1.length; i++) 
		{
				var s2 =a1[i];
				var a2 =s2.split(',');
				if (int_2==1) {
				    if(!IsEffectiveModel(a2))
					  continue;
				}

				var dataArray = new Array();
				var tempNodeLi;	
				var if_flog;
				if (int_2==1) {
					if_flog=a2[1]!= undefined && a2[1] != null &&a2[2]!=null && a2[4]!=null && a2[21]==int_1;
				}else{
					if (a2.length>=7) {
						if_flog=a2[1]!= undefined && a2[1] != null &&a2[2]!=null && a2[4]!=null && a2[9]==int_1;
					}
				}
				if(if_flog)	
				{
					if (int_2==1) {
						var k   = a2[2].lastIndexOf(".");
						var str = a2[2].slice(k+1);
						if( str == "a3d")
							 continue;

						if (accountType==0){
							tempNodeLi ='<li class="meshPic"><i class="icon iconfont icon-xinxi"></i><i class="icon iconfont icon-d-" id="'+iIndex+'-1"></i><i class="icon iconfont icon-xing"></i><img id="'+iIndex+'" src="'+m_strHttp + 'jiaju/'+ a2[1]+'" alt="image"  onclick="OnBrandClick(this);" ></li>';
						}else if(accountType==1){
							tempNodeLi ='<li class="meshPic"><i class="icon iconfont icon-xinxi"></i><i class="icon iconfont icon-xing"></i><img id="'+iIndex+'" src="'+m_strHttp + 'jiaju/'+ a2[1]+'" alt="image"  onclick="OnBrandClick(this);" ></li>';
						}
					}else{
						tempNodeLi ='<li class="meshPic"><img id="'+iIndex+'" src="'+m_strHttp + 'texture/'+ a2[1]+'" alt="image" onclick="OnImageClick(this);" ></li>';
					}
				  	dataArray.push(tempNodeLi);
					dataArray.push(a2);
					iIndex++;
					m_ObjGroup_Brand.push(dataArray);

				}				 	
		}

 		if( m_ObjGroup_Brand.length > 0) 
		{
		  Mods_Arr = m_ObjGroup_Brand;
		  totalCount_Brand = m_ObjGroup_Brand.length;
		  totalPage_Brand  = (totalCount_Brand + pageCount -1)/pageCount;
		  setPager_Brand(0);  
		  $("#BrandageNum").text(1);
		  $("#BrandPageAccount").text(parseInt(totalPage_Brand));
		  $("#BrandPicNumber").text(totalCount_Brand);
		}
		else
		{
			totalCount_Brand = 0;
			totalPage_Brand 	= 0;
			curPage_Brand 	= 0;
		  $("#BrandageNum").text(0);
		  $("#BrandPageAccount").text(parseInt(totalPage_Brand));
		  $("#BrandPicNumber").text(totalCount_Brand);
		  $('.mpLists_Brand').html("");
		}	
	}
	
	function setPager_Brand(fValue)              
	{      
		if(fValue <0 || (fValue+1)>totalPage_Brand){    				                  
			return;  
		}                  
		curPage_Brand = fValue;                  		      
		var curNum = fValue*pageCount;        

		$('.mpLists_Brand').html("");
		
		m_pageObjData_Brand.length = 0;
		for(var i = 0; curNum<m_ObjGroup_Brand.length&&i<pageCount; i++,curNum++)
		{                      
			m_pageObjData_Brand.push(m_ObjGroup_Brand[curNum][0]);  
		}                  
		var temp=curPage_Brand+1; 
		$("#BrandageNum").text(parseInt(temp));
		for(var i=0; i<m_pageObjData_Brand.length; i++) 		
		{
			$('.mpLists_Brand').append(m_pageObjData_Brand[i]);
		}
	}	
		
    function OnBrandClick(that)
    {
    	  mHouseClass.mFurnitureClass.CreateObj(m_ObjGroup_Brand[that.id][1]);
   //  	  $(".hover_img").attr("src",that.src);
			// moverBlok(".hover_img");	
    }
    // ==========品牌=============================================

	// ===========全屏==============================================
	var mFullScreenKey=false;
	function OnClickFullScreen(element){
	        if(mFullScreenKey)
	        {
	             exitFull();
	             mFullScreenKey=false;
	        }
	        else
	        {
	         	 requestFullScreen(element);
	           mFullScreenKey=true;
	        }
	}

	function ChooseLanguage(language){
		i18n.locale = language;

		$('.modelBase_link_model').empty();
	}

	function OnExportCAD(){
		mHouseClass.mExportCad.OnExportCAD();
	}

	function OnImportModel()
	{
		$("#ChooseModelFile").click();
	}

	//导入开装点云模型数据
	function ImportModelFile()
	{
		if(document.getElementById("ChooseModelFile").value=="" )
			return;

		var file = document.getElementById("ChooseModelFile").files[0];

		var reader = new FileReader();
		reader.onload = function(e) {
			var fileText = e.target.result;
			mHouseClass.mImportCad.ParseKZModelData(fileText);
			//mPluginsClass.OnLoadScene(fileText)
			console.log('Success!');
		};

		reader.readAsText(file);

		$('#ChooseModelFile').replaceWith('<input id="ChooseModelFile" type="file" style="display: none;" onchange="ImportModelFile();" />');
	};

	function OnWXShare(element)
	{
		var webUrl = localStorage.getItem('WebService');
		if(null == webUrl)
		{
			webUrl = 'http://'+window.location.host+'/';
		}

		window.open(webUrl+'sc/index.html',"_blank");
	}
	
	function requestFullScreen(element) {
	 var requestMethod = element.requestFullScreen || //W3C
	 element.webkitRequestFullScreen || //Chrome??
	 element.mozRequestFullScreen || //FireFox
	 element.msRequestFullScreen; //IE11
	 if (requestMethod) {
	  requestMethod.call(element);
	 }
	 else if (typeof window.ActiveXObject !== "undefined") {//for Internet Explorer
	  var wscript = new ActiveXObject("WScript.Shell");
	  if (wscript !== null) {
	   wscript.SendKeys("{F11}");
	  }
	 }
	}
	
	function exitFull() {
	 var exitMethod = document.exitFullscreen || //W3C
	 document.mozCancelFullScreen || //Chrome??
	 document.webkitExitFullscreen || //FireFox
	 document.webkitExitFullscreen; //IE11
	 if (exitMethod) {
	  exitMethod.call(document);
	 }
	 else if (typeof window.ActiveXObject !== "undefined") {//for Internet Explorer
	  var wscript = new ActiveXObject("WScript.Shell");
	  if (wscript !== null) {
	   wscript.SendKeys("{F11}");
	  }
	 }
	}


// function delHtml_3D(F_class) {
// 	console.log(2);
// 	console.log($(F_class).html());
// }
var m_ClassObjData,m_ClassObjArr=[],strText_1='',strText_2='';
setClassData();
function setClassData(){
	var Name=['颜色','样式']
	//m_ClassObjData=$.ajax({url:'http://134.175.95.142/iHouse/QueryFilter.xml',async:false,}).responseText;
	m_ClassObjData=$.ajax({url:m_strWebService+'iHouse/QueryFilter.xml',async:false,}).responseText;
	// console.log($(m_ClassObjData).children('color').children());
	var DArr_1=[],DArr_2=[];
	for (var i = 0; i < $(m_ClassObjData).children('color').children().length; i++) {
		let t=$(m_ClassObjData).children('color').children().eq(i).attr('name');
		DArr_1[i]=t;
	}
	m_ClassObjArr.push(DArr_1);

	for (var i = 0; i < $($(m_ClassObjData).children('style').html()).length; i+=2) {
		let t=$($(m_ClassObjData).children('style').html()).eq(i).attr('name');
		DArr_2.push(t);
	}
	m_ClassObjArr.push(DArr_2);

	var html_1='',html_2='',html_3='';
	for (var i = m_ClassObjArr.length - 1; i >= 0; i--) {
		 html_1=`<div class="type-cont" multiSelect='false'>
				<div class="type-cont-title">
					<p>${Name[i]}:</p>
				</div>
				<ul class="type-item-list clearfloat">`
		html_2='';
		for (var j = 0; j < m_ClassObjArr[i].length; j++) {
			if (j==0) {
				html_2='<li class="type-link-1" int='+i+'>'+m_ClassObjArr[i][j]+'</li>'
			}else{
				html_2+='<li int='+i+'>'+m_ClassObjArr[i][j]+'</li>'
			}
		}

		html_3='</ul></div>';

		// console.log(html_1+html_2+html_3)
		// $('.template-input-buttom-type_1').html();
		$('.template-input-buttom-type_1>.body_classStyle').html($('.template-input-buttom-type_1>.body_classStyle').html()+html_1+html_2+html_3);

	}
}

  /**
   * 使用spilt方法实现模糊查询
   * @param  {Array}  list     进行查询的数组
   * @param  {String} keyWord  查询的关键词
   * @return {Array}           查询的结果
   */

   // var sssd=['1我的2','555555','1326665','74555','15我的96','554555','26555','7582','82我的4646'];

 function fuzzyQuery(list, keyWord) {
    var arr = [];
    for (var i = 0; i < list.length; i++) {
      if (list[i].split(keyWord).length > 1) {
        arr.push(list[i]);
      }
    }
    return arr;
  }

  // console.log(fuzzyQuery( m_strObjData.responseText.split("\r\n"),'欧式'));


function keyWord_Funtion(val){
	
	$('.modelBase-left li').removeClass('modelBase_link');		
	$('.modelBase-right').hide();
	$('#msearchDlg').show();

	var strArr;
	if (MatType==1) {
		strArr=fuzzyQuery( m_strObjData.responseText.split("\r\n"),val);
	}else if(MatType==2){
		strArr=fuzzyQuery( m_strMatData.responseText.split("\r\n"),val);
	}
	if (strText_1!='') {
		strArr=fuzzyQuery( strArr,strText_1);
		if (strText_2!='') {
			strArr=fuzzyQuery( strArr,strText_2);
		}
	}

	intsearch(strArr);
	Mods_Arr=m_searchGroup;
}


$(function(){
	$('.template-input-buttom-type_1>.body_classStyle').delegate('li', 'click', function(event) {
		$(this).siblings().removeClass('type-link-1');
		$(this).addClass('type-link-1');
		if ($(this).attr('int')==0) {
			if ($(this).text()=='不限') {
				strText_2='';
			}else{
				strText_2=$(this).text();
			}
		}else if ($(this).attr('int')==1) {
			if ($(this).text()=='不限') {
				strText_1='';
			}else{
				strText_1=$(this).text();
			}
		}

		var strArr;
		
		if (MatType==1) {
			strArr=fuzzyQuery( m_strObjData.responseText.split("\r\n"),strText_1);
			if (strText_2!='') {
				strArr=fuzzyQuery( strArr,strText_2);
			}
		}else if(MatType==2){
			strArr=fuzzyQuery( m_strMatData.responseText.split("\r\n"),strText_1);
			if (strText_2!='') {
				strArr=fuzzyQuery( strArr,strText_2);
			}
		}
		strArr=fuzzyQuery( strArr,keyWord_search);

		intsearch(strArr);
		Mods_Arr=m_searchGroup;
		$('.modelBase-left li').removeClass('modelBase_link');		
		$('.modelBase-right').hide();
		$('#msearchDlg').show();

	})

	$('.template-input-buttom-type_1 button').eq(0).click(function(){
		$('.template-input-buttom-type_1>.body_classStyle li').removeClass('type-link-1');
		$('.template-input-buttom-type_1 ul').eq(0).children().eq(0).addClass('type-link-1');
		$('.template-input-buttom-type_1 ul').eq(1).children().eq(0).addClass('type-link-1');

		var strArr;
		if (MatType==1) {
			strArr=fuzzyQuery( m_strObjData.responseText.split("\r\n"),'');
		}else if(MatType==2){
			strArr=fuzzyQuery( m_strMatData.responseText.split("\r\n"),'');
		}

		strArr=fuzzyQuery( strArr,keyWord_search);

		intsearch(strArr);
		Mods_Arr=m_searchGroup;
	})

	Dlgfurnture();
})

function Dlgfurnture(){
	var x = 0;
	var y = 0;
	var l = 0;
	var t = 0;
	var isDown = false;

	$('.attributeInterface .attrTitle').mousedown(function(event) {
		//获取x坐标和y坐标
	    x = event.clientX;
	    y = event.clientY;
	    //获取左部和顶部的偏移量
	    l = $(this).parent().offset().left;
	    t = $(this).parent().offset().top;
	    //开关打开
	    isDown = true;

	    var el=$(this).parent();
	    //设置样式
		$(window).mousemove(function(event){
			if (!isDown) {return;}

			//获取x和y
		    var nx = event.clientX;
		    var ny = event.clientY-40;
		    //计算移动后的左偏移量和顶部的偏移量
		    var nl = nx - (x - l);
		    var nt = ny - (y - t);

		    if (nl<=0) {
		    	nl=0;
		    }
		    if (nt<=0) {
		    	nt=0;
		    }

		    var dw=el.outerWidth(true);
		   	var ww=$('.cont-main').outerWidth(true);
		    var dh=el.outerHeight(true);
		   	var wh=$('.cont-main').outerHeight(true);

		    if (nl+dw>=ww) {
		    	nl=(ww-dw);
		    }

		    if (nt+dh>=wh) {
		    	nt=(wh-dh);
		    }
		    el.css({
		    	left: nl + 'px',
		    	top: (nt) + 'px'
		    });

	        window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
		});

		$(window).mouseup(function(){
			//开关打开
		    isDown = false;
		});
	});
}