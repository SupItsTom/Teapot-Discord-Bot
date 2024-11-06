/*****************************************************************************
**							  	  Includes									                            **
*****************************************************************************/
import { EmbedColor } from "../components/embed";

import Privacy from "../metadata/strings/privacy";
import { InteractionResponseFlags, InteractionResponseType } from "discord-interactions";
import { JsonResponse } from "../utils/network";

/*****************************************************************************
**							  Public Functions								                          **
*****************************************************************************/

/******************************************************************/
/*                                                                */
/*                                                                */
/******************************************************************/

export async function cmd_privacy(interaction, env, context) {

  return new JsonResponse({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: null,
      embeds: [
        {
          description: `## Privacy Policy\n${Privacy}`,
          color: EmbedColor.COLOR_DEFAULT,
        }
      ],
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              style: 4,
              label: "Unlink",
              custom_id: `btn_privacy_unlink`,
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

export async function cmd_terms(interaction, env, context) {

}
