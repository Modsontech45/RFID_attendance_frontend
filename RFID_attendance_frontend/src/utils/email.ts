// Email utility functions
export interface EmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
  school?: string;
  plan?: string;
}

export const sendContactEmail = async (emailData: EmailData): Promise<{ success: boolean; message: string }> => {
  try {
    // Since EmailJS is not configured, use mailto fallback directly
    console.log('Using mailto fallback for email sending');
    
    const subject = encodeURIComponent(emailData.subject);
    const body = encodeURIComponent(
      `Name: ${emailData.name}\n` +
      `Email: ${emailData.email}\n` +
      `School: ${emailData.school || 'Not specified'}\n` +
      `Plan: ${emailData.plan || 'Not specified'}\n\n` +
      `Message:\n${emailData.message}`
    );
    
    const mailtoLink = `mailto:tandemodson41@gmail.com?subject=${subject}&body=${body}`;
    window.open(mailtoLink, '_blank');
    
    return { 
      success: true, 
      message: 'Email client opened successfully! Please send the email from your default email application.' 
    };
  } catch (error) {
    console.error('Email fallback error:', error);
    return { success: false, message: 'Unable to open email client. Please contact us directly at tandemodson41@gmail.com' };
  }
};

// Alternative backend approach (if you want to implement server-side email)
export const sendEmailViaBackend = async (emailData: EmailData): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...emailData,
        to: 'tandemodson41@gmail.com'
      })
    });

    const result = await response.json();
    
    if (response.ok) {
      return { success: true, message: result.message || 'Email sent successfully!' };
    } else {
      throw new Error(result.error || 'Failed to send email');
    }
  } catch (error) {
    console.error('Backend email error:', error);
    return { success: false, message: 'Failed to send email. Please try again.' };
  }
};