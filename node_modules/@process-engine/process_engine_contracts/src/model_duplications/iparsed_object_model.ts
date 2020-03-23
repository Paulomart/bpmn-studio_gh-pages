/**
 * This contains the raw BPMN process, as it was parsed by
 * xml2json.
 * The process is stored in JSON format, which can be interpreted by the
 * ProcessEngine.
 *
 * This type should not be used anywhere, except for passing raw ProcessModels
 * to the model parser.
 */
export interface IParsedObjectModel {
  [property: string]: any;
}
