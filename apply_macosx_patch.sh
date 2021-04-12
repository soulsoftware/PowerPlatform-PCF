echo "Patch Module: $1"
cp ./macosx_patch/pcf-start-telemetry.js ./$1/node_modules/pcf-start/generated/telemetry.js
cp ./macosx_patch/pcf-scripts-telemetry.js ./$1/node_modules/pcf-scripts/generated/telemetry.js
cp ./macosx_patch/pcf-scripts-startTask.js ./$1/node_modules/pcf-scripts/tasks/startTask.js