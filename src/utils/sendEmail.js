import nodemailer from "nodemailer";

async function sendEmail({ to, subject, html }) {
  // sender
  const transporter = nodemailer.createTransport({
    host: "localhost",
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
      user: "eslamaboudesheesh@gmail.com",
      pass: "bsqm jjqm aauo myjd",
    },
  });

  const info = await transporter.sendMail({
    from: ' "Desho"  eslamaboudesheesh@gmail.com',
    to,
    subject,
    html,
  });
  // i always send one email every time to one user
  if (info.accepted.length < 1) return false;
  return true;
}

export default sendEmail;
