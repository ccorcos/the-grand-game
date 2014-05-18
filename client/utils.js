binarySample = function(frac) {
    randomSample = Math.random()
    return randomSample < frac
}

UI.registerHelper('sessionVar', function(string) {
    return Session.get(string)
})


UI.registerHelper('keyValue', function(context, options) {
    var result = [];
    _.each(context, function(value, key, list) {
        result.push({
            key: key,
            value: value
        });
    })
    return result;
});

getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}