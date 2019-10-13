<template>
	<div class="poetry-detail">
		<header>
			<div>
				<p @click=""><span><i class="iconfont iconsuo"></i></span> 私有</p>
				<p @click="$emit('rename')"><span><i class="iconfont iconzhongmingming"></i></span>重命名</p>
				<p><span><i class="iconfont iconshanchu"></i></span> 删除</p>
			</div>
			<p class="is-btn-box"><a :href="'/reader?poetry='+data._id" class="is-btn is-success">进入阅读</a></p>
		</header>		
		<section>
			<h3>{{data.name}} <small>（{{data.size}}）</small></h3> 
			<p>
				<a><span><i class="iconfont iconyueduliang"></i></span>{{data.views || "0"}}</a> 
				<a><span><i class="iconfont iconzan2"></i></span>{{data.likes || "0"}}</a> 
			</p>
		</section>

		<template v-if="loading.fetch">
			<div class="empty"><pv-loading /></div>
		</template>

		<template v-else>
			<template v-if="poems.length">
				<ul>
					<li v-for="item,index of poems">
						<div class="is-poem">
							<h6>{{index+1}}、{{item.title}} <small>{{item.author_name}}</small></h6>
								<p>
									<a><span><i class="iconfont iconyueduliang"></i></span> {{data.views || "0"}}</a> 
									<a><span><i class="iconfont iconzan2"></i></span>{{data.likes || "0"}}</a> 
									<a><span><i style="font-size:14px" class="iconfont iconshoulu"></i></span>{{data.imports || "0"}}</a> 
								</p>							
						</div>

						<div class="is-action-btns">
							<template v-if="item._removing">
								<pv-loading />
							</template>
							<template v-else>
								<a :href="item._reader" target="_blank">阅读</a>
								<a @click="translate(item)">移动</a>
								<a :href="item._editor" target="_blank">编辑</a>
								<a @click="remove(item)">删除</a>
							</template>
						</div>
					</li>
				</ul>
			</template>
			<template v-else>
				<div class="empty">此诗集没有诗歌</div>
			</template>
		</template>

		<pv-layer :overhide="false" :open="layer.open" :title="layer.title" width="460px" height="300px" @close="layer.open=false">
			<template v-if="layer.open">
				<p-translate :poem="layer.data" @close="layer.open=false"/>	
			</template>
		</pv-layer>


		
	</div>
</template>

<script>
		
	import api from "api";
	import Translate from "./translate.vue";

	export default {
		components:{
			"p-translate" : Translate
		},
		props: ['data'],

		data(){
			return {
				loading:{
					fetch: false,
					refresh: false,
				},

				layer:{
					open: false,
					title: "移动诗歌",
					data:{},
				}
			}
		},
		methods:{
			fetch(){  //---获取诗歌集中的诗歌数据
				let poetry_id = this.data._id;

				this.loading.fetch = true;
				this.fetchHandler().then(poems=>{
					this.loading.fetch = false;
				}).catch(err=>{
					this.loading.fetch = false;
					this.$toast(`获取诗歌失败：${err.message}`,'error');
				})
			},

			fetchHandler(){  //轮询
				let poetry_id = this.data._id;
				return api.poetry.getPoems(poetry_id, this.$store);
			},

			translate(poem){  //--移动诗歌
				Object.assign(this.layer,{
					data: poem,
					open: true,
					title: poem.title
				})
			},

			remove(poem){  //--删除诗歌
				this.$confirm("确定删除吗？",()=>{
					poem._removing = true;
					api.poem.delete(poem._id).then(()=>{
						this.data._refreshHandler();
						return poem._refreshHandler().then(()=>{
							this.$toast("删除成功","success");
						});
					}).catch(err=>{
						poem._removing = false;
					})
				})
			},

			refresh(){
				this.loading.refresh = true;
				setTimeout(()=>{
					this.loading.refresh = false;
				},300)
			}
		},

		computed:{
			poems(){
				return this.$store.state.poems;
			}
		},

		watch:{
			"data._id":{
				handler(newVal){
					this.fetch();
				}
			}
		},

		mounted(){
			this.data._id && this.fetch();
			this.$onMessage("poem:saved",this.fetchHandler.bind(this)); //---监听worker页面诗歌的更新和新建；
		},
	}
</script>

<style lang="stylus" scoped="">
.poetry-detail
	width 650px
	header
		display flex
		padding-bottom 10px
		height 46px
		align-items center
		justify-content space-between
		border-bottom 1px solid $color-border
		div
			display inline-flex
			align-items center
			justify-content flex-start
			color #bcbdc0
			p
				padding-right 15px
				cursor pointer
				transition 150ms
				&:hover
					color $color-block
		p.is-btn-box
			height 100%
			width 100px
	section
		display flex
		align-items flex-end
		justify-content space-between
		h3
			font-size 16px
			padding-top 10px	
		p
			color #bcbdc0
			font-size 12px
			a
				color inherit
				margin-right 0px
				display inline-flex
				align-items center
				margin-left 10px
				span
					margin-right 2px
	
	ul
		padding-top 20px
		padding-bottom 60px
		li
			width 100%
			height 50px
			border-bottom 1px solid $color-border
			display flex
			align-items center
			justify-content space-between
			line-height 1.0
			padding 0px 10px
			
			&:hover
				background $color-border
			div.is-poem
				padding-right 15px
				h6
					font-size 14px
					small
						font-size 14px
						font-weight normal
						color $color-grey
						margin-left 5px
				p
					padding-top 5px
					color #bcbdc0
					font-size 12px
					a
						color inherit
						margin-right 0px
						display inline-flex
						align-items center
						margin-right 10px
						span
							margin-right 2px				
			.is-action-btns
				width 160px
				display inline-flex
				align-items center
				justify-content flex-end
				a
					color #888
					font-size 14px
					margin-left 7px
					transition 150ms
					cursor pointer
					&:hover
						color $color-block
						text-decoration underline
	.empty
		padding-top 15px
		color $color-grey

</style>