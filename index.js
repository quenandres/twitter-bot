const dev_client  = require("./client/dev_client");
const user_client = require("./client/user_client");
require('dotenv').config();

const { ETwitterStreamEvent } = require('twitter-api-v2');

async function main() {
    // user
    const user = await user_client.v2.me();
    let user_id = process.env.USER_ID;

    // Reglas o filtro del strema
    const rules = await dev_client.v2.streamRules();

    // Eliminar reglas
    /* await dev_client.v2.updateStreamRules({
        delete: { ids: rules.data.map(rule => rule.id) }
    }); */

    // Agregar reglas
    /* await dev_client.v2.updateStreamRules({
        add: [{ value: 'Nodejs'}, {value: 'Nestjs'}, {value: 'Nextjs'}, {value: 'Reactjs'}]
    }); */

    const stream = dev_client.v2.searchStream({
        'tweet.fields': ['referenced_tweets', 'author_id']
    });

    (await stream).on(ETwitterStreamEvent.Data, async tweet => {
        const {data:{
            text,
            author_id,
            id
        }} = tweet;
        console.log(`${id}`);
        await user_client.v2.like(user_id, id);
        //await user_client.v1.reply(`I like this`, id);
    });
}

main();