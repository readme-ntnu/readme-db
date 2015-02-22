/**
 * Created by mats on 22.02.15.
 */

Template.showFiles.helpers({
    'files': function() {
        return Files.find().fetch();
    }
});