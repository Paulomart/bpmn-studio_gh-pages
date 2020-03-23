/* eslint-disable @typescript-eslint/no-unused-vars */
import * as appInfoApi from './iapplication_info_consumer_api';
import * as emptyActivityApi from './iempty_activity_consumer_api';
import * as eventApi from './ievent_consumer_api';
import * as externalTaskApi from './iexternal_task_consumer_api';
import * as manualTaskApi from './imanual_task_consumer_api';
import * as notificationApi from './inotification_consumer_api';
import * as processModelApi from './iprocess_model_consumer_api';
import * as userTaskApi from './iuser_task_consumer_api';
import * as flowNodeInstanceApi from './iflow_node_instance_consumer_api';

export namespace APIs {
  export import IApplicationInfoConsumerApi = appInfoApi.IApplicationInfoConsumerApi;
  export import IEmptyActivityConsumerApi = emptyActivityApi.IEmptyActivityConsumerApi;
  export import IEventConsumerApi = eventApi.IEventConsumerApi;
  export import IExternalTaskConsumerApi = externalTaskApi.IExternalTaskConsumerApi;
  export import IManualTaskConsumerApi = manualTaskApi.IManualTaskConsumerApi;
  export import INotificationConsumerApi = notificationApi.INotificationConsumerApi;
  export import IProcessModelConsumerApi = processModelApi.IProcessModelConsumerApi;
  export import IUserTaskConsumerApi = userTaskApi.IUserTaskConsumerApi;
  export import IFlowNodeInstanceConsumerApi = flowNodeInstanceApi.IFlowNodeInstanceConsumerApi;
}
