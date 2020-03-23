# process_engine_contracts

This project contains the contracts used for interacting with the ProcessEngine.

## Namespaces

The contracts are split into two main Namespaces:

### Model

This Namespace contains all components that describe a ProcessModel, such as
Activities, Gateways, Events and so forth.

Also, it contains the interfaces for the `BpmnModelParser`.

The interfaces and types are grouped into folders, each reflecting a single
category:
- `activities`: Contains FlowNodes such as ScriptTasks, ServiceTasks,
CallActivities, etc.
- `base`: Contains base classes used across the namespace
- `event_definitions`: Contains definitions for various event types,
used by the classes stored in `events`
- `events`: Contains types for all kinds of Events supported by the BPMN
specs
- `gateways`: Contains types for all kinds of Gateways supported by the
BPMN specs
- `type_references`: References are used by `events` and `event_definitions`
and contain infos about things like messages, signals, etc.
- `types`: Contains types for the elements that are common to all BPMNs, such as
Participants, Collaborations, Annotations, etc.

### Runtime

This namespace contains the interfaces and types for all the services
and repositories that provide access to the ProcessEngine.

The interfaces contained are grouped into the following categories:
- `engine`: Contains interfaces for services and handlers that manage the
execution of ProcessModels
- `messages`: Contains definitions for internal messages used for communication
with the EventAggregator
- `storage`: Contains interfaces for services and repositories used for accessing
the persistence layer
- `types`: Contains definitions for commonly used types, such as `ProcessToken` or
`FlowNodeInstance`
