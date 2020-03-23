import * as spectrum from 'spectrum-colorpicker';

export interface IColorPickerSettings {
  clickoutFiresChange: boolean;
  showPalette: boolean;
  palette: Array<Array<string>>;
  localStorageKey: string;
  showInitial: boolean;
  showInput: boolean;
  allowEmpty: boolean;
  showButtons: boolean;
  showPaletteOnly: boolean;
  togglePaletteOnly: boolean;

  move?(color: spectrum.tinycolorInstance): void;
}
