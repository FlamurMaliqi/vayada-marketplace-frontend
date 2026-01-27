import { useState, useRef } from 'react'
import { hotelService } from '@/services/api/hotels'
import { ApiErrorResponse } from '@/services/api/client'
import { transformListingToApi } from '@/components/profile/transforms'
import { createEmptyListingFormData } from '@/components/profile/types'
import { formatErrorForModal } from './useErrorModal'
import type { ProfileHotelListing, ProfileHotelProfile, DeleteConfirmModalState } from '@/components/profile/types'

export function useListingManagement(
  hotelProfile: ProfileHotelProfile | null,
  reloadProfile: () => Promise<void>,
  showError: (title: string, message: string | string[], details?: string) => void,
  collapsedListingCards: Set<string>,
  setCollapsedListingCards: React.Dispatch<React.SetStateAction<Set<string>>>,
) {
  const [editingListingId, setEditingListingId] = useState<string | null>(null)
  const [isAddingNewListing, setIsAddingNewListing] = useState(false)
  const [isSavingListing, setIsSavingListing] = useState(false)
  const [listingFormData, setListingFormData] = useState(createEmptyListingFormData())
  const [listingImagePreview, setListingImagePreview] = useState<string | null>(null)
  const [listingCountryInput, setListingCountryInput] = useState('')
  const [isManagePhotosOpen, setIsManagePhotosOpen] = useState(false)
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<DeleteConfirmModalState>({
    isOpen: false,
    listingId: null,
    listingName: '',
  })
  const listingImageInputRef = useRef<HTMLInputElement | null>(null)

  const openAddListingModal = () => {
    setListingFormData(createEmptyListingFormData())
    setEditingListingId(null)
    setListingImagePreview(null)
    setListingCountryInput('')
    setIsAddingNewListing(true)
  }

  const openEditListingModal = (listing: ProfileHotelListing) => {
    setListingFormData({
      name: listing.name,
      location: listing.location,
      description: listing.description,
      images: listing.images || [],
      accommodationType: listing.accommodationType || '',
      collaborationTypes: listing.collaborationTypes || [],
      availability: listing.availability || [],
      platforms: listing.platforms || [],
      freeStayMinNights: listing.freeStayMinNights,
      freeStayMaxNights: listing.freeStayMaxNights,
      paidMaxAmount: listing.paidMaxAmount,
      discountPercentage: listing.discountPercentage,
      lookingForPlatforms: listing.lookingForPlatforms || [],
      lookingForMinFollowers: listing.lookingForMinFollowers,
      targetGroupCountries: listing.targetGroupCountries || [],
      targetGroupAgeMin: listing.targetGroupAgeMin,
      targetGroupAgeMax: listing.targetGroupAgeMax,
      targetGroupAgeGroups: listing.targetGroupAgeGroups || [],
    })
    setEditingListingId(listing.id)
    setListingImagePreview(null)
    setListingCountryInput('')
    setIsAddingNewListing(false)
    const newCollapsed = new Set(collapsedListingCards)
    newCollapsed.delete(listing.id)
    setCollapsedListingCards(newCollapsed)
  }

  const handleSaveListing = async () => {
    if (!listingFormData.name || !listingFormData.location || !listingFormData.description) {
      showError('Validation Error', 'Please fill in all required fields: name, location, and description.')
      return
    }

    if (!listingFormData.collaborationTypes.length || !listingFormData.availability.length) {
      showError('Validation Error', 'Please add at least one collaboration offering with availability months.')
      return
    }

    if (!listingFormData.lookingForPlatforms.length) {
      showError('Validation Error', 'Please specify platforms for creator requirements.')
      return
    }

    setIsSavingListing(true)
    try {
      let imageUrls = listingFormData.images.filter((img) => !img.startsWith('data:'))
      const base64Images = listingFormData.images.filter((img) => img.startsWith('data:'))

      if (base64Images.length > 0) {
        try {
          const files: File[] = []
          for (const base64 of base64Images) {
            const response = await fetch(base64)
            const blob = await response.blob()
            const file = new File([blob], 'image.jpg', { type: blob.type })
            files.push(file)
          }

          const uploadResponse = await hotelService.uploadListingImages(files)
          const newImageUrls = uploadResponse.images.map((img) => img.url)
          imageUrls = [...imageUrls, ...newImageUrls]
        } catch (error: unknown) {
          const detail =
            error instanceof ApiErrorResponse
              ? error.data.detail
              : null
          const message =
            typeof detail === 'string'
              ? detail
              : Array.isArray(detail) && detail[0]?.msg
                ? detail[0].msg
                : 'Failed to upload images'
          showError('Failed to Upload Images', formatErrorForModal(detail || message))
          setIsSavingListing(false)
          return
        }
      }

      const apiListingData = transformListingToApi({
        ...listingFormData,
        images: imageUrls,
      })

      if (editingListingId) {
        await hotelService.updateListing(editingListingId, apiListingData)
      } else {
        await hotelService.createListing(apiListingData)
      }

      await reloadProfile()
      handleCancelListing()
      setIsSavingListing(false)
    } catch (error: unknown) {
      const detail =
        error instanceof ApiErrorResponse
          ? error.data.detail
          : null
      const logError = error instanceof Error ? error : new Error(String(error))
      console.error('Failed to save listing:', logError)

      if (detail) {
        showError('Failed to Save Listing', formatErrorForModal(detail))
      } else {
        showError('Failed to Save Listing', 'Failed to save listing. Please try again.')
      }
      setIsSavingListing(false)
    }
  }

  const handleCancelListing = () => {
    setEditingListingId(null)
    setIsAddingNewListing(false)
    setListingFormData(createEmptyListingFormData())
    setListingImagePreview(null)
    setListingCountryInput('')
    if (listingImageInputRef.current) {
      listingImageInputRef.current.value = ''
    }
  }

  const openDeleteConfirmModal = (listingId: string, listingName: string) => {
    if (!hotelProfile || hotelProfile.listings.length <= 1) {
      showError('Cannot Delete Listing', 'You must have at least one listing. Please add another listing before deleting this one.')
      return
    }
    setDeleteConfirmModal({
      isOpen: true,
      listingId,
      listingName,
    })
  }

  const handleDeleteListing = async () => {
    if (!deleteConfirmModal.listingId) return

    try {
      await hotelService.deleteListing(deleteConfirmModal.listingId)
      setDeleteConfirmModal({ isOpen: false, listingId: null, listingName: '' })
      await reloadProfile()
    } catch (error: unknown) {
      const detail =
        error instanceof ApiErrorResponse
          ? error.data.detail
          : null
      const message =
        typeof detail === 'string'
          ? detail
          : Array.isArray(detail) && detail[0]?.msg
            ? detail[0].msg
            : 'Failed to delete listing'
      showError('Failed to Delete Listing', formatErrorForModal(detail || message))
      setDeleteConfirmModal({ isOpen: false, listingId: null, listingName: '' })
    }
  }

  const addListingImage = () => {
    listingImageInputRef.current?.click()
  }

  const handleListingImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    const fileList = Array.from(files)

    for (const file of fileList) {
      if (!file.type.startsWith('image/')) {
        showError('Invalid File Type', 'Please select image files only')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        showError('File Too Large', `${file.name} is larger than 5MB`)
        return
      }
    }

    if (listingFormData.images.length + fileList.length > 10) {
      showError('Too Many Images', 'Maximum 10 images allowed per listing')
      return
    }

    try {
      const uploadResponse = await hotelService.uploadListingImages(fileList)
      const newImageUrls = uploadResponse.images.map((img) => img.url)

      setListingFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImageUrls],
      }))
    } catch (error: unknown) {
      const detail =
        error instanceof ApiErrorResponse
          ? error.data.detail
          : null
      const message =
        typeof detail === 'string'
          ? detail
          : Array.isArray(detail) && detail[0]?.msg
            ? detail[0].msg
            : 'Failed to upload images'
      showError('Failed to Upload Images', formatErrorForModal(detail || message))
    } finally {
      const listingInput = listingImageInputRef.current
      if (listingInput) {
        listingInput.value = ''
      }
    }
  }

  const moveListingImage = (index: number, direction: 'left' | 'right') => {
    const newImages = [...listingFormData.images]
    if (direction === 'left') {
      if (index === 0) return
      const temp = newImages[index]
      newImages[index] = newImages[index - 1]
      newImages[index - 1] = temp
    } else {
      if (index === newImages.length - 1) return
      const temp = newImages[index]
      newImages[index] = newImages[index + 1]
      newImages[index + 1] = temp
    }
    setListingFormData(prev => ({ ...prev, images: newImages }))
  }

  const removeListingImage = (index: number) => {
    setListingFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  return {
    editingListingId,
    isAddingNewListing,
    isSavingListing,
    listingFormData,
    setListingFormData,
    listingImagePreview,
    listingCountryInput,
    setListingCountryInput,
    isManagePhotosOpen,
    setIsManagePhotosOpen,
    deleteConfirmModal,
    setDeleteConfirmModal,
    listingImageInputRef,
    openAddListingModal,
    openEditListingModal,
    handleSaveListing,
    handleCancelListing,
    openDeleteConfirmModal,
    handleDeleteListing,
    addListingImage,
    handleListingImageChange,
    moveListingImage,
    removeListingImage,
  }
}
