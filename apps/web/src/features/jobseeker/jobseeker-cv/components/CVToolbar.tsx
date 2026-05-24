import { useState } from 'react'
import {
    Briefcase,
    FileDown,
    GraduationCap,
    Info,
    Languages,
    Loader2,
    Monitor,
    Settings,
    User,
    Wrench,
} from 'lucide-react'

import ExperienceForm from '@/features/jobseeker/jobseeker-experience/components/ExperienceForm'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { RESUME_MODE, type ResumeMode } from '@/lib/constants'

import { CVDrawer } from './drawer/CVDrawer'
import BioForm from './forms/BioForm'
import PersonalInfoForm from './forms/PersonalInfoForm'
import PhotoProfileForm from './forms/PhotoProfileForm'
import UserSkillForm from '@/features/jobseeker/jobseeker-skill/components/UserSkillForm'
import UserLanguageForm from '@/features/jobseeker/jobseeker-language/components/UserLanguageForm'
import EducationForm from '@/features/jobseeker/jobseeker-education/components/forms/EducationForm'

type CVToolbarProps = {
    onPreview: () => void
    onDownload: () => void
    onSave?: () => void
    isSaving?: boolean
    isPreviewing: boolean
    isLoading: boolean
    currentMode: ResumeMode
}

export default function CVToolbar({
    onPreview,
    onDownload,
    onSave,
    isSaving,
    isPreviewing,
    isLoading,
    currentMode,
}: CVToolbarProps) {
    const isManageMode = currentMode === RESUME_MODE.MANAGE
    const [isOpenPersonalDrawer, setIsOpenPersonalDrawer] = useState(false)
    const [isOpenAboutDrawer, SetIsOpenAboutDrawer] = useState(false)
    const [isOpenEducationDrawer, setIsOpenEducationDrawer] = useState(false)
    const [isOpenExperienceDrawer, setIsOpenExperienceDrawer] = useState(false)
    const [isOpenSkillsDrawer, setIsOpenSkillsDrawer] = useState(false)
    const [isOpenLanguagesDrawer, setIsOpenLanguagesDrawer] = useState(false)

    return (
        <>
            <div className="sticky bottom-4 z-60 mb-8 flex w-fit items-center gap-1 rounded-2xl bg-[#222222] p-2 text-white shadow-2xl">
                {/* Logo Section */}
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1a1a1a] text-xl font-bold">
                    AG<span className="mb-2 self-end text-sm">.</span>
                </div>

                {/* Navigation Group */}
                <ToggleGroup
                    type="single"
                    defaultValue="creator"
                    className="gap-1 rounded-xl bg-[#2a2a2a] px-1 py-1"
                >
                    <ToggleGroupItem
                        value="creator"
                        className="rounded-lg border border-transparent px-4 py-2 text-xs font-medium hover:bg-transparent data-[state=on]:border-amber-200/50 data-[state=on]:text-amber-200"
                    >
                        {currentMode}
                    </ToggleGroupItem>
                    <ToggleGroupItem
                        value="creator"
                        className="rounded-lg border border-transparent px-4 py-2 text-xs font-medium hover:bg-transparent data-[state=on]:border-amber-200/50 data-[state=on]:text-amber-200"
                    >
                        Total Page
                    </ToggleGroupItem>
                    <ToggleGroupItem
                        value="font"
                        className="rounded-lg border border-transparent px-4 py-2 text-xs font-medium text-gray-400 hover:text-white"
                    >
                        Page 1 of 2
                    </ToggleGroupItem>
                </ToggleGroup>

                {/* CTA Button */}
                <div className="flex gap-2">
                    {isManageMode ? (
                        /* SAVE BUTTON (Shown only in Manage Mode) */
                        <div className="flex gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button className="h-12 rounded-xl bg-blue-500 px-8 font-bold text-white transition-all hover:cursor-pointer hover:bg-blue-600">
                                        {isSaving ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Settings className="h-4 w-4" />
                                                Manage Now
                                            </>
                                        )}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" sideOffset={8}>
                                    {/* General Section */}
                                    <DropdownMenuGroup>
                                        <DropdownMenuLabel className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                                            General
                                        </DropdownMenuLabel>
                                        <DropdownMenuItem
                                            onSelect={() => {
                                                setIsOpenPersonalDrawer(true)
                                            }}
                                            className="hover:cursor-pointer"
                                        >
                                            <User className="mr-2 h-4 w-4" />
                                            <span>Personal Info</span>
                                            <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onSelect={() => {
                                                SetIsOpenAboutDrawer(true)
                                            }}
                                            className="hover:cursor-pointer"
                                        >
                                            <Info className="mr-2 h-4 w-4" />
                                            <span>About Me</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>

                                    <DropdownMenuSeparator />

                                    {/* EXP Section */}
                                    <DropdownMenuGroup>
                                        <DropdownMenuLabel className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                                            Experience & Education
                                        </DropdownMenuLabel>
                                        <DropdownMenuItem
                                            onSelect={() => {
                                                setIsOpenEducationDrawer(true)
                                            }}
                                            className="hover:cursor-pointer"
                                        >
                                            <GraduationCap className="mr-2 h-4 w-4" />
                                            <span>Educations</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onSelect={() => {
                                                setIsOpenExperienceDrawer(true)
                                            }}
                                            className="hover:cursor-pointer"
                                        >
                                            <Briefcase className="mr-2 h-4 w-4" />
                                            <span>Professional Experience</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onSelect={() => {
                                                setIsOpenSkillsDrawer(true)
                                            }}
                                            className="hover:cursor-pointer"
                                        >
                                            <Wrench className="mr-2 h-4 w-4" />
                                            <span>Core Skills</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>

                                    <DropdownMenuSeparator />

                                    {/* Additional Section */}
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem
                                            onSelect={() => {
                                                setIsOpenLanguagesDrawer(true)
                                            }}
                                            className="hover:cursor-pointer"
                                        >
                                            <Languages className="mr-2 h-4 w-4" />
                                            <span>Languages</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ) : (
                        /* PREVIEW & DOWNLOAD (Shown only in Preview Mode) */
                        <>
                            <Button
                                onClick={onPreview}
                                disabled={isPreviewing}
                                className="h-12 rounded-xl bg-[#3a3a3a] px-6 font-bold text-white hover:bg-[#4a4a4a]"
                            >
                                {isPreviewing ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <>
                                        <Monitor className="mr-2 h-4 w-4" />
                                        Preview
                                    </>
                                )}
                            </Button>

                            <Button
                                onClick={onDownload}
                                disabled={isLoading}
                                className="h-12 rounded-xl bg-[#FFF38A] px-6 font-bold text-black hover:bg-[#ffe945]"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <>
                                        <FileDown className="mr-2 h-4 w-4" />
                                        Download
                                    </>
                                )}
                            </Button>
                        </>
                    )}
                </div>
            </div>
            <CVDrawer
                direction="right"
                title="Personal Info"
                open={isOpenPersonalDrawer}
                onOpenChange={setIsOpenPersonalDrawer}
            >
                <PersonalInfoForm />
            </CVDrawer>
            <CVDrawer
                direction="right"
                title="About me"
                open={isOpenAboutDrawer}
                onOpenChange={SetIsOpenAboutDrawer}
            >
                <div className="grid gap-4">
                    <PhotoProfileForm />
                    <BioForm />
                </div>
            </CVDrawer>
            <CVDrawer
                className="sm:min-w-350"
                direction="right"
                title="Education"
                open={isOpenEducationDrawer}
                onOpenChange={setIsOpenEducationDrawer}
            >
                <div className="grid gap-4">
                    <EducationForm onSuccess={() => setIsOpenEducationDrawer(false)} />
                </div>
            </CVDrawer>

            <CVDrawer
                className="sm:min-w-350"
                direction="right"
                title="Experience"
                open={isOpenExperienceDrawer}
                onOpenChange={setIsOpenExperienceDrawer}
            >
                <div className="grid gap-4">
                    <ExperienceForm onSuccess={() => setIsOpenExperienceDrawer(false)} />
                </div>
            </CVDrawer>
            <CVDrawer
                className="sm:min-w-200"
                direction="right"
                title="Skills"
                open={isOpenSkillsDrawer}
                onOpenChange={setIsOpenSkillsDrawer}
            >
                <UserSkillForm onSuccess={() => setIsOpenSkillsDrawer(false)} />
            </CVDrawer>

            <CVDrawer
                className="sm:min-w-250"
                direction="right"
                title="Languages"
                open={isOpenLanguagesDrawer}
                onOpenChange={setIsOpenLanguagesDrawer}
            >
                <UserLanguageForm onSuccess={() => setIsOpenLanguagesDrawer(false)} />
            </CVDrawer>
        </>
    )
}
