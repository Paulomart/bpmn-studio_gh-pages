/* eslint-disable @typescript-eslint/no-unused-vars */
import * as emptyActivities from './empty_activity/index';
import * as events from './event/index';
import * as manualTasks from './manual_task/index';
import * as processModels from './process_model/index';
import * as userTasks from './user_task/index';

import * as correlationResult from './correlation_result';
import * as processInstance from './process_instance';

export namespace DataModels {
  export import CorrelationResult = correlationResult.CorrelationResult;
  export import EmptyActivities = emptyActivities;
  export import Events = events;
  export import ManualTasks = manualTasks;
  export import ProcessInstance = processInstance.ProcessInstance;
  export import ProcessModels = processModels;
  export import UserTasks = userTasks;
}
