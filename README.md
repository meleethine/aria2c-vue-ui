# 前言

1、aria2是一个无页面的轻量级命令下载工具。本项目将其可视化，可以在页面中交互，实现下载任务的增删改查及系统设置等功能。

2、由于项目中需要频繁获取数据，通过合理使用Promise请求数据，提高了代码的可读性和简洁度。

3、下载的过程涉及多个状态，因此采用模块化开发，降低了代码的耦合性，并且更易于维护。

4、使用WebSocket双向通信，数据轻量，节省性能，通信效率较高。


# 技术栈

vue2 + vue-router + webpack + ES6


# 项目运行

```
前端部分:

git clone https://github.com/meleethine/aria2c-vue-ui.git

或者

git clone git@github.com:meleethine/aria2c-vue-ui.git  

cd aria2c-vue-ui

npm install

npm run serve

后端部分:

cd aria2c

./aria2c.exe --conf-path=./aria2c.conf

```


# API文档

https://aria2.github.io/manual/en/html/index.html


# 目标功能
- [x] 添加BT任务 -- 完成
- [x] 添加链接任务 -- 完成
- [x] 删除任务 -- 完成
- [x] 开始任务 -- 完成
- [x] 暂停任务 -- 完成
- [x] 全选/反选 -- 完成
- [x] 搜索任务 -- 完成
- [x] 重下任务 -- 完成
- [x] 清除配置 -- 完成
- [x] 修改设置-- 完成
- [x] 添加服务器-- 完成
- [x] 修改服务器 -- 完成
- [x] 移除服务器 -- 完成
- [x] 切换服务器 -- 完成
- [x] 缩放/还原界面 -- 完成


# 项目截图

### 主页面

<img src="https://github.com/meleethine/aria2/blob/main/screenshots/home.gif" width="720" height="405"/> 

### 添加任务

<img src="https://github.com/meleethine/aria2/blob/main/screenshots/add.gif" width="720" height="405" object-fit:contain/> 

### 查询任务

<img src="https://github.com/meleethine/aria2/blob/main/screenshots/query.gif" width="720" height="405" object-fit:contain/> 

### 删除任务

<img src="https://github.com/meleethine/aria2/blob/main/screenshots/remove.gif" width="720" height="405" object-fit:contain/> 

### 清空任务

<img src="https://github.com/meleethine/aria2/blob/main/screenshots/clean.gif" width="720" height="405" object-fit:contain/> 

### 重下任务

<img src="https://github.com/meleethine/aria2/blob/main/screenshots/reAdd.gif" width="720" height="405" object-fit:contain/> 

### 修改配置

<img src="https://github.com/meleethine/aria2/blob/main/screenshots/setting.gif" width="720" height="405" object-fit:contain/> 

### 修改/删除服务器

<img src="https://github.com/meleethine/aria2/blob/main/screenshots/removeServer.gif" width="720" height="405" object-fit:contain/> 

### 切换服务器

<img src="https://github.com/meleethine/aria2/blob/main/screenshots/changeServer.gif" width="720" height="405" object-fit:contain/> 

<img src="https://github.com/meleethine/aria2/blob/main/screenshots/changeServer2.gif" width="720" height="405" object-fit:contain/> 









