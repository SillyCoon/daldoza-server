const ws = new require('ws');
const wss = new ws.Server({ noServer: true });
const http = require('http');

(function StartServer() {
    const clients = new Set();

    http.createServer((req, res) => {
        wss.handleUpgrade(req, req.socket, Buffer.alloc(0), onSocketConnect.bind({ clients }))
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
            handleMessage(message, this.clients, ws)
        });

        ws.on('close', () => {
            this.clients.delete(ws);
        })
    }
}

function handleMessage(message, clients, currentClient) {
    console.log(message);
    message = JSON.parse(message);
    if (message.type === 'order') {
        assignColorToOtherPlayerFor(currentClient);
    }
    clients.forEach(client => {
        if (client !== currentClient && client.readyState === ws.OPEN) {
            client.send(JSON.stringify({ type: 'command', value: message }));
        }
    });

    function assignColorToOtherPlayerFor(client) {
        let order;
        if (clients.size == 2) {
            order = 1;
        } else {
            order = 2;
        }
        client.send(JSON.stringify({ type: 'order', value: order}));
    }
}





