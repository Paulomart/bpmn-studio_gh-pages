import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
import * as moment from 'moment';
import * as path from 'path';

import {LogEntry} from '@process-engine/logging_api_contracts';

import {parseLogEntry} from './parser/parser';

export function targetExists(targetPath: string): boolean {
  return fs.existsSync(targetPath);
}

export async function ensureDirectoryExists(targetFilePath: string): Promise<void> {

  // eslint-disable-next-line consistent-return
  return new Promise<void>((resolve: Function, reject: Function): void => {

    const parsedPath = path.parse(targetFilePath);

    const targetDirectoryExists = fs.existsSync(parsedPath.dir);
    if (targetDirectoryExists) {
      return resolve();
    }

    mkdirp(parsedPath.dir, (error: Error, data: string): void => {

      if (error) {
        return reject(error);
      }

      return resolve();
    });
  });
}

export async function writeToLogFile(targetFilePath: string, entry: string): Promise<void> {

  return new Promise<void>((resolve: Function, reject: Function): void => {
    const fileStream = fs.createWriteStream(targetFilePath, {flags: 'a'});

    // Note: using "end" instead of "write" will result in the stream being closed immediately afterwards, thus releasing the file.
    fileStream.end(`${entry}\n`, 'utf-8', (): void => {
      return resolve();
    });
  });
}

export function readAndParseDirectory(dirPath: string): Array<LogEntry> {

  const logfileNames = fs.readdirSync(dirPath);

  const correlationLogs: Array<LogEntry> = [];

  for (const fileName of logfileNames) {
    const fullFilePath = path.join(dirPath, fileName);
    const logFileEntries = readAndParseFile(fullFilePath);
    Array.prototype.push.apply(correlationLogs, logFileEntries);
  }

  return correlationLogs;
}

export function readAndParseFile(filePath: string): Array<LogEntry> {

  const logFileContent = fs.readFileSync(filePath, 'utf-8');

  const logEntriesRaw = logFileContent.split('\n');

  // Filter out empty lines, comments and the final new line.
  const logEntriesFiltered = logEntriesRaw.filter((entry: string): boolean => {
    const isNotEmpty = entry.length > 0;
    const isNotAComment = !entry.startsWith('#');
    return isNotEmpty && isNotAComment;
  });

  const convertedLogs = logEntriesFiltered.map(parseLogEntry);
  const logEntries = convertedLogs.filter((entry): boolean => entry !== undefined);

  return logEntries;
}

export async function moveLogFileToArchive(archiveFolderPath, fileToMove): Promise<void> {

  const timeTagForArchivedFile = moment()
    .toISOString()
    .replace(/:/g, '_')
    .replace(/\./g, '_');

  const sourceFileInfo = path.parse(fileToMove);

  const archivedFileName = `${sourceFileInfo.name}-${timeTagForArchivedFile}${sourceFileInfo.ext}`;
  const archivedFilePath = path.resolve(archiveFolderPath, archivedFileName);

  await ensureDirectoryExists(archivedFilePath);

  fs.renameSync(fileToMove, archivedFilePath);
}
