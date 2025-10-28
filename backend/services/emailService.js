const nodemailer = require('nodemailer');

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify transporter configuration
transporter.verify(function (error, success) {
  if (error) {
    console.error('❌ Email transporter verification failed:', error);
  } else {
    console.log('✅ Email server is ready to send messages');
  }
});

const sendEmail = async (to, subject, html) => {
  try {
    console.log(`📧 Attempting to send email to: ${to}`);
    console.log(`   Subject: ${subject}`);
    console.log(`   From: ${process.env.EMAIL_USER}`);
    
    const mailOptions = {
      from: `"QuickSnack" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: html
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email sent successfully via Nodemailer!');
    console.log(`   Message ID: ${info.messageId}`);
    console.log(`   To: ${to}`);
    console.log(`   Response: ${info.response}`);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Nodemailer email sending failed!');
    console.error(`   To: ${to}`);
    console.error(`   Error: ${error?.message}`);
    console.error(`   Full error:`, error);
    
    return { success: false, error: error?.message || 'Failed to send email' };
  }
};

const generateOTPEmail = (otp, purpose = 'Verification') => {
  const title = purpose === 'Password Reset' ? 'Password Reset OTP' : 'Your QuickSnack OTP';
  const message = purpose === 'Password Reset' 
    ? 'Use this OTP to reset your password:' 
    : 'Your OTP is:';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .otp-code { font-size: 24px; font-weight: bold; color: #6B90A7; text-align: center; padding: 20px; background: #F1F5F9; border-radius: 8px; margin: 20px 0; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>${title}</h2>
        <p>${message}</p>
        <div class="otp-code">${otp}</div>
        <p>This OTP is valid for 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
        
        <div class="footer">
          <p><strong>QuickSnack</strong><br>
          Founder: Vyom Verma<br>
          Email: vyomverma2873@gmail.com<br>
          Phone: 8766355495</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const generateWelcomeEmail = (name) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #B9F8CF, #BFDBFF); padding: 30px; border-radius: 8px; text-align: center; margin-bottom: 30px; }
        .header h1 { color: #6B90A7; margin: 0; }
        .steps { background: #F1F5F9; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .steps ul { margin: 0; padding-left: 20px; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to QuickSnack!</h1>
        </div>
        
        <p>Hi ${name || 'Customer'},</p>
        
        <p>Thanks for visiting QuickSnack! We're thrilled that you joined us.</p>
        
        <p>QuickSnack brings snacks, groceries and daily essentials to your door quickly.</p>
        
        <div class="steps">
          <h3>Get started:</h3>
          <ul>
            <li>Add your address</li>
            <li>Browse categories</li>
            <li>Place your first order — enjoy fast delivery!</li>
          </ul>
        </div>
        
        <p>Best wishes,<br>
        <strong>Vyom Verma</strong><br>
        Founder, QuickSnack</p>
        
        <div class="footer">
          <p><strong>QuickSnack</strong><br>
          Founder: Vyom Verma<br>
          Email: vyomverma2873@gmail.com<br>
          Phone: 8766355495</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const generateOrderConfirmationEmail = (name, orderId, items, amount, shippingAddress) => {
  const itemsList = items.map(item => 
    `<tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">₹${item.price}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.qty}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">₹${(item.price * item.qty).toFixed(2)}</td>
    </tr>`
  ).join('');

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
        .container { max-width: 650px; margin: 0 auto; background-color: white; }
        .header { background: linear-gradient(135deg, #B9F8CF, #FFD6A8, #BFDBFF); padding: 40px 30px; text-align: center; color: white; }
        .header h1 { color: #6B90A7; margin: 0; font-size: 32px; font-weight: bold; }
        .header p { color: #6B90A7; margin: 10px 0 0 0; font-size: 16px; }
        .content { padding: 30px; }
        .invoice-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-bottom: 2px solid #B9F8CF; padding-bottom: 20px; }
        .invoice-details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .order-id { font-size: 24px; font-weight: bold; color: #6B90A7; }
        .date { color: #666; font-size: 14px; }
        .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .items-table th { background: #6B90A7; color: white; padding: 12px 8px; text-align: left; }
        .items-table td { padding: 12px 8px; border-bottom: 1px solid #eee; }
        .total-section { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .total-row { display: flex; justify-content: space-between; margin: 8px 0; }
        .total-final { font-size: 20px; font-weight: bold; color: #6B90A7; border-top: 2px solid #B9F8CF; padding-top: 10px; }
        .address-section { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .thank-you { background: linear-gradient(135deg, #B9F8CF, #BFDBFF); padding: 25px; border-radius: 8px; text-align: center; margin: 30px 0; }
        .thank-you h2 { color: #6B90A7; margin: 0 0 10px 0; }
        .thank-you p { color: #6B90A7; margin: 5px 0; }
        .contact-info { background: #6B90A7; color: white; padding: 25px; text-align: center; }
        .contact-info h3 { margin: 0 0 15px 0; }
        .contact-info p { margin: 5px 0; }
        .footer { background: #2c3e50; color: white; padding: 20px; text-align: center; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Order Confirmation & Invoice</h1>
          <p>Thank you for choosing QuickSnack!</p>
        </div>
        
        <div class="content">
          <div class="invoice-header">
            <div>
              <div class="order-id">Invoice #${orderId}</div>
              <div class="date">Date: ${currentDate}</div>
            </div>
            <div style="text-align: right;">
              <strong style="color: #6B90A7; font-size: 18px;">QuickSnack</strong><br>
              <span style="color: #666;">Fresh • Fast • Reliable</span>
            </div>
          </div>
          
          <p style="font-size: 18px; color: #6B90A7;"><strong>Dear ${name},</strong></p>
          
          <p>🙏 <strong>Thank you for shopping with QuickSnack!</strong> We're thrilled to have you as our valued customer. Your order has been successfully placed and we're already working on getting your fresh groceries ready for delivery.</p>
          
          <div class="invoice-details">
            <h3 style="color: #6B90A7; margin-top: 0;">📦 Order Details</h3>
            <table class="items-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th style="text-align: center;">Price</th>
                  <th style="text-align: center;">Qty</th>
                  <th style="text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsList}
              </tbody>
            </table>
          </div>
          
          <div class="total-section">
            <h3 style="color: #6B90A7; margin-top: 0;">💰 Payment Summary</h3>
            <div class="total-row">
              <span>Subtotal:</span>
              <span>₹${amount}</span>
            </div>
            <div class="total-row">
              <span>Delivery Fee:</span>
              <span>${amount >= 299 ? 'FREE' : '₹25'}</span>
            </div>
            <div class="total-row total-final">
              <span>Total Amount:</span>
              <span>₹${amount >= 299 ? amount : amount + 25}</span>
            </div>
          </div>
          
          ${shippingAddress ? `
          <div class="address-section">
            <h3 style="color: #6B90A7; margin-top: 0;">🏠 Delivery Address</h3>
            <p><strong>${shippingAddress.label || 'Delivery Address'}</strong></p>
            <p>${shippingAddress.address}<br>
            ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.pincode}</p>
          </div>
          ` : ''}
          
          <div class="thank-you">
            <h2>🚀 What's Next?</h2>
            <p>✅ Your order is being prepared with love and care</p>
            <p>📱 You'll receive SMS updates on your order status</p>
            <p>🚚 Expected delivery: Within 30 minutes</p>
            <p>💬 Need help? Just reply to this email or call us!</p>
          </div>
          
          <p style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107;">
            <strong>💡 Pro Tip:</strong> Orders above ₹299 get FREE delivery! Add more items to your next order to save on delivery charges.
          </p>
          
          <p>We're committed to delivering fresh, quality products right to your doorstep. Thank you for trusting QuickSnack with your grocery needs!</p>
          
          <p style="margin-top: 30px;">
            <strong>Happy Shopping! 🛒</strong><br>
            <strong style="color: #6B90A7;">Team QuickSnack</strong>
          </p>
        </div>
        
        <div class="contact-info">
          <h3>📞 Need Help? We're Here!</h3>
          <p><strong>Vyom Verma</strong> - Founder & CEO</p>
          <p>📧 vyomverma2873@gmail.com</p>
          <p>📱 +91 8766355495</p>
          <p>🌐 Available 24/7 for your support</p>
        </div>
        
        <div class="footer">
          <p>© 2024 QuickSnack - Fresh Groceries, Fast Delivery</p>
          <p>This is an automated invoice. Please keep this for your records.</p>
          <p>Follow us for updates and offers! 📱</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const generateOrderStatusEmail = (name, orderId, status, items, amount) => {
  const statusMessages = {
    confirmed: {
      title: '✅ Order Confirmed!',
      message: 'Great news! Your QuickSnack order has been confirmed and is being prepared.',
      icon: '✅',
      color: '#3B82F6',
      nextStep: 'We are preparing your order with care. You will be notified when it is dispatched!'
    },
    dispatched: {
      title: '🚚 Your Order is On The Way!',
      message: 'Great news! Your QuickSnack order has been dispatched and is on its way to you.',
      icon: '🚚',
      color: '#8B5CF6',
      nextStep: 'Your delivery partner will contact you shortly. Please keep your phone handy!'
    },
    delivered: {
      title: '✅ Order Delivered Successfully!',
      message: 'Awesome! Your QuickSnack order has been delivered successfully.',
      icon: '✅',
      color: '#10B981',
      nextStep: 'We hope you enjoy your fresh groceries! Please rate your experience.'
    },
    cancelled: {
      title: '❌ Order Cancelled',
      message: 'Your QuickSnack order has been cancelled as requested.',
      icon: '❌',
      color: '#EF4444',
      nextStep: 'If you have any questions about this cancellation, please contact our support team.'
    }
  };

  const statusInfo = statusMessages[status];
  if (!statusInfo) return null;

  const itemsList = items.map(item => 
    `<tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">₹${item.price}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.qty}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">₹${(item.price * item.qty).toFixed(2)}</td>
    </tr>`
  ).join('');

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
        .container { max-width: 650px; margin: 0 auto; background-color: white; }
        .header { background: linear-gradient(135deg, ${statusInfo.color}, #B9F8CF); padding: 40px 30px; text-align: center; color: white; }
        .header h1 { color: white; margin: 0; font-size: 28px; font-weight: bold; }
        .header p { color: white; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9; }
        .content { padding: 30px; }
        .status-banner { background: linear-gradient(135deg, ${statusInfo.color}20, ${statusInfo.color}10); padding: 25px; border-radius: 12px; text-align: center; margin: 20px 0; border-left: 4px solid ${statusInfo.color}; }
        .status-banner h2 { color: ${statusInfo.color}; margin: 0 0 10px 0; font-size: 24px; }
        .status-banner p { color: #666; margin: 5px 0; font-size: 16px; }
        .order-details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .order-id { font-size: 20px; font-weight: bold; color: #6B90A7; }
        .date { color: #666; font-size: 14px; }
        .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .items-table th { background: #6B90A7; color: white; padding: 12px 8px; text-align: left; }
        .items-table td { padding: 12px 8px; border-bottom: 1px solid #eee; }
        .total-section { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: right; }
        .total-amount { font-size: 18px; font-weight: bold; color: #6B90A7; }
        .next-steps { background: linear-gradient(135deg, #B9F8CF20, #BFDBFF20); padding: 20px; border-radius: 8px; margin: 20px 0; }
        .contact-info { background: #6B90A7; color: white; padding: 25px; text-align: center; }
        .contact-info h3 { margin: 0 0 15px 0; }
        .contact-info p { margin: 5px 0; }
        .footer { background: #2c3e50; color: white; padding: 20px; text-align: center; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${statusInfo.icon} ${statusInfo.title}</h1>
          <p>Order #${orderId} Status Update</p>
        </div>
        
        <div class="content">
          <p style="font-size: 18px; color: #6B90A7;"><strong>Dear ${name},</strong></p>
          
          <div class="status-banner">
            <h2>${statusInfo.icon} ${statusInfo.title}</h2>
            <p>${statusInfo.message}</p>
            <p style="font-weight: bold; color: ${statusInfo.color};">${statusInfo.nextStep}</p>
          </div>
          
          <div class="order-details">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
              <div>
                <div class="order-id">Order #${orderId}</div>
                <div class="date">Updated: ${currentDate}</div>
              </div>
              <div style="text-align: right;">
                <span style="background: ${statusInfo.color}; color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; text-transform: uppercase; font-size: 12px;">
                  ${status}
                </span>
              </div>
            </div>
            
            <h3 style="color: #6B90A7; margin-top: 20px;">📦 Order Items</h3>
            <table class="items-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th style="text-align: center;">Price</th>
                  <th style="text-align: center;">Qty</th>
                  <th style="text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsList}
              </tbody>
            </table>
            
            <div class="total-section">
              <div class="total-amount">Total Amount: ₹${amount}</div>
            </div>
          </div>
          
          <div class="next-steps">
            <h3 style="color: #6B90A7; margin-top: 0;">💡 What's Next?</h3>
            ${status === 'confirmed' ? `
              <p>👨‍🍳 Our team is carefully preparing your order</p>
              <p>📦 You'll be notified when your order is dispatched</p>
              <p>⏰ Expected preparation time: 15-20 minutes</p>
              <p>💬 Contact us if you need to make any changes</p>
            ` : status === 'dispatched' ? `
              <p>🚚 Your order is on its way to your delivery address</p>
              <p>📱 Our delivery partner will call you before arrival</p>
              <p>⏰ Expected delivery: Within 30 minutes</p>
              <p>💬 Track your order or contact us if you need any help</p>
            ` : status === 'delivered' ? `
              <p>🎉 Thank you for choosing QuickSnack!</p>
              <p>⭐ We'd love to hear about your experience</p>
              <p>🛒 Shop again for fresh groceries and fast delivery</p>
              <p>💬 Contact us if you have any feedback or concerns</p>
            ` : status === 'cancelled' ? `
              <p>💔 We're sorry your order was cancelled</p>
              <p>💰 Any payments will be refunded within 3-5 business days</p>
              <p>🛒 You can place a new order anytime</p>
              <p>💬 Contact us if you have any questions about the cancellation</p>
            ` : `
              <p>📦 Your order status has been updated</p>
              <p>💬 Contact us if you have any questions</p>
            `}
          </div>
          
          <p>Thank you for choosing QuickSnack for your grocery needs. We're committed to providing you with the freshest products and fastest delivery!</p>
          
          <p style="margin-top: 30px;">
            <strong>Happy Shopping! 🛒</strong><br>
            <strong style="color: #6B90A7;">Team QuickSnack</strong>
          </p>
        </div>
        
        <div class="contact-info">
          <h3>📞 Need Help? We're Here!</h3>
          <p><strong>Vyom Verma</strong> - Founder & CEO</p>
          <p>📧 vyomverma2873@gmail.com</p>
          <p>📱 +91 8766355495</p>
          <p>🌐 Available 24/7 for your support</p>
        </div>
        
        <div class="footer">
          <p>© 2024 QuickSnack - Fresh Groceries, Fast Delivery</p>
          <p>This is an automated notification. Please keep this for your records.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = {
  sendEmail,
  generateOTPEmail,
  generateWelcomeEmail,
  generateOrderConfirmationEmail,
  generateOrderStatusEmail
};
