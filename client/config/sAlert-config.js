import { Meteor } from 'meteor/meteor';
/* global sAlert */

Meteor.startup(() => {
  sAlert.config({
    effect: '',
    position: 'bottom',
    timeout: 3000,
    html: false,
    onRouteClose: true,
    stack: true,
        // or you can pass an object:
        // stack: {
        //     spacing: 10 // in px
        //     limit: 3 // when fourth alert appears all previous ones are cleared
        // }
    offset: 0, // px - will be added to first alert (bottom or top - depends on position in config)
    beep: false,
    onClose: () => {},
        // examples:
        // onClose: function() {
        //     /* Code here will be executed once the alert closes. */
        // }
  });
});
