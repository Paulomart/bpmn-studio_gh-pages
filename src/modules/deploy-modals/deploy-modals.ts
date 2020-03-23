import {inject} from 'aurelia-framework';
import {EventAggregator, Subscription} from 'aurelia-event-aggregator';

import environment from '../../environment';
import {ISolutionEntry} from '../../contracts';
import {SolutionService} from '../../services/solution-service/solution.service';

@inject(EventAggregator, 'SolutionService')
export class DeployModals {
  public showRemoteSolutionOnDeployModal: boolean = false;
  public showOverwriteDiagramModal: boolean = false;
  public remoteSolutions: Array<ISolutionEntry>;

  public saveDiagramAndDeploy: Function;

  public cancelMultipleRemoteSolutionModal: Function;
  public selectRemoteSolution: Function;

  public cancelOverwriteModal: Function;
  public overwriteDiagram: Function;

  private solutionService: SolutionService;

  private subscriptions: Array<Subscription>;
  private eventAggregator: EventAggregator;

  constructor(eventAggregator: EventAggregator, solutionService: SolutionService) {
    this.eventAggregator = eventAggregator;
    this.solutionService = solutionService;
  }

  public attached(): void {
    this.subscriptions = [
      this.eventAggregator.subscribe(
        environment.events.deployModals.showRemoteSolutionSelectionModal,
        (callback: Function) => {
          this.handleRemoteSolutionSelection(callback);
        },
      ),

      this.eventAggregator.subscribe(
        environment.events.deployModals.showOverwriteDiagramModal,
        (callback: Function) => {
          this.handleOverwriting(callback);
        },
      ),
    ];
  }

  public detached(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.dispose();
    });
  }

  public handleRemoteSolutionSelection(callback: Function): void {
    this.updateRemoteSolutions();
    this.showRemoteSolutionOnDeployModal = true;

    this.cancelMultipleRemoteSolutionModal = (): void => {
      this.showRemoteSolutionOnDeployModal = false;

      callback();
    };

    this.selectRemoteSolution = (remoteSolution: ISolutionEntry): void => {
      this.showRemoteSolutionOnDeployModal = false;

      callback(remoteSolution);
    };
  }

  public handleOverwriting(callback: Function): void {
    this.showOverwriteDiagramModal = true;

    this.cancelOverwriteModal = (): void => {
      this.showOverwriteDiagramModal = false;

      callback(false);
    };

    this.overwriteDiagram = (): void => {
      this.showOverwriteDiagramModal = false;

      callback(true);
    };
  }

  private updateRemoteSolutions(): void {
    this.remoteSolutions = this.solutionService.getRemoteSolutionEntries();
  }
}
