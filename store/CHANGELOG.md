# ChainPlay — 버전별 변경 이력

> Play Store 업데이트 설명 작성 시 참고용.  
> AAB 파일: `/Users/hy/Documents/workspace/apk_build_files/chainPlay/`

---

## v4.0 (versionCode 4)

**AAB**: `chainplay-v4.0.0.aab`  
**상태**: 빌드 완료, 스토어 제출 예정

### 추가
- 체인 공유 기능 — 플레이리스트 화면 우상단 "공유" 버튼으로 체인을 링크로 공유
- 단축 공유 URL — `?n=<이름>&v=<videoId,...>` 형식, 제목은 수신 측에서 oEmbed로 복원 (영상 10개 기준 1,351자 → 266자)
- GitHub Pages 공유 랜딩 페이지 — 영상 목록 미리보기, "앱으로 열기" / Play Store 설치 버튼
- 딥링크(`chainplay://import`)로 공유받은 체인 가져오기 — 확인 후 새 체인으로 추가, 중복 이름 자동 처리
- 카카오톡 공유 미리보기 OG 메타 태그 적용
- 구형식 공유 링크(`?c=base64`) 하위호환 유지

### 스토어 업데이트 설명 (한국어)
체인 공유 기능이 추가되었습니다. 내가 만든 체인을 링크로 공유하고, 받은 링크를 열어 내 앱으로 바로 가져와보세요.

### 스토어 업데이트 설명 (English)
You can now share your chains. Send a chain as a link, and import shared chains directly into your app.

### Play Console 출시 노트 (복붙용)
```
<ko-KR>
체인 공유 기능이 추가되었습니다. 내가 만든 체인을 링크로 공유하고, 받은 링크를 열어 내 앱으로 바로 가져와보세요.
</ko-KR>
<en-US>
You can now share your chains. Send a chain as a link, and import shared chains directly into your app.
</en-US>
```

---

## v3.0 (versionCode 3)

**AAB**: `chainplay-v3.0.0.aab`  
**상태**: 빌드 완료, 스토어 제출 예정

### 추가
- 체인(Chain) 관리 기능 — 플레이리스트를 체인 단위로 분류·관리
- 체인 생성 / 이름 변경 / 삭제 (ChainListScreen)
- 체인별 플레이리스트 화면 (PlaylistScreen) — 체인 ↔ 플레이리스트 화면 전환 구조
- 영상을 다른 체인으로 이동 (MoveToChainModal) — 체인 2개 이상일 때 ↗ 버튼 표시
- 기존 `@yt_playlist` 데이터 자동 마이그레이션 (기본 체인으로 이동)
- 첫 진입 시 체인 개념 안내 배너 표시 (확인 후 영구 숨김)
- `build_aab.sh` — 빌드 후 릴리즈 폴더 자동 복사 기능 추가
- `BUILD.md` — 빌드 위치·절차 문서 추가

### 수정
- 삼성 키보드 상단 툴바 미포함 시 체인 이름 모달 가림 문제 수정 (`overlayPaddingBottom +80px`)

### 스토어 업데이트 설명 (한국어)
플레이리스트를 체인으로 정리할 수 있습니다. 체인을 만들고 영상을 원하는 체인으로 이동해보세요.

### 스토어 업데이트 설명 (English)
Organize your playlists with chains. Create chains and move videos between them easily.

---

## v2.0 (versionCode 2)

**AAB**: `chainplay-v2.0.aab`  
**상태**: 빌드 완료, 스토어 제출 예정

### 추가
- 한/영 다국어 지원 — 시스템 언어가 한국어면 한국어, 나머지는 영어로 자동 전환
- 다국어 적용 범위: 헤더, 플레이리스트, 플레이어, URL 추가 모달, 에러 메시지 전체

### 스토어 업데이트 설명 (한국어)
시스템 언어에 따라 한국어/영어가 자동으로 전환됩니다.

### 스토어 업데이트 설명 (English)
The app now automatically switches between Korean and English based on your system language.

---

## v1.0 (versionCode 1)

**AAB**: `chainplay-v1.0.aab`  
**상태**: 빌드 완료, 최초 스토어 제출용

### 포함된 기능
- 유튜브 URL 붙여넣기로 플레이리스트 추가 (youtube.com/watch, youtu.be, shorts 지원)
- 자동 연속 재생 — 한 영상이 끝나면 다음 영상으로 자동 이동
- 플레이리스트 순서 변경 (▲▼ 버튼)
- 영상 삭제
- 플레이리스트 로컬 저장 (앱 종료 후에도 유지)
- 이전/다음 버튼으로 수동 이동
- 다크 테마 UI

---

## 버전 업 체크리스트

새 버전 빌드 전 확인사항:

- [ ] `android/app/build.gradle` — `versionCode` +1, `versionName` 변경
- [ ] `app.json` — `version`, `android.versionCode` 동일하게 변경
- [ ] 이 파일에 버전 항목 추가
- [ ] `git tag v{버전}` 태깅
- [ ] AAB 빌드 후 `/Users/hy/Documents/workspace/apk_build_files/chainPlay/` 에 복사
