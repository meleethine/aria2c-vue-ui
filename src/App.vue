
<template>
  <div id="app">
    <div class="main">
      <div class="app-left">

          <!-- <el-select class="slc" v-model="selectedServer" placeholder="默认" @change="switchServer">
            <el-option class="opt" v-for="(server, idx) in servers" :key="idx" :label="server.name" :value="JSON.stringify(server)">
          
            </el-option>
          </el-select> -->
          <div class="switchBorad">
          <div class="avatar">
            <i class="el-icon-user-solid"></i>
          </div>
          <div class="switchWrapper">
            <select class="slc" v-model="selectedServer"  @change="switchServer">
              <option class="opt" v-for="(server, idx) in servers" :key="idx" :label="server.name" :value="JSON.stringify(server)">
                <!-- {{ `ws://${server.host}:${server.port}/jsonrpc` }} -->
              </option>
            </select>

          </div>
          </div>
          
        <div>
          <!-- <el-switch :width="Number(140)" :value="this.connectionStat == '已连接' ? true : false" disabled>
          </el-switch> -->

          <el-row class="tac">
            <el-col :span="30">
              <el-menu default-active="2" :router="true">
                <el-menu-item index="/">
                  <i class="el-icon-download"></i>
                  <span slot="title">正在下载
                    <el-tag type="info" size="mini">{{ -(-globalStat.numWaiting - globalStat.numActive) || 0 }}</el-tag>
                  </span>
                </el-menu-item>
                <el-menu-item index="/completed">
                  <i class="el-icon-circle-check"></i>
                  <span slot="title">已完成
                    <el-tag type="primary" size="mini">{{ +globalStat.numStopped || 0 }}</el-tag>
                  </span>
                </el-menu-item>
                <el-menu-item index="/settings">
                  <i class="el-icon-setting"></i>
                  <span slot="title">系统设置</span>
                </el-menu-item>
                <el-menu-item index="/servers">
                  <i class="el-icon-set-up"></i>
                  <span slot="title">服务器管理 <el-tag effect="dark"
                      :type="this.connectionStat == '已连接' ? '' : (this.connectionStat == '连接中' ? 'warning' : 'danger')">
                      {{
                          connectionStat
                      }}</el-tag></span>
                </el-menu-item>
              </el-menu>
            </el-col>
            <el-col :span="30">
            </el-col>
          </el-row>
        </div>


      </div>

      <div class="app-right">
        <div class="zoom">
            <el-button class="el-icon-rank" size="mini" @click="zoom"></el-button>
        </div>
        <div class="global-stat">
          <span></span>
          <el-tag effect="dark" size="small" class="tag" type="primary"><i class="el-icon-download"></i>
            下行 <span v-if="globalStat.downloadSpeed"> {{ ' '+getSpeed(globalStat.downloadSpeed)  }}</span>
          </el-tag>
          <span></span>
          <el-tag effect="dark" size="small" class="tag" type="warning"><i class="el-icon-upload2"></i>
            上行<span v-if="globalStat.uploadSpeed"> {{ ' '+getSpeed(globalStat.uploadSpeed)  }}</span>
          </el-tag>
        </div>
       
        <div class="new">

          <el-button @change="startBT"><label class="addNew"><input type="file" accept=".torrent" hidden
                @change="startBT">打开种子</label></el-button>
          <el-button @click="dialogFormVisible = true;">添加链接</el-button>
          <el-dialog title="添加下载链接" :visible.sync="dialogFormVisible">
            <el-form >
              <el-form-item>
                <el-input type="textarea" cols="25" rows="8" v-model="uris" placeholder="请用回车间隔多个下载任务"
                spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="dialogFormVisible = false; start()">开始下载</el-button>
            </div>
          </el-dialog>
        </div>
        <router-view :aria2="aria2" @servers-changed="servers = $event" />
       
      </div>
    </div>
  </div>
</template>
<script>
import Aria2Client from './aria2-client.js'

function getFileContent(file) {
  return new Promise((resolve, reject) => {
    let fr = new FileReader()
    fr.onload = function () {
      resolve(fr.result.split(',').at(-1))
    }
    fr.onerror = reject
    fr.readAsDataURL(file)
  })
}

export default {


  data() {
    var servers = JSON.parse(localStorage.getItem('aria2Servers'))
    var aria2 = new Aria2Client(servers[0])
    return {
      globalStat: {},
      servers: servers,
      selectedServer: '',
      connectionStat: '已连接',
      aria2: aria2,
      isCollapse: true,
      uris: '',
      dialogFormVisible: false
    }
  },
  methods: {
    zoom() {
      if (document.body.style.transform == 'scale(1)'||document.body.style.transform =='') {
        document.body.style.transform = 'scale(0.7)'
      } else {
        document.body.style.transform = 'scale(1)'
      }
    },
    statFun() {
      return this.connectionStat == '已连接' ? true : false
    },
    async switchServer() {
      console.log('this.selectedServer',this.selectedServer);
      let{ host, port } = JSON.parse(this.selectedServer)
      console.log('host', host);
      console.log('port', port);
      console.log('`${host}:${port}`', `${host}:${port}`);
      console.log('this.aria2.websocket.url',this.aria2.websocket.url);
      if (this.aria2.websocket.url.includes(`${host}:${port}`)) {
        return
      }
      
      this.aria2?.close()
      console.log('关闭旧服务器');
      this.globalStat = {}
      console.log('连接新服务器');
      this.connectionStat = '连接中'
      console.log('this.aria2', this.aria2);
      var aria2 = new Aria2Client(JSON.parse(this.selectedServer))
      if (aria2) {
        try {
          this.aria2 = aria2
          await this.aria2.ready()
          this.connectionStat = '已连接'
          this.intervalId = setInterval(async() => {
            this.globalStat=await this.aria2.getGlobalStat()
          },1000)
          // this.globalStat = await this.aria2.getGlobalStat()
          console.log('已连接');
          this.$router.push('/')
          
        } catch (e) {
          this.connectionStat = '连接失败'
          this.$alert('请修改后再次尝试', '参数错误', {
            confirmButtonText: '确定',
            callback: () => {
              this.$notify({
                title: '提示',
                message: '请在此页面修改',
              });
              this.$router.push('/servers')
            }
          })
          console.log('连接失败');
          throw e
        }
      }
    },
    getSpeed(speed) {
      if (speed / (1024 * 1024) >= 1024) {
        return (speed / (Math.pow(1024, 2))).toFixed(2) + 'G/s'
      } else if (speed / (1024 * 1024) >= 1.024 && speed / (1024 * 1024) < 1024) {
        return (speed / (Math.pow(1024, 2))).toFixed(2) + 'M/s'
      } else {
        return (speed / 1024).toFixed(2) + 'K/s'
      }
    },
    async startBT(e) {
      console.log('startBT');
      let file = e.target.files[0]
      let BTFileContent = await getFileContent(file)
      await this.aria2.addTorrent(BTFileContent)
      this.$router.push('/')
    },
    start() {
      // 不去前后空格可以识别,最后去一下
      var uris = this.uris.split('\n').map(it => it.trim()).filter(it => it)
      console.log('uris', uris)
      uris.forEach(async uri =>
        // 注意参数接数组形式的字符串,Array.from会把uri转成分割的数组
        await this.aria2.addUri([uri])
      )
      uris = ''
      console.log('uris',uris)
      this.$router.push('/')
    },
  },
  // created() {
  //   console.log('CQthis.selectedServer',this.selectedServer);
  //   console.log('CQthis.aria2',this.aria2);
  //   this.switchServer()
  //   console.log('CHthis.aria2', this.aria2);
  //   console.log('CHthis.selectedServer',this.selectedServer);


  // },


  async mounted() {
    // if (!localStorage.getItem('aria2Servers')) {
    //   localStorage.setItem('aria2Servers', JSON.stringify({'name':'默认','host':'localhost','port': '6800','secret': '999'}))
    // }
    if (this.aria2) {
      console.log('this.aria2', this.aria2);
      this.globalStat = await this.aria2.getGlobalStat()
      this.intervalId = setInterval(async () => {
        try {
          this.aria2.getGlobalStat && (this.globalStat = await this.aria2.getGlobalStat())
        } catch (e) {
          console.log('e', e);
          if (e == 'CONNECT_ERROR') {
            clearInterval(this.intervalId)
          } else {
            throw e
          }
        }
      }, 1000)
    }
  },
  beforeDestroy() {
    clearInterval(this.intervalId)
  }
}
</script>
<style lang="less">
  html,body{
    margin: 0;
    padding: 0;
    height: 100%;
    background-color: #C7EDCC;
    #app{
    margin: 0;
    padding: 0;
    height: 100%;
    background-color: #FFFFFF;
    border-radius: 5px;
    // background-color:#32373F;
    }
  }
.main {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  color: #2c3e50;
  height: 100%;

  font-size:xx-large;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

  .app-left {
    flex: none;
    padding: 30px;
    .switchBorad{
      padding-left: 20px;
      display: flex;
      .avatar{
        margin-top: 6px;
      }
      .switchWrapper{
        .slc{
          margin-left: 5px;
          width: 80px;
          height: 25px;

        }

      }
    }
    
    }

  }

  .app-right {
    flex: auto;
    padding: 30px;
    .zoom {
    float: right;
    .new{
      border:rgb(255, 255, 255)
    }
  }

  .el-dropdown {
    vertical-align: top;
  }

  .el-dropdown+.el-dropdown {
    margin-left: 15px;
  }

  .el-icon-arrow-down {
    font-size: 12px;
  }

  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }

  .global-stat {
    float: right;
    z-index: 50;
  }

  }

  


::-webkit-scrollbar {
  //滚动条宽高，如果不需要显示滚动条可设置宽高为0
  width: 0px;
  height: 0px;
}

::-webkit-scrollbar-thumb {
  //滚动条颜色和圆角
  background-color: #dbd9d9;
  border-radius: 3px;
}
</style>
  
  