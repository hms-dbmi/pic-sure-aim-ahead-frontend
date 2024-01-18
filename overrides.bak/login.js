define(["picSure/settings", "text!psamaui/overrides/not_authorized.hbs", "handlebars",
        'util/notification', 'common/session'],
    function (settings, notAuthorizedTemplate, HBS,
              notification, session) {
        function redirectToProvider() {
            // We don't have a code, so we need to redirect the user to the login page
            window.location.href = settings.idp_provider_uri + "/user/oauth2/authorize" +
                "?response_type=code" +
                "&scope=openid" +
                "&client_id=" + settings.client_id +
                "&redirect_uri=" + window.location.protocol
                + "//" + window.location.hostname
                + (window.location.port ? ":" + window.location.port : "")
                + "/picsureui/login/";
        }

        let doLoginFlow = function () {
            // We will show the loading message if it is defined

            let url = new URL(window.location.href);
            let code = url.searchParams.get("code");

            if (code) {
                $('#main-content').html("Authentication is successful. Processing UserProfile information...");

                // We have a code, so we can authenticate the user
                $.ajax({
                    url: '/psama/okta/authentication',
                    type: 'post',
                    data: JSON.stringify({
                        code: code
                    }),
                    contentType: 'application/json',
                    success: session.sessionInit,
                    error: handleAuthenticationError
                })

            } else {
                redirectToProvider();
            }
        };

        let handleAuthenticationError = function (data) {
            notification.showFailureMessage("Failed to authenticate with provider. Try again or contact administrator if error persists.")
            history.pushState({}, "", sessionStorage.not_authorized_url ? sessionStorage.not_authorized_url : "/psamaui/not_authorized?redirection_url=/picsureui");
        };

        return {
            authorization: undefined,
            client_id: settings.client_id,
            postRender: undefined,
            displayNotAuthorized: function () {
                $('#main-content').html(HBS.compile(notAuthorizedTemplate)({helpLink: settings.helpLink}));
            },
            showLoginPage: doLoginFlow,
        };
    });
