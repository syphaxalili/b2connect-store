const { Payment, Order } = require('../models/mysql');

const createPayment = async (req, res) => {
  const { order_id, amount, payment_method } = req.body;

  try {
    // Vérifier que la commande existe et appartient à l'utilisateur
    const order = await Order.findOne({
      where: { order_id, user_id: req.user.user_id }
    });
    if (!order) {
      return res.status(404).json({ error: 'Commande non trouvée ou non autorisée' });
    }

    // Vérifier que le montant correspond
    if (order.total_amount !== parseFloat(amount)) {
      return res.status(400).json({ error: 'Montant incorrect' });
    }

    // Créer le paiement (simulé, sans Stripe pour l'instant)
    const payment = await Payment.create({
      order_id,
      amount,
      payment_method,
      status: 'completed' // À remplacer par logique Stripe
    });

    // Mettre à jour le statut de la commande
    await order.update({ status: 'shipped' });

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createPayment
};
