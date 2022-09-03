<template>
  <div class="downloading">
      <div v-if="visibleTasks.length||this.tasks[0]" class="header">
        <el-button type="primary" @click="selectAll(tasks)" class="topBtn">全选</el-button>
        <el-button @click="execSelected('unpause')" class="topBtn">开始</el-button>
        <el-button @click="execSelected('pause')" class="topBtn">暂停</el-button>
        <el-button @click="execSelected('remove')" class="topBtn">删除</el-button>
        <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="searchText" size="medium">
        </el-input>
      </div>
      <div v-if="!visibleTasks.length">
        <el-empty description="没有正在下载中的任务"></el-empty>
      </div>

    <el-form>
      <el-form-item>
        <ul>
          <li v-for="task of visibleTasks" :key="task.gid" @click="toggleSelect(task)">
            <input type="checkbox" :checked="selected.includes(task.gid)">
            <i class="el-icon-document"></i>
            {{ getFilename(task) }}
            <el-button type="text" icon="el-icon-info" @click.stop="goDetail(task)">详情</el-button>
            <el-progress :text-inside="true" :width="Number(20)" :stroke-width="20" stroke-linecap="square"
              :percentage="Number(getPercent(task))"></el-progress>
          </li>
        </ul>

      </el-form-item>
    </el-form>
    <el-backtop target=".downloading" :visibility-height="10" :bottom="75" :right="65">
      <div class="back-top">
        UP
      </div>
    </el-backtop>
  </div>

</template>

<script>
export default {
  name: "Downloading",
  props: ['aria2'],
  data() {
    return {
      tasks: [],
      selected: [],
      searchText: '',
      multipleSelection: []
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
    toggleSelection(rows) {
      console.log('111');
      if (rows) {
        console.log('this.$refs.multipleTable', this.$refs.multipleTable);
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        console.log('222');
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    async execSelected(action) {
      let selectedTasks = this.tasks.filter(task =>
        this.selected.includes(task.gid)
      )
      for (let task of selectedTasks) {
        try {
          // 避免重复操作报错
          if (action == 'unpause' && task.status == 'active') {
            continue
          }
          if (action == 'pause' && task.status == 'paused') {
            continue
          }
          await this.aria2[action](task.gid)
        } catch (e) {
          this.$alert(e.message)
        }
      }
      this.updateList()
    },
    selectAll() {
      if (this.tasks.length == this.selected.length) {
        this.selected = []
      } else {
        this.tasks.forEach(
          task => {
            if (!this.selected.includes(task.gid)) {
              this.selected.push(task.gid)
            }
          }
        )
      }
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
        return 0
      } else {
        return ((task.completedLength / task.totalLength) * 100).toFixed(2)
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
    getStatus(task) {
      return task.status
    },
    async updateList() {
      try {
        this.aria2 && (this.tasks = [...await this.aria2.tellActive(), ...await this.aria2.tellWaiting(0, 100)])
      } catch (e) {
        this.tasks = []

        throw e
      }
    },
    goDetail(task) {
      this.$router.push('/task/' + task.gid)
    },

  },
  mounted() {
    this.updateList()
    this.intervalId = setInterval(async () => {
      try {
        this.updateList()
      } catch (e) {
        console.log('e', e);
        if (e == 'CONNECT_ERROR') {
          clearInterval(this.intervalId)
        } else {
          throw e
        }
      }
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.intervalId);
  },
  components: {},
};
</script>
<style lang="less" scoped>
  .downloading {
    overflow:scroll;
    height: 90%;
      .header{
        background-color: rgb(255, 255, 255);
        position: sticky;
        top: 0;
        z-index: 2;
        .topBtn{
          margin: 0;
        }
      }
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }
  
    li {
      cursor: pointer;
      font-size: large;
      box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  
      &:hover {
        background-color: #eee;
      }
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