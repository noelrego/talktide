import { Component } from '@angular/core';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrl: './chat-box.component.css'
})
export class ChatBoxComponent {

  userName: string = 'User\'s Name';
  newMessage: string = '';
  showPreviewMessage: boolean = false;
  replayingToPreviewMsg: string = ''

  // Example messages for demonstration
  messages = [
    {
      msgId: 1,
      text: 'First Msg asiudaisu aisdiuasdu iausdiausgdiuasdas auisdiuagsdiasudliaa asiduagisudgasiudg',
      hasPreview: false,
      replayedBy: 'Noel',
      replayedContent: 'ok',
      replayedToMessageId: 10,
      time: '10:01 AM',
      side: 'left'
    },
    {
      msgId: 2,
      text: 'I\'m good, thank you! How about you?',
      hasPreview: false,
      replayedBy: 'Noel',
      replayedContent: 'ok',
      replayedToMessageId: 10,
      time: '10:02 AM',
      side: 'right'
    },
    {
      msgId: 3,
      text: 'I\'m doing well too, thanks for asking.',
      hasPreview: true,
      replayedBy: 'Noel',
      replayedContent: 'ok',
      replayedToMessageId: 10,
      time: '10:03 AM',
      side: 'left'
    },
    {
      msgId: 4,
      text: 'Hello! How are you doing today?',
      hasPreview: false,
      replayedBy: 'Noel',
      replayedContent: 'ok',
      replayedToMessageId: 10,
      time: '10:01 AM',
      side: 'left'
    },
    {
      msgId: 5,
      text: 'I\'m good, thank you! How about you?',
      hasPreview: false,
      replayedBy: 'Noel',
      replayedContent: 'ok',
      replayedToMessageId: 10,
      time: '10:02 AM',
      side: 'right'
    },
    {
      msgId: 6,
      text: 'I\'m doing well too, thanks for asking.',
      hasPreview: true,
      replayedBy: 'Noel',
      replayedContent: 'ok',
      replayedToMessageId: 10,
      time: '10:03 AM',
      side: 'left'
    },
    {
      msgId: 17,
      text: 'Hello! How are you doing today?',
      hasPreview: false,
      replayedBy: 'Noel',
      replayedContent: 'ok',
      replayedToMessageId: 10,
      time: '10:01 AM',
      side: 'left'
    },
    {
      msgId: 8,
      text: 'I\'m good, thank you! How about you? asiauhsiuahsiuhdaisuhdiuhahsu',
      hasPreview: true,
      replayedBy: 'Noel',
      replayedContent: 'Blah Blah',
      replayedToMessageId: 10,
      time: '10:02 AM',
      side: 'right'
    },
    {
      msgId: 9,
      text: 'Last Msg',
      hasPreview: true,
      replayedBy: 'Noel',
      replayedContent: 'ok',
      replayedToMessageId: 10,
      time: '10:03 AM',
      side: 'left'
    }
  ];

  sendMessage() {
    if (this.newMessage.trim()) {
      this.messages.push({
        msgId: 1,
        text: this.newMessage,
        hasPreview: false,
        replayedBy: 'Noel',
        replayedContent: 'Some msg',
        replayedToMessageId: 13,
        time: new Date().toLocaleTimeString(),
        side: 'right'
      });
      this.newMessage = ''; // Clear input
    }
  }

  clickReplayMessage(msgId: number, msg: string) {
    console.log('Clicked Replay', msgId, msg);
    this.showPreviewMessage = true;
    this.replayingToPreviewMsg = msg.slice(0, 40) + ' . . .';
  }

  closePreview() {
    this.showPreviewMessage = false;
    this.replayingToPreviewMsg = '';
  }

}
