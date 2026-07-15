import type { PromptGeneratorPro } from '@/types/app';
import { APP_IDS } from '@/types/app';
import { extractRecordId } from '@/services/livingAppsService';
import {
  RecordSection, RecordField, RecordRelation, RecordAttachments,
} from '@/components/widgets/RecordView';
import { MediaThumbnail } from '@/components/widgets/MediaViewer';

export interface PromptGeneratorProDetailsProps {
  /** Der Record — enriched oder roh; alle Felder werden hier gerendert. */
  record: PromptGeneratorPro;
}

export function PromptGeneratorProDetails({
  record,
}: PromptGeneratorProDetailsProps) {
  return (
    <>
      <RecordSection title="Details" cols={2}>
        <RecordField label="Excel-Datei hochladen" className="md:col-span-2">
          {record.fields.excel_upload ? (
            <MediaThumbnail src={record.fields.excel_upload as string} fit="contain" className="max-h-64 w-full rounded-lg" />
          ) : '—'}
        </RecordField>
        <RecordField label="Vorlage wählen" value={record.fields.vorlage} format="pill" />
        <RecordField label="Rolle / Persona der KI" value={record.fields.rolle_persona} format="longtext" className="md:col-span-2" />
        <RecordField label="Kontext / Ausgangssituation" value={record.fields.kontext} format="longtext" className="md:col-span-2" />
        <RecordField label="Konkrete Aufgabe / Ziel" value={record.fields.aufgabe} format="longtext" className="md:col-span-2" />
        <RecordField label="Format der Ausgabe" value={record.fields.format_ausgabe} format="longtext" className="md:col-span-2" />
        <RecordField label="Regeln & Einschränkungen" value={record.fields.regeln} format="longtext" className="md:col-span-2" />
        <RecordField label="Generierter Prompt" value={record.fields.generierter_prompt} format="longtext" className="md:col-span-2" />
        <RecordField label="Prompt generieren" value={record.fields.prompt_generieren_button} format="bool" />
        <RecordField label="Prompt kopieren" value={record.fields.prompt_copy_button} format="bool" />
        <RecordField label="Name des Prompts" value={record.fields.prompt_name} format="longtext" className="md:col-span-2" />
        <RecordField label="Ergebnis hochladen" className="md:col-span-2">
          {record.fields.ergebnis_hochladen ? (
            <MediaThumbnail src={record.fields.ergebnis_hochladen as string} fit="contain" className="max-h-64 w-full rounded-lg" />
          ) : '—'}
        </RecordField>
      </RecordSection>

      <RecordAttachments appId={APP_IDS.PROMPT_GENERATOR_PRO} recordId={record.record_id} />
    </>
  );
}
