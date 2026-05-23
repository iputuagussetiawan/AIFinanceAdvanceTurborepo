
import LanguageSelector from '@/features/master/language/components/LanguageSelector'
import SkillForm from '@/features/master/language/components/SkillForm'
import { getCurrentUser } from '@/features/user/actions/user'

export default async function DashboardPage() {
    return (
        <div>
            <h1>Dashbaord 11</h1>
            <h3>Debug User Output:</h3>
            <LanguageSelector />
            <SkillForm />
        </div>
    )
}
