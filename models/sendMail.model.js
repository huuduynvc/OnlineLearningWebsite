const mailer = require('nodemailer');

var transporter = mailer.createTransport({ // config mail server
    service: 'Gmail',
    auth: {
        user: 'huuduynvc10@gmail.com',
        pass: 'huuduy2011'
    }
});

//truyen vo email 
module.exports = {
    sendOTP: email => {
        const data = {};
        data.otp = '';
        data.email = email;

        //generate random otp
        var i;
        var num;
        for (i = 0; i < 6; i++) {
            num = Math.floor(Math.random() * 10);
            data.otp += num.toString();
        }
        //gui otp

        var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
            from: 'Test',
            to: data.email,
            subject: 'Kích hoạt tài khoản Rekdu',
            text: 'You recieved message from ' + 'huuduynvc10@gmail.com',
            html: '<p>Bạn có một mã OTP để kích hoạt tài khoản</b><ul><li>OTP code:' + data.otp + '</li></ul>'
        }
        transporter.sendMail(mainOptions, function(err, info) {
            if (err) {
                console.log(err);
            } else {
                console.log('Message sent: ' + info.response);
            }
        });

        return data;
    },
};