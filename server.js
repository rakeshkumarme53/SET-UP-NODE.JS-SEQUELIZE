const db = require('./src/api/v1/models');
const app = require('./app');
const logger = require('./src/api/v1/middlewares/logger');

require('dotenv').config();

const PORT = process.env.PORT || 3000;

startServer();

function startServer() {
    db.sequelize.sync().then(() => {
        app.listen(PORT, () => {
            const startMessage = `Server ${process.pid} started on port ${PORT}`;
            console.log(startMessage);
            logger.info(startMessage);
        });
    });
}
