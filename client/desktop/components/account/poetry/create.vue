<template>
	<div class="poetry-create">
		<ul>
			<li>
				<strong>诗集名</strong>
				<p><input v-model.trim="values.name"></p>
				
			</li>
			<li>
				<strong>诗集类型</strong>
				<p><pv-select :list="types" @select="selectType"  />	</p>
			</li>
			<li>
				<strong></strong>
				<p class="is-btn-box">
					<template v-if="loading.submit">
						<button class="is-btn is-success">正在创建...</button>
					</template>
					<template v-else>
						<button class="is-btn is-success" @click="submit">确定</button>
					</template>
					
				</p>
			</li>
		</ul>
		
	</div>
</template>

<script>
	
	import api from "api";
	
	export default {
		data(){
			return {
				types:[
					{text: "公开", value:"public"},
					{text: "私有", value:"private"},
				],

				values:{
					name: "",  //---诗集名
					type: "",  // private私有 | public公开 | collect收藏诗集
					poster: "",  //--诗集封面
					intro: "", //--诗集介绍
				},

				loading:{
					submit: false
				}
			}
		},

		methods:{
			submit(){
				if(this.loading.submit) return;
				if(this.values.name.length==0){
					return this.$toast("请输入诗集名",'error');
				}
				this.loading.submit = true;
				api.poetry.create(this.values).then(res=>{
					this.$toast(`诗集<<${this.values.name}>>创建成功`,"success");
					this.loading.submit = false;
					this.$emit("close");
					this.$emit("create:success",res);
				}).catch(err=>{
					this.$toast(`失败：${err.message}`,"error");
					this.loading.submit = false;
				})
			},
			selectType(data){
				this.values.type = data.value;
			},
		},



	}

</script>

<style lang="stylus">
.poetry-create
	input
		width 100%
		height 100%
		padding 0px 15px
		outline none
		border-radius 2px
		border 1px solid #bebebe
		color #666
</style>

<style lang="stylus" scoped="">
.poetry-create
	padding 20px 20px
	li
		padding-bottom 20px
		display flex
		width 100%
		align-items center
		strong
			width 80px
		p
			flex 1
			height 30px
			&.is-btn-box
				height 36px
				
</style>
