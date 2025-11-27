import { create } from 'zustand'

type State = {
  setName: (name: string) => void
  name?: string
}

const useStore = create<State>((set) => ({
  setName: (name: string) => set({ name }),
}))

export default useStore
