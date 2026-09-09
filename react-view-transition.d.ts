import "react";

// Next 16's App Router supplies React canary, while this project retains React 18 types.
declare module "react" {
  export const ViewTransition: ExoticComponent<{
    children: ReactNode;
    name?: string;
    share?: string;
    enter?: string;
    exit?: string;
    default?: string;
  }>;
}
