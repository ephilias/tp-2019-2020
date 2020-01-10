/**
 * CowsayController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

var cowsay = require('cowsay');
var nodemailer = require('nodemailer');

module.exports = {
  /**
   * `CowsayController.say()`
   */
  say: async function (req, res) {
    let count = await Sentences.count();
    console.debug('Got '+count+' sentences in database');
    let s = await Sentences.find().limit(1).
      skip(Math.floor(Math.random() * Math.floor(count)));
    let sentence = "Random Message";
    if(s.length > 0) {
      sentence = s[0].sentence;
    }
    return res.view('cowsay', { cow: cowsay.say({
      f: process.env.COW || 'stegosaurus',
      text : sentence,
      e : 'oO',
      T : 'U '
    })});
  },

  add: async function (req, res) {
    return res.view('add');
  },

  create: async function(req, res) {
    await Sentences.create({ sentence: req.param('sentence') });
    return res.redirect('/say');
  },

  admin: async function(req, res) {
    return res.view('admin');
  },

  send: async function(req, res) {
    //@TODO send
    nodemailer.createTransport({
      host: "smtp://postmaster@mailgun.l3o.eu:fedbe91ae5e3529f94528dd311bea4c9-060550c6-d42c872f@smtp.mailgun.org:587",
      port: 587,
      secure: false, // upgrade later with STARTTLS
      auth: {
        user: "username",
        pass: "password"
      }
    });

    let count = await Sentences.count();
    for (let i = 0; i < count; i++) {

      let s = await Sentences.find().limit(i);
      let sentence = "Random Message";
      if(s.length > 0) {
        sentence = s[0].sentence;
      }

      let email = "random@email.email"
      if(s.length > 0) {
        email = s[0].email;
      }

      const mailOptions = {
        from: 'cdad@l3o.eu', // sender address
        to: email, // list of receivers
        subject: 'Sentence', // Subject line
        html: '<p>' + sentence + '</p>'// plain text body
      };

      transporter.sendMail(mailOptions, function (err, info) {
       if(err)
         console.log(err)
       else
         console.log(info);
      });
    }


    return res.redirect('/say');
  },
};
