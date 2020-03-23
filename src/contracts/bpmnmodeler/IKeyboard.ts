export interface IKeyboard {
  addListener(keyListenerFunction: Function): void;
  hasModifier(modifiers: KeyboardEvent): boolean;
  isCmd(modifiers: KeyboardEvent): boolean;
  isShift(modifiers: KeyboardEvent): boolean;
  bind(node: HTMLElement): void;
  getBinding(): HTMLElement;
  unbind(): void;
}
