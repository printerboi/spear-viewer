
export interface Color {
    red: number,
    green: number,
    blue: number;
}

export const GOODCOLOR: Color = { red: 0, green: 255, blue: 0 };
export const BADCOLOR: Color = { red: 255, green: 0, blue: 0 };
export const MEDIUMCOLOR: Color = { red: 255, green: 255, blue: 0 };

export const interpolate = (a: Color, b: Color, t: number): Color => {
    let nRed = a.red + (b.red - a.red) * t;
    let nGreen = a.green + (b.green - a.green) * t;
    let nBlue = a.blue + (b.blue - a.blue) * t;

    return {red: Math.ceil(nRed), green: Math.ceil(nGreen), blue: Math.ceil(nBlue) };
};