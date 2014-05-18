Template.random.events({
    'click #roll': function(event, template) {
        min = parseInt($(".min.rand")[0].value)
        max = parseInt($(".max.rand")[0].value)

        roll = getRandomInt(min, max)
        Session.set("random", roll)
    }
})

Template.random.rendered = function() {
    Session.set("random", null)
}