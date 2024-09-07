// 필요한 모듈 불러오기
const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs'); // 비밀번호 암호화를 위한 모듈
const multer = require('multer'); // 파일 업로드를 위한 모듈
const sharp = require('sharp'); // 이미지 처리를 위한 모듈
const fs = require('fs'); // 파일 시스템 조작을 위한 모듈
const pool = require('./config/db'); // MySQL 데이터베이스 연결 설정
const { sendVerificationEmail, sendResetPasswordCode } = require('./utils/emailSender'); // 이메일 전송 유틸리티
const { handleError, createOperationalError } = require('./utils/errorUtils'); // 오류 처리 유틸리티
const { validateInputs } = require('./utils/validators'); // 입력값 검증 유틸리티

// Express 애플리케이션 생성
const app = express();
const port = process.env.PORT || 3001; // 포트 설정, 환경변수에서 가져오거나 기본값 3001 사용

// JSON 본문 파싱 미들웨어 추가
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 파일 저장 위치 및 이름 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // 파일이 저장될 경로
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // 파일 이름 설정 (현재 시간 + 확장자)
    }
});

// 파일 필터 설정: PNG 파일만 허용
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png') {
        cb(null, true); // PNG 파일일 경우 통과
    } else {
        cb(new Error('PNG 파일만 업로드 가능합니다.'), false); // 그 외 파일은 오류 발생
    }
};

// multer 설정: 파일 저장과 필터 적용
const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

// 정적 파일 서빙 설정
app.use(express.static(path.join(__dirname, 'controllers', 'user')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 회원가입 라우트
app.post('/api/register', upload.single('profile_image'), async (req, res) => {
    const { username, email, password, name, phone_number, birth_date } = req.body;
    let profile_image = req.file ? req.file.path : null;

    // 입력값 검증
    const errors = validateInputs(req.body);
    if (errors.length > 0) {
        return res.status(400).json({ message: errors.join(', ') });
    }

    // 프로필 이미지가 있는 경우 이미지 처리
    if (profile_image) {
        const outputPath = profile_image.replace(path.extname(profile_image), '-processed.png');

        try {
            // 파일 접근 확인 및 이미지 처리
            await fs.promises.access(profile_image, fs.constants.F_OK | fs.constants.R_OK);
            await sharp(profile_image)
                .resize(800) // 이미지 크기 조정
                .toFile(outputPath);

            fs.unlinkSync(profile_image); // 원본 파일 삭제
            profile_image = outputPath; // 처리된 파일 경로 업데이트
        } catch (err) {
            console.error('이미지 처리 오류:', err);
            return res.status(500).json({ message: '이미지 처리 중 오류가 발생했습니다.' });
        }
    }

    try {
        // 비밀번호 암호화 및 DB에 저장
        const password_hash = await bcrypt.hash(password, 10);
        const query = `INSERT INTO users (username, email, password_hash, name, phone_number, birth_date, profile_image)
                       VALUES (?, ?, ?, ?, ?, ?, ?)`;

        await pool.execute(query, [username, email, password_hash, name, phone_number, birth_date, profile_image]);
        res.status(200).json({ message: '회원가입이 완료되었습니다!' });
    } catch (err) {
        console.error('데이터베이스 오류:', err);
        handleError(err, res);
    }
});

// 로그인 라우트
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const query = `SELECT * FROM users WHERE email = ?`;
        const [rows] = await pool.execute(query, [email]);

        if (rows.length === 0) {
            return res.status(400).json({ message: '존재하지 않는 사용자입니다.' });
        }

        const user = rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password_hash);

        if (!passwordMatch) {
            return res.status(400).json({ message: '비밀번호가 잘못되었습니다.' });
        }

        res.json({
            message: '로그인에 성공했습니다.',
            user: {
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error('데이터베이스 오류:', err);
        handleError(err, res); // 오류 핸들링
    }
});

// 비밀번호 재설정을 위한 인증 코드 발송 라우트
app.post('/api/send-reset-code', async (req, res) => {
    const { email } = req.body;
    const resetCode = Math.floor(100000 + Math.random() * 900000); // 6자리 인증 코드 생성

    try {
        await sendResetPasswordCode(email, resetCode); // 인증 코드 발송
        res.status(200).json({ message: '비밀번호 재설정 인증 코드가 이메일로 발송되었습니다.' });
    } catch (err) {
        console.error('이메일 전송 오류:', err);
        handleError(err, res); // 오류 핸들링
    }
});

// 서버 실행
app.listen(port, () => {
    console.log(`서버가 ${port}번 포트에서 실행 중입니다.`);
});
