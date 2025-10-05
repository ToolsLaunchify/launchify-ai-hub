import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Trash2, Edit, X, Undo2 } from 'lucide-react';

interface BulkActionsToolbarProps {
  selectedCount: number;
  onBulkDelete: () => void;
  onBulkEdit: (field: string, value: any) => void;
  onClearSelection: () => void;
  categories: Array<{ id: string; name: string }>;
  isTrashView?: boolean;
  onBulkRestore?: () => void;
}

export const BulkActionsToolbar: React.FC<BulkActionsToolbarProps> = ({
  selectedCount,
  onBulkDelete,
  onBulkEdit,
  onClearSelection,
  categories,
  isTrashView = false,
  onBulkRestore,
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editField, setEditField] = useState<string>('');
  const [editValue, setEditValue] = useState<any>('');

  const handleBulkEdit = (field: string) => {
    setEditField(field);
    setEditValue('');
    setShowEditDialog(true);
  };

  const applyBulkEdit = () => {
    if (editValue !== '') {
      onBulkEdit(editField, editValue);
      setShowEditDialog(false);
    }
  };

  if (selectedCount === 0) return null;

  return (
    <>
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-background border border-border rounded-lg shadow-lg p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {selectedCount} selected
            </Badge>
            <Button
              size="sm"
              variant="ghost"
              onClick={onClearSelection}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="h-6 w-px bg-border" />

          <div className="flex items-center gap-2">
            {isTrashView ? (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onBulkRestore}
                >
                  <Undo2 className="mr-2 h-4 w-4" />
                  Restore Selected
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Forever
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkEdit('category')}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Change Category
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkEdit('product_type')}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Change Type
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkEdit('revenue_type')}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Change Revenue
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Move to Trash
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isTrashView ? `Permanently delete ${selectedCount} products?` : `Move ${selectedCount} products to trash?`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isTrashView 
                ? "⚠️ WARNING: This action CANNOT be undone! This will permanently delete the selected products from the database."
                : "You can restore these products later from the Trash section."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onBulkDelete();
                setShowDeleteDialog(false);
              }}
              className={isTrashView ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}
            >
              {isTrashView ? 'Delete Forever' : 'Move to Trash'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Edit: {editField.replace('_', ' ').toUpperCase()}</DialogTitle>
            <DialogDescription>
              Update {editField.replace('_', ' ')} for {selectedCount} selected products
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {editField === 'category' && (
              <div>
                <Label>Select Category</Label>
                <Select value={editValue} onValueChange={setEditValue}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {editField === 'product_type' && (
              <div>
                <Label>Select Product Type</Label>
                <Select value={editValue} onValueChange={setEditValue}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ai_tools">AI Tools</SelectItem>
                    <SelectItem value="software">Software</SelectItem>
                    <SelectItem value="free_tools">Free Tools</SelectItem>
                    <SelectItem value="paid_tools">Paid Tools</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {editField === 'revenue_type' && (
              <div>
                <Label>Select Revenue Type</Label>
                <Select value={editValue} onValueChange={setEditValue}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose revenue type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="affiliate">Affiliate Commission</SelectItem>
                    <SelectItem value="payment">Direct Payment</SelectItem>
                    <SelectItem value="free">Free Product</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={applyBulkEdit} disabled={!editValue}>
              Apply to {selectedCount} Products
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
