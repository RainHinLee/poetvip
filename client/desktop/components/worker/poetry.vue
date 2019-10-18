<template>
	<div class="worker-poetry-widget">
		<template v-if="loading.fetch">
			<section class="is-empty"><pv-loading /></section>
		</template>

		<template v-else>
			<pv-scroll :bar="false">
				<!-- 新建按钮 -->
				<div class="is-btn-box">
					<button class="is-btn" @click="layer.open=true"><span><i class="iconfont iconadd-o"></i></span> 新建诗集</button>
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
		</template>

		<!-- 创建诗集 -->
		<pv-layer title="新建诗集" width="460px" :open="layer.open" @close="layer.open=false">
			<p-poetry-create @create:success="createSuccess"  @close="layer.open=false" />
		</pv-layer>	
	</div>
</template>

<script>
	
	import api from "api";
	import config from "./config.js";
	import CreatePoetry from "../account/poetry/create.vue";

	export default {
		components:{
			"p-poetry-create" : CreatePoetry
		},
		data(){
			return {
				loading:{
					fetch: false
				},
				list: [],
				current: {},
				layer:{
					open: false,
				}
			}
		},

		methods:{
			fetch(){  //---获取诗歌集
				this.loading.fetch = true
				return api.poetry.getList().then(res=>{
					this.list = res.data;
					this.loading.fetch = false;
					if(!this.current._id){
						this.current = this.list.find(item=>item._id==window.poem.poetry) || {};
					}
				}).catch(err=>{
					this.$toast(`诗集数据获取失败：${err.message}`,'error');

					this.loading.fetch = false;
				})
			},

			createSuccess(){  //--诗集创建成功
				this.fetch();
				this.$postMessage("poetry:created");  //---通知account页面有新的诗集被创建；
			},

			select(item){
				this.current = item;
				config.dispatcher.$emit("poetry:select",this.current);
			}
		},

		mounted(){
			this.fetch();
			config.dispatcher.$on("poetry:refresh", this.fetch.bind(this));
		}
	}

</script>

<style lang="stylus" scoped="">
.worker-poetry-widget
	width 100%
	height 100%
	overflow hidden
	padding 20px
	color #aaa
	div.is-btn-box
		width 100%
		height 36px
		button
			color #aaa
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

	
</style>