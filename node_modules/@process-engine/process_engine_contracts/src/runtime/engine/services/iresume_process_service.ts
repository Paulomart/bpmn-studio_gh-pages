import {IIdentity} from '@essential-projects/iam_contracts';

import {EndEventReachedMessage} from '../../messages/bpmn_events/end_event_reached';

export interface IResumeProcessService {

  /**
     * Finds and resumes all ProcessInstances that were interrupted before.
     *
     * @async
     * @param identity The identity with which to resume the ProcessInstances.
     */
  findAndResumeInterruptedProcessInstances(identity: IIdentity): Promise<void>;

  /**
     * Resumes a specific ProcessInstance by its ID.
     * Used primarily by CallActivities and Subprocesses.
     *
     * Will not return anything, if an attempt is made to resume an already finished ProcessInstance.
     *
     * @async
     * @param   identity          The identity with which to resume the
     *                            ProcessInstance.
     * @param   processModelId    The ID of the ProcessModel to resume.
     * @param   processInstanceId The ID of the ProcessInstance to resume.
     * @returns                   The ProcessInstance's result or nothing, if the ProcessInstance was already finished.
     */
  resumeProcessInstanceById(identity: IIdentity, processModelId: string, processInstanceId: string): Promise<EndEventReachedMessage | void>;
}
