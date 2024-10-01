//-----------------------------------------------------------------------------
// Purpose: Handle requests picked up on the /authorize endpoint
//          Used for exchanging oauth2 credentials to info scopes provide
//          Tokens expire if not refreshed after 7 days
//          Links roles authorization must use the /verify-user endpoint instead
//          !!WE SHOULD NOT NEED TO SAVE TOKENS - DONT SAVE WHAT WE DONT NEED LONG-TERM!!
//-----------------------------------------------------------------------------

import { dropRequest, getSearchParams } from "../utils/network";

// probably the shittest code in this entire bot
export default async function (request, env, context) {
    const code = getSearchParams(request, "code"); // discord sends this to us when a user authorizes the connection

    // lets get the bearer token from the code discord gave us:
    const token = await _exchangeAccessToken(code, env, context);

    // from here we can use the bearer token to access the scopes we were granted access to
    console.log(JSON.stringify(token));

    // should return a html success page, or redirect to an existing one because users will be redirected to it
    return dropRequest(200);
}

// exchange the access token discord gave us for a bearer token we can use for making requests
async function _exchangeAccessToken(code, env, context) {
    const data = new URLSearchParams({
        grant_type: 'authorization_code', // must be set to 'authorization_code'
        code: code, // the code discord gave us that we wanna exchange for the bearer
        redirect_uri: env.DISCORD_REDIRECT_URI  // this redirect should be the same as whats in the discord dev portal otherwise it will fail
    });

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    };

    try {
        // make this request and pray that it doesnt fail
        const response = await fetch(`https://discord.com/api/oauth2/token`, {
            method: 'POST',
            body: data,
            headers: headers
        });

        // it fucking failed!! (need to add error handling since this is frontend)
        if (!response.ok) {
            console.log(`[authorize:_exchangeAccessCode] Discord Error: ${response.status}`);
            throw new Error(`HTTP Error, throwing for status: ${response.status}`);
        }

        // if we get this far it didnt fail; return it
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('[authorize:_exchangeAccessCode] Error exchanging code:', error);
        throw error;
    }
}

// tokens expire 604800 seconds after they were made
// this function just refreshes it and tells discord we still need it
// typically, for security, i never store and refresh them but rather have the user authorize again
async function _refreshToken(code, env, context) {
    const data = new URLSearchParams({
        grant_type: 'refresh_token', // must be set to 'refresh_token'
        refresh_token: code, // the code discord gave us that we wanna exchange for the bearer
    });

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(`${env.DISCORD_APPLICATION_ID}:${env.DISCORD_CLIENT_SECRET}`) // make the request on behalf of the app so discord knows its us
    };

    try {
        const response = await fetch(`https://discord.com/api/oauth2/token`, {
            method: 'POST',
            body: data,
            headers: headers
        });

        if (!response.ok) {
            console.log(`[authorize:_refreshToken] Discord Error: ${response.status}`);
            throw new Error(`HTTP Error, throwing for status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('[authorize:_refreshToken] Error exchanging code:', error);
        throw error;
    }
}

// used for making tokens invalid
// this is good for clearing up tokens we no longer need
// even tho they expire after 604800 seconds - its still good to clear up what we dont need
async function _revokeToken(code, env, context) {
    const data = new URLSearchParams({
        //token_type_hint: 'access_token', // optional: the token parameter's type—either 'access_token' or 'refresh_token'
        token: code, // the code discord gave us that we wanna exchange for the bearer
    });

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(`${env.DISCORD_APPLICATION_ID}:${env.DISCORD_CLIENT_SECRET}`) // make the request on behalf of the app so discord knows its us
    };

    try {
        const response = await fetch(`https://discord.com/api/oauth2/token/revoke`, {
            method: 'POST',
            body: data,
            headers: headers
        });

        if (!response.ok) {
            console.log(`[authorize:_revokeToken] Discord Error: ${response.status}`);
            throw new Error(`HTTP Error, throwing for status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('[authorize:_revokeToken] Error exchanging code:', error);
        throw error;
    }

    // Boom; the tokens are safely revoked
}

// we dont need this shit but its here incase we do
async function _requestClientCredentialsFromToken(code, env, context) {
    const data = new URLSearchParams({
        grant_type: 'client_credentials', // must be set to 'refresh_token'
        scope: 'identify', // the code discord gave us that we wanna exchange for the bearer
    });

    // IMPORTANT:   The client credential flow is a quick and easy way for bot developers to get their own bearer tokens for testing purposes
    // IMPORTANT:   By making this request with the type set as 'client_credentials', you will be returned an access token for the bot owner
    // IMPORTANT:   MAKE SURE *NOT* TO KEEP THE AUTHORIZATION HEADER THERE FOR PRODUCTION OTHERWISE IT WILL JUST RETURN THE OWNER TOKEN

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(`${env.DISCORD_APPLICATION_ID}:${env.DISCORD_CLIENT_SECRET}`)
    };

    try {
        const response = await fetch(`https://discord.com/api/oauth2/token`, {
            method: 'POST',
            body: data,
            headers: headers
        });

        if (!response.ok) {
            console.log(`[authorize:_requestClientCredentialsFromToken] Discord Error: ${response.status}`);
            throw new Error(`HTTP Error, throwing for status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('[authorize:_requestClientCredentialsFromToken] Error exchanging code:', error);
        throw error;
    }
}