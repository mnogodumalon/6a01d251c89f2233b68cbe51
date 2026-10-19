import type { PromptGeneratorPro } from '@/types/app';
import { APP_IDS } from '@/types/app';
import { extractRecordId } from '@/services/livingAppsService';
import {
  RecordSection, RecordField, RecordRelation, RecordAttachments,
} from '@/components/widgets/RecordView';
import { t, appLabel, fieldLabel } from '@/i18n';
import { MediaThumbnail } from '@/components/widgets/MediaViewer';
import { usePermissions } from '@/lib/permissions';

export interface PromptGeneratorProDetailsProps {
  /** Der Record — enriched oder roh; alle Felder werden hier gerendert. */
  record: PromptGeneratorPro;
}

export function PromptGeneratorProDetails({
  record,
}: PromptGeneratorProDetailsProps) {
  // attachments are a write to this record — read-only without the platform right
  const perms = usePermissions();
  return (
    <>
      <RecordSection title={t('details')} cols={2}>
        <RecordField label={fieldLabel('prompt_generator_pro', 'excel_upload')} className="md:col-span-2">
          {record.fields.excel_upload ? (
            <MediaThumbnail src={record.fields.excel_upload as string} fit="contain" className="max-h-64 w-full rounded-lg" />
          ) : '—'}
        </RecordField>
        <RecordField label={fieldLabel('prompt_generator_pro', 'vorlage')} value={record.fields.vorlage} format="pill" />
        <RecordField label={fieldLabel('prompt_generator_pro', 'rolle_persona')} value={record.fields.rolle_persona} format="longtext" className="md:col-span-2" />
        <RecordField label={fieldLabel('prompt_generator_pro', 'kontext')} value={record.fields.kontext} format="longtext" className="md:col-span-2" />
        <RecordField label={fieldLabel('prompt_generator_pro', 'aufgabe')} value={record.fields.aufgabe} format="longtext" className="md:col-span-2" />
        <RecordField label={fieldLabel('prompt_generator_pro', 'format_ausgabe')} value={record.fields.format_ausgabe} format="longtext" className="md:col-span-2" />
        <RecordField label={fieldLabel('prompt_generator_pro', 'regeln')} value={record.fields.regeln} format="longtext" className="md:col-span-2" />
        <RecordField label={fieldLabel('prompt_generator_pro', 'generierter_prompt')} value={record.fields.generierter_prompt} format="longtext" className="md:col-span-2" />
        <RecordField label={fieldLabel('prompt_generator_pro', 'prompt_generieren_button')} value={record.fields.prompt_generieren_button} format="bool" />
        <RecordField label={fieldLabel('prompt_generator_pro', 'prompt_copy_button')} value={record.fields.prompt_copy_button} format="bool" />
        <RecordField label={fieldLabel('prompt_generator_pro', 'prompt_name')} value={record.fields.prompt_name} format="longtext" className="md:col-span-2" />
        <RecordField label={fieldLabel('prompt_generator_pro', 'ergebnis_hochladen')} className="md:col-span-2">
          {record.fields.ergebnis_hochladen ? (
            <MediaThumbnail src={record.fields.ergebnis_hochladen as string} fit="contain" className="max-h-64 w-full rounded-lg" />
          ) : '—'}
        </RecordField>
      </RecordSection>

      <RecordAttachments appId={APP_IDS.PROMPT_GENERATOR_PRO} recordId={record.record_id} readOnly={!perms.canWrite('prompt_generator_pro')} />
    </>
  );
}
