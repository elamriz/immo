import nodemailer from 'nodemailer';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { PopulatedPayment } from '../types/shared';

const transporter = nodemailer.createTransport({
  // Configuration de votre service d'email
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendPaymentConfirmationEmail = async (
  to: string,
  payment: PopulatedPayment
) => {
  const html = `
    <h2>Confirmation de paiement</h2>
    <p>Bonjour ${payment.tenantId.firstName},</p>
    <p>Nous confirmons avoir reçu votre paiement :</p>
    <ul>
      <li>Montant : ${payment.amount}€</li>
      <li>Date : ${format(payment.paidDate!, 'dd MMMM yyyy', { locale: fr })}</li>
      <li>Propriété : ${payment.propertyId.name}</li>
    </ul>
    <p>Une quittance de loyer vous sera envoyée prochainement.</p>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: 'Confirmation de paiement',
    html,
  });
};

export const sendPaymentReminderEmail = async (
  to: string,
  payment: PopulatedPayment
) => {
  const html = `
    <h2>Rappel de paiement</h2>
    <p>Bonjour ${payment.tenantId.firstName},</p>
    <p>Nous vous rappelons que votre paiement est attendu :</p>
    <ul>
      <li>Montant : ${payment.amount}€</li>
      <li>Date limite : ${format(payment.dueDate, 'dd MMMM yyyy', { locale: fr })}</li>
      <li>Propriété : ${payment.propertyId.name}</li>
    </ul>
    <p>Merci de régulariser la situation dès que possible.</p>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: 'Rappel de paiement',
    html,
  });
}; 