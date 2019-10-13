//---诗歌表
const db = require("./db.js");
const Poetry = require("./poetry");
const fs = require("fs-extra");
const path = require("path");
const Fontmin = require("fontmin");
const rename = require('gulp-rename');

const PoemSchema = db.Schema({
	title: String, //---标题
	author_name: String, //--作者名
	letter: String, //--背景图
	fontFile: { type:String, default: ""}, //---字体文件
	fontName: { type: String,default: "" }, //--字体名字
	create_time:{type: Date, default:()=>new Date()},  //--创建时间
	create_author: db.Schema.Types.ObjectId, //--创建作者id
	body: Array,  //--诗歌文本
	style: Object, //--样式
	appreciation: Array,  //--赏析文,同诗歌正文一样，数组便于赏析
	poetry: db.Schema.Types.ObjectId,  //---属于哪个诗集
	views: { type: Number, default: 0},  //---阅读量
	likes:{ type: Number, default: 0}, //--点赞量
	imports:{ type: Number,default: 0}, //--收录 
});


PoemSchema.statics.updateFontFile= function (poem_id){  //---创建和更新字体文件，font_name;字体名字
	return this.findById(poem_id).then(doc=>{
		let text = doc.body.join("");
		let fontName = doc.fontName;
		let target = path.resolve(__dirname,`../platform/public/statics/fonts/${fontName}.ttf`);  //--目标字体文件
		let font= path.resolve(__dirname,`../fonts`); //--生产字体文件

		if(!fs.existsSync(target)){  //---目标字体文件不存在，返回空
			return doc;
		};

		let fontmin = new Fontmin().src(target).dest(font).use(rename(`${poem_id}.ttf`)).use(Fontmin.glyph({text,hinting:false}));

		return new Promise((resolve,reject)=>{
			fontmin.run((err,files)=>err ? reject(err) : resolve(`/fonts/${poem_id}.ttf`));
		}).then(src=>{
			return doc.updateOne({fontFile: src}).then(()=>this.findById(poem_id));
		})
	})
};

PoemSchema.statics.removeFontFile= function (poem_id){  //---删除字体文件，font_name;字体名字
	let font= path.resolve(__dirname,`../fonts/${poem_id}.ttf`); //--字体文件
	fs.existsSync(font) && fs.unlinkSync(font);
	return Promise.resolve()
};

//---存储之前，检测诗集是否存在
PoemSchema.pre("save", async function(next){  
	let doc= await Poetry.findById(this.poetry);
	if(!doc) return Promise.reject(new Error("诗集不存在"));
	next();
});


module.exports =  db.model("poem",PoemSchema);



