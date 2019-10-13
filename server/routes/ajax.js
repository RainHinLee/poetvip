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
			return new Customer(data).save();
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
			let uid = req.user._id;
			let poetry_id = req.body.poetry; 
			let values = Object.assign({},req.body,{create_author: uid});
			if(values.style){ 
				values.style.fontFamily = ""; //---删除字体样式
			};

			delete values._id;   //---删除_id

			new Poem(values).save().then(doc=>{
				return Poem.updateFontFile(doc._id) //---更新字体文件
			}).then(doc=>{
				return Poetry.poemsChange('add',poetry_id, doc._id).then(()=>Poem.findById(doc._id));
			}).then(doc=>{
				res.send(doc)
			}).catch(err=>{
				res.status(300);
				res.send({text: err.message});
			});
		},

		update(req,res){ //---更新诗歌
			let {_id, poetry, style, fontName} = req.body;

			if(style){ style.fontFamily = ""};  //--将字体设置置空
			if(fontName===""){ //--字体为空时，也将字体文件设置为空
				req.body.fontFile="";
			}

			delete req.body._id;  //--将id移除
			//--将防止覆盖动态数据，阅读量， 收录量，点赞量
			delete req.body.views;
			delete req.body.imports;
			delete req.body.likes;

			console.time("exec");
			Poetry.findById(poetry).then(doc=>{
				return doc ? doc : Promise.reject({message:"诗集不存在"});
			}).then(doc=>{
				return Poem.findById(_id).then(doc=>doc || Promise.reject({message:"诗歌不存在"}))
			}).then(doc=>{
				let old =  doc.poetry;
				return doc.updateOne(req.body).then(()=>{ //--更新
					if(poetry !=  old){ 
						return Poetry.poemsChange('add', poetry, _id).then(()=>{ //--加入新诗集
						 	return Poetry.poemsChange("delete",old, _id); //--移出旧诗集
						}).then(()=>{ 
						 	return Poem.findById(_id) //--返回更新的文档
						})
					}else{
						return Poem.findById(_id)  //--返回新文档
					}
				})
			}).then(doc=>{ //--更新字体文件
				if(doc.fontName){
					return  Poem.updateFontFile(doc._id)
				}else{
					Poem.removeFontFile(doc._id);
					return doc 
				}
			}).then(doc=>{ //---返回数据
				console.timeEnd("exec");
				res.send(doc);
			}).catch(err=>{
				res.status(300);
				res.send({text: err.message})	
			});
		},

		delete(req,res){ //---删除诗歌
			let poem_id = req.body.id;
			Poem.findById(poem_id).then(doc=>{
				let promise = doc ? doc.remove() : Promise.resolve();
				promise.then(()=>{
					Poem.removeFontFile(poem_id);  //--删除字体文件;
				}).then(()=>{
					return doc ? Poetry.poemsChange("delete", doc.poetry, poem_id) : doc //--移出诗集
				}).then(()=>{
					res.send(doc)
				})
			}).catch(err=>{
				res.status(300);
				res.send({text: err.message})					
			})
		},
	},

	poetry:{
		getList(req,res){
			Poetry.find().then(doc=>{
				doc.sort((a,b)=>b.create_time-a.create_time);
				res.send({data:doc})
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
				return doc ? Promise.reject({message: "诗集已存在"}) : new Poetry(data).save();
			}).then(doc=>{
				res.send(doc)
			}).catch(err=>{
				res.status(300);
				res.send({text: err.message})		
			})
		},

		poems(req,res){  //--诗集中的诗歌列表
			let poetry_id = req.body.id;
			Poetry.findById(poetry_id).populate({
				path: "poems",
				select: "-body -appreciation",
			}).exec().then(doc=>{
				res.send(doc ? doc.poems : []);
			}).catch(err=>{
				res.status(300);
				res.send({text: err.message})					
			})
		},

		translate(req,res){  //---移动诗歌, origin ，先增加到新诗集中，再从旧诗集中移除，再更新诗歌的poetry属性
			let {origin, translate} = req.body;

			Poetry.findById(translate.poetry_id).then(doc=>{ //--执行插入,移除
				return doc ? doc : Promise.reject({message:"诗集不存在"});
			}).then(doc=>{
				let poems = doc.poems || [];
				let idx = poems.findIndex(item=>item==translate.poem_id); //--插入位置
				let isSame = origin.poetry_id == translate.poetry_id;  
				//$$执行添加
				idx = translate.pos=='after' ? idx+1 : idx; 
				idx = idx <=0 ? 0 : idx;				
				poems = poems.slice(0,idx).concat(origin.poem_id).concat(poems.slice(idx));

				//$$执行移除
				if(isSame){  //--同一部诗集;
					let idx1 = poems.findIndex((item,index)=>{
						let prev = poems[index-1];
						let next = poems[index+1];
						let target = translate.pos=='after' ? prev : next;  //--插入到诗歌的后面，目标诗歌为前一位，反之
						return item == origin.poem_id && target != translate.poem_id;
					});
					poems.splice(idx1,1); 
					doc.poems = poems;
					return doc.save();
				}else{ //--不是同一部诗集、
					doc.poems = poems;
					return doc.save().then(()=> Poetry.poemsChange("delete",origin.poetry_id, origin.poem_id));
				}
			}).then(()=>{  //--$$执行更新poem中的poetry
				return Poem.findById(origin.poem_id).then(doc=>{
					doc.poetry = translate.poetry_id;
					return doc.save().then(()=>doc);
				});
			}).then((doc)=>{
				res.send(doc);
			}).catch(err=>{
				res.status(300);
				res.send({text: err.message})					
			})
		},
	}
}