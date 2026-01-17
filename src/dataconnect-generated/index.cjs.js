const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'blackvideo',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

const createNewUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateNewUser', inputVars);
}
createNewUserRef.operationName = 'CreateNewUser';
exports.createNewUserRef = createNewUserRef;

exports.createNewUser = function createNewUser(dcOrVars, vars) {
  return executeMutation(createNewUserRef(dcOrVars, vars));
};

const getVideosByUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetVideosByUser', inputVars);
}
getVideosByUserRef.operationName = 'GetVideosByUser';
exports.getVideosByUserRef = getVideosByUserRef;

exports.getVideosByUser = function getVideosByUser(dcOrVars, vars) {
  return executeQuery(getVideosByUserRef(dcOrVars, vars));
};

const addVideoToCollectionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddVideoToCollection', inputVars);
}
addVideoToCollectionRef.operationName = 'AddVideoToCollection';
exports.addVideoToCollectionRef = addVideoToCollectionRef;

exports.addVideoToCollection = function addVideoToCollection(dcOrVars, vars) {
  return executeMutation(addVideoToCollectionRef(dcOrVars, vars));
};

const listAllPublicVideosRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllPublicVideos');
}
listAllPublicVideosRef.operationName = 'ListAllPublicVideos';
exports.listAllPublicVideosRef = listAllPublicVideosRef;

exports.listAllPublicVideos = function listAllPublicVideos(dc) {
  return executeQuery(listAllPublicVideosRef(dc));
};
