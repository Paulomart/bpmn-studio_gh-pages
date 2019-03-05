set -e

git checkout gh-pages

git reset --hard 6e1ac96
git clean -xdf

git clone git@github.com:process-engine/bpmn-studio.git

cd bpmn-studio

npm install
npm run build

cd ..

mv bpmn-studio/* .
rm -fr bpmn-studio

git status
git add -A
git commit -m ":package: Run Build"
