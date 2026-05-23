import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function SortableEducationCard({ id, children, onRemove }: any) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id,
    })

    const style = {
        transform: CSS.Translate.toString(transform), // Use Translate for smoother input behavior
        transition,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                'relative transition-all',
                // Placeholder style when being dragged
                isDragging ? 'z-50 scale-[1.01] opacity-100' : 'z-0',
            )}
        >
            <div
                className={cn(
                    'group bg-card flex gap-4 rounded-xl border p-5 shadow-sm transition-colors',
                    // Change border to dashed and background to subtle primary when dragging
                    isDragging
                        ? 'bg-white-50/50 scale-[1.03] border-dashed border-blue-500 opacity-70 shadow-xl'
                        : 'border-border hover:border-blue-500',
                )}
            >
                {/* DRAG HANDLE */}
                <div
                    {...attributes}
                    {...listeners}
                    className={cn(
                        'text-muted-foreground hover:bg-accent hover:text-foreground mt-1 flex h-fit cursor-grab items-center justify-center rounded p-1 transition-colors active:cursor-grabbing',
                        isDragging && 'text-primary cursor-grabbing',
                    )}
                >
                    <GripVertical size={20} />
                </div>

                {/* CONTENT AREA */}
                <div className={cn('flex-1', isDragging && 'pointer-events-none')}>{children}</div>

                {/* DELETE BUTTON */}
                <div className="flex flex-col justify-start">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={onRemove}
                        className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive h-8 w-8 hover:cursor-pointer"
                    >
                        <Trash2 size={18} />
                    </Button>
                </div>
            </div>
        </div>
    )
}
