'use client'

import { useRouter } from 'next/navigation'
import { PencilIcon, PlusIcon } from '@heroicons/react/24/solid'
import { BuildingOffice2Icon, InformationCircleIcon } from '@heroicons/react/24/outline'
import { Button, ErrorModal } from '@/components/ui'
import { ROUTES } from '@/lib/constants/routes'
import { ProfilePictureModal } from '../ProfilePictureModal'
import { DeleteConfirmModal } from '../DeleteConfirmModal'
import { HotelOverviewTab } from './HotelOverviewTab'
import { ListingViewCard } from './ListingViewCard'
import { ListingEditorForm } from './ListingEditorForm'
import { ManagePhotosModal } from './ManagePhotosModal'
import { useHotelProfile } from '@/hooks/useHotelProfile'
import { useListingManagement } from '@/hooks/useListingManagement'
import { useErrorModal } from '@/hooks/useErrorModal'
import type { HotelProfileStatus } from '@/lib/types'

export function HotelProfile() {
  const router = useRouter()
  const { errorModal, showError, closeError } = useErrorModal()

  const hotel = useHotelProfile(showError)
  const listing = useListingManagement(
    hotel.hotelProfile,
    hotel.loadProfile,
    showError,
    hotel.collapsedListingCards,
    hotel.setCollapsedListingCards,
  )

  const {
    hotelProfile,
    setHotelProfile,
    loading,
    profileStatus,
    isProfileIncomplete,
    activeHotelTab,
    setActiveHotelTab,
    phone,
    setPhone,
    isEditingHotelProfile,
    setIsEditingHotelProfile,
    isSavingHotelProfile,
    showHotelPictureModal,
    setShowHotelPictureModal,
    hotelPicturePreview,
    setHotelPicturePreview,
    hotelProfilePictureFile,
    setHotelProfilePictureFile,
    hotelEditFormData,
    setHotelEditFormData,
    collapsedListingCards,
    setCollapsedListingCards,
    handleSaveHotelProfile,
    handleCancelHotelEdit,
  } = hotel

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-100"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-600 absolute top-0 left-0"></div>
        </div>
      </div>
    )
  }

  if (isProfileIncomplete) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-50 flex items-center justify-center">
            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Complete Your Profile
          </h3>
          <p className="text-gray-600 mb-6">
            {(profileStatus as HotelProfileStatus)?.missing_fields
              ? `Please complete the following: ${(profileStatus as HotelProfileStatus).missing_fields.join(', ')}`
              : 'Your profile setup is not complete. Please finish the onboarding process.'}
          </p>
          <Button
            variant="primary"
            onClick={() => router.push(ROUTES.PROFILE_COMPLETE)}
          >
            Complete Profile
          </Button>
        </div>
      </div>
    )
  }

  if (!hotelProfile) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-50 flex items-center justify-center">
            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Profile Data Unavailable
          </h3>
          <p className="text-gray-600 mb-6">
            Your profile status is being checked, but profile data endpoints are currently unavailable.
          </p>
          <Button
            variant="primary"
            onClick={() => router.push(ROUTES.PROFILE_COMPLETE)}
          >
            Go to Profile Completion
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Tab Navigation with Edit Button */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveHotelTab('overview')}
            className={`px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 ${activeHotelTab === 'overview'
              ? 'bg-primary-600 text-white'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveHotelTab('listings')}
            className={`px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 ${activeHotelTab === 'listings'
              ? 'bg-primary-600 text-white'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
          >
            Listings
          </button>
        </div>
        {activeHotelTab === 'overview' && (
          <>
            {!isEditingHotelProfile ? (
              <Button
                className="p-2.5 rounded-lg bg-white text-primary-600 border border-primary-600 hover:bg-primary-50 transition-all duration-200 flex items-center justify-center"
                onClick={() => setIsEditingHotelProfile(true)}
                title="Edit Profile"
              >
                <PencilIcon className="w-5 h-5" />
              </Button>
            ) : (
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleCancelHotelEdit}
                  disabled={isSavingHotelProfile}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSaveHotelProfile}
                  isLoading={isSavingHotelProfile}
                  disabled={!hotelEditFormData.name || !hotelEditFormData.location}
                >
                  Save Changes
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        {activeHotelTab === 'overview' && (
          <HotelOverviewTab
            profile={hotelProfile}
            isEditing={isEditingHotelProfile}
            editFormData={{
              name: hotelEditFormData.name,
              picture: hotelEditFormData.picture,
              location: hotelEditFormData.location,
              website: hotelEditFormData.website,
              about: hotelEditFormData.about,
            }}
            phone={phone}
            onEditFormChange={(data) => setHotelEditFormData(prev => ({ ...prev, ...data }))}
            onPhoneChange={setPhone}
          />
        )}
        {activeHotelTab === 'listings' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            {/* Section Header */}
            <div className="mb-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-6 h-6 text-primary-600"
                  >
                    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path>
                    <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path>
                    <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path>
                    <path d="M10 6h4"></path>
                    <path d="M10 10h4"></path>
                    <path d="M10 14h4"></path>
                    <path d="M10 18h4"></path>
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="text-2xl font-bold text-gray-900">Property Listings</h2>
                    {hotelProfile.listings && hotelProfile.listings.length > 0 && (
                      <span className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full text-xs font-semibold">
                        {hotelProfile.listings.length} listing{hotelProfile.listings.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">Add and manage your property listings</p>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-sm text-gray-600">Define your property offerings and the type of creators you&apos;re looking for.</p>
              </div>
            </div>

            {hotelProfile.listings && hotelProfile.listings.length > 0 ? (
              <div className={`mt-6 space-y-3 ${listing.isAddingNewListing ? '' : 'mt-6'}`}>
                {hotelProfile.listings.map((listingItem, index) => {
                  const isCollapsed = collapsedListingCards.has(listingItem.id)
                  const isEditingThis = listing.editingListingId === listingItem.id

                  if (!isCollapsed && isEditingThis) {
                    return (
                      <div key={listingItem.id} className="border border-gray-200 rounded-2xl p-5 bg-white shadow-sm">
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <ListingEditorForm
                            formData={listing.listingFormData}
                            onChange={(data) => listing.setListingFormData(data)}
                            onSave={listing.handleSaveListing}
                            onCancel={listing.handleCancelListing}
                            isSaving={listing.isSavingListing}
                            isEditing={true}
                            listingImageInputRef={listing.listingImageInputRef}
                            onManagePhotos={() => listing.setIsManagePhotosOpen(true)}
                            onAddImage={() => listing.listingImageInputRef.current?.click()}
                            onImageChange={listing.handleListingImageChange}
                            countryInput={listing.listingCountryInput}
                            onCountryInputChange={(v) => listing.setListingCountryInput(v)}
                          />
                        </div>
                      </div>
                    )
                  }

                  return (
                    <ListingViewCard
                      key={listingItem.id}
                      listing={listingItem}
                      index={index}
                      isCollapsed={isCollapsed}
                      onToggleCollapse={() => {
                        const newCollapsed = new Set(collapsedListingCards)
                        if (isCollapsed) {
                          newCollapsed.delete(listingItem.id)
                        } else {
                          newCollapsed.add(listingItem.id)
                        }
                        setCollapsedListingCards(newCollapsed)
                      }}
                      onEdit={() => listing.openEditListingModal(listingItem)}
                      onDelete={() => listing.openDeleteConfirmModal(listingItem.id, listingItem.name || `Property Listing ${index + 1}`)}
                      canDelete={hotelProfile.listings.length > 1}
                    />
                  )
                })}
              </div>
            ) : (
              <div className="mt-6 text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 rounded-xl bg-gray-100 flex items-center justify-center">
                  <BuildingOffice2Icon className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-lg font-semibold text-gray-900 mb-2">No listings added yet</p>
                <p className="text-sm text-gray-600 mb-6">Add property listings to complete your profile.</p>
                <Button
                  variant="outline"
                  onClick={listing.openAddListingModal}
                  className="border-2 border-dashed border-gray-300 hover:border-primary-400 hover:bg-primary-50"
                >
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Add Property Listing
                </Button>
              </div>
            )}

            {/* New Listing Card */}
            {listing.isAddingNewListing && (
              <div className="mt-6 border border-gray-200 rounded-2xl p-5 bg-white shadow-sm">
                <ListingEditorForm
                  formData={listing.listingFormData}
                  onChange={(data) => listing.setListingFormData(data)}
                  onSave={listing.handleSaveListing}
                  onCancel={listing.handleCancelListing}
                  isSaving={listing.isSavingListing}
                  isEditing={false}
                  listingIndex={hotelProfile.listings ? hotelProfile.listings.length + 1 : 1}
                  listingImageInputRef={listing.listingImageInputRef}
                  onManagePhotos={() => listing.setIsManagePhotosOpen(true)}
                  onAddImage={() => listing.listingImageInputRef.current?.click()}
                  onImageChange={listing.handleListingImageChange}
                  countryInput={listing.listingCountryInput}
                  onCountryInputChange={(v) => listing.setListingCountryInput(v)}
                />
              </div>
            )}

            {/* Add Property Listing Button */}
            {hotelProfile.listings && hotelProfile.listings.length > 0 && (
              <button
                type="button"
                onClick={listing.openAddListingModal}
                className="w-full mt-3 py-3 border-2 border-dashed border-primary-200 rounded-lg text-primary-700 hover:border-primary-400 hover:bg-primary-50 transition-all flex items-center justify-center gap-2 font-semibold text-sm group"
              >
                <PlusIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Add Property Listing
              </button>
            )}

            {/* Informational Note */}
            <div className="mt-6 flex items-start gap-3 rounded-xl bg-blue-50 border border-blue-200 px-4 py-3">
              <InformationCircleIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700 leading-snug">
                Each listing can have different collaboration types, availability, and target audience settings.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Hotel Picture Modal */}
      <ProfilePictureModal
        isOpen={showHotelPictureModal}
        onClose={() => setShowHotelPictureModal(false)}
        title="Hotel Picture"
        name={hotelProfile.name}
        picture={hotelProfile.picture}
        onChangePicture={(file, preview) => {
          setHotelProfilePictureFile(file)
          setHotelPicturePreview(preview)
          setHotelEditFormData({ ...hotelEditFormData, picture: preview })
          setShowHotelPictureModal(false)
          setIsEditingHotelProfile(true)
        }}
        onDeletePicture={() => {
          setHotelProfile({ ...hotelProfile, picture: undefined })
          setHotelEditFormData({ ...hotelEditFormData, picture: '' })
          setHotelPicturePreview(null)
        }}
        showDeleteButton={!!hotelProfile.picture}
      />

      {/* Error Modal */}
      <ErrorModal
        isOpen={errorModal.isOpen}
        onClose={closeError}
        title={errorModal.title}
        message={errorModal.message}
        details={errorModal.details}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={listing.deleteConfirmModal.isOpen}
        onClose={() => listing.setDeleteConfirmModal({ isOpen: false, listingId: null, listingName: '' })}
        onConfirm={listing.handleDeleteListing}
        itemName={listing.deleteConfirmModal.listingName}
        itemType="listing"
      />

      {/* Manage Photos Modal */}
      <ManagePhotosModal
        isOpen={listing.isManagePhotosOpen}
        onClose={() => listing.setIsManagePhotosOpen(false)}
        images={listing.listingFormData.images}
        onRemoveImage={listing.removeListingImage}
        onMoveImage={listing.moveListingImage}
        onAddImage={() => listing.listingImageInputRef.current?.click()}
      />
    </>
  )
}
