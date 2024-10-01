/*****************************************************************************
**							  	  Includes									                            **
*****************************************************************************/
import { InteractionResponse } from "../components/embed";
import { getDisplayName, getTargetUser, getUser } from "../utils/discord";
import { isValidEmail, tpApiRequest, tpGetUserEmail, tpGetUserInfo, tpSetUserInfo } from "../utils/client";
import { InteractionModalResponse } from "../components/modal";
import { InteractionErrorResponse } from "../components/error";

/*****************************************************************************
**							  Public Functions								                          **
*****************************************************************************/

/******************************************************************/
/* Get the profile of a user, either current or targetted         */
/*                                                                */
/******************************************************************/

export async function cmd_profile(interaction, env, context) {
  const user = interaction.data.type == 2 ? await getTargetUser(interaction) : await getUser(interaction);
  const username = getDisplayName(user);

  const _tpGetUserInfo = await tpGetUserInfo(env, user, context);

  // PRIVACY: Check if the user isnt themselves, and if not, check if the user selected allows others to see their profile
  if (interaction.data.type == 2 && _tpGetUserInfo.public == false && getTargetUser(interaction).id != getUser(interaction).id) {
    return InteractionErrorResponse.DropWithMessage(`<@${user.id}> doesn't allow others to view their account.`);
  }

  // Check if profile is linked, and if not, return the onboarding screen
  if (!_tpGetUserInfo) {
    if (interaction.data.type == 2) return InteractionErrorResponse.UnknownUser(user);

    return InteractionResponse.TeapotProfileOnboarding(username);
  }

  if(_tpGetUserInfo.blacklisted){
    return InteractionErrorResponse.TeapotConsoleBlacklisted(env);
  }

  const tpUserAccount = await tpApiRequest(env, `overview`, _tpGetUserInfo.email, null, context);
  const tpUserKvStatus = await tpApiRequest(env, `kvstatus`, _tpGetUserInfo.email, null, context);

  //return InteractionErrorResponse.TeapotConsoleBlacklisted(env, user, tpUserAccount);
  return InteractionResponse.TeapotProfileCard(env, interaction, tpUserAccount, tpUserKvStatus, _tpGetUserInfo);
}

/******************************************************************/
/* Link Teapot email to the bot                                   */
/*                                                                */
/******************************************************************/

export async function cmd_link(interaction, env, context) {
  const user = await getUser(interaction);
  const email = interaction.data.components[0].components[0].value;

  const _tpGetUserInfo = await tpGetUserInfo(env, user, context);
  const _tpGetUserEmail = await tpGetUserEmail(env, email);

  // Email doesn't follow email regex
  if (!isValidEmail(email)) {
    return InteractionErrorResponse.DropWithMessage("Email failed validation."); // invalid email error
  }

  // Email is linked to the users account already (dumbass)
  // 2024-09: Commented this out so relinking works
  // if (_tpGetUserInfo.id == user.id) {
  //   return InteractionErrorResponse.DropWithMessage(`Console is already linked to your account.`); // already linked to own discord
  // }

  // User already has an email linked to their account
  // TODO: needs reworking to support multiple consoles
  //       a solution could be to just remove this entirely

  // 2024-09: Commented this out so relinking works
  // if (_tpGetUserInfo) {
  //   return InteractionErrorResponse.DropWithMessage("Console limit reached for this Discord account."); // cannot relink error
  // }

  // Email is already linked to a different Discord account
  if (_tpGetUserEmail) {
    return InteractionErrorResponse.DropWithMessage(`Console is already linked to a different Discord account.`);
  }

  let _tpLinkCheck = await tpApiRequest(env, `link`, email, null, context);

  // Email does not exist on Teapot
  if (!_tpLinkCheck.status) {
    return InteractionErrorResponse.DropWithMessage("Email isn't registered on Teapot Live.");
  }

  await tpSetUserInfo(env, user, email);

  return InteractionResponse.TeapotProfileLinked(email);
}

/******************************************************************/
/*                                                                */
/*                                                                */
/******************************************************************/

export async function btn_profile_link(interaction, env, context) {
  return InteractionModalResponse.TeapotProfileConnection();
}
