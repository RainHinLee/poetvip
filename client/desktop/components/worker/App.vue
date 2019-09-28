<template>
	<div class="worker-app">
		<pv-header height="50px" type="accont" />
		<article>
			<section class="is-left"><p-left /></section>
			<section class="is-center" >
				<!-- <div >100</div> -->
				<pv-poem :poem.sync="poem" type="edit" @poem:create="create" @poem:saved="poetrySaved" v-if="!loading.refresh"/>
			</section>
			<section class="is-right">
				<p-right :poem.sync="poem"/>
			</section>
		</article>

		<!-- 创建诗集浮层 -->
		<pv-layer :title="layer.title" width="460px" :open="layer.open" @close="layer.open=false">
			<p-poetry-create v-if="layer.type=='poetry'" @close="layer.open=false" @create:success="poetryCreate"/>
		</pv-layer>	

	</div>
</template>

<script>

	import config from "./config.js";
	import Left from "./left.vue";
	import Right from "./right.vue";
	import Create from "../account/poetry/create.vue";


	export default {
		components:{
			"p-left": Left,
			"p-right": Right,
			"p-poetry-create": Create,
		},

		data(){
			return {
				poem: {
					title: "再别康桥",   //--标题
					author_name:"徐志摩", //--作者名
					appreciation: "",  //--赏析
					letter: "", //--背景图
					body:[

					"轻轻的我走了，",
					"正如我轻轻的来；",
					"我轻轻的招手，",
					"作别西天的云彩。",
					"",
					"那河畔的金柳，",
					"是夕阳中的新娘；",
					"波光里的艳影，",
					"在我的心头荡漾。",
					"",
					"软泥上的青荇，",
					"油油的在水底招摇；",
					"在康桥的柔波里，",
					"我甘心做一条水草！",
					"",
					"那榆荫下的一潭，",
					"不是清泉，",
					"是天上虹 揉碎在浮藻间，",
					"沉淀着彩虹似的梦。",
					"",
					"寻梦？撑一支长蒿，",
					"向青草更青处漫溯，",
					"满载一船星辉，",
					"在星辉斑斓里放歌。",
					"",
					"但我不能放歌，",
					"悄悄是别离的笙箫；",
					"夏虫也为我沉默，",
					"沉默是今晚的康桥！",
					"",
					"悄悄的我走了，",
					"正如我悄悄的来；",
					"我挥一挥衣袖，",
					"不带走一片云彩。",
					],
					style:{
						"textAlign" : "center",
						"fontFamily" : "启功字体",
						"fontSize": "20px"
					},
					poetry: "",
				},

				loading:{
					refresh: false
				},

				layer:{
					open: false,
					title: "",
					type : "",
				}
			}
		},

		methods:{
			create(){  //---创建新的诗歌
				this.poem = {
					title: "",   //--标题
					author_name:"", //--作者名
					appreciation: "",  //--赏析
					letter: "", //--背景图
					body:[],
					style:{
						"textAlign" : "center"
					},
				};
				this.refresh()
			},

			poetryCreate(){ //--创建诗集成功
				config.dispatcher.$emit("poetry:refresh")
			},

			poetrySaved(){
				config.dispatcher.$emit("poetry:refresh")
			},

			refresh(){ //---更新数据
				this.loading.refresh = true;
				this.$nextTick(()=>{
					this.loading.refresh = false;
				})
			},
		},

		mounted(){ 
			config.dispatcher.$on("letter:select", (letter)=>{  //---选择信纸
				this.poem.letter = letter
			});

			config.dispatcher.$on("poetry:select",(poetry)=>{  //--选择诗集
				this.poem.poetry = poetry._id;
				this.$toast("诗集切换成功",'success');
			});

			config.dispatcher.$on("poetry:create",()=>{ //--新建诗集事件
				Object.assign(this.layer,{
					open: true,
					title: "新建诗集",
					type: "poetry"
				})

			})
		},
	}

</script>

<style lang="stylus"> 
	@import "../public/layout.styl"
	.worker-app
		.page-widget 
			padding 0px 15px
			.page-widget-body
				max-width 100% !important
				width 100% !important
		.header-widget
			box-shadow 0 0 15px 0 rgba(0,0,0,0.66)
			.logo
				font-size 20px !important	
</style>

<style lang="stylus" scoped="">
$height-header=50px
.worker-app
	padding-top $height-header
	height 100%
	article
		width 100%
		height 100%
		display flex
		justify-content space-between
		overflow hidden
		.is-center
			position relative
			z-index 1
			margin 0px auto
			width 640px
		.is-left
		.is-right
			position fixed
			top 50px
			height 100%
			width calc(50% - 320px)
			z-index 2
			background #2C2C2C
		.is-left
			.tabs-box
				width 100%
				height 40px
		.is-right 
			right 0px
</style>