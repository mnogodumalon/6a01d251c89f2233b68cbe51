import { useDashboardData } from '@/hooks/useDashboardData';
import type { PromptGeneratorPro } from '@/types/app';
import { LOOKUP_OPTIONS } from '@/types/app';
import { LivingAppsService } from '@/services/livingAppsService';
import { formatDate } from '@/lib/formatters';
import { useState, useMemo, useCallback } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { PromptGeneratorProDialog } from '@/components/dialogs/PromptGeneratorProDialog';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { AI_PHOTO_SCAN, AI_PHOTO_LOCATION } from '@/config/ai-features';
import {
  IconAlertCircle, IconTool, IconRefresh, IconCheck,
  IconPlus, IconSearch, IconCopy, IconCopyCheck, IconPencil, IconTrash,
  IconSparkles, IconBrain, IconTarget, IconLayoutList, IconRuler,
  IconStepInto, IconCheck as IconCheckmark, IconChevronRight,
  IconFileText,
} from '@tabler/icons-react';

const APPGROUP_ID = '6a01d251c89f2233b68cbe51';
const REPAIR_ENDPOINT = '/claude/build/repair';

const VORLAGE_OPTIONS = LOOKUP_OPTIONS['prompt_generator_pro']?.vorlage ?? [];

const VORLAGE_COLORS: Record<string, string> = {
  email: 'bg-blue-100 text-blue-700 border-blue-200',
  blogpost: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  linkedin: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  bild_generieren: 'bg-pink-100 text-pink-700 border-pink-200',
  manuell: 'bg-orange-100 text-orange-700 border-orange-200',
};

function getVorlageLabel(vorlage: PromptGeneratorPro['fields']['vorlage']): string {
  if (!vorlage) return 'Manuell';
  if (typeof vorlage === 'object' && 'label' in vorlage) return vorlage.label;
  const opt = VORLAGE_OPTIONS.find(o => o.key === vorlage);
  return opt?.label ?? String(vorlage);
}

function getVorlageKey(vorlage: PromptGeneratorPro['fields']['vorlage']): string {
  if (!vorlage) return 'manuell';
  const raw = typeof vorlage === 'object' && 'key' in vorlage ? vorlage.key : String(vorlage);
  // Normalize legacy key 'ein_bild_generieren' → 'bild_generieren'
  return raw === 'ein_bild_generieren' ? 'bild_generieren' : raw;
}

function PromptSection({ label, value, icon }: { label: string; value?: string; icon: React.ReactNode }) {
  if (!value) return null;
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        <span className="shrink-0">{icon}</span>
        {label}
      </div>
      <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{value}</p>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }, [text]);

  return (
    <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5 shrink-0">
      {copied ? <IconCopyCheck size={14} className="text-green-600" /> : <IconCopy size={14} />}
      {copied ? 'Kopiert!' : 'Kopieren'}
    </Button>
  );
}

export default function DashboardOverview() {
  const {
    promptGeneratorPro,
    loading, error, fetchAll,
  } = useDashboardData();

  const [search, setSearch] = useState('');
  const [activeVorlage, setActiveVorlage] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<PromptGeneratorPro | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PromptGeneratorPro | null>(null);

  // ALL hooks before early returns
  const filtered = useMemo(() => {
    let list = promptGeneratorPro;
    if (activeVorlage) {
      list = list.filter(r => getVorlageKey(r.fields.vorlage) === activeVorlage);
    }
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter(r => {
      const f = r.fields;
      return (
        getVorlageLabel(f.vorlage).toLowerCase().includes(q) ||
        (f.aufgabe ?? '').toLowerCase().includes(q) ||
        (f.kontext ?? '').toLowerCase().includes(q) ||
        (f.generierter_prompt ?? '').toLowerCase().includes(q) ||
        (f.rolle_persona ?? '').toLowerCase().includes(q)
      );
    });
  }, [promptGeneratorPro, search, activeVorlage]);

  const selectedRecord = useMemo(
    () => promptGeneratorPro.find(r => r.record_id === selectedId) ?? null,
    [promptGeneratorPro, selectedId]
  );

  const handleCreate = useCallback(async (fields: PromptGeneratorPro['fields']) => {
    try {
      await LivingAppsService.createPromptGeneratorProEntry(fields);
      fetchAll();
    } catch { /* error already dispatched via errorbus:emit */ }
  }, [fetchAll]);

  const handleUpdate = useCallback(async (fields: PromptGeneratorPro['fields']) => {
    if (!editRecord) return;
    try {
      await LivingAppsService.updatePromptGeneratorProEntry(editRecord.record_id, fields);
      fetchAll();
    } catch { /* error already dispatched via errorbus:emit */ }
  }, [editRecord, fetchAll]);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await LivingAppsService.deletePromptGeneratorProEntry(deleteTarget.record_id);
      if (selectedId === deleteTarget.record_id) setSelectedId(null);
      setDeleteTarget(null);
      fetchAll();
    } catch { /* error already dispatched via errorbus:emit */ }
  }, [deleteTarget, selectedId, fetchAll]);

  if (loading) return <DashboardSkeleton />;
  if (error) return <DashboardError error={error} onRetry={fetchAll} />;

  const selectedKey = selectedRecord ? getVorlageKey(selectedRecord.fields.vorlage) : null;
  const selectedColorClass = selectedKey ? (VORLAGE_COLORS[selectedKey] ?? VORLAGE_COLORS.manuell) : '';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Prompt-Bibliothek</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {promptGeneratorPro.length} gespeicherte Prompts
          </p>
        </div>
        <Button
          onClick={() => { setEditRecord(null); setDialogOpen(true); }}
          className="gap-2 shrink-0"
        >
          <IconPlus size={16} />
          Neuer Prompt
        </Button>
      </div>

      {/* Filter-Chips */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => { setActiveVorlage(null); setSelectedId(null); }}
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition-all hover:shadow-sm ${
            activeVorlage === null
              ? 'bg-foreground text-background border-foreground'
              : 'bg-card text-muted-foreground border-border hover:border-foreground/30'
          }`}
        >
          Alle
          <span className={`text-xs rounded-full px-1.5 py-0.5 font-semibold ${
            activeVorlage === null ? 'bg-background/20 text-background' : 'bg-muted text-muted-foreground'
          }`}>
            {promptGeneratorPro.length}
          </span>
        </button>
        {VORLAGE_OPTIONS.map(opt => {
          const count = promptGeneratorPro.filter(r => getVorlageKey(r.fields.vorlage) === opt.key).length;
          const colorClass = VORLAGE_COLORS[opt.key] ?? VORLAGE_COLORS.manuell;
          const isActive = activeVorlage === opt.key;
          return (
            <button
              key={opt.key}
              onClick={() => { setActiveVorlage(isActive ? null : opt.key); setSelectedId(null); }}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition-all hover:shadow-sm ${colorClass} ${
                isActive ? 'ring-2 ring-offset-1 ring-current shadow-sm' : 'opacity-80 hover:opacity-100'
              }`}
            >
              {opt.label}
              <span className="text-xs rounded-full bg-current/10 px-1.5 py-0.5 font-semibold">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main: Liste + Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-4 min-h-[500px]">

        {/* Linke Spalte: Liste */}
        <div className="flex flex-col gap-3">
          {/* Suche */}
          <div className="relative">
            <IconSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground shrink-0" />
            <Input
              placeholder="Prompts durchsuchen..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 h-9"
            />
          </div>

          {/* Prompt-Karten */}
          <div className="flex flex-col gap-2 overflow-y-auto max-h-[600px] pr-0.5">
            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                <IconFileText size={40} className="text-muted-foreground/40" stroke={1.5} />
                <div>
                  <p className="font-medium text-muted-foreground">Keine Prompts gefunden</p>
                  {(search || activeVorlage) && (
                    <button
                      onClick={() => { setSearch(''); setActiveVorlage(null); }}
                      className="text-sm text-primary hover:underline mt-1"
                    >
                      Filter zurücksetzen
                    </button>
                  )}
                </div>
                {!search && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => { setEditRecord(null); setDialogOpen(true); }}
                    className="gap-1.5 mt-1"
                  >
                    <IconPlus size={14} />
                    Ersten Prompt erstellen
                  </Button>
                )}
              </div>
            )}
            {filtered.map(record => {
              const key = getVorlageKey(record.fields.vorlage);
              const colorClass = VORLAGE_COLORS[key] ?? VORLAGE_COLORS.manuell;
              const isSelected = selectedId === record.record_id;
              const hasPrompt = !!record.fields.generierter_prompt;
              return (
                <button
                  key={record.record_id}
                  onClick={() => setSelectedId(isSelected ? null : record.record_id)}
                  className={`w-full text-left rounded-2xl border p-4 transition-all hover:shadow-md group ${
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20'
                      : 'border-border bg-card hover:border-primary/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 min-w-0">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <span className={`inline-flex items-center rounded-lg px-2 py-0.5 text-xs font-medium border ${colorClass}`}>
                          {getVorlageLabel(record.fields.vorlage)}
                        </span>
                        {record.fields.cot_analyse && (
                          <span className="inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-xs font-medium bg-violet-100 text-violet-700 border border-violet-200">
                            <IconStepInto size={10} />
                            CoT
                          </span>
                        )}
                        {hasPrompt && (
                          <span className="inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                            <IconCheckmark size={10} />
                            Prompt
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-foreground line-clamp-1 min-w-0">
                        {record.fields.aufgabe ?? record.fields.kontext ?? record.fields.rolle_persona ?? '—'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDate(record.createdat)}
                      </p>
                    </div>
                    <IconChevronRight
                      size={16}
                      className={`shrink-0 text-muted-foreground transition-transform ${isSelected ? 'rotate-90 text-primary' : ''}`}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Rechte Spalte: Detail / Leer-Zustand */}
        <div className="rounded-2xl border bg-card overflow-hidden">
          {!selectedRecord ? (
            <div className="flex flex-col items-center justify-center h-full py-24 gap-4 text-center px-6">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <IconSparkles size={26} className="text-primary" stroke={1.5} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Prompt auswählen</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                  Wähle einen Prompt aus der Liste, um Details und den generierten Text zu sehen.
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => { setEditRecord(null); setDialogOpen(true); }}
                className="gap-1.5 mt-1"
              >
                <IconPlus size={14} />
                Neuen Prompt erstellen
              </Button>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              {/* Detail-Header */}
              <div className={`px-6 py-4 border-b flex items-start justify-between gap-4 flex-wrap ${selectedColorClass} bg-opacity-20`}
                style={{ background: 'var(--card)' }}>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold border ${selectedColorClass}`}>
                      {getVorlageLabel(selectedRecord.fields.vorlage)}
                    </span>
                    {selectedRecord.fields.cot_analyse && (
                      <Badge variant="secondary" className="gap-1 text-xs">
                        <IconStepInto size={10} />
                        Schritt-für-Schritt
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Erstellt: {formatDate(selectedRecord.createdat)}
                    {selectedRecord.updatedat && ` · Aktualisiert: ${formatDate(selectedRecord.updatedat)}`}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { setEditRecord(selectedRecord); setDialogOpen(true); }}
                    className="gap-1.5"
                  >
                    <IconPencil size={14} />
                    Bearbeiten
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteTarget(selectedRecord)}
                    className="gap-1.5 text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/5"
                  >
                    <IconTrash size={14} />
                    Löschen
                  </Button>
                </div>
              </div>

              {/* Detail-Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                <PromptSection
                  label="Rolle / Persona der KI"
                  value={selectedRecord.fields.rolle_persona}
                  icon={<IconBrain size={12} />}
                />
                <PromptSection
                  label="Kontext / Ausgangssituation"
                  value={selectedRecord.fields.kontext}
                  icon={<IconLayoutList size={12} />}
                />
                <PromptSection
                  label="Konkrete Aufgabe / Ziel"
                  value={selectedRecord.fields.aufgabe}
                  icon={<IconTarget size={12} />}
                />
                <PromptSection
                  label="Format der Ausgabe"
                  value={selectedRecord.fields.format_ausgabe}
                  icon={<IconFileText size={12} />}
                />
                <PromptSection
                  label="Regeln & Einschränkungen"
                  value={selectedRecord.fields.regeln}
                  icon={<IconRuler size={12} />}
                />

                {/* Generierter Prompt – Hero-Bereich */}
                {selectedRecord.fields.generierter_prompt && (
                  <div className="rounded-xl border border-primary/20 bg-primary/5 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-primary/10 bg-primary/10">
                      <div className="flex items-center gap-2">
                        <IconSparkles size={14} className="text-primary shrink-0" />
                        <span className="text-sm font-semibold text-primary">Generierter Prompt</span>
                      </div>
                      <CopyButton text={selectedRecord.fields.generierter_prompt} />
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap font-mono">
                        {selectedRecord.fields.generierter_prompt}
                      </p>
                    </div>
                  </div>
                )}

                {!selectedRecord.fields.generierter_prompt && (
                  <div className="rounded-xl border border-dashed border-muted-foreground/20 p-6 text-center">
                    <p className="text-sm text-muted-foreground">Noch kein generierter Prompt gespeichert.</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 gap-1.5"
                      onClick={() => { setEditRecord(selectedRecord); setDialogOpen(true); }}
                    >
                      <IconPencil size={13} />
                      Prompt hinzufügen
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dialog */}
      <PromptGeneratorProDialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); setEditRecord(null); }}
        onSubmit={editRecord ? handleUpdate : handleCreate}
        defaultValues={editRecord?.fields}
        enablePhotoScan={AI_PHOTO_SCAN['PromptGeneratorPro']}
        enablePhotoLocation={AI_PHOTO_LOCATION['PromptGeneratorPro']}
      />

      {/* Löschen bestätigen */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Prompt löschen"
        description={`Möchtest du diesen Prompt wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.`}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-9 w-36" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-4">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-9 rounded-lg" />
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
        </div>
        <Skeleton className="h-[500px] rounded-2xl" />
      </div>
    </div>
  );
}

function DashboardError({ error, onRetry }: { error: Error; onRetry: () => void }) {
  const [repairing, setRepairing] = useState(false);
  const [repairStatus, setRepairStatus] = useState('');
  const [repairDone, setRepairDone] = useState(false);
  const [repairFailed, setRepairFailed] = useState(false);

  const handleRepair = async () => {
    setRepairing(true);
    setRepairStatus('Reparatur wird gestartet...');
    setRepairFailed(false);

    const errorContext = JSON.stringify({
      type: 'data_loading',
      message: error.message,
      stack: (error.stack ?? '').split('\n').slice(0, 10).join('\n'),
      url: window.location.href,
    });

    try {
      const resp = await fetch(REPAIR_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ appgroup_id: APPGROUP_ID, error_context: errorContext }),
      });

      if (!resp.ok || !resp.body) {
        setRepairing(false);
        setRepairFailed(true);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        for (const raw of lines) {
          const line = raw.trim();
          if (!line.startsWith('data: ')) continue;
          const content = line.slice(6);
          if (content.startsWith('[STATUS]')) {
            setRepairStatus(content.replace(/^\[STATUS]\s*/, ''));
          }
          if (content.startsWith('[DONE]')) {
            setRepairDone(true);
            setRepairing(false);
          }
          if (content.startsWith('[ERROR]') && !content.includes('Dashboard-Links')) {
            setRepairFailed(true);
          }
        }
      }
    } catch {
      setRepairing(false);
      setRepairFailed(true);
    }
  };

  if (repairDone) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center">
          <IconCheck size={22} className="text-green-500" />
        </div>
        <div className="text-center">
          <h3 className="font-semibold text-foreground mb-1">Dashboard repariert</h3>
          <p className="text-sm text-muted-foreground max-w-xs">Das Problem wurde behoben. Bitte lade die Seite neu.</p>
        </div>
        <Button size="sm" onClick={() => window.location.reload()}>
          <IconRefresh size={14} className="mr-1" />Neu laden
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center">
        <IconAlertCircle size={22} className="text-destructive" />
      </div>
      <div className="text-center">
        <h3 className="font-semibold text-foreground mb-1">Fehler beim Laden</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          {repairing ? repairStatus : error.message}
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onRetry} disabled={repairing}>Erneut versuchen</Button>
        <Button size="sm" onClick={handleRepair} disabled={repairing}>
          {repairing
            ? <span className="inline-block w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-1" />
            : <IconTool size={14} className="mr-1" />}
          {repairing ? 'Repariere...' : 'Dashboard reparieren'}
        </Button>
      </div>
      {repairFailed && <p className="text-sm text-destructive">Automatische Reparatur fehlgeschlagen. Bitte kontaktiere den Support.</p>}
    </div>
  );
}
