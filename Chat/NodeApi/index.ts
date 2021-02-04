import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';

import createUserConfigRouter from './routes/userConfig';
import createChatThreadRouter from './routes/chatThread';
import createTokenRouter from './routes/token';
import { extractApiChatGatewayUrl } from './utils';

const [
    acsConnectionString,
] = [
    'ACS_CONNECTION_STRING',
].map(envKey => {
    const envValue = process.env[envKey];
    if (envValue === undefined) {
        console.error(`Environment variable not found: ${envKey}`);
        process.exit(1);
    }
    return envValue;
});

const chatGatewayUrl = extractApiChatGatewayUrl(acsConnectionString);

const app = express();
app.use(express.json())
const PORT = 5000;

app.get('/getEnvironmentUrl', async (req, res) => {
    res.status(200).send(chatGatewayUrl);
});

app.use('/token', createTokenRouter(acsConnectionString));
app.use('/userConfig', createUserConfigRouter());
app.use('/thread', createChatThreadRouter(acsConnectionString))

app.listen(PORT, () => {
    console.log(`[server]: Server is running at https://localhost:${PORT}`);
});
