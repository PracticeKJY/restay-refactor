// api 호출 예시 참고 파일

// import { GET, POST } from "@/app/@http/request";

// export interface CheckedBucketReqDTO {
//   token: string;
//   centerId?: string;
// }

// export interface CheckedBucketResDTO {
//   message: string;
//   data: {
//     centerId: string | null;
//     bucketAlias: string;
//     bucketName: string;
//     bucketOwner: string;
//     bucketType: string;
//     validExt: string[];
//     maxFileSize: number;
//     bucketActiveStatus: string;
//   };
//   errorCode: string | null;
//   errorMessage: string | null;
//   timestamp: number[];
//   success: boolean;
// }

// export const liveChatImageService = {
//   // 파일 다운로드
//   getFileDownload: async (fileDownloadReqDTO: FileDownloadReqDTO): Promise<string> => {
//     const { fileId, bucketName, customerId, token } = fileDownloadReqDTO;
//     const url = `${import.meta.env.VITE_API_BASE_URL}/livechat/fileDownload?fileId=${fileId}&bucketName=${bucketName}&customerId=${customerId}`;
//     const res = await fetch(url, {
//       headers: { liveChatToken: token },
//     });
//     if (res.status !== 200) {
//       throw new Error(`status : ${res.status}`);
//     }

//     const blob = await res.blob();
//     const objectUrl = globalThis.URL.createObjectURL(blob); // URL 생성해서 반환
//     return objectUrl;
//   },

//   // QnA 상담점수
//   postSubmitQnA: async (submitQnAReqDTO: SubmitQnAReqDTO & { token: string }) => {
//     const { translationLanguage, token, appChannelId, centerId, customer, question, topicId } = submitQnAReqDTO;

//     const body = {
//       centerId,
//       customer,
//       appChannelId,
//       question,
//       topicId,
//       customMetadata: {
//         translationLanguage,
//       },
//     };

//     const res = await POST<TicketResDto>(`/livechat/qnaReceptions`, body, {
//       headers: { liveChatToken: token },
//     });

//     return res.data;
//   },
// };
