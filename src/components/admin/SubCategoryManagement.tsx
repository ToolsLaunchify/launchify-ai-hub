import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import { Plus, Edit, Trash2, MoveUp, MoveDown } from 'lucide-react'
import { useSubCategories, useCreateSubCategory, useUpdateSubCategory, useDeleteSubCategory, SubCategory } from '@/hooks/useSubCategories'

const SubCategoryManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSubCategory, setEditingSubCategory] = useState<SubCategory | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    sort_order: 0,
    icon: ''
  })

  const { toast } = useToast()
  
  const { data: subCategories = [], isLoading } = useSubCategories()
  const createSubCategoryMutation = useCreateSubCategory()
  const updateSubCategoryMutation = useUpdateSubCategory()
  const deleteSubCategoryMutation = useDeleteSubCategory()

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      sort_order: 0,
      icon: ''
    })
    setEditingSubCategory(null)
    setIsDialogOpen(false)
  }

  const openEditDialog = (subCategory: SubCategory) => {
    setEditingSubCategory(subCategory)
    setFormData({
      name: subCategory.name,
      slug: subCategory.slug,
      description: subCategory.description || '',
      sort_order: subCategory.sort_order,
      icon: subCategory.icon || ''
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingSubCategory) {
        await updateSubCategoryMutation.mutateAsync({ 
          id: editingSubCategory.id, 
          ...formData 
        })
        toast({ title: 'Sub-category updated successfully!' })
      } else {
        await createSubCategoryMutation.mutateAsync(formData)
        toast({ title: 'Sub-category created successfully!' })
      }
      resetForm()
    } catch (error: any) {
      toast({ 
        title: 'Error', 
        description: error.message, 
        variant: 'destructive' 
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this sub-category?')) {
      try {
        await deleteSubCategoryMutation.mutateAsync(id)
        toast({ title: 'Sub-category deleted successfully!' })
      } catch (error: any) {
        toast({ 
          title: 'Error deleting sub-category', 
          description: error.message, 
          variant: 'destructive' 
        })
      }
    }
  }

  const handleMoveUp = async (subCategory: SubCategory) => {
    const newSortOrder = Math.max(0, subCategory.sort_order - 1)
    try {
      await updateSubCategoryMutation.mutateAsync({
        id: subCategory.id,
        sort_order: newSortOrder
      })
    } catch (error: any) {
      toast({ 
        title: 'Error updating sort order', 
        description: error.message, 
        variant: 'destructive' 
      })
    }
  }

  const handleMoveDown = async (subCategory: SubCategory) => {
    const newSortOrder = subCategory.sort_order + 1
    try {
      await updateSubCategoryMutation.mutateAsync({
        id: subCategory.id,
        sort_order: newSortOrder
      })
    } catch (error: any) {
      toast({ 
        title: 'Error updating sort order', 
        description: error.message, 
        variant: 'destructive' 
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Sub-Categories Management</h2>
          <p className="text-muted-foreground">Manage tool sub-categories (Converter, Calculator, etc.)</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true) }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Sub-Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingSubCategory ? 'Edit Sub-Category' : 'Create New Sub-Category'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Calculator"
                  required
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="calculator"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Calculate various financial and mathematical values"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="sort_order">Sort Order</Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                  min="0"
                />
              </div>

              <div>
                <Label htmlFor="icon">Icon (Lucide icon name)</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="Calculator"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createSubCategoryMutation.isPending || updateSubCategoryMutation.isPending}
                >
                  {editingSubCategory ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sub-Categories ({subCategories.length})</CardTitle>
          <CardDescription>Tool type categories for better organization</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Loading sub-categories...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Sort Order</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subCategories.map((subCategory) => (
                  <TableRow key={subCategory.id}>
                    <TableCell className="font-medium">{subCategory.name}</TableCell>
                    <TableCell>
                      <code className="bg-muted px-2 py-1 rounded text-sm">
                        {subCategory.slug}
                      </code>
                    </TableCell>
                    <TableCell>{subCategory.description}</TableCell>
                    <TableCell>{subCategory.sort_order}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMoveUp(subCategory)}
                          disabled={updateSubCategoryMutation.isPending}
                        >
                          <MoveUp className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMoveDown(subCategory)}
                          disabled={updateSubCategoryMutation.isPending}
                        >
                          <MoveDown className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(subCategory)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(subCategory.id)}
                          disabled={deleteSubCategoryMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default SubCategoryManagement