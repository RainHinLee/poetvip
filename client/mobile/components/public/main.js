

import Vue from "vue";
import Vuex from "vuex";
import VueRouter from "vue-router";
import CreateAPI from 'vue-create-api'; //https://github.com/cube-ui/vue-create-api/blob/master/README_zh-CN.md

import Scroll from "./scroll.vue";


Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(CreateAPI, {apiPrefix: '$create-'});
Vue.use(window.cube)

//---注册全局组件
Vue.component("pv-scroll",Scroll);

Vue.mixin({ //---注入
	data(){
		return {
			customer: window.customer
		}
	},	
	methods:{
		
	}
});

window.dispatcher = new Vue();
// window.$toast = window.dispatcher.$toast;
// window.$confirm = window.dispatcher.$confirm;
// window.$alert = window.dispatcher.$alert;


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

