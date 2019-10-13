
const FONT_CACHE = [];  //---加载字体缓存库；

export default {
	loadFont(fontname,fontfile){  //---加载字体，fontname字体名字, fontfile为字体文件地址,force强制重新获取
		let el = document.querySelector("head");
		let style = document.querySelector("style#fonts");
		let text = `@font-face{ font-family: ${fontname};src: url('${fontfile}')}`;

		if(FONT_CACHE.includes(fontfile)) return;  //---已存在；

		if(!style){  //---不存在，创建style
			style = document.createElement("style");
			style.setAttribute("id","fonts");  //---fonts样式 
			el.appendChild(style);
		};

		let origin = style.innerHTML || "";
		style.innerHTML = origin + text;

		FONT_CACHE.push(fontfile);
	},

	patterns:{  //--正则检测
		isPhone(phone){ //---手机检测
			let rex = /^[1][3-9]\d{9}$/;
			return rex.test(phone);
		},

		isCode(code){ //---验证码检测
			let rex = /^[0-9]{4}$/;
			return rex.test(code);
		},

		isChinese(name){ //---是否中文，用户名需要用中文,2到10位
			let rex =/[^(/u4e00)\-(/u9fa5)]/
			return rex.test(name)
		},

		isPassword(text){ //---检验密码是否符合要求，
			let rex = /\w{6,100}/gi;
			return rex.test(text)
		}
	},
}

