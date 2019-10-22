<!-- 
		诗歌组件
		props:
			poem: 诗歌数据对象
			type : show | edit ;  展示型还是编辑型

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
		<pv-scroll class="is-box" :bar="type=='edit'">
			<div class="is-body">
				<!-- 展示状态 -->
				<template v-if="type=='show'">
					<h3>{{poem.title}}</h3>
					<p class="author_name">{{poem.author_name}}</p>
					<ul :style="poem.style">
						<li v-for="item of poem.body">{{item}}</li>
					</ul>
					<footer>
						<p v-for="item of poem.appreciation">{{item}}</p>
					</footer>
				</template>

				<!-- 编辑和新建状态 -->
				<template v-if="type=='edit'">
					<h3><input placeholder="此处输入标题" v-model="poem.title"></h3>
					<p class="author_name"><input placeholder="此处输入作者" v-model="poem.author_name"></p>
					<div :style="poem.style">
						<pv-editor placeholder="此处输入诗歌正文" :initText="poem.body" @change="changeBody"></pv-editor>
					</div>
					<footer><pv-editor placeholder="此处输入赏析或附记"  :initText="poem.appreciation" @change="changeAppreciation"></pv-editor></footer>				
				</template>
			</div>
		</pv-scroll>

		<template v-if="type=='edit'">
			<!-- 工具按钮 -->
			<div class="is-toptip">
				<p class="is-left">
					<a>对齐：<span> <pv-select :list="alignItems" :initVal="poem.style.textAlign" @select="setAlign"/>	</span></a>
					<a>字体： <span> <pv-select :list="fonts" :initVal="poem.fontName" @select="selectFont"/>	</span></a>
					<!-- <a>字号： <span> <pv-select :list="sizes"  @select="selectFontSize"/>	</span></a> -->
				</p>
				<p class="is-right">
					<template v-if="loading.save">
						<a>正在保存...</a>
					</template>
					<template v-else>
						<a @click="submit"><span style="font-size:12px"><i class="iconfont iconbaocun"></i></span>保存</a>
						<a @click="create"> <span><i class="iconfont iconadd-o"></i></span> 新建</a>	
					</template>
				</p>			
			</div>
			<!-- 消息提示 -->
			<div class="is-message" :class="{'is-success':message.type=='success', 'is-error': message.type=='error'}">
				{{message.text}}
			</div>
		</template>

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
		},

		type: {
			type: String,
			default: "show"
		}
	},

	data(){
		return {
			loading:{
				save: false
			},
			message:{
				text: "",
				type: ""
			}
		}
	},

	methods:{
		submit(){  //--提交
			if(!this.validate()) return;  //--校验数据

			let data = JSON.parse(JSON.stringify(this.poem));
			let promise = data._id ? api.poem.update(data) : api.poem.add(data);

			this.loading.save = true;
			promise.then(res=>{
				res.style.fontFamily = this.poem.style.fontFamily;  //--存储时，字体将被替换为"";
				Object.assign(this.poem,res);  //--成功

				this.loading.save = false;
				this.showMesasge('保存成功！','success');
				this.$emit("poem:saved",res);  //---诗歌保存成功
				this.$postMessage("poem:saved",res._id);  //---发送页面间通知
			}).catch(err=>{
				this.loading.save = false;
				this.showMesasge(`保存失败：${err.message};请重试`,'error');
			});
		},

		create(){ //---创建新的
			window.$confirm("确定创建新诗歌？",()=>this.$emit("poem:create"));
		},
 
		changeBody(arr){  //---诗歌正文
			this.poem.body = arr;
		},

		changeAppreciation(arr){ //--诗歌评价
			console.log(arr);
			this.poem.appreciation= arr
		},

		validate(){
			let {title,author_name,body,poetry} = this.poem;
			if(title.length==0){
				window.$toast("诗歌标题未输入",'error');
				return false
			}

			if(author_name.length==0){
				window.$toast("诗歌作者未输入",'error');
				return false
			}
			if(body.length==0){
				window.$toast("诗歌正文未输入",'error');
				return false
			}
			if(!poetry){
				window.$toast("请选择一个诗集",'error');
				return false
			};
			return true;
		},

		selectFont(data){  //---选择字体
			this.poem.fontName = data.value || "";
			this.loadFont(this.poem.fontName);
		},

		setAlign(data){
			this.poem.style.textAlign = data.value;
		},

		showMesasge(message,type){
			Object.assign(this.message,{text: message,type});
			clearTimeout(this.timer);
			this.timer = setTimeout(()=>{
				this.message.show= false;
				this.message.type="";
			},3000);
		},

		loadFont(name){  //--加载字体文件,edit和show状态通用
			let fontConf= this.fonts.find(item=>item.value==name);  //---字体配置文件
			let fontName = this.type=="show" ? `${name}-${this.poem._id}` : name; //--字体名字

			if(!fontConf) return;
			Object.assign(this.poem.style,{
				fontSize: fontConf.fontSize,
				color: fontConf.color,
				fontFamily: fontName || "inherit"
			});
			let file = this.type=="edit" ? fontConf.file : this.poem.fontFile;

			file && util.loadFont(fontName,file);
		}
	},

	computed:{
		fonts(){
			return [
				{
					text: "默认", 
					value:"", 
					fontSize: "17px", 
					color: "#666", 
					file:""
				},
				{
					text: "细圆体", 
					value:"细圆体", 
					fontSize: "18px", 
					color: "#444", 
					file:"/public/statics/fonts/细圆体.ttf"
				},
				{
					text: "手写体", 
					value:"手写体", 
					fontSize: "19px", 
					color: "#444", 
					file:"/public/statics/fonts/手写体.ttf"
				},
			]
		},

		alignItems(){
			return [
				{text: "居中",value:"center"},
				{text: "左对齐",value:"left"},
				{text: "右对齐",value:"right"},
			]
		},

		sizes(){
			return [
				{text: "小",value:"small"},
				{text: "中",value:"normal"},
				{text: "大",value:"big"},
			]			
		}
	},

	mounted(){  //---show类型下，需要加载字体文件
		if(this.type=="show"){
			this.loadFont(this.poem.fontName)
		}
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
	&:hover
		.is-toptip
			transform translateY(0px)
	.is-box
		position relative
		z-index 2
		background rgba(255,255,255,0.3)
	.is-body
		padding 80px 50px
		>h3
			font-size 20px
			text-align center
		>p.author_name
			margin-top 5px
			color #888
			font-size 14px
			text-align center
		>div
		>ul
			margin-top 20px
			font-size 16px
			line-height 1.5
			letter-spacing 2px
			text-align center
			li
				min-height 15px
				white-space pre-wrap
		>footer
			margin-top 30px
			text-align left
			color #666
			white-space pre-wrap
			>p
				min-height 10px
		input
			font-size inherit
			color inherit
			line-height inherit
			border none
			font-family inherit
			text-align center
			outline none
			font-weight inherit
			background transparent
			letter-spacing inherit
	.is-background
		position absolute
		z-index 1
		left 0px
		top 0px
		img
			width 100%
	.is-toptip
		position absolute
		padding 0px 10px
		z-index 4
		left 0px
		top 0px
		height 30px
		width 100%
		display flex
		align-items center
		justify-content space-between
		background #222
		transform translateY(-100%)
		transition 600ms
		p.is-left
			a
				display inline-flex
				align-items center
				justify-content center
				height 24px
				cursor pointer
				color #d0d2d3
				margin-right 5px
				span
					color #444
					display inline-flex
					width 90px
					background transparent
					border-radius 3px
		p.is-right
			a
				display inline-flex
				align-items center
				justify-content center
				height 24px
				color #d0d2d3
				border-radius 2px
				cursor pointer
				margin-left 15px
				transition 300ms
				&:hover
					opacity 0.6
				span
					margin-right 4px

	.is-message
		position absolute
		z-index 5
		left 0px
		top 0px
		height 30px
		width 100%
		display flex
		align-items center
		justify-content center
		color #fff
		transform translateY(-110%)
		transition 400ms
		&.is-success
			background $color-success
			transform translateY(0%)
		&.is-error
			background $color-danger
			transform translateY(0%)
		span
			display none
</style>

<style lang="stylus">
.poem-widget
	.select-widget
		.select-arrow
			right 0px !important
		a.select-panel
			span
				padding 6px 10px
		input
			padding 0px 10px	
			cursor pointer
</style>