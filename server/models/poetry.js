
//---诗集
const db = require("./db.js");

const PoetrySchema = db.Schema({  //---
	name: String,   //---诗集名
	poster: String,  //--诗集封面
	poems: [ {type: db.Schema.Types.ObjectId, ref:"poem"}],   
	type: String,  // private私有 | public公开 | collect收藏诗集
	intro: String, //--诗集介绍
	create_time:{ type: Date, default: ()=> new Date()},
	views: { type: Number, default: 0},  //---阅读量
	likes:{ type: Number, default: 0}, //--点赞量
	imports:{ type: Number,default: 0}, //--收录 
	author_id: db.Schema.Types.ObjectId,   //---创建者id
});

PoetrySchema.statics.poemsChange=  async function (type,poetry_id,poem_id){  //---诗集中的poems数组操作，删除和添加
	let doc = await this.findById(poetry_id);

	if(doc && doc.poems){
		let poems = doc.poems;
		let index = poems.findIndex(item=>item==poem_id);  //--当前位置

		switch(type){
			case "add": 
				index<0 && poems.unshift(poem_id); //--添加
				break;
			case "delete": //--删除
				index>=0 && poems.splice(index,index+1);
				break;
		};	
		return doc.save().then(()=>this.findById(poetry_id));
	};
		
	return doc;
};


const Poetry = db.model("poetry",PoetrySchema);
module.exports = Poetry;