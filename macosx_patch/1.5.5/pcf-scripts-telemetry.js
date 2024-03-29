"use strict";
// Copyright (C) Microsoft Corporation. All rights reserved.
Object.defineProperty(exports, "__esModule", { value: true });
exports.flushTelemetry = exports.trackException = exports.trackEvent = exports.BuildSource = exports.TelemetryEvent = void 0;
const os = require("os");
const localfileusersettings_1 = require("./localfileusersettings");
const customtelemetryconfiguration_1 = require("./customtelemetryconfiguration");
const path = require("path");
const process = require('process');
const uuidv4 = require('uuid/v4');
const appInsights = require('applicationinsights');
let applicationPath = '';
if (os.type() === 'Darwin') {
    applicationPath = path.join(os.homedir(), 'Library', 'Preferences', 'Microsoft', 'PowerAppsCli');
}
else if (os.type() === 'Linux') {
    applicationPath = path.join(env.XDG_CONFIG_HOME || path.join(homedir, '.config'), 'Microsoft', 'PowerAppsCli')
}
else {
    applicationPath = path.join(process.env.LOCALAPPDATA, 'Microsoft', 'PowerAppsCli');
}
const settings = localfileusersettings_1.readUserSettings(applicationPath);
const telemetrySource = process.env.PAC_TELEMETRY_SOURCE;
let client;
if (settings.telemetryEnabled) {
    appInsights.setup(customtelemetryconfiguration_1.applicationInsightsKey)
        .setAutoCollectExceptions(false)
        .start();
    client = appInsights.defaultClient;
    client.config.disableAppInsights = !settings.telemetryEnabled;
    client.context.tags[client.context.keys.userId] = settings.uniqueId;
    client.context.tags[client.context.keys.cloudRoleInstance] = '#####';
    client.context.tags[client.context.keys.sessionId] = uuidv4();
}
var TelemetryEvent;
(function (TelemetryEvent) {
    TelemetryEvent[TelemetryEvent["Start"] = 0] = "Start";
    TelemetryEvent[TelemetryEvent["End"] = 1] = "End";
    TelemetryEvent[TelemetryEvent["StartExecutingVerb"] = 2] = "StartExecutingVerb";
    TelemetryEvent[TelemetryEvent["EndExecutingVerb"] = 3] = "EndExecutingVerb";
})(TelemetryEvent = exports.TelemetryEvent || (exports.TelemetryEvent = {}));
var BuildSource;
(function (BuildSource) {
    BuildSource[BuildSource["VisualStudio"] = 0] = "VisualStudio";
    BuildSource[BuildSource["MSBuild"] = 1] = "MSBuild";
    BuildSource[BuildSource["NPM"] = 2] = "NPM";
})(BuildSource = exports.BuildSource || (exports.BuildSource = {}));
function trackEvent(eventName, customProperties, customMeasurements) {
    if (client) {
        if (telemetrySource) {
            if (!customProperties) {
                customProperties = {};
            }
            customProperties['TelemetrySource'] = telemetrySource;
        }
        client.trackEvent({ name: TelemetryEvent[eventName], properties: customProperties, measurements: customMeasurements });
    }
}
exports.trackEvent = trackEvent;
function trackException(error, customProperties, customMeasurements) {
    if (client) {
        if (telemetrySource) {
            if (!customProperties) {
                customProperties = {};
            }
            customProperties['TelemetrySource'] = telemetrySource;
        }
        // client.trackException({ exception: error, properties: customProperties, measurements: customMeasurements });
    }
}
exports.trackException = trackException;
function flushTelemetry() {
    if (client) {
        client.flush({
            isAppCrashing: false,
            callback: (arg) => {
                // result from server
            }
        });
    }
}
exports.flushTelemetry = flushTelemetry;
