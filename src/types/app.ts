// AUTOMATICALLY GENERATED TYPES - DO NOT EDIT

export type LookupValue = { key: string; label: string };
export type GeoLocation = { lat: number; long: number; info?: string };

export interface PromptGeneratorPro {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    vorlage?: LookupValue;
    rolle_persona?: string;
    kontext?: string;
    aufgabe?: string;
    format_ausgabe?: string;
    regeln?: string;
    generierter_prompt?: string;
  };
}

export const APP_IDS = {
  PROMPT_GENERATOR_PRO: '6a01d24881f0aa7a74f3f3a4',
} as const;


export const LOOKUP_OPTIONS: Record<string, Record<string, {key: string, label: string}[]>> = {
  'prompt_generator_pro': {
    vorlage: [{ key: "email", label: "Professionelle E-Mail verfassen" }, { key: "blogpost", label: "Blogpost-Gliederung erstellen" }, { key: "linkedin", label: "Social-Media-Post (LinkedIn)" }, { key: "bild_generieren", label: "Ein Bild generieren" }, { key: "manuell", label: "Manuelle Eingabe" }],
  },
};

export const FIELD_TYPES: Record<string, Record<string, string>> = {
  'prompt_generator_pro': {
    'vorlage': 'lookup/select',
    'rolle_persona': 'string/textarea',
    'kontext': 'string/textarea',
    'aufgabe': 'string/textarea',
    'format_ausgabe': 'string/textarea',
    'regeln': 'string/textarea',
    'generierter_prompt': 'string/textarea',
  },
};

type StripLookup<T> = {
  [K in keyof T]: T[K] extends LookupValue | undefined ? string | LookupValue | undefined
    : T[K] extends LookupValue[] | undefined ? string[] | LookupValue[] | undefined
    : T[K];
};

// Helper Types for creating new records (lookup fields as plain strings for API)
export type CreatePromptGeneratorPro = StripLookup<PromptGeneratorPro['fields']>;