
<!--浮层组件
		props:
			open : 是否显示
			title: 显示标题
			width : 宽度
			height : 高度
		events:
			close: 关闭事件
-->
<template>
	<div class="layer" :class="{'is-active':open}">
	  <div class="layer-content" :style="{width:width,height:height}" >
		  <header>
		  	<h6>{{title}}</h6>
		  	<p @click="close"><i class='iconfont iconclose-o'></i></p>
		  </header>
		  <section class="layer-body">
		  	<slot></slot>
  		</section>
  	</div>
	</div>
</template>

<script>
	export default {
		props:{
			open:{
				type: Boolean,
				default: false
			},

			width : {
				type: String,
				default: '600px'
			},

			height : {
				type: String,
				default: 'auto'
			},

			title : {
				type: String,
				default: ''
			},
		},

		methods:{
			close(){
				console.log("close");
				this.$emit("close");
			}
		}
	}

</script>

<style lang="stylus" scoped="">
.layer
	position fixed
	z-index 1000000
	left 0px
	top 0px
	width 100%
	height 100%
	align-items center
	justify-content center
	background rgba(0,0,0,0.5)
	display none
	&.is-active
		display flex
	.layer-content
		background #fff
		font-size 14px
		overflow-x hidden
		min-height 300px
		overflow hidden
		animation dialogIn 500ms
		transition 300ms
		border-radius 3px
		header
			height 50px
			display flex
			align-items center
			justify-content space-between
			padding 0px 20px
			color #222
			h6
				font-size 16px
				font-weight normal
				color #262626
			p
				transition 600ms
				cursor pointer
				.iconfont
					font-size 20px
				&:hover
					transform rotateZ(180deg)
		.layer-body
			padding 5px 20px 30px 20px
			
</style>
