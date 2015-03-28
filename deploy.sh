#!/bin/bash

# Assumes cbosco.github.com repo in
# ~/Projects/cbosco.github.com local folder

# Requires broccoli-cli. npm install -g broccoli-cli
echo DEPLOY_REPO_DIR = '~/Projects/cbosco.github.com'
echo BUILD_TEMP_DIR = ./dist
echo BUILD_REPO_DIR = ${PWD}

cd $DEPLOY_REPO_DIR && git rm -rf .
rm -rf $BUILD_TEMP_DIR
cd $BUILD_REPO_DIR && export BROCCOLI_ENV=production && broccoli build $BUILD_TEMP_DIR
mv -f ${$BUILD_TEMP_DIR}/* DEPLOY_REPO_DIR
#cd $DEPLOY_REPO_DIR && git add . && git commit -m "Compiled asset update from projects-chrisbosco.github.com"

