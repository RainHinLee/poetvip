
<template>
	<div class="reader-app">
		<section class="is-left">左</section>
		<section class="is-center">
			<article>
				<ul :style="{'margin-left': -640*index+'px', 'width': poems.length*640+'px'}">
					<template v-if="poems.length">
						<li v-for="poem of poems">
							<pv-poem type="show" :poem.sync="poem" :key="poem._id" v-if="poem"/>
						</li>	
					</template>
				</ul>
			</article>
		</section>
		<section class="is-right">
			<ul>
				<li data-desc="目录"><a class="iconfont icongengduo1"></a></li>
				<li data-desc="分享"><a class="iconfont iconfenxiang"></a></li>
				<li data-desc="收录(200)"><a class="iconfont iconshoulu"></a></li>
				<li class="prev" :class="{'is-disabled': index==0}" data-desc="上一篇" @click="prev">
					<a class="iconfont iconzuo"></a>
				</li>
				<li class="next" :class="{'is-disabled': index==poems.length-1}" data-desc="下一篇" @click="next">
					<a class="iconfont iconyou"></a>
				</li>
				<li data-desc="阅读量(1000)"><a class="iconfont iconyueduliang"></a></li>
				<li data-desc="点赞(2000)"><a class="iconfont iconzan"></a></li>
				<li data-desc="移动端观看"><a class="iconfont iconyidongduan"></a></li>
			</ul>
		</section>
	</div>
</template>

<script>
	import api from "api";

	export default{
		data(){
			let poems = window.poetry.poems || [];
			let index = window.query.poem ? poems.findIndex(item=>item._id==window.query.poem) : 0;

			return {
				poetry,
				index,
				poems: this.getPoems(index),
				swipType: "",
			}
		},

		methods:{
			getPoems(index){  //--当前序号
				let poems = window.poetry.poems || [];
				let start= Number(index)-1;
				let end = Number(index)+1;

				let res = this.poems || poems.map(item=>null);  //---当前已有的数据

				[start,index,end].forEach(item=>{
					res[item] = res[item] || (poems[item] || null);
				})

				return res;
			},

			prev(){
				if(this.index==0) return ;
				this.index--;
			},

			next(){
				if(this.index==poetry.poems.length-1) return;
				this.index++
			},

		},

		watch:{
			index(){
				this.poems = this.getPoems(this.index);
			}
		}

		
	}

</script>

<style lang="stylus">
	@import "../public/layout.styl"
</style>

<style lang="stylus" scoped="">
.reader-app
	height 100%
	width 100%
	display flex
	overflow hidden
	justify-content space-between
	section.is-left
	section.is-right
		width calc(50% - 320px)
		background #EAEAEA
	section.is-center
		width 640px
		overflow hidden
		ul
			height 100%
			display flex
			justify-content flex-start
			transition 600ms
			margin-left 0px
			li
				height 100%
				width 640px
	section.is-right
		padding 15px
		ul
			padding-top 75px
			li
				position relative	
				display flex
				align-items center
				justify-content center
				width 40px
				padding 0px
				margin-bottom 10px
				cursor pointer
				transition 150ms
				color #797a80
				&:after
					content attr(data-desc)
					position absolute
					display inline-flex
					align-items center
					height 100%
					top 0px
					left 110%
					color $color-font
					width 100px
					display none
				&:hover
					color $color-success
					&:after
						display inline-flex
				&.next
				&.prev
					height 80px
					border 1px solid $color-border
					background #bcbdc0
					color #222
					&:hover
						background #797a80
						color #fff
					&.is-disabled
						opacity 0.7
						cursor not-allowed
						&:hover
							background #bcbdc0
							color #222
				.iconfont
					font-size 20px		
</style>