const WebScoket = require('ws');
class webSocket {

  constructor() {
    this.wss = new WebScoket.Server({ port: 3001 })
    console.log("ws server running on port 3001")
  }

  broadcastDeletion(doc) {
    this.wss.clients.forEach(client => {
      client.send(JSON.stringify({ action: 'dogRemoved', data: doc }))
    })
  }

  broadcastAddition(doc) {
    this.wss.clients.forEach(client => {
      client.send(JSON.stringify({ action: "dogAdded", data: doc }))
    })
  }
}

module.exports = new webSocket();