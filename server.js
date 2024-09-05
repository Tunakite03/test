const server = require('./functions/api');
const port = process.env.PORT || 5000;

server.listen(port, () => console.log('> Server is up and running on port : ' + port));
