<template>
  <div class="completed">
    <div v-if="!this.tasks[0]">
      <el-empty description="没有下载完成的任务"></el-empty>
    </div>
    <div v-if="visibleTasks.length||this.tasks[0]">
      <el-table :data="visibleTasks" height="450" style="width: 100%">

        <el-table-column label="文件名" :formatter="getFilename" >
        </el-table-column>
        <el-table-column label="完成度" :formatter="getPercent">
        </el-table-column>
        <el-table-column label="状态" :formatter="getStat">
        </el-table-column>
        <el-table-column align="center">
          <template slot="header" slot-scope="scope">
            <span class="header">
              <el-button type="info" size='small' @click="clearMemory">清空</el-button>
              <el-input v-model="searchText" size="small" placeholder="搜索" />
            </span>
          </template>
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="removeStoppd(scope.row)">删除记录</el-button>
            <el-button class="reDL" size="mini" type="primary" @click="reStart(scope.row)">重新下载</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-backtop target=".completed" :visibility-height="10" :bottom="75" :right="65">
      <div class="back-top">
        UP
      </div>
    </el-backtop>
  </div>
</template>
<script>
export default {
  name: "Completed",
  props: ['aria2'],
  data() {
    return {
      tasks: [],
      searchText: ''
    };
  },
  computed: {
    visibleTasks() {
      if (this.searchText == '') {
        return this.tasks
      } else {
        return this.tasks.filter(it =>
          it.files[0].path.toLowerCase().split('/').at(-1).includes(this.searchText.toLowerCase())
        )
      }
    }
  },
  methods: {
    async reStart(task) {
      try {
        this.$confirm('此操作将删除该任务, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let uri = task.files[0].uris[0]?.uri
          console.log('uri', uri);

          if (uri) {
            await this.aria2.addUri([uri])
            await this.aria2['removeDownloadResult'](task.gid)
          }
          this.$message({
            type: 'success',
            message: '已重新添加下载任务!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      } catch (e) {
        this.$alert(e.message)
      }
      this.updateList()

    },
    async removeStoppd(task) {
      try {
        this.$confirm('此操作将删除该任务, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.aria2['removeDownloadResult'](task.gid)
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

      } catch (e) {
        this.$alert(e.message)
      }
      this.updateList()
    },
    clearMemory() {
      try {
        this.$confirm('此操作将清除所有任务, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'danger'
        }).then(async () => {
          await this.aria2.purgeDownloadResult()
          this.$message({
            type: 'success',
            message: '清除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消清除'
          });
        });

      } catch (e) {
        this.$alert(e.message)
      }
      this.updateList()
    },
    selectAll(tasks) {
      if (tasks.length == this.selected.length) {
        this.selected = []
      } else {
        tasks.forEach(
          task => {
            if (!this.selected.includes(task.gid)) {
              this.selected.push(task.gid)
            }
          }
        )
      }
    },
    async clearMemory() {
      await this.aria2.purgeDownloadResult()
    },
    toggleSelect(task) {
      if (this.selected.includes(task.gid)) {
        this.selected.splice(this.selected.indexOf(task.gid), 1)
      } else {
        this.selected.push(task.gid)
      }
    },
    getFilename(task) {
      if (task.files?.[0].path) {
        return task.files[0].path.split('/').at(-1)
      } else {
        // 注意即便是读[]属性也要?.
        return task.files?.[0]?.uri?.split('/').at(-1) ?? '未知'
      }
      // return path.split('/').at(-1)
      /* let parts=path.split('/')
      return parts[parts.length-1] */
    },
    getPercent(task) {
      if (task.completedLength == 0) {
        return '0%'
      } else {
        return ((task.completedLength / task.totalLength) * 100).toFixed(2) + '%'
      }
    },
    getSpeed(task) {
      let speed = task.downloadSpeed
      if (speed / (1024 * 1024) >= 1024) {
        return (speed / ((Math.pow(1024, 2))).toFixed(2) + 'G/s')
      } else if (speed / (1024 * 1024) >= 1.024 && speed / (1024 * 1024) < 1024) {
        return (speed / (Math.pow(1024, 2))).toFixed(2) + 'M/s'
      } else {
        return (speed / 1024).toFixed(2) + 'K/s'
      }
    },
    getStat(task) {
      return task.status == 'complete' ? '已完成' : '已中止'
    },
    async updateList() {
      try {
        this.tasks = [...await this.aria2.tellStopped(0, 100)]
      } catch (e) {
        this.tasks = []

        throw e
      }
    },
  },
  async mounted() {
    console.log('this', this);
    this.tasks = await this.aria2.tellStopped(0, 1000);
    this.intervalId = setInterval(async () => {
      this.tasks = await this.aria2.tellStopped(0, 1000);
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.intervalId);
  },
  components: {},
};
</script>
<style lang="less" scoped>
.completed {
  height: 90%;
  overflow: scroll;

  .header {
    display: flex;
  }

  .reDL {
    margin-right: 10px;
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