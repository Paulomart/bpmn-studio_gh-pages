/* eslint-disable @typescript-eslint/no-unused-vars */
import * as CorrelationEndpoint from './correlation/index';
import * as CronjobEndpoint from './cronjob/index';
import * as EmptyActivityEndpoint from './empty_activity/index';
import * as EventEndpoint from './event/index';
import * as FlowNodeInstancesEndpoint from './flow_node_instance';
import * as KpiEndpoint from './kpi/index';
import * as LoggingEndpoint from './logging/index';
import * as ManualTasksEndpoint from './manual_task/index';
import * as NotificationEndpoint from './notification/index';
import * as ProcessModelEndpoint from './process_model/index';
import * as TokenHistoryEndpoint from './token_history/index';
import * as UserTaskEndpoint from './user_task/index';
import * as SwaggerEndpoint from './swagger/index';

export namespace Endpoints {
  export import Correlation = CorrelationEndpoint;
  export import Cronjob = CronjobEndpoint;
  export import EmptyActivity = EmptyActivityEndpoint;
  export import Event = EventEndpoint;
  export import FlowNodeInstance = FlowNodeInstancesEndpoint;
  export import Kpi = KpiEndpoint;
  export import Logging = LoggingEndpoint;
  export import ManualTask = ManualTasksEndpoint;
  export import Notification = NotificationEndpoint;
  export import ProcessModel = ProcessModelEndpoint;
  export import TokenHistory = TokenHistoryEndpoint;
  export import UserTask = UserTaskEndpoint;
  export import Swagger = SwaggerEndpoint;
}
