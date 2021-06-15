Pillars();
flue();
function Pillars(){
	let setStyle=`<style>
			.pillars-conter,.flue-conter{
				position: absolute;
				top:40%;
				left: 40%;
				background-color: #FFF;
				width: 230px;
				height: 500px;
				border-radius: 5px;
				z-index: 100;
				overflow: hidden;
				display: none;
			}
			.pillars-header,.flue-header{
				width: 100%;
				height: 40px;
				background-color: #F5F5F5;
				box-sizing: border-box;
				padding: 9px 10px;
				line-height: 22px;
			}
			.pillars-header span,.flue-header span{
				font-weight: bold;
				font-size: 14px;
			}
			.pillars-body,.flue-body{
				box-sizing: border-box;
				padding:5px 8px;
			}
			.pillars-body .demonstration:nth-of-type(1),.flue-body .demonstration:nth-of-type(1){
				width: 45px;
			}
			.pillars-body .sliderInputNum input,.flue-body .sliderInputNum input{
				background-color: #FFF;
			}
	</style>`;
	$('head').append(setStyle);
	let setHtml=`<div class="pillars-conter">
		<div class="pillars-header"><span>柱子</span><i class="el-icon-close attrClose"></i></div>
		<div class="pillars-body">
			<div class="listSlider">
				<!-- 长度 -->
				<span class="demonstration">长度</span>
				<div class="sliderBlock">
					<el-slider v-model="attributeInterface.pillars.length.int"
						:min="attributeInterface.pillars.length.min"
						:max="attributeInterface.pillars.length.max"
						:disabled="attributeInterface.pillars.length.disabled"
						@input="pillars_length"></el-slider>
				</div>
				<div class="sliderInputNum">
					<input type="number" class="slider_value_length"  v-model="attributeInterface.pillars.length.int"	
						:min="attributeInterface.pillars.length.min"
						:max="attributeInterface.pillars.length.max"
						:disabled="attributeInterface.pillars.length.disabled"
						@input="pillars_length"></input>
				</div>
				<span class="demonstration">mm</span>
			</div>
			<div class="listSlider">
				<!-- 宽度 -->
				<span class="demonstration">宽度</span>
				<div class="sliderBlock">
					<el-slider v-model="attributeInterface.pillars.width.int"
						:min="attributeInterface.pillars.width.min"
						:max="attributeInterface.pillars.width.max"
						:disabled="attributeInterface.pillars.width.disabled"
						@input="pillars_width"></el-slider>
				</div>
				<div class="sliderInputNum">
					<input type="number" class="slider_value_length"  v-model="attributeInterface.pillars.width.int"	
						:min="attributeInterface.pillars.width.min"
						:max="attributeInterface.pillars.width.max"
						:disabled="attributeInterface.pillars.width.disabled"
						@input="pillars_width"></input>
				</div>
				<span class="demonstration">mm</span>
			</div>
			<div class="listSlider">
				<!-- 高度 -->
				<span class="demonstration">高度</span>
				<div class="sliderBlock">
					<el-slider v-model="attributeInterface.pillars.height.int"
						:min="attributeInterface.pillars.height.min"
						:max="attributeInterface.pillars.height.max"
						:disabled="attributeInterface.pillars.height.disabled"
						@input="pillars_height"></el-slider>
				</div>
				<div class="sliderInputNum">
					<input type="number" class="slider_value_length"  v-model="attributeInterface.pillars.height.int"	
						:min="attributeInterface.pillars.height.min"
						:max="attributeInterface.pillars.height.max"
						:disabled="attributeInterface.pillars.height.disabled"
						@input="pillars_height"></input>
				</div>
				<span class="demonstration">mm</span>
			</div>
		</div>
	</div>`

	$('.cont-main').append(setHtml);
}

function flue(){
	let setHtml=`<div class="flue-conter">
		<div class="flue-header"><span>烟道</span><i class="el-icon-close attrClose"></i></div>
		<div class="flue-body">
			<div class="listSlider">
				<!-- 长度 -->
				<span class="demonstration">长度</span>
				<div class="sliderBlock">
					<el-slider v-model="attributeInterface.flue.length.int"
						:min="attributeInterface.flue.length.min"
						:max="attributeInterface.flue.length.max"
						:disabled="attributeInterface.flue.length.disabled"
						@input="flue_length"></el-slider>
				</div>
				<div class="sliderInputNum">
					<input type="number" class="slider_value_length"  v-model="attributeInterface.flue.length.int"	
						:min="attributeInterface.flue.length.min"
						:max="attributeInterface.flue.length.max"
						:disabled="attributeInterface.flue.length.disabled"
						@input="flue_length"></input>
				</div>
				<span class="demonstration">mm</span>
			</div>
			<div class="listSlider">
				<!-- 宽度 -->
				<span class="demonstration">宽度</span>
				<div class="sliderBlock">
					<el-slider v-model="attributeInterface.flue.width.int"
						:min="attributeInterface.flue.width.min"
						:max="attributeInterface.flue.width.max"
						:disabled="attributeInterface.flue.width.disabled"
						@input="flue_width"></el-slider>
				</div>
				<div class="sliderInputNum">
					<input type="number" class="slider_value_length"  v-model="attributeInterface.flue.width.int"	
						:min="attributeInterface.flue.width.min"
						:max="attributeInterface.flue.width.max"
						:disabled="attributeInterface.flue.width.disabled"
						@input="flue_width"></input>
				</div>
				<span class="demonstration">mm</span>
			</div>
			<div class="listSlider">
				<!-- 高度 -->
				<span class="demonstration">高度</span>
				<div class="sliderBlock">
					<el-slider v-model="attributeInterface.flue.height.int"
						:min="attributeInterface.flue.height.min"
						:max="attributeInterface.flue.height.max"
						:disabled="attributeInterface.flue.height.disabled"
						@input="flue_height"></el-slider>
				</div>
				<div class="sliderInputNum">
					<input type="number" class="slider_value_length"  v-model="attributeInterface.flue.height.int"	
						:min="attributeInterface.flue.height.min"
						:max="attributeInterface.flue.height.max"
						:disabled="attributeInterface.flue.height.disabled"
						@input="flue_height"></input>
				</div>
				<span class="demonstration">mm</span>
			</div>
		</div>
	</div>`

	$('.cont-main').append(setHtml);
}

$(function(){
	dragHeader('.pillars-conter','.pillars-conter>.pillars-header');
	dragHeader('.flue-conter','.flue-conter>.flue-header');
	$(function(){
		$('.pillars-conter .attrClose').click(function(){
			$(this).parents('.pillars-conter').hide();
		});
		$('.flue-conter .attrClose').click(function(){
			$(this).parents('.flue-conter').hide();
		})
	})
});

function dragHeader(f,h){
	var x = 0;
	var y = 0;
	var l = 0;
	var t = 0;
	var isDown = false;

	$(h).mousedown(function(event) {
		//获取x坐标和y坐标
	    x = event.clientX;
	    y = event.clientY;
	    //获取左部和顶部的偏移量
	    l = $(f).offset().left;
	    t = $(f).offset().top;
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

		    var dw=$(f).outerWidth(true);
		   	var ww=$(window).width();
		    var dh=$(f).outerHeight(true);
		   	var wh=$(window).height();

		    if (nl+dw>=ww) {
		    	nl=(ww-dw);
		    }

		    if (nt+dh>=wh) {
		    	nt=(wh-dh);
		    }

		    $(f).css({
		    	left: nl + 'px',
		    	top: nt + 'px'
		    });

	        window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
		});

		$(h).mouseup(function(){
			//开关打开
		    isDown = false;
		});
	});
}