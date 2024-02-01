define(["picSure/settings", "text!login/not_authorized.hbs", "handlebars",
        'util/notification', 'common/session'],
    function (settings, notAuthorizedTemplate, HBS,
              notification, session) {
        function generateRandomState() {
            const randomPart = Math.random().toString(36).substring(2, 15);
            const timePart = new Date().getTime().toString(36);
            return randomPart + timePart;
        }

        function redirectToProvider() {
            const state = generateRandomState();
            sessionStorage.setItem('oauthState', state);
            const redirectUri = encodeURIComponent(window.location.protocol +
                "//" + window.location.hostname +
                (window.location.port ? ":" + window.location.port : "") +
                "/psamaui/login");
            const authUrl = "https://" + settings.idp_provider_uri +
                "/oauth2/default/v1/authorize" +
                "?response_type=code" +
                "&scope=openid" +
                "&client_id=" + encodeURIComponent(settings.client_id) +
                "&redirect_uri=" + redirectUri +
                "&state=" + encodeURIComponent(state);

            console.log("Redirecting to:", authUrl); // Debugging line
            // redirect the user to the authorization endpoint
            window.location.href = authUrl;
        }

        let doLoginFlow = function () {
            let url = new URL(window.location.href);
            let code = url.searchParams.get("code");
            let state = url.searchParams.get("state");
            let storedState = sessionStorage.getItem('oauthState');

            if (code && state === storedState) {
                // Code and state are valid, proceed with authentication
                $('#main-content').html("Authentication is successful. Processing UserProfile information...");

                $.ajax({
                    url: '/psama/okta/authentication',
                    type: 'POST',
                    data: JSON.stringify({
                        code: code
                    }),
                    contentType: 'application/json',
                    success: session.sessionInit,
                    error: handleAuthenticationError
                });
            } else if (!code) {
                // No code, redirect to provider
                redirectToProvider();
            } else {
                // Invalid state, handle authentication error
                handleAuthenticationError("Invalid state parameter. Possible CSRF attack detected.");
            }
        };

        let handleAuthenticationError = function (message) {
            console.debug("Failed to authenticate: ", message);
            notification.showFailureMessage(message || "Failed to authenticate with provider. Try again or contact administrator if error persists.");
            history.pushState({}, "", sessionStorage.not_authorized_url ? sessionStorage.not_authorized_url : "/psamaui/not_authorized");
        };

        return {
            authorization: undefined,
            client_id: settings.client_id,
            postRender: undefined,
            displayNotAuthorized: function () {
                $('#main-content').html(HBS.compile(notAuthorizedTemplate)({
                    helpLink: settings.helpLink,
                    loginLink: settings.loginLink
                }));
            },
            showLoginPage: doLoginFlow,
        };
    });
