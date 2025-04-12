import { AppDispatch } from "@/app/store"
import { ProfileImagePicker } from "@/components/Auth/ProfileImagePicker"
import { ToastContainer } from "@/components/Shared/ToastContainer"
import { fetchUsersAsync, updateProfileAsync } from "@/features/User/usersSlice"
import { useToastContainer } from "@/hooks/useToastContainer"
import { AccountModel } from "@/shared/models"
import { cn } from "@/utils"
import { Modal } from "flowbite-react"
import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { FaUser } from "react-icons/fa"
import { MdEmail } from "react-icons/md"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"

type EditProfileModalProps = {
  openModal: boolean
  handleCloseModal: () => void
  userAccount: AccountModel
}

export const EditProfileModal = ({
  openModal,
  handleCloseModal,
  userAccount
}: EditProfileModalProps) => {
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [bio, setBio] = useState("")
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { handleShowToast, showToast, toastContent, toastType } = useToastContainer()

  // Initialize form values from user account
  useEffect(() => {
    if (userAccount) {
      setName(userAccount.name || "")
      setUsername(userAccount.username || "")
      setEmail(userAccount.email || "")
      setBio(userAccount.bio || "")
    }
  }, [userAccount])

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!username.trim()) {
      newErrors.username = "Username is required"
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      newErrors.username = "Username can only contain letters, numbers, and underscores"
    }

    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value)
  }

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handleBioChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setBio(e.target.value)
  }

  const handleImageChange = (file: File | null) => {
    setProfileImage(file)
  }

  // Function to upload profile image - same as in SignUpPage
  const uploadProfileImage = async (image: File): Promise<string> => {
    try {
      const formData = new FormData()
      formData.append("file", image)

      const response = await fetch("https://signalist-backend.liara.run/api/upload/users", {
        method: "POST",
        body: formData
      })

      if (!response.ok) {
        throw new Error("Failed to upload profile image")
      }

      const data = await response.json()
      return data.url
    } catch (error) {
      console.error("Error uploading profile image:", error)
      throw error
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      let imageUrl = userAccount.imageUrl

      // Upload image if there's a new one
      if (profileImage) {
        try {
          imageUrl = await uploadProfileImage(profileImage)
        } catch (error) {
          handleShowToast("Failed to upload profile image", "error")
          setErrors({
            ...errors,
            profileImage:
              "Failed to upload profile image. You can continue without an image or try again."
          })
          setIsSubmitting(false)
          return
        }
      }

      const updates: Partial<
        Pick<AccountModel, "name" | "bio" | "imageUrl" | "username" | "email">
      > = {
        name,
        bio,
        imageUrl
      }

      // Only add username and email if they've changed
      if (username !== userAccount.username) {
        updates.username = username
      }

      if (email !== userAccount.email) {
        updates.email = email
      }

      const result = await dispatch(
        updateProfileAsync({
          username: userAccount.username,
          updates
        })
      ).unwrap()

      if (result) {
        handleShowToast("Profile updated successfully", "success")
        localStorage.setItem("currentUser", JSON.stringify(result))
        await dispatch(fetchUsersAsync())
        setTimeout(() => {
          handleCloseModal()
        }, 3000)
        navigate(`/${result.username}`, { replace: true })
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to update profile"
      handleShowToast(errorMessage, "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Modal show={openModal} onClose={handleCloseModal} size="xl">
        <Modal.Header className="border-none">
          <h2 className="text-2xl font-bold">Edit Profile</h2>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="text-red-500 text-sm text-center bg-red-100 dark:bg-red-900/20 rounded-lg py-2">
                {errors.general}
              </div>
            )}

            <ProfileImagePicker
              name={name}
              selectedImage={profileImage}
              onImageChange={handleImageChange}
              error={errors.profileImage}
            />

            <div className="space-y-4">
              {/* Name field */}
              <div className="relative">
                <div className="flex items-center">
                  <div className="absolute left-3 flex items-center justify-center pointer-events-none">
                    <FaUser className="text-gray-400 text-lg" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={handleNameChange}
                    placeholder="Full Name"
                    className={cn(
                      "w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-primary-link-button dark:focus:border-dark-link-button dark:bg-gray-700 dark:border-gray-600 h-10",
                      errors.name && "border-red-500 dark:border-red-500"
                    )}
                  />
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Username field */}
              <div className="relative">
                <div className="flex items-center">
                  <div className="absolute left-3 flex items-center justify-center pointer-events-none">
                    <FaUser className="text-gray-400 text-lg" />
                  </div>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={handleUsernameChange}
                    placeholder="Username"
                    className={cn(
                      "w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-primary-link-button dark:focus:border-dark-link-button dark:bg-gray-700 dark:border-gray-600 h-10",
                      errors.username && "border-red-500 dark:border-red-500"
                    )}
                  />
                </div>
                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
              </div>

              {/* Email field */}
              <div className="relative">
                <div className="flex items-center">
                  <div className="absolute left-3 flex items-center justify-center pointer-events-none">
                    <MdEmail className="text-gray-400 text-lg" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Email"
                    className={cn(
                      "w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-primary-link-button dark:focus:border-dark-link-button dark:bg-gray-700 dark:border-gray-600 h-10",
                      errors.email && "border-red-500 dark:border-red-500"
                    )}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Bio field */}
              <div className="relative">
                <div className="flex items-center mb-1">
                  <label htmlFor="bio" className="text-sm text-gray-600 dark:text-gray-300">
                    Bio <span className="text-gray-400">(optional)</span>
                  </label>
                </div>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={handleBioChange}
                  placeholder="Tell us a bit about yourself..."
                  rows={3}
                  maxLength={150}
                  className={cn(
                    "w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary-link-button dark:focus:border-dark-link-button dark:bg-gray-700 dark:border-gray-600 resize-none",
                    errors.bio && "border-red-500 dark:border-red-500"
                  )}
                />
                <div className="min-h-[1.5rem] flex justify-between">
                  {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio}</p>}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {bio.length}/150 characters
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-link-button hover:bg-blue-700 dark:bg-dark-link-button dark:hover:bg-blue-800 disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
      {showToast && (
        <ToastContainer showToast={showToast} toastContent={toastContent} toastType={toastType} />
      )}
    </>
  )
}
