yandao();
zhuzi();
function yandao(){
	var setStyle=`<style>
	
	</style>`

	$('head').append(setStyle);

	var setHtml=`<div class="attributeInterface" id="yandao">
				<div class="attrTitle">
					<span>烟道</span>
					<i class="el-icon-close attrClose"></i>
				</div>
				<div class="attrBody">
					<div class="itemList-title">
						<p>基础设计</p>
						<span class="el-icon-arrow-up"></span>
					</div>
					<div class="itemList-imgList clearfloat">
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
								<el-input-number controls-position="right" size="mini" class="slider_value_length"  v-model="attributeInterface.flue.length.int"	
									:min="attributeInterface.flue.length.min"
									:max="attributeInterface.flue.length.max"
									:disabled="attributeInterface.flue.length.disabled"
									@input="flue_length"></el-input-number>
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
								<el-input-number controls-position="right" size="mini" class="slider_value_length"  v-model="attributeInterface.flue.width.int"	
									:min="attributeInterface.flue.width.min"
									:max="attributeInterface.flue.width.max"
									:disabled="attributeInterface.flue.width.disabled"
									@input="flue_width"></el-input-number>
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
								<el-input-number controls-position="right" size="mini" class="slider_value_length"  v-model="attributeInterface.flue.height.int"	
									:min="attributeInterface.flue.height.min"
									:max="attributeInterface.flue.height.max"
									:disabled="attributeInterface.flue.height.disabled"
									@input="flue_height"></el-input-number>
							</div>
							<span class="demonstration">mm</span>
						</div>
						<div class="uniformScaling justify-space">
							<el-checkbox v-model="attributeInterface.flue.proportional" @change="furnitureChecked_Scaling">等比缩放</el-checkbox>
						</div>
					</div>
				</div>
			</div>`;

	$('.cont-main').append(setHtml);
}
function zhuzi(){
	var setStyle=`<style>
	
	</style>`

	$('head').append(setStyle);

	var setHtml=`<div class="attributeInterface" id="zhuzi">
				<div class="attrTitle">
					<span>柱子</span>
					<i class="el-icon-close attrClose"></i>
				</div>
				<div class="attrBody">
					<div class="itemList-title">
						<p>基础设计</p>
						<span class="el-icon-arrow-up"></span>
					</div>
					<div class="itemList-imgList clearfloat">
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
								<el-input-number controls-position="right" size="mini" class="slider_value_length"  v-model="attributeInterface.pillars.length.int"	
									:min="attributeInterface.pillars.length.min"
									:max="attributeInterface.pillars.length.max"
									:disabled="attributeInterface.pillars.length.disabled"
									@input="pillars_length"></el-input-number>
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
								<el-input-number controls-position="right" size="mini" class="slider_value_length"  v-model="attributeInterface.pillars.width.int"	
									:min="attributeInterface.pillars.width.min"
									:max="attributeInterface.pillars.width.max"
									:disabled="attributeInterface.pillars.width.disabled"
									@input="pillars_width"></el-input-number>
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
								<el-input-number controls-position="right" size="mini" class="slider_value_length"  v-model="attributeInterface.pillars.height.int"	
									:min="attributeInterface.pillars.height.min"
									:max="attributeInterface.pillars.height.max"
									:disabled="attributeInterface.pillars.height.disabled"
									@input="pillars_height"></el-input-number>
							</div>
							<span class="demonstration">mm</span>
						</div>

						<div class="uniformScaling justify-space">
							<el-checkbox v-model="attributeInterface.pillars.proportional" @change="furnitureChecked_Scaling">等比缩放</el-checkbox>
						</div>
					</div>
				</div>
			</div>`;

	$('.cont-main').append(setHtml);
}