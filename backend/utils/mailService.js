const nodemailer = require("nodemailer");

/**
 * Service de messagerie centralisé pour l'envoi d'emails
 * Utilise les variables d'environnement pour la configuration SMTP
 */

// Créer le transporteur Nodemailer
const createTransporter = () => {
  // Vérifier que les variables d'environnement sont définies
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_PORT || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("⚠️ Configuration email incomplète. Les emails ne seront pas envoyés.");
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_PORT === "465", // true pour le port 465, false pour les autres
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Fonction générique pour envoyer un email
 * @param {Object} options - Options de l'email
 * @param {string} options.to - Adresse email du destinataire
 * @param {string} options.subject - Sujet de l'email
 * @param {string} options.text - Contenu texte brut (optionnel)
 * @param {string} options.html - Contenu HTML (optionnel)
 * @returns {Promise<Object>} - Résultat de l'envoi
 */
const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = createTransporter();
    
    // Si le transporteur n'est pas configuré, on log et on continue sans erreur
    if (!transporter) {
      console.log(`📧 [EMAIL NON ENVOYÉ] À: ${to} | Sujet: ${subject}`);
      console.log(`   Raison: Configuration SMTP manquante`);
      return { success: false, message: "Configuration email manquante" };
    }

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'B2Connect Store'}" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email envoyé avec succès à ${to}: ${info.messageId}`);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Erreur lors de l'envoi de l'email à ${to}:`, error.message);
    // On ne lance pas d'erreur pour ne pas bloquer le processus principal
    return { success: false, error: error.message };
  }
};

module.exports = { sendEmail };
