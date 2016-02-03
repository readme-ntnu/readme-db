# Article database for readme
readme is a magazine for students of Computer Science and Communication Technology. Published editions can be found
at [readme.abakus.no](http://readme.abakus.no).

This app holds data about every article ever published in readme (well, not _all_ yet, but will in the future!), and
allows searching to find the edition you are looking for. For example, if you're thinking "Hmm, I remember readme
had an article about Raspberry Pi once... But I have no idea what edition that was published in, or even what year it was",
then a [quick search for Raspberry Pi](http://readme.byrkje.land/raspberry+pi) will give you the answer you're looking for.

The article database is currently served on [http://readme.byrkje.land](http://readme.byrkje.land).

### Cool features
- Permalinks ([readme.byrkje.land/the+words+i+search+for](http://readme.byrkje.land/the+words+i+search+for))
- Every article (from edition 2013-05) has a link to its specific page in its PDF

## Development

### Setup

1. Install [Meteor](https://www.meteor.com/) 
2. Get all the files and start the server:  
```
$ git clone git@github.com:draperunner/readme-db.git  
$ cd readme-db  
$ meteor
```
3. Fill database with article data. (PS! Not updated! For dev purposes only)  
`$ mongorestore --host 127.0.0.1:3001 -d meteor articles.bson`
4. Edit `lib/account_settings`, set `forbidClientAccountCreation` to false. This lets you create a user. 
Set it to true again after you have created a user.
