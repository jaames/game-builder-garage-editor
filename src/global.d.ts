declare const __DEV__: boolean;
declare const __VERSION__: string;

declare module "*.svg" {
  import React from 'react';
  export const ReactComponent: React.Component<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module "*.md" {
  import { ComponentType } from 'react';
  const MDXComponent: ComponentType
  export default MDXComponent;
}

declare module "*.css" {
  const cssContent: Record<string, string>;
  export default cssContent;
}

declare module "*.scss" {
  const scssContent: Record<string, string>;
  export default scssContent;
}

declare module '*.bin' {
  const binContent: string;
  export default binContent;
}

declare module "\*.jpg" {
  const content: string;
  export default content;
}

declare module "\*.png" {
  const content: string;
  export default content;
}

declare module "\*.json" {
  const content: string;
  export default content;
}