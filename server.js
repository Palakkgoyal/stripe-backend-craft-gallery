const dotenv = require("dotenv")
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const PORT = process.env.PORT

const express = require('express');
var cors = require('cors');
const stripe = require('stripe')(STRIPE_SECRET_KEY);

dotenv.config({path: "./config.env"});


const app = express();
app.use(cors({
    origin: "https://mahi-craft-gallery.web.app"
}));
app.use(express.static("public"));
app.use(express.json());

app.post("/checkout", async (req, res) => {
    /*
    req.body.items
    [
        {
            id: 1,
            quantity: 3
        }
    ]

    stripe wants
    [
        {
            price: 1,
            quantity: 3
        }
    ]
    */
    console.log(req.body);
    const items = req.body.items;
    let lineItems = [];
    items.forEach((item)=> {
        lineItems.push(
            {
                price: item.id,
                quantity: item.quantity
            }
        )
    });

    const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: 'payment',
        success_url: "http://localhost:5173/success",
        cancel_url: "http://localhost:5173/cancel"
    });

    res.send(JSON.stringify({
        url: session.url
    }));
});

app.listen(PORT, () => console.log("Listening on port"));