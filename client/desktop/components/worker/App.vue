<template>
	<div class="worker-app">
		<pv-header height="50px" type="accont" />
		<article>
			<section class="is-left"><p-left/></section>
			<section class="is-center" >
				<!-- <div >100</div> -->
				<pv-poem :poem.sync="poem" type="edit" @poem:create="create" v-if="!loading.refresh"/>
			</section>
			<section class="is-right">
				<p-right :poem.sync="poem"/>
			</section>
		</article>
	</div>
</template>

<script>
	import Left from "./left.vue";
	import Right from "./right.vue";

	export default {
		components:{
			"p-left" : Left,
			"p-right" : Right
		},

		data(){
			return {
				poem: {
					title: "错误",   //--标题
					author_name:"郑愁予", //--作者名
					appreciation: "《错误》这首诗，以一连串具有传统意味和江南风情的意象，将豪放旷达的气质和欲语还休的情韵融为一体，营造出和谐、完整的艺术境界。虽然诗中写了思妇和浪子，但与传统的闺怨诗相比，表现出了较强的历史感和时空感。",  //--赏析
					letter: "/public/statics/images/letters/01.png", //--背景图
					body:[ //--诗歌文本
						'我打江南走过',
						'那等在季节里的容颜如莲花的开落',
						'东风不来，三月的柳絮不飞',
						'你的心如小小的寂寞的城',
						'恰若青石的街道向晚',
						'跫音不响，三月的春帷不揭',
						'你底心是小小的窗扉紧掩',
						'',
						'我达达的马蹄是美丽的错误',
						'我不是归人，是个过客……'
					],
					style:{
						"textAlign" : "center"
					}
				},
				loading:{
					refresh: false
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
					}
				};
				this.refresh()
			},

			refresh(){
				this.loading.refresh = true;
				this.$nextTick(()=>{
					this.loading.refresh = false;
				})
			}
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