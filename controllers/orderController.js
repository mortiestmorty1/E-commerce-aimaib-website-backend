const Order = require('../models/Order');


let placeOrder = (req, res) => {
    console.log("placeOrder controller called!");
    const { user, products, paymentType, totalAmount } = req.body;

    const newOrder = new Order({
        user,
        products,
        paymentType,
        totalAmount
    });

    newOrder.save()
        .then(order => {
            res.status(201).send({ message: "Order placed successfully!", order });
        })
        .catch(err => {
            res.status(400).send({ message: "Error placing the order", error: err });
        });
};


let cancelOrder = (req, res) => {
    console.log("cancelOrder controller called!");
    const { orderId } = req.params;

    Order.findById(orderId)
        .then(order => {
            if (!order) {
                return res.status(404).send({ message: "Order not found" });
            }
            if (order.status !== 'pending') {
                return res.status(400).send({ message: "Order cannot be cancelled unless it is pending" });
            }
            order.status = 'cancelled';
            order.save()
                .then(updatedOrder => {
                    res.status(200).send({ message: "Order cancelled successfully", order: updatedOrder });
                })
                .catch(err => {
                    res.status(500).send({ message: "Error cancelling the order", error: err });
                });
        })
        .catch(err => {
            res.status(500).send({ message: "Error finding the order", error: err });
        });
};


let deleteOrder = (req, res) => {
    console.log("deleteOrder controller called!");
    const { orderId } = req.params;

    Order.findByIdAndRemove(orderId)
        .then(order => {
            if (!order) {
                return res.status(404).send({ message: "Order not found" });
            }
            if (order.status !== 'cancelled') {
                return res.status(400).send({ message: "Only cancelled orders can be deleted" });
            }
            res.status(200).send({ message: "Order deleted successfully" });
        })
        .catch(err => {
            res.status(500).send({ message: "Error deleting the order", error: err });
        });
};

// Check order progress
let checkOrderProgress = (req, res) => {
    console.log("checkOrderProgress controller called!");
    const { orderId } = req.params;

    Order.findById(orderId)
        .then(order => {
            if (!order) {
                return res.status(404).send({ message: "Order not found" });
            }
            res.status(200).send({ order });
        })
        .catch(err => {
            res.status(500).send({ message: "Error checking the order progress", error: err });
        });
};


let updateOrderStatus = (req, res) => {
    console.log("updateOrderStatus controller called!");
    const { orderId } = req.params;
    const { status } = req.body;

    Order.findByIdAndUpdate(orderId, { status }, { new: true })
        .then(updatedOrder => {
            if (!updatedOrder) {
                return res.status(404).send({ message: "Order not found" });
            }
            res.status(200).send({ message: "Order status updated successfully", order: updatedOrder });
        })
        .catch(err => {
            res.status(500).send({ message: "Error updating the order status", error: err });
        });
};

module.exports = {
    placeOrder,
    cancelOrder,
    deleteOrder,
    checkOrderProgress,
    updateOrderStatus
};
