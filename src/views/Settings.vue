<template>
  <div class="settings">
    <el-form ref="settings" :model="settings" :show-overflow-tooltip='true'>
      <el-form-item>
        <el-button @click="changeOption" type="primary" class="save">保存设置</el-button>


        <div v-for="(val, key) in settings" :key="key">
          <el-descriptions direction="right" :column="1" border class="detail">
            <el-descriptions-item :label="optDescs[key] || key">
              <div v-if="val === 'true' || val === 'false'">
                <el-radio-group v-model="settings[key]" :disabled="disabledList(key)">
                  <el-radio label="true">是</el-radio>
                  <el-radio label="false">否</el-radio>
                </el-radio-group>
              </div>
              <div v-else-if="/^[0-9]+$/.test(val)">
                <el-input-number v-model="settings[key]" :disabled="disabledList(key)"></el-input-number>
              </div>
              <div v-else>
                <el-input :value="val" style="width:300px" :disabled="disabledList(key)"/>
              </div>
            </el-descriptions-item>
          </el-descriptions>
        </div>
        <!-- <div v-for="(val, key) in settings" :key="key">
            <el-form-item :label="optDescs[key] || key">
              <div v-if="val === 'true' || val === 'false'">
                <el-radio-group v-model="settings[key]">
                  <el-radio label="true">是</el-radio>
                  <el-radio label="false">否</el-radio>
                </el-radio-group>
              </div>
              <div v-else-if="/^[0-9]+$/.test(val)">
                <el-input-number v-model="settings[key]"></el-input-number>
              </div>
              <div v-else>
                <el-input :value="val" style="width:300px" />
              </div>
            </el-form-item>
          </div> -->

      </el-form-item>

    </el-form>




    <el-backtop target=".settings" :visibility-height="10" :bottom="75" :right="65">
      <div class="back-top">
        UP
      </div>
    </el-backtop>
  </div>
</template>





<script>
const optDescs = {
  "dir": "下载路径",
  "log": "日志文件",
  "max-concurrent-downloads": "最大同时下载数",
  "check-integrity": "检查完整性",
  "continue": "断点续传",
  "all-proxy": "代理服务器",
  "all-proxy-user": "代理服务器用户名",
  "all-proxy-passwd": "代理服务器密码",
  "connect-timeout": "连接超时时间",
  "dry-run": "模拟运行",
  "lowest-speed-limit": "最小速度限制",
  "max-connection-per-server": "单服务器最大连接数",
  "max-file-not-found": "文件未找到重试次数",
  "max-tries": "最大尝试次数",
  "min-split-size": "最小文件分片大小",
  "netrc-path": ".netrc 文件路径",
  "no-netrc": "禁用 netrc",
  "no-proxy": "不使用代理服务器列表",
  "proxy-method": "代理服务器请求方法",
  "remote-time": "获取服务器文件时间",
  "reuse-uri": "URI 复用",
  "retry-wait": "重试等待时间",
  "server-stat-of": "服务器状态保存文件",
  "server-stat-timeout": "服务器状态超时",
  "split": "单任务连接数",
  "stream-piece-selector": "分片选择算法",
  "timeout": "超时时间",
  "uri-selector": "URI 选择算法",
  "check-certificate": "检查证书",
  "http-accept-gzip": "支持 GZip",
  "http-auth-challenge": "认证质询",
  "http-no-cache": "禁用缓存",
  "http-user": "HTTP 默认用户名",
  "http-passwd": "HTTP 默认密码",
  "http-proxy": "HTTP 代理服务器",
  "http-proxy-user": "HTTP 代理服务器用户名",
  "http-proxy-passwd": "HTTP 代理服务器密码",
  "https-proxy": "HTTPS 代理服务器",
  "https-proxy-user": "HTTPS 代理服务器用户名",
  "https-proxy-passwd": "HTTPS 代理服务器密码",
  "referer": "请求来源",
  "enable-http-keep-alive": "启用持久连接",
  "enable-http-pipelining": "启用 HTTP 管线化",
  "header": "自定义请求头",
  "save-cookies": "Cookies 保存路径",
  "use-head": "启用 HEAD 方法",
  "user-agent": "自定义 User Agent",
  "ftp-user": "FTP 默认用户名",
  "ftp-passwd": "FTP 默认密码",
  "ftp-pasv": "被动模式",
  "ftp-proxy": "FTP 代理服务器",
  "ftp-proxy-user": "FTP 代理服务器用户名",
  "ftp-proxy-passwd": "FTP 代理服务器密码",
  "ftp-type": "传输类型",
  "ftp-reuse-connection": "连接复用",
  "ssh-host-key-md": "SSH 公钥校验和",
  "bt-detach-seed-only": "分离仅做种任务",
  "bt-enable-hook-after-hash-check": "启用哈希检查完成事件",
  "bt-ebable-lpd": "启用本地节点发现 (LPD)",
  "bt-exclude-tracker": "BT 排除服务器地址",
  "bt-external-ip": "外部 IP 地址",
  "bt-force-encryption": "强制加密",
  "bt-hash-check-seed": "做种前检查文件哈希",
  "bt-load-saved-metadata": "加载已保存的元数据文件",
  "bt-max-open-files": "最多打开文件数",
  "bt-max-peers": "最大连接节点数",
  "bt-metadata-only": "仅下载种子文件",
  "bt-min-crypto-level": "最低加密级别",
  "bt-prioritize-piece": "优先下载",
  "bt-remove-unselected-file": "删除未选择的文件",
  "bt-require-crypto": "需要加密",
  "bt-request-peer-speed-limit": "期望下载速度",
  "bt-save-metadata": "保存种子文件",
  "bt-seed-unverified": "不检查已经下载的文件",
  "bt-stop-timeout": "无速度时自动停止时间",
  "bt-tracker": "BT 服务器地址",
  "bt-tracker-connect-timeout": "BT 服务器连接超时时间",
  "bt-tracker-interval": "BT 服务器连接间隔时间",
  "bt-tracker-timeout": "BT 服务器超时时间",
  "dht-file-path": "DHT (IPv4) 文件",
  "dht-file-path6": "DHT (IPv6) 文件",
  "dht-listen-port": "DHT 监听端口",
  "dht-message-timeout": "DHT 消息超时时间",
  "enable-dht": "启用 DHT (IPv4)",
  "enable-dht6": "启用 DHT (IPv6)",
  "enable-peer-exchange": "启用节点交换",
  "follow-torrent": "下载种子中的文件",
  "listen-port": "监听端口",
  "max-overall-upload-limit": "全局最大上传速度",
  "max-upload-limit": "最大上传速度",
  "peer-id-prefix": "节点 ID 前缀",
  "peer-agent": "Peer Agent",
  "seed-ratio": "最小分享率",
  "seed-time": "最小做种时间",
  "follow-metalink": "下载 Metalink 中的文件",
  "metalink-base-uri": "基础 URI",
  "metalink-language": "语言",
  "metalink-location": "首选服务器位置",
  "metalink-os": "操作系统",
  "metalink-version": "版本号",
  "metalink-preferred-protocol": "首选使用协议",
  "metalink-enable-unique-protocol": "仅使用唯一协议",
  "enable-rpc": "启用 JSON-RPC/XML-RPC 服务器",
  "pause-metadata": "种子文件下载完后暂停",
  "rpc-allow-origin-all": "接受所有远程请求",
  "rpc-listen-all": "在所有网卡上监听",
  "rpc-listen-port": "监听端口",
  "rpc-max-request-size": "最大请求大小",
  "rpc-save-upload-metadata": "保存上传的种子文件",
  "rpc-secure": "启用 SSL/TLS",
  "allow-overwrite": "允许覆盖",
  "allow-piece-length-change": "允许分片大小变化",
  "always-resume": "始终断点续传",
  "async-dns": "异步 DNS",
  "auto-file-renaming": "文件自动重命名",
  "auto-save-interval": "自动保存间隔",
  "conditional-get": "条件下载",
  "conf-path": "配置文件路径",
  "console-log-level": "控制台日志级别",
  "content-disposition-default-utf8": "使用 UTF-8 处理 Content-Disposition",
  "daemon": "启用后台进程",
  "deferred-input": "延迟加载",
  "disable-ipv6": "禁用 IPv6",
  "disk-cache": "磁盘缓存",
  "download-result": "下载结果",
  "dscp": "DSCP",
  "rlimit-nofile": "最多打开的文件描述符",
  "enable-color": "终端输出使用颜色",
  "enable-mmap": "启用 MMap",
  "event-poll": "事件轮询方法",
  "file-allocation": "文件分配方法",
  "force-save": "强制保存",
  "save-not-found": "保存未找到的文件",
  "hash-check-only": "仅哈希检查",
  "human-readable": "控制台可读输出",
  "keep-unfinished-download-result": "保留未完成的任务",
  "max-download-result": "最多下载结果",
  "max-mmap-limit": "MMap 最大限制",
  "max-resume-failure-tries": "最大断点续传尝试次数",
  "min-tls-version": "最低 TLS 版本",
  "log-level": "日志级别",
  "optimize-concurrent-downloads": "优化并发下载",
  "piece-length": "文件分片大小",
  "show-console-readout": "显示控制台输出",
  "summary-interval": "下载摘要输出间隔",
  "max-overall-download-limit": "全局最大下载速度",
  "max-download-limit": "最大下载速度",
  "no-conf": "禁用配置文件",
  "no-file-allocation-limit": "文件分配限制",
  "parameterized-uri": "启用参数化 URI 支持",
  "quiet": "禁用控制台输出",
  "realtime-chunk-checksum": "实时数据块验证",
  "remove-control-file": "删除控制文件",
  "save-session": "状态保存文件",
  "save-session-interval": "保存状态间隔",
  "socket-recv-buffer-size": "Socket 接收缓冲区大小",
  "stop": "自动关闭时间",
  "truncate-console-readout": "缩短控制台输出内容",
}
export default {
  name: "Settings",
  data() {
    return {
      radio: '',
      settings: null,
      optDescs: optDescs
    };
  },
  props: ['aria2'],
  methods: {
    disabledList(item) {
      const list = ["bt-max-open-files","download-result",
        "keep-unfinished-download-result","log",
        "log-level",
        "max-concurrent-downloads","max-download-result",
        "max-overall-download-limit",
        "max-overall-upload-limit",
        "optimize-concurrent-downloads","save-cookies",
        "save-session","server-stat-of",
      ]
      if (list.includes(item)) {
        return false
      } else
      return true
    },
    async changeOption() {
      console.log('this.settings', this.settings);
      await this.aria2.changeGlobalOption(this.settings)
        this.$message({
          message: '保存设置成功',
          type: 'success'
        })
        // 有些选项修改不成,故再获取一下设置
        this.settings = await this.aria2.getGlobalOption()
        this.$message({
          message: '修改失败,请稍后再试',
          type: 'info'
        })
    }
  },
  async mounted() {
    this.settings = await this.aria2.getGlobalOption()
  },
  beforeDestroy() {
  },
  components: {},
};
</script>
<style lang="less" scoped>
.settings {
  height: 90%;
  overflow: scroll;

  .save {
    position: -webkit-sticky;
    position: sticky;
    top: 5px;
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