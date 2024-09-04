// 사용자 인증을 위한 Passport 설정 파일
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const pool = require("./db"); // DB 설정 가져오기
const bcrypt = require("bcrypt");

// 로컬 전략을 사용한 Passport 설정
passport.use(new LocalStrategy(
    {
        usernameField: "username",  // 사용자가 입력한 사용자명 필드명
        passwordField: "password",  // 사용자가 입력한 비밀번호 필드명
    },
    async(username, password, done) => {
        try{
            // 사용자명으로 사용자 조회
            const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);
            if(rows.length === 0){
                return done(null, false, {message: "사용자를 찾을 수 없습니다."});
            }
            const user = rows[0];

            // 비밀번호 해시 검증
            const isMatch = await bcrypt.compare(password, user.password); // 해시된 비밀번호와 입력된 비밀번호 비교
            if(!isMatch){
                return done(null, false, {message: "비밀번호가 일치하지 않습니다."});
            }

            return done(null, user); // 인증 성공 시 사용자 객체 반환

        }catch(err){
            return done(err);
        }
    }
));

// 사용자 회원가입 시 비밀번호 해싱하여 데이터베이스에 저장하는 함수
async function registerUser({username, password, name, birthdate, phoneNumber, email}){
    try{
        const saltRounds = 10; // 해싱 강도 설정(숫자가 높으면 해싱 강도가 높지만 처리하는 데 시간이 오래걸림)
        const hashedPassword = await bcrypt.hash(password, saltRounds); // 비밀번호 해싱 처리

        // 사용자 등록 SQL 쿼리 실행
        const [result] = await pool.query(
            "INSERT INTO users (username, password, name, birthdate, phone_number, email, created_at) VALUES (?,?,?,?,?,?, NOW())",
            [username, hashedPassword, name, birthdate, phoneNumber, email]
        );

        if(result.affectedRows === 1){
            console.log("사용자가 성공적으로 등록되었습니다.");
        } else{
            console.log("사용자 등록에 실패하였습니다.");
        }
    }catch(err){
        console.error("사용자 등록 중 오류 발생: ", err);
    }
}

// Passport 설정과 registerUser 함수 내보내기
module.exports = passport;
module.exports.registerUser = registerUser;