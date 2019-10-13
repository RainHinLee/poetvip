

/* vuex 数据中心 */

export default {
	state:{
		poetries: [],  //--诗集列表
		poems: [], //--诗歌列表
	},

	mutations:{
		update_poetries(store,arr){
			store.poetries = arr;
		},

		update_poems(store,arr){
			store.poems = arr;
		}
	}
}

