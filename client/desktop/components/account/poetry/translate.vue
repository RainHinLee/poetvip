<!-- 移动组件 -->

<template>
	<div class="translate-page">
		<ul>
			<li>
				<h6>移动到诗集：</h6>
				<p><pv-select :list="poetries" :initVal="poem.poetry" @select="selectPoetry"/></p>
			</li>
			<template v-if="loading.fetch">
				<li>
					<h6>移动到：</h6>
					<p><pv-loading /></p>
				</li>
			</template>
			<template v-else>
				<li>
					<h6>移动到：</h6>
					<p><pv-select :list="poems" @select="selectPoem"/></p>
					<p><pv-select :list="posList"  @select="selectPos"/></p>
				</li>
				<li>
					<h6></h6>
					<p>
						<template v-if="loading.translate">
							<button class="is-btn is-success">移动中...</button>
						</template>
						<template v-else>
							<button class="is-btn is-success" @click="submit">确定</button>
						</template>
					</p>
				</li>				
			</template>
		</ul>
	</div>
</template>

<script >

	import api from "api";

	export default {
		props: ['poem'],
		data(){
			return {
				options:{
					poetry_id : this.poem.poetry,
					poem_id: "",
					pos: "before",
				},
				loading:{
					fetch: false,
					translate: false,
				},
				poems:[],
			}
		},
		methods:{
			fetchPoems(){  //---获取诗集的诗歌列表
				this.loading.fetch = true;
				this.poems = [];
				this.options.poem_id = "";
				api.poetry.getPoems(this.options.poetry_id).then(poems=>{
					this.poems = poems.filter(item=>item._id != this.poem._id).map(item=>{
						return {text: item.title, value: item._id};
					});
					this.poems.length==0 && this.poems.push({text: "没有选项",value:""});
					this.loading.fetch = false;
				}).catch(err=>{
					this.loading.fetch = false;
				})
			},

			submit(){  //---提交移动
				if(this.loading.translate) return;
				if(this.loading.fetch) return this.$toast("请等待请求完成！",'error');
				if(!this.options.poetry_id) return this.$toast("请选择移动到诗集","error");

				this.loading.translate = true;

				let data = {
					translate: this.options,  //--移动到数据
					origin : { //--原数据
						poetry_id : this.poem.poetry,
						poem_id : this.poem._id
					}
				}

				api.poetry.translate(data).then(()=>{  //---移动成功，诗集刷新，诗歌刷新
					let poetry = this.$store.state.poetries.find(item =>item._id == this.poem.poetry);  
					let promise = poetry ? poetry._refreshHandler() : Promise.resolve();
					return promise.then().then(()=>this.poem._refreshHandler()); //---诗歌刷新
				}).then(doc=>{
					this.loading.translate = false;
					window.$toast("移动成功",'success');
					this.$emit("close");
				}).catch(err=>{
					this.$toast(`移动失败： ${err.message}`,"error")
					this.loading.translate = false;
				})
			},

			selectPoetry(data){
				this.options.poetry_id = data.value
			},

			selectPos(data){
				this.options.pos = data.value
			},

			selectPoem(data){
				this.options.poem_id = data.value
			},
		},

		computed:{
			poetries(){
				let arr = this.$store.state.poetries || [];
				return arr.map(item=>{
					return {text: item.name, value: item._id}
				})
			},

			posList(){
				return [
					{text: "前面", value: "before"},
					{text: "后面", value: "after"},
				]
			},
		},

		watch:{
			"options.poetry_id":{
				handler(){
					this.fetchPoems();
				}
			},
		},

		mounted(){
			this.fetchPoems();
		}
	}

</script>

<style lang="stylus" scoped="">

.translate-page
	position relative
	li
		display flex
		align-items center
		margin-bottom 15px
		h6
			width 100px
			font-size 14px
			flex-shrink 0
		p
			width 100%
			&:nth-of-type(2)
				width 150px
		button
			padding 7px 0px
			width 200px
</style>

<style lang="stylus">
.translate-page
	.select-widget
		input
			padding 7px 10px	
			cursor pointer
			border 1px solid #aaa
</style>