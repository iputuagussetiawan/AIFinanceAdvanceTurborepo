import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'

export function SortableItem({ id, children }: any) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id,
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 0,
    }

    return (
        <li ref={setNodeRef} style={style} className="flex items-center gap-3 rounded border p-3">
            <div {...attributes} {...listeners} className="cursor-grab">
                <GripVertical />
            </div>
            {children}
        </li>
    )
}
