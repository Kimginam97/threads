// Resource: https://docs.uploadthing.com/nextjs/appdir#creating-your-first-fileroute
// Above resource shows how to setup uploadthing. Copy paste most of it as it is.
// We're changing a few things in the middleware and configs of the file upload i.e., "media", "maxFileCount"

import { currentUser } from '@clerk/nextjs'
import { createUploadthing } from 'uploadthing/next'

const f = createUploadthing()

const getUser = async () => await currentUser()

export const ourFileRouter = {
  // 원하는대로 여러 개의 파일 라우트를 정의하세요. 각각에는 고유한 routeSlug가 있어야 합니다
  media: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    // Set permissions and file types for this FileRoute
    .middleware(async (req) => {
      // 이 파일 라우트에 대한 권한 및 파일 유형 설정
      const user = await getUser()

      // 에러를 던지면 사용자는 업로드할 수 없습니다
      if (!user) throw new Error('Unauthorized')

      // 여기서 반환된 것은 metadata로 onUploadComplete에서 접근할 수 있습니다
      return { userId: user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // 이 코드는 업로드 후 서버에서 실행됩니다
      console.log('Upload complete for userId:', metadata.userId)

      console.log('file url', file.url)
    }),
}

export type OurFileRouter = typeof ourFileRouter
