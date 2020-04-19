#!/bin/sh

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

cd "${SCRIPT_DIR}"
rm *.jar

cd "${SCRIPT_DIR}/front"
npm run build:prod

cd "${SCRIPT_DIR}/back"
rm -rf src/main/resources/static/*
cp -rf "${SCRIPT_DIR}/front/dist/front/"* src/main/resources/static/
#mvn clean install
mvn clean package -Pproduction

cd ${SCRIPT_DIR}
cp "${SCRIPT_DIR}/back/target/"*.jar .
