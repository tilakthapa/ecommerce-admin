/*--

const configuredApiUrl = import.meta.env.VITE_API_URL;

if (!configuredApiUrl) {
  throw new Error("VITE_API_URL is not configured.");
}

export const API_URL = configuredApiUrl.replace(/\/$/, "");

/*--   export const API_URL=(import.meta.env.VITE_API_URL||'http://localhost:5000/api').replace(/\/$/,'');  

export class ApiClientError extends Error{constructor(message,status=0,details){super(message);this.status=status;this.details=details}}
export async function api(path,{method='GET',body,headers={},signal}={}){signal=signal?AbortSignal.any([signal,AbortSignal.timeout(25000)]):AbortSignal.timeout(25000);const isForm=body instanceof FormData;let response;try{response=await fetch(`${API_URL}${path}`,{method,credentials:'include',signal,headers:{...(isForm?{}:{'Content-Type':'application/json'}),...headers},body:body==null?undefined:isForm?body:JSON.stringify(body)})}catch(e){if(e.name==='AbortError')throw e;throw new ApiClientError('Unable to connect to the server. Please check the API and try again.')}const data=(response.headers.get('content-type')||'').includes('application/json')?await response.json().catch(()=>({})):{};if(!response.ok)throw new ApiClientError(data.message||'Request failed. Please try again.',response.status,data.details);return data}

export async function allProducts(){const first=await api("/admin/products?limit=200");const products=[...first.products];for(let page=2;products.length<first.pagination.total;page++){const next=await api(`/admin/products?limit=200&page=${page}`);if(!next.products.length)break;products.push(...next.products)}return {...first,products}}

--*/



const configuredApiUrl = import.meta.env.VITE_API_URL;

if (!configuredApiUrl) {
  throw new Error("VITE_API_URL is not configured.");
}

export const API_URL = configuredApiUrl.replace(/\/$/, "");

console.log("API_URL:", API_URL);

export class ApiClientError extends Error {
  constructor(message, status = 0, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export async function api(
  path,
  { method = "GET", body, headers = {}, signal } = {}
) {
  signal = signal
    ? AbortSignal.any([signal, AbortSignal.timeout(25000)])
    : AbortSignal.timeout(25000);

  const isForm = body instanceof FormData;

  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      credentials: "include",
      signal,
      headers: {
        ...(isForm ? {} : { "Content-Type": "application/json" }),
        ...headers,
      },
      body:
        body == null
          ? undefined
          : isForm
          ? body
          : JSON.stringify(body),
    });
  } catch (e) {
    if (e.name === "AbortError") throw e;

    throw new ApiClientError(
      "Unable to connect to the server. Please check the API and try again."
    );
  }

  const data = (
    response.headers.get("content-type") || ""
  ).includes("application/json")
    ? await response.json().catch(() => ({}))
    : {};

  if (!response.ok) {
    throw new ApiClientError(
      data.message || "Request failed. Please try again.",
      response.status,
      data.details
    );
  }

  return data;
}

export async function allProducts() {
  const first = await api("/admin/products?limit=200");

  const products = [...first.products];

  for (
    let page = 2;
    products.length < first.pagination.total;
    page++
  ) {
    const next = await api(
      `/admin/products?limit=200&page=${page}`
    );

    if (!next.products.length) break;

    products.push(...next.products);
  }

  return { ...first, products };
}