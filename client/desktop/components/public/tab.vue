<!-- tab标签组件：
	
 -->
<template>
	<div class="tab-widget">
		<template v-for="item,key of data">
			<a class="tab-item" :class="{'is-active': index==key}" @click="click(key)">
				<span v-if="item.icon"><i class="iconfont" :class="item.icon"></i></span>
				{{item.text}}
			</a>
		</template>
	</div>
</template>

<script>
	
	export default {
		props: {
			data: {
				type : Array,
				default:()=>[]
			}
		},

		data(){
			return {
				index : 0,
			}
		},

		methods:{
			click(index){
				this.index = index;
				this.$emit("select",this.data[index],index);
			}
		},

		mounted(){
			this.click(0)
		}
	}

</script>

<style lang="stylus" scoped="">
	.tab-widget
		width 100%
		height 100%
		display flex
		justify-content flex-start
		.tab-item
			flex 1
			height 100%
			display inline-flex
			align-items center
			justify-content center
			cursor pointer
			background #333
			color #666
			transition color 150ms
			&.is-active
				color #d0d2d3
				background transparent
			&:hover
				color #d0d2d3
			span
				margin-right 10px
</style>