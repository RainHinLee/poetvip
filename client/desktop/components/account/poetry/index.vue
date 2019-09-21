<template>
	<div class="poetry-app">
		<section class="is-left"></section>
		<section class="is-right"></section>
	</div>
</template>

<script>
	
	import api from "api";



	export default {
		data(){
			return {
				loading:{
					fetch: false
				},

				list: [

				]
			}
		},

		methods:{

		},

		activated(){

		}
	}

</script>

<style lang="stylus" scoped="">
.poetry-app
	padding 30px
	
</style>