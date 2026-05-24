import { redirect } from 'next/navigation'
import { DASHBOARD_URL } from '@/lib/constants'

export default function Home() {
    redirect(DASHBOARD_URL)
}
