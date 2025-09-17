import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GripVertical, Trash2, Plus, ExternalLink, FileText } from 'lucide-react';

interface FooterLink {
  text: string;
  url: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface SortableLinkProps {
  link: FooterLink;
  index: number;
  sectionIndex: number;
  onUpdate: (sectionIndex: number, linkIndex: number, field: keyof FooterLink, value: string) => void;
  onRemove: (sectionIndex: number, linkIndex: number) => void;
}

function SortableLink({ link, index, sectionIndex, onUpdate, onRemove }: SortableLinkProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: `${sectionIndex}-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isExternal = link.url.startsWith('http') || link.url.startsWith('https');
  const isInternal = link.url.startsWith('/');
  const isEmpty = !link.url.trim();

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card className="hover:shadow-sm transition-shadow border-l-4 border-l-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div {...listeners} className="cursor-grab hover:cursor-grabbing">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
            
            <div className="flex-shrink-0">
              {isEmpty ? (
                <div className="h-4 w-4 rounded bg-muted" />
              ) : isExternal ? (
                <ExternalLink className="h-4 w-4 text-accent" />
              ) : isInternal ? (
                <FileText className="h-4 w-4 text-primary" />
              ) : (
                <div className="h-4 w-4 rounded bg-orange-400" />
              )}
            </div>

            <div className="flex-1 grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">Link Text</Label>
                <Input
                  placeholder="Enter link text"
                  value={link.text}
                  onChange={(e) => onUpdate(sectionIndex, index, 'text', e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">
                  URL {isEmpty ? <span className="text-muted-foreground">(Enter URL)</span> : 
                      isExternal ? <span className="text-accent">(External - Opens in New Tab)</span> :
                      isInternal ? <span className="text-primary">(Internal Page - Opens in New Tab)</span> :
                      <span className="text-orange-500">(Invalid URL)</span>}
                </Label>
                <Input
                  placeholder="Paste URL here (e.g., /about or https://example.com)"
                  value={link.url}
                  onChange={(e) => onUpdate(sectionIndex, index, 'url', e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(sectionIndex, index)}
              className="text-destructive hover:text-destructive h-8 w-8 p-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface DraggableFooterSectionProps {
  section: FooterSection;
  sectionIndex: number;
  onUpdateSection: (index: number, field: keyof FooterSection, value: any) => void;
  onRemoveSection: (index: number) => void;
  onAddLink: (sectionIndex: number) => void;
  onUpdateLink: (sectionIndex: number, linkIndex: number, field: keyof FooterLink, value: string) => void;
  onRemoveLink: (sectionIndex: number, linkIndex: number) => void;
  onReorderLinks: (sectionIndex: number, oldIndex: number, newIndex: number) => void;
}

export const DraggableFooterSection: React.FC<DraggableFooterSectionProps> = ({
  section,
  sectionIndex,
  onUpdateSection,
  onRemoveSection,
  onAddLink,
  onUpdateLink,
  onRemoveLink,
  onReorderLinks,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const activeIndex = parseInt(active.id.split('-')[1]);
      const overIndex = parseInt(over.id.split('-')[1]);
      
      onReorderLinks(sectionIndex, activeIndex, overIndex);
    }
  };

  return (
    <Card className="bg-gradient-card border-2 border-border/50 hover:border-border transition-colors">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <Label className="text-sm font-medium text-muted-foreground">Section Title</Label>
            <Input
              placeholder="e.g., Company, Products, Resources"
              value={section.title}
              onChange={(e) => onUpdateSection(sectionIndex, 'title', e.target.value)}
              className="font-semibold text-lg h-10 mt-1"
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemoveSection(sectionIndex)}
            className="text-destructive hover:text-destructive ml-4"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={section.links.map((_, i) => `${sectionIndex}-${i}`)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {section.links.map((link, linkIndex) => (
                <SortableLink
                  key={`${sectionIndex}-${linkIndex}`}
                  link={link}
                  index={linkIndex}
                  sectionIndex={sectionIndex}
                  onUpdate={onUpdateLink}
                  onRemove={onRemoveLink}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onAddLink(sectionIndex)}
          className="w-full border-dashed hover:border-primary hover:text-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Link to {section.title || 'Section'}
        </Button>

        {section.links.length === 0 && (
          <div className="text-center py-4 text-sm text-muted-foreground bg-muted/20 rounded-lg border-2 border-dashed border-border">
            No links in this section yet. Click "Add Link" to get started.
          </div>
        )}
      </CardContent>
    </Card>
  );
};