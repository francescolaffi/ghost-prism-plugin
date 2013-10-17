#!/usr/bin/env node

var https = require('https'),
    fs = require('fs'),
    _ = require('underscore'),
    bower = require('bower');

// download prism with bower
bower.commands.install(['prism#gh-pages'], {}, {directory: 'vendor'});

// prepare info on prism themes, langs and plugins
https.get('https://raw.github.com/LeaVerou/prism/gh-pages/components.js', function(res) {
    var script = '';

    res.on('data', function (chunk) {
        script += chunk;
    });

    res.on('end', function () {
        var components, definitions = {};
        eval(script);

        definitions.themes = {default: 'prism'};
        _.each(_.without(_.keys(components.themes), 'meta', 'prism'), function (theme) {
            definitions.themes[theme.substr(6)] = theme;
        });
        definitions.langs = {};
        _.each(_.omit(components.languages, 'meta'), function (info, lang) {
            definitions.langs[lang] = info.require || null;
        });
        definitions.plugins = _.without(_.keys(components.plugins), 'meta');

        definitions.paths = {
            themes: components.themes.meta.path,
            components: components.languages.meta.path+'.min.js',
            plugins: components.plugins.meta.path
        }

        fs.writeFileSync('definitions.json', JSON.stringify(definitions));
    });
});