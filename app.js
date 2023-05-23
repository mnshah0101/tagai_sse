let express = require('express');
const path = require('path');

let app = express();
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

app.use(express.static(path.join(__dirname, 'public')));

function stripText(inputText) {
    return inputText.replace(/\W/g, '');
}

app.get('/gettags/:tag', function (req, res) {
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    let inputTag = req.params.tag;
    inputTag = stripText(inputTag);

    const response = openai.createCompletion({
        model: "text-davinci-003",
        prompt: `Give me instagram hashtags for the keyword ${inputTag}`,
        temperature: 0.35,
        max_tokens: 150,
        stream: true
    }, { responseType: 'stream' });

    response.then(resp => {
        resp.data.on('data', data => {
            const lines = data.toString().split('\n').filter(line => line.trim() !== '');
            for (const line of lines) {
                const message = line.replace(/^data: /, '');
                if (message === '[DONE]') {

                    res.write(`data: ${message}\n\n`)

                    return res.end();


                }
                else {
                    const parsed = JSON.parse(message);
                    res.write(`data: ${parsed.choices[0].text}\n\n`)
                }
            }
        });

    })


});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});



app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
}
);