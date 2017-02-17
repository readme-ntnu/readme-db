import { Meteor } from 'meteor/meteor';
/* global sAlert */

// Various helper methods
const Helpers = {

    // Finds the intersection of two arrays of search results
  intersect(a, b) {
    const res = [];
    for (let i = 0; i < a.length; i++) {
      for (let j = 0; j < b.length; j++) {
        if (a[i]._id === b[j]._id) {
          res.push(a[i]);
        }
      }
    }
    return res;
  },

    // Checks if two arrays are equal.
    // Enforces order, so that i.e. equalsArray([1, 2], [2, 1]) returns false.
  equalsArray(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) { return false; }
    }
    return true;
  },

    // Computes the correct url from the edition and pages properties of an article
  getUrlFromEdition(edition, pages) {
    const y = edition.substring(0, 4);
    // Get correct PDF page number. Those before 2013-06 are single-page PDFs.
    const p = (edition < '2013-06') ? pages[0] : String(Math.floor(Number(pages[0]) / 2) + 1);
    const base = 'http://readme.abakus.no/';
    return `${base}utgaver/${y}/${edition}.pdf#page=${p}`;
  },

    // Check connection status. If not connected, warn user.
  checkConnectionStatus() {
    const connected = Meteor.status().connected;
    if (!connected) sAlert.error('Ingen tilkobling til server. Er du koblet til internett?');
    return connected;
  },

};

export default Helpers;
