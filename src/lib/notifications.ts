import { PushNotifications } from '@capacitor/push-notifications';
import { Device } from '@capacitor/device';
import { Capacitor } from '@capacitor/core';

/**
 * Service pour gérer les notifications Push et Email
 */
export const NotificationService = {
  /**
   * Initialise les notifications push pour le mobile
   */
  async initPush() {
    if (Capacitor.getPlatform() === 'web') {
      console.log('Push notifications non supportées sur le web pour le moment.');
      return;
    }

    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
      throw new Error('Permission de notification refusée');
    }

    await PushNotifications.register();

    // Listeners
    PushNotifications.addListener('registration', (token) => {
      console.log('Push registration success, token: ' + token.value);
      // Ici, on sauvegarderait le token dans Firestore pour cet utilisateur
    });

    PushNotifications.addListener('registrationError', (error) => {
      console.error('Error on registration: ' + JSON.stringify(error));
    });

    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Push received: ' + JSON.stringify(notification));
    });
  },

  /**
   * Envoie une notification locale ou push immédiate (pour la démo)
   */
  async sendLocalNotification(title: string, body: string) {
    console.log(`[Notification] ${title}: ${body}`);
    // Sur mobile on pourrait utiliser LocalNotifications de Capacitor
  },

  /**
   * Simule l'envoi d'un email via un service tiers (ex: Resend)
   */
  async sendEmail(to: string, subject: string, content: string) {
    console.log(`[Email Service] Tentative d'envoi à ${to}...`);
    console.log(`Sujet: ${subject}`);
    
    // Dans une implémentation réelle :
    /*
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Tracao <noreply@tracao.tg>',
        to: [to],
        subject: subject,
        html: content,
      }),
    });
    */
    
    return new Promise((resolve) => setTimeout(resolve, 1000));
  }
};
