import {
  ForbiddenError, NotImplementedError, UnauthorizedError, isError,
} from '@essential-projects/errors_ts';
import {IHttpClient} from '@essential-projects/http_contracts';
import {IIdentity} from '@essential-projects/iam_contracts';
import {ExternalAccessor, ManagementApiClient} from '@process-engine/management_api_client';
import {DataModels} from '@process-engine/management_api_contracts';
import {IDiagram, ISolution} from '@process-engine/solutionexplorer.contracts';
import {IFileChangedCallback, ISolutionExplorerRepository} from '@process-engine/solutionexplorer.repository.contracts';

import {v4 as uuid} from 'node-uuid';

interface IParsedDiagramUri {
  baseRoute: string;
  processModelId: string;
}

export class SolutionExplorerManagementApiRepository implements ISolutionExplorerRepository {

  private readonly httpClient: IHttpClient;

  private managementApi: ManagementApiClient;
  private identity: IIdentity;
  private externalAccessorBaseRoute: string;

  private isPolling = false;
  private pollingTimeout: NodeJS.Timeout;

  private eventListeners: Map<string, Function> = new Map<string, Function>();

  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient;
  }

  public watchFile(filepath: string, callback: IFileChangedCallback): void {
    throw new Error('Method not supported.');
  }

  public unwatchFile(filepath: string): void {
    throw new Error('Method not supported.');
  }

  public watchSolution(callback: Function): string {
    const eventListenerId: string = uuid();

    this.eventListeners.set(eventListenerId, callback);

    if (!this.isPolling) {
      this.startPollingForDiagramChange();
    }

    return eventListenerId;
  }

  public unwatchSolution(eventListenerId: string): void {
    this.eventListeners.delete(eventListenerId);
    this.isPolling = false;
    clearTimeout(this.pollingTimeout);
  }

  public async openPath(pathspec: string, identity: IIdentity): Promise<void> {
    if (pathspec.endsWith('/')) {
      pathspec = pathspec.substr(0, pathspec.length - 1);
    }

    const managementApi = this.createManagementClient(pathspec);

    this.managementApi = managementApi;
    this.identity = identity;
  }

  public async getDiagrams(): Promise<Array<IDiagram>> {
    const processModels = await this.managementApi.getProcessModels(this.identity);

    const diagrams = processModels.processModels.map((processModel: DataModels.ProcessModels.ProcessModel): IDiagram => {
      return this.mapProcessModelToDiagram(processModel, this.managementApi);
    });

    return diagrams;
  }

  public async getDiagramByName(diagramName: string): Promise<IDiagram> {
    const processModel = await this.managementApi.getProcessModelById(this.identity, diagramName);

    const diagrams = this.mapProcessModelToDiagram(processModel, this.managementApi);

    return diagrams;
  }

  public async saveSolution(solution: ISolution, pathspec?: string): Promise<void> {
    if (pathspec) {

      const managementApi = this.createManagementClient(pathspec);

      solution.uri = pathspec;
      solution.diagrams.forEach((diagram: IDiagram): void => {
        diagram.uri = `${pathspec}/${diagram.id}`;
      });

      solution.diagrams.map((diagram: IDiagram): Promise<void> => {

        const payload: DataModels.ProcessModels.UpdateProcessDefinitionsRequestPayload = {
          overwriteExisting: true,
          xml: diagram.xml,
        };

        return managementApi.updateProcessDefinitionsByName(this.identity, diagram.id, payload);
      });

      return;
    }

    const promises: Array<Promise<void>> = solution.diagrams.map((diagram: IDiagram): Promise<void> => {
      return this.saveDiagram(diagram);
    });

    await Promise.all(promises);
  }

  public async saveDiagram(diagramToSave: IDiagram, pathspec?: string): Promise<void> {
    const payload: DataModels.ProcessModels.UpdateProcessDefinitionsRequestPayload = {
      overwriteExisting: true,
      xml: diagramToSave.xml,
    };

    if (pathspec) {

      const managementApi = this.createManagementClient(pathspec);
      await managementApi.updateProcessDefinitionsByName(this.identity, diagramToSave.id, payload);

      return;
    }

    const parsedDiagramUri: IParsedDiagramUri = this.parseDiagramUri(diagramToSave.uri);
    await this.managementApi.updateProcessDefinitionsByName(this.identity, parsedDiagramUri.processModelId, payload);
  }

  public async renameDiagram(diagram: IDiagram, newName: string): Promise<IDiagram> {
    throw new NotImplementedError('Renaming diagrams is currently not supported.');
  }

  public async deleteDiagram(diagram: IDiagram): Promise<void> {
    this.managementApi.deleteProcessDefinitionsByProcessModelId(this.identity, diagram.id);
  }

  private async startPollingForDiagramChange(): Promise<void> {
    this.isPolling = true;

    let diagrams: Array<IDiagram>;
    try {
      diagrams = await this.getDiagrams();
    } catch {
      // Do nothing
    }

    this.pollForDiagramChange(diagrams);
  }

  private async pollForDiagramChange(diagrams: Array<IDiagram>): Promise<void> {
    if (!this.isPolling) {
      return;
    }

    this.pollingTimeout = setTimeout(async () => {
      let newDiagrams;

      try {
        newDiagrams = await this.getDiagrams();
      } catch (error) {
        if (isError(error, UnauthorizedError) || isError(error, ForbiddenError)) {
          this.isPolling = false;
          clearTimeout(this.pollingTimeout);
        }
      }

      const diagramsChanged = !this.diagramListsAreEqual(diagrams, newDiagrams);
      if (diagramsChanged) {
        const callbacks: IterableIterator<Function> = this.eventListeners.values();

        for (const callback of callbacks) {
          callback();
        }
      }

      this.pollForDiagramChange(newDiagrams);
    }, 800);
  }

  private diagramListsAreEqual(firstDiagramList: Array<IDiagram>, secondDiagramList: Array<IDiagram>): boolean {
    if (firstDiagramList === undefined || secondDiagramList === undefined) {
      return firstDiagramList === secondDiagramList;
    }

    if (firstDiagramList.length !== secondDiagramList.length) {
      return false;
    }

    return firstDiagramList.every((firstDiagram: IDiagram): boolean => {
      return secondDiagramList.some((secondDiagram: IDiagram): boolean => {
        const diagramsAreEqual: boolean = firstDiagram.id === secondDiagram.id
                                       && firstDiagram.name === secondDiagram.name
                                       && firstDiagram.xml.trim() === secondDiagram.xml.trim();

        return diagramsAreEqual;
      });
    });
  }

  private createManagementClient(baseRoute: string): ManagementApiClient {
    const externalAccessor = new ExternalAccessor(this.httpClient);

    const baseUrl = `${baseRoute}/${(externalAccessor as any).baseUrl}`;
    this.externalAccessorBaseRoute = baseUrl;
    (externalAccessor as any).baseUrl = baseUrl;

    const managementApi = new ManagementApiClient(externalAccessor);

    return managementApi;
  }

  private getBaseRoute(managementApi: ManagementApiClient): string {
    return this.externalAccessorBaseRoute;
  }

  private parseDiagramUri(uri: string): IParsedDiagramUri {
    const lastIndexOfSlash = uri.lastIndexOf('/');

    const baseRoute = uri.substring(0, lastIndexOfSlash);
    const processModelId = uri.substring(lastIndexOfSlash + 1, uri.length);

    return {
      baseRoute: baseRoute,
      processModelId: processModelId,
    };
  }

  private mapProcessModelToDiagram(processModel: DataModels.ProcessModels.ProcessModel, managementApi: ManagementApiClient): IDiagram {
    const baseRoute = this.getBaseRoute(managementApi);

    const diagramUri = `${baseRoute}/${processModel.id}`;

    const diagram = {
      name: processModel.id,
      xml: processModel.xml,
      id: processModel.id,
      uri: diagramUri,
    };

    return diagram;
  }

}
