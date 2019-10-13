
import axios from "axios";

const MIN = 1050;  //---最小请求时间
const store = {
	add(data){  //---创建诗歌
		let url = "/poem/add";
		let time = Date.now();
		return axios.post(url,data).then(res=>store.timeout(res,time));
	},

	update(data){ //--更新诗歌
		let url = "/poem/update";
		let time = Date.now();
		return axios.post(url,data).then(res=>store.timeout(res,time));
	},

	delete(poem_id){  //--删除诗歌
		let url = "/poem/delete";
		let time = Date.now();
		return axios.post(url,{id: poem_id}).then(res=>store.timeout(res,time));
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