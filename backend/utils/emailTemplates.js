/**
 * Templates d'emails pour l'application B2CONNECT STORE
 * Génère le contenu HTML pour chaque type d'email
 */

/**
 * Fonction utilitaire pour générer la civilité
 * @param {string} gender - Genre de l'utilisateur ("male", "female", ou null)
 * @returns {string} - "Monsieur" ou "Madame"
 */
const getCivility = (gender) => {
  return gender === "female" ? "Madame" : "Monsieur";
};

/**
 * Template de base pour tous les emails
 */
const getBaseTemplate = (content) => {
  // Si vous avez une URL publique pour votre logo, remplacez cette ligne
  // Exemple: const logoUrl = "https://votre-domaine.com/logo.png";
  const logoUrl = process.env.LOGO_URL || null;
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .header {
      background-color: #0a1f3f;
      color: white;
      padding: 30px 20px;
      text-align: center;
    }
    .header a {
      text-decoration: none;
      display: inline-block;
    }
    .header img {
      max-width: 200px;
      height: auto;
      margin-bottom: 10px;
      display: block;
      cursor: pointer;
    }
    .header h1 {
      margin: 0;
      font-size: 32px;
      font-weight: 700;
      letter-spacing: 1px;
    }
    .header .logo-text {
      font-size: 36px;
      font-weight: 700;
      letter-spacing: 2px;
      margin: 0;
      color: #ffc107;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }
    .content {
      padding: 30px 20px;
    }
    .button {
      display: inline-block;
      padding: 12px 30px;
      margin: 20px 0;
      background-color: #0a1f3f;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
    }
    .button:hover {
      background-color: #051229;
    }
    .footer {
      background-color: #f8f8f8;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #666;
    }
    .info-box {
      background-color: #fffaed;
      border-left: 4px solid #ffc107;
      padding: 15px;
      margin: 15px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <a href="${frontendUrl}" style="text-decoration: none; display: inline-block;">
        ${logoUrl ? `<img src="${logoUrl}" alt="B2CONNECT STORE Logo">` : `<h1 class="logo-text">B2CONNECT</h1>`}
      </a>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} B2CONNECT STORE. Tous droits réservés.</p>
      <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
    </div>
  </div>
</body>
</html>
  `;
};

/**
 * Email de réinitialisation de mot de passe
 * @param {Object} data - Données de l'email
 * @param {string} data.resetLink - Lien de réinitialisation avec token
 * @param {string} data.firstName - Prénom de l'utilisateur
 */
const getPasswordResetEmail = (data) => {
  const { resetLink, firstName = "" } = data;
  const greeting = firstName ? `Bonjour ${firstName},` : "Bonjour,";
  
  const content = `
    <h2>Réinitialisation de votre mot de passe</h2>
    <p>${greeting}</p>
    <p>Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
    <div style="text-align: center;">
      <a href="${resetLink}" class="button">Réinitialiser mon mot de passe</a>
    </div>
    <div class="info-box">
      <p><strong>⏱️ Ce lien est valide pendant 15 minutes.</strong></p>
      <p>Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email en toute sécurité.</p>
    </div>
    <p>Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :</p>
    <p style="word-break: break-all; color: #ffc107;">${resetLink}</p>
  `;
  
  return {
    subject: "Réinitialisation de votre mot de passe - B2CONNECT STORE",
    html: getBaseTemplate(content),
    text: `Réinitialisation de mot de passe\n\n${greeting}\n\nVous avez demandé la réinitialisation de votre mot de passe. Utilisez le lien suivant pour créer un nouveau mot de passe :\n\n${resetLink}\n\nCe lien est valide pendant 15 minutes.\n\nSi vous n'avez pas demandé cette réinitialisation, ignorez cet email.`
  };
};

/**
 * Email de bienvenue pour un nouvel utilisateur créé par l'admin
 * @param {Object} data - Données de l'email
 * @param {string} data.initLink - Lien d'initialisation avec token
 * @param {string} data.firstName - Prénom de l'utilisateur
 * @param {string} data.userEmail - Email de l'utilisateur
 */
const getNewUserEmail = (data) => {
  const { initLink, firstName, userEmail } = data;
  const content = `
    <h2>Bienvenue sur B2CONNECT STORE !</h2>
    <p>Bonjour ${firstName},</p>
    <p>Un compte a été créé pour vous sur B2CONNECT STORE. Pour commencer à utiliser votre compte, vous devez définir votre mot de passe.</p>
    <div class="info-box">
      <p><strong>📧 Votre adresse email :</strong> ${userEmail}</p>
    </div>
    <p>Cliquez sur le bouton ci-dessous pour définir votre mot de passe :</p>
    <div style="text-align: center;">
      <a href="${initLink}" class="button">Définir mon mot de passe</a>
    </div>
    <div class="info-box">
      <p><strong>⏱️ Ce lien est valide pendant 15 minutes.</strong></p>
      <p>Pour des raisons de sécurité, ce lien expirera après utilisation.</p>
    </div>
    <p>Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :</p>
    <p style="word-break: break-all; color: #ffc107;">${initLink}</p>
  `;
  
  return {
    subject: "Bienvenue sur B2CONNECT STORE - Activez votre compte",
    html: getBaseTemplate(content),
    text: `Bienvenue sur B2CONNECT STORE !\n\nBonjour ${firstName},\n\nUn compte a été créé pour vous. Votre email : ${userEmail}\n\nPour activer votre compte, définissez votre mot de passe en utilisant ce lien :\n\n${initLink}\n\nCe lien est valide pendant 15 minutes.`
  };
};

/**
 * Email de confirmation de commande
 * @param {Object} orderData - Données de la commande
 * @param {string} orderData.orderId - ID de la commande
 * @param {string} orderData.firstName - Prénom du client
 * @param {number} orderData.totalAmount - Montant total
 * @param {number} orderData.shippingFee - Frais de livraison
 * @param {number} orderData.subtotal - Sous-total
 * @param {Array} orderData.items - Articles de la commande
 */
const getOrderConfirmationEmail = (orderData) => {
  const { orderId, firstName, totalAmount, shippingFee, subtotal, items = [] } = orderData;
  
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name || 'Produit'}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${(item.price || 0).toFixed(2)} €</td>
    </tr>
  `).join('');
  
  const content = `
    <h2>Confirmation de votre commande</h2>
    <p>Bonjour ${firstName},</p>
    <p>Nous avons bien reçu votre commande et nous vous en remercions !</p>
    <div class="info-box">
      <p><strong>📦 Numéro de commande :</strong> #${orderId}</p>
    </div>
    <h3>Récapitulatif de votre commande :</h3>
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
      <thead>
        <tr style="background-color: #f8f8f8;">
          <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ffc107;">Article</th>
          <th style="padding: 10px; text-align: center; border-bottom: 2px solid #ffc107;">Quantité</th>
          <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ffc107;">Prix</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Sous-total :</td>
          <td style="padding: 10px; text-align: right;">${subtotal.toFixed(2)} €</td>
        </tr>
        <tr>
          <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Frais de livraison :</td>
          <td style="padding: 10px; text-align: right;">${shippingFee.toFixed(2)} €</td>
        </tr>
        <tr style="background-color: #fffaed;">
          <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold; font-size: 18px;">Total :</td>
          <td style="padding: 10px; text-align: right; font-weight: bold; font-size: 18px; color: #ffc107;">${totalAmount.toFixed(2)} €</td>
        </tr>
      </tfoot>
    </table>
    <p>Nous préparons votre commande avec soin. Vous recevrez un email de confirmation dès son expédition.</p>
    <p>Merci de votre confiance !</p>
  `;
  
  return {
    subject: `Confirmation de commande #${orderId} - B2CONNECT STORE`,
    html: getBaseTemplate(content),
    text: `Confirmation de commande\n\nBonjour ${firstName},\n\nNous avons bien reçu votre commande #${orderId}.\n\nMontant total : ${totalAmount.toFixed(2)} €\n\nNous préparons votre commande et vous tiendrons informé de son expédition.\n\nMerci de votre confiance !`
  };
};

/**
 * Email de notification de changement de statut de commande
 * @param {Object} data - Données du changement de statut
 * @param {string} data.orderId - ID de la commande
 * @param {string} data.firstName - Prénom du client
 * @param {string} data.status - Nouveau statut
 * @param {string} data.trackingNumber - Numéro de suivi (optionnel)
 */
const getOrderStatusEmail = (data) => {
  const { orderId, firstName, status, trackingNumber } = data;
  
  // Mapper les statuts en français avec des icônes et descriptions
  const statusMap = {
    pending: {
      label: "En attente de validation",
      icon: "⏳",
      description: "Votre commande est en cours de vérification par notre équipe."
    },
    approved: {
      label: "Validée",
      icon: "✅",
      description: "Votre commande a été validée et est en cours de préparation."
    },
    processing: {
      label: "En préparation",
      icon: "📦",
      description: "Votre commande est en cours de préparation dans nos entrepôts."
    },
    shipped: {
      label: "Expédiée",
      icon: "🚚",
      description: "Votre commande a été expédiée et est en route vers vous !"
    },
    delivered: {
      label: "Livrée",
      icon: "✅",
      description: "Votre commande a été livrée avec succès."
    },
    cancelled: {
      label: "Annulée",
      icon: "❌",
      description: "Votre commande a été annulée."
    }
  };
  
  const statusInfo = statusMap[status];
  
  const trackingHtml = trackingNumber ? `
    <div class="info-box">
      <p><strong>📍 Numéro de suivi :</strong> ${trackingNumber}</p>
      <p>Vous pouvez suivre votre colis avec ce numéro.</p>
    </div>
  ` : '';
  
  const content = `
    <h2>Mise à jour de votre commande</h2>
    <p>Bonjour ${firstName},</p>
    <p>Le statut de votre commande a été mis à jour.</p>
    <div class="info-box">
      <p><strong>📦 Commande :</strong> #${orderId}</p>
      <p><strong>${statusInfo.icon} Nouveau statut :</strong> ${statusInfo.label}</p>
    </div>
    <p>${statusInfo.description}</p>
    ${trackingHtml}
    <p>Merci de votre confiance !</p>
  `;
  
  return {
    subject: `Commande #${orderId} - ${statusInfo.label}`,
    html: getBaseTemplate(content),
    text: `Mise à jour de commande\n\nBonjour ${firstName},\n\nVotre commande #${orderId} est maintenant : ${statusInfo.label}\n\n${statusInfo.description}${trackingNumber ? `\n\nNuméro de suivi : ${trackingNumber}` : ''}\n\nMerci de votre confiance !`
  };
};

module.exports = {
  getPasswordResetEmail,
  getNewUserEmail,
  getOrderConfirmationEmail,
  getOrderStatusEmail,
};
