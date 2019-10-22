
<template>
	<article class="reader-app">
		<section class="stage">
			<cube-slide ref="slide" :initialIndex="index" :loop="false" :autoPlay="false" :data="poems" @change="changePage">
				<template  v-for="(poem,index) in poems">
				  <cube-slide-item :key="index">
				    <p-poem :poem.sync="poem" v-if="poem"/>	
				    <p v-else></p>
				  </cube-slide-item>
				</template>
			</cube-slide>						
		</section>
	</article>
</template>

<script >
	import Poem from "./poem.vue";

	const FONTS = [
			{ text: "默认", value:"", fontSize: "26px", color: "#666", },
			{ text: "细圆体", value:"细圆体", fontSize: "26px", color: "#444", },
			{ text: "手写体", value:"手写体", fontSize: "27px", color: "#444", },
	];

	//--处理字体问题, poem.style存储的新诗
	window.poetry.poems.forEach(poem=>{
		let fontConf= FONTS.find(item=>item.value==poem.fontName);  //---字体配置文件
		let fontName = poem.fontName ? `${poem.fontName}-${poem._id}` : "" //--字体名字

		fontConf = fontConf || this.fonts[0];
		Object.assign(poem.style,{
			fontSize: fontConf.fontSize,
			color: fontConf.color,
			fontFamily: fontName || "inherit"
		});
	});

	export default {
		components:{
			"p-poem" : Poem
		},

		data(){
			let poems = window.poetry.poems || [];
			let index = window.query.poem ? poems.findIndex(item=>item._id==window.query.poem) : 0;

			return {
				index,
				poems: this.getPoems(index),
			}
		},

		methods:{
			getPoems(index){  //--当前序号
				let poems = window.poetry.poems || [];
				let start= Number(index)-1;
				let end = Number(index)+1;

				if(start<=0){
					start =0;
				}

				if(end>=poems.length-1){
					end = poems.length-1;
				}

				let res = this.poems || poems.map(item=>null);  //---当前已有的数据

				[start,index,end].forEach(item=>{
					res[item] = res[item] || (poems[item] || null);
				});
				return res;
			},

			changePage(index){
				this.index = index;
				this.poems = this.getPoems(this.index);
			},
		},
	
		mounted(){
			console.log("success");
		}
	}

</script>

<style lang="stylus">
	@import "../public/layout.styl"
</style>

<style lang="stylus" scoped="">
	.reader-app
		width 100%
		height 100%
		overflow hidden
		color $color-danger
		.stage
			width 100%
			height 100%
			overflow hidden
</style>