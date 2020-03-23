import {EventDefinition} from './event_definition';

export class TimerEventDefinition extends EventDefinition {

  public enabled?: boolean = true;
  public timerType: TimerType;
  public value: string;

}

export enum TimerType {
  timeCycle = 0,
  timeDate = 1,
  timeDuration = 2,
}
