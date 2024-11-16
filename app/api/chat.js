const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { message } = req.body;
        const response = await openai.createChatCompletion({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: '',
                },
                {
                    role: 'user',
                    content: message,
                },
            ],
        });

        res.status(200).json({ response });
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}