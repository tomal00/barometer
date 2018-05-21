cd ./web/frontend
mkdir ./assets/css
mkdir ./assets/js
npm i

cd ../backend
mkdir transpiled
npm i

npm run build

cd ../frontend
npm run webpack

cd src/scss
sass main.scss ../../assets/css/style.css --style compressed

cd ../../../..
node ./web/backend/transpiled/index.js &
python ./raspberry/script.py
