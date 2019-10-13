

import Vue from "vue";
import Vuex from "vuex";
import VueRouter from "vue-router";
import CreateAPI from 'vue-create-api'; //https://github.com/cube-ui/vue-create-api/blob/master/README_zh-CN.md

import Scroll from "./scroll.vue";
import Toast from "./toast.vue";
import Dialog from "./dialog.vue";

import Header from "./header.vue";
import Page from "./page.vue";
import Editor from "./editor.vue";
import Poem from "./poem.vue";
import Layer from "./layer.vue";
import Loading from "./loading.vue";
import PSelect from "./select.vue";


Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(CreateAPI, {apiPrefix: '$create-'});

Vue.component("pv-scroll",Scroll);
Vue.component("pv-page", Page);
Vue.component("pv-header",Header);
Vue.component("pv-editor",Editor);
Vue.component("pv-poem", Poem);
Vue.component("pv-layer", Layer);
Vue.component("pv-loading", Loading);
Vue.component("pv-select", PSelect);


Vue.createAPI(Toast, false);
Vue.createAPI(Dialog, false);

Vue.mixin({ //---注入
	data(){
		return {
			customer: window.customer
		}
	},	
	methods:{
		$toast(message,type){
			this.$createToast({
			  $props:{message,type},
			}).show()
		},

		$confirm(message,confirm,cancel){
			this.$createPdialog({
			  $props:{message,type:"confirm"},
			  $events:{
			  	confirm: confirm || function(){},
			  	cancel : cancel|| function(){}
			  }
			}).show()
		},

		$onMessage(type,handler){  //---监听页面间通信,
			if(window.localStorage && type){
				window.addEventListener('storage',(ev)=>{
					if(ev.key=="message"){
						let message = JSON.parse(ev.newValue);   //---转为json对象
						message.type==type && handler && handler(message.data);
					}
				})
			}
		},

		$postMessage(type,data=""){  //--页面间，发送通知 type类型， data值
			let message = {type,data};
			if(window.localStorage && type){
				window.localStorage.setItem("message", JSON.stringify("{type:''}"));  //--先清空,防止同样的数据不产生message事件
				window.localStorage.setItem("message", JSON.stringify(message));
			}
		}
	}
});

window.dispatcher = new Vue();
window.$toast = window.dispatcher.$toast;
window.$confirm = window.dispatcher.$confirm;
window.$alert = window.dispatcher.$alert;


export default function (App,options={}){  //---渲染函数
	let {routes=[],store={}} = options;
	let _router = new VueRouter({routes});
	let _store = new Vuex.Store(store);
	let baseOptions = {
			el: "#app",
			render: h=>h(App)
	};

	baseOptions['router'] = _router;
	baseOptions['store'] = _store;

	return new Vue(Object.assign({},baseOptions));	
}

/*
	

select 会员编号 from 租借 where 租借日期< '2015/05/01';
create view LM (音像编号，音像名，租金，类别 ) as select * from 音像 where 类别='科幻';
select 类别，count(音像编号) from 租借,音像 group as 租借.音像编号;


*/