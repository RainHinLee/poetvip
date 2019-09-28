
//---诗集
const db = require("./db.js");

const PoetrySchema = db.Schema({  //---
	name: String,   //---诗集名
	poster: String,  //--诗集封面
	poems: {
		type: Array,
		default:()=>[]
	},   //--存放poem._id 
	type: String,  // private私有 | public公开 | collect收藏诗集
	intro: String, //--诗集介绍
	author_id: db.Schema.Types.ObjectId,   //---创建者id
});

PoetrySchema.statics.poemsChange= function (type,poetry_id,poem_id){  //---诗集中的poems数组操作，删除和添加
	return this.findById(poetry_id).then(doc=>{
		let poems = doc.poems;
		let index = poems.findIndex(item=>item==poem_id);  //--当前位置
		console.log(poems,poem_id,index)
		switch(type){
			case "add": 
				index<0 && poems.unshift(poem_id); //--添加
				break;
			case "delete": //--删除
				index>=0 && poems.splice(index,index+1);
				break;
		};
		return doc.save();
	})
}

const Poetry = db.model("poetry",PoetrySchema);
module.exports = Poetry;