/**
 * Created by mats on 21.02.15.
 */

// https://github.com/tomitrescak/meteor-uploads


Meteor.startup(function() {
    Uploader.finished = function(index, fileInfo, templateContext) {
        Files.insert(fileInfo);
        console.log("File uploaded");
    }
});