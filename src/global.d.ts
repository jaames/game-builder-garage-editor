declare const __DEV__: boolean;
declare const __VERSION__: string;

declare module '*.svg' {
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const content: string;

  export { ReactComponent };
  export default content;
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