import express from 'express';

interface ContosoUserConfigModel {
    emoji: string;
}

interface UserConfigRequestBody {
    Emoji: string;
}

export default function createUserConfigRouter() {
    const userStore = new Map<string, ContosoUserConfigModel>();

    const router = express.Router();

    router.post('/:userId', async (req, res) => {
        const userId = req.params['userId'];
        const body = req.body as UserConfigRequestBody;

        userStore.set(userId, { emoji: body.Emoji });

        return res.sendStatus(200);
    });

    router.get('/:userId', async (req, res) => {
        const userId = req.params['userId'];

        const user = userStore.get(userId);
        if (user === undefined) {
            return res.sendStatus(404);
        }

        return res.status(200).send(user);
    });

    return router;
}