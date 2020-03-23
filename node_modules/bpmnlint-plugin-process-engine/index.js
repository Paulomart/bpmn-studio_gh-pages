module.exports = {
  configs: {
    recommended: {
      rules: {
        'process-engine/callactivity-target-required': 'error',
        'process-engine/no-more-than-one-participant': 'error',
        'process-engine/start-event-required': 'error',
        'process-engine/end-event-required': 'error',
        'process-engine/no-duplicate-ids': 'error',
        'process-engine/no-conditional-start-event': 'error',
        'process-engine/no-compensation-end-event': 'error',
        'process-engine/no-escalation-end-event': 'error',
        'process-engine/no-cancel-boundary-event': 'error',
        'process-engine/no-compensation-boundary-event': 'error',
        'process-engine/no-conditional-boundary-event': 'error',
        'process-engine/no-escalation-boundary-event': 'error',
        'process-engine/no-intermediate-escalation-throw-event': 'error',
        'process-engine/no-intermediate-compensation-throw-event': 'error',
        'process-engine/no-business-rule-task': 'error',
        'process-engine/no-complex-gateway': 'error',
        'process-engine/no-inclusive-gateway': 'error',
        'process-engine/no-event-based-gateway': 'error',
        'process-engine/no-mixed-gateways': 'error',
        'process-engine/collaboration-required': 'error',
        'process-engine/participant-required': 'error',
        'process-engine/no-undefined-error-event': 'error',
        'process-engine/no-undefined-timer-event': 'error',
        'process-engine/no-undefined-signal-event': 'error',
        'process-engine/no-undefined-message-event': 'error'
      }
    },
  }
}
