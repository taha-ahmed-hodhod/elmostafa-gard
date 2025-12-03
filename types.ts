// Declare html2pdf since we are loading it via CDN
declare global {
  interface Window {
    html2pdf: any;
  }
}

export interface TableState {
  headers: string[];
  rows: string[][];
}

export interface ShareOptions {
  filename: string;
  title: string;
  text: string;
}
