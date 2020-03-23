import {Definitions} from './process/definitions';

/**
 * Describes the BpmnModelParser, responsible for parsing XML processes into
 * the internally used ProcessModel type.
 */
export interface IModelParser {
  /**
   * Takes a string containing an XML-formatted BPMN process and parses it into
   * the internal ProcessModel type.
   *
   * @async
   * @param   bpmnXml The raw XML code to parse.
   * @returns         A fully parsed ProcessModel.
   */
  parseXmlToObjectModel(bpmnXml: string): Promise<Definitions> ;
}
