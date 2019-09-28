//---诗歌表
const db = require("./db.js");
const Poetry = require("./poetry");

const PoemSchema = db.Schema({
	title: String, //---标题
	author_name: String, //--作者名
	appreciation: Array,  //--赏析文,同诗歌正文一样，数组便于赏析
	letter: String, //--背景图
	fontFile: String,  //---字体文件
	create_time:{ //--创建时间
		type: Date,
		default:()=>new Date()
	},
	create_author: db.Schema.Types.ObjectId, //--创建作者id
	body: Array,  //--诗歌文本
	style: Object, //--样式
	poetry: db.Schema.Types.ObjectId,  //---属于哪个诗集
});

const Poem = db.model("poem",PoemSchema);
module.exports = Poem;


