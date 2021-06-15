
FloorParamDlgUI()

/**
 * @api FloorParamDlgUI
 * @apiGroup 全局函数
 * @apiDescription 动态加载地面参数窗口                             
 */
function FloorParamDlgUI() 
{
	var setStyle=`<style>
	.FloorDlg{
		position: absolute;
	    bottom: 0px;
	    left:  0px;
	    width: 315px;
	    height: 100%;	    
	    z-index: 6000;
		background-color: #F5F5F5;
	}
	</style>`
	$('head').append(setStyle);
	
	var tempNode =`<div class="FloorDlg" style="display:none;">
			<div class="FreeDrag_header">
				<span>墙体调整</span>
				<i class="el-icon-close" onclick="m_ParamFloorDlg.HideBar()"></i>
			</div>
			<div class="FreeDrag_body">
			</div>
		</div>`;
	$('.cont-main').prepend(tempNode);
}

$(function(){
	var x = 0;
	var y = 0;
	var l = 0;
	var t = 0;
	var isDown = false;

	$('.FloorDlg .FreeDrag_header').mousedown(function(event) {
		//获取x坐标和y坐标
	    x = event.clientX;
	    y = event.clientY;
	    //获取左部和顶部的偏移量
	    l = $('.FloorDlg').offset().left;
	    t = $('.FloorDlg').offset().top;
	    //开关打开
	    isDown = true;
	    //设置样式
		$(window).mousemove(function(event){
			if (!isDown) {return;}

			//获取x和y
		    var nx = event.clientX;
		    var ny = event.clientY;
		    //计算移动后的左偏移量和顶部的偏移量
		    var nl = nx - (x - l);
		    var nt = ny - (y - t);

		    if (nl<=0) {
		    	nl=0;
		    }
		    if (nt<=0) {
		    	nt=0;
		    }

		    var dw=$('.FloorDlg').outerWidth(true);
		   	var ww=$(window).width();
		    var dh=$('.FloorDlg').outerHeight(true);
		   	var wh=$(window).height();

		    if (nl+dw>=ww) {
		    	nl=(ww-dw);
		    }

		    if (nt+dh>=wh) {
		    	nt=(wh-dh);
		    }

		    $('.FloorDlg').css({
		    	left: nl + 'px',
		    	top: nt + 'px'
		    });

	        window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
		});

		$(document).mouseup(function(){
			//开关打开
		    isDown = false;
		});
	});
})

function Dlg_FloorAttribute()
{
	this.HideBar = function()
	{
		$('.FloorDlg').hide();
	};
}

