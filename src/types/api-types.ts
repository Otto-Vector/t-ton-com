/////////////////////////////////////////////////////////////////////

export type DaDataResponseAPIType = {
    value: string;
    unrestricted_value: string;
    data: SuggestionData;
}

interface SuggestionData {
    kpp: string;
    capital: Capital;
    management: Management;
    founders: Founder[];
    managers: Manager[];
    predecessors: null;
    successors: null;
    branch_type: string;
    branch_count: number;
    source: null;
    qc: null;
    hid: string;
    type: string;
    state: State;
    opf: Opf;
    name: Name;
    inn: string;
    ogrn: string;
    okpo: string;
    okato: string;
    oktmo: string;
    okogu: string;
    okfs: string;
    okved: string;
    okveds: FtsRegistrationElement[];
    authorities: Authorities;
    documents: Documents;
    licenses: null;
    finance: Finance;
    address: Address;
    phones: Phone[];
    emails: Email[];
    ogrn_date: number;
    okved_type: string;
    employee_count: number;
}

interface Address {
    value: string;
    unrestricted_value: string;
    data: AddressData;
}

interface AddressData {
}

interface Authorities {
    fts_registration: FtsRegistrationElement;
    fts_report: FtsRegistrationElement;
    pf: FtsRegistrationElement;
    sif: FtsRegistrationElement;
}

interface FtsRegistrationElement {
    type: string;
    code: string;
    name: string;
    address?: null | string;
    main?: boolean;
}

interface Capital {
    type: string;
    value: number;
}

interface Documents {
    fts_registration: PfRegistrationClass;
    fts_report: PfRegistrationClass;
    pf_registration: PfRegistrationClass;
    sif_registration: PfRegistrationClass;
    smb: PfRegistrationClass;
}

interface PfRegistrationClass {
    type: string;
    series: null | string;
    number: null | string;
    issue_date: number;
    issue_authority: null | string;
    category?: string;
}

interface Email {
    value: string;
    unrestricted_value: string;
    data: EmailData;
}

interface EmailData {
    local: string;
    domain: string;
    type: null;
    source: string;
    qc: null;
}

interface Finance {
    tax_system: null;
    income: number;
    expense: number;
    debt: null;
    penalty: null;
    year: number;
}

interface Founder {
    ogrn: null | string;
    inn: null | string;
    name: string;
    hid: string;
    type: string;
    share: Capital;
}

interface Management {
    name: string;
    post: string;
    disqualified: null;
}

interface Manager {
    inn: string;
    fio: Fio;
    post: string;
    hid: string;
    type: string;
}

interface Fio {
    surname: string;
    name: string;
    patronymic: string;
    gender: string;
    source: string;
    qc: null;
}

interface Name {
    full_with_opf: string;
    short_with_opf: string;
    latin: null;
    full: string;
    short: string;
}

interface Opf {
    type: string;
    code: string;
    full: string;
    short: string;
}

interface Phone {
    value: string;
    unrestricted_value: string;
    data: PhoneData;
}

interface PhoneData {
    contact: null;
    source: string;
    qc: null;
    type: string;
    number: string;
    extension: null;
    provider: string;
    country: null;
    region: string;
    city: null;
    timezone: string;
    country_code: string;
    city_code: string;
    qc_conflict: null;
}

interface State {
    status: string;
    code: null;
    actuality_date: number;
    registration_date: number;
    liquidation_date: null;
}
