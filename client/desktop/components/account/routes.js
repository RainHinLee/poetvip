

import Vue from 'vue';

//---首页下的组件
import Poem from './poem/index.vue'; //--课表
import Poetry from './poetry/index.vue';
import Setting from './setting/index.vue'; //--我的老师
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
		path: '/poem',
		component: Poem
	},
	{
		path: '/setting',
		component:Setting,
	},
]

