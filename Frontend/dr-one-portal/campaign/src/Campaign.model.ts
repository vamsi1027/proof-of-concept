export interface CampaignData {
  content: any[];
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  totalElements: number;
  totalPages: number;
  sort?: SortingRule[];
}
export interface SortingRule {
  ascending: boolean;
  descending: boolean;
  direction: string;
  ignoreCase: boolean;
  nullHandling: string;
  property: string;
}

export interface Dimensions {
  height: number;
  width: number;
}

export interface ImageContent {
  createdDate?: number;
  dimensions?: Dimensions;
  id: string;
  imageContentType: string;
  name: string;
  organizationId: number;
  size: number;
  updatedAt?: number;
  userId: string;
  imageFileId?: string;
  imageUrl?: string;
}

export interface ImageContentResponse {
  content: ImageContent[];
  lastPage: boolean;
}

export interface VideoContent {
  createdDate?: number;
  dimensions?: Dimensions;
  id: string;
  externalVideoUrl?: string;
  gifFileId?: string;
  name: string;
  organizationId: number;
  size: number;
  updatedAt?: number;
  userId: string;
  videoFileId?: string;
  videoFileUrl: string;
  videoContentFlag: boolean;
  videoContentHostingType: string;
}
