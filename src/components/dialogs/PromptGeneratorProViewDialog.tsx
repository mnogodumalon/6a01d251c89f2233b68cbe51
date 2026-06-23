import type { PromptGeneratorPro } from '@/types/app';
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { APP_IDS } from '@/types/app';
import { AttachmentsSection } from '@/components/AttachmentsSection';
import { MediaThumbnail } from '@/components/widgets/MediaViewer';
import { Badge } from '@/components/ui/badge';
import { IconPencil, IconFileText } from '@tabler/icons-react';

interface PromptGeneratorProViewDialogProps {
  open: boolean;
  onClose: () => void;
  record: PromptGeneratorPro | null;
  onEdit: (record: PromptGeneratorPro) => void;
}

export function PromptGeneratorProViewDialog({ open, onClose, record, onEdit }: PromptGeneratorProViewDialogProps) {
  if (!record) return null;

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Prompt-Generator Pro anzeigen</DialogTitle>
        </DialogHeader>
        <div className="flex justify-end">
          <Button size="sm" onClick={() => { onClose(); onEdit(record); }}>
            <IconPencil className="h-3.5 w-3.5 mr-1.5" />
            Bearbeiten
          </Button>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Excel-Datei hochladen</Label>
            {record.fields.excel_upload ? (
              <MediaThumbnail src={record.fields.excel_upload} fit="contain" className="w-full rounded-lg border" />
            ) : <p className="text-sm text-muted-foreground">—</p>}
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Vorlage wählen</Label>
            <Badge variant="secondary">{record.fields.vorlage?.label ?? '—'}</Badge>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Rolle / Persona der KI</Label>
            <p className="text-sm whitespace-pre-wrap">{record.fields.rolle_persona ?? '—'}</p>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Kontext / Ausgangssituation</Label>
            <p className="text-sm whitespace-pre-wrap">{record.fields.kontext ?? '—'}</p>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Konkrete Aufgabe / Ziel</Label>
            <p className="text-sm whitespace-pre-wrap">{record.fields.aufgabe ?? '—'}</p>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Format der Ausgabe</Label>
            <p className="text-sm whitespace-pre-wrap">{record.fields.format_ausgabe ?? '—'}</p>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Regeln & Einschränkungen</Label>
            <p className="text-sm whitespace-pre-wrap">{record.fields.regeln ?? '—'}</p>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Generierter Prompt</Label>
            <p className="text-sm whitespace-pre-wrap">{record.fields.generierter_prompt ?? '—'}</p>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Prompt generieren</Label>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
              record.fields.prompt_generieren_button ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
            }`}>
              {record.fields.prompt_generieren_button ? 'Ja' : 'Nein'}
            </span>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Prompt kopieren</Label>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
              record.fields.prompt_copy_button ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
            }`}>
              {record.fields.prompt_copy_button ? 'Ja' : 'Nein'}
            </span>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Name des Prompts</Label>
            <p className="text-sm whitespace-pre-wrap">{record.fields.prompt_name ?? '—'}</p>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Ergebnis hochladen</Label>
            {record.fields.ergebnis_hochladen ? (
              <MediaThumbnail src={record.fields.ergebnis_hochladen} fit="contain" className="w-full rounded-lg border" />
            ) : <p className="text-sm text-muted-foreground">—</p>}
          </div>
          <div className="pt-2 border-t border-border">
            <AttachmentsSection appId={APP_IDS.PROMPT_GENERATOR_PRO} recordId={record.record_id} readOnly />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}