import sanityClient from '@sanity/client';

const client = sanityClient({
  projectId: 'wlk5vmg7',
  dataset: 'production',
  useCdn: true, // Enable the Content Delivery Network (CDN) for faster responses
});

export default client;
