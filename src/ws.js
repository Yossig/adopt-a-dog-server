const WebScoket = require('ws');
class webSocket {

  constructor() {
    this.wss = new WebScoket.Server({port:3001})
    console.log("ws server running on port 3001")
  }

  broadcastDeletion(doc) {
    console.log("broadcasting")
    this.wss.clients.forEach(client=> {
      console.log("broadcast to user", doc)
      client.send(JSON.stringify(doc))
    })
  }
}

module.exports = new webSocket();