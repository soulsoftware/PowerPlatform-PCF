"use strict";
// Copyright (C) Microsoft Corporation. All rights reserved.
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartHarnessTask = void 0;
const os = require("os");
const fs = require("fs");
const path = require("path");
const child_process_1 = require("child_process");
const diagnosticMessages_generated_1 = require("../diagnosticMessages.generated");
const locale_1 = require("../generated/locale");
class StartHarnessTask {
    constructor(watchOn) {
        this._watchOn = watchOn;
    }
    getDescription() {
        return locale_1.translate(diagnosticMessages_generated_1.strings.task_start_harness.key);
    }
    setOptions(options) {
        this._options = options;
    }
    run(context) {
        const outDir = context.getOutDir();
        if (!outDir) {
            context.getDiagnostic().push(diagnosticMessages_generated_1.strings.buildconfig_no_outdir);
            return Promise.reject();
        }
        const controls = fs.readdirSync(outDir);
        if (controls.length === 0) {
            context.getDiagnostic().push(diagnosticMessages_generated_1.strings.pcf_scripts_start_missing_control);
            return Promise.reject();
        }
        return new Promise((resolve, reject) => {
            const outputDir = path.join(outDir, controls[0]);
            // spawn a child process of pcf-start to launch the harness locally
            const args = `pcf-start ${this._watchOn ? '--watch' : ''} --codePath ${outputDir}`;
            let pcfStartCmd;
            if (os.type() === 'Windows_NT') {
                pcfStartCmd = child_process_1.spawn('cmd', ['/c', args]);
            }
            else {
                pcfStartCmd = child_process_1.spawn('/bin/sh', ['-c', args]);
            }            
            pcfStartCmd.stdout.on('data', (data) => {
                console.log(data.toString());
            });
            pcfStartCmd.stderr.on('data', (data) => {
                console.log(data.toString());
            });
            pcfStartCmd.on('close', (code) => {
                if (code !== 0) {
                    context.getDiagnostic().pushA(diagnosticMessages_generated_1.strings.pcf_start_exited, [code]);
                    return reject();
                }
                else {
                    return resolve();
                }
            });
        });
    }
}
exports.StartHarnessTask = StartHarnessTask;
