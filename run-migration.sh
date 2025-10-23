#!/bin/bash

# 팁 게시판 플래그 마이그레이션 실행 스크립트
echo "팁 게시판 플래그 마이그레이션을 시작합니다..."

# Node.js가 설치되어 있는지 확인
if ! command -v node &> /dev/null; then
    echo "Node.js가 설치되어 있지 않습니다. Node.js를 먼저 설치해주세요."
    exit 1
fi

# 마이그레이션 실행
node run-migration.js

if [ $? -eq 0 ]; then
    echo "마이그레이션이 성공적으로 완료되었습니다!"
else
    echo "마이그레이션 실행 중 오류가 발생했습니다."
    exit 1
fi
