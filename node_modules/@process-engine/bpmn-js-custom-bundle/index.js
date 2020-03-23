import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda.json';
import modeler from 'bpmn-js/lib/Modeler';
import viewer from 'bpmn-js/lib/Viewer';

import MiniMap from 'diagram-js-minimap';
import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas';
import ZoomScrollModule from 'diagram-js/lib/navigation/zoomscroll';
import lintModule from '@process-engine/bpmn-js-bpmnlint';

import resizeAllModule from './src/resize-all-rules';

import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import "diagram-js/assets/diagram-js.css";
import "@process-engine/bpmn-js-bpmnlint/dist/assets/css/bpmn-js-bpmnlint.css";
import "./src/diagram-js-minimap.css";

export {
 camundaModdleDescriptor,
 MiniMap,
 modeler,
 MoveCanvasModule,
 viewer,
 ZoomScrollModule,
 resizeAllModule,
 lintModule,
}
