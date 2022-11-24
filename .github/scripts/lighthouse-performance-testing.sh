#!/bin/bash
set -ex
cd $MODULE_PATH

rm -rf centreon-injector
git clone https://github.com/centreon/centreon-injector.git
cd centreon-injector
git checkout 21.10.x
composer install
cd ..

docker cp centreon-injector lighthouse-tests-centreon:/usr/share
docker exec lighthouse-tests-centreon sed -i 's/127.0.0.1/localhost/g' /usr/share/centreon-injector/.env
docker exec lighthouse-tests-centreon bash -c "cd /usr/share/centreon-injector && bin/console centreon:inject-data --password=centreon" || true
docker exec lighthouse-tests-centreon bash -c "centreon -u admin -p centreon -a APPLYCFG -v 1"

npm ci --legacy-peer-deps

npm start