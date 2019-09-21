<!-- 左边组件 -->

<template>
	<div class="worker-base-app">
		<div class="tabs-box">
			<p-tabs :data="tabs" @select="tab"></p-tabs>
		</div>
		<div class="tabs-pannel">

		</div>		
	</div>
</template>

<script>
	
	import Tabs from "../public/tab.vue";

	export default {
		components:{
			"p-tabs" : Tabs
		},

		data(){
			return {

			}
		},

		methods:{
			tab(data,index){
				this.type=data.type;
			}
		},

		computed:{
			tabs(){
				return [
					{"text": "所属诗集", icon: "iconshoucangjia1",type:"poetry"},
				]
			}
		},

		mounted(){

		}

	}
</script>

<style lang="stylus" scoped="">
	.worker-base-app
		position relative
		width 100%
		height 100%
		.tabs-box
			width 100%
			height 40px
		.tabs-pannel
			height calc(100% - 40px)
			width 100%
			.base-box
				padding 20px
				li
					margin-bottom 15px
					font-size 12px
					h4
						color #aaa
						padding-bottom 5px
					input
					textarea
						width 100%
						height 30px
						padding 10px 
						border none
						outline none
						border-radius 5px
						background #31363a
						color #fff
					textarea
						height auto
						resize none
						min-height 200px
					
					
</style>