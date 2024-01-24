/* GLOBAL */
const protocol: string | undefined = process.env.PROTOCOL;

/* BACKEND */
const backendServiceIP: string | undefined = process.env.BACKEND_HOST;
export const backendURL: string = `${protocol}://${backendServiceIP}`;

/* BACKEND */
const frontendServiceIP: string | undefined = process.env.FRONTEND_HOST;
export const frontendURL: string = `${protocol}://${frontendServiceIP}`;

