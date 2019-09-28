<!-- 左边组件 -->

<template>
	<div class="worker-style-app">
		<div class="tabs-box">
			<p-tabs :data="tabs" @select="tabChange"></p-tabs>
		</div>
		<div class="tabs-panel">
			<template v-if="type=='letters'">
				<pv-scroll>
					<div class="letters-box">
						<p-letters :list="letters" :letter="poem.letter"/>
					</div>
				</pv-scroll>	
			</template>

			<template v-if="type=='preview'">
				<div>手机预览</div>
			</template>
		</div>
	</div>
</template>
<script>
	
	import Tabs from "../public/tab.vue";
	import Letters from "./letters.vue";

	export default {
		props:{
			poem:{
				type:Object,
				default:()=>[]
			}
		},
		components:{
			"p-tabs" : Tabs,
			'p-letters' : Letters
		},

		data(){
			return {
				type: "base",
				letters: window.letters
			}
		},

		methods:{
			tabChange(data,index){
				this.type=data.type;
			}
		},

		computed:{
			tabs(){
				return [
					{"text": "背景图", icon: "",type:"letters"},
					{"text": "手机预览", icon: "",type:"preview"},
				]
			}
		},

	}
</script>

<style lang="stylus" scoped="">
.worker-style-app
	position relative
	width 100%
	height 100%
	.tabs-box
		width 100%
		height 40px
	.tabs-panel
		height calc(100% - 80px)
		width 100%
		.letters-box
			padding 15px
		
</style>