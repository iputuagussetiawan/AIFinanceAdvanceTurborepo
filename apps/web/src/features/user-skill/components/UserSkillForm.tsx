'use client'

import React from 'react'
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2, Plus, Save, Trash2 } from 'lucide-react'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import SkillAutoSuggest from '@/features/skill/components/SkillAutoSuggest'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { UiFormInput } from '@/components/ui/UiFormInput'
import useAuth from '@/hooks/use-auth'
import {
    userSkillsArrayValidation,
    type IBulkUserSkills,
    type IUserSkill,
} from '../types/userskill-type'
import { SortableUserSkillCard } from './SortableUserSkillCard'
import { userSkillService } from '../services/userskill-service'

export default function UserSkillForm() {
    const queryClient = useQueryClient()
    const { data: authData, isLoading: authLoading } = useAuth()

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    )

    const methods = useForm<IBulkUserSkills>({
        resolver: zodResolver(userSkillsArrayValidation as any),
        defaultValues: { skills: [] },
    })

    const { control, handleSubmit, register, setValue, reset, formState: { isSubmitting } } = methods
    const { fields, prepend, remove, move } = useFieldArray({
        control,
        name: 'skills',
    })

    // Sync data dari Auth ke Form
    React.useEffect(() => {
        if (authData?.user?.skills) {
            const formatted = [...authData.user.skills]
                .sort((a, b) => (a.orderPosition ?? 0) - (b.orderPosition ?? 0))
                .map((s) => ({
                    skill: s.skill?.id || s.skill.id, // Ambil ID-nya saja untuk form
                    percentage: s.percentage,
                    level: s.level,
                    orderPosition: s.orderPosition,
                }))
            reset({ skills: formatted })
        }
    }, [authData, reset])

    const { mutate, isPending } = useMutation({
        mutationFn: (data: IBulkUserSkills) => userSkillService.updateAll(data),
        onSuccess: () => {
            toast.success('Skills updated successfully')
            queryClient.invalidateQueries({ queryKey: ['authUser'] })
        },
    })

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (over && active.id !== over.id) {
            const oldIndex = fields.findIndex((f) => f.id === active.id)
            const newIndex = fields.findIndex((f) => f.id === over.id)
            move(oldIndex, newIndex)
        }
    }

    const onSubmit = (data: IBulkUserSkills) => {
        // Update orderPosition berdasarkan urutan saat ini sebelum kirim ke API
        const payload = {
            skills: data.skills.map((s, index) => ({ ...s, orderPosition: index }))
        }
        mutate(payload)
    }

    if (authLoading) return <div className="p-10 text-center"><Loader2 className="animate-spin inline" /></div>

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="bg-background sticky top-0 z-20 flex items-center justify-between border-b pb-4">
                    <div>
                        <h2 className="text-2xl font-bold">Skills & Expertise</h2>
                        <p className="text-muted-foreground text-sm">Drag to reorder your skills</p>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => prepend({ skill: '', percentage: 0, level: 'Beginner', orderPosition: 0 })}
                    >
                        <Plus className="mr-2 h-4 w-4" /> Add Skill
                    </Button>
                </div>

                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-4">
                            {fields.map((field, index) => (
                                <SortableUserSkillCard key={field.id} id={field.id} index={index} onRemove={() => remove(index)}>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-12 items-end">
                                        
                                        {/* Skill Selection */}
                                        <div className="md:col-span-5">
                                            <SkillAutoSuggest 
                                                isMultiple={false}
                                                name={`skills.${index}.skill`} 
                                                label="Select Skill"
                                            />
                                        </div>

                                        {/* Level Selection */}
                                        <div className="md:col-span-3">
                                            <label className="text-xs font-medium mb-1.5 block">Level</label>
                                            <Select 
                                                defaultValue={field.level}
                                                onValueChange={(val) => setValue(`skills.${index}.level`, val as any)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Level" />
                                                </SelectTrigger>
                                                <SelectContent className='z-99999'>
                                                    {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map(l => (
                                                        <SelectItem key={l} value={l}>{l}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Percentage Input */}
                                        <div className="md:col-span-3">
                                            <UiFormInput
                                                label="Mastery (%)"
                                                type="number"
                                                {...register(`skills.${index}.percentage`)}
                                                placeholder="0-100"
                                            />
                                        </div>
                                    </div>
                                </SortableUserSkillCard>
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>

                <div className="bg-background sticky bottom-0 z-20 mt-auto flex justify-end border-t py-4">
                    <Button type="submit" disabled={isPending} className="w-full md:w-auto">
                        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Save Skills
                    </Button>
                </div>
            </form>
        </FormProvider>
    )
}