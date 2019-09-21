
const fs = require('fs-extra');
const path = require("path");
const Vue = require("Vue");
const createRenderer = require("vue-server-renderer").createRenderer;
const alifont = "//at.alicdn.com/t/font_1256709_dcbil0slu5r.css";

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
}
