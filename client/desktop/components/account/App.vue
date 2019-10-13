<template>
	<div class="account-app">
		<pv-header height="50px" type="accont" />
		<article>
			<aside class="is-side">
				<ul>
					<template v-for="item of sides">
						<li>
							<a :href="item.link" :target="item.target" :class="{'is-active': item.isActive}">
								<span><i class="iconfont" :class="item.icon"></i></span>
								<span>{{item.title}}</span>
							</a>
						</li>
					</template>
				</ul>
			</aside>
			<section class="is-box">
				<transition name='fade' mode='out-in'>
					<keep-alive>
						<router-view></router-view>
					</keep-alive>
				</transition>				
			</section>
		</article>
	</div>
</template>

<script type="text/javascript">
	export default {
		data(){
			return {

			}
		},

		computed:{
			sides(){
				var path = this.$route.fullPath;
				return [
					{title:"我的诗集", link: "#/poetry", icon: "iconshujia", isActive: path.startsWith("/poetry"), target:"" },
					{title:"写作台", link: "/worker", icon: "iconxiezi", isActive: path.startsWith("/worker"), target:"_blank"},
					{title:"设置", link: "#/setting", icon: "iconicon-test", isActive: path.startsWith("/setting"), target:""}
				]
			}
		},

		mounted(){

		}
	}

</script>

<style lang="stylus"> 
	@import "../public/layout.styl"
	.account-app
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
.account-app
	padding-top $height-header
	height 100%
	article
		width 100%
		height 100%
		display flex
		justify-content space-between
		.is-side
			height 100%
			width 150px
			background #262a33
			padding-top 30px
			flex-shrink 0
			li
				color #fff
				a
					display inline-flex 
					padding 15px 10px 
					align-items center
					width 100%
					color inherit
					transition 300ms
					&.is-active
						color $color-success
					&:hover
						background #323232
					span:nth-of-type(1)
						margin-right 20px
		.is-box
			position relative
			flex 1
			overflow auto
		
		
</style>