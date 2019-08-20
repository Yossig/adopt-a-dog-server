const WebScoket = require('ws');
class webSocket {

  constructor() {
    this.wss = new WebScoket.Server({ port: 3001 })
    console.log("ws server running on port 3001")
  }

  broadcastDelete(doc) {
    this.wss.clients.forEach(client => {
      client.send(JSON.stringify({ action: 'dogRemoved', data: doc }))
    })
  }

  broadcastAdd(doc) {
    this.wss.clients.forEach(client => {
      client.send(JSON.stringify({ action: "dogAdded", data: doc }))
    })
  }

  broadcastUpdate(doc) {
    this.wss.clients.forEach(client => {
      client.send(JSON.stringify({ action: "dogUpdated", data: doc }))
    })
  }
}

module.exports = new webSocket();