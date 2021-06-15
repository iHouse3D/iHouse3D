setShezhifangjian();
function setShezhifangjian(){
	let setHtml=`<el-scrollbar>
						<div class="draw-conter">
							<div class="draw-title">
								<span class="draw-title-name">属性</span>
								<i class="el-icon-arrow-up"></i>
							</div>
							<div class="draw-body draw-select">
								<div class="houseType clearfloat ">
									<span class="houseType-name">房间类型</span>
									<div class="select-block">
										<input type="text" readonly="readonly">
										<i class="el-icon-arrow-down"></i>
										<div class="select-item transition-draw">
											<div class="select-list-tiem">客餐厅</div>	
											<div class="select-list-tiem">厨房</div>	
											<div class="select-list-tiem">卧室</div>	
											<div class="select-list-tiem">阳台</div>	
											<div class="select-list-tiem">书房</div>	
											<div class="select-list-tiem">厨房</div>	
											<div class="select-list-tiem">卫生间</div>	
											<div class="select-list-tiem">储物间</div>	
										</div>
									</div>
								</div>

								<div class="unitStyle clearfloat">
									<span class="unitStyle-name">单元样式</span>
									<div class="unitStyle-img">
										<i class="el-icon-sort"></i>
										<img src="img/brick_diffuse.jpg" alt="">
									</div>
								</div>
							</div>
						</div>

						<div class="draw-conter">
							<div class="draw-title">
								<span class="draw-title-name">位置</span>
								<i class="el-icon-arrow-up"></i>
							</div>
							<div class="draw-body draw-select clearfloat">
								<div class="houseType clearfloat ">
									<span class="houseType-name">对齐方式</span>
									<div class="select-block">
										<input type="text" readonly="readonly">
										<i class="el-icon-arrow-down"></i>
										<div class="select-item transition-draw">
											<div class="select-list-tiem">左上对齐</div>	
											<div class="select-list-tiem">上对齐</div>	
											<div class="select-list-tiem">右上对齐</div>	
											<div class="select-list-tiem">左对齐</div>	
											<div class="select-list-tiem">居中对齐</div>	
											<div class="select-list-tiem">右对齐</div>	
											<div class="select-list-tiem">左下对齐</div>	
											<div class="select-list-tiem">下对齐</div>	
											<div class="select-list-tiem">右下对齐</div>	
										</div>
									</div>
								</div>
								<div class="position-slider clearfloat">
									<span class="position-name">旋转</span>
									<div class="sliderBlock">
										<el-slider v-model="huxing.xunzhuan.int"
											:min="huxing.xunzhuan.min"
											:max="huxing.xunzhuan.max"
											:disabled="huxing.xunzhuan.disabled"></el-slider>
									</div>
									<div class="sliderInputNum">
										<el-input-number v-model="huxing.xunzhuan.int"
											controls-position="right" size="mini"
											:min="huxing.xunzhuan.min"
											:max="huxing.xunzhuan.max"
											:disabled="huxing.xunzhuan.disabled"></el-input-number>
									</div>
									<span class="position-unit">度</span>
								</div>

								<div class="position-slider clearfloat">
									<span class="position-name">横向偏移</span>
									<div class="sliderBlock">
										<el-slider v-model="huxing.hengxiang.int"
											:min="huxing.hengxiang.min"
											:max="huxing.hengxiang.max"
											:disabled="huxing.hengxiang.disabled"></el-slider>
									</div>
									<div class="sliderInputNum">
										<el-input-number v-model="huxing.hengxiang.int"
											controls-position="right" size="mini"
											:min="huxing.hengxiang.min"
											:max="huxing.hengxiang.max"
											:disabled="huxing.hengxiang.disabled"></el-input-number>
									</div>
									<span class="position-unit">mm</span>
								</div>

								<div class="position-slider clearfloat">
									<span class="position-name">纵向偏移</span>
									<div class="sliderBlock">
										<el-slider v-model="huxing.zongxiang.int"
											:min="huxing.zongxiang.min"
											:max="huxing.zongxiang.max"
											:disabled="huxing.zongxiang.disabled"></el-slider>
									</div>
									<div class="sliderInputNum">
										<el-input-number v-model="huxing.zongxiang.int"
											controls-position="right" size="mini"
											:min="huxing.zongxiang.min"
											:max="huxing.zongxiang.max"
											:disabled="huxing.zongxiang.disabled"></el-input-number>
									</div>
									<span class="position-unit">mm</span>
								</div>

								<button class="rehuxingBtn">恢复默认</button>
							</div>
						</div>

						<div class="draw-conter">
							<div class="draw-title">
								<span class="draw-title-name">推荐搭配</span>
								<i class="el-icon-arrow-up"></i>
							</div>
							<div class="draw-body draw-recommend clearfloat">
								<div class="btn-recommend">沙发</div>
								<div class="btn-recommend">茶几</div>
								<div class="btn-recommend">餐桌</div>
								<div class="btn-recommend">餐椅</div>
							</div>
						</div>

					</el-scrollbar>`

	$('.shezhifangjian').html(setHtml);
}