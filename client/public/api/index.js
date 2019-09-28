
import axios from "axios";
import customer from "./customer.js";
import poem from "./poem.js";
import poetry from "./poetry.js";


axios.interceptors.response.use(successHandler,errorHandler)

export default {customer,poem,poetry};

//--成功响应拦截器
function successHandler(res){
	return res.data
};

//--失败拦截器
function errorHandler(error){
	let data={
		message : error.response ? error.response.data.text : error.message,
		status: error.response ? error.response.status : error.status
	}
	return Promise.reject(data)
}