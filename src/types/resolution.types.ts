export interface SuperResolutionRequest {
  email: string;
  uuid: string;
  fileName: string;
  weights: string;
  versionId: string;
}

export interface SuperResolutionFetchResponse {
  newFileName: string;
  newVersionId: string;
}
