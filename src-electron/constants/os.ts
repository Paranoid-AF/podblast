import os from 'os';
export enum Platforms {
  WINDOWS = "WIN32",
  MAC = "DARWIN",
  LINUX = "LINUX",
  SUN = "SUNOS",
  OPENBSD = "OPENBSD",
  ANDROID = "ANDROID",
  AIX = "AIX",
}

export const getPlatform = (): Platforms | null => {
  const currentPlatform = os.platform().toString()
  let result: Platforms | null = null
  for(let key in Platforms) {
    if(Platforms[key as keyof typeof Platforms] === currentPlatform.toUpperCase()) {
      result = Platforms[key as keyof typeof Platforms]
    }
  }
  return result
}