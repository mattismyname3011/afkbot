"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRequestSignature = (_httpUrl, _httpMethod = 'GET', _httpBody = null, _additionalHttpHeaders = null, _policy = 1) => [
    'AAAAAQHWE',
    'Co4YHRo7AHZkg9D6g77rucMoM2jMEjHvY6uxSSlxYu0+cvtsoxO/mQqSRaUyfVCEEK8xXiGEAPyatnbSA4QBc6Zj6QpyQ=='
].join('');
exports.createProofKey = (_key = '', _algorithm = 'ES256') => ({
    crv: 'P-256',
    alg: 'ES256',
    use: 'sig',
    kty: 'EC',
    x: 'VndKQ5-gNBOiiaTwwCiTcQVxcxEARCYW-naPY0gwMHA',
    y: 'PiWV3igPgU-FRBPkdLisyglo5OYxCXE1hwK7OxKNKEg'
});
