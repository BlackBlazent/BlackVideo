import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface AddVideoToCollectionData {
  collectionVideo_insert: CollectionVideo_Key;
}

export interface AddVideoToCollectionVariables {
  videoId: UUIDString;
  collectionId: UUIDString;
  note?: string | null;
}

export interface CollectionVideo_Key {
  collectionId: UUIDString;
  videoId: UUIDString;
  __typename?: 'CollectionVideo_Key';
}

export interface Collection_Key {
  id: UUIDString;
  __typename?: 'Collection_Key';
}

export interface Comment_Key {
  id: UUIDString;
  __typename?: 'Comment_Key';
}

export interface CreateNewUserData {
  user_insert: User_Key;
}

export interface CreateNewUserVariables {
  username: string;
  email: string;
  displayName: string;
}

export interface Follow_Key {
  followerId: UUIDString;
  followedId: UUIDString;
  __typename?: 'Follow_Key';
}

export interface GetVideosByUserData {
  videos: ({
    id: UUIDString;
    title: string;
    description?: string | null;
    videoUrl: string;
    thumbnailUrl?: string | null;
  } & Video_Key)[];
}

export interface GetVideosByUserVariables {
  userId: UUIDString;
}

export interface Like_Key {
  userId: UUIDString;
  videoId: UUIDString;
  __typename?: 'Like_Key';
}

export interface ListAllPublicVideosData {
  videos: ({
    id: UUIDString;
    title: string;
    description?: string | null;
    videoUrl: string;
    thumbnailUrl?: string | null;
    creator?: {
      id: UUIDString;
      username: string;
    } & User_Key;
  } & Video_Key)[];
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

export interface Video_Key {
  id: UUIDString;
  __typename?: 'Video_Key';
}

interface CreateNewUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateNewUserVariables): MutationRef<CreateNewUserData, CreateNewUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateNewUserVariables): MutationRef<CreateNewUserData, CreateNewUserVariables>;
  operationName: string;
}
export const createNewUserRef: CreateNewUserRef;

export function createNewUser(vars: CreateNewUserVariables): MutationPromise<CreateNewUserData, CreateNewUserVariables>;
export function createNewUser(dc: DataConnect, vars: CreateNewUserVariables): MutationPromise<CreateNewUserData, CreateNewUserVariables>;

interface GetVideosByUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetVideosByUserVariables): QueryRef<GetVideosByUserData, GetVideosByUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetVideosByUserVariables): QueryRef<GetVideosByUserData, GetVideosByUserVariables>;
  operationName: string;
}
export const getVideosByUserRef: GetVideosByUserRef;

export function getVideosByUser(vars: GetVideosByUserVariables): QueryPromise<GetVideosByUserData, GetVideosByUserVariables>;
export function getVideosByUser(dc: DataConnect, vars: GetVideosByUserVariables): QueryPromise<GetVideosByUserData, GetVideosByUserVariables>;

interface AddVideoToCollectionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddVideoToCollectionVariables): MutationRef<AddVideoToCollectionData, AddVideoToCollectionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddVideoToCollectionVariables): MutationRef<AddVideoToCollectionData, AddVideoToCollectionVariables>;
  operationName: string;
}
export const addVideoToCollectionRef: AddVideoToCollectionRef;

export function addVideoToCollection(vars: AddVideoToCollectionVariables): MutationPromise<AddVideoToCollectionData, AddVideoToCollectionVariables>;
export function addVideoToCollection(dc: DataConnect, vars: AddVideoToCollectionVariables): MutationPromise<AddVideoToCollectionData, AddVideoToCollectionVariables>;

interface ListAllPublicVideosRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllPublicVideosData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAllPublicVideosData, undefined>;
  operationName: string;
}
export const listAllPublicVideosRef: ListAllPublicVideosRef;

export function listAllPublicVideos(): QueryPromise<ListAllPublicVideosData, undefined>;
export function listAllPublicVideos(dc: DataConnect): QueryPromise<ListAllPublicVideosData, undefined>;

