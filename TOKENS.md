<!--
 * Do not edit directly
 * Generated on Thu, 06 Jul 2023 15:19:58 GMT
 * 
 * Kong Design Tokens
 * GitHub: https://github.com/Kong/design-tokens
 * License: Apache-2.0
-->

# Kong Design Tokens

This document outlines all of the available tokens.

## SCSS Variables

<details>

<summary>Click to view the list of SCSS variables</summary>

```scss
$kui-color-background: #ffffff; /* white */
$kui-color-background-danger: #d60027; /* red.60 */
$kui-color-background-danger-strong: #ad000e; /* red.70 */
$kui-color-background-danger-stronger: #850000; /* red.80 */
$kui-color-background-danger-strongest: #5c0000; /* red.90 */
$kui-color-background-danger-weak: #ff3954; /* red.40 */
$kui-color-background-danger-weaker: #ffabab; /* red.20 */
$kui-color-background-danger-weakest: #ffe5e5; /* red.10 */
$kui-color-background-disabled: #e0e4ea; /* gray.20 */
$kui-color-background-inverse: #000933; /* blue.100 */
$kui-color-background-neutral: #6c7489; /* gray.60 */
$kui-color-background-neutral-strong: #52596e; /* gray.70 */
$kui-color-background-neutral-stronger: #3a3f51; /* gray.80 */
$kui-color-background-neutral-strongest: #232633; /* gray.90 */
$kui-color-background-neutral-weak: #afb7c5; /* gray.40 */
$kui-color-background-neutral-weaker: #e0e4ea; /* gray.20 */
$kui-color-background-neutral-weakest: #f9fafb; /* gray.10 */
$kui-color-background-primary: #0044f4; /* blue.60 */
$kui-color-background-primary-strong: #0030cc; /* blue.70 */
$kui-color-background-primary-stronger: #002099; /* blue.80 */
$kui-color-background-primary-strongest: #001466; /* blue.90 */
$kui-color-background-primary-weak: #5f9aff; /* blue.40 */
$kui-color-background-primary-weaker: #bee2ff; /* blue.20 */
$kui-color-background-primary-weakest: #eefaff; /* blue.10 */
$kui-color-background-success-weakest: #ecfffb; /* green.10 */
$kui-color-background-transparent: rgba(0, 0, 0, 0); /* transparent */
$kui-color-background-warning-weakest: #fffce0; /* yellow.10 */
$kui-color-border: #e0e4ea; /* gray.20 */
$kui-color-border-danger: #d60027; /* red.60 */
$kui-color-border-danger-strong: #ad000e; /* red.70 */
$kui-color-border-danger-stronger: #850000; /* red.80 */
$kui-color-border-danger-strongest: #5c0000; /* red.90 */
$kui-color-border-danger-weak: #ff3954; /* red.40 */
$kui-color-border-danger-weaker: #ffabab; /* red.20 */
$kui-color-border-danger-weakest: #ffe5e5; /* red.10 */
$kui-color-border-decorative: #6f28ff; /* purple.60 */
$kui-color-border-disabled: #e0e4ea; /* gray.20 */
$kui-color-border-neutral-weak: #afb7c5; /* gray.40 */
$kui-color-border-primary: #0044f4; /* blue.60 */
$kui-color-border-primary-strong: #0030cc; /* blue.70 */
$kui-color-border-primary-stronger: #002099; /* blue.80 */
$kui-color-border-primary-strongest: #001466; /* blue.90 */
$kui-color-border-primary-weak: #5f9aff; /* blue.40 */
$kui-color-border-primary-weaker: #bee2ff; /* blue.20 */
$kui-color-border-primary-weakest: #eefaff; /* blue.10 */
$kui-color-border-transparent: rgba(0, 0, 0, 0); /* transparent */
$kui-color-text: #000933; /* blue.100 */
$kui-color-text-danger: #d60027; /* red.60 */
$kui-color-text-decorative: #00abd2; /* aqua.50 */
$kui-color-text-disabled: #828a9e; /* gray.50 */
$kui-color-text-inverse: #ffffff; /* white */
$kui-color-text-neutral: #6c7489; /* gray.60 */
$kui-color-text-neutral-strong: #52596e; /* gray.70 */
$kui-color-text-neutral-stronger: #3a3f51; /* gray.80 */
$kui-color-text-neutral-strongest: #232633; /* gray.90 */
$kui-color-text-neutral-weak: #afb7c5; /* gray.40 */
$kui-color-text-primary: #0044f4; /* blue.60 */
$kui-color-text-primary-strong: #0030cc; /* blue.70 */
$kui-color-text-primary-stronger: #002099; /* blue.80 */
$kui-color-text-success: #007d60; /* green.60 */
$kui-color-text-warning: #995c00; /* yellow.60 */
$kui-border-radius-0: 0px;
$kui-border-radius-10: 2px;
$kui-border-radius-20: 4px;
$kui-border-radius-30: 6px;
$kui-border-radius-40: 8px;
$kui-border-radius-circle: 50%; /* Used to create a circle. Value of 50% */
$kui-border-radius-round: 100px; /* Used to round element corners. Value of 100px */
$kui-border-width-0: 0px;
$kui-border-width-10: 1px;
$kui-border-width-20: 2px;
$kui-border-width-30: 4px;
$kui-breakpoint-desktop: 1536px; /* Used for larger desktop screens. */
$kui-breakpoint-laptop: 1280px; /* Used for standard desktop screens. */
$kui-breakpoint-mobile: 640px; /* Used for larger mobile screens. Anything under this value is considered mobile. */
$kui-breakpoint-phablet: 768px; /* Used for tablet screens. */
$kui-breakpoint-tablet: 1024px; /* Used for larger tablet screens. Any viewport width less than this value is considered a mobile layout. Any viewport width this size and greater is considered a desktop layout. */
$kui-method-color-background-connect: #f1f0ff; /* purple.10 */
$kui-method-color-background-delete: #ffe5e5; /* red.10 */
$kui-method-color-background-get: #eefaff; /* blue.10 */
$kui-method-color-background-head: #6c7489; /* gray.60 */
$kui-method-color-background-options: #f9fafb; /* gray.10 */
$kui-method-color-background-patch: #ecfcff; /* aqua.10 */
$kui-method-color-background-post: #ecfffb; /* green.10 */
$kui-method-color-background-put: #fffce0; /* yellow.10 */
$kui-method-color-background-trace: #fff0f7; /* pink.10 */
$kui-method-color-text-connect: #6f28ff; /* purple.60 */
$kui-method-color-text-delete: #d60027; /* red.60 */
$kui-method-color-text-get: #0044f4; /* blue.60 */
$kui-method-color-text-head: #f9fafb; /* gray.10 */
$kui-method-color-text-options: #6c7489; /* gray.60 */
$kui-method-color-text-patch: #00819d; /* aqua.60 */
$kui-method-color-text-post: #007d60; /* green.60 */
$kui-method-color-text-put: #995c00; /* yellow.60 */
$kui-method-color-text-trace: #d60067; /* pink.60 */
$kui-font-family-code: 'JetBrains Mono', Consolas, monospace; /* The standard monospace font family. */
$kui-font-family-text: 'Inter', Roboto, Helvetica, sans-serif; /* The standard text font family. */
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
$kui-font-weight-bold: 700; /* 700 */
$kui-font-weight-medium: 500; /* 500 */
$kui-font-weight-regular: 400; /* 400: The normal font weight. */
$kui-font-weight-semibold: 600; /* 600 */
$kui-line-height-10: 12px; /* 12px */
$kui-line-height-20: 16px; /* 16px */
$kui-line-height-30: 20px; /* 20px */
$kui-line-height-40: 24px; /* 24px */
$kui-line-height-50: 28px; /* 28px */
$kui-line-height-60: 32px; /* 32px */
$kui-line-height-70: 36px; /* 36px */
$kui-line-height-80: 40px; /* 40px */
$kui-line-height-90: 48px; /* 48px */
$kui-line-height-100: 56px; /* 56px */
$kui-space-0: 0px; /* 0px */
$kui-space-10: 2px; /* 2px */
$kui-space-20: 4px; /* 4px */
$kui-space-30: 6px; /* 6px */
$kui-space-40: 8px; /* 8px */
$kui-space-50: 12px; /* 12px */
$kui-space-60: 16px; /* 16px */
$kui-space-70: 20px; /* 20px */
$kui-space-80: 24px; /* 24px */
$kui-space-90: 32px; /* 32px */
$kui-space-100: 40px; /* 40px */
$kui-space-110: 48px; /* 48px */
$kui-space-120: 56px; /* 56px */
$kui-space-130: 64px; /* 64px */
$kui-space-140: 80px; /* 80px */
$kui-space-150: 96px; /* 96px */
$kui-space-auto: auto; /* auto */
```

</details>

## JavaScript Variables

<details>

<summary>Click to view the list of JavaScript variables</summary>

```javascript
export const KUI_COLOR_BACKGROUND = "#ffffff"; /* white */
export const KUI_COLOR_BACKGROUND_DANGER = "#d60027"; /* red.60 */
export const KUI_COLOR_BACKGROUND_DANGER_STRONG = "#ad000e"; /* red.70 */
export const KUI_COLOR_BACKGROUND_DANGER_STRONGER = "#850000"; /* red.80 */
export const KUI_COLOR_BACKGROUND_DANGER_STRONGEST = "#5c0000"; /* red.90 */
export const KUI_COLOR_BACKGROUND_DANGER_WEAK = "#ff3954"; /* red.40 */
export const KUI_COLOR_BACKGROUND_DANGER_WEAKER = "#ffabab"; /* red.20 */
export const KUI_COLOR_BACKGROUND_DANGER_WEAKEST = "#ffe5e5"; /* red.10 */
export const KUI_COLOR_BACKGROUND_DISABLED = "#e0e4ea"; /* gray.20 */
export const KUI_COLOR_BACKGROUND_INVERSE = "#000933"; /* blue.100 */
export const KUI_COLOR_BACKGROUND_NEUTRAL = "#6c7489"; /* gray.60 */
export const KUI_COLOR_BACKGROUND_NEUTRAL_STRONG = "#52596e"; /* gray.70 */
export const KUI_COLOR_BACKGROUND_NEUTRAL_STRONGER = "#3a3f51"; /* gray.80 */
export const KUI_COLOR_BACKGROUND_NEUTRAL_STRONGEST = "#232633"; /* gray.90 */
export const KUI_COLOR_BACKGROUND_NEUTRAL_WEAK = "#afb7c5"; /* gray.40 */
export const KUI_COLOR_BACKGROUND_NEUTRAL_WEAKER = "#e0e4ea"; /* gray.20 */
export const KUI_COLOR_BACKGROUND_NEUTRAL_WEAKEST = "#f9fafb"; /* gray.10 */
export const KUI_COLOR_BACKGROUND_PRIMARY = "#0044f4"; /* blue.60 */
export const KUI_COLOR_BACKGROUND_PRIMARY_STRONG = "#0030cc"; /* blue.70 */
export const KUI_COLOR_BACKGROUND_PRIMARY_STRONGER = "#002099"; /* blue.80 */
export const KUI_COLOR_BACKGROUND_PRIMARY_STRONGEST = "#001466"; /* blue.90 */
export const KUI_COLOR_BACKGROUND_PRIMARY_WEAK = "#5f9aff"; /* blue.40 */
export const KUI_COLOR_BACKGROUND_PRIMARY_WEAKER = "#bee2ff"; /* blue.20 */
export const KUI_COLOR_BACKGROUND_PRIMARY_WEAKEST = "#eefaff"; /* blue.10 */
export const KUI_COLOR_BACKGROUND_SUCCESS_WEAKEST = "#ecfffb"; /* green.10 */
export const KUI_COLOR_BACKGROUND_TRANSPARENT = "rgba(0, 0, 0, 0)"; /* transparent */
export const KUI_COLOR_BACKGROUND_WARNING_WEAKEST = "#fffce0"; /* yellow.10 */
export const KUI_COLOR_BORDER = "#e0e4ea"; /* gray.20 */
export const KUI_COLOR_BORDER_DANGER = "#d60027"; /* red.60 */
export const KUI_COLOR_BORDER_DANGER_STRONG = "#ad000e"; /* red.70 */
export const KUI_COLOR_BORDER_DANGER_STRONGER = "#850000"; /* red.80 */
export const KUI_COLOR_BORDER_DANGER_STRONGEST = "#5c0000"; /* red.90 */
export const KUI_COLOR_BORDER_DANGER_WEAK = "#ff3954"; /* red.40 */
export const KUI_COLOR_BORDER_DANGER_WEAKER = "#ffabab"; /* red.20 */
export const KUI_COLOR_BORDER_DANGER_WEAKEST = "#ffe5e5"; /* red.10 */
export const KUI_COLOR_BORDER_DECORATIVE = "#6f28ff"; /* purple.60 */
export const KUI_COLOR_BORDER_DISABLED = "#e0e4ea"; /* gray.20 */
export const KUI_COLOR_BORDER_NEUTRAL_WEAK = "#afb7c5"; /* gray.40 */
export const KUI_COLOR_BORDER_PRIMARY = "#0044f4"; /* blue.60 */
export const KUI_COLOR_BORDER_PRIMARY_STRONG = "#0030cc"; /* blue.70 */
export const KUI_COLOR_BORDER_PRIMARY_STRONGER = "#002099"; /* blue.80 */
export const KUI_COLOR_BORDER_PRIMARY_STRONGEST = "#001466"; /* blue.90 */
export const KUI_COLOR_BORDER_PRIMARY_WEAK = "#5f9aff"; /* blue.40 */
export const KUI_COLOR_BORDER_PRIMARY_WEAKER = "#bee2ff"; /* blue.20 */
export const KUI_COLOR_BORDER_PRIMARY_WEAKEST = "#eefaff"; /* blue.10 */
export const KUI_COLOR_BORDER_TRANSPARENT = "rgba(0, 0, 0, 0)"; /* transparent */
export const KUI_COLOR_TEXT = "#000933"; /* blue.100 */
export const KUI_COLOR_TEXT_DANGER = "#d60027"; /* red.60 */
export const KUI_COLOR_TEXT_DECORATIVE = "#00abd2"; /* aqua.50 */
export const KUI_COLOR_TEXT_DISABLED = "#828a9e"; /* gray.50 */
export const KUI_COLOR_TEXT_INVERSE = "#ffffff"; /* white */
export const KUI_COLOR_TEXT_NEUTRAL = "#6c7489"; /* gray.60 */
export const KUI_COLOR_TEXT_NEUTRAL_STRONG = "#52596e"; /* gray.70 */
export const KUI_COLOR_TEXT_NEUTRAL_STRONGER = "#3a3f51"; /* gray.80 */
export const KUI_COLOR_TEXT_NEUTRAL_STRONGEST = "#232633"; /* gray.90 */
export const KUI_COLOR_TEXT_NEUTRAL_WEAK = "#afb7c5"; /* gray.40 */
export const KUI_COLOR_TEXT_PRIMARY = "#0044f4"; /* blue.60 */
export const KUI_COLOR_TEXT_PRIMARY_STRONG = "#0030cc"; /* blue.70 */
export const KUI_COLOR_TEXT_PRIMARY_STRONGER = "#002099"; /* blue.80 */
export const KUI_COLOR_TEXT_SUCCESS = "#007d60"; /* green.60 */
export const KUI_COLOR_TEXT_WARNING = "#995c00"; /* yellow.60 */
export const KUI_BORDER_RADIUS_0 = "0px";
export const KUI_BORDER_RADIUS_10 = "2px";
export const KUI_BORDER_RADIUS_20 = "4px";
export const KUI_BORDER_RADIUS_30 = "6px";
export const KUI_BORDER_RADIUS_40 = "8px";
export const KUI_BORDER_RADIUS_CIRCLE = "50%"; /* Used to create a circle. Value of 50% */
export const KUI_BORDER_RADIUS_ROUND = "100px"; /* Used to round element corners. Value of 100px */
export const KUI_BORDER_WIDTH_0 = "0px";
export const KUI_BORDER_WIDTH_10 = "1px";
export const KUI_BORDER_WIDTH_20 = "2px";
export const KUI_BORDER_WIDTH_30 = "4px";
export const KUI_BREAKPOINT_DESKTOP = "1536px"; /* Used for larger desktop screens. */
export const KUI_BREAKPOINT_LAPTOP = "1280px"; /* Used for standard desktop screens. */
export const KUI_BREAKPOINT_MOBILE = "640px"; /* Used for larger mobile screens. Anything under this value is considered mobile. */
export const KUI_BREAKPOINT_PHABLET = "768px"; /* Used for tablet screens. */
export const KUI_BREAKPOINT_TABLET = "1024px"; /* Used for larger tablet screens. Any viewport width less than this value is considered a mobile layout. Any viewport width this size and greater is considered a desktop layout. */
export const KUI_METHOD_COLOR_BACKGROUND_CONNECT = "#f1f0ff"; /* purple.10 */
export const KUI_METHOD_COLOR_BACKGROUND_DELETE = "#ffe5e5"; /* red.10 */
export const KUI_METHOD_COLOR_BACKGROUND_GET = "#eefaff"; /* blue.10 */
export const KUI_METHOD_COLOR_BACKGROUND_HEAD = "#6c7489"; /* gray.60 */
export const KUI_METHOD_COLOR_BACKGROUND_OPTIONS = "#f9fafb"; /* gray.10 */
export const KUI_METHOD_COLOR_BACKGROUND_PATCH = "#ecfcff"; /* aqua.10 */
export const KUI_METHOD_COLOR_BACKGROUND_POST = "#ecfffb"; /* green.10 */
export const KUI_METHOD_COLOR_BACKGROUND_PUT = "#fffce0"; /* yellow.10 */
export const KUI_METHOD_COLOR_BACKGROUND_TRACE = "#fff0f7"; /* pink.10 */
export const KUI_METHOD_COLOR_TEXT_CONNECT = "#6f28ff"; /* purple.60 */
export const KUI_METHOD_COLOR_TEXT_DELETE = "#d60027"; /* red.60 */
export const KUI_METHOD_COLOR_TEXT_GET = "#0044f4"; /* blue.60 */
export const KUI_METHOD_COLOR_TEXT_HEAD = "#f9fafb"; /* gray.10 */
export const KUI_METHOD_COLOR_TEXT_OPTIONS = "#6c7489"; /* gray.60 */
export const KUI_METHOD_COLOR_TEXT_PATCH = "#00819d"; /* aqua.60 */
export const KUI_METHOD_COLOR_TEXT_POST = "#007d60"; /* green.60 */
export const KUI_METHOD_COLOR_TEXT_PUT = "#995c00"; /* yellow.60 */
export const KUI_METHOD_COLOR_TEXT_TRACE = "#d60067"; /* pink.60 */
export const KUI_FONT_FAMILY_CODE = "'JetBrains Mono', Consolas, monospace"; /* The standard monospace font family. */
export const KUI_FONT_FAMILY_TEXT = "'Inter', Roboto, Helvetica, sans-serif"; /* The standard text font family. */
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
export const KUI_FONT_WEIGHT_BOLD = "700"; /* 700 */
export const KUI_FONT_WEIGHT_MEDIUM = "500"; /* 500 */
export const KUI_FONT_WEIGHT_REGULAR = "400"; /* 400: The normal font weight. */
export const KUI_FONT_WEIGHT_SEMIBOLD = "600"; /* 600 */
export const KUI_LINE_HEIGHT_10 = "12px"; /* 12px */
export const KUI_LINE_HEIGHT_20 = "16px"; /* 16px */
export const KUI_LINE_HEIGHT_30 = "20px"; /* 20px */
export const KUI_LINE_HEIGHT_40 = "24px"; /* 24px */
export const KUI_LINE_HEIGHT_50 = "28px"; /* 28px */
export const KUI_LINE_HEIGHT_60 = "32px"; /* 32px */
export const KUI_LINE_HEIGHT_70 = "36px"; /* 36px */
export const KUI_LINE_HEIGHT_80 = "40px"; /* 40px */
export const KUI_LINE_HEIGHT_90 = "48px"; /* 48px */
export const KUI_LINE_HEIGHT_100 = "56px"; /* 56px */
export const KUI_SPACE_0 = "0px"; /* 0px */
export const KUI_SPACE_10 = "2px"; /* 2px */
export const KUI_SPACE_20 = "4px"; /* 4px */
export const KUI_SPACE_30 = "6px"; /* 6px */
export const KUI_SPACE_40 = "8px"; /* 8px */
export const KUI_SPACE_50 = "12px"; /* 12px */
export const KUI_SPACE_60 = "16px"; /* 16px */
export const KUI_SPACE_70 = "20px"; /* 20px */
export const KUI_SPACE_80 = "24px"; /* 24px */
export const KUI_SPACE_90 = "32px"; /* 32px */
export const KUI_SPACE_100 = "40px"; /* 40px */
export const KUI_SPACE_110 = "48px"; /* 48px */
export const KUI_SPACE_120 = "56px"; /* 56px */
export const KUI_SPACE_130 = "64px"; /* 64px */
export const KUI_SPACE_140 = "80px"; /* 80px */
export const KUI_SPACE_150 = "96px"; /* 96px */
export const KUI_SPACE_AUTO = "auto"; /* auto */
```

</details>

## CSS Variables

**IMPORTANT**: You should **never** import the `@kong/design-tokens/tokens/css/variables.css` file in your host project.

The purpose of the `@kong/design-tokens/tokens/css/variables.css` file is to provide a list of all available CSS variables.

If you want to customize default token values, provided the element(s) in question utilize CSS variable fallbacks, simply set the variables from this list to your desired value within your host application, scoped inside your desired CSS selector, and it will override the default value.

You may scope your CSS variable overrides inside the `:root` selector as shown here, or inside any other valid CSS selector.

While CSS variables are _utilized_ in Kong's repositories to allow for CSS customization, the variables themselves are never actually provided values or imported from this package.

<details>

<summary>Click to view the list of CSS variables</summary>

```css
  --kui-color-background: initial; /* white. Default value: `#ffffff` */
  --kui-color-background-danger: initial; /* red.60. Default value: `#d60027` */
  --kui-color-background-danger-strong: initial; /* red.70. Default value: `#ad000e` */
  --kui-color-background-danger-stronger: initial; /* red.80. Default value: `#850000` */
  --kui-color-background-danger-strongest: initial; /* red.90. Default value: `#5c0000` */
  --kui-color-background-danger-weak: initial; /* red.40. Default value: `#ff3954` */
  --kui-color-background-danger-weaker: initial; /* red.20. Default value: `#ffabab` */
  --kui-color-background-danger-weakest: initial; /* red.10. Default value: `#ffe5e5` */
  --kui-color-background-disabled: initial; /* gray.20. Default value: `#e0e4ea` */
  --kui-color-background-inverse: initial; /* blue.100. Default value: `#000933` */
  --kui-color-background-neutral: initial; /* gray.60. Default value: `#6c7489` */
  --kui-color-background-neutral-strong: initial; /* gray.70. Default value: `#52596e` */
  --kui-color-background-neutral-stronger: initial; /* gray.80. Default value: `#3a3f51` */
  --kui-color-background-neutral-strongest: initial; /* gray.90. Default value: `#232633` */
  --kui-color-background-neutral-weak: initial; /* gray.40. Default value: `#afb7c5` */
  --kui-color-background-neutral-weaker: initial; /* gray.20. Default value: `#e0e4ea` */
  --kui-color-background-neutral-weakest: initial; /* gray.10. Default value: `#f9fafb` */
  --kui-color-background-primary: initial; /* blue.60. Default value: `#0044f4` */
  --kui-color-background-primary-strong: initial; /* blue.70. Default value: `#0030cc` */
  --kui-color-background-primary-stronger: initial; /* blue.80. Default value: `#002099` */
  --kui-color-background-primary-strongest: initial; /* blue.90. Default value: `#001466` */
  --kui-color-background-primary-weak: initial; /* blue.40. Default value: `#5f9aff` */
  --kui-color-background-primary-weaker: initial; /* blue.20. Default value: `#bee2ff` */
  --kui-color-background-primary-weakest: initial; /* blue.10. Default value: `#eefaff` */
  --kui-color-background-success-weakest: initial; /* green.10. Default value: `#ecfffb` */
  --kui-color-background-transparent: initial; /* transparent. Default value: `rgba(0, 0, 0, 0)` */
  --kui-color-background-warning-weakest: initial; /* yellow.10. Default value: `#fffce0` */
  --kui-color-border: initial; /* gray.20. Default value: `#e0e4ea` */
  --kui-color-border-danger: initial; /* red.60. Default value: `#d60027` */
  --kui-color-border-danger-strong: initial; /* red.70. Default value: `#ad000e` */
  --kui-color-border-danger-stronger: initial; /* red.80. Default value: `#850000` */
  --kui-color-border-danger-strongest: initial; /* red.90. Default value: `#5c0000` */
  --kui-color-border-danger-weak: initial; /* red.40. Default value: `#ff3954` */
  --kui-color-border-danger-weaker: initial; /* red.20. Default value: `#ffabab` */
  --kui-color-border-danger-weakest: initial; /* red.10. Default value: `#ffe5e5` */
  --kui-color-border-decorative: initial; /* purple.60. Default value: `#6f28ff` */
  --kui-color-border-disabled: initial; /* gray.20. Default value: `#e0e4ea` */
  --kui-color-border-neutral-weak: initial; /* gray.40. Default value: `#afb7c5` */
  --kui-color-border-primary: initial; /* blue.60. Default value: `#0044f4` */
  --kui-color-border-primary-strong: initial; /* blue.70. Default value: `#0030cc` */
  --kui-color-border-primary-stronger: initial; /* blue.80. Default value: `#002099` */
  --kui-color-border-primary-strongest: initial; /* blue.90. Default value: `#001466` */
  --kui-color-border-primary-weak: initial; /* blue.40. Default value: `#5f9aff` */
  --kui-color-border-primary-weaker: initial; /* blue.20. Default value: `#bee2ff` */
  --kui-color-border-primary-weakest: initial; /* blue.10. Default value: `#eefaff` */
  --kui-color-border-transparent: initial; /* transparent. Default value: `rgba(0, 0, 0, 0)` */
  --kui-color-text: initial; /* blue.100. Default value: `#000933` */
  --kui-color-text-danger: initial; /* red.60. Default value: `#d60027` */
  --kui-color-text-decorative: initial; /* aqua.50. Default value: `#00abd2` */
  --kui-color-text-disabled: initial; /* gray.50. Default value: `#828a9e` */
  --kui-color-text-inverse: initial; /* white. Default value: `#ffffff` */
  --kui-color-text-neutral: initial; /* gray.60. Default value: `#6c7489` */
  --kui-color-text-neutral-strong: initial; /* gray.70. Default value: `#52596e` */
  --kui-color-text-neutral-stronger: initial; /* gray.80. Default value: `#3a3f51` */
  --kui-color-text-neutral-strongest: initial; /* gray.90. Default value: `#232633` */
  --kui-color-text-neutral-weak: initial; /* gray.40. Default value: `#afb7c5` */
  --kui-color-text-primary: initial; /* blue.60. Default value: `#0044f4` */
  --kui-color-text-primary-strong: initial; /* blue.70. Default value: `#0030cc` */
  --kui-color-text-primary-stronger: initial; /* blue.80. Default value: `#002099` */
  --kui-color-text-success: initial; /* green.60. Default value: `#007d60` */
  --kui-color-text-warning: initial; /* yellow.60. Default value: `#995c00` */
  --kui-border-radius-0: initial; /*  Default value: `0px` */
  --kui-border-radius-10: initial; /*  Default value: `2px` */
  --kui-border-radius-20: initial; /*  Default value: `4px` */
  --kui-border-radius-30: initial; /*  Default value: `6px` */
  --kui-border-radius-40: initial; /*  Default value: `8px` */
  --kui-border-radius-circle: initial; /* Used to create a circle. Value of 50%. Default value: `50%` */
  --kui-border-radius-round: initial; /* Used to round element corners. Value of 100px. Default value: `100px` */
  --kui-border-width-0: initial; /*  Default value: `0px` */
  --kui-border-width-10: initial; /*  Default value: `1px` */
  --kui-border-width-20: initial; /*  Default value: `2px` */
  --kui-border-width-30: initial; /*  Default value: `4px` */
  --kui-breakpoint-desktop: initial; /* Used for larger desktop screens. Default value: `1536px` */
  --kui-breakpoint-laptop: initial; /* Used for standard desktop screens. Default value: `1280px` */
  --kui-breakpoint-mobile: initial; /* Used for larger mobile screens. Anything under this value is considered mobile. Default value: `640px` */
  --kui-breakpoint-phablet: initial; /* Used for tablet screens. Default value: `768px` */
  --kui-breakpoint-tablet: initial; /* Used for larger tablet screens. Any viewport width less than this value is considered a mobile layout. Any viewport width this size and greater is considered a desktop layout. Default value: `1024px` */
  --kui-method-color-background-connect: initial; /* purple.10. Default value: `#f1f0ff` */
  --kui-method-color-background-delete: initial; /* red.10. Default value: `#ffe5e5` */
  --kui-method-color-background-get: initial; /* blue.10. Default value: `#eefaff` */
  --kui-method-color-background-head: initial; /* gray.60. Default value: `#6c7489` */
  --kui-method-color-background-options: initial; /* gray.10. Default value: `#f9fafb` */
  --kui-method-color-background-patch: initial; /* aqua.10. Default value: `#ecfcff` */
  --kui-method-color-background-post: initial; /* green.10. Default value: `#ecfffb` */
  --kui-method-color-background-put: initial; /* yellow.10. Default value: `#fffce0` */
  --kui-method-color-background-trace: initial; /* pink.10. Default value: `#fff0f7` */
  --kui-method-color-text-connect: initial; /* purple.60. Default value: `#6f28ff` */
  --kui-method-color-text-delete: initial; /* red.60. Default value: `#d60027` */
  --kui-method-color-text-get: initial; /* blue.60. Default value: `#0044f4` */
  --kui-method-color-text-head: initial; /* gray.10. Default value: `#f9fafb` */
  --kui-method-color-text-options: initial; /* gray.60. Default value: `#6c7489` */
  --kui-method-color-text-patch: initial; /* aqua.60. Default value: `#00819d` */
  --kui-method-color-text-post: initial; /* green.60. Default value: `#007d60` */
  --kui-method-color-text-put: initial; /* yellow.60. Default value: `#995c00` */
  --kui-method-color-text-trace: initial; /* pink.60. Default value: `#d60067` */
  --kui-font-family-code: initial; /* The standard monospace font family. Default value: `'JetBrains Mono', Consolas, monospace` */
  --kui-font-family-text: initial; /* The standard text font family. Default value: `'Inter', Roboto, Helvetica, sans-serif` */
  --kui-font-size-10: initial; /*  Default value: `10px` */
  --kui-font-size-20: initial; /*  Default value: `12px` */
  --kui-font-size-30: initial; /*  Default value: `14px` */
  --kui-font-size-40: initial; /*  Default value: `16px` */
  --kui-font-size-50: initial; /*  Default value: `18px` */
  --kui-font-size-60: initial; /*  Default value: `20px` */
  --kui-font-size-70: initial; /*  Default value: `24px` */
  --kui-font-size-80: initial; /*  Default value: `32px` */
  --kui-font-size-90: initial; /*  Default value: `40px` */
  --kui-font-size-100: initial; /*  Default value: `48px` */
  --kui-font-weight-bold: initial; /* 700. Default value: `700` */
  --kui-font-weight-medium: initial; /* 500. Default value: `500` */
  --kui-font-weight-regular: initial; /* 400: The normal font weight. Default value: `400` */
  --kui-font-weight-semibold: initial; /* 600. Default value: `600` */
  --kui-line-height-10: initial; /* 12px. Default value: `12px` */
  --kui-line-height-20: initial; /* 16px. Default value: `16px` */
  --kui-line-height-30: initial; /* 20px. Default value: `20px` */
  --kui-line-height-40: initial; /* 24px. Default value: `24px` */
  --kui-line-height-50: initial; /* 28px. Default value: `28px` */
  --kui-line-height-60: initial; /* 32px. Default value: `32px` */
  --kui-line-height-70: initial; /* 36px. Default value: `36px` */
  --kui-line-height-80: initial; /* 40px. Default value: `40px` */
  --kui-line-height-90: initial; /* 48px. Default value: `48px` */
  --kui-line-height-100: initial; /* 56px. Default value: `56px` */
  --kui-space-0: initial; /* 0px. Default value: `0px` */
  --kui-space-10: initial; /* 2px. Default value: `2px` */
  --kui-space-20: initial; /* 4px. Default value: `4px` */
  --kui-space-30: initial; /* 6px. Default value: `6px` */
  --kui-space-40: initial; /* 8px. Default value: `8px` */
  --kui-space-50: initial; /* 12px. Default value: `12px` */
  --kui-space-60: initial; /* 16px. Default value: `16px` */
  --kui-space-70: initial; /* 20px. Default value: `20px` */
  --kui-space-80: initial; /* 24px. Default value: `24px` */
  --kui-space-90: initial; /* 32px. Default value: `32px` */
  --kui-space-100: initial; /* 40px. Default value: `40px` */
  --kui-space-110: initial; /* 48px. Default value: `48px` */
  --kui-space-120: initial; /* 56px. Default value: `56px` */
  --kui-space-130: initial; /* 64px. Default value: `64px` */
  --kui-space-140: initial; /* 80px. Default value: `80px` */
  --kui-space-150: initial; /* 96px. Default value: `96px` */
  --kui-space-auto: initial; /* auto. Default value: `auto` */
```

</details>
