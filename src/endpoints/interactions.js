import { InteractionResponseType, InteractionType } from "discord-interactions";
import { JsonResponse } from "../utils/network";
import { btn_profile_link, cmd_link, cmd_profile } from "../commands/cmd_profile";
import { InteractionErrorResponse } from "../components/error";
import { cmd_settings_privacy } from "../commands/cmd_settings";
import { cmd_quote, cmd_quote_create } from "../commands/cmd_quote";
import { cmd_privacy } from "../commands/cmd_privacy";
import { cmd_status } from "../commands/cmd_status";

// Entry point; will do the most lifting:
export default async function (request, env, context) {
  const interaction = await request.json();

  console.log(`[endpoints:interactions] incoming request for ${InteractionType[interaction.type]}`);
  console.log(JSON.stringify(interaction));

  const kvBotAllowPublicAccess = await env.KV_TEAPOT_GLOBALCONFIG.get("TEAPOT_ENABLED");

  if (kvBotAllowPublicAccess != "") {
    return InteractionErrorResponse.FeatureUnavailable(`${kvBotAllowPublicAccess}`);
  }

  // BlackBox: is used to store temporary logs externally
  // it also slows the bot down like crazy and should only be used in staging or development
  //await bbPushInteractionLogs(env, interaction, context);

  switch (interaction.type) {
    case InteractionType.PING: {
      return _handlePingRequest();
    }
    case InteractionType.APPLICATION_COMMAND: {
      return _handleApplicationCommand(interaction, env, context);
    }
    case InteractionType.MESSAGE_COMPONENT: {
      return _handleMessageComponent(interaction, env, context);
    }
    case InteractionType.APPLICATION_COMMAND_AUTOCOMPLETE: {
      return _handleAutocompleteCommand(interaction, env, context);
    }
    case InteractionType.MODAL_SUBMIT: {
      return _handleModalSubmit(interaction, env, context);
    }
    default: {
      return new Response("The request was improperly formatted, or the server couldn't understand it.", { status: 400 });
    }
  }
}

//-----------------------------------------------------------------------------
// Purpose: Let's Discord know we are still alive
//-----------------------------------------------------------------------------

function _handlePingRequest() {
  return new JsonResponse({ type: InteractionResponseType.PONG });
}

//-----------------------------------------------------------------------------
// Purpose: Main handler for directing commands to right place
//-----------------------------------------------------------------------------

function _handleApplicationCommand(interaction, env, context) {
  const interactionName = interaction.data.name.toLowerCase();

  switch (interactionName) {
    case "profile": return cmd_profile(interaction, env, context);
    case "settings": return _handleSettingsCommand(interaction, env, context);
    case "quote": return cmd_quote(interaction, env, context);
    case "about": return cmd_status(interaction, env, context);
    // case "privacy": return cmd_privacy(interaction, env, context);
    case "create quote": return cmd_quote_create(interaction, env, context);// todo
    default: return InteractionErrorResponse.DropWithMessage(`Command (\`${interactionName}\`) not available in this build.`);
  }
}

//-----------------------------------------------------------------------------
// Purpose: Handles setting command to send options to the right place
//-----------------------------------------------------------------------------

function _handleSettingsCommand(interaction, env, context) {
  const cfgKey = interaction.data.options[0].value;

  switch (cfgKey) {
    case "privacy": return cmd_settings_privacy(interaction, env, context);
    case "link": return cmd_link(interaction, env, context);
    default: return InteractionErrorResponse.DropWithMessage(`Setting (\`${cfgKey}\`) not available in this build.`);
  }
}

//-----------------------------------------------------------------------------
// Purpose: Serves autocompelte values to the client in real time
//-----------------------------------------------------------------------------

function _handleAutocompleteCommand(interaction, env, context) {
  // super noisy if debugging to console
}

//-----------------------------------------------------------------------------
// Purpose: Handles components like buttons, select menus, ect
//-----------------------------------------------------------------------------

function _handleMessageComponent(interaction, env, context) {
  const interactionName = interaction.data.custom_id;

  switch (interactionName) {
    case "btn_profile": return cmd_profile(interaction, env, context);
    case "btn_profile_link": return btn_profile_link(interaction, env, context);
    default: return InteractionErrorResponse.DropWithMessage(`Component (\`${interactionName}\`) not available in this build.`);
  }
}

//-----------------------------------------------------------------------------
// Purpose: Handles data passed through a modal
//-----------------------------------------------------------------------------

function _handleModalSubmit(interaction, env, context) {
  const interactionName = interaction.data.custom_id;

  switch (interactionName) {
    case "mod_profile_link": return cmd_link(interaction, env, context);
    default: return InteractionErrorResponse.DropWithMessage(`Modal (\`${interactionName}\`) not available in this build.`);
  }
}
