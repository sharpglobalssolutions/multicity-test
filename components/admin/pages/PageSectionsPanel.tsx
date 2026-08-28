"use client";

import { useCallback, useEffect, useState } from "react";
import type { PageSection } from "@prisma/client";
import { ChevronDown, ChevronUp, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionEditorDialog } from "@/components/admin/pages/SectionEditorDialog";
import {
  ApiRequestError,
  deleteSection,
  fetchSections,
  reorderSections,
} from "@/lib/pages-api";
import { SECTION_TYPES } from "@/validations/page-section.validation";
import type { SectionType } from "@/types/page-sections";

interface PageSectionsPanelProps {
  pageId: string;
}

const NEW_SECTION_TYPE_LABELS = Object.fromEntries(SECTION_TYPES.map((type) => [type, type.replaceAll("_", " ")]));

export function PageSectionsPanel({ pageId }: PageSectionsPanelProps) {
  const [sections, setSections] = useState<PageSection[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");
  const [editingSection, setEditingSection] = useState<PageSection | null>(null);
  const [deletingSection, setDeletingSection] = useState<PageSection | null>(null);
  const [newSectionType, setNewSectionType] = useState<SectionType | "">("");
  const [creatingType, setCreatingType] = useState<SectionType | null>(null);

  const load = useCallback(async () => {
    setLoadState("loading");
    try {
      const loaded = await fetchSections(pageId);
      setSections([...loaded].sort((a, b) => a.sortOrder - b.sortOrder));
      setLoadState("loaded");
    } catch {
      setLoadState("error");
    }
  }, [pageId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleMove(index: number, direction: -1 | 1) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const reordered = [...sections];
    const moved = reordered[index];
    const target = reordered[targetIndex];
    if (!moved || !target) return;
    reordered[index] = target;
    reordered[targetIndex] = moved;
    setSections(reordered);

    try {
      await reorderSections(
        pageId,
        reordered.map((section) => section.id),
      );
    } catch (error) {
      toast.error(error instanceof ApiRequestError ? error.message : "Couldn't reorder sections.");
      load();
    }
  }

  async function handleDelete() {
    if (!deletingSection) return;
    try {
      await deleteSection(pageId, deletingSection.id);
      toast.success("Section deleted.");
      load();
    } catch (error) {
      toast.error(error instanceof ApiRequestError ? error.message : "Couldn't delete this section.");
      throw error;
    }
  }

  if (loadState === "loading") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sections</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (loadState === "error") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sections</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Couldn&apos;t load this page&apos;s sections.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Sections</CardTitle>
          <div className="flex items-center gap-2">
            <Select
              value={newSectionType}
              onValueChange={(value) => setNewSectionType(value as SectionType)}
              items={NEW_SECTION_TYPE_LABELS}
            >
              <SelectTrigger className="w-48" aria-label="Section type to add">
                <SelectValue placeholder="Section type…" />
              </SelectTrigger>
              <SelectContent>
                {SECTION_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.replaceAll("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              size="sm"
              disabled={!newSectionType}
              onClick={() => {
                if (newSectionType) setCreatingType(newSectionType);
              }}
            >
              <Plus /> Add section
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {sections.length === 0 ? (
            <p className="text-sm text-muted-foreground">This page has no sections yet.</p>
          ) : (
            sections.map((section, index) => (
              <div
                key={section.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-border p-3"
              >
                <div className="min-w-0">
                  <p className="font-heading text-sm font-medium text-foreground">
                    {section.sectionType.replaceAll("_", " ")}
                  </p>
                  {section.title ? <p className="truncate text-xs text-muted-foreground">{section.title}</p> : null}
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    disabled={index === 0}
                    onClick={() => handleMove(index, -1)}
                    aria-label="Move up"
                  >
                    <ChevronUp />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    disabled={index === sections.length - 1}
                    onClick={() => handleMove(index, 1)}
                    aria-label="Move down"
                  >
                    <ChevronDown />
                  </Button>
                  <Button variant="ghost" size="icon-sm" onClick={() => setEditingSection(section)} aria-label="Edit">
                    <Pencil />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setDeletingSection(section)}
                    aria-label="Delete"
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <SectionEditorDialog
        pageId={pageId}
        section={editingSection}
        createType={creatingType}
        onOpenChange={(open) => {
          if (!open) {
            setEditingSection(null);
            setCreatingType(null);
          }
        }}
        onSaved={() => {
          setNewSectionType("");
          load();
        }}
      />

      <ConfirmDialog
        open={deletingSection !== null}
        onOpenChange={(open) => {
          if (!open) setDeletingSection(null);
        }}
        title="Delete this section?"
        description="This can't be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={handleDelete}
      />
    </>
  );
}
