"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  BookOpenText,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  Globe2,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Search,
  Save,
  Settings2,
  Trash2,
  X,
} from "lucide-react";
import {
  saveLocaleSectionAction,
  saveSiteSettingsAction,
  autoSaveLocaleSectionAction,
  autoSaveSiteSettingsAction,
  signOutAction,
} from "@/app/admin/actions";

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
type Locale = "en" | "ar";
type SearchResult = {
  mode: "content" | "settings";
  locale: Locale;
  section: string;
  path: (string | number)[];
  value: string;
};

type Props = {
  locale: "en" | "ar";
  messagesByLocale: Record<Locale, Record<string, unknown>>;
  contentAvailableByLocale: Record<Locale, boolean>;
  settings: Record<string, unknown>;
  initialSection: string;
  initialMode: "content" | "settings";
  userEmail: string;
  saved?: string;
  error?: string;
};

const sectionInfo: Record<string, { label: string; location: string }> = {
  meta: { label: "Home page SEO title and description", location: "Home page metadata" },
  seo: { label: "Page SEO metadata", location: "Search engine titles and descriptions" },
  nav: { label: "Navigation", location: "Shared header and mobile menu" },
  hero: { label: "Home hero", location: "Home page" },
  trustBar: { label: "Trust statistics", location: "Home page" },
  programs: { label: "Program cards", location: "Home page" },
  howItWorks: { label: "How it works", location: "Home page" },
  testimonials: { label: "Testimonials", location: "Home page" },
  credentials: { label: "Teacher credentials", location: "Home page" },
  faqTeaser: { label: "FAQ preview", location: "Home page" },
  finalCta: { label: "Final call to action", location: "Home page" },
  footer: { label: "Footer", location: "Shared across pages" },
  contact: { label: "Contact", location: "Contact page" },
  about: { label: "About", location: "About page" },
  pricing: { label: "Pricing", location: "Pricing page" },
  faq: { label: "Questions and answers", location: "FAQ page" },
  tajweed: { label: "Tajweed course", location: "Tajweed course page" },
  hifdh: { label: "Hifdh course", location: "Hifdh page" },
  arabic: { label: "Arabic course", location: "Arabic course page" },
  locations: { label: "Locations", location: "Locations pages" },
  blog: { label: "Blog posts and article SEO", location: "Blog index and article pages" },
  whatsapp: { label: "WhatsApp prompts", location: "Shared WhatsApp links" },
  notFound: { label: "Not-found page", location: "404 page" },
};

function labelFor(value: string) {
  const fieldLabels: Record<string, string> = {
    metaDescription: "Meta description",
    publishedTime: "Published date",
    seoTitle: "SEO title",
    slug: "URL slug",
  };
  if (fieldLabels[value]) return fieldLabels[value];

  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/^./, (letter) => letter.toUpperCase());
}

function normalizeSearchText(value: string) {
  return value
    .normalize("NFKD")
    .toLocaleLowerCase()
    .replace(/\p{M}/gu, "")
    .replace(/[\p{P}\p{S}]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function findNormalizedMatch(value: string, query: string) {
  let normalized = "";
  const sourcePositions: { start: number; end: number }[] = [];
  let sourceIndex = 0;

  for (const sourceCharacter of value) {
    const start = sourceIndex;
    sourceIndex += sourceCharacter.length;
    const transformed = sourceCharacter
      .normalize("NFKD")
      .toLocaleLowerCase()
      .replace(/\p{M}/gu, "")
      .replace(/[\p{P}\p{S}]/gu, " ");

    for (const character of transformed) {
      if (/\s/u.test(character)) {
        if (normalized && !normalized.endsWith(" ")) {
          normalized += " ";
          sourcePositions.push({ start, end: sourceIndex });
        }
      } else {
        normalized += character;
        sourcePositions.push({ start, end: sourceIndex });
      }
    }
  }

  normalized = normalized.trim();
  const matchIndex = normalized.indexOf(query);
  if (matchIndex < 0) return null;

  const start = sourcePositions[matchIndex]?.start;
  const end = sourcePositions[matchIndex + query.length - 1]?.end;
  if (start === undefined || end === undefined) return null;
  return { start, end };
}

function collectSearchResults(
  query: string,
  messagesByLocale: Record<Locale, Record<string, unknown>>,
  settings: Record<string, unknown>,
) {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return [];

  const results: SearchResult[] = [];
  const addStrings = (
    value: unknown,
    path: (string | number)[],
    mode: SearchResult["mode"],
    locale: Locale,
    section: string,
  ) => {
    if (typeof value === "string") {
      if (findNormalizedMatch(value, normalizedQuery)) {
        results.push({ mode, locale, section, path, value });
      }
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item, index) => addStrings(item, [...path, index], mode, locale, section));
      return;
    }
    if (value && typeof value === "object") {
      Object.entries(value).forEach(([key, child]) => addStrings(child, [...path, key], mode, locale, section));
    }
  };

  (["en", "ar"] as const).forEach((locale) => {
    Object.entries(messagesByLocale[locale]).forEach(([section, content]) => {
      if (section === "meta") return;
      addStrings(content, [], "content", locale, section);
    });
  });
  addStrings(settings, [], "settings", "en", "settings");
  return results;
}

function SearchSnippet({ value, query }: { value: string; query: string }) {
  const match = findNormalizedMatch(value, normalizeSearchText(query));
  if (!match) return <>{value}</>;

  const context = 48;
  const snippetStart = Math.max(0, match.start - context);
  const snippetEnd = Math.min(value.length, match.end + context);
  return (
    <>
      {snippetStart > 0 && "…"}
      {value.slice(snippetStart, match.start)}
      <mark>{value.slice(match.start, match.end)}</mark>
      {value.slice(match.end, snippetEnd)}
      {snippetEnd < value.length && "…"}
    </>
  );
}

function updateAtPath(value: JsonValue, path: (string | number)[], nextValue: JsonValue): JsonValue {
  if (path.length === 0) return nextValue;
  const [head, ...tail] = path;

  if (Array.isArray(value)) {
    const next = [...value];
    next[head as number] = updateAtPath(next[head as number], tail, nextValue);
    return next;
  }

  if (value && typeof value === "object") {
    return {
      ...value,
      [head]: updateAtPath(value[head as string], tail, nextValue),
    };
  }

  return value;
}

function emptyLike(value: JsonValue): JsonValue {
  if (Array.isArray(value)) return [];
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, emptyLike(item)]));
  }
  if (typeof value === "number") return 0;
  if (typeof value === "boolean") return false;
  return "";
}

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (a === null || b === null || typeof a !== "object") return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((item, index) => deepEqual(item, b[index]));
  }
  const aRecord = a as Record<string, unknown>;
  const bRecord = b as Record<string, unknown>;
  const aKeys = Object.keys(aRecord).sort();
  const bKeys = Object.keys(bRecord).sort();
  if (aKeys.length !== bKeys.length) return false;
  return aKeys.every((key, index) => key === bKeys[index] && deepEqual(aRecord[key], bRecord[key]));
}

function JsonField({
  name,
  value,
  path,
  update,
}: {
  name: string;
  value: JsonValue;
  path: (string | number)[];
  update: (path: (string | number)[], value: JsonValue) => void;
}): ReactNode {
  if (Array.isArray(value)) {
    return (
      <fieldset className="admin-fieldset min-w-0 border-s border-border ps-4">
        <legend className="admin-fieldset-legend py-1 text-sm font-semibold text-brown-700">{labelFor(name)}</legend>
        <div className="flex flex-col gap-4">
          {value.map((item, index) => (
            <div key={`${name}-${index}`} className="admin-array-item relative pe-10">
              <JsonField
                name={`${name} ${index + 1}`}
                value={item}
                path={[...path, index]}
                update={update}
              />
              <button
                type="button"
                title={`Remove ${labelFor(name)} ${index + 1}`}
                aria-label={`Remove ${labelFor(name)} ${index + 1}`}
                onClick={() => update(path, value.filter((_, itemIndex) => itemIndex !== index))}
                className="admin-icon-button absolute end-0 top-1 inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-600"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => update(path, [...value, value.length ? emptyLike(value[0]) : ""])}
            className="admin-secondary-button inline-flex min-h-9 w-fit items-center gap-2 rounded-md border border-border px-3 text-sm font-medium text-brown-600 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-600"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add {labelFor(name).toLowerCase()}
          </button>
        </div>
      </fieldset>
    );
  }

  if (value && typeof value === "object") {
    return (
      <fieldset className="admin-fieldset flex min-w-0 flex-col gap-4 border-s border-border ps-4">
        <legend className="admin-fieldset-legend py-1 text-sm font-semibold text-brown-700">{labelFor(name)}</legend>
        {Object.entries(value).map(([key, child]) => (
          <JsonField
            key={key}
            name={key}
            value={child}
            path={[...path, key]}
            update={update}
          />
        ))}
      </fieldset>
    );
  }

  return (
    <label className="admin-field-label flex min-w-0 flex-col gap-1.5 text-sm font-medium text-brown-600">
      {labelFor(name)}
      {name === "seoTitle" && (
        <span className="text-xs font-normal text-muted-foreground">
          Aim for 50–60 characters.
        </span>
      )}
      {name === "metaDescription" && (
        <span className="text-xs font-normal text-muted-foreground">
          Aim for 150–160 characters.
        </span>
      )}
      {name === "slug" && (
        <span className="text-xs font-normal text-muted-foreground">
          Use a short, descriptive URL slug with hyphens between words.
        </span>
      )}
      {typeof value === "boolean" ? (
        <input
          type="checkbox"
          checked={value}
          data-field-path={JSON.stringify(path)}
          onChange={(event) => update(path, event.target.checked)}
          className="admin-checkbox h-5 w-5 accent-sage-700"
        />
      ) : typeof value === "number" ? (
        <input
          type="number"
          data-field-path={JSON.stringify(path)}
          value={value}
          onChange={(event) => update(path, Number(event.target.value))}
          className="admin-input min-h-10 w-full max-w-xs rounded-md border border-border bg-background px-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-sage-600"
        />
      ) : (
        <textarea
          rows={typeof value === "string" && value.length > 140 ? 4 : 2}
          data-field-path={JSON.stringify(path)}
          value={value ?? ""}
          onChange={(event) => update(path, event.target.value)}
          className="admin-input min-h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-base leading-relaxed outline-none focus-visible:ring-2 focus-visible:ring-sage-600"
        />
      )}
    </label>
  );
}

function SectionPreview({ title, value }: { title: string; value: JsonValue }) {
  const renderNode = (name: string, nodeValue: JsonValue): ReactNode => {
    const nodeLabel = labelFor(name);

    if (nodeValue && typeof nodeValue === "object" && !Array.isArray(nodeValue)) {
      const entries = Object.entries(nodeValue as Record<string, JsonValue>);
      if (entries.length === 0) {
        return <p className="text-sm text-muted-foreground">No content yet.</p>;
      }
      return (
        <div className="flex flex-col gap-4">
          <h4 className="text-sm font-semibold text-brown-700">{nodeLabel}</h4>
          {entries.map(([key, child]) => (
            <div key={key} className="flex flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{labelFor(key)}</span>
              {renderNode(key, child)}
            </div>
          ))}
        </div>
      );
    }

    if (Array.isArray(nodeValue)) {
      if (nodeValue.length === 0) {
        return <p className="text-sm text-muted-foreground">No content yet.</p>;
      }
      return (
        <div className="flex flex-col gap-4">
          <h4 className="text-sm font-semibold text-brown-700">{nodeLabel}</h4>
          <div className="flex flex-col gap-3">
            {nodeValue.map((item, index) => (
              <div key={index} className="rounded-md border border-border bg-background p-3">
                {renderNode(`${nodeLabel} ${index + 1}`, item)}
              </div>
            ))}
          </div>
        </div>
      );
    }

    const text = nodeValue === null ? "" : String(nodeValue);
    return (
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{nodeLabel}</span>
        <p className="text-sm leading-relaxed text-foreground">{text.length > 0 ? text : "\u2014"}</p>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="text-sm font-semibold uppercase text-muted-foreground">Preview</h3>
        <p className="mt-1 text-sm text-muted-foreground">How the saved content will appear.</p>
      </div>
      <div className="admin-preview-card flex flex-col gap-4 rounded-md border border-border bg-background p-5">
        {renderNode(title, value)}
      </div>
    </div>
  );
}

export function AdminContentEditor({
  locale,
  messagesByLocale,
  contentAvailableByLocale,
  settings,
  initialSection,
  initialMode,
  userEmail,
  saved,
  error,
}: Props) {
  const [mode, setMode] = useState<"content" | "settings">(initialMode);
  const [section, setSection] = useState(initialSection);
  const [activeLocale, setActiveLocale] = useState<Locale>(locale);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [pendingFocusPath, setPendingFocusPath] = useState<(string | number)[] | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const sections = Object.keys(messagesByLocale[activeLocale]).filter(
    (key) => key !== "site" && key !== "meta",
  );
  const searchResults = useMemo(
    () => collectSearchResults(searchQuery, messagesByLocale, settings),
    [searchQuery, messagesByLocale, settings],
  );
  const currentValue = mode === "settings" ? settings : messagesByLocale[activeLocale][section];
  const activeError = mode === "content"
    ? !contentAvailableByLocale[activeLocale]
      ? "content-load-failed"
      : error === "load-failed" || error === "content-load-failed"
        ? undefined
        : error
    : error === "content-load-failed"
      ? undefined
      : error;
  const [editedValue, setEditedValue] = useState(currentValue as JsonValue);
  const [savedValue, setSavedValue] = useState(currentValue as JsonValue);
  const [showPreview, setShowPreview] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dirty = !deepEqual(editedValue, savedValue);

  useEffect(() => {
    setEditedValue(currentValue as JsonValue);
    setSavedValue(currentValue as JsonValue);
  }, [currentValue, mode, section, activeLocale]);

  useEffect(() => {
    if (!searchOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (!searchContainerRef.current?.contains(event.target as Node)) setSearchOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSearchOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [searchOpen]);

  useEffect(() => {
    if (!pendingFocusPath) return;
    const frame = requestAnimationFrame(() => {
      const target = Array.from(document.querySelectorAll<HTMLElement>("[data-field-path]"))
        .find((element) => element.dataset.fieldPath === JSON.stringify(pendingFocusPath));
      if (!target) {
        setPendingFocusPath(null);
        return;
      }

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
      target.focus({ preventScroll: true });
      target.classList.remove("admin-field-jump");
      void target.offsetWidth;
      target.classList.add("admin-field-jump");
      window.setTimeout(() => target.classList.remove("admin-field-jump"), 2200);
      setPendingFocusPath(null);
    });
    return () => cancelAnimationFrame(frame);
  }, [pendingFocusPath, editedValue, mode, section, activeLocale]);

  const discardChanges = () => {
    setEditedValue(currentValue as JsonValue);
    setSavedValue(currentValue as JsonValue);
  };

  const runAutoSave = async () => {
    const formData = new FormData();
    if (mode === "settings") {
      formData.set("settings", JSON.stringify(editedValue));
      const result = await autoSaveSiteSettingsAction(formData);
      if (result && typeof result === "object" && "ok" in result && result.ok) {
        setSavedValue(editedValue);
      }
      return;
    }
    formData.set("locale", activeLocale);
    formData.set("section", section);
    formData.set("content", JSON.stringify(editedValue));
    const result = await autoSaveLocaleSectionAction(formData);
    if (result && typeof result === "object" && "ok" in result && result.ok) {
      setSavedValue(editedValue);
    }
  };

  useEffect(() => {
    if (showPreview) return;
    if (!dirty) {
      if (saveTimer.current) { clearTimeout(saveTimer.current); saveTimer.current = null; }
      return;
    }
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => { void runAutoSave(); }, 1500);
    return () => { if (saveTimer.current) { clearTimeout(saveTimer.current); saveTimer.current = null; } };
  }, [dirty, editedValue, mode, activeLocale, section, showPreview]);

  useEffect(() => {
    if (!dirty) return;
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [dirty]);

  const saveAction = mode === "settings" ? saveSiteSettingsAction : saveLocaleSectionAction;
  const fieldName = mode === "settings" ? "settings" : "content";
  const userInitials = userEmail
    .split("@")[0]
    .split(/[._-]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
  const selectSearchResult = (result: SearchResult) => {
    const nextValue = result.mode === "settings"
      ? settings
      : messagesByLocale[result.locale][result.section];
    setEditedValue(nextValue as JsonValue);
    setSavedValue(nextValue as JsonValue);
    setPendingFocusPath(result.path);
    setMode(result.mode);
    setSection(result.section);
    setActiveLocale(result.locale);
    setSearchQuery("");
    setSearchOpen(false);
    setMobileSidebarOpen(false);
  };
  const resultLocation = (result: SearchResult) => {
    const sectionLabel = result.mode === "settings"
      ? "Site settings"
      : sectionInfo[result.section]?.label ?? labelFor(result.section);
    const fieldPath: string[] = [];
    result.path.forEach((part, index) => {
      if (typeof part === "number") {
        fieldPath.push(`${labelFor(String(result.path[index - 1] ?? "item")).replace(/s$/i, "")} ${part + 1}`);
      } else if (typeof result.path[index + 1] !== "number") {
        fieldPath.push(labelFor(part));
      }
    });
    return `${sectionLabel} • ${fieldPath.join(" · ")}${result.mode === "content" ? ` · ${result.locale.toUpperCase()}` : ""}`;
  };

  return (
    <div className={`admin-shell${sidebarCollapsed ? " is-collapsed" : ""}`}>
      <header className="admin-topbar">
        <button
          type="button"
          className="admin-mobile-menu"
          aria-label={mobileSidebarOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={mobileSidebarOpen}
          onClick={() => setMobileSidebarOpen((open) => !open)}
        >
          {mobileSidebarOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
        <div className="admin-topbar-title">
          <span className="admin-topbar-kicker">Rawdat ul-Huda</span>
          <span className="admin-topbar-heading">Content workspace</span>
        </div>
        <div className="admin-search" ref={searchContainerRef}>
          <Search size={17} aria-hidden="true" />
          <input
            type="search"
            aria-label="Search all editable content"
            aria-expanded={searchOpen && Boolean(searchQuery.trim())}
            aria-controls="admin-global-search-results"
            placeholder="Search all site content"
            value={searchQuery}
            onFocus={() => setSearchOpen(true)}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setSearchOpen(true);
            }}
          />
          {searchQuery.trim() && searchOpen && (
            <div className="admin-search-results" id="admin-global-search-results" role="listbox" aria-label="Content search results">
              {searchResults.length ? searchResults.slice(0, 10).map((result, index) => (
                <button
                  type="button"
                  role="option"
                  aria-selected={false}
                  key={`${result.locale}-${result.section}-${JSON.stringify(result.path)}-${index}`}
                  onClick={() => selectSearchResult(result)}
                >
                  <FileText size={16} aria-hidden="true" />
                  <span className="admin-search-result-location">{resultLocation(result)}</span>
                  <small className="admin-search-result-snippet"><SearchSnippet value={result.value} query={searchQuery} /></small>
                </button>
              )) : <p className="admin-search-empty">No matching content found</p>}
            </div>
          )}
        </div>
        <div className="admin-topbar-actions">
          <div className="admin-profile" title={userEmail}>
            <span className="admin-avatar" aria-hidden="true">{userInitials || "A"}</span>
            <span className="admin-profile-email">{userEmail}</span>
          </div>
        </div>
      </header>

      <div className="admin-layout">
        {mobileSidebarOpen && (
          <button
            type="button"
            className="admin-sidebar-backdrop"
            aria-label="Close navigation"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}
        <aside className={`admin-sidebar${mobileSidebarOpen ? " is-open" : ""}`}>
          <div className="admin-brand">
            <span className="admin-brand-mark"><BookOpenText size={22} aria-hidden="true" /></span>
            <div className="admin-brand-copy">
              <strong>Rawdat ul-Huda</strong>
              <span>Academy console</span>
            </div>
            <button
              type="button"
              className="admin-collapse-button"
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              onClick={() => setSidebarCollapsed((collapsed) => !collapsed)}
            >
              {sidebarCollapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
            </button>
            <button
              type="button"
              className="admin-close-drawer"
              aria-label="Close navigation"
              onClick={() => setMobileSidebarOpen(false)}
            >
              <X size={18} />
            </button>
          </div>
          <div className="admin-sidebar-scroll">
            <p className="admin-nav-label">Workspace</p>
            <nav className="admin-nav" aria-label="Admin navigation">
              <button
                type="button"
                title="Edit page content"
                aria-current={mode === "content" ? "page" : undefined}
                className={`admin-nav-link${mode === "content" ? " is-active" : ""}`}
                onClick={() => {
                  setMode("content");
                  setMobileSidebarOpen(false);
                }}
              >
                <LayoutDashboard size={18} aria-hidden="true" />
                <span>Page content</span>
              </button>
              <button
                type="button"
                title="Site info and settings"
                aria-current={mode === "settings" ? "page" : undefined}
                className={`admin-nav-link${mode === "settings" ? " is-active" : ""}`}
                onClick={() => {
                  setMode("settings");
                  setMobileSidebarOpen(false);
                }}
              >
                <Settings2 size={18} aria-hidden="true" />
                <span>Site info &amp; settings</span>
              </button>
            </nav>
            {mode === "content" && (
              <>
                <div className="admin-sidebar-divider" />
                <div className="admin-subsection-heading">
                  <p className="admin-nav-label">Language</p>
                  <Globe2 size={15} aria-hidden="true" />
                </div>
                <div className="admin-language-switch" aria-label="Content language">
                  <a
                    href={`/admin?locale=en&section=${encodeURIComponent(section)}`}
                    aria-current={activeLocale === "en" ? "page" : undefined}
                    className={activeLocale === "en" ? "is-active" : ""}
                  >
                    English
                  </a>
                  <a
                    href={`/admin?locale=ar&section=${encodeURIComponent(section)}`}
                    aria-current={activeLocale === "ar" ? "page" : undefined}
                    className={activeLocale === "ar" ? "is-active" : ""}
                  >
                    العربية
                  </a>
                </div>
                <label className="admin-section-select-label">
                  <span>Page section</span>
                  <span className="admin-select-wrap">
                    <select value={section} onChange={(event) => setSection(event.target.value)}>
                      {sections.map((key) => (
                        <option key={key} value={key}>{sectionInfo[key]?.label ?? labelFor(key)}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} aria-hidden="true" />
                  </span>
                </label>
                <p className="admin-section-location">{sectionInfo[section]?.location ?? "Site content"}</p>
              </>
            )}
          </div>
          <div className="admin-sidebar-footer">
            <form action={signOutAction}>
              <button className="admin-nav-link admin-logout">
                <LogOut size={18} aria-hidden="true" />
                <span>Sign out</span>
              </button>
            </form>
            <div className="admin-sidebar-user">
              <span className="admin-avatar" aria-hidden="true">{userInitials || "A"}</span>
              <span className="admin-sidebar-user-copy">
                <strong>Signed in as</strong>
                <small>{userEmail}</small>
              </span>
            </div>
          </div>
        </aside>

        <main className="admin-main">
          <div className="admin-page-heading">
            <div>
              <p className="admin-eyebrow">{mode === "settings" ? "Site controls" : "Content management"}</p>
              <h1>{mode === "settings" ? "Site info & settings" : sectionInfo[section]?.label ?? labelFor(section)}</h1>
              <p className="admin-page-description">
                {mode === "settings"
                  ? "Keep your public identity and contact details up to date."
                    : `Manage the ${activeLocale === "ar" ? "Arabic" : "English"} copy shown on your website.`}
              </p>
            </div>
            <span className="admin-live-badge"><span /> Live site</span>
          </div>
          <section className="admin-overview-cards" aria-label="Workspace summary">
            <div className="admin-overview-card">
              <span className="admin-overview-icon"><FileText size={18} aria-hidden="true" /></span>
              <span className="admin-overview-copy"><small>Editable sections</small><strong>{sections.length}</strong></span>
              <span className="admin-overview-note">site-wide</span>
            </div>
            <div className="admin-overview-card">
              <span className="admin-overview-icon"><Globe2 size={18} aria-hidden="true" /></span>
              <span className="admin-overview-copy"><small>Content language</small>              <strong>{activeLocale === "ar" ? "العربية" : "English"}</strong></span>
              <span className="admin-overview-note">{activeLocale.toUpperCase()}</span>
            </div>
            <div className="admin-overview-card">
              <span className={`admin-overview-icon${dirty ? " is-pending" : ""}`}><Check size={18} aria-hidden="true" /></span>
              <span className="admin-overview-copy"><small>Current status</small><strong>{dirty ? "Unsaved edits" : "Up to date"}</strong></span>
              <span className={`admin-status-dot${dirty ? " is-pending" : ""}`} />
            </div>
          </section>

          <section className="admin-editor-panel">
            <div className="admin-editor-heading">
              <div className="admin-editor-heading-copy">
                <span className="admin-editor-icon">
                  {mode === "settings" ? <Settings2 size={18} aria-hidden="true" /> : <FileText size={18} aria-hidden="true" />}
                </span>
                <div>
                  <h2>{mode === "settings" ? "Site details" : sectionInfo[section]?.label ?? labelFor(section)}</h2>
                  <p>{mode === "settings" ? "Contact information and public profiles" : sectionInfo[section]?.location ?? "Site content"}</p>
                </div>
              </div>
              <div className="admin-editor-heading-actions">
                {mode === "settings" && (
                  <div className="admin-context-languages" aria-label="Preview language context">
                    <a href="/admin?locale=en&mode=settings" aria-current={activeLocale === "en" ? "page" : undefined}>EN</a>
                    <a href="/admin?locale=ar&mode=settings" aria-current={activeLocale === "ar" ? "page" : undefined}>AR</a>
                  </div>
                )}
                <button type="button" className="admin-secondary-button" onClick={() => setShowPreview((prev) => !prev)}>
                  {showPreview ? "Back to editing" : "Preview"}
                </button>
              </div>
            </div>
            {dirty && <p className="admin-unsaved-note" role="status">You have unsaved changes.</p>}
            {saved && (
              <p className="admin-success-message" role="status">
                <Check size={16} aria-hidden="true" /> Changes saved and published.
              </p>
            )}
            {activeError && (
              <p className="admin-error-message" role="alert">
                {activeError === "load-failed"
                  ? "Saved site settings could not be loaded. Restore the API connection before editing site details."
                  : activeError === "content-load-failed"
                    ? "Saved page content could not be loaded. Editing is paused to protect the published content."
                    : activeError === "invalid-content" || activeError === "invalid-settings" || activeError === "invalid-json"
                      ? "Some fields are invalid. Review the values and try again."
                      : "Changes could not be saved. Check the database setup and try again."}
              </p>
            )}
            {showPreview ? (
              <div className="admin-editor-body">
                <SectionPreview
                  title={mode === "settings" ? "Site details" : sectionInfo[section]?.label ?? labelFor(section)}
                  value={currentValue as JsonValue}
                />
              </div>
            ) : (
              <form action={saveAction} className="admin-editor-body">
                {mode === "content" && (
                  <>
                    <input type="hidden" name="locale" value={activeLocale} />
                    <input type="hidden" name="section" value={section} />
                  </>
                )}
                <input type="hidden" name={fieldName} value={JSON.stringify(editedValue)} />
                <div dir={activeLocale === "ar" ? "rtl" : "ltr"} className="admin-fields">
                  {editedValue && typeof editedValue === "object" && !Array.isArray(editedValue)
                    ? Object.entries(editedValue).map(([key, value]) => (
                        <JsonField
                          key={key}
                          name={key}
                          value={value}
                          path={[key]}
                          update={(path, nextValue) => setEditedValue((current) => updateAtPath(current, path, nextValue))}
                        />
                      ))
                    : (
                        <JsonField
                          name={section}
                          value={editedValue}
                          path={[]}
                          update={(_, nextValue) => setEditedValue(nextValue)}
                        />
                      )}
                </div>
                <div className="admin-form-footer">
                  <div className="admin-form-actions">
                    <button
                      type="submit"
                      disabled={
                        (mode === "settings" && activeError === "load-failed") ||
                        (mode === "content" && activeError === "content-load-failed")
                      }
                      className="admin-primary-button"
                    >
                      <Save size={16} aria-hidden="true" />
                      Save and publish
                    </button>
                    {dirty && (
                      <button type="button" onClick={discardChanges} className="admin-secondary-button">
                        Discard changes
                      </button>
                    )}
                  </div>
                  <p>{dirty ? "Save to publish your updates, or discard to revert." : "Your latest saved version is live."}</p>
                </div>
              </form>
            )}
          </section>
          <footer className="admin-page-footer">Rawdat ul-Huda · Site administration</footer>
        </main>
      </div>
    </div>
  );
}