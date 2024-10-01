/*****************************************************************************
**							  	  Includes									                            **
*****************************************************************************/
import { InteractionResponse } from "../components/embed";
import { dsgBroadcastMessage, getDisplayName, getTargetUser, getUser } from "../utils/discord";
import { isValidEmail, tpApiRequest, tpGetUserEmail, tpGetUserInfo, tpSetUserInfo, tpSetUserPrivacySetting } from "../utils/client";
import { InteractionModalResponse } from "../components/modal";
import { InteractionErrorResponse } from "../components/error";

/*****************************************************************************
**							  Public Functions								                          **
*****************************************************************************/

/******************************************************************/
/*                                                                */
/*                                                                */
/******************************************************************/

export async function cmd_status(interaction, env, context) {
  const user = interaction.data.type == 2 ? await getTargetUser(interaction) : await getUser(interaction);
  const username = getDisplayName(user);

  // get teapot online user count
  let _tpUserCount = await tpApiRequest(env, `get_stats_filter`, null, null, context);
  // get supitstom betterstack status
  // get teapot status if konroi actually fucking does shit for it

  return InteractionResponse.TeapotStatus(env, _tpUserCount);
}
