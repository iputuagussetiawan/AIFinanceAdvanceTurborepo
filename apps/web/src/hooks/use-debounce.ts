// hooks/use-debounce.ts
import { useEffect, useState } from 'react'

/**
 * Hook untuk menunda pembaruan nilai (debounce)
 * @param value - Nilai yang ingin di-debounce (misal: string pencarian)
 * @param delay - Waktu tunda dalam milidetik (default: 500ms)
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value)

    useEffect(() => {
        // Set timeout untuk memperbarui nilai setelah delay selesai
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        // Cleanup function: Akan membatalkan timeout jika nilai 'value' berubah
        // sebelum waktu tunda berakhir (user masih mengetik)
        return () => {
            clearTimeout(handler)
        }
    }, [value, delay])

    return debouncedValue
}
