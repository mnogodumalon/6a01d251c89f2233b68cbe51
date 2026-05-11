import type { PromptGeneratorPro } from '@/types/app';
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { IconPencil } from '@tabler/icons-react';

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
          <DialogTitle>View Prompt-Generator Pro</DialogTitle>
        </DialogHeader>
        <div className="flex justify-end">
          <Button size="sm" onClick={() => { onClose(); onEdit(record); }}>
            <IconPencil className="h-3.5 w-3.5 mr-1.5" />
            Edit
          </Button>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Vorlage waehlen</Label>
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
            <Label className="text-xs text-muted-foreground">Regeln & Einschraenkungen</Label>
            <p className="text-sm whitespace-pre-wrap">{record.fields.regeln ?? '—'}</p>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Schritt-fuer-Schritt-Analyse anfordern</Label>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
              record.fields.cot_analyse ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
            }`}>
              {record.fields.cot_analyse ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Generierter Prompt</Label>
            <p className="text-sm whitespace-pre-wrap">{record.fields.generierter_prompt ?? '—'}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}