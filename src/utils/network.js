//-----------------------------------------------------------------------------
// Purpose: Return JSON response
//-----------------------------------------------------------------------------
export class JsonResponse extends Response {
    constructor(body, init) {
        const jsonBody = JSON.stringify(body);
        init = init || {
            headers: {
                'content-type': 'application/json;charset=UTF-8',
            },
        };
        super(jsonBody, init);
    }
}

//-----------------------------------------------------------------------------
// Purpose: get query strings used in the request
//-----------------------------------------------------------------------------
export function getSearchParams(request, param) {
    const { searchParams } = new URL(request.url);
    let value = searchParams.get(param);
    return value;
}

//-----------------------------------------------------------------------------
// Purpose: return a http status code with text
//-----------------------------------------------------------------------------
export function dropRequest(code) {
    switch (code) {
        case 200: return new Response("The request completed successfully.", { status: code });
        case 201: return new Response("The entity was created successfully.", { status: code });
        case 204: return new Response("The request completed successfully but returned no content.", { status: code });
        case 304: return new Response("The entity was not modified (no action was taken).", { status: code });
        case 400: return new Response("The request was improperly formatted, or the server couldn't understand it.", { status: code });
        case 401: return new Response("The request was denied permission to the resource.", { status: code });
        case 403: return new Response("The request failed authentication.", { status: code });
        case 404: return new Response("The resource at the location specified doesn't exist.", { status: code });
        case 405: return new Response("The HTTP method used is not valid for the location specified.", { status: code });
        case 418: return new Response("This maze isn't meant for you.", { status: code });
        case 429: return new Response("You are being rate limited.", { status: code });
        default: return new Response("The server had an error processing your request (these are rare).", { status: code });
    }
}