export default `
This Privacy Policy ("Policy") define the end-user ("you", "your") data being used as needed for the Teapot Discord bot ("bot") to operate and provide its functionality.
By using the bot, whether you have read these notices or not, you agree to be bound by the Policy and Terms of Service. If you do not agree to this policy, please do not use the bot.

The bot has no persistent in-memory cache as it runs as a stateless Cloudflare Worker.
The bot responds solely to messages and requires no stored user data for this unless its for Teapot lookups.

The use of the bot, and its commands, will result in data being sent to Discord to be rendered in chat channels for you.
You can read Discord's Privacy Policy on their website: https://discord.com/privacy

For Teapot lookup commands, the email provided will be sent to Teapot's API to provide the functionality for the bot.
Teapot does not currently have anything about privacy listed on their website.

You may recieve DMs from the bot, whether a user or not.
We only send Bot messages when your account is updated, either by staff, redeeming tokens, or by another user gifting you something.

Your Email linked may be used to send you notifications about your account, this is very rare and would only be used to
notify you in the event of data leaks or breaches. These will be sent from teapot@supitstom.net
Your email or any other data stored is not shared to Teapot staff or owners, only SupItsTom can see this information.

At your request, the email and account information for the Teapot lookup commands can also be purged.
If you are reading this from the bot's (slash)privacy command, you can delete your information below.
Otherwise, please shoot an email to privacy@supitstom.net from the email you want removing.

For more information on what data we store and use, or why we need it, contact me or ask in the Teapot Discord server.
`.trim();
