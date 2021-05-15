echo "Patch Module: $1"
cp ./macosx_patch/1.5.5/pcf-start-telemetry.js ./$1/node_modules/pcf-start/generated/telemetry.js
cp ./macosx_patch/1.5.5/pcf-scripts-telemetry.js ./$1/node_modules/pcf-scripts/generated/telemetry.js
cp ./macosx_patch/1.5.5/pcf-scripts-startTask.js ./$1/node_modules/pcf-scripts/tasks/startTask.js
