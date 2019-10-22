<!-- 
		诗歌组件
		props:
			poem: 诗歌数据对象

		poem: {
			title: "",   //--标题
			author_name:"", //--作者名
			appreciation: "",  //--赏析
			picture: "", //--背景图
			body:[ //--诗歌文本
				"李白乘舟将欲行,",
				"忽闻岸上踏歌声",
			],
			style:{  //---样式
				"textAlign" : "left"
			}
		}
 -->

<template>
	<div class="poem-widget">
		<div class="is-body">
			<h3>{{poem.title}}</h3>
			<p class="author_name">{{poem.author_name}}</p>
			<ul :style="poem.style">
				<li v-for="item of poem.body">{{item}}</li>
			</ul>
			<footer><p v-for="item of poem.appreciation">{{item}}</p></footer>
		</div>
		<!-- 背景图 -->
		<template v-if="poem.letter">
			<div class="is-background"><img :src="poem.letter"></div>
		</template>
	</div>
</template>

<script>

import util from "util";
import api from "api";

export default {
	props:{
		poem:{
			type: Object,
			required: true,
		}
	},


	mounted(){  //---show类型下，需要加载字体文件
		let fontName = this.poem.style.fontFamily;
		let fontFile = this.poem.fontFile;
		
		fontName && fontFile && util.loadFont(fontName,fontFile);
	},
}

</script>

<style lang="stylus" scoped="">
.poem-widget
	width 100%
	height 100%
	overflow hidden
	position relative
	color #222
	.is-body
		position relative
		z-index 2
		padding 100px 50px
		>h3
			font-size 30px
			text-align center
		>p.author_name
			margin-top 10px
			color #888
			font-size 22px
			text-align center
		>div
		>ul
			margin-top 20px
			font-size 26px
			line-height 1.7
			letter-spacing 2px
			text-align center
			li
				min-height 15px
				white-space pre-wrap
		>footer
			margin-top 30px
			text-align left
			white-space pre-wrap
			line-height 1.3
			font-size 24px
			color #888
			>p
				min-height 10px
	.is-background
		position absolute
		z-index 1
		left 0px
		top 0px
		img
			width 100%
</style>
