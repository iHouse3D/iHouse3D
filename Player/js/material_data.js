
var m_strWebService= localStorage.getItem('WebService');
var m_strHttp = m_strWebService + 'iHouse/data/texture/';

var m_strObjData='';

$(function(){

	if (!m_strWebService)
		{
			m_strWebService = 'http://'+window.location.host+'/';
		}

	$('.main-info-model').hover(function(){
		clearTimeout(setTimeOutInt);
	},function(){
		setTimeOutInt=setTimeout(function(){
			$('.main-info-model').hide();
		},200);
	})

	$('.main-scroll-itemList').delegate('i','click',function(){
		var _this=$(this),attrInt=parseInt(_this.parent().attr('int')),dataArr=m_ObjGroup_conter[attrInt];
		
		$('.main-info-model .main-info-img img').attr('src',m_strHttp+dataArr[1]);
		$('.main-info-model .mian-info-text-title').text(dataArr[0]);
		$('.main-info-model .mian-info-text-mun span').text(dataArr[3]);
		
		if ($(window).height()<(_this.offset().top+$('.main-info-model').height())) {
			$('.main-info-model').css({
				'top':$(window).height()-$('.main-info-model').height()-45
			})
		}else{
			$('.main-info-model').css({
				'top':_this.offset().top-45
			})
		}

		$('.main-info-model').show();
	})

	$('.main-scroll-itemList').delegate('img','click',function(event){
		var _this=$(this),attrInt=parseInt(_this.parent().attr('int')),dataArr=m_ObjGroup_conter[attrInt];
		// console.log(dataArr);
		onClick_Img(m_strHttp+dataArr[1],dataArr[1]);
		event.stopPropagation();    //  阻止事件冒泡
	})
})


function SetLogo()
{
	let href = window.location.href.toLowerCase();

	if(-1 != href.indexOf('dyyj.html'))
	{
		$('#shortcutIcon').attr('href','../img/dyyj.png');
		$('.imgLogo > img').attr('src','../img/dyyj.png');

		let titleName = i18n.t(`Language.Title`);

		$('.imgLogoName').html(titleName);
	}
	else if(-1 != href.indexOf('3d.html'))
	{
		$('#shortcutIcon').attr('href','../img/3d.png');
		$('.imgLogo > img').attr('src','../img/3d.png');

		let titleName = i18n.t(`Language.LogoName`);

		$('.imgLogoName').html(titleName);
	}
}