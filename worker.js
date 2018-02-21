const http = require('http');

process.on('message', (req, socket) => {
    const res = new http.ServerResponse(req);
    res._finish = function _finish() {
        res.emit('prefinish');
        socket.end();
    };
    res.assignSocket(socket);
    socket.once('close', () => {
        process.send('done', () => {
            process.exit(0);
        });
    });
    res.end(process.pid.toString());
});

process.send('ready');
