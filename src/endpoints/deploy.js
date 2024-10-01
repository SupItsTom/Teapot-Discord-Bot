//-----------------------------------------------------------------------------
// Purpose: Handle requests picked up on the /deploy endpoint
//-----------------------------------------------------------------------------

import { dropRequest, getSearchParams } from "../utils/network";
import { production, staging } from '../metadata/commands.json';
import { roles } from '../metadata/roles.json';

export default async function (request, env, context) {
    const type = getSearchParams(request, "type"); // deployment type: either 'production' or 'staging'
    const key = getSearchParams(request, "key"); // secret code to keep randos from deploying our shit

    if (!_isValidDeploymentKey(env, key)) {
        return dropRequest(401);
    }

    switch (type) {
        case "production": {
            await _deployGlobalCommand(request, env, production).then(responseData => console.log('[deploy:_deployGlobalCommand] Success:', responseData));
            return dropRequest(200);
        }
        case "staging": {
            await _deployServerCommand(request, env, staging).then(responseData => console.log('[deploy:_deployServerCommand] Success:', responseData));
            return dropRequest(200);
        }
        case "roles": {
            await _deployLinkedRoles(request, env, roles).then(responseData => console.log('[deploy:_deployLinkedRoles] Success:', responseData));
            return dropRequest(200);
        }
        default: {
            return dropRequest(400);
        }
    }
}

// Deploy commands globally for everyone to use (sometimes takes a few mins)
async function _deployGlobalCommand(request, env, payload) {
    try {
        const response = await fetch(`https://discord.com/api/v10/applications/${env.DISCORD_APPLICATION_ID}/commands`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bot ${env.DISCORD_TOKEN}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            console.log(`[deploy:_deployGlobalCommand] Discord Error: ${response.status}`);
            throw new Error(`HTTP Error, throwing for status: ${response.status}`);
        }

        return response.json();
    }
    catch (error) {
        console.log(`[deploy:_deployGlobalCommand] error: ${error}`);
        throw error;
    }
}

// Deploy commands to test server for testing
async function _deployServerCommand(request, env, payload) {
    try {
        const response = await fetch(`https://discord.com/api/v10/applications/${env.DISCORD_APPLICATION_ID}/guilds/${env.DISCORD_TEST_GUILD_ID}/commands`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bot ${env.DISCORD_TOKEN}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            console.log(`[deploy:_deployServerCommand] Discord Error: ${response.status}`);
            throw new Error(`HTTP Error, throwing for status: ${response.status}`);
        }

        return response.json();
    }
    catch (error) {
        console.log(`[deploy:_deployServerCommand] error: ${error}`);
        throw error;
    }
}

// Deploy roles
async function _deployLinkedRoles(request, env, payload) {
    try {
        const response = await fetch(`https://discord.com/api/v10/applications/${env.DISCORD_APPLICATION_ID}/role-connections/metadata`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bot ${env.DISCORD_TOKEN}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            console.log(`[deploy:_deployLinkedRoles] Discord Error: ${response.status}`);
            throw new Error(`HTTP Error, throwing for status: ${response.status}`);
        }

        return response.json();
    }
    catch (error) {
        console.log(`[deploy:_deployLinkedRoles] error: ${error}`);
        throw error;
    }
}

// Check if the deployment key matches our private one
function _isValidDeploymentKey(env, key) {
    const isValid = key == env.DISCORD_DEPLOY_KEY ?? false;
    console.log(`[deploy:_isValidDeploymentKey] ${isValid}`);
    return isValid;
}