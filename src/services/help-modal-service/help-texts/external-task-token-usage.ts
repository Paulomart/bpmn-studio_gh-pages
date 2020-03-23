import {HelpText} from '../../../contracts/index';
import {removeMultilineIndent} from '../remove-multiline-indent';

export const ExternalTaskTokenUsage: HelpText = {
  title: 'How to use the results from previous tasks',
  message: removeMultilineIndent(`
  When a process is executed, it progresses through the different elements of the diagram and captures states along the way.
  This progression and state accumulation can be visualized as a token moving along the execution's path in the diagram.

  The data of previous tasks can be accessed through the token.

  In order to do so make use of:

  - \`token.current\` - To access the task that immediately preceded the script task.
  - \`token.history.<id-of-previous-task>\` - To access a specific preceding task.

  **Examples of using the token as a payload or topic for external tasks:**

  1. To use the given user data from previous tasks, e.g. an account registration worker:

      Topic: \`EXAMPLE_TOPIC\`

      Payload:
      \`\`\`javascript
      {
      firstName: token.history.AskForName.firstName,
      lastName: token.history.AskForName.lastName,
      rememberMyDetails: token.history.AskForConsent.rememberMyDetails,
      sendMeLotsOfEmails: token.history.AskForConsent.sendMeLotsOfEmails
      }
      \`\`\`

  2. To use the current token, the configuration could look like this:

      Topic: \`EXAMPLE_TOPIC\`

      Payload:
      \`\`\`javascript
      {
        currentToken: token.current
      }
      \`\`\`

  3. Custom Topics:

      Topic: \`token.current + 'my string'\`

      Payload: \`EXAMPLE_PAYLOAD\`

    Note: String operations also work for payloads.
   `),
};
