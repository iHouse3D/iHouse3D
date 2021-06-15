$(function(){
	setLeftTitle();
	setXiaLaHuXing();
	setHuXingDaoHang();
	left_chidren();
	left_chidren_hover();
	bottom_new();
})


function setLeftTitle(){ //左侧标题的点击和hover事件
	$('.left-titleMenu>.left-titleMenu-item').hover(function(){
		
		if ($(this).attr('class')=='left-titleMenu-item titleMenu-active') {
			return;
		}

		let img_src=$(this).children('img').attr('src');

		// img_src=img_src.replace('.svg','_hover.svg');

		$(this).children('img').attr('src',img_src);
	},function(){
		if ($(this).attr('class')=='left-titleMenu-item titleMenu-active') {
			return;
		}
		let img_src=$(this).children('img').attr('src');

		// img_src=img_src.replace('_hover.svg','.svg');

		$(this).children('img').attr('src',img_src);
	});

	$('.left-titleMenu>.left-titleMenu-item').click(function(){
		
		if ($(this).attr('class')=='left-titleMenu-item titleMenu-active') {
			return;
		}

		let el=$('.left-titleMenu>.left-titleMenu-item');

		let img_src;
		for (var i = 0; i < el.length; i++) {
			if (el.eq(i)[0]!=$(this)[0]) {
				el.eq(i).attr('class','left-titleMenu-item');

				img_src=el.eq(i).children('img').attr('src');
				// img_src=img_src.replace('_hover.svg','.svg');
				el.eq(i).children('img').attr('src',img_src);
				el.eq(i).removeAttr('style');
			}
		}
		$(this).attr('class','left-titleMenu-item titleMenu-active');
		if ($(this).children('ul').length>0) {
			let he=$(this).children('ul').height();
			$(this).height($(this).height()+he+10);
		}


		left_conter($(this));
	});
}

function left_conter(_this){
	var index_int=_this.index();
	$('.modelBase-right').hide();
	if (index_int==0) { //户型
		$('.create-cont').show();
	}else if(index_int==1){//系统
		$('.systemLibrary').show();
	}else if(index_int==2){//智能
		$('.templateRoom').show();	
	}else if(index_int==3){ //模型
		$("#mFurnitureDlg").show();Mods_Arr=m_ObjGroup; //家具
		_this.children('li').removeClass('active');
		_this.children('li').eq(0).addClass('active');
	}else if(index_int==4){ //商家
		$('#mModelBrand').show();
		GetUserBrands();
	}else if(index_int==5){ //我的
		$('#mCollectionDlg').show(); //收藏
		Mods_Arr=m_CollectionGroup;
		// m_pageData_Collection();
		_this.children('li').removeClass('active');
		_this.children('li').eq(0).addClass('active');
	}
}

function left_chidren(){
	$('.titleMenu-list>li').click(function(){
		$('.modelBase-right').hide();
		let _int=$(this).parents(".left-titleMenu-item").index(),__int=$(this).index();
		if(_int==3){
			if (__int==0) {
				$("#mFurnitureDlg").show();Mods_Arr=m_ObjGroup; //家具
			}else if(__int==1){
				$("#mCupboardDlg").show();Mods_Arr=m_ObjGroup_Cupboard; //厨卫
			}else if(__int==2){
				$("#mLightingDlg").show();Mods_Arr=m_ObjGroup_Lighting; //照明
			}else if(__int==3){
				$("#mApplianceDlg").show();Mods_Arr=m_ApplianceGroup; //家电
			}else if(__int==4){
				$("#mDecorationDlg").show();Mods_Arr=m_DecorationGroup; //家饰
			}else if(__int==5){
				$("#mToolingDlg").show();Mods_Arr=m_ToolingGroup;// 工装
			}else if(__int==6){
				$("#mMaterialDlg").show();
				Mods_Arr=m_MatGroup;
				MatType=2;//判断是否为硬装
			}
		}else if(_int==5){
			if (__int==0) {
				$('#mCollectionDlg').show(); //收藏
				Mods_Arr=m_CollectionGroup;
//				 m_pageData_Collection();
			}else if(__int==1){
				$('#mModelHideDlg').show(); //隐藏
				Mods_Arr=m_ModelHideGroup;
			}else if(__int==2){}
		}
		$(this).siblings().removeClass('active');
		$(this).addClass('active');
	});
}

function left_chidren_hover(){
	var setTimeOutInt;
	$('.titleMenu-list>li').hover(function (event) {
		/* Act on the event */
		let _int=$(this).parents(".left-titleMenu-item").index();

		if(_int== 3){
			if ($(this).index()==6) {
				$(this).siblings().removeClass('item_hover');
				$(this).addClass('item_hover');
				let i = $(this).index();
				let obj=$(this),name=$(this).text();
				$('.modelBase_link_model').hide();
				$('.modelBase_Mat_model').hide();
				setMatHtml(obj);
			}else{
				$(this).siblings().removeClass('item_hover');
				$(this).addClass('item_hover')
				let i = $(this).index();
				let obj=$(this),name=$(this).text();
				$('.modelBase_link_model').hide();
				$('.modelBase_Mat_model').hide();
				setHtmlName(obj,name);
			}
		}
			clearTimeout(setTimeOutInt);
	},function(){
		setTimeOutInt=setTimeout(function(){
			// $('.left-titleMenu>li').removeClass('titleMenu-active');
			$('.modelBase_link_model').hide();
			$('.modelBase_Mat_model').hide();
		},500);
	});

	$('.modelBase_Mat_model').hover(function(){
		clearTimeout(setTimeOutInt);
	},function(){
		setTimeOutInt=setTimeout(function(){
			$(".modelBase_Mat_model").hide();
		}, 100);
	});

	$('.modelBase_link_model').hover(function(){
		clearTimeout(setTimeOutInt);
	},function(){
		setTimeOutInt=setTimeout(function(){
			$(".modelBase_link_model").hide();
		}, 100);
	});
}

function setXiaLaHuXing(){ //户型下拉菜单

	$('.draw-title').click(function(){

		let pel=$(this).parent(),str=pel.attr('style');
		if (str==undefined) {
			$(this).children('i').css('transform','rotate(180deg)');
			pel.animate({'height': 30},300);
			pel.css('height',30);
		}else{
			$(this).children('i').removeAttr('style');
			let he=$(this).next().outerHeight(true);
			pel.animate({'height': pel.height()+he},300,function(){
				pel.removeAttr('style')
			});
		}
	})
}

function setHuXingDaoHang(){ //右侧导航高度

	$('.rightpropertybar').css('height',$('.body_conter').outerHeight(true)-$('.reNavigation').outerHeight(true));

	$(window).resize(function(){

		$('.rightpropertybar').css('height',$('.body_conter').outerHeight(true)-$('.reNavigation').outerHeight(true));
	})

	var bool=false;
	$('.reNavigation .Nav-handle').mousedown(function(event) {
		/* Act on the event */
		bool=true;
		
		$(window).mousemove(function(event){
			if (!bool) {
				return;
			}
			let winW=$(window).width();
			let DW=winW-event.clientX;
			let DH=event.clientY-51;

			if (DW>240) {
				$('.reNavigation').width(DW);
			}else{
				$('.reNavigation').width(240);
			}

			if (DH>185) {
				if (DH<540) {
					$('.reNavigation').height(DH);
				}else{
					$('.reNavigation').height(540);
				}
			}else{
				$('.reNavigation').height(185);
			}

			$('.rightpropertybar').height($('.body_conter').outerHeight(true)-$('.reNavigation').outerHeight(true));
			// console.log(event);
	        window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
		});

		$(window).mouseup(function(){
			bool=false;
		});
	});
}

function bottom_new(){
	$('.nav-tab-block>.nav-tab-item').click(function(){
		$(this).siblings().removeClass('nav-tab-acitve');
		$(this).addClass('nav-tab-acitve');

		let text=$(this).text();
		if (text=='漫游') {
			$('.sliderSize-block').hide();
		}else{
			$('.sliderSize-block').show();
		}
	});
}