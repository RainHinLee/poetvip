<template>
	<div class="regieter-app">
		<pv-page class="page1">
			<header>
				<h1 class="logo"><a href="/">悦诗阁</a></h1>
				<p><a href="/user/register">注册</a></p>
			</header>
		</pv-page>

		<pv-page class="page2">
			<article class="is-body">
				<section>
					<h3>登录</h3>
					<p class="typebox">
						<a><span :class="{'is-active':type=='password'}" @click="type='password'">密码登录</span></a>
						<a><span :class="{'is-active':type=='phone'}" @click="type='phone'">短信登录</span></a>
					</p>
					<ul>
						<li>
							<input v-model.trim="phone.value" placeholder="手机号" @blur="blur('phone')" >
							<a :class="{'is-active': phone.error}">
								{{phone.text}} <i class="iconfont icongantanhao-yuankuang"></i>
							</a>
						</li>
						<li style="padding-top:5px" v-if="type=='phone'">
							<input v-model.trim="code.value" placeholder="请输入手机验证码" @blur="blur('code')">
							<a style="top:-13px" :class="{'is-active': code.error}">
								{{code.text}} <i class="iconfont icongantanhao-yuankuang"></i>
							</a>
							<p class="send_code" @click="getCode">
								<template v-if="code.time>0">{{code.time}}s</template>
								<template v-else>发送验证码</template>
							</p>
						</li>
						<li v-if="type=='password'">
							<input v-model.trim="password.value" placeholder="密码（英文或数字，不少于6位" @blur="blur('password')">
							<a :class="{'is-active': password.error}">
								{{password.text}} <i class="iconfont icongantanhao-yuankuang"></i>
							</a>
						</li>
					</ul>
					<div class='btnbox'>
						<a :class="{'is-disabled': !isValid}" @click="submit">
							{{loading.login ? "正在登录......" : "登录"}}
						</a>
					</div>
					<p class="hasbox">
						<a href="/user/register">账号注册</a>
						<a href="/user/forget-password">忘记密码?</a>
					</p>					
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
				type: "password",
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

				loading:{
					login: false,
				}
			}
		},

		methods:{
			submit(){  //---提交
				if(!this.isValid || this.loading.login) return;
				var data = this.getValues();
				this.loading.login = true;
				api.customer.login(data).then(result=>{
					var url = window.query.target || "/account";  //--注册成功后的网址
					document.location.href = url;

				}).catch(err=>{
					this.loading.login = false;
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
				if(this.type=="password"){
					return {
						phone : this.phone.value,
						password: this.password.value,
					}
				}else{
					return {
						phone : this.phone.value,
						code: this.code.value,
						code_id: this.code.id,
					}
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
							Object.assign(this.phone, {error: false, text: ""})
						}else{
							Object.assign(this.phone, {error: true, text: "手机号不正确"})	
						}
						break;
					case "code":
						if(this.code.id){
							var data = isCode(this.code.value)? {error: false, text: ""}: {error: true, text: "验证码不正确"}
							Object.assign(this.code, data);							
						}else{
							Object.assign(this.code, {error:true, text:"验证码未获取"});		
						}
						break;
				}
			},

			isEmpty(key){  //--检验是否为空
				var data = this[key] || {};
				const TEXTS = {
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
				var keys=this.type=="password" ? ['phone','password'] :  ['phone','code'];
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
				h3
					text-align center
					padding-bottom 15px
					font-size 18px
					color $color-primary
				.typebox
					display flex
					padding-bottom 25px
					a
						flex 1
						text-align center
						color #cacaca
						transition 125ms
						span
							cursor pointer
							&.is-active
								color $color-primary				
				li
					padding-bottom 20px
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
			.btnbox
				padding-top 10px
				padding-bottom 20px
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
				display flex
				padding-bottom 20px
				justify-content space-between
				a
					color $color-font
					&:hover
						color $color-primary
						
					
					

				
				
			

	
	
</style>