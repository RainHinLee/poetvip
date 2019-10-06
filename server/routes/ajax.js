/*
	ajax请求路由
*/

const UserCode = require("../models/code.js"); //--验证码
const Customer = require("../models/customer.js"); //--用户
const Poem = require("../models/poem.js");
const Poetry = require("../models/poetry.js");
const util = require("./util.js");

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
			return new Customer(data).save()
		}).then(doc=>doc.select("-password")).then(doc=>{
			if(doc && doc._id){
				session.create(res,doc._id);
				delete doc._doc.password;
				res.send(doc);
			}else{
				return Promise.reject({message:"注册失败"});
			}
		}).catch(err=>{
			console.log(err.message)
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
			let poetry_id = data.poetry; 
			let values = Object.assign({},data,{create_author: uid})

			Poetry.findById(poetry_id).then(doc=>{  //--先检测诗集是否存在
				if(!doc) return Promise.reject({message:"诗集不存在"}) // ---诗集不存在
				new Poem(values).save().then(doc1=>{ //--保存诗歌
					Poetry.poemsChange('add',poetry_id, doc1._id); //--将诗歌添加到诗集中
					res.send(doc)
				});
			}).catch(err=>{
				res.status(300);
				res.send({text: err.message});
			});
		},

		update(req,res){ //---更新诗歌，将诗歌从原来的诗集移除，
			let poem_id = req.body._id;
			let poetry_id = req.body.poetry
			delete req.body._id;  //--将id移除

			Poem.findById(poem_id).then(doc=>{ //--查找当前poetry
				return doc.update(req.body).then(doc1=>{
					if(poetry_id !=  doc.poetry){ //--新旧诗集不一样
						Poetry.poemsChange('add', poetry_id, poem_id); //--将是个添加到新诗集中；
						Poetry.poemsChange("delete", doc.poetry, poem_id); //--从旧诗集中移除诗歌
					};
					res.send(doc1);
				});
			}).catch(err=>{
				res.status(300);
				res.send({text: err.message})	
			});
		},



	},

	poetry:{
		getList(req,res){
			Poetry.find().then(doc=>{
				res.send({data:doc});
			}).catch(err=>{
				res.status(300);
				res.send({text: err.message})					
			});
		},

		create(req,res){  //---新建诗集
			let data = 	Object.assign({},req.body,{
				poems: [],   //--存放poem._id 
				author_id: req.user._id,   //---创建者id
			});

			Poetry.findOne({name: data.name}).then(doc=>{
				return doc ? Promise.reject({message: "诗集已存在"}) : new Poetry(data).save()
			}).then(doc=>{
				res.send(doc)
			}).catch(err=>{
				res.status(300);
				res.send({text: err.message})		
			})
			// res.send(data);
		},




	}




}