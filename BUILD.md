# ChainPlay 빌드 가이드

## 빌드 저장 위치

| 파일 종류 | 저장 경로 |
|---|---|
| AAB (Play Store 배포) | `/Users/hy/Documents/workspace/apk_build_files/chainPlay/chainplay-v{VERSION}.aab` |
| APK (USB 디버깅 설치) | `android/app/build/outputs/apk/release/app-release.apk` (임시, 저장 안 함) |

## 버전 업 절차

1. `app.json`에서 `version`과 `versionCode` 올리기
   - `version`: `"3.0.0"` → `"4.0.0"`
   - `versionCode`: `3` → `4` (정수, Play Store에서 반드시 이전보다 커야 함)

## AAB 빌드 (Play Store 배포용)

```bash
# 프로젝트 루트에서 실행
./build_aab.sh
```

빌드 완료 후 자동으로 `/Users/hy/Documents/workspace/apk_build_files/chainPlay/chainplay-v{VERSION}.aab` 에 복사됨.

## APK 빌드 + USB 설치 (테스트용)

```bash
cd android && \
ANDROID_HOME=~/Library/Android/sdk ./gradlew assembleRelease && \
~/Library/Android/sdk/platform-tools/adb install -r \
  app/build/outputs/apk/release/app-release.apk && \
echo "설치 완료"
```

> 서명 충돌 시 (`INSTALL_FAILED_UPDATE_INCOMPATIBLE`): 기기에서 앱 삭제 후 재설치

## 기기 확인

```bash
~/Library/Android/sdk/platform-tools/adb devices
# 연결된 기기: R5KYA01JSXA (삼성 갤럭시)
```

## 릴리즈 목록

| 버전 | versionCode | 날짜 | 주요 변경 |
|---|---|---|---|
| 1.0.0 | 1 | - | 최초 릴리즈 |
| 2.0.0 | 2 | - | 다국어 지원 |
| 3.0.0 | 3 | 2026-05-24 | 폴더 관리 기능 |
