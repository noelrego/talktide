import { Component } from '@angular/core';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrl: './chat-box.component.css'
})
export class ChatBoxComponent {

  userName: string = 'User\'s Name';
  newMessage: string = '';

  // Example messages for demonstration
  messages = [
    {
      text: 'Hello! How are you doing today?',
      profileImage: 'https://via.placeholder.com/48x48',
      time: '10:01 AM',
      side: 'left'
    },
    {
      text: 'I\'m good, thank you! How about you?',
      profileImage: 'https://via.placeholder.com/48x48',
      time: '10:02 AM',
      side: 'right'
    },
    {
      text: 'I\'m doing well too, thanks for asking.',
      profileImage: 'https://via.placeholder.com/48x48',
      time: '10:03 AM',
      side: 'left'
    },
    {
      text: 'Hello! How are you doing today?',
      profileImage: 'https://via.placeholder.com/48x48',
      time: '10:01 AM',
      side: 'left'
    },
    {
      text: 'I\'m good, thank you! How about you?',
      profileImage: 'https://via.placeholder.com/48x48',
      time: '10:02 AM',
      side: 'right'
    },
    {
      text: 'I\'m doing well too, thanks for asking.',
      profileImage: 'https://via.placeholder.com/48x48',
      time: '10:03 AM',
      side: 'left'
    },
    {
      text: 'Hello! How are you doing today?',
      profileImage: 'https://via.placeholder.com/48x48',
      time: '10:01 AM',
      side: 'left'
    },
    {
      text: 'I\'m good, thank you! How about you?',
      profileImage: 'https://via.placeholder.com/48x48',
      time: '10:02 AM',
      side: 'right'
    },
    {
      text: 'I\'m doing well too, thanks for asking.',
      profileImage: 'https://via.placeholder.com/48x48',
      time: '10:03 AM',
      side: 'left'
    }
  ];

  sendMessage() {
    if (this.newMessage.trim()) {
      this.messages.push({
        text: this.newMessage,
        profileImage: 'https://via.placeholder.com/48x48', // Placeholder, replace with actual user's image
        time: new Date().toLocaleTimeString(),
        side: 'right'
      });
      this.newMessage = ''; // Clear input
    }
  }

}
