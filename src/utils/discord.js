//-----------------------------------------------------------------------------
// Purpose: Discord API stuff
//-----------------------------------------------------------------------------

import { InteractionResponse } from "../components/embed";
import { InteractionErrorResponse } from "../components/error";

// Get display name (if available) or username
export function getDisplayName(user) {
  return `${user.global_name ?? user.username}`;
}

// Get avatar link from user
export function getAvatarUrl(user) {
  if (!user.avatar) {
    const defaultAvatarNumber = user.discriminator % 5;
    return `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
  }
  else {
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
  }
}

// Get user - hacky method for getting user-installable shit working without issues
export function getUser(interaction) {
  switch (interaction.context) {
    case 0: { // GUILD
      return interaction.member.user;
    }
    case 1: { // BOT_DM
      return interaction.user;
    }
    case 2: { // PRIVATE_CHANNEL
      return interaction.user;
    }
    default: {
      return InteractionErrorResponse.UnknownError();
    }
  }
}

// Get target user from user commands
export function getTargetUser(interaction) {
  if (interaction.data.type == 2) {
    return interaction.data.resolved.users[interaction.data.target_id];
  }
  else {
    return InteractionErrorResponse.UnknownError();
  }
}

// Returns the shop url for the server the command is executed in
export function getServerShopUrl(interaction) {
  // do a check to see if we are actually in a server or not, otherwise will throw error
  return `https://discord.com/channels/${interaction.guild.id}/shop`;
}

// Enum for getting the friendly name of context type
export const InteractionContextType = {
  0: "Guild Channel",
  1: "Bot DM",
  2: "Private Channel"
}

// Enum for getting the friendly name of command type
export const InteractionCommandType = {
  // doesn't start at 0 for some retarded reason
  1: "Chat Input",
  2: "User Command",
  3: "Message Command"
}

// Get the unix (seconds) timestamp of a snowflake id
export function snowflakeToTimestamp(snowflake) {
  const epoch = 1420070400000; // Discord epoch (2015-01-01)
  const snowflakeNum = Number(snowflake); // convert snowflake to number
  const timestamp = (snowflakeNum >> 22) + epoch; // get timestamp section of snowflake
  const timestampSeconds = Math.floor(timestamp / 1000); // convert dat bitch to seconds (from milliseconds)

  return timestampSeconds.toString();
}

export function dsgPostApiRequest(env, endpoint, body, ctx) {
  const rUrl = `https://discord.com/api${endpoint}`
  const rMeth = `POST`

  let request = fetch(`${rUrl}`, {
    method: `${rMeth}`,
    headers: {
      "Authorization": `Bot ${env.DISCORD_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: body
  }).then(result => result.json())
    .then(response => {
      return response;
    })
    .catch();

  return request;
}

// Broadcast global messages to the teapot server via webhooks:
export async function dsgBroadcastMessage(webhookUrl, message) {
  const payload = JSON.stringify({ content: message });

  try {
    const response = await fetch(`${webhookUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: payload,
    });

    if (response.ok) {
      console.log('Message sent successfully');
    } else {
      console.error('Error sending message:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

export async function dPostApiRequest(env, endpoint, requestBody) {
  try {
    const response = await fetch(`https://discord.com/api${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bot ${env.DISCORD_TOKEN}`
      },
      body: requestBody,
    });

    if (response.ok) {
      console.log('Message sent successfully');
    } else {
      console.error('Error sending message:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

export function isPremiumUser(interaction) {
  const SKUD_ID = `1282402647776821369`
  return interaction.entitlements[0] != null ? interaction.entitlements[0].sku_id == `${SKUD_ID}` : false;
  // shit way of doing it but it fucking works and i cant be fucked FUCK 
}
