import {build} from 'aurelia-cli';
import * as gulp from 'gulp';
import * as changedInPlace from 'gulp-changed-in-place';
import * as project from '../aurelia.json';

export default function processMarkup(): void {
  return gulp
    .src(project.markupProcessor.source)
    .pipe(changedInPlace({firstPass: true}))
    .pipe(build.bundle());
}
