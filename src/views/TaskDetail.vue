
<template>
  <div class="taskDetail">
   <!--  <dl v-if="task">
      <dt>任务名称</dt>
      <dd>{{ getFilename(task) }}</dd>
      <dt>任务大小</dt>
      <dd>{{ getFilesize(task) }}</dd>
      <dt>任务状态</dt>
      <dd>{{ getFileStatus(task) }}</dd>
      <dt>进度</dt>
      <dd>{{ getPercent(task) }}</dd>
      <dt>下载地址</dt>
      <dd>{{ getUris(task) }}</dd>
      <dt>文件列表</dt>
      <dd v-for="file of task.files" :key="file.path">{{ file.path }}</dd>
      <dt>区块信息</dt>
      <dd>
        <span v-for="i of Number(task.numPieces)" :key="i" class="piece" :class="{ completed: task.bitfield[i - 1] }">
        </span>
      </dd>
    </dl> -->


    <el-descriptions  direction="vertical" :column="2" border class="detail">
      <el-descriptions-item label="任务名称" >{{ getFilename(task) }}</el-descriptions-item>
      <el-descriptions-item label="任务大小">{{ getFilesize(task) }}</el-descriptions-item>
      <el-descriptions-item label="任务状态">{{ getFileStatus(task) }}</el-descriptions-item>
      <el-descriptions-item label="完成进度">{{ getPercent(task) }}</el-descriptions-item>
      <el-descriptions-item label="下载地址" >{{ getUris(task) }}</el-descriptions-item>
      <el-descriptions-item label="文件列表">
        <ul class="list">
          <li v-for="file of task.files" :key="file.path"  >{{ file.path }}
          </li>
        </ul>
      </el-descriptions-item>
      <el-descriptions-item label="区块信息">
        <span v-for="i of Number(task.numPieces)" :key="i" class="piece" :class="{ completed: task.bitfield[i - 1] }">
        </span>
      </el-descriptions-item>
    </el-descriptions>



  </div>
</template>
<script>
export default {
  name: "TaskDetail",
  data() {
    return {
      task: '',
    };
  },
  props: ['aria2'],
  methods: {
    getFilename(task) {
      return task?.files[0].path.split('/').at(-1)
    },
    getFilesize(task) {
      if (task.totalLength / (1024 * 1024) >= 1024) {
        return (task.totalLength / (Math.pow(1024, 3))).toFixed(2) + 'G'
      } else if (task.totalLength / (1024 * 1024) >= 1.024 && task.totalLength / (1024 * 1024) < 1024) {
        return (task.totalLength / (Math.pow(1024, 2))).toFixed(2) + 'M'
      } else {
        return (task.totalLength / 1024).toFixed(2) + 'K'
      }

    },
    getFileStatus(task) {
      if (task.status == 'active') {
        return '正常'
      }
      if (task.status == 'paused') {
        return '暂停'
      }
      if (task.status == 'stopped') {
        return '终止'
      }
    },
    getPercent(task) {
      if (task.completedLength == 0) {
        return '0%'
      } else {
        return ((task.completedLength / task.totalLength) * 100).toFixed(2) + '%'
      }
    },
    getUris(task) {
      let uris = task.files[0].uris
      return uris[0]?.uri || 'BT Download Tasks'
    }
  },
  async mounted() {
    this.task = await this.aria2.tellStatus(this.$route.params.gid)
  },
  beforeDestroy() {
  },
  components: {},
};
</script>
<style lang="less" scoped>
  .taskDetail{
    height: 95%;
    overflow: scroll;
  }
  .detail{
   
    .list{
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .piece {
      width: 8px;
      height: 8px;
      margin: 1px;
      display: inline-block;
      border-radius: 50%;
      background-color: grey;
      display: inline-block;
    
      &.completed {
        background-color: green;
        display: inline-block;
      }

  }
  
  }
  </style>