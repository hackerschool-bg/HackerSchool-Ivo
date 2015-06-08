    // default configuration settings as specified by the user
var config = require('./config.js'),   

    // used for reading files from streams and buffers
    bytes = require('bytes'),

    //
    he = require('he'),

    // module ofr manipulating the file system
    fs = require('graceful-fs');

// outputs the last modified time in a readable format
function generateDateString(date){
    var text = '',
        date = new Date(date),
        months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // show 00:01:01 instead of 0:1:1
    function cat(str){
        return str.toString().length === 1 ? '0'+str : str;
    }

    text += cat(date.getDate());
    text += '-';
    text += months[date.getMonth()];
    text += '-';
    text += date.getFullYear();
    text += ' ';
    text += cat(date.getHours());
    text += ':';
    text += cat(date.getMinutes());

    return text;
}

//takes as input the server response (for the callback) and the path to the requested file
module.exports = function(res, file) {
    var fileList = '' + fs.readdirSync(file),
        // array of all allowed filetypes according to config.extensions
        allowedExtensions = config.extensions.split(', ');
        fileStats;

    // create an array of all files in the current directory
    fileList = fileList.split(',');

    // change the format of the current directory
    if(file.charAt(file.length-1) !== '/') {
        file += '/';
    }

    // list of all subdirectories that will be returned to the request.
    var dirList = [];    
    var dirCount = 0;

    // list of all files that will be returned to the request
    var allowedFileList = [];
    var allowedFileCount = 0;

    // go through every single file in the chosen directory
    for (var i = fileList.length - 1; i >= 0; i--) {

        //console.log('file list: ' + fileList[i]);

        if( !config.hidden && fileList[i].charAt(0) === '.' ) {
            console.log('File '+ fileList[i] + ' has been hidden from the user.');
            fileList[i]='';
        }

        // get the properties of the chosen file (isDirectory, size, mtime)
        fileStats = fs.statSync(file + '' + fileList[i]);

        // handle directories
        if( fileStats.isDirectory() ) {
            // ignore the directories if the config file specifies that directories should not be shown
            if(config.dirs){
                fileList[i]='-';
            } 
            // otherwise add the directory to the dirList array and remore it from the file list
            else {
                dirList[dirCount]=fileList[i];
                fileList[i]='-';
                dirCount++;
            }
        }

        // in case the file is not a directory
        else {
            // if it is a hidden file handle it according to the specifications in config.hidden
            if(fileList[i].charAt(0) === '.'){
                if(config.hidden){
                    allowedFileList[allowedFileCount] = fileList[i];
                    allowedFileCount++;
                }
            } 
            // proceed if it is a regular file
            else {
                // get the extension of the selected file
                var currentExtension = fileList[i].split('.');
                currentExtension = currentExtension[currentExtension.length - 1];
                // 
                for (var j = allowedExtensions.length - 1; j >= 0; j--) {
                    //console.log('allowed ' + allowedExtensions[j] + ' actual ' + fileList[i] + ' from ' + currentExtension + ' is ' +(allowedExtensions[j] === currentExtension));
                    if(allowedExtensions[j] === currentExtension) {
                        //console.log('The file is ' + fileList[i]);
                        allowedFileList[allowedFileCount] = fileList[i];

                        allowedFileCount++;
                        break;
                    }
                };
            }
        }
    };

    // sort the files and directories
    allowedFileList = allowedFileList.sort();
    dirList = dirList.sort();

    dirStats = [];
    dirStatsCount = 0;

    // create an array with the properties of every subdirectory (if any)
    for (var i = dirList.length - 1; i >= 0; i--) {
        if(dirList[i] !== '-'){
            dirStats[dirStatsCount] = fs.statSync(file + '' + dirList[i]);
            dirStatsCount++;
        }
    };

    allowedFileProp = [];
    allowedFilePropCount = 0;    

    // create an array with the properties of every file in the directory (if any)
    for (var i = allowedFileList.length - 1; i >= 0; i--) {
        if(allowedFileList[i] !== ''){
            allowedFileProp[allowedFilePropCount] = fs.statSync(file + '' + allowedFileList[i]);
            allowedFilePropCount++;   
        }
    };

    function createHtml(res, dirs, files) {

        var html = '<head><title>' + 
                   'Directory listing for ' + file + 
                   '</title>' +
                   '</head>' ;

        //get the css theme as specified in config.js
        try{
            var theme = require('./themes.js')[config.theme];
             html += '<body style="' + theme + '">';
            console.log('Theme active.');

        } catch (e) {
            console.log('The specified theme does not exist.');
            html += '<body>';
        }

        
        html += '<center><h1>Index of ' + file + '</h1><br/>\n';
        html += '<table class="directory-listing">\n';

        // table header
        html += '<tr>';
        html += '<th>name</th>';
        html += '<th>size</th>';
        html += '<th>last modified</th>';
        html += '</tr>\n';

        var parentDir = file;
        if (file.charAt(file.length-1) !== '/') {
            parentDir += '/../';
        } else {
            parentDir += '../';
        }

        html += '<tr class="directory"><td><a href="http://' + config.address + ':' + config.port + '/' + parentDir + '">..</a></td><td colspan="2"> &nbsp;</td></tr>';

        // generate an HTML page that displays all subdirectories with their corresponding
        // name, link to their content and last modification time
        function writeDirRow(subdir, subdirStats){
            html += '<tr class="dir">\n';

            // name
            html += '<td class="name">';
            html += '<a href="http://' + config.address + ':' + config.port + '/' + file  + subdir +'">' + subdir + '</a>';
            html += '</td>\n';

            // size
            html += '<td class="file-size">';
            html += '-';
            html += '</td>\n';

            // last modified
            html += '<td class="last-modified">';
            html += generateDateString(subdirStats.mtime);
            html += '</td>\n';

            // end the row
            html += '</tr>\n';
        }

        // calls the writeDirRow function for every directory with its corresponding dirProperites
        for (var i = dirList.length - 1; i >= 0; i--) {
            if(dirList[i] !== ''){
                writeDirRow(dirList[i], dirStats[dirList.length - i - 1]);
            }
        };

        // generate an HTML page that displays all files with their corresponding
        // name, link to their content, filesize and last modification time
        function writeFileRow(fileName, allowedFileProp) {
            html += '<tr class="file">\n';

            // name
            html += '<td class="name">';
            html += '<a href="http://' + config.address + ':' + config.port + '/' + file  + fileName +'">' + fileName + '</a>';
            html += '</td>\n';

            // size
            html += '<td class="file-size">';
            html += allowedFileProp.size;
            html += '</td>\n';

            // last modified
            html += '<td class="last-modified">';
            html += generateDateString(allowedFileProp.mtime);
            html += '</td>\n';

            // end the row
            html += '</tr>\n';
        }

        // calls the writeFileRow function for every file with its corresponding fileProperites
        for (var i = allowedFileList.length - 1; i >= 0; i--) {
            if(allowedFileList[i] !== ''){
                writeFileRow(allowedFileList[i], allowedFileProp[allowedFileList.length - i - 1]);
            }
        };

        html += '</table></center></body>';

        // callback to the server with the newly generated html
        res(200, { "Content-Type": "text/html" }, html);

    }

    createHtml(res, dirList, fileList);
}