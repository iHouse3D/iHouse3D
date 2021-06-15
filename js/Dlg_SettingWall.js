SettingWall();
function SettingWall(){
	var setStyle=`<style>
		.listRight{
			float:right;
		}
		#suoqiang .demonstration{
			width: 87px;
		}
		#suoqiang .listRight .demonstration{
			width: 36px;
		}
		#suoqiang .listSlider{
			margin-top: 10px;
		}
	</style>`

	$('head').append(setStyle);
	var html=`<!-- 墙 --><!-- 墙 -->
			<div class="attributeInterface" id="suoqiang">
				<div class="attrTitle">
					<span>设置墙</span>
					<i class="el-icon-close attrClose"></i>
				</div>
				<div class="attrBody">
					<div class="itemList-title">
						<p>基础设计</p>
						<span class="el-icon-arrow-up"></span>
					</div>
					<div class="itemList-imgList clearfloat">
						<div class="listSlider clearfloat">
							
							<span class="demonstration">墙体高度</span>
							<el-switch
							  v-model="attributeInterface.wall.height.suoqiang"
							  active-text="关"
							  inactive-text="开">
							</el-switch>

						</div>
						<div class="listSlider clearfloat">
							
							<span class="demonstration">墙体高度</span>
							<div class="listRight">
								<div class="sliderInputNum">
									<el-input-number v-model="attributeInterface.wall.height.int" controls-position="right"
										size="mini" :min="attributeInterface.wall.height.min"
										:max="attributeInterface.wall.height.max"
										:disabled="attributeInterface.wall.height.disabled"></el-input-number> <!-- @input='WallWidth' -->
								</div>
								<span class="demonstration">mm</span>
							</div>
						</div>
						<div class="listSlider clearfloat">
							
							<span class="demonstration">墙体厚度</span>
							<div class="listRight">
								<div class="sliderInputNum">
									<el-input-number v-model="attributeInterface.wall.width.int" controls-position="right"
										size="mini" :min="attributeInterface.wall.width.min"
										:max="attributeInterface.wall.width.max"
										:disabled="attributeInterface.wall.width.disabled" @input='WallWidth'></el-input-number>
								</div>
								<span class="demonstration">mm</span>
							</div>
						</div>
						
					</div>
				</div>
			</div>`;

		$('.cont-main').append(html);
}