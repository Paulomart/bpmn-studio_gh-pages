import {BadRequestError, InternalServerError, NotFoundError} from '@essential-projects/errors_ts';
import {IIdentity} from '@essential-projects/iam_contracts';
import {IDiagram, ISolution} from '@process-engine/solutionexplorer.contracts';
import {IFileChangedCallback, ISolutionExplorerRepository} from '@process-engine/solutionexplorer.repository.contracts';

import * as fs from 'fs';
import * as path from 'path';
import {promisify} from 'util';
import {v4 as uuid} from 'node-uuid';

const BPMN_FILE_SUFFIX = '.bpmn';

export class SolutionExplorerFileSystemRepository implements ISolutionExplorerRepository {

  private readonly trashFolderLocation: string;
  private basePath: string;
  private identity: IIdentity;

  private solutionWatchers: Map<string, fs.FSWatcher> = new Map<string, fs.FSWatcher>();
  private waitingSolutionWatcherIds: Array<string> = [];
  private watchers: Map<string, fs.FSWatcher> = new Map<string, fs.FSWatcher>();
  private filesWaitingFor: Array<string> = [];

  private readFile: (path: fs.PathLike, encoding: string) => Promise<string> = promisify(fs.readFile);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private writeFile: (path: fs.PathLike, data: any) => Promise<void> = promisify(fs.writeFile);
  private rename: (oldPath: fs.PathLike, newPath: fs.PathLike) => Promise<void> = promisify(fs.rename);

  constructor(trashFolderLocation: string) {
    this.trashFolderLocation = trashFolderLocation;
  }

  public watchFile(filepath: string, callback: IFileChangedCallback): void {
    let isCollectingEvents = false;
    let eventsOccured: Array<string> = [];

    const watcher = fs.watch(filepath, async (event: string, newFilename: string): Promise<void> => {
      eventsOccured.push(event);
      if (isCollectingEvents) {
        return;
      }

      isCollectingEvents = true;
      await this.wait100Ms();

      const occuredEvent = eventsOccured.includes('rename') ? 'rename' : 'change';

      callback(occuredEvent, filepath, newFilename);

      const fileNoLongerExists = !fs.existsSync(filepath);
      if (fileNoLongerExists) {
        this.unwatchFile(filepath);

        this.filesWaitingFor.push(filepath);
        await this.waitUntilFileExists(filepath);

        this.watchFile(filepath, callback);

        callback('restore', filepath, this.getFilenameByPath(filepath));
      }

      isCollectingEvents = false;
      eventsOccured = [];
    });

    this.watchers.set(filepath, watcher);
  }

  public unwatchFile(filepath: string): void {
    const watcher = this.watchers.get(filepath);

    if (this.filesWaitingFor.includes(filepath)) {
      this.filesWaitingFor.splice(this.filesWaitingFor.indexOf(filepath), 1);
    }

    const watcherDoesNotExist = watcher === undefined;
    if (watcherDoesNotExist) {
      return;
    }

    watcher.close();

    this.watchers.delete(filepath);
  }

  public watchSolution(callback: Function): string {
    const eventListenerId: string = uuid();

    const watchSolution = async (): Promise<void> => {
      callback();

      const solutionNoLongerExists = !fs.existsSync(this.basePath);
      if (solutionNoLongerExists) {
        this.unwatchSolution(eventListenerId);

        try {
          this.waitingSolutionWatcherIds.push(eventListenerId);

          await this.waitUntilSolutionExists(eventListenerId);
        } catch {
          return;
        }

        const newWatcher = fs.watch(this.basePath, watchSolution);

        this.solutionWatchers.set(eventListenerId, newWatcher);

        callback();
      }
    };

    const watcher = fs.watch(this.basePath, watchSolution);

    this.solutionWatchers.set(eventListenerId, watcher);

    let folderIsRemoved = false;
    const healthCheckInterval = setInterval(() => {
      const eventListenerWasRemoved = !this.solutionWatchers.has(eventListenerId);
      if (eventListenerWasRemoved) {
        clearInterval(healthCheckInterval);

        return;
      }

      const folderExists = fs.existsSync(this.basePath);
      if (folderIsRemoved && folderExists) {
        folderIsRemoved = false;

        callback();
      } else if (!folderIsRemoved && !folderExists) {
        folderIsRemoved = true;

        callback();
      }
    }, 200);

    return eventListenerId;
  }

  public unwatchSolution(eventListenerId: string): void {
    const watcherDoesNotExist = !this.solutionWatchers.has(eventListenerId);
    if (watcherDoesNotExist) {
      return;
    }

    const watcher = this.solutionWatchers.get(eventListenerId);

    watcher.close();

    this.solutionWatchers.delete(eventListenerId);
    if (this.waitingSolutionWatcherIds.includes(eventListenerId)) {
      this.filesWaitingFor.splice(this.waitingSolutionWatcherIds.indexOf(eventListenerId), 1);
    }
  }

  public async openPath(pathspec: string, identity: IIdentity): Promise<void> {
    await this.checkForDirectory(pathspec);

    this.basePath = pathspec;
    this.identity = identity;
  }

  public async getDiagrams(): Promise<Array<IDiagram>> {
    const filesInDirectory = fs.readdirSync(this.basePath, {withFileTypes: true});
    const bpmnFiles: Array<string> = [];

    for (const file of filesInDirectory) {
      if (!file.isDirectory() && file.name.endsWith(BPMN_FILE_SUFFIX)) {
        bpmnFiles.push(file.name);
      }
    }

    const diagrams: Array<Promise<IDiagram>> = bpmnFiles
      .map(async (file: string): Promise<IDiagram> => {

        const fullPathToFile = path.join(this.basePath, file);
        const fileNameWithoutBpmnSuffix = path.basename(file, BPMN_FILE_SUFFIX);

        const xml = await this.readFile(fullPathToFile, 'utf8');

        const diagram: IDiagram = {
          name: fileNameWithoutBpmnSuffix,
          uri: fullPathToFile,
          xml: xml,
        };

        return diagram;
      });

    return Promise.all(diagrams);
  }

  public async getDiagramByName(diagramName: string, newPath?: string): Promise<IDiagram> {
    const pathSpec = newPath || this.basePath;

    const fullPathToFile = path.join(pathSpec, `${diagramName}.bpmn`);

    const xml = await this.readFile(fullPathToFile, 'utf8');

    const diagram: IDiagram = {
      name: diagramName,
      uri: fullPathToFile,
      xml: xml,
      id: fullPathToFile,
    };

    return diagram;
  }

  public async saveDiagram(diagramToSave: IDiagram, newPathSpec?: string): Promise<void> {
    const newPathSpecWasSet = newPathSpec !== null && newPathSpec !== undefined;
    let pathToWriteDiagram = diagramToSave.uri;

    if (newPathSpecWasSet) {
      pathToWriteDiagram = newPathSpec;
    }

    try {
      await this.checkWriteablity(pathToWriteDiagram);
    } catch (error) {
      const folderDoesNotExist: boolean = error.code === 404;
      if (folderDoesNotExist) {
        await fs.promises.mkdir(path.dirname(pathToWriteDiagram), {recursive: true});

        await this.checkWriteablity(pathToWriteDiagram);
      } else {
        throw error;
      }
    }

    try {
      await this.writeFile(pathToWriteDiagram, diagramToSave.xml);
    } catch (e) {
      const error = new InternalServerError('Unable to save diagram.');
      error.additionalInformation = e;

      throw error;
    }
  }

  public async saveSolution(solution: ISolution, pathToSolution?: string): Promise<void> {
    const newPathWasSet = pathToSolution !== undefined && pathToSolution !== null;

    if (newPathWasSet) {
      await this.openPath(pathToSolution, this.identity);
    }

    const promises = solution.diagrams.map((diagram: IDiagram): Promise<void> => {
      return this.saveDiagram(diagram);
    });

    await Promise.all(promises);
  }

  public async deleteDiagram(diagram: IDiagram): Promise<void> {
    try {
      await this.checkForDirectory(this.trashFolderLocation);
    } catch (error) {
      throw new BadRequestError('Trash folder is not writeable.');
    }

    const desiredName = path.join(this.trashFolderLocation, diagram.name + BPMN_FILE_SUFFIX);
    const targetFile = await this.findUnusedFilename(desiredName);

    await this.rename(diagram.uri, targetFile);
  }

  public async renameDiagram(diagram: IDiagram, newName: string): Promise<IDiagram> {
    const nameWithSuffix = newName + BPMN_FILE_SUFFIX;
    const newDiagramUri = path.join(this.basePath, nameWithSuffix);

    await this.checkWriteablity(newDiagramUri);

    const diagramNameChanged = newName.toLowerCase() !== diagram.name.toLowerCase();
    const fileAlreadyExists = fs.existsSync(newDiagramUri);
    if (fileAlreadyExists && diagramNameChanged) {
      throw new BadRequestError(`A file named: ${newName} already exists in location: ${this.basePath}.`);
    }

    await this.rename(diagram.uri, newDiagramUri);

    const renamedDiagram = await this.getDiagramByName(newName);

    return renamedDiagram;
  }

  private wait100Ms(): Promise<void> {
    return new Promise((resolve: Function): void => {
      setTimeout((): void => {
        resolve();
      }, 100);
    });
  }

  private getFilenameByPath(filepath: string): string {
    const filename = filepath.replace(/^.*[\\/]/, '');

    return filename;
  }

  private waitUntilFileExists(filepath: string): Promise<void> {
    return new Promise((resolve: Function): void => {

      const interval = setInterval((): void => {
        if (!this.filesWaitingFor.includes(filepath)) {
          clearInterval(interval);

          return;
        }

        if (fs.existsSync(filepath)) {
          clearInterval(interval);
          resolve();
        }
      }, 500);
    });
  }

  private waitUntilSolutionExists(eventListenerId: string): Promise<void> {
    return new Promise((resolve: Function, reject: Function): void => {
      const interval = setInterval((): void => {

        const eventListenerWasRemoved = !this.waitingSolutionWatcherIds.includes(eventListenerId);
        if (eventListenerWasRemoved) {
          reject(new Error('Solution no longer gets watched.'));

          return;
        }

        if (fs.existsSync(this.basePath)) {
          clearInterval(interval);

          resolve();
        }
      }, 500);
    });
  }

  /**
   * Tries to construct a filename that is currently unused. The method will
   * keep adding parts to the desiredName until its the filename is unused.
   *
   * @param desiredName the desired name of the file.
   * @return a filename that is currently unused.
   */
  private async findUnusedFilename(desiredName: string): Promise<string> {
    let currentName = desiredName;
    let attempt = 1;

    while (fs.existsSync(currentName)) {
      currentName = `${desiredName}.${attempt}`;
      attempt++;
    }

    return currentName;
  }

  private async checkForDirectory(directoryPath: string): Promise<void> {
    const pathDoesNotExist = !fs.existsSync(directoryPath);
    if (pathDoesNotExist) {
      throw new NotFoundError(`'${directoryPath}' does not exist.`);
    }

    const stat = fs.statSync(directoryPath);
    const pathIsNotADirectory = !stat.isDirectory();
    if (pathIsNotADirectory) {
      throw new BadRequestError(`'${directoryPath}' is not a directory.`);
    }
  }

  private async checkWriteablity(filePath: string): Promise<void> {
    const directoryPath = path.dirname(filePath);

    await this.checkForDirectory(directoryPath);
  }

}
