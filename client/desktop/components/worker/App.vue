<template>
	<div class="worker-app">
		<pv-header height="50px" type="accont" />
		<article>
			<section class="is-left"><p-left /></section>
			<section class="is-center" >
				<pv-poem :poem.sync="poem" type="edit" @poem:create="create" @poem:saved="poemSaved"/>
			</section>
			<section class="is-right">
				<p-right :poem.sync="poem"/>
			</section>
		</article>
	</div>
</template>

<script>

	import config from "./config.js";
	import Left from "./left.vue";
	import Right from "./right.vue";

	export default {
		components:{
			"p-left": Left,
			"p-right": Right,
		},

		data(){
			return {
				poem: Object.assign(this.poemOpts(),window.poem),
			}
		},

		methods:{
			create(){  //---创建新的诗歌
				document.location.href="/worker";
			},

			poemOpts(){
				return {
					title: "",   //--标题
					author_name: window.customer.pen_name, //--作者名
					letter: "", //--背景图
					appreciation: [],  //--赏析
					body:[],
					style:{
						"textAlign" : "center",
						"fontFamily" : "",
						"color" : "#444",
						"fontSize" : "16px"
					},					
				}
			},

			poemSaved(){ //---创建诗成功,通知诗集组件更新
				config.dispatcher.$emit("poetry:refresh")
			},
		},

		mounted(){ 
			config.dispatcher.$on("letter:select", (letter)=>{  //---选择信纸
				this.poem.letter = letter
			});

			config.dispatcher.$on("poetry:select",(poetry)=>{  //--选择诗集
				this.poem.poetry = poetry._id;
			});

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