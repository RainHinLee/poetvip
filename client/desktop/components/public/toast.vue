
<!-- 
	props:
		message: 提示语
		type: 提示语类型，  success, error
 -->

<template>
	<div class="toast" :class="type">
		<div>{{message}}</div>
	</div>
</template>

<script>
	export default {
		name: "toast",
		props:{
			message:{
				type: String,
				default:""
			},
			type:{
				type: String,
				default:""
			}
		},

		methods:{
			close(){
				window.clearTimeout(this.timer);
				this.remove();
			},
		},

		mounted(){
			setTimeout(this.close.bind(this),3000);
		},

		destroyed(){
			window.clearTimeout(this.timer);
		}
	}
</script>

<style lang="stylus" scoped="">
.toast
	position fixed
	left 50%
	top 50%
	transform translate(-50%,-50%)
	padding 10px 15px
	max-width 300px
	background rgba(0,0,0,0.8)
	color #fff
	line-height 1.3
	border-radius 3px
	z-index 1000000
	animation fadeIn 300ms forwards
	&.error
		background $color-danger
	&.success
		background $color-success

</style>