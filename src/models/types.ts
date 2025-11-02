export type PaginationQuery = {
    page?: number
    pageSize?: number
    search?: string
}


export type CityFilters = PaginationQuery & { countryId?: string; continentId?: string }
export type CountryFilters = PaginationQuery & { continentId?: string }