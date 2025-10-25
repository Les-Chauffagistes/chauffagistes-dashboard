export default class UnitConverter {
    static fromStringToNumber(value: string): number {
        const unit = value.slice(-1).toUpperCase();
        const number = Number.parseFloat(value);
        if (Number.isNaN(number)) throw new Error("Invalid number");

        switch (unit) {
            case "K": return number * 1e3;
            case "M": return number * 1e6;
            case "G": return number * 1e9;
            case "T": return number * 1e12;
            case "P": return number * 1e15;
            case "E": return number * 1e18;
            default: return number;
        }
    };

    static fromNumberToString(value: number): string {
        if (value < 1e3) return value.toString();
        else if (value < 1e6) return (value / 1e3).toFixed(2) + " K";
        else if (value < 1e9) return (value / 1e6).toFixed(2) + " M";
        else if (value < 1e12) return (value / 1e9).toFixed(2) + " G";
        else if (value < 1e15) return (value / 1e12).toFixed(2) + " T";
        else if (value < 1e18) return (value / 1e15).toFixed(2) + " P";
        else return (value / 1e18).toFixed(2) + " E";
    }
}