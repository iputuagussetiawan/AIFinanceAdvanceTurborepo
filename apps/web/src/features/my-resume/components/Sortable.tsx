'use client'

import React, { useEffect, useState } from 'react'
import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useQuery } from '@tanstack/react-query'
import { Loader2, Plus } from 'lucide-react'

import { educationService } from '@/features/education/services/education-service'
import type { IEducation } from '@/features/education/types/education-type'
import { Button } from '@/components/ui/button'

import { SortableItem } from './SortableItem'

export default function SortableList() {
    const { data: response, isLoading } = useQuery({
        queryKey: ['education-list'],
        queryFn: educationService.get,
    })

    const [list, setList] = useState<IEducation[]>([])

    // Setup sensors for better UX
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    )

    useEffect(() => {
        if (response?.data) {
            const sortedData = [...response.data].sort(
                (a, b) => (a.orderPosition ?? 0) - (b.orderPosition ?? 0),
            )
            setList(sortedData)
        }
    }, [response])

    const handleDragEnd = (event: any) => {
        const { active, over } = event

        if (over && active.id !== over.id) {
            setList((items) => {
                const oldIndex = items.findIndex((item) => item._id === active.id)
                const newIndex = items.findIndex((item) => item._id === over.id)

                const newList = arrayMove(items, oldIndex, newIndex)

                // Update orderPosition for backend
                return newList.map((item, index) => ({
                    ...item,
                    orderPosition: index,
                }))
            })
        }
    }

    if (isLoading)
        return (
            <div className="p-10 text-center">
                <Loader2 className="inline animate-spin" />
            </div>
        )

    return (
        <div className="mx-auto mt-10 max-w-md space-y-4">
            <h2 className="text-xl font-bold">Education History</h2>

            {/* Use DndContext (Core) */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                {/* Use SortableContext (Sortable package) */}
                <SortableContext
                    items={list.map((edu) => edu._id)}
                    strategy={verticalListSortingStrategy}
                >
                    <ul className="list-none space-y-2 p-0">
                        {list.map((edu, index) => (
                            <SortableItem key={edu._id} id={edu._id} index={index}>
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold">{edu.degree}</span>
                                    <span className="text-muted-foreground text-xs">
                                        {edu.schoolName}
                                    </span>
                                    <span>{index}</span>
                                </div>
                            </SortableItem>
                        ))}
                    </ul>
                </SortableContext>
            </DndContext>
        </div>
    )
}
