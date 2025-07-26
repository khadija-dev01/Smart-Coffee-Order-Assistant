let currentUser = null;
let userRole = null;
let securityLevel = null;

const COFFEE_PRICES = {
  espresso: 2.5,
  latte: 3.5,
  cappuccino: 4.0,
};

function startCoffeeOrder() {
  console.log("🔐 Starting Coffee Order Assistant...");

  if (!authenticateUser()) {
    return;
  }

  const orderDetails = takeOrder();
  if (!orderDetails) {
    return; // Stop if order fails
  }

  processBillSplitting(orderDetails);
}

function authenticateUser() {
  console.log("🔐 Authentication Phase Starting...");

  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    const username = prompt("🔐 Please enter your username (admin or user):");

    if (username === null) {
      alert("Login cancelled. Goodbye!");
      return false;
    }

    const password = prompt("🔐 Please enter your password:");

    if (password === null) {
      alert("Login cancelled. Goodbye!");
      return false;
    }

    if (validateCredentials(username, password)) {
      currentUser = username;
      userRole = username === "admin" ? "administrator" : "customer";
      securityLevel = username === "admin" ? "high" : "low";

      alert(
        `✅ Welcome ${username}!\nRole: ${userRole}\nSecurity Level: ${securityLevel}\n\nAccess granted to Coffee Order System!`
      );
      console.log(
        `✅ User authenticated: ${username} (${userRole}, ${securityLevel})`
      );
      return true;
    } else {
      attempts++;
      const remaining = maxAttempts - attempts;

      if (remaining > 0) {
        alert(
          `❌ Invalid credentials!\nAttempts remaining: ${remaining}\n\nValid usernames: admin, user\nPassword: 1234`
        );
      } else {
        alert(
          "❌ Maximum login attempts exceeded!\nAccess denied. Please contact support."
        );
        console.log("❌ Authentication failed - maximum attempts exceeded");
      }
    }
  }

  return false;
}

function validateCredentials(username, password) {
  const validUsers = ["admin", "user"];
  const validPassword = "1234";

  return (
    validUsers.includes(username.toLowerCase()) && password === validPassword
  );
}

function takeOrder() {
  console.log("☕ Order Taking Phase Starting...");

  try {
    const customerName = prompt("☕ What's your name?");
    if (!customerName || customerName.trim() === "") {
      alert("❌ Name is required to place an order!");
      return null;
    }

    const ageInput = prompt("🎂 What's your age?");
    const age = parseInt(ageInput);

    if (isNaN(age) || age < 1 || age > 120) {
      alert("❌ Please enter a valid age (1-120)!");
      return null;
    }

    const coffeeType = prompt(
      "☕ What type of coffee would you like?\n\nOptions:\n- espresso ($2.50)\n- latte ($3.50)\n- cappuccino ($4.00)\n\nPlease type your choice:"
    );

    if (
      !coffeeType ||
      !COFFEE_PRICES.hasOwnProperty(coffeeType.toLowerCase())
    ) {
      alert(
        "❌ Invalid coffee type! Please choose: espresso, latte, or cappuccino"
      );
      return null;
    }

    const selectedCoffee = coffeeType.toLowerCase();

    const quantityInput = prompt("📊 How many cups would you like?");
    const quantity = parseInt(quantityInput);

    if (isNaN(quantity) || quantity < 1 || quantity > 20) {
      alert("❌ Please enter a valid quantity (1-20 cups)!");
      return null;
    }

    const pricePerCup = COFFEE_PRICES[selectedCoffee];
    const originalTotal = pricePerCup * quantity;

    const isEligibleForDiscount = age < 18 || age > 60;
    const discountRate = isEligibleForDiscount ? 0.1 : 0;
    const discountAmount = originalTotal * discountRate;
    const finalTotal = originalTotal - discountAmount;

    const orderDetails = {
      customerName: customerName.trim(),
      age: age,
      coffeeType: selectedCoffee,
      quantity: quantity,
      pricePerCup: pricePerCup,
      originalTotal: originalTotal,
      discountRate: discountRate,
      discountAmount: discountAmount,
      finalTotal: finalTotal,
      isEligibleForDiscount: isEligibleForDiscount,
    };

    let orderSummary = `📋 ORDER SUMMARY\n`;
    orderSummary += `Customer: ${customerName}\n`;
    orderSummary += `Age: ${age}\n`;
    orderSummary += `Coffee: ${quantity} ${selectedCoffee}(s)\n`;
    orderSummary += `Price per cup: $${pricePerCup.toFixed(2)}\n`;
    orderSummary += `Original total: $${originalTotal.toFixed(2)}\n`;

    if (isEligibleForDiscount) {
      orderSummary += `Discount (10%): -$${discountAmount.toFixed(2)}\n`;
      orderSummary += `Reason: ${age < 18 ? "Under 18" : "Over 60"} discount\n`;
    }

    orderSummary += `Final total: $${finalTotal.toFixed(2)}`;

    alert(orderSummary);
    console.log("☕ Order details calculated:", orderDetails);

    return orderDetails;
  } catch (error) {
    alert("❌ Error processing your order. Please try again.");
    console.error("Error in takeOrder:", error);
    return null;
  }
}

function processBillSplitting(orderDetails) {
  console.log("🧾 Bill Splitting Phase Starting...");

  try {
    const peopleInput = prompt(
      "👥 How many people are splitting the bill?\n\nOptions: 1, 2, or 3 people"
    );
    const numberOfPeople = parseInt(peopleInput);

    if (![1, 2, 3].includes(numberOfPeople)) {
      alert("❌ Invalid number of people! Please choose 1, 2, or 3.");
      return;
    }

    const tipInput = prompt(
      "💰 What tip percentage would you like to add?\n\nOptions:\n- 0% (No tip)\n- 5% (Standard)\n- 10% (Good service)\n- 15% (Excellent service)\n\nPlease enter: 0, 5, 10, or 15"
    );
    const tipPercentage = parseInt(tipInput);

    if (![0, 5, 10, 15].includes(tipPercentage)) {
      alert("❌ Invalid tip percentage! Please choose: 0, 5, 10, or 15");
      return;
    }

    const subtotal = orderDetails.finalTotal;
    const tipAmount = subtotal * (tipPercentage / 100);
    const totalWithTip = subtotal + tipAmount;
    const amountPerPerson = totalWithTip / numberOfPeople;

    let finalBill = `🧾 FINAL BILL SUMMARY\n\n`;
    finalBill += `Hello ${orderDetails.customerName}!\n`;
    finalBill += `You ordered ${orderDetails.quantity} ${orderDetails.coffeeType}(s).\n\n`;
    finalBill += `📊 PRICING BREAKDOWN:\n`;
    finalBill += `Original total: $${orderDetails.originalTotal.toFixed(2)}\n`;

    if (orderDetails.isEligibleForDiscount) {
      finalBill += `Discount: $${orderDetails.discountAmount.toFixed(2)}\n`;
    }

    finalBill += `Subtotal: $${subtotal.toFixed(2)}\n`;
    finalBill += `Tip (${tipPercentage}%): $${tipAmount.toFixed(2)}\n`;
    finalBill += `Total with Tip: $${totalWithTip.toFixed(2)}\n\n`;

    if (numberOfPeople > 1) {
      finalBill += `Split between ${numberOfPeople} people: $${amountPerPerson.toFixed(
        2
      )} each\n\n`;
    }

    finalBill += `💳 Amount to pay: $${amountPerPerson.toFixed(
      2
    )} per person\n\n`;
    finalBill += `Thank you for visiting our coffee shop!\n`;
    finalBill += `☕ Enjoy your ${orderDetails.coffeeType}!`;

    alert(finalBill);

    console.log("🧾 Final transaction details:", {
      ...orderDetails,
      numberOfPeople,
      tipPercentage,
      tipAmount: tipAmount.toFixed(2),
      totalWithTip: totalWithTip.toFixed(2),
      amountPerPerson: amountPerPerson.toFixed(2),
    });

    const anotherOrder = confirm("Would you like to place another order?");
    if (anotherOrder) {
      startCoffeeOrder();
    } else {
      alert(
        "Thank you for using Smart Coffee Order Assistant! Have a great day! ☕"
      );
    }
  } catch (error) {
    alert("❌ Error processing bill splitting. Please try again.");
    console.error("Error in processBillSplitting:", error);
  }
}

function displayWelcomeMessage() {
  console.log(`
    ☕ SMART COFFEE ORDER ASSISTANT ☕
    ================================
    
    Features:
    🔐 Secure user authentication
    ☕ Coffee order management
    💰 Bill splitting with tips
    📊 Age-based discounts
    
    Ready to serve you!
    `);
}

displayWelcomeMessage();
