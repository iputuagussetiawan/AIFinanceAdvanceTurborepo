import { Editor } from '@tiptap/react'
import { Bold, Italic, List, ListOrdered, Type } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

export const Toolbar = ({ editor }: { editor: Editor }) => {
    if (!editor) return null

    const handleHeadingChange = (value: string) => {
        if (value === 'paragraph') {
            editor.chain().focus().setParagraph().run()
        } else {
            const level = parseInt(value) as 1 | 2 | 3 | 4 | 5 | 6
            editor.chain().focus().toggleHeading({ level }).run()
        }
    }

    // Menentukan nilai dropdown saat ini
    const getCurrentValue = () => {
        if (editor.isActive('heading', { level: 1 })) return '1'
        if (editor.isActive('heading', { level: 2 })) return '2'
        if (editor.isActive('heading', { level: 3 })) return '3'
        if (editor.isActive('heading', { level: 4 })) return '4'
        if (editor.isActive('heading', { level: 5 })) return '5'
        if (editor.isActive('heading', { level: 6 })) return '6'
        return 'paragraph'
    }

    return (
        <div className="flex items-center gap-1 border-b p-1">
            {/* Dropdown Heading */}
            <Select value={getCurrentValue()} onValueChange={handleHeadingChange}>
                <SelectTrigger className="h-8 w-[130px] border-none bg-transparent focus:ring-0">
                    <SelectValue placeholder="Style" />
                </SelectTrigger>
                <SelectContent className="z-99999">
                    <SelectItem value="paragraph">Paragraph</SelectItem>
                    <SelectItem value="1" className="text-xl font-bold">
                        Heading 1
                    </SelectItem>
                    <SelectItem value="2" className="text-lg font-bold">
                        Heading 2
                    </SelectItem>
                    <SelectItem value="3" className="text-base font-bold">
                        Heading 3
                    </SelectItem>
                    <SelectItem value="4" className="text-sm font-bold">
                        Heading 4
                    </SelectItem>
                    <SelectItem value="5" className="text-xs font-bold">
                        Heading 5
                    </SelectItem>
                    <SelectItem value="6" className="text-[10px] font-bold">
                        Heading 6
                    </SelectItem>
                </SelectContent>
            </Select>

            <Separator orientation="vertical" className="mx-1 h-6" />

            {/* Formatting Buttons */}
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive('bold') ? 'bg-muted' : ''}
            >
                <Bold className="h-4 w-4" />
            </Button>

            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive('italic') ? 'bg-muted' : ''}
            >
                <Italic className="h-4 w-4" />
            </Button>

            <Separator orientation="vertical" className="mx-1 h-6" />

            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editor.isActive('bulletList') ? 'bg-muted' : ''}
            >
                <List className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={editor.isActive('orderedList') ? 'bg-muted' : ''}
            >
                <ListOrdered className="h-4 w-4" />
            </Button>
        </div>
    )
}
