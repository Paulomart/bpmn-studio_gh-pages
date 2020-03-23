# dynamic_ui_core

This bundle holds the basic components to render simple User- and ManualTasks
inside BPMN-Studio.

## Configure and Display simple UserTasks

To configure a UserTask simply click on it in the designer of BPMN-Studio.
The PropertyPanel will show the current configuration, including the form fields.

![Simple UserTask 1](./docs/images/SimpleUserTask(1).png)

To add a new form field click the "+" button on the PropertyPanel.

![Simple UserTask 2](./docs/images/SimpleUserTask(2).png)

After adding a new form field you can configure it. In this example we are
working with a text form field.

![Simple UserTask 3](./docs/images/SimpleUserTask(3).png)

To configure a dynamic default value you have to add it like this:

`${token.current.<path-to-value-here>}`

or

`${token.history['<id-of-node-here>'].<path-to-value-here>}`

To display that UserTask now

- save the diagram
- deploy it to the ProcessEngine
- run it
- click on the task in the Live Execution Tracker

![Simple UserTask 4](./docs/images/SimpleUserTask(4).png)

You can now see your configured UserTask.

![Simple UserTask 5](./docs/images/SimpleUserTask(5).png)

### Example Process

For a full example of a process with a configures UserTask see:

[Example UserTask Process](./docs/processes/SimpleUserTask.bpmn)

## Configure and Display confirm UserTasks

To configure a UserTask to use the "confirm", control add the `preferredControl`
key with the value `confirm` to the properties of the UserTask.

![Confirm UserTask 1](./docs/images/ConfirmUserTask(1).png)

The confirm control expects at least one boolean ("Truth Value") form field.
It will not render the first boolean form field configured in the UserTask and
instead use it to fill it with the information about the button click.

To configure the boolean form field simply click on the "+" button and select
"Truth Value" in the dropdown. There is no label needed for this form field since
it doesn't get rendered anyway.

![Confirm UserTask 2](./docs/images/ConfirmUserTask(2).png)

You can now again

- save the diagram
- deploy it to the ProcessEngine
- run it
- click on the task in the Live Execution Tracker

You can now see the configured confirm UserTask.
Since it is a confirm UserTask the DynamicUi rendered some extra buttons.

![Confirm UserTask 3](./docs/images/ConfirmUserTask(3).png)

Clicking on "Proceed" will lead to a `true` in the first boolean form field of
the UserTask.

Clicking on "Decline" will lead to a `false` in the first boolean form field of
the UserTask.

### Example Process

For a full example of a process using the confirm control see:

[Example Confirm UserTask Process](./docs/processes/ConfirmUserTask.bpmn)
