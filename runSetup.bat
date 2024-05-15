@echo off

REM Prompt the user to enter the database password
 @ECHO OFF
 set "psCommand=powershell -Command "$pword = read-host 'Enter database Password' -AsSecureString ; ^
      $BSTR=[System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($pword); ^
            [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)""
 for /f "usebackq delims=" %%p in (`%psCommand%`) do set password=%%p

REM Create the JavaScript file
echo var mysql = require('mysql2'); > database.js
echo. >> database.js
echo var con = mysql.createConnection({ >> database.js
echo   host: "127.0.0.1", >> database.js
echo   user: "root", >> database.js
echo   password: "%password%", >> database.js
echo   database: "data", >> database.js
echo   multipleStatements: true >> database.js
echo }); >> database.js
echo. >> database.js
echo con.connect(function(err) { >> database.js
echo   if (err) throw err; >> database.js
echo   console.log("Connected!"); >> database.js
echo }); >> database.js
echo. >> database.js
echo module.exports = con; >> database.js

REM Inform the user
echo MySQL connection file created successfully.

mysql -u root -p%password% -e "CREATE DATABASE data;"

echo Installing Packages....
npm install --save mysql2
npm install

echo Completed Setup. Running program



