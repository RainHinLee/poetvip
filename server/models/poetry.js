
//---诗集
const db = require("./db.js");

const PoetrySchema = db.Schema({  //---
	title: String,   //---诗集名
	poster: String,  //--诗集封面
	poems: Array,   //--存放poem._id 
	type: String,  // private私有 | public公开 | collect收藏诗集
	intro: String, //--诗集介绍
	author_id: db.Schema.Types.ObjectId,   //---创建者id
});

const Poetry = db.model("poem",PoetrySchema);
module.exports = Poetry;