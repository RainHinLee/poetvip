
<!-- 
	props:
		message: 提示语
		type: confirm | alert
 -->

<template>
	<div class="dialog">
		<div class='dialog-bg'></div>
		<div class='dialog-content'>
			<p class='dialog-mark'>
				<i class="iconfont iconinfo-r-o"></i>
			</p>
			<h3 class='dialog-title'>提示</h3>
			<p class='dialog-text' v-html="message"></p>
			<div class='dialog-btns'>
				<a class='cancel' @click="cancel">取消</a>
				<a class="confirm" @click="confirm">确定</a>
			</div>
		</div>		
	</div>
</template>

<script>
	export default {
		name: "pdialog",  //--此处不能命名dialog chrome和safari原生自带dialog标签
		props:{
			message:{
				type: String,
				default: ""
			},
			type:{
				type: String,
				default:""
			}
		},
		methods:{
			cancel(){
				this.$emit('cancel');
				this.remove();
			},
			confirm(){
				this.$emit('confirm');
				this.remove();
			},
		}
	}
</script>

<style lang="stylus" scoped="">
.dialog
	position fixed
	width 100%
	height 100%
	display flex
	align-items center
	justify-content center
	z-index 10000
	left 0px
	top 0px
	.dialog-bg
		position absolute
		width 100%
		height 100%
		left 0px
		top 0px
		z-index 1
		background rgba(0,0,0,0.7)
	.dialog-content
		position relative
		z-index 2
		margin-top 0px
		background #fff
		font-size 14px
		color $color-font
		width 320px
		padding 25px 30px
		line-height 1.0
		animation dialogIn 500ms forwards
		border-radius 3px
		.dialog-mark
			text-align center
			line-height 1.0
			.iconfont
				font-size 36px
		.dialog-title
			font-weight bold
			text-align center
			padding 10px 0px
			font-size 16px
		.dialog-text
			color #888
			text-align center
			line-height 1.3
		.dialog-btns
			padding-top 25px
			text-align center
			a
				height 30px
				width 80px
				border 1px solid #ddd
				font-size 14px
				outline none
				background transparent
				cursor pointer
				line-height 1.0
				transition 300ms
				text-decoration none
				color $color-font
				display inline-flex
				align-items center
				justify-content center
				&.confirm
					margin-left 10px
				&:hover
					border-color #aaa


</style>