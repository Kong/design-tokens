<!--
 * Do not edit directly
 * Generated on Fri, 21 Jul 2023 21:25:23 GMT
 * 
 * Kong Design Tokens
 * GitHub: https://github.com/Kong/design-tokens
 * License: Apache-2.0
-->

# Kong Design Tokens

This document outlines all of the available tokens.

## SCSS

### SCSS Variables

<details>

<summary>Click to view the list of SCSS variables</summary>

```scss
/* white */
$kui-color-background: #ffffff;
/* red.60 */
$kui-color-background-danger: #d60027;
/* red.70 */
$kui-color-background-danger-strong: #ad000e;
/* red.80 */
$kui-color-background-danger-stronger: #850000;
/* red.90 */
$kui-color-background-danger-strongest: #5c0000;
/* red.40 */
$kui-color-background-danger-weak: #ff3954;
/* red.20 */
$kui-color-background-danger-weaker: #ffabab;
/* red.10 */
$kui-color-background-danger-weakest: #ffe5e5;
/* gray.20 */
$kui-color-background-disabled: #e0e4ea;
/* blue.100 */
$kui-color-background-inverse: #000933;
/* gray.60 */
$kui-color-background-neutral: #6c7489;
/* gray.70 */
$kui-color-background-neutral-strong: #52596e;
/* gray.80 */
$kui-color-background-neutral-stronger: #3a3f51;
/* gray.90 */
$kui-color-background-neutral-strongest: #232633;
/* gray.40 */
$kui-color-background-neutral-weak: #afb7c5;
/* gray.20 */
$kui-color-background-neutral-weaker: #e0e4ea;
/* gray.10 */
$kui-color-background-neutral-weakest: #f9fafb;
/* blue.60 */
$kui-color-background-primary: #0044f4;
/* blue.70 */
$kui-color-background-primary-strong: #0030cc;
/* blue.80 */
$kui-color-background-primary-stronger: #002099;
/* blue.90 */
$kui-color-background-primary-strongest: #001466;
/* blue.40 */
$kui-color-background-primary-weak: #5f9aff;
/* blue.20 */
$kui-color-background-primary-weaker: #bee2ff;
/* blue.10 */
$kui-color-background-primary-weakest: #eefaff;
/* green.10 */
$kui-color-background-success-weakest: #ecfffb;
/* transparent */
$kui-color-background-transparent: rgba(0, 0, 0, 0);
/* yellow.10 */
$kui-color-background-warning-weakest: #fffce0;
/* gray.20 */
$kui-color-border: #e0e4ea;
/* red.60 */
$kui-color-border-danger: #d60027;
/* red.70 */
$kui-color-border-danger-strong: #ad000e;
/* red.80 */
$kui-color-border-danger-stronger: #850000;
/* red.90 */
$kui-color-border-danger-strongest: #5c0000;
/* red.40 */
$kui-color-border-danger-weak: #ff3954;
/* red.20 */
$kui-color-border-danger-weaker: #ffabab;
/* red.10 */
$kui-color-border-danger-weakest: #ffe5e5;
/* purple.60 */
$kui-color-border-decorative: #6f28ff;
/* gray.20 */
$kui-color-border-disabled: #e0e4ea;
/* gray.40 */
$kui-color-border-neutral-weak: #afb7c5;
/* blue.60 */
$kui-color-border-primary: #0044f4;
/* blue.70 */
$kui-color-border-primary-strong: #0030cc;
/* blue.80 */
$kui-color-border-primary-stronger: #002099;
/* blue.90 */
$kui-color-border-primary-strongest: #001466;
/* blue.40 */
$kui-color-border-primary-weak: #5f9aff;
/* blue.20 */
$kui-color-border-primary-weaker: #bee2ff;
/* blue.10 */
$kui-color-border-primary-weakest: #eefaff;
/* transparent */
$kui-color-border-transparent: rgba(0, 0, 0, 0);
/* blue.100 */
$kui-color-text: #000933;
/* red.60 */
$kui-color-text-danger: #d60027;
/* aqua.50 */
$kui-color-text-decorative: #00abd2;
/* gray.50 */
$kui-color-text-disabled: #828a9e;
/* white */
$kui-color-text-inverse: #ffffff;
/* gray.60 */
$kui-color-text-neutral: #6c7489;
/* gray.70 */
$kui-color-text-neutral-strong: #52596e;
/* gray.80 */
$kui-color-text-neutral-stronger: #3a3f51;
/* gray.90 */
$kui-color-text-neutral-strongest: #232633;
/* gray.40 */
$kui-color-text-neutral-weak: #afb7c5;
/* blue.60 */
$kui-color-text-primary: #0044f4;
/* blue.70 */
$kui-color-text-primary-strong: #0030cc;
/* blue.80 */
$kui-color-text-primary-stronger: #002099;
/* green.60 */
$kui-color-text-success: #007d60;
/* yellow.60 */
$kui-color-text-warning: #995c00;
$kui-border-radius-0: 0px;
$kui-border-radius-10: 2px;
$kui-border-radius-20: 4px;
$kui-border-radius-30: 6px;
$kui-border-radius-40: 8px;
/* Used to create a circle. Value of 50% */
$kui-border-radius-circle: 50%;
/* Used to round element corners. Value of 100px */
$kui-border-radius-round: 100px;
$kui-border-width-0: 0px;
$kui-border-width-10: 1px;
$kui-border-width-20: 2px;
$kui-border-width-30: 4px;
/* Used for larger mobile screens. Anything viewport width under this value is considered mobile. */
$kui-breakpoint-mobile: 640px;
/* Used for tablet screens. */
$kui-breakpoint-phablet: 768px;
/* Used for larger tablet screens. Any viewport width less than this value will likely show a mobile layout. Any viewport width this value and greater will likely show a desktop layout. */
$kui-breakpoint-tablet: 1024px;
/* Used for standard desktop screens. */
$kui-breakpoint-laptop: 1280px;
/* Used for larger desktop screens. */
$kui-breakpoint-desktop: 1536px;
$kui-icon-size-10: 10px;
$kui-icon-size-20: 12px;
$kui-icon-size-30: 16px;
$kui-icon-size-40: 20px;
/* The default icon size */
$kui-icon-size-50: 24px;
$kui-icon-size-60: 32px;
$kui-icon-size-70: 40px;
$kui-icon-size-80: 48px;
/* purple.10 */
$kui-method-color-background-connect: #f1f0ff;
/* red.10 */
$kui-method-color-background-delete: #ffe5e5;
/* blue.10 */
$kui-method-color-background-get: #eefaff;
/* gray.60 */
$kui-method-color-background-head: #6c7489;
/* gray.10 */
$kui-method-color-background-options: #f9fafb;
/* aqua.10 */
$kui-method-color-background-patch: #ecfcff;
/* green.10 */
$kui-method-color-background-post: #ecfffb;
/* yellow.10 */
$kui-method-color-background-put: #fffce0;
/* pink.10 */
$kui-method-color-background-trace: #fff0f7;
/* purple.60 */
$kui-method-color-text-connect: #6f28ff;
/* red.60 */
$kui-method-color-text-delete: #d60027;
/* blue.60 */
$kui-method-color-text-get: #0044f4;
/* gray.10 */
$kui-method-color-text-head: #f9fafb;
/* gray.60 */
$kui-method-color-text-options: #6c7489;
/* aqua.60 */
$kui-method-color-text-patch: #00819d;
/* green.60 */
$kui-method-color-text-post: #007d60;
/* yellow.60 */
$kui-method-color-text-put: #995c00;
/* pink.60 */
$kui-method-color-text-trace: #d60067;
/* The standard monospace font family. */
$kui-font-family-code: 'JetBrains Mono', Consolas, monospace;
/* The standard text font family. */
$kui-font-family-text: 'Inter', Roboto, Helvetica, sans-serif;
$kui-font-size-10: 10px;
$kui-font-size-20: 12px;
$kui-font-size-30: 14px;
$kui-font-size-40: 16px;
$kui-font-size-50: 18px;
$kui-font-size-60: 20px;
$kui-font-size-70: 24px;
$kui-font-size-80: 32px;
$kui-font-size-90: 40px;
$kui-font-size-100: 48px;
/* 700 */
$kui-font-weight-bold: 700;
/* 500 */
$kui-font-weight-medium: 500;
/* 400: The normal font weight. */
$kui-font-weight-regular: 400;
/* 600 */
$kui-font-weight-semibold: 600;
/* 12px */
$kui-line-height-10: 12px;
/* 16px */
$kui-line-height-20: 16px;
/* 20px */
$kui-line-height-30: 20px;
/* 24px */
$kui-line-height-40: 24px;
/* 28px */
$kui-line-height-50: 28px;
/* 32px */
$kui-line-height-60: 32px;
/* 36px */
$kui-line-height-70: 36px;
/* 40px */
$kui-line-height-80: 40px;
/* 48px */
$kui-line-height-90: 48px;
/* 56px */
$kui-line-height-100: 56px;
/* 0px */
$kui-space-0: 0px;
/* 2px */
$kui-space-10: 2px;
/* 4px */
$kui-space-20: 4px;
/* 6px */
$kui-space-30: 6px;
/* 8px */
$kui-space-40: 8px;
/* 12px */
$kui-space-50: 12px;
/* 16px */
$kui-space-60: 16px;
/* 20px */
$kui-space-70: 20px;
/* 24px */
$kui-space-80: 24px;
/* 32px */
$kui-space-90: 32px;
/* 40px */
$kui-space-100: 40px;
/* 48px */
$kui-space-110: 48px;
/* 56px */
$kui-space-120: 56px;
/* 64px */
$kui-space-130: 64px;
/* 80px */
$kui-space-140: 80px;
/* 96px */
$kui-space-150: 96px;
/* auto */
$kui-space-auto: auto;
```

</details>

### SCSS Map

<details>

<summary>Click to view exported SCSS map</summary>

```scss
$tokens-map: (
  /* white */
  'kui-color-background': #ffffff;
  /* red.60 */
  'kui-color-background-danger': #d60027;
  /* red.70 */
  'kui-color-background-danger-strong': #ad000e;
  /* red.80 */
  'kui-color-background-danger-stronger': #850000;
  /* red.90 */
  'kui-color-background-danger-strongest': #5c0000;
  /* red.40 */
  'kui-color-background-danger-weak': #ff3954;
  /* red.20 */
  'kui-color-background-danger-weaker': #ffabab;
  /* red.10 */
  'kui-color-background-danger-weakest': #ffe5e5;
  /* gray.20 */
  'kui-color-background-disabled': #e0e4ea;
  /* blue.100 */
  'kui-color-background-inverse': #000933;
  /* gray.60 */
  'kui-color-background-neutral': #6c7489;
  /* gray.70 */
  'kui-color-background-neutral-strong': #52596e;
  /* gray.80 */
  'kui-color-background-neutral-stronger': #3a3f51;
  /* gray.90 */
  'kui-color-background-neutral-strongest': #232633;
  /* gray.40 */
  'kui-color-background-neutral-weak': #afb7c5;
  /* gray.20 */
  'kui-color-background-neutral-weaker': #e0e4ea;
  /* gray.10 */
  'kui-color-background-neutral-weakest': #f9fafb;
  /* blue.60 */
  'kui-color-background-primary': #0044f4;
  /* blue.70 */
  'kui-color-background-primary-strong': #0030cc;
  /* blue.80 */
  'kui-color-background-primary-stronger': #002099;
  /* blue.90 */
  'kui-color-background-primary-strongest': #001466;
  /* blue.40 */
  'kui-color-background-primary-weak': #5f9aff;
  /* blue.20 */
  'kui-color-background-primary-weaker': #bee2ff;
  /* blue.10 */
  'kui-color-background-primary-weakest': #eefaff;
  /* green.10 */
  'kui-color-background-success-weakest': #ecfffb;
  /* transparent */
  'kui-color-background-transparent': rgba(0, 0, 0, 0);
  /* yellow.10 */
  'kui-color-background-warning-weakest': #fffce0;
  /* gray.20 */
  'kui-color-border': #e0e4ea;
  /* red.60 */
  'kui-color-border-danger': #d60027;
  /* red.70 */
  'kui-color-border-danger-strong': #ad000e;
  /* red.80 */
  'kui-color-border-danger-stronger': #850000;
  /* red.90 */
  'kui-color-border-danger-strongest': #5c0000;
  /* red.40 */
  'kui-color-border-danger-weak': #ff3954;
  /* red.20 */
  'kui-color-border-danger-weaker': #ffabab;
  /* red.10 */
  'kui-color-border-danger-weakest': #ffe5e5;
  /* purple.60 */
  'kui-color-border-decorative': #6f28ff;
  /* gray.20 */
  'kui-color-border-disabled': #e0e4ea;
  /* gray.40 */
  'kui-color-border-neutral-weak': #afb7c5;
  /* blue.60 */
  'kui-color-border-primary': #0044f4;
  /* blue.70 */
  'kui-color-border-primary-strong': #0030cc;
  /* blue.80 */
  'kui-color-border-primary-stronger': #002099;
  /* blue.90 */
  'kui-color-border-primary-strongest': #001466;
  /* blue.40 */
  'kui-color-border-primary-weak': #5f9aff;
  /* blue.20 */
  'kui-color-border-primary-weaker': #bee2ff;
  /* blue.10 */
  'kui-color-border-primary-weakest': #eefaff;
  /* transparent */
  'kui-color-border-transparent': rgba(0, 0, 0, 0);
  /* blue.100 */
  'kui-color-text': #000933;
  /* red.60 */
  'kui-color-text-danger': #d60027;
  /* aqua.50 */
  'kui-color-text-decorative': #00abd2;
  /* gray.50 */
  'kui-color-text-disabled': #828a9e;
  /* white */
  'kui-color-text-inverse': #ffffff;
  /* gray.60 */
  'kui-color-text-neutral': #6c7489;
  /* gray.70 */
  'kui-color-text-neutral-strong': #52596e;
  /* gray.80 */
  'kui-color-text-neutral-stronger': #3a3f51;
  /* gray.90 */
  'kui-color-text-neutral-strongest': #232633;
  /* gray.40 */
  'kui-color-text-neutral-weak': #afb7c5;
  /* blue.60 */
  'kui-color-text-primary': #0044f4;
  /* blue.70 */
  'kui-color-text-primary-strong': #0030cc;
  /* blue.80 */
  'kui-color-text-primary-stronger': #002099;
  /* green.60 */
  'kui-color-text-success': #007d60;
  /* yellow.60 */
  'kui-color-text-warning': #995c00;
  'kui-border-radius-0': 0px;
  'kui-border-radius-10': 2px;
  'kui-border-radius-20': 4px;
  'kui-border-radius-30': 6px;
  'kui-border-radius-40': 8px;
  /* Used to create a circle. Value of 50% */
  'kui-border-radius-circle': 50%;
  /* Used to round element corners. Value of 100px */
  'kui-border-radius-round': 100px;
  'kui-border-width-0': 0px;
  'kui-border-width-10': 1px;
  'kui-border-width-20': 2px;
  'kui-border-width-30': 4px;
  /* Used for larger mobile screens. Anything viewport width under this value is considered mobile. */
  'kui-breakpoint-mobile': 640px;
  /* Used for tablet screens. */
  'kui-breakpoint-phablet': 768px;
  /* Used for larger tablet screens. Any viewport width less than this value will likely show a mobile layout. Any viewport width this value and greater will likely show a desktop layout. */
  'kui-breakpoint-tablet': 1024px;
  /* Used for standard desktop screens. */
  'kui-breakpoint-laptop': 1280px;
  /* Used for larger desktop screens. */
  'kui-breakpoint-desktop': 1536px;
  'kui-icon-size-10': 10px;
  'kui-icon-size-20': 12px;
  'kui-icon-size-30': 16px;
  'kui-icon-size-40': 20px;
  /* The default icon size */
  'kui-icon-size-50': 24px;
  'kui-icon-size-60': 32px;
  'kui-icon-size-70': 40px;
  'kui-icon-size-80': 48px;
  /* purple.10 */
  'kui-method-color-background-connect': #f1f0ff;
  /* red.10 */
  'kui-method-color-background-delete': #ffe5e5;
  /* blue.10 */
  'kui-method-color-background-get': #eefaff;
  /* gray.60 */
  'kui-method-color-background-head': #6c7489;
  /* gray.10 */
  'kui-method-color-background-options': #f9fafb;
  /* aqua.10 */
  'kui-method-color-background-patch': #ecfcff;
  /* green.10 */
  'kui-method-color-background-post': #ecfffb;
  /* yellow.10 */
  'kui-method-color-background-put': #fffce0;
  /* pink.10 */
  'kui-method-color-background-trace': #fff0f7;
  /* purple.60 */
  'kui-method-color-text-connect': #6f28ff;
  /* red.60 */
  'kui-method-color-text-delete': #d60027;
  /* blue.60 */
  'kui-method-color-text-get': #0044f4;
  /* gray.10 */
  'kui-method-color-text-head': #f9fafb;
  /* gray.60 */
  'kui-method-color-text-options': #6c7489;
  /* aqua.60 */
  'kui-method-color-text-patch': #00819d;
  /* green.60 */
  'kui-method-color-text-post': #007d60;
  /* yellow.60 */
  'kui-method-color-text-put': #995c00;
  /* pink.60 */
  'kui-method-color-text-trace': #d60067;
  /* The standard monospace font family. */
  'kui-font-family-code': 'JetBrains Mono', Consolas, monospace;
  /* The standard text font family. */
  'kui-font-family-text': 'Inter', Roboto, Helvetica, sans-serif;
  'kui-font-size-10': 10px;
  'kui-font-size-20': 12px;
  'kui-font-size-30': 14px;
  'kui-font-size-40': 16px;
  'kui-font-size-50': 18px;
  'kui-font-size-60': 20px;
  'kui-font-size-70': 24px;
  'kui-font-size-80': 32px;
  'kui-font-size-90': 40px;
  'kui-font-size-100': 48px;
  /* 700 */
  'kui-font-weight-bold': 700;
  /* 500 */
  'kui-font-weight-medium': 500;
  /* 400: The normal font weight. */
  'kui-font-weight-regular': 400;
  /* 600 */
  'kui-font-weight-semibold': 600;
  /* 12px */
  'kui-line-height-10': 12px;
  /* 16px */
  'kui-line-height-20': 16px;
  /* 20px */
  'kui-line-height-30': 20px;
  /* 24px */
  'kui-line-height-40': 24px;
  /* 28px */
  'kui-line-height-50': 28px;
  /* 32px */
  'kui-line-height-60': 32px;
  /* 36px */
  'kui-line-height-70': 36px;
  /* 40px */
  'kui-line-height-80': 40px;
  /* 48px */
  'kui-line-height-90': 48px;
  /* 56px */
  'kui-line-height-100': 56px;
  /* 0px */
  'kui-space-0': 0px;
  /* 2px */
  'kui-space-10': 2px;
  /* 4px */
  'kui-space-20': 4px;
  /* 6px */
  'kui-space-30': 6px;
  /* 8px */
  'kui-space-40': 8px;
  /* 12px */
  'kui-space-50': 12px;
  /* 16px */
  'kui-space-60': 16px;
  /* 20px */
  'kui-space-70': 20px;
  /* 24px */
  'kui-space-80': 24px;
  /* 32px */
  'kui-space-90': 32px;
  /* 40px */
  'kui-space-100': 40px;
  /* 48px */
  'kui-space-110': 48px;
  /* 56px */
  'kui-space-120': 56px;
  /* 64px */
  'kui-space-130': 64px;
  /* 80px */
  'kui-space-140': 80px;
  /* 96px */
  'kui-space-150': 96px;
  /* auto */
  'kui-space-auto': auto;
);
```

</details>

## LESS

### LESS Variables

<details>

<summary>Click to view the list of LESS variables</summary>

```less
/* white */
@kui-color-background: #ffffff;
/* red.60 */
@kui-color-background-danger: #d60027;
/* red.70 */
@kui-color-background-danger-strong: #ad000e;
/* red.80 */
@kui-color-background-danger-stronger: #850000;
/* red.90 */
@kui-color-background-danger-strongest: #5c0000;
/* red.40 */
@kui-color-background-danger-weak: #ff3954;
/* red.20 */
@kui-color-background-danger-weaker: #ffabab;
/* red.10 */
@kui-color-background-danger-weakest: #ffe5e5;
/* gray.20 */
@kui-color-background-disabled: #e0e4ea;
/* blue.100 */
@kui-color-background-inverse: #000933;
/* gray.60 */
@kui-color-background-neutral: #6c7489;
/* gray.70 */
@kui-color-background-neutral-strong: #52596e;
/* gray.80 */
@kui-color-background-neutral-stronger: #3a3f51;
/* gray.90 */
@kui-color-background-neutral-strongest: #232633;
/* gray.40 */
@kui-color-background-neutral-weak: #afb7c5;
/* gray.20 */
@kui-color-background-neutral-weaker: #e0e4ea;
/* gray.10 */
@kui-color-background-neutral-weakest: #f9fafb;
/* blue.60 */
@kui-color-background-primary: #0044f4;
/* blue.70 */
@kui-color-background-primary-strong: #0030cc;
/* blue.80 */
@kui-color-background-primary-stronger: #002099;
/* blue.90 */
@kui-color-background-primary-strongest: #001466;
/* blue.40 */
@kui-color-background-primary-weak: #5f9aff;
/* blue.20 */
@kui-color-background-primary-weaker: #bee2ff;
/* blue.10 */
@kui-color-background-primary-weakest: #eefaff;
/* green.10 */
@kui-color-background-success-weakest: #ecfffb;
/* transparent */
@kui-color-background-transparent: rgba(0, 0, 0, 0);
/* yellow.10 */
@kui-color-background-warning-weakest: #fffce0;
/* gray.20 */
@kui-color-border: #e0e4ea;
/* red.60 */
@kui-color-border-danger: #d60027;
/* red.70 */
@kui-color-border-danger-strong: #ad000e;
/* red.80 */
@kui-color-border-danger-stronger: #850000;
/* red.90 */
@kui-color-border-danger-strongest: #5c0000;
/* red.40 */
@kui-color-border-danger-weak: #ff3954;
/* red.20 */
@kui-color-border-danger-weaker: #ffabab;
/* red.10 */
@kui-color-border-danger-weakest: #ffe5e5;
/* purple.60 */
@kui-color-border-decorative: #6f28ff;
/* gray.20 */
@kui-color-border-disabled: #e0e4ea;
/* gray.40 */
@kui-color-border-neutral-weak: #afb7c5;
/* blue.60 */
@kui-color-border-primary: #0044f4;
/* blue.70 */
@kui-color-border-primary-strong: #0030cc;
/* blue.80 */
@kui-color-border-primary-stronger: #002099;
/* blue.90 */
@kui-color-border-primary-strongest: #001466;
/* blue.40 */
@kui-color-border-primary-weak: #5f9aff;
/* blue.20 */
@kui-color-border-primary-weaker: #bee2ff;
/* blue.10 */
@kui-color-border-primary-weakest: #eefaff;
/* transparent */
@kui-color-border-transparent: rgba(0, 0, 0, 0);
/* blue.100 */
@kui-color-text: #000933;
/* red.60 */
@kui-color-text-danger: #d60027;
/* aqua.50 */
@kui-color-text-decorative: #00abd2;
/* gray.50 */
@kui-color-text-disabled: #828a9e;
/* white */
@kui-color-text-inverse: #ffffff;
/* gray.60 */
@kui-color-text-neutral: #6c7489;
/* gray.70 */
@kui-color-text-neutral-strong: #52596e;
/* gray.80 */
@kui-color-text-neutral-stronger: #3a3f51;
/* gray.90 */
@kui-color-text-neutral-strongest: #232633;
/* gray.40 */
@kui-color-text-neutral-weak: #afb7c5;
/* blue.60 */
@kui-color-text-primary: #0044f4;
/* blue.70 */
@kui-color-text-primary-strong: #0030cc;
/* blue.80 */
@kui-color-text-primary-stronger: #002099;
/* green.60 */
@kui-color-text-success: #007d60;
/* yellow.60 */
@kui-color-text-warning: #995c00;
@kui-border-radius-0: 0px;
@kui-border-radius-10: 2px;
@kui-border-radius-20: 4px;
@kui-border-radius-30: 6px;
@kui-border-radius-40: 8px;
/* Used to create a circle. Value of 50% */
@kui-border-radius-circle: 50%;
/* Used to round element corners. Value of 100px */
@kui-border-radius-round: 100px;
@kui-border-width-0: 0px;
@kui-border-width-10: 1px;
@kui-border-width-20: 2px;
@kui-border-width-30: 4px;
/* Used for larger mobile screens. Anything viewport width under this value is considered mobile. */
@kui-breakpoint-mobile: 640px;
/* Used for tablet screens. */
@kui-breakpoint-phablet: 768px;
/* Used for larger tablet screens. Any viewport width less than this value will likely show a mobile layout. Any viewport width this value and greater will likely show a desktop layout. */
@kui-breakpoint-tablet: 1024px;
/* Used for standard desktop screens. */
@kui-breakpoint-laptop: 1280px;
/* Used for larger desktop screens. */
@kui-breakpoint-desktop: 1536px;
@kui-icon-size-10: 10px;
@kui-icon-size-20: 12px;
@kui-icon-size-30: 16px;
@kui-icon-size-40: 20px;
/* The default icon size */
@kui-icon-size-50: 24px;
@kui-icon-size-60: 32px;
@kui-icon-size-70: 40px;
@kui-icon-size-80: 48px;
/* purple.10 */
@kui-method-color-background-connect: #f1f0ff;
/* red.10 */
@kui-method-color-background-delete: #ffe5e5;
/* blue.10 */
@kui-method-color-background-get: #eefaff;
/* gray.60 */
@kui-method-color-background-head: #6c7489;
/* gray.10 */
@kui-method-color-background-options: #f9fafb;
/* aqua.10 */
@kui-method-color-background-patch: #ecfcff;
/* green.10 */
@kui-method-color-background-post: #ecfffb;
/* yellow.10 */
@kui-method-color-background-put: #fffce0;
/* pink.10 */
@kui-method-color-background-trace: #fff0f7;
/* purple.60 */
@kui-method-color-text-connect: #6f28ff;
/* red.60 */
@kui-method-color-text-delete: #d60027;
/* blue.60 */
@kui-method-color-text-get: #0044f4;
/* gray.10 */
@kui-method-color-text-head: #f9fafb;
/* gray.60 */
@kui-method-color-text-options: #6c7489;
/* aqua.60 */
@kui-method-color-text-patch: #00819d;
/* green.60 */
@kui-method-color-text-post: #007d60;
/* yellow.60 */
@kui-method-color-text-put: #995c00;
/* pink.60 */
@kui-method-color-text-trace: #d60067;
/* The standard monospace font family. */
@kui-font-family-code: 'JetBrains Mono', Consolas, monospace;
/* The standard text font family. */
@kui-font-family-text: 'Inter', Roboto, Helvetica, sans-serif;
@kui-font-size-10: 10px;
@kui-font-size-20: 12px;
@kui-font-size-30: 14px;
@kui-font-size-40: 16px;
@kui-font-size-50: 18px;
@kui-font-size-60: 20px;
@kui-font-size-70: 24px;
@kui-font-size-80: 32px;
@kui-font-size-90: 40px;
@kui-font-size-100: 48px;
/* 700 */
@kui-font-weight-bold: 700;
/* 500 */
@kui-font-weight-medium: 500;
/* 400: The normal font weight. */
@kui-font-weight-regular: 400;
/* 600 */
@kui-font-weight-semibold: 600;
/* 12px */
@kui-line-height-10: 12px;
/* 16px */
@kui-line-height-20: 16px;
/* 20px */
@kui-line-height-30: 20px;
/* 24px */
@kui-line-height-40: 24px;
/* 28px */
@kui-line-height-50: 28px;
/* 32px */
@kui-line-height-60: 32px;
/* 36px */
@kui-line-height-70: 36px;
/* 40px */
@kui-line-height-80: 40px;
/* 48px */
@kui-line-height-90: 48px;
/* 56px */
@kui-line-height-100: 56px;
/* 0px */
@kui-space-0: 0px;
/* 2px */
@kui-space-10: 2px;
/* 4px */
@kui-space-20: 4px;
/* 6px */
@kui-space-30: 6px;
/* 8px */
@kui-space-40: 8px;
/* 12px */
@kui-space-50: 12px;
/* 16px */
@kui-space-60: 16px;
/* 20px */
@kui-space-70: 20px;
/* 24px */
@kui-space-80: 24px;
/* 32px */
@kui-space-90: 32px;
/* 40px */
@kui-space-100: 40px;
/* 48px */
@kui-space-110: 48px;
/* 56px */
@kui-space-120: 56px;
/* 64px */
@kui-space-130: 64px;
/* 80px */
@kui-space-140: 80px;
/* 96px */
@kui-space-150: 96px;
/* auto */
@kui-space-auto: auto;
```

</details>

## CSS

### CSS Custom Properties

You may scope your CSS custom property overrides inside the `:root` selector as shown here, or inside any other valid CSS selector.

<details>

<summary>Click to view the list of CSS custom properties</summary>

```scss
/* white */
--kui-color-background: #ffffff;
/* red.60 */
--kui-color-background-danger: #d60027;
/* red.70 */
--kui-color-background-danger-strong: #ad000e;
/* red.80 */
--kui-color-background-danger-stronger: #850000;
/* red.90 */
--kui-color-background-danger-strongest: #5c0000;
/* red.40 */
--kui-color-background-danger-weak: #ff3954;
/* red.20 */
--kui-color-background-danger-weaker: #ffabab;
/* red.10 */
--kui-color-background-danger-weakest: #ffe5e5;
/* gray.20 */
--kui-color-background-disabled: #e0e4ea;
/* blue.100 */
--kui-color-background-inverse: #000933;
/* gray.60 */
--kui-color-background-neutral: #6c7489;
/* gray.70 */
--kui-color-background-neutral-strong: #52596e;
/* gray.80 */
--kui-color-background-neutral-stronger: #3a3f51;
/* gray.90 */
--kui-color-background-neutral-strongest: #232633;
/* gray.40 */
--kui-color-background-neutral-weak: #afb7c5;
/* gray.20 */
--kui-color-background-neutral-weaker: #e0e4ea;
/* gray.10 */
--kui-color-background-neutral-weakest: #f9fafb;
/* blue.60 */
--kui-color-background-primary: #0044f4;
/* blue.70 */
--kui-color-background-primary-strong: #0030cc;
/* blue.80 */
--kui-color-background-primary-stronger: #002099;
/* blue.90 */
--kui-color-background-primary-strongest: #001466;
/* blue.40 */
--kui-color-background-primary-weak: #5f9aff;
/* blue.20 */
--kui-color-background-primary-weaker: #bee2ff;
/* blue.10 */
--kui-color-background-primary-weakest: #eefaff;
/* green.10 */
--kui-color-background-success-weakest: #ecfffb;
/* transparent */
--kui-color-background-transparent: rgba(0, 0, 0, 0);
/* yellow.10 */
--kui-color-background-warning-weakest: #fffce0;
/* gray.20 */
--kui-color-border: #e0e4ea;
/* red.60 */
--kui-color-border-danger: #d60027;
/* red.70 */
--kui-color-border-danger-strong: #ad000e;
/* red.80 */
--kui-color-border-danger-stronger: #850000;
/* red.90 */
--kui-color-border-danger-strongest: #5c0000;
/* red.40 */
--kui-color-border-danger-weak: #ff3954;
/* red.20 */
--kui-color-border-danger-weaker: #ffabab;
/* red.10 */
--kui-color-border-danger-weakest: #ffe5e5;
/* purple.60 */
--kui-color-border-decorative: #6f28ff;
/* gray.20 */
--kui-color-border-disabled: #e0e4ea;
/* gray.40 */
--kui-color-border-neutral-weak: #afb7c5;
/* blue.60 */
--kui-color-border-primary: #0044f4;
/* blue.70 */
--kui-color-border-primary-strong: #0030cc;
/* blue.80 */
--kui-color-border-primary-stronger: #002099;
/* blue.90 */
--kui-color-border-primary-strongest: #001466;
/* blue.40 */
--kui-color-border-primary-weak: #5f9aff;
/* blue.20 */
--kui-color-border-primary-weaker: #bee2ff;
/* blue.10 */
--kui-color-border-primary-weakest: #eefaff;
/* transparent */
--kui-color-border-transparent: rgba(0, 0, 0, 0);
/* blue.100 */
--kui-color-text: #000933;
/* red.60 */
--kui-color-text-danger: #d60027;
/* aqua.50 */
--kui-color-text-decorative: #00abd2;
/* gray.50 */
--kui-color-text-disabled: #828a9e;
/* white */
--kui-color-text-inverse: #ffffff;
/* gray.60 */
--kui-color-text-neutral: #6c7489;
/* gray.70 */
--kui-color-text-neutral-strong: #52596e;
/* gray.80 */
--kui-color-text-neutral-stronger: #3a3f51;
/* gray.90 */
--kui-color-text-neutral-strongest: #232633;
/* gray.40 */
--kui-color-text-neutral-weak: #afb7c5;
/* blue.60 */
--kui-color-text-primary: #0044f4;
/* blue.70 */
--kui-color-text-primary-strong: #0030cc;
/* blue.80 */
--kui-color-text-primary-stronger: #002099;
/* green.60 */
--kui-color-text-success: #007d60;
/* yellow.60 */
--kui-color-text-warning: #995c00;
--kui-border-radius-0: 0px;
--kui-border-radius-10: 2px;
--kui-border-radius-20: 4px;
--kui-border-radius-30: 6px;
--kui-border-radius-40: 8px;
/* Used to create a circle. Value of 50% */
--kui-border-radius-circle: 50%;
/* Used to round element corners. Value of 100px */
--kui-border-radius-round: 100px;
--kui-border-width-0: 0px;
--kui-border-width-10: 1px;
--kui-border-width-20: 2px;
--kui-border-width-30: 4px;
/* Used for larger mobile screens. Anything viewport width under this value is considered mobile. */
--kui-breakpoint-mobile: 640px;
/* Used for tablet screens. */
--kui-breakpoint-phablet: 768px;
/* Used for larger tablet screens. Any viewport width less than this value will likely show a mobile layout. Any viewport width this value and greater will likely show a desktop layout. */
--kui-breakpoint-tablet: 1024px;
/* Used for standard desktop screens. */
--kui-breakpoint-laptop: 1280px;
/* Used for larger desktop screens. */
--kui-breakpoint-desktop: 1536px;
--kui-icon-size-10: 10px;
--kui-icon-size-20: 12px;
--kui-icon-size-30: 16px;
--kui-icon-size-40: 20px;
/* The default icon size */
--kui-icon-size-50: 24px;
--kui-icon-size-60: 32px;
--kui-icon-size-70: 40px;
--kui-icon-size-80: 48px;
/* purple.10 */
--kui-method-color-background-connect: #f1f0ff;
/* red.10 */
--kui-method-color-background-delete: #ffe5e5;
/* blue.10 */
--kui-method-color-background-get: #eefaff;
/* gray.60 */
--kui-method-color-background-head: #6c7489;
/* gray.10 */
--kui-method-color-background-options: #f9fafb;
/* aqua.10 */
--kui-method-color-background-patch: #ecfcff;
/* green.10 */
--kui-method-color-background-post: #ecfffb;
/* yellow.10 */
--kui-method-color-background-put: #fffce0;
/* pink.10 */
--kui-method-color-background-trace: #fff0f7;
/* purple.60 */
--kui-method-color-text-connect: #6f28ff;
/* red.60 */
--kui-method-color-text-delete: #d60027;
/* blue.60 */
--kui-method-color-text-get: #0044f4;
/* gray.10 */
--kui-method-color-text-head: #f9fafb;
/* gray.60 */
--kui-method-color-text-options: #6c7489;
/* aqua.60 */
--kui-method-color-text-patch: #00819d;
/* green.60 */
--kui-method-color-text-post: #007d60;
/* yellow.60 */
--kui-method-color-text-put: #995c00;
/* pink.60 */
--kui-method-color-text-trace: #d60067;
/* The standard monospace font family. */
--kui-font-family-code: 'JetBrains Mono', Consolas, monospace;
/* The standard text font family. */
--kui-font-family-text: 'Inter', Roboto, Helvetica, sans-serif;
--kui-font-size-10: 10px;
--kui-font-size-20: 12px;
--kui-font-size-30: 14px;
--kui-font-size-40: 16px;
--kui-font-size-50: 18px;
--kui-font-size-60: 20px;
--kui-font-size-70: 24px;
--kui-font-size-80: 32px;
--kui-font-size-90: 40px;
--kui-font-size-100: 48px;
/* 700 */
--kui-font-weight-bold: 700;
/* 500 */
--kui-font-weight-medium: 500;
/* 400: The normal font weight. */
--kui-font-weight-regular: 400;
/* 600 */
--kui-font-weight-semibold: 600;
/* 12px */
--kui-line-height-10: 12px;
/* 16px */
--kui-line-height-20: 16px;
/* 20px */
--kui-line-height-30: 20px;
/* 24px */
--kui-line-height-40: 24px;
/* 28px */
--kui-line-height-50: 28px;
/* 32px */
--kui-line-height-60: 32px;
/* 36px */
--kui-line-height-70: 36px;
/* 40px */
--kui-line-height-80: 40px;
/* 48px */
--kui-line-height-90: 48px;
/* 56px */
--kui-line-height-100: 56px;
/* 0px */
--kui-space-0: 0px;
/* 2px */
--kui-space-10: 2px;
/* 4px */
--kui-space-20: 4px;
/* 6px */
--kui-space-30: 6px;
/* 8px */
--kui-space-40: 8px;
/* 12px */
--kui-space-50: 12px;
/* 16px */
--kui-space-60: 16px;
/* 20px */
--kui-space-70: 20px;
/* 24px */
--kui-space-80: 24px;
/* 32px */
--kui-space-90: 32px;
/* 40px */
--kui-space-100: 40px;
/* 48px */
--kui-space-110: 48px;
/* 56px */
--kui-space-120: 56px;
/* 64px */
--kui-space-130: 64px;
/* 80px */
--kui-space-140: 80px;
/* 96px */
--kui-space-150: 96px;
/* auto */
--kui-space-auto: auto;
```

</details>

## JavaScript

### JavaScript / TypeScript Constants

<details>

<summary>Click to view the list of JavaScript variables</summary>

```javascript
/* white */
export const KUI_COLOR_BACKGROUND = "#ffffff";
/* red.60 */
export const KUI_COLOR_BACKGROUND_DANGER = "#d60027";
/* red.70 */
export const KUI_COLOR_BACKGROUND_DANGER_STRONG = "#ad000e";
/* red.80 */
export const KUI_COLOR_BACKGROUND_DANGER_STRONGER = "#850000";
/* red.90 */
export const KUI_COLOR_BACKGROUND_DANGER_STRONGEST = "#5c0000";
/* red.40 */
export const KUI_COLOR_BACKGROUND_DANGER_WEAK = "#ff3954";
/* red.20 */
export const KUI_COLOR_BACKGROUND_DANGER_WEAKER = "#ffabab";
/* red.10 */
export const KUI_COLOR_BACKGROUND_DANGER_WEAKEST = "#ffe5e5";
/* gray.20 */
export const KUI_COLOR_BACKGROUND_DISABLED = "#e0e4ea";
/* blue.100 */
export const KUI_COLOR_BACKGROUND_INVERSE = "#000933";
/* gray.60 */
export const KUI_COLOR_BACKGROUND_NEUTRAL = "#6c7489";
/* gray.70 */
export const KUI_COLOR_BACKGROUND_NEUTRAL_STRONG = "#52596e";
/* gray.80 */
export const KUI_COLOR_BACKGROUND_NEUTRAL_STRONGER = "#3a3f51";
/* gray.90 */
export const KUI_COLOR_BACKGROUND_NEUTRAL_STRONGEST = "#232633";
/* gray.40 */
export const KUI_COLOR_BACKGROUND_NEUTRAL_WEAK = "#afb7c5";
/* gray.20 */
export const KUI_COLOR_BACKGROUND_NEUTRAL_WEAKER = "#e0e4ea";
/* gray.10 */
export const KUI_COLOR_BACKGROUND_NEUTRAL_WEAKEST = "#f9fafb";
/* blue.60 */
export const KUI_COLOR_BACKGROUND_PRIMARY = "#0044f4";
/* blue.70 */
export const KUI_COLOR_BACKGROUND_PRIMARY_STRONG = "#0030cc";
/* blue.80 */
export const KUI_COLOR_BACKGROUND_PRIMARY_STRONGER = "#002099";
/* blue.90 */
export const KUI_COLOR_BACKGROUND_PRIMARY_STRONGEST = "#001466";
/* blue.40 */
export const KUI_COLOR_BACKGROUND_PRIMARY_WEAK = "#5f9aff";
/* blue.20 */
export const KUI_COLOR_BACKGROUND_PRIMARY_WEAKER = "#bee2ff";
/* blue.10 */
export const KUI_COLOR_BACKGROUND_PRIMARY_WEAKEST = "#eefaff";
/* green.10 */
export const KUI_COLOR_BACKGROUND_SUCCESS_WEAKEST = "#ecfffb";
/* transparent */
export const KUI_COLOR_BACKGROUND_TRANSPARENT = "rgba(0, 0, 0, 0)";
/* yellow.10 */
export const KUI_COLOR_BACKGROUND_WARNING_WEAKEST = "#fffce0";
/* gray.20 */
export const KUI_COLOR_BORDER = "#e0e4ea";
/* red.60 */
export const KUI_COLOR_BORDER_DANGER = "#d60027";
/* red.70 */
export const KUI_COLOR_BORDER_DANGER_STRONG = "#ad000e";
/* red.80 */
export const KUI_COLOR_BORDER_DANGER_STRONGER = "#850000";
/* red.90 */
export const KUI_COLOR_BORDER_DANGER_STRONGEST = "#5c0000";
/* red.40 */
export const KUI_COLOR_BORDER_DANGER_WEAK = "#ff3954";
/* red.20 */
export const KUI_COLOR_BORDER_DANGER_WEAKER = "#ffabab";
/* red.10 */
export const KUI_COLOR_BORDER_DANGER_WEAKEST = "#ffe5e5";
/* purple.60 */
export const KUI_COLOR_BORDER_DECORATIVE = "#6f28ff";
/* gray.20 */
export const KUI_COLOR_BORDER_DISABLED = "#e0e4ea";
/* gray.40 */
export const KUI_COLOR_BORDER_NEUTRAL_WEAK = "#afb7c5";
/* blue.60 */
export const KUI_COLOR_BORDER_PRIMARY = "#0044f4";
/* blue.70 */
export const KUI_COLOR_BORDER_PRIMARY_STRONG = "#0030cc";
/* blue.80 */
export const KUI_COLOR_BORDER_PRIMARY_STRONGER = "#002099";
/* blue.90 */
export const KUI_COLOR_BORDER_PRIMARY_STRONGEST = "#001466";
/* blue.40 */
export const KUI_COLOR_BORDER_PRIMARY_WEAK = "#5f9aff";
/* blue.20 */
export const KUI_COLOR_BORDER_PRIMARY_WEAKER = "#bee2ff";
/* blue.10 */
export const KUI_COLOR_BORDER_PRIMARY_WEAKEST = "#eefaff";
/* transparent */
export const KUI_COLOR_BORDER_TRANSPARENT = "rgba(0, 0, 0, 0)";
/* blue.100 */
export const KUI_COLOR_TEXT = "#000933";
/* red.60 */
export const KUI_COLOR_TEXT_DANGER = "#d60027";
/* aqua.50 */
export const KUI_COLOR_TEXT_DECORATIVE = "#00abd2";
/* gray.50 */
export const KUI_COLOR_TEXT_DISABLED = "#828a9e";
/* white */
export const KUI_COLOR_TEXT_INVERSE = "#ffffff";
/* gray.60 */
export const KUI_COLOR_TEXT_NEUTRAL = "#6c7489";
/* gray.70 */
export const KUI_COLOR_TEXT_NEUTRAL_STRONG = "#52596e";
/* gray.80 */
export const KUI_COLOR_TEXT_NEUTRAL_STRONGER = "#3a3f51";
/* gray.90 */
export const KUI_COLOR_TEXT_NEUTRAL_STRONGEST = "#232633";
/* gray.40 */
export const KUI_COLOR_TEXT_NEUTRAL_WEAK = "#afb7c5";
/* blue.60 */
export const KUI_COLOR_TEXT_PRIMARY = "#0044f4";
/* blue.70 */
export const KUI_COLOR_TEXT_PRIMARY_STRONG = "#0030cc";
/* blue.80 */
export const KUI_COLOR_TEXT_PRIMARY_STRONGER = "#002099";
/* green.60 */
export const KUI_COLOR_TEXT_SUCCESS = "#007d60";
/* yellow.60 */
export const KUI_COLOR_TEXT_WARNING = "#995c00";
export const KUI_BORDER_RADIUS_0 = "0px";
export const KUI_BORDER_RADIUS_10 = "2px";
export const KUI_BORDER_RADIUS_20 = "4px";
export const KUI_BORDER_RADIUS_30 = "6px";
export const KUI_BORDER_RADIUS_40 = "8px";
/* Used to create a circle. Value of 50% */
export const KUI_BORDER_RADIUS_CIRCLE = "50%";
/* Used to round element corners. Value of 100px */
export const KUI_BORDER_RADIUS_ROUND = "100px";
export const KUI_BORDER_WIDTH_0 = "0px";
export const KUI_BORDER_WIDTH_10 = "1px";
export const KUI_BORDER_WIDTH_20 = "2px";
export const KUI_BORDER_WIDTH_30 = "4px";
/* Used for larger mobile screens. Anything viewport width under this value is considered mobile. */
export const KUI_BREAKPOINT_MOBILE = "640px";
/* Used for tablet screens. */
export const KUI_BREAKPOINT_PHABLET = "768px";
/* Used for larger tablet screens. Any viewport width less than this value will likely show a mobile layout. Any viewport width this value and greater will likely show a desktop layout. */
export const KUI_BREAKPOINT_TABLET = "1024px";
/* Used for standard desktop screens. */
export const KUI_BREAKPOINT_LAPTOP = "1280px";
/* Used for larger desktop screens. */
export const KUI_BREAKPOINT_DESKTOP = "1536px";
export const KUI_ICON_SIZE_10 = "10px";
export const KUI_ICON_SIZE_20 = "12px";
export const KUI_ICON_SIZE_30 = "16px";
export const KUI_ICON_SIZE_40 = "20px";
/* The default icon size */
export const KUI_ICON_SIZE_50 = "24px";
export const KUI_ICON_SIZE_60 = "32px";
export const KUI_ICON_SIZE_70 = "40px";
export const KUI_ICON_SIZE_80 = "48px";
/* purple.10 */
export const KUI_METHOD_COLOR_BACKGROUND_CONNECT = "#f1f0ff";
/* red.10 */
export const KUI_METHOD_COLOR_BACKGROUND_DELETE = "#ffe5e5";
/* blue.10 */
export const KUI_METHOD_COLOR_BACKGROUND_GET = "#eefaff";
/* gray.60 */
export const KUI_METHOD_COLOR_BACKGROUND_HEAD = "#6c7489";
/* gray.10 */
export const KUI_METHOD_COLOR_BACKGROUND_OPTIONS = "#f9fafb";
/* aqua.10 */
export const KUI_METHOD_COLOR_BACKGROUND_PATCH = "#ecfcff";
/* green.10 */
export const KUI_METHOD_COLOR_BACKGROUND_POST = "#ecfffb";
/* yellow.10 */
export const KUI_METHOD_COLOR_BACKGROUND_PUT = "#fffce0";
/* pink.10 */
export const KUI_METHOD_COLOR_BACKGROUND_TRACE = "#fff0f7";
/* purple.60 */
export const KUI_METHOD_COLOR_TEXT_CONNECT = "#6f28ff";
/* red.60 */
export const KUI_METHOD_COLOR_TEXT_DELETE = "#d60027";
/* blue.60 */
export const KUI_METHOD_COLOR_TEXT_GET = "#0044f4";
/* gray.10 */
export const KUI_METHOD_COLOR_TEXT_HEAD = "#f9fafb";
/* gray.60 */
export const KUI_METHOD_COLOR_TEXT_OPTIONS = "#6c7489";
/* aqua.60 */
export const KUI_METHOD_COLOR_TEXT_PATCH = "#00819d";
/* green.60 */
export const KUI_METHOD_COLOR_TEXT_POST = "#007d60";
/* yellow.60 */
export const KUI_METHOD_COLOR_TEXT_PUT = "#995c00";
/* pink.60 */
export const KUI_METHOD_COLOR_TEXT_TRACE = "#d60067";
/* The standard monospace font family. */
export const KUI_FONT_FAMILY_CODE = "'JetBrains Mono', Consolas, monospace";
/* The standard text font family. */
export const KUI_FONT_FAMILY_TEXT = "'Inter', Roboto, Helvetica, sans-serif";
export const KUI_FONT_SIZE_10 = "10px";
export const KUI_FONT_SIZE_20 = "12px";
export const KUI_FONT_SIZE_30 = "14px";
export const KUI_FONT_SIZE_40 = "16px";
export const KUI_FONT_SIZE_50 = "18px";
export const KUI_FONT_SIZE_60 = "20px";
export const KUI_FONT_SIZE_70 = "24px";
export const KUI_FONT_SIZE_80 = "32px";
export const KUI_FONT_SIZE_90 = "40px";
export const KUI_FONT_SIZE_100 = "48px";
/* 700 */
export const KUI_FONT_WEIGHT_BOLD = "700";
/* 500 */
export const KUI_FONT_WEIGHT_MEDIUM = "500";
/* 400: The normal font weight. */
export const KUI_FONT_WEIGHT_REGULAR = "400";
/* 600 */
export const KUI_FONT_WEIGHT_SEMIBOLD = "600";
/* 12px */
export const KUI_LINE_HEIGHT_10 = "12px";
/* 16px */
export const KUI_LINE_HEIGHT_20 = "16px";
/* 20px */
export const KUI_LINE_HEIGHT_30 = "20px";
/* 24px */
export const KUI_LINE_HEIGHT_40 = "24px";
/* 28px */
export const KUI_LINE_HEIGHT_50 = "28px";
/* 32px */
export const KUI_LINE_HEIGHT_60 = "32px";
/* 36px */
export const KUI_LINE_HEIGHT_70 = "36px";
/* 40px */
export const KUI_LINE_HEIGHT_80 = "40px";
/* 48px */
export const KUI_LINE_HEIGHT_90 = "48px";
/* 56px */
export const KUI_LINE_HEIGHT_100 = "56px";
/* 0px */
export const KUI_SPACE_0 = "0px";
/* 2px */
export const KUI_SPACE_10 = "2px";
/* 4px */
export const KUI_SPACE_20 = "4px";
/* 6px */
export const KUI_SPACE_30 = "6px";
/* 8px */
export const KUI_SPACE_40 = "8px";
/* 12px */
export const KUI_SPACE_50 = "12px";
/* 16px */
export const KUI_SPACE_60 = "16px";
/* 20px */
export const KUI_SPACE_70 = "20px";
/* 24px */
export const KUI_SPACE_80 = "24px";
/* 32px */
export const KUI_SPACE_90 = "32px";
/* 40px */
export const KUI_SPACE_100 = "40px";
/* 48px */
export const KUI_SPACE_110 = "48px";
/* 56px */
export const KUI_SPACE_120 = "56px";
/* 64px */
export const KUI_SPACE_130 = "64px";
/* 80px */
export const KUI_SPACE_140 = "80px";
/* 96px */
export const KUI_SPACE_150 = "96px";
/* auto */
export const KUI_SPACE_AUTO = "auto";
```

</details>

### JSON

<details>

<summary>Click to view the exported JSON object</summary>

```json
{
  "kui-color-background": "#ffffff",
  "kui-color-background-danger": "#d60027",
  "kui-color-background-danger-strong": "#ad000e",
  "kui-color-background-danger-stronger": "#850000",
  "kui-color-background-danger-strongest": "#5c0000",
  "kui-color-background-danger-weak": "#ff3954",
  "kui-color-background-danger-weaker": "#ffabab",
  "kui-color-background-danger-weakest": "#ffe5e5",
  "kui-color-background-disabled": "#e0e4ea",
  "kui-color-background-inverse": "#000933",
  "kui-color-background-neutral": "#6c7489",
  "kui-color-background-neutral-strong": "#52596e",
  "kui-color-background-neutral-stronger": "#3a3f51",
  "kui-color-background-neutral-strongest": "#232633",
  "kui-color-background-neutral-weak": "#afb7c5",
  "kui-color-background-neutral-weaker": "#e0e4ea",
  "kui-color-background-neutral-weakest": "#f9fafb",
  "kui-color-background-primary": "#0044f4",
  "kui-color-background-primary-strong": "#0030cc",
  "kui-color-background-primary-stronger": "#002099",
  "kui-color-background-primary-strongest": "#001466",
  "kui-color-background-primary-weak": "#5f9aff",
  "kui-color-background-primary-weaker": "#bee2ff",
  "kui-color-background-primary-weakest": "#eefaff",
  "kui-color-background-success-weakest": "#ecfffb",
  "kui-color-background-transparent": "rgba(0, 0, 0, 0)",
  "kui-color-background-warning-weakest": "#fffce0",
  "kui-color-border": "#e0e4ea",
  "kui-color-border-danger": "#d60027",
  "kui-color-border-danger-strong": "#ad000e",
  "kui-color-border-danger-stronger": "#850000",
  "kui-color-border-danger-strongest": "#5c0000",
  "kui-color-border-danger-weak": "#ff3954",
  "kui-color-border-danger-weaker": "#ffabab",
  "kui-color-border-danger-weakest": "#ffe5e5",
  "kui-color-border-decorative": "#6f28ff",
  "kui-color-border-disabled": "#e0e4ea",
  "kui-color-border-neutral-weak": "#afb7c5",
  "kui-color-border-primary": "#0044f4",
  "kui-color-border-primary-strong": "#0030cc",
  "kui-color-border-primary-stronger": "#002099",
  "kui-color-border-primary-strongest": "#001466",
  "kui-color-border-primary-weak": "#5f9aff",
  "kui-color-border-primary-weaker": "#bee2ff",
  "kui-color-border-primary-weakest": "#eefaff",
  "kui-color-border-transparent": "rgba(0, 0, 0, 0)",
  "kui-color-text": "#000933",
  "kui-color-text-danger": "#d60027",
  "kui-color-text-decorative": "#00abd2",
  "kui-color-text-disabled": "#828a9e",
  "kui-color-text-inverse": "#ffffff",
  "kui-color-text-neutral": "#6c7489",
  "kui-color-text-neutral-strong": "#52596e",
  "kui-color-text-neutral-stronger": "#3a3f51",
  "kui-color-text-neutral-strongest": "#232633",
  "kui-color-text-neutral-weak": "#afb7c5",
  "kui-color-text-primary": "#0044f4",
  "kui-color-text-primary-strong": "#0030cc",
  "kui-color-text-primary-stronger": "#002099",
  "kui-color-text-success": "#007d60",
  "kui-color-text-warning": "#995c00",
  "kui-border-radius-0": "0px",
  "kui-border-radius-10": "2px",
  "kui-border-radius-20": "4px",
  "kui-border-radius-30": "6px",
  "kui-border-radius-40": "8px",
  "kui-border-radius-circle": "50%",
  "kui-border-radius-round": "100px",
  "kui-border-width-0": "0px",
  "kui-border-width-10": "1px",
  "kui-border-width-20": "2px",
  "kui-border-width-30": "4px",
  "kui-breakpoint-mobile": "640px",
  "kui-breakpoint-phablet": "768px",
  "kui-breakpoint-tablet": "1024px",
  "kui-breakpoint-laptop": "1280px",
  "kui-breakpoint-desktop": "1536px",
  "kui-icon-size-10": "10px",
  "kui-icon-size-20": "12px",
  "kui-icon-size-30": "16px",
  "kui-icon-size-40": "20px",
  "kui-icon-size-50": "24px",
  "kui-icon-size-60": "32px",
  "kui-icon-size-70": "40px",
  "kui-icon-size-80": "48px",
  "kui-method-color-background-connect": "#f1f0ff",
  "kui-method-color-background-delete": "#ffe5e5",
  "kui-method-color-background-get": "#eefaff",
  "kui-method-color-background-head": "#6c7489",
  "kui-method-color-background-options": "#f9fafb",
  "kui-method-color-background-patch": "#ecfcff",
  "kui-method-color-background-post": "#ecfffb",
  "kui-method-color-background-put": "#fffce0",
  "kui-method-color-background-trace": "#fff0f7",
  "kui-method-color-text-connect": "#6f28ff",
  "kui-method-color-text-delete": "#d60027",
  "kui-method-color-text-get": "#0044f4",
  "kui-method-color-text-head": "#f9fafb",
  "kui-method-color-text-options": "#6c7489",
  "kui-method-color-text-patch": "#00819d",
  "kui-method-color-text-post": "#007d60",
  "kui-method-color-text-put": "#995c00",
  "kui-method-color-text-trace": "#d60067",
  "kui-font-family-code": "'JetBrains Mono', Consolas, monospace",
  "kui-font-family-text": "'Inter', Roboto, Helvetica, sans-serif",
  "kui-font-size-10": "10px",
  "kui-font-size-20": "12px",
  "kui-font-size-30": "14px",
  "kui-font-size-40": "16px",
  "kui-font-size-50": "18px",
  "kui-font-size-60": "20px",
  "kui-font-size-70": "24px",
  "kui-font-size-80": "32px",
  "kui-font-size-90": "40px",
  "kui-font-size-100": "48px",
  "kui-font-weight-bold": "700",
  "kui-font-weight-medium": "500",
  "kui-font-weight-regular": "400",
  "kui-font-weight-semibold": "600",
  "kui-line-height-10": "12px",
  "kui-line-height-20": "16px",
  "kui-line-height-30": "20px",
  "kui-line-height-40": "24px",
  "kui-line-height-50": "28px",
  "kui-line-height-60": "32px",
  "kui-line-height-70": "36px",
  "kui-line-height-80": "40px",
  "kui-line-height-90": "48px",
  "kui-line-height-100": "56px",
  "kui-space-0": "0px",
  "kui-space-10": "2px",
  "kui-space-20": "4px",
  "kui-space-30": "6px",
  "kui-space-40": "8px",
  "kui-space-50": "12px",
  "kui-space-60": "16px",
  "kui-space-70": "20px",
  "kui-space-80": "24px",
  "kui-space-90": "32px",
  "kui-space-100": "40px",
  "kui-space-110": "48px",
  "kui-space-120": "56px",
  "kui-space-130": "64px",
  "kui-space-140": "80px",
  "kui-space-150": "96px",
  "kui-space-auto": "auto"
}
```

</details>
