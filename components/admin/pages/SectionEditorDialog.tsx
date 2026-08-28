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

/** SUPPORT.items (`string[][]`, two fixed columns) doesn't fit the generic
 * scalar/list model — the only section shaped that way — so it's handled
 * here as two `string-list` sub-fields instead of a schema entry. */
function SupportItemsEditor({
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
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
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

          {sectionType === "SUPPORT" ? (
            <div className="space-y-1.5">
              <Label>Support items</Label>
              <SupportItemsEditor
                items={(formData.items as string[][] | undefined) ?? [[], []]}
                onChange={(items) => setField("items", items)}
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
