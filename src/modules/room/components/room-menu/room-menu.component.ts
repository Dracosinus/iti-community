import { isNgTemplate } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FeedStore } from 'src/modules/feed/feed.store';
import { Room } from '../../room.model';
import { RoomStore } from '../../room.store';
import { RoomQueries } from '../../services/room.queries';
import { RoomService } from '../../services/room.service';
import { RoomSocketService } from '../../services/room.socket.service';
@Component({
  selector: 'app-room-menu',
  templateUrl: './room-menu.component.html',
  styleUrls: ['./room-menu.component.less']
})
export class RoomMenuComponent implements OnInit {
  roomId$: Observable<string | undefined>;

  rooms: Room[];

  constructor(
    private router: Router,
    private feedStore: FeedStore,
    private queries: RoomQueries,
    private roomSocketService: RoomSocketService
  ) {
    this.roomId$ = feedStore.roomId$;
    this.rooms = [];
  }

  async ngOnInit() {
    this.rooms = await this.queries.getAll();
    let lastRoomId = localStorage.getItem('lastRoomId');
    let feedStoreId = this.feedStore.value.roomId;
    if (lastRoomId !== undefined) {
      this.router.navigate(["/app/"+lastRoomId]);
    } else if (feedStoreId !== undefined){
      localStorage.setItem('lastRoomId', feedStoreId);
      this.router.navigate(["/app/"+feedStoreId]);
    } else {
      this.goToRoom(this.rooms[0]);
    }
    this.roomSocketService.onNewRoom(async (room: Room)=>{
      this.rooms = await this.queries.getAll();
    });
  }

  goToRoom(room: Room) {
    localStorage.setItem('lastRoomId', room.id);
    this.router.navigate(["/app/"+room.id]);
  }
}
