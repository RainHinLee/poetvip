const express = require('express');
const bodyParser = require('body-parser'); //https://github.com/expressjs/body-parser;
const favicon =require('serve-favicon'); //https://github.com/expressjs/serve-favicon;
const userAgent = require('express-useragent'); //https://github.com/biggora/express-useragent
const cookieParser = require('cookie-parser');
const compression = require('compression');  //--gzib 压缩
const path = require('path');
const routes = require("./routes/index.js");
const PORT = 9090;
const app = express();

//---中间件
app.use(userAgent.express()); //req.useragent
app.use(cookieParser()); //req.cookies
app.use(compression()); //--资源压缩
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())// req.body
app.use(express.static("platform")); //---静态文件
app.use('/fonts', express.static("fonts"))  //---字体文件

app.use((req,res,next)=>{  //---session查询
	routes.session.query(req).then(()=>next()).catch(err=>next())
})

//--html网页请求
app.get("/",routes.html.home);  //---首页
app.get("/user/register",routes.html.register);  //----注册
app.get("/user/logout",routes.html.logout);  //----登录
app.get("/account",routes.html.account); //---账户中心
app.get("/user/login",routes.html.login);  //----登录
app.get("/worker",routes.html.worker);
app.get("/reader",routes.html.reader);  //----阅读器
// app.get("/copyright",routes.html.copyright);  //---版权申明
// app.get("/privacy",routes.html.privacy);  //---隐私申明

// //---ajax请求
app.post("/user/login",routes.ajax.login); //--登录
app.post("/user/register",routes.ajax.register); //--注册
app.post("/user/getCode",routes.ajax.code); //--获取验证码
app.post("/user/find/phone",routes.ajax.findByPhone);  //---手机查找用户，检测手机号是否注册
//---诗歌操作
app.post("/poem/add", routes.ajax.poem.add);  //---增加诗歌
app.post("/poem/update", routes.ajax.poem.update);  //---更新诗歌
app.post("/poem/delete", routes.ajax.poem.delete); //---删除诗歌

//--诗集操作
app.post("/poetry/list", routes.ajax.poetry.getList);  //---诗歌集列表
app.post("/poetry/create", routes.ajax.poetry.create);  //---新建诗集
app.post("/poetry/poems",routes.ajax.poetry.poems);  //--诗集中的诗歌列表
app.post("/poetry/translate",routes.ajax.poetry.translate);  //--诗集中的诗歌列表






app.listen(PORT);
	