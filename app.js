// Setup variables
const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const port = process.env.PORT || 3000;

// Initialize environment
app.set('view engine', 'ejs');
app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Home route
app.get('/', (req, res) => res.render('contact', {msg: ''}));

// Send mail via Nodemailer
app.post('/send', (req,res) => {
  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>
      <li>Name: ${req.body.name}</li>
      <li>Company: ${req.body.company}</li>
      <li>Email: ${req.body.email}</li>
      <li>Phone: ${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: '<smtp.mailserver.com>', // SMTP Client address
    port: 465, // usually 465 (SSL) or 587 (TLS)
    secure: true, // true for 465, false for other ports
    auth: {
      user: '<username@client.com>', // SMTP Client username
      pass: '<password>' // SMTP Client password
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Nodemailer Contact" <username@client.com>', // Sender address
    to: '<receiver@client.com>', // Receiver
    subject: 'Node Contact Request', // Subject line
    text: 'Hello world?', // plain text body
    html: output // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) return console.log(error);
    console.log('Message sent: %s', info.messageId);
    res.render('contact', {msg: 'Email has been sent!'});
  });
});

// Start the server
app.listen(port, () => console.log(`Server started on port ${port}`));