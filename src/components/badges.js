import { badges } from "../metadata/badges.json";
import { getTargetUser, getUser, isPremiumUser } from "../utils/discord";

export const ProfileCardBadges = {
  BADGE_SYSTEM: `[<:System:1280242894296580199>](https://supitstom.net/teapot/bot#badges)`,
  BADGE_DEVELOPER: `[<:Developer:1280242902538129418>](https://supitstom.net/teapot/bot#badges)`,//
  BADGE_LIFETIME: `[<:Lifetime:1280242973551886419>](https://supitstom.net/teapot/bot#badges)`,//
  BADGE_MOXAH: `[<:Moxah:1280242961870885018>](https://supitstom.net/teapot/bot#badges)`,//
  BADGE_PH: `[<:Tester:1280242924864667760>](https://supitstom.net/teapot/bot#badges)`,//
  BADGE_KALI: `[<:Bricker:1280242939510915112>](https://supitstom.net/teapot/bot#badges)`,//
  BADGE_SUPERIORITY: `[<:Superiority:1280242952215593074>](https://supitstom.net/teapot/bot#badges)`,//
  BADGE_PREMIUM: `[<:Premium:1282826030792310795>](https://discord.com/application-directory/1040809994012069919/store/1282402647776821369)`,//
}

export function getProfileBadges(interaction, teapot) {
  const user = interaction.data.type == 2 ? getTargetUser(interaction) : getUser(interaction);

  // shit hacky way to fix undefined users in badge metadata
  let isSystem = ``;
  let isDeveloper = ``;
  let isSuperiority = ``;
  let isMoxah = ``;
  let isSlut = ``;
  let isBricker = ``;

  // IF: user does exist in metadata
  if (badges[user.id] != undefined) {
    isSystem = badges[user.id].includes("system") == true ? `${ProfileCardBadges.BADGE_SYSTEM} ` : ``;
    isDeveloper = badges[user.id].includes("developer") == true ? `${ProfileCardBadges.BADGE_DEVELOPER} ` : ``;

    // static user groups
    isSuperiority = badges[user.id].includes("superiority") == true ? `${ProfileCardBadges.BADGE_SUPERIORITY} ` : ``;
    isMoxah = badges[user.id].includes("moxah") == true ? `${ProfileCardBadges.BADGE_MOXAH} ` : ``;
    isSlut = badges[user.id].includes("slut") == true ? `${ProfileCardBadges.BADGE_PH} ` : ``;
    isBricker = badges[user.id].includes("brick") == true ? `${ProfileCardBadges.BADGE_KALI} ` : ``;
  }

  // non-static
  const isLifetime = teapot.acc.timeleft.lifetime == true ? `${ProfileCardBadges.BADGE_LIFETIME} ` : ``;
  const isPremium = isPremiumUser(interaction) == true ? `${ProfileCardBadges.BADGE_PREMIUM} ` : ``;

  // return the formatted string of badges the user has:
  return `${isSystem}${isDeveloper}${isSuperiority}${isMoxah}${isSlut}${isBricker}${isLifetime}${isPremium}`;
}

// Gamer7112: instead of checking if its defined just check if its undefined and if so then return an empty string or whatever
export function getProfileBadgesV2(user, teapot) {
  const isLifetimeUser = teapot.acc.timeleft.lifetime ? `${ProfileCardBadges.BADGE_LIFETIME} ` : ``;
  if (badges[user.id] == undefined) {
    return `${isLifetimeUser}`;
  }

  let isSystem = badges[user.id].includes("system") ? `${ProfileCardBadges.BADGE_SYSTEM} ` : ``;
  let isDeveloper = badges[user.id].includes("developer") ? `${ProfileCardBadges.BADGE_DEVELOPER} ` : ``;

  // static user groups
  let isSuperiority = badges[user.id].includes("superiority") ? `${ProfileCardBadges.BADGE_SUPERIORITY} ` : ``;
  let isMoxah = badges[user.id].includes("moxah") ? `${ProfileCardBadges.BADGE_MOXAH} ` : ``;
  let isSlut = badges[user.id].includes("slut") ? `${ProfileCardBadges.BADGE_PH} ` : ``;
  let isBricker = badges[user.id].includes("brick") ? `${ProfileCardBadges.BADGE_KALI} ` : ``;

  // return the formatted string of badges the user has:
  return `${isSystem}${isDeveloper}${isSuperiority}${isMoxah}${isSlut}${isBricker}${isLifetimeUser}`;
}

// See Internal Docs on how to make new icons to match our design scheme
