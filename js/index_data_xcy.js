//场景类变量
var curPage_Scene;
var totalPage_Scene;
var totalCount_Scene;
var m_pageObjData_Scene =[];
var m_ObjGroup_Scene =[];

//基础类变量
var curPage_Base;
var totalPage_Base;
var totalCount_Base;
var m_pageObjData_Base =[];
var m_ObjGroup_Base =[];

//舞美
var curPage_WuMei;
var totalPage_WuMei;
var totalCount_WuMei;
var m_pageObjData_WuMei =[];
var m_ObjGroup_WuMei =[];

//美陈
var curPage_MeiChen;
var totalPage_MeiChen;
var totalCount_MeiChen;
var m_pageObjData_MeiChen =[];
var m_ObjGroup_MeiChen =[];

//人物
var curPage_Person;
var totalPage_Person;
var totalCount_Person;
var m_pageObjData_Person =[];
var m_ObjGroup_Person =[];

//其他
var curPage_Other;
var totalPage_Other;
var totalCount_Other;
var m_pageObjData_Other =[];
var m_ObjGroup_Other =[];

//苏州小丑鱼分类
function InitXCYClass()
{
	showClass();
	//initScene();	//场景暂时不需要
	initBase();     //基础分类
	initWuMei();    //舞美
	initMeiChen();  //美陈
	initPerson();   //人物
	initOther();	//其他
}

function showClass()
{
	$('#101').html('场景布置')
	//$('#300').show();
	$('#301').show();
	$('#302').show();
	$('#303').show();
	/*$('#304').show();*/
	$('#305').show();
	//隐藏不需要分类
	$('#100').hide(); // 品牌
	$('#102').hide(); //厨卫
	$('#103').hide(); //照明
	$('#105').hide(); //家电
	$('#106').hide(); //家饰
	$('#107').hide(); //工装
	$('#104').hide();	// 家具

	$('#301').trigger("click");

}

//==============基础==========================================================================================
function initBase(int_1,int_2,int_3)
{
	m_ObjGroup_Base.length = 0;
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
			if_flog=a2[1]!= undefined && a2[1] != null &&a2[2]!=null && a2[4]!=null && i18n.t(`Language.${a2[6]}`)==i18n.t(`Language.基础`);
		}else{
			if_flog=a2[1]!= undefined && a2[1] != null &&a2[2]!=null && a2[4]!=null && i18n.t(`Language.${a2[6]}`)==i18n.t(`Language.${categoryType[int_1]}`) && i18n.t(`Language.${a2[7]}`)==i18n.t(`Language.${secondType[int_1][int_2]}`) && i18n.t(`Language.${a2[8]}`)==i18n.t(`Language.${levelThreeType[int_1][int_2][int_3]}`);
		}
		if( if_flog )
		{
			var k   = a2[2].lastIndexOf(".");
			var str = a2[2].slice(k+1);
			if( str == "a3d")
				continue;
			if (accountType==0){
				tempNodeLi ='<li class="meshPic"><i class="icon iconfont icon-xinxi"></i><i class="icon iconfont icon-d-" id="'+iIndex+'-1"></i><i class="icon iconfont icon-xing"></i><img id="'+iIndex+'" src="'+m_strHttp + 'jiaju/'+ a2[1]+'" alt="image"  onclick="OnBaseClick(this);" ></li>';
			}else if(accountType==1){
				tempNodeLi ='<li class="meshPic"><i class="icon iconfont icon-xinxi"></i><i class="icon iconfont icon-xing"></i><img id="'+iIndex+'" src="'+m_strHttp + 'jiaju/'+ a2[1]+'" alt="image"  onclick="OnBaseClick(this);" ></li>';
			}
			dataArray.push(tempNodeLi);
			dataArray.push(a2);
			iIndex++;
			m_ObjGroup_Base.push(dataArray);
		}
	}
	if( m_ObjGroup_Base.length > 0)
	{
		totalCount_Base = m_ObjGroup_Base.length;
		totalPage_Base  = (totalCount_Base + pageCount -1)/pageCount;
		setPager_Base(0);
		$("#BasePageNum").text(1);
		$("#BasePageAccount").text(parseInt(totalPage_Base));
		$("#BasePicNumber").text(totalCount_Base);
	}
	else
	{
		totalCount_Base = 0;
		totalPage_Base 	= 0;
		curPage_Base 	= 0;
		$("#BasePageNum").text(0);
		$("#BasePageAccount").text(parseInt(totalPage_Base));
		$("#BasePicNumber").text(totalCount_Base);
		$('.mpLists_Base').html("");
	}
}

function OnBaseClick(that)
{
	mHouseClass.mFurnitureClass.CreateObj(m_ObjGroup_Base[that.id][1]);
}

function setPager_Base(fValue)
{
	if(fValue <0 || (fValue+1)>totalPage_Base){
		return;
	}
	curPage_Base = fValue;
	var curNum = fValue*pageCount;

	$('.mpLists_Base').html("");

	m_pageObjData_Base.length = 0;
	for(var i = 0; curNum<m_ObjGroup_Base.length&&i<pageCount; i++,curNum++)
	{
		m_pageObjData_Base.push(m_ObjGroup_Base[curNum][0]);
	}
	var temp=curPage_Base+1;
	$("#BasePageNum").text(parseInt(temp));
	for(var i=0; i<m_pageObjData_Base.length; i++)
	{
		$('.mpLists_Base').append(m_pageObjData_Base[i]);
	}
}

//舞美
function initWuMei(int_1,int_2,int_3)
{
	m_ObjGroup_WuMei.length = 0;
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
			if_flog=a2[1]!= undefined && a2[1] != null &&a2[2]!=null && a2[4]!=null && i18n.t(`Language.${a2[6]}`)==i18n.t(`Language.舞美`);
		}else{
			if_flog=a2[1]!= undefined && a2[1] != null &&a2[2]!=null && a2[4]!=null && i18n.t(`Language.${a2[6]}`)==i18n.t(`Language.${categoryType[int_1]}`) && i18n.t(`Language.${a2[7]}`)==i18n.t(`Language.${secondType[int_1][int_2]}`) && i18n.t(`Language.${a2[8]}`)==i18n.t(`Language.${levelThreeType[int_1][int_2][int_3]}`);
		}
		if( if_flog )
		{
			var k   = a2[2].lastIndexOf(".");
			var str = a2[2].slice(k+1);
			if( str == "a3d")
				continue;
			if (accountType==0){
				tempNodeLi ='<li class="meshPic"><i class="icon iconfont icon-xinxi"></i><i class="icon iconfont icon-d-" id="'+iIndex+'-1"></i><i class="icon iconfont icon-xing"></i><img id="'+iIndex+'" src="'+m_strHttp + 'jiaju/'+ a2[1]+'" alt="image"  onclick="OnWuMeiClick(this);" ></li>';
			}else if(accountType==1){
				tempNodeLi ='<li class="meshPic"><i class="icon iconfont icon-xinxi"></i><i class="icon iconfont icon-xing"></i><img id="'+iIndex+'" src="'+m_strHttp + 'jiaju/'+ a2[1]+'" alt="image"  onclick="OnWuMeiClick(this);" ></li>';
			}
			dataArray.push(tempNodeLi);
			dataArray.push(a2);
			iIndex++;
			m_ObjGroup_WuMei.push(dataArray);
		}
	}
	if( m_ObjGroup_WuMei.length > 0)
	{
		totalCount_WuMei = m_ObjGroup_WuMei.length;
		totalPage_WuMei  = (totalCount_WuMei + pageCount -1)/pageCount;
		setPager_WuMei(0);
		$("#WuMeiPageNum").text(1);
		$("#WuMeiPageAccount").text(parseInt(totalPage_WuMei));
		$("#WuMeiPicNumber").text(totalCount_WuMei);
	}
	else
	{
		totalCount_WuMei = 0;
		totalPage_WuMei 	= 0;
		curPage_WuMei 	= 0;
		$("#WuMeiPageNum").text(0);
		$("#WuMeiPageAccount").text(parseInt(totalPage_WuMei));
		$("#WuMeiPicNumber").text(totalCount_WuMei);
		$('.mpLists_WuMei').html("");
	}
}

function OnWuMeiClick(that)
{
	mHouseClass.mFurnitureClass.CreateObj(m_ObjGroup_WuMei[that.id][1]);
}

function setPager_WuMei(fValue)
{
	if(fValue <0 || (fValue+1)>totalPage_WuMei){
		return;
	}
	curPage_WuMei = fValue;
	var curNum = fValue*pageCount;

	$('.mpLists_WuMei').html("");

	m_pageObjData_WuMei.length = 0;
	for(var i = 0; curNum<m_ObjGroup_WuMei.length&&i<pageCount; i++,curNum++)
	{
		m_pageObjData_WuMei.push(m_ObjGroup_WuMei[curNum][0]);
	}
	var temp=curPage_WuMei+1;
	$("#WuMeiPageNum").text(parseInt(temp));
	for(var i=0; i<m_pageObjData_WuMei.length; i++)
	{
		$('.mpLists_WuMei').append(m_pageObjData_WuMei[i]);
	}
}

//美陈
function initMeiChen(int_1,int_2,int_3)
{
	m_ObjGroup_MeiChen.length = 0;
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
			if_flog=a2[1]!= undefined && a2[1] != null &&a2[2]!=null && a2[4]!=null && i18n.t(`Language.${a2[6]}`)==i18n.t(`Language.美陈`);
		}else{
			if_flog=a2[1]!= undefined && a2[1] != null &&a2[2]!=null && a2[4]!=null && i18n.t(`Language.${a2[6]}`)==i18n.t(`Language.${categoryType[int_1]}`) && i18n.t(`Language.${a2[7]}`)==i18n.t(`Language.${secondType[int_1][int_2]}`) && i18n.t(`Language.${a2[8]}`)==i18n.t(`Language.${levelThreeType[int_1][int_2][int_3]}`);
		}
		if( if_flog )
		{
			var k   = a2[2].lastIndexOf(".");
			var str = a2[2].slice(k+1);
			if( str == "a3d")
				continue;
			if (accountType==0){
				tempNodeLi ='<li class="meshPic"><i class="icon iconfont icon-xinxi"></i><i class="icon iconfont icon-d-" id="'+iIndex+'-1"></i><i class="icon iconfont icon-xing"></i><img id="'+iIndex+'" src="'+m_strHttp + 'jiaju/'+ a2[1]+'" alt="image"  onclick="OnMeiChenClick(this);" ></li>';
			}else if(accountType==1){
				tempNodeLi ='<li class="meshPic"><i class="icon iconfont icon-xinxi"></i><i class="icon iconfont icon-xing"></i><img id="'+iIndex+'" src="'+m_strHttp + 'jiaju/'+ a2[1]+'" alt="image"  onclick="OnMeiChenClick(this);" ></li>';
			}
			dataArray.push(tempNodeLi);
			dataArray.push(a2);
			iIndex++;
			m_ObjGroup_MeiChen.push(dataArray);
		}
	}
	if( m_ObjGroup_MeiChen.length > 0)
	{
		totalCount_MeiChen = m_ObjGroup_MeiChen.length;
		totalPage_MeiChen  = (totalCount_MeiChen + pageCount -1)/pageCount;
		setPager_MeiChen(0);
		$("#MeiChenPageNum").text(1);
		$("#MeiChenPageAccount").text(parseInt(totalPage_MeiChen));
		$("#MeiChenPicNumber").text(totalCount_MeiChen);
	}
	else
	{
		totalCount_MeiChen = 0;
		totalPage_MeiChen 	= 0;
		curPage_MeiChen 	= 0;
		$("#MeiChenPageNum").text(0);
		$("#MeiChenPageAccount").text(parseInt(totalPage_MeiChen));
		$("#MeiChenPicNumber").text(totalCount_MeiChen);
		$('.mpLists_MeiChen').html("");
	}
}

function OnMeiChenClick(that)
{
	mHouseClass.mFurnitureClass.CreateObj(m_ObjGroup_MeiChen[that.id][1]);
}

function setPager_MeiChen(fValue)
{
	if(fValue <0 || (fValue+1)>totalPage_MeiChen){
		return;
	}
	curPage_MeiChen = fValue;
	var curNum = fValue*pageCount;

	$('.mpLists_MeiChen').html("");

	m_pageObjData_MeiChen.length = 0;
	for(var i = 0; curNum<m_ObjGroup_MeiChen.length&&i<pageCount; i++,curNum++)
	{
		m_pageObjData_MeiChen.push(m_ObjGroup_MeiChen[curNum][0]);
	}
	var temp=curPage_MeiChen+1;
	$("#MeiChenPageNum").text(parseInt(temp));
	for(var i=0; i<m_pageObjData_MeiChen.length; i++)
	{
		$('.mpLists_MeiChen').append(m_pageObjData_MeiChen[i]);
	}
}

//人物
function initPerson(int_1,int_2,int_3)
{
	m_ObjGroup_Person.length = 0;
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
			if_flog=a2[1]!= undefined && a2[1] != null &&a2[2]!=null && a2[4]!=null && i18n.t(`Language.${a2[6]}`)==i18n.t(`Language.人物`);
		}else{
			if_flog=a2[1]!= undefined && a2[1] != null &&a2[2]!=null && a2[4]!=null && i18n.t(`Language.${a2[6]}`)==i18n.t(`Language.${categoryType[int_1]}`) && i18n.t(`Language.${a2[7]}`)==i18n.t(`Language.${secondType[int_1][int_2]}`) && i18n.t(`Language.${a2[8]}`)==i18n.t(`Language.${levelThreeType[int_1][int_2][int_3]}`);
		}
		if( if_flog )
		{
			var k   = a2[2].lastIndexOf(".");
			var str = a2[2].slice(k+1);
			if( str == "a3d")
				continue;
			if (accountType==0){
				tempNodeLi ='<li class="meshPic"><i class="icon iconfont icon-xinxi"></i><i class="icon iconfont icon-d-" id="'+iIndex+'-1"></i><i class="icon iconfont icon-xing"></i><img id="'+iIndex+'" src="'+m_strHttp + 'jiaju/'+ a2[1]+'" alt="image"  onclick="OnPersonClick(this);" ></li>';
			}else if(accountType==1){
				tempNodeLi ='<li class="meshPic"><i class="icon iconfont icon-xinxi"></i><i class="icon iconfont icon-xing"></i><img id="'+iIndex+'" src="'+m_strHttp + 'jiaju/'+ a2[1]+'" alt="image"  onclick="OnPersonClick(this);" ></li>';
			}
			dataArray.push(tempNodeLi);
			dataArray.push(a2);
			iIndex++;
			m_ObjGroup_Person.push(dataArray);
		}
	}
	if( m_ObjGroup_Person.length > 0)
	{
		totalCount_Person = m_ObjGroup_Person.length;
		totalPage_Person  = (totalCount_Person + pageCount -1)/pageCount;
		setPager_Person(0);
		$("#PersonPageNum").text(1);
		$("#PersonPageAccount").text(parseInt(totalPage_Person));
		$("#PersonPicNumber").text(totalCount_Person);
	}
	else
	{
		totalCount_Person = 0;
		totalPage_Person 	= 0;
		curPage_Person 	= 0;
		$("#PersonPageNum").text(0);
		$("#PersonPageAccount").text(parseInt(totalPage_Person));
		$("#PersonPicNumber").text(totalCount_Person);
		$('.mpLists_Person').html("");
	}
}

function OnPersonClick(that)
{
	mHouseClass.mFurnitureClass.CreateObj(m_ObjGroup_Person[that.id][1]);
}

function setPager_Person(fValue)
{
	if(fValue <0 || (fValue+1)>totalPage_Person){
		return;
	}
	curPage_Person = fValue;
	var curNum = fValue*pageCount;

	$('.mpLists_Person').html("");

	m_pageObjData_Person.length = 0;
	for(var i = 0; curNum<m_ObjGroup_Person.length&&i<pageCount; i++,curNum++)
	{
		m_pageObjData_Person.push(m_ObjGroup_Person[curNum][0]);
	}
	var temp=curPage_Person+1;
	$("#PersonPageNum").text(parseInt(temp));
	for(var i=0; i<m_pageObjData_Person.length; i++)
	{
		$('.mpLists_Person').append(m_pageObjData_Person[i]);
	}
}


//其他
function initOther(int_1,int_2,int_3)
{
	m_ObjGroup_Other.length = 0;
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
			if_flog=a2[1]!= undefined && a2[1] != null &&a2[2]!=null && a2[4]!=null && i18n.t(`Language.${a2[6]}`)==i18n.t(`Language.其他`);
		}else{
			if_flog=a2[1]!= undefined && a2[1] != null &&a2[2]!=null && a2[4]!=null && i18n.t(`Language.${a2[6]}`)==i18n.t(`Language.${categoryType[int_1]}`) && i18n.t(`Language.${a2[7]}`)==i18n.t(`Language.${secondType[int_1][int_2]}`) && i18n.t(`Language.${a2[8]}`)==i18n.t(`Language.${levelThreeType[int_1][int_2][int_3]}`);
		}
		if( if_flog )
		{
			var k   = a2[2].lastIndexOf(".");
			var str = a2[2].slice(k+1);
			if( str == "a3d")
				continue;
			if (accountType==0){
				tempNodeLi ='<li class="meshPic"><i class="icon iconfont icon-xinxi"></i><i class="icon iconfont icon-d-" id="'+iIndex+'-1"></i><i class="icon iconfont icon-xing"></i><img id="'+iIndex+'" src="'+m_strHttp + 'jiaju/'+ a2[1]+'" alt="image"  onclick="OnOtherClick(this);" ></li>';
			}else if(accountType==1){
				tempNodeLi ='<li class="meshPic"><i class="icon iconfont icon-xinxi"></i><i class="icon iconfont icon-xing"></i><img id="'+iIndex+'" src="'+m_strHttp + 'jiaju/'+ a2[1]+'" alt="image"  onclick="OnOtherClick(this);" ></li>';
			}
			dataArray.push(tempNodeLi);
			dataArray.push(a2);
			iIndex++;
			m_ObjGroup_Other.push(dataArray);
		}
	}
	if( m_ObjGroup_Other.length > 0)
	{
		totalCount_Other = m_ObjGroup_Other.length;
		totalPage_Other  = (totalCount_Other + pageCount -1)/pageCount;
		setPager_Other(0);
		$("#OtherPageNum").text(1);
		$("#OtherPageAccount").text(parseInt(totalPage_Other));
		$("#OtherPicNumber").text(totalCount_Other);
	}
	else
	{
		totalCount_Other= 0;
		totalPage_Other = 0;
		curPage_Other 	= 0;
		$("#OtherPageNum").text(0);
		$("#OtherPageAccount").text(parseInt(totalPage_Other));
		$("#OtherPicNumber").text(totalCount_Other);
		$('.mpLists_Other').html("");
	}
}

function OnOtherClick(that)
{
	mHouseClass.mFurnitureClass.CreateObj(m_ObjGroup_Other[that.id][1]);
}

function setPager_Other(fValue)
{
	if(fValue <0 || (fValue+1)>totalPage_Other){
		return;
	}
	curPage_Other = fValue;
	var curNum = fValue*pageCount;

	$('.mpLists_Other').html("");

	m_pageObjData_Other.length = 0;
	for(var i = 0; curNum<m_ObjGroup_Other.length&&i<pageCount; i++,curNum++)
	{
		m_pageObjData_Other.push(m_ObjGroup_Other[curNum][0]);
	}
	var temp=curPage_Person+1;
	$("#OtherPageNum").text(parseInt(temp));
	for(var i=0; i<m_pageObjData_Other.length; i++)
	{
		$('.mpLists_Other').append(m_pageObjData_Other[i]);
	}
}