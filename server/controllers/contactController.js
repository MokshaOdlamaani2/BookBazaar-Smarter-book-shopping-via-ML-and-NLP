import nodemailer from 'nodemailer';

export const sendContactMail = async (req, res) => {
  const { sellerEmail, buyerName, buyerEmail, message } = req.body;
  if (!sellerEmail || !buyerName || !buyerEmail || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"${buyerName}" <${buyerEmail}>`,
      to: sellerEmail,
      subject: 'Interest in your BookBazaar Listing',
      text: message,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Nodemailer error:', error);
    res.status(500).json({ error: 'Failed to send message.' });
  }
};
