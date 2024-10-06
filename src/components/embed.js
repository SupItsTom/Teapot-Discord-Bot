/*****************************************************************************
**							  	  Includes									                            **
*****************************************************************************/
import { InteractionResponseFlags, InteractionResponseType } from "discord-interactions";
import { JsonResponse } from "../utils/network";
import { getProfileBadges } from "./badges";
import { numberWithCommas } from "../utils/client";
import { getTargetUser, getUser } from "../utils/discord";

/*****************************************************************************
**							  Public Classes								                            **
*****************************************************************************/

export class InteractionResponse {
  /******************************************************************/
  /*                                                                */
  /*                                                                */
  /******************************************************************/

  static TeapotProfileOnboarding(username) {
    return new JsonResponse({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: null,
        embeds: [
          {
            description: `## Welcome to Teapot Bot!\nSince this is your first time using the bot,\nyou will need to connect your Teapot Account.\n\nClick the button below to continue.`,
            color: EmbedColor.COLOR_DEFAULT
          }
        ],
        components: [
          {
            type: 1,
            components: [
              {
                type: 2,
                style: 2,
                label: "Continue",
                custom_id: `btn_profile_link`,
                disabled: false
              }
            ]
          },
        ],
        flags: InteractionResponseFlags.EPHEMERAL
      },
    })
  }

  /******************************************************************/
  /*                                                                */
  /*                                                                */
  /******************************************************************/

  static TeapotProfileCard(env, interaction, teapot, teapot_kv, _tpGetUserInfo) {
    const user = interaction.data.type == 2 ? getTargetUser(interaction) : getUser(interaction);

    let _userWithBadges = getProfileBadges(interaction, teapot) + `<@${user.id}>`;
    let _username = `\`${teapot.acc.name}\``
    let _lastSeen = `-# ${teapot.acc.online == true ? `**${teapot.acc.title.name === "None Set" ? "Currently Online" : `Playing ${teapot.acc.title.name}`}**` : `**Last Seen <t:${teapot.acc.date_lastseen_unix}:R>${teapot.acc.title.name === "None Set" ? "" : ` on ${teapot.acc.title.name}`}**`}`;
    let _gamertag = `**Gamertag:** \`${teapot.acc.gamertag == null ? "Not Signed In" : `${teapot.acc.gamertag}`}\``;
    let _consoleId = `**CPU Key:** ${_tpGetUserInfo.public == true ? `\`••••${teapot.acc.cpukey.slice(-4)}\`` : `\`${teapot.acc.cpukey}\``}`;
    let _challenges = `**Challenges:** \`${teapot.acc.xke_count}\``;
    let _userSince = `**Registered:** <t:${teapot.acc.date_registered_unix}:d>`;
    let _timeLeft = `**Time Left:** \`${teapot.acc.timeleft.lifetime == true ? `Lifetime` : `${teapot.acc.timeleft.current_day}d ${teapot.acc.timeleft.timeleft}\`\n- **Reserved:** \`${teapot.acc.timeleft.banked.days}d`}\``;
    let _kvTime = `**KV Life:** \`${teapot_kv.time == "" ? "None Set" : `${teapot_kv.time}`}\``;

    let _botUserSince = `${_tpGetUserInfo.timestamp == null ? `` : `**Connected:** <t:${Math.floor(new Date(_tpGetUserInfo.timestamp) / 1000 )}:d>`}`;

    let _accountEmail = `${_tpGetUserInfo.public == true ? ``: `\n**Email:** \`${_tpGetUserInfo.email}\``}`;

    let _privacyNote = `-# Only you can see this because your account is set to private.`;
    let _privacyNotePublicTemp = ``;

    let _envBuildInformation = env.BUILD_TYPE == "staging" ? `Test Mode active for Teapot Bot - Shoot for the stars!` : null;

    // BUG: privacy note appears on targetted users too, giving the user incorrect information about their profile being private when checking a public one

    let _privacyFlag = `${_tpGetUserInfo.public == true ? 0 : 64}`;

    return new JsonResponse({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: null,
        embeds: [
          {
            author: {
              name: _envBuildInformation,
            },
            description: `## ${_userWithBadges} ${_username}\n${_lastSeen}\n\n${_gamertag}\n${_consoleId}\n${_challenges}\n${_userSince}\n${_botUserSince}\n\n${_timeLeft}\n${_kvTime}`,
            color: EmbedColor.COLOR_DEFAULT,
            thumbnail: {
              url: `http://avatar.xboxlive.com/avatar/${encodeURIComponent(teapot.acc.gamertag.trim())}/avatarpic-l.png`
            },
          }
        ],
        // components: [
        //   {
        //     type: 1,
        //     components: [
        //       {
        //         type: 2,
        //         style: 6,
        //         sku_id: '1282402647776821369',
        //       }
        //     ]
        //   },
        // ],
        flags: _privacyFlag
      },
    })
  }

  /******************************************************************/
  /*                                                                */
  /*                                                                */
  /******************************************************************/

  static TeapotProfileLinked(email) {
    return new JsonResponse({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: null,
        embeds: [
          {
            description: `## ${email}\nConnected your **Teapot** account to **Discord**!\n\n-# Customize your profile with the </settings:1279910985267806270> command!`,
            color: EmbedColor.COLOR_DEFAULT
          }
        ],
        components: [
          {
            type: 1,
            components: [
              {
                type: 2,
                style: 1,
                label: "Profile",
                custom_id: `btn_profile`,
                disabled: false
              }
            ]
          },
        ],
        flags: InteractionResponseFlags.EPHEMERAL
      },
    })
  }

  /******************************************************************/
  /*                                                                */
  /*                                                                */
  /******************************************************************/

  static TeapotProfileSettingsUpdatePrivacy(env, interaction, teapot, privacyValue) {
    const user = interaction.data.type == 2 ? getTargetUser(interaction) : getUser(interaction);
    let _userWithBadges = getProfileBadges(interaction, teapot) + `<@${user.id}>`;
    let _username = `\`${teapot.acc.name}\``
    let _lastSeen = `-# ${teapot.acc.online == true ? `**${teapot.acc.title.name === "None Set" ? "Currently Online" : `Playing ${teapot.acc.title.name}`}**` : `**Last Seen <t:${teapot.acc.date_lastseen_unix}:R>${teapot.acc.title.name === "None Set" ? "" : ` on ${teapot.acc.title.name}`}**`}`;

    let _userSettingsHeader = `${privacyValue == true ? `
      Public Profile` : `
      Private Profile`}`
    let _userSettingsPrivateProfile = `${privacyValue == true ? `
      Your profile has been set to public. This means anyone on Discord can see your Teapot profile card.` : `
      Your profile has been set to private. This means nobody can see your profile,\nand when you run the </profile:1203990974896934934> command, it will only be visible to you.`}`

    let _envBuildInformation = env.BUILD_TYPE == "staging" ? `Test Mode active for Teapot Bot - Shoot for the stars!` : null;

    return new JsonResponse({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: null,
        embeds: [
          {
            author: {
              name: _envBuildInformation,
            },
            description: `## ${_userWithBadges} ${_username}\n${_lastSeen}\n## ${_userSettingsHeader}\n${_userSettingsPrivateProfile}`,
            color: EmbedColor.COLOR_DEFAULT,
            thumbnail: {
              url: `http://avatar.xboxlive.com/avatar/${encodeURIComponent(teapot.acc.gamertag.trim())}/avatarpic-l.png`
            }
          }
        ],
        flags: InteractionResponseFlags.EPHEMERAL
      },
    })
  }
  /******************************************************************/
  /*                                                                */
  /*                                                                */
  /******************************************************************/

  static TeapotSkidQuote(env, quote) {
    let _quoteTitle = `${quote.name}`;
    let _quoteCreationDate = `-# **Posted on <t:${quote.date}:D>**`;
    let _quoteText = `${quote.quote}`;

    let _envBuildInformation = env.BUILD_TYPE == "staging" ? `Test Mode active for Teapot Bot - Shoot for the stars!` : null;

    return new JsonResponse({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: null,
        embeds: [
          {
            author: {
              name: _envBuildInformation,
            },
            description: `## ${_quoteTitle}\n${_quoteCreationDate}\n\n>>> ${_quoteText}`,
            color: EmbedColor.COLOR_DEFAULT,
          }
        ],
        //flags: InteractionResponseFlags.EPHEMERAL
      },
    })
  }

  /******************************************************************/
  /* New Quote System                                               */
  /* Running on the SX Database                                     */
  /******************************************************************/

  static TeapotQuote(env, quote) {
    let _quoteTitle = `${quote.name}`;
    let _quoteCreationDate = `-# Posted on <t:${quote.date}:D>`;
    let _quoteText = `${quote.quote}`;

    const BetaSubText = `[<:BetaIconL:1280206493651828816><:BetaIconC:1280206502052888649><:BetaIconR:1280206510202556529>](https://supitstom.net/teapot/bot#badges)`

    let _envBuildInformation = env.BUILD_TYPE == "staging" ? `Test Mode active for Teapot Bot - Shoot for the stars!` : null;

    return new JsonResponse({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: null,
        embeds: [
          {
            author: {
              name: _envBuildInformation,
            },
            description: `## ${BetaSubText} ${_quoteTitle}\n${_quoteCreationDate}\n\n>>> ${_quoteText}`,
            color: EmbedColor.COLOR_DEFAULT,
          }
        ],
        //flags: InteractionResponseFlags.EPHEMERAL
      },
    })
  }

  /******************************************************************/
  /*                                                                */
  /*                                                                */
  /******************************************************************/

  // todo: change emojis to app emojis
  static TeapotStatus(env, _tpUserCount) {
    let _title = `About`;
    let _lastUpdate = `-# **Last updated <t:${Math.floor(Date.now() / 1000)}:R>**`;

    let _tpBotStatsTitle = `Bot Stats`;
    let _tpBotStatsUsers = `{_tpBotStatsUsers} users`; // add up servers and user installs
    let _tpBotStatsInstalls = `In {_tpBotStatsInstalls} servers`;

    let _tpUsersTitle = `Service Stats`;
    let _tpUsersOnline = `<:Online:1280239167363616942>${numberWithCommas(_tpUserCount.statArr.online)}`;
    let _tpUsersTotal = `<:Offline:1280239175290851390>${numberWithCommas(_tpUserCount.statArr.total)}`;

    let _sxStatusTitle = `Service Status`;
    let _sxStatusFooTable = `\`\`\`\nMONITOR             | STATUS          \n--------------------+----------------\nInteraction Service | Operational\nAccount Service     | Operational\n\`\`\``;
    let _sxStatusFooter = `-# Teapot Bot runs on the SupItsTom Network • [See full status here](https://status.supitstom.net)`;

    let _envBuildInformation = env.BUILD_TYPE == "staging" ? `Test Mode active for Teapot Bot - Shoot for the stars!` : null;

    return new JsonResponse({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: null,
        embeds: [
          {// TODO: https://i.imgur.com/QoUeukY.png
            author: {
              name: _envBuildInformation,
            },
            description: `## ${_title}\n${_lastUpdate}\n### ${_tpUsersTitle}\n${_tpUsersOnline} ${_tpUsersTotal}\n### ${_sxStatusTitle}\n${_sxStatusFooTable}\n${_sxStatusFooter}`,
            color: EmbedColor.COLOR_DEFAULT,
          }
        ],
        //flags: InteractionResponseFlags.EPHEMERAL
      },
    })
  }

  /******************************************************************/
  /*                                                                */
  /*                                                                */
  /******************************************************************/

  static TeapotTokenRedeemed(env, interaction, teapot, message) {
    const user = interaction.data.type == 2 ? getTargetUser(interaction) : getUser(interaction);
    let _userWithBadges = getProfileBadges(interaction, teapot) + `<@${user.id}>`;
    let _username = `\`${teapot.acc.name}\``
    let _lastSeen = `-# ${teapot.acc.online == true ? `**${teapot.acc.title.name === "None Set" ? "Currently Online" : `Playing ${teapot.acc.title.name}`}**` : `**Last Seen <t:${teapot.acc.date_lastseen_unix}:R>${teapot.acc.title.name === "None Set" ? "" : ` on ${teapot.acc.title.name}`}**`}`;

    let _tokenRedeemedHeader = `Token Redeemed!`
    let _tokenRedeemedBody = `${message}`

    return new JsonResponse({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: null,
        embeds: [
          {
            description: `## ${_userWithBadges} ${_username}\n${_lastSeen}\n## ${_tokenRedeemedHeader}\n${_tokenRedeemedBody}`,
            color: EmbedColor.COLOR_DEFAULT,
            thumbnail: {
              url: `http://avatar.xboxlive.com/avatar/${encodeURIComponent(teapot.acc.gamertag.trim())}/avatarpic-l.png`
            }
          }
        ],
        flags: InteractionResponseFlags.EPHEMERAL
      },
    })
  }

}

export class MessageComponent {
  static TeapotKvLife(interaction, teapot, teapot_kv) {
    const user = interaction.data.type == 2 ? getTargetUser(interaction) : getUser(interaction);
    let _userWithBadges = getProfileBadges(interaction, teapot) + `<@${user.id}>`;
    let _username = `\`${teapot.acc.name}\``
    let _kvTime = `**KV Life:** \`${teapot_kv.time}\``;

    return JSON.stringify({
      content: null,
      embeds: [
        {
          description: `## ${_userWithBadges} ${_username}\n${_kvTime}`,
          color: EmbedColor.COLOR_DEFAULT,
          thumbnail: {
            url: `http://avatar.xboxlive.com/avatar/${encodeURIComponent(teapot.acc.gamertag.trim())}/avatarpic-l.png`
          }
        }
      ],
    })
  }
}

/*****************************************************************************
**							  Public Constants								                          **
*****************************************************************************/

export const EmbedColor = {
  COLOR_DEFAULT: 2829616,
  COLOR_BLURPLE: 5793266,
  COLOR_GREEN: 5763719,
  COLOR_YELLOW: 16705372,
  COLOR_PINK: 15418782, // Fuchsia 
  COLOR_RED: 15548997,
  COLOR_WHITE: 16777215,
  COLOR_BLACK: 0,
  COLOR_ORANGE_HALLOWEEN: 0xff9a00// EVENT
}
