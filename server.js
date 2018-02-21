const http = require('http');
const { fork } = require('child_process');

const server = http.createServer((req, res) => {
    const workerProcess = fork('worker.js', [], {execArgv: []});
    workerProcess.on('message', (status) => {
        switch (status) {
            case 'ready':
                workerProcess.send(
                    {
                        method: req.method,
                        headers: req.headers,
                        path: req.path,
                        httpVersionMajor: req.httpVersionMajor,
                        query: req.query,
                    },
                    res.socket
                    // { keepOpen: true }
                );
                break;

            case 'done':
                res.socket.end();
        }
    });
});

server.listen(8080);

setInterval(() => {
  console.log(process.memoryUsage());
}, 10000);
