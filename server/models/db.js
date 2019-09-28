
//---mongodb数据库操作
const mongoose = require("mongoose");
const path = "mongodb://localhost:27010/peotvip";

mongoose.set('useFindAndModify', false);
mongoose.set("useUnifiedTopology", true);

mongoose.connect(path,{useNewUrlParser: true, useCreateIndex: true}).then(res=>{
	console.log("connect mongodb://localhost:27010/peotvip success");
}).catch(err=>{
	console.log(err.message)
});



module.exports = mongoose;


