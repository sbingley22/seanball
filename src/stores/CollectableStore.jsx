import { create } from 'zustand'
import { v4 as uuid } from 'uuid';

const useCollectableStore = create((set) => ({
    collectables: [
        {
            id: uuid(),
            pos: [-1.5, 1, 10],
        },
        {
            id: uuid(),
            pos: [0, 1, 56],
        },
        {
            id: uuid(),
            pos: [1.5, 1, 70],
        },
    ],
}))

export default useCollectableStore