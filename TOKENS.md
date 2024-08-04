<!--
 * Do not edit directly, this file was auto-generated.
 * 
 * Kong Design Tokens
 * GitHub: https://github.com/Kong/design-tokens
 * License: Apache-2.0
-->

# Kong Design Tokens
This document outlines the majority of the available tokens.

## SCSS

### SCSS Variables

<details>

<summary>Click to view the list of SCSS variables</summary>

```scss
/* Default background color for containers (white). */
$kui-color-background: #FFF;
/* Background color for danger actions or messages (red.60). */
$kui-color-background-danger: #D60027;
/* Strong background color for danger actions or messages (red.70). */
$kui-color-background-danger-strong: #AD000E;
/* Stronger background color for danger actions or messages (red.80). */
$kui-color-background-danger-stronger: #850000;
/* Strongest background color for danger actions or messages (red.90). */
$kui-color-background-danger-strongest: #5C0000;
/* Weak background color for danger actions or messages (red.40). */
$kui-color-background-danger-weak: #FF3954;
/* Weaker background color for danger actions or messages (red.20). */
$kui-color-background-danger-weaker: #FFABAB;
/* Weakest background color for danger actions or messages (red.10). */
$kui-color-background-danger-weakest: #FFE5E5;
/* Background color for decorative purposes (purple.60). */
$kui-color-background-decorative-purple: #6F28FF;
/* Weakest background color for decorative purposes (purple.10). */
$kui-color-background-decorative-purple-weakest: #F1F0FF;
/* Background color for disabled elements (gray.20). */
$kui-color-background-disabled: #E0E4EA;
/* Inverse background color for containers (blue.100) */
$kui-color-background-inverse: #000933;
/* Background color for neutral elements (gray.60). */
$kui-color-background-neutral: #6C7489;
/* Strong background color for neutral elements (gray.70). */
$kui-color-background-neutral-strong: #52596E;
/* Stronger background color for neutral elements (gray.80). */
$kui-color-background-neutral-stronger: #3A3F51;
/* Strongest background color for neutral elements (gray.90). */
$kui-color-background-neutral-strongest: #232633;
/* Weak background color for neutral elements (gray.40). */
$kui-color-background-neutral-weak: #AFB7C5;
/* Weaker background color for neutral elements (gray.20). */
$kui-color-background-neutral-weaker: #E0E4EA;
/* Weakest background color for neutral elements (gray.10). */
$kui-color-background-neutral-weakest: #F9FAFB;
/* Overlay background color (rgba(blue.100, 0.6)) */
$kui-color-background-overlay: rgba(0, 9, 51, 0.6);
/* Background color for primary actions or messages (blue.60). */
$kui-color-background-primary: #0044F4;
/* Strong background color for primary actions or messages (blue.70). */
$kui-color-background-primary-strong: #0030CC;
/* Stronger background color for primary actions or messages (blue.80). */
$kui-color-background-primary-stronger: #002099;
/* Strongest background color for primary actions or messages (blue.90). */
$kui-color-background-primary-strongest: #001466;
/* Weak background color for primary actions or messages (blue.40). */
$kui-color-background-primary-weak: #5F9AFF;
/* Weaker background color for primary actions or messages (blue.20). */
$kui-color-background-primary-weaker: #BEE2FF;
/* Weakest background color for primary actions or messages (blue.10) */
$kui-color-background-primary-weakest: #EEFAFF;
/* Weak background color for success elements (green.40). */
$kui-color-background-success-weak: #00D6A4;
/* Weakest background color for success elements (green.10). */
$kui-color-background-success-weakest: #ECFFFB;
/* Transparent background color (transparent). */
$kui-color-background-transparent: transparent;
/* Weak background color for warning elements (yellow.40). */
$kui-color-background-warning-weak: #FFC400;
/* Weakest background color for warning elements (yellow.10). */
$kui-color-background-warning-weakest: #FFFCE0;
/* Default border color for containers (gray.20). */
$kui-color-border: #E0E4EA;
/* Border color for danger actions or messages (red.60). */
$kui-color-border-danger: #D60027;
/* Strong border color for danger actions or messages (red.70). */
$kui-color-border-danger-strong: #AD000E;
/* Stronger border color for danger actions or messages (red.80). */
$kui-color-border-danger-stronger: #850000;
/* Strongest border color for danger actions or messages (red.90). */
$kui-color-border-danger-strongest: #5C0000;
/* Weak border color for danger actions or messages (red.40). */
$kui-color-border-danger-weak: #FF3954;
/* Weaker border color for danger actions or messages (red.20). */
$kui-color-border-danger-weaker: #FFABAB;
/* Weakest border color for danger actions or messages (red.10). */
$kui-color-border-danger-weakest: #FFE5E5;
/* Border color for decorative purposes (purple.60). */
$kui-color-border-decorative-purple: #6F28FF;
/* Border color for disabled elements (gray.20). */
$kui-color-border-disabled: #E0E4EA;
/* Inverse border color (rgba(white, 0.2)). */
$kui-color-border-inverse: rgba(255, 255, 255, 0.2);
/* Weak border color for neutral elements (gray.40) */
$kui-color-border-neutral-weak: #AFB7C5;
/* Weaker border color for neutral elements (gray.20) */
$kui-color-border-neutral-weaker: #E0E4EA;
/* Border color for primary actions or messages (blue.60). */
$kui-color-border-primary: #0044F4;
/* Strong border color for primary actions or messages (blue.70). */
$kui-color-border-primary-strong: #0030CC;
/* Stronger border color for primary actions or messages (blue.80). */
$kui-color-border-primary-stronger: #002099;
/* Strongest border color for primary actions or messages (blue.90). */
$kui-color-border-primary-strongest: #001466;
/* Weak border color for primary actions or messages (blue.40). */
$kui-color-border-primary-weak: #5F9AFF;
/* Weaker border color for primary actions or messages (blue.20). */
$kui-color-border-primary-weaker: #BEE2FF;
/* Weakest border color for primary actions or messages (blue.10). */
$kui-color-border-primary-weakest: #EEFAFF;
/* Transparent border color (transparent). */
$kui-color-border-transparent: transparent;
/* Default text color (blue.100). */
$kui-color-text: #000933;
/* Text color for danger actions or messages (red.60). */
$kui-color-text-danger: #D60027;
/* Strong text color for danger actions or messages (red.70). */
$kui-color-text-danger-strong: #AD000E;
/* Text color for decorative purposes (aqua.50). */
$kui-color-text-decorative-aqua: #00ABD2;
/* Text color for decorative purposes (pink.60). */
$kui-color-text-decorative-pink: #D60067;
/* Text color for decorative purposes (purple.60). */
$kui-color-text-decorative-purple: #6F28FF;
/* Strong text color for decorative purposes (purple.70). */
$kui-color-text-decorative-purple-strong: #5E00F5;
/* Text color for disabled elements (gray.40). */
$kui-color-text-disabled: #AFB7C5;
/* Inverse text color (white). */
$kui-color-text-inverse: #FFF;
/* Text color for neutral elements (gray.60). */
$kui-color-text-neutral: #6C7489;
/* Strong text color for neutral elements (gray.70). */
$kui-color-text-neutral-strong: #52596E;
/* Stronger text color for neutral elements (gray.80). */
$kui-color-text-neutral-stronger: #3A3F51;
/* Strongest text color for neutral elements (gray.90). */
$kui-color-text-neutral-strongest: #232633;
/* Weak text color for neutral elements (gray.40). */
$kui-color-text-neutral-weak: #AFB7C5;
/* Weaker text color for neutral elements (gray.20). */
$kui-color-text-neutral-weaker: #E0E4EA;
/* Text color for primary actions or messages (blue.60). */
$kui-color-text-primary: #0044F4;
/* Strong text color for primary actions or messages (blue.70). */
$kui-color-text-primary-strong: #0030CC;
/* Stronger text color for primary actions or messages (blue.80). */
$kui-color-text-primary-stronger: #002099;
/* Strongest text color for primary actions or messages (blue.90). */
$kui-color-text-primary-strongest: #001466;
/* Weak text color for primary actions or messages (blue.40). */
$kui-color-text-primary-weak: #5F9AFF;
/* Text color for success actions or messages (green.60). */
$kui-color-text-success: #007D60;
/* Strong text color for success actions or messages (green.70). */
$kui-color-text-success-strong: #005944;
/* Text color for warning actions or messages (yellow.60). */
$kui-color-text-warning: #995C00;
/* Text color for warning actions or messages (yellow.70). */
$kui-color-text-warning-strong: #804400;
/* Default transition timing */
$kui-animation-duration-20: 0.2s;
/* 0px border radius. */
$kui-border-radius-0: 0px;
/* 2px border radius. */
$kui-border-radius-10: 2px;
/* 4px border radius. */
$kui-border-radius-20: 4px;
/* 6px border radius. */
$kui-border-radius-30: 6px;
/* 8px border radius. */
$kui-border-radius-40: 8px;
/* 10px border radius. */
$kui-border-radius-50: 10px;
/* 50% border radius used to create circles. */
$kui-border-radius-circle: 50%;
/* 100px border radius used to create pill shapes. */
$kui-border-radius-round: 100px;
/* 0px border width. */
$kui-border-width-0: 0px;
/* 1px border width. */
$kui-border-width-10: 1px;
/* 2px border width. */
$kui-border-width-20: 2px;
/* 4px border width. */
$kui-border-width-30: 4px;
/* Used for larger mobile screens. Any viewport width under this value is considered mobile. */
$kui-breakpoint-mobile: 640px;
/* Used for tablet screens. */
$kui-breakpoint-phablet: 768px;
/* Used for larger tablet screens. Any viewport width less than this value will likely show a mobile layout. Any viewport width this value and greater will likely show a desktop layout. */
$kui-breakpoint-tablet: 1024px;
/* Used for standard desktop screens. */
$kui-breakpoint-laptop: 1280px;
/* Used for larger desktop screens. */
$kui-breakpoint-desktop: 1536px;
/* Danger color for icons. */
$kui-icon-color-danger: #F50045;
/* Neutral color for icons. */
$kui-icon-color-neutral: #828A9E;
/* Primary color for icons. */
$kui-icon-color-primary: #306FFF;
/* Success color for icons. */
$kui-icon-color-success: #00A17B;
/* Warning color for icons. */
$kui-icon-color-warning: #FFC400;
/* 10px icon size. */
$kui-icon-size-10: 10px;
/* 12px icon size. */
$kui-icon-size-20: 12px;
/* 16px icon size. */
$kui-icon-size-30: 16px;
/* 20px icon size. */
$kui-icon-size-40: 20px;
/* 24px icon size (default). */
$kui-icon-size-50: 24px;
/* 32px icon size. */
$kui-icon-size-60: 32px;
/* 40px icon size. */
$kui-icon-size-70: 40px;
/* 48px icon size. */
$kui-icon-size-80: 48px;
/* Background color for the CONNECT method (purple.10). */
$kui-method-color-background-connect: #F1F0FF;
/* Background color for the DELETE method (red.10). */
$kui-method-color-background-delete: #FFE5E5;
/* Background color for the GET method (blue.10). */
$kui-method-color-background-get: #EEFAFF;
/* Background color for the HEAD method (gray.70). */
$kui-method-color-background-head: #52596E;
/* Background color for the OPTIONS method (gray.20). */
$kui-method-color-background-options: #E0E4EA;
/* Background color for the PATCH method (aqua.10). */
$kui-method-color-background-patch: #ECFCFF;
/* Background color for the POST method (green.10). */
$kui-method-color-background-post: #ECFFFB;
/* Background color for the PUT method (yellow.10). */
$kui-method-color-background-put: #FFFCE0;
/* Background color for the TRACE method (pink.10). */
$kui-method-color-background-trace: #FFF0F7;
/* Text color for the CONNECT method (purple.60). */
$kui-method-color-text-connect: #6F28FF;
/* Strong text color for the CONNECT method (purple.70). */
$kui-method-color-text-connect-strong: #5E00F5;
/* Text color for the DELETE method (red.60). */
$kui-method-color-text-delete: #D60027;
/* Strong text color for the DELETE method (red.70). */
$kui-method-color-text-delete-strong: #AD000E;
/* Text color for the GET method (blue.60). */
$kui-method-color-text-get: #0044F4;
/* Strong text color for the GET method (blue.70). */
$kui-method-color-text-get-strong: #0030CC;
/* Text color for the HEAD method (gray.20). */
$kui-method-color-text-head: #E0E4EA;
/* Strong text color for the HEAD method (gray.40). */
$kui-method-color-text-head-strong: #AFB7C5;
/* Text color for the OPTIONS method (gray.70). */
$kui-method-color-text-options: #52596E;
/* Strong text color for the OPTIONS method (gray.80). */
$kui-method-color-text-options-strong: #3A3F51;
/* Text color for the PATCH method (aqua.60). */
$kui-method-color-text-patch: #00819D;
/* Strong text color for the PATCH method (aqua.70). */
$kui-method-color-text-patch-strong: #00647A;
/* Text color for the POST method (green.60). */
$kui-method-color-text-post: #007D60;
/* Strong text color for the POST method (green.70). */
$kui-method-color-text-post-strong: #005944;
/* Text color for the PUT method (yellow.60). */
$kui-method-color-text-put: #995C00;
/* Strong text color for the PUT method (yellow.70). */
$kui-method-color-text-put-strong: #804400;
/* Text color for the TRACE method (pink.60). */
$kui-method-color-text-trace: #D60067;
/* Strong text color for the TRACE method (pink.70). */
$kui-method-color-text-trace-strong: #AD0053;
/* blue.100 */
$kui-navigation-color-background: #000933;
/* The background color of a selected navigation item. */
$kui-navigation-color-background-selected: rgba(255, 255, 255, 0.12);
/* rgba(white, 0.12) */
$kui-navigation-color-border: rgba(255, 255, 255, 0.12);
/* The border color for a selected child navigation item. */
$kui-navigation-color-border-child: #00FABE;
/* The color of the navigation section divider. */
$kui-navigation-color-border-divider: rgba(255, 255, 255, 0.24);
/* Navigation link and icon color. */
$kui-navigation-color-text: #BEE2FF;
/* Navigation link and icon focus-visible color. */
$kui-navigation-color-text-focus: #FFF;
/* Navigation link and icon hover color. */
$kui-navigation-color-text-hover: #EEFAFF;
/* Navigation link and icon selected color. */
$kui-navigation-color-text-selected: #00FABE;
/* The box-shadow for a focus-visible navigation link. */
$kui-navigation-shadow-border: 0 0 0 1px rgba(255, 255, 255, 0.12) inset;
/* The left box-shadow for an active child navigation link. */
$kui-navigation-shadow-border-child: 4px 0 0 0 #00FABE inset;
/* Navigation link focus-visible box-shadow. */
$kui-navigation-shadow-focus: 0 0 0 1px rgba(255, 255, 255, 0.60) inset;
/* The standard monospace text font family. Typically used for code blocks, inline code, and copyable text. */
$kui-font-family-code: 'JetBrains Mono', Consolas, monospace;
/* The standard heading text font family. */
$kui-font-family-heading: 'Inter', Roboto, Helvetica, sans-serif;
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
/* Alias for letter-spacing-normal */
$kui-letter-spacing-0: normal;
/* -0.12px */
$kui-letter-spacing-minus-10: -0.12px;
/* -0.24px */
$kui-letter-spacing-minus-20: -0.24px;
/* -0.32px */
$kui-letter-spacing-minus-30: -0.32px;
/* -0.4px */
$kui-letter-spacing-minus-40: -0.4px;
/* -0.48px */
$kui-letter-spacing-minus-50: -0.48px;
/* normal */
$kui-letter-spacing-normal: normal;
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
/* 0px 4px 20px 0px rgba(0, 0, 0, 0.08) */
$kui-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.08);
/* 0px 0px 0px 1px gray.20 inset */
$kui-shadow-border: 0px 0px 0px 1px #E0E4EA inset;
/* 0px 0px 0px 1px red.60 inset */
$kui-shadow-border-danger: 0px 0px 0px 1px #D60027 inset;
/* 0px 0px 0px 1px red.70 inset */
$kui-shadow-border-danger-strong: 0px 0px 0px 1px #AD000E inset;
/* 0px 0px 0px 1px gray.20 inset */
$kui-shadow-border-disabled: 0px 0px 0px 1px #E0E4EA inset;
/* 0px 0px 0px 1px blue.60 inset */
$kui-shadow-border-primary: 0px 0px 0px 1px #0044F4 inset;
/* 0px 0px 0px 1px blue.90 inset */
$kui-shadow-border-primary-strongest: 0px 0px 0px 1px #001466 inset;
/* 0px 0px 0px 1px blue.40 inset */
$kui-shadow-border-primary-weak: 0px 0px 0px 1px #5F9AFF inset;
/* 0px 0px 0px 4px rgba(0, 68, 244, 0.2) */
$kui-shadow-focus: 0px 0px 0px 4px rgba(0, 68, 244, 0.2);
/* 0px value for gaps, margin, or padding. */
$kui-space-0: 0px;
/* 2px value for gaps, margin, or padding. */
$kui-space-10: 2px;
/* 4px value for gaps, margin, or padding. */
$kui-space-20: 4px;
/* 6px value for gaps, margin, or padding. */
$kui-space-30: 6px;
/* 8px value for gaps, margin, or padding. */
$kui-space-40: 8px;
/* 12px value for gaps, margin, or padding. */
$kui-space-50: 12px;
/* 16px value for gaps, margin, or padding. */
$kui-space-60: 16px;
/* 20px value for gaps, margin, or padding. */
$kui-space-70: 20px;
/* 24px value for gaps, margin, or padding. */
$kui-space-80: 24px;
/* 32px value for gaps, margin, or padding. */
$kui-space-90: 32px;
/* 40px value for gaps, margin, or padding. */
$kui-space-100: 40px;
/* 48px value for gaps, margin, or padding. */
$kui-space-110: 48px;
/* 56px value for gaps, margin, or padding. */
$kui-space-120: 56px;
/* 64px value for gaps, margin, or padding. */
$kui-space-130: 64px;
/* 80px value for gaps, margin, or padding. */
$kui-space-140: 80px;
/* 96px value for gaps, margin, or padding. */
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
  /* Default background color for containers (white). */
  'kui-color-background': #FFF;
  /* Background color for danger actions or messages (red.60). */
  'kui-color-background-danger': #D60027;
  /* Strong background color for danger actions or messages (red.70). */
  'kui-color-background-danger-strong': #AD000E;
  /* Stronger background color for danger actions or messages (red.80). */
  'kui-color-background-danger-stronger': #850000;
  /* Strongest background color for danger actions or messages (red.90). */
  'kui-color-background-danger-strongest': #5C0000;
  /* Weak background color for danger actions or messages (red.40). */
  'kui-color-background-danger-weak': #FF3954;
  /* Weaker background color for danger actions or messages (red.20). */
  'kui-color-background-danger-weaker': #FFABAB;
  /* Weakest background color for danger actions or messages (red.10). */
  'kui-color-background-danger-weakest': #FFE5E5;
  /* Background color for decorative purposes (purple.60). */
  'kui-color-background-decorative-purple': #6F28FF;
  /* Weakest background color for decorative purposes (purple.10). */
  'kui-color-background-decorative-purple-weakest': #F1F0FF;
  /* Background color for disabled elements (gray.20). */
  'kui-color-background-disabled': #E0E4EA;
  /* Inverse background color for containers (blue.100) */
  'kui-color-background-inverse': #000933;
  /* Background color for neutral elements (gray.60). */
  'kui-color-background-neutral': #6C7489;
  /* Strong background color for neutral elements (gray.70). */
  'kui-color-background-neutral-strong': #52596E;
  /* Stronger background color for neutral elements (gray.80). */
  'kui-color-background-neutral-stronger': #3A3F51;
  /* Strongest background color for neutral elements (gray.90). */
  'kui-color-background-neutral-strongest': #232633;
  /* Weak background color for neutral elements (gray.40). */
  'kui-color-background-neutral-weak': #AFB7C5;
  /* Weaker background color for neutral elements (gray.20). */
  'kui-color-background-neutral-weaker': #E0E4EA;
  /* Weakest background color for neutral elements (gray.10). */
  'kui-color-background-neutral-weakest': #F9FAFB;
  /* Overlay background color (rgba(blue.100, 0.6)) */
  'kui-color-background-overlay': rgba(0, 9, 51, 0.6);
  /* Background color for primary actions or messages (blue.60). */
  'kui-color-background-primary': #0044F4;
  /* Strong background color for primary actions or messages (blue.70). */
  'kui-color-background-primary-strong': #0030CC;
  /* Stronger background color for primary actions or messages (blue.80). */
  'kui-color-background-primary-stronger': #002099;
  /* Strongest background color for primary actions or messages (blue.90). */
  'kui-color-background-primary-strongest': #001466;
  /* Weak background color for primary actions or messages (blue.40). */
  'kui-color-background-primary-weak': #5F9AFF;
  /* Weaker background color for primary actions or messages (blue.20). */
  'kui-color-background-primary-weaker': #BEE2FF;
  /* Weakest background color for primary actions or messages (blue.10) */
  'kui-color-background-primary-weakest': #EEFAFF;
  /* Weak background color for success elements (green.40). */
  'kui-color-background-success-weak': #00D6A4;
  /* Weakest background color for success elements (green.10). */
  'kui-color-background-success-weakest': #ECFFFB;
  /* Transparent background color (transparent). */
  'kui-color-background-transparent': transparent;
  /* Weak background color for warning elements (yellow.40). */
  'kui-color-background-warning-weak': #FFC400;
  /* Weakest background color for warning elements (yellow.10). */
  'kui-color-background-warning-weakest': #FFFCE0;
  /* Default border color for containers (gray.20). */
  'kui-color-border': #E0E4EA;
  /* Border color for danger actions or messages (red.60). */
  'kui-color-border-danger': #D60027;
  /* Strong border color for danger actions or messages (red.70). */
  'kui-color-border-danger-strong': #AD000E;
  /* Stronger border color for danger actions or messages (red.80). */
  'kui-color-border-danger-stronger': #850000;
  /* Strongest border color for danger actions or messages (red.90). */
  'kui-color-border-danger-strongest': #5C0000;
  /* Weak border color for danger actions or messages (red.40). */
  'kui-color-border-danger-weak': #FF3954;
  /* Weaker border color for danger actions or messages (red.20). */
  'kui-color-border-danger-weaker': #FFABAB;
  /* Weakest border color for danger actions or messages (red.10). */
  'kui-color-border-danger-weakest': #FFE5E5;
  /* Border color for decorative purposes (purple.60). */
  'kui-color-border-decorative-purple': #6F28FF;
  /* Border color for disabled elements (gray.20). */
  'kui-color-border-disabled': #E0E4EA;
  /* Inverse border color (rgba(white, 0.2)). */
  'kui-color-border-inverse': rgba(255, 255, 255, 0.2);
  /* Weak border color for neutral elements (gray.40) */
  'kui-color-border-neutral-weak': #AFB7C5;
  /* Weaker border color for neutral elements (gray.20) */
  'kui-color-border-neutral-weaker': #E0E4EA;
  /* Border color for primary actions or messages (blue.60). */
  'kui-color-border-primary': #0044F4;
  /* Strong border color for primary actions or messages (blue.70). */
  'kui-color-border-primary-strong': #0030CC;
  /* Stronger border color for primary actions or messages (blue.80). */
  'kui-color-border-primary-stronger': #002099;
  /* Strongest border color for primary actions or messages (blue.90). */
  'kui-color-border-primary-strongest': #001466;
  /* Weak border color for primary actions or messages (blue.40). */
  'kui-color-border-primary-weak': #5F9AFF;
  /* Weaker border color for primary actions or messages (blue.20). */
  'kui-color-border-primary-weaker': #BEE2FF;
  /* Weakest border color for primary actions or messages (blue.10). */
  'kui-color-border-primary-weakest': #EEFAFF;
  /* Transparent border color (transparent). */
  'kui-color-border-transparent': transparent;
  /* Default text color (blue.100). */
  'kui-color-text': #000933;
  /* Text color for danger actions or messages (red.60). */
  'kui-color-text-danger': #D60027;
  /* Strong text color for danger actions or messages (red.70). */
  'kui-color-text-danger-strong': #AD000E;
  /* Text color for decorative purposes (aqua.50). */
  'kui-color-text-decorative-aqua': #00ABD2;
  /* Text color for decorative purposes (pink.60). */
  'kui-color-text-decorative-pink': #D60067;
  /* Text color for decorative purposes (purple.60). */
  'kui-color-text-decorative-purple': #6F28FF;
  /* Strong text color for decorative purposes (purple.70). */
  'kui-color-text-decorative-purple-strong': #5E00F5;
  /* Text color for disabled elements (gray.40). */
  'kui-color-text-disabled': #AFB7C5;
  /* Inverse text color (white). */
  'kui-color-text-inverse': #FFF;
  /* Text color for neutral elements (gray.60). */
  'kui-color-text-neutral': #6C7489;
  /* Strong text color for neutral elements (gray.70). */
  'kui-color-text-neutral-strong': #52596E;
  /* Stronger text color for neutral elements (gray.80). */
  'kui-color-text-neutral-stronger': #3A3F51;
  /* Strongest text color for neutral elements (gray.90). */
  'kui-color-text-neutral-strongest': #232633;
  /* Weak text color for neutral elements (gray.40). */
  'kui-color-text-neutral-weak': #AFB7C5;
  /* Weaker text color for neutral elements (gray.20). */
  'kui-color-text-neutral-weaker': #E0E4EA;
  /* Text color for primary actions or messages (blue.60). */
  'kui-color-text-primary': #0044F4;
  /* Strong text color for primary actions or messages (blue.70). */
  'kui-color-text-primary-strong': #0030CC;
  /* Stronger text color for primary actions or messages (blue.80). */
  'kui-color-text-primary-stronger': #002099;
  /* Strongest text color for primary actions or messages (blue.90). */
  'kui-color-text-primary-strongest': #001466;
  /* Weak text color for primary actions or messages (blue.40). */
  'kui-color-text-primary-weak': #5F9AFF;
  /* Text color for success actions or messages (green.60). */
  'kui-color-text-success': #007D60;
  /* Strong text color for success actions or messages (green.70). */
  'kui-color-text-success-strong': #005944;
  /* Text color for warning actions or messages (yellow.60). */
  'kui-color-text-warning': #995C00;
  /* Text color for warning actions or messages (yellow.70). */
  'kui-color-text-warning-strong': #804400;
  /* Default transition timing */
  'kui-animation-duration-20': 0.2s;
  /* 0px border radius. */
  'kui-border-radius-0': 0px;
  /* 2px border radius. */
  'kui-border-radius-10': 2px;
  /* 4px border radius. */
  'kui-border-radius-20': 4px;
  /* 6px border radius. */
  'kui-border-radius-30': 6px;
  /* 8px border radius. */
  'kui-border-radius-40': 8px;
  /* 10px border radius. */
  'kui-border-radius-50': 10px;
  /* 50% border radius used to create circles. */
  'kui-border-radius-circle': 50%;
  /* 100px border radius used to create pill shapes. */
  'kui-border-radius-round': 100px;
  /* 0px border width. */
  'kui-border-width-0': 0px;
  /* 1px border width. */
  'kui-border-width-10': 1px;
  /* 2px border width. */
  'kui-border-width-20': 2px;
  /* 4px border width. */
  'kui-border-width-30': 4px;
  /* Used for larger mobile screens. Any viewport width under this value is considered mobile. */
  'kui-breakpoint-mobile': 640px;
  /* Used for tablet screens. */
  'kui-breakpoint-phablet': 768px;
  /* Used for larger tablet screens. Any viewport width less than this value will likely show a mobile layout. Any viewport width this value and greater will likely show a desktop layout. */
  'kui-breakpoint-tablet': 1024px;
  /* Used for standard desktop screens. */
  'kui-breakpoint-laptop': 1280px;
  /* Used for larger desktop screens. */
  'kui-breakpoint-desktop': 1536px;
  /* Danger color for icons. */
  'kui-icon-color-danger': #F50045;
  /* Neutral color for icons. */
  'kui-icon-color-neutral': #828A9E;
  /* Primary color for icons. */
  'kui-icon-color-primary': #306FFF;
  /* Success color for icons. */
  'kui-icon-color-success': #00A17B;
  /* Warning color for icons. */
  'kui-icon-color-warning': #FFC400;
  /* 10px icon size. */
  'kui-icon-size-10': 10px;
  /* 12px icon size. */
  'kui-icon-size-20': 12px;
  /* 16px icon size. */
  'kui-icon-size-30': 16px;
  /* 20px icon size. */
  'kui-icon-size-40': 20px;
  /* 24px icon size (default). */
  'kui-icon-size-50': 24px;
  /* 32px icon size. */
  'kui-icon-size-60': 32px;
  /* 40px icon size. */
  'kui-icon-size-70': 40px;
  /* 48px icon size. */
  'kui-icon-size-80': 48px;
  /* Background color for the CONNECT method (purple.10). */
  'kui-method-color-background-connect': #F1F0FF;
  /* Background color for the DELETE method (red.10). */
  'kui-method-color-background-delete': #FFE5E5;
  /* Background color for the GET method (blue.10). */
  'kui-method-color-background-get': #EEFAFF;
  /* Background color for the HEAD method (gray.70). */
  'kui-method-color-background-head': #52596E;
  /* Background color for the OPTIONS method (gray.20). */
  'kui-method-color-background-options': #E0E4EA;
  /* Background color for the PATCH method (aqua.10). */
  'kui-method-color-background-patch': #ECFCFF;
  /* Background color for the POST method (green.10). */
  'kui-method-color-background-post': #ECFFFB;
  /* Background color for the PUT method (yellow.10). */
  'kui-method-color-background-put': #FFFCE0;
  /* Background color for the TRACE method (pink.10). */
  'kui-method-color-background-trace': #FFF0F7;
  /* Text color for the CONNECT method (purple.60). */
  'kui-method-color-text-connect': #6F28FF;
  /* Strong text color for the CONNECT method (purple.70). */
  'kui-method-color-text-connect-strong': #5E00F5;
  /* Text color for the DELETE method (red.60). */
  'kui-method-color-text-delete': #D60027;
  /* Strong text color for the DELETE method (red.70). */
  'kui-method-color-text-delete-strong': #AD000E;
  /* Text color for the GET method (blue.60). */
  'kui-method-color-text-get': #0044F4;
  /* Strong text color for the GET method (blue.70). */
  'kui-method-color-text-get-strong': #0030CC;
  /* Text color for the HEAD method (gray.20). */
  'kui-method-color-text-head': #E0E4EA;
  /* Strong text color for the HEAD method (gray.40). */
  'kui-method-color-text-head-strong': #AFB7C5;
  /* Text color for the OPTIONS method (gray.70). */
  'kui-method-color-text-options': #52596E;
  /* Strong text color for the OPTIONS method (gray.80). */
  'kui-method-color-text-options-strong': #3A3F51;
  /* Text color for the PATCH method (aqua.60). */
  'kui-method-color-text-patch': #00819D;
  /* Strong text color for the PATCH method (aqua.70). */
  'kui-method-color-text-patch-strong': #00647A;
  /* Text color for the POST method (green.60). */
  'kui-method-color-text-post': #007D60;
  /* Strong text color for the POST method (green.70). */
  'kui-method-color-text-post-strong': #005944;
  /* Text color for the PUT method (yellow.60). */
  'kui-method-color-text-put': #995C00;
  /* Strong text color for the PUT method (yellow.70). */
  'kui-method-color-text-put-strong': #804400;
  /* Text color for the TRACE method (pink.60). */
  'kui-method-color-text-trace': #D60067;
  /* Strong text color for the TRACE method (pink.70). */
  'kui-method-color-text-trace-strong': #AD0053;
  /* blue.100 */
  'kui-navigation-color-background': #000933;
  /* The background color of a selected navigation item. */
  'kui-navigation-color-background-selected': rgba(255, 255, 255, 0.12);
  /* rgba(white, 0.12) */
  'kui-navigation-color-border': rgba(255, 255, 255, 0.12);
  /* The border color for a selected child navigation item. */
  'kui-navigation-color-border-child': #00FABE;
  /* The color of the navigation section divider. */
  'kui-navigation-color-border-divider': rgba(255, 255, 255, 0.24);
  /* Navigation link and icon color. */
  'kui-navigation-color-text': #BEE2FF;
  /* Navigation link and icon focus-visible color. */
  'kui-navigation-color-text-focus': #FFF;
  /* Navigation link and icon hover color. */
  'kui-navigation-color-text-hover': #EEFAFF;
  /* Navigation link and icon selected color. */
  'kui-navigation-color-text-selected': #00FABE;
  /* The box-shadow for a focus-visible navigation link. */
  'kui-navigation-shadow-border': 0 0 0 1px rgba(255, 255, 255, 0.12) inset;
  /* The left box-shadow for an active child navigation link. */
  'kui-navigation-shadow-border-child': 4px 0 0 0 #00FABE inset;
  /* Navigation link focus-visible box-shadow. */
  'kui-navigation-shadow-focus': 0 0 0 1px rgba(255, 255, 255, 0.60) inset;
  /* The standard monospace text font family. Typically used for code blocks, inline code, and copyable text. */
  'kui-font-family-code': 'JetBrains Mono', Consolas, monospace;
  /* The standard heading text font family. */
  'kui-font-family-heading': 'Inter', Roboto, Helvetica, sans-serif;
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
  /* Alias for letter-spacing-normal */
  'kui-letter-spacing-0': normal;
  /* -0.12px */
  'kui-letter-spacing-minus-10': -0.12px;
  /* -0.24px */
  'kui-letter-spacing-minus-20': -0.24px;
  /* -0.32px */
  'kui-letter-spacing-minus-30': -0.32px;
  /* -0.4px */
  'kui-letter-spacing-minus-40': -0.4px;
  /* -0.48px */
  'kui-letter-spacing-minus-50': -0.48px;
  /* normal */
  'kui-letter-spacing-normal': normal;
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
  /* 0px 4px 20px 0px rgba(0, 0, 0, 0.08) */
  'kui-shadow': 0px 4px 20px 0px rgba(0, 0, 0, 0.08);
  /* 0px 0px 0px 1px gray.20 inset */
  'kui-shadow-border': 0px 0px 0px 1px #E0E4EA inset;
  /* 0px 0px 0px 1px red.60 inset */
  'kui-shadow-border-danger': 0px 0px 0px 1px #D60027 inset;
  /* 0px 0px 0px 1px red.70 inset */
  'kui-shadow-border-danger-strong': 0px 0px 0px 1px #AD000E inset;
  /* 0px 0px 0px 1px gray.20 inset */
  'kui-shadow-border-disabled': 0px 0px 0px 1px #E0E4EA inset;
  /* 0px 0px 0px 1px blue.60 inset */
  'kui-shadow-border-primary': 0px 0px 0px 1px #0044F4 inset;
  /* 0px 0px 0px 1px blue.90 inset */
  'kui-shadow-border-primary-strongest': 0px 0px 0px 1px #001466 inset;
  /* 0px 0px 0px 1px blue.40 inset */
  'kui-shadow-border-primary-weak': 0px 0px 0px 1px #5F9AFF inset;
  /* 0px 0px 0px 4px rgba(0, 68, 244, 0.2) */
  'kui-shadow-focus': 0px 0px 0px 4px rgba(0, 68, 244, 0.2);
  /* 0px value for gaps, margin, or padding. */
  'kui-space-0': 0px;
  /* 2px value for gaps, margin, or padding. */
  'kui-space-10': 2px;
  /* 4px value for gaps, margin, or padding. */
  'kui-space-20': 4px;
  /* 6px value for gaps, margin, or padding. */
  'kui-space-30': 6px;
  /* 8px value for gaps, margin, or padding. */
  'kui-space-40': 8px;
  /* 12px value for gaps, margin, or padding. */
  'kui-space-50': 12px;
  /* 16px value for gaps, margin, or padding. */
  'kui-space-60': 16px;
  /* 20px value for gaps, margin, or padding. */
  'kui-space-70': 20px;
  /* 24px value for gaps, margin, or padding. */
  'kui-space-80': 24px;
  /* 32px value for gaps, margin, or padding. */
  'kui-space-90': 32px;
  /* 40px value for gaps, margin, or padding. */
  'kui-space-100': 40px;
  /* 48px value for gaps, margin, or padding. */
  'kui-space-110': 48px;
  /* 56px value for gaps, margin, or padding. */
  'kui-space-120': 56px;
  /* 64px value for gaps, margin, or padding. */
  'kui-space-130': 64px;
  /* 80px value for gaps, margin, or padding. */
  'kui-space-140': 80px;
  /* 96px value for gaps, margin, or padding. */
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
/* Default background color for containers (white). */
@kui-color-background: #FFF;
/* Background color for danger actions or messages (red.60). */
@kui-color-background-danger: #D60027;
/* Strong background color for danger actions or messages (red.70). */
@kui-color-background-danger-strong: #AD000E;
/* Stronger background color for danger actions or messages (red.80). */
@kui-color-background-danger-stronger: #850000;
/* Strongest background color for danger actions or messages (red.90). */
@kui-color-background-danger-strongest: #5C0000;
/* Weak background color for danger actions or messages (red.40). */
@kui-color-background-danger-weak: #FF3954;
/* Weaker background color for danger actions or messages (red.20). */
@kui-color-background-danger-weaker: #FFABAB;
/* Weakest background color for danger actions or messages (red.10). */
@kui-color-background-danger-weakest: #FFE5E5;
/* Background color for decorative purposes (purple.60). */
@kui-color-background-decorative-purple: #6F28FF;
/* Weakest background color for decorative purposes (purple.10). */
@kui-color-background-decorative-purple-weakest: #F1F0FF;
/* Background color for disabled elements (gray.20). */
@kui-color-background-disabled: #E0E4EA;
/* Inverse background color for containers (blue.100) */
@kui-color-background-inverse: #000933;
/* Background color for neutral elements (gray.60). */
@kui-color-background-neutral: #6C7489;
/* Strong background color for neutral elements (gray.70). */
@kui-color-background-neutral-strong: #52596E;
/* Stronger background color for neutral elements (gray.80). */
@kui-color-background-neutral-stronger: #3A3F51;
/* Strongest background color for neutral elements (gray.90). */
@kui-color-background-neutral-strongest: #232633;
/* Weak background color for neutral elements (gray.40). */
@kui-color-background-neutral-weak: #AFB7C5;
/* Weaker background color for neutral elements (gray.20). */
@kui-color-background-neutral-weaker: #E0E4EA;
/* Weakest background color for neutral elements (gray.10). */
@kui-color-background-neutral-weakest: #F9FAFB;
/* Overlay background color (rgba(blue.100, 0.6)) */
@kui-color-background-overlay: rgba(0, 9, 51, 0.6);
/* Background color for primary actions or messages (blue.60). */
@kui-color-background-primary: #0044F4;
/* Strong background color for primary actions or messages (blue.70). */
@kui-color-background-primary-strong: #0030CC;
/* Stronger background color for primary actions or messages (blue.80). */
@kui-color-background-primary-stronger: #002099;
/* Strongest background color for primary actions or messages (blue.90). */
@kui-color-background-primary-strongest: #001466;
/* Weak background color for primary actions or messages (blue.40). */
@kui-color-background-primary-weak: #5F9AFF;
/* Weaker background color for primary actions or messages (blue.20). */
@kui-color-background-primary-weaker: #BEE2FF;
/* Weakest background color for primary actions or messages (blue.10) */
@kui-color-background-primary-weakest: #EEFAFF;
/* Weak background color for success elements (green.40). */
@kui-color-background-success-weak: #00D6A4;
/* Weakest background color for success elements (green.10). */
@kui-color-background-success-weakest: #ECFFFB;
/* Transparent background color (transparent). */
@kui-color-background-transparent: transparent;
/* Weak background color for warning elements (yellow.40). */
@kui-color-background-warning-weak: #FFC400;
/* Weakest background color for warning elements (yellow.10). */
@kui-color-background-warning-weakest: #FFFCE0;
/* Default border color for containers (gray.20). */
@kui-color-border: #E0E4EA;
/* Border color for danger actions or messages (red.60). */
@kui-color-border-danger: #D60027;
/* Strong border color for danger actions or messages (red.70). */
@kui-color-border-danger-strong: #AD000E;
/* Stronger border color for danger actions or messages (red.80). */
@kui-color-border-danger-stronger: #850000;
/* Strongest border color for danger actions or messages (red.90). */
@kui-color-border-danger-strongest: #5C0000;
/* Weak border color for danger actions or messages (red.40). */
@kui-color-border-danger-weak: #FF3954;
/* Weaker border color for danger actions or messages (red.20). */
@kui-color-border-danger-weaker: #FFABAB;
/* Weakest border color for danger actions or messages (red.10). */
@kui-color-border-danger-weakest: #FFE5E5;
/* Border color for decorative purposes (purple.60). */
@kui-color-border-decorative-purple: #6F28FF;
/* Border color for disabled elements (gray.20). */
@kui-color-border-disabled: #E0E4EA;
/* Inverse border color (rgba(white, 0.2)). */
@kui-color-border-inverse: rgba(255, 255, 255, 0.2);
/* Weak border color for neutral elements (gray.40) */
@kui-color-border-neutral-weak: #AFB7C5;
/* Weaker border color for neutral elements (gray.20) */
@kui-color-border-neutral-weaker: #E0E4EA;
/* Border color for primary actions or messages (blue.60). */
@kui-color-border-primary: #0044F4;
/* Strong border color for primary actions or messages (blue.70). */
@kui-color-border-primary-strong: #0030CC;
/* Stronger border color for primary actions or messages (blue.80). */
@kui-color-border-primary-stronger: #002099;
/* Strongest border color for primary actions or messages (blue.90). */
@kui-color-border-primary-strongest: #001466;
/* Weak border color for primary actions or messages (blue.40). */
@kui-color-border-primary-weak: #5F9AFF;
/* Weaker border color for primary actions or messages (blue.20). */
@kui-color-border-primary-weaker: #BEE2FF;
/* Weakest border color for primary actions or messages (blue.10). */
@kui-color-border-primary-weakest: #EEFAFF;
/* Transparent border color (transparent). */
@kui-color-border-transparent: transparent;
/* Default text color (blue.100). */
@kui-color-text: #000933;
/* Text color for danger actions or messages (red.60). */
@kui-color-text-danger: #D60027;
/* Strong text color for danger actions or messages (red.70). */
@kui-color-text-danger-strong: #AD000E;
/* Text color for decorative purposes (aqua.50). */
@kui-color-text-decorative-aqua: #00ABD2;
/* Text color for decorative purposes (pink.60). */
@kui-color-text-decorative-pink: #D60067;
/* Text color for decorative purposes (purple.60). */
@kui-color-text-decorative-purple: #6F28FF;
/* Strong text color for decorative purposes (purple.70). */
@kui-color-text-decorative-purple-strong: #5E00F5;
/* Text color for disabled elements (gray.40). */
@kui-color-text-disabled: #AFB7C5;
/* Inverse text color (white). */
@kui-color-text-inverse: #FFF;
/* Text color for neutral elements (gray.60). */
@kui-color-text-neutral: #6C7489;
/* Strong text color for neutral elements (gray.70). */
@kui-color-text-neutral-strong: #52596E;
/* Stronger text color for neutral elements (gray.80). */
@kui-color-text-neutral-stronger: #3A3F51;
/* Strongest text color for neutral elements (gray.90). */
@kui-color-text-neutral-strongest: #232633;
/* Weak text color for neutral elements (gray.40). */
@kui-color-text-neutral-weak: #AFB7C5;
/* Weaker text color for neutral elements (gray.20). */
@kui-color-text-neutral-weaker: #E0E4EA;
/* Text color for primary actions or messages (blue.60). */
@kui-color-text-primary: #0044F4;
/* Strong text color for primary actions or messages (blue.70). */
@kui-color-text-primary-strong: #0030CC;
/* Stronger text color for primary actions or messages (blue.80). */
@kui-color-text-primary-stronger: #002099;
/* Strongest text color for primary actions or messages (blue.90). */
@kui-color-text-primary-strongest: #001466;
/* Weak text color for primary actions or messages (blue.40). */
@kui-color-text-primary-weak: #5F9AFF;
/* Text color for success actions or messages (green.60). */
@kui-color-text-success: #007D60;
/* Strong text color for success actions or messages (green.70). */
@kui-color-text-success-strong: #005944;
/* Text color for warning actions or messages (yellow.60). */
@kui-color-text-warning: #995C00;
/* Text color for warning actions or messages (yellow.70). */
@kui-color-text-warning-strong: #804400;
/* Default transition timing */
@kui-animation-duration-20: 0.2s;
/* 0px border radius. */
@kui-border-radius-0: 0px;
/* 2px border radius. */
@kui-border-radius-10: 2px;
/* 4px border radius. */
@kui-border-radius-20: 4px;
/* 6px border radius. */
@kui-border-radius-30: 6px;
/* 8px border radius. */
@kui-border-radius-40: 8px;
/* 10px border radius. */
@kui-border-radius-50: 10px;
/* 50% border radius used to create circles. */
@kui-border-radius-circle: 50%;
/* 100px border radius used to create pill shapes. */
@kui-border-radius-round: 100px;
/* 0px border width. */
@kui-border-width-0: 0px;
/* 1px border width. */
@kui-border-width-10: 1px;
/* 2px border width. */
@kui-border-width-20: 2px;
/* 4px border width. */
@kui-border-width-30: 4px;
/* Used for larger mobile screens. Any viewport width under this value is considered mobile. */
@kui-breakpoint-mobile: 640px;
/* Used for tablet screens. */
@kui-breakpoint-phablet: 768px;
/* Used for larger tablet screens. Any viewport width less than this value will likely show a mobile layout. Any viewport width this value and greater will likely show a desktop layout. */
@kui-breakpoint-tablet: 1024px;
/* Used for standard desktop screens. */
@kui-breakpoint-laptop: 1280px;
/* Used for larger desktop screens. */
@kui-breakpoint-desktop: 1536px;
/* Danger color for icons. */
@kui-icon-color-danger: #F50045;
/* Neutral color for icons. */
@kui-icon-color-neutral: #828A9E;
/* Primary color for icons. */
@kui-icon-color-primary: #306FFF;
/* Success color for icons. */
@kui-icon-color-success: #00A17B;
/* Warning color for icons. */
@kui-icon-color-warning: #FFC400;
/* 10px icon size. */
@kui-icon-size-10: 10px;
/* 12px icon size. */
@kui-icon-size-20: 12px;
/* 16px icon size. */
@kui-icon-size-30: 16px;
/* 20px icon size. */
@kui-icon-size-40: 20px;
/* 24px icon size (default). */
@kui-icon-size-50: 24px;
/* 32px icon size. */
@kui-icon-size-60: 32px;
/* 40px icon size. */
@kui-icon-size-70: 40px;
/* 48px icon size. */
@kui-icon-size-80: 48px;
/* Background color for the CONNECT method (purple.10). */
@kui-method-color-background-connect: #F1F0FF;
/* Background color for the DELETE method (red.10). */
@kui-method-color-background-delete: #FFE5E5;
/* Background color for the GET method (blue.10). */
@kui-method-color-background-get: #EEFAFF;
/* Background color for the HEAD method (gray.70). */
@kui-method-color-background-head: #52596E;
/* Background color for the OPTIONS method (gray.20). */
@kui-method-color-background-options: #E0E4EA;
/* Background color for the PATCH method (aqua.10). */
@kui-method-color-background-patch: #ECFCFF;
/* Background color for the POST method (green.10). */
@kui-method-color-background-post: #ECFFFB;
/* Background color for the PUT method (yellow.10). */
@kui-method-color-background-put: #FFFCE0;
/* Background color for the TRACE method (pink.10). */
@kui-method-color-background-trace: #FFF0F7;
/* Text color for the CONNECT method (purple.60). */
@kui-method-color-text-connect: #6F28FF;
/* Strong text color for the CONNECT method (purple.70). */
@kui-method-color-text-connect-strong: #5E00F5;
/* Text color for the DELETE method (red.60). */
@kui-method-color-text-delete: #D60027;
/* Strong text color for the DELETE method (red.70). */
@kui-method-color-text-delete-strong: #AD000E;
/* Text color for the GET method (blue.60). */
@kui-method-color-text-get: #0044F4;
/* Strong text color for the GET method (blue.70). */
@kui-method-color-text-get-strong: #0030CC;
/* Text color for the HEAD method (gray.20). */
@kui-method-color-text-head: #E0E4EA;
/* Strong text color for the HEAD method (gray.40). */
@kui-method-color-text-head-strong: #AFB7C5;
/* Text color for the OPTIONS method (gray.70). */
@kui-method-color-text-options: #52596E;
/* Strong text color for the OPTIONS method (gray.80). */
@kui-method-color-text-options-strong: #3A3F51;
/* Text color for the PATCH method (aqua.60). */
@kui-method-color-text-patch: #00819D;
/* Strong text color for the PATCH method (aqua.70). */
@kui-method-color-text-patch-strong: #00647A;
/* Text color for the POST method (green.60). */
@kui-method-color-text-post: #007D60;
/* Strong text color for the POST method (green.70). */
@kui-method-color-text-post-strong: #005944;
/* Text color for the PUT method (yellow.60). */
@kui-method-color-text-put: #995C00;
/* Strong text color for the PUT method (yellow.70). */
@kui-method-color-text-put-strong: #804400;
/* Text color for the TRACE method (pink.60). */
@kui-method-color-text-trace: #D60067;
/* Strong text color for the TRACE method (pink.70). */
@kui-method-color-text-trace-strong: #AD0053;
/* blue.100 */
@kui-navigation-color-background: #000933;
/* The background color of a selected navigation item. */
@kui-navigation-color-background-selected: rgba(255, 255, 255, 0.12);
/* rgba(white, 0.12) */
@kui-navigation-color-border: rgba(255, 255, 255, 0.12);
/* The border color for a selected child navigation item. */
@kui-navigation-color-border-child: #00FABE;
/* The color of the navigation section divider. */
@kui-navigation-color-border-divider: rgba(255, 255, 255, 0.24);
/* Navigation link and icon color. */
@kui-navigation-color-text: #BEE2FF;
/* Navigation link and icon focus-visible color. */
@kui-navigation-color-text-focus: #FFF;
/* Navigation link and icon hover color. */
@kui-navigation-color-text-hover: #EEFAFF;
/* Navigation link and icon selected color. */
@kui-navigation-color-text-selected: #00FABE;
/* The box-shadow for a focus-visible navigation link. */
@kui-navigation-shadow-border: 0 0 0 1px rgba(255, 255, 255, 0.12) inset;
/* The left box-shadow for an active child navigation link. */
@kui-navigation-shadow-border-child: 4px 0 0 0 #00FABE inset;
/* Navigation link focus-visible box-shadow. */
@kui-navigation-shadow-focus: 0 0 0 1px rgba(255, 255, 255, 0.60) inset;
/* The standard monospace text font family. Typically used for code blocks, inline code, and copyable text. */
@kui-font-family-code: 'JetBrains Mono', Consolas, monospace;
/* The standard heading text font family. */
@kui-font-family-heading: 'Inter', Roboto, Helvetica, sans-serif;
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
/* Alias for letter-spacing-normal */
@kui-letter-spacing-0: normal;
/* -0.12px */
@kui-letter-spacing-minus-10: -0.12px;
/* -0.24px */
@kui-letter-spacing-minus-20: -0.24px;
/* -0.32px */
@kui-letter-spacing-minus-30: -0.32px;
/* -0.4px */
@kui-letter-spacing-minus-40: -0.4px;
/* -0.48px */
@kui-letter-spacing-minus-50: -0.48px;
/* normal */
@kui-letter-spacing-normal: normal;
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
/* 0px 4px 20px 0px rgba(0, 0, 0, 0.08) */
@kui-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.08);
/* 0px 0px 0px 1px gray.20 inset */
@kui-shadow-border: 0px 0px 0px 1px #E0E4EA inset;
/* 0px 0px 0px 1px red.60 inset */
@kui-shadow-border-danger: 0px 0px 0px 1px #D60027 inset;
/* 0px 0px 0px 1px red.70 inset */
@kui-shadow-border-danger-strong: 0px 0px 0px 1px #AD000E inset;
/* 0px 0px 0px 1px gray.20 inset */
@kui-shadow-border-disabled: 0px 0px 0px 1px #E0E4EA inset;
/* 0px 0px 0px 1px blue.60 inset */
@kui-shadow-border-primary: 0px 0px 0px 1px #0044F4 inset;
/* 0px 0px 0px 1px blue.90 inset */
@kui-shadow-border-primary-strongest: 0px 0px 0px 1px #001466 inset;
/* 0px 0px 0px 1px blue.40 inset */
@kui-shadow-border-primary-weak: 0px 0px 0px 1px #5F9AFF inset;
/* 0px 0px 0px 4px rgba(0, 68, 244, 0.2) */
@kui-shadow-focus: 0px 0px 0px 4px rgba(0, 68, 244, 0.2);
/* 0px value for gaps, margin, or padding. */
@kui-space-0: 0px;
/* 2px value for gaps, margin, or padding. */
@kui-space-10: 2px;
/* 4px value for gaps, margin, or padding. */
@kui-space-20: 4px;
/* 6px value for gaps, margin, or padding. */
@kui-space-30: 6px;
/* 8px value for gaps, margin, or padding. */
@kui-space-40: 8px;
/* 12px value for gaps, margin, or padding. */
@kui-space-50: 12px;
/* 16px value for gaps, margin, or padding. */
@kui-space-60: 16px;
/* 20px value for gaps, margin, or padding. */
@kui-space-70: 20px;
/* 24px value for gaps, margin, or padding. */
@kui-space-80: 24px;
/* 32px value for gaps, margin, or padding. */
@kui-space-90: 32px;
/* 40px value for gaps, margin, or padding. */
@kui-space-100: 40px;
/* 48px value for gaps, margin, or padding. */
@kui-space-110: 48px;
/* 56px value for gaps, margin, or padding. */
@kui-space-120: 56px;
/* 64px value for gaps, margin, or padding. */
@kui-space-130: 64px;
/* 80px value for gaps, margin, or padding. */
@kui-space-140: 80px;
/* 96px value for gaps, margin, or padding. */
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
/* Default background color for containers (white). */
--kui-color-background: #FFF;
/* Background color for danger actions or messages (red.60). */
--kui-color-background-danger: #D60027;
/* Strong background color for danger actions or messages (red.70). */
--kui-color-background-danger-strong: #AD000E;
/* Stronger background color for danger actions or messages (red.80). */
--kui-color-background-danger-stronger: #850000;
/* Strongest background color for danger actions or messages (red.90). */
--kui-color-background-danger-strongest: #5C0000;
/* Weak background color for danger actions or messages (red.40). */
--kui-color-background-danger-weak: #FF3954;
/* Weaker background color for danger actions or messages (red.20). */
--kui-color-background-danger-weaker: #FFABAB;
/* Weakest background color for danger actions or messages (red.10). */
--kui-color-background-danger-weakest: #FFE5E5;
/* Background color for decorative purposes (purple.60). */
--kui-color-background-decorative-purple: #6F28FF;
/* Weakest background color for decorative purposes (purple.10). */
--kui-color-background-decorative-purple-weakest: #F1F0FF;
/* Background color for disabled elements (gray.20). */
--kui-color-background-disabled: #E0E4EA;
/* Inverse background color for containers (blue.100) */
--kui-color-background-inverse: #000933;
/* Background color for neutral elements (gray.60). */
--kui-color-background-neutral: #6C7489;
/* Strong background color for neutral elements (gray.70). */
--kui-color-background-neutral-strong: #52596E;
/* Stronger background color for neutral elements (gray.80). */
--kui-color-background-neutral-stronger: #3A3F51;
/* Strongest background color for neutral elements (gray.90). */
--kui-color-background-neutral-strongest: #232633;
/* Weak background color for neutral elements (gray.40). */
--kui-color-background-neutral-weak: #AFB7C5;
/* Weaker background color for neutral elements (gray.20). */
--kui-color-background-neutral-weaker: #E0E4EA;
/* Weakest background color for neutral elements (gray.10). */
--kui-color-background-neutral-weakest: #F9FAFB;
/* Overlay background color (rgba(blue.100, 0.6)) */
--kui-color-background-overlay: rgba(0, 9, 51, 0.6);
/* Background color for primary actions or messages (blue.60). */
--kui-color-background-primary: #0044F4;
/* Strong background color for primary actions or messages (blue.70). */
--kui-color-background-primary-strong: #0030CC;
/* Stronger background color for primary actions or messages (blue.80). */
--kui-color-background-primary-stronger: #002099;
/* Strongest background color for primary actions or messages (blue.90). */
--kui-color-background-primary-strongest: #001466;
/* Weak background color for primary actions or messages (blue.40). */
--kui-color-background-primary-weak: #5F9AFF;
/* Weaker background color for primary actions or messages (blue.20). */
--kui-color-background-primary-weaker: #BEE2FF;
/* Weakest background color for primary actions or messages (blue.10) */
--kui-color-background-primary-weakest: #EEFAFF;
/* Weak background color for success elements (green.40). */
--kui-color-background-success-weak: #00D6A4;
/* Weakest background color for success elements (green.10). */
--kui-color-background-success-weakest: #ECFFFB;
/* Transparent background color (transparent). */
--kui-color-background-transparent: transparent;
/* Weak background color for warning elements (yellow.40). */
--kui-color-background-warning-weak: #FFC400;
/* Weakest background color for warning elements (yellow.10). */
--kui-color-background-warning-weakest: #FFFCE0;
/* Default border color for containers (gray.20). */
--kui-color-border: #E0E4EA;
/* Border color for danger actions or messages (red.60). */
--kui-color-border-danger: #D60027;
/* Strong border color for danger actions or messages (red.70). */
--kui-color-border-danger-strong: #AD000E;
/* Stronger border color for danger actions or messages (red.80). */
--kui-color-border-danger-stronger: #850000;
/* Strongest border color for danger actions or messages (red.90). */
--kui-color-border-danger-strongest: #5C0000;
/* Weak border color for danger actions or messages (red.40). */
--kui-color-border-danger-weak: #FF3954;
/* Weaker border color for danger actions or messages (red.20). */
--kui-color-border-danger-weaker: #FFABAB;
/* Weakest border color for danger actions or messages (red.10). */
--kui-color-border-danger-weakest: #FFE5E5;
/* Border color for decorative purposes (purple.60). */
--kui-color-border-decorative-purple: #6F28FF;
/* Border color for disabled elements (gray.20). */
--kui-color-border-disabled: #E0E4EA;
/* Inverse border color (rgba(white, 0.2)). */
--kui-color-border-inverse: rgba(255, 255, 255, 0.2);
/* Weak border color for neutral elements (gray.40) */
--kui-color-border-neutral-weak: #AFB7C5;
/* Weaker border color for neutral elements (gray.20) */
--kui-color-border-neutral-weaker: #E0E4EA;
/* Border color for primary actions or messages (blue.60). */
--kui-color-border-primary: #0044F4;
/* Strong border color for primary actions or messages (blue.70). */
--kui-color-border-primary-strong: #0030CC;
/* Stronger border color for primary actions or messages (blue.80). */
--kui-color-border-primary-stronger: #002099;
/* Strongest border color for primary actions or messages (blue.90). */
--kui-color-border-primary-strongest: #001466;
/* Weak border color for primary actions or messages (blue.40). */
--kui-color-border-primary-weak: #5F9AFF;
/* Weaker border color for primary actions or messages (blue.20). */
--kui-color-border-primary-weaker: #BEE2FF;
/* Weakest border color for primary actions or messages (blue.10). */
--kui-color-border-primary-weakest: #EEFAFF;
/* Transparent border color (transparent). */
--kui-color-border-transparent: transparent;
/* Default text color (blue.100). */
--kui-color-text: #000933;
/* Text color for danger actions or messages (red.60). */
--kui-color-text-danger: #D60027;
/* Strong text color for danger actions or messages (red.70). */
--kui-color-text-danger-strong: #AD000E;
/* Text color for decorative purposes (aqua.50). */
--kui-color-text-decorative-aqua: #00ABD2;
/* Text color for decorative purposes (pink.60). */
--kui-color-text-decorative-pink: #D60067;
/* Text color for decorative purposes (purple.60). */
--kui-color-text-decorative-purple: #6F28FF;
/* Strong text color for decorative purposes (purple.70). */
--kui-color-text-decorative-purple-strong: #5E00F5;
/* Text color for disabled elements (gray.40). */
--kui-color-text-disabled: #AFB7C5;
/* Inverse text color (white). */
--kui-color-text-inverse: #FFF;
/* Text color for neutral elements (gray.60). */
--kui-color-text-neutral: #6C7489;
/* Strong text color for neutral elements (gray.70). */
--kui-color-text-neutral-strong: #52596E;
/* Stronger text color for neutral elements (gray.80). */
--kui-color-text-neutral-stronger: #3A3F51;
/* Strongest text color for neutral elements (gray.90). */
--kui-color-text-neutral-strongest: #232633;
/* Weak text color for neutral elements (gray.40). */
--kui-color-text-neutral-weak: #AFB7C5;
/* Weaker text color for neutral elements (gray.20). */
--kui-color-text-neutral-weaker: #E0E4EA;
/* Text color for primary actions or messages (blue.60). */
--kui-color-text-primary: #0044F4;
/* Strong text color for primary actions or messages (blue.70). */
--kui-color-text-primary-strong: #0030CC;
/* Stronger text color for primary actions or messages (blue.80). */
--kui-color-text-primary-stronger: #002099;
/* Strongest text color for primary actions or messages (blue.90). */
--kui-color-text-primary-strongest: #001466;
/* Weak text color for primary actions or messages (blue.40). */
--kui-color-text-primary-weak: #5F9AFF;
/* Text color for success actions or messages (green.60). */
--kui-color-text-success: #007D60;
/* Strong text color for success actions or messages (green.70). */
--kui-color-text-success-strong: #005944;
/* Text color for warning actions or messages (yellow.60). */
--kui-color-text-warning: #995C00;
/* Text color for warning actions or messages (yellow.70). */
--kui-color-text-warning-strong: #804400;
/* Default transition timing */
--kui-animation-duration-20: 0.2s;
/* 0px border radius. */
--kui-border-radius-0: 0px;
/* 2px border radius. */
--kui-border-radius-10: 2px;
/* 4px border radius. */
--kui-border-radius-20: 4px;
/* 6px border radius. */
--kui-border-radius-30: 6px;
/* 8px border radius. */
--kui-border-radius-40: 8px;
/* 10px border radius. */
--kui-border-radius-50: 10px;
/* 50% border radius used to create circles. */
--kui-border-radius-circle: 50%;
/* 100px border radius used to create pill shapes. */
--kui-border-radius-round: 100px;
/* 0px border width. */
--kui-border-width-0: 0px;
/* 1px border width. */
--kui-border-width-10: 1px;
/* 2px border width. */
--kui-border-width-20: 2px;
/* 4px border width. */
--kui-border-width-30: 4px;
/* Used for larger mobile screens. Any viewport width under this value is considered mobile. */
--kui-breakpoint-mobile: 640px;
/* Used for tablet screens. */
--kui-breakpoint-phablet: 768px;
/* Used for larger tablet screens. Any viewport width less than this value will likely show a mobile layout. Any viewport width this value and greater will likely show a desktop layout. */
--kui-breakpoint-tablet: 1024px;
/* Used for standard desktop screens. */
--kui-breakpoint-laptop: 1280px;
/* Used for larger desktop screens. */
--kui-breakpoint-desktop: 1536px;
/* Danger color for icons. */
--kui-icon-color-danger: #F50045;
/* Neutral color for icons. */
--kui-icon-color-neutral: #828A9E;
/* Primary color for icons. */
--kui-icon-color-primary: #306FFF;
/* Success color for icons. */
--kui-icon-color-success: #00A17B;
/* Warning color for icons. */
--kui-icon-color-warning: #FFC400;
/* 10px icon size. */
--kui-icon-size-10: 10px;
/* 12px icon size. */
--kui-icon-size-20: 12px;
/* 16px icon size. */
--kui-icon-size-30: 16px;
/* 20px icon size. */
--kui-icon-size-40: 20px;
/* 24px icon size (default). */
--kui-icon-size-50: 24px;
/* 32px icon size. */
--kui-icon-size-60: 32px;
/* 40px icon size. */
--kui-icon-size-70: 40px;
/* 48px icon size. */
--kui-icon-size-80: 48px;
/* Background color for the CONNECT method (purple.10). */
--kui-method-color-background-connect: #F1F0FF;
/* Background color for the DELETE method (red.10). */
--kui-method-color-background-delete: #FFE5E5;
/* Background color for the GET method (blue.10). */
--kui-method-color-background-get: #EEFAFF;
/* Background color for the HEAD method (gray.70). */
--kui-method-color-background-head: #52596E;
/* Background color for the OPTIONS method (gray.20). */
--kui-method-color-background-options: #E0E4EA;
/* Background color for the PATCH method (aqua.10). */
--kui-method-color-background-patch: #ECFCFF;
/* Background color for the POST method (green.10). */
--kui-method-color-background-post: #ECFFFB;
/* Background color for the PUT method (yellow.10). */
--kui-method-color-background-put: #FFFCE0;
/* Background color for the TRACE method (pink.10). */
--kui-method-color-background-trace: #FFF0F7;
/* Text color for the CONNECT method (purple.60). */
--kui-method-color-text-connect: #6F28FF;
/* Strong text color for the CONNECT method (purple.70). */
--kui-method-color-text-connect-strong: #5E00F5;
/* Text color for the DELETE method (red.60). */
--kui-method-color-text-delete: #D60027;
/* Strong text color for the DELETE method (red.70). */
--kui-method-color-text-delete-strong: #AD000E;
/* Text color for the GET method (blue.60). */
--kui-method-color-text-get: #0044F4;
/* Strong text color for the GET method (blue.70). */
--kui-method-color-text-get-strong: #0030CC;
/* Text color for the HEAD method (gray.20). */
--kui-method-color-text-head: #E0E4EA;
/* Strong text color for the HEAD method (gray.40). */
--kui-method-color-text-head-strong: #AFB7C5;
/* Text color for the OPTIONS method (gray.70). */
--kui-method-color-text-options: #52596E;
/* Strong text color for the OPTIONS method (gray.80). */
--kui-method-color-text-options-strong: #3A3F51;
/* Text color for the PATCH method (aqua.60). */
--kui-method-color-text-patch: #00819D;
/* Strong text color for the PATCH method (aqua.70). */
--kui-method-color-text-patch-strong: #00647A;
/* Text color for the POST method (green.60). */
--kui-method-color-text-post: #007D60;
/* Strong text color for the POST method (green.70). */
--kui-method-color-text-post-strong: #005944;
/* Text color for the PUT method (yellow.60). */
--kui-method-color-text-put: #995C00;
/* Strong text color for the PUT method (yellow.70). */
--kui-method-color-text-put-strong: #804400;
/* Text color for the TRACE method (pink.60). */
--kui-method-color-text-trace: #D60067;
/* Strong text color for the TRACE method (pink.70). */
--kui-method-color-text-trace-strong: #AD0053;
/* blue.100 */
--kui-navigation-color-background: #000933;
/* The background color of a selected navigation item. */
--kui-navigation-color-background-selected: rgba(255, 255, 255, 0.12);
/* rgba(white, 0.12) */
--kui-navigation-color-border: rgba(255, 255, 255, 0.12);
/* The border color for a selected child navigation item. */
--kui-navigation-color-border-child: #00FABE;
/* The color of the navigation section divider. */
--kui-navigation-color-border-divider: rgba(255, 255, 255, 0.24);
/* Navigation link and icon color. */
--kui-navigation-color-text: #BEE2FF;
/* Navigation link and icon focus-visible color. */
--kui-navigation-color-text-focus: #FFF;
/* Navigation link and icon hover color. */
--kui-navigation-color-text-hover: #EEFAFF;
/* Navigation link and icon selected color. */
--kui-navigation-color-text-selected: #00FABE;
/* The box-shadow for a focus-visible navigation link. */
--kui-navigation-shadow-border: 0 0 0 1px rgba(255, 255, 255, 0.12) inset;
/* The left box-shadow for an active child navigation link. */
--kui-navigation-shadow-border-child: 4px 0 0 0 #00FABE inset;
/* Navigation link focus-visible box-shadow. */
--kui-navigation-shadow-focus: 0 0 0 1px rgba(255, 255, 255, 0.60) inset;
/* The standard monospace text font family. Typically used for code blocks, inline code, and copyable text. */
--kui-font-family-code: 'JetBrains Mono', Consolas, monospace;
/* The standard heading text font family. */
--kui-font-family-heading: 'Inter', Roboto, Helvetica, sans-serif;
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
/* Alias for letter-spacing-normal */
--kui-letter-spacing-0: normal;
/* -0.12px */
--kui-letter-spacing-minus-10: -0.12px;
/* -0.24px */
--kui-letter-spacing-minus-20: -0.24px;
/* -0.32px */
--kui-letter-spacing-minus-30: -0.32px;
/* -0.4px */
--kui-letter-spacing-minus-40: -0.4px;
/* -0.48px */
--kui-letter-spacing-minus-50: -0.48px;
/* normal */
--kui-letter-spacing-normal: normal;
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
/* 0px 4px 20px 0px rgba(0, 0, 0, 0.08) */
--kui-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.08);
/* 0px 0px 0px 1px gray.20 inset */
--kui-shadow-border: 0px 0px 0px 1px #E0E4EA inset;
/* 0px 0px 0px 1px red.60 inset */
--kui-shadow-border-danger: 0px 0px 0px 1px #D60027 inset;
/* 0px 0px 0px 1px red.70 inset */
--kui-shadow-border-danger-strong: 0px 0px 0px 1px #AD000E inset;
/* 0px 0px 0px 1px gray.20 inset */
--kui-shadow-border-disabled: 0px 0px 0px 1px #E0E4EA inset;
/* 0px 0px 0px 1px blue.60 inset */
--kui-shadow-border-primary: 0px 0px 0px 1px #0044F4 inset;
/* 0px 0px 0px 1px blue.90 inset */
--kui-shadow-border-primary-strongest: 0px 0px 0px 1px #001466 inset;
/* 0px 0px 0px 1px blue.40 inset */
--kui-shadow-border-primary-weak: 0px 0px 0px 1px #5F9AFF inset;
/* 0px 0px 0px 4px rgba(0, 68, 244, 0.2) */
--kui-shadow-focus: 0px 0px 0px 4px rgba(0, 68, 244, 0.2);
/* 0px value for gaps, margin, or padding. */
--kui-space-0: 0px;
/* 2px value for gaps, margin, or padding. */
--kui-space-10: 2px;
/* 4px value for gaps, margin, or padding. */
--kui-space-20: 4px;
/* 6px value for gaps, margin, or padding. */
--kui-space-30: 6px;
/* 8px value for gaps, margin, or padding. */
--kui-space-40: 8px;
/* 12px value for gaps, margin, or padding. */
--kui-space-50: 12px;
/* 16px value for gaps, margin, or padding. */
--kui-space-60: 16px;
/* 20px value for gaps, margin, or padding. */
--kui-space-70: 20px;
/* 24px value for gaps, margin, or padding. */
--kui-space-80: 24px;
/* 32px value for gaps, margin, or padding. */
--kui-space-90: 32px;
/* 40px value for gaps, margin, or padding. */
--kui-space-100: 40px;
/* 48px value for gaps, margin, or padding. */
--kui-space-110: 48px;
/* 56px value for gaps, margin, or padding. */
--kui-space-120: 56px;
/* 64px value for gaps, margin, or padding. */
--kui-space-130: 64px;
/* 80px value for gaps, margin, or padding. */
--kui-space-140: 80px;
/* 96px value for gaps, margin, or padding. */
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
/* Default background color for containers (white). */
export const KUI_COLOR_BACKGROUND = "#FFF";
/* Background color for danger actions or messages (red.60). */
export const KUI_COLOR_BACKGROUND_DANGER = "#D60027";
/* Strong background color for danger actions or messages (red.70). */
export const KUI_COLOR_BACKGROUND_DANGER_STRONG = "#AD000E";
/* Stronger background color for danger actions or messages (red.80). */
export const KUI_COLOR_BACKGROUND_DANGER_STRONGER = "#850000";
/* Strongest background color for danger actions or messages (red.90). */
export const KUI_COLOR_BACKGROUND_DANGER_STRONGEST = "#5C0000";
/* Weak background color for danger actions or messages (red.40). */
export const KUI_COLOR_BACKGROUND_DANGER_WEAK = "#FF3954";
/* Weaker background color for danger actions or messages (red.20). */
export const KUI_COLOR_BACKGROUND_DANGER_WEAKER = "#FFABAB";
/* Weakest background color for danger actions or messages (red.10). */
export const KUI_COLOR_BACKGROUND_DANGER_WEAKEST = "#FFE5E5";
/* Background color for decorative purposes (purple.60). */
export const KUI_COLOR_BACKGROUND_DECORATIVE_PURPLE = "#6F28FF";
/* Weakest background color for decorative purposes (purple.10). */
export const KUI_COLOR_BACKGROUND_DECORATIVE_PURPLE_WEAKEST = "#F1F0FF";
/* Background color for disabled elements (gray.20). */
export const KUI_COLOR_BACKGROUND_DISABLED = "#E0E4EA";
/* Inverse background color for containers (blue.100) */
export const KUI_COLOR_BACKGROUND_INVERSE = "#000933";
/* Background color for neutral elements (gray.60). */
export const KUI_COLOR_BACKGROUND_NEUTRAL = "#6C7489";
/* Strong background color for neutral elements (gray.70). */
export const KUI_COLOR_BACKGROUND_NEUTRAL_STRONG = "#52596E";
/* Stronger background color for neutral elements (gray.80). */
export const KUI_COLOR_BACKGROUND_NEUTRAL_STRONGER = "#3A3F51";
/* Strongest background color for neutral elements (gray.90). */
export const KUI_COLOR_BACKGROUND_NEUTRAL_STRONGEST = "#232633";
/* Weak background color for neutral elements (gray.40). */
export const KUI_COLOR_BACKGROUND_NEUTRAL_WEAK = "#AFB7C5";
/* Weaker background color for neutral elements (gray.20). */
export const KUI_COLOR_BACKGROUND_NEUTRAL_WEAKER = "#E0E4EA";
/* Weakest background color for neutral elements (gray.10). */
export const KUI_COLOR_BACKGROUND_NEUTRAL_WEAKEST = "#F9FAFB";
/* Overlay background color (rgba(blue.100, 0.6)) */
export const KUI_COLOR_BACKGROUND_OVERLAY = "rgba(0, 9, 51, 0.6)";
/* Background color for primary actions or messages (blue.60). */
export const KUI_COLOR_BACKGROUND_PRIMARY = "#0044F4";
/* Strong background color for primary actions or messages (blue.70). */
export const KUI_COLOR_BACKGROUND_PRIMARY_STRONG = "#0030CC";
/* Stronger background color for primary actions or messages (blue.80). */
export const KUI_COLOR_BACKGROUND_PRIMARY_STRONGER = "#002099";
/* Strongest background color for primary actions or messages (blue.90). */
export const KUI_COLOR_BACKGROUND_PRIMARY_STRONGEST = "#001466";
/* Weak background color for primary actions or messages (blue.40). */
export const KUI_COLOR_BACKGROUND_PRIMARY_WEAK = "#5F9AFF";
/* Weaker background color for primary actions or messages (blue.20). */
export const KUI_COLOR_BACKGROUND_PRIMARY_WEAKER = "#BEE2FF";
/* Weakest background color for primary actions or messages (blue.10) */
export const KUI_COLOR_BACKGROUND_PRIMARY_WEAKEST = "#EEFAFF";
/* Weak background color for success elements (green.40). */
export const KUI_COLOR_BACKGROUND_SUCCESS_WEAK = "#00D6A4";
/* Weakest background color for success elements (green.10). */
export const KUI_COLOR_BACKGROUND_SUCCESS_WEAKEST = "#ECFFFB";
/* Transparent background color (transparent). */
export const KUI_COLOR_BACKGROUND_TRANSPARENT = "transparent";
/* Weak background color for warning elements (yellow.40). */
export const KUI_COLOR_BACKGROUND_WARNING_WEAK = "#FFC400";
/* Weakest background color for warning elements (yellow.10). */
export const KUI_COLOR_BACKGROUND_WARNING_WEAKEST = "#FFFCE0";
/* Default border color for containers (gray.20). */
export const KUI_COLOR_BORDER = "#E0E4EA";
/* Border color for danger actions or messages (red.60). */
export const KUI_COLOR_BORDER_DANGER = "#D60027";
/* Strong border color for danger actions or messages (red.70). */
export const KUI_COLOR_BORDER_DANGER_STRONG = "#AD000E";
/* Stronger border color for danger actions or messages (red.80). */
export const KUI_COLOR_BORDER_DANGER_STRONGER = "#850000";
/* Strongest border color for danger actions or messages (red.90). */
export const KUI_COLOR_BORDER_DANGER_STRONGEST = "#5C0000";
/* Weak border color for danger actions or messages (red.40). */
export const KUI_COLOR_BORDER_DANGER_WEAK = "#FF3954";
/* Weaker border color for danger actions or messages (red.20). */
export const KUI_COLOR_BORDER_DANGER_WEAKER = "#FFABAB";
/* Weakest border color for danger actions or messages (red.10). */
export const KUI_COLOR_BORDER_DANGER_WEAKEST = "#FFE5E5";
/* Border color for decorative purposes (purple.60). */
export const KUI_COLOR_BORDER_DECORATIVE_PURPLE = "#6F28FF";
/* Border color for disabled elements (gray.20). */
export const KUI_COLOR_BORDER_DISABLED = "#E0E4EA";
/* Inverse border color (rgba(white, 0.2)). */
export const KUI_COLOR_BORDER_INVERSE = "rgba(255, 255, 255, 0.2)";
/* Weak border color for neutral elements (gray.40) */
export const KUI_COLOR_BORDER_NEUTRAL_WEAK = "#AFB7C5";
/* Weaker border color for neutral elements (gray.20) */
export const KUI_COLOR_BORDER_NEUTRAL_WEAKER = "#E0E4EA";
/* Border color for primary actions or messages (blue.60). */
export const KUI_COLOR_BORDER_PRIMARY = "#0044F4";
/* Strong border color for primary actions or messages (blue.70). */
export const KUI_COLOR_BORDER_PRIMARY_STRONG = "#0030CC";
/* Stronger border color for primary actions or messages (blue.80). */
export const KUI_COLOR_BORDER_PRIMARY_STRONGER = "#002099";
/* Strongest border color for primary actions or messages (blue.90). */
export const KUI_COLOR_BORDER_PRIMARY_STRONGEST = "#001466";
/* Weak border color for primary actions or messages (blue.40). */
export const KUI_COLOR_BORDER_PRIMARY_WEAK = "#5F9AFF";
/* Weaker border color for primary actions or messages (blue.20). */
export const KUI_COLOR_BORDER_PRIMARY_WEAKER = "#BEE2FF";
/* Weakest border color for primary actions or messages (blue.10). */
export const KUI_COLOR_BORDER_PRIMARY_WEAKEST = "#EEFAFF";
/* Transparent border color (transparent). */
export const KUI_COLOR_BORDER_TRANSPARENT = "transparent";
/* Default text color (blue.100). */
export const KUI_COLOR_TEXT = "#000933";
/* Text color for danger actions or messages (red.60). */
export const KUI_COLOR_TEXT_DANGER = "#D60027";
/* Strong text color for danger actions or messages (red.70). */
export const KUI_COLOR_TEXT_DANGER_STRONG = "#AD000E";
/* Text color for decorative purposes (aqua.50). */
export const KUI_COLOR_TEXT_DECORATIVE_AQUA = "#00ABD2";
/* Text color for decorative purposes (pink.60). */
export const KUI_COLOR_TEXT_DECORATIVE_PINK = "#D60067";
/* Text color for decorative purposes (purple.60). */
export const KUI_COLOR_TEXT_DECORATIVE_PURPLE = "#6F28FF";
/* Strong text color for decorative purposes (purple.70). */
export const KUI_COLOR_TEXT_DECORATIVE_PURPLE_STRONG = "#5E00F5";
/* Text color for disabled elements (gray.40). */
export const KUI_COLOR_TEXT_DISABLED = "#AFB7C5";
/* Inverse text color (white). */
export const KUI_COLOR_TEXT_INVERSE = "#FFF";
/* Text color for neutral elements (gray.60). */
export const KUI_COLOR_TEXT_NEUTRAL = "#6C7489";
/* Strong text color for neutral elements (gray.70). */
export const KUI_COLOR_TEXT_NEUTRAL_STRONG = "#52596E";
/* Stronger text color for neutral elements (gray.80). */
export const KUI_COLOR_TEXT_NEUTRAL_STRONGER = "#3A3F51";
/* Strongest text color for neutral elements (gray.90). */
export const KUI_COLOR_TEXT_NEUTRAL_STRONGEST = "#232633";
/* Weak text color for neutral elements (gray.40). */
export const KUI_COLOR_TEXT_NEUTRAL_WEAK = "#AFB7C5";
/* Weaker text color for neutral elements (gray.20). */
export const KUI_COLOR_TEXT_NEUTRAL_WEAKER = "#E0E4EA";
/* Text color for primary actions or messages (blue.60). */
export const KUI_COLOR_TEXT_PRIMARY = "#0044F4";
/* Strong text color for primary actions or messages (blue.70). */
export const KUI_COLOR_TEXT_PRIMARY_STRONG = "#0030CC";
/* Stronger text color for primary actions or messages (blue.80). */
export const KUI_COLOR_TEXT_PRIMARY_STRONGER = "#002099";
/* Strongest text color for primary actions or messages (blue.90). */
export const KUI_COLOR_TEXT_PRIMARY_STRONGEST = "#001466";
/* Weak text color for primary actions or messages (blue.40). */
export const KUI_COLOR_TEXT_PRIMARY_WEAK = "#5F9AFF";
/* Text color for success actions or messages (green.60). */
export const KUI_COLOR_TEXT_SUCCESS = "#007D60";
/* Strong text color for success actions or messages (green.70). */
export const KUI_COLOR_TEXT_SUCCESS_STRONG = "#005944";
/* Text color for warning actions or messages (yellow.60). */
export const KUI_COLOR_TEXT_WARNING = "#995C00";
/* Text color for warning actions or messages (yellow.70). */
export const KUI_COLOR_TEXT_WARNING_STRONG = "#804400";
/* Default transition timing */
export const KUI_ANIMATION_DURATION_20 = "0.2s";
/* 0px border radius. */
export const KUI_BORDER_RADIUS_0 = "0px";
/* 2px border radius. */
export const KUI_BORDER_RADIUS_10 = "2px";
/* 4px border radius. */
export const KUI_BORDER_RADIUS_20 = "4px";
/* 6px border radius. */
export const KUI_BORDER_RADIUS_30 = "6px";
/* 8px border radius. */
export const KUI_BORDER_RADIUS_40 = "8px";
/* 10px border radius. */
export const KUI_BORDER_RADIUS_50 = "10px";
/* 50% border radius used to create circles. */
export const KUI_BORDER_RADIUS_CIRCLE = "50%";
/* 100px border radius used to create pill shapes. */
export const KUI_BORDER_RADIUS_ROUND = "100px";
/* 0px border width. */
export const KUI_BORDER_WIDTH_0 = "0px";
/* 1px border width. */
export const KUI_BORDER_WIDTH_10 = "1px";
/* 2px border width. */
export const KUI_BORDER_WIDTH_20 = "2px";
/* 4px border width. */
export const KUI_BORDER_WIDTH_30 = "4px";
/* Used for larger mobile screens. Any viewport width under this value is considered mobile. */
export const KUI_BREAKPOINT_MOBILE = "640px";
/* Used for tablet screens. */
export const KUI_BREAKPOINT_PHABLET = "768px";
/* Used for larger tablet screens. Any viewport width less than this value will likely show a mobile layout. Any viewport width this value and greater will likely show a desktop layout. */
export const KUI_BREAKPOINT_TABLET = "1024px";
/* Used for standard desktop screens. */
export const KUI_BREAKPOINT_LAPTOP = "1280px";
/* Used for larger desktop screens. */
export const KUI_BREAKPOINT_DESKTOP = "1536px";
/* Danger color for icons. */
export const KUI_ICON_COLOR_DANGER = "#F50045";
/* Neutral color for icons. */
export const KUI_ICON_COLOR_NEUTRAL = "#828A9E";
/* Primary color for icons. */
export const KUI_ICON_COLOR_PRIMARY = "#306FFF";
/* Success color for icons. */
export const KUI_ICON_COLOR_SUCCESS = "#00A17B";
/* Warning color for icons. */
export const KUI_ICON_COLOR_WARNING = "#FFC400";
/* 10px icon size. */
export const KUI_ICON_SIZE_10 = "10px";
/* 12px icon size. */
export const KUI_ICON_SIZE_20 = "12px";
/* 16px icon size. */
export const KUI_ICON_SIZE_30 = "16px";
/* 20px icon size. */
export const KUI_ICON_SIZE_40 = "20px";
/* 24px icon size (default). */
export const KUI_ICON_SIZE_50 = "24px";
/* 32px icon size. */
export const KUI_ICON_SIZE_60 = "32px";
/* 40px icon size. */
export const KUI_ICON_SIZE_70 = "40px";
/* 48px icon size. */
export const KUI_ICON_SIZE_80 = "48px";
/* Background color for the CONNECT method (purple.10). */
export const KUI_METHOD_COLOR_BACKGROUND_CONNECT = "#F1F0FF";
/* Background color for the DELETE method (red.10). */
export const KUI_METHOD_COLOR_BACKGROUND_DELETE = "#FFE5E5";
/* Background color for the GET method (blue.10). */
export const KUI_METHOD_COLOR_BACKGROUND_GET = "#EEFAFF";
/* Background color for the HEAD method (gray.70). */
export const KUI_METHOD_COLOR_BACKGROUND_HEAD = "#52596E";
/* Background color for the OPTIONS method (gray.20). */
export const KUI_METHOD_COLOR_BACKGROUND_OPTIONS = "#E0E4EA";
/* Background color for the PATCH method (aqua.10). */
export const KUI_METHOD_COLOR_BACKGROUND_PATCH = "#ECFCFF";
/* Background color for the POST method (green.10). */
export const KUI_METHOD_COLOR_BACKGROUND_POST = "#ECFFFB";
/* Background color for the PUT method (yellow.10). */
export const KUI_METHOD_COLOR_BACKGROUND_PUT = "#FFFCE0";
/* Background color for the TRACE method (pink.10). */
export const KUI_METHOD_COLOR_BACKGROUND_TRACE = "#FFF0F7";
/* Text color for the CONNECT method (purple.60). */
export const KUI_METHOD_COLOR_TEXT_CONNECT = "#6F28FF";
/* Strong text color for the CONNECT method (purple.70). */
export const KUI_METHOD_COLOR_TEXT_CONNECT_STRONG = "#5E00F5";
/* Text color for the DELETE method (red.60). */
export const KUI_METHOD_COLOR_TEXT_DELETE = "#D60027";
/* Strong text color for the DELETE method (red.70). */
export const KUI_METHOD_COLOR_TEXT_DELETE_STRONG = "#AD000E";
/* Text color for the GET method (blue.60). */
export const KUI_METHOD_COLOR_TEXT_GET = "#0044F4";
/* Strong text color for the GET method (blue.70). */
export const KUI_METHOD_COLOR_TEXT_GET_STRONG = "#0030CC";
/* Text color for the HEAD method (gray.20). */
export const KUI_METHOD_COLOR_TEXT_HEAD = "#E0E4EA";
/* Strong text color for the HEAD method (gray.40). */
export const KUI_METHOD_COLOR_TEXT_HEAD_STRONG = "#AFB7C5";
/* Text color for the OPTIONS method (gray.70). */
export const KUI_METHOD_COLOR_TEXT_OPTIONS = "#52596E";
/* Strong text color for the OPTIONS method (gray.80). */
export const KUI_METHOD_COLOR_TEXT_OPTIONS_STRONG = "#3A3F51";
/* Text color for the PATCH method (aqua.60). */
export const KUI_METHOD_COLOR_TEXT_PATCH = "#00819D";
/* Strong text color for the PATCH method (aqua.70). */
export const KUI_METHOD_COLOR_TEXT_PATCH_STRONG = "#00647A";
/* Text color for the POST method (green.60). */
export const KUI_METHOD_COLOR_TEXT_POST = "#007D60";
/* Strong text color for the POST method (green.70). */
export const KUI_METHOD_COLOR_TEXT_POST_STRONG = "#005944";
/* Text color for the PUT method (yellow.60). */
export const KUI_METHOD_COLOR_TEXT_PUT = "#995C00";
/* Strong text color for the PUT method (yellow.70). */
export const KUI_METHOD_COLOR_TEXT_PUT_STRONG = "#804400";
/* Text color for the TRACE method (pink.60). */
export const KUI_METHOD_COLOR_TEXT_TRACE = "#D60067";
/* Strong text color for the TRACE method (pink.70). */
export const KUI_METHOD_COLOR_TEXT_TRACE_STRONG = "#AD0053";
/* blue.100 */
export const KUI_NAVIGATION_COLOR_BACKGROUND = "#000933";
/* The background color of a selected navigation item. */
export const KUI_NAVIGATION_COLOR_BACKGROUND_SELECTED = "rgba(255, 255, 255, 0.12)";
/* rgba(white, 0.12) */
export const KUI_NAVIGATION_COLOR_BORDER = "rgba(255, 255, 255, 0.12)";
/* The border color for a selected child navigation item. */
export const KUI_NAVIGATION_COLOR_BORDER_CHILD = "#00FABE";
/* The color of the navigation section divider. */
export const KUI_NAVIGATION_COLOR_BORDER_DIVIDER = "rgba(255, 255, 255, 0.24)";
/* Navigation link and icon color. */
export const KUI_NAVIGATION_COLOR_TEXT = "#BEE2FF";
/* Navigation link and icon focus-visible color. */
export const KUI_NAVIGATION_COLOR_TEXT_FOCUS = "#FFF";
/* Navigation link and icon hover color. */
export const KUI_NAVIGATION_COLOR_TEXT_HOVER = "#EEFAFF";
/* Navigation link and icon selected color. */
export const KUI_NAVIGATION_COLOR_TEXT_SELECTED = "#00FABE";
/* The box-shadow for a focus-visible navigation link. */
export const KUI_NAVIGATION_SHADOW_BORDER = "0 0 0 1px rgba(255, 255, 255, 0.12) inset";
/* The left box-shadow for an active child navigation link. */
export const KUI_NAVIGATION_SHADOW_BORDER_CHILD = "4px 0 0 0 #00FABE inset";
/* Navigation link focus-visible box-shadow. */
export const KUI_NAVIGATION_SHADOW_FOCUS = "0 0 0 1px rgba(255, 255, 255, 0.60) inset";
/* The standard monospace text font family. Typically used for code blocks, inline code, and copyable text. */
export const KUI_FONT_FAMILY_CODE = "'JetBrains Mono', Consolas, monospace";
/* The standard heading text font family. */
export const KUI_FONT_FAMILY_HEADING = "'Inter', Roboto, Helvetica, sans-serif";
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
/* Alias for letter-spacing-normal */
export const KUI_LETTER_SPACING_0 = "normal";
/* -0.12px */
export const KUI_LETTER_SPACING_MINUS_10 = "-0.12px";
/* -0.24px */
export const KUI_LETTER_SPACING_MINUS_20 = "-0.24px";
/* -0.32px */
export const KUI_LETTER_SPACING_MINUS_30 = "-0.32px";
/* -0.4px */
export const KUI_LETTER_SPACING_MINUS_40 = "-0.4px";
/* -0.48px */
export const KUI_LETTER_SPACING_MINUS_50 = "-0.48px";
/* normal */
export const KUI_LETTER_SPACING_NORMAL = "normal";
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
/* 0px 4px 20px 0px rgba(0, 0, 0, 0.08) */
export const KUI_SHADOW = "0px 4px 20px 0px rgba(0, 0, 0, 0.08)";
/* 0px 0px 0px 1px gray.20 inset */
export const KUI_SHADOW_BORDER = "0px 0px 0px 1px #E0E4EA inset";
/* 0px 0px 0px 1px red.60 inset */
export const KUI_SHADOW_BORDER_DANGER = "0px 0px 0px 1px #D60027 inset";
/* 0px 0px 0px 1px red.70 inset */
export const KUI_SHADOW_BORDER_DANGER_STRONG = "0px 0px 0px 1px #AD000E inset";
/* 0px 0px 0px 1px gray.20 inset */
export const KUI_SHADOW_BORDER_DISABLED = "0px 0px 0px 1px #E0E4EA inset";
/* 0px 0px 0px 1px blue.60 inset */
export const KUI_SHADOW_BORDER_PRIMARY = "0px 0px 0px 1px #0044F4 inset";
/* 0px 0px 0px 1px blue.90 inset */
export const KUI_SHADOW_BORDER_PRIMARY_STRONGEST = "0px 0px 0px 1px #001466 inset";
/* 0px 0px 0px 1px blue.40 inset */
export const KUI_SHADOW_BORDER_PRIMARY_WEAK = "0px 0px 0px 1px #5F9AFF inset";
/* 0px 0px 0px 4px rgba(0, 68, 244, 0.2) */
export const KUI_SHADOW_FOCUS = "0px 0px 0px 4px rgba(0, 68, 244, 0.2)";
/* 0px value for gaps, margin, or padding. */
export const KUI_SPACE_0 = "0px";
/* 2px value for gaps, margin, or padding. */
export const KUI_SPACE_10 = "2px";
/* 4px value for gaps, margin, or padding. */
export const KUI_SPACE_20 = "4px";
/* 6px value for gaps, margin, or padding. */
export const KUI_SPACE_30 = "6px";
/* 8px value for gaps, margin, or padding. */
export const KUI_SPACE_40 = "8px";
/* 12px value for gaps, margin, or padding. */
export const KUI_SPACE_50 = "12px";
/* 16px value for gaps, margin, or padding. */
export const KUI_SPACE_60 = "16px";
/* 20px value for gaps, margin, or padding. */
export const KUI_SPACE_70 = "20px";
/* 24px value for gaps, margin, or padding. */
export const KUI_SPACE_80 = "24px";
/* 32px value for gaps, margin, or padding. */
export const KUI_SPACE_90 = "32px";
/* 40px value for gaps, margin, or padding. */
export const KUI_SPACE_100 = "40px";
/* 48px value for gaps, margin, or padding. */
export const KUI_SPACE_110 = "48px";
/* 56px value for gaps, margin, or padding. */
export const KUI_SPACE_120 = "56px";
/* 64px value for gaps, margin, or padding. */
export const KUI_SPACE_130 = "64px";
/* 80px value for gaps, margin, or padding. */
export const KUI_SPACE_140 = "80px";
/* 96px value for gaps, margin, or padding. */
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
  "kui_color_background": "#FFF",
  "kui_color_background_danger": "#D60027",
  "kui_color_background_danger_strong": "#AD000E",
  "kui_color_background_danger_stronger": "#850000",
  "kui_color_background_danger_strongest": "#5C0000",
  "kui_color_background_danger_weak": "#FF3954",
  "kui_color_background_danger_weaker": "#FFABAB",
  "kui_color_background_danger_weakest": "#FFE5E5",
  "kui_color_background_decorative_purple": "#6F28FF",
  "kui_color_background_decorative_purple_weakest": "#F1F0FF",
  "kui_color_background_disabled": "#E0E4EA",
  "kui_color_background_inverse": "#000933",
  "kui_color_background_neutral": "#6C7489",
  "kui_color_background_neutral_strong": "#52596E",
  "kui_color_background_neutral_stronger": "#3A3F51",
  "kui_color_background_neutral_strongest": "#232633",
  "kui_color_background_neutral_weak": "#AFB7C5",
  "kui_color_background_neutral_weaker": "#E0E4EA",
  "kui_color_background_neutral_weakest": "#F9FAFB",
  "kui_color_background_overlay": "rgba(0, 9, 51, 0.6)",
  "kui_color_background_primary": "#0044F4",
  "kui_color_background_primary_strong": "#0030CC",
  "kui_color_background_primary_stronger": "#002099",
  "kui_color_background_primary_strongest": "#001466",
  "kui_color_background_primary_weak": "#5F9AFF",
  "kui_color_background_primary_weaker": "#BEE2FF",
  "kui_color_background_primary_weakest": "#EEFAFF",
  "kui_color_background_success_weak": "#00D6A4",
  "kui_color_background_success_weakest": "#ECFFFB",
  "kui_color_background_transparent": "transparent",
  "kui_color_background_warning_weak": "#FFC400",
  "kui_color_background_warning_weakest": "#FFFCE0",
  "kui_color_border": "#E0E4EA",
  "kui_color_border_danger": "#D60027",
  "kui_color_border_danger_strong": "#AD000E",
  "kui_color_border_danger_stronger": "#850000",
  "kui_color_border_danger_strongest": "#5C0000",
  "kui_color_border_danger_weak": "#FF3954",
  "kui_color_border_danger_weaker": "#FFABAB",
  "kui_color_border_danger_weakest": "#FFE5E5",
  "kui_color_border_decorative_purple": "#6F28FF",
  "kui_color_border_disabled": "#E0E4EA",
  "kui_color_border_inverse": "rgba(255, 255, 255, 0.2)",
  "kui_color_border_neutral_weak": "#AFB7C5",
  "kui_color_border_neutral_weaker": "#E0E4EA",
  "kui_color_border_primary": "#0044F4",
  "kui_color_border_primary_strong": "#0030CC",
  "kui_color_border_primary_stronger": "#002099",
  "kui_color_border_primary_strongest": "#001466",
  "kui_color_border_primary_weak": "#5F9AFF",
  "kui_color_border_primary_weaker": "#BEE2FF",
  "kui_color_border_primary_weakest": "#EEFAFF",
  "kui_color_border_transparent": "transparent",
  "kui_color_text": "#000933",
  "kui_color_text_danger": "#D60027",
  "kui_color_text_danger_strong": "#AD000E",
  "kui_color_text_decorative_aqua": "#00ABD2",
  "kui_color_text_decorative_pink": "#D60067",
  "kui_color_text_decorative_purple": "#6F28FF",
  "kui_color_text_decorative_purple_strong": "#5E00F5",
  "kui_color_text_disabled": "#AFB7C5",
  "kui_color_text_inverse": "#FFF",
  "kui_color_text_neutral": "#6C7489",
  "kui_color_text_neutral_strong": "#52596E",
  "kui_color_text_neutral_stronger": "#3A3F51",
  "kui_color_text_neutral_strongest": "#232633",
  "kui_color_text_neutral_weak": "#AFB7C5",
  "kui_color_text_neutral_weaker": "#E0E4EA",
  "kui_color_text_primary": "#0044F4",
  "kui_color_text_primary_strong": "#0030CC",
  "kui_color_text_primary_stronger": "#002099",
  "kui_color_text_primary_strongest": "#001466",
  "kui_color_text_primary_weak": "#5F9AFF",
  "kui_color_text_success": "#007D60",
  "kui_color_text_success_strong": "#005944",
  "kui_color_text_warning": "#995C00",
  "kui_color_text_warning_strong": "#804400",
  "kui_animation_duration_20": "0.2s",
  "kui_border_radius_0": "0px",
  "kui_border_radius_10": "2px",
  "kui_border_radius_20": "4px",
  "kui_border_radius_30": "6px",
  "kui_border_radius_40": "8px",
  "kui_border_radius_50": "10px",
  "kui_border_radius_circle": "50%",
  "kui_border_radius_round": "100px",
  "kui_border_width_0": "0px",
  "kui_border_width_10": "1px",
  "kui_border_width_20": "2px",
  "kui_border_width_30": "4px",
  "kui_breakpoint_mobile": "640px",
  "kui_breakpoint_phablet": "768px",
  "kui_breakpoint_tablet": "1024px",
  "kui_breakpoint_laptop": "1280px",
  "kui_breakpoint_desktop": "1536px",
  "kui_icon_color_danger": "#F50045",
  "kui_icon_color_neutral": "#828A9E",
  "kui_icon_color_primary": "#306FFF",
  "kui_icon_color_success": "#00A17B",
  "kui_icon_color_warning": "#FFC400",
  "kui_icon_size_10": "10px",
  "kui_icon_size_20": "12px",
  "kui_icon_size_30": "16px",
  "kui_icon_size_40": "20px",
  "kui_icon_size_50": "24px",
  "kui_icon_size_60": "32px",
  "kui_icon_size_70": "40px",
  "kui_icon_size_80": "48px",
  "kui_method_color_background_connect": "#F1F0FF",
  "kui_method_color_background_delete": "#FFE5E5",
  "kui_method_color_background_get": "#EEFAFF",
  "kui_method_color_background_head": "#52596E",
  "kui_method_color_background_options": "#E0E4EA",
  "kui_method_color_background_patch": "#ECFCFF",
  "kui_method_color_background_post": "#ECFFFB",
  "kui_method_color_background_put": "#FFFCE0",
  "kui_method_color_background_trace": "#FFF0F7",
  "kui_method_color_text_connect": "#6F28FF",
  "kui_method_color_text_connect_strong": "#5E00F5",
  "kui_method_color_text_delete": "#D60027",
  "kui_method_color_text_delete_strong": "#AD000E",
  "kui_method_color_text_get": "#0044F4",
  "kui_method_color_text_get_strong": "#0030CC",
  "kui_method_color_text_head": "#E0E4EA",
  "kui_method_color_text_head_strong": "#AFB7C5",
  "kui_method_color_text_options": "#52596E",
  "kui_method_color_text_options_strong": "#3A3F51",
  "kui_method_color_text_patch": "#00819D",
  "kui_method_color_text_patch_strong": "#00647A",
  "kui_method_color_text_post": "#007D60",
  "kui_method_color_text_post_strong": "#005944",
  "kui_method_color_text_put": "#995C00",
  "kui_method_color_text_put_strong": "#804400",
  "kui_method_color_text_trace": "#D60067",
  "kui_method_color_text_trace_strong": "#AD0053",
  "kui_navigation_color_background": "#000933",
  "kui_navigation_color_background_selected": "rgba(255, 255, 255, 0.12)",
  "kui_navigation_color_border": "rgba(255, 255, 255, 0.12)",
  "kui_navigation_color_border_child": "#00FABE",
  "kui_navigation_color_border_divider": "rgba(255, 255, 255, 0.24)",
  "kui_navigation_color_text": "#BEE2FF",
  "kui_navigation_color_text_focus": "#FFF",
  "kui_navigation_color_text_hover": "#EEFAFF",
  "kui_navigation_color_text_selected": "#00FABE",
  "kui_navigation_shadow_border": "0 0 0 1px rgba(255, 255, 255, 0.12) inset",
  "kui_navigation_shadow_border_child": "4px 0 0 0 #00FABE inset",
  "kui_navigation_shadow_focus": "0 0 0 1px rgba(255, 255, 255, 0.60) inset",
  "kui_font_family_code": "'JetBrains Mono', Consolas, monospace",
  "kui_font_family_heading": "'Inter', Roboto, Helvetica, sans-serif",
  "kui_font_family_text": "'Inter', Roboto, Helvetica, sans-serif",
  "kui_font_size_10": "10px",
  "kui_font_size_20": "12px",
  "kui_font_size_30": "14px",
  "kui_font_size_40": "16px",
  "kui_font_size_50": "18px",
  "kui_font_size_60": "20px",
  "kui_font_size_70": "24px",
  "kui_font_size_80": "32px",
  "kui_font_size_90": "40px",
  "kui_font_size_100": "48px",
  "kui_font_weight_bold": "700",
  "kui_font_weight_medium": "500",
  "kui_font_weight_regular": "400",
  "kui_font_weight_semibold": "600",
  "kui_letter_spacing_0": "normal",
  "kui_letter_spacing_minus_10": "-0.12px",
  "kui_letter_spacing_minus_20": "-0.24px",
  "kui_letter_spacing_minus_30": "-0.32px",
  "kui_letter_spacing_minus_40": "-0.4px",
  "kui_letter_spacing_minus_50": "-0.48px",
  "kui_letter_spacing_normal": "normal",
  "kui_line_height_10": "12px",
  "kui_line_height_20": "16px",
  "kui_line_height_30": "20px",
  "kui_line_height_40": "24px",
  "kui_line_height_50": "28px",
  "kui_line_height_60": "32px",
  "kui_line_height_70": "36px",
  "kui_line_height_80": "40px",
  "kui_line_height_90": "48px",
  "kui_line_height_100": "56px",
  "kui_shadow": "0px 4px 20px 0px rgba(0, 0, 0, 0.08)",
  "kui_shadow_border": "0px 0px 0px 1px #E0E4EA inset",
  "kui_shadow_border_danger": "0px 0px 0px 1px #D60027 inset",
  "kui_shadow_border_danger_strong": "0px 0px 0px 1px #AD000E inset",
  "kui_shadow_border_disabled": "0px 0px 0px 1px #E0E4EA inset",
  "kui_shadow_border_primary": "0px 0px 0px 1px #0044F4 inset",
  "kui_shadow_border_primary_strongest": "0px 0px 0px 1px #001466 inset",
  "kui_shadow_border_primary_weak": "0px 0px 0px 1px #5F9AFF inset",
  "kui_shadow_focus": "0px 0px 0px 4px rgba(0, 68, 244, 0.2)",
  "kui_space_0": "0px",
  "kui_space_10": "2px",
  "kui_space_20": "4px",
  "kui_space_30": "6px",
  "kui_space_40": "8px",
  "kui_space_50": "12px",
  "kui_space_60": "16px",
  "kui_space_70": "20px",
  "kui_space_80": "24px",
  "kui_space_90": "32px",
  "kui_space_100": "40px",
  "kui_space_110": "48px",
  "kui_space_120": "56px",
  "kui_space_130": "64px",
  "kui_space_140": "80px",
  "kui_space_150": "96px",
  "kui_space_auto": "auto"
}
```

</details>
