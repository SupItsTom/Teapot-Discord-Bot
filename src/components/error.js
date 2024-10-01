import { InteractionResponseFlags, InteractionResponseType } from "discord-interactions";
import { JsonResponse } from "../utils/network";
import { EmbedColor } from "./embed";

export class InteractionErrorResponse {
  static DropWithMessage(text) {
    return new JsonResponse({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: null,
        embeds: [
          {
            description: `## :(\n${text}`,
            color: EmbedColor.COLOR_DEFAULT
          }
        ],
        flags: InteractionResponseFlags.EPHEMERAL
      },
    })
  }

  static UnknownError() {
    return new JsonResponse({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: null,
        embeds: [
          {
            description: `## Unexpected Application Error!\nUnable to process request, try again in a bit.`,
            color: EmbedColor.COLOR_DEFAULT
          }
        ],
        flags: InteractionResponseFlags.EPHEMERAL
      },
    })
  }

  static UnknownUser(user) {
    return new JsonResponse({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: null,
        embeds: [
          {
            description: `## :(\n<@${user.id}> hasn't connected their **Teapot** account to **Discord**.`,
            color: EmbedColor.COLOR_DEFAULT
          }
        ],
        flags: InteractionResponseFlags.EPHEMERAL
      },
    })
  }

  static FeatureUnavailable(message) {
    return new JsonResponse({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: null,
        embeds: [
          {//todo: add emojis to the title of this embed
            description: `## <:FeatureUnavailable0:1280240552729907251><:FeatureUnavailable1:1280240558547144714><:FeatureUnavailable2:1280240566189297727><:FeatureUnavailable3:1280240572707373066><:FeatureUnavailable4:1280240579002765333><:FeatureUnavailable5:1280240585080311990><:FeatureUnavailable6:1280240590486765720><:FeatureUnavailable7:1280240596044222496><:FeatureUnavailable8:1280240604126904442>
            \n${message}`,
            color: EmbedColor.COLOR_DEFAULT
          }
        ],
        flags: InteractionResponseFlags.EPHEMERAL
      },
    })
  }

  // Debugging JSON data
  static DebugPrintJsonData(json) {
    return new JsonResponse({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: null,
        embeds: [
          {
            description: `## Debug JSON View
            \n\`\`\`json\n${JSON.stringify(json, null, 2)}\n\`\`\``,
            color: EmbedColor.COLOR_DEFAULT
          }
        ],
        flags: InteractionResponseFlags.EPHEMERAL
      },
    })
  }

  static TeapotConsoleBlacklisted(env) {

    let _userSettingsHeader = `<:BanHammer:1284978236039893012> Account Disabled`
    let _userSettingsPrivateProfile = `You have been banned from using the Teapot Live Discord Service.`

    return new JsonResponse({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: null,
        embeds: [
          {
            description: `## ${_userSettingsHeader}\n${_userSettingsPrivateProfile}`,
            color: EmbedColor.COLOR_RED,
          }
        ],
        //flags: InteractionResponseFlags.EPHEMERAL
      },
    })
  }
}
