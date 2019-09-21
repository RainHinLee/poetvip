// ---session相关,中间件

const crypto = require('crypto');  //加载crypto库
const Customer = require("../models/customer.js");

const config = {
	secret: "RAINHIN_POETVIP",
	session_key : "_key",
	code_key : "_code",
}

const store = {
	create(res,uid){  //--生成session
		let token = store.encode(uid);
		res.cookie(config['session_key'],uid,{maxAge : 360 * 24 * 60 * 60 * 1000});
		res.cookie(config['code_key'],token,{maxAge : 360 * 24 * 60 * 60 * 1000});
	},

	remove(res){  //--删除session
		res.clearCookie(config['session_key']);
		res.clearCookie(config['code_key']);
	},

	query(req,res){ //
		let uid = req.cookies[config.session_key];
		let token = req.cookies[config.code_key];
		req.user = {};

		if(uid && token && store.encode(uid) == token){  //--uid存在
			return Customer.findById(uid).then(doc=>{
				doc && Object.assign(req.user,doc._doc);
				delete req.user.password;
			}).catch(err=>{})
		}else{
			return Promise.resolve();
		}
	},

	encode(uid){  //---加密
		var md5 = crypto.createHash('md5');
		var data = {uid: Number(uid), secret: config['secret']};
		var str = JSON.stringify(data);
    return md5.update(str).digest('hex');
	},
};

module.exports = store;