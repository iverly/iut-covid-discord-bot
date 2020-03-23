const debug = require('debug')('discord');
const bot = require('./src/bot');

async function bootstrap() {
    return bot.login(process.env.DISCORD_TOKEN);
}

bootstrap()
    .then(() => debug(`🚀 Server listening on discord`))
    .catch(err => {
        debug('❌ Unable to run the server because of the following error:');
        debug(err);
        process.exit(1);
    });