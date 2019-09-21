/*
	ajax请求路由
*/

const UserCode = require("../models/code.js"); //--验证码
const Customer = require("../models/customer.js"); //--用户
const Poem = require("../models/poem.js");
const session = require("./session.js"); //--会话

module.exports = {
	findByPhone: function (req,res){
		Customer.findOne({phone: req.body.phone}).select("-password").then(doc=>{
			if(doc && doc._id){
				res.send({_id: doc._id})
			}else{
				res.send({_id: ""});
			}
		}).catch(err=>{
			res.status(300);
			res.send({text:err.message})
		});
	},

	code(req,res){ //--获取手机验证码
		var code = Math.random().toString().slice(2,6);
		var phone = req.body.phone;
		var user_code = new UserCode({phone,code});
		user_code.save().then(doc=>{
			if(doc && doc._id){
				// delete doc._doc.code;
				res.send(doc._doc);
			}else{
				return Promise.reject()
			}
		}).catch(err=>{
			res.status(300);
			res.send({text: "获取验证码失败"});
		})
	},

	register(req,res){  //---注册用户
		var {username, phone, code, password, type="register", code_id} = req.body;
		var data= {pen_name: username,phone,password,type};

		UserCode.isFresh(code_id,code,phone).then(doc=>{
			return new Customer(data).save().select("-password");
		}).then(doc=>{
			console.log(doc)
			if(doc && doc._id){
				session.create(res,doc._id);
				delete doc._doc.password;
				res.send(doc);
			}else{
				return Promise.reject({message:"注册失败"});
			}
		}).catch(err=>{
			res.status(300);
			res.send({text: err.message})
		});
	},

	login(req,res){  //--登录
		let {code,code_id,password,phone} = req.body;
		if(code && code_id){  //---短信登录
			UserCode.isFresh(code_id,code,phone).then(doc=>{ //--检测code是否正确
				return Customer.findOne({phone}).select("-password");
			}).then(doc=>{ //--根据手机号查找到用户
				if(doc && doc._id){
					session.create(res,doc._id);
					// delete doc._doc.password;
					res.send(doc);
				}else{
					return Promise.reject({message:"手机号不存在"});
				}				
			}).catch(err=>{
				res.status(300);
				res.send({text: err.message})
			})
		}else{ //---密码登录
			Customer.findOne({phone}).then(doc=>{ //---查找用户
				if(doc && doc._id){
					if(doc.password===password){ //--检测密码是否匹配
						session.create(res,doc._id);
						delete doc._doc.password;
						res.send(doc);
					}else{
						return Promise.reject({message:"密码错误"});
					}
				}else{
					return Promise.reject({message:"手机号不存在"});
				}						
			}).catch(err=>{
				res.status(300);
				res.send({text: err.message})				
			})
		}
	},

	poem:{
		add(req,res){  //---增加诗歌
			let data = req.body;
			let uid = req.user._id;
			new Poem(Object.assign({},data,{create_author: uid})).save().then(result=>{
				res.send(result)
			}).catch(err=>{
				res.status(300);
				res.send({text: err.message})	
			})
		},

		update(req,res){ //---更新诗歌
			let poem_id = req.body._id;
			let cloneobj = JSON.parse(JSON.stringify(req.body))
			delete req.body._id;
			Poem.findOneAndUpdate(poem_id,req.body).then(()=>{
				res.send(cloneobj)
			}).catch(err=>{
				res.status(300);
				res.send({text: err.message})					
			})
		},

		delete(){ //--删除诗歌


		}
	}


}