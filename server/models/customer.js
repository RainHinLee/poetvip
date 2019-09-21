//---用户表
const db = require("./db.js");

const CustomerSchema = db.Schema({
	pen_name: String, //--笔名
	real_name: String, //--真实姓名
	phone: String, //--手机号
	password: String, //---密码
	tags: Array,  //---诗人标签， 比如鲁迅诗歌奖获得者，先锋诗人,朦胧派诗人等
	desc: String, //---介绍文本
	avator: String, //---头像
	create_time: {
		type: Date, 
		default:()=>new Date()
	},
	type : String, //---register注册诗人 || fixed由管理员创建，管理员创建的用户没有手机号；
});

//---注册前，检查手机是否已注册
CustomerSchema.pre("save",function(next){
	Customer.findOne({phone: this.phone}).then(doc=>{
		if(doc && doc._doc){  //--手机已存在
			next(new Error("该手机号已注册"));
		}else{
			next();
		}
	});
});



const Customer = db.model("customer",CustomerSchema);

module.exports = Customer;
