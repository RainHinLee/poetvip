<!-- 块组件
	props:
		bcolor 背景色
		height 块高度
		width: 宽度
	slots:
		bg 背景下的图片
		
 -->
<template>
	<section class="page-widget" :style="{'background':bcolor,'height':height}">
		<div class="page-widget-bg">
			<slot name='bg'></slot>
		</div>
		<div class="page-widget-body">
			<slot></slot>
		</div>
	</section>
</template>

<script>
	export default {
		props:{
			"bcolor":{
				type: String,
				default: "transparent"
			},

			"height":{
				type: String,
				default: "auto"
			}
		},
	}

</script>

<style lang="stylus" scoped="">
.page-widget
	display flex
	position relative
	width 100%
	justify-content center
	.page-widget-body
		width 90%
		position relative
		z-index 2
		max-width $width-layout
	.page-widget-bg
		position absolute
		z-index 1
		width 1920px
		height 100%
		left 50%
		top 0px
		margin-left -960px
</style>