//////////DADATA///////////////////////////////////////////////////////////

export type DaDataResponseAPIType = {
    value: string
    unrestricted_value: string
    data: SuggestionData
}

interface SuggestionData {
    kpp: string
    capital: Capital
    management: Management
    founders: Founder[]
    managers: Manager[]
    predecessors: null
    successors: null
    branch_type: string
    branch_count: number
    source: null
    qc: null
    hid: string
    type: string
    state: State
    opf: Opf
    name: Name
    inn: string
    ogrn: string
    okpo: string
    okato: string
    oktmo: string
    okogu: string
    okfs: string
    okved: string
    okveds: FtsRegistrationElement[]
    authorities: Authorities
    documents: Documents
    licenses: null
    finance: Finance
    address: Address
    phones: Phone[]
    emails: Email[]
    ogrn_date: number
    okved_type: string
    employee_count: number
}

interface Address {
    value: string
    unrestricted_value: string
    data: {
        postal_code: string,
        country: string,
        country_iso_code: string,
        federal_district: string,
        region_fias_id: string,
        region_kladr_id: string,
        region_iso_code: string,
        region_with_type: string,
        region_type: string,
        region_type_full: string,
        region: string,
        area_fias_id: string,
        area_kladr_id: string,
        area_with_type: string,
        area_type: string,
        area_type_full: string,
        area: string,
        city_fias_id: string,
        city_kladr_id: string,
        city_with_type: string,
        city_type: string,
        city_type_full: string,
        city: string,
        city_area: string,
        city_district_fias_id: string,
        city_district_kladr_id: string,
        city_district_with_type: string,
        city_district_type: string,
        city_district_type_full: string,
        city_district: string,
        settlement_fias_id: string,
        settlement_kladr_id: string,
        settlement_with_type: string,
        settlement_type: string,
        settlement_type_full: string,
        settlement: string,
        street_fias_id: string,
        street_kladr_id: string,
        street_with_type: string,
        street_type: string,
        street_type_full: string,
        street: string,
        stead_fias_id: string,
        stead_cadnum: string,
        stead_type: string,
        stead_type_full: string,
        stead: string,
        house_fias_id: string,
        house_kladr_id: string,
        house_cadnum: string,
        house_type: string,
        house_type_full: string,
        house: string,
        block_type: string,
        block_type_full: string,
        block: string,
        entrance: string,
        floor: string,
        flat_fias_id: string,
        flat_cadnum: string,
        flat_type: string,
        flat_type_full: string,
        flat: string,
        flat_area: string,
        square_meter_price: string,
        flat_price: string,
        room_fias_id: string,
        room_cadnum: string,
        room_type: string,
        room_type_full: string,
        room: string,
        postal_box: string,
        fias_id: string,
        fias_code: string,
        fias_level: string,
        fias_actuality_state: string,
        kladr_id: string,
        geoname_id: string,
        capital_marker: string,
        okato: string,
        oktmo: string,
        tax_office: string,
        tax_office_legal: string,
        timezone: string,
        geo_lat: string,
        geo_lon: string,
        beltway_hit: string,
        beltway_distance: string,
        metro: string,
        divisions: string,
        qc_geo: string,
        qc_complete: string,
        qc_house: string,
        history_values: string,
        unparsed_parts: string,
        source: string,
        qc: string
    }
}


interface Authorities {
    fts_registration: FtsRegistrationElement
    fts_report: FtsRegistrationElement
    pf: FtsRegistrationElement
    sif: FtsRegistrationElement
}

interface FtsRegistrationElement {
    type: string
    code: string
    name: string
    address?: null | string
    main?: boolean
}

interface Capital {
    type: string
    value: number
}

interface Documents {
    fts_registration: PfRegistrationClass
    fts_report: PfRegistrationClass
    pf_registration: PfRegistrationClass
    sif_registration: PfRegistrationClass
    smb: PfRegistrationClass
}

interface PfRegistrationClass {
    type: string
    series: null | string
    number: null | string
    issue_date: number
    issue_authority: null | string
    category?: string
}

interface Email {
    value: string
    unrestricted_value: string
    data: EmailData
}

interface EmailData {
    local: string
    domain: string
    type: null
    source: string
    qc: null
}

interface Finance {
    tax_system: null
    income: number
    expense: number
    debt: null
    penalty: null
    year: number
}

interface Founder {
    ogrn: null | string
    inn: null | string
    name: string
    hid: string
    type: string
    share: Capital
}

interface Management {
    name: string
    post: string
    disqualified: null
}

interface Manager {
    inn: string
    fio: Fio
    post: string
    hid: string
    type: string
}

interface Fio {
    surname: string
    name: string
    patronymic: string
    gender: string
    source: string
    qc: null
}

interface Name {
    full_with_opf: string
    short_with_opf: string
    latin: null
    full: string
    short: string
}

interface Opf {
    type: string
    code: string
    full: string
    short: string
}

interface Phone {
    value: string
    unrestricted_value: string
    data: PhoneData
}

interface PhoneData {
    contact: null
    source: string
    qc: null
    type: string
    number: string
    extension: null
    provider: string
    country: null
    region: string
    city: null
    timezone: string
    country_code: string
    city_code: string
    qc_conflict: null
}

interface State {
    status: string
    code: null
    actuality_date: number
    registration_date: number
    liquidation_date: null
}


//////////AVTODISPETCHER///////////////////////////////////////////////////////////
export type AvtoDispetcherResponseType = {
    kilometers: number
    polyline: string
    minutes: number;
    segments: AvtodispetcherSegment[];
}

type AvtodispetcherSegmentStartFinish = {
    name: string;
    type: string;
    latitude: number;
    longitude: number;
    region: string;
    country: string;
}

type AvtodispetcherSegment = {
    start: AvtodispetcherSegmentStartFinish;
    finish: AvtodispetcherSegmentStartFinish;
    kilometers: number;
    minutes: number;
    road: string;
}
