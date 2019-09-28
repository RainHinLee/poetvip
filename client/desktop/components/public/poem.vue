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
		<pv-scroll class="is-box">
			<div class="is-body">
				<!-- 展示状态 -->
				<template v-if="type=='show'">
					<h3>{{poem.title}}</h3>
					<p class="author_name">{{poem.author_name}}</p>
					<ul :style="poem.style">
						<li v-for="item of poem.body">{{item}}</li>
					</ul>
					<footer>{{poem.appreciation}}</footer>			
				</template>

				<!-- 编辑和新建状态 -->
				<template v-if="type=='edit'">
					<h3><input placeholder="此处输入标题" v-model="poem.title"></h3>
					<p class="author_name"><input placeholder="此处输入作者" v-model="poem.author_name"></p>
					<div :style="poem.style">
						<pv-editor placeholder="此处输入诗歌正文" :initText="poem.body" @change="changeBody"></pv-editor>
					</div>
					<footer><pv-editor placeholder="此处输入赏析"  :initText="poem.appreciation" @change="changeAppreciation"></pv-editor></footer>				
				</template>

			</div>
		</pv-scroll>

		<template v-if="type=='edit'">
			<!-- 工具按钮 -->
			<div class="is-toptip">
				<p>
					<a @click="setStyle('textAlign','left')" :class="{'is-active': poem.style.textAlign=='left'}">
						<span><i class="iconfont iconzuoduiqi1"></i></span>左对齐
					</a>
					<a @click="setStyle('textAlign','center')":class="{'is-active': poem.style.textAlign=='center'}">
						<span><i class="iconfont iconjuzhong"></i></span>居中
					</a>
					<a @click="setStyle('textAlign','right')" :class="{'is-active': poem.style.textAlign=='right'}">
						<span><i class="iconfont iconyouduiqicopy"></i></span>右对齐
					</a>

					<a class="fonts">字体： <span> <pv-select :list="fonts" @select="selectFont"/>	</span></a>


				</p>
				<p>
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
import api from "api"

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
		setStyle(key,value){
			this.poem.style[key] = value;
		},

		submit(){  //--提交
			if(!this.validate()) return;  //--校验数据

			let data = JSON.parse(JSON.stringify(this.poem));
			let promise = data._id ? api.poem.update(data) : api.poem.add(data);

			this.loading.save = true;
			promise.then(res=>{
				Object.assign(this.poem,res);  //--成功
				this.loading.save = false;
				this.showMesasge('保存成功！','success');
				this.$emit("poem:saved",res);  //---诗歌保存成功
			}).catch(err=>{
				this.loading.save = false;
				this.showMesasge(`保存失败：${err.message};请重试`,'error');
			});
		},

		create(){ //---创建新的
			this.$confirm("确定创建新诗歌？",()=>{
				this.$emit("poem:create")
			});
		},
 
		changeBody(arr){  //---诗歌正文
			this.poem.body = arr;
		},

		changeAppreciation(arr){ //--诗歌评价
			this.poem.appreciation= arr
			console.log(this.poem.appreciation)
		},

		validate(){
			let {title,author_name,body,poetry} = this.poem;

			console.log(this.poem)

			if(title.length==0){
				this.$toast("诗歌标题未输入",'error');
				return false
			}

			if(author_name.length==0){
				this.$toast("诗歌作者未输入",'error');
				return false
			}
			if(body.length==0){
				this.$toast("诗歌正文未输入",'error');
				return false
			}
			if(!poetry){
				this.$toast("请选择一个诗集",'error');
				return false
			};
			return true;
		},

		selectFont(data){  //---选择字体
			let fontFamily = data.value;
		},

		showMesasge(message,type){
			Object.assign(this.message,{text: message,type});
			clearTimeout(this.timer);
			this.timer = setTimeout(()=>{
				this.message.show= false;
				this.message.type="";
			},3000);
		},
	},

	computed:{
		fonts(){
			return [
				{text: "繁杂体", value:"繁杂体"},
				{text: "槑萌体", value:"槑萌体"},
				{text: "下午茶体", value:"下午茶体"},
				{text: "意趣体", value:"意趣体"},
				{text: "篆体", value:"篆体"}
			]
		}
	},

	mounted(){
		



	}
}

</script>

<style lang="stylus" scoped="">
.poem-widget
	width 100%
	height 100%
	overflow hidden
	position relative
	&:hover
		.is-toptip
			transform translateY(0px)
	.is-box
		position relative
		z-index 2
	.is-body
		padding 50px 50px
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
		>footer
			margin-top 30px
			text-align left
			color #666
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
		p
			>a
				display inline-flex
				align-items center
				justify-content center
				height 24px
				color #d0d2d3
				border-radius 2px
				cursor pointer
				margin-left 15px
				transition 300ms
				&:not(.fonts):hover
				&.is-active
					opacity 0.6
				span
					margin-right 4px
				&.fonts
					span
						color #444
						display inline-flex
						width 120px
						background transparent
						border-radius 3px
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
	.select-arrow
		right 0px !important
	input
		padding 0px 10px	
		cursor pointer
</style>