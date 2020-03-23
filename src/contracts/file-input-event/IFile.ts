export interface IFile {
  lastModified: number;
  name: string;
  path?: string;
  size: number;
  type: string;
  webkitRelativePath?: string;
}
