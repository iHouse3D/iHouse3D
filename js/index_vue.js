		var m_ParamWallDlg, m_ParamWinDlg, m_ParamDoorDlg, m_ParamObjDlg, m_ParamTexDlg, m_ParamLabelDlg, mParamSystemDlg;
		var m_ParamImageToPlanDlg,m_ParamGroundDlg,m_ParamFloorDlg;
		var mHouseClass;


		var app = new Vue({
			el: '#app',
			i18n,
			data() {
				return {
					currentBstItem:null,
					bstMenus: ['删除'],
					description:
						{
							furnitureName:'家具',
							furnitureClear:'清除家具',
						},
					bstTableData:[],
					bstTableData1:[],
					floor: [{
					          value: '1',
					          label: '一层'
					        }, {
					          value: '2',
					          label: '二层'
					        }, {
					          value: '3',
					          label: '三层'
					        },{
					          value: '-10',
					          label: '全部'
					        }],
					floorValue:'全部',
					Obj_floorValue:'全部',
					accountType: accountType,
					GlobalSettings: { //全局设置
						checked_1: false,
						checked_2: false,
						checked_3: false,
						checked_4: false,
						checked_5: false,
						form: {
							name: '',
							oldPassword: '',
							newPassword: '',
							confirmPassword: ''
						},
						num_1: { int: 80, max: 500, min: 10, disabled: false },
						num_2: { int: 2800, max: 10000, min: 1000, disabled: false }
					},
					OrderList: {
						project_name:"",
						project_address:"",
						project_area:"",
						project_contacts:"",
						telphone:"",
						roomName:"",
						showType:-1 //0:物料清单  1:报价清单  2:加工清单  3:
					},
					header: {
						selectValue: '全部',
						selectOption: [{
							value: '1',
							label: '一层',
						}, {
							value: '2',
							label: '二层',
						}, {
							value: '3',
							label: '三层',
						}, {
							value: '-10',
							label: '全部',
						}],
						showLable: {
							wallLine: '1',
							check_coord: true,
							check_label: true,
							check_area: false,
							check_Furniture: true,
							check_RoomName: true,
							check_TransparentWall: true,
							check_ObjectAdsorption:true,
							check_kitchen: false,
							check_TransparentWall1: false,	// 内墙透明
							check_WallMode: 1,	// 全透明外墙
							check_ChildRoam3D:true,
							check_CoordTop:false,
							check_LockAll:false,			// 锁住所有物体
							check_ChildRender:true,
							check_DelWall:false,					// 连续删除墙体
						}
					},
					templateRoom: {
						templateRoom_radio: '0',
						searchInput: '',
					},
					modelBase: {
						modelBase_radio: '0',
						searchInput: '',
					},
					sliderSize: {
						sliderSizeValue: '1000',
						min: 100,
						max: 2500,
					},
					modelQYK:{
						searchInput: ''
					},
					modelGRK:{
						searchInput: ''
					},
					huxingAndScheme: {
						searchValue: '',
						selectValue: '温州',
						currentPage: 1,

						type: '', //类型
						area: '', //面积
						apartment: '', //户型
						style: '', //风格
					},
                    programSaveHouseType: {
                        name: '', //小区名称
                        housetype: '', //户型
                        designer: '', //设计师
                        area: '', //面积
                        province:'', //省
                        city:'', //市
                        address:'',//地址
                        description:'',//描述
                        option: [{ label: i18n.t("一居")},
                            	 { label: i18n.t("二居")},
                            	 { label: i18n.t("三居")},
                            	 { label: i18n.t("四居")},
                            	 { label: i18n.t("五居")}
                        ],
                    },
					programEditor: {
						name: '', //名称
						designUnit: '', //设计单位
						designer: '', //设计师
						style: '', //风格
						designCoding: '', //设计编码
						schemeAddr:'', //地址
						schemeDescription:'', //描述
						option: [{label: i18n.t("Language.PostModern")},
								 {label: i18n.t("Language.IndustryStyle")},
								 {label: i18n.t("Language.FrenchStyle")},
								 {label: i18n.t("Language.ChineseStyleDrawingRoom")},
								 {label: i18n.t("Language.American")},
								 {label: i18n.t("Language.Modern")},
								 {label: i18n.t("Language.EuropeanStyle")},
								 {label: i18n.t("Language.Pastoralism")},
								 {label: i18n.t("Language.NewClassics")},
								 {label: i18n.t("Language.ChineseStyle")},
								 {label: i18n.t("Language.Japanese")},
								 {label: i18n.t("Language.Mediterranean")},
								 {label: i18n.t("Language.EuropeStyle")},
								 {label: i18n.t("Language.SoutheastAsia")},
								 {label: i18n.t("Language.NorthernEurope")},
								 {label: i18n.t("Language.MingAndQing")},
								 {label: i18n.t("Language.MixAndMatch")}
						],
						typeName:0,	
					},
					attributePlugin:{
						BakImage: {
							length:{int: 1000,min: 1000,max: 20000,step: '10'},
							width: {int: 1000,min: 1000,max: 20000,step: '10'},
							angle: {int: 100,min: 0,max: 100,step: '1'},
						},
						text3D: {
							length:{int: 1000,min: 10,max: 2000,step: '10'},
							width: {int: 20,min: 10,max: 500,step: '1'},
							height:{int: 1000,min: 10,max: 2000,step: '10'},
							high:{int: 0,min: 10,max: 3000,step: '10'},
							angle: {int: 0,min: 0,max: 360,step: '5'},
						},						
					},					
					attributeInterface: {
						furniture: {
							length: {
								int: 0,
								min: 10,
								max: 10000,
								disabled: false,
								step: ''
							},
							width: {
								int: 0,
								min: 0,
								max: 10000,
								disabled: false,
								step: ''
							},
							height: {
								int: 0,
								min: 0,
								max: 5000,
								disabled: false,
								step: ''
							},
							Scaling: {
								int: 0,
								min: -100,
								max: 100,
								disabled: false,
								step: '',
							},
							angle: {
								int: 0,
								min: 0,
								max: 360,
								disabled: false
							},
							groundLevel: {
								int: 0,
								min: 0,
								max: 50000,
								disabled: false,
								step: ''
							},
							light_hotspot: {
								int: 350,
								min: 1,
								max: 1000,
								disabled: true,
								step: '1'
							},
							light_fallsize: {
								int: 385,
								min: 1,
								max: 1000,
								disabled: true,
								step: '1'
							},
							light_intensity: {
								int: 500,
								min: 1,
								max: 5000,
								disabled: true,
								step: ''
							},
							Xaxis: {
								int: -90,
								min: -180,
								max: 180,
								disabled: true,
								step: 1
							},
							Yaxis: {
								int: 0,
								min: -180,
								max: 180,
								disabled: true,
								step: 1
							},
							checked: false,
							locking: false,
							stageLightColor:'#FFFFFF',
							stageLight_checked:false,
							light_projector_map:'',
						},
						group: {
							angle: {int: 0,min: 0,max: 360,disabled: false,step: ''
							},
							groundLevel: {int: 0,min: 0,max: 8000,disabled: false,step: ''
							},
						},						
						wall: {
							length: {int: 0,min: 0,max: 9999,disabled: false,step: ''},
							width: {
								int: 200,
								min: 100,
								max: 1000,
								disabled: true,
								step: ''
							},
							height: {
								int: 0,
								min: 0,
								max: 9999,
								disabled: false,
								step: ''
							},
							type: 0,
							radio: 200,
							wallline: 0,
							zhengjiao:true,
							xifu:true,
							suoqiang:true
						},
						wallline:{
							rotate: 0,
						},
						window: {
							length: {
								int: 0,
								min: 0,
								max: 9999,
								disabled: false,
								step: ''
							},
							height: {
								int: 0,
								min: 0,
								max: 9999,
								disabled: false,
								step: ''
							},
							groundLevel: {int: 0,min: 0,max: 9999,disabled: false,step: ''
							},
							radio: 0,
						},
						ground:{
							height: {int: 0,min: 0,max: 5000,disabled: false,step: ''},
							thickness: {int: 0,min: 0,max: 5000,disabled: false,step: ''},
						},
						door: {
							length: {int: 0,min: 0,max: 9999,disabled: false,step: ''
							},
							height: {int: 0,min: 0,max: 9999,disabled: false,step: ''
							},
							groundLevel: {int: 0,min: 0,max: 9999,disabled: false,step: ''
							},
							radio: 0,
						},
						room_type: {
							options: [{
								value: '主卧',
								label: '主卧'
							}, {
								value: '侧卧',
								label: '侧卧'
							}, {
								value: '客厅',
								label: '客厅'
							}, {
								value: '厨房',
								label: '厨房'
							}],
							value: '主卧',
							rotate: {
								int: 0,
								min: 0,
								max: 360,
								disabled: false,
								step: ''
							},
							U_deviation: {
								int: 0,
								min: 0,
								max: 360,
								disabled: false,
								step: ''
							},
							V_deviation: {
								int: 0,
								min: 0,
								max: 360,
								disabled: false,
								step: ''
							},
							checked_1: false,
							checked_2: false,
						},
						pillars:{
							length: {int: 0,min: 0,max: 9999,disabled: false,step: ''},
							width: {
								int: 200,
								min: 100,
								max: 1000,
								disabled: false,
								step: ''
							},
							height: {
								int: 0,
								min: 0,
								max: 9999,
								disabled: false,
								step: ''
							},
							proportional:''
						},
						flue:{
							length: {int: 0,min: 0,max: 9999,disabled: false,step: ''},
							width: {
								int: 200,
								min: 100,
								max: 1000,
								disabled: false,
								step: ''
							},
							height: {
								int: 0,
								min: 0,
								max: 9999,
								disabled: false,
								step: ''
							},
							proportional:''
						}
					},
                    multipleSelection: [],
					advancedRender: {
						showRenderBtn: false,
						radio_1: false,
						radio_2: '',
						num: 0,
						input: {
							width: '',
							height: ''
						},
						autoWidthInt: {
							height_1: 0,
							height_2: 0,
						},
						showWidthHight: false
					},
					loading:null,
					tabFuntionInt:true,
					dialogTableVisible:false,
					gridData: [],

					clothPlaneNav:{
						listItem:['自定义'],
						actveItem:['自定义','自定义']
					},
					clothPlaneData:[],
					/*svg属性*/
					ClothPlaneRight:{
						jichu:{
							length: {int: 0,min: 0,max: 1000,disabled: false,step: ''},
							width: {int: 0,min: 0,max: 1000,disabled: false,step: ''},
							angle:{int: 0,min: 0,max: 360,disabled: false,step: ''},
							checked_1:false
						}
					},
					/*开装*/
					kz:{
						SelectArea:{int:'空间排布',data:[{name:'空间排布',value: '空间排布'},{name:'单面排布',value: '单面排布'}]},
						sizeH:{int:2400,data:[{name:2400,value:2400},{name:3000,value:3000}]},
						sizeW:{int:600,data:[{name:600,value:600},{name:800,value:800}]},
						cenggao:2800,
						texture:{int:'PP膜硅钙板',data:[{name:'PP膜硅钙板',value:'PP膜硅钙板'},
						{name:'薄瓷硅钙板',value:'薄瓷硅钙板'},{name:'壁布硅钙板',value:'壁布硅钙板'},{name:'壁纸硅钙板',value:'壁纸硅钙板'},{name:'复合防火板',value:'复合防火板'}]},
						system:{int:'自平系统',data:[{name:'自平系统',value:'自平系统'},{name:'调平系统',value:'调平系统'}]},
						arrange:{int:'缝居中',data:[{name:'缝居中',value:'缝居中'},{name:'板居中',value:'板居中'},{name:'竖向居中',value:'竖向居中'}]},
						seam:{int:'明缝',data:[{name:'明缝横向',value:'明缝横向'},{name:'明缝竖向',value:'明缝竖向'},{name:'暗缝横向',value:'暗缝横向'},{name:'暗缝竖向',value:'暗缝竖向'}]},
					},
					kz_MeasureProjectData:[],
					kz_MeasureHistory:[],

				}
			},
			methods: {
				BstProjectMenuClick(index) {
					var menu = document.querySelector("#bstMenu");
					menu.style.display = 'none';

					let message = `确定要删除 ${this.currentBstItem.function}-${this.currentBstItem.part} 数据吗?`;
					app.$confirm(message, '提示',
						{confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
						DeleteProjectItem(this.currentBstItem);

					}).catch(() => {

						return;
					});
				},
				clickTableRow(row, column, event) {
					var menu = document.querySelector("#bstMenu");
					menu.style.display = 'none';
				},
				rightClick(row, column, event) {
					this.currentBstItem = null;
					var menu = document.querySelector("#bstMenu");
					event.preventDefault();
					//获取我们自定义的右键菜单
					// 根据事件对象中鼠标点击的位置，进行定位
					//menu.style.position = 'absolute';
					menu.style.left = event.clientX + 'px';
					menu.style.top = event.clientY + 'px';
					// 改变自定义菜单的隐藏与显示
					menu.style.display = 'block';

					this.currentBstItem = row;

				},

				//--------------------------------百施通------------------------------
				BstProjectMenuClick1(index) {
					var menu = document.querySelector("#bstMenu1");
					menu.style.display = 'none';

					let message = `确定要删除 ${this.currentBstItem.function}-${this.currentBstItem.part} 数据吗?`;
					app.$confirm(message, '提示',
						{confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
						DeleteProjectItem1(this.currentBstItem);

					}).catch(() => {

						return;
					});
				},
				clickTableRow1(row, column, event) {
					var menu = document.querySelector("#bstMenu1");
					menu.style.display = 'none';
				},
				rightClick1(row, column, event) {
					this.currentBstItem = null;
					var menu = document.querySelector("#bstMenu1");
					event.preventDefault();
					//获取我们自定义的右键菜单
					// 根据事件对象中鼠标点击的位置，进行定位
					//menu.style.position = 'absolute';
					menu.style.left = event.clientX + 'px';
					menu.style.top = event.clientY + 'px';
					// 改变自定义菜单的隐藏与显示
					menu.style.display = 'block';

					this.currentBstItem = row;

				},
				//----------------------------------------
				OnProjectAdd()
				{
					let strRoom = $(".bst_project_room_content option:selected").val();
					let strFloor = $(".bst_project_part_content option:selected").val();
					let strCount = $(".bst_project_count_content").val();
					let strContent = $(".bst_project_content_item option:selected").val();
					let strCharact = $(".bst_project_charact_content").val();

					this.bstTableData.push({function:strRoom,part:strFloor,content:strContent,characteristic:strCharact,quantities:strCount});
				},
				OnProjectAdd1()
				{
					let strRoom = $(".bst_project_room_content1 option:selected").val();
					let strFloor = $(".bst_project_part_content1 option:selected").val();
					let strCount = $(".bst_project_count_content1").val();
					let strContent = $(".bst_project_content_item1 option:selected").val();
					let strCharact = $(".bst_project_charact_content1").val();
					let strWay = $(".bst_project_charact_content2").val();

					this.bstTableData1.push({function:strRoom,part:strFloor,content:strContent,characteristic:strCharact,quantities:strCount,way:strWay});
				},
				templatRradio(val){
					if (val==0) {	//普通家装
						homeDecorationType=0;
						OrderIf();
					}else if (val==1) {//智能家装
						homeDecorationType=1;
						OrderIf();
					}
				},
				FloorHeight(value){
					
					if (mHouseClass == undefined)
						return;
						mHouseClass.m_fHeight = value;
						mHouseClass.mCeilingClass.OnUpdateHeight();
				},
				furniture_lenght(value) {
					if (m_ParamObjDlg == undefined)
						return false;
					m_ParamObjDlg.length(value);
				},

				furniture_width(value) {
					if (m_ParamObjDlg == undefined)
						return false;
						
						m_ParamObjDlg.width(value);
					
				},
				furniture_height(value) {
					if (m_ParamObjDlg == undefined)
						return false;

						m_ParamObjDlg.height(value);
				},
				furnitureChecked_Scaling(val){
					
						this.attributeInterface.furniture.Scaling.int=0;

				},
				furniture_Scaling(value){
					let ftmp = 1.0;
					if(value>0)
					{
						ftmp  = (100+value)/100;	
					}
					else if(value<0)
					{
						ftmp  = (100-Math.abs(value))/100;	
					}				
					else if( value == 0)
						ftmp = 1;
					
					m_ParamObjDlg.OnChangeScale(ftmp);
				},
				furniture_angle(value) {
					if (m_ParamObjDlg == undefined)
						return false;

					m_ParamObjDlg.angle(value);
				},
				furniture_groundLevel(value) {
					if (m_ParamObjDlg == undefined)
						return false;

					m_ParamObjDlg.groundLevel(value);
				},
				furniture_light_hotspot(value) {
					if (m_ParamObjDlg == undefined)
						return false;

					m_ParamObjDlg.light_hotspot(value);
				},
				furniture_light_fallsize(value) {
					if (m_ParamObjDlg == undefined)
						return false;

					m_ParamObjDlg.light_fallsize(value);
				},
				furniture_light_intensity(value) {
					if (m_ParamObjDlg == undefined)
						return false;

					m_ParamObjDlg.light_intensity(value);
				},
				furniture_Xaxis(value){
					if (m_ParamObjDlg == undefined)
						return false;

					m_ParamObjDlg.angleX(value);
				},
				furniture_Yaxis(value){
					if (m_ParamObjDlg == undefined)
						return false;

					m_ParamObjDlg.angleY(value);
				},
				GroundHeight(value) {
					if (m_ParamGroundDlg == undefined)
						return false;
					m_ParamGroundDlg.height(value);
				},
				GroundThickness(value){
					if (m_ParamGroundDlg == undefined)
						return false;

					m_ParamGroundDlg.thickness(value);					
				},
				doorLenght(value) {
					if (m_ParamDoorDlg == undefined)
						return false;

					m_ParamDoorDlg.length(value);
				},
				doorHeight(value) {
					if (m_ParamDoorDlg == undefined)
						return false;

					m_ParamDoorDlg.height(value);
				},
				doorGroundLevel(value) {
					if (m_ParamDoorDlg == undefined)
						return false;

					m_ParamDoorDlg.groundLevel(value);
				},
				wallSelect(value){
					this.attributeInterface.wall.width.int=parseInt(value);
						
					if(mHouseClass.mWallClass.m_pCurWall == null )
					   return;
					   
					mHouseClass.mWallClass.m_pCurWall.m_fWidth = parseInt(value)/10;
					mHouseClass.mWallClass.m_pCurWall.OnRender();
				},
				wallRadio(value){
					if (value==5) {
						this.attributeInterface.wall.width.disabled=false;
						this.attributeInterface.wall.width.int=300;
					}else{
						this.attributeInterface.wall.width.int=value;
						this.attributeInterface.wall.width.disabled=true;
						this.WallWidth(value);
					}
				},
				WallWidth(value) {
					if (m_ParamWallDlg == undefined)
						return false;

					m_ParamWallDlg.width(value);
				},
				windowLenght(value) {
					if (m_ParamWinDlg == undefined)
						return false;

					m_ParamWinDlg.lenght(value);
				},
				windowHeight(value) {
					if (m_ParamWinDlg == undefined)
						return false;
					m_ParamWinDlg.height(value);
				},
				windowGroundLevel(value) {
					if (m_ParamWinDlg == undefined)
						return false;
					m_ParamWinDlg.groundLevel(value);
				},
				OnZoomIn(value) {
					//console.log(app);
					mCameraClass.setCamera2D_z(value);
				},
				pillars_length(value){},
				pillars_width(value){},
				pillars_height(value){},
				flue_length(value){},
				flue_width(value){},
				flue_height(value){},
				autoWidth() {
					if ($(".img-render").width() != 100) {
						this.advancedRender.autoWidthInt.height_1 = $(".img-render").width();
						this.advancedRender.autoWidthInt.height_2 = $(".render-video").width();
					}
					$(".img-render").height(this.advancedRender.autoWidthInt.height_1 * 0.75);
					$(".render-video").height(this.advancedRender.autoWidthInt.height_2 * 0.75);
				},
				ridioGroupValue(int) {
					if (int == 1) {
						this.advancedRender.showWidthHight = true;
					} else {
						this.advancedRender.showWidthHight = false;
						this.advancedRender.input.width = '';
						this.advancedRender.input.height = '';
					}
				},
				openFullScreen() {
			        this.loading = this.$loading({
			          lock: true,
			          text: 'Loading',
			          spinner: 'el-icon-loading',
			          background: 'rgba(0, 0, 0, 0.7)'
			    
			        });
		      },
		      searchInputChange(val){
		      	keyWord_search=val;
		      	keyWord_Funtion(val);
		      },
		      qyk_searchInputChange(val){
		      	keyWord_qyk(val);
		      },
		      grk_searchInputChange(val){
		      	keyWord_grk(val);
		      },
		      CreateSvg(strName){
			  },
		      fn_clothPlaneNav(n){
					this.clothPlaneNav.actveItem.splice(1, 1, n);　
					
					clothPlaneStyleClass(this.clothPlaneNav.actveItem[0],this.clothPlaneNav.actveItem[1]);
				},
			/*svg属性*/
				jichulength(int){},
				jichuwidth(int){},
				jichuangle(int){},

				//取得测量列表
				GetHistoryList(objItem){
					GetHistoryList(objItem.project_id);
				},

				/*导入测量户型数据*/
				ImportMeasureData(objItem){
					GetRoomContourXml(objItem.history_id);
				},
			/*svg属性*/
			},
			created(){
				if( m_SystemVersion == 'DouXi') 
					this.clothPlaneData=clothPlaneData;
			}
		})
