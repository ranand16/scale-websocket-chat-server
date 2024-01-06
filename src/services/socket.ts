import { Server } from "socket.io";
import Redis from "ioredis";

const pub = new Redis({
    host: "redis-chat-app-ranand16-chat-app-ranand16.a.aivencloud.com",
    port: 28128,
    username: "default",
    password: "AVNS_lw5WO82JgaCAXrYaZCP",
    keepAlive: 1000,
    lazyConnect: true,
    maxRetriesPerRequest: null, // <-- this seems to prevent retries and allow for try/catch
});
const sub = new Redis({
    host: "redis-chat-app-ranand16-chat-app-ranand16.a.aivencloud.com",
    port: 28128,
    username: "default",
    password: "AVNS_lw5WO82JgaCAXrYaZCP",
    keepAlive: 1000,
    lazyConnect: true,
    maxRetriesPerRequest: null, // <-- this seems to prevent retries and allow for try/catch
});

class SocketService {
    private _io: Server;

    constructor() {
        console.log("Socket server...");
        this._io = new Server({
            cors: {
                allowedHeaders: ["*"],
                origin: "*",
            },
        });
        sub.subscribe("MESSAGES");
    }

    get io() {
        return this._io;
    }

    public initListeners() {
        console.log("Initialised socket listeners...");
        const io = this.io;
        io.on("connect", (socket) => {
            console.log("New socket connected.", socket.id);
            socket.on(
                "event:message",
                async ({ message }: { message: string }) => {
                    console.log("New msg received.", message);
                    // publish this message to redis or any db
                    await pub.publish(
                        "MESSAGES",
                        JSON.stringify({
                            message,
                            sender: socket.id,
                        })
                    );
                }
            );
            socket.on("disconnect", (reason) => {
                console.log(
                    "The connection for",
                    socket.id,
                    "was disconnected due to ",
                    reason
                );
            });
        });

        sub.on("message", (channel, message) => {
            if (channel === "MESSAGES") {
                console.log("Emitting message now ...", message);
                io.emit("message", message);
            }
        });
    }
}

export default SocketService;
