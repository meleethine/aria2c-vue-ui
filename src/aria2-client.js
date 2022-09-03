class Aria2Client {
  constructor(options) {
    this.options = options;
    this.websocket = new WebSocket(
      `ws://${options.host}:${options.port}/jsonrpc`
    );
    // 解决websocket还没准备好就调用出的问题
    this.connectPromise = new Promise((resolve,reject) => {
      this.websocket.addEventListener('open', () => {
        resolve()
      })
      this.websocket.addEventListener('error', (e) => {
        reject('CONNECT_ERROR')
      })
    })

    this.lastId = 1;

    this.callbacks = {}; // 存放每个请求的回调函数

    this.websocket.addEventListener("message", (e) => {
      var data = JSON.parse(e.data);
      var callback = this.callbacks[data.id];
      delete this.callbacks[data.id];
      if (typeof callback == "function") {
        callback(data);
      }
    });
  }
  ready() {
    return this.connectPromise
  }
  close() {
    this.websocket.close()
    return new Promise(resolve => {
      this.websocket.addEventListener('close', () => {
        resolve()
      })
    })
  }

}

[
  "addUri",
  "addTorrent",
  "getPeers",
  "addMetalink",
  "remove",
  "pause",
  "forcePause",
  "pauseAll",
  "forcePauseAll",
  "unpause",
  "unpauseAll",
  "forceRemove",
  "changePosition",
  "tellStatus",
  "getUris",
  "getFiles",
  "getServers",
  "tellActive",
  "tellWaiting",
  "tellStopped",
  "getOption",
  "changeUri",
  "changeOption",
  "getGlobalOption",
  "changeGlobalOption",
  "purgeDownloadResult",
  "removeDownloadResult",
  "getVersion",
  "getSessionInfo",
  "shutdown",
  "forceShutdown",
  "getGlobalStat",
  "saveSession",
].forEach((methodName) => {
  Aria2Client.prototype[methodName] = function (...args) {
    return this.connectPromise.then(() => {
      return new Promise((resolve, reject) => {
        var id = this.lastId++;
        this.callbacks[id] = function (data) {
          if (data.error) {
            reject(data.error);
          } else {
            resolve(data.result);
          }
        };
        this.websocket.send(
          JSON.stringify({
            jsonrpc: "2.0",
            id: id,
            method: `aria2.${methodName}`,
            params: [`token:${this.options.secret}`, ...args],
          })
        );
      });
    }
    )
  };

  Aria2Client.prototype[methodName + 'post'] = function (...args) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest()
      xhr.open('post', 'http://127.0.0.1:6800/jsonrpc')
      xhr.setRequestHeader('content-type', 'application/json')
      xhr.onload = function () {
        var data=JSON.parse(xhr.responseText)
        if (data.error) {
          reject(data.error)
        } else {
          resolve(data.result)
        }
      }
      xhr.send(JSON.stringify({
        jsonrpc: '2.0', 
        id: this.lastId++,
        method: `aria2.${methodName}`,//注意这里方法没有调用不要加()
        params: ['token:999',...args]
      }))
    })
  }


});

export default Aria2Client;
