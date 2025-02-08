import {createWithCache, CacheLong} from '@shopify/hydrogen';

export function createRickAndMortyClient({
  cache,
  waitUntil,
  request,
}) {
  const withCache = createWithCache({cache, waitUntil, request});

  async function query(
    query,
    options = {variables: {}, cacheStrategy: CacheLong()},
  ) {
    const result = await withCache.fetch(
      'https://rickandmortyapi.com/graphql',
      {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: options.variables,
        }),
      },
      {
        cacheKey: ['r&m', query, JSON.stringify(options.variables)],
        cacheStrategy: options.cacheStrategy,
        shouldCacheResponse: (body) =>
          body.error == null || body.error.length === 0,
      },
    );
    return result.data;
  }

  return {query};
}