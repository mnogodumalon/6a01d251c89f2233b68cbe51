import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select';
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
      setError('Please wait for the spam check to finish and try again.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await submitPublicForm(cleanFields(fields), token);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
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
          <h2 className="text-xl font-bold">Thank you!</h2>
          <p className="text-muted-foreground">Your submission was received successfully.</p>
          <Button variant="outline" className="mt-4" onClick={() => { setSubmitted(false); setFields({}); }}>
            Submit another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground">Prompt-Generator Pro — Form</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 bg-card rounded-xl border border-border p-6 shadow-md">
          <div className="space-y-2">
            <Label htmlFor="vorlage">Vorlage waehlen</Label>
            <Select
              value={lookupKey(fields.vorlage) ?? 'none'}
              onValueChange={v => setFields(f => ({ ...f, vorlage: v === 'none' ? undefined : v as any }))}
            >
              <SelectTrigger id="vorlage"><SelectValue placeholder="Select..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">—</SelectItem>
                <SelectItem value="email">Professionelle E-Mail verfassen</SelectItem>
                <SelectItem value="blogpost">Blogpost-Gliederung erstellen</SelectItem>
                <SelectItem value="linkedin">Social-Media-Post (LinkedIn)</SelectItem>
                <SelectItem value="manuell">Manuelle Eingabe</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="rolle_persona">Rolle / Persona der KI</Label>
            <Textarea
              id="rolle_persona"
              value={fields.rolle_persona ?? ''}
              onChange={e => setFields(f => ({ ...f, rolle_persona: e.target.value }))}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="kontext">Kontext / Ausgangssituation</Label>
            <Textarea
              id="kontext"
              value={fields.kontext ?? ''}
              onChange={e => setFields(f => ({ ...f, kontext: e.target.value }))}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="aufgabe">Konkrete Aufgabe / Ziel</Label>
            <Textarea
              id="aufgabe"
              value={fields.aufgabe ?? ''}
              onChange={e => setFields(f => ({ ...f, aufgabe: e.target.value }))}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="format_ausgabe">Format der Ausgabe</Label>
            <Textarea
              id="format_ausgabe"
              value={fields.format_ausgabe ?? ''}
              onChange={e => setFields(f => ({ ...f, format_ausgabe: e.target.value }))}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="regeln">Regeln & Einschraenkungen</Label>
            <Textarea
              id="regeln"
              value={fields.regeln ?? ''}
              onChange={e => setFields(f => ({ ...f, regeln: e.target.value }))}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="generierter_prompt">Generierter Prompt</Label>
            <Textarea
              id="generierter_prompt"
              value={fields.generierter_prompt ?? ''}
              onChange={e => setFields(f => ({ ...f, generierter_prompt: e.target.value }))}
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
            {submitting ? 'Submitting...' : 'Submit'}
          </Button>
        </form>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Powered by Klar
        </p>
      </div>
    </div>
  );
}
