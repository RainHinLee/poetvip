<!-- 背景组件 -->
<template>
	<div class="letters">
		<ul>
				<li :class="{'is-active': letter==''}" @click="select('')">
					<p>不使用背景图</p>
					<div class="layer"><button>使用</button></div>
					<a><i class="iconfont iconcomplete-o"></i></a>
				</li>

			<template v-for="item of list">
				<li :class="{'is-active': letter==item}" @click="select(item)">
					<img :src="item">
					<div class="layer"><button>使用</button></div>
					<a><i class="iconfont iconcomplete-o"></i></a>
				</li>
			</template>
		</ul>
	</div>

</template>

<script>

	export default {
		props:{
			list:{
				type: Array,
				default:()=>[]
			},

			letter: {  //--当前背景图
				type: String,
				default:""
			}
		},

		methods:{
			select(letter){
				this.$emit("select",letter)
			}
		},

	}

</script>

<style lang="stylus" scoped="">
	ul
		display flex
		flex-wrap wrap
		justify-content space-between
		li
			width 47%
			margin-bottom 15px
			height 150px
			overflow hidden
			position relative
			cursor pointer
			background #fff
			&.is-active
				.layer
					display none
				a
					opacity 1
			img
				width 100%
			.layer
				position absolute
				left 0px
				top 0px
				width 100%
				height 100%
				z-index 2
				background rgba(0,0,0,0.6)
				display flex
				align-items center
				justify-content center
				
				&:hover
					button 
						display block
				button
					width 60%
					height 30px
					background $color-success
					color #fff
					border 1px solid $color-success
					outline none
					border-radius 2px
					cursor pointer
					transition 200ms
					display none
					animation fadeIn 300ms forwards
					&:hover
						opacity 0.7
			a
				position absolute
				display flex
				width 24px
				height 24px
				top 0px
				right 0px
				align-items center
				justify-content flex-end
				background $color-success
				color #fff
				border-bottom-left-radius 2px
				opacity 0
			p
				width 100%
				height 100%
				display flex
				align-items center
				justify-content center
				color $color-font
				
</style>