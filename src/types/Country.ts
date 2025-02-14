export interface Country {
    countryId?: number;
    name?: string;
    continent?: "Afrika" | "Azija" | "Evropa" | "Sjeverna Amerika" | "Južna Amerika" | "Okeanija";
    capital?: string;
    population?: number;
    flagUrl?: string;
}