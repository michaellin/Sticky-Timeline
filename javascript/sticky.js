$(function(){
    var Sticky = Backbone.Model.extend({

        defaults: function() {
            return {
                links: new Array(),
                xCoor: document.width/2,
                yCoor: 100
            };
        },

        initialize: function() {
            if (!this.get("xCoor")) {
                this.set({"xCoor" : this.defaults.title});
            },
            if (!this.get("yCoor")) {
                this.set({"yCoor" : this.defaults.title});
            },
        },
    };
});
