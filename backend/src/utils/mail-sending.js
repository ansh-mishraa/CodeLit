 import nodemailer from 'nodemailer'
 export const mailService = async(mailOptions)=>{
    try {
        
        const transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            secure: false, // true for port 465, false for other ports
            auth: {
              user: "da841f432a62a1",
              pass: "fe5d28ef4df0e2",
            },
          });
          
          // async..await is not allowed in global scope, must use a wrapper
          
            // send mail with defined transport object
            const info = await transporter.sendMail(
            //     {
            //   from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
            //   to: "bar@example.com, baz@example.com", // list of receivers
            //   subject: "Hello ✔", // Subject line
            //   text: "Hello world?", // plain text body
            //   html: "<b>Hello world?</b>", // html body
            // }
            mailOptions
        );
          return info;
            console.log("Message sent: %s", info.messageId);
            // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
          }
          
     catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Email service not available"
        })
        
    }
 }