import bsky from '@atproto/api';
const { BskyAgent } = bsky;
import * as dotenv from 'dotenv';
import process from 'node:process';
import fs from 'node:fs';
dotenv.config();

const agent = new BskyAgent({
  service: 'https://bsky.social',
});

await agent.login({
  identifier: process.env.BSKY_USERNAME!,
  password: process.env.BSKY_PASSWORD!,
});

const lines = fs.readFileSync('songofsongs.txt', 'utf8').split('\n');
const already_tweeted = fs.readFileSync('tweeted.txt', 'utf8').split('\n');
let possible_output = lines.filter((line) => !already_tweeted.includes(line));
if (possible_output.length === 0) {
  fs.rmSync('tweeted.txt');
  possible_output = lines;
  fs.appendFileSync('tweeted.txt', '\n');
}
const post = possible_output[Math.floor(Math.random() * possible_output.length)];

console.log(post);
// await agent.post({
//   $type: 'app.bsky.feed.post',
//   text: post,
//   createdAt: new Date().toISOString(),
// });

fs.appendFileSync('tweeted.txt', post + '\n');