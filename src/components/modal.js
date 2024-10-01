import { InteractionResponseFlags, InteractionResponseType } from "discord-interactions";
import { JsonResponse } from "../utils/network";

export class InteractionModalResponse {
    // Errors
    static TeapotProfileConnection() {
        return new JsonResponse({
            type: 9,
            data: {
                title: "Connect Teapot Account",
                custom_id: "mod_profile_link",
                components: [{
                    type: 1,
                    components: [{
                        type: 4,
                        custom_id: "email",
                        label: "Teapot Email",
                        style: 1,
                        min_length: 3,
                        max_length: 64,
                        placeholder: "teapot@supitstom.net",
                        required: true
                    }]
                }]
            }
        });
    }

    static TeapotGiftToken() {
        return new JsonResponse({
            type: 9,
            data: {
                title: "Give the gift of Teapot",
                custom_id: "mod_gift_token",
                components: [{
                    type: 1,
                    components: [{
                        type: 4,
                        custom_id: "token",
                        label: "Token",
                        style: 1,
                        min_length: 3,
                        max_length: 64,
                        placeholder: "XXXXXX-XXXXXX-XXXXXX",
                        required: true
                    }]
                }]
            }
        });
    }
}