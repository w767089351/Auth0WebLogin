/* global chrome */
import React, { useState } from "react";
import {useAuth0} from '@auth0/auth0-react';
import config from "../auth_config.json";

const { apiOrigin = "http://localhost:3001" } = config;

const AuthButton = () => {

    const {getAccessTokenSilently} = useAuth0();

    const callProtectedEndpoint = async() => {
        try {
            // get token from Auth0
            const token = await getAccessTokenSilently({
                audience:'https://nodejs-auth/api',
                scope:'read:posts',
            });
            console.log(token);
            // send token message to chrome extension and receive response
            var targetExtensionId = "nggibfooeneelhiifdeconhlfaaffcgg"; // 插件的ID
            chrome.runtime.sendMessage(targetExtensionId, token, function(response) {
                console.log(response);
            });

            // send token message to back end server
            const response = await fetch(`${apiOrigin}/api/protected`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const responseData = await response.json();
            console.log(responseData);
        } catch (error) {

        }
    };
    return (

            <button onClick={callProtectedEndpoint}>
                Authorize
            </button>

    )
};


export default AuthButton