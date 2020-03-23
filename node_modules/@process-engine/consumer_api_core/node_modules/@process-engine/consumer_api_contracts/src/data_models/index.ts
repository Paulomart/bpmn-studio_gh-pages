/* eslint-disable @typescript-eslint/no-unused-vars */
import * as correlations from './correlation/index';
import * as emptyActivities from './empty_activity/index';
import * as events from './event/index';
import * as externalTask from './external_task/index';
import * as manualTasks from './manual_task/index';
import * as processModels from './process_model/index';
import * as userTasks from './user_task/index';
import * as flowNodeInstances from './flow_node_instance/index';

import * as appInfo from './application_info';
import * as bpmnType from './bpmn_type';

export namespace DataModels {
  export import ApplicationInfo = appInfo.ApplicationInfo;
  export import BpmnType = bpmnType.BpmnType;
  export import Correlations = correlations;
  export import EmptyActivities = emptyActivities;
  export import Events = events;
  export import ExternalTask = externalTask;
  export import ManualTasks = manualTasks;
  export import ProcessModels = processModels;
  export import UserTasks = userTasks;
  export import FlowNodeInstances = flowNodeInstances;
}
