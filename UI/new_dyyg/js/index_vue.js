
var app = new Vue({
	el:"#app",
	data(){
		return{
			leftShowConter:'huxing',
			rightShowConter:'fangjian',
			header:{
				selectValue: '',
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
				}]
			},
			sliderSize:{
				sliderSizeValue: '1000',
				min: 100,
				max: 2500,
			},
			huxing:{
				xunzhuan:{
					min:0,
					max:1000,
					int:100,
					disabled:false
				},
				hengxiang:{
					min:0,
					max:1000,
					int:100,
					disabled:false
				},
				zongxiang:{
					min:0,
					max:1000,
					int:100,
					disabled:false
				}
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
		}
	},
	methods:{
		OnZoomIn(val){

		},
	}
})