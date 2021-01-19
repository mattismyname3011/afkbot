export declare const createRequestSignature: (_httpUrl: string, _httpMethod?: string, _httpBody?: object | null, _additionalHttpHeaders?: object | null, _policy?: number) => string;
export declare const createProofKey: (_key?: string, _algorithm?: string) => {
    crv: string;
    alg: string;
    use: string;
    kty: string;
    x: string;
    y: string;
};
