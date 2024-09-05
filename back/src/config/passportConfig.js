// Passport 라이브러리를 사용하여 사용자 인증을 관리
const passport = require("passport");
// LocalStrategy를 사용하여 사용자 이름과 비밀번호로 로그인할 수 있게 하기
const LocalStrategy = require("passport-local").Strategy;
// 데이터베이스 연결 풀을 가져와 사용
const pool = require("./db");
// bcrypt 라이브러리를 사용하여 비밀번호를 해싱하고 비교
const bcrypt = require("bcrypt");

// passport의 LocalStrategy를 설정
passport.use(
    new LocalStrategy(
        {
            usernameField: "username",  // 클라이언트로부터 입력 받은 사용자 이름 필드
            passwordField: "password",  // 클라이언트로부터 입력 받은 비밀번호 필드
        },
        async(username, passport, done)=> {
            try{
                // 데이터베이스에서 사용자 찾기
                const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);

                // 사용자가 존재하지 않는 경우
                if(!rows.length){
                    return done(null, false, {message: "잘못된 아이디입니다."});
                }

                // 데이터베이스에서 조회된 사용자 정보
                const user = rows[0];

                // 사용자가 입력한 비밀번호와 데이터베이스에 저장된 해시된 비밀번호를 비교
                const isValidPassword = await bcrypt.compare(password, user.password);

                // 비밀번호가 일치하지 않는 경우
                if(!isValidPassword){
                    return done(null, false, {message: "잘못된 비밀번호입니다."});
                }

                // 인증에 성공하면 사용자 객체 반환
                return done(null, user);
            }catch(error){
                // 오류가 발생한 경우
                return done(error);
            }
        }
    )
);

// 사용자 세션 관리를 위한 serialize와 deserialize 설정
passport.serializeUser((user, done) => {
    done(null, user.id); // 세션에 사용자 ID를 저장
});

passport.deserializeUser(async (id, done) => {
    try{
        // 데이터베이스에서 사용자 정보를 다시 가져오기
        const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
        done(null, rows[0]);
    }catch(error){
        done(error);
    }
});

// 다른 파일에서 passport를 사용할 수 있도록 내보내기