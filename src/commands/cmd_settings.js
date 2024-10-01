/*****************************************************************************
**							  	  Includes									                            **
*****************************************************************************/
import { InteractionResponse } from "../components/embed";
import { getDisplayName, getTargetUser, getUser } from "../utils/discord";
import { tpApiRequest, tpGetUserInfo, tpSetUserPrivacySetting } from "../utils/client";
import { InteractionErrorResponse } from "../components/error";

/*****************************************************************************
**							  Public Functions								                          **
*****************************************************************************/

/******************************************************************/
/*                                                                */
/*                                                                */
/******************************************************************/

export async function cmd_settings_privacy(interaction, env, context) {
  const user = interaction.data.type == 2 ? await getTargetUser(interaction) : await getUser(interaction);
  const username = getDisplayName(user);
  const cfgValue = interaction.data.options[1].value;

  const _tpGetUserInfo = await tpGetUserInfo(env, user, context);
  const _tpUserAccount = await tpApiRequest(env, `overview`, _tpGetUserInfo.email, null, context);

  if (!_tpGetUserInfo) {
    if (interaction.data.type == 2) return InteractionErrorResponse.UnknownUser(user);

    return InteractionResponse.TeapotProfileOnboarding(username);
  }

  // update privacy setting
  await tpSetUserPrivacySetting(env, user, cfgValue);

  return InteractionResponse.TeapotProfileSettingsUpdatePrivacy(env, interaction, _tpUserAccount, cfgValue)
}
