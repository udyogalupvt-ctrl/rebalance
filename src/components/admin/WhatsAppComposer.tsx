import * as React from "react";
import { Check, Loader2, MessageCircle, Plus, Save, Trash2, X } from "lucide-react";
import {
  BUILT_IN_TEMPLATES,
  deleteTemplate,
  renderTemplate,
  saveTemplate,
  subscribeToTemplates,
  whatsAppLink,
  type MessageTemplate,
} from "@/lib/messageTemplates";
import { brand } from "@/data/content";
import { errorMessage } from "@/lib/runtime";
import { cn } from "@/lib/utils";

/**
 * Compose a WhatsApp message for one person.
 *
 * Three things the practice asked for, in one place:
 *
 *   - PREDEFINED messages. Pick a template and it is filled in with this
 *     person's name and concern, ready to send.
 *   - CUSTOM messages. The filled text stays editable; nothing is locked.
 *   - SAVE a template. Whatever is in the box can be kept for next time,
 *     with the specifics turned back into placeholders by hand.
 *
 * Sending happens through wa.me, which opens WhatsApp (Web or the desktop
 * app) with the message pre-filled. It cannot be sent silently — the practice
 * always sees the message and presses send themselves, which is the correct
 * behaviour for a clinical conversation.
 */
export function WhatsAppComposer({
  phone,
  name,
  concern,
  onSent,
}: {
  phone: string;
  name: string;
  concern: string;
  /** Called after WhatsApp is opened, so the contact can be logged. */
  onSent: (message: string) => void;
}) {
  const [templates, setTemplates] = React.useState<MessageTemplate[]>([...BUILT_IN_TEMPLATES]);
  const [activeId, setActiveId] = React.useState<string>(BUILT_IN_TEMPLATES[0]!.id);
  const [message, setMessage] = React.useState("");
  const [savingTemplate, setSavingTemplate] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState("");
  const [showSaveForm, setShowSaveForm] = React.useState(false);
  const [error, setError] = React.useState("");
  const [justSaved, setJustSaved] = React.useState(false);

  React.useEffect(() => subscribeToTemplates(setTemplates), []);

  const applyTemplate = React.useCallback(
    (template: MessageTemplate) => {
      setActiveId(template.id);
      setMessage(renderTemplate(template.body, { name, concern }, brand.practitioner, brand.name));
    },
    [name, concern],
  );

  // Fill the box with the first template as soon as we know who this is.
  React.useEffect(() => {
    const first = templates.find((t) => t.id === activeId) ?? templates[0];
    if (first) {
      setMessage(renderTemplate(first.body, { name, concern }, brand.practitioner, brand.name));
    }
    // Deliberately keyed on the person, not on `message`: re-running this on
    // every keystroke would overwrite what the practice is typing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, concern, templates.length]);

  const handleSaveTemplate = async () => {
    if (!newTitle.trim() || !message.trim()) return;
    setSavingTemplate(true);
    setError("");
    try {
      await saveTemplate({ title: newTitle.trim(), body: message.trim() });
      setNewTitle("");
      setShowSaveForm(false);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2500);
    } catch (err) {
      setError(errorMessage(err, "Couldn't save the template."));
    } finally {
      setSavingTemplate(false);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    try {
      await deleteTemplate(id);
      if (activeId === id) setActiveId(BUILT_IN_TEMPLATES[0]!.id);
    } catch (err) {
      setError(errorMessage(err, "Couldn't delete the template."));
    }
  };

  const canSend = phone.replace(/\D/g, "").length >= 10 && message.trim().length > 0;

  return (
    <div className="flex flex-col gap-4">
      {/* ---- template chips ---- */}
      <div>
        <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-text-muted">
          Templates
        </p>
        <div className="flex flex-wrap gap-2">
          {templates.map((t) => (
            <span key={t.id} className="group relative inline-flex">
              <button
                type="button"
                onClick={() => applyTemplate(t)}
                className={cn(
                  "rounded-pill border px-3.5 py-[7px] text-[12.5px] font-medium transition-colors",
                  activeId === t.id
                    ? "border-[var(--primary-strong)] bg-primary-soft text-primary-contrast"
                    : "border-border bg-surface-alt text-text-muted hover:text-text",
                  !t.builtIn && "pr-8",
                )}
              >
                {t.title}
              </button>
              {!t.builtIn && (
                <button
                  type="button"
                  onClick={() => handleDeleteTemplate(t.id)}
                  aria-label={`Delete template "${t.title}"`}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-text-muted opacity-0 transition-opacity hover:text-[var(--danger-contrast)] group-hover:opacity-100 focus:opacity-100"
                >
                  <X size={12} />
                </button>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* ---- the message ---- */}
      <div>
        <label
          htmlFor="wa-message"
          className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.08em] text-text-muted"
        >
          Message
        </label>
        <textarea
          id="wa-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
          className="w-full resize-y rounded-[13px] border border-border-input bg-surface p-3.5 text-[14.5px] leading-relaxed text-text outline-none focus:border-[var(--accent-strong)] focus:ring-2 focus:ring-[rgba(var(--accent-rgb),0.2)]"
          placeholder="Type a message, or pick a template above."
        />
        <p className="mt-1.5 text-[12px] text-text-muted">
          {message.trim().length} characters · edit freely before sending
        </p>
      </div>

      {error && (
        <p role="alert" className="text-[13px] font-medium text-[var(--danger-contrast)]">
          {error}
        </p>
      )}

      {/* ---- actions ---- */}
      <div className="flex flex-wrap items-center gap-2.5">
        <a
          href={canSend ? whatsAppLink(phone, message) : undefined}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => canSend && onSent(message)}
          aria-disabled={!canSend}
          className={cn(
            "inline-flex h-[46px] items-center gap-2 rounded-pill px-6 text-[14.5px] font-semibold transition-opacity",
            canSend
              ? "bg-[var(--whatsapp)] text-[var(--on-whatsapp)] hover:opacity-90"
              : "pointer-events-none bg-surface-alt text-text-muted opacity-60",
          )}
        >
          <MessageCircle size={17} />
          Open in WhatsApp
        </a>

        {showSaveForm ? (
          <div className="flex flex-1 flex-wrap items-center gap-2">
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Name this template"
              className="h-[46px] min-w-[180px] flex-1 rounded-[13px] border border-border-input bg-surface px-3.5 text-[14px] text-text outline-none focus:border-[var(--accent-strong)]"
              autoFocus
            />
            <button
              type="button"
              onClick={handleSaveTemplate}
              disabled={savingTemplate || !newTitle.trim()}
              className="inline-flex h-[46px] items-center gap-2 rounded-pill bg-[var(--primary-strong)] px-5 text-[14px] font-semibold text-[var(--on-primary)] disabled:opacity-50"
            >
              {savingTemplate ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Save
            </button>
            <button
              type="button"
              onClick={() => setShowSaveForm(false)}
              className="inline-flex h-[46px] items-center rounded-pill border border-border px-4 text-[14px] font-medium text-text-muted"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowSaveForm(true)}
            disabled={!message.trim()}
            className="inline-flex h-[46px] items-center gap-2 rounded-pill border border-border px-5 text-[14px] font-medium text-text transition-colors hover:bg-surface-alt disabled:opacity-50"
          >
            {justSaved ? <Check size={16} /> : <Plus size={16} />}
            {justSaved ? "Template saved" : "Save as template"}
          </button>
        )}
      </div>

      <p className="text-[12px] leading-relaxed text-text-muted">
        Saved templates can use{" "}
        <code className="rounded bg-surface-alt px-1 py-0.5 text-[11.5px]">{"{name}"}</code>,{" "}
        <code className="rounded bg-surface-alt px-1 py-0.5 text-[11.5px]">{"{concern}"}</code> and{" "}
        <code className="rounded bg-surface-alt px-1 py-0.5 text-[11.5px]">{"{practitioner}"}</code>
        , which are filled in for each person automatically.
      </p>
    </div>
  );
}

/** Small round icon action used in the leads list. */
export function ContactIconButton({
  href,
  label,
  onClick,
  tone = "neutral",
  children,
}: {
  href: string;
  label: string;
  onClick?: () => void;
  tone?: "neutral" | "whatsapp";
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target={tone === "whatsapp" ? "_blank" : undefined}
      rel={tone === "whatsapp" ? "noopener noreferrer" : undefined}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      aria-label={label}
      title={label}
      className={cn(
        "grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors",
        tone === "whatsapp"
          ? "bg-[rgba(var(--whatsapp-rgb),0.14)] text-[var(--whatsapp)] hover:bg-[rgba(var(--whatsapp-rgb),0.24)]"
          : "bg-surface-alt text-text hover:bg-[var(--border)]",
      )}
    >
      {children}
    </a>
  );
}
