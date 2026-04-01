"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOrderNumber = void 0;
// utils/generateOrderNumber.ts
const generateOrderNumber = () => {
    const date = new Date();
    const datePart = date.toISOString().slice(0, 10).replace(/-/g, ''); // "20240315"
    const randomPart = Math.floor(1000 + Math.random() * 9000); // "4821"
    return `ORD-${datePart}-${randomPart}`; // "ORD-20240315-4821"
};
exports.generateOrderNumber = generateOrderNumber;
