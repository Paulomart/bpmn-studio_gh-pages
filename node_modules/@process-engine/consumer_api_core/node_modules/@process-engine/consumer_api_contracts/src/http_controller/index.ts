/* eslint-disable @typescript-eslint/no-unused-vars */
import * as applicationInfoHttpController from './iapplication_info_controller';
import * as emptyActivityHttpController from './iempty_activity_http_controller';
import * as eventHttpController from './ievent_http_controller';
import * as externalTaskHttpController from './iexternal_task_http_controller';
import * as manualTaskHttpController from './imanual_task_http_controller';
import * as processModelHttpController from './iprocess_model_http_controller';
import * as userTaskHttpController from './iuser_task_http_controller';
import * as flowNodeInstanceHttpController from './iflow_node_instance_http_controller';
import * as swaggerHttpController from './iswagger_http_controller';

export namespace HttpController {
  export import IApplicationInfoHttpController = applicationInfoHttpController.IApplicationInfoController;
  export import IEmptyActivityHttpController = emptyActivityHttpController.IEmptyActivityHttpController;
  export import IEventHttpController = eventHttpController.IEventHttpController;
  export import IExternalTaskHttpController = externalTaskHttpController.IExternalTaskHttpController;
  export import IManualTaskHttpController = manualTaskHttpController.IManualTaskHttpController;
  export import IProcessModelHttpController = processModelHttpController.IProcessModelHttpController;
  export import IUserTaskHttpController = userTaskHttpController.IUserTaskHttpController;
  export import IFlowNodeInstanceHttpController = flowNodeInstanceHttpController.IFlowNodeInstanceHttpController;
  export import ISwaggerHttpController = swaggerHttpController.ISwaggerHttpController;
}
