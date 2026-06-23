import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LivingAppsService, extractRecordId } from '@/services/livingAppsService';
import type { PromptGeneratorPro } from '@/types/app';
import { APP_IDS } from '@/types/app';
import { Button } from '@/components/ui/button';
import { IconArrowLeft, IconTrash } from '@tabler/icons-react';
import {
  RecordView, RecordHeader, RecordKeyFacts, RecordSection, RecordField,
  RecordAttachments, RecordViewSkeleton, RecordViewEmpty,
} from '@/components/widgets/RecordView';
import { PromptGeneratorProDialog } from '@/components/dialogs/PromptGeneratorProDialog';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { AI_PHOTO_SCAN, AI_PHOTO_LOCATION } from '@/config/ai-features';
import { formEnhancements } from '@/config/form-enhancements/PromptGeneratorPro';
import { evalComputed } from '@/config/form-enhancements/types';

export default function PromptGeneratorProDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [record, setRecord] = useState<PromptGeneratorPro | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => { loadData(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [id]);

  async function loadData() {
    setLoading(true);
    try {
      const list = await LivingAppsService.getPromptGeneratorPro();
      setRecord(list.find(r => r.record_id === id) ?? null);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(fields: PromptGeneratorPro['fields']) {
    if (!record) return;
    await LivingAppsService.updatePromptGeneratorProEntry(record.record_id, fields);
    await loadData();
    setEditing(false);
  }

  async function handleDelete() {
    if (!record) return;
    await LivingAppsService.deletePromptGeneratorProEntry(record.record_id);
    setDeleteOpen(false);
    navigate('/prompt-generator-pro');
  }

  if (loading) {
    return <RecordViewSkeleton />;
  }

  if (!record) {
    return (
      <RecordViewEmpty
        title="Eintrag nicht gefunden"
        action={
          <Button variant="ghost" onClick={() => navigate('/prompt-generator-pro')}>
            <IconArrowLeft className="h-4 w-4 mr-1.5" />
            Zurück
          </Button>
        }
      />
    );
  }

  return (
    <RecordView
      onBack={() => navigate('/prompt-generator-pro')}
      onEdit={() => setEditing(true)}
      backLabel="Zurück"
      editLabel="Bearbeiten"
    >
      <RecordHeader title={'Prompt-Generator Pro'} />

      {(() => {
        const lookupLists: Record<string, unknown> = {
        };
        const fmtComputed = (k: string, n: number) =>
          /(?:kosten|preis|betrag|gesamt|netto|brutto|summe|mwst|rabatt|anzahlung|umsatz|saldo)/i.test(k)
            ? n.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 })
            : n.toLocaleString('de-DE', { maximumFractionDigits: 2 });
        const computedFacts = Object.entries(formEnhancements.computed)
          .map(([key, formula]) => {
            const v = evalComputed(formula, record!.fields as Record<string, unknown>, { lookupLists });
            return v != null
              ? { label: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '), value: fmtComputed(key, v) }
              : null;
          })
          .filter((f): f is { label: string; value: string } => f !== null);
        return computedFacts.length > 0 ? <RecordKeyFacts items={computedFacts} /> : null;
      })()}

      <RecordSection title="Details" cols={2}>
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
      </RecordSection>

      <RecordAttachments appId={APP_IDS.PROMPT_GENERATOR_PRO} recordId={record.record_id} />

      <div className="flex justify-end pt-2">
        <Button variant="ghost" onClick={() => setDeleteOpen(true)} className="text-destructive hover:text-destructive">
          <IconTrash className="h-4 w-4 mr-1.5" />
          Löschen
        </Button>
      </div>

      <PromptGeneratorProDialog
        open={editing}
        onClose={() => setEditing(false)}
        onSubmit={handleUpdate}
        defaultValues={record.fields}
        recordId={record.record_id}
        enablePhotoScan={AI_PHOTO_SCAN['PromptGeneratorPro']}
        enablePhotoLocation={AI_PHOTO_LOCATION['PromptGeneratorPro']}
      />

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Prompt-Generator Pro löschen"
        description="Soll dieser Eintrag wirklich gelöscht werden? Diese Aktion kann nicht rückgängig gemacht werden."
      />
    </RecordView>
  );
}
