"use client";

import { useEffect, useState } from "react";
import type { PageSection } from "@prisma/client";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { VideoUploadField } from "@/components/admin/VideoUploadField";
import {
  SECTION_FIELD_SCHEMAS,
  type FieldSchema,
  type ListFieldSchema,
  type ScalarFieldSchema,
} from "@/lib/section-field-schemas";
import { ApiRequestError, createSection, updateSection } from "@/lib/pages-api";
import type { SectionType } from "@/types/page-sections";

type FormData = Record<string, unknown>;

interface SectionEditorDialogProps {
  pageId: string;
  section: PageSection | null;
  /** Set (instead of `section`) to open the dialog in "create a new
   * section of this type" mode rather than "edit this existing one". */
  createType?: SectionType | null;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}

function ScalarInput({
  field,
  value,
  onChange,
}: {
  field: ScalarFieldSchema;
  value: string;
  onChange: (value: string) => void;
}) {
  if (field.kind === "image") {
    return <ImageUploadField value={value} onChange={onChange} />;
  }
  if (field.kind === "video") {
    return <VideoUploadField value={value} onChange={onChange} />;
  }
  if (field.kind === "richtext") {
    return <RichTextEditor value={value} onChange={onChange} />;
  }
  if (field.kind === "textarea") {
    return (
      <Textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={field.rows ?? 4}
        className={field.rows && field.rows > 8 ? "font-mono text-xs" : undefined}
      />
    );
  }
  return <Input value={value} onChange={(event) => onChange(event.target.value)} />;
}

function StringListEditor({ items, onChange }: { items: string[]; onChange: (items: string[]) => void }) {
  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex gap-2">
          <Input
            value={item}
            onChange={(event) => {
              const next = [...items];
              next[index] = event.target.value;
              onChange(next);
            }}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onChange(items.filter((_, i) => i !== index))}
          >
            <Trash2 />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => onChange([...items, ""])}>
        <Plus /> Add
      </Button>
    </div>
  );
}

function ListEditor({
  schema,
  items,
  onChange,
}: {
  schema: ListFieldSchema;
  items: Record<string, string>[];
  onChange: (items: Record<string, string>[]) => void;
}) {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="space-y-3 rounded-lg border border-border p-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Item {index + 1}</p>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
            >
              <Trash2 />
            </Button>
          </div>
          {schema.itemFields.map((itemField) => (
            <div key={itemField.key} className="space-y-1.5">
              <Label className="text-xs">{itemField.label}</Label>
              <ScalarInput
                field={itemField}
                value={item[itemField.key] ?? ""}
                onChange={(value) => {
                  const next = [...items];
                  next[index] = { ...next[index], [itemField.key]: value };
                  onChange(next);
                }}
              />
            </div>
          ))}
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => onChange([...items, { ...schema.emptyItem }])}>
        <Plus /> Add {schema.label.replace(/s$/, "")}
      </Button>
    </div>
  );
}

/** A `string[][]` field — two fixed columns — doesn't fit the generic
 * scalar/list model, so it's handled here as two `string-list` sub-fields
 * instead of a schema entry. Shared by `SUPPORT.items`, `MC_COMPLEXITY.items`,
 * and `twoColumnItems` on the three `ImageTextBlock`-shaped MC sections (see
 * `TWO_COLUMN_LIST_FIELDS_BY_SECTION` below). */
function TwoColumnListEditor({
  items,
  onChange,
}: {
  items: string[][];
  onChange: (items: string[][]) => void;
}) {
  const columns = items.length === 2 ? items : [items[0] ?? [], items[1] ?? []];
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {columns.map((column, columnIndex) => (
        <div key={columnIndex} className="space-y-1.5">
          <Label className="text-xs">Column {columnIndex + 1}</Label>
          <StringListEditor
            items={column}
            onChange={(next) => {
              const nextColumns = [...columns];
              nextColumns[columnIndex] = next;
              onChange(nextColumns);
            }}
          />
        </div>
      ))}
    </div>
  );
}

/** Which section types have a `string[][]` field, and under which key/label
 * — drives `TwoColumnListEditor` below instead of a per-type `if` chain. */
const TWO_COLUMN_LIST_FIELDS_BY_SECTION: Partial<Record<SectionType, { key: string; label: string }>> = {
  SUPPORT: { key: "items", label: "Support items" },
  MC_COMPLEXITY: { key: "items", label: "Considerations" },
  MC_FEATURED_ONE: { key: "twoColumnItems", label: "Two-column list" },
  MC_FEATURED_TWO: { key: "twoColumnItems", label: "Two-column list" },
  MC_PLANNING_CTA: { key: "twoColumnItems", label: "Two-column list" },
  FC_CABIN: { key: "twoColumnItems", label: "Two-column list" },
  FC_BEFORE_BOOKING: { key: "twoColumnItems", label: "Two-column list" },
  FC_BOARDING_EXPERIENCE: { key: "twoColumnItems", label: "Two-column list" },
  FC_FARE: { key: "twoColumnItems", label: "Two-column list" },
  FC_JOURNEY_PREFERENCES: { key: "twoColumnItems", label: "Two-column list" },
  CNX_INTRO: { key: "twoColumnItems", label: "Two-column list" },
  CNX_ENTIRE_BOOKING: { key: "twoColumnItems", label: "Two-column list" },
  CNX_PREMIUM_CABIN: { key: "twoColumnItems", label: "Two-column list" },
  CNX_REFUND_BLOCK: { key: "twoColumnItems", label: "Two-column list" },
  CNX_CREDIT_BLOCK: { key: "twoColumnItems", label: "Two-column list" },
  FCH_OPTIONS_CHANGE: { key: "twoColumnItems", label: "Two-column list" },
  FCH_EXPERTS_HELP: { key: "twoColumnItems", label: "Two-column list" },
  FCH_BUSINESS_CLASS_CHANGES: { key: "twoColumnItems", label: "Two-column list" },
  FCH_MULTICITY_CHANGE: { key: "twoColumnItems", label: "Two-column list" },
  FCH_REVIEW_INFO: { key: "twoColumnItems", label: "Two-column list" },
};

const FOOTER_COLUMN_LINKS_SCHEMA: ListFieldSchema = {
  key: "links",
  label: "Links",
  kind: "list",
  itemFields: [
    { key: "label", label: "Label", kind: "text" },
    { key: "href", label: "Link", kind: "text" },
  ],
  emptyItem: { label: "", href: "" },
};

interface FooterNavColumn {
  title: string;
  links: Record<string, string>[];
}

/** FOOTER.footerNavColumns (a fixed set of columns, each itself containing
 * a list of links) doesn't fit the generic scalar/list model — same
 * reasoning as `SupportItemsEditor` — so it's handled here: a title input
 * per column plus the existing generic `ListEditor` for that column's
 * links, rather than a schema entry. */
function FooterNavColumnsEditor({
  columns,
  onChange,
}: {
  columns: FooterNavColumn[];
  onChange: (columns: FooterNavColumn[]) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {columns.map((column, columnIndex) => (
        <div key={columnIndex} className="space-y-3 rounded-lg border border-border p-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Column title</Label>
            <Input
              value={column.title}
              onChange={(event) => {
                const next = [...columns];
                next[columnIndex] = { ...column, title: event.target.value };
                onChange(next);
              }}
            />
          </div>
          <ListEditor
            schema={FOOTER_COLUMN_LINKS_SCHEMA}
            items={column.links}
            onChange={(links) => {
              const next = [...columns];
              next[columnIndex] = { ...column, links };
              onChange(next);
            }}
          />
        </div>
      ))}
    </div>
  );
}

const NAV_CHILD_LINKS_SCHEMA: ListFieldSchema = {
  key: "children",
  label: "Dropdown links",
  kind: "list",
  itemFields: [
    { key: "label", label: "Label", kind: "text" },
    { key: "href", label: "Link", kind: "text" },
  ],
  emptyItem: { label: "", href: "" },
};

interface NavLink {
  label: string;
  href: string;
  children?: Record<string, string>[];
}

/** HEADER.navLinks (a variable-length list where any link can optionally
 * carry its own dropdown of child links) doesn't fit the generic
 * scalar/list model — same reasoning as `FooterNavColumnsEditor` — so it's
 * handled here: label/href inputs per link, plus the existing generic
 * `ListEditor` for that link's dropdown children, with its own add/remove
 * for both the top-level links and each dropdown's children. */
function NavLinksEditor({ links, onChange }: { links: NavLink[]; onChange: (links: NavLink[]) => void }) {
  return (
    <div className="space-y-4">
      {links.map((link, linkIndex) => (
        <div key={linkIndex} className="space-y-3 rounded-lg border border-border p-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Link {linkIndex + 1}</p>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => onChange(links.filter((_, i) => i !== linkIndex))}
            >
              <Trash2 />
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Label</Label>
              <Input
                value={link.label}
                onChange={(event) => {
                  const next = [...links];
                  next[linkIndex] = { ...link, label: event.target.value };
                  onChange(next);
                }}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Link</Label>
              <Input
                value={link.href}
                onChange={(event) => {
                  const next = [...links];
                  next[linkIndex] = { ...link, href: event.target.value };
                  onChange(next);
                }}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Dropdown (optional — leave empty for a plain link)</Label>
            <ListEditor
              schema={NAV_CHILD_LINKS_SCHEMA}
              items={link.children ?? []}
              onChange={(children) => {
                const next = [...links];
                next[linkIndex] = { ...link, children };
                onChange(next);
              }}
            />
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => onChange([...links, { label: "", href: "" }])}>
        <Plus /> Add link
      </Button>
    </div>
  );
}

/** One generic dialog, driven by `SECTION_FIELD_SCHEMAS`, instead of a
 * bespoke form per section type. Doubles as the "create a new section"
 * dialog when `createType` is set instead of `section` — same fields,
 * just posts to `createSection` instead of `updateSection` on save. */
export function SectionEditorDialog({ pageId, section, createType, onOpenChange, onSaved }: SectionEditorDialogProps) {
  const [formData, setFormData] = useState<FormData>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFormData((section?.data as FormData | null) ?? {});
  }, [section, createType]);

  const isCreating = !section && Boolean(createType);
  if (!section && !createType) return null;

  const sectionType = (section?.sectionType as SectionType) ?? createType!;
  const schema: FieldSchema[] = SECTION_FIELD_SCHEMAS[sectionType] ?? [];

  function setField(key: string, value: unknown) {
    setFormData((current) => ({ ...current, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (section) {
        await updateSection(pageId, section.id, { data: formData });
        toast.success("Section updated.");
      } else {
        await createSection(pageId, { sectionType, data: formData });
        toast.success("Section added.");
      }
      onSaved();
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof ApiRequestError ? error.message : "Couldn't save this section.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open onOpenChange={onOpenChange}>
      {/* The base `DialogContent` sets `sm:max-w-sm` — an unprefixed
          override loses that cascade fight at any real screen width, so
          this has to override at the same `sm:` breakpoint to actually
          take effect (this had been silently stuck at 384px). */}
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {isCreating ? "Add" : "Edit"} {sectionType.replaceAll("_", " ").toLowerCase()} section
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {schema.map((field) => (
            <div key={field.key} className="space-y-1.5">
              <Label>{field.label}</Label>
              {field.kind === "list" ? (
                <ListEditor
                  schema={field}
                  items={(formData[field.key] as Record<string, string>[] | undefined) ?? []}
                  onChange={(items) => setField(field.key, items)}
                />
              ) : field.kind === "string-list" ? (
                <StringListEditor
                  items={(formData[field.key] as string[] | undefined) ?? []}
                  onChange={(items) => setField(field.key, items)}
                />
              ) : (
                <ScalarInput
                  field={field}
                  value={(formData[field.key] as string | undefined) ?? ""}
                  onChange={(value) => setField(field.key, value)}
                />
              )}
            </div>
          ))}

          {TWO_COLUMN_LIST_FIELDS_BY_SECTION[sectionType] ? (
            <div className="space-y-1.5">
              <Label>{TWO_COLUMN_LIST_FIELDS_BY_SECTION[sectionType]!.label}</Label>
              <TwoColumnListEditor
                items={(formData[TWO_COLUMN_LIST_FIELDS_BY_SECTION[sectionType]!.key] as string[][] | undefined) ?? [[], []]}
                onChange={(items) => setField(TWO_COLUMN_LIST_FIELDS_BY_SECTION[sectionType]!.key, items)}
              />
            </div>
          ) : null}

          {sectionType === "HEADER" ? (
            <div className="space-y-1.5">
              <Label>Nav links</Label>
              <NavLinksEditor
                links={(formData.navLinks as NavLink[] | undefined) ?? []}
                onChange={(links) => setField("navLinks", links)}
              />
            </div>
          ) : null}

          {sectionType === "FOOTER" ? (
            <div className="space-y-1.5">
              <Label>Nav columns</Label>
              <FooterNavColumnsEditor
                columns={
                  (formData.footerNavColumns as { title: string; links: Record<string, string>[] }[] | undefined) ?? [
                    { title: "", links: [] },
                    { title: "", links: [] },
                    { title: "", links: [] },
                    { title: "", links: [] },
                  ]
                }
                onChange={(columns) => setField("footerNavColumns", columns)}
              />
            </div>
          ) : null}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : isCreating ? "Add section" : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
