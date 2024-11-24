/**
 * Color helper file. Provided several functions, variables and interfaces to enable the
 * calculation of colors
 * Austhor: Maximilian Kreb
 */

/**
 * RGB Colour interface
 */
export interface Color {
    red: number,
    green: number,
    blue: number;
}

// Define some colour constants
export const GOODCOLOR: Color = { red: 0, green: 255, blue: 0 };
export const BADCOLOR: Color = { red: 255, green: 0, blue: 0 };
export const MEDIUMCOLOR: Color = { red: 255, green: 255, blue: 0 };

/**
 * Interpolates two colours a and b with a parameter t
 * @param a Colour a 
 * @param b Colour b
 * @param t interpolation parameter
 * @returns The interpolated colour
 */
export const interpolate = (a: Color, b: Color, t: number): Color => {
    let nRed = a.red + (b.red - a.red) * t;
    let nGreen = a.green + (b.green - a.green) * t;
    let nBlue = a.blue + (b.blue - a.blue) * t;

    return {red: Math.ceil(nRed), green: Math.ceil(nGreen), blue: Math.ceil(nBlue) };
};