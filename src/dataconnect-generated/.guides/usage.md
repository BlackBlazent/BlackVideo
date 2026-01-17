# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.




### React
For each operation, there is a wrapper hook that can be used to call the operation.

Here are all of the hooks that get generated:
```ts
import { useCreateNewUser, useGetVideosByUser, useAddVideoToCollection, useListAllPublicVideos } from '@dataconnect/generated/react';
// The types of these hooks are available in react/index.d.ts

const { data, isPending, isSuccess, isError, error } = useCreateNewUser(createNewUserVars);

const { data, isPending, isSuccess, isError, error } = useGetVideosByUser(getVideosByUserVars);

const { data, isPending, isSuccess, isError, error } = useAddVideoToCollection(addVideoToCollectionVars);

const { data, isPending, isSuccess, isError, error } = useListAllPublicVideos();

```

Here's an example from a different generated SDK:

```ts
import { useListAllMovies } from '@dataconnect/generated/react';

function MyComponent() {
  const { isLoading, data, error } = useListAllMovies();
  if(isLoading) {
    return <div>Loading...</div>
  }
  if(error) {
    return <div> An Error Occurred: {error} </div>
  }
}

// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyComponent from './my-component';

function App() {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
    <MyComponent />
  </QueryClientProvider>
}
```



## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createNewUser, getVideosByUser, addVideoToCollection, listAllPublicVideos } from '@dataconnect/generated';


// Operation CreateNewUser:  For variables, look at type CreateNewUserVars in ../index.d.ts
const { data } = await CreateNewUser(dataConnect, createNewUserVars);

// Operation GetVideosByUser:  For variables, look at type GetVideosByUserVars in ../index.d.ts
const { data } = await GetVideosByUser(dataConnect, getVideosByUserVars);

// Operation AddVideoToCollection:  For variables, look at type AddVideoToCollectionVars in ../index.d.ts
const { data } = await AddVideoToCollection(dataConnect, addVideoToCollectionVars);

// Operation ListAllPublicVideos: 
const { data } = await ListAllPublicVideos(dataConnect);


```