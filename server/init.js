/**
 * Created by mats on 21.02.15.
 */

Meteor.startup(function () {
    UploadServer.init({
        tmpDir: process.env.PWD + '/public/utgaver/tmp',
        uploadDir: process.env.PWD + '/public/utgaver/',
        checkCreateDirectories: true, //create the directories for you
        acceptFileTypes: /.pdf/i
    })
});