'use strict';
var LightLevel = require('lightlevel'),
    themes;

module.exports = {
    configDefaults: {
        lightLevelToSwitch: 980125248,
        lightSyntaxTheme: 'atom-light-syntax',
        darkSyntaxTheme: 'atom-dark-syntax',
        lightUiTheme: 'atom-light-ui',
        darkUiTheme: 'atom-dark-ui',
        switchUiTheme: true,
        switchSyntaxTheme: true,
        logCurrentLightLevel: false
    },
    outdoorThemeLightStream: null,
    lightTheme: null,
    darkTheme: null,
    currentTheme: 'dark',
    activate: function(state) {
        this.outdoorThemeLightStream = LightLevel.returnStream();
        return this.outdoorThemeLightStream.on('data', this.handleLightStreamData.bind(this));
    },
    deactivate: function() {
        return this.outdoorThemeLightStream.stopStream();
    },
    handleLightStreamData : function(lightLevel) {
        var lightLevelToSwitch = atom.config.get('outdoor-theme.lightLevelToSwitch');

        if(lightLevel < lightLevelToSwitch && this.currentTheme === 'light') {
            this.switchToTheme('dark');
        } else if(lightLevel >= lightLevelToSwitch && this.currentTheme === 'dark') {
            this.switchToTheme('light');
        }

        if (atom.config.get('outdoor-theme.logCurrentLightLevel')) {
            console.log(lightLevel);
        }
    },
    switchToTheme: function(theme) {
        var themes = atom.config.get('core.themes'),
            darkSyntaxTheme = atom.config.get('outdoor-theme.darkSyntaxTheme'),
            lightSyntaxTheme = atom.config.get('outdoor-theme.lightSyntaxTheme'),
            darkUiTheme = atom.config.get('outdoor-theme.darkUiTheme'),
            lightUiTheme = atom.config.get('outdoor-theme.lightUiTheme');

        if (atom.config.get('outdoor-theme.switchUiTheme')) {
            themes[0] = (theme === 'dark') ? darkUiTheme : lightUiTheme;
        }

        if (atom.config.get('outdoor-theme.switchSyntaxTheme')) {
            themes[1] = (theme === 'dark') ? darkSyntaxTheme : lightSyntaxTheme;
        }

        atom.config.set('core.themes', themes);
        this.currentTheme = theme;
    }
};
