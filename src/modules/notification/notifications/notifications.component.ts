import { Component, Input, OnInit } from '@angular/core';
import { Room } from 'src/modules/room/room.model';
import { AnyNotification } from '../notification.model';
import { NotificationQueries } from '../services/notification.queries';
import { NotificationService } from '../services/notification.service';
import { NotificationSocketService } from '../services/notification.socket.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.less']
})
export class NotificationsComponent implements OnInit {

  anyNotifications: AnyNotification[];

  constructor(
    private notificationQueries: NotificationQueries,
    private notificationService: NotificationService,
    private notificationsSocketService: NotificationSocketService,
  ) {
   }

  async ngOnInit() {
    this.anyNotifications = (await this.notificationQueries.getNotifications()); 
    console.log(this.anyNotifications);
    this.notificationsSocketService.onNewNotification(notification => {
      this.anyNotifications.push(notification);    
    });

    await this.notificationService.fetch();
  }

}
