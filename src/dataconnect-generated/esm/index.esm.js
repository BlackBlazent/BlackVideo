import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'blackvideo',
  location: 'us-east4'
};

export const createNewUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateNewUser', inputVars);
}
createNewUserRef.operationName = 'CreateNewUser';

export function createNewUser(dcOrVars, vars) {
  return executeMutation(createNewUserRef(dcOrVars, vars));
}

export const getVideosByUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetVideosByUser', inputVars);
}
getVideosByUserRef.operationName = 'GetVideosByUser';

export function getVideosByUser(dcOrVars, vars) {
  return executeQuery(getVideosByUserRef(dcOrVars, vars));
}

export const addVideoToCollectionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddVideoToCollection', inputVars);
}
addVideoToCollectionRef.operationName = 'AddVideoToCollection';

export function addVideoToCollection(dcOrVars, vars) {
  return executeMutation(addVideoToCollectionRef(dcOrVars, vars));
}

export const listAllPublicVideosRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllPublicVideos');
}
listAllPublicVideosRef.operationName = 'ListAllPublicVideos';

export function listAllPublicVideos(dc) {
  return executeQuery(listAllPublicVideosRef(dc));
}

