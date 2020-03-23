#!/bin/bash

# Global variables for the Environment {{{ #
# CrossBrowserTesting E-Mail Adresse
export CB_USER=""
# CrossBrowserTesting API Key
export CB_KEY=""
# URL oder IP der VM + Port des BPMN-Studio; z.B.: http://1.1.1.1:9000
export aureliaUrl=""
# URL oder IP der VM + Port der ProcessEngine; z.B.: http://1.1.1.1:8000
export processEngineUrl=""
# }}} Global variables for the Environment #

# Run this command to apply environment variables:
#
# source prepare_environment_for_integration_tests.sh
#
# This will prepare the Environment for the integration tests.
