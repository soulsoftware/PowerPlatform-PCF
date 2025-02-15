// IControlEvent.ts
type PowerFxFileType = {
  content: string,
  name: string
}

export interface IControlEvent {
  event: 'None' | 'Completed' | 'Error' | 'ImportedFile'
  errorMessage?: string;
  file?: PowerFxFileType;
}