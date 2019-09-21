
const db = require("./db.js");
const moment = require("moment");

const {Types} = db.Schema;
const TIMES = 20 * 60;

//---手机验证码
const CodeSchema = db.Schema({
	phone: String,  //--手机号
	code : String,  //--验证码code
	create_time: { //---创建时间
		type: Date,
		default: ()=>new Date()
	}  
});

//---检测code是否过期
CodeSchema.statics.isFresh = function(code_id,code,phone){  
	return this.findById(code_id).then(doc=>{
		if(doc && doc._doc){
			let data = doc._doc;
			let now = moment();
			let sdate = moment(data.create_time);
			let diff = now.diff(sdate,"seconds");

			if(diff>=TIMES){
				return Promise.reject({message:"验证码已过期"})
			}else{
				return (code==data.code && phone==data.phone) ? data: Promise.reject({message:"验证码不正确"})
			}
		}else{
			return Promise.reject({message:"验证码不正确"})
		}
	}).catch(err=>{
		return Promise.reject({message: err.message});
	})
}

const UserCode = db.model("code",CodeSchema);

module.exports = UserCode;



