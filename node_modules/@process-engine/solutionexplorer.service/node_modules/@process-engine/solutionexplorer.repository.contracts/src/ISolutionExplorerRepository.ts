import {IIdentity} from '@essential-projects/iam_contracts';
import {IDiagram, ISolution} from '@process-engine/solutionexplorer.contracts';

import {IFileChangedCallback} from './index';

export interface ISolutionExplorerRepository {

  /**
   * Monitors the specified file and calls the specified callback if the file has been moved, renamed, or the content changed.
   *
   * @param filepath The path of the file to watch.
   * @param callback The function that gets called as soon as the file was changed/moved.
   */
  watchFile(filepath: string, callback: IFileChangedCallback): void;

  /**
   * Stops watching the specified file.
   *
   * @param filepath The path of the file that should no longer be watched.
   */
  unwatchFile(filepath: string): void;

  /**
   * Monitors the solution and calls the specified callback if something in the solution has changed.
   *
   * @param callback The function that gets called as soon as the something in the solution was changed.
   *
   * @returns The id of the created EventListener, which is used to remove the EventListener.
   */
  watchSolution(callback: Function): string;

  /**
   * Removes an EventListener by its id.
   *
   * @param eventListenerId The id of the EventListener that should be removed.
   */
  unwatchSolution(eventListenerId: string): void;

  /**
   * Opens the given pathspec with the identity. This method will ensure, that
   * the pathspec exists and is readable.
   *
   * @param pathspec The path specification to load.
   * @param identity The identity that is used to authorize, currently unused.
   */
  openPath(pathspec: string, identity: IIdentity): Promise<void>;

  /**
   * Gets all diagrams that are present in the loaded solution.
   *
   * @returns A promise, resolving to all diagrams in the loaded solution.
   */
  getDiagrams(): Promise<Array<IDiagram>>;

  /**
   * Get a single diagram from the current solution.
   *
   * @param diagramName The name of the diagram to load.
   * @param pathspec The pathspec from which to load the diagram.
   * @returns A promise, resolving to the loaded diagram.
   */
  getDiagramByName(diagramName: string, pathspec?: string): Promise<IDiagram>;

  /**
   * Saves the given solution and all its diagrams. If a solution already
   * exists, it will be overriden.
   *
   * @param solution The solution to save.
   * @param pathspec The target pathspec.
   */
  saveSolution(solution: ISolution, pathspec?: string): Promise<void>;

  /**
   * Save a single diagram, if a diagram already exists, it will be overriden.
   *
   * @param diagram The diagram to save.
   * @param pathspec The target path for the save operation, defaults to the source
   *             of the diagram if omitted.
   */
  saveDiagram(diagramToSave: IDiagram, pathspec?: string): Promise<void>;

  /**
   * Deletes the diagram from the solution.
   *
   * @param diagram The diagram to delete.
   * @returns A promise, resolving once the diagram has been deleted.
   * @throws {ForbiddenError} When required claims are missing.
   */
  deleteDiagram(diagram: IDiagram): Promise<void>;

  /**
   * Renames the diagram to the given name.
   *
   * @param diagram The diagram to rename.
   * @param newName The new name of the diagram.
   * @returns A promise, resolving with the renamed diagram.
   * @throws {ForbiddenError} When required claims are missing.
   */
  renameDiagram(diagram: IDiagram, newName: string): Promise<IDiagram>;
}
