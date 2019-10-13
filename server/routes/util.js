
const fs = require('fs-extra');
const path = require("path");
const Vue = require("Vue");
const createRenderer = require("vue-server-renderer").createRenderer;
const alifont = "//at.alicdn.com/t/font_1256709_7qm7bihs08t.css";

const FontMin = require("fontmin");

module.exports = {
	render(req,res,filename,data){  //---渲染文件
		let {user,query,useragent} = req;
		let platform = useragent.isMobile ? "mobile" : "desktop";
		let filesrc = path.resolve(__dirname,`../platform/${platform}/views/${filename}`);

		let renderer = createRenderer({
  			template: fs.readFileSync(filesrc, 'utf-8')
		});

		let app = new Vue({template: "<div></div>"});
		let context = Object.assign({},data,{user,useragent,query,alifont});

		renderer.renderToString(app,context).then(html=>{
			res.send(html)
		}).catch(err=>{
			console.log(err.message)
		})
	},

	/*---提取字体文件, 
		fontname字体名字， 
		text提取字体， 
		targetname字体文件名字
		
		所有提取的字体文件存放于fontmins目录下,
		诗歌新建和更新时需要调用create接口
		诗歌删除需要调用delete接口

	*/
	fontmin:{
		create(fontname, text, filename){  //---创建提取字体文件
			var src = path.resolve(`../fontmins/${filename}.ttf`);
			var baseSrc = path.resolve(`../platform/public/statics/fonts/${fontname}.ttf`);

			if(!fs.existsSync(baseSrc)) return Promise.reject({message: "字体文件不存在"});

			if(fs.existsSync(src)){  //--先移除存在的文件
				fs.removeSync(src);
			};

			var fontmin = new FontMin().src(baseSrc).use(FontMin.glyph({text})).dest(src);
			return new Promise((resolve,reject)=>{
				fontmin.run(function (err,files){
					return err ? reject(err) : resolve(files);
				})
			});
		},
		//--移除字体的文件
		delete(filename){
			var src = path.resolve(`../fontmins/${filename}.ttf`);
			if(fs.existsSync(src)){  
				fs.removeSync(src);
			};
			return Promise.resolve(src);
		}
	}
}
