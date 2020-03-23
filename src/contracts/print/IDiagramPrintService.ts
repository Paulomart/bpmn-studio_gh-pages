export interface IDiagramPrintService {
  printDiagram(svgContent?: string): Promise<void>;
  updateSVG(newSVG: string): void;
}
