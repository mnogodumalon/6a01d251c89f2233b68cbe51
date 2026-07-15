import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { lookupKey } from '@/lib/formatters';

// Empty PROXY_BASE → relative URLs (dashboard and form-proxy share the domain).
const PROXY_BASE = '';
const APP_ID = '6a01d24881f0aa7a74f3f3a4';
const SUBMIT_PATH = `/rest/apps/${APP_ID}/records`;
const ALTCHA_SCRIPT_SRC = 'https://cdn.jsdelivr.net/npm/altcha/dist/altcha.min.js';

async function submitPublicForm(fields: Record<string, unknown>, captchaToken: string) {
  const res = await fetch(`${PROXY_BASE}/api${SUBMIT_PATH}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Captcha-Token': captchaToken,
    },
    body: JSON.stringify({ fields }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || 'Submission failed');
  }
  return res.json();
}


function cleanFields(fields: Record<string, unknown>): Record<string, unknown> {
  const cleaned: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(fields)) {
    if (value == null) continue;
    if (typeof value === 'object' && !Array.isArray(value) && 'key' in (value as any)) {
      cleaned[key] = (value as any).key;
    } else if (Array.isArray(value)) {
      cleaned[key] = value.map(item =>
        typeof item === 'object' && item !== null && 'key' in item ? item.key : item
      );
    } else {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

export default function PublicFormPromptGeneratorPro() {
  const [fields, setFields] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const captchaRef = useRef<HTMLElement | null>(null);

  // Load the ALTCHA web component script once per page.
  useEffect(() => {
    if (document.querySelector(`script[src="${ALTCHA_SCRIPT_SRC}"]`)) return;
    const s = document.createElement('script');
    s.src = ALTCHA_SCRIPT_SRC;
    s.defer = true;
    document.head.appendChild(s);
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    const qIdx = hash.indexOf('?');
    if (qIdx === -1) return;
    const params = new URLSearchParams(hash.slice(qIdx + 1));
    const prefill: Record<string, any> = {};
    params.forEach((value, key) => { prefill[key] = value; });
    if (Object.keys(prefill).length) setFields(prev => ({ ...prefill, ...prev }));
  }, []);

  function readCaptchaToken(): string | null {
    const el = captchaRef.current as any;
    if (!el) return null;
    return el.value || el.getAttribute('value') || null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const token = readCaptchaToken();
    if (!token) {
      setError('Bitte warte auf die Spam-Prüfung und versuche es erneut.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await submitPublicForm(cleanFields(fields), token);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Etwas ist schiefgelaufen. Bitte versuche es erneut.');
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="h-16 w-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
            <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold">Vielen Dank!</h2>
          <p className="text-muted-foreground">Deine Eingabe wurde erfolgreich übermittelt.</p>
          <Button variant="outline" className="mt-4" onClick={() => { setSubmitted(false); setFields({}); }}>
            Weitere Eingabe
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground">Prompt-Generator Pro — Formular</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 bg-card rounded-xl border border-border p-6 shadow-md">
          <div className="space-y-2">
            <Label htmlFor="vorlage">Vorlage wählen</Label>
            <div role="radiogroup" className="flex flex-wrap gap-1.5">
              <button
                type="button"
                role="radio"
                aria-checked={lookupKey(fields.vorlage) === 'email'}
                onClick={() => setFields(f => ({ ...f, vorlage: (lookupKey(f.vorlage) === 'email' ? undefined : 'email') as any }))}
                className={`inline-flex items-center justify-center min-h-9 max-sm:min-h-11 max-sm:px-4 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                  lookupKey(fields.vorlage) === 'email'
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-background text-foreground border-input hover:bg-accent'
                }`}
              >
                Professionelle E-Mail verfassen
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={lookupKey(fields.vorlage) === 'blogpost'}
                onClick={() => setFields(f => ({ ...f, vorlage: (lookupKey(f.vorlage) === 'blogpost' ? undefined : 'blogpost') as any }))}
                className={`inline-flex items-center justify-center min-h-9 max-sm:min-h-11 max-sm:px-4 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                  lookupKey(fields.vorlage) === 'blogpost'
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-background text-foreground border-input hover:bg-accent'
                }`}
              >
                Blogpost-Gliederung erstellen
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={lookupKey(fields.vorlage) === 'linkedin'}
                onClick={() => setFields(f => ({ ...f, vorlage: (lookupKey(f.vorlage) === 'linkedin' ? undefined : 'linkedin') as any }))}
                className={`inline-flex items-center justify-center min-h-9 max-sm:min-h-11 max-sm:px-4 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                  lookupKey(fields.vorlage) === 'linkedin'
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-background text-foreground border-input hover:bg-accent'
                }`}
              >
                Social-Media-Post (LinkedIn)
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={lookupKey(fields.vorlage) === 'ein_bild_generieren'}
                onClick={() => setFields(f => ({ ...f, vorlage: (lookupKey(f.vorlage) === 'ein_bild_generieren' ? undefined : 'ein_bild_generieren') as any }))}
                className={`inline-flex items-center justify-center min-h-9 max-sm:min-h-11 max-sm:px-4 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                  lookupKey(fields.vorlage) === 'ein_bild_generieren'
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-background text-foreground border-input hover:bg-accent'
                }`}
              >
                Ein Bild generieren
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={lookupKey(fields.vorlage) === 'manuell'}
                onClick={() => setFields(f => ({ ...f, vorlage: (lookupKey(f.vorlage) === 'manuell' ? undefined : 'manuell') as any }))}
                className={`inline-flex items-center justify-center min-h-9 max-sm:min-h-11 max-sm:px-4 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                  lookupKey(fields.vorlage) === 'manuell'
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-background text-foreground border-input hover:bg-accent'
                }`}
              >
                Manuelle Eingabe
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="rolle_persona">Rolle / Persona der KI</Label>
            <Textarea
              id="rolle_persona"
              placeholder=""
              value={fields.rolle_persona ?? ''}
              onChange={e => setFields(f => ({ ...f, rolle_persona: e.target.value }))}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="kontext">Kontext / Ausgangssituation</Label>
            <Textarea
              id="kontext"
              placeholder=""
              value={fields.kontext ?? ''}
              onChange={e => setFields(f => ({ ...f, kontext: e.target.value }))}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="aufgabe">Konkrete Aufgabe / Ziel</Label>
            <Textarea
              id="aufgabe"
              placeholder=""
              value={fields.aufgabe ?? ''}
              onChange={e => setFields(f => ({ ...f, aufgabe: e.target.value }))}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="format_ausgabe">Format der Ausgabe</Label>
            <Textarea
              id="format_ausgabe"
              placeholder=""
              value={fields.format_ausgabe ?? ''}
              onChange={e => setFields(f => ({ ...f, format_ausgabe: e.target.value }))}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="regeln">Regeln & Einschränkungen</Label>
            <Textarea
              id="regeln"
              placeholder=""
              value={fields.regeln ?? ''}
              onChange={e => setFields(f => ({ ...f, regeln: e.target.value }))}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="generierter_prompt">Generierter Prompt</Label>
            <Textarea
              id="generierter_prompt"
              placeholder=""
              value={fields.generierter_prompt ?? ''}
              onChange={e => setFields(f => ({ ...f, generierter_prompt: e.target.value }))}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="prompt_generieren_button">Prompt generieren</Label>
            <div className="flex items-center gap-2 pt-1">
              <Checkbox
                id="prompt_generieren_button"
                checked={!!fields.prompt_generieren_button}
                onCheckedChange={(v) => setFields(f => ({ ...f, prompt_generieren_button: !!v }))}
              />
              <Label htmlFor="prompt_generieren_button" className="font-normal">Prompt generieren</Label>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="prompt_copy_button">Prompt kopieren</Label>
            <div className="flex items-center gap-2 pt-1">
              <Checkbox
                id="prompt_copy_button"
                checked={!!fields.prompt_copy_button}
                onCheckedChange={(v) => setFields(f => ({ ...f, prompt_copy_button: !!v }))}
              />
              <Label htmlFor="prompt_copy_button" className="font-normal">Prompt kopieren</Label>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="prompt_name">Name des Prompts</Label>
            <Textarea
              id="prompt_name"
              placeholder=""
              value={fields.prompt_name ?? ''}
              onChange={e => setFields(f => ({ ...f, prompt_name: e.target.value }))}
              rows={3}
            />
          </div>

          <altcha-widget
            ref={captchaRef as any}
            challengeurl={`${PROXY_BASE}/api/_challenge?path=${encodeURIComponent(SUBMIT_PATH)}`}
            auto="onsubmit"
            hidefooter
          />

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 rounded-lg p-3">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? 'Wird gesendet...' : 'Absenden'}
          </Button>
        </form>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Powered by Klar
        </p>
      </div>
    </div>
  );
}
