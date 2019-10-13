
import axios from "axios";
import Vue from "vue";

const MIN = 550;  //---最小请求时间
const store = {
	getList($store){  //---获取诗集列表
		let url = "/poetry/list";
		let time = Date.now();
		return axios.post(url).then(res=>{
			let arr = res.data || [];
			arr.forEach(item=>{
				item.size = item.poems.length;
				item._refreshHandler = ()=> store.getList($store);
			});

			$store && Vue.nextTick(()=>$store.commit("update_poetries",arr));
			return res;
		}).then(res=>store.timeout(res,time))
	},

	getPoems(poetry_id, $store){  //--获取诗集中的诗歌
		let url = "/poetry/poems";
		let time = Date.now();		
		return axios.post(url,{id: poetry_id}).then(poems=>{
			poems.forEach(item=>{
				item['_reader'] = `/reader?poetry=${poetry_id}&poem=${item._id}`;
				item['_editor'] = `/worker?poetry=${poetry_id}&poem=${item._id}`;
				item['_removing'] = false; 
				item['_refreshHandler'] = ()=>store.getPoems(poetry_id,$store);
			});
			$store && Vue.nextTick(()=>$store.commit("update_poems",poems));
			return poems
		}).then(res=>store.timeout(res,time))
	},

	create(data){
		let url = "/poetry/create";
		let time = Date.now();
		return axios.post(url,data).then(res=>store.timeout(res,time))
	},


	translate(data){
		let url = "/poetry/translate";
		let time = Date.now();
		return axios.post(url,data).then(res=>store.timeout(res,time))
	},

	timeout(res,stime){
		let etime = Date.now();
		let time = MIN - (etime- stime);

		if(time<=50){
			return Promise.resolve(res);
		}else{
			return new Promise(resolve=>{
				setTimeout(()=>resolve(res),time)
			})
		}
	},
}

export default store;