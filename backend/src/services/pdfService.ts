import PDFDocument from 'pdfkit';
import { PopulatedPayment } from '../types/shared';
import { IUser } from '../models/User';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const generateReceiptPDF = async (
  payment: PopulatedPayment,
  owner: IUser
): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const chunks: Buffer[] = [];

    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // En-tête
    doc.fontSize(20).text('Quittance de loyer', { align: 'center' });
    doc.moveDown();

    // Informations du propriétaire
    doc.fontSize(12).text('Propriétaire :', { continued: true })
       .fontSize(10).text(` ${owner.firstName} ${owner.lastName}`);
    doc.moveDown();

    // Informations du locataire
    doc.fontSize(12).text('Locataire :', { continued: true })
       .fontSize(10).text(` ${payment.tenantId.firstName} ${payment.tenantId.lastName}`);
    doc.moveDown();

    // Informations du paiement
    doc.fontSize(12).text('Montant :', { continued: true })
       .fontSize(10).text(` ${payment.amount}€`);
    doc.fontSize(12).text('Date de paiement :', { continued: true })
       .fontSize(10).text(` ${format(payment.paidDate!, 'dd MMMM yyyy', { locale: fr })}`);
    doc.moveDown();

    // Signature
    doc.moveDown(4);
    doc.fontSize(10).text('Signature du propriétaire :', { align: 'right' });
    doc.moveDown();
    doc.text(owner.firstName + ' ' + owner.lastName, { align: 'right' });

    doc.end();
  });
}; 