define(["jquery", "backbone", "handlebars", "text!header/termsOfService.hbs"], function($, BB, HBS, template){
    return BB.View.extend({
        initialize: function(opts){
            this.template = HBS.compile(template);
        },
        events: {
            "click #open-tos-modal": "openModal",
            "click #close-tos-modal": "closeModal"
        },
        closeModal: function(){
            // clicks the close button on the modal
            $('.close').click();
        },
        openModal: function(event){
        // this is to get around an additional model opening when the user clicks the button
            event.stopPropagation();

            this.$el.html(this.template);
            $('#tos-modal').modal('show');
        },
        render: function(){
            this.$el.html(this.template);
        }
    });
});