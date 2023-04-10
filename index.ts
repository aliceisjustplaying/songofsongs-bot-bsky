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
const alreadyPosted = fs.readFileSync('posted.txt', 'utf8').split('\n');
let possibleOutput = lines.filter((line) => !alreadyPosted.includes(line));
if (possibleOutput.length === 0) {
  fs.rmSync('posted.txt');
  possibleOutput = lines;
  fs.appendFileSync('posted.txt', '\n');
}
const post = possibleOutput[Math.floor(Math.random() * possibleOutput.length)];

await agent.post({
  $type: 'app.bsky.feed.post',
  text: post,
  createdAt: new Date().toISOString(),
});

fs.appendFileSync('posted.txt', post + '\n');
