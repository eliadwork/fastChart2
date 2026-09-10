import α from 'color-alpha';

/** Add opacity to a color string (hex, rgb, rgba, hsl, named colors). */
export const withOpacity = (color: string, opacity: number): string => (color ? (α(color, opacity) ?? color) : color);
