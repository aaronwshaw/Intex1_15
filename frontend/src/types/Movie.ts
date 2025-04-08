export interface Movie {
    show_id: string;
    type: string;
    title: string;
    director: string;
    cast: string;
    country: string;
    release_year: number;
    rating: string;
    duration: string;
    description: string;

    // Genre columns
    action: number;
    adventure: number;
    anime: number;
    british: number;
    children: number;
    comedies: number;
    comedies_dramas_int: number;
    comedies_int: number;
    comedies_rom: number;
    crime_docu: number;
    documentaries: number;
    documentaries_int: number;
    docuseries: number;
    dramas: number;
    dramas_int: number;
    dramas_rom: number;
    family: number;
    fantasy: number;
    horror: number;
    thrillers_int: number;
    romantic_tv_shows_int: number;
    kids: number;
    language_tv: number;
    musicals: number;
    nature: number;
    reality: number;
    spirituality: number;
    action_tv: number;
    tv_comedies: number;
    tv_dramas: number;
    talk_shows: number;
    thrillers: number;

    // Additional fields from the backend
    primaryGenre: string;
    allGenres: string[];
}
