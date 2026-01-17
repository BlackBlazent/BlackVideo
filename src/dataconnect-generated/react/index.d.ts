import { CreateNewUserData, CreateNewUserVariables, GetVideosByUserData, GetVideosByUserVariables, AddVideoToCollectionData, AddVideoToCollectionVariables, ListAllPublicVideosData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateNewUser(options?: useDataConnectMutationOptions<CreateNewUserData, FirebaseError, CreateNewUserVariables>): UseDataConnectMutationResult<CreateNewUserData, CreateNewUserVariables>;
export function useCreateNewUser(dc: DataConnect, options?: useDataConnectMutationOptions<CreateNewUserData, FirebaseError, CreateNewUserVariables>): UseDataConnectMutationResult<CreateNewUserData, CreateNewUserVariables>;

export function useGetVideosByUser(vars: GetVideosByUserVariables, options?: useDataConnectQueryOptions<GetVideosByUserData>): UseDataConnectQueryResult<GetVideosByUserData, GetVideosByUserVariables>;
export function useGetVideosByUser(dc: DataConnect, vars: GetVideosByUserVariables, options?: useDataConnectQueryOptions<GetVideosByUserData>): UseDataConnectQueryResult<GetVideosByUserData, GetVideosByUserVariables>;

export function useAddVideoToCollection(options?: useDataConnectMutationOptions<AddVideoToCollectionData, FirebaseError, AddVideoToCollectionVariables>): UseDataConnectMutationResult<AddVideoToCollectionData, AddVideoToCollectionVariables>;
export function useAddVideoToCollection(dc: DataConnect, options?: useDataConnectMutationOptions<AddVideoToCollectionData, FirebaseError, AddVideoToCollectionVariables>): UseDataConnectMutationResult<AddVideoToCollectionData, AddVideoToCollectionVariables>;

export function useListAllPublicVideos(options?: useDataConnectQueryOptions<ListAllPublicVideosData>): UseDataConnectQueryResult<ListAllPublicVideosData, undefined>;
export function useListAllPublicVideos(dc: DataConnect, options?: useDataConnectQueryOptions<ListAllPublicVideosData>): UseDataConnectQueryResult<ListAllPublicVideosData, undefined>;
