<!-- props

	type: account | home 
	height: 
-->


<template>
	<header class="header-widget" >
		<pv-page bcolor="#262a33" :height="height">
			<section class="header-widget-body">
				<h1 class="logo"><a href="/">悦诗阁</a></h1>
				<ul >
					<li v-for="item of links"> 
						<a :href="item.link">{{item.title}}</a>
					</li>
				</ul>
				<template v-if="customer._id">
					<div class="customer">
						<div class="customer-progress">
							<a></a><a></a><a></a><a></a><a></a>
						</div>
						<p class="customer-progress-desc">试用期剩余12天</p>
						<p class="customer-upgrade">
							<a href="/price">升级</a>
						</p>
						<div class="customer-user-drop">
							<a><img src="https://froont.com/rainhinlee/-avatar"></a>
							<span><i class="iconfont iconsanjiaoxia"></i></span>
							<ul>
								<li class="arrow"><span><i class="iconfont iconsanjiaoshang"></i></span></li>
								<li v-for="item in drop_links"><a :href="item.link">{{item.title}}</a></li>
							</ul>
						</div>
					</div>
				</template>
				<template v-else>
					<p class="uncustomer"><a href="/user/login">登录</a><a href="/user/register">注册</a></p>
				</template>	
			</section>
		</pv-page>	
	</header>
</template>

<script>

	const Home_Links =[
		{title:"价格", link:"/price"},
		{title:"关于我们", link:"/ahout-us"},
		{title:"诗歌馆", link:"/library"},
	];

	const Account_Links = [
		{title:"诗歌馆", link:"/library"}
	];

	const Home_Drop_Links = [
		{title:"我的诗集", link:"/account#/poetry"},
		{title:"我的诗歌", link:"/account#/poem"},
		{title:"写作台", link:"/worker"},
		{title:"退出", link:"/user/logout"},
	];

	const Account_Drop_Links= [
		{title:"我的诗集", link:"/account#/poetry"},
		{title:"我的诗歌", link:"/account#/poem"},
		{title:"写作台", link:"/worker"},
		{title:"退出", link:"/user/logout"},
	]
	
	export default {
		props:{
			type:{
				type: String,
				default : "home"
			},
			height:{
				type: String,
				default: "60px"
			}
		},

		computed:{
			links(){
				return this.type=="home" ? Home_Links : Account_Links;
			},

			drop_links(){
				return this.type=="home" ? Home_Drop_Links : Account_Drop_Links;
			}
		}
 	}

</script>

<style lang="stylus" scoped="">
.header-widget
	position fixed
	z-index 100
	width 100%
	left 0px
	top 0px
	.header-widget-body
		position relative
		width 100%
		height 100%
		display flex
		align-item center
		justify-content space-between
		color $color-white
		.logo
			display inline-flex
			align-items center
			justify-content center
			font-size 26px
			flex-shrink 0
			padding-right 20px
			a
				color inherit
				text-decoration none
		>ul
			display inline-flex
			align-items center
			justify-content flex-end
			flex 1
			li
				padding 0px 20px
				transition 300ms
				&:hover
					opacity 0.6
				&.is-active
					color $color-success
				a
					text-decoration none
					color inherit
		p.uncustomer
			display flex
			align-items center
			a
				display inline-flex
				padding-left 20px
				padding-right 40px
				transition 300ms
				text-decoration none
				justify-content center
				align-items center
				color inherit
				&:hover
					opacity 0.6
				&:nth-of-type(2)
					padding-right 0px
					padding-left 0px
					width 60px
					height 30px
					background $color-success
					border-radius 5px
					&:hover
						opacity 1
						background #56d58e
		div.customer
			display flex
			align-items center
			justify-content flex-end
			line-height 1.0
			.customer-progress
				width 130px
				height 12px
				background #55585e
				border-radius 12px
				overflow hidden
				display inline-flex
				align-items center
				a
					display inline-flex
					flex 1
					height 100%
					border-right 1px solid #4a4f54
					&:nth-last-of-type(1)
						border-right none
			.customer-progress-desc
				padding-left 20px
				color #bcbdc0
			.customer-upgrade
				a
					display inline-flex
					width 70px
					margin-left 10px
					height 30px
					background $color-success
					color inherit
					border-radius 5px
					align-items center
					justify-content center
					transition background 300ms
					&:hover
						background $color-light-success
			.customer-user-drop
				position relative
				display inline-flex
				height 100%
				align-items center
				justify-content center
				padding-left 20px
				cursor pointer
				&:hover
					ul
						display block
				>a
					width 40px
					height 40px
					border-radius 20px
					background $color-success
					overflow hidden
					margin-right 5px
					img
						width 100%
					&+span
						.iconfont
							font-size 12px
							opacity 0.5
				ul
					position absolute
					top calc(100% + 3px)
					right 10px
					width 224px
					padding 10px 0px
					z-index 999
					background $color-white
					border 1px solid #e1e2e8
					box-shadow 7px 7px 6px rgba(38,42,51,0.1)
					border-radius 3px
					display none
					li.arrow
						position absolute
						right 12px
						width auto
						height auto
						top -19px
						.iconfont
							font-size 26px
							color $color-white
					li:not(.arrow)
						padding 10px 20px
						width 100%
						color #bcbdc0
						&:hover
							color #7b8cf6
							background #e9ecff
						a
							color inherit
						
</style>