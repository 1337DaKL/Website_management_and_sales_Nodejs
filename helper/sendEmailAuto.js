module.export= nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'luongtrinh2k3ndad@gmail.com',
        pass: 'oimg wcft fjet jwwu',
    },
    tls: {
        rejectUnauthorized: false,
    },
});