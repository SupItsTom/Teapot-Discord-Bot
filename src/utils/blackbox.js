import { Logtail } from "@logtail/edge"

//-----------------------------------------------------------------------------
// Purpose: Sends interaction metadata to BetterStack backend
//-----------------------------------------------------------------------------
export function bbPushInteractionLogs(env, interaction, context) {
  const baseLogger = new Logtail(`${env.SXBLACKBOX_TOKEN}`)
  const logger = baseLogger.withExecutionContext(context)

  logger.info(`Interaction Request`, {
    type: 'DISCORD_INTERACTION',
    data: interaction
  })
}
