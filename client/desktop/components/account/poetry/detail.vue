<template>
	<div class="poetry-detail">
		<header>
			<div>
				<p><span><i class="iconfont iconsuo"></i></span> 私有</p>
				<p @click="$emit('rename')"><span><i class="iconfont iconzhongmingming"></i></span> 重命名</p>
				<p><span><i class="iconfont iconshanchu"></i></span> 删除</p>
			</div>
			<p class="is-btn-box"><a class="is-btn is-success">进入阅读</a></p>
		</header>		
		<section>
			<h3>{{data.name}} <small>（{{data.size}}）</small></h3> 
			<p>
				<a><span><i class="iconfont iconyueduliang"></i></span> 1020</a> 
				<a><span><i class="iconfont iconzan2"></i></span>300</a> 
				<a><span><i style="font-size:14px" class="iconfont iconshoucang"></i></span>1020</a> 
			</p>
		</section>
		
			<ul>
				<template v-for="item,index of [1,2,3,4,5,6,7,8,9,0,10]">
					<li>
						<div class="is-poem">
							<h6>{{index+1}}、偶然</h6>
							<p>
								<a><span><i class="iconfont iconyueduliang"></i></span> 1020</a> 
								<a><span><i class="iconfont iconzan2"></i></span>300</a> 
								<a><span><i style="font-size:14px" class="iconfont iconshoucang"></i></span>1020</a> 
							</p>							
						</div>

						<div class="is-action-btns">
							<a>阅读</a>
							<a>移动</a>
							<a>编辑</a>
							<a>删除</a>
						</div>
					</li>
				</template>
			</ul>

	</div>
</template>

<script>
		
	export default {
		props: ['data'],
		methods:{

		}
	}
</script>

<style lang="stylus" scoped="">
	.poetry-detail
		width 650px
		header
			display flex
			padding-bottom 10px
			height 46px
			align-items center
			justify-content space-between
			border-bottom 1px solid $color-border
			div
				display inline-flex
				align-items center
				justify-content flex-start
				color #bcbdc0
				p
					padding-right 15px
					cursor pointer
					transition 150ms
					&:hover
						color $color-block
			p.is-btn-box
				height 100%
				width 100px
		section
			display flex
			align-items flex-end
			justify-content space-between
			h3
				font-size 16px
				padding-top 10px	
			p
				color #bcbdc0
				font-size 12px
				a
					color inherit
					margin-right 0px
					display inline-flex
					align-items center
					margin-left 10px
					span
						margin-right 2px
		
		ul
			padding-top 20px
			padding-bottom 60px
			li
				width 100%
				height 50px
				border-bottom 1px solid $color-border
				display flex
				align-items center
				justify-content space-between
				line-height 1.0
				padding 0px 10px
				
				&:hover
					background $color-border
				div.is-poem
					padding-right 15px
					h6
						font-size 14px
					p
						padding-top 5px
						color #bcbdc0
						font-size 12px
						a
							color inherit
							margin-right 0px
							display inline-flex
							align-items center
							margin-right 10px
							span
								margin-right 2px				
				.is-action-btns
					width 160px
					display inline-flex
					align-items center
					justify-content flex-end
					a
						color #888
						font-size 14px
						margin-left 7px
						transition 150ms
						cursor pointer
						&:hover
							color $color-block
							text-decoration underline
					
					
		


</style>