<template>
	<div class="regieter-app">
		<pv-page class="page1">
			<header>
				<h1 class="logo"><a href="/">悦诗阁</a></h1>
				<p><a href="/user/login">登陆</a></p>
			</header>
		</pv-page>

		<pv-page class="page2">
			<article class="is-body">
				<section>
					<h3>创建账户</h3>
					<ul>
						<li>
							<input v-model.trim="username.value" placeholder="笔名" @blur="blur('username')">
							<a :class="{'is-active': username.error}">
								{{username.text}} <i class="iconfont icongantanhao-yuankuang"></i>
							</a>
						</li>
						<li>
							<input v-model.trim="phone.value" placeholder="手机号" @blur="blur('phone')" >
							<a :class="{'is-active': phone.error}">
								{{phone.text}} <i class="iconfont icongantanhao-yuankuang"></i>
							</a>
						</li>
						<li style="padding-top:5px">
							<input v-model.trim="code.value" placeholder="请输入手机验证码" @blur="blur('code')">
							<a style="top:-13px" :class="{'is-active': code.error}">
								{{code.text}} <i class="iconfont icongantanhao-yuankuang"></i>
							</a>
							<p class="send_code" @click="getCode">
								<template v-if="code.time>0">{{code.time}}s</template>
								<template v-else>发送验证码</template>
							</p>
						</li>
						<li>
							<input v-model.trim="password.value" placeholder="密码（英文或数字，不少于6位" @blur="blur('password')">
							<a :class="{'is-active': password.error}">
								{{password.text}} <i class="iconfont icongantanhao-yuankuang"></i>
							</a>
						</li>
					</ul>
					<p class="trembox">
						<time :class="{'is-active' : isAgreeTerm}" @click="isAgreeTerm=!isAgreeTerm">
							<i class="iconfont iconcomplete-o"></i>
						</time>
						<span>
							我已阅读并接受<a href="/copyright" target="_blank">《版权声明》</a>和<a href="/privacy" target="_blank">《隐私保护》</a></span>
					</p>
					<div class='btnbox'>
						<a :class="{'is-disabled': !isValid}" @click="submit">
							{{loading.register ? "正在注册......" : "注册"}}
						</a>
					</div>
					<p class="hasbox">已有账户，<a href="/user/login">马上登陆</a></p>
				</section>				
			</article>
		</pv-page>	
	</div>
</template>

<script>

	import util from "util";
	import api from "api";
	
	export default {
		data(){
			return {
				username:{
					value: "",
					error: false,
					text: "",
				},

				phone: {
					value: "",
					error: false,
					text: "",					
				},

				password:{
					value: "",
					error: false,
					text: "",
				},

				code: {
					value: "",
					error: false,
					text: "",
					id: "",
					time: "0",
				},
				isAgreeTerm: false,
				loading:{
					register: false,
				}
			}
		},

		methods:{
			submit(){  //---提交
				if(!this.isValid || this.loading.register) return;
				if(!this.isAgreeTerm){
					return this.$toast("请阅读并同意《版权说明》和《隐私保护》");
				};				
				var data = this.getValues();
				this.loading.register = true;
				api.customer.register(data).then(result=>{
					var url = window.query.target || "/account";  //--注册成功后的网址
					document.location.href = url;
					this.$toast("注册成功","success");

				}).catch(err=>{
					this.loading.register = false;
					this.$toast(err.message);
				})
			},
			getCode(){ 
				if(this.code.time>0) return;
				if(this.phone.value && !this.phone.error){ //--手机值存在，没有错误
					api.customer.getCode(this.phone.value).then(res=>{
						Object.assign(this.code,{
							id: res._id,
							time: "60"
						});
						this.startTime();
					}).catch(err=>{
						this.$toast(err.message);
					})
				}else{
					this.phone.error || this.blur("phone");  //---错误不存在，则执行校验手机号
				}
			},

			getValues(){
				return {
					username: this.username.value,
					phone : this.phone.value,
					code: this.code.value,
					code_id: this.code.id,
					password: this.password.value,
					type: "register",
				}
			},

			blur(key){
				let {isPhone, isPassword,isCode} = util.patterns;
				if(this.isEmpty(key)) return;  //--空回去
				switch(key){
					case "password":  //--密码
						var data = isPassword(this.password.value) 
													? {error: false, text: ""} 
													: {error: true, text: "密码格式不正确"}
						Object.assign(this.password, data);
						break;
					case "phone":  //--手机
						if(isPhone(this.phone.value)){ //--手机格式正确
							api.customer.findByPhone(this.phone.value).then(res=>{ //---检测手机是否注册
								var data = res._id ? {error: true, text: "手机已注册"} : {error: false, text: ""};
								Object.assign(this.phone, data) ;
							}).catch(err=>{ //--请求错误
							 	Object.assign(this.phone, {error: false, text: ""})
							});
						}else{
							Object.assign(this.phone, {error: true, text: "手机号不正确"})			
						}
						break;
					case "code":
						var data = isCode(this.code.value)? {error: false, text: ""} : {error: true, text: "验证码不正确"}
						Object.assign(this.code, data);
						break;
				}
			},

			isEmpty(key){  //--检验是否为空
				var data = this[key] || {};
				const TEXTS = {
					"username" : "请输入笔名",
					"phone" : "请输入手机号",
					"code" : "请输入验证码",
					"password" : "请输入密码"
				}

				if(data.value.length==0){
				 	data.error = true;
				 	data.text = TEXTS[key]
				}else{
				 	data.error = false;
				 	data.text = ""							
				};
				return data.error;
			},

			startTime(){ //---code倒计时
				this.timer = setInterval(function (){
					if(this.code.time==0){
						this.stopTime();
					}else{
						this.code.time--;
					}
				}.bind(this),1000)
			},

			stopTime(){
				clearInterval(this.timer);
				this.timer = null;
			}
		},

		computed:{
			isValid(){
				var keys=['username','phone','code','password'];
				var isok = true;
				keys.forEach(key=>{
					var data = this[key];
					if(data.error || !data.value){  //--错误存在或者值不存在
						isok = false;
					}
				});
				return isok
			}
		}
	}

</script>

<style lang="stylus"> 
	@import "../public/layout.styl"
</style>
<style lang="stylus" scoped="">
.regieter-app
	width 100%
	min-height 100%
	background $color-primary		
	.page1
		header
			display flex
			width 100%
			height $height-header
			align-items center
			justify-content space-between
			color $color-white
			a
				color inherit
				&:hover
					text-decoration underline
	.page2
		.is-body
			display flex
			width 100%
			justify-content center
			padding-top 50px
			section
				padding 30px 60px
				width 460px
				background $color-white
				border-radius 5px
				box-shadow 0 0 30px rgba(0,0,0,.1)
				li
					padding-bottom 16px
					position relative
					input
						width 100%
						border none
						border-bottom 1px solid #e5e5e5
						padding 5px 0px
						font-size 14px
						outline none
					a
						position absolute
						top 0px
						right 0px
						color $color-danger
						font-size 12px
						display none
						&.is-active
							display block
					p.send_code
						position absolute
						right 0px
						bottom 21px
						color #9e9e9e
						transition 125ms
						cursor pointer
						&:hover
							color $color-primary
			h3
				text-align center
				padding-bottom 15px
				font-size 18px
				color $color-primary
			.trembox
				color #cacaca
				display flex
				align-items center
				time
					display inline-flex
					width 16px
					height 16px
					border-radius 2px
					align-items center
					justify-content center
					margin-right 5px
					background #cacaca
					cursor pointer
					&.is-active
						background $color-primary
						color #fff
						i
							opacity 1
					i
						font-size 12px
						opacity 0
				a
					color #9e9e9e
					transition 125ms
					&:hover
						color $color-primary
			.btnbox
				padding 20px 0px
				a
					display flex
					width 100%
					background $color-primary
					height 50px
					color $color-white
					font-size 16px
					text-decoration none
					border-radius 3px
					align-items center
					justify-content center
					cursor pointer
					&.is-disabled
						background #e5e5e5
						color #aaa
			.hasbox
				color #cacaca
				text-align center
				a
					color $color-primary
					&:hover
						text-decoration underline
						
					
					

				
				
			

	
	
</style>