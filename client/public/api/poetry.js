
import axios from "axios";

const MIN = 1050;  //---最小请求时间
const store = {
	getList(data){  //---创建诗歌
		let url = "/poetry/list";
		let time = Date.now();
		return axios.post(url,data).then(res=>{
			let arr = res.data || [];

			arr.forEach(item=>{
				item.size = item.poems.length;
			});
			return res;
		}).then(res=>store.timeout(res,time))
	},

	create(data){
		let url = "/poetry/create";
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