//---诗歌表
const db = require("./db.js");

const PoemSchema = db.Schema({
	title: String, //---标题
	author_name: String, //--作者名
	appreciation: String,  //--赏析文
	letter: String, //--背景图
	create_time:{ //--创建时间
		type: Date,
		default:()=>new Date()
	},
	create_author: db.Schema.Types.ObjectId, //--创建作者id
	body: Array,  //--诗歌文本
	style: Object, //--样式
});

const Poem = db.model("poem",PoemSchema);
module.exports = Poem;


