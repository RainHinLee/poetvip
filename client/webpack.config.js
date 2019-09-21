//---webpack构建工具

const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const stylus = require('stylus');
const nib = require('nib');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

//---打包平台
let platform = 'desktop';
if(process.argv.includes('--env.m')){
	platform = 'mobile';
};

//---入口文件
let entryFiles ={};
let src = path.resolve(__dirname,`./${platform}/components/`);

fs.readdirSync(src).forEach(item=>{
	let target = path.resolve(__dirname,`./${platform}/components/${item}`);
	if(item =="public") return;  //--公用组件文件不解析
	if(fs.readdirSync(target).includes('main.js')){
		entryFiles[item] = `./${platform}/components/${item}/main.js`;
	};
});

entryFiles['vendor'] = ['axios','vue','vue-router','vuex'];  //---提取公用js文件

//--开始配置
module.exports = {
	entry : entryFiles,
	output: { //---文件输出
		filename:'[name].js',
		path: path.resolve(__dirname,`../server/platform/${platform}/dist/`)
	},
	watchOptions:{
	  ignored: ["desktop"].includes(platform) ? "mobile" : "desktop" ,//不监测
	},
	plugins:[
		new CopyWebpackPlugin([  //---拷贝静态文件
			{from : "./public/statics",to: path.resolve(__dirname,'../server/platform/public/statics/')},
			{from : `./${platform}/statics/`,to:"../statics/"},
			{from : `./${platform}/views/`,to:"../views/"},
		]),

		new webpack.LoaderOptionsPlugin({ //--配置babel
		    test: /\.vue$/,
		    babel: {
		      default: {
		        presets:["es2015","stage-3"]
		      },
		    },
		 }),
		new ExtractTextPlugin({  //--提取css到单独文件
				filename(getPath){
					return getPath("[name].css");
				},
				allChunks:true
		}),

		new webpack.LoaderOptionsPlugin({ //--配置stylus全局变量
		    test: /\.vue/,
		    stylus: {
		      default: {
		        use: [nib()],
		        import:[
		        	'~nib/lib/nib/index.styl',
		        	path.resolve(__dirname,`./public/theme/var.styl`),
		        ]
		      },
		    },
		 }),
		// //--压缩文件
		// new webpack.optimize.UglifyJsPlugin({
		// 	    warnings: false,
		// 	    compress: {
		// 	        join_vars: true,
		// 	        warnings: false,
		// 	    },
		// 	    toplevel: false,
		// 	    ie8: false,
		// }),
	],

	module:{ //--解析规则
		rules:[
			{
				test: /\.vue$/,
				use:[
					{
						loader:'vue-loader',
						options:{
							extractCSS: true,
						},
					}
				]
			},
			{
				test: /\.css$/,
				use:[
					{loader: 'style-loader'},
					{
						loader: 'css-loader',
						options:{modules:true, minimize:true}
					},
				],
			},
      {
        test: /\.js/,
        exclude: /node_modules/,
        loader: "babel-loader",
    	},
	    {
	      test: /\.styl/,
	      exclude: /node_modules/,
	      loader: "style-loader!css-loader!stylus-loader",
	    },
		]
	},

	resolve: { 
		alias: {
			'api' : path.resolve(__dirname,`./public/api/index.js`),
			'util' : path.resolve(__dirname,`./public/statics/js/util.js`),
			"temp" : path.resolve(__dirname,'./public/components/templates/index.vue')
		}
	}
}