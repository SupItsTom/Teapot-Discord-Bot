// $$$$$$\          $$\  $$$$$$\        $$$$$$$$\ $$$$$$$$\ $$\      $$\ $$$$$$$\   $$$$$$\ $$\     $$\  $$$$$$\  
// \_$$  _|        $$  |$$ ___$$\       $$  _____|$$  _____|$$$\    $$$ |$$  __$$\ $$  __$$\\$$\   $$  |$$  __$$\ 
//   $$ |         $$  / \_/   $$ |      $$ |      $$ |      $$$$\  $$$$ |$$ |  $$ |$$ /  $$ |\$$\ $$  / $$ /  \__|
//   $$ |        $$  /    $$$$$ /       $$$$$\    $$$$$\    $$\$$\$$ $$ |$$$$$$$\ |$$ |  $$ | \$$$$  /  \$$$$$$\  
//   $$ |        \$$<     \___$$\       $$  __|   $$  __|   $$ \$$$  $$ |$$  __$$\ $$ |  $$ |  \$$  /    \____$$\ 
//   $$ |         \$$\  $$\   $$ |      $$ |      $$ |      $$ |\$  /$$ |$$ |  $$ |$$ |  $$ |   $$ |    $$\   $$ |
// $$$$$$\         \$$\ \$$$$$$  |      $$ |      $$$$$$$$\ $$ | \_/ $$ |$$$$$$$  | $$$$$$  |   $$ |    \$$$$$$  |
// \______|         \__| \______/       \__|      \________|\__|     \__|\_______/  \______/    \__|     \______/ 

// Initialize the REST API router
import { Router } from 'itty-router';
const router = Router();

// Anything on the base path, should just re-route to the app install link
router.get('/', (request, env, context) => {
	return Response.redirect(`https://discord.com/oauth2/authorize?client_id=${env.DISCORD_APPLICATION_ID}`);
});

// Endpoint used by Discord to send and recieve data
import interactions from './endpoints/interactions';
router.post('/interactions', async (request, env, context) => {
	return interactions(request, env, context);
});

// Endpoint for deploying commands listed in commands.json
import deploy from './endpoints/deploy';
router.get('/deploy', async (request, env, context) => {
	return deploy(request, env, context);
});

// Callback for oauth shit
import authorize from './endpoints/authorize';
router.get('/authorize', async (request, env, context) => {
	return authorize(request, env, context);
});

// Callback for role verification (same as authorize except we pass metadata back to discord)
router.get('/verify', async (request, env, context) => {
	return; // todo
});

// For anything else not specified above, drop that bitch request!!
import { dropRequest } from './utils/network';
router.all('*', (request, env, context) => {
	return dropRequest();
});

// Entry point of the API:
import { verifyKey } from 'discord-interactions';
export default {
	async fetch(request, env, context) {
		// Validates a payload from Discord against its signature and key.
		if (request.method === "POST") {
			const signature = request.headers.get("X-Signature-Ed25519");
			const timestamp = request.headers.get("X-Signature-Timestamp");

			const body = await request.clone().arrayBuffer();
			const isValidRequest = verifyKey(body, signature, timestamp, env.DISCORD_PUBLIC_KEY);

			// if the key isnt valid then drop the request
			if (!isValidRequest) {
				console.log(`[discord:verifySignatureAndTimestamp] failed validation`);
				return new Response("The request was denied permission to the resource.", { status: 401 });
			}
		}

		return router.handle(request, env, context);
	},
};