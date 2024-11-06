// Helpers for the bot itself

import { EmbedColor } from "../components/embed";
import { getDisplayName } from "./discord";

// Internal epoch generator for SXAPIv2 sub-systems
export function generateSnowflake() {
  const epoch = 1602558000000; // Internal Epoch: 13 October 2020 03:00:00 (GMT)
  const timestamp = BigInt(Date.now() - epoch);
  const workerId = BigInt(Math.floor(Math.random() * 31));
  const processId = BigInt(Math.floor(Math.random() * 31));
  const sequence = BigInt(Math.floor(Math.random() * 4095));

  const snowflake =
    (timestamp << 22n) |
    (workerId << 17n) |
    (processId << 12n) |
    sequence;

  return snowflake.toString();
}

export async function isValidEmail(email) {
  var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(email.toLowerCase());
}

export async function isValidCPUKey(cpukey) {
  return cpukey.match(/^[a-fA-F0-9]{32}$/);
}

// this one is broken
export async function isValidToken(token) {
  return token.match(/[A-Za-z0-9]{6}-[A-Za-z0-9]{6}-[A-Za-z0-9]{6}$/);
}

// ==========================================================
// Database Stuff
// ==========================================================
export async function tpSetUserInfo(env, user, email) {
  const result = env.database.prepare(`REPLACE INTO teapot_users (username, id, timestamp, email) VALUES (?1, ?2, ?3, ?4)`).bind(`${getDisplayName(user)}`, user.id, new Date().toISOString(), email).run();
  return result;
}

// previously: getTeapotUser
export async function tpGetUserInfo(env, user) {
  const stmt = env.database.prepare(`SELECT * FROM teapot_users WHERE id = ?1`).bind(user.id);
  const { results } = await stmt.all();

  if (results[0] != undefined) {
    return results[0];
  }
  else {
    return false;
  }
}

export async function tpGetUserEmail(env, email) {
  const stmt = env.database.prepare(`SELECT * FROM teapot_users WHERE email = ?1`).bind(email);
  const { results } = await stmt.all();

  if (results[0] != undefined) {
    return results[0];
  }
  else {
    return false;
  }
}

export async function tpSetUserPerksCooldown(env, user, value) {
  const result = env.database.prepare(`UPDATE teapot_users SET mtx1_claim_next = ?1 WHERE id = ?2`).bind(value, user.id).run();
  return result;
}

export async function tpSetUserPrivacySetting(env, user, value) {
  const result = env.database.prepare(`UPDATE teapot_users SET public = ?1 WHERE id = ?2`).bind(value, user.id).run();
  return result;
}

export function tpApiRequest(env, action, email, extra = `extra=false`, ctx) {
  const rUrl = env.TEAPOT_API_URL
  const rMeth = "POST"

  let request = fetch(`${rUrl}`, {
    method: `${rMeth}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: `action=${action}&email=${email}&key=${env.TEAPOT_API_KEY}&${extra}`
  }).then(result => result.json())
    .then(response => {
      return response;
    })
    .catch();

  return request;
}

// get years since unix timestamp (we use this for tenure checking badges)
// howManyYearsSinceUnixTimestamp(123446547);
function howManyYearsSinceUnixTimestamp(unixSeconds) {
  // Convert Unix seconds to milliseconds
  const dateMilliseconds = unixSeconds * 1000;
  const date = new Date(dateMilliseconds);

  // Get the current date
  const now = new Date();

  // Calculate the difference in years
  let years = now.getFullYear() - date.getFullYear();

  // Adjust if the current date is before the date in the year
  const monthDiff = now.getMonth() - date.getMonth();
  const dayDiff = now.getDate() - date.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    years--;
  }

  return years;
}

export const TeapotTokenStatus = {
  TOKEN_REDEEMED: -1,
  TOKEN_INVALID: 2,
  TOKEN_DEVKIT: 3
}

export function getCurrentTimeUnix() {
  return Math.floor(Date.now() / 1000)
}

export function getTimeOneMonthFromNowUnix() {
  const currentUnixSeconds = Math.floor(Date.now() / 1000);// current unix timestamp
  const currentDate = new Date(currentUnixSeconds * 1000); // convert to ms
  currentDate.setMonth(currentDate.getMonth() + 1);// add month to time
  const oneMonthLaterUnixSeconds = Math.floor(currentDate.getTime() / 1000);// get new date ts

  return oneMonthLaterUnixSeconds;
}

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
