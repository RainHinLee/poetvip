<!-- 选择框
	
	props:
		placehodler
		value: "",  初始值
		list:
			[{text: "", value:""}]
 -->

<template>
	<div class="select-widget">
		<input v-model="selected.text" readonly @click.stop="showed = !showed">
		<span class="select-arrow" @click.stop="showed = !showed"><i class="iconfont iconsanjiaoxia"></i></span>
		<a class="select-panel" :class="{'is-active': showed}">
			<template v-for="item of list">
				<span 
					:data-value="item.value" 
					:class="{'is-active': item==selected && !hovered}" 
					@mouseover="hovered=true"
					@mouseleave="hovered=false"
					@click="selected=item"
				>{{item.text}}</span>
			</template>
		</a>	
	</div>
</template>

<script>
	
	export default {
		props:{
			placehodler:{
				type: String,
				default: "点击此处输入"
			},

			list:{
				type: Array,
				default: ()=>[]
			},

			initVal:{
				type: [String,Number],
				default: ""
			}
		},

		data(){
			return {
				showed: false,
				hovered: false,
				selected: {},
			}
		},

		methods:{
			showPanel(){
				this.showed = !this.showed
			}
		},

		watch:{
			"selected":{
				deep: true,
				handler(newVal,oldVal){
					this.$emit("select",newVal,oldVal)
				}
			},

			"initVal":{
				handler(){
					this.selected = this.list.find(item=>item.value==this.initVal) || this.list[0] || {};
				},
			}
		},

		mounted(){
			this.selected = this.list.find(item=>item.value==this.initVal) || this.list[0] || {};
			window.addEventListener("click",()=>{
				this.showed = false;
			});
		}
	}
</script>
<style lang="stylus" scoped="">
.select-widget
	position relative
	width 100%
	height 100%
	display inline-flex
	align-items center
	justify-content center
	input
		width 100%
		height 100%
		outline none
	.select-arrow
		position absolute
		display inline-flex
		align-items center
		justify-content center
		width 20px
		height 20px
		top 50%
		right 15px
		margin-top -8px
		z-index 2
		cursor pointer
		i.glyphicon
			font-size 12px
			color inherit
	.select-panel
		position absolute
		display block
		background #fff
		z-index 3
		left 0px
		top 100%
		border 1px solid rgba(0,0,0,.15)
		max-height 300px
		overflow auto
		width 100%
		color inherit
		box-shadow 0 6px 12px rgba(0,0,0,.175)
		text-decoration none
		font-size 14px
		transition transform 200ms, opacity 200ms
		opacity 0
		transform-origin center top
		transform scaleY(0)
		&.is-active
			transform scaleY(1)
			opacity 1
		span
			display block
			padding 6px 20px
			cursor pointer
			transition 125ms
			&.is-active
			&:hover
				background #e9ecff
				color #7b8cf6	


</style>

