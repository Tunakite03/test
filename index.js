const server = require('./src/index');
const port = process.env.PORT || 5000;

server.listen(port, () => console.log('> Server is up and running on port : ' + port));
process.on('SIGINT', () => {
   server.close(() => {
      console.log('Exist Server');
      // notify.send(ping...)
   });
});
