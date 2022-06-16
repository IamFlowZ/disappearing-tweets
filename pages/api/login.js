import { Client, auth } from "twitter-api-sdk";

const STATE = 'my-state';

let authClient = null;
let authUrl = null;

export default async function handler(req, res) {
  console.log(req.method);
  if (Object.keys(req.query).length === 0) {
    authClient = new auth.OAuth2User({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      callback: "http://localhost:3000/api/login",
      scopes: ["tweet.read", "tweet.write", "users.read"],
    });
    let authUrl = authClient.generateAuthURL({
      state: STATE,
      code_challenge_method: "s256",
    });
    res.redirect(authUrl);
  } else if (Object.keys(req.query).includes('code')) {
    const { code, state } = req.query;
    if (state !== STATE) return res.status(500).send("State isn't matching");
    await authClient.requestAccessToken(code);
    const client = new Client(authClient);
    console.log(authClient.token);
    const tweets = await client.tweets.findTweetById("20");
    console.log(tweets);
    res.redirect(`/?token=${authClient.token.access_token}&expires_at=${authClient.token.expires_at}`);
  }
}
