// Team Modal functionality
const modal = document.getElementById('teamModal');
const closeModal = document.querySelector('.close-modal');

function openTeamModal(key) {
    const member = teamBios[key];
    if (!member) return;
    
    document.getElementById('modal-img').src = member.image;
    document.getElementById('modal-name').textContent = member.displayName || member.name;
    document.getElementById('modal-role').textContent = member.role;
    document.getElementById('modal-bio').textContent = member.bio;
    
    const funFactEl = document.getElementById('modal-funfact');
    if (member.funFact) {
        funFactEl.textContent = member.funFact;
        funFactEl.style.display = 'block';
    } else {
        funFactEl.style.display = 'none';
    }
    
    document.getElementById('modal-phone').textContent = member.phone;
    document.getElementById('modal-email').textContent = member.email;
    document.getElementById('modal-handles').textContent = member.handles;
    
    const whatsappLink = document.getElementById('modal-whatsapp');
    const callLink = document.getElementById('modal-call');
    
    if (member.whatsapp) {
        whatsappLink.href = `https://wa.me/${member.whatsapp}`;
        whatsappLink.style.display = 'inline-flex';
    } else {
        whatsappLink.style.display = 'none';
    }
    
    if (member.phone && member.phone !== 'N/A') {
        callLink.href = `tel:${member.phone.replace(/\s/g, '')}`;
        callLink.style.display = 'inline-flex';
    } else {
        callLink.style.display = 'none';
    }
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

closeModal.addEventListener('click', function() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

window.addEventListener('click', function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

