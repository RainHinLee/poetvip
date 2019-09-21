<!-- 滚动组件 -->

<template>
	<div class="scroll-app" ref="el">
		<slot></slot>
	</div>
</template>

<script>
	import Scrollbar from "smooth-scrollbar"
	export default {
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
.scrollbar-track
	&.scrollbar-track-y
		background transparent
</style>