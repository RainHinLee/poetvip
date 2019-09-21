//---路由

const util = require("./util.js");
const session = require("./session.js");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
	home(req,res){
		util.render(req,res,"home.html")
	},

	register(req,res){
		if(req.user._id){
			let url = req.query.target || "/account";
			res.redirect(url)
		}else{
			util.render(req,res,"register.html")
		}
	},

	account(req,res){
		let target = encodeURIComponent(req.originalUrl);
		if(req.user._id){
			util.render(req,res,"account.html")
		}else{
			res.redirect(`/user/login?target=${target}`);
		}
	},

	worker(req,res){
		let letterFile = path.resolve(__dirname,"../platform/public/statics/images/letters");
		let letters = fs.readdirSync(letterFile).map(item=>{
			return `/public/statics/images/letters/${item}`;
		});
		let target = encodeURIComponent(req.originalUrl);

		if(req.user._id){
			util.render(req,res,"worker.html",{letters})
		}else{
			res.redirect(`/user/login?target=${target}`);
		}
	},

	logout(req,res){
		session.remove(res);
		res.redirect("/");
	},

	login(req,res){ 
		if(req.user._id){
			let url = req.query.target || "/account";
			res.redirect(url)
		}else{
			util.render(req,res,"login.html")
		}		
	}

}
