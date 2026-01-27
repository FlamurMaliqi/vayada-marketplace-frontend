'use client'

import { PlusIcon, PhotoIcon } from '@heroicons/react/24/outline'

interface ListingImageGalleryProps {
  images: string[]
  listingName: string
  onManagePhotos: () => void
  onAddImage: () => void
  listingImageInputRef: React.RefObject<HTMLInputElement>
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function ListingImageGallery({
  images,
  listingName,
  onManagePhotos,
  onAddImage,
  listingImageInputRef,
  onImageChange,
}: ListingImageGalleryProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        Property Photos <span className="text-red-500">*</span>
      </label>
      {images.length > 0 ? (
        <div className="space-y-2">
          <div className="relative group w-full h-48 rounded-xl overflow-hidden shadow-md">
            <img
              src={images[0]}
              alt={`${listingName || 'Listing'} - Main photo`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <button
                type="button"
                onClick={onManagePhotos}
                className="opacity-0 group-hover:opacity-100 transform scale-95 group-hover:scale-100 transition-all px-4 py-2 bg-white text-gray-900 rounded-lg shadow-lg font-semibold flex items-center gap-2"
              >
                <PhotoIcon className="w-5 h-5" />
                Manage Photos
              </button>
            </div>
          </div>

          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.slice(1).map((image, i) => {
                const imageIndex = i + 1
                return (
                  <div key={imageIndex} className="relative group aspect-square cursor-pointer" onClick={onManagePhotos}>
                    <img
                      src={image}
                      alt={`Photo ${imageIndex + 1}`}
                      className="w-full h-full object-cover rounded-lg border-2 border-gray-200 group-hover:border-primary-500 transition-colors"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg" />
                  </div>
                )
              })}

              {images.length < 10 && (
                <button
                  type="button"
                  onClick={onAddImage}
                  className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-primary-400 hover:bg-primary-50"
                >
                  <PlusIcon className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-medium">Add</span>
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:border-primary-400 hover:bg-primary-50 transition-all group cursor-pointer"
          onClick={onAddImage}
        >
          <div className="w-16 h-16 rounded-full bg-white border-2 border-gray-200 group-hover:border-primary-400 flex items-center justify-center mb-3">
            <PlusIcon className="w-8 h-8 text-gray-400 group-hover:text-primary-500" />
          </div>
          <p className="text-sm font-semibold text-gray-700 group-hover:text-primary-600 mb-1">Upload Property Photos</p>
          <p className="text-xs text-gray-500">JPG, PNG, WEBP - Max 5MB per image</p>
        </div>
      )}
      <input
        ref={listingImageInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={onImageChange}
        multiple
      />
    </div>
  )
}
