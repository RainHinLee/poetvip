//--用户注册，登录等接口
import axios from "axios";

export default {
	register(data){ //---用户注册
		let url ="/user/register";
		return axios.post(url,data);
	},

	login(data){ //---用户登录
		let url ="/user/login";
		return axios.post(url,data);
	},

	getCode(phone){  //--获取验证码
		let url ="/user/getCode";
		return axios.post(url,{phone})
	},

	findByPhone(phone){ //--根据phone，注册时用
		let url ="/user/find/phone";
		return axios.post(url,{phone});
	}
}