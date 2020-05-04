const ws = new require('ws');
const http = require('http');
const express = require('express');
const app = express();

const server = http.createServer(app);
const wss = new ws.Server({ server });
const clients = new Set();

wss.on('connection', onSocketConnect.bind({clients}));


server.listen(8000, () => {
    console.log(`listen: ${server.address().port}`);
});

app.get('/health', (req, res) => {
    res.send('OK');
});


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





