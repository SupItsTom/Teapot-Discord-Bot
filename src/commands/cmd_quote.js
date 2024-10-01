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

export async function cmd_quote(interaction, env, context) {
  const user = interaction.data.type == 2 ? await getTargetUser(interaction) : await getUser(interaction);
  const username = getDisplayName(user);

  const _tpQuote = await tpApiRequest(env, `randquote`, null, null, context);

  return InteractionResponse.TeapotSkidQuote(env, _tpQuote);
}

/******************************************************************/
/*                                                                */
/*                                                                */
/******************************************************************/

export async function cmd_quote_create(interaction, env, context) {
  const user = interaction.data.type == 2 ? await getTargetUser(interaction) : await getUser(interaction);
  const username = getDisplayName(user);

  const _targetMessageId = interaction.data.target_id;
  const _messageContent = interaction.data.resolved.messages[_targetMessageId];

  // [02 September] TODO: parse what we actually need and ship it to the database
  // Author Information, Message Content, Any Attachments with it

  return InteractionErrorResponse.DebugPrintJsonData(_messageContent);
}
