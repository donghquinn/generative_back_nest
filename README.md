# INTRO

본 레포지토리는 Koa.js로 작성된 본인의 기존 레포지토리의 Nest.js로 래핑한 리펙토링 버전입니다.

# 사용법

chat GPT 회원가입 후 API 토큰 발급

환경부스에 해당 키를 담는다.

postgres 데이터베이스 서버를 구동한 후 DATABASE_URL로 연결할 수 있게 한다.

npx prisma migrate dev --schema=./src/assets/schema.prisma --name <Database Name> 명령어를 내려 마이그레이션을 진행한다.

## Super Resolution(SR) - 2023.12

- 이미지 해상도 향상 AI 서비스
- 일단 만들기는 했으나... 서버 리소스가.... 안되네요.. 만들어두고 로컬에서만 돌리는...
- I've already implemented Super Resolution backend, but I couldn't deploy it because of Server's Computer Resources.
    - [레포지토리](https://github.com/dongMLLab/ISR_super_resolution)

## User

- 회원가입 요청의 비밀번호를 인코딩시키며 인코딩에 사용한 토큰 값을 리턴
- 로그인 요청 시 해당 email과 password에 해당하는 토큰 값을 응답
    - 로그인 요청의 password는 같은 방식으로 인코딩하여 쿼리에 사용
    - 모든 요청의 헤더에 해당 토큰 값을 삽입하며 유저 인증

## Image Generation

Body 값
prompt: 이미지 생성에 사용할 프롬프트
n: 생성할 이미지 개수
size: 이미지 사이즈. 세가지 사이즈만 가능

## Chat Completion

[공식 API 문서](https://platform.openai.com/docs/api-reference/chat/create)

Body
    * model(required): 사용할 GPT 모델
    * content(required): 프롬프트 내용


## Audio - 진행 예정
### Translate
Body 값
file: 번역할 파일
prompt: (optional) 번역에 사용할 프롬프트
response_format: 응답 형식 (json / text)
