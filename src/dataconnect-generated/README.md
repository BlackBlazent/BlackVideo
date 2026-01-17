# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetVideosByUser*](#getvideosbyuser)
  - [*ListAllPublicVideos*](#listallpublicvideos)
- [**Mutations**](#mutations)
  - [*CreateNewUser*](#createnewuser)
  - [*AddVideoToCollection*](#addvideotocollection)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetVideosByUser
You can execute the `GetVideosByUser` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getVideosByUser(vars: GetVideosByUserVariables): QueryPromise<GetVideosByUserData, GetVideosByUserVariables>;

interface GetVideosByUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetVideosByUserVariables): QueryRef<GetVideosByUserData, GetVideosByUserVariables>;
}
export const getVideosByUserRef: GetVideosByUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getVideosByUser(dc: DataConnect, vars: GetVideosByUserVariables): QueryPromise<GetVideosByUserData, GetVideosByUserVariables>;

interface GetVideosByUserRef {
  ...
  (dc: DataConnect, vars: GetVideosByUserVariables): QueryRef<GetVideosByUserData, GetVideosByUserVariables>;
}
export const getVideosByUserRef: GetVideosByUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getVideosByUserRef:
```typescript
const name = getVideosByUserRef.operationName;
console.log(name);
```

### Variables
The `GetVideosByUser` query requires an argument of type `GetVideosByUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetVideosByUserVariables {
  userId: UUIDString;
}
```
### Return Type
Recall that executing the `GetVideosByUser` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetVideosByUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetVideosByUserData {
  videos: ({
    id: UUIDString;
    title: string;
    description?: string | null;
    videoUrl: string;
    thumbnailUrl?: string | null;
  } & Video_Key)[];
}
```
### Using `GetVideosByUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getVideosByUser, GetVideosByUserVariables } from '@dataconnect/generated';

// The `GetVideosByUser` query requires an argument of type `GetVideosByUserVariables`:
const getVideosByUserVars: GetVideosByUserVariables = {
  userId: ..., 
};

// Call the `getVideosByUser()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getVideosByUser(getVideosByUserVars);
// Variables can be defined inline as well.
const { data } = await getVideosByUser({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getVideosByUser(dataConnect, getVideosByUserVars);

console.log(data.videos);

// Or, you can use the `Promise` API.
getVideosByUser(getVideosByUserVars).then((response) => {
  const data = response.data;
  console.log(data.videos);
});
```

### Using `GetVideosByUser`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getVideosByUserRef, GetVideosByUserVariables } from '@dataconnect/generated';

// The `GetVideosByUser` query requires an argument of type `GetVideosByUserVariables`:
const getVideosByUserVars: GetVideosByUserVariables = {
  userId: ..., 
};

// Call the `getVideosByUserRef()` function to get a reference to the query.
const ref = getVideosByUserRef(getVideosByUserVars);
// Variables can be defined inline as well.
const ref = getVideosByUserRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getVideosByUserRef(dataConnect, getVideosByUserVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.videos);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.videos);
});
```

## ListAllPublicVideos
You can execute the `ListAllPublicVideos` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listAllPublicVideos(): QueryPromise<ListAllPublicVideosData, undefined>;

interface ListAllPublicVideosRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllPublicVideosData, undefined>;
}
export const listAllPublicVideosRef: ListAllPublicVideosRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAllPublicVideos(dc: DataConnect): QueryPromise<ListAllPublicVideosData, undefined>;

interface ListAllPublicVideosRef {
  ...
  (dc: DataConnect): QueryRef<ListAllPublicVideosData, undefined>;
}
export const listAllPublicVideosRef: ListAllPublicVideosRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAllPublicVideosRef:
```typescript
const name = listAllPublicVideosRef.operationName;
console.log(name);
```

### Variables
The `ListAllPublicVideos` query has no variables.
### Return Type
Recall that executing the `ListAllPublicVideos` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAllPublicVideosData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListAllPublicVideos`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAllPublicVideos } from '@dataconnect/generated';


// Call the `listAllPublicVideos()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAllPublicVideos();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAllPublicVideos(dataConnect);

console.log(data.videos);

// Or, you can use the `Promise` API.
listAllPublicVideos().then((response) => {
  const data = response.data;
  console.log(data.videos);
});
```

### Using `ListAllPublicVideos`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAllPublicVideosRef } from '@dataconnect/generated';


// Call the `listAllPublicVideosRef()` function to get a reference to the query.
const ref = listAllPublicVideosRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAllPublicVideosRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.videos);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.videos);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateNewUser
You can execute the `CreateNewUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createNewUser(vars: CreateNewUserVariables): MutationPromise<CreateNewUserData, CreateNewUserVariables>;

interface CreateNewUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateNewUserVariables): MutationRef<CreateNewUserData, CreateNewUserVariables>;
}
export const createNewUserRef: CreateNewUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createNewUser(dc: DataConnect, vars: CreateNewUserVariables): MutationPromise<CreateNewUserData, CreateNewUserVariables>;

interface CreateNewUserRef {
  ...
  (dc: DataConnect, vars: CreateNewUserVariables): MutationRef<CreateNewUserData, CreateNewUserVariables>;
}
export const createNewUserRef: CreateNewUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createNewUserRef:
```typescript
const name = createNewUserRef.operationName;
console.log(name);
```

### Variables
The `CreateNewUser` mutation requires an argument of type `CreateNewUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateNewUserVariables {
  username: string;
  email: string;
  displayName: string;
}
```
### Return Type
Recall that executing the `CreateNewUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateNewUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateNewUserData {
  user_insert: User_Key;
}
```
### Using `CreateNewUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createNewUser, CreateNewUserVariables } from '@dataconnect/generated';

// The `CreateNewUser` mutation requires an argument of type `CreateNewUserVariables`:
const createNewUserVars: CreateNewUserVariables = {
  username: ..., 
  email: ..., 
  displayName: ..., 
};

// Call the `createNewUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createNewUser(createNewUserVars);
// Variables can be defined inline as well.
const { data } = await createNewUser({ username: ..., email: ..., displayName: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createNewUser(dataConnect, createNewUserVars);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
createNewUser(createNewUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

### Using `CreateNewUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createNewUserRef, CreateNewUserVariables } from '@dataconnect/generated';

// The `CreateNewUser` mutation requires an argument of type `CreateNewUserVariables`:
const createNewUserVars: CreateNewUserVariables = {
  username: ..., 
  email: ..., 
  displayName: ..., 
};

// Call the `createNewUserRef()` function to get a reference to the mutation.
const ref = createNewUserRef(createNewUserVars);
// Variables can be defined inline as well.
const ref = createNewUserRef({ username: ..., email: ..., displayName: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createNewUserRef(dataConnect, createNewUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

## AddVideoToCollection
You can execute the `AddVideoToCollection` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
addVideoToCollection(vars: AddVideoToCollectionVariables): MutationPromise<AddVideoToCollectionData, AddVideoToCollectionVariables>;

interface AddVideoToCollectionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddVideoToCollectionVariables): MutationRef<AddVideoToCollectionData, AddVideoToCollectionVariables>;
}
export const addVideoToCollectionRef: AddVideoToCollectionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addVideoToCollection(dc: DataConnect, vars: AddVideoToCollectionVariables): MutationPromise<AddVideoToCollectionData, AddVideoToCollectionVariables>;

interface AddVideoToCollectionRef {
  ...
  (dc: DataConnect, vars: AddVideoToCollectionVariables): MutationRef<AddVideoToCollectionData, AddVideoToCollectionVariables>;
}
export const addVideoToCollectionRef: AddVideoToCollectionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addVideoToCollectionRef:
```typescript
const name = addVideoToCollectionRef.operationName;
console.log(name);
```

### Variables
The `AddVideoToCollection` mutation requires an argument of type `AddVideoToCollectionVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddVideoToCollectionVariables {
  videoId: UUIDString;
  collectionId: UUIDString;
  note?: string | null;
}
```
### Return Type
Recall that executing the `AddVideoToCollection` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddVideoToCollectionData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddVideoToCollectionData {
  collectionVideo_insert: CollectionVideo_Key;
}
```
### Using `AddVideoToCollection`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addVideoToCollection, AddVideoToCollectionVariables } from '@dataconnect/generated';

// The `AddVideoToCollection` mutation requires an argument of type `AddVideoToCollectionVariables`:
const addVideoToCollectionVars: AddVideoToCollectionVariables = {
  videoId: ..., 
  collectionId: ..., 
  note: ..., // optional
};

// Call the `addVideoToCollection()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addVideoToCollection(addVideoToCollectionVars);
// Variables can be defined inline as well.
const { data } = await addVideoToCollection({ videoId: ..., collectionId: ..., note: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addVideoToCollection(dataConnect, addVideoToCollectionVars);

console.log(data.collectionVideo_insert);

// Or, you can use the `Promise` API.
addVideoToCollection(addVideoToCollectionVars).then((response) => {
  const data = response.data;
  console.log(data.collectionVideo_insert);
});
```

### Using `AddVideoToCollection`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addVideoToCollectionRef, AddVideoToCollectionVariables } from '@dataconnect/generated';

// The `AddVideoToCollection` mutation requires an argument of type `AddVideoToCollectionVariables`:
const addVideoToCollectionVars: AddVideoToCollectionVariables = {
  videoId: ..., 
  collectionId: ..., 
  note: ..., // optional
};

// Call the `addVideoToCollectionRef()` function to get a reference to the mutation.
const ref = addVideoToCollectionRef(addVideoToCollectionVars);
// Variables can be defined inline as well.
const ref = addVideoToCollectionRef({ videoId: ..., collectionId: ..., note: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addVideoToCollectionRef(dataConnect, addVideoToCollectionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.collectionVideo_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.collectionVideo_insert);
});
```

