/**
 * Created by mats on 07.02.15.
 */

Template.upload.events({
    'change input': function(ev) {
        _.each(ev.srcElement.files, function(file) {
            Meteor.saveFile(file, file.name);
        });
    }
});