export default class ExtractWorkername {
    static fromPool(addressAndName: string): string {
        const parts = addressAndName.split(".");
        if (parts.length > 1) {
            return parts[1];
        } else {
            return "Worker sans nom"
        }
    }
}