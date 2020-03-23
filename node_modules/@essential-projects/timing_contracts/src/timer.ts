import * as moment from 'moment';
import {TimerType} from './timer_type';

export class Timer {

  public id: string;
  public type: TimerType;
  public value: moment.Moment | string;
  public eventName: string;
  public lastElapsed: Date;

}
