const express = require("express");

const router = express.Router();

const { clothingModel } = require("../mongo/home");

router.get("/home", async (req, res) => {
    try {
        const { location, category, search } = req.query;
        const andConditions = [];

        // 1. Location filter
        if (location && location.trim().toLowerCase() !== "all" && location.trim() !== "") {
            andConditions.push({
                location: { $regex: new RegExp(`^${location.trim()}$`, "i") }
            });
        }

        // 2. Category filter
        if (category && category.trim().toLowerCase() !== "all" && category.trim() !== "") {
            const cat = category.trim().toLowerCase();
            const catOrClauses = [];

            // Category-specific semantic mappings across title & description
            if (cat === "men" || cat === "mens") {
                catOrClauses.push({ category: /\b(men|mens)\b/i });
                catOrClauses.push({ title: /\b(men|mens)\b/i });
            } else if (cat === "women" || cat === "womens") {
                catOrClauses.push({ category: /\b(women|womens)\b/i });
                catOrClauses.push({ title: /\b(women|womens)\b/i });
            } else {
                // Direct / partial match on category field
                catOrClauses.push({ category: { $regex: new RegExp(cat, "i") } });

                if (cat === "jeans") {
                    catOrClauses.push({ title: /\bjeans?\b/i });
                    catOrClauses.push({ description: /\bjeans?\b/i });
                } else if (cat === "t-shirt" || cat === "tshirt") {
                    catOrClauses.push({ title: /\b(t-shirt|tshirt|t\s*shirt|tee)\b/i });
                    catOrClauses.push({ description: /\b(t-shirt|tshirt|t\s*shirt|tee)\b/i });
                } else if (cat === "shirt") {
                    catOrClauses.push({
                        $and: [
                            { title: /\bshirts?\b/i },
                            { title: { $not: /\b(t-shirt|tshirt|tee)\b/i } }
                        ]
                    });
                    catOrClauses.push({
                        $and: [
                            { category: /\bshirts?\b/i },
                            { category: { $not: /\b(t-shirt|tshirt|tee)\b/i } }
                        ]
                    });
                } else if (cat === "dress") {
                    catOrClauses.push({ title: /\b(dress|gown|one\s*piece|onepiece|frock|maxi)\b/i });
                    catOrClauses.push({ description: /\b(dress|gown|one\s*piece|onepiece|frock|maxi)\b/i });
                } else if (cat === "jacket") {
                    catOrClauses.push({ title: /\b(jacket|coat|outerwear|blazer|bomber|parka)\b/i });
                    catOrClauses.push({ description: /\b(jacket|coat|outerwear|blazer|bomber|parka)\b/i });
                } else if (cat === "hoodie") {
                    catOrClauses.push({ title: /\b(hoodie|sweatshirt|sweater|pullover)\b/i });
                    catOrClauses.push({ description: /\b(hoodie|sweatshirt|sweater|pullover)\b/i });
                } else if (cat === "kurti") {
                    catOrClauses.push({ title: /\b(kurti|kurtis|kurta|kurtas|anarkali|salwar|ethnic|dupatta)\b/i });
                    catOrClauses.push({ description: /\b(kurti|kurtis|kurta|kurtas|anarkali|salwar|ethnic|dupatta)\b/i });
                } else if (cat === "trousers") {
                    catOrClauses.push({ title: /\b(trouser|trousers|pant|pants|chino|chinos|cargo|bottoms?)\b/i });
                    catOrClauses.push({ description: /\b(trouser|trousers|pant|pants|chino|chinos|cargo|bottoms?)\b/i });
                } else if (cat === "shoes") {
                    catOrClauses.push({ title: /\b(shoe|shoes|sneaker|sneakers|boot|boots|footwear|loafers?)\b/i });
                    catOrClauses.push({ description: /\b(shoe|shoes|sneaker|sneakers|boot|boots|footwear|loafers?)\b/i });
                } else {
                    catOrClauses.push({ title: { $regex: new RegExp(cat, "i") } });
                }
            }

            andConditions.push({ $or: catOrClauses });
        }

        // 3. Search text query
        if (search && search.trim() !== "") {
            const regex = new RegExp(search.trim(), "i");
            andConditions.push({
                $or: [
                    { title: regex },
                    { brand: regex },
                    { category: regex },
                    { location: regex },
                    { description: regex }
                ]
            });
        }

        const query = andConditions.length > 0 ? { $and: andConditions } : {};
        const clothes = await clothingModel.find(query).sort({ createdAt: -1 });
        res.status(200).json(clothes);
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

module.exports = router;