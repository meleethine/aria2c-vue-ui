const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer:{
  open:true,//build自动打开浏览器
  host:'localhost',//默认lolaohost，也可0.0.0.0，这样同一网段的主机都能通过ip访问
  port:8088
 }
 
})
