const WebScoket = require('ws');
const parser = require('ua-parser-js');
const statisticsCtrl = require('./statistics/statistics.controller')

class webSocket {

  constructor() {
    this.wss = new WebScoket.Server({ port: 3001 })
    console.log("ws server running on port 3001")

    this.wss.on('connection', async (ws, request) => {
      await statisticsCtrl.clientConnected({
        ip: request.connection.remoteAddress,
        userAgent: parser(request.headers['user-agent'])
      });

      this.broadcastNumberOfConnectedClients(statisticsCtrl.getNumberOfConnectedClients());

      ws.on('close', ws => {
        statisticsCtrl.clientDisconnected()
        this.broadcastNumberOfConnectedClients(statisticsCtrl.getNumberOfConnectedClients());
      })
    })
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

  broadcastNumberOfConnectedClients(count) {
    console.log(count);
    this.wss.clients.forEach(client => {
      client.send(JSON.stringify({ action: "NumberOfConnectedClientsChanged", data: count }))
    })
  }
}

module.exports = new webSocket();