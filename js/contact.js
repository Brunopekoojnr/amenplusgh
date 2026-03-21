// Contact form handler
function handleContactForm(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // Format WhatsApp message
    const whatsappMessage = `*New Contact Form Message*%0A%0A*Name:* ${name}%0A*Email:* ${email}%0A*Phone:* ${phone || 'Not provided'}%0A*Subject:* ${subject}%0A*Message:* ${message}`;
    
    // Send to customer service (Lesly)
    window.open(`https://wa.me/233201686831?text=${whatsappMessage}`, '_blank');
    
    alert('Thank you! You will be redirected to WhatsApp to send your message.');
    document.getElementById('contact-form').reset();
}

