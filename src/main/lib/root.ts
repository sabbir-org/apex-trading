import { appDirectory } from '@shared/constants'
import { homedir } from 'os'
import { join } from 'path'

export const getRootDir = () => {
  return join(homedir(), appDirectory)
}
