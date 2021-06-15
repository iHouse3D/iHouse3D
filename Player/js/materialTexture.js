var setTimeOutInt;//时间计时器

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
	outerHeight('.cont-body',window,'.cont-header');
	outerHeight('.main-body-itemList','.main-body','.main-body-from',-40);
	$(window).resize(function(){
		outerHeight('.cont-body',window,'.cont-header');
		outerHeight('.main-body-itemList','.main-body','.main-body-from',-40);
	})


	$(".main-title>li").hover(function(){
		var block_top=$(this).offset().top+12,block_left=$(this).offset().left+4;
		$(".left-block-adsloute").show();
		$(".left-block-adsloute").offset({left:block_left,top:block_top});

	},function(){
		$(".left-block-adsloute").hide();
	})

	// $('.main-scroll-itemList').hide();
	// $('.main-scroll-itemList').show();

	// 分类选项

	$(".type-cont li").click(function(){
		if ($(this).parents('.type-cont').attr("multiSelect")=='true') {
			$(this).toggleClass('el-icon-remove-outline');

		}else{
			$(this).siblings().removeClass('type-link-1');
			$(this).addClass('type-link-1');
		}
	})

	// 分类选项


	// 数据第一级分类

	$('.main-title>li').click(function(e){
		var intString = $(this).attr('int');

		$('.main-body').hide();
		$('.main-info-model').hide();
		$('.main-my-body').hide();
		// $('#ceramics').hide();
		// $('#cloths').hide();

		$(this).siblings().removeClass('main-title-active');
		$(this).addClass('main-title-active');


		if (intString=='101') {
			$('#timber').show();
			m_ObjGroup_conter=m_ObjGroup_timber;
		}else if(intString=='102'){
			$('#cloths').show();
			m_ObjGroup_conter=m_ObjGroup_cloths;
		}else if(intString=='103'){
			$('#leather').show();
			m_ObjGroup_conter=m_ObjGroup_leather;
		}else if(intString=='104'){
			$('#painting').show();
			m_ObjGroup_conter=m_ObjGroup_painting;
		}else if(intString=='105'){
			$('#wallpaper').show();
			m_ObjGroup_conter=m_ObjGroup_wallpaper;
		}else if(intString=='106'){
			$('#ceramics').show();
			m_ObjGroup_conter=m_ObjGroup_ceramics;
		}else if(intString=='107'){
			$('#glass').show();
			m_ObjGroup_conter=m_ObjGroup_glass;
		}else if(intString=='108'){
			$('#mirrorSurface').show();
			m_ObjGroup_conter=m_ObjGroup_mirrorSurface;
		}else if(intString=='109'){
			$('#metal').show();
			m_ObjGroup_conter=m_ObjGroup_metal;
		}else if(intString=='110'){
			$('#luminescentMaterial').show();
			m_ObjGroup_conter=m_ObjGroup_luminescentMaterial;
		}else if(intString=='111'){
			$('#plastic').show();
			m_ObjGroup_conter=m_ObjGroup_plastic;
		}else if(intString=='112'){
			$('#picture').show();
			m_ObjGroup_conter=m_ObjGroup_picture;
		}else if (intString=='100'){
			$('.main-my-body').show();
		}

		e.stopPropagation();    //  阻止事件冒泡
	})

	CheckUser();
})

function CheckUser()
{
	// 苏州服务器
	if( m_strWebService== "http://3d.i3dtu.com/") {
		$('.imgLogo > img').hide();
		$('.imgLogoName').html("小丑鱼活动云设计");
		$('.imgLogoName').css('color', '#ed6c00');
	}
}

function opensBtnModel(_this,obj){
	var icon_top=$(_this).offset().top,icon_left=370;

	$(obj).removeAttr("style");
	$(obj).offset({left:icon_left,top:icon_top})
	$(obj).show();
}
function closeBtnModel(obj){
	$(obj).parents('.template-input-buttom-type').hide();
}
