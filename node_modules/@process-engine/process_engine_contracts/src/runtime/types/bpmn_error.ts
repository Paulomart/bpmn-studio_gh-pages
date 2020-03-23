/**
 * This type can be used to throw an error modeled at an ErrorEndEvent.
 */
export class BpmnError extends Error {

  public readonly code: number | string;

  constructor(name: string, code?: number | string, message?: string) {
    super(message || name);
    this.name = name;
    this.code = code || '';
    this.message = message || '';
  }

}
