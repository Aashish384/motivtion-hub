import nodemailer from "nodemailer";

export const sendPasswordResetEmail = async (user, data) => {
  var transport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "raiaashish384@gmail.com",
      pass: "jnipcncpehrrewtd",
    },
  });

  const info = await transport.sendMail({
    from: '"Aashish Rai "<raiaashish384@gmail.com>',
    to: user.email,
    subject: "Password reset",
    html: `<p>Click on the link here to reset your password.</p><br></br><p>Reset link= http://localhost:7777/new-password/${user.passwordResetString}</p>`,
  });
};
export const sendPasswordResetSuccessEmail = async (user, data) => {
  var transport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "raiaashish384@gmail.com",
      pass: "jnipcncpehrrewtd",
    },
  });

  const info = await transport.sendMail({
    from: '"Aashish Rai "<raiaashish384@gmail.com>',
    to: user.email,
    subject: "Your password was reset",
    html: `<p>You have successfully reset the password and can now login with the new password.</p>`,
  });
};
