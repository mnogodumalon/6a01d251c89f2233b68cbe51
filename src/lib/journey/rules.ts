/**
 * Field rules — GENERATED from the app metadata. Do not edit.
 *
 * The mechanical truth about every field: what kind it is, whether the
 * platform's base view marks it required, which lookup keys exist, where an
 * applookup points, what the label is. `useStepForm` validates against these
 * rules and phrases its messages with the real labels; `toWirePayload` uses
 * them to shape the create payload; `SHAPES` tells a page which input FORM
 * fits the data (a date pair wants a calendar, not two fields) — it is a
 * signal, not a gate.
 */
import { appLabel, fieldLabel, lookupLabel } from '@/i18n';
import { policyLabel } from './policy';
import { LOOKUP_OPTIONS } from '@/types/app';

export type EntityKey = 'prompt_generator_pro';

/** The text fields of each entity — what a search may run over (generated;
 *  `never` for an entity without text of its own, e.g. a link table). */
export interface StringFields {
  "prompt_generator_pro": "rolle_persona" | "kontext" | "aufgabe" | "format_ausgabe" | "regeln" | "generierter_prompt" | "prompt_name";
}
export type StringFieldKey<E extends EntityKey> = E extends keyof StringFields ? StringFields[E] : never;

/** The applookup fields of each entity (generated). A pick stored through
 *  `form.set` on one of these must carry its display name — at compile time
 *  (`StepForm.set`), because the review would otherwise show the id. */
export interface RecordFields {
  "prompt_generator_pro": never;
}
export type RecordFieldKey<E extends EntityKey> = E extends keyof RecordFields ? RecordFields[E] : never;

export type FieldKind =
  | 'text'
  | 'textarea'
  | 'email'
  | 'tel'
  | 'url'
  | 'number'
  | 'bool'
  | 'date'
  | 'datetime'
  | 'lookup'
  | 'multilookup'
  | 'record'
  | 'multirecord'
  | 'file'
  | 'geo';

export interface FieldRule {
  key: string;
  fulltype: string;
  kind: FieldKind;
  /** From the app's base view. A public page may override this per field. */
  required: boolean;
  /** Build-time label — `labelOf()` prefers the runtime i18n bundle. */
  label: string;
  /** Whether a journey may write it (`file` is upload-only, never via a journey). */
  writable: boolean;
  maxLength?: number;
  /** lookup / multilookup: the ONLY valid write values. */
  options?: string[];
  /** record / multirecord: the target app (always) and its entity key (when inside this appgroup). */
  targetAppId?: string;
  targetEntity?: EntityKey;
  format?: 'currency';
  /** HTML autocomplete token derived from the field name (given-name, email, tel, …). */
  autoComplete?: string;
}

export interface EntityInfo {
  key: EntityKey;
  appId: string;
  label: string;
  /** PascalCase plural — `get<pascal>()` on the service. */
  pascal: string;
  /** The single-record suffix — `create<single>()` on the service. */
  single: string;
}

/** Input-form signals per entity: which data shape each field (pair) has.
 *  `range`  — two date fields that form a stay/period → AvailabilityRangePicker
 *  `choice` — a lookup with few options → ChoiceGroup pills instead of a select
 *  `record` — an applookup → EntitySelectStep with search, never a raw id field
 *  `stock`  — a quantity that has a stock/capacity counterpart → show it, warn on overshoot */
export type Shape =
  | { kind: 'range'; from: string; to: string }
  | { kind: 'choice'; field: string; count: number }
  | { kind: 'record'; field: string; targetEntity?: EntityKey }
  | { kind: 'stock'; field: string };

export const ENTITIES: Record<EntityKey, EntityInfo> = {
  "prompt_generator_pro": {
    "key": "prompt_generator_pro",
    "appId": "6a01d24881f0aa7a74f3f3a4",
    "label": "Prompt-Generator Pro",
    "pascal": "PromptGeneratorPro",
    "single": "PromptGeneratorProEntry"
  }
};

export const FIELD_RULES: Record<EntityKey, Record<string, FieldRule>> = {
  "prompt_generator_pro": {
    "excel_upload": {
      "key": "excel_upload",
      "fulltype": "file",
      "kind": "file",
      "required": false,
      "label": "Excel-Datei hochladen",
      "writable": false
    },
    "vorlage": {
      "key": "vorlage",
      "fulltype": "lookup/select",
      "kind": "lookup",
      "required": false,
      "label": "Vorlage wählen",
      "writable": true,
      "options": [
        "email",
        "blogpost",
        "linkedin",
        "ein_bild_generieren",
        "manuell"
      ]
    },
    "rolle_persona": {
      "key": "rolle_persona",
      "fulltype": "string/textarea",
      "kind": "textarea",
      "required": false,
      "label": "Rolle / Persona der KI",
      "writable": true
    },
    "kontext": {
      "key": "kontext",
      "fulltype": "string/textarea",
      "kind": "textarea",
      "required": false,
      "label": "Kontext / Ausgangssituation",
      "writable": true
    },
    "aufgabe": {
      "key": "aufgabe",
      "fulltype": "string/textarea",
      "kind": "textarea",
      "required": false,
      "label": "Konkrete Aufgabe / Ziel",
      "writable": true
    },
    "format_ausgabe": {
      "key": "format_ausgabe",
      "fulltype": "string/textarea",
      "kind": "textarea",
      "required": false,
      "label": "Format der Ausgabe",
      "writable": true
    },
    "regeln": {
      "key": "regeln",
      "fulltype": "string/textarea",
      "kind": "textarea",
      "required": false,
      "label": "Regeln & Einschränkungen",
      "writable": true
    },
    "generierter_prompt": {
      "key": "generierter_prompt",
      "fulltype": "string/textarea",
      "kind": "textarea",
      "required": false,
      "label": "Generierter Prompt",
      "writable": true
    },
    "prompt_generieren_button": {
      "key": "prompt_generieren_button",
      "fulltype": "bool",
      "kind": "bool",
      "required": false,
      "label": "Prompt generieren",
      "writable": true
    },
    "prompt_copy_button": {
      "key": "prompt_copy_button",
      "fulltype": "bool",
      "kind": "bool",
      "required": false,
      "label": "Prompt kopieren",
      "writable": true
    },
    "prompt_name": {
      "key": "prompt_name",
      "fulltype": "string/textarea",
      "kind": "textarea",
      "required": false,
      "label": "Name des Prompts",
      "writable": true
    },
    "ergebnis_hochladen": {
      "key": "ergebnis_hochladen",
      "fulltype": "file",
      "kind": "file",
      "required": false,
      "label": "Ergebnis hochladen",
      "writable": false
    }
  }
};

export const SHAPES: Record<EntityKey, Shape[]> = {
  "prompt_generator_pro": [
    {
      "kind": "choice",
      "field": "vorlage",
      "count": 5
    }
  ]
};

/** The fields a record of this entity is recognised by (a person: first and
 *  last name; else its title-like text field) — the same choice the dashboard's
 *  enrichment makes for `<key>Name`. `useRecordSearch` resolves an applookup to
 *  this name (`ctx.ref('gast')` in `toItem`). */
export const DISPLAY_FIELDS: Record<EntityKey, string[]> = {
  "prompt_generator_pro": [
    "rolle_persona"
  ]
};

/** The display name of a record: its display fields joined, else the first
 *  non-empty text value, else ''. */
/** A display-field value as text: strings as they are, a lookup `{ key, label }`
 *  (either door hydrates lookups to objects) by its label — an entity whose
 *  only title-like field is a lookup/select otherwise had no name at all. */
function displayPart(v: unknown): string {
  if (typeof v === 'string') return v.trim();
  if (v && typeof v === 'object' && 'label' in v) {
    const l = (v as { label?: unknown }).label;
    return l === null || l === undefined ? '' : String(l).trim();
  }
  return '';
}

export function displayNameOf(entity: EntityKey, fields: Record<string, unknown>): string {
  const parts = (DISPLAY_FIELDS[entity] ?? [])
    .map(k => displayPart(fields[k]))
    .filter(v => v !== '');
  if (parts.length > 0) return parts.join(' ');
  for (const [k, rule] of Object.entries(FIELD_RULES[entity] ?? {})) {
    if (rule.kind !== 'text' && rule.kind !== 'email') continue;
    const v = fields[k];
    if (typeof v === 'string' && v.trim() !== '') return v.trim();
  }
  return '';
}

export function ruleOf(entity: EntityKey, key: string): FieldRule | undefined {
  return FIELD_RULES[entity]?.[key];
}

/** The field label as the user sees it — the owner's policy label first (a
 *  public page's "Felder anpassen"), runtime bundle second, generated label last. */
export function labelOf(entity: EntityKey, key: string): string {
  const own = policyLabel(entity, key);
  if (own) return own;
  const fromBundle = fieldLabel(entity, key);
  if (fromBundle !== key) return fromBundle;
  return ruleOf(entity, key)?.label ?? key;
}

export function entityLabel(entity: EntityKey): string {
  const fromBundle = appLabel(entity);
  if (fromBundle !== entity) return fromBundle;
  return ENTITIES[entity]?.label ?? entity;
}

/** Lookup options with runtime labels — the only legitimate source of `{key,label}` pairs. */
export function optionsOf(entity: EntityKey, key: string): Array<{ key: string; label: string }> {
  const generated = (LOOKUP_OPTIONS as Record<string, Record<string, Array<{ key: string; label: string }>>>)[entity]?.[key];
  if (generated && generated.length) return generated.map(o => ({ key: o.key, label: o.label }));
  const keys = ruleOf(entity, key)?.options ?? [];
  return keys.map(k => ({ key: k, label: lookupLabel(entity, key, k) ?? k }));
}

export function isEmptyValue(v: unknown): boolean {
  if (v === undefined || v === null) return true;
  if (typeof v === 'string') return v.trim() === '';
  if (Array.isArray(v)) return v.length === 0;
  if (typeof v === 'object' && 'from' in (v as object) && 'to' in (v as object)) {
    const r = v as { from: unknown; to: unknown };
    return isEmptyValue(r.from) && isEmptyValue(r.to);
  }
  return false;
}
