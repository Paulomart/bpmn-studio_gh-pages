import {EventAggregator} from 'aurelia-event-aggregator';
import {inject} from 'aurelia-framework';

import {IConditionExpression, IFlowElement, IShape} from '@process-engine/bpmn-elements_contracts';

import {IBpmnModdle, IPageModel, ISection} from '../../../../../../../contracts';
import environment from '../../../../../../../environment';

@inject(EventAggregator)
export class FlowSection implements ISection {
  public path: string = '/sections/flow/flow';
  public canHandleElement: boolean = false;
  public condition: string;

  private businessObjInPanel: IFlowElement;
  private moddle: IBpmnModdle;
  private eventAggregator: EventAggregator;

  constructor(eventAggregator?: EventAggregator) {
    this.eventAggregator = eventAggregator;
  }

  public activate(model: IPageModel): void {
    this.businessObjInPanel = model.elementInPanel.businessObject;
    this.moddle = model.modeler.get('moddle');

    this.init();
  }

  public isSuitableForElement(elementShape: IShape): boolean {
    if (elementShape !== undefined && elementShape !== null) {
      const element: IFlowElement = elementShape.businessObject;
      if (!this.elementIsFlow(element)) {
        return false;
      }

      const isDefaultFlow: boolean =
        element.sourceRef !== null && element.sourceRef.default && element.sourceRef.default.id === element.id;
      if (isDefaultFlow) {
        return false;
      }
      const flowPointsAtExclusiveGateway: boolean =
        element.targetRef !== null && element.targetRef.$type === 'bpmn:ExclusiveGateway';
      const flowStartsAtExclusiveGateway: boolean =
        element.sourceRef !== null && element.sourceRef.$type === 'bpmn:ExclusiveGateway';

      const flowHasCondition: boolean = flowPointsAtExclusiveGateway || flowStartsAtExclusiveGateway;

      return flowHasCondition;
    }

    return false;
  }

  public updateCondition(): void {
    const objectHasNoConditionExpression: boolean =
      this.businessObjInPanel.conditionExpression === undefined || this.businessObjInPanel.conditionExpression === null;

    if (objectHasNoConditionExpression) {
      this.createConditionExpression();
    }

    this.businessObjInPanel.conditionExpression.body = this.condition;
    this.publishDiagramChange();
  }

  private createConditionExpression(): void {
    const conditionExpression: IConditionExpression = this.moddle.create('bpmn:FormalExpression', {});
    this.businessObjInPanel.conditionExpression = conditionExpression;
  }

  private elementIsFlow(element: IFlowElement): boolean {
    return element !== undefined && element !== null && element.$type === 'bpmn:SequenceFlow';
  }

  private init(): void {
    if (this.businessObjInPanel.conditionExpression && this.businessObjInPanel.conditionExpression.body !== undefined) {
      this.condition = this.businessObjInPanel.conditionExpression.body;
    } else {
      this.condition = '';
    }
  }

  private publishDiagramChange(): void {
    this.eventAggregator.publish(environment.events.diagramChange);
  }
}
