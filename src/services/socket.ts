import { Server } from "socket.io";

class SocketService {
    private _io: Server;

    constructor() {
        console.log("socket server");
        this._io = new Server();
    }

    get io() {
        return this._io;
    }

    public initListeners() {
        console.log("Initialised socket listeners.");
        const io = this.io;
        io.on("connect", (socket) => {
            console.log("New socket connected: ", socket.id);
            socket.on(
                "event:message",
                async ({ message }: { message: string }) => {
                    console.log("New msg received: ", message);
                }
            );
        });
    }
}

export default SocketService;
