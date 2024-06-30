import { Client as MassiveRealmClient } from 'massiverealm-client';

import { Level } from "./level";
import { Player } from "./player";

export class Network {
    client: MassiveRealmClient;

    // Flag to check if the user has joined the room
    joined = false;

    // Current player id
    playerId: string;

    constructor(private level: Level) {
        this.client = new MassiveRealmClient({
            // You will see the client's console logs in the browser.
            debug: true,

            // Project URL and Public Key you can get from the MassiveRealm Console
            url: '<project-url>',
            publicKey: '<project-public-key>',

            autoReconnect: true,
            autoReconnectMaxAttempts: 10,
            autoReconnectTimeout: 3000,

            onConnect: () => {
                console.log('Connected');
                this.client.joinRoom({
                    // Room alias as defined in the Console
                    alias: 'room',

                    // Room ID to group players in the same room
                    id: 'room-1',
                });
            },

            onReconnectTry: (retry) => {
                console.log('Trying to reconnect', retry);
            },

            onDisconnect: (error) => {
                this.joined = false;
                console.log('Disconnected', error);

                this.level.events.emit('onDisconnect');
            },

            onLeaveRoom: function() {
                this.joined = false;
            },

            onJoinRoom: (roomAlias, roomId, isForwarded) => {
                this.joined = true;
                this.level.events.emit('onJoinRoom');
            },

            onError: (error) => {
                console.log('Connection error', error);
            },

            onCommand: (command, data) => {
                console.log('Command received', command, data);

                // Add a new player to the scene or move if existing
                if (command === 'MyInfo') {
                    this.playerId = data.id;
                }
                // Remove player from the scene
                else if (command === 'DeletePlayer') {
                    this.level.events.emit('playerDelete', data.id);
                }
                // Add all players to the scene
                else if (command === 'UpdatePlayers') {
                    for (let i = 0; i < data.players.length; i++) {
                        // Skip the current player
                        if (data.players[i].id === this.playerId) continue;

                        this.level.events.emit(
                            'playerMove', {
                                id: data.players[i].id,
                                x: data.players[i].x,
                                y: data.players[i].y
                            }
                        );
                    }
                }
            },
        });

        window.addEventListener('beforeunload', () => {
            this.client.disconnect();
        });
    }

    connect() {
        this.client.connect();
    }

    updatePosition(player: Player) {
        if (!this.joined) return;

        this.client.emit('Update', {
            x: player.pos.x,
            y: player.pos.y
        });
    }
}
