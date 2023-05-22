let express = require('express');
const path = require('path');

let app = express();
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.use(express.static(path.join(__dirname, 'public')));


const getCompletion = async (hashtag) => {
    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `Give me instagram hashtags for the keyword ${hashtag}`,
        temperature: 0.35,
        max_tokens: 150
    });
    return completion.data.choices[0].text;
};

function stripText(inputText) {
    return inputText.replace(/\W/g, '');
}



app.get('/gettags/:tag', async function (req, res) {
    let inputTag = req.params.tag;
    inputTag = stripText(inputTag);
    let output = await getCompletion(inputTag);

    res.send(output);
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});



app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
}
);
