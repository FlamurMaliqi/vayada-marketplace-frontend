'use client'

import { XMarkIcon, PhotoIcon, PlusIcon, ChevronLeftIcon, ChevronRightIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui'

interface ManagePhotosModalProps {
  isOpen: boolean
  onClose: () => void
  images: string[]
  onRemoveImage: (index: number) => void
  onMoveImage: (index: number, direction: 'left' | 'right') => void
  onAddImage: () => void
}

export function ManagePhotosModal({
  isOpen,
  onClose,
  images,
  onRemoveImage,
  onMoveImage,
  onAddImage,
}: ManagePhotosModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <PhotoIcon className="w-6 h-6 text-primary-600" />
            Manage Gallery
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, i) => {
              const isMain = i === 0
              return (
                <div key={i} className={`relative group aspect-square rounded-xl overflow-hidden shadow-sm border-2 transition-all ${isMain ? 'border-primary-500 ring-2 ring-primary-100' : 'border-gray-200 hover:border-primary-300'}`}>
                  <img
                    src={image}
                    alt={`Photo ${i + 1}`}
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                    <div className="flex justify-end">
                      <button
                        onClick={() => onRemoveImage(i)}
                        className="p-1.5 bg-red-500 text-white rounded-lg shadow-sm hover:bg-red-600 transition-colors"
                        title="Delete photo"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-center gap-2">
                      {i > 0 && (
                        <button
                          type="button"
                          className="p-2 bg-white text-gray-700 rounded-full shadow hover:bg-gray-100"
                          title="Move Backward"
                          onClick={(e) => {
                            e.stopPropagation()
                            onMoveImage(i, 'left')
                          }}
                        >
                          <ChevronLeftIcon className="w-5 h-5" />
                        </button>
                      )}

                      {i < images.length - 1 && (
                        <button
                          type="button"
                          className="p-2 bg-white text-gray-700 rounded-full shadow hover:bg-gray-100"
                          title="Move Forward"
                          onClick={(e) => {
                            e.stopPropagation()
                            onMoveImage(i, 'right')
                          }}
                        >
                          <ChevronRightIcon className="w-5 h-5" />
                        </button>
                      )}
                    </div>

                    <div className="flex justify-start">
                      {isMain && (
                        <span className="bg-primary-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          MAIN
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}

            {images.length < 10 && (
              <button
                onClick={onAddImage}
                className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-white flex items-center justify-center mb-2 transition-colors">
                  <PlusIcon className="w-6 h-6 text-gray-400 group-hover:text-primary-600" />
                </div>
                <span className="text-sm font-medium text-gray-600 group-hover:text-primary-700">Add Photo</span>
              </button>
            )}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-end bg-gray-50 rounded-b-2xl">
          <Button
            variant="primary"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  )
}
