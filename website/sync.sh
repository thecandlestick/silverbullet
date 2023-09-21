#!/bin/bash
git pull
cp -r ./* ../mysilverbullet/website/
pushd ../mysilverbullet/website/
git add .
git commit -m "$(date)"
git push
popd
