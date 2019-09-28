<!-- 左边组件 -->

<template>
	<div class="worker-left-app">
		<div class="tabs-box">
			<p-tabs :data="tabs" @select="tab"></p-tabs>
		</div>
		<div class="tabs-panel">
			<template v-if="type=='poetry'">
				<p-poetry/>
			</template>
		</div>		
	</div>
</template>

<script>
	
	import config from "./config.js";
	import Tabs from "../public/tab.vue";
	import Poetry from "./poetry.vue";
	import api from "api";

	export default {
		components:{
			"p-tabs" : Tabs,
			'p-poetry' : Poetry
		},

		data(){
			return {
				type: "poetry"
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
	}
</script>

<style lang="stylus" scoped="">
	.worker-left-app
		position relative
		width 100%
		height 100%
		.tabs-box
			width 100%
			height 40px
		.tabs-panel
			height calc(100% - 40px)
			width 100%
		
					
</style>