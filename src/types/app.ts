import { lookupLabel } from '@/i18n';

// AUTOMATICALLY GENERATED TYPES - DO NOT EDIT

export type LookupValue = { key: string; label: string };
/** A raw record URL (applookup reference). NEVER render this directly
 *  in JSX — it is a URL, not a display value. Show the enriched `*Name`
 *  field or resolve it via the entity map instead. Assignable to/from
 *  string everywhere; the `& {}` keeps the alias NAME visible in tsc
 *  error messages (a plain primitive alias gets normalized away). */
export type RecordUrl = string & {};
export type GeoLocation = { lat: number; long: number; info?: string };

export type AttachmentType = 'file' | 'note' | 'url' | 'json';
export interface Attachment {
  id: string;
  type: AttachmentType;
  label: string | null;
  value: string | null;
  active: boolean;
  createdat?: string | null;
  updatedat?: string | null;
}

export interface AttachmentInput {
  type: AttachmentType;
  label?: string;
  value: string;
  active?: boolean;
}

export interface PromptGeneratorPro {
  record_id: string;
  /** The API field. */
  created_at: string;
  updated_at: string | null;
  /** Alias of created_at, filled by the read helpers. The API sends
   *  snake_case only — reading `createdat` off a raw record yields
   *  undefined, which type-checks and then crashes at runtime. */
  createdat: string;
  updatedat: string | null;
  fields: {
    excel_upload?: string;
    vorlage?: LookupValue;
    rolle_persona?: string;
    kontext?: string;
    aufgabe?: string;
    format_ausgabe?: string;
    regeln?: string;
    generierter_prompt?: string;
    prompt_generieren_button?: boolean;
    prompt_copy_button?: boolean;
    prompt_name?: string;
    ergebnis_hochladen?: string;
  };
}

export const APP_IDS = {
  PROMPT_GENERATOR_PRO: '6a01d24881f0aa7a74f3f3a4',
} as const;


export const LOOKUP_OPTIONS: Record<string, Record<string, {key: string, label: string}[]>> = {
  'prompt_generator_pro': {
    vorlage: [{ key: "email", get label() { return lookupLabel('prompt_generator_pro', 'vorlage', "email") ?? "Professionelle E-Mail verfassen"; } }, { key: "blogpost", get label() { return lookupLabel('prompt_generator_pro', 'vorlage', "blogpost") ?? "Blogpost-Gliederung erstellen"; } }, { key: "linkedin", get label() { return lookupLabel('prompt_generator_pro', 'vorlage', "linkedin") ?? "Social-Media-Post (LinkedIn)"; } }, { key: "ein_bild_generieren", get label() { return lookupLabel('prompt_generator_pro', 'vorlage', "ein_bild_generieren") ?? "Ein Bild generieren"; } }, { key: "manuell", get label() { return lookupLabel('prompt_generator_pro', 'vorlage', "manuell") ?? "Manuelle Eingabe"; } }],
  },
};

// Optimistic LookupValue writes: never re-type a label — resolve the schema
// option instead (its label is a locale-aware getter; falls back to the key).
// WRONG: status: { key: 'offen', label: 'Offen' }   (frozen in one language)
// RIGHT: status: lookupOption('<appKey>', 'status', 'offen')
export function lookupOption(app: string, field: string, key: string): LookupValue {
  return LOOKUP_OPTIONS[app]?.[field]?.find(o => o.key === key) ?? { key, label: key };
}

export const FIELD_TYPES: Record<string, Record<string, string>> = {
  'prompt_generator_pro': {
    'excel_upload': 'file',
    'vorlage': 'lookup/select',
    'rolle_persona': 'string/textarea',
    'kontext': 'string/textarea',
    'aufgabe': 'string/textarea',
    'format_ausgabe': 'string/textarea',
    'regeln': 'string/textarea',
    'generierter_prompt': 'string/textarea',
    'prompt_generieren_button': 'bool',
    'prompt_copy_button': 'bool',
    'prompt_name': 'string/textarea',
    'ergebnis_hochladen': 'file',
  },
};

export const HUB_TOPOLOGY: Record<string, { field: string; entity: string }[]> = {
};

type StripLookup<T> = {
  [K in keyof T]: T[K] extends LookupValue | undefined ? string | LookupValue | undefined
    : T[K] extends LookupValue[] | undefined ? string[] | LookupValue[] | undefined
    : T[K];
};

// Helper Types for creating new records (lookup fields as plain strings for API)
export type CreatePromptGeneratorPro = StripLookup<PromptGeneratorPro['fields']>;