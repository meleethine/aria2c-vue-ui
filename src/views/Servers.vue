<template>
  <div class="servers">
    <el-button type="primary" size="medium" @click="dialogFormVisible = true; editIdx = -1" class="addNew">添加新服务器
    </el-button>
    <div v-if="!servers.length">
      <el-empty description="没有设置服务器参数"></el-empty>
    </div>
    <el-dialog title="添加服务器" :visible.sync="dialogFormVisible" >
      <el-form :model="newServer">
        <el-form-item label="名称" label-width="100px">
          <el-input v-model="newServer.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="域名" label-width="100px">
          <el-input v-model="newServer.host" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="端口号" label-width="100px">
          <el-input-number v-model="newServer.port" :min="1" :max="65535"></el-input-number>
        </el-form-item>
        <el-form-item label="密码" label-width="100px">
          <el-input type="password" v-model="newServer.secret" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false; addServer()">确 定</el-button>
      </div>
    </el-dialog>

    <el-table :data="servers"  style="width: 100%"  height="450">

      <el-table-column prop="name" label="名称">
      </el-table-column>
      <el-table-column prop="host" label="域名">
      </el-table-column>
      <el-table-column prop="port" label="端口号">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click.native.prevent="editServer(scope.$index)" type="text" size="small"
            :disabled="servers.length == 1">
            修改
          </el-button>
          <el-button @click.native.prevent="removeServer(scope.$index)" type="text" size="small"
            :disabled="servers.length == 1">
            移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-backtop target=".servers" :visibility-height="10" :bottom="75" :right="65">
      <div class="back-top">
        UP
      </div>
    </el-backtop>


  </div>
</template>
<script>
export default {
  name: "Servers",
  data() {
    let servers = JSON.parse(localStorage.getItem('aria2Servers'))
    console.log('1servers', servers);
    return {
      servers: servers,
      dialogFormVisible: false,
      newServer: { name: '', host: 'localhost', port: '6800', secret: '' },
      editIdx: -1
    };
  },
  watch: {
    servers(servers) {
      console.log('servers in servers', servers);
      localStorage.setItem('aria2Servers', JSON.stringify(servers))
      this.$emit('servers-changed', this.servers)
    }
  },
  methods: {
    getSecret(idx) {
      return Array(servers.secret.length).fill('*').join('')
    },
    getServerName(idx) {
      if (idx == 0) {
        return '本地默认'
      } else {
        return `自定义(${idx})`
      }
    },
    addServer() {
      if (this.editIdx == -1) {
        this.servers.push(this.newServer)
        this.newServer = {
          name: '',
          host: 'localhost',
          port: 6800,
          secret: ''
        }
      } else {
        this.servers.splice(this.editIdx, 1, this.newServer)
        this.newServer = {
          name: '',
          host: 'localhost',
          port: 6800,
          secret: ''
        }
      }
    },
    editServer(idx) {
      this.dialogFormVisible = true
      this.editIdx = idx
      Object.assign(this.newServer, this.servers[idx])
    },
    removeServer(idx) {
      this.$confirm('此操作将删除该服务器, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.servers.splice(idx, 1)
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  },
  mounted() {
  },
  beforeDestroy() {
  },
  components: {},
};
</script>
<style lang="less" scoped>
.servers {
  height: 90%;
  overflow: scroll;

  .addNew {
    position: sticky;
    top: 7px;
    z-index: 5;
  }

  .back-top {
    height: 100%;
    width: 100%;
    background-color: #f2f5f6;
    box-shadow: 0 0 6px rgba(0, 0, 0, .12);
    text-align: center;
    line-height: 40px;
    color: #1989fa;
  }
}
</style>