/* eslint-disable @typescript-eslint/no-unused-vars */
import * as ApplicationInfoEndpoint from './application_info/index';
import * as EmptyActivityEndpoint from './empty_activity/index';
import * as EventEndpoint from './events/index';
import * as ExternalTaskEndpoint from './external_task/index';
import * as ManualTaskEndpoint from './manual_task/index';
import * as NotificationEndpoint from './notifications/index';
import * as ProcessModelEndpoint from './process_model/index';
import * as UserTaskEndpoint from './user_task/index';
import * as FlowNodeInstanceEndpoint from './flow_node_instance/index';
import * as SwaggerEndpoint from './swagger/index';

export namespace Endpoints {
  export import ApplicationInfo = ApplicationInfoEndpoint;
  export import EmptyActivity = EmptyActivityEndpoint;
  export import Event = EventEndpoint;
  export import ExternalTask = ExternalTaskEndpoint;
  export import ManualTask = ManualTaskEndpoint;
  export import Notification = NotificationEndpoint;
  export import ProcessModel = ProcessModelEndpoint;
  export import UserTask = UserTaskEndpoint;
  export import FlowNodeInstance = FlowNodeInstanceEndpoint;
  export import Swagger = SwaggerEndpoint;
}
