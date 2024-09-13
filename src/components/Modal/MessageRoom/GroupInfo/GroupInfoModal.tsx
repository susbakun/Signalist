import { UserPreview } from "@/components/Shared/UserPreview"
import { useUserMessageRoom } from "@/hooks/useUserMessageRoom"
import { GroupInfoType, SimplifiedAccountType } from "@/shared/types"
import { cn, getAvatarPlaceholder } from "@/utils"
import { Modal } from "flowbite-react"

type GroupInfoModalProps = {
  openModal: boolean
  groupInfo: GroupInfoType | null
  members: SimplifiedAccountType[] | null
  handleCloseModal: () => void
}

export const GroupInfoModal = ({
  openModal,
  members,
  groupInfo,
  handleCloseModal
}: GroupInfoModalProps) => {
  const { getProperAvatar } = useUserMessageRoom()

  if (!groupInfo || !members) return

  const placeholder = getAvatarPlaceholder(groupInfo.groupName)
  return (
    <Modal size="md" show={openModal} onClose={handleCloseModal}>
      <Modal.Header className="border-none pr-1 py-2" />
      <Modal.Body
        className="flex overflow-y-auto
        flex-col gap-2 py-0 mb-4 px-4 custom-modal min-h-[300px]"
      >
        <div className="flex flex-col">
          <div className="flex items-center justify-center flex-col gap-2 mb-4">
            <div className="cursor-pointer translate-x-1">
              {getProperAvatar(placeholder, undefined, groupInfo)}
            </div>
            <h2 className="text-2xl font-bold">{groupInfo.groupName}</h2>
          </div>
          {members.map((member, index) => (
            <UserPreview
              className={cn("border-b pt-2 border-b-gray-600/20 pb-4 dark:border-b-white/20", {
                "border-none pb-0": index === members.length - 1
              })}
              {...member}
              key={member.username}
            />
          ))}
        </div>
      </Modal.Body>
    </Modal>
  )
}
