import { Group } from 'src/group/entities/group.entity';
import { LiveUserRole } from 'src/live-user-role/entities/live-user-role.entity';
import { Liveroom } from 'src/liveroom/entities/liveroom.entity';
import { Meeting } from 'src/meeting/entities/meeting.entity';
import { Message } from 'src/message/entities/message.entity';
import { User } from 'src/user/entities/user.entity';

export const entities = [User, Group, Liveroom, Message, LiveUserRole, Meeting];
