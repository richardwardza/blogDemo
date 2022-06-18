import fetch from 'node-fetch';

const API_ENDPOINT = process.env.TEST_API_ENDPOINT || 'http://localhost:3000/dev/graphql';

export const queryApi = async (query: string, variables: { [k: string]: any } = {}, extraHeaders: any = {}) => {
  const headers = {
    'content-type': 'application/json',
    ...extraHeaders,
  };
  const request = {
    method: 'POST',
    body: JSON.stringify({ query, variables }),
    headers,
  };
  const response = await fetch(API_ENDPOINT, request);
  return response.json();
};

// export const getErrorCodes = (response: any) => {
//   const errorCodes: string[] = [];
//   if (response.errors && response.errors[0].extensions?.code) {
//     response.errors.forEach((error) => errorCodes.push(error.extensions?.code));
//   }
//   if (response.extensions?.code) {
//     errorCodes.push(response.extensions?.code);
//   }
//   return errorCodes;
// };
