'use client'

import { useRef } from 'react'
import { XMarkIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui'

interface ProfilePictureModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  name: string
  picture?: string
  onChangePicture: (file: File, preview: string) => void
  onDeletePicture: () => void
  showDeleteButton?: boolean
}

export function ProfilePictureModal({
  isOpen,
  onClose,
  title,
  name,
  picture,
  onChangePicture,
  onDeletePicture,
  showDeleteButton = true,
}: ProfilePictureModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    if (file.size > 20 * 1024 * 1024) {
      alert('Image must be less than 20MB')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      onChangePicture(file, result)
    }
    reader.readAsDataURL(file)
  }

  const handleDelete = () => {
    onDeletePicture()
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Large Picture Preview */}
          <div className="flex justify-center">
            {picture && picture.trim() !== '' ? (
              <img
                src={picture}
                alt={name}
                className="w-64 h-64 rounded-2xl object-cover border-4 border-gray-100 shadow-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  const fallback = target.nextElementSibling as HTMLElement
                  if (fallback) fallback.style.display = 'flex'
                }}
              />
            ) : null}
            {(!picture || picture.trim() === '') && (
              <div className="w-64 h-64 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-8xl shadow-lg border-4 border-gray-100">
                {name.charAt(0)}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <PencilIcon className="w-5 h-5 mr-2" />
              Change Picture
            </Button>
            {showDeleteButton && picture && (
              <Button
                variant="outline"
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700 hover:border-red-300"
              >
                <TrashIcon className="w-5 h-5 mr-2" />
                Delete Picture
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
