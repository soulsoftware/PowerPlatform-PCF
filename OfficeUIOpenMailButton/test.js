const { exec } = require("child_process");

const messageid = [
    "AAQkADZkODkxMWVjLTk2Y2QtNDU3Ny04ZGU5LTg2MzZlZWEzYTA3MgAQABITj1YNZypJmxsGGSZN22g%3D",
    "AAQkADZkODkxMWVjLTk2Y2QtNDU3Ny04ZGU5LTg2MzZlZWEzYTA3MgAQAFsL%2FYcrm01Lgg6MX%2Baz1Vc%3D"
]
const url = 'https://outlook.office.com/owa/?ItemID=' + messageid[0] + '&viewmodel=ReadMessageItem&path=&exvsurl=1'
const url2 = 'https://outlook.office.com/mail/deeplink/readconv/' + messageid[1] + '?popoutv2=1&version=20210405005.04'
exec("open \"" + url2 + "\"", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});

