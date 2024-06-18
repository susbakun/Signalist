import { AccountModel, MessageModel } from '@/shared/models'

export const useUserMessageRoom = (messages: MessageModel['']) => {
  const checkIfExistsRoom = (user: AccountModel) => {
    return Object.keys(messages).some((messageId) => {
      if (messages[messageId].userInfo.username === user.username) {
        return true
      }
      return false
    })
  }
  const findExistingRoomId = (user: AccountModel) => {
    return Object.keys(messages).find((messageId) => {
      if (messages[messageId].userInfo.username === user.username) {
        return messageId
      }
    })
  }
  return { checkIfExistsRoom, findExistingRoomId }
}
