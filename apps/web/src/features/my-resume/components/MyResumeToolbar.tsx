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

import { ResumeDrawer } from './drawer/ResumeDrawer'
import BioForm from './forms/BioForm'
import EducationForm from './forms/EducationForm'
import PersonalInfoForm from './forms/PersonalInfoForm'
import PhotoProfileForm from './forms/PhotoProfileForm'

type MyResumeToolbarProps = {
    onPreview: () => void
    onDownload: () => void
    onSave?: () => void
    isSaving?: boolean
    isPreviewing: boolean
    isLoading: boolean
    currentMode: ResumeMode
}

export default function MyResumeToolbar({
    onPreview,
    onDownload,
    onSave,
    isSaving,
    isPreviewing,
    isLoading,
    currentMode,
}: MyResumeToolbarProps) {
    const isManageMode = currentMode === RESUME_MODE.MANAGE
    const [isOpenPersonalDrawer, setIsOpenPersonalDrawer] = useState(false)
    const [isOpenAboutDrawer, SetIsOpenAboutDrawer] = useState(false)
    const [isOpenEducationDrawer, setIsOpenEducationDrawer] = useState(false)
    const [isOpenExperienceDrawer, setIsOpenExperienceDrawer] = useState(false)

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
                                        <DropdownMenuItem className="hover:cursor-pointer">
                                            <Wrench className="mr-2 h-4 w-4" />
                                            <span>Core Skills</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>

                                    <DropdownMenuSeparator />

                                    {/* Additional Section */}
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem className="hover:cursor-pointer">
                                            <Languages className="mr-2 h-4 w-4" />
                                            <span>Languages</span>
                                        </DropdownMenuItem>
                                        {/* <DropdownMenuItem className="hover:cursor-pointer text-blue-500 focus:text-blue-600">
                                            <PlusCircle className="mr-2 h-4 w-4" />
                                            <span>Add Custom Section</span>
                                        </DropdownMenuItem> */}
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
            <ResumeDrawer
                direction="right"
                title="Personal Info"
                open={isOpenPersonalDrawer}
                onOpenChange={setIsOpenPersonalDrawer}
            >
                <PersonalInfoForm />
            </ResumeDrawer>
            <ResumeDrawer
                direction="right"
                title="About me"
                open={isOpenAboutDrawer}
                onOpenChange={SetIsOpenAboutDrawer}
            >
                <div className="grid gap-4">
                    <PhotoProfileForm />
                    <BioForm />
                </div>
            </ResumeDrawer>
            <ResumeDrawer
                className="sm:min-w-[1400px]"
                direction="right"
                title="Education"
                open={isOpenEducationDrawer}
                onOpenChange={setIsOpenEducationDrawer}
            >
                <div className="grid gap-4">
                    <EducationForm />
                </div>
            </ResumeDrawer>

            <ResumeDrawer
                className="sm:min-w-[1400px]"
                direction="right"
                title="Experience"
                open={isOpenExperienceDrawer}
                onOpenChange={setIsOpenExperienceDrawer}
            >
                <div className="grid gap-4">
                    <h3>Experiences</h3>
                    {/* <EducationForm /> */}
                </div>
            </ResumeDrawer>
        </>
    )
}
