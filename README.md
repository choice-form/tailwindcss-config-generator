# Tailwindcss Config Generator

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Tailwind CSS Badge](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=fff&style=flat)](https://tailwindcss.com/)

Creation and customization of the Tailwind config file (tailwind.config.js), which allows the fine-tuning of your project's design system including colors, typography, spacing, and more, based on your specific requirements.

## Features

**Add random color**: Click the "Add random color" button to create a new color shade. This action will generate a random initial color. For each color introduced, the application will calculate shades ranging from 50 to 950.

**Name**: Here you can name your shade. If the name you choose matches an existing shade, the system will automatically append an index to differentiate it. Numerical names will be prefixed with 'color-' automatically to maintain uniqueness.

**Color input**: You can modify your color by either using the color palette or inputting the color value directly. Color values can be in hex, rgb, hsl, or color name formats.

**Lightness**: This is a dual-end slider that adjusts the brightness of the color, both lighten and darken. Its default settings are light 0.04 and dark 0.98, to prevent pure white and pure black colors.

**Hue Shift**: This center-slider allows you to adjust the hue along the color spectrum, ranging from -45 to 45. Mainly, it adjusts the 50 and 950 shades, hence you may need to change the interpolation mode, like `LCH`, to observe significant changes.

**Correct lightness**: This switch ensures that brightness is uniformly distributed on the color scale. Activate this feature if you desire even spread of brightness on your color scale.

**Scale mode**: From this drop-down list, you choose your preferred color interpolation mode. Here are some descriptions for each mode:

1. RGB: Linear interpolations between red, green, and blue channels. It works for most scenarios, but it might not produce a natural transition between certain colors.
2. HSL & HSV: Interpolations are based on hue, saturation, and lightness/value. They might give more desired results than RGB in some cases, especially when a transition along the hue wheel is needed.
3. HSI: Interpolations between hue, saturation, and intensity. This is commonly used in image processing.
4. LAB & LCH: Both are based on the CIE Lab\* color space which attempts to mimic the color perception of the human eye. Hence, they are often capable of providing more natural color transitions. LAB makes direct interpolations of the color, while LCH introduces the hue channel and makes uniform transitions along the hue wheel.
5. OKLAB & OKLCH: These are color spaces developed by Björn Ottosson. They aim to achieve better linearity in terms of color contrast and hue changes.
6. HCL: An alias for LCH, it stands for Hue, Chroma, and Luminance.
7. LRGB: Interpolation in linear RGB. Compared to regular RGB interpolation, it provides a more uniform brightness change in color gradients.
   Depending on your actual requirements and the effect you want to achieve, you can select the most suitable mode.

##### Credits

This projects uses

[chroma-js](https://gka.github.io/chroma.js/)

## License

[MIT](LICENSE) License © 2023 [Choiceform](https://github.com/choice-form)
