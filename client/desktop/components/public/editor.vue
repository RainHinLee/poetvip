<!-- 
	编辑器
	props: 
		placeholder: 占位符
		autoHeight: true
		initText: ""
	
	events:
		change 
 -->

<template>
	<div class="editor-widget">
		<textarea ref="textarea" :placeholder="placeholder" v-model="text"></textarea>
	</div> 
</template>

<script>
	
	export default {
		props:{
			"placeholder" : {
				type : String,
				default : "点此输入"
			},

			initText:{
				type: [Array,String],
				default: ""
			},

			autoHeight:{
				type: Boolean,
				default: true
			}
		},

		data(){
			return {
				text : this.decode(),
			}
		},

		methods:{
			encode(){  //--将textera中的空格换为span标签，换行符换为单行"",
				let rex = /\s/g;
				let arr = this.text.split(/[\r\n]/gi);
				let res = arr.map(item=>item.replace(rex,"<span></span>"));
				return arr	
			},

			decode(){ //--将文本中的span标签转换为textera中的换行符和空格符
				let text = Array.isArray(this.initText) ? this.initText.join("\r") : this.initText;
				let rex = /<span><\/span>/gi
				let res = text.replace(rex," ");
				return res;
			},

			makeExpandingArea(){ //--js计算textera 高度
        this.$refs.textarea.style.height = 'auto';
        this.$refs.textarea.style.height = this.$refs.textarea.scrollHeight + 'px';
			},

			refresh(){
				if(window.requestAnimationFrame){
					this.timer = window.requestAnimationFrame(function (){
						this.makeExpandingArea();
						this.refresh();
					}.bind(this))
				}
			},
		},

		watch:{
			"text":{
				deep: true,
				handler(){
					this.$emit("change",this.encode());
				}
			}
		},

		mounted(){
			this.refresh();  //--更新
		},

		destroyed(){
			this.timer && window.cancelAnimationFrame(this.timer)
		}
	}

</script>

<style lang="stylus" scoped="">
.editor-widget
	width 100%
	min-height 100%
	font-family inherit
	line-height inherit
	text-align inherit
	font-size inherit
	color inherit
	letter-sapce inherit
	textarea
		height auto
		resize none
		border none		
		width 100%
		outline none
		min-height 100px
		text-align inherit
		padding 10px
		line-height inherit
		font-size inherit
		font-family inherit
		color inherit
		background transparent
		letter-spacing inherit
		


</style>