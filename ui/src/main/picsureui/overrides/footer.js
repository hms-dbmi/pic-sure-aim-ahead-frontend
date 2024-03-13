define(["handlebars",
        "text!overrides/footer.hbs",
        "common/modal",
        "common/session",
        "common/pic-sure-dialog-view",
        "middleware/middleware",
        "common/redirect-modal"
    ],
    function (HBS, template, modal, session, dialog, Middleware, redirectModal) {
        return {
            /*
             * The render function for the footer can be overridden here.
             */
            render: function () {
                new Middleware();

                const aimAheadMessage = [
                    "This external website will be opened as a new tab in your browser.",
                    "Are you sure you want to leave PIC-SURE?"
                ];
                const aimAheadHeaderMessage = "Leaving PIC-SURE";

                let redirect = new redirectModal({message: aimAheadMessage, headerMessage: aimAheadHeaderMessage});

                // Using .off() to prevent multiple event handlers from being attached
                $(document).off('click', 'a[target="_blank"]').on('click', 'a[target="_blank"]', function (event) {
                    event.preventDefault();
                    redirect.render(event);
                });
            }
        };
    });
