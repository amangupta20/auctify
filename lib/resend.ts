import { Resend } from "resend";

// Initialize Resend client
// Make sure to set RESEND_API_KEY in your .env file
const resend = new Resend(process.env.RESEND_API_KEY);

export default resend;
