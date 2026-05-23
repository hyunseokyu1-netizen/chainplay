#!/bin/bash
set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
ANDROID_HOME="${ANDROID_HOME:-$HOME/Library/Android/sdk}"
OUTPUT="$PROJECT_DIR/android/app/build/outputs/bundle/release/app-release.aab"
RELEASE_DIR="/Users/hy/Documents/workspace/apk_build_files/chainPlay"

# app.json에서 버전 읽기
VERSION=$(node -e "console.log(require('./app.json').expo.version)")

echo "=== ChainPlay AAB 빌드 ==="
echo "프로젝트: $PROJECT_DIR"
echo "버전: $VERSION"
echo "저장 위치: $RELEASE_DIR/chainplay-v${VERSION}.aab"
echo ""

cd "$PROJECT_DIR/android"
ANDROID_HOME="$ANDROID_HOME" ./gradlew bundleRelease

echo ""
echo "=== 빌드 완료 ==="
echo "파일: $OUTPUT"
echo "크기: $(du -sh "$OUTPUT" | cut -f1)"

# 릴리즈 폴더에 복사
mkdir -p "$RELEASE_DIR"
cp "$OUTPUT" "$RELEASE_DIR/chainplay-v${VERSION}.aab"

echo ""
echo "=== 저장 완료 ==="
echo "$RELEASE_DIR/chainplay-v${VERSION}.aab"
ls -lh "$RELEASE_DIR/"
