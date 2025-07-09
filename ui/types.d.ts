declare global {
  interface Window {
    customCards?: Array<{
      type: string;
      name: string;
      description: string;
      preview?: boolean;
      documentationURL?: string;
    }>;
  }
}

// Material Web Components
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'mwc-button': any;
      'ha-card': any;
      'ha-switch': any;
      'paper-input': any;
      'paper-dropdown-menu': any;
      'paper-listbox': any;
      'paper-item': any;
    }
  }
}

export {};
