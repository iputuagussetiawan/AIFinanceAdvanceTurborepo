'use client'

import React, { useState } from 'react'

import { AutoSuggest } from '@/components/ui/UiAutoSuggest'

const AutoSuggestLanguageInput = () => {
    const USERS = [
        { id: 1, name: 'Joko', role: 'Frontend', image: 'https://i.pravatar.cc/150?u=1' },
        { id: 2, name: 'Siti', role: 'Designer', image: 'https://i.pravatar.cc/150?u=2' },
    ]
    const [val, setVal] = useState('')
    return (
        <div className="max-w-sm p-10">
            <AutoSuggest
                items={USERS}
                value={val}
                onValueChange={setVal}
                placeholder="Cari mentor..."
                // Kolom mana yang mau dicari?
                getSearchValue={(user) => user.name}
                // Bagaimana cara merender itemnya?
                renderItem={(user) => (
                    <div className="flex items-center gap-3">
                        <img
                            src={user.image}
                            className="h-8 w-8 rounded-full border"
                            alt={user.name}
                        />
                        <div className="flex flex-col">
                            <span className="text-sm font-medium">{user.name}</span>
                            <span className="text-muted-foreground text-[10px]">{user.role}</span>
                        </div>
                    </div>
                )}
                onSelect={(user) => {
                    setVal(user.name)
                    console.log('Selected user data:', user)
                }}
            />
        </div>
    )
}

export default AutoSuggestLanguageInput
