import * as debug from 'debug';
import client from '@/bot';

export const debugApp = debug('app');
export const prefix = process.env.PREFIX || '/';

function bootstrap() {
    return client.login(process.env.DISCORD_TOKEN);
}

bootstrap()
    .then(() => {
        debugApp('🚀 Server is running on discord');
    });
