import { create } from 'zustand'
import type { Popups } from '../utils/popups';


interface StoreState {
    activePopup: Popups | null
    setActivePopup: (args?: { popup: Popups; popupData?: unknown } | null) => void
    popupData: unknown | null
}

export const usePopups = create<StoreState>((set) => {
    return {
        activePopup: null,
        setActivePopup(data) {
            if (!data) {
                set({ activePopup: null, popupData: null })
                return
            }
            set({ activePopup: data.popup, popupData: data.popupData ?? null })
        },
        popupData: null,
    }
})
