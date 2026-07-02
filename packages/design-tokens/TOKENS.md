<!--
 * Do not edit directly, this file was auto-generated.
 * 
 * Kong Konnect Design Tokens
 * GitHub: https://github.com/Kong/design-tokens/tree/main/packages/design-tokens
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
$kui-color-background: #ffffff;
/* Accent background color for emphasis on non-primary UI. Distinct from the primary action color, used to add touches of the theme accent color across themes. */
$kui-color-background-accent: #0044f4;
/* Background color for danger actions or messages (red.60). */
$kui-color-background-danger: #d60027;
/* Strong background color for danger actions or messages (red.70). */
$kui-color-background-danger-strong: #ad000e;
/* Stronger background color for danger actions or messages (red.80). */
$kui-color-background-danger-stronger: #850000;
/* Strongest background color for danger actions or messages (red.90). */
$kui-color-background-danger-strongest: #5c0000;
/* Weak background color for danger actions or messages (red.40). */
$kui-color-background-danger-weak: #ff3954;
/* Weaker background color for danger actions or messages (red.20). */
$kui-color-background-danger-weaker: #ffabab;
/* Weakest background color for danger actions or messages (red.10). */
$kui-color-background-danger-weakest: #ffe5e5;
/* Weakest background color for decorative purposes (aqua.10). */
$kui-color-background-decorative-aqua-weakest: #ecfcff;
/* Background color for decorative purposes (purple.60). */
$kui-color-background-decorative-purple: #6f28ff;
/* Weakest background color for decorative purposes (purple.10). */
$kui-color-background-decorative-purple-weakest: #f1f0ff;
/* Background color for disabled elements (gray.20). */
$kui-color-background-disabled: #e0e4ea;
/* Background color for info elements (blue.60). */
$kui-color-background-info: #0044f4;
/* Strong background color for info elements (blue.70). */
$kui-color-background-info-strong: #0030cc;
/* Stronger background color for info elements (blue.80). */
$kui-color-background-info-stronger: #002099;
/* Strongest background color for info elements (blue.90). */
$kui-color-background-info-strongest: #001466;
/* Weak background color for info elements (blue.40). */
$kui-color-background-info-weak: #5f9aff;
/* Weaker background color for info elements (blue.20). */
$kui-color-background-info-weaker: #bee2ff;
/* Weakest background color for info elements (blue.10). */
$kui-color-background-info-weakest: #eefaff;
/* Inverse background color for containers (blue.100) */
$kui-color-background-inverse: #000933;
/* Background color for neutral elements (gray.60). */
$kui-color-background-neutral: #6c7489;
/* Strong background color for neutral elements (gray.70). */
$kui-color-background-neutral-strong: #52596e;
/* Stronger background color for neutral elements (gray.80). */
$kui-color-background-neutral-stronger: #3a3f51;
/* Strongest background color for neutral elements (gray.90). */
$kui-color-background-neutral-strongest: #232633;
/* Weak background color for neutral elements (gray.40). */
$kui-color-background-neutral-weak: #afb7c5;
/* Weaker background color for neutral elements (gray.20). */
$kui-color-background-neutral-weaker: #e0e4ea;
/* Weakest background color for neutral elements (gray.10). */
$kui-color-background-neutral-weakest: #f9fafb;
/* Overlay background color (rgba(0, 9, 51, 0.6)) */
$kui-color-background-overlay: rgba(0, 9, 51, 0.6);
/* Background color for primary actions or messages (blue.60). */
$kui-color-background-primary: #0044f4;
/* Strong background color for primary actions or messages (blue.70). */
$kui-color-background-primary-strong: #0030cc;
/* Stronger background color for primary actions or messages (blue.80). */
$kui-color-background-primary-stronger: #002099;
/* Strongest background color for primary actions or messages (blue.90). */
$kui-color-background-primary-strongest: #001466;
/* Weak background color for primary actions or messages (blue.40). */
$kui-color-background-primary-weak: #5f9aff;
/* Weaker background color for primary actions or messages (blue.20). */
$kui-color-background-primary-weaker: #bee2ff;
/* Weakest background color for primary actions or messages (blue.10) */
$kui-color-background-primary-weakest: #eefaff;
/* Background color for success elements (green.60). */
$kui-color-background-success: #007d60;
/* Strong background color for success elements (green.70). */
$kui-color-background-success-strong: #005944;
/* Stronger background color for success elements (green.80). */
$kui-color-background-success-stronger: #004737;
/* Strongest background color for success elements (green.90). */
$kui-color-background-success-strongest: #003629;
/* Weak background color for success elements (green.40). */
$kui-color-background-success-weak: #00d6a4;
/* Weaker background color for success elements (green.20). */
$kui-color-background-success-weaker: #b5ffee;
/* Weakest background color for success elements (green.10). */
$kui-color-background-success-weakest: #ecfffb;
/* Transparent background color (transparent). */
$kui-color-background-transparent: rgba(0, 0, 0, 0);
/* Background color for warning elements (yellow.60). */
$kui-color-background-warning: #995c00;
/* Strong background color for warning elements (yellow.70). */
$kui-color-background-warning-strong: #804400;
/* Stronger background color for warning elements (yellow.80). */
$kui-color-background-warning-stronger: #662d00;
/* Strongest background color for warning elements (yellow.90). */
$kui-color-background-warning-strongest: #4d1b00;
/* Weak background color for warning elements (yellow.40). */
$kui-color-background-warning-weak: #ffc400;
/* Weaker background color for warning elements (yellow.20). */
$kui-color-background-warning-weaker: #fff296;
/* Weakest background color for warning elements (yellow.10). */
$kui-color-background-warning-weakest: #fffce0;
/* Default border color for containers (gray.20). */
$kui-color-border: #e0e4ea;
/* Accent border color for emphasis on non-primary UI. Distinct from the primary action color, used to add touches of the theme accent color across themes. */
$kui-color-border-accent: #0044f4;
/* Border color for danger actions or messages (red.60). */
$kui-color-border-danger: #d60027;
/* Strong border color for danger actions or messages (red.70). */
$kui-color-border-danger-strong: #ad000e;
/* Stronger border color for danger actions or messages (red.80). */
$kui-color-border-danger-stronger: #850000;
/* Strongest border color for danger actions or messages (red.90). */
$kui-color-border-danger-strongest: #5c0000;
/* Weak border color for danger actions or messages (red.40). */
$kui-color-border-danger-weak: #ff3954;
/* Weaker border color for danger actions or messages (red.20). */
$kui-color-border-danger-weaker: #ffabab;
/* Weakest border color for danger actions or messages (red.10). */
$kui-color-border-danger-weakest: #ffe5e5;
/* Border color for decorative purposes (purple.60). */
$kui-color-border-decorative-purple: #6f28ff;
/* Border color for disabled elements (gray.20). */
$kui-color-border-disabled: #e0e4ea;
/* Inverse border color (rgba(255, 255, 255, 0.2)). */
$kui-color-border-inverse: rgba(255, 255, 255, 0.2);
/* Border color for neutral elements (gray.60) */
$kui-color-border-neutral: #6c7489;
/* Strong border color for neutral elements (gray.70) */
$kui-color-border-neutral-strong: #52596e;
/* Stronger border color for neutral elements (gray.80) */
$kui-color-border-neutral-stronger: #3a3f51;
/* Strongest border color for neutral elements (gray.90) */
$kui-color-border-neutral-strongest: #232633;
/* Weak border color for neutral elements (gray.40) */
$kui-color-border-neutral-weak: #afb7c5;
/* Weaker border color for neutral elements (gray.20) */
$kui-color-border-neutral-weaker: #e0e4ea;
/* Weakest border color for neutral elements (gray.10) */
$kui-color-border-neutral-weakest: #f9fafb;
/* Border color for primary actions or messages (blue.60). */
$kui-color-border-primary: #0044f4;
/* Strong border color for primary actions or messages (blue.70). */
$kui-color-border-primary-strong: #0030cc;
/* Stronger border color for primary actions or messages (blue.80). */
$kui-color-border-primary-stronger: #002099;
/* Strongest border color for primary actions or messages (blue.90). */
$kui-color-border-primary-strongest: #001466;
/* Weak border color for primary actions or messages (blue.40). */
$kui-color-border-primary-weak: #5f9aff;
/* Weaker border color for primary actions or messages (blue.20). */
$kui-color-border-primary-weaker: #bee2ff;
/* Weakest border color for primary actions or messages (blue.10). */
$kui-color-border-primary-weakest: #eefaff;
/* Transparent border color (transparent). */
$kui-color-border-transparent: rgba(0, 0, 0, 0);
/* Default text color (blue.100). */
$kui-color-text: #000933;
/* Accent text color for emphasis on non-primary UI. Distinct from the primary action color, used to add touches of the theme accent color across themes. */
$kui-color-text-accent: #0044f4;
/* Text color for danger actions or messages (red.60). */
$kui-color-text-danger: #d60027;
/* Strong text color for danger actions or messages (red.70). */
$kui-color-text-danger-strong: #ad000e;
/* Stronger text color for danger actions or messages (red.80). */
$kui-color-text-danger-stronger: #850000;
/* Strongest text color for danger actions or messages (red.90). */
$kui-color-text-danger-strongest: #5c0000;
/* Weak text color for danger actions or messages (red.40). */
$kui-color-text-danger-weak: #ff3954;
/* Weaker text color for danger actions or messages (red.20). */
$kui-color-text-danger-weaker: #ffabab;
/* Weakest text color for danger actions or messages (red.10). */
$kui-color-text-danger-weakest: #ffe5e5;
/* Text color for decorative purposes (aqua.50). */
$kui-color-text-decorative-aqua: #00abd2;
/* Text color for decorative purposes (pink.60). */
$kui-color-text-decorative-pink: #d60067;
/* Text color for decorative purposes (purple.60). */
$kui-color-text-decorative-purple: #6f28ff;
/* Strong text color for decorative purposes (purple.70). */
$kui-color-text-decorative-purple-strong: #5e00f5;
/* Text color for disabled elements (gray.40). */
$kui-color-text-disabled: #afb7c5;
/* Text color for info elements (blue.60). */
$kui-color-text-info: #0044f4;
/* Strong text color for info elements (blue.70). */
$kui-color-text-info-strong: #0030cc;
/* Stronger text color for info elements (blue.80). */
$kui-color-text-info-stronger: #002099;
/* Strongest text color for info elements (blue.90). */
$kui-color-text-info-strongest: #001466;
/* Weak text color for info elements (blue.40). */
$kui-color-text-info-weak: #5f9aff;
/* Weaker text color for info elements (blue.20). */
$kui-color-text-info-weaker: #bee2ff;
/* Weakest text color for info elements (blue.10). */
$kui-color-text-info-weakest: #eefaff;
/* Inverse text color (white). */
$kui-color-text-inverse: #ffffff;
/* Text color for neutral elements (gray.60). */
$kui-color-text-neutral: #6c7489;
/* Strong text color for neutral elements (gray.70). */
$kui-color-text-neutral-strong: #52596e;
/* Stronger text color for neutral elements (gray.80). */
$kui-color-text-neutral-stronger: #3a3f51;
/* Strongest text color for neutral elements (gray.90). */
$kui-color-text-neutral-strongest: #232633;
/* Weak text color for neutral elements (gray.40). */
$kui-color-text-neutral-weak: #afb7c5;
/* Weaker text color for neutral elements (gray.20). */
$kui-color-text-neutral-weaker: #e0e4ea;
/* Weakest text color for neutral elements (gray.10). */
$kui-color-text-neutral-weakest: #f9fafb;
/* Text color for primary actions or messages (blue.60). */
$kui-color-text-primary: #0044f4;
/* Strong text color for primary actions or messages (blue.70). */
$kui-color-text-primary-strong: #0030cc;
/* Stronger text color for primary actions or messages (blue.80). */
$kui-color-text-primary-stronger: #002099;
/* Strongest text color for primary actions or messages (blue.90). */
$kui-color-text-primary-strongest: #001466;
/* Weak text color for primary actions or messages (blue.40). */
$kui-color-text-primary-weak: #5f9aff;
/* Weaker text color for primary actions or messages (blue.20). */
$kui-color-text-primary-weaker: #bee2ff;
/* Weakest text color for primary actions or messages (blue.10). */
$kui-color-text-primary-weakest: #eefaff;
/* Text color for success elements (green.60). */
$kui-color-text-success: #007d60;
/* Strong text color for success elements (green.70). */
$kui-color-text-success-strong: #005944;
/* Stronger text color for success elements (green.80). */
$kui-color-text-success-stronger: #004737;
/* Stronger text color for success elements (green.90). */
$kui-color-text-success-strongest: #003629;
/* Weak text color for success elements (green.40). */
$kui-color-text-success-weak: #00d6a4;
/* Weaker text color for success elements (green.20). */
$kui-color-text-success-weaker: #b5ffee;
/* Weakest text color for success elements (green.10). */
$kui-color-text-success-weakest: #ecfffb;
/* Text color for warning elements (yellow.60). */
$kui-color-text-warning: #995c00;
/* Strong text color for warning elements (yellow.70). */
$kui-color-text-warning-strong: #804400;
/* Stronger text color for warning elements (yellow.80). */
$kui-color-text-warning-stronger: #662d00;
/* Strongest text color for warning elements (yellow.90). */
$kui-color-text-warning-strongest: #4d1b00;
/* Weak text color for warning elements (yellow.40). */
$kui-color-text-warning-weak: #ffc400;
/* Weaker text color for warning elements (yellow.20). */
$kui-color-text-warning-weaker: #fff296;
/* Weakest text color for warning elements (yellow.10). */
$kui-color-text-warning-weakest: #fffce0;
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
/* 700: The bold font weight. */
$kui-font-weight-bold: 700;
/* 500: The medium font weight. */
$kui-font-weight-medium: 500;
/* 400: The normal font weight. */
$kui-font-weight-regular: 400;
/* 600: The semibold font weight. */
$kui-font-weight-semibold: 600;
/* Danger color for icons. */
$kui-icon-color-danger: #f50045;
/* Neutral color for icons. */
$kui-icon-color-neutral: #828a9e;
/* Primary color for icons. */
$kui-icon-color-primary: #306fff;
/* Success color for icons. */
$kui-icon-color-success: #00a17b;
/* Warning color for icons. */
$kui-icon-color-warning: #ffc400;
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
/* Background color for the CONNECT method (purple.10). */
$kui-method-color-background-connect: #f1f0ff;
/* Background color for the DELETE method (red.10). */
$kui-method-color-background-delete: #ffe5e5;
/* Background color for the GET method (blue.10). */
$kui-method-color-background-get: #eefaff;
/* Background color for the HEAD method (gray.70). */
$kui-method-color-background-head: #52596e;
/* Background color for the OPTIONS method (gray.20). */
$kui-method-color-background-options: #e0e4ea;
/* Background color for the PATCH method (aqua.10). */
$kui-method-color-background-patch: #ecfcff;
/* Background color for the POST method (green.10). */
$kui-method-color-background-post: #ecfffb;
/* Background color for the PUT method (yellow.10). */
$kui-method-color-background-put: #fffce0;
/* Background color for the TRACE method (pink.10). */
$kui-method-color-background-trace: #fff0f7;
/* Text color for the CONNECT method (purple.60). */
$kui-method-color-text-connect: #6f28ff;
/* Strong text color for the CONNECT method (purple.70). */
$kui-method-color-text-connect-strong: #5e00f5;
/* Text color for the DELETE method (red.60). */
$kui-method-color-text-delete: #d60027;
/* Strong text color for the DELETE method (red.70). */
$kui-method-color-text-delete-strong: #ad000e;
/* Text color for the GET method (blue.60). */
$kui-method-color-text-get: #0044f4;
/* Strong text color for the GET method (blue.70). */
$kui-method-color-text-get-strong: #0030cc;
/* Text color for the HEAD method (gray.20). */
$kui-method-color-text-head: #e0e4ea;
/* Strong text color for the HEAD method (gray.40). */
$kui-method-color-text-head-strong: #afb7c5;
/* Text color for the OPTIONS method (gray.70). */
$kui-method-color-text-options: #52596e;
/* Strong text color for the OPTIONS method (gray.80). */
$kui-method-color-text-options-strong: #3a3f51;
/* Text color for the PATCH method (aqua.60). */
$kui-method-color-text-patch: #00819d;
/* Strong text color for the PATCH method (aqua.70). */
$kui-method-color-text-patch-strong: #00647a;
/* Text color for the POST method (green.60). */
$kui-method-color-text-post: #007d60;
/* Strong text color for the POST method (green.70). */
$kui-method-color-text-post-strong: #005944;
/* Text color for the PUT method (yellow.60). */
$kui-method-color-text-put: #995c00;
/* Strong text color for the PUT method (yellow.70). */
$kui-method-color-text-put-strong: #804400;
/* Text color for the TRACE method (pink.60). */
$kui-method-color-text-trace: #d60067;
/* Strong text color for the TRACE method (pink.70). */
$kui-method-color-text-trace-strong: #ad0053;
/* blue.100 */
$kui-navigation-color-background: #000933;
/* The background color of a selected navigation item. */
$kui-navigation-color-background-selected: rgba(255, 255, 255, 0.12);
/* rgba(255, 255, 255, 0.12) */
$kui-navigation-color-border: rgba(255, 255, 255, 0.12);
/* The border color for a selected child navigation item. */
$kui-navigation-color-border-child: #00fabe;
/* The color of the navigation section divider. */
$kui-navigation-color-border-divider: rgba(255, 255, 255, 0.24);
/* Navigation link and icon color. */
$kui-navigation-color-text: #bee2ff;
/* Navigation link and icon focus-visible color. */
$kui-navigation-color-text-focus: #ffffff;
/* Navigation link and icon hover color. */
$kui-navigation-color-text-hover: #eefaff;
/* Navigation link and icon selected color. */
$kui-navigation-color-text-selected: #00fabe;
/* The box-shadow for a focus-visible navigation link. */
$kui-navigation-shadow-border: 0 0 0 1px rgba(255, 255, 255, 0.12) inset;
/* The left box-shadow for an active child navigation link. */
$kui-navigation-shadow-border-child: 4px 0 0 0 #00fabe inset;
/* Navigation link focus-visible box-shadow. */
$kui-navigation-shadow-focus: 0 0 0 1px rgba(255, 255, 255, 0.60) inset;
/* 0px 4px 20px 0px rgba(0, 0, 0, 0.08) */
$kui-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.08);
/* 0px 0px 0px 1px gray.20 inset */
$kui-shadow-border: 0px 0px 0px 1px #e0e4ea inset;
/* 0px 0px 0px 1px red.60 inset */
$kui-shadow-border-danger: 0px 0px 0px 1px #d60027 inset;
/* 0px 0px 0px 1px red.70 inset */
$kui-shadow-border-danger-strong: 0px 0px 0px 1px #ad000e inset;
/* 0px 0px 0px 1px gray.20 inset */
$kui-shadow-border-disabled: 0px 0px 0px 1px #e0e4ea inset;
/* 0px 0px 0px 1px blue.60 inset */
$kui-shadow-border-primary: 0px 0px 0px 1px #0044f4 inset;
/* 0px 0px 0px 1px blue.90 inset */
$kui-shadow-border-primary-strongest: 0px 0px 0px 1px #001466 inset;
/* 0px 0px 0px 1px blue.40 inset */
$kui-shadow-border-primary-weak: 0px 0px 0px 1px #5f9aff inset;
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
/* Color representing response status code 100 (blue.20). */
$kui-status-color-100: #bee2ff;
/* Color representing response status code 101 (blue.30). */
$kui-status-color-101: #8fc1ff;
/* Color representing response status code 102 (blue.40). */
$kui-status-color-102: #5f9aff;
/* Color representing response status code 103 (blue.50). */
$kui-status-color-103: #306fff;
/* Color representing response status code 200 (green.20). */
$kui-status-color-200: #b5ffee;
/* Color representing response status code 201 (green.30). */
$kui-status-color-201: #00fabe;
/* Color representing response status code 202 (green.40). */
$kui-status-color-202: #00d6a4;
/* Color representing response status code 203 (green.50). */
$kui-status-color-203: #00a17b;
/* Color representing response status code 204 (green.60). */
$kui-status-color-204: #007d60;
/* Color representing response status code 205 (green.70). */
$kui-status-color-205: #005944;
/* Color representing response status code 206 (green.20). */
$kui-status-color-206: #b5ffee;
/* Color representing response status code 207 (green.30). */
$kui-status-color-207: #00fabe;
/* Color representing response status code 208 (green.40). */
$kui-status-color-208: #b5ffee;
/* Color representing response status code 226 (green.50). */
$kui-status-color-226: #00a17b;
/* Color representing response status code 100 (yellow.20). */
$kui-status-color-300: #fff296;
/* Color representing response status code 101 (yellow.30). */
$kui-status-color-301: #ffe04b;
/* Color representing response status code 102 (yellow.40). */
$kui-status-color-302: #ffc400;
/* Color representing response status code 103 (yellow.50). */
$kui-status-color-303: #b37600;
/* Color representing response status code 103 (yellow.60). */
$kui-status-color-304: #995c00;
/* Color representing response status code 103 (yellow.70). */
$kui-status-color-305: #804400;
/* Color representing response status code 103 (yellow.20). */
$kui-status-color-307: #fff296;
/* Color representing response status code 103 (yellow.30). */
$kui-status-color-308: #ffe04b;
/* Color representing response status code 400 (orange.20). */
$kui-status-color-400: #ffc2b3;
/* Color representing response status code 401 (orange.30). */
$kui-status-color-401: #ff9877;
/* Color representing response status code 402 (orange.40). */
$kui-status-color-402: #ff723c;
/* Color representing response status code 403 (orange.50). */
$kui-status-color-403: #f75008;
/* Color representing response status code 404 (orange.60). */
$kui-status-color-404: #d13500;
/* Color representing response status code 405 (orange.70). */
$kui-status-color-405: #a31f00;
/* Color representing response status code 406 (orange.20). */
$kui-status-color-406: #ffc2b3;
/* Color representing response status code 407 (orange.30). */
$kui-status-color-407: #ff9877;
/* Color representing response status code 408 (orange.40). */
$kui-status-color-408: #ff723c;
/* Color representing response status code 409 (orange.50). */
$kui-status-color-409: #f75008;
/* Color representing response status code 410 (orange.60). */
$kui-status-color-410: #d13500;
/* Color representing response status code 411 (orange.70). */
$kui-status-color-411: #a31f00;
/* Color representing response status code 412 (orange.20). */
$kui-status-color-412: #ffc2b3;
/* Color representing response status code 413 (orange.30). */
$kui-status-color-413: #ff9877;
/* Color representing response status code 414 (orange.40). */
$kui-status-color-414: #ff723c;
/* Color representing response status code 415 (orange.50). */
$kui-status-color-415: #f75008;
/* Color representing response status code 416 (orange.60). */
$kui-status-color-416: #d13500;
/* Color representing response status code 417 (orange.70). */
$kui-status-color-417: #a31f00;
/* Color representing response status code 418 (orange.20). */
$kui-status-color-418: #ffc2b3;
/* Color representing response status code 421 (orange.30). */
$kui-status-color-421: #ff9877;
/* Color representing response status code 422 (orange.40). */
$kui-status-color-422: #ff723c;
/* Color representing response status code 423 (orange.50). */
$kui-status-color-423: #f75008;
/* Color representing response status code 424 (orange.60). */
$kui-status-color-424: #d13500;
/* Color representing response status code 425 (orange.70). */
$kui-status-color-425: #a31f00;
/* Color representing response status code 426 (orange.20). */
$kui-status-color-426: #ffc2b3;
/* Color representing response status code 428 (orange.30). */
$kui-status-color-428: #ff9877;
/* Color representing response status code 429 (orange.40). */
$kui-status-color-429: #ff723c;
/* Color representing response status code 431 (orange.50). */
$kui-status-color-431: #f75008;
/* Color representing response status code 451 (orange.60). */
$kui-status-color-451: #d13500;
/* Color representing response status code 500 (red.20). */
$kui-status-color-500: #ffabab;
/* Color representing response status code 501 (red.30). */
$kui-status-color-501: #ff7272;
/* Color representing response status code 502 (red.40). */
$kui-status-color-502: #ff3954;
/* Color representing response status code 503 (red.50). */
$kui-status-color-503: #f50045;
/* Color representing response status code 504 (red.60). */
$kui-status-color-504: #d60027;
/* Color representing response status code 505 (red.70). */
$kui-status-color-505: #ad000e;
/* Color representing response status code 506 (red.20). */
$kui-status-color-506: #ffabab;
/* Color representing response status code 507 (red.30). */
$kui-status-color-507: #ff7272;
/* Color representing response status code 508 (red.40). */
$kui-status-color-508: #ff3954;
/* Color representing response status code 510 (red.50). */
$kui-status-color-510: #f50045;
/* Color representing response status code 511 (red.60). */
$kui-status-color-511: #d60027;
/* Color for unknown response status codes in the 100-199 range (blue.10). */
$kui-status-color-1na: #eefaff;
/* Color for unknown response status codes in the 200-299 range (green.10). */
$kui-status-color-2na: #ecfffb;
/* Color for unknown response status codes in the 300-399 range (yellow.10). */
$kui-status-color-3na: #fffce0;
/* Color for unknown response status codes in the 400-499 range (orange.10). */
$kui-status-color-4na: #fff1ef;
/* Color for unknown response status codes in the 500-599 range (red.10). */
$kui-status-color-5na: #ffe5e5;
/* Color for a group of response status codes in the 100-199 range (blue.40). */
$kui-status-color-100s: #5f9aff;
/* Color for a group of response status codes in the 200-299 range (green.40). */
$kui-status-color-200s: #00d6a4;
/* Color for a group of response status codes in the 300-399 range (yellow.40). */
$kui-status-color-300s: #ffc400;
/* Color for a group of response status codes in the 400-499 range (orange.40). */
$kui-status-color-400s: #ff723c;
/* Color for a group of response status codes in the 500-599 range (red.40). */
$kui-status-color-500s: #ff3954;
/* Background color for http status 100 elements (blue.10). */
$kui-status-color-background-100: #eefaff;
/* Background color for http status 200 elements (green.10). */
$kui-status-color-background-200: #ecfffb;
/* Background color for http status 300 elements (yellow.10). */
$kui-status-color-background-300: #fffce0;
/* Background color for http status 400 elements (orange.10). */
$kui-status-color-background-400: #fff1ef;
/* Background color for http status 500 elements (red.10). */
$kui-status-color-background-500: #ffe5e5;
/* Text color for http status 100 elements (blue.60). */
$kui-status-color-text-100: #0044f4;
/* Text color for http status 200 elements (green.60). */
$kui-status-color-text-200: #007d60;
/* Text color for http status 300 elements (yellow.60). */
$kui-status-color-text-300: #995c00;
/* Text color for http status 400 elements (orange.60). */
$kui-status-color-text-400: #d13500;
/* Text color for http status 500 elements (red.60). */
$kui-status-color-text-500: #d60027;
```

</details>

### SCSS Map

<details>

<summary>Click to view exported SCSS map</summary>

```scss
$tokens-map: (
  /* Default background color for containers (white). */
  'kui-color-background': #ffffff,
  /* Accent background color for emphasis on non-primary UI. Distinct from the primary action color, used to add touches of the theme accent color across themes. */
  'kui-color-background-accent': #0044f4,
  /* Background color for danger actions or messages (red.60). */
  'kui-color-background-danger': #d60027,
  /* Strong background color for danger actions or messages (red.70). */
  'kui-color-background-danger-strong': #ad000e,
  /* Stronger background color for danger actions or messages (red.80). */
  'kui-color-background-danger-stronger': #850000,
  /* Strongest background color for danger actions or messages (red.90). */
  'kui-color-background-danger-strongest': #5c0000,
  /* Weak background color for danger actions or messages (red.40). */
  'kui-color-background-danger-weak': #ff3954,
  /* Weaker background color for danger actions or messages (red.20). */
  'kui-color-background-danger-weaker': #ffabab,
  /* Weakest background color for danger actions or messages (red.10). */
  'kui-color-background-danger-weakest': #ffe5e5,
  /* Weakest background color for decorative purposes (aqua.10). */
  'kui-color-background-decorative-aqua-weakest': #ecfcff,
  /* Background color for decorative purposes (purple.60). */
  'kui-color-background-decorative-purple': #6f28ff,
  /* Weakest background color for decorative purposes (purple.10). */
  'kui-color-background-decorative-purple-weakest': #f1f0ff,
  /* Background color for disabled elements (gray.20). */
  'kui-color-background-disabled': #e0e4ea,
  /* Background color for info elements (blue.60). */
  'kui-color-background-info': #0044f4,
  /* Strong background color for info elements (blue.70). */
  'kui-color-background-info-strong': #0030cc,
  /* Stronger background color for info elements (blue.80). */
  'kui-color-background-info-stronger': #002099,
  /* Strongest background color for info elements (blue.90). */
  'kui-color-background-info-strongest': #001466,
  /* Weak background color for info elements (blue.40). */
  'kui-color-background-info-weak': #5f9aff,
  /* Weaker background color for info elements (blue.20). */
  'kui-color-background-info-weaker': #bee2ff,
  /* Weakest background color for info elements (blue.10). */
  'kui-color-background-info-weakest': #eefaff,
  /* Inverse background color for containers (blue.100) */
  'kui-color-background-inverse': #000933,
  /* Background color for neutral elements (gray.60). */
  'kui-color-background-neutral': #6c7489,
  /* Strong background color for neutral elements (gray.70). */
  'kui-color-background-neutral-strong': #52596e,
  /* Stronger background color for neutral elements (gray.80). */
  'kui-color-background-neutral-stronger': #3a3f51,
  /* Strongest background color for neutral elements (gray.90). */
  'kui-color-background-neutral-strongest': #232633,
  /* Weak background color for neutral elements (gray.40). */
  'kui-color-background-neutral-weak': #afb7c5,
  /* Weaker background color for neutral elements (gray.20). */
  'kui-color-background-neutral-weaker': #e0e4ea,
  /* Weakest background color for neutral elements (gray.10). */
  'kui-color-background-neutral-weakest': #f9fafb,
  /* Overlay background color (rgba(0, 9, 51, 0.6)) */
  'kui-color-background-overlay': rgba(0, 9, 51, 0.6),
  /* Background color for primary actions or messages (blue.60). */
  'kui-color-background-primary': #0044f4,
  /* Strong background color for primary actions or messages (blue.70). */
  'kui-color-background-primary-strong': #0030cc,
  /* Stronger background color for primary actions or messages (blue.80). */
  'kui-color-background-primary-stronger': #002099,
  /* Strongest background color for primary actions or messages (blue.90). */
  'kui-color-background-primary-strongest': #001466,
  /* Weak background color for primary actions or messages (blue.40). */
  'kui-color-background-primary-weak': #5f9aff,
  /* Weaker background color for primary actions or messages (blue.20). */
  'kui-color-background-primary-weaker': #bee2ff,
  /* Weakest background color for primary actions or messages (blue.10) */
  'kui-color-background-primary-weakest': #eefaff,
  /* Background color for success elements (green.60). */
  'kui-color-background-success': #007d60,
  /* Strong background color for success elements (green.70). */
  'kui-color-background-success-strong': #005944,
  /* Stronger background color for success elements (green.80). */
  'kui-color-background-success-stronger': #004737,
  /* Strongest background color for success elements (green.90). */
  'kui-color-background-success-strongest': #003629,
  /* Weak background color for success elements (green.40). */
  'kui-color-background-success-weak': #00d6a4,
  /* Weaker background color for success elements (green.20). */
  'kui-color-background-success-weaker': #b5ffee,
  /* Weakest background color for success elements (green.10). */
  'kui-color-background-success-weakest': #ecfffb,
  /* Transparent background color (transparent). */
  'kui-color-background-transparent': rgba(0, 0, 0, 0),
  /* Background color for warning elements (yellow.60). */
  'kui-color-background-warning': #995c00,
  /* Strong background color for warning elements (yellow.70). */
  'kui-color-background-warning-strong': #804400,
  /* Stronger background color for warning elements (yellow.80). */
  'kui-color-background-warning-stronger': #662d00,
  /* Strongest background color for warning elements (yellow.90). */
  'kui-color-background-warning-strongest': #4d1b00,
  /* Weak background color for warning elements (yellow.40). */
  'kui-color-background-warning-weak': #ffc400,
  /* Weaker background color for warning elements (yellow.20). */
  'kui-color-background-warning-weaker': #fff296,
  /* Weakest background color for warning elements (yellow.10). */
  'kui-color-background-warning-weakest': #fffce0,
  /* Default border color for containers (gray.20). */
  'kui-color-border': #e0e4ea,
  /* Accent border color for emphasis on non-primary UI. Distinct from the primary action color, used to add touches of the theme accent color across themes. */
  'kui-color-border-accent': #0044f4,
  /* Border color for danger actions or messages (red.60). */
  'kui-color-border-danger': #d60027,
  /* Strong border color for danger actions or messages (red.70). */
  'kui-color-border-danger-strong': #ad000e,
  /* Stronger border color for danger actions or messages (red.80). */
  'kui-color-border-danger-stronger': #850000,
  /* Strongest border color for danger actions or messages (red.90). */
  'kui-color-border-danger-strongest': #5c0000,
  /* Weak border color for danger actions or messages (red.40). */
  'kui-color-border-danger-weak': #ff3954,
  /* Weaker border color for danger actions or messages (red.20). */
  'kui-color-border-danger-weaker': #ffabab,
  /* Weakest border color for danger actions or messages (red.10). */
  'kui-color-border-danger-weakest': #ffe5e5,
  /* Border color for decorative purposes (purple.60). */
  'kui-color-border-decorative-purple': #6f28ff,
  /* Border color for disabled elements (gray.20). */
  'kui-color-border-disabled': #e0e4ea,
  /* Inverse border color (rgba(255, 255, 255, 0.2)). */
  'kui-color-border-inverse': rgba(255, 255, 255, 0.2),
  /* Border color for neutral elements (gray.60) */
  'kui-color-border-neutral': #6c7489,
  /* Strong border color for neutral elements (gray.70) */
  'kui-color-border-neutral-strong': #52596e,
  /* Stronger border color for neutral elements (gray.80) */
  'kui-color-border-neutral-stronger': #3a3f51,
  /* Strongest border color for neutral elements (gray.90) */
  'kui-color-border-neutral-strongest': #232633,
  /* Weak border color for neutral elements (gray.40) */
  'kui-color-border-neutral-weak': #afb7c5,
  /* Weaker border color for neutral elements (gray.20) */
  'kui-color-border-neutral-weaker': #e0e4ea,
  /* Weakest border color for neutral elements (gray.10) */
  'kui-color-border-neutral-weakest': #f9fafb,
  /* Border color for primary actions or messages (blue.60). */
  'kui-color-border-primary': #0044f4,
  /* Strong border color for primary actions or messages (blue.70). */
  'kui-color-border-primary-strong': #0030cc,
  /* Stronger border color for primary actions or messages (blue.80). */
  'kui-color-border-primary-stronger': #002099,
  /* Strongest border color for primary actions or messages (blue.90). */
  'kui-color-border-primary-strongest': #001466,
  /* Weak border color for primary actions or messages (blue.40). */
  'kui-color-border-primary-weak': #5f9aff,
  /* Weaker border color for primary actions or messages (blue.20). */
  'kui-color-border-primary-weaker': #bee2ff,
  /* Weakest border color for primary actions or messages (blue.10). */
  'kui-color-border-primary-weakest': #eefaff,
  /* Transparent border color (transparent). */
  'kui-color-border-transparent': rgba(0, 0, 0, 0),
  /* Default text color (blue.100). */
  'kui-color-text': #000933,
  /* Accent text color for emphasis on non-primary UI. Distinct from the primary action color, used to add touches of the theme accent color across themes. */
  'kui-color-text-accent': #0044f4,
  /* Text color for danger actions or messages (red.60). */
  'kui-color-text-danger': #d60027,
  /* Strong text color for danger actions or messages (red.70). */
  'kui-color-text-danger-strong': #ad000e,
  /* Stronger text color for danger actions or messages (red.80). */
  'kui-color-text-danger-stronger': #850000,
  /* Strongest text color for danger actions or messages (red.90). */
  'kui-color-text-danger-strongest': #5c0000,
  /* Weak text color for danger actions or messages (red.40). */
  'kui-color-text-danger-weak': #ff3954,
  /* Weaker text color for danger actions or messages (red.20). */
  'kui-color-text-danger-weaker': #ffabab,
  /* Weakest text color for danger actions or messages (red.10). */
  'kui-color-text-danger-weakest': #ffe5e5,
  /* Text color for decorative purposes (aqua.50). */
  'kui-color-text-decorative-aqua': #00abd2,
  /* Text color for decorative purposes (pink.60). */
  'kui-color-text-decorative-pink': #d60067,
  /* Text color for decorative purposes (purple.60). */
  'kui-color-text-decorative-purple': #6f28ff,
  /* Strong text color for decorative purposes (purple.70). */
  'kui-color-text-decorative-purple-strong': #5e00f5,
  /* Text color for disabled elements (gray.40). */
  'kui-color-text-disabled': #afb7c5,
  /* Text color for info elements (blue.60). */
  'kui-color-text-info': #0044f4,
  /* Strong text color for info elements (blue.70). */
  'kui-color-text-info-strong': #0030cc,
  /* Stronger text color for info elements (blue.80). */
  'kui-color-text-info-stronger': #002099,
  /* Strongest text color for info elements (blue.90). */
  'kui-color-text-info-strongest': #001466,
  /* Weak text color for info elements (blue.40). */
  'kui-color-text-info-weak': #5f9aff,
  /* Weaker text color for info elements (blue.20). */
  'kui-color-text-info-weaker': #bee2ff,
  /* Weakest text color for info elements (blue.10). */
  'kui-color-text-info-weakest': #eefaff,
  /* Inverse text color (white). */
  'kui-color-text-inverse': #ffffff,
  /* Text color for neutral elements (gray.60). */
  'kui-color-text-neutral': #6c7489,
  /* Strong text color for neutral elements (gray.70). */
  'kui-color-text-neutral-strong': #52596e,
  /* Stronger text color for neutral elements (gray.80). */
  'kui-color-text-neutral-stronger': #3a3f51,
  /* Strongest text color for neutral elements (gray.90). */
  'kui-color-text-neutral-strongest': #232633,
  /* Weak text color for neutral elements (gray.40). */
  'kui-color-text-neutral-weak': #afb7c5,
  /* Weaker text color for neutral elements (gray.20). */
  'kui-color-text-neutral-weaker': #e0e4ea,
  /* Weakest text color for neutral elements (gray.10). */
  'kui-color-text-neutral-weakest': #f9fafb,
  /* Text color for primary actions or messages (blue.60). */
  'kui-color-text-primary': #0044f4,
  /* Strong text color for primary actions or messages (blue.70). */
  'kui-color-text-primary-strong': #0030cc,
  /* Stronger text color for primary actions or messages (blue.80). */
  'kui-color-text-primary-stronger': #002099,
  /* Strongest text color for primary actions or messages (blue.90). */
  'kui-color-text-primary-strongest': #001466,
  /* Weak text color for primary actions or messages (blue.40). */
  'kui-color-text-primary-weak': #5f9aff,
  /* Weaker text color for primary actions or messages (blue.20). */
  'kui-color-text-primary-weaker': #bee2ff,
  /* Weakest text color for primary actions or messages (blue.10). */
  'kui-color-text-primary-weakest': #eefaff,
  /* Text color for success elements (green.60). */
  'kui-color-text-success': #007d60,
  /* Strong text color for success elements (green.70). */
  'kui-color-text-success-strong': #005944,
  /* Stronger text color for success elements (green.80). */
  'kui-color-text-success-stronger': #004737,
  /* Stronger text color for success elements (green.90). */
  'kui-color-text-success-strongest': #003629,
  /* Weak text color for success elements (green.40). */
  'kui-color-text-success-weak': #00d6a4,
  /* Weaker text color for success elements (green.20). */
  'kui-color-text-success-weaker': #b5ffee,
  /* Weakest text color for success elements (green.10). */
  'kui-color-text-success-weakest': #ecfffb,
  /* Text color for warning elements (yellow.60). */
  'kui-color-text-warning': #995c00,
  /* Strong text color for warning elements (yellow.70). */
  'kui-color-text-warning-strong': #804400,
  /* Stronger text color for warning elements (yellow.80). */
  'kui-color-text-warning-stronger': #662d00,
  /* Strongest text color for warning elements (yellow.90). */
  'kui-color-text-warning-strongest': #4d1b00,
  /* Weak text color for warning elements (yellow.40). */
  'kui-color-text-warning-weak': #ffc400,
  /* Weaker text color for warning elements (yellow.20). */
  'kui-color-text-warning-weaker': #fff296,
  /* Weakest text color for warning elements (yellow.10). */
  'kui-color-text-warning-weakest': #fffce0,
  /* Default transition timing */
  'kui-animation-duration-20': 0.2s,
  /* 0px border radius. */
  'kui-border-radius-0': 0px,
  /* 2px border radius. */
  'kui-border-radius-10': 2px,
  /* 4px border radius. */
  'kui-border-radius-20': 4px,
  /* 6px border radius. */
  'kui-border-radius-30': 6px,
  /* 8px border radius. */
  'kui-border-radius-40': 8px,
  /* 10px border radius. */
  'kui-border-radius-50': 10px,
  /* 50% border radius used to create circles. */
  'kui-border-radius-circle': 50%,
  /* 100px border radius used to create pill shapes. */
  'kui-border-radius-round': 100px,
  /* 0px border width. */
  'kui-border-width-0': 0px,
  /* 1px border width. */
  'kui-border-width-10': 1px,
  /* 2px border width. */
  'kui-border-width-20': 2px,
  /* 4px border width. */
  'kui-border-width-30': 4px,
  /* Used for larger mobile screens. Any viewport width under this value is considered mobile. */
  'kui-breakpoint-mobile': 640px,
  /* Used for tablet screens. */
  'kui-breakpoint-phablet': 768px,
  /* Used for larger tablet screens. Any viewport width less than this value will likely show a mobile layout. Any viewport width this value and greater will likely show a desktop layout. */
  'kui-breakpoint-tablet': 1024px,
  /* Used for standard desktop screens. */
  'kui-breakpoint-laptop': 1280px,
  /* Used for larger desktop screens. */
  'kui-breakpoint-desktop': 1536px,
  /* The standard monospace text font family. Typically used for code blocks, inline code, and copyable text. */
  'kui-font-family-code': 'JetBrains Mono', Consolas, monospace,
  /* The standard heading text font family. */
  'kui-font-family-heading': 'Inter', Roboto, Helvetica, sans-serif,
  /* The standard text font family. */
  'kui-font-family-text': 'Inter', Roboto, Helvetica, sans-serif,
  'kui-font-size-10': 10px,
  'kui-font-size-20': 12px,
  'kui-font-size-30': 14px,
  'kui-font-size-40': 16px,
  'kui-font-size-50': 18px,
  'kui-font-size-60': 20px,
  'kui-font-size-70': 24px,
  'kui-font-size-80': 32px,
  'kui-font-size-90': 40px,
  'kui-font-size-100': 48px,
  /* 700: The bold font weight. */
  'kui-font-weight-bold': 700,
  /* 500: The medium font weight. */
  'kui-font-weight-medium': 500,
  /* 400: The normal font weight. */
  'kui-font-weight-regular': 400,
  /* 600: The semibold font weight. */
  'kui-font-weight-semibold': 600,
  /* Danger color for icons. */
  'kui-icon-color-danger': #f50045,
  /* Neutral color for icons. */
  'kui-icon-color-neutral': #828a9e,
  /* Primary color for icons. */
  'kui-icon-color-primary': #306fff,
  /* Success color for icons. */
  'kui-icon-color-success': #00a17b,
  /* Warning color for icons. */
  'kui-icon-color-warning': #ffc400,
  /* 10px icon size. */
  'kui-icon-size-10': 10px,
  /* 12px icon size. */
  'kui-icon-size-20': 12px,
  /* 16px icon size. */
  'kui-icon-size-30': 16px,
  /* 20px icon size. */
  'kui-icon-size-40': 20px,
  /* 24px icon size (default). */
  'kui-icon-size-50': 24px,
  /* 32px icon size. */
  'kui-icon-size-60': 32px,
  /* 40px icon size. */
  'kui-icon-size-70': 40px,
  /* 48px icon size. */
  'kui-icon-size-80': 48px,
  /* Alias for letter-spacing-normal */
  'kui-letter-spacing-0': normal,
  /* -0.12px */
  'kui-letter-spacing-minus-10': -0.12px,
  /* -0.24px */
  'kui-letter-spacing-minus-20': -0.24px,
  /* -0.32px */
  'kui-letter-spacing-minus-30': -0.32px,
  /* -0.4px */
  'kui-letter-spacing-minus-40': -0.4px,
  /* -0.48px */
  'kui-letter-spacing-minus-50': -0.48px,
  /* normal */
  'kui-letter-spacing-normal': normal,
  /* 12px */
  'kui-line-height-10': 12px,
  /* 16px */
  'kui-line-height-20': 16px,
  /* 20px */
  'kui-line-height-30': 20px,
  /* 24px */
  'kui-line-height-40': 24px,
  /* 28px */
  'kui-line-height-50': 28px,
  /* 32px */
  'kui-line-height-60': 32px,
  /* 36px */
  'kui-line-height-70': 36px,
  /* 40px */
  'kui-line-height-80': 40px,
  /* 48px */
  'kui-line-height-90': 48px,
  /* 56px */
  'kui-line-height-100': 56px,
  /* Background color for the CONNECT method (purple.10). */
  'kui-method-color-background-connect': #f1f0ff,
  /* Background color for the DELETE method (red.10). */
  'kui-method-color-background-delete': #ffe5e5,
  /* Background color for the GET method (blue.10). */
  'kui-method-color-background-get': #eefaff,
  /* Background color for the HEAD method (gray.70). */
  'kui-method-color-background-head': #52596e,
  /* Background color for the OPTIONS method (gray.20). */
  'kui-method-color-background-options': #e0e4ea,
  /* Background color for the PATCH method (aqua.10). */
  'kui-method-color-background-patch': #ecfcff,
  /* Background color for the POST method (green.10). */
  'kui-method-color-background-post': #ecfffb,
  /* Background color for the PUT method (yellow.10). */
  'kui-method-color-background-put': #fffce0,
  /* Background color for the TRACE method (pink.10). */
  'kui-method-color-background-trace': #fff0f7,
  /* Text color for the CONNECT method (purple.60). */
  'kui-method-color-text-connect': #6f28ff,
  /* Strong text color for the CONNECT method (purple.70). */
  'kui-method-color-text-connect-strong': #5e00f5,
  /* Text color for the DELETE method (red.60). */
  'kui-method-color-text-delete': #d60027,
  /* Strong text color for the DELETE method (red.70). */
  'kui-method-color-text-delete-strong': #ad000e,
  /* Text color for the GET method (blue.60). */
  'kui-method-color-text-get': #0044f4,
  /* Strong text color for the GET method (blue.70). */
  'kui-method-color-text-get-strong': #0030cc,
  /* Text color for the HEAD method (gray.20). */
  'kui-method-color-text-head': #e0e4ea,
  /* Strong text color for the HEAD method (gray.40). */
  'kui-method-color-text-head-strong': #afb7c5,
  /* Text color for the OPTIONS method (gray.70). */
  'kui-method-color-text-options': #52596e,
  /* Strong text color for the OPTIONS method (gray.80). */
  'kui-method-color-text-options-strong': #3a3f51,
  /* Text color for the PATCH method (aqua.60). */
  'kui-method-color-text-patch': #00819d,
  /* Strong text color for the PATCH method (aqua.70). */
  'kui-method-color-text-patch-strong': #00647a,
  /* Text color for the POST method (green.60). */
  'kui-method-color-text-post': #007d60,
  /* Strong text color for the POST method (green.70). */
  'kui-method-color-text-post-strong': #005944,
  /* Text color for the PUT method (yellow.60). */
  'kui-method-color-text-put': #995c00,
  /* Strong text color for the PUT method (yellow.70). */
  'kui-method-color-text-put-strong': #804400,
  /* Text color for the TRACE method (pink.60). */
  'kui-method-color-text-trace': #d60067,
  /* Strong text color for the TRACE method (pink.70). */
  'kui-method-color-text-trace-strong': #ad0053,
  /* blue.100 */
  'kui-navigation-color-background': #000933,
  /* The background color of a selected navigation item. */
  'kui-navigation-color-background-selected': rgba(255, 255, 255, 0.12),
  /* rgba(255, 255, 255, 0.12) */
  'kui-navigation-color-border': rgba(255, 255, 255, 0.12),
  /* The border color for a selected child navigation item. */
  'kui-navigation-color-border-child': #00fabe,
  /* The color of the navigation section divider. */
  'kui-navigation-color-border-divider': rgba(255, 255, 255, 0.24),
  /* Navigation link and icon color. */
  'kui-navigation-color-text': #bee2ff,
  /* Navigation link and icon focus-visible color. */
  'kui-navigation-color-text-focus': #ffffff,
  /* Navigation link and icon hover color. */
  'kui-navigation-color-text-hover': #eefaff,
  /* Navigation link and icon selected color. */
  'kui-navigation-color-text-selected': #00fabe,
  /* The box-shadow for a focus-visible navigation link. */
  'kui-navigation-shadow-border': 0 0 0 1px rgba(255, 255, 255, 0.12) inset,
  /* The left box-shadow for an active child navigation link. */
  'kui-navigation-shadow-border-child': 4px 0 0 0 #00fabe inset,
  /* Navigation link focus-visible box-shadow. */
  'kui-navigation-shadow-focus': 0 0 0 1px rgba(255, 255, 255, 0.60) inset,
  /* 0px 4px 20px 0px rgba(0, 0, 0, 0.08) */
  'kui-shadow': 0px 4px 20px 0px rgba(0, 0, 0, 0.08),
  /* 0px 0px 0px 1px gray.20 inset */
  'kui-shadow-border': 0px 0px 0px 1px #e0e4ea inset,
  /* 0px 0px 0px 1px red.60 inset */
  'kui-shadow-border-danger': 0px 0px 0px 1px #d60027 inset,
  /* 0px 0px 0px 1px red.70 inset */
  'kui-shadow-border-danger-strong': 0px 0px 0px 1px #ad000e inset,
  /* 0px 0px 0px 1px gray.20 inset */
  'kui-shadow-border-disabled': 0px 0px 0px 1px #e0e4ea inset,
  /* 0px 0px 0px 1px blue.60 inset */
  'kui-shadow-border-primary': 0px 0px 0px 1px #0044f4 inset,
  /* 0px 0px 0px 1px blue.90 inset */
  'kui-shadow-border-primary-strongest': 0px 0px 0px 1px #001466 inset,
  /* 0px 0px 0px 1px blue.40 inset */
  'kui-shadow-border-primary-weak': 0px 0px 0px 1px #5f9aff inset,
  /* 0px 0px 0px 4px rgba(0, 68, 244, 0.2) */
  'kui-shadow-focus': 0px 0px 0px 4px rgba(0, 68, 244, 0.2),
  /* 0px value for gaps, margin, or padding. */
  'kui-space-0': 0px,
  /* 2px value for gaps, margin, or padding. */
  'kui-space-10': 2px,
  /* 4px value for gaps, margin, or padding. */
  'kui-space-20': 4px,
  /* 6px value for gaps, margin, or padding. */
  'kui-space-30': 6px,
  /* 8px value for gaps, margin, or padding. */
  'kui-space-40': 8px,
  /* 12px value for gaps, margin, or padding. */
  'kui-space-50': 12px,
  /* 16px value for gaps, margin, or padding. */
  'kui-space-60': 16px,
  /* 20px value for gaps, margin, or padding. */
  'kui-space-70': 20px,
  /* 24px value for gaps, margin, or padding. */
  'kui-space-80': 24px,
  /* 32px value for gaps, margin, or padding. */
  'kui-space-90': 32px,
  /* 40px value for gaps, margin, or padding. */
  'kui-space-100': 40px,
  /* 48px value for gaps, margin, or padding. */
  'kui-space-110': 48px,
  /* 56px value for gaps, margin, or padding. */
  'kui-space-120': 56px,
  /* 64px value for gaps, margin, or padding. */
  'kui-space-130': 64px,
  /* 80px value for gaps, margin, or padding. */
  'kui-space-140': 80px,
  /* 96px value for gaps, margin, or padding. */
  'kui-space-150': 96px,
  /* auto */
  'kui-space-auto': auto,
  /* Color representing response status code 100 (blue.20). */
  'kui-status-color-100': #bee2ff,
  /* Color representing response status code 101 (blue.30). */
  'kui-status-color-101': #8fc1ff,
  /* Color representing response status code 102 (blue.40). */
  'kui-status-color-102': #5f9aff,
  /* Color representing response status code 103 (blue.50). */
  'kui-status-color-103': #306fff,
  /* Color representing response status code 200 (green.20). */
  'kui-status-color-200': #b5ffee,
  /* Color representing response status code 201 (green.30). */
  'kui-status-color-201': #00fabe,
  /* Color representing response status code 202 (green.40). */
  'kui-status-color-202': #00d6a4,
  /* Color representing response status code 203 (green.50). */
  'kui-status-color-203': #00a17b,
  /* Color representing response status code 204 (green.60). */
  'kui-status-color-204': #007d60,
  /* Color representing response status code 205 (green.70). */
  'kui-status-color-205': #005944,
  /* Color representing response status code 206 (green.20). */
  'kui-status-color-206': #b5ffee,
  /* Color representing response status code 207 (green.30). */
  'kui-status-color-207': #00fabe,
  /* Color representing response status code 208 (green.40). */
  'kui-status-color-208': #b5ffee,
  /* Color representing response status code 226 (green.50). */
  'kui-status-color-226': #00a17b,
  /* Color representing response status code 100 (yellow.20). */
  'kui-status-color-300': #fff296,
  /* Color representing response status code 101 (yellow.30). */
  'kui-status-color-301': #ffe04b,
  /* Color representing response status code 102 (yellow.40). */
  'kui-status-color-302': #ffc400,
  /* Color representing response status code 103 (yellow.50). */
  'kui-status-color-303': #b37600,
  /* Color representing response status code 103 (yellow.60). */
  'kui-status-color-304': #995c00,
  /* Color representing response status code 103 (yellow.70). */
  'kui-status-color-305': #804400,
  /* Color representing response status code 103 (yellow.20). */
  'kui-status-color-307': #fff296,
  /* Color representing response status code 103 (yellow.30). */
  'kui-status-color-308': #ffe04b,
  /* Color representing response status code 400 (orange.20). */
  'kui-status-color-400': #ffc2b3,
  /* Color representing response status code 401 (orange.30). */
  'kui-status-color-401': #ff9877,
  /* Color representing response status code 402 (orange.40). */
  'kui-status-color-402': #ff723c,
  /* Color representing response status code 403 (orange.50). */
  'kui-status-color-403': #f75008,
  /* Color representing response status code 404 (orange.60). */
  'kui-status-color-404': #d13500,
  /* Color representing response status code 405 (orange.70). */
  'kui-status-color-405': #a31f00,
  /* Color representing response status code 406 (orange.20). */
  'kui-status-color-406': #ffc2b3,
  /* Color representing response status code 407 (orange.30). */
  'kui-status-color-407': #ff9877,
  /* Color representing response status code 408 (orange.40). */
  'kui-status-color-408': #ff723c,
  /* Color representing response status code 409 (orange.50). */
  'kui-status-color-409': #f75008,
  /* Color representing response status code 410 (orange.60). */
  'kui-status-color-410': #d13500,
  /* Color representing response status code 411 (orange.70). */
  'kui-status-color-411': #a31f00,
  /* Color representing response status code 412 (orange.20). */
  'kui-status-color-412': #ffc2b3,
  /* Color representing response status code 413 (orange.30). */
  'kui-status-color-413': #ff9877,
  /* Color representing response status code 414 (orange.40). */
  'kui-status-color-414': #ff723c,
  /* Color representing response status code 415 (orange.50). */
  'kui-status-color-415': #f75008,
  /* Color representing response status code 416 (orange.60). */
  'kui-status-color-416': #d13500,
  /* Color representing response status code 417 (orange.70). */
  'kui-status-color-417': #a31f00,
  /* Color representing response status code 418 (orange.20). */
  'kui-status-color-418': #ffc2b3,
  /* Color representing response status code 421 (orange.30). */
  'kui-status-color-421': #ff9877,
  /* Color representing response status code 422 (orange.40). */
  'kui-status-color-422': #ff723c,
  /* Color representing response status code 423 (orange.50). */
  'kui-status-color-423': #f75008,
  /* Color representing response status code 424 (orange.60). */
  'kui-status-color-424': #d13500,
  /* Color representing response status code 425 (orange.70). */
  'kui-status-color-425': #a31f00,
  /* Color representing response status code 426 (orange.20). */
  'kui-status-color-426': #ffc2b3,
  /* Color representing response status code 428 (orange.30). */
  'kui-status-color-428': #ff9877,
  /* Color representing response status code 429 (orange.40). */
  'kui-status-color-429': #ff723c,
  /* Color representing response status code 431 (orange.50). */
  'kui-status-color-431': #f75008,
  /* Color representing response status code 451 (orange.60). */
  'kui-status-color-451': #d13500,
  /* Color representing response status code 500 (red.20). */
  'kui-status-color-500': #ffabab,
  /* Color representing response status code 501 (red.30). */
  'kui-status-color-501': #ff7272,
  /* Color representing response status code 502 (red.40). */
  'kui-status-color-502': #ff3954,
  /* Color representing response status code 503 (red.50). */
  'kui-status-color-503': #f50045,
  /* Color representing response status code 504 (red.60). */
  'kui-status-color-504': #d60027,
  /* Color representing response status code 505 (red.70). */
  'kui-status-color-505': #ad000e,
  /* Color representing response status code 506 (red.20). */
  'kui-status-color-506': #ffabab,
  /* Color representing response status code 507 (red.30). */
  'kui-status-color-507': #ff7272,
  /* Color representing response status code 508 (red.40). */
  'kui-status-color-508': #ff3954,
  /* Color representing response status code 510 (red.50). */
  'kui-status-color-510': #f50045,
  /* Color representing response status code 511 (red.60). */
  'kui-status-color-511': #d60027,
  /* Color for unknown response status codes in the 100-199 range (blue.10). */
  'kui-status-color-1na': #eefaff,
  /* Color for unknown response status codes in the 200-299 range (green.10). */
  'kui-status-color-2na': #ecfffb,
  /* Color for unknown response status codes in the 300-399 range (yellow.10). */
  'kui-status-color-3na': #fffce0,
  /* Color for unknown response status codes in the 400-499 range (orange.10). */
  'kui-status-color-4na': #fff1ef,
  /* Color for unknown response status codes in the 500-599 range (red.10). */
  'kui-status-color-5na': #ffe5e5,
  /* Color for a group of response status codes in the 100-199 range (blue.40). */
  'kui-status-color-100s': #5f9aff,
  /* Color for a group of response status codes in the 200-299 range (green.40). */
  'kui-status-color-200s': #00d6a4,
  /* Color for a group of response status codes in the 300-399 range (yellow.40). */
  'kui-status-color-300s': #ffc400,
  /* Color for a group of response status codes in the 400-499 range (orange.40). */
  'kui-status-color-400s': #ff723c,
  /* Color for a group of response status codes in the 500-599 range (red.40). */
  'kui-status-color-500s': #ff3954,
  /* Background color for http status 100 elements (blue.10). */
  'kui-status-color-background-100': #eefaff,
  /* Background color for http status 200 elements (green.10). */
  'kui-status-color-background-200': #ecfffb,
  /* Background color for http status 300 elements (yellow.10). */
  'kui-status-color-background-300': #fffce0,
  /* Background color for http status 400 elements (orange.10). */
  'kui-status-color-background-400': #fff1ef,
  /* Background color for http status 500 elements (red.10). */
  'kui-status-color-background-500': #ffe5e5,
  /* Text color for http status 100 elements (blue.60). */
  'kui-status-color-text-100': #0044f4,
  /* Text color for http status 200 elements (green.60). */
  'kui-status-color-text-200': #007d60,
  /* Text color for http status 300 elements (yellow.60). */
  'kui-status-color-text-300': #995c00,
  /* Text color for http status 400 elements (orange.60). */
  'kui-status-color-text-400': #d13500,
  /* Text color for http status 500 elements (red.60). */
  'kui-status-color-text-500': #d60027,
);
```

</details>

## CSS

### CSS Custom Properties

You may scope your CSS custom property overrides inside the `:root` selector as shown here, or inside any other valid CSS selector.

<details>

<summary>Click to view the list of CSS custom properties</summary>

```css
/* Default background color for containers (white). */
--kui-color-background: #ffffff;
/* Accent background color for emphasis on non-primary UI. Distinct from the primary action color, used to add touches of the theme accent color across themes. */
--kui-color-background-accent: #0044f4;
/* Background color for danger actions or messages (red.60). */
--kui-color-background-danger: #d60027;
/* Strong background color for danger actions or messages (red.70). */
--kui-color-background-danger-strong: #ad000e;
/* Stronger background color for danger actions or messages (red.80). */
--kui-color-background-danger-stronger: #850000;
/* Strongest background color for danger actions or messages (red.90). */
--kui-color-background-danger-strongest: #5c0000;
/* Weak background color for danger actions or messages (red.40). */
--kui-color-background-danger-weak: #ff3954;
/* Weaker background color for danger actions or messages (red.20). */
--kui-color-background-danger-weaker: #ffabab;
/* Weakest background color for danger actions or messages (red.10). */
--kui-color-background-danger-weakest: #ffe5e5;
/* Weakest background color for decorative purposes (aqua.10). */
--kui-color-background-decorative-aqua-weakest: #ecfcff;
/* Background color for decorative purposes (purple.60). */
--kui-color-background-decorative-purple: #6f28ff;
/* Weakest background color for decorative purposes (purple.10). */
--kui-color-background-decorative-purple-weakest: #f1f0ff;
/* Background color for disabled elements (gray.20). */
--kui-color-background-disabled: #e0e4ea;
/* Background color for info elements (blue.60). */
--kui-color-background-info: #0044f4;
/* Strong background color for info elements (blue.70). */
--kui-color-background-info-strong: #0030cc;
/* Stronger background color for info elements (blue.80). */
--kui-color-background-info-stronger: #002099;
/* Strongest background color for info elements (blue.90). */
--kui-color-background-info-strongest: #001466;
/* Weak background color for info elements (blue.40). */
--kui-color-background-info-weak: #5f9aff;
/* Weaker background color for info elements (blue.20). */
--kui-color-background-info-weaker: #bee2ff;
/* Weakest background color for info elements (blue.10). */
--kui-color-background-info-weakest: #eefaff;
/* Inverse background color for containers (blue.100) */
--kui-color-background-inverse: #000933;
/* Background color for neutral elements (gray.60). */
--kui-color-background-neutral: #6c7489;
/* Strong background color for neutral elements (gray.70). */
--kui-color-background-neutral-strong: #52596e;
/* Stronger background color for neutral elements (gray.80). */
--kui-color-background-neutral-stronger: #3a3f51;
/* Strongest background color for neutral elements (gray.90). */
--kui-color-background-neutral-strongest: #232633;
/* Weak background color for neutral elements (gray.40). */
--kui-color-background-neutral-weak: #afb7c5;
/* Weaker background color for neutral elements (gray.20). */
--kui-color-background-neutral-weaker: #e0e4ea;
/* Weakest background color for neutral elements (gray.10). */
--kui-color-background-neutral-weakest: #f9fafb;
/* Overlay background color (rgba(0, 9, 51, 0.6)) */
--kui-color-background-overlay: rgba(0, 9, 51, 0.6);
/* Background color for primary actions or messages (blue.60). */
--kui-color-background-primary: #0044f4;
/* Strong background color for primary actions or messages (blue.70). */
--kui-color-background-primary-strong: #0030cc;
/* Stronger background color for primary actions or messages (blue.80). */
--kui-color-background-primary-stronger: #002099;
/* Strongest background color for primary actions or messages (blue.90). */
--kui-color-background-primary-strongest: #001466;
/* Weak background color for primary actions or messages (blue.40). */
--kui-color-background-primary-weak: #5f9aff;
/* Weaker background color for primary actions or messages (blue.20). */
--kui-color-background-primary-weaker: #bee2ff;
/* Weakest background color for primary actions or messages (blue.10) */
--kui-color-background-primary-weakest: #eefaff;
/* Background color for success elements (green.60). */
--kui-color-background-success: #007d60;
/* Strong background color for success elements (green.70). */
--kui-color-background-success-strong: #005944;
/* Stronger background color for success elements (green.80). */
--kui-color-background-success-stronger: #004737;
/* Strongest background color for success elements (green.90). */
--kui-color-background-success-strongest: #003629;
/* Weak background color for success elements (green.40). */
--kui-color-background-success-weak: #00d6a4;
/* Weaker background color for success elements (green.20). */
--kui-color-background-success-weaker: #b5ffee;
/* Weakest background color for success elements (green.10). */
--kui-color-background-success-weakest: #ecfffb;
/* Transparent background color (transparent). */
--kui-color-background-transparent: rgba(0, 0, 0, 0);
/* Background color for warning elements (yellow.60). */
--kui-color-background-warning: #995c00;
/* Strong background color for warning elements (yellow.70). */
--kui-color-background-warning-strong: #804400;
/* Stronger background color for warning elements (yellow.80). */
--kui-color-background-warning-stronger: #662d00;
/* Strongest background color for warning elements (yellow.90). */
--kui-color-background-warning-strongest: #4d1b00;
/* Weak background color for warning elements (yellow.40). */
--kui-color-background-warning-weak: #ffc400;
/* Weaker background color for warning elements (yellow.20). */
--kui-color-background-warning-weaker: #fff296;
/* Weakest background color for warning elements (yellow.10). */
--kui-color-background-warning-weakest: #fffce0;
/* Default border color for containers (gray.20). */
--kui-color-border: #e0e4ea;
/* Accent border color for emphasis on non-primary UI. Distinct from the primary action color, used to add touches of the theme accent color across themes. */
--kui-color-border-accent: #0044f4;
/* Border color for danger actions or messages (red.60). */
--kui-color-border-danger: #d60027;
/* Strong border color for danger actions or messages (red.70). */
--kui-color-border-danger-strong: #ad000e;
/* Stronger border color for danger actions or messages (red.80). */
--kui-color-border-danger-stronger: #850000;
/* Strongest border color for danger actions or messages (red.90). */
--kui-color-border-danger-strongest: #5c0000;
/* Weak border color for danger actions or messages (red.40). */
--kui-color-border-danger-weak: #ff3954;
/* Weaker border color for danger actions or messages (red.20). */
--kui-color-border-danger-weaker: #ffabab;
/* Weakest border color for danger actions or messages (red.10). */
--kui-color-border-danger-weakest: #ffe5e5;
/* Border color for decorative purposes (purple.60). */
--kui-color-border-decorative-purple: #6f28ff;
/* Border color for disabled elements (gray.20). */
--kui-color-border-disabled: #e0e4ea;
/* Inverse border color (rgba(255, 255, 255, 0.2)). */
--kui-color-border-inverse: rgba(255, 255, 255, 0.2);
/* Border color for neutral elements (gray.60) */
--kui-color-border-neutral: #6c7489;
/* Strong border color for neutral elements (gray.70) */
--kui-color-border-neutral-strong: #52596e;
/* Stronger border color for neutral elements (gray.80) */
--kui-color-border-neutral-stronger: #3a3f51;
/* Strongest border color for neutral elements (gray.90) */
--kui-color-border-neutral-strongest: #232633;
/* Weak border color for neutral elements (gray.40) */
--kui-color-border-neutral-weak: #afb7c5;
/* Weaker border color for neutral elements (gray.20) */
--kui-color-border-neutral-weaker: #e0e4ea;
/* Weakest border color for neutral elements (gray.10) */
--kui-color-border-neutral-weakest: #f9fafb;
/* Border color for primary actions or messages (blue.60). */
--kui-color-border-primary: #0044f4;
/* Strong border color for primary actions or messages (blue.70). */
--kui-color-border-primary-strong: #0030cc;
/* Stronger border color for primary actions or messages (blue.80). */
--kui-color-border-primary-stronger: #002099;
/* Strongest border color for primary actions or messages (blue.90). */
--kui-color-border-primary-strongest: #001466;
/* Weak border color for primary actions or messages (blue.40). */
--kui-color-border-primary-weak: #5f9aff;
/* Weaker border color for primary actions or messages (blue.20). */
--kui-color-border-primary-weaker: #bee2ff;
/* Weakest border color for primary actions or messages (blue.10). */
--kui-color-border-primary-weakest: #eefaff;
/* Transparent border color (transparent). */
--kui-color-border-transparent: rgba(0, 0, 0, 0);
/* Default text color (blue.100). */
--kui-color-text: #000933;
/* Accent text color for emphasis on non-primary UI. Distinct from the primary action color, used to add touches of the theme accent color across themes. */
--kui-color-text-accent: #0044f4;
/* Text color for danger actions or messages (red.60). */
--kui-color-text-danger: #d60027;
/* Strong text color for danger actions or messages (red.70). */
--kui-color-text-danger-strong: #ad000e;
/* Stronger text color for danger actions or messages (red.80). */
--kui-color-text-danger-stronger: #850000;
/* Strongest text color for danger actions or messages (red.90). */
--kui-color-text-danger-strongest: #5c0000;
/* Weak text color for danger actions or messages (red.40). */
--kui-color-text-danger-weak: #ff3954;
/* Weaker text color for danger actions or messages (red.20). */
--kui-color-text-danger-weaker: #ffabab;
/* Weakest text color for danger actions or messages (red.10). */
--kui-color-text-danger-weakest: #ffe5e5;
/* Text color for decorative purposes (aqua.50). */
--kui-color-text-decorative-aqua: #00abd2;
/* Text color for decorative purposes (pink.60). */
--kui-color-text-decorative-pink: #d60067;
/* Text color for decorative purposes (purple.60). */
--kui-color-text-decorative-purple: #6f28ff;
/* Strong text color for decorative purposes (purple.70). */
--kui-color-text-decorative-purple-strong: #5e00f5;
/* Text color for disabled elements (gray.40). */
--kui-color-text-disabled: #afb7c5;
/* Text color for info elements (blue.60). */
--kui-color-text-info: #0044f4;
/* Strong text color for info elements (blue.70). */
--kui-color-text-info-strong: #0030cc;
/* Stronger text color for info elements (blue.80). */
--kui-color-text-info-stronger: #002099;
/* Strongest text color for info elements (blue.90). */
--kui-color-text-info-strongest: #001466;
/* Weak text color for info elements (blue.40). */
--kui-color-text-info-weak: #5f9aff;
/* Weaker text color for info elements (blue.20). */
--kui-color-text-info-weaker: #bee2ff;
/* Weakest text color for info elements (blue.10). */
--kui-color-text-info-weakest: #eefaff;
/* Inverse text color (white). */
--kui-color-text-inverse: #ffffff;
/* Text color for neutral elements (gray.60). */
--kui-color-text-neutral: #6c7489;
/* Strong text color for neutral elements (gray.70). */
--kui-color-text-neutral-strong: #52596e;
/* Stronger text color for neutral elements (gray.80). */
--kui-color-text-neutral-stronger: #3a3f51;
/* Strongest text color for neutral elements (gray.90). */
--kui-color-text-neutral-strongest: #232633;
/* Weak text color for neutral elements (gray.40). */
--kui-color-text-neutral-weak: #afb7c5;
/* Weaker text color for neutral elements (gray.20). */
--kui-color-text-neutral-weaker: #e0e4ea;
/* Weakest text color for neutral elements (gray.10). */
--kui-color-text-neutral-weakest: #f9fafb;
/* Text color for primary actions or messages (blue.60). */
--kui-color-text-primary: #0044f4;
/* Strong text color for primary actions or messages (blue.70). */
--kui-color-text-primary-strong: #0030cc;
/* Stronger text color for primary actions or messages (blue.80). */
--kui-color-text-primary-stronger: #002099;
/* Strongest text color for primary actions or messages (blue.90). */
--kui-color-text-primary-strongest: #001466;
/* Weak text color for primary actions or messages (blue.40). */
--kui-color-text-primary-weak: #5f9aff;
/* Weaker text color for primary actions or messages (blue.20). */
--kui-color-text-primary-weaker: #bee2ff;
/* Weakest text color for primary actions or messages (blue.10). */
--kui-color-text-primary-weakest: #eefaff;
/* Text color for success elements (green.60). */
--kui-color-text-success: #007d60;
/* Strong text color for success elements (green.70). */
--kui-color-text-success-strong: #005944;
/* Stronger text color for success elements (green.80). */
--kui-color-text-success-stronger: #004737;
/* Stronger text color for success elements (green.90). */
--kui-color-text-success-strongest: #003629;
/* Weak text color for success elements (green.40). */
--kui-color-text-success-weak: #00d6a4;
/* Weaker text color for success elements (green.20). */
--kui-color-text-success-weaker: #b5ffee;
/* Weakest text color for success elements (green.10). */
--kui-color-text-success-weakest: #ecfffb;
/* Text color for warning elements (yellow.60). */
--kui-color-text-warning: #995c00;
/* Strong text color for warning elements (yellow.70). */
--kui-color-text-warning-strong: #804400;
/* Stronger text color for warning elements (yellow.80). */
--kui-color-text-warning-stronger: #662d00;
/* Strongest text color for warning elements (yellow.90). */
--kui-color-text-warning-strongest: #4d1b00;
/* Weak text color for warning elements (yellow.40). */
--kui-color-text-warning-weak: #ffc400;
/* Weaker text color for warning elements (yellow.20). */
--kui-color-text-warning-weaker: #fff296;
/* Weakest text color for warning elements (yellow.10). */
--kui-color-text-warning-weakest: #fffce0;
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
/* 700: The bold font weight. */
--kui-font-weight-bold: 700;
/* 500: The medium font weight. */
--kui-font-weight-medium: 500;
/* 400: The normal font weight. */
--kui-font-weight-regular: 400;
/* 600: The semibold font weight. */
--kui-font-weight-semibold: 600;
/* Danger color for icons. */
--kui-icon-color-danger: #f50045;
/* Neutral color for icons. */
--kui-icon-color-neutral: #828a9e;
/* Primary color for icons. */
--kui-icon-color-primary: #306fff;
/* Success color for icons. */
--kui-icon-color-success: #00a17b;
/* Warning color for icons. */
--kui-icon-color-warning: #ffc400;
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
/* Background color for the CONNECT method (purple.10). */
--kui-method-color-background-connect: #f1f0ff;
/* Background color for the DELETE method (red.10). */
--kui-method-color-background-delete: #ffe5e5;
/* Background color for the GET method (blue.10). */
--kui-method-color-background-get: #eefaff;
/* Background color for the HEAD method (gray.70). */
--kui-method-color-background-head: #52596e;
/* Background color for the OPTIONS method (gray.20). */
--kui-method-color-background-options: #e0e4ea;
/* Background color for the PATCH method (aqua.10). */
--kui-method-color-background-patch: #ecfcff;
/* Background color for the POST method (green.10). */
--kui-method-color-background-post: #ecfffb;
/* Background color for the PUT method (yellow.10). */
--kui-method-color-background-put: #fffce0;
/* Background color for the TRACE method (pink.10). */
--kui-method-color-background-trace: #fff0f7;
/* Text color for the CONNECT method (purple.60). */
--kui-method-color-text-connect: #6f28ff;
/* Strong text color for the CONNECT method (purple.70). */
--kui-method-color-text-connect-strong: #5e00f5;
/* Text color for the DELETE method (red.60). */
--kui-method-color-text-delete: #d60027;
/* Strong text color for the DELETE method (red.70). */
--kui-method-color-text-delete-strong: #ad000e;
/* Text color for the GET method (blue.60). */
--kui-method-color-text-get: #0044f4;
/* Strong text color for the GET method (blue.70). */
--kui-method-color-text-get-strong: #0030cc;
/* Text color for the HEAD method (gray.20). */
--kui-method-color-text-head: #e0e4ea;
/* Strong text color for the HEAD method (gray.40). */
--kui-method-color-text-head-strong: #afb7c5;
/* Text color for the OPTIONS method (gray.70). */
--kui-method-color-text-options: #52596e;
/* Strong text color for the OPTIONS method (gray.80). */
--kui-method-color-text-options-strong: #3a3f51;
/* Text color for the PATCH method (aqua.60). */
--kui-method-color-text-patch: #00819d;
/* Strong text color for the PATCH method (aqua.70). */
--kui-method-color-text-patch-strong: #00647a;
/* Text color for the POST method (green.60). */
--kui-method-color-text-post: #007d60;
/* Strong text color for the POST method (green.70). */
--kui-method-color-text-post-strong: #005944;
/* Text color for the PUT method (yellow.60). */
--kui-method-color-text-put: #995c00;
/* Strong text color for the PUT method (yellow.70). */
--kui-method-color-text-put-strong: #804400;
/* Text color for the TRACE method (pink.60). */
--kui-method-color-text-trace: #d60067;
/* Strong text color for the TRACE method (pink.70). */
--kui-method-color-text-trace-strong: #ad0053;
/* blue.100 */
--kui-navigation-color-background: #000933;
/* The background color of a selected navigation item. */
--kui-navigation-color-background-selected: rgba(255, 255, 255, 0.12);
/* rgba(255, 255, 255, 0.12) */
--kui-navigation-color-border: rgba(255, 255, 255, 0.12);
/* The border color for a selected child navigation item. */
--kui-navigation-color-border-child: #00fabe;
/* The color of the navigation section divider. */
--kui-navigation-color-border-divider: rgba(255, 255, 255, 0.24);
/* Navigation link and icon color. */
--kui-navigation-color-text: #bee2ff;
/* Navigation link and icon focus-visible color. */
--kui-navigation-color-text-focus: #ffffff;
/* Navigation link and icon hover color. */
--kui-navigation-color-text-hover: #eefaff;
/* Navigation link and icon selected color. */
--kui-navigation-color-text-selected: #00fabe;
/* The box-shadow for a focus-visible navigation link. */
--kui-navigation-shadow-border: 0 0 0 1px rgba(255, 255, 255, 0.12) inset;
/* The left box-shadow for an active child navigation link. */
--kui-navigation-shadow-border-child: 4px 0 0 0 #00fabe inset;
/* Navigation link focus-visible box-shadow. */
--kui-navigation-shadow-focus: 0 0 0 1px rgba(255, 255, 255, 0.60) inset;
/* 0px 4px 20px 0px rgba(0, 0, 0, 0.08) */
--kui-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.08);
/* 0px 0px 0px 1px gray.20 inset */
--kui-shadow-border: 0px 0px 0px 1px #e0e4ea inset;
/* 0px 0px 0px 1px red.60 inset */
--kui-shadow-border-danger: 0px 0px 0px 1px #d60027 inset;
/* 0px 0px 0px 1px red.70 inset */
--kui-shadow-border-danger-strong: 0px 0px 0px 1px #ad000e inset;
/* 0px 0px 0px 1px gray.20 inset */
--kui-shadow-border-disabled: 0px 0px 0px 1px #e0e4ea inset;
/* 0px 0px 0px 1px blue.60 inset */
--kui-shadow-border-primary: 0px 0px 0px 1px #0044f4 inset;
/* 0px 0px 0px 1px blue.90 inset */
--kui-shadow-border-primary-strongest: 0px 0px 0px 1px #001466 inset;
/* 0px 0px 0px 1px blue.40 inset */
--kui-shadow-border-primary-weak: 0px 0px 0px 1px #5f9aff inset;
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
/* Color representing response status code 100 (blue.20). */
--kui-status-color-100: #bee2ff;
/* Color representing response status code 101 (blue.30). */
--kui-status-color-101: #8fc1ff;
/* Color representing response status code 102 (blue.40). */
--kui-status-color-102: #5f9aff;
/* Color representing response status code 103 (blue.50). */
--kui-status-color-103: #306fff;
/* Color representing response status code 200 (green.20). */
--kui-status-color-200: #b5ffee;
/* Color representing response status code 201 (green.30). */
--kui-status-color-201: #00fabe;
/* Color representing response status code 202 (green.40). */
--kui-status-color-202: #00d6a4;
/* Color representing response status code 203 (green.50). */
--kui-status-color-203: #00a17b;
/* Color representing response status code 204 (green.60). */
--kui-status-color-204: #007d60;
/* Color representing response status code 205 (green.70). */
--kui-status-color-205: #005944;
/* Color representing response status code 206 (green.20). */
--kui-status-color-206: #b5ffee;
/* Color representing response status code 207 (green.30). */
--kui-status-color-207: #00fabe;
/* Color representing response status code 208 (green.40). */
--kui-status-color-208: #b5ffee;
/* Color representing response status code 226 (green.50). */
--kui-status-color-226: #00a17b;
/* Color representing response status code 100 (yellow.20). */
--kui-status-color-300: #fff296;
/* Color representing response status code 101 (yellow.30). */
--kui-status-color-301: #ffe04b;
/* Color representing response status code 102 (yellow.40). */
--kui-status-color-302: #ffc400;
/* Color representing response status code 103 (yellow.50). */
--kui-status-color-303: #b37600;
/* Color representing response status code 103 (yellow.60). */
--kui-status-color-304: #995c00;
/* Color representing response status code 103 (yellow.70). */
--kui-status-color-305: #804400;
/* Color representing response status code 103 (yellow.20). */
--kui-status-color-307: #fff296;
/* Color representing response status code 103 (yellow.30). */
--kui-status-color-308: #ffe04b;
/* Color representing response status code 400 (orange.20). */
--kui-status-color-400: #ffc2b3;
/* Color representing response status code 401 (orange.30). */
--kui-status-color-401: #ff9877;
/* Color representing response status code 402 (orange.40). */
--kui-status-color-402: #ff723c;
/* Color representing response status code 403 (orange.50). */
--kui-status-color-403: #f75008;
/* Color representing response status code 404 (orange.60). */
--kui-status-color-404: #d13500;
/* Color representing response status code 405 (orange.70). */
--kui-status-color-405: #a31f00;
/* Color representing response status code 406 (orange.20). */
--kui-status-color-406: #ffc2b3;
/* Color representing response status code 407 (orange.30). */
--kui-status-color-407: #ff9877;
/* Color representing response status code 408 (orange.40). */
--kui-status-color-408: #ff723c;
/* Color representing response status code 409 (orange.50). */
--kui-status-color-409: #f75008;
/* Color representing response status code 410 (orange.60). */
--kui-status-color-410: #d13500;
/* Color representing response status code 411 (orange.70). */
--kui-status-color-411: #a31f00;
/* Color representing response status code 412 (orange.20). */
--kui-status-color-412: #ffc2b3;
/* Color representing response status code 413 (orange.30). */
--kui-status-color-413: #ff9877;
/* Color representing response status code 414 (orange.40). */
--kui-status-color-414: #ff723c;
/* Color representing response status code 415 (orange.50). */
--kui-status-color-415: #f75008;
/* Color representing response status code 416 (orange.60). */
--kui-status-color-416: #d13500;
/* Color representing response status code 417 (orange.70). */
--kui-status-color-417: #a31f00;
/* Color representing response status code 418 (orange.20). */
--kui-status-color-418: #ffc2b3;
/* Color representing response status code 421 (orange.30). */
--kui-status-color-421: #ff9877;
/* Color representing response status code 422 (orange.40). */
--kui-status-color-422: #ff723c;
/* Color representing response status code 423 (orange.50). */
--kui-status-color-423: #f75008;
/* Color representing response status code 424 (orange.60). */
--kui-status-color-424: #d13500;
/* Color representing response status code 425 (orange.70). */
--kui-status-color-425: #a31f00;
/* Color representing response status code 426 (orange.20). */
--kui-status-color-426: #ffc2b3;
/* Color representing response status code 428 (orange.30). */
--kui-status-color-428: #ff9877;
/* Color representing response status code 429 (orange.40). */
--kui-status-color-429: #ff723c;
/* Color representing response status code 431 (orange.50). */
--kui-status-color-431: #f75008;
/* Color representing response status code 451 (orange.60). */
--kui-status-color-451: #d13500;
/* Color representing response status code 500 (red.20). */
--kui-status-color-500: #ffabab;
/* Color representing response status code 501 (red.30). */
--kui-status-color-501: #ff7272;
/* Color representing response status code 502 (red.40). */
--kui-status-color-502: #ff3954;
/* Color representing response status code 503 (red.50). */
--kui-status-color-503: #f50045;
/* Color representing response status code 504 (red.60). */
--kui-status-color-504: #d60027;
/* Color representing response status code 505 (red.70). */
--kui-status-color-505: #ad000e;
/* Color representing response status code 506 (red.20). */
--kui-status-color-506: #ffabab;
/* Color representing response status code 507 (red.30). */
--kui-status-color-507: #ff7272;
/* Color representing response status code 508 (red.40). */
--kui-status-color-508: #ff3954;
/* Color representing response status code 510 (red.50). */
--kui-status-color-510: #f50045;
/* Color representing response status code 511 (red.60). */
--kui-status-color-511: #d60027;
/* Color for unknown response status codes in the 100-199 range (blue.10). */
--kui-status-color-1na: #eefaff;
/* Color for unknown response status codes in the 200-299 range (green.10). */
--kui-status-color-2na: #ecfffb;
/* Color for unknown response status codes in the 300-399 range (yellow.10). */
--kui-status-color-3na: #fffce0;
/* Color for unknown response status codes in the 400-499 range (orange.10). */
--kui-status-color-4na: #fff1ef;
/* Color for unknown response status codes in the 500-599 range (red.10). */
--kui-status-color-5na: #ffe5e5;
/* Color for a group of response status codes in the 100-199 range (blue.40). */
--kui-status-color-100s: #5f9aff;
/* Color for a group of response status codes in the 200-299 range (green.40). */
--kui-status-color-200s: #00d6a4;
/* Color for a group of response status codes in the 300-399 range (yellow.40). */
--kui-status-color-300s: #ffc400;
/* Color for a group of response status codes in the 400-499 range (orange.40). */
--kui-status-color-400s: #ff723c;
/* Color for a group of response status codes in the 500-599 range (red.40). */
--kui-status-color-500s: #ff3954;
/* Background color for http status 100 elements (blue.10). */
--kui-status-color-background-100: #eefaff;
/* Background color for http status 200 elements (green.10). */
--kui-status-color-background-200: #ecfffb;
/* Background color for http status 300 elements (yellow.10). */
--kui-status-color-background-300: #fffce0;
/* Background color for http status 400 elements (orange.10). */
--kui-status-color-background-400: #fff1ef;
/* Background color for http status 500 elements (red.10). */
--kui-status-color-background-500: #ffe5e5;
/* Text color for http status 100 elements (blue.60). */
--kui-status-color-text-100: #0044f4;
/* Text color for http status 200 elements (green.60). */
--kui-status-color-text-200: #007d60;
/* Text color for http status 300 elements (yellow.60). */
--kui-status-color-text-300: #995c00;
/* Text color for http status 400 elements (orange.60). */
--kui-status-color-text-400: #d13500;
/* Text color for http status 500 elements (red.60). */
--kui-status-color-text-500: #d60027;
```

</details>

### Component CSS Custom Properties

Component tokens are documented here for reference. They ship **with no default value** (shown as `initial`) — they exist purely as override slots consumed via `var()` fallback chains, and only take effect when a theme or host application sets them.

<details>

<summary>Click to view the list of component CSS custom properties</summary>

```css
/* Alert border radius. */
--kui-alert-border-radius: initial;
/* Danger alert background color. */
--kui-alert-color-background-danger: initial;
/* Decorative alert background color. */
--kui-alert-color-background-decorative: initial;
/* Info alert background color. */
--kui-alert-color-background-info: initial;
/* Success alert background color. */
--kui-alert-color-background-success: initial;
/* Warning alert background color. */
--kui-alert-color-background-warning: initial;
/* Danger alert text color. */
--kui-alert-color-text-danger: initial;
/* Danger alert text color on hover. */
--kui-alert-color-text-danger-hover: initial;
/* Decorative alert text color. */
--kui-alert-color-text-decorative: initial;
/* Decorative alert text color on hover. */
--kui-alert-color-text-decorative-hover: initial;
/* Info alert text color. */
--kui-alert-color-text-info: initial;
/* Info alert text color on hover. */
--kui-alert-color-text-info-hover: initial;
/* Success alert text color. */
--kui-alert-color-text-success: initial;
/* Success alert text color on hover. */
--kui-alert-color-text-success-hover: initial;
/* Warning alert text color. */
--kui-alert-color-text-warning: initial;
/* Warning alert text color on hover. */
--kui-alert-color-text-warning-hover: initial;
/* Alert font family. */
--kui-alert-font-family: initial;
/* Alert font size. */
--kui-alert-font-size: initial;
/* Alert body text font weight. */
--kui-alert-font-weight: initial;
/* Alert line height. */
--kui-alert-line-height: initial;
/* Alert inner padding. */
--kui-alert-padding: initial;
/* Badge border radius. */
--kui-badge-border-radius: initial;
/* Danger badge background color. */
--kui-badge-color-background-danger: initial;
/* Decorative badge background color. */
--kui-badge-color-background-decorative: initial;
/* Info badge background color. */
--kui-badge-color-background-info: initial;
/* Neutral badge background color. */
--kui-badge-color-background-neutral: initial;
/* Success badge background color. */
--kui-badge-color-background-success: initial;
/* Warning badge background color. */
--kui-badge-color-background-warning: initial;
/* Danger badge text color. */
--kui-badge-color-text-danger: initial;
/* Danger badge text color on hover. */
--kui-badge-color-text-danger-hover: initial;
/* Decorative badge text color. */
--kui-badge-color-text-decorative: initial;
/* Decorative badge text color on hover. */
--kui-badge-color-text-decorative-hover: initial;
/* Disabled badge text color. */
--kui-badge-color-text-disabled: initial;
/* Info badge text color. */
--kui-badge-color-text-info: initial;
/* Info badge text color on hover. */
--kui-badge-color-text-info-hover: initial;
/* Neutral badge text color. */
--kui-badge-color-text-neutral: initial;
/* Neutral badge text color on hover. */
--kui-badge-color-text-neutral-hover: initial;
/* Success badge text color. */
--kui-badge-color-text-success: initial;
/* Success badge text color on hover. */
--kui-badge-color-text-success-hover: initial;
/* Warning badge text color. */
--kui-badge-color-text-warning: initial;
/* Warning badge text color on hover. */
--kui-badge-color-text-warning-hover: initial;
/* Badge font family. */
--kui-badge-font-family: initial;
/* Badge font size. */
--kui-badge-font-size: initial;
/* Badge font weight. */
--kui-badge-font-weight: initial;
/* Gap between the badge icon and text. */
--kui-badge-icon-gap: initial;
/* Badge line height. */
--kui-badge-line-height: initial;
/* Reduced padding for small inline badges. */
--kui-badge-padding-small: initial;
/* Badge horizontal padding. */
--kui-badge-padding-x: initial;
/* Badge vertical padding. */
--kui-badge-padding-y: initial;
/* Badge focus ring shadow. */
--kui-badge-shadow-focus: initial;
/* Breadcrumbs item text color. Applies to the resting state of links and to the current (non-link) item. */
--kui-breadcrumbs-color-text: initial;
/* Breadcrumbs link text color on hover and focus. */
--kui-breadcrumbs-color-text-hover: initial;
/* Breadcrumbs divider (separator) color. */
--kui-breadcrumbs-divider-color-text: initial;
/* Breadcrumbs divider (separator) font weight. */
--kui-breadcrumbs-divider-font-weight: initial;
/* Breadcrumbs font family. */
--kui-breadcrumbs-font-family: initial;
/* Breadcrumbs item font size. */
--kui-breadcrumbs-font-size: initial;
/* Breadcrumbs item text font weight. */
--kui-breadcrumbs-font-weight: initial;
/* Breadcrumbs item line height. */
--kui-breadcrumbs-line-height: initial;
/* Breadcrumbs link focus-visible shadow. */
--kui-breadcrumbs-shadow-focus: initial;
/* Large button border radius. */
--kui-button-border-radius-large: initial;
/* Medium button border radius. */
--kui-button-border-radius-medium: initial;
/* Small button border radius. */
--kui-button-border-radius-small: initial;
/* Large button border width. */
--kui-button-border-width-large: initial;
/* Medium button border width. */
--kui-button-border-width-medium: initial;
/* Small button border width. */
--kui-button-border-width-small: initial;
/* Danger button background color. */
--kui-button-color-background-danger: initial;
/* Danger button background color when active. */
--kui-button-color-background-danger-active: initial;
/* Danger button background color when disabled. */
--kui-button-color-background-danger-disabled: initial;
/* Danger button background color on hover. */
--kui-button-color-background-danger-hover: initial;
/* Primary button background color. */
--kui-button-color-background-primary: initial;
/* Primary button background color when active. */
--kui-button-color-background-primary-active: initial;
/* Primary button background color when disabled. */
--kui-button-color-background-primary-disabled: initial;
/* Primary button background color on hover. */
--kui-button-color-background-primary-hover: initial;
/* Secondary button background color. */
--kui-button-color-background-secondary: initial;
/* Secondary button background color when active. */
--kui-button-color-background-secondary-active: initial;
/* Secondary button background color when disabled. */
--kui-button-color-background-secondary-disabled: initial;
/* Secondary button background color on hover. */
--kui-button-color-background-secondary-hover: initial;
/* Tertiary button background color. */
--kui-button-color-background-tertiary: initial;
/* Tertiary button background color when active. */
--kui-button-color-background-tertiary-active: initial;
/* Tertiary button background color when disabled. */
--kui-button-color-background-tertiary-disabled: initial;
/* Tertiary button background color on hover. */
--kui-button-color-background-tertiary-hover: initial;
/* Danger button border color. */
--kui-button-color-border-danger: initial;
/* Danger button border color when active. */
--kui-button-color-border-danger-active: initial;
/* Danger button border color when disabled. */
--kui-button-color-border-danger-disabled: initial;
/* Danger button border color on hover. */
--kui-button-color-border-danger-hover: initial;
/* Primary button border color. */
--kui-button-color-border-primary: initial;
/* Primary button border color when active. */
--kui-button-color-border-primary-active: initial;
/* Primary button border color when disabled. */
--kui-button-color-border-primary-disabled: initial;
/* Primary button border color on hover. */
--kui-button-color-border-primary-hover: initial;
/* Secondary button border color. */
--kui-button-color-border-secondary: initial;
/* Secondary button border color when active. */
--kui-button-color-border-secondary-active: initial;
/* Secondary button border color when disabled. */
--kui-button-color-border-secondary-disabled: initial;
/* Secondary button border color on hover. */
--kui-button-color-border-secondary-hover: initial;
/* Tertiary button border color. */
--kui-button-color-border-tertiary: initial;
/* Tertiary button border color when active. */
--kui-button-color-border-tertiary-active: initial;
/* Tertiary button border color when disabled. */
--kui-button-color-border-tertiary-disabled: initial;
/* Tertiary button border color on hover. */
--kui-button-color-border-tertiary-hover: initial;
/* Danger button text color. */
--kui-button-color-text-danger: initial;
/* Danger button text color when active. */
--kui-button-color-text-danger-active: initial;
/* Danger button text color when disabled. */
--kui-button-color-text-danger-disabled: initial;
/* Danger button text color on hover. */
--kui-button-color-text-danger-hover: initial;
/* Primary button text color. */
--kui-button-color-text-primary: initial;
/* Primary button text color when active. */
--kui-button-color-text-primary-active: initial;
/* Primary button text color when disabled. */
--kui-button-color-text-primary-disabled: initial;
/* Primary button text color on hover. */
--kui-button-color-text-primary-hover: initial;
/* Secondary button text color. */
--kui-button-color-text-secondary: initial;
/* Secondary button text color when active. */
--kui-button-color-text-secondary-active: initial;
/* Secondary button text color when disabled. */
--kui-button-color-text-secondary-disabled: initial;
/* Secondary button text color on hover. */
--kui-button-color-text-secondary-hover: initial;
/* Tertiary button text color. */
--kui-button-color-text-tertiary: initial;
/* Tertiary button text color when active. */
--kui-button-color-text-tertiary-active: initial;
/* Tertiary button text color when disabled. */
--kui-button-color-text-tertiary-disabled: initial;
/* Tertiary button text color on hover. */
--kui-button-color-text-tertiary-hover: initial;
/* Large button font size. */
--kui-button-font-size-large: initial;
/* Medium button font size. */
--kui-button-font-size-medium: initial;
/* Small button font size. */
--kui-button-font-size-small: initial;
/* Button font weight. */
--kui-button-font-weight: initial;
/* Icon size in the large button. */
--kui-button-icon-size-large: initial;
/* Icon size in the medium button. */
--kui-button-icon-size-medium: initial;
/* Icon size in the small button. */
--kui-button-icon-size-small: initial;
/* Large button line height. */
--kui-button-line-height-large: initial;
/* Medium button line height. */
--kui-button-line-height-medium: initial;
/* Small button line height. */
--kui-button-line-height-small: initial;
/* Large button horizontal padding. */
--kui-button-padding-x-large: initial;
/* Medium button horizontal padding. */
--kui-button-padding-x-medium: initial;
/* Small button horizontal padding. */
--kui-button-padding-x-small: initial;
/* Large button vertical padding. */
--kui-button-padding-y-large: initial;
/* Medium button vertical padding. */
--kui-button-padding-y-medium: initial;
/* Small button vertical padding. */
--kui-button-padding-y-small: initial;
/* Button focus ring shadow. */
--kui-button-shadow-focus: initial;
/* Gap between card action items. */
--kui-card-actions-gap: initial;
/* Card body text color. */
--kui-card-body-color-text: initial;
/* Card body font family. */
--kui-card-body-font-family: initial;
/* Card body font size. */
--kui-card-body-font-size: initial;
/* Card body font weight. */
--kui-card-body-font-weight: initial;
/* Card body line height. */
--kui-card-body-line-height: initial;
/* Card border radius. */
--kui-card-border-radius: initial;
/* Card border width. */
--kui-card-border-width: initial;
/* Card background color. */
--kui-card-color-background: initial;
/* Card border color. */
--kui-card-color-border: initial;
/* Gap between card footer items. */
--kui-card-footer-gap: initial;
/* Gap between card sections. */
--kui-card-gap: initial;
/* Gap between card header items. */
--kui-card-header-gap: initial;
/* Card inner padding. */
--kui-card-padding: initial;
/* Card title text color. */
--kui-card-title-color-text: initial;
/* Card title font size. */
--kui-card-title-font-size: initial;
/* Card title font weight. */
--kui-card-title-font-weight: initial;
/* Card title line height. */
--kui-card-title-line-height: initial;
/* Checkbox border radius. */
--kui-checkbox-border-radius: initial;
/* Checkbox background color. */
--kui-checkbox-color-background: initial;
/* Checkbox background color when checked or indeterminate. */
--kui-checkbox-color-background-checked: initial;
/* Checkbox icon color when checked or indeterminate. */
--kui-checkbox-color-icon: initial;
/* Checkbox default border shadow. */
--kui-checkbox-shadow-border: initial;
/* Checkbox border shadow when checked or indeterminate. */
--kui-checkbox-shadow-border-checked: initial;
/* Checkbox border shadow on hover. */
--kui-checkbox-shadow-border-hover: initial;
/* Checkbox focus ring shadow. */
--kui-checkbox-shadow-focus: initial;
/* Code block actions toolbar bottom border width. */
--kui-code-block-actions-border-width: initial;
/* Code block actions toolbar bottom border color. */
--kui-code-block-actions-color-border: initial;
/* Code block actions toolbar bottom border color in the dark theme. */
--kui-code-block-actions-color-border-dark: initial;
/* Code block actions toolbar inner padding. */
--kui-code-block-actions-padding: initial;
/* Code block border radius. */
--kui-code-block-border-radius: initial;
/* Code block background color. */
--kui-code-block-color-background: initial;
/* Code block background color in the dark theme. */
--kui-code-block-color-background-dark: initial;
/* Code block code text color. */
--kui-code-block-color-text: initial;
/* Code block code text color in the dark theme. */
--kui-code-block-color-text-dark: initial;
/* Code block line number text color. */
--kui-code-block-line-number-color-text: initial;
/* Code block line number text color in the dark theme. */
--kui-code-block-line-number-color-text-dark: initial;
/* Collapse font family. */
--kui-collapse-font-family: initial;
/* Collapse title text color. */
--kui-collapse-title-color-text: initial;
/* Collapse title font size. */
--kui-collapse-title-font-size: initial;
/* Collapse title font weight. */
--kui-collapse-title-font-weight: initial;
/* Collapse title line height. */
--kui-collapse-title-line-height: initial;
/* Collapse trigger button border radius. */
--kui-collapse-trigger-border-radius: initial;
/* Collapse trigger button text color. */
--kui-collapse-trigger-color-text: initial;
/* Collapse trigger button text color when active (pressed). */
--kui-collapse-trigger-color-text-active: initial;
/* Collapse trigger button text color on hover. */
--kui-collapse-trigger-color-text-hover: initial;
/* Collapse trigger button font size. */
--kui-collapse-trigger-font-size: initial;
/* Collapse trigger button font weight. */
--kui-collapse-trigger-font-weight: initial;
/* Collapse trigger button line height. */
--kui-collapse-trigger-line-height: initial;
/* Collapse trigger button focus-visible shadow. */
--kui-collapse-trigger-shadow-focus: initial;
/* Copy value text color. */
--kui-copy-color-text: initial;
/* Copy value font family when displayed as code (monospace). */
--kui-copy-font-family-code: initial;
/* Copy text font size. */
--kui-copy-font-size: initial;
/* Copy value font weight when displayed as code (monospace). */
--kui-copy-font-weight-code: initial;
/* Copy-to-clipboard icon text color on hover and focus (non-badge appearance). */
--kui-copy-icon-color-text-hover: initial;
/* Copy text line height. */
--kui-copy-line-height: initial;
/* Date-time picker calendar day background color on hover. */
--kui-date-time-picker-day-color-background-hover: initial;
/* Date-time picker calendar day background color for days within the selected range. */
--kui-date-time-picker-day-color-background-in-range: initial;
/* Date-time picker calendar day background color when selected. */
--kui-date-time-picker-day-color-background-selected: initial;
/* Date-time picker calendar day background color when selected, on hover. */
--kui-date-time-picker-day-color-background-selected-hover: initial;
/* Date-time picker calendar day background color for today. */
--kui-date-time-picker-day-color-background-today: initial;
/* Date-time picker calendar day text color. */
--kui-date-time-picker-day-color-text: initial;
/* Date-time picker calendar day text color when disabled. */
--kui-date-time-picker-day-color-text-disabled: initial;
/* Date-time picker calendar day text color when selected. */
--kui-date-time-picker-day-color-text-selected: initial;
/* Date-time picker calendar day focus-visible ring shadow. */
--kui-date-time-picker-shadow-focus: initial;
/* Dropdown popover border radius. */
--kui-dropdown-border-radius: initial;
/* Dropdown popover border color. */
--kui-dropdown-color-border: initial;
/* Dropdown item background color. */
--kui-dropdown-item-color-background: initial;
/* Dropdown item background color when active. */
--kui-dropdown-item-color-background-active: initial;
/* Danger dropdown item background color when active. */
--kui-dropdown-item-color-background-danger-active: initial;
/* Danger dropdown item background color on hover. */
--kui-dropdown-item-color-background-danger-hover: initial;
/* Dropdown item background color on hover. */
--kui-dropdown-item-color-background-hover: initial;
/* Selected dropdown item background color. */
--kui-dropdown-item-color-background-selected: initial;
/* Selected and disabled dropdown item background color. */
--kui-dropdown-item-color-background-selected-disabled: initial;
/* Dropdown item divider border color. */
--kui-dropdown-item-color-border-divider: initial;
/* Dropdown item text color. */
--kui-dropdown-item-color-text: initial;
/* Danger dropdown item text color. */
--kui-dropdown-item-color-text-danger: initial;
/* Disabled dropdown item text color. */
--kui-dropdown-item-color-text-disabled: initial;
/* Selected dropdown item text color. */
--kui-dropdown-item-color-text-selected: initial;
/* Dropdown item font family. */
--kui-dropdown-item-font-family: initial;
/* Dropdown item font size. */
--kui-dropdown-item-font-size: initial;
/* Dropdown item font weight. */
--kui-dropdown-item-font-weight: initial;
/* Dropdown item line height. */
--kui-dropdown-item-line-height: initial;
/* Dropdown item horizontal padding. */
--kui-dropdown-item-padding-x: initial;
/* Dropdown item vertical padding. */
--kui-dropdown-item-padding-y: initial;
/* Dropdown item focus ring shadow. */
--kui-dropdown-item-shadow-focus: initial;
/* Empty state container background color. */
--kui-empty-state-color-background: initial;
/* Empty state font family. */
--kui-empty-state-font-family: initial;
/* Empty state footer top border width. */
--kui-empty-state-footer-border-width: initial;
/* Empty state footer top border color. */
--kui-empty-state-footer-color-border: initial;
/* Empty state footer text color. */
--kui-empty-state-footer-color-text: initial;
/* Empty state footer font size. */
--kui-empty-state-footer-font-size: initial;
/* Empty state footer font weight. */
--kui-empty-state-footer-font-weight: initial;
/* Empty state footer line height. */
--kui-empty-state-footer-line-height: initial;
/* Empty state footer top padding. */
--kui-empty-state-footer-padding-top: initial;
/* Empty state icon border radius when the icon has a background. */
--kui-empty-state-icon-border-radius: initial;
/* Empty state icon color. */
--kui-empty-state-icon-color: initial;
/* Empty state icon background color when the icon has a background. */
--kui-empty-state-icon-color-background: initial;
/* Empty state icon text/glyph color when the icon has a background. */
--kui-empty-state-icon-color-text-background: initial;
/* Empty state icon padding when the icon has a background. */
--kui-empty-state-icon-padding: initial;
/* Empty state icon size. */
--kui-empty-state-icon-size: initial;
/* Empty state icon size when the icon has a background. */
--kui-empty-state-icon-size-background: initial;
/* Empty state message text color. */
--kui-empty-state-message-color-text: initial;
/* Empty state message font size. */
--kui-empty-state-message-font-size: initial;
/* Empty state message font weight. */
--kui-empty-state-message-font-weight: initial;
/* Empty state message line height. */
--kui-empty-state-message-line-height: initial;
/* Empty state title text color. */
--kui-empty-state-title-color-text: initial;
/* Empty state title font size. */
--kui-empty-state-title-font-size: initial;
/* Empty state title font weight. */
--kui-empty-state-title-font-weight: initial;
/* Empty state title line height. */
--kui-empty-state-title-line-height: initial;
/* File upload selected-file text color when disabled (input appearance). */
--kui-file-upload-color-text-disabled: initial;
/* File upload placeholder text color when no file is selected (input appearance). */
--kui-file-upload-color-text-placeholder: initial;
/* File upload dropzone border radius. */
--kui-file-upload-dropzone-border-radius: initial;
/* File upload dropzone border width. */
--kui-file-upload-dropzone-border-width: initial;
/* File upload dropzone background color. */
--kui-file-upload-dropzone-color-background: initial;
/* File upload dropzone background color when disabled. */
--kui-file-upload-dropzone-color-background-disabled: initial;
/* File upload dropzone border color. */
--kui-file-upload-dropzone-color-border: initial;
/* File upload dropzone border color when disabled. */
--kui-file-upload-dropzone-color-border-disabled: initial;
/* File upload dropzone border color in error state. */
--kui-file-upload-dropzone-color-border-error: initial;
/* File upload dropzone border color on hover, drag-over, and focus (coordinated). */
--kui-file-upload-dropzone-color-border-hover: initial;
/* File upload dropzone text color. */
--kui-file-upload-dropzone-color-text: initial;
/* File upload dropzone outer focus ring shadow. */
--kui-file-upload-dropzone-shadow-focus: initial;
/* Border radius of the focus highlight around the pill clear button. */
--kui-filter-group-clear-border-radius: initial;
/* Filter pill border radius. */
--kui-filter-group-pill-border-radius: initial;
/* Filter pill border width. */
--kui-filter-group-pill-border-width: initial;
/* Filter pill background color (default, no selection). */
--kui-filter-group-pill-color-background: initial;
/* Filter pill background color on hover and focus (default, no selection). */
--kui-filter-group-pill-color-background-hover: initial;
/* Filter pill background color when a selection is applied. */
--kui-filter-group-pill-color-background-selected: initial;
/* Filter pill background color on hover and focus when a selection is applied. */
--kui-filter-group-pill-color-background-selected-hover: initial;
/* Filter pill border color (default, no selection). */
--kui-filter-group-pill-color-border: initial;
/* Filter pill border color on hover and focus. */
--kui-filter-group-pill-color-border-hover: initial;
/* Filter pill border color when a selection is applied. */
--kui-filter-group-pill-color-border-selected: initial;
/* Filter pill text color (default, no selection). */
--kui-filter-group-pill-color-text: initial;
/* Filter pill text color when a selection is applied. */
--kui-filter-group-pill-color-text-selected: initial;
/* Filter pill text color on hover and focus when a selection is applied. */
--kui-filter-group-pill-color-text-selected-hover: initial;
/* Filter pill label line height. */
--kui-filter-group-pill-line-height: initial;
/* Filter pill focus ring shadow. */
--kui-filter-group-pill-shadow-focus: initial;
/* Filter selector empty (no filters found) message text color. */
--kui-filter-group-selector-color-text: initial;
/* Input switch large size border radius. */
--kui-input-switch-border-radius-large: initial;
/* Input switch small size border radius. */
--kui-input-switch-border-radius-small: initial;
/* Input switch track background color. */
--kui-input-switch-color-background: initial;
/* Input switch track background color when disabled. */
--kui-input-switch-color-background-disabled: initial;
/* Input switch track background color on hover. */
--kui-input-switch-color-background-hover: initial;
/* Input switch track background color when on. */
--kui-input-switch-color-background-selected: initial;
/* Input switch track background color when on and hovered. */
--kui-input-switch-color-background-selected-hover: initial;
/* Input switch focus ring shadow. */
--kui-input-switch-shadow-focus: initial;
/* Input switch thumb ring border radius. */
--kui-input-switch-thumb-border-radius: initial;
/* Input switch thumb ring border width. */
--kui-input-switch-thumb-border-width: initial;
/* Input switch thumb background color. */
--kui-input-switch-thumb-color-background: initial;
/* Input switch thumb background color when disabled. */
--kui-input-switch-thumb-color-background-disabled: initial;
/* Input switch thumb ring border color. */
--kui-input-switch-thumb-color-border: initial;
/* Input switch thumb ring border color on hover. */
--kui-input-switch-thumb-color-border-hover: initial;
/* Input switch thumb border shadow. */
--kui-input-switch-thumb-shadow-border: initial;
/* Input switch thumb border shadow when disabled. */
--kui-input-switch-thumb-shadow-border-disabled: initial;
/* Input switch thumb border shadow when on. */
--kui-input-switch-thumb-shadow-border-selected: initial;
/* Input border radius. */
--kui-input-border-radius: initial;
/* Input background color. */
--kui-input-color-background: initial;
/* Input background color when disabled. */
--kui-input-color-background-disabled: initial;
/* Input background color when read-only. */
--kui-input-color-background-readonly: initial;
/* Input text color. */
--kui-input-color-text: initial;
/* Input text color when disabled. */
--kui-input-color-text-disabled: initial;
/* Input placeholder text color. */
--kui-input-color-text-placeholder: initial;
/* Input text color when read-only. */
--kui-input-color-text-readonly: initial;
/* Input font family. */
--kui-input-font-family: initial;
/* Input font size. */
--kui-input-font-size: initial;
/* Input font weight. */
--kui-input-font-weight: initial;
/* Input line height. */
--kui-input-line-height: initial;
/* Input horizontal padding. */
--kui-input-padding-x: initial;
/* Input vertical padding. */
--kui-input-padding-y: initial;
/* Input border shadow. */
--kui-input-shadow-border: initial;
/* Input border shadow when disabled. */
--kui-input-shadow-border-disabled: initial;
/* Input border shadow in error state. */
--kui-input-shadow-border-error: initial;
/* Input border shadow in error state on hover. */
--kui-input-shadow-border-error-hover: initial;
/* Input border shadow on hover. */
--kui-input-shadow-border-hover: initial;
/* Input outer focus ring shadow. */
--kui-input-shadow-focus: initial;
/* Label text color. */
--kui-label-color-text: initial;
/* Label font family. */
--kui-label-font-family: initial;
/* Label font size. */
--kui-label-font-size: initial;
/* Label font weight. */
--kui-label-font-weight: initial;
/* Label line height. */
--kui-label-line-height: initial;
/* Link text color. */
--kui-link-color-text: initial;
/* Link text color in the active (pressed) state. */
--kui-link-color-text-active: initial;
/* Link text color in the disabled state. */
--kui-link-color-text-disabled: initial;
/* Link text color on hover and focus-visible. */
--kui-link-color-text-hover: initial;
/* Link font weight. */
--kui-link-font-weight: initial;
/* Link focus-visible ring shadow. */
--kui-link-shadow-focus: initial;
/* Link text decoration (e.g. underline). */
--kui-link-text-decoration: initial;
/* Link text decoration on hover and focus-visible. */
--kui-link-text-decoration-hover: initial;
/* Modal dialog border radius. */
--kui-modal-border-radius: initial;
/* Modal dialog border width. */
--kui-modal-border-width: initial;
/* Modal close button border radius. */
--kui-modal-close-border-radius: initial;
/* Modal close button icon color on hover and focus. */
--kui-modal-close-color-text-hover: initial;
/* Modal close button focus-visible shadow. */
--kui-modal-close-shadow-focus: initial;
/* Modal dialog background color. */
--kui-modal-color-background: initial;
/* Modal dialog border color. */
--kui-modal-color-border: initial;
/* Modal dialog text color (custom content). */
--kui-modal-color-text: initial;
/* Modal content area background color. */
--kui-modal-content-color-background: initial;
/* Modal content area text color. */
--kui-modal-content-color-text: initial;
/* Modal content area font family. */
--kui-modal-content-font-family: initial;
/* Modal content area font size. */
--kui-modal-content-font-size: initial;
/* Modal content area font weight. */
--kui-modal-content-font-weight: initial;
/* Modal content area line height. */
--kui-modal-content-line-height: initial;
/* Modal content area inner padding. */
--kui-modal-content-padding: initial;
/* Modal dialog font family (custom content). */
--kui-modal-font-family: initial;
/* Modal dialog font size (custom content). */
--kui-modal-font-size: initial;
/* Modal dialog font weight (custom content). */
--kui-modal-font-weight: initial;
/* Modal footer inner padding. */
--kui-modal-footer-padding: initial;
/* Modal header inner padding. */
--kui-modal-header-padding: initial;
/* Modal dialog line height (custom content). */
--kui-modal-line-height: initial;
/* Modal dialog box shadow. */
--kui-modal-shadow: initial;
/* Modal title font family. */
--kui-modal-title-font-family: initial;
/* Modal title font size. */
--kui-modal-title-font-size: initial;
/* Modal title font weight. */
--kui-modal-title-font-weight: initial;
/* Modal title line height. */
--kui-modal-title-line-height: initial;
/* Multiselect dropdown footer top border width. */
--kui-multiselect-footer-border-width: initial;
/* Multiselect dropdown footer background color. */
--kui-multiselect-footer-color-background: initial;
/* Multiselect dropdown footer top border color. */
--kui-multiselect-footer-color-border: initial;
/* Multiselect dropdown footer text color. */
--kui-multiselect-footer-color-text: initial;
/* Multiselect dropdown group title text color. */
--kui-multiselect-group-color-text: initial;
/* Multiselect dropdown group title font family. */
--kui-multiselect-group-font-family: initial;
/* Multiselect dropdown group title font weight. */
--kui-multiselect-group-font-weight: initial;
/* Multiselect dropdown search input wrapper bottom border width. */
--kui-multiselect-search-border-width: initial;
/* Multiselect dropdown search input wrapper background color. */
--kui-multiselect-search-color-background: initial;
/* Multiselect dropdown search input wrapper bottom border color. */
--kui-multiselect-search-color-border: initial;
/* Pagination page button border radius. */
--kui-pagination-border-radius: initial;
/* Pagination page button border width. */
--kui-pagination-border-width: initial;
/* Pagination page button background color. */
--kui-pagination-color-background: initial;
/* Pagination current (selected) page button background color. */
--kui-pagination-color-background-selected: initial;
/* Pagination page button border color. */
--kui-pagination-color-border: initial;
/* Pagination page button border color on hover and focus. */
--kui-pagination-color-border-hover: initial;
/* Pagination current (selected) page button border color. */
--kui-pagination-color-border-selected: initial;
/* Pagination page button text color. */
--kui-pagination-color-text: initial;
/* Pagination font family. */
--kui-pagination-font-family: initial;
/* Pagination page button font weight. */
--kui-pagination-font-weight: initial;
/* Pagination page button inner padding. */
--kui-pagination-padding: initial;
/* Pagination page button focus-visible shadow. */
--kui-pagination-shadow-focus: initial;
/* Popover container border radius. */
--kui-pop-border-radius: initial;
/* Popover container border width. */
--kui-pop-border-width: initial;
/* Popover close button border radius. */
--kui-pop-close-border-radius: initial;
/* Popover close button icon color. */
--kui-pop-close-color-text: initial;
/* Popover close button icon color on hover and focus. */
--kui-pop-close-color-text-hover: initial;
/* Popover close button focus-visible shadow. */
--kui-pop-close-shadow-focus: initial;
/* Popover container background color (also used for the caret fill). */
--kui-pop-color-background: initial;
/* Popover container border color (also used for the caret border). */
--kui-pop-color-border: initial;
/* Popover content text color. */
--kui-pop-color-text: initial;
/* Popover container font family. */
--kui-pop-font-family: initial;
/* Popover content font size. */
--kui-pop-font-size: initial;
/* Popover content font weight. */
--kui-pop-font-weight: initial;
/* Popover content line height. */
--kui-pop-line-height: initial;
/* Popover container inner padding. */
--kui-pop-padding: initial;
/* Popover container box shadow. */
--kui-pop-shadow: initial;
/* Popover title text color. */
--kui-pop-title-color-text: initial;
/* Popover title font size. */
--kui-pop-title-font-size: initial;
/* Popover title font weight. */
--kui-pop-title-font-weight: initial;
/* Popover title line height. */
--kui-pop-title-line-height: initial;
/* Radio background color. */
--kui-radio-color-background: initial;
/* Radio background color when checked. */
--kui-radio-color-background-checked: initial;
/* Radio default border shadow. */
--kui-radio-shadow-border: initial;
/* Radio border shadow when checked. */
--kui-radio-shadow-border-checked: initial;
/* Radio border shadow on hover. */
--kui-radio-shadow-border-hover: initial;
/* Radio focus ring shadow. */
--kui-radio-shadow-focus: initial;
/* Segmented control button border radius (applied to the outer corners of the first and last buttons). */
--kui-segmented-control-border-radius: initial;
/* Segmented control button border width. */
--kui-segmented-control-border-width: initial;
/* Segmented control button background color. */
--kui-segmented-control-color-background: initial;
/* Segmented control button background color when selected and disabled. */
--kui-segmented-control-color-background-disabled-selected: initial;
/* Segmented control button background color when selected. */
--kui-segmented-control-color-background-selected: initial;
/* Segmented control button border color. */
--kui-segmented-control-color-border: initial;
/* Segmented control button border color when active (pressed). */
--kui-segmented-control-color-border-active: initial;
/* Segmented control button border color when disabled. */
--kui-segmented-control-color-border-disabled: initial;
/* Segmented control button border color on hover. */
--kui-segmented-control-color-border-hover: initial;
/* Segmented control button border color when selected. */
--kui-segmented-control-color-border-selected: initial;
/* Segmented control button text color. */
--kui-segmented-control-color-text: initial;
/* Segmented control button text color when active (pressed). */
--kui-segmented-control-color-text-active: initial;
/* Segmented control button text color when disabled. */
--kui-segmented-control-color-text-disabled: initial;
/* Segmented control button text color on hover. */
--kui-segmented-control-color-text-hover: initial;
/* Segmented control button text color when selected. */
--kui-segmented-control-color-text-selected: initial;
/* Segmented control font family. */
--kui-segmented-control-font-family: initial;
/* Segmented control button font size. */
--kui-segmented-control-font-size: initial;
/* Segmented control button font weight. */
--kui-segmented-control-font-weight: initial;
/* Segmented control button line height. */
--kui-segmented-control-line-height: initial;
/* Segmented control button horizontal padding (small size). */
--kui-segmented-control-padding-x: initial;
/* Segmented control button horizontal padding (large size). */
--kui-segmented-control-padding-x-large: initial;
/* Segmented control button focus-visible shadow. */
--kui-segmented-control-shadow-focus: initial;
/* Select dropdown popover border radius. */
--kui-select-border-radius: initial;
/* Select dropdown popover border color. */
--kui-select-color-border: initial;
/* Select item background color. */
--kui-select-item-color-background: initial;
/* Select item background color on hover. */
--kui-select-item-color-background-hover: initial;
/* Selected select item background color. */
--kui-select-item-color-background-selected: initial;
/* Selected and disabled select item background color. */
--kui-select-item-color-background-selected-disabled: initial;
/* Select item text color. */
--kui-select-item-color-text: initial;
/* Disabled select item text color. */
--kui-select-item-color-text-disabled: initial;
/* Selected select item text color. */
--kui-select-item-color-text-selected: initial;
/* Select item font size. */
--kui-select-item-font-size: initial;
/* Select item line height. */
--kui-select-item-line-height: initial;
/* Select item horizontal padding. */
--kui-select-item-padding-x: initial;
/* Select item vertical padding. */
--kui-select-item-padding-y: initial;
/* Skeleton placeholder box border radius. */
--kui-skeleton-border-radius: initial;
/* Card skeleton wrapper border radius. */
--kui-skeleton-card-border-radius: initial;
/* Card skeleton wrapper border width. */
--kui-skeleton-card-border-width: initial;
/* Card skeleton wrapper border color. */
--kui-skeleton-card-color-border: initial;
/* Skeleton placeholder base background color (the resting/non-highlighted gradient stops of the shimmer). */
--kui-skeleton-color-background: initial;
/* Skeleton placeholder animated shimmer/highlight color (the moving bright gradient stop). */
--kui-skeleton-color-background-shimmer: initial;
/* Fullscreen skeleton loader backdrop/overlay background color. */
--kui-skeleton-fullscreen-color-background: initial;
/* Fullscreen skeleton progress bar (track and fill) border radius. */
--kui-skeleton-progress-border-radius: initial;
/* Fullscreen skeleton progress bar track background color. */
--kui-skeleton-progress-color-background: initial;
/* Fullscreen skeleton progress bar fill (completed progress) background color. */
--kui-skeleton-progress-color-background-active: initial;
/* Fullscreen generic spinner border radius. */
--kui-skeleton-spinner-border-radius: initial;
/* Fullscreen generic spinner track (inactive) border color. */
--kui-skeleton-spinner-color-border: initial;
/* Fullscreen generic spinner active (leading) segment border color. */
--kui-skeleton-spinner-color-border-active: initial;
/* Table skeleton row divider border width. */
--kui-skeleton-table-border-width: initial;
/* Table skeleton row divider border color. */
--kui-skeleton-table-color-border: initial;
/* Slideout panel left border width. */
--kui-slideout-border-width: initial;
/* Slideout close button border radius. */
--kui-slideout-close-border-radius: initial;
/* Slideout close button icon color on hover and focus. */
--kui-slideout-close-color-text-hover: initial;
/* Slideout close button focus-visible shadow. */
--kui-slideout-close-shadow-focus: initial;
/* Slideout panel background color. */
--kui-slideout-color-background: initial;
/* Slideout panel left border color. */
--kui-slideout-color-border: initial;
/* Slideout content text color. */
--kui-slideout-color-text: initial;
/* Slideout content font family. */
--kui-slideout-font-family: initial;
/* Slideout content font size. */
--kui-slideout-font-size: initial;
/* Slideout content font weight. */
--kui-slideout-font-weight: initial;
/* Slideout content line height. */
--kui-slideout-line-height: initial;
/* Slideout panel inner padding. */
--kui-slideout-padding: initial;
/* Slideout panel box shadow. */
--kui-slideout-shadow: initial;
/* Slideout title font family. */
--kui-slideout-title-font-family: initial;
/* Slideout title font size. */
--kui-slideout-title-font-size: initial;
/* Slideout title font weight. */
--kui-slideout-title-font-weight: initial;
/* Slideout title line height. */
--kui-slideout-title-line-height: initial;
/* Slider filled (progress) track background color. */
--kui-slider-fill-color-background: initial;
/* Slider filled (progress) track background color when disabled. */
--kui-slider-fill-color-background-disabled: initial;
/* Slider mark label text color. */
--kui-slider-mark-color-text: initial;
/* Slider mark label font family. */
--kui-slider-mark-font-family: initial;
/* Slider mark label font size. */
--kui-slider-mark-font-size: initial;
/* Slider mark label font weight. */
--kui-slider-mark-font-weight: initial;
/* Slider mark label line height. */
--kui-slider-mark-line-height: initial;
/* Slider thumb (handle) border radius. */
--kui-slider-thumb-border-radius: initial;
/* Slider thumb (handle) background color. */
--kui-slider-thumb-color-background: initial;
/* Slider thumb (handle) background color when disabled. */
--kui-slider-thumb-color-background-disabled: initial;
/* Slider thumb (handle) focus-visible shadow. */
--kui-slider-thumb-shadow-focus: initial;
/* Slider thumb (handle) height and width. */
--kui-slider-thumb-size: initial;
/* Slider track border radius. */
--kui-slider-track-border-radius: initial;
/* Slider track (unfilled) background color. */
--kui-slider-track-color-background: initial;
/* Stepper step indicator (circle) border radius. */
--kui-stepper-border-radius: initial;
/* Stepper step indicator (circle) border width, applied to incomplete (default) steps. */
--kui-stepper-border-width: initial;
/* Stepper step indicator (circle) background color for incomplete (default) and pending steps. */
--kui-stepper-color-background: initial;
/* Stepper step indicator (circle) background color for completed steps. */
--kui-stepper-color-background-completed: initial;
/* Stepper step indicator (circle) background color for steps in an error state. */
--kui-stepper-color-background-error: initial;
/* Stepper step indicator (circle) background color for the current/active step. */
--kui-stepper-color-background-selected: initial;
/* Stepper step indicator (circle) border color for incomplete (default) steps. */
--kui-stepper-color-border: initial;
/* Stepper step number text color inside the step indicator (circle) for incomplete (default) and pending steps. */
--kui-stepper-color-text: initial;
/* Stepper step label text color. */
--kui-stepper-color-text-label: initial;
/* Stepper step label text color for the current/active and completed steps. */
--kui-stepper-color-text-label-selected: initial;
/* Stepper step number text color inside the step indicator (circle) for the current/active step. */
--kui-stepper-color-text-selected: initial;
/* Stepper connector line color between steps. */
--kui-stepper-connector-color-background: initial;
/* Stepper connector line color following a completed step. */
--kui-stepper-connector-color-background-completed: initial;
/* Stepper step label font family. */
--kui-stepper-font-family: initial;
/* Stepper step number and label font weight. */
--kui-stepper-font-weight: initial;
/* Table body cell text color. */
--kui-table-cell-color-text: initial;
/* Table body cell font size. */
--kui-table-cell-font-size: initial;
/* Table body cell font weight. */
--kui-table-cell-font-weight: initial;
/* Table body cell line height. */
--kui-table-cell-line-height: initial;
/* Table body cell resize-handle hover indicator shadow. */
--kui-table-cell-shadow-resize-hover: initial;
/* Table background color. */
--kui-table-color-background: initial;
/* Table font family. */
--kui-table-font-family: initial;
/* Table header bottom border color. */
--kui-table-header-color-border: initial;
/* Table header text color. */
--kui-table-header-color-text: initial;
/* Table header text color when the column is the active sort column. */
--kui-table-header-color-text-active-sort: initial;
/* Table header font size. */
--kui-table-header-font-size: initial;
/* Table header font weight. */
--kui-table-header-font-weight: initial;
/* Table header line height. */
--kui-table-header-line-height: initial;
/* Table header cell inner padding. */
--kui-table-header-padding: initial;
/* Table header resize-handle hover indicator shadow. */
--kui-table-header-shadow-resize-hover: initial;
/* Table header shadow when the table body is scrolled. */
--kui-table-header-shadow-scrolled: initial;
/* Table cell inner padding. */
--kui-table-padding: initial;
/* Table expanded (expandable content) row background color. */
--kui-table-row-color-background-expanded: initial;
/* Table row background color on hover. */
--kui-table-row-color-background-hover: initial;
/* Table row divider (bottom border) color. */
--kui-table-row-color-border: initial;
/* Table sticky column (and actions column) cell background color. */
--kui-table-sticky-color-background: initial;
/* Tabs tab link border radius (default appearance). */
--kui-tabs-border-radius: initial;
/* Tabs tab link border radius (minimal appearance). */
--kui-tabs-border-radius-minimal: initial;
/* Tabs container bottom border width (default appearance). */
--kui-tabs-border-width: initial;
/* Tabs current (selected) tab bottom border width — the active-tab underline (default appearance). */
--kui-tabs-border-width-selected: initial;
/* Tabs tab link background color on hover (default appearance). */
--kui-tabs-color-background-hover: initial;
/* Tabs container bottom border color (default appearance). */
--kui-tabs-color-border: initial;
/* Tabs current (selected) tab bottom border color — the active-tab underline (default appearance). */
--kui-tabs-color-border-selected: initial;
/* Tabs tab link text color. */
--kui-tabs-color-text: initial;
/* Tabs tab link text color when disabled. */
--kui-tabs-color-text-disabled: initial;
/* Tabs tab link text color on hover and focus (default appearance). */
--kui-tabs-color-text-hover: initial;
/* Tabs tab link text color on hover (minimal appearance). */
--kui-tabs-color-text-minimal-hover: initial;
/* Tabs current (selected) tab link text color. */
--kui-tabs-color-text-selected: initial;
/* Tabs font family. */
--kui-tabs-font-family: initial;
/* Tabs tab link font size (default appearance). */
--kui-tabs-font-size: initial;
/* Tabs tab link font size (minimal appearance). */
--kui-tabs-font-size-minimal: initial;
/* Tabs tab link font weight (default appearance). */
--kui-tabs-font-weight: initial;
/* Tabs tab link font weight (minimal appearance). */
--kui-tabs-font-weight-minimal: initial;
/* Tabs tab link line height (default appearance). */
--kui-tabs-line-height: initial;
/* Tabs tab link line height (minimal appearance). */
--kui-tabs-line-height-minimal: initial;
/* Tabs tab link inner padding (default appearance). */
--kui-tabs-padding: initial;
/* Tabs tab link focus-visible shadow. */
--kui-tabs-shadow-focus: initial;
/* Toaster border radius. */
--kui-toaster-border-radius: initial;
/* Toaster close button border radius. */
--kui-toaster-close-border-radius: initial;
/* Toaster close button icon color on hover and focus. */
--kui-toaster-close-color-text-hover: initial;
/* Toaster close button focus-visible shadow. */
--kui-toaster-close-shadow-focus: initial;
/* Toaster background color. */
--kui-toaster-color-background: initial;
/* Toaster text color. */
--kui-toaster-color-text: initial;
/* Toaster message font family. */
--kui-toaster-font-family: initial;
/* Toaster message font size. */
--kui-toaster-font-size: initial;
/* Toaster message font weight. */
--kui-toaster-font-weight: initial;
/* Toaster icon color (knockout matching the toaster background). */
--kui-toaster-icon-color: initial;
/* Toaster icon container background color (info appearance as default). */
--kui-toaster-icon-color-background: initial;
/* Danger toaster icon container background color. */
--kui-toaster-icon-color-background-danger: initial;
/* Info toaster icon container background color. */
--kui-toaster-icon-color-background-info: initial;
/* Success toaster icon container background color. */
--kui-toaster-icon-color-background-success: initial;
/* System toaster icon container background color. */
--kui-toaster-icon-color-background-system: initial;
/* Warning toaster icon container background color. */
--kui-toaster-icon-color-background-warning: initial;
/* Toaster message line height. */
--kui-toaster-line-height: initial;
/* Toaster inner padding. */
--kui-toaster-padding: initial;
/* Toaster box shadow. */
--kui-toaster-shadow: initial;
/* Toaster title font size. */
--kui-toaster-title-font-size: initial;
/* Toaster title font weight. */
--kui-toaster-title-font-weight: initial;
/* Toaster title line height. */
--kui-toaster-title-line-height: initial;
/* Tooltip border radius. */
--kui-tooltip-border-radius: initial;
/* Tooltip background color. */
--kui-tooltip-color-background: initial;
/* Tooltip text color. */
--kui-tooltip-color-text: initial;
/* Tooltip font family. */
--kui-tooltip-font-family: initial;
/* Tooltip font size. */
--kui-tooltip-font-size: initial;
/* Tooltip font weight. */
--kui-tooltip-font-weight: initial;
/* Tooltip line height. */
--kui-tooltip-line-height: initial;
/* Tooltip inner padding. */
--kui-tooltip-padding: initial;
/* Tree list item border radius (also applied to the expand/collapse toggle focus ring). */
--kui-tree-list-border-radius: initial;
/* Tree list item border width. */
--kui-tree-list-border-width: initial;
/* Tree list item background color. */
--kui-tree-list-color-background: initial;
/* Tree list drag indicator bar background color, shown when dragging an item to a drop location. */
--kui-tree-list-color-background-drag-indicator: initial;
/* Tree list item background color on hover, focus, and focus-visible. */
--kui-tree-list-color-background-hover: initial;
/* Tree list item background color when selected. */
--kui-tree-list-color-background-selected: initial;
/* Tree list item border color. */
--kui-tree-list-color-border: initial;
/* Tree list connecting line color (the lines linking parent and child items). */
--kui-tree-list-color-border-connector: initial;
/* Tree list item border color when selected. */
--kui-tree-list-color-border-selected: initial;
/* Tree list item text color. */
--kui-tree-list-color-text: initial;
/* Tree list item leading icon color. */
--kui-tree-list-color-text-icon: initial;
/* Tree list item leading icon color when selected. */
--kui-tree-list-color-text-icon-selected: initial;
/* Tree list font family. */
--kui-tree-list-font-family: initial;
/* Tree list item font weight. */
--kui-tree-list-font-weight: initial;
/* Tree list item padding. */
--kui-tree-list-padding: initial;
/* Tree list item focus-visible shadow (focus ring). */
--kui-tree-list-shadow-focus: initial;
/* Truncate collapse trigger button background color. */
--kui-truncate-collapse-trigger-color-background: initial;
/* Truncate collapse trigger button background color on hover, focus, and focus-within. */
--kui-truncate-collapse-trigger-color-background-hover: initial;
/* Truncate collapse trigger button text color. */
--kui-truncate-collapse-trigger-color-text: initial;
/* Truncate expand trigger button text color. */
--kui-truncate-expand-trigger-color-text: initial;
/* Truncate expand trigger button text color on hover and focus. */
--kui-truncate-expand-trigger-color-text-hover: initial;
/* Truncate expand and collapse trigger button focus-visible ring shadow. */
--kui-truncate-shadow-focus: initial;
```

</details>

## JavaScript

### JavaScript / TypeScript Constants

<details>

<summary>Click to view the list of JavaScript variables</summary>

```javascript
/* Default background color for containers (white). */
export const KUI_COLOR_BACKGROUND = "#ffffff";
/* Accent background color for emphasis on non-primary UI. Distinct from the primary action color, used to add touches of the theme accent color across themes. */
export const KUI_COLOR_BACKGROUND_ACCENT = "#0044f4";
/* Background color for danger actions or messages (red.60). */
export const KUI_COLOR_BACKGROUND_DANGER = "#d60027";
/* Strong background color for danger actions or messages (red.70). */
export const KUI_COLOR_BACKGROUND_DANGER_STRONG = "#ad000e";
/* Stronger background color for danger actions or messages (red.80). */
export const KUI_COLOR_BACKGROUND_DANGER_STRONGER = "#850000";
/* Strongest background color for danger actions or messages (red.90). */
export const KUI_COLOR_BACKGROUND_DANGER_STRONGEST = "#5c0000";
/* Weak background color for danger actions or messages (red.40). */
export const KUI_COLOR_BACKGROUND_DANGER_WEAK = "#ff3954";
/* Weaker background color for danger actions or messages (red.20). */
export const KUI_COLOR_BACKGROUND_DANGER_WEAKER = "#ffabab";
/* Weakest background color for danger actions or messages (red.10). */
export const KUI_COLOR_BACKGROUND_DANGER_WEAKEST = "#ffe5e5";
/* Weakest background color for decorative purposes (aqua.10). */
export const KUI_COLOR_BACKGROUND_DECORATIVE_AQUA_WEAKEST = "#ecfcff";
/* Background color for decorative purposes (purple.60). */
export const KUI_COLOR_BACKGROUND_DECORATIVE_PURPLE = "#6f28ff";
/* Weakest background color for decorative purposes (purple.10). */
export const KUI_COLOR_BACKGROUND_DECORATIVE_PURPLE_WEAKEST = "#f1f0ff";
/* Background color for disabled elements (gray.20). */
export const KUI_COLOR_BACKGROUND_DISABLED = "#e0e4ea";
/* Background color for info elements (blue.60). */
export const KUI_COLOR_BACKGROUND_INFO = "#0044f4";
/* Strong background color for info elements (blue.70). */
export const KUI_COLOR_BACKGROUND_INFO_STRONG = "#0030cc";
/* Stronger background color for info elements (blue.80). */
export const KUI_COLOR_BACKGROUND_INFO_STRONGER = "#002099";
/* Strongest background color for info elements (blue.90). */
export const KUI_COLOR_BACKGROUND_INFO_STRONGEST = "#001466";
/* Weak background color for info elements (blue.40). */
export const KUI_COLOR_BACKGROUND_INFO_WEAK = "#5f9aff";
/* Weaker background color for info elements (blue.20). */
export const KUI_COLOR_BACKGROUND_INFO_WEAKER = "#bee2ff";
/* Weakest background color for info elements (blue.10). */
export const KUI_COLOR_BACKGROUND_INFO_WEAKEST = "#eefaff";
/* Inverse background color for containers (blue.100) */
export const KUI_COLOR_BACKGROUND_INVERSE = "#000933";
/* Background color for neutral elements (gray.60). */
export const KUI_COLOR_BACKGROUND_NEUTRAL = "#6c7489";
/* Strong background color for neutral elements (gray.70). */
export const KUI_COLOR_BACKGROUND_NEUTRAL_STRONG = "#52596e";
/* Stronger background color for neutral elements (gray.80). */
export const KUI_COLOR_BACKGROUND_NEUTRAL_STRONGER = "#3a3f51";
/* Strongest background color for neutral elements (gray.90). */
export const KUI_COLOR_BACKGROUND_NEUTRAL_STRONGEST = "#232633";
/* Weak background color for neutral elements (gray.40). */
export const KUI_COLOR_BACKGROUND_NEUTRAL_WEAK = "#afb7c5";
/* Weaker background color for neutral elements (gray.20). */
export const KUI_COLOR_BACKGROUND_NEUTRAL_WEAKER = "#e0e4ea";
/* Weakest background color for neutral elements (gray.10). */
export const KUI_COLOR_BACKGROUND_NEUTRAL_WEAKEST = "#f9fafb";
/* Overlay background color (rgba(0, 9, 51, 0.6)) */
export const KUI_COLOR_BACKGROUND_OVERLAY = "rgba(0, 9, 51, 0.6)";
/* Background color for primary actions or messages (blue.60). */
export const KUI_COLOR_BACKGROUND_PRIMARY = "#0044f4";
/* Strong background color for primary actions or messages (blue.70). */
export const KUI_COLOR_BACKGROUND_PRIMARY_STRONG = "#0030cc";
/* Stronger background color for primary actions or messages (blue.80). */
export const KUI_COLOR_BACKGROUND_PRIMARY_STRONGER = "#002099";
/* Strongest background color for primary actions or messages (blue.90). */
export const KUI_COLOR_BACKGROUND_PRIMARY_STRONGEST = "#001466";
/* Weak background color for primary actions or messages (blue.40). */
export const KUI_COLOR_BACKGROUND_PRIMARY_WEAK = "#5f9aff";
/* Weaker background color for primary actions or messages (blue.20). */
export const KUI_COLOR_BACKGROUND_PRIMARY_WEAKER = "#bee2ff";
/* Weakest background color for primary actions or messages (blue.10) */
export const KUI_COLOR_BACKGROUND_PRIMARY_WEAKEST = "#eefaff";
/* Background color for success elements (green.60). */
export const KUI_COLOR_BACKGROUND_SUCCESS = "#007d60";
/* Strong background color for success elements (green.70). */
export const KUI_COLOR_BACKGROUND_SUCCESS_STRONG = "#005944";
/* Stronger background color for success elements (green.80). */
export const KUI_COLOR_BACKGROUND_SUCCESS_STRONGER = "#004737";
/* Strongest background color for success elements (green.90). */
export const KUI_COLOR_BACKGROUND_SUCCESS_STRONGEST = "#003629";
/* Weak background color for success elements (green.40). */
export const KUI_COLOR_BACKGROUND_SUCCESS_WEAK = "#00d6a4";
/* Weaker background color for success elements (green.20). */
export const KUI_COLOR_BACKGROUND_SUCCESS_WEAKER = "#b5ffee";
/* Weakest background color for success elements (green.10). */
export const KUI_COLOR_BACKGROUND_SUCCESS_WEAKEST = "#ecfffb";
/* Transparent background color (transparent). */
export const KUI_COLOR_BACKGROUND_TRANSPARENT = "rgba(0, 0, 0, 0)";
/* Background color for warning elements (yellow.60). */
export const KUI_COLOR_BACKGROUND_WARNING = "#995c00";
/* Strong background color for warning elements (yellow.70). */
export const KUI_COLOR_BACKGROUND_WARNING_STRONG = "#804400";
/* Stronger background color for warning elements (yellow.80). */
export const KUI_COLOR_BACKGROUND_WARNING_STRONGER = "#662d00";
/* Strongest background color for warning elements (yellow.90). */
export const KUI_COLOR_BACKGROUND_WARNING_STRONGEST = "#4d1b00";
/* Weak background color for warning elements (yellow.40). */
export const KUI_COLOR_BACKGROUND_WARNING_WEAK = "#ffc400";
/* Weaker background color for warning elements (yellow.20). */
export const KUI_COLOR_BACKGROUND_WARNING_WEAKER = "#fff296";
/* Weakest background color for warning elements (yellow.10). */
export const KUI_COLOR_BACKGROUND_WARNING_WEAKEST = "#fffce0";
/* Default border color for containers (gray.20). */
export const KUI_COLOR_BORDER = "#e0e4ea";
/* Accent border color for emphasis on non-primary UI. Distinct from the primary action color, used to add touches of the theme accent color across themes. */
export const KUI_COLOR_BORDER_ACCENT = "#0044f4";
/* Border color for danger actions or messages (red.60). */
export const KUI_COLOR_BORDER_DANGER = "#d60027";
/* Strong border color for danger actions or messages (red.70). */
export const KUI_COLOR_BORDER_DANGER_STRONG = "#ad000e";
/* Stronger border color for danger actions or messages (red.80). */
export const KUI_COLOR_BORDER_DANGER_STRONGER = "#850000";
/* Strongest border color for danger actions or messages (red.90). */
export const KUI_COLOR_BORDER_DANGER_STRONGEST = "#5c0000";
/* Weak border color for danger actions or messages (red.40). */
export const KUI_COLOR_BORDER_DANGER_WEAK = "#ff3954";
/* Weaker border color for danger actions or messages (red.20). */
export const KUI_COLOR_BORDER_DANGER_WEAKER = "#ffabab";
/* Weakest border color for danger actions or messages (red.10). */
export const KUI_COLOR_BORDER_DANGER_WEAKEST = "#ffe5e5";
/* Border color for decorative purposes (purple.60). */
export const KUI_COLOR_BORDER_DECORATIVE_PURPLE = "#6f28ff";
/* Border color for disabled elements (gray.20). */
export const KUI_COLOR_BORDER_DISABLED = "#e0e4ea";
/* Inverse border color (rgba(255, 255, 255, 0.2)). */
export const KUI_COLOR_BORDER_INVERSE = "rgba(255, 255, 255, 0.2)";
/* Border color for neutral elements (gray.60) */
export const KUI_COLOR_BORDER_NEUTRAL = "#6c7489";
/* Strong border color for neutral elements (gray.70) */
export const KUI_COLOR_BORDER_NEUTRAL_STRONG = "#52596e";
/* Stronger border color for neutral elements (gray.80) */
export const KUI_COLOR_BORDER_NEUTRAL_STRONGER = "#3a3f51";
/* Strongest border color for neutral elements (gray.90) */
export const KUI_COLOR_BORDER_NEUTRAL_STRONGEST = "#232633";
/* Weak border color for neutral elements (gray.40) */
export const KUI_COLOR_BORDER_NEUTRAL_WEAK = "#afb7c5";
/* Weaker border color for neutral elements (gray.20) */
export const KUI_COLOR_BORDER_NEUTRAL_WEAKER = "#e0e4ea";
/* Weakest border color for neutral elements (gray.10) */
export const KUI_COLOR_BORDER_NEUTRAL_WEAKEST = "#f9fafb";
/* Border color for primary actions or messages (blue.60). */
export const KUI_COLOR_BORDER_PRIMARY = "#0044f4";
/* Strong border color for primary actions or messages (blue.70). */
export const KUI_COLOR_BORDER_PRIMARY_STRONG = "#0030cc";
/* Stronger border color for primary actions or messages (blue.80). */
export const KUI_COLOR_BORDER_PRIMARY_STRONGER = "#002099";
/* Strongest border color for primary actions or messages (blue.90). */
export const KUI_COLOR_BORDER_PRIMARY_STRONGEST = "#001466";
/* Weak border color for primary actions or messages (blue.40). */
export const KUI_COLOR_BORDER_PRIMARY_WEAK = "#5f9aff";
/* Weaker border color for primary actions or messages (blue.20). */
export const KUI_COLOR_BORDER_PRIMARY_WEAKER = "#bee2ff";
/* Weakest border color for primary actions or messages (blue.10). */
export const KUI_COLOR_BORDER_PRIMARY_WEAKEST = "#eefaff";
/* Transparent border color (transparent). */
export const KUI_COLOR_BORDER_TRANSPARENT = "rgba(0, 0, 0, 0)";
/* Default text color (blue.100). */
export const KUI_COLOR_TEXT = "#000933";
/* Accent text color for emphasis on non-primary UI. Distinct from the primary action color, used to add touches of the theme accent color across themes. */
export const KUI_COLOR_TEXT_ACCENT = "#0044f4";
/* Text color for danger actions or messages (red.60). */
export const KUI_COLOR_TEXT_DANGER = "#d60027";
/* Strong text color for danger actions or messages (red.70). */
export const KUI_COLOR_TEXT_DANGER_STRONG = "#ad000e";
/* Stronger text color for danger actions or messages (red.80). */
export const KUI_COLOR_TEXT_DANGER_STRONGER = "#850000";
/* Strongest text color for danger actions or messages (red.90). */
export const KUI_COLOR_TEXT_DANGER_STRONGEST = "#5c0000";
/* Weak text color for danger actions or messages (red.40). */
export const KUI_COLOR_TEXT_DANGER_WEAK = "#ff3954";
/* Weaker text color for danger actions or messages (red.20). */
export const KUI_COLOR_TEXT_DANGER_WEAKER = "#ffabab";
/* Weakest text color for danger actions or messages (red.10). */
export const KUI_COLOR_TEXT_DANGER_WEAKEST = "#ffe5e5";
/* Text color for decorative purposes (aqua.50). */
export const KUI_COLOR_TEXT_DECORATIVE_AQUA = "#00abd2";
/* Text color for decorative purposes (pink.60). */
export const KUI_COLOR_TEXT_DECORATIVE_PINK = "#d60067";
/* Text color for decorative purposes (purple.60). */
export const KUI_COLOR_TEXT_DECORATIVE_PURPLE = "#6f28ff";
/* Strong text color for decorative purposes (purple.70). */
export const KUI_COLOR_TEXT_DECORATIVE_PURPLE_STRONG = "#5e00f5";
/* Text color for disabled elements (gray.40). */
export const KUI_COLOR_TEXT_DISABLED = "#afb7c5";
/* Text color for info elements (blue.60). */
export const KUI_COLOR_TEXT_INFO = "#0044f4";
/* Strong text color for info elements (blue.70). */
export const KUI_COLOR_TEXT_INFO_STRONG = "#0030cc";
/* Stronger text color for info elements (blue.80). */
export const KUI_COLOR_TEXT_INFO_STRONGER = "#002099";
/* Strongest text color for info elements (blue.90). */
export const KUI_COLOR_TEXT_INFO_STRONGEST = "#001466";
/* Weak text color for info elements (blue.40). */
export const KUI_COLOR_TEXT_INFO_WEAK = "#5f9aff";
/* Weaker text color for info elements (blue.20). */
export const KUI_COLOR_TEXT_INFO_WEAKER = "#bee2ff";
/* Weakest text color for info elements (blue.10). */
export const KUI_COLOR_TEXT_INFO_WEAKEST = "#eefaff";
/* Inverse text color (white). */
export const KUI_COLOR_TEXT_INVERSE = "#ffffff";
/* Text color for neutral elements (gray.60). */
export const KUI_COLOR_TEXT_NEUTRAL = "#6c7489";
/* Strong text color for neutral elements (gray.70). */
export const KUI_COLOR_TEXT_NEUTRAL_STRONG = "#52596e";
/* Stronger text color for neutral elements (gray.80). */
export const KUI_COLOR_TEXT_NEUTRAL_STRONGER = "#3a3f51";
/* Strongest text color for neutral elements (gray.90). */
export const KUI_COLOR_TEXT_NEUTRAL_STRONGEST = "#232633";
/* Weak text color for neutral elements (gray.40). */
export const KUI_COLOR_TEXT_NEUTRAL_WEAK = "#afb7c5";
/* Weaker text color for neutral elements (gray.20). */
export const KUI_COLOR_TEXT_NEUTRAL_WEAKER = "#e0e4ea";
/* Weakest text color for neutral elements (gray.10). */
export const KUI_COLOR_TEXT_NEUTRAL_WEAKEST = "#f9fafb";
/* Text color for primary actions or messages (blue.60). */
export const KUI_COLOR_TEXT_PRIMARY = "#0044f4";
/* Strong text color for primary actions or messages (blue.70). */
export const KUI_COLOR_TEXT_PRIMARY_STRONG = "#0030cc";
/* Stronger text color for primary actions or messages (blue.80). */
export const KUI_COLOR_TEXT_PRIMARY_STRONGER = "#002099";
/* Strongest text color for primary actions or messages (blue.90). */
export const KUI_COLOR_TEXT_PRIMARY_STRONGEST = "#001466";
/* Weak text color for primary actions or messages (blue.40). */
export const KUI_COLOR_TEXT_PRIMARY_WEAK = "#5f9aff";
/* Weaker text color for primary actions or messages (blue.20). */
export const KUI_COLOR_TEXT_PRIMARY_WEAKER = "#bee2ff";
/* Weakest text color for primary actions or messages (blue.10). */
export const KUI_COLOR_TEXT_PRIMARY_WEAKEST = "#eefaff";
/* Text color for success elements (green.60). */
export const KUI_COLOR_TEXT_SUCCESS = "#007d60";
/* Strong text color for success elements (green.70). */
export const KUI_COLOR_TEXT_SUCCESS_STRONG = "#005944";
/* Stronger text color for success elements (green.80). */
export const KUI_COLOR_TEXT_SUCCESS_STRONGER = "#004737";
/* Stronger text color for success elements (green.90). */
export const KUI_COLOR_TEXT_SUCCESS_STRONGEST = "#003629";
/* Weak text color for success elements (green.40). */
export const KUI_COLOR_TEXT_SUCCESS_WEAK = "#00d6a4";
/* Weaker text color for success elements (green.20). */
export const KUI_COLOR_TEXT_SUCCESS_WEAKER = "#b5ffee";
/* Weakest text color for success elements (green.10). */
export const KUI_COLOR_TEXT_SUCCESS_WEAKEST = "#ecfffb";
/* Text color for warning elements (yellow.60). */
export const KUI_COLOR_TEXT_WARNING = "#995c00";
/* Strong text color for warning elements (yellow.70). */
export const KUI_COLOR_TEXT_WARNING_STRONG = "#804400";
/* Stronger text color for warning elements (yellow.80). */
export const KUI_COLOR_TEXT_WARNING_STRONGER = "#662d00";
/* Strongest text color for warning elements (yellow.90). */
export const KUI_COLOR_TEXT_WARNING_STRONGEST = "#4d1b00";
/* Weak text color for warning elements (yellow.40). */
export const KUI_COLOR_TEXT_WARNING_WEAK = "#ffc400";
/* Weaker text color for warning elements (yellow.20). */
export const KUI_COLOR_TEXT_WARNING_WEAKER = "#fff296";
/* Weakest text color for warning elements (yellow.10). */
export const KUI_COLOR_TEXT_WARNING_WEAKEST = "#fffce0";
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
/* 700: The bold font weight. */
export const KUI_FONT_WEIGHT_BOLD = "700";
/* 500: The medium font weight. */
export const KUI_FONT_WEIGHT_MEDIUM = "500";
/* 400: The normal font weight. */
export const KUI_FONT_WEIGHT_REGULAR = "400";
/* 600: The semibold font weight. */
export const KUI_FONT_WEIGHT_SEMIBOLD = "600";
/* Danger color for icons. */
export const KUI_ICON_COLOR_DANGER = "#f50045";
/* Neutral color for icons. */
export const KUI_ICON_COLOR_NEUTRAL = "#828a9e";
/* Primary color for icons. */
export const KUI_ICON_COLOR_PRIMARY = "#306fff";
/* Success color for icons. */
export const KUI_ICON_COLOR_SUCCESS = "#00a17b";
/* Warning color for icons. */
export const KUI_ICON_COLOR_WARNING = "#ffc400";
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
/* Background color for the CONNECT method (purple.10). */
export const KUI_METHOD_COLOR_BACKGROUND_CONNECT = "#f1f0ff";
/* Background color for the DELETE method (red.10). */
export const KUI_METHOD_COLOR_BACKGROUND_DELETE = "#ffe5e5";
/* Background color for the GET method (blue.10). */
export const KUI_METHOD_COLOR_BACKGROUND_GET = "#eefaff";
/* Background color for the HEAD method (gray.70). */
export const KUI_METHOD_COLOR_BACKGROUND_HEAD = "#52596e";
/* Background color for the OPTIONS method (gray.20). */
export const KUI_METHOD_COLOR_BACKGROUND_OPTIONS = "#e0e4ea";
/* Background color for the PATCH method (aqua.10). */
export const KUI_METHOD_COLOR_BACKGROUND_PATCH = "#ecfcff";
/* Background color for the POST method (green.10). */
export const KUI_METHOD_COLOR_BACKGROUND_POST = "#ecfffb";
/* Background color for the PUT method (yellow.10). */
export const KUI_METHOD_COLOR_BACKGROUND_PUT = "#fffce0";
/* Background color for the TRACE method (pink.10). */
export const KUI_METHOD_COLOR_BACKGROUND_TRACE = "#fff0f7";
/* Text color for the CONNECT method (purple.60). */
export const KUI_METHOD_COLOR_TEXT_CONNECT = "#6f28ff";
/* Strong text color for the CONNECT method (purple.70). */
export const KUI_METHOD_COLOR_TEXT_CONNECT_STRONG = "#5e00f5";
/* Text color for the DELETE method (red.60). */
export const KUI_METHOD_COLOR_TEXT_DELETE = "#d60027";
/* Strong text color for the DELETE method (red.70). */
export const KUI_METHOD_COLOR_TEXT_DELETE_STRONG = "#ad000e";
/* Text color for the GET method (blue.60). */
export const KUI_METHOD_COLOR_TEXT_GET = "#0044f4";
/* Strong text color for the GET method (blue.70). */
export const KUI_METHOD_COLOR_TEXT_GET_STRONG = "#0030cc";
/* Text color for the HEAD method (gray.20). */
export const KUI_METHOD_COLOR_TEXT_HEAD = "#e0e4ea";
/* Strong text color for the HEAD method (gray.40). */
export const KUI_METHOD_COLOR_TEXT_HEAD_STRONG = "#afb7c5";
/* Text color for the OPTIONS method (gray.70). */
export const KUI_METHOD_COLOR_TEXT_OPTIONS = "#52596e";
/* Strong text color for the OPTIONS method (gray.80). */
export const KUI_METHOD_COLOR_TEXT_OPTIONS_STRONG = "#3a3f51";
/* Text color for the PATCH method (aqua.60). */
export const KUI_METHOD_COLOR_TEXT_PATCH = "#00819d";
/* Strong text color for the PATCH method (aqua.70). */
export const KUI_METHOD_COLOR_TEXT_PATCH_STRONG = "#00647a";
/* Text color for the POST method (green.60). */
export const KUI_METHOD_COLOR_TEXT_POST = "#007d60";
/* Strong text color for the POST method (green.70). */
export const KUI_METHOD_COLOR_TEXT_POST_STRONG = "#005944";
/* Text color for the PUT method (yellow.60). */
export const KUI_METHOD_COLOR_TEXT_PUT = "#995c00";
/* Strong text color for the PUT method (yellow.70). */
export const KUI_METHOD_COLOR_TEXT_PUT_STRONG = "#804400";
/* Text color for the TRACE method (pink.60). */
export const KUI_METHOD_COLOR_TEXT_TRACE = "#d60067";
/* Strong text color for the TRACE method (pink.70). */
export const KUI_METHOD_COLOR_TEXT_TRACE_STRONG = "#ad0053";
/* blue.100 */
export const KUI_NAVIGATION_COLOR_BACKGROUND = "#000933";
/* The background color of a selected navigation item. */
export const KUI_NAVIGATION_COLOR_BACKGROUND_SELECTED = "rgba(255, 255, 255, 0.12)";
/* rgba(255, 255, 255, 0.12) */
export const KUI_NAVIGATION_COLOR_BORDER = "rgba(255, 255, 255, 0.12)";
/* The border color for a selected child navigation item. */
export const KUI_NAVIGATION_COLOR_BORDER_CHILD = "#00fabe";
/* The color of the navigation section divider. */
export const KUI_NAVIGATION_COLOR_BORDER_DIVIDER = "rgba(255, 255, 255, 0.24)";
/* Navigation link and icon color. */
export const KUI_NAVIGATION_COLOR_TEXT = "#bee2ff";
/* Navigation link and icon focus-visible color. */
export const KUI_NAVIGATION_COLOR_TEXT_FOCUS = "#ffffff";
/* Navigation link and icon hover color. */
export const KUI_NAVIGATION_COLOR_TEXT_HOVER = "#eefaff";
/* Navigation link and icon selected color. */
export const KUI_NAVIGATION_COLOR_TEXT_SELECTED = "#00fabe";
/* The box-shadow for a focus-visible navigation link. */
export const KUI_NAVIGATION_SHADOW_BORDER = "0 0 0 1px rgba(255, 255, 255, 0.12) inset";
/* The left box-shadow for an active child navigation link. */
export const KUI_NAVIGATION_SHADOW_BORDER_CHILD = "4px 0 0 0 #00fabe inset";
/* Navigation link focus-visible box-shadow. */
export const KUI_NAVIGATION_SHADOW_FOCUS = "0 0 0 1px rgba(255, 255, 255, 0.60) inset";
/* 0px 4px 20px 0px rgba(0, 0, 0, 0.08) */
export const KUI_SHADOW = "0px 4px 20px 0px rgba(0, 0, 0, 0.08)";
/* 0px 0px 0px 1px gray.20 inset */
export const KUI_SHADOW_BORDER = "0px 0px 0px 1px #e0e4ea inset";
/* 0px 0px 0px 1px red.60 inset */
export const KUI_SHADOW_BORDER_DANGER = "0px 0px 0px 1px #d60027 inset";
/* 0px 0px 0px 1px red.70 inset */
export const KUI_SHADOW_BORDER_DANGER_STRONG = "0px 0px 0px 1px #ad000e inset";
/* 0px 0px 0px 1px gray.20 inset */
export const KUI_SHADOW_BORDER_DISABLED = "0px 0px 0px 1px #e0e4ea inset";
/* 0px 0px 0px 1px blue.60 inset */
export const KUI_SHADOW_BORDER_PRIMARY = "0px 0px 0px 1px #0044f4 inset";
/* 0px 0px 0px 1px blue.90 inset */
export const KUI_SHADOW_BORDER_PRIMARY_STRONGEST = "0px 0px 0px 1px #001466 inset";
/* 0px 0px 0px 1px blue.40 inset */
export const KUI_SHADOW_BORDER_PRIMARY_WEAK = "0px 0px 0px 1px #5f9aff inset";
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
/* Color representing response status code 100 (blue.20). */
export const KUI_STATUS_COLOR_100 = "#bee2ff";
/* Color representing response status code 101 (blue.30). */
export const KUI_STATUS_COLOR_101 = "#8fc1ff";
/* Color representing response status code 102 (blue.40). */
export const KUI_STATUS_COLOR_102 = "#5f9aff";
/* Color representing response status code 103 (blue.50). */
export const KUI_STATUS_COLOR_103 = "#306fff";
/* Color representing response status code 200 (green.20). */
export const KUI_STATUS_COLOR_200 = "#b5ffee";
/* Color representing response status code 201 (green.30). */
export const KUI_STATUS_COLOR_201 = "#00fabe";
/* Color representing response status code 202 (green.40). */
export const KUI_STATUS_COLOR_202 = "#00d6a4";
/* Color representing response status code 203 (green.50). */
export const KUI_STATUS_COLOR_203 = "#00a17b";
/* Color representing response status code 204 (green.60). */
export const KUI_STATUS_COLOR_204 = "#007d60";
/* Color representing response status code 205 (green.70). */
export const KUI_STATUS_COLOR_205 = "#005944";
/* Color representing response status code 206 (green.20). */
export const KUI_STATUS_COLOR_206 = "#b5ffee";
/* Color representing response status code 207 (green.30). */
export const KUI_STATUS_COLOR_207 = "#00fabe";
/* Color representing response status code 208 (green.40). */
export const KUI_STATUS_COLOR_208 = "#b5ffee";
/* Color representing response status code 226 (green.50). */
export const KUI_STATUS_COLOR_226 = "#00a17b";
/* Color representing response status code 100 (yellow.20). */
export const KUI_STATUS_COLOR_300 = "#fff296";
/* Color representing response status code 101 (yellow.30). */
export const KUI_STATUS_COLOR_301 = "#ffe04b";
/* Color representing response status code 102 (yellow.40). */
export const KUI_STATUS_COLOR_302 = "#ffc400";
/* Color representing response status code 103 (yellow.50). */
export const KUI_STATUS_COLOR_303 = "#b37600";
/* Color representing response status code 103 (yellow.60). */
export const KUI_STATUS_COLOR_304 = "#995c00";
/* Color representing response status code 103 (yellow.70). */
export const KUI_STATUS_COLOR_305 = "#804400";
/* Color representing response status code 103 (yellow.20). */
export const KUI_STATUS_COLOR_307 = "#fff296";
/* Color representing response status code 103 (yellow.30). */
export const KUI_STATUS_COLOR_308 = "#ffe04b";
/* Color representing response status code 400 (orange.20). */
export const KUI_STATUS_COLOR_400 = "#ffc2b3";
/* Color representing response status code 401 (orange.30). */
export const KUI_STATUS_COLOR_401 = "#ff9877";
/* Color representing response status code 402 (orange.40). */
export const KUI_STATUS_COLOR_402 = "#ff723c";
/* Color representing response status code 403 (orange.50). */
export const KUI_STATUS_COLOR_403 = "#f75008";
/* Color representing response status code 404 (orange.60). */
export const KUI_STATUS_COLOR_404 = "#d13500";
/* Color representing response status code 405 (orange.70). */
export const KUI_STATUS_COLOR_405 = "#a31f00";
/* Color representing response status code 406 (orange.20). */
export const KUI_STATUS_COLOR_406 = "#ffc2b3";
/* Color representing response status code 407 (orange.30). */
export const KUI_STATUS_COLOR_407 = "#ff9877";
/* Color representing response status code 408 (orange.40). */
export const KUI_STATUS_COLOR_408 = "#ff723c";
/* Color representing response status code 409 (orange.50). */
export const KUI_STATUS_COLOR_409 = "#f75008";
/* Color representing response status code 410 (orange.60). */
export const KUI_STATUS_COLOR_410 = "#d13500";
/* Color representing response status code 411 (orange.70). */
export const KUI_STATUS_COLOR_411 = "#a31f00";
/* Color representing response status code 412 (orange.20). */
export const KUI_STATUS_COLOR_412 = "#ffc2b3";
/* Color representing response status code 413 (orange.30). */
export const KUI_STATUS_COLOR_413 = "#ff9877";
/* Color representing response status code 414 (orange.40). */
export const KUI_STATUS_COLOR_414 = "#ff723c";
/* Color representing response status code 415 (orange.50). */
export const KUI_STATUS_COLOR_415 = "#f75008";
/* Color representing response status code 416 (orange.60). */
export const KUI_STATUS_COLOR_416 = "#d13500";
/* Color representing response status code 417 (orange.70). */
export const KUI_STATUS_COLOR_417 = "#a31f00";
/* Color representing response status code 418 (orange.20). */
export const KUI_STATUS_COLOR_418 = "#ffc2b3";
/* Color representing response status code 421 (orange.30). */
export const KUI_STATUS_COLOR_421 = "#ff9877";
/* Color representing response status code 422 (orange.40). */
export const KUI_STATUS_COLOR_422 = "#ff723c";
/* Color representing response status code 423 (orange.50). */
export const KUI_STATUS_COLOR_423 = "#f75008";
/* Color representing response status code 424 (orange.60). */
export const KUI_STATUS_COLOR_424 = "#d13500";
/* Color representing response status code 425 (orange.70). */
export const KUI_STATUS_COLOR_425 = "#a31f00";
/* Color representing response status code 426 (orange.20). */
export const KUI_STATUS_COLOR_426 = "#ffc2b3";
/* Color representing response status code 428 (orange.30). */
export const KUI_STATUS_COLOR_428 = "#ff9877";
/* Color representing response status code 429 (orange.40). */
export const KUI_STATUS_COLOR_429 = "#ff723c";
/* Color representing response status code 431 (orange.50). */
export const KUI_STATUS_COLOR_431 = "#f75008";
/* Color representing response status code 451 (orange.60). */
export const KUI_STATUS_COLOR_451 = "#d13500";
/* Color representing response status code 500 (red.20). */
export const KUI_STATUS_COLOR_500 = "#ffabab";
/* Color representing response status code 501 (red.30). */
export const KUI_STATUS_COLOR_501 = "#ff7272";
/* Color representing response status code 502 (red.40). */
export const KUI_STATUS_COLOR_502 = "#ff3954";
/* Color representing response status code 503 (red.50). */
export const KUI_STATUS_COLOR_503 = "#f50045";
/* Color representing response status code 504 (red.60). */
export const KUI_STATUS_COLOR_504 = "#d60027";
/* Color representing response status code 505 (red.70). */
export const KUI_STATUS_COLOR_505 = "#ad000e";
/* Color representing response status code 506 (red.20). */
export const KUI_STATUS_COLOR_506 = "#ffabab";
/* Color representing response status code 507 (red.30). */
export const KUI_STATUS_COLOR_507 = "#ff7272";
/* Color representing response status code 508 (red.40). */
export const KUI_STATUS_COLOR_508 = "#ff3954";
/* Color representing response status code 510 (red.50). */
export const KUI_STATUS_COLOR_510 = "#f50045";
/* Color representing response status code 511 (red.60). */
export const KUI_STATUS_COLOR_511 = "#d60027";
/* Color for unknown response status codes in the 100-199 range (blue.10). */
export const KUI_STATUS_COLOR_1NA = "#eefaff";
/* Color for unknown response status codes in the 200-299 range (green.10). */
export const KUI_STATUS_COLOR_2NA = "#ecfffb";
/* Color for unknown response status codes in the 300-399 range (yellow.10). */
export const KUI_STATUS_COLOR_3NA = "#fffce0";
/* Color for unknown response status codes in the 400-499 range (orange.10). */
export const KUI_STATUS_COLOR_4NA = "#fff1ef";
/* Color for unknown response status codes in the 500-599 range (red.10). */
export const KUI_STATUS_COLOR_5NA = "#ffe5e5";
/* Color for a group of response status codes in the 100-199 range (blue.40). */
export const KUI_STATUS_COLOR_100S = "#5f9aff";
/* Color for a group of response status codes in the 200-299 range (green.40). */
export const KUI_STATUS_COLOR_200S = "#00d6a4";
/* Color for a group of response status codes in the 300-399 range (yellow.40). */
export const KUI_STATUS_COLOR_300S = "#ffc400";
/* Color for a group of response status codes in the 400-499 range (orange.40). */
export const KUI_STATUS_COLOR_400S = "#ff723c";
/* Color for a group of response status codes in the 500-599 range (red.40). */
export const KUI_STATUS_COLOR_500S = "#ff3954";
/* Background color for http status 100 elements (blue.10). */
export const KUI_STATUS_COLOR_BACKGROUND_100 = "#eefaff";
/* Background color for http status 200 elements (green.10). */
export const KUI_STATUS_COLOR_BACKGROUND_200 = "#ecfffb";
/* Background color for http status 300 elements (yellow.10). */
export const KUI_STATUS_COLOR_BACKGROUND_300 = "#fffce0";
/* Background color for http status 400 elements (orange.10). */
export const KUI_STATUS_COLOR_BACKGROUND_400 = "#fff1ef";
/* Background color for http status 500 elements (red.10). */
export const KUI_STATUS_COLOR_BACKGROUND_500 = "#ffe5e5";
/* Text color for http status 100 elements (blue.60). */
export const KUI_STATUS_COLOR_TEXT_100 = "#0044f4";
/* Text color for http status 200 elements (green.60). */
export const KUI_STATUS_COLOR_TEXT_200 = "#007d60";
/* Text color for http status 300 elements (yellow.60). */
export const KUI_STATUS_COLOR_TEXT_300 = "#995c00";
/* Text color for http status 400 elements (orange.60). */
export const KUI_STATUS_COLOR_TEXT_400 = "#d13500";
/* Text color for http status 500 elements (red.60). */
export const KUI_STATUS_COLOR_TEXT_500 = "#d60027";
```

</details>

### Themeable Tokens

`KUI_THEMEABLE_TOKENS` (exported from `@kong/design-tokens/tokens/themeable-tokens`) lists every `--kui-*` custom property a theme may override — both semantic tokens and value-less component tokens (`value: null`). Each entry is a `{ name, description, category, value }` record.

<details>

<summary>Click to view the KUI_THEMEABLE_TOKENS array</summary>

```javascript
export const KUI_THEMEABLE_TOKENS = [
  {
    name: "--kui-alert-border-radius",
    description: "Alert border radius.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-alert-color-background-danger",
    description: "Danger alert background color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-alert-color-background-decorative",
    description: "Decorative alert background color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-alert-color-background-info",
    description: "Info alert background color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-alert-color-background-success",
    description: "Success alert background color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-alert-color-background-warning",
    description: "Warning alert background color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-alert-color-text-danger",
    description: "Danger alert text color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-alert-color-text-danger-hover",
    description: "Danger alert text color on hover.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-alert-color-text-decorative",
    description: "Decorative alert text color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-alert-color-text-decorative-hover",
    description: "Decorative alert text color on hover.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-alert-color-text-info",
    description: "Info alert text color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-alert-color-text-info-hover",
    description: "Info alert text color on hover.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-alert-color-text-success",
    description: "Success alert text color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-alert-color-text-success-hover",
    description: "Success alert text color on hover.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-alert-color-text-warning",
    description: "Warning alert text color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-alert-color-text-warning-hover",
    description: "Warning alert text color on hover.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-alert-font-family",
    description: "Alert font family.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-alert-font-size",
    description: "Alert font size.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-alert-font-weight",
    description: "Alert body text font weight.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-alert-line-height",
    description: "Alert line height.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-alert-padding",
    description: "Alert inner padding.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-animation-duration-20",
    description: "Default transition timing",
    category: "animation",
    value: "0.2s",
  },
  {
    name: "--kui-badge-border-radius",
    description: "Badge border radius.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-badge-color-background-danger",
    description: "Danger badge background color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-badge-color-background-decorative",
    description: "Decorative badge background color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-badge-color-background-info",
    description: "Info badge background color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-badge-color-background-neutral",
    description: "Neutral badge background color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-badge-color-background-success",
    description: "Success badge background color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-badge-color-background-warning",
    description: "Warning badge background color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-badge-color-text-danger",
    description: "Danger badge text color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-badge-color-text-danger-hover",
    description: "Danger badge text color on hover.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-badge-color-text-decorative",
    description: "Decorative badge text color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-badge-color-text-decorative-hover",
    description: "Decorative badge text color on hover.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-badge-color-text-disabled",
    description: "Disabled badge text color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-badge-color-text-info",
    description: "Info badge text color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-badge-color-text-info-hover",
    description: "Info badge text color on hover.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-badge-color-text-neutral",
    description: "Neutral badge text color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-badge-color-text-neutral-hover",
    description: "Neutral badge text color on hover.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-badge-color-text-success",
    description: "Success badge text color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-badge-color-text-success-hover",
    description: "Success badge text color on hover.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-badge-color-text-warning",
    description: "Warning badge text color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-badge-color-text-warning-hover",
    description: "Warning badge text color on hover.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-badge-font-family",
    description: "Badge font family.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-badge-font-size",
    description: "Badge font size.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-badge-font-weight",
    description: "Badge font weight.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-badge-icon-gap",
    description: "Gap between the badge icon and text.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-badge-line-height",
    description: "Badge line height.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-badge-padding-small",
    description: "Reduced padding for small inline badges.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-badge-padding-x",
    description: "Badge horizontal padding.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-badge-padding-y",
    description: "Badge vertical padding.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-badge-shadow-focus",
    description: "Badge focus ring shadow.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-border-radius-0",
    description: "0px border radius.",
    category: "border",
    value: "0px",
  },
  {
    name: "--kui-border-radius-10",
    description: "2px border radius.",
    category: "border",
    value: "2px",
  },
  {
    name: "--kui-border-radius-20",
    description: "4px border radius.",
    category: "border",
    value: "4px",
  },
  {
    name: "--kui-border-radius-30",
    description: "6px border radius.",
    category: "border",
    value: "6px",
  },
  {
    name: "--kui-border-radius-40",
    description: "8px border radius.",
    category: "border",
    value: "8px",
  },
  {
    name: "--kui-border-radius-50",
    description: "10px border radius.",
    category: "border",
    value: "10px",
  },
  {
    name: "--kui-border-radius-circle",
    description: "50% border radius used to create circles.",
    category: "border",
    value: "50%",
  },
  {
    name: "--kui-border-radius-round",
    description: "100px border radius used to create pill shapes.",
    category: "border",
    value: "100px",
  },
  {
    name: "--kui-border-width-0",
    description: "0px border width.",
    category: "border",
    value: "0px",
  },
  {
    name: "--kui-border-width-10",
    description: "1px border width.",
    category: "border",
    value: "1px",
  },
  {
    name: "--kui-border-width-20",
    description: "2px border width.",
    category: "border",
    value: "2px",
  },
  {
    name: "--kui-border-width-30",
    description: "4px border width.",
    category: "border",
    value: "4px",
  },
  {
    name: "--kui-breadcrumbs-color-text",
    description: "Breadcrumbs item text color. Applies to the resting state of links and to the current (non-link) item.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-breadcrumbs-color-text-hover",
    description: "Breadcrumbs link text color on hover and focus.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-breadcrumbs-divider-color-text",
    description: "Breadcrumbs divider (separator) color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-breadcrumbs-divider-font-weight",
    description: "Breadcrumbs divider (separator) font weight.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-breadcrumbs-font-family",
    description: "Breadcrumbs font family.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-breadcrumbs-font-size",
    description: "Breadcrumbs item font size.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-breadcrumbs-font-weight",
    description: "Breadcrumbs item text font weight.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-breadcrumbs-line-height",
    description: "Breadcrumbs item line height.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-breadcrumbs-shadow-focus",
    description: "Breadcrumbs link focus-visible shadow.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-breakpoint-desktop",
    description: "Used for larger desktop screens.",
    category: "breakpoint",
    value: "1536px",
  },
  {
    name: "--kui-breakpoint-laptop",
    description: "Used for standard desktop screens.",
    category: "breakpoint",
    value: "1280px",
  },
  {
    name: "--kui-breakpoint-mobile",
    description: "Used for larger mobile screens. Any viewport width under this value is considered mobile.",
    category: "breakpoint",
    value: "640px",
  },
  {
    name: "--kui-breakpoint-phablet",
    description: "Used for tablet screens.",
    category: "breakpoint",
    value: "768px",
  },
  {
    name: "--kui-breakpoint-tablet",
    description: "Used for larger tablet screens. Any viewport width less than this value will likely show a mobile layout. Any viewport width this value and greater will likely show a desktop layout.",
    category: "breakpoint",
    value: "1024px",
  },
  {
    name: "--kui-button-border-radius-large",
    description: "Large button border radius.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-border-radius-medium",
    description: "Medium button border radius.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-border-radius-small",
    description: "Small button border radius.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-border-width-large",
    description: "Large button border width.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-border-width-medium",
    description: "Medium button border width.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-border-width-small",
    description: "Small button border width.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-color-background-danger",
    description: "Danger button background color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-color-background-danger-active",
    description: "Danger button background color when active.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-color-background-danger-disabled",
    description: "Danger button background color when disabled.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-color-background-danger-hover",
    description: "Danger button background color on hover.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-color-background-primary",
    description: "Primary button background color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-color-background-primary-active",
    description: "Primary button background color when active.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-color-background-primary-disabled",
    description: "Primary button background color when disabled.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-color-background-primary-hover",
    description: "Primary button background color on hover.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-color-background-secondary",
    description: "Secondary button background color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-color-background-secondary-active",
    description: "Secondary button background color when active.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-color-background-secondary-disabled",
    description: "Secondary button background color when disabled.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-color-background-secondary-hover",
    description: "Secondary button background color on hover.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-color-background-tertiary",
    description: "Tertiary button background color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-color-background-tertiary-active",
    description: "Tertiary button background color when active.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-color-background-tertiary-disabled",
    description: "Tertiary button background color when disabled.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-color-background-tertiary-hover",
    description: "Tertiary button background color on hover.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-color-border-danger",
    description: "Danger button border color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-color-border-danger-active",
    description: "Danger button border color when active.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-color-border-danger-disabled",
    description: "Danger button border color when disabled.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-color-border-danger-hover",
    description: "Danger button border color on hover.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-color-border-primary",
    description: "Primary button border color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-color-border-primary-active",
    description: "Primary button border color when active.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-color-border-primary-disabled",
    description: "Primary button border color when disabled.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-color-border-primary-hover",
    description: "Primary button border color on hover.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-color-border-secondary",
    description: "Secondary button border color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-color-border-secondary-active",
    description: "Secondary button border color when active.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-color-border-secondary-disabled",
    description: "Secondary button border color when disabled.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-color-border-secondary-hover",
    description: "Secondary button border color on hover.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-color-border-tertiary",
    description: "Tertiary button border color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-color-border-tertiary-active",
    description: "Tertiary button border color when active.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-color-border-tertiary-disabled",
    description: "Tertiary button border color when disabled.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-color-border-tertiary-hover",
    description: "Tertiary button border color on hover.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-color-text-danger",
    description: "Danger button text color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-color-text-danger-active",
    description: "Danger button text color when active.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-color-text-danger-disabled",
    description: "Danger button text color when disabled.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-color-text-danger-hover",
    description: "Danger button text color on hover.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-color-text-primary",
    description: "Primary button text color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-color-text-primary-active",
    description: "Primary button text color when active.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-color-text-primary-disabled",
    description: "Primary button text color when disabled.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-color-text-primary-hover",
    description: "Primary button text color on hover.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-color-text-secondary",
    description: "Secondary button text color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-color-text-secondary-active",
    description: "Secondary button text color when active.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-color-text-secondary-disabled",
    description: "Secondary button text color when disabled.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-color-text-secondary-hover",
    description: "Secondary button text color on hover.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-color-text-tertiary",
    description: "Tertiary button text color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-color-text-tertiary-active",
    description: "Tertiary button text color when active.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-color-text-tertiary-disabled",
    description: "Tertiary button text color when disabled.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-color-text-tertiary-hover",
    description: "Tertiary button text color on hover.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-font-size-large",
    description: "Large button font size.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-font-size-medium",
    description: "Medium button font size.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-font-size-small",
    description: "Small button font size.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-font-weight",
    description: "Button font weight.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-icon-size-large",
    description: "Icon size in the large button.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-icon-size-medium",
    description: "Icon size in the medium button.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-icon-size-small",
    description: "Icon size in the small button.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-line-height-large",
    description: "Large button line height.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-line-height-medium",
    description: "Medium button line height.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-line-height-small",
    description: "Small button line height.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-padding-x-large",
    description: "Large button horizontal padding.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-padding-x-medium",
    description: "Medium button horizontal padding.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-padding-x-small",
    description: "Small button horizontal padding.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-padding-y-large",
    description: "Large button vertical padding.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-padding-y-medium",
    description: "Medium button vertical padding.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-padding-y-small",
    description: "Small button vertical padding.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-button-shadow-focus",
    description: "Button focus ring shadow.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-card-actions-gap",
    description: "Gap between card action items.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-card-body-color-text",
    description: "Card body text color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-card-body-font-family",
    description: "Card body font family.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-card-body-font-size",
    description: "Card body font size.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-card-body-font-weight",
    description: "Card body font weight.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-card-body-line-height",
    description: "Card body line height.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-card-border-radius",
    description: "Card border radius.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-card-border-width",
    description: "Card border width.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-card-color-background",
    description: "Card background color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-card-color-border",
    description: "Card border color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-card-footer-gap",
    description: "Gap between card footer items.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-card-gap",
    description: "Gap between card sections.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-card-header-gap",
    description: "Gap between card header items.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-card-padding",
    description: "Card inner padding.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-card-title-color-text",
    description: "Card title text color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-card-title-font-size",
    description: "Card title font size.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-card-title-font-weight",
    description: "Card title font weight.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-card-title-line-height",
    description: "Card title line height.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-checkbox-border-radius",
    description: "Checkbox border radius.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-checkbox-color-background",
    description: "Checkbox background color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-checkbox-color-background-checked",
    description: "Checkbox background color when checked or indeterminate.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-checkbox-color-icon",
    description: "Checkbox icon color when checked or indeterminate.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-checkbox-shadow-border",
    description: "Checkbox default border shadow.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-checkbox-shadow-border-checked",
    description: "Checkbox border shadow when checked or indeterminate.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-checkbox-shadow-border-hover",
    description: "Checkbox border shadow on hover.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-checkbox-shadow-focus",
    description: "Checkbox focus ring shadow.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-code-block-actions-border-width",
    description: "Code block actions toolbar bottom border width.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-code-block-actions-color-border",
    description: "Code block actions toolbar bottom border color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-code-block-actions-color-border-dark",
    description: "Code block actions toolbar bottom border color in the dark theme.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-code-block-actions-padding",
    description: "Code block actions toolbar inner padding.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-code-block-border-radius",
    description: "Code block border radius.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-code-block-color-background",
    description: "Code block background color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-code-block-color-background-dark",
    description: "Code block background color in the dark theme.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-code-block-color-text",
    description: "Code block code text color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-code-block-color-text-dark",
    description: "Code block code text color in the dark theme.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-code-block-line-number-color-text",
    description: "Code block line number text color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-code-block-line-number-color-text-dark",
    description: "Code block line number text color in the dark theme.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-collapse-font-family",
    description: "Collapse font family.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-collapse-title-color-text",
    description: "Collapse title text color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-collapse-title-font-size",
    description: "Collapse title font size.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-collapse-title-font-weight",
    description: "Collapse title font weight.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-collapse-title-line-height",
    description: "Collapse title line height.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-collapse-trigger-border-radius",
    description: "Collapse trigger button border radius.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-collapse-trigger-color-text",
    description: "Collapse trigger button text color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-collapse-trigger-color-text-active",
    description: "Collapse trigger button text color when active (pressed).",
    category: "component",
    value: null,
  },
  {
    name: "--kui-collapse-trigger-color-text-hover",
    description: "Collapse trigger button text color on hover.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-collapse-trigger-font-size",
    description: "Collapse trigger button font size.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-collapse-trigger-font-weight",
    description: "Collapse trigger button font weight.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-collapse-trigger-line-height",
    description: "Collapse trigger button line height.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-collapse-trigger-shadow-focus",
    description: "Collapse trigger button focus-visible shadow.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-color-background",
    description: "Default background color for containers (white).",
    category: "color",
    value: "#ffffff",
  },
  {
    name: "--kui-color-background-accent",
    description: "Accent background color for emphasis on non-primary UI. Distinct from the primary action color, used to add touches of the theme accent color across themes.",
    category: "color",
    value: "#0044f4",
  },
  {
    name: "--kui-color-background-danger",
    description: "Background color for danger actions or messages (red.60).",
    category: "color",
    value: "#d60027",
  },
  {
    name: "--kui-color-background-danger-strong",
    description: "Strong background color for danger actions or messages (red.70).",
    category: "color",
    value: "#ad000e",
  },
  {
    name: "--kui-color-background-danger-stronger",
    description: "Stronger background color for danger actions or messages (red.80).",
    category: "color",
    value: "#850000",
  },
  {
    name: "--kui-color-background-danger-strongest",
    description: "Strongest background color for danger actions or messages (red.90).",
    category: "color",
    value: "#5c0000",
  },
  {
    name: "--kui-color-background-danger-weak",
    description: "Weak background color for danger actions or messages (red.40).",
    category: "color",
    value: "#ff3954",
  },
  {
    name: "--kui-color-background-danger-weaker",
    description: "Weaker background color for danger actions or messages (red.20).",
    category: "color",
    value: "#ffabab",
  },
  {
    name: "--kui-color-background-danger-weakest",
    description: "Weakest background color for danger actions or messages (red.10).",
    category: "color",
    value: "#ffe5e5",
  },
  {
    name: "--kui-color-background-decorative-aqua-weakest",
    description: "Weakest background color for decorative purposes (aqua.10).",
    category: "color",
    value: "#ecfcff",
  },
  {
    name: "--kui-color-background-decorative-purple",
    description: "Background color for decorative purposes (purple.60).",
    category: "color",
    value: "#6f28ff",
  },
  {
    name: "--kui-color-background-decorative-purple-weakest",
    description: "Weakest background color for decorative purposes (purple.10).",
    category: "color",
    value: "#f1f0ff",
  },
  {
    name: "--kui-color-background-disabled",
    description: "Background color for disabled elements (gray.20).",
    category: "color",
    value: "#e0e4ea",
  },
  {
    name: "--kui-color-background-info",
    description: "Background color for info elements (blue.60).",
    category: "color",
    value: "#0044f4",
  },
  {
    name: "--kui-color-background-info-strong",
    description: "Strong background color for info elements (blue.70).",
    category: "color",
    value: "#0030cc",
  },
  {
    name: "--kui-color-background-info-stronger",
    description: "Stronger background color for info elements (blue.80).",
    category: "color",
    value: "#002099",
  },
  {
    name: "--kui-color-background-info-strongest",
    description: "Strongest background color for info elements (blue.90).",
    category: "color",
    value: "#001466",
  },
  {
    name: "--kui-color-background-info-weak",
    description: "Weak background color for info elements (blue.40).",
    category: "color",
    value: "#5f9aff",
  },
  {
    name: "--kui-color-background-info-weaker",
    description: "Weaker background color for info elements (blue.20).",
    category: "color",
    value: "#bee2ff",
  },
  {
    name: "--kui-color-background-info-weakest",
    description: "Weakest background color for info elements (blue.10).",
    category: "color",
    value: "#eefaff",
  },
  {
    name: "--kui-color-background-inverse",
    description: "Inverse background color for containers (blue.100)",
    category: "color",
    value: "#000933",
  },
  {
    name: "--kui-color-background-neutral",
    description: "Background color for neutral elements (gray.60).",
    category: "color",
    value: "#6c7489",
  },
  {
    name: "--kui-color-background-neutral-strong",
    description: "Strong background color for neutral elements (gray.70).",
    category: "color",
    value: "#52596e",
  },
  {
    name: "--kui-color-background-neutral-stronger",
    description: "Stronger background color for neutral elements (gray.80).",
    category: "color",
    value: "#3a3f51",
  },
  {
    name: "--kui-color-background-neutral-strongest",
    description: "Strongest background color for neutral elements (gray.90).",
    category: "color",
    value: "#232633",
  },
  {
    name: "--kui-color-background-neutral-weak",
    description: "Weak background color for neutral elements (gray.40).",
    category: "color",
    value: "#afb7c5",
  },
  {
    name: "--kui-color-background-neutral-weaker",
    description: "Weaker background color for neutral elements (gray.20).",
    category: "color",
    value: "#e0e4ea",
  },
  {
    name: "--kui-color-background-neutral-weakest",
    description: "Weakest background color for neutral elements (gray.10).",
    category: "color",
    value: "#f9fafb",
  },
  {
    name: "--kui-color-background-overlay",
    description: "Overlay background color (rgba(0, 9, 51, 0.6))",
    category: "color",
    value: "rgba(0, 9, 51, 0.6)",
  },
  {
    name: "--kui-color-background-primary",
    description: "Background color for primary actions or messages (blue.60).",
    category: "color",
    value: "#0044f4",
  },
  {
    name: "--kui-color-background-primary-strong",
    description: "Strong background color for primary actions or messages (blue.70).",
    category: "color",
    value: "#0030cc",
  },
  {
    name: "--kui-color-background-primary-stronger",
    description: "Stronger background color for primary actions or messages (blue.80).",
    category: "color",
    value: "#002099",
  },
  {
    name: "--kui-color-background-primary-strongest",
    description: "Strongest background color for primary actions or messages (blue.90).",
    category: "color",
    value: "#001466",
  },
  {
    name: "--kui-color-background-primary-weak",
    description: "Weak background color for primary actions or messages (blue.40).",
    category: "color",
    value: "#5f9aff",
  },
  {
    name: "--kui-color-background-primary-weaker",
    description: "Weaker background color for primary actions or messages (blue.20).",
    category: "color",
    value: "#bee2ff",
  },
  {
    name: "--kui-color-background-primary-weakest",
    description: "Weakest background color for primary actions or messages (blue.10)",
    category: "color",
    value: "#eefaff",
  },
  {
    name: "--kui-color-background-success",
    description: "Background color for success elements (green.60).",
    category: "color",
    value: "#007d60",
  },
  {
    name: "--kui-color-background-success-strong",
    description: "Strong background color for success elements (green.70).",
    category: "color",
    value: "#005944",
  },
  {
    name: "--kui-color-background-success-stronger",
    description: "Stronger background color for success elements (green.80).",
    category: "color",
    value: "#004737",
  },
  {
    name: "--kui-color-background-success-strongest",
    description: "Strongest background color for success elements (green.90).",
    category: "color",
    value: "#003629",
  },
  {
    name: "--kui-color-background-success-weak",
    description: "Weak background color for success elements (green.40).",
    category: "color",
    value: "#00d6a4",
  },
  {
    name: "--kui-color-background-success-weaker",
    description: "Weaker background color for success elements (green.20).",
    category: "color",
    value: "#b5ffee",
  },
  {
    name: "--kui-color-background-success-weakest",
    description: "Weakest background color for success elements (green.10).",
    category: "color",
    value: "#ecfffb",
  },
  {
    name: "--kui-color-background-transparent",
    description: "Transparent background color (transparent).",
    category: "color",
    value: "rgba(0, 0, 0, 0)",
  },
  {
    name: "--kui-color-background-warning",
    description: "Background color for warning elements (yellow.60).",
    category: "color",
    value: "#995c00",
  },
  {
    name: "--kui-color-background-warning-strong",
    description: "Strong background color for warning elements (yellow.70).",
    category: "color",
    value: "#804400",
  },
  {
    name: "--kui-color-background-warning-stronger",
    description: "Stronger background color for warning elements (yellow.80).",
    category: "color",
    value: "#662d00",
  },
  {
    name: "--kui-color-background-warning-strongest",
    description: "Strongest background color for warning elements (yellow.90).",
    category: "color",
    value: "#4d1b00",
  },
  {
    name: "--kui-color-background-warning-weak",
    description: "Weak background color for warning elements (yellow.40).",
    category: "color",
    value: "#ffc400",
  },
  {
    name: "--kui-color-background-warning-weaker",
    description: "Weaker background color for warning elements (yellow.20).",
    category: "color",
    value: "#fff296",
  },
  {
    name: "--kui-color-background-warning-weakest",
    description: "Weakest background color for warning elements (yellow.10).",
    category: "color",
    value: "#fffce0",
  },
  {
    name: "--kui-color-border",
    description: "Default border color for containers (gray.20).",
    category: "color",
    value: "#e0e4ea",
  },
  {
    name: "--kui-color-border-accent",
    description: "Accent border color for emphasis on non-primary UI. Distinct from the primary action color, used to add touches of the theme accent color across themes.",
    category: "color",
    value: "#0044f4",
  },
  {
    name: "--kui-color-border-danger",
    description: "Border color for danger actions or messages (red.60).",
    category: "color",
    value: "#d60027",
  },
  {
    name: "--kui-color-border-danger-strong",
    description: "Strong border color for danger actions or messages (red.70).",
    category: "color",
    value: "#ad000e",
  },
  {
    name: "--kui-color-border-danger-stronger",
    description: "Stronger border color for danger actions or messages (red.80).",
    category: "color",
    value: "#850000",
  },
  {
    name: "--kui-color-border-danger-strongest",
    description: "Strongest border color for danger actions or messages (red.90).",
    category: "color",
    value: "#5c0000",
  },
  {
    name: "--kui-color-border-danger-weak",
    description: "Weak border color for danger actions or messages (red.40).",
    category: "color",
    value: "#ff3954",
  },
  {
    name: "--kui-color-border-danger-weaker",
    description: "Weaker border color for danger actions or messages (red.20).",
    category: "color",
    value: "#ffabab",
  },
  {
    name: "--kui-color-border-danger-weakest",
    description: "Weakest border color for danger actions or messages (red.10).",
    category: "color",
    value: "#ffe5e5",
  },
  {
    name: "--kui-color-border-decorative-purple",
    description: "Border color for decorative purposes (purple.60).",
    category: "color",
    value: "#6f28ff",
  },
  {
    name: "--kui-color-border-disabled",
    description: "Border color for disabled elements (gray.20).",
    category: "color",
    value: "#e0e4ea",
  },
  {
    name: "--kui-color-border-inverse",
    description: "Inverse border color (rgba(255, 255, 255, 0.2)).",
    category: "color",
    value: "rgba(255, 255, 255, 0.2)",
  },
  {
    name: "--kui-color-border-neutral",
    description: "Border color for neutral elements (gray.60)",
    category: "color",
    value: "#6c7489",
  },
  {
    name: "--kui-color-border-neutral-strong",
    description: "Strong border color for neutral elements (gray.70)",
    category: "color",
    value: "#52596e",
  },
  {
    name: "--kui-color-border-neutral-stronger",
    description: "Stronger border color for neutral elements (gray.80)",
    category: "color",
    value: "#3a3f51",
  },
  {
    name: "--kui-color-border-neutral-strongest",
    description: "Strongest border color for neutral elements (gray.90)",
    category: "color",
    value: "#232633",
  },
  {
    name: "--kui-color-border-neutral-weak",
    description: "Weak border color for neutral elements (gray.40)",
    category: "color",
    value: "#afb7c5",
  },
  {
    name: "--kui-color-border-neutral-weaker",
    description: "Weaker border color for neutral elements (gray.20)",
    category: "color",
    value: "#e0e4ea",
  },
  {
    name: "--kui-color-border-neutral-weakest",
    description: "Weakest border color for neutral elements (gray.10)",
    category: "color",
    value: "#f9fafb",
  },
  {
    name: "--kui-color-border-primary",
    description: "Border color for primary actions or messages (blue.60).",
    category: "color",
    value: "#0044f4",
  },
  {
    name: "--kui-color-border-primary-strong",
    description: "Strong border color for primary actions or messages (blue.70).",
    category: "color",
    value: "#0030cc",
  },
  {
    name: "--kui-color-border-primary-stronger",
    description: "Stronger border color for primary actions or messages (blue.80).",
    category: "color",
    value: "#002099",
  },
  {
    name: "--kui-color-border-primary-strongest",
    description: "Strongest border color for primary actions or messages (blue.90).",
    category: "color",
    value: "#001466",
  },
  {
    name: "--kui-color-border-primary-weak",
    description: "Weak border color for primary actions or messages (blue.40).",
    category: "color",
    value: "#5f9aff",
  },
  {
    name: "--kui-color-border-primary-weaker",
    description: "Weaker border color for primary actions or messages (blue.20).",
    category: "color",
    value: "#bee2ff",
  },
  {
    name: "--kui-color-border-primary-weakest",
    description: "Weakest border color for primary actions or messages (blue.10).",
    category: "color",
    value: "#eefaff",
  },
  {
    name: "--kui-color-border-transparent",
    description: "Transparent border color (transparent).",
    category: "color",
    value: "rgba(0, 0, 0, 0)",
  },
  {
    name: "--kui-color-text",
    description: "Default text color (blue.100).",
    category: "color",
    value: "#000933",
  },
  {
    name: "--kui-color-text-accent",
    description: "Accent text color for emphasis on non-primary UI. Distinct from the primary action color, used to add touches of the theme accent color across themes.",
    category: "color",
    value: "#0044f4",
  },
  {
    name: "--kui-color-text-danger",
    description: "Text color for danger actions or messages (red.60).",
    category: "color",
    value: "#d60027",
  },
  {
    name: "--kui-color-text-danger-strong",
    description: "Strong text color for danger actions or messages (red.70).",
    category: "color",
    value: "#ad000e",
  },
  {
    name: "--kui-color-text-danger-stronger",
    description: "Stronger text color for danger actions or messages (red.80).",
    category: "color",
    value: "#850000",
  },
  {
    name: "--kui-color-text-danger-strongest",
    description: "Strongest text color for danger actions or messages (red.90).",
    category: "color",
    value: "#5c0000",
  },
  {
    name: "--kui-color-text-danger-weak",
    description: "Weak text color for danger actions or messages (red.40).",
    category: "color",
    value: "#ff3954",
  },
  {
    name: "--kui-color-text-danger-weaker",
    description: "Weaker text color for danger actions or messages (red.20).",
    category: "color",
    value: "#ffabab",
  },
  {
    name: "--kui-color-text-danger-weakest",
    description: "Weakest text color for danger actions or messages (red.10).",
    category: "color",
    value: "#ffe5e5",
  },
  {
    name: "--kui-color-text-decorative-aqua",
    description: "Text color for decorative purposes (aqua.50).",
    category: "color",
    value: "#00abd2",
  },
  {
    name: "--kui-color-text-decorative-pink",
    description: "Text color for decorative purposes (pink.60).",
    category: "color",
    value: "#d60067",
  },
  {
    name: "--kui-color-text-decorative-purple",
    description: "Text color for decorative purposes (purple.60).",
    category: "color",
    value: "#6f28ff",
  },
  {
    name: "--kui-color-text-decorative-purple-strong",
    description: "Strong text color for decorative purposes (purple.70).",
    category: "color",
    value: "#5e00f5",
  },
  {
    name: "--kui-color-text-disabled",
    description: "Text color for disabled elements (gray.40).",
    category: "color",
    value: "#afb7c5",
  },
  {
    name: "--kui-color-text-info",
    description: "Text color for info elements (blue.60).",
    category: "color",
    value: "#0044f4",
  },
  {
    name: "--kui-color-text-info-strong",
    description: "Strong text color for info elements (blue.70).",
    category: "color",
    value: "#0030cc",
  },
  {
    name: "--kui-color-text-info-stronger",
    description: "Stronger text color for info elements (blue.80).",
    category: "color",
    value: "#002099",
  },
  {
    name: "--kui-color-text-info-strongest",
    description: "Strongest text color for info elements (blue.90).",
    category: "color",
    value: "#001466",
  },
  {
    name: "--kui-color-text-info-weak",
    description: "Weak text color for info elements (blue.40).",
    category: "color",
    value: "#5f9aff",
  },
  {
    name: "--kui-color-text-info-weaker",
    description: "Weaker text color for info elements (blue.20).",
    category: "color",
    value: "#bee2ff",
  },
  {
    name: "--kui-color-text-info-weakest",
    description: "Weakest text color for info elements (blue.10).",
    category: "color",
    value: "#eefaff",
  },
  {
    name: "--kui-color-text-inverse",
    description: "Inverse text color (white).",
    category: "color",
    value: "#ffffff",
  },
  {
    name: "--kui-color-text-neutral",
    description: "Text color for neutral elements (gray.60).",
    category: "color",
    value: "#6c7489",
  },
  {
    name: "--kui-color-text-neutral-strong",
    description: "Strong text color for neutral elements (gray.70).",
    category: "color",
    value: "#52596e",
  },
  {
    name: "--kui-color-text-neutral-stronger",
    description: "Stronger text color for neutral elements (gray.80).",
    category: "color",
    value: "#3a3f51",
  },
  {
    name: "--kui-color-text-neutral-strongest",
    description: "Strongest text color for neutral elements (gray.90).",
    category: "color",
    value: "#232633",
  },
  {
    name: "--kui-color-text-neutral-weak",
    description: "Weak text color for neutral elements (gray.40).",
    category: "color",
    value: "#afb7c5",
  },
  {
    name: "--kui-color-text-neutral-weaker",
    description: "Weaker text color for neutral elements (gray.20).",
    category: "color",
    value: "#e0e4ea",
  },
  {
    name: "--kui-color-text-neutral-weakest",
    description: "Weakest text color for neutral elements (gray.10).",
    category: "color",
    value: "#f9fafb",
  },
  {
    name: "--kui-color-text-primary",
    description: "Text color for primary actions or messages (blue.60).",
    category: "color",
    value: "#0044f4",
  },
  {
    name: "--kui-color-text-primary-strong",
    description: "Strong text color for primary actions or messages (blue.70).",
    category: "color",
    value: "#0030cc",
  },
  {
    name: "--kui-color-text-primary-stronger",
    description: "Stronger text color for primary actions or messages (blue.80).",
    category: "color",
    value: "#002099",
  },
  {
    name: "--kui-color-text-primary-strongest",
    description: "Strongest text color for primary actions or messages (blue.90).",
    category: "color",
    value: "#001466",
  },
  {
    name: "--kui-color-text-primary-weak",
    description: "Weak text color for primary actions or messages (blue.40).",
    category: "color",
    value: "#5f9aff",
  },
  {
    name: "--kui-color-text-primary-weaker",
    description: "Weaker text color for primary actions or messages (blue.20).",
    category: "color",
    value: "#bee2ff",
  },
  {
    name: "--kui-color-text-primary-weakest",
    description: "Weakest text color for primary actions or messages (blue.10).",
    category: "color",
    value: "#eefaff",
  },
  {
    name: "--kui-color-text-success",
    description: "Text color for success elements (green.60).",
    category: "color",
    value: "#007d60",
  },
  {
    name: "--kui-color-text-success-strong",
    description: "Strong text color for success elements (green.70).",
    category: "color",
    value: "#005944",
  },
  {
    name: "--kui-color-text-success-stronger",
    description: "Stronger text color for success elements (green.80).",
    category: "color",
    value: "#004737",
  },
  {
    name: "--kui-color-text-success-strongest",
    description: "Stronger text color for success elements (green.90).",
    category: "color",
    value: "#003629",
  },
  {
    name: "--kui-color-text-success-weak",
    description: "Weak text color for success elements (green.40).",
    category: "color",
    value: "#00d6a4",
  },
  {
    name: "--kui-color-text-success-weaker",
    description: "Weaker text color for success elements (green.20).",
    category: "color",
    value: "#b5ffee",
  },
  {
    name: "--kui-color-text-success-weakest",
    description: "Weakest text color for success elements (green.10).",
    category: "color",
    value: "#ecfffb",
  },
  {
    name: "--kui-color-text-warning",
    description: "Text color for warning elements (yellow.60).",
    category: "color",
    value: "#995c00",
  },
  {
    name: "--kui-color-text-warning-strong",
    description: "Strong text color for warning elements (yellow.70).",
    category: "color",
    value: "#804400",
  },
  {
    name: "--kui-color-text-warning-stronger",
    description: "Stronger text color for warning elements (yellow.80).",
    category: "color",
    value: "#662d00",
  },
  {
    name: "--kui-color-text-warning-strongest",
    description: "Strongest text color for warning elements (yellow.90).",
    category: "color",
    value: "#4d1b00",
  },
  {
    name: "--kui-color-text-warning-weak",
    description: "Weak text color for warning elements (yellow.40).",
    category: "color",
    value: "#ffc400",
  },
  {
    name: "--kui-color-text-warning-weaker",
    description: "Weaker text color for warning elements (yellow.20).",
    category: "color",
    value: "#fff296",
  },
  {
    name: "--kui-color-text-warning-weakest",
    description: "Weakest text color for warning elements (yellow.10).",
    category: "color",
    value: "#fffce0",
  },
  {
    name: "--kui-copy-color-text",
    description: "Copy value text color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-copy-font-family-code",
    description: "Copy value font family when displayed as code (monospace).",
    category: "component",
    value: null,
  },
  {
    name: "--kui-copy-font-size",
    description: "Copy text font size.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-copy-font-weight-code",
    description: "Copy value font weight when displayed as code (monospace).",
    category: "component",
    value: null,
  },
  {
    name: "--kui-copy-icon-color-text-hover",
    description: "Copy-to-clipboard icon text color on hover and focus (non-badge appearance).",
    category: "component",
    value: null,
  },
  {
    name: "--kui-copy-line-height",
    description: "Copy text line height.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-date-time-picker-day-color-background-hover",
    description: "Date-time picker calendar day background color on hover.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-date-time-picker-day-color-background-in-range",
    description: "Date-time picker calendar day background color for days within the selected range.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-date-time-picker-day-color-background-selected",
    description: "Date-time picker calendar day background color when selected.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-date-time-picker-day-color-background-selected-hover",
    description: "Date-time picker calendar day background color when selected, on hover.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-date-time-picker-day-color-background-today",
    description: "Date-time picker calendar day background color for today.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-date-time-picker-day-color-text",
    description: "Date-time picker calendar day text color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-date-time-picker-day-color-text-disabled",
    description: "Date-time picker calendar day text color when disabled.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-date-time-picker-day-color-text-selected",
    description: "Date-time picker calendar day text color when selected.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-date-time-picker-shadow-focus",
    description: "Date-time picker calendar day focus-visible ring shadow.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-dropdown-border-radius",
    description: "Dropdown popover border radius.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-dropdown-color-border",
    description: "Dropdown popover border color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-dropdown-item-color-background",
    description: "Dropdown item background color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-dropdown-item-color-background-active",
    description: "Dropdown item background color when active.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-dropdown-item-color-background-danger-active",
    description: "Danger dropdown item background color when active.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-dropdown-item-color-background-danger-hover",
    description: "Danger dropdown item background color on hover.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-dropdown-item-color-background-hover",
    description: "Dropdown item background color on hover.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-dropdown-item-color-background-selected",
    description: "Selected dropdown item background color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-dropdown-item-color-background-selected-disabled",
    description: "Selected and disabled dropdown item background color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-dropdown-item-color-border-divider",
    description: "Dropdown item divider border color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-dropdown-item-color-text",
    description: "Dropdown item text color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-dropdown-item-color-text-danger",
    description: "Danger dropdown item text color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-dropdown-item-color-text-disabled",
    description: "Disabled dropdown item text color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-dropdown-item-color-text-selected",
    description: "Selected dropdown item text color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-dropdown-item-font-family",
    description: "Dropdown item font family.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-dropdown-item-font-size",
    description: "Dropdown item font size.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-dropdown-item-font-weight",
    description: "Dropdown item font weight.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-dropdown-item-line-height",
    description: "Dropdown item line height.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-dropdown-item-padding-x",
    description: "Dropdown item horizontal padding.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-dropdown-item-padding-y",
    description: "Dropdown item vertical padding.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-dropdown-item-shadow-focus",
    description: "Dropdown item focus ring shadow.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-empty-state-color-background",
    description: "Empty state container background color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-empty-state-font-family",
    description: "Empty state font family.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-empty-state-footer-border-width",
    description: "Empty state footer top border width.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-empty-state-footer-color-border",
    description: "Empty state footer top border color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-empty-state-footer-color-text",
    description: "Empty state footer text color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-empty-state-footer-font-size",
    description: "Empty state footer font size.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-empty-state-footer-font-weight",
    description: "Empty state footer font weight.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-empty-state-footer-line-height",
    description: "Empty state footer line height.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-empty-state-footer-padding-top",
    description: "Empty state footer top padding.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-empty-state-icon-border-radius",
    description: "Empty state icon border radius when the icon has a background.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-empty-state-icon-color",
    description: "Empty state icon color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-empty-state-icon-color-background",
    description: "Empty state icon background color when the icon has a background.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-empty-state-icon-color-text-background",
    description: "Empty state icon text/glyph color when the icon has a background.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-empty-state-icon-padding",
    description: "Empty state icon padding when the icon has a background.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-empty-state-icon-size",
    description: "Empty state icon size.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-empty-state-icon-size-background",
    description: "Empty state icon size when the icon has a background.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-empty-state-message-color-text",
    description: "Empty state message text color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-empty-state-message-font-size",
    description: "Empty state message font size.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-empty-state-message-font-weight",
    description: "Empty state message font weight.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-empty-state-message-line-height",
    description: "Empty state message line height.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-empty-state-title-color-text",
    description: "Empty state title text color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-empty-state-title-font-size",
    description: "Empty state title font size.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-empty-state-title-font-weight",
    description: "Empty state title font weight.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-empty-state-title-line-height",
    description: "Empty state title line height.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-file-upload-color-text-disabled",
    description: "File upload selected-file text color when disabled (input appearance).",
    category: "component",
    value: null,
  },
  {
    name: "--kui-file-upload-color-text-placeholder",
    description: "File upload placeholder text color when no file is selected (input appearance).",
    category: "component",
    value: null,
  },
  {
    name: "--kui-file-upload-dropzone-border-radius",
    description: "File upload dropzone border radius.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-file-upload-dropzone-border-width",
    description: "File upload dropzone border width.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-file-upload-dropzone-color-background",
    description: "File upload dropzone background color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-file-upload-dropzone-color-background-disabled",
    description: "File upload dropzone background color when disabled.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-file-upload-dropzone-color-border",
    description: "File upload dropzone border color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-file-upload-dropzone-color-border-disabled",
    description: "File upload dropzone border color when disabled.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-file-upload-dropzone-color-border-error",
    description: "File upload dropzone border color in error state.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-file-upload-dropzone-color-border-hover",
    description: "File upload dropzone border color on hover, drag-over, and focus (coordinated).",
    category: "component",
    value: null,
  },
  {
    name: "--kui-file-upload-dropzone-color-text",
    description: "File upload dropzone text color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-file-upload-dropzone-shadow-focus",
    description: "File upload dropzone outer focus ring shadow.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-filter-group-clear-border-radius",
    description: "Border radius of the focus highlight around the pill clear button.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-filter-group-pill-border-radius",
    description: "Filter pill border radius.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-filter-group-pill-border-width",
    description: "Filter pill border width.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-filter-group-pill-color-background",
    description: "Filter pill background color (default, no selection).",
    category: "component",
    value: null,
  },
  {
    name: "--kui-filter-group-pill-color-background-hover",
    description: "Filter pill background color on hover and focus (default, no selection).",
    category: "component",
    value: null,
  },
  {
    name: "--kui-filter-group-pill-color-background-selected",
    description: "Filter pill background color when a selection is applied.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-filter-group-pill-color-background-selected-hover",
    description: "Filter pill background color on hover and focus when a selection is applied.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-filter-group-pill-color-border",
    description: "Filter pill border color (default, no selection).",
    category: "component",
    value: null,
  },
  {
    name: "--kui-filter-group-pill-color-border-hover",
    description: "Filter pill border color on hover and focus.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-filter-group-pill-color-border-selected",
    description: "Filter pill border color when a selection is applied.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-filter-group-pill-color-text",
    description: "Filter pill text color (default, no selection).",
    category: "component",
    value: null,
  },
  {
    name: "--kui-filter-group-pill-color-text-selected",
    description: "Filter pill text color when a selection is applied.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-filter-group-pill-color-text-selected-hover",
    description: "Filter pill text color on hover and focus when a selection is applied.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-filter-group-pill-line-height",
    description: "Filter pill label line height.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-filter-group-pill-shadow-focus",
    description: "Filter pill focus ring shadow.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-filter-group-selector-color-text",
    description: "Filter selector empty (no filters found) message text color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-font-family-code",
    description: "The standard monospace text font family. Typically used for code blocks, inline code, and copyable text.",
    category: "font",
    value: "'JetBrains Mono', Consolas, monospace",
  },
  {
    name: "--kui-font-family-heading",
    description: "The standard heading text font family.",
    category: "font",
    value: "'Inter', Roboto, Helvetica, sans-serif",
  },
  {
    name: "--kui-font-family-text",
    description: "The standard text font family.",
    category: "font",
    value: "'Inter', Roboto, Helvetica, sans-serif",
  },
  {
    name: "--kui-font-size-10",
    description: "",
    category: "font",
    value: "10px",
  },
  {
    name: "--kui-font-size-100",
    description: "",
    category: "font",
    value: "48px",
  },
  {
    name: "--kui-font-size-20",
    description: "",
    category: "font",
    value: "12px",
  },
  {
    name: "--kui-font-size-30",
    description: "",
    category: "font",
    value: "14px",
  },
  {
    name: "--kui-font-size-40",
    description: "",
    category: "font",
    value: "16px",
  },
  {
    name: "--kui-font-size-50",
    description: "",
    category: "font",
    value: "18px",
  },
  {
    name: "--kui-font-size-60",
    description: "",
    category: "font",
    value: "20px",
  },
  {
    name: "--kui-font-size-70",
    description: "",
    category: "font",
    value: "24px",
  },
  {
    name: "--kui-font-size-80",
    description: "",
    category: "font",
    value: "32px",
  },
  {
    name: "--kui-font-size-90",
    description: "",
    category: "font",
    value: "40px",
  },
  {
    name: "--kui-font-weight-bold",
    description: "700: The bold font weight.",
    category: "font",
    value: "700",
  },
  {
    name: "--kui-font-weight-medium",
    description: "500: The medium font weight.",
    category: "font",
    value: "500",
  },
  {
    name: "--kui-font-weight-regular",
    description: "400: The normal font weight.",
    category: "font",
    value: "400",
  },
  {
    name: "--kui-font-weight-semibold",
    description: "600: The semibold font weight.",
    category: "font",
    value: "600",
  },
  {
    name: "--kui-icon-color-danger",
    description: "Danger color for icons.",
    category: "icon",
    value: "#f50045",
  },
  {
    name: "--kui-icon-color-neutral",
    description: "Neutral color for icons.",
    category: "icon",
    value: "#828a9e",
  },
  {
    name: "--kui-icon-color-primary",
    description: "Primary color for icons.",
    category: "icon",
    value: "#306fff",
  },
  {
    name: "--kui-icon-color-success",
    description: "Success color for icons.",
    category: "icon",
    value: "#00a17b",
  },
  {
    name: "--kui-icon-color-warning",
    description: "Warning color for icons.",
    category: "icon",
    value: "#ffc400",
  },
  {
    name: "--kui-icon-size-10",
    description: "10px icon size.",
    category: "icon",
    value: "10px",
  },
  {
    name: "--kui-icon-size-20",
    description: "12px icon size.",
    category: "icon",
    value: "12px",
  },
  {
    name: "--kui-icon-size-30",
    description: "16px icon size.",
    category: "icon",
    value: "16px",
  },
  {
    name: "--kui-icon-size-40",
    description: "20px icon size.",
    category: "icon",
    value: "20px",
  },
  {
    name: "--kui-icon-size-50",
    description: "24px icon size (default).",
    category: "icon",
    value: "24px",
  },
  {
    name: "--kui-icon-size-60",
    description: "32px icon size.",
    category: "icon",
    value: "32px",
  },
  {
    name: "--kui-icon-size-70",
    description: "40px icon size.",
    category: "icon",
    value: "40px",
  },
  {
    name: "--kui-icon-size-80",
    description: "48px icon size.",
    category: "icon",
    value: "48px",
  },
  {
    name: "--kui-input-border-radius",
    description: "Input border radius.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-input-color-background",
    description: "Input background color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-input-color-background-disabled",
    description: "Input background color when disabled.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-input-color-background-readonly",
    description: "Input background color when read-only.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-input-color-text",
    description: "Input text color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-input-color-text-disabled",
    description: "Input text color when disabled.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-input-color-text-placeholder",
    description: "Input placeholder text color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-input-color-text-readonly",
    description: "Input text color when read-only.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-input-font-family",
    description: "Input font family.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-input-font-size",
    description: "Input font size.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-input-font-weight",
    description: "Input font weight.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-input-line-height",
    description: "Input line height.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-input-padding-x",
    description: "Input horizontal padding.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-input-padding-y",
    description: "Input vertical padding.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-input-shadow-border",
    description: "Input border shadow.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-input-shadow-border-disabled",
    description: "Input border shadow when disabled.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-input-shadow-border-error",
    description: "Input border shadow in error state.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-input-shadow-border-error-hover",
    description: "Input border shadow in error state on hover.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-input-shadow-border-hover",
    description: "Input border shadow on hover.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-input-shadow-focus",
    description: "Input outer focus ring shadow.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-input-switch-border-radius-large",
    description: "Input switch large size border radius.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-input-switch-border-radius-small",
    description: "Input switch small size border radius.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-input-switch-color-background",
    description: "Input switch track background color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-input-switch-color-background-disabled",
    description: "Input switch track background color when disabled.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-input-switch-color-background-hover",
    description: "Input switch track background color on hover.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-input-switch-color-background-selected",
    description: "Input switch track background color when on.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-input-switch-color-background-selected-hover",
    description: "Input switch track background color when on and hovered.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-input-switch-shadow-focus",
    description: "Input switch focus ring shadow.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-input-switch-thumb-border-radius",
    description: "Input switch thumb ring border radius.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-input-switch-thumb-border-width",
    description: "Input switch thumb ring border width.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-input-switch-thumb-color-background",
    description: "Input switch thumb background color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-input-switch-thumb-color-background-disabled",
    description: "Input switch thumb background color when disabled.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-input-switch-thumb-color-border",
    description: "Input switch thumb ring border color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-input-switch-thumb-color-border-hover",
    description: "Input switch thumb ring border color on hover.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-input-switch-thumb-shadow-border",
    description: "Input switch thumb border shadow.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-input-switch-thumb-shadow-border-disabled",
    description: "Input switch thumb border shadow when disabled.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-input-switch-thumb-shadow-border-selected",
    description: "Input switch thumb border shadow when on.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-label-color-text",
    description: "Label text color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-label-font-family",
    description: "Label font family.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-label-font-size",
    description: "Label font size.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-label-font-weight",
    description: "Label font weight.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-label-line-height",
    description: "Label line height.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-letter-spacing-0",
    description: "Alias for letter-spacing-normal",
    category: "letter_spacing",
    value: "normal",
  },
  {
    name: "--kui-letter-spacing-minus-10",
    description: "-0.12px",
    category: "letter_spacing",
    value: "-0.12px",
  },
  {
    name: "--kui-letter-spacing-minus-20",
    description: "-0.24px",
    category: "letter_spacing",
    value: "-0.24px",
  },
  {
    name: "--kui-letter-spacing-minus-30",
    description: "-0.32px",
    category: "letter_spacing",
    value: "-0.32px",
  },
  {
    name: "--kui-letter-spacing-minus-40",
    description: "-0.4px",
    category: "letter_spacing",
    value: "-0.4px",
  },
  {
    name: "--kui-letter-spacing-minus-50",
    description: "-0.48px",
    category: "letter_spacing",
    value: "-0.48px",
  },
  {
    name: "--kui-letter-spacing-normal",
    description: "normal",
    category: "letter_spacing",
    value: "normal",
  },
  {
    name: "--kui-line-height-10",
    description: "12px",
    category: "line_height",
    value: "12px",
  },
  {
    name: "--kui-line-height-100",
    description: "56px",
    category: "line_height",
    value: "56px",
  },
  {
    name: "--kui-line-height-20",
    description: "16px",
    category: "line_height",
    value: "16px",
  },
  {
    name: "--kui-line-height-30",
    description: "20px",
    category: "line_height",
    value: "20px",
  },
  {
    name: "--kui-line-height-40",
    description: "24px",
    category: "line_height",
    value: "24px",
  },
  {
    name: "--kui-line-height-50",
    description: "28px",
    category: "line_height",
    value: "28px",
  },
  {
    name: "--kui-line-height-60",
    description: "32px",
    category: "line_height",
    value: "32px",
  },
  {
    name: "--kui-line-height-70",
    description: "36px",
    category: "line_height",
    value: "36px",
  },
  {
    name: "--kui-line-height-80",
    description: "40px",
    category: "line_height",
    value: "40px",
  },
  {
    name: "--kui-line-height-90",
    description: "48px",
    category: "line_height",
    value: "48px",
  },
  {
    name: "--kui-link-color-text",
    description: "Link text color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-link-color-text-active",
    description: "Link text color in the active (pressed) state.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-link-color-text-disabled",
    description: "Link text color in the disabled state.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-link-color-text-hover",
    description: "Link text color on hover and focus-visible.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-link-font-weight",
    description: "Link font weight.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-link-shadow-focus",
    description: "Link focus-visible ring shadow.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-link-text-decoration",
    description: "Link text decoration (e.g. underline).",
    category: "component",
    value: null,
  },
  {
    name: "--kui-link-text-decoration-hover",
    description: "Link text decoration on hover and focus-visible.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-method-color-background-connect",
    description: "Background color for the CONNECT method (purple.10).",
    category: "method",
    value: "#f1f0ff",
  },
  {
    name: "--kui-method-color-background-delete",
    description: "Background color for the DELETE method (red.10).",
    category: "method",
    value: "#ffe5e5",
  },
  {
    name: "--kui-method-color-background-get",
    description: "Background color for the GET method (blue.10).",
    category: "method",
    value: "#eefaff",
  },
  {
    name: "--kui-method-color-background-head",
    description: "Background color for the HEAD method (gray.70).",
    category: "method",
    value: "#52596e",
  },
  {
    name: "--kui-method-color-background-options",
    description: "Background color for the OPTIONS method (gray.20).",
    category: "method",
    value: "#e0e4ea",
  },
  {
    name: "--kui-method-color-background-patch",
    description: "Background color for the PATCH method (aqua.10).",
    category: "method",
    value: "#ecfcff",
  },
  {
    name: "--kui-method-color-background-post",
    description: "Background color for the POST method (green.10).",
    category: "method",
    value: "#ecfffb",
  },
  {
    name: "--kui-method-color-background-put",
    description: "Background color for the PUT method (yellow.10).",
    category: "method",
    value: "#fffce0",
  },
  {
    name: "--kui-method-color-background-trace",
    description: "Background color for the TRACE method (pink.10).",
    category: "method",
    value: "#fff0f7",
  },
  {
    name: "--kui-method-color-text-connect",
    description: "Text color for the CONNECT method (purple.60).",
    category: "method",
    value: "#6f28ff",
  },
  {
    name: "--kui-method-color-text-connect-strong",
    description: "Strong text color for the CONNECT method (purple.70).",
    category: "method",
    value: "#5e00f5",
  },
  {
    name: "--kui-method-color-text-delete",
    description: "Text color for the DELETE method (red.60).",
    category: "method",
    value: "#d60027",
  },
  {
    name: "--kui-method-color-text-delete-strong",
    description: "Strong text color for the DELETE method (red.70).",
    category: "method",
    value: "#ad000e",
  },
  {
    name: "--kui-method-color-text-get",
    description: "Text color for the GET method (blue.60).",
    category: "method",
    value: "#0044f4",
  },
  {
    name: "--kui-method-color-text-get-strong",
    description: "Strong text color for the GET method (blue.70).",
    category: "method",
    value: "#0030cc",
  },
  {
    name: "--kui-method-color-text-head",
    description: "Text color for the HEAD method (gray.20).",
    category: "method",
    value: "#e0e4ea",
  },
  {
    name: "--kui-method-color-text-head-strong",
    description: "Strong text color for the HEAD method (gray.40).",
    category: "method",
    value: "#afb7c5",
  },
  {
    name: "--kui-method-color-text-options",
    description: "Text color for the OPTIONS method (gray.70).",
    category: "method",
    value: "#52596e",
  },
  {
    name: "--kui-method-color-text-options-strong",
    description: "Strong text color for the OPTIONS method (gray.80).",
    category: "method",
    value: "#3a3f51",
  },
  {
    name: "--kui-method-color-text-patch",
    description: "Text color for the PATCH method (aqua.60).",
    category: "method",
    value: "#00819d",
  },
  {
    name: "--kui-method-color-text-patch-strong",
    description: "Strong text color for the PATCH method (aqua.70).",
    category: "method",
    value: "#00647a",
  },
  {
    name: "--kui-method-color-text-post",
    description: "Text color for the POST method (green.60).",
    category: "method",
    value: "#007d60",
  },
  {
    name: "--kui-method-color-text-post-strong",
    description: "Strong text color for the POST method (green.70).",
    category: "method",
    value: "#005944",
  },
  {
    name: "--kui-method-color-text-put",
    description: "Text color for the PUT method (yellow.60).",
    category: "method",
    value: "#995c00",
  },
  {
    name: "--kui-method-color-text-put-strong",
    description: "Strong text color for the PUT method (yellow.70).",
    category: "method",
    value: "#804400",
  },
  {
    name: "--kui-method-color-text-trace",
    description: "Text color for the TRACE method (pink.60).",
    category: "method",
    value: "#d60067",
  },
  {
    name: "--kui-method-color-text-trace-strong",
    description: "Strong text color for the TRACE method (pink.70).",
    category: "method",
    value: "#ad0053",
  },
  {
    name: "--kui-modal-border-radius",
    description: "Modal dialog border radius.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-modal-border-width",
    description: "Modal dialog border width.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-modal-close-border-radius",
    description: "Modal close button border radius.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-modal-close-color-text-hover",
    description: "Modal close button icon color on hover and focus.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-modal-close-shadow-focus",
    description: "Modal close button focus-visible shadow.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-modal-color-background",
    description: "Modal dialog background color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-modal-color-border",
    description: "Modal dialog border color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-modal-color-text",
    description: "Modal dialog text color (custom content).",
    category: "component",
    value: null,
  },
  {
    name: "--kui-modal-content-color-background",
    description: "Modal content area background color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-modal-content-color-text",
    description: "Modal content area text color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-modal-content-font-family",
    description: "Modal content area font family.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-modal-content-font-size",
    description: "Modal content area font size.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-modal-content-font-weight",
    description: "Modal content area font weight.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-modal-content-line-height",
    description: "Modal content area line height.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-modal-content-padding",
    description: "Modal content area inner padding.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-modal-font-family",
    description: "Modal dialog font family (custom content).",
    category: "component",
    value: null,
  },
  {
    name: "--kui-modal-font-size",
    description: "Modal dialog font size (custom content).",
    category: "component",
    value: null,
  },
  {
    name: "--kui-modal-font-weight",
    description: "Modal dialog font weight (custom content).",
    category: "component",
    value: null,
  },
  {
    name: "--kui-modal-footer-padding",
    description: "Modal footer inner padding.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-modal-header-padding",
    description: "Modal header inner padding.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-modal-line-height",
    description: "Modal dialog line height (custom content).",
    category: "component",
    value: null,
  },
  {
    name: "--kui-modal-shadow",
    description: "Modal dialog box shadow.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-modal-title-font-family",
    description: "Modal title font family.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-modal-title-font-size",
    description: "Modal title font size.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-modal-title-font-weight",
    description: "Modal title font weight.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-modal-title-line-height",
    description: "Modal title line height.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-multiselect-footer-border-width",
    description: "Multiselect dropdown footer top border width.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-multiselect-footer-color-background",
    description: "Multiselect dropdown footer background color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-multiselect-footer-color-border",
    description: "Multiselect dropdown footer top border color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-multiselect-footer-color-text",
    description: "Multiselect dropdown footer text color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-multiselect-group-color-text",
    description: "Multiselect dropdown group title text color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-multiselect-group-font-family",
    description: "Multiselect dropdown group title font family.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-multiselect-group-font-weight",
    description: "Multiselect dropdown group title font weight.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-multiselect-search-border-width",
    description: "Multiselect dropdown search input wrapper bottom border width.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-multiselect-search-color-background",
    description: "Multiselect dropdown search input wrapper background color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-multiselect-search-color-border",
    description: "Multiselect dropdown search input wrapper bottom border color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-navigation-color-background",
    description: "blue.100",
    category: "navigation",
    value: "#000933",
  },
  {
    name: "--kui-navigation-color-background-selected",
    description: "The background color of a selected navigation item.",
    category: "navigation",
    value: "rgba(255, 255, 255, 0.12)",
  },
  {
    name: "--kui-navigation-color-border",
    description: "rgba(255, 255, 255, 0.12)",
    category: "navigation",
    value: "rgba(255, 255, 255, 0.12)",
  },
  {
    name: "--kui-navigation-color-border-child",
    description: "The border color for a selected child navigation item.",
    category: "navigation",
    value: "#00fabe",
  },
  {
    name: "--kui-navigation-color-border-divider",
    description: "The color of the navigation section divider.",
    category: "navigation",
    value: "rgba(255, 255, 255, 0.24)",
  },
  {
    name: "--kui-navigation-color-text",
    description: "Navigation link and icon color.",
    category: "navigation",
    value: "#bee2ff",
  },
  {
    name: "--kui-navigation-color-text-focus",
    description: "Navigation link and icon focus-visible color.",
    category: "navigation",
    value: "#ffffff",
  },
  {
    name: "--kui-navigation-color-text-hover",
    description: "Navigation link and icon hover color.",
    category: "navigation",
    value: "#eefaff",
  },
  {
    name: "--kui-navigation-color-text-selected",
    description: "Navigation link and icon selected color.",
    category: "navigation",
    value: "#00fabe",
  },
  {
    name: "--kui-navigation-shadow-border",
    description: "The box-shadow for a focus-visible navigation link.",
    category: "navigation",
    value: "0 0 0 1px rgba(255, 255, 255, 0.12) inset",
  },
  {
    name: "--kui-navigation-shadow-border-child",
    description: "The left box-shadow for an active child navigation link.",
    category: "navigation",
    value: "4px 0 0 0 #00fabe inset",
  },
  {
    name: "--kui-navigation-shadow-focus",
    description: "Navigation link focus-visible box-shadow.",
    category: "navigation",
    value: "0 0 0 1px rgba(255, 255, 255, 0.60) inset",
  },
  {
    name: "--kui-pagination-border-radius",
    description: "Pagination page button border radius.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-pagination-border-width",
    description: "Pagination page button border width.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-pagination-color-background",
    description: "Pagination page button background color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-pagination-color-background-selected",
    description: "Pagination current (selected) page button background color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-pagination-color-border",
    description: "Pagination page button border color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-pagination-color-border-hover",
    description: "Pagination page button border color on hover and focus.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-pagination-color-border-selected",
    description: "Pagination current (selected) page button border color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-pagination-color-text",
    description: "Pagination page button text color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-pagination-font-family",
    description: "Pagination font family.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-pagination-font-weight",
    description: "Pagination page button font weight.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-pagination-padding",
    description: "Pagination page button inner padding.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-pagination-shadow-focus",
    description: "Pagination page button focus-visible shadow.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-pop-border-radius",
    description: "Popover container border radius.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-pop-border-width",
    description: "Popover container border width.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-pop-close-border-radius",
    description: "Popover close button border radius.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-pop-close-color-text",
    description: "Popover close button icon color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-pop-close-color-text-hover",
    description: "Popover close button icon color on hover and focus.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-pop-close-shadow-focus",
    description: "Popover close button focus-visible shadow.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-pop-color-background",
    description: "Popover container background color (also used for the caret fill).",
    category: "component",
    value: null,
  },
  {
    name: "--kui-pop-color-border",
    description: "Popover container border color (also used for the caret border).",
    category: "component",
    value: null,
  },
  {
    name: "--kui-pop-color-text",
    description: "Popover content text color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-pop-font-family",
    description: "Popover container font family.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-pop-font-size",
    description: "Popover content font size.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-pop-font-weight",
    description: "Popover content font weight.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-pop-line-height",
    description: "Popover content line height.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-pop-padding",
    description: "Popover container inner padding.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-pop-shadow",
    description: "Popover container box shadow.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-pop-title-color-text",
    description: "Popover title text color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-pop-title-font-size",
    description: "Popover title font size.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-pop-title-font-weight",
    description: "Popover title font weight.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-pop-title-line-height",
    description: "Popover title line height.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-radio-color-background",
    description: "Radio background color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-radio-color-background-checked",
    description: "Radio background color when checked.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-radio-shadow-border",
    description: "Radio default border shadow.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-radio-shadow-border-checked",
    description: "Radio border shadow when checked.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-radio-shadow-border-hover",
    description: "Radio border shadow on hover.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-radio-shadow-focus",
    description: "Radio focus ring shadow.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-segmented-control-border-radius",
    description: "Segmented control button border radius (applied to the outer corners of the first and last buttons).",
    category: "component",
    value: null,
  },
  {
    name: "--kui-segmented-control-border-width",
    description: "Segmented control button border width.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-segmented-control-color-background",
    description: "Segmented control button background color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-segmented-control-color-background-disabled-selected",
    description: "Segmented control button background color when selected and disabled.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-segmented-control-color-background-selected",
    description: "Segmented control button background color when selected.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-segmented-control-color-border",
    description: "Segmented control button border color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-segmented-control-color-border-active",
    description: "Segmented control button border color when active (pressed).",
    category: "component",
    value: null,
  },
  {
    name: "--kui-segmented-control-color-border-disabled",
    description: "Segmented control button border color when disabled.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-segmented-control-color-border-hover",
    description: "Segmented control button border color on hover.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-segmented-control-color-border-selected",
    description: "Segmented control button border color when selected.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-segmented-control-color-text",
    description: "Segmented control button text color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-segmented-control-color-text-active",
    description: "Segmented control button text color when active (pressed).",
    category: "component",
    value: null,
  },
  {
    name: "--kui-segmented-control-color-text-disabled",
    description: "Segmented control button text color when disabled.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-segmented-control-color-text-hover",
    description: "Segmented control button text color on hover.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-segmented-control-color-text-selected",
    description: "Segmented control button text color when selected.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-segmented-control-font-family",
    description: "Segmented control font family.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-segmented-control-font-size",
    description: "Segmented control button font size.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-segmented-control-font-weight",
    description: "Segmented control button font weight.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-segmented-control-line-height",
    description: "Segmented control button line height.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-segmented-control-padding-x",
    description: "Segmented control button horizontal padding (small size).",
    category: "component",
    value: null,
  },
  {
    name: "--kui-segmented-control-padding-x-large",
    description: "Segmented control button horizontal padding (large size).",
    category: "component",
    value: null,
  },
  {
    name: "--kui-segmented-control-shadow-focus",
    description: "Segmented control button focus-visible shadow.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-select-border-radius",
    description: "Select dropdown popover border radius.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-select-color-border",
    description: "Select dropdown popover border color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-select-item-color-background",
    description: "Select item background color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-select-item-color-background-hover",
    description: "Select item background color on hover.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-select-item-color-background-selected",
    description: "Selected select item background color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-select-item-color-background-selected-disabled",
    description: "Selected and disabled select item background color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-select-item-color-text",
    description: "Select item text color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-select-item-color-text-disabled",
    description: "Disabled select item text color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-select-item-color-text-selected",
    description: "Selected select item text color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-select-item-font-size",
    description: "Select item font size.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-select-item-line-height",
    description: "Select item line height.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-select-item-padding-x",
    description: "Select item horizontal padding.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-select-item-padding-y",
    description: "Select item vertical padding.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-shadow",
    description: "0px 4px 20px 0px rgba(0, 0, 0, 0.08)",
    category: "shadow",
    value: "0px 4px 20px 0px rgba(0, 0, 0, 0.08)",
  },
  {
    name: "--kui-shadow-border",
    description: "0px 0px 0px 1px gray.20 inset",
    category: "shadow",
    value: "0px 0px 0px 1px #e0e4ea inset",
  },
  {
    name: "--kui-shadow-border-danger",
    description: "0px 0px 0px 1px red.60 inset",
    category: "shadow",
    value: "0px 0px 0px 1px #d60027 inset",
  },
  {
    name: "--kui-shadow-border-danger-strong",
    description: "0px 0px 0px 1px red.70 inset",
    category: "shadow",
    value: "0px 0px 0px 1px #ad000e inset",
  },
  {
    name: "--kui-shadow-border-disabled",
    description: "0px 0px 0px 1px gray.20 inset",
    category: "shadow",
    value: "0px 0px 0px 1px #e0e4ea inset",
  },
  {
    name: "--kui-shadow-border-primary",
    description: "0px 0px 0px 1px blue.60 inset",
    category: "shadow",
    value: "0px 0px 0px 1px #0044f4 inset",
  },
  {
    name: "--kui-shadow-border-primary-strongest",
    description: "0px 0px 0px 1px blue.90 inset",
    category: "shadow",
    value: "0px 0px 0px 1px #001466 inset",
  },
  {
    name: "--kui-shadow-border-primary-weak",
    description: "0px 0px 0px 1px blue.40 inset",
    category: "shadow",
    value: "0px 0px 0px 1px #5f9aff inset",
  },
  {
    name: "--kui-shadow-focus",
    description: "0px 0px 0px 4px rgba(0, 68, 244, 0.2)",
    category: "shadow",
    value: "0px 0px 0px 4px rgba(0, 68, 244, 0.2)",
  },
  {
    name: "--kui-skeleton-border-radius",
    description: "Skeleton placeholder box border radius.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-skeleton-card-border-radius",
    description: "Card skeleton wrapper border radius.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-skeleton-card-border-width",
    description: "Card skeleton wrapper border width.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-skeleton-card-color-border",
    description: "Card skeleton wrapper border color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-skeleton-color-background",
    description: "Skeleton placeholder base background color (the resting/non-highlighted gradient stops of the shimmer).",
    category: "component",
    value: null,
  },
  {
    name: "--kui-skeleton-color-background-shimmer",
    description: "Skeleton placeholder animated shimmer/highlight color (the moving bright gradient stop).",
    category: "component",
    value: null,
  },
  {
    name: "--kui-skeleton-fullscreen-color-background",
    description: "Fullscreen skeleton loader backdrop/overlay background color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-skeleton-progress-border-radius",
    description: "Fullscreen skeleton progress bar (track and fill) border radius.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-skeleton-progress-color-background",
    description: "Fullscreen skeleton progress bar track background color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-skeleton-progress-color-background-active",
    description: "Fullscreen skeleton progress bar fill (completed progress) background color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-skeleton-spinner-border-radius",
    description: "Fullscreen generic spinner border radius.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-skeleton-spinner-color-border",
    description: "Fullscreen generic spinner track (inactive) border color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-skeleton-spinner-color-border-active",
    description: "Fullscreen generic spinner active (leading) segment border color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-skeleton-table-border-width",
    description: "Table skeleton row divider border width.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-skeleton-table-color-border",
    description: "Table skeleton row divider border color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-slideout-border-width",
    description: "Slideout panel left border width.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-slideout-close-border-radius",
    description: "Slideout close button border radius.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-slideout-close-color-text-hover",
    description: "Slideout close button icon color on hover and focus.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-slideout-close-shadow-focus",
    description: "Slideout close button focus-visible shadow.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-slideout-color-background",
    description: "Slideout panel background color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-slideout-color-border",
    description: "Slideout panel left border color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-slideout-color-text",
    description: "Slideout content text color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-slideout-font-family",
    description: "Slideout content font family.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-slideout-font-size",
    description: "Slideout content font size.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-slideout-font-weight",
    description: "Slideout content font weight.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-slideout-line-height",
    description: "Slideout content line height.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-slideout-padding",
    description: "Slideout panel inner padding.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-slideout-shadow",
    description: "Slideout panel box shadow.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-slideout-title-font-family",
    description: "Slideout title font family.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-slideout-title-font-size",
    description: "Slideout title font size.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-slideout-title-font-weight",
    description: "Slideout title font weight.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-slideout-title-line-height",
    description: "Slideout title line height.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-slider-fill-color-background",
    description: "Slider filled (progress) track background color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-slider-fill-color-background-disabled",
    description: "Slider filled (progress) track background color when disabled.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-slider-mark-color-text",
    description: "Slider mark label text color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-slider-mark-font-family",
    description: "Slider mark label font family.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-slider-mark-font-size",
    description: "Slider mark label font size.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-slider-mark-font-weight",
    description: "Slider mark label font weight.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-slider-mark-line-height",
    description: "Slider mark label line height.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-slider-thumb-border-radius",
    description: "Slider thumb (handle) border radius.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-slider-thumb-color-background",
    description: "Slider thumb (handle) background color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-slider-thumb-color-background-disabled",
    description: "Slider thumb (handle) background color when disabled.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-slider-thumb-shadow-focus",
    description: "Slider thumb (handle) focus-visible shadow.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-slider-thumb-size",
    description: "Slider thumb (handle) height and width.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-slider-track-border-radius",
    description: "Slider track border radius.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-slider-track-color-background",
    description: "Slider track (unfilled) background color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-space-0",
    description: "0px value for gaps, margin, or padding.",
    category: "space",
    value: "0px",
  },
  {
    name: "--kui-space-10",
    description: "2px value for gaps, margin, or padding.",
    category: "space",
    value: "2px",
  },
  {
    name: "--kui-space-100",
    description: "40px value for gaps, margin, or padding.",
    category: "space",
    value: "40px",
  },
  {
    name: "--kui-space-110",
    description: "48px value for gaps, margin, or padding.",
    category: "space",
    value: "48px",
  },
  {
    name: "--kui-space-120",
    description: "56px value for gaps, margin, or padding.",
    category: "space",
    value: "56px",
  },
  {
    name: "--kui-space-130",
    description: "64px value for gaps, margin, or padding.",
    category: "space",
    value: "64px",
  },
  {
    name: "--kui-space-140",
    description: "80px value for gaps, margin, or padding.",
    category: "space",
    value: "80px",
  },
  {
    name: "--kui-space-150",
    description: "96px value for gaps, margin, or padding.",
    category: "space",
    value: "96px",
  },
  {
    name: "--kui-space-20",
    description: "4px value for gaps, margin, or padding.",
    category: "space",
    value: "4px",
  },
  {
    name: "--kui-space-30",
    description: "6px value for gaps, margin, or padding.",
    category: "space",
    value: "6px",
  },
  {
    name: "--kui-space-40",
    description: "8px value for gaps, margin, or padding.",
    category: "space",
    value: "8px",
  },
  {
    name: "--kui-space-50",
    description: "12px value for gaps, margin, or padding.",
    category: "space",
    value: "12px",
  },
  {
    name: "--kui-space-60",
    description: "16px value for gaps, margin, or padding.",
    category: "space",
    value: "16px",
  },
  {
    name: "--kui-space-70",
    description: "20px value for gaps, margin, or padding.",
    category: "space",
    value: "20px",
  },
  {
    name: "--kui-space-80",
    description: "24px value for gaps, margin, or padding.",
    category: "space",
    value: "24px",
  },
  {
    name: "--kui-space-90",
    description: "32px value for gaps, margin, or padding.",
    category: "space",
    value: "32px",
  },
  {
    name: "--kui-space-auto",
    description: "auto",
    category: "space",
    value: "auto",
  },
  {
    name: "--kui-status-color-100",
    description: "Color representing response status code 100 (blue.20).",
    category: "status",
    value: "#bee2ff",
  },
  {
    name: "--kui-status-color-100s",
    description: "Color for a group of response status codes in the 100-199 range (blue.40).",
    category: "status",
    value: "#5f9aff",
  },
  {
    name: "--kui-status-color-101",
    description: "Color representing response status code 101 (blue.30).",
    category: "status",
    value: "#8fc1ff",
  },
  {
    name: "--kui-status-color-102",
    description: "Color representing response status code 102 (blue.40).",
    category: "status",
    value: "#5f9aff",
  },
  {
    name: "--kui-status-color-103",
    description: "Color representing response status code 103 (blue.50).",
    category: "status",
    value: "#306fff",
  },
  {
    name: "--kui-status-color-1na",
    description: "Color for unknown response status codes in the 100-199 range (blue.10).",
    category: "status",
    value: "#eefaff",
  },
  {
    name: "--kui-status-color-200",
    description: "Color representing response status code 200 (green.20).",
    category: "status",
    value: "#b5ffee",
  },
  {
    name: "--kui-status-color-200s",
    description: "Color for a group of response status codes in the 200-299 range (green.40).",
    category: "status",
    value: "#00d6a4",
  },
  {
    name: "--kui-status-color-201",
    description: "Color representing response status code 201 (green.30).",
    category: "status",
    value: "#00fabe",
  },
  {
    name: "--kui-status-color-202",
    description: "Color representing response status code 202 (green.40).",
    category: "status",
    value: "#00d6a4",
  },
  {
    name: "--kui-status-color-203",
    description: "Color representing response status code 203 (green.50).",
    category: "status",
    value: "#00a17b",
  },
  {
    name: "--kui-status-color-204",
    description: "Color representing response status code 204 (green.60).",
    category: "status",
    value: "#007d60",
  },
  {
    name: "--kui-status-color-205",
    description: "Color representing response status code 205 (green.70).",
    category: "status",
    value: "#005944",
  },
  {
    name: "--kui-status-color-206",
    description: "Color representing response status code 206 (green.20).",
    category: "status",
    value: "#b5ffee",
  },
  {
    name: "--kui-status-color-207",
    description: "Color representing response status code 207 (green.30).",
    category: "status",
    value: "#00fabe",
  },
  {
    name: "--kui-status-color-208",
    description: "Color representing response status code 208 (green.40).",
    category: "status",
    value: "#b5ffee",
  },
  {
    name: "--kui-status-color-226",
    description: "Color representing response status code 226 (green.50).",
    category: "status",
    value: "#00a17b",
  },
  {
    name: "--kui-status-color-2na",
    description: "Color for unknown response status codes in the 200-299 range (green.10).",
    category: "status",
    value: "#ecfffb",
  },
  {
    name: "--kui-status-color-300",
    description: "Color representing response status code 100 (yellow.20).",
    category: "status",
    value: "#fff296",
  },
  {
    name: "--kui-status-color-300s",
    description: "Color for a group of response status codes in the 300-399 range (yellow.40).",
    category: "status",
    value: "#ffc400",
  },
  {
    name: "--kui-status-color-301",
    description: "Color representing response status code 101 (yellow.30).",
    category: "status",
    value: "#ffe04b",
  },
  {
    name: "--kui-status-color-302",
    description: "Color representing response status code 102 (yellow.40).",
    category: "status",
    value: "#ffc400",
  },
  {
    name: "--kui-status-color-303",
    description: "Color representing response status code 103 (yellow.50).",
    category: "status",
    value: "#b37600",
  },
  {
    name: "--kui-status-color-304",
    description: "Color representing response status code 103 (yellow.60).",
    category: "status",
    value: "#995c00",
  },
  {
    name: "--kui-status-color-305",
    description: "Color representing response status code 103 (yellow.70).",
    category: "status",
    value: "#804400",
  },
  {
    name: "--kui-status-color-307",
    description: "Color representing response status code 103 (yellow.20).",
    category: "status",
    value: "#fff296",
  },
  {
    name: "--kui-status-color-308",
    description: "Color representing response status code 103 (yellow.30).",
    category: "status",
    value: "#ffe04b",
  },
  {
    name: "--kui-status-color-3na",
    description: "Color for unknown response status codes in the 300-399 range (yellow.10).",
    category: "status",
    value: "#fffce0",
  },
  {
    name: "--kui-status-color-400",
    description: "Color representing response status code 400 (orange.20).",
    category: "status",
    value: "#ffc2b3",
  },
  {
    name: "--kui-status-color-400s",
    description: "Color for a group of response status codes in the 400-499 range (orange.40).",
    category: "status",
    value: "#ff723c",
  },
  {
    name: "--kui-status-color-401",
    description: "Color representing response status code 401 (orange.30).",
    category: "status",
    value: "#ff9877",
  },
  {
    name: "--kui-status-color-402",
    description: "Color representing response status code 402 (orange.40).",
    category: "status",
    value: "#ff723c",
  },
  {
    name: "--kui-status-color-403",
    description: "Color representing response status code 403 (orange.50).",
    category: "status",
    value: "#f75008",
  },
  {
    name: "--kui-status-color-404",
    description: "Color representing response status code 404 (orange.60).",
    category: "status",
    value: "#d13500",
  },
  {
    name: "--kui-status-color-405",
    description: "Color representing response status code 405 (orange.70).",
    category: "status",
    value: "#a31f00",
  },
  {
    name: "--kui-status-color-406",
    description: "Color representing response status code 406 (orange.20).",
    category: "status",
    value: "#ffc2b3",
  },
  {
    name: "--kui-status-color-407",
    description: "Color representing response status code 407 (orange.30).",
    category: "status",
    value: "#ff9877",
  },
  {
    name: "--kui-status-color-408",
    description: "Color representing response status code 408 (orange.40).",
    category: "status",
    value: "#ff723c",
  },
  {
    name: "--kui-status-color-409",
    description: "Color representing response status code 409 (orange.50).",
    category: "status",
    value: "#f75008",
  },
  {
    name: "--kui-status-color-410",
    description: "Color representing response status code 410 (orange.60).",
    category: "status",
    value: "#d13500",
  },
  {
    name: "--kui-status-color-411",
    description: "Color representing response status code 411 (orange.70).",
    category: "status",
    value: "#a31f00",
  },
  {
    name: "--kui-status-color-412",
    description: "Color representing response status code 412 (orange.20).",
    category: "status",
    value: "#ffc2b3",
  },
  {
    name: "--kui-status-color-413",
    description: "Color representing response status code 413 (orange.30).",
    category: "status",
    value: "#ff9877",
  },
  {
    name: "--kui-status-color-414",
    description: "Color representing response status code 414 (orange.40).",
    category: "status",
    value: "#ff723c",
  },
  {
    name: "--kui-status-color-415",
    description: "Color representing response status code 415 (orange.50).",
    category: "status",
    value: "#f75008",
  },
  {
    name: "--kui-status-color-416",
    description: "Color representing response status code 416 (orange.60).",
    category: "status",
    value: "#d13500",
  },
  {
    name: "--kui-status-color-417",
    description: "Color representing response status code 417 (orange.70).",
    category: "status",
    value: "#a31f00",
  },
  {
    name: "--kui-status-color-418",
    description: "Color representing response status code 418 (orange.20).",
    category: "status",
    value: "#ffc2b3",
  },
  {
    name: "--kui-status-color-421",
    description: "Color representing response status code 421 (orange.30).",
    category: "status",
    value: "#ff9877",
  },
  {
    name: "--kui-status-color-422",
    description: "Color representing response status code 422 (orange.40).",
    category: "status",
    value: "#ff723c",
  },
  {
    name: "--kui-status-color-423",
    description: "Color representing response status code 423 (orange.50).",
    category: "status",
    value: "#f75008",
  },
  {
    name: "--kui-status-color-424",
    description: "Color representing response status code 424 (orange.60).",
    category: "status",
    value: "#d13500",
  },
  {
    name: "--kui-status-color-425",
    description: "Color representing response status code 425 (orange.70).",
    category: "status",
    value: "#a31f00",
  },
  {
    name: "--kui-status-color-426",
    description: "Color representing response status code 426 (orange.20).",
    category: "status",
    value: "#ffc2b3",
  },
  {
    name: "--kui-status-color-428",
    description: "Color representing response status code 428 (orange.30).",
    category: "status",
    value: "#ff9877",
  },
  {
    name: "--kui-status-color-429",
    description: "Color representing response status code 429 (orange.40).",
    category: "status",
    value: "#ff723c",
  },
  {
    name: "--kui-status-color-431",
    description: "Color representing response status code 431 (orange.50).",
    category: "status",
    value: "#f75008",
  },
  {
    name: "--kui-status-color-451",
    description: "Color representing response status code 451 (orange.60).",
    category: "status",
    value: "#d13500",
  },
  {
    name: "--kui-status-color-4na",
    description: "Color for unknown response status codes in the 400-499 range (orange.10).",
    category: "status",
    value: "#fff1ef",
  },
  {
    name: "--kui-status-color-500",
    description: "Color representing response status code 500 (red.20).",
    category: "status",
    value: "#ffabab",
  },
  {
    name: "--kui-status-color-500s",
    description: "Color for a group of response status codes in the 500-599 range (red.40).",
    category: "status",
    value: "#ff3954",
  },
  {
    name: "--kui-status-color-501",
    description: "Color representing response status code 501 (red.30).",
    category: "status",
    value: "#ff7272",
  },
  {
    name: "--kui-status-color-502",
    description: "Color representing response status code 502 (red.40).",
    category: "status",
    value: "#ff3954",
  },
  {
    name: "--kui-status-color-503",
    description: "Color representing response status code 503 (red.50).",
    category: "status",
    value: "#f50045",
  },
  {
    name: "--kui-status-color-504",
    description: "Color representing response status code 504 (red.60).",
    category: "status",
    value: "#d60027",
  },
  {
    name: "--kui-status-color-505",
    description: "Color representing response status code 505 (red.70).",
    category: "status",
    value: "#ad000e",
  },
  {
    name: "--kui-status-color-506",
    description: "Color representing response status code 506 (red.20).",
    category: "status",
    value: "#ffabab",
  },
  {
    name: "--kui-status-color-507",
    description: "Color representing response status code 507 (red.30).",
    category: "status",
    value: "#ff7272",
  },
  {
    name: "--kui-status-color-508",
    description: "Color representing response status code 508 (red.40).",
    category: "status",
    value: "#ff3954",
  },
  {
    name: "--kui-status-color-510",
    description: "Color representing response status code 510 (red.50).",
    category: "status",
    value: "#f50045",
  },
  {
    name: "--kui-status-color-511",
    description: "Color representing response status code 511 (red.60).",
    category: "status",
    value: "#d60027",
  },
  {
    name: "--kui-status-color-5na",
    description: "Color for unknown response status codes in the 500-599 range (red.10).",
    category: "status",
    value: "#ffe5e5",
  },
  {
    name: "--kui-status-color-background-100",
    description: "Background color for http status 100 elements (blue.10).",
    category: "status",
    value: "#eefaff",
  },
  {
    name: "--kui-status-color-background-200",
    description: "Background color for http status 200 elements (green.10).",
    category: "status",
    value: "#ecfffb",
  },
  {
    name: "--kui-status-color-background-300",
    description: "Background color for http status 300 elements (yellow.10).",
    category: "status",
    value: "#fffce0",
  },
  {
    name: "--kui-status-color-background-400",
    description: "Background color for http status 400 elements (orange.10).",
    category: "status",
    value: "#fff1ef",
  },
  {
    name: "--kui-status-color-background-500",
    description: "Background color for http status 500 elements (red.10).",
    category: "status",
    value: "#ffe5e5",
  },
  {
    name: "--kui-status-color-text-100",
    description: "Text color for http status 100 elements (blue.60).",
    category: "status",
    value: "#0044f4",
  },
  {
    name: "--kui-status-color-text-200",
    description: "Text color for http status 200 elements (green.60).",
    category: "status",
    value: "#007d60",
  },
  {
    name: "--kui-status-color-text-300",
    description: "Text color for http status 300 elements (yellow.60).",
    category: "status",
    value: "#995c00",
  },
  {
    name: "--kui-status-color-text-400",
    description: "Text color for http status 400 elements (orange.60).",
    category: "status",
    value: "#d13500",
  },
  {
    name: "--kui-status-color-text-500",
    description: "Text color for http status 500 elements (red.60).",
    category: "status",
    value: "#d60027",
  },
  {
    name: "--kui-stepper-border-radius",
    description: "Stepper step indicator (circle) border radius.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-stepper-border-width",
    description: "Stepper step indicator (circle) border width, applied to incomplete (default) steps.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-stepper-color-background",
    description: "Stepper step indicator (circle) background color for incomplete (default) and pending steps.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-stepper-color-background-completed",
    description: "Stepper step indicator (circle) background color for completed steps.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-stepper-color-background-error",
    description: "Stepper step indicator (circle) background color for steps in an error state.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-stepper-color-background-selected",
    description: "Stepper step indicator (circle) background color for the current/active step.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-stepper-color-border",
    description: "Stepper step indicator (circle) border color for incomplete (default) steps.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-stepper-color-text",
    description: "Stepper step number text color inside the step indicator (circle) for incomplete (default) and pending steps.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-stepper-color-text-label",
    description: "Stepper step label text color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-stepper-color-text-label-selected",
    description: "Stepper step label text color for the current/active and completed steps.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-stepper-color-text-selected",
    description: "Stepper step number text color inside the step indicator (circle) for the current/active step.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-stepper-connector-color-background",
    description: "Stepper connector line color between steps.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-stepper-connector-color-background-completed",
    description: "Stepper connector line color following a completed step.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-stepper-font-family",
    description: "Stepper step label font family.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-stepper-font-weight",
    description: "Stepper step number and label font weight.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-table-cell-color-text",
    description: "Table body cell text color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-table-cell-font-size",
    description: "Table body cell font size.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-table-cell-font-weight",
    description: "Table body cell font weight.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-table-cell-line-height",
    description: "Table body cell line height.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-table-cell-shadow-resize-hover",
    description: "Table body cell resize-handle hover indicator shadow.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-table-color-background",
    description: "Table background color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-table-font-family",
    description: "Table font family.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-table-header-color-border",
    description: "Table header bottom border color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-table-header-color-text",
    description: "Table header text color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-table-header-color-text-active-sort",
    description: "Table header text color when the column is the active sort column.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-table-header-font-size",
    description: "Table header font size.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-table-header-font-weight",
    description: "Table header font weight.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-table-header-line-height",
    description: "Table header line height.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-table-header-padding",
    description: "Table header cell inner padding.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-table-header-shadow-resize-hover",
    description: "Table header resize-handle hover indicator shadow.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-table-header-shadow-scrolled",
    description: "Table header shadow when the table body is scrolled.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-table-padding",
    description: "Table cell inner padding.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-table-row-color-background-expanded",
    description: "Table expanded (expandable content) row background color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-table-row-color-background-hover",
    description: "Table row background color on hover.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-table-row-color-border",
    description: "Table row divider (bottom border) color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-table-sticky-color-background",
    description: "Table sticky column (and actions column) cell background color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-tabs-border-radius",
    description: "Tabs tab link border radius (default appearance).",
    category: "component",
    value: null,
  },
  {
    name: "--kui-tabs-border-radius-minimal",
    description: "Tabs tab link border radius (minimal appearance).",
    category: "component",
    value: null,
  },
  {
    name: "--kui-tabs-border-width",
    description: "Tabs container bottom border width (default appearance).",
    category: "component",
    value: null,
  },
  {
    name: "--kui-tabs-border-width-selected",
    description: "Tabs current (selected) tab bottom border width — the active-tab underline (default appearance).",
    category: "component",
    value: null,
  },
  {
    name: "--kui-tabs-color-background-hover",
    description: "Tabs tab link background color on hover (default appearance).",
    category: "component",
    value: null,
  },
  {
    name: "--kui-tabs-color-border",
    description: "Tabs container bottom border color (default appearance).",
    category: "component",
    value: null,
  },
  {
    name: "--kui-tabs-color-border-selected",
    description: "Tabs current (selected) tab bottom border color — the active-tab underline (default appearance).",
    category: "component",
    value: null,
  },
  {
    name: "--kui-tabs-color-text",
    description: "Tabs tab link text color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-tabs-color-text-disabled",
    description: "Tabs tab link text color when disabled.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-tabs-color-text-hover",
    description: "Tabs tab link text color on hover and focus (default appearance).",
    category: "component",
    value: null,
  },
  {
    name: "--kui-tabs-color-text-minimal-hover",
    description: "Tabs tab link text color on hover (minimal appearance).",
    category: "component",
    value: null,
  },
  {
    name: "--kui-tabs-color-text-selected",
    description: "Tabs current (selected) tab link text color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-tabs-font-family",
    description: "Tabs font family.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-tabs-font-size",
    description: "Tabs tab link font size (default appearance).",
    category: "component",
    value: null,
  },
  {
    name: "--kui-tabs-font-size-minimal",
    description: "Tabs tab link font size (minimal appearance).",
    category: "component",
    value: null,
  },
  {
    name: "--kui-tabs-font-weight",
    description: "Tabs tab link font weight (default appearance).",
    category: "component",
    value: null,
  },
  {
    name: "--kui-tabs-font-weight-minimal",
    description: "Tabs tab link font weight (minimal appearance).",
    category: "component",
    value: null,
  },
  {
    name: "--kui-tabs-line-height",
    description: "Tabs tab link line height (default appearance).",
    category: "component",
    value: null,
  },
  {
    name: "--kui-tabs-line-height-minimal",
    description: "Tabs tab link line height (minimal appearance).",
    category: "component",
    value: null,
  },
  {
    name: "--kui-tabs-padding",
    description: "Tabs tab link inner padding (default appearance).",
    category: "component",
    value: null,
  },
  {
    name: "--kui-tabs-shadow-focus",
    description: "Tabs tab link focus-visible shadow.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-toaster-border-radius",
    description: "Toaster border radius.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-toaster-close-border-radius",
    description: "Toaster close button border radius.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-toaster-close-color-text-hover",
    description: "Toaster close button icon color on hover and focus.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-toaster-close-shadow-focus",
    description: "Toaster close button focus-visible shadow.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-toaster-color-background",
    description: "Toaster background color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-toaster-color-text",
    description: "Toaster text color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-toaster-font-family",
    description: "Toaster message font family.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-toaster-font-size",
    description: "Toaster message font size.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-toaster-font-weight",
    description: "Toaster message font weight.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-toaster-icon-color",
    description: "Toaster icon color (knockout matching the toaster background).",
    category: "component",
    value: null,
  },
  {
    name: "--kui-toaster-icon-color-background",
    description: "Toaster icon container background color (info appearance as default).",
    category: "component",
    value: null,
  },
  {
    name: "--kui-toaster-icon-color-background-danger",
    description: "Danger toaster icon container background color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-toaster-icon-color-background-info",
    description: "Info toaster icon container background color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-toaster-icon-color-background-success",
    description: "Success toaster icon container background color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-toaster-icon-color-background-system",
    description: "System toaster icon container background color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-toaster-icon-color-background-warning",
    description: "Warning toaster icon container background color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-toaster-line-height",
    description: "Toaster message line height.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-toaster-padding",
    description: "Toaster inner padding.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-toaster-shadow",
    description: "Toaster box shadow.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-toaster-title-font-size",
    description: "Toaster title font size.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-toaster-title-font-weight",
    description: "Toaster title font weight.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-toaster-title-line-height",
    description: "Toaster title line height.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-tooltip-border-radius",
    description: "Tooltip border radius.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-tooltip-color-background",
    description: "Tooltip background color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-tooltip-color-text",
    description: "Tooltip text color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-tooltip-font-family",
    description: "Tooltip font family.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-tooltip-font-size",
    description: "Tooltip font size.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-tooltip-font-weight",
    description: "Tooltip font weight.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-tooltip-line-height",
    description: "Tooltip line height.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-tooltip-padding",
    description: "Tooltip inner padding.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-tree-list-border-radius",
    description: "Tree list item border radius (also applied to the expand/collapse toggle focus ring).",
    category: "component",
    value: null,
  },
  {
    name: "--kui-tree-list-border-width",
    description: "Tree list item border width.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-tree-list-color-background",
    description: "Tree list item background color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-tree-list-color-background-drag-indicator",
    description: "Tree list drag indicator bar background color, shown when dragging an item to a drop location.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-tree-list-color-background-hover",
    description: "Tree list item background color on hover, focus, and focus-visible.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-tree-list-color-background-selected",
    description: "Tree list item background color when selected.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-tree-list-color-border",
    description: "Tree list item border color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-tree-list-color-border-connector",
    description: "Tree list connecting line color (the lines linking parent and child items).",
    category: "component",
    value: null,
  },
  {
    name: "--kui-tree-list-color-border-selected",
    description: "Tree list item border color when selected.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-tree-list-color-text",
    description: "Tree list item text color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-tree-list-color-text-icon",
    description: "Tree list item leading icon color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-tree-list-color-text-icon-selected",
    description: "Tree list item leading icon color when selected.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-tree-list-font-family",
    description: "Tree list font family.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-tree-list-font-weight",
    description: "Tree list item font weight.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-tree-list-padding",
    description: "Tree list item padding.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-tree-list-shadow-focus",
    description: "Tree list item focus-visible shadow (focus ring).",
    category: "component",
    value: null,
  },
  {
    name: "--kui-truncate-collapse-trigger-color-background",
    description: "Truncate collapse trigger button background color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-truncate-collapse-trigger-color-background-hover",
    description: "Truncate collapse trigger button background color on hover, focus, and focus-within.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-truncate-collapse-trigger-color-text",
    description: "Truncate collapse trigger button text color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-truncate-expand-trigger-color-text",
    description: "Truncate expand trigger button text color.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-truncate-expand-trigger-color-text-hover",
    description: "Truncate expand trigger button text color on hover and focus.",
    category: "component",
    value: null,
  },
  {
    name: "--kui-truncate-shadow-focus",
    description: "Truncate expand and collapse trigger button focus-visible ring shadow.",
    category: "component",
    value: null,
  },
]
```

</details>

### JSON

<details>

<summary>Click to view the exported JSON object</summary>

```json
{
  "kui_color_background": "#ffffff",
  "kui_color_background_accent": "#0044f4",
  "kui_color_background_danger": "#d60027",
  "kui_color_background_danger_strong": "#ad000e",
  "kui_color_background_danger_stronger": "#850000",
  "kui_color_background_danger_strongest": "#5c0000",
  "kui_color_background_danger_weak": "#ff3954",
  "kui_color_background_danger_weaker": "#ffabab",
  "kui_color_background_danger_weakest": "#ffe5e5",
  "kui_color_background_decorative_aqua_weakest": "#ecfcff",
  "kui_color_background_decorative_purple": "#6f28ff",
  "kui_color_background_decorative_purple_weakest": "#f1f0ff",
  "kui_color_background_disabled": "#e0e4ea",
  "kui_color_background_info": "#0044f4",
  "kui_color_background_info_strong": "#0030cc",
  "kui_color_background_info_stronger": "#002099",
  "kui_color_background_info_strongest": "#001466",
  "kui_color_background_info_weak": "#5f9aff",
  "kui_color_background_info_weaker": "#bee2ff",
  "kui_color_background_info_weakest": "#eefaff",
  "kui_color_background_inverse": "#000933",
  "kui_color_background_neutral": "#6c7489",
  "kui_color_background_neutral_strong": "#52596e",
  "kui_color_background_neutral_stronger": "#3a3f51",
  "kui_color_background_neutral_strongest": "#232633",
  "kui_color_background_neutral_weak": "#afb7c5",
  "kui_color_background_neutral_weaker": "#e0e4ea",
  "kui_color_background_neutral_weakest": "#f9fafb",
  "kui_color_background_overlay": "rgba(0, 9, 51, 0.6)",
  "kui_color_background_primary": "#0044f4",
  "kui_color_background_primary_strong": "#0030cc",
  "kui_color_background_primary_stronger": "#002099",
  "kui_color_background_primary_strongest": "#001466",
  "kui_color_background_primary_weak": "#5f9aff",
  "kui_color_background_primary_weaker": "#bee2ff",
  "kui_color_background_primary_weakest": "#eefaff",
  "kui_color_background_success": "#007d60",
  "kui_color_background_success_strong": "#005944",
  "kui_color_background_success_stronger": "#004737",
  "kui_color_background_success_strongest": "#003629",
  "kui_color_background_success_weak": "#00d6a4",
  "kui_color_background_success_weaker": "#b5ffee",
  "kui_color_background_success_weakest": "#ecfffb",
  "kui_color_background_transparent": "rgba(0, 0, 0, 0)",
  "kui_color_background_warning": "#995c00",
  "kui_color_background_warning_strong": "#804400",
  "kui_color_background_warning_stronger": "#662d00",
  "kui_color_background_warning_strongest": "#4d1b00",
  "kui_color_background_warning_weak": "#ffc400",
  "kui_color_background_warning_weaker": "#fff296",
  "kui_color_background_warning_weakest": "#fffce0",
  "kui_color_border": "#e0e4ea",
  "kui_color_border_accent": "#0044f4",
  "kui_color_border_danger": "#d60027",
  "kui_color_border_danger_strong": "#ad000e",
  "kui_color_border_danger_stronger": "#850000",
  "kui_color_border_danger_strongest": "#5c0000",
  "kui_color_border_danger_weak": "#ff3954",
  "kui_color_border_danger_weaker": "#ffabab",
  "kui_color_border_danger_weakest": "#ffe5e5",
  "kui_color_border_decorative_purple": "#6f28ff",
  "kui_color_border_disabled": "#e0e4ea",
  "kui_color_border_inverse": "rgba(255, 255, 255, 0.2)",
  "kui_color_border_neutral": "#6c7489",
  "kui_color_border_neutral_strong": "#52596e",
  "kui_color_border_neutral_stronger": "#3a3f51",
  "kui_color_border_neutral_strongest": "#232633",
  "kui_color_border_neutral_weak": "#afb7c5",
  "kui_color_border_neutral_weaker": "#e0e4ea",
  "kui_color_border_neutral_weakest": "#f9fafb",
  "kui_color_border_primary": "#0044f4",
  "kui_color_border_primary_strong": "#0030cc",
  "kui_color_border_primary_stronger": "#002099",
  "kui_color_border_primary_strongest": "#001466",
  "kui_color_border_primary_weak": "#5f9aff",
  "kui_color_border_primary_weaker": "#bee2ff",
  "kui_color_border_primary_weakest": "#eefaff",
  "kui_color_border_transparent": "rgba(0, 0, 0, 0)",
  "kui_color_text": "#000933",
  "kui_color_text_accent": "#0044f4",
  "kui_color_text_danger": "#d60027",
  "kui_color_text_danger_strong": "#ad000e",
  "kui_color_text_danger_stronger": "#850000",
  "kui_color_text_danger_strongest": "#5c0000",
  "kui_color_text_danger_weak": "#ff3954",
  "kui_color_text_danger_weaker": "#ffabab",
  "kui_color_text_danger_weakest": "#ffe5e5",
  "kui_color_text_decorative_aqua": "#00abd2",
  "kui_color_text_decorative_pink": "#d60067",
  "kui_color_text_decorative_purple": "#6f28ff",
  "kui_color_text_decorative_purple_strong": "#5e00f5",
  "kui_color_text_disabled": "#afb7c5",
  "kui_color_text_info": "#0044f4",
  "kui_color_text_info_strong": "#0030cc",
  "kui_color_text_info_stronger": "#002099",
  "kui_color_text_info_strongest": "#001466",
  "kui_color_text_info_weak": "#5f9aff",
  "kui_color_text_info_weaker": "#bee2ff",
  "kui_color_text_info_weakest": "#eefaff",
  "kui_color_text_inverse": "#ffffff",
  "kui_color_text_neutral": "#6c7489",
  "kui_color_text_neutral_strong": "#52596e",
  "kui_color_text_neutral_stronger": "#3a3f51",
  "kui_color_text_neutral_strongest": "#232633",
  "kui_color_text_neutral_weak": "#afb7c5",
  "kui_color_text_neutral_weaker": "#e0e4ea",
  "kui_color_text_neutral_weakest": "#f9fafb",
  "kui_color_text_primary": "#0044f4",
  "kui_color_text_primary_strong": "#0030cc",
  "kui_color_text_primary_stronger": "#002099",
  "kui_color_text_primary_strongest": "#001466",
  "kui_color_text_primary_weak": "#5f9aff",
  "kui_color_text_primary_weaker": "#bee2ff",
  "kui_color_text_primary_weakest": "#eefaff",
  "kui_color_text_success": "#007d60",
  "kui_color_text_success_strong": "#005944",
  "kui_color_text_success_stronger": "#004737",
  "kui_color_text_success_strongest": "#003629",
  "kui_color_text_success_weak": "#00d6a4",
  "kui_color_text_success_weaker": "#b5ffee",
  "kui_color_text_success_weakest": "#ecfffb",
  "kui_color_text_warning": "#995c00",
  "kui_color_text_warning_strong": "#804400",
  "kui_color_text_warning_stronger": "#662d00",
  "kui_color_text_warning_strongest": "#4d1b00",
  "kui_color_text_warning_weak": "#ffc400",
  "kui_color_text_warning_weaker": "#fff296",
  "kui_color_text_warning_weakest": "#fffce0",
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
  "kui_icon_color_danger": "#f50045",
  "kui_icon_color_neutral": "#828a9e",
  "kui_icon_color_primary": "#306fff",
  "kui_icon_color_success": "#00a17b",
  "kui_icon_color_warning": "#ffc400",
  "kui_icon_size_10": "10px",
  "kui_icon_size_20": "12px",
  "kui_icon_size_30": "16px",
  "kui_icon_size_40": "20px",
  "kui_icon_size_50": "24px",
  "kui_icon_size_60": "32px",
  "kui_icon_size_70": "40px",
  "kui_icon_size_80": "48px",
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
  "kui_method_color_background_connect": "#f1f0ff",
  "kui_method_color_background_delete": "#ffe5e5",
  "kui_method_color_background_get": "#eefaff",
  "kui_method_color_background_head": "#52596e",
  "kui_method_color_background_options": "#e0e4ea",
  "kui_method_color_background_patch": "#ecfcff",
  "kui_method_color_background_post": "#ecfffb",
  "kui_method_color_background_put": "#fffce0",
  "kui_method_color_background_trace": "#fff0f7",
  "kui_method_color_text_connect": "#6f28ff",
  "kui_method_color_text_connect_strong": "#5e00f5",
  "kui_method_color_text_delete": "#d60027",
  "kui_method_color_text_delete_strong": "#ad000e",
  "kui_method_color_text_get": "#0044f4",
  "kui_method_color_text_get_strong": "#0030cc",
  "kui_method_color_text_head": "#e0e4ea",
  "kui_method_color_text_head_strong": "#afb7c5",
  "kui_method_color_text_options": "#52596e",
  "kui_method_color_text_options_strong": "#3a3f51",
  "kui_method_color_text_patch": "#00819d",
  "kui_method_color_text_patch_strong": "#00647a",
  "kui_method_color_text_post": "#007d60",
  "kui_method_color_text_post_strong": "#005944",
  "kui_method_color_text_put": "#995c00",
  "kui_method_color_text_put_strong": "#804400",
  "kui_method_color_text_trace": "#d60067",
  "kui_method_color_text_trace_strong": "#ad0053",
  "kui_navigation_color_background": "#000933",
  "kui_navigation_color_background_selected": "rgba(255, 255, 255, 0.12)",
  "kui_navigation_color_border": "rgba(255, 255, 255, 0.12)",
  "kui_navigation_color_border_child": "#00fabe",
  "kui_navigation_color_border_divider": "rgba(255, 255, 255, 0.24)",
  "kui_navigation_color_text": "#bee2ff",
  "kui_navigation_color_text_focus": "#ffffff",
  "kui_navigation_color_text_hover": "#eefaff",
  "kui_navigation_color_text_selected": "#00fabe",
  "kui_navigation_shadow_border": "0 0 0 1px rgba(255, 255, 255, 0.12) inset",
  "kui_navigation_shadow_border_child": "4px 0 0 0 #00fabe inset",
  "kui_navigation_shadow_focus": "0 0 0 1px rgba(255, 255, 255, 0.60) inset",
  "kui_shadow": "0px 4px 20px 0px rgba(0, 0, 0, 0.08)",
  "kui_shadow_border": "0px 0px 0px 1px #e0e4ea inset",
  "kui_shadow_border_danger": "0px 0px 0px 1px #d60027 inset",
  "kui_shadow_border_danger_strong": "0px 0px 0px 1px #ad000e inset",
  "kui_shadow_border_disabled": "0px 0px 0px 1px #e0e4ea inset",
  "kui_shadow_border_primary": "0px 0px 0px 1px #0044f4 inset",
  "kui_shadow_border_primary_strongest": "0px 0px 0px 1px #001466 inset",
  "kui_shadow_border_primary_weak": "0px 0px 0px 1px #5f9aff inset",
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
  "kui_space_auto": "auto",
  "kui_status_color_100": "#bee2ff",
  "kui_status_color_101": "#8fc1ff",
  "kui_status_color_102": "#5f9aff",
  "kui_status_color_103": "#306fff",
  "kui_status_color_200": "#b5ffee",
  "kui_status_color_201": "#00fabe",
  "kui_status_color_202": "#00d6a4",
  "kui_status_color_203": "#00a17b",
  "kui_status_color_204": "#007d60",
  "kui_status_color_205": "#005944",
  "kui_status_color_206": "#b5ffee",
  "kui_status_color_207": "#00fabe",
  "kui_status_color_208": "#b5ffee",
  "kui_status_color_226": "#00a17b",
  "kui_status_color_300": "#fff296",
  "kui_status_color_301": "#ffe04b",
  "kui_status_color_302": "#ffc400",
  "kui_status_color_303": "#b37600",
  "kui_status_color_304": "#995c00",
  "kui_status_color_305": "#804400",
  "kui_status_color_307": "#fff296",
  "kui_status_color_308": "#ffe04b",
  "kui_status_color_400": "#ffc2b3",
  "kui_status_color_401": "#ff9877",
  "kui_status_color_402": "#ff723c",
  "kui_status_color_403": "#f75008",
  "kui_status_color_404": "#d13500",
  "kui_status_color_405": "#a31f00",
  "kui_status_color_406": "#ffc2b3",
  "kui_status_color_407": "#ff9877",
  "kui_status_color_408": "#ff723c",
  "kui_status_color_409": "#f75008",
  "kui_status_color_410": "#d13500",
  "kui_status_color_411": "#a31f00",
  "kui_status_color_412": "#ffc2b3",
  "kui_status_color_413": "#ff9877",
  "kui_status_color_414": "#ff723c",
  "kui_status_color_415": "#f75008",
  "kui_status_color_416": "#d13500",
  "kui_status_color_417": "#a31f00",
  "kui_status_color_418": "#ffc2b3",
  "kui_status_color_421": "#ff9877",
  "kui_status_color_422": "#ff723c",
  "kui_status_color_423": "#f75008",
  "kui_status_color_424": "#d13500",
  "kui_status_color_425": "#a31f00",
  "kui_status_color_426": "#ffc2b3",
  "kui_status_color_428": "#ff9877",
  "kui_status_color_429": "#ff723c",
  "kui_status_color_431": "#f75008",
  "kui_status_color_451": "#d13500",
  "kui_status_color_500": "#ffabab",
  "kui_status_color_501": "#ff7272",
  "kui_status_color_502": "#ff3954",
  "kui_status_color_503": "#f50045",
  "kui_status_color_504": "#d60027",
  "kui_status_color_505": "#ad000e",
  "kui_status_color_506": "#ffabab",
  "kui_status_color_507": "#ff7272",
  "kui_status_color_508": "#ff3954",
  "kui_status_color_510": "#f50045",
  "kui_status_color_511": "#d60027",
  "kui_status_color_1na": "#eefaff",
  "kui_status_color_2na": "#ecfffb",
  "kui_status_color_3na": "#fffce0",
  "kui_status_color_4na": "#fff1ef",
  "kui_status_color_5na": "#ffe5e5",
  "kui_status_color_100s": "#5f9aff",
  "kui_status_color_200s": "#00d6a4",
  "kui_status_color_300s": "#ffc400",
  "kui_status_color_400s": "#ff723c",
  "kui_status_color_500s": "#ff3954",
  "kui_status_color_background_100": "#eefaff",
  "kui_status_color_background_200": "#ecfffb",
  "kui_status_color_background_300": "#fffce0",
  "kui_status_color_background_400": "#fff1ef",
  "kui_status_color_background_500": "#ffe5e5",
  "kui_status_color_text_100": "#0044f4",
  "kui_status_color_text_200": "#007d60",
  "kui_status_color_text_300": "#995c00",
  "kui_status_color_text_400": "#d13500",
  "kui_status_color_text_500": "#d60027"
}
```

</details>
