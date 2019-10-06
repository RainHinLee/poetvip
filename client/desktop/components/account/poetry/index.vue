<template>
	<div class="poetry-app">

		<template v-if="loading.fetch">
			<section class="is-empty"><pv-loading /></section>
		</template>

		<template v-else>
			<section class="is-left">
				<pv-scroll :bar="false">
					<!-- 新建按钮 -->
					<div class="is-btn-box">
						<p>
							<button class="is-btn" @click="showLayer('create')"> 
								<span><i class="iconfont iconadd-o"></i></span> 新建诗集
							</button>
						</p>
						<p>
							<a class="is-btn" href="/worker" target="_blank"><span><i class="iconfont iconadd-o"></i></span> 我要写诗</a>
						</p>
					</div>
					<!-- 诗集列表 -->
					<ul>
						<template v-for="item of list">
							<li :class="{'is-active' : current._id == item._id}" @click="select(item)">
								<h4>{{item.name}} <small>（ {{item.size}} ）</small></h4>
							</li>
						</template>
					</ul>
				</pv-scroll>
			</section>
			<!-- 诗集详情 -->
			<section class="is-right">
				<template v-if="current._id">
					<p-poetry-detail :data="current" @rename="showLayer('rename')"/>
				</template>
			</section>
		</template>

		<!-- 创建诗集浮层 -->
		<pv-layer :title="layer.title" width="460px" :open="layer.open" @close="layer.open=false">
			<p-poetry-create v-if="layer.type=='create'" @close="layer.open=false" @create:success="fetch"/>
			<p-poetry-rename v-if="layer.type=='rename'" @close="layer.open=false" /> 
		</pv-layer>	
	</div>
</template>

<script>
	
	import api from "api";
	import Detail from "./detail.vue";
	import Create from "./create.vue";
	import Rename from "./rename.vue";

	export default {
		components:{
			"p-poetry-detail" : Detail,
			"p-poetry-create" : Create,
			"p-poetry-rename" : Rename,

		},
		data(){
			return {
				loading:{
					fetch: false
				},

				layer:{
					type: "create",
					open: false,
					title: "新建诗集",
				},

				list: [],
				current: {}
			}
		},


		methods:{
			fetch(){  //---获取诗歌集
				this.loading.fetch = true
				return api.poetry.getList().then(res=>{
					this.list = res.data;
					if(this.list.length){
						this.current = this.current._id ? this.current : this.list[0];
					}
					this.loading.fetch = false;
				}).catch(err=>{
					this.$toast(`诗集数据获取失败：${err.message}`,'error');
					this.loading.fetch = false;
				})
			},

			refresh(){ //---更新

			},

			showLayer(type){  //---选择诗集
				switch(type){
					case "create":
						Object.assign(this.layer,{
							open : true,
							type : "create",
							title: "新建诗集"
						});
						break;
					case "rename":
						Object.assign(this.layer,{
							open : true,
							type : "rename",
							title: "诗集重命名"
						});	
						break;				
				}
			},

			select(poetry){
				this.current = poetry
			},
		},

		activated(){
			this.fetch();
		}
	}

</script>

<style lang="stylus" scoped="">
.poetry-app
	width 100%
	height 100%
	overflow hidden
	display flex
	section.is-left 
		width 300px
		padding 30px
		border-right 1px solid $color-border
		height 100%
		overflow hidden
		div.is-btn-box
			width 100%
			height 36px
			display flex
			justify-content space-between
			p
				position relative
				width 46%
				height 100%
			
		ul
			padding-top 20px
		li
			padding 10px
			cursor pointer
			transition 300ms
			&:not(.is-active):hover
				color #797a80
			&.is-active
				color $color-danger
				opacity 0.8
			h4	
				font-size 14px
				small
					color #aaa
				
	section.is-right
	section.is-empty
		flex 1
		padding 30px
		height 100%
		overflow auto
		
			
	
	
</style>