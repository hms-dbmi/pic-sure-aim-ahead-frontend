define(["header/termsOfService", "common/modal"], function (termsOfService, modal) {
    return {
        /*
         * The path to a logo image incase you don't want the default PrecisionLink one.
         *
         * This should be a String value.
         */
        logoPath: undefined,

        /*
         * This is used to add extra logic after the main header has rendered
         */
        renderExt: function () {
            $(document).on('click', '#open-tos-modal', function (event) {
                modal.displayModal(
                    new termsOfService(),
                    "PIC-SURE Terms of Use",
                    function () {
                        // Focus the help dropdown menu
                        $("#help-dropdown-toggle").focus();
                    },
                    {width: "90em", isHandleTabs: true});
            });
        }
    };
});