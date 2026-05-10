import LanguageSelector from '@/features/language/components/LanguageSelector'
import SkillForm from '@/features/language/components/SkillForm'
import { getCurrentUser } from '@/features/user/actions/user'

import AutoSuggestLanguageInput from '../../../features/language/components/AutoSuggestLanguageInput'

export default async function DashboardPage() {
    return (
        <div>
            <h1>Dashbaord 11</h1>
            <h3>Debug User Output:</h3>
            <LanguageSelector />
            <AutoSuggestLanguageInput />
            <SkillForm />
        </div>
    )
}
