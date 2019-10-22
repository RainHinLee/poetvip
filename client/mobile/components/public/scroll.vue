<!-- 
	滚动组件
	
	props: bar

 -->

<template>
	<div class="scroll-app" :class="{'hidebar': !bar}" ref="el">
		<slot></slot>
	</div>
</template>

<script>
	import Scrollbar from "smooth-scrollbar"
	export default {
		props:{
			bar:{
				type: Boolean,
				default: true
			}
		},
		methods:{
			init(){
				return Scrollbar.init(this.$refs.el,{

				});
			},

			update(){
				this.scroller.update();
			}
		},

		mounted(){
			this.scroller = this.init();
		}
	}
</script>


<style lang="stylus" scoped="">
.scroll-app
	position relative
	width 100%
	height 100%
	overflow hidden
</style>
<style lang="stylus">
.scroll-app
	&.hidebar
		.scrollbar-track
			opacity 0 
	.scrollbar-track
		&.scrollbar-track-y
			background transparent
</style>