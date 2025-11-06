# Organization Language README Stats

GitHub 조직의 언어 사용 통계를 SVG 이미지로 생성하여 README에 embed할 수 있는 웹 서비스입니다.

![Language Stats](https://your-domain.com/k-atusa)

## 기능

- GitHub 조직의 코드에서 많이 사용된 언어를 그래프로 표시
- SVG 형식으로 생성하여 README에 직접 embed 가능
- 간단하고 깔끔한 UI
- Next.js 14 App Router + React + TypeScript
- Edge Runtime으로 빠른 응답

## 사용 방법

### 로컬 개발

1. 의존성 설치:
```bash
npm install
```

2. 개발 서버 실행:
```bash
npm run dev
```

3. 브라우저에서 열기: `http://localhost:3000`

### SVG 생성 API

특정 조직의 언어 통계 SVG를 생성하려면:

```
GET /{organization-name}
```

예시:
- `https://your-domain.com/facebook`
- `https://your-domain.com/google`
- `https://your-domain.com/microsoft`

### README에 임베드하기

GitHub README에 다음과 같이 추가할 수 있습니다:

```markdown
![Language Stats](https://your-domain.com/your-organization)
```

또는 HTML:

```html
<img src="https://your-domain.com/your-organization" alt="Language Stats" />
```

## 프로젝트 구조

```
organization-language-readme-stats/
├── app/
│   ├── [organization]/
│   │   └── route.tsx          # SVG 생성 API 엔드포인트
│   ├── layout.tsx             # 루트 레이아웃
│   ├── page.tsx               # 홈 페이지 (preview & 코드 생성)
│   └── globals.css            # 글로벌 스타일
├── types/
│   └── language.ts            # TypeScript 타입 정의
├── utils/
│   └── colors.ts              # 언어별 색상 정의
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```

## 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Runtime**: Edge Runtime
- **UI Library**: React 18
- **Language**: TypeScript
- **Styling**: CSS
- **Output**: SVG

## 특징

- ✅ SVG 형식으로 직접 README에 embed 가능
- ✅ 화면 좌측 상단에 간단하게 표시
- ✅ 불필요한 gradient 제거
- ✅ Edge Runtime으로 빠른 응답
- ✅ 캐싱 지원 (1시간)

## TODO

- [ ] GitHub API 연동하여 실제 조직 데이터 가져오기
- [ ] 언어별 bytes 계산 및 퍼센트 산출
- [ ] 에러 핸들링 개선
- [ ] 다양한 테마 옵션 추가
- [ ] 캐시 전략 최적화

## 라이선스

MIT License
