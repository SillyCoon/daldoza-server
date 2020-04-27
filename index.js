const ws = new require('ws');
const wss = new ws.Server({ noServer: true });
const http = require('http');

(function StartServer() {
    const clients = new Set();

    http.createServer((req, res) => {
        wss.handleUpgrade(req, req.socket, Buffer.alloc(0), onSocketConnect.bind({clients}))
    }).listen(8000, () => {
        console.log('listen: 8000');
    });

})()

function onSocketConnect(ws) {
    if (this.clients.size > 2) {
        ws.send('Too many man');
        ws.terminate();
    } else {
        this.clients.add(ws);
        ws.on('message', (message) => {
            handleMessage(message, this.clients)
        });

        ws.on('close', () => {
            clients.delete(ws);
        })
    }
}

function handleMessage(message, clients) {
    console.log(message);
    clients.forEach(client => {
        if (client !== ws && client.readyState === ws.OPEN) {
            client.send(message);
        }
    });
}





