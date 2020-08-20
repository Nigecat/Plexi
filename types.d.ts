declare module "word-definition" {
    export function getDef(
        word: string,
        lang: string,
        options: { exact: boolean; hyperlinks: "html" | "brackets" | "none"; formatted: boolean },
        callback: (definition: WordDefinition) => void,
    ): void;

    export interface WordDefinition {
        word: string;
        category: string;
        definition: string;
    }
}

declare module "weather-js" {
    export function find(
        options: { search: string; degreeType: "C" | "F" },
        callback: (err: Error, result: WeatherData[]) => void,
    ): void;

    export interface WeatherForecast {
        low: string;
        high: string;
        skycodeday: string;
        skytextday: string;
        date: string;
        day: string;
        shortday: string;
        precip: string;
    }

    export interface WeatherData {
        forecast: WeatherForecast[];
        location: {
            name: string;
            lat: string;
            long: string;
            timezone: string;
            alert: string;
            degreeType: "C" | "F";
            imagerelativeurl: string;
        };
        current: {
            temperature: string;
            skycode: string;
            skytext: string;
            date: string;
            observationtime: string;
            observationpoint: string;
            feelslike: string;
            humidity: string;
            winddisplay: string;
            day: string;
            shortday: string;
            windspeed: string;
            imageUrl: string;
        };
    }
}
