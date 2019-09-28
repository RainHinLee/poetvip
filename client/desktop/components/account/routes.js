

import Vue from 'vue';

//---首页下的组件
import Poetry from './poetry/index.vue';
import Setting from './setting/index.vue'; //--设置
//---公开课组件
export default [
	{
		path : '/',
		redirect: '/poetry'
	},
	{
		path : '/poetry',
		component: Poetry
	},
	{
		path: '/setting',
		component:Setting,
	},
]

