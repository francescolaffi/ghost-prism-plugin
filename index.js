var fs = require('fs'),
    path = require('path'),
    _ = require('underscore'),
    express = require('express'),
    when = require('when'),
    GhostPlugin = require('../../../core/server/plugins/GhostPlugin'),
    PrismPlugin;

function buildPrism(config) {
    var prismDir = path.join(__dirname, 'vendor', 'prism'),
        buildDir = path.join(__dirname, 'assets', 'built'),
        definitions, js = [], css =[];

    definitions = JSON.parse(fs.readFileSync(path.join(__dirname, 'definitions.json')));

    // validate config
    config.theme = (config.theme && definitions.themes[config.theme]) ? config.theme : 'default';
    config.langs = _.intersection(_.keys(definitions.langs), config.langs)
    config.plugins = _.intersection(definitions.plugins, config.plugins)

    function prismPath(type, id) {
        return definitions.paths[type].replace(/\{id}/g, id);
    }

    // core js
    js.push(prismPath('components', 'core'));

    // theme css
    css.push(prismPath('themes', definitions.themes[config.theme]));

    // resolve langs dependencies and add js
    var langs = [];
    function langWalker (lang) {
        if (_.contains(langs, lang)) { return; }
        if (definitions.langs[lang]) {
            langWalker(definitions.langs[lang]);
        }
        langs.push(lang);
        js.push(prismPath('components', lang));
    }
    _.each(config.langs, langWalker);

    // plugins js and css
    _.each(config.plugins, function(plugin) {
        var file = prismPath('plugins', plugin);
        if (fs.existsSync(path.join(prismDir, file+'.min.js'))) { js.push(file+'.min.js'); }
        if (fs.existsSync(path.join(prismDir, file+'.css'))) { css.push(file+'.css'); }
    });

    // concat and save
    function concat(sources, dest){
        var str = _.reduce(sources, function (s, source){
            return s+'/* '+source+' */\n'+fs.readFileSync(path.join(prismDir, source))+'\n';
        }, '');
        fs.writeFileSync(dest, str);
    }
    fs.existsSync(buildDir) || fs.mkdirSync(buildDir);
    concat(js, path.join(buildDir, 'prism.js'));
    concat(css, path.join(buildDir, 'prism.css'));
}

function ghostFootFilter (parts) {
    parts.push('<script src="/plugins/prism/assets/prism-loader.js"></script>');
    return parts;
}

PrismPlugin = function (ghost) {
    GhostPlugin.call(this, ghost);
}
 
_.extend(PrismPlugin.prototype, GhostPlugin.prototype, {
    activate: function () {
        // todo check if plugin activation supports async/promise

        buildPrism(this.app.config()['prism'] || {});

        this.app.registerFilter('ghost_foot', ghostFootFilter);

        this.app.server.use('/plugins/prism/assets', express['static'](path.join(__dirname, 'assets')));
    },
 
    deactivate: function () {
        this.app.unregisterFilter('ghost_foot', ghostFootFilter);
    }
});

module.exports = PrismPlugin;