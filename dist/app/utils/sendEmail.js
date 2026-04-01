"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const config_1 = __importDefault(require("../config"));
/**
 * Sends an email using Plunk API
 * @param to recipient email address
 * @param subject email subject
 * @param body email body (HTML)
 */
const sendEmail = (to, subject, body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch('https://api.useplunk.com/v1/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${config_1.default.plunk_secret_key}`,
            },
            body: JSON.stringify({
                to,
                subject,
                body,
            }),
        });
        const result = yield response.json();
        if (!response.ok) {
            console.error('Plunk Email Error:', result);
            // We don't throw here to avoid breaking the main flow (e.g. order placement)
            // but we log it for debugging.
        }
        return result;
    }
    catch (error) {
        console.error('Plunk Email Request Failed:', error);
    }
});
exports.sendEmail = sendEmail;
