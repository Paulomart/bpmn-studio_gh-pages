/**
 * This type can be used to throw a BPMN error from an ExternalServiceTaskHandler.
 */
export class BpmnError {

  public readonly name: string;
  public readonly code: number | string;
  public readonly message: string;

  constructor(name: string, code?: number | string, message?: string) {
    this.name = name;
    this.code = code ?? '';
    this.message = message ?? '';
  }

}
