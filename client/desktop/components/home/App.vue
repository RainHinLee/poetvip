<template>
	<div class="home-app">
		<pv-header type="home" />
		<pv-page class="page1" height="54px" bcolor="#56bff5">
			<a>最新消息: 安卓app和苹果app应用正在规划设计中。<time>2019-09-05日发布</time>		</a>
		</pv-page>
		<pv-page bcolor="#0075ff">
			<div class="page2">
				<h1>在线制作电子诗集</h1>
				<p>注册后自助制作，制作的诗集兼容多种设备：电脑，平板，手机，微信等</p>
				<div>
					<a>看诗集样本</a>
					<a>注册</a>
				</div>
			</div>
		</pv-page>
	</div>

</template>


<script type="text/javascript">
	
	export default {
		data(){
			return {

			}
		},

		mounted(){
			console.log("home mounted")
		}
	}

</script>

<style lang="stylus"> 
	@import "../public/layout.styl"
</style>

<style lang="stylus" scoped="">
.home-app
	padding-top $height-header
.page1
	transition 600ms
	&:hover
		background #323842 !important
	a
		display inline-flex
		width 100%
		height 100%
		align-items center
		justify-content center
		color rgba(255,255,255,0.8)
		cursor pointer
.page2
	padding 80px 0px
	h1
		font-size 40px
		color $color-white
		text-align center
	p
		padding-top 20px
		text-align center
		color $color-white
		font-size 16px
		color rgba(255,255,255,0.8)
	div
		padding-top 32px
		text-align center
		a
			display inline-flex
			width 272px
			height 62px
			border 1px solid $color-white
			align-items center
			justify-content center
			background transparent
			font-size 14px
			border-radius 3px
			margin 0px 10px
			cursor pointer
			transition 125ms
			&:nth-of-type(1)
				color $color-white
				&:hover
					color #0075ff
					background $color-white
			&:nth-of-type(2)
				color #0075ff
				background $color-white
				&:hover
					background rgba(255,255,255,0.8)
			

</style>