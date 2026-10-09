const express = require("express");

const router = express.Router();
const auth = require("./auth");
const { clothingModel } = require("../mongo/home");

router.post("/swap/value", auth, async (req, res) => {
    try {
        const { myClothId, targetClothId } = req.body;
        const myItem = await clothingModel.findById(myClothId);
        const targetItem = await clothingModel.findById(targetClothId);

        if (!myItem || !targetItem) {
            return res.status(404).json({
                success: false,
                message: "Item not found"
            });
        }
        const myScore = Number(myItem.swapValue) || 100;
        const targetScore = Number(targetItem.swapValue) || 100;
        const difference = Math.abs(myScore - targetScore);
        const maxScore = Math.max(myScore, targetScore, 1);
        const matchPercentage = Math.max(15, Math.min(100, Math.round(100 - (difference / maxScore) * 85)));
        
        let recommendation = "";
        let advice = "";

        if (difference <= 40) {
            recommendation = "Excellent Match";
            advice = "Perfect barter balance! Both garments have equitable circular value.";
        } else if (difference <= 120) {
            recommendation = "Fair Match";
            advice = "Fair exchange! Values are close. You can negotiate small perks or balance directly in chat.";
        } else {
            recommendation = "Unfair Swap";
            advice = "Notable valuation disparity. Consider pairing with an accessory or agreeing on fair terms in chat.";
        }

        res.json({
            success: true,
            myScore,
            targetScore,
            difference,
            recommendation,
            matchPercentage,
            advice,
            myItem,
            targetItem
        });
    }

    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

router.post("/swap/estimate", async (req, res) => {
    try {
        const { category = "Shirt", brand = "Generic", condition = "Excellent", originalPrice } = req.body;

        // Base points per garment category
        const categoryBaseMap = {
            "Jacket": 280,
            "Outerwear": 280,
            "Dress": 240,
            "Gown": 260,
            "Jeans": 200,
            "Denim": 200,
            "Hoodie": 190,
            "Sweatshirt": 180,
            "Kurti": 160,
            "Ethnic Wear": 170,
            "Shirt": 150,
            "Trousers": 150,
            "Chinos": 150,
            "T-Shirt": 110,
            "Skirt": 140,
            "Shoes": 220,
            "Sneakers": 230,
            "Accessories": 90
        };

        const baseVal = categoryBaseMap[category] || 150;

        // Brand Tier multiplier
        const luxuryBrands = ["gucci", "prada", "burberry", "louis vuitton", "chanel", "armani", "dior", "balenciaga", "versace", "saint laurent"];
        const premiumBrands = ["zara", "nike", "adidas", "levi's", "levis", "biba", "tommy hilfiger", "calvin klein", "superdry", "under armour", "puma", "mango", "diesel"];
        const standardBrands = ["h&m", "uniqlo", "marks & spencer", "allen solly", "peter england", "fabindia", "westside", "max", "roadster"];

        const brandLower = (brand || "").toLowerCase().trim();

        let brandMultiplier = 1.0;
        let tier = "Standard Streetwear";

        if (luxuryBrands.some(b => brandLower.includes(b))) {
            brandMultiplier = 2.4;
            tier = "Haute Couture / Luxury";
        } else if (premiumBrands.some(b => brandLower.includes(b))) {
            brandMultiplier = 1.5;
            tier = "Premium / Designer";
        } else if (standardBrands.some(b => brandLower.includes(b))) {
            brandMultiplier = 1.2;
            tier = "Retail Standard";
        }

        // Condition Retention factor
        const conditionFactorMap = {
            "New": 1.0,
            "Brand New": 1.0,
            "Like New": 0.88,
            "Excellent": 0.72,
            "Good": 0.58,
            "Fair": 0.42
        };

        const conditionFactor = conditionFactorMap[condition] || 0.70;

        let computedValue = Math.round(baseVal * brandMultiplier * conditionFactor);

        if (originalPrice && !isNaN(originalPrice) && Number(originalPrice) > 0) {
            const pricePoints = Math.round(Number(originalPrice) * 0.12 * conditionFactor);
            computedValue = Math.round((computedValue * 0.5) + (pricePoints * 0.5));
        }

        // Clamp to realistic range
        computedValue = Math.max(50, Math.min(1000, Math.round(computedValue / 5) * 5));

        res.json({
            success: true,
            estimatedValue: computedValue,
            tier,
            conditionFactor: `${Math.round(conditionFactor * 100)}%`,
            baseScore: baseVal
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

module.exports = router;